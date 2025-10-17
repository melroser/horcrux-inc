import os
import json
from typing import Any, Dict, List

import httpx
from fastapi import FastAPI
from fastmcp import FastMCP

APP_NAME = "Horcrux MCP"
HORCRUX_URL = os.environ.get("HORCRUX_URL", "")

mcp = FastMCP(name=APP_NAME)

async def load_horcrux() -> Dict[str, Any]:
    if HORCRUX_URL:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(HORCRUX_URL)
            resp.raise_for_status()
            return resp.json()
    path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "rob_horcrux.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@mcp.tool
async def get_horcrux() -> Dict[str, Any]:
    return {"content": await load_horcrux()}

def _search(node: Any, q: str, path: str = "corpus") -> List[Dict[str, str]]:
    results = []
    if isinstance(node, dict):
        for k, v in node.items():
            results.extend(_search(v, q, f"{path}.{k}"))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            results.extend(_search(v, q, f"{path}[{i}]"))
    else:
        s = str(node)
        if q.lower() in s.lower():
            results.append({"path": path, "snippet": s[:200]})
    return results

@mcp.tool
async def search_horcrux(q: str) -> Dict[str, Any]:
    data = await load_horcrux()
    return {"results": _search(data, q)}

# Build the MCP sub‑app (internal / endpoint)
mcp_app = mcp.http_app(path="/")

# IMPORTANT: pass the MCP app’s lifespan into FastAPI
app = FastAPI(title=APP_NAME, lifespan=mcp_app.lifespan)
app.mount("/mcp", mcp_app)

# Optional health endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}
