# main.py
import os
import time
import asyncio
from typing import Any, Dict, List, Optional, Tuple

import httpx
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic_settings import BaseSettings
from pydantic import AnyUrl  # v2 URL types

# -----------------------------
# Settings
# -----------------------------
class Settings(BaseSettings):
    HORCRUX_URL: AnyUrl = "https://horcrux.inc/rob_shard.json"
    ALLOW_ORIGINS: str = "*"          # CSV list of allowed origins (for browsers). Default "*"
    API_TOKEN: Optional[str] = None   # Optional bearer token to protect endpoints
    FETCH_TIMEOUT: float = 5.0        # seconds
    RETRY_MS: int = 250               # milliseconds between retries
    MAX_RETRIES: int = 3

settings = Settings()

# -----------------------------
# App & CORS
# -----------------------------
app = FastAPI(title="Horcrux MCP Server", version="1.2.0")

allow_origins = (
    ["*"] if settings.ALLOW_ORIGINS.strip() == "*"
    else [o.strip() for o in settings.ALLOW_ORIGINS.split(",") if o.strip()]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Optional bearer auth
# -----------------------------
def auth(authorization: Optional[str] = Header(None)) -> None:
    if settings.API_TOKEN:
        if not authorization or authorization != f"Bearer {settings.API_TOKEN}":
            raise HTTPException(status_code=401, detail="Unauthorized")

# -----------------------------
# Cached fetch of the Horcrux JSON (ETag/Last-Modified)
# -----------------------------
_cache: Dict[str, Any] = {"data": None, "etag": None, "lm": None, "ts": 0.0}
_cache_lock = asyncio.Lock()

async def fetch_crux() -> Dict[str, Any]:
    """
    Fetch the HORCRUX_URL with basic caching.
    Uses ETag/If-None-Match and Last-Modified/If-Modified-Since when available.
    Falls back to last good copy on transient errors.
    """
    headers = {}
    if _cache["etag"]:
        headers["If-None-Match"] = _cache["etag"]
    if _cache["lm"]:
        headers["If-Modified-Since"] = _cache["lm"]

    async with _cache_lock:
        async with httpx.AsyncClient(timeout=settings.FETCH_TIMEOUT) as client:
            for attempt in range(settings.MAX_RETRIES):
                try:
                    r = await client.get(str(settings.HORCRUX_URL), headers=headers)
                    if r.status_code == 304 and _cache["data"] is not None:
                        return _cache["data"]
                    r.raise_for_status()
                    data = r.json()
                    _cache.update({
                        "data": data,
                        "etag": r.headers.get("etag"),
                        "lm": r.headers.get("last-modified"),
                        "ts": time.time(),
                    })
                    return data
                except Exception:
                    # On last attempt, return stale (if any) or raise
                    if attempt == settings.MAX_RETRIES - 1:
                        if _cache["data"] is not None:
                            return _cache["data"]
                        raise
                    await asyncio.sleep(settings.RETRY_MS / 1000)

# Warm the cache on startup (non-blocking)
@app.on_event("startup")
async def _warm() -> None:
    try:
        await fetch_crux()
    except Exception:
        # Don't crash startup if upstream is temporarily down
        pass

# -----------------------------
# Root & health
# -----------------------------
@app.get("/", include_in_schema=False)
def root():
    # Nice UX when you visit the root in a browser
    return RedirectResponse(url="/mcp/tools")

@app.get("/healthz", include_in_schema=False)
def healthz():
    return {
        "status": "ok",
        "horcrux_url": str(settings.HORCRUX_URL),
        "cached": _cache["data"] is not None,
        "last_fetch_epoch": _cache["ts"],
    }

# -----------------------------
# MCP: tools manifest
# -----------------------------
@app.get("/mcp/tools")
def mcp_tools():
    return {
        "tools": [
            {
                "name": "get_horcrux",
                "description": "Return the public shard JSON",
                "input_schema": {
                    "type": "object",
                    "properties": {},
                },
            },
            {
                "name": "search_horcrux",
                "description": "Keyword search over the shard JSON",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "q": {
                            "type": "string",
                            "description": "Search query (alias: query)",
                        },
                        "query": {
                            "type": "string",
                            "description": "Alias of 'q' (optional)",
                        },
                        "section": {
                            "type": "string",
                            "enum": ["skills", "projects", "interviews", "all"],
                            "description": "Limit search to a section (default: all)",
                        },
                        "limit": {
                            "type": "number",
                            "description": "Max results (default 8)",
                        },
                    },
                    "required": ["q"],
                },
            },
        ]
    }

