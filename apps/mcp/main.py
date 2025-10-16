import os
import json
from typing import Any, Dict, List

import httpx
from fastapi import FastAPI
from fastmcp import FastMCP

APP_NAME = "Horcrux MCP"
HORCRUX_URL = os.getenv("HORCRUX_URL", "")

# Create the MCP server (no description arg in current API)
mcp = FastMCP(name=APP_NAME)

async def load_horcrux() -> Dict[str, Any]:
    """Load the Horcrux JSON from HORCRUX_URL (HTTP) or local fallback."""
    if HORCRUX_URL:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(HORCRUX_URL)
            r.raise_for_status()
            return r.json()
    # fallback: local file inside the repo
    path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "rob_horcrux.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@mcp.tool
async def get_horcrux() -> Dict[str, Any]:
    """Return the entire Horcrux JSON."""
    return {"content": await load_horcrux()}

def _search(obj: Any, needle: str, path: str = "corpus") -> List[Dict[str, str]]:
    """Depth‑first search for case‑insensitive substring; returns path and snippet."""
    results: List[Dict[str, str]] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            results.extend(_search(v, needle, f"{path}.{k}"))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            results.extend(_search(v, needle, f"{path}[{i}]"))
    else:
        s = str(obj)
        if needle.lower() in s.lower():
            results.append({"path": path, "snippet": s[:200]})
    return results

@mcp.tool
async def search_horcrux(q: str) -> Dict[str, Any]:
    """Search the Horcrux JSON for a keyword (case‑insensitive)."""
    data = await load_horcrux()
    return {"results": _search(data, q)}

# Aliases ChatGPT likes (not strictly required but useful)
@mcp.tool(name="search")
async def alias_search(q: str) -> Dict[str, Any]:
    return await search_horcrux(q=q)

@mcp.tool(name="fetch")
async def fetch_path(path: str) -> Dict[str, Any]:
    """Fetch a value by dotted/indexed path (e.g. corpus.projects[0].name)."""
    data = await load_horcrux()
    import re
    cur: Any = data
    # simple dotted‑path parser
    for token in re.finditer(r"\.?([a-zA-Z0-9_]+)|\[(\d+)\]", path):
        key, idx = token.group(1), token.group(2)
        if key:
            cur = cur[key]
        elif idx:
            cur = cur[int(idx)]
    return {"value": cur}

# Build the MCP ASGI app; path="/" inside the sub‑app
mcp_app = mcp.http_app(path="/")

# Expose FastAPI app and mount the MCP handler at /mcp
app = FastAPI(title=APP_NAME, version="1.0")
app.mount("/mcp", mcp_app)

@app.get("/health")
async def health():
    return {"ok": True}