# -----------------------------
# MCP: call endpoints
# -----------------------------
@app.post("/mcp/call/get_horcrux")
async def mcp_call_get_horcrux(_: None = Depends(auth)):
    data = await fetch_crux()
    # Keep response shape same as your working version
    return {"content": data}

@app.post("/mcp/call/search_horcrux")
async def mcp_call_search_horcrux(body: Dict[str, Any], _: None = Depends(auth)):
    q, section, limit = _normalize_search_args(body or {})
    if not q:
        raise HTTPException(status_code=400, detail="Missing 'q' or 'query'")
    data = await fetch_crux()
    return _search(data, q=q, section=section, limit=limit)

# -----------------------------
# Helpers: arguments & search
# -----------------------------
SECTIONS = {"skills", "projects", "interviews", "all"}

def _normalize_search_args(arguments: Dict[str, Any]) -> Tuple[str, str, int]:
    q = (arguments.get("q") or arguments.get("query") or "").strip()
    section = (arguments.get("section") or "all").lower()
    limit = int(arguments.get("limit") or 8)
    if section not in SECTIONS:
        section = "all"
    if limit <= 0:
        limit = 8
    return q, section, limit

def _walk_collect(node: Any, path: str, q_lower: str, out: List[Dict[str, Any]]) -> None:
    if isinstance(node, dict):
        for k, v in node.items():
            _walk_collect(v, f"{path}.{k}", q_lower, out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            _walk_collect(v, f"{path}[{i}]", q_lower, out)
    else:
        s = str(node)
        if q_lower in s.lower():
            # crude snippet around first occurrence
            idx = s.lower().find(q_lower)
            start = max(0, idx - 40) if idx != -1 else 0
            snippet = s[start:start + 160]
            out.append({"path": path, "snippet": snippet})

def _section_typed_hits(data: Dict[str, Any], q_lower: str, section: str) -> List[Dict[str, Any]]:
    typed: List[Dict[str, Any]] = []

    if section in ("all", "skills"):
        skills = data.get("skills") or {}
        for cat, items in skills.items():
            if isinstance(items, list):
                for s in items:
                    if q_lower in str(s).lower():
                        typed.append({"type": "skill", "category": cat, "value": s})

    if section in ("all", "projects"):
        for proj in data.get("projects", []):
            blob = " ".join([
                " ".join(proj.get("stack", []) or []),
                proj.get("description", "") or "",
                " ".join(proj.get("highlights", []) or []),
                proj.get("name", "") or "",
            ]).lower()
            if q_lower in blob:
                typed.append({"type": "project", "value": proj})

    if section in ("all", "interviews"):
        for iv in data.get("interviews", []):
            blob = " ".join([
                iv.get("company", "") or "",
                iv.get("role", "") or "",
                iv.get("feedback", "") or "",
                " ".join(iv.get("topics", []) or []),
            ]).lower()
            if q_lower in blob:
                typed.append({"type": "interview", "value": iv})

    return typed

def _search(data_wrapper: Dict[str, Any], q: str, section: str, limit: int) -> Dict[str, Any]:
    """
    data_wrapper is the top-level JSON returned by your Horcrux URL,
    which (per your sample) has a 'content' key holding the corpus.
    """
    # Handle both shapes gracefully (some older files may already be raw)
    corpus = data_wrapper.get("content", data_wrapper)

    q_lower = q.lower()
    # 1) Path/snippet results (your original format)
    pathy: List[Dict[str, Any]] = []
    _walk_collect(corpus, "corpus", q_lower, pathy)
    if len(pathy) > limit:
        pathy = pathy[:limit]

    # 2) Typed results (skills/projects/interviews)
    typed = _section_typed_hits(corpus, q_lower, section)
    if len(typed) > limit:
        typed = typed[:limit]

    return {
        "query": q,
        "section": section,
        "results": pathy,
        "typed": typed,
        "count": len(pathy),
        "typed_count": len(typed),
    }

# -----------------------------
# Local dev entrypoint
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
