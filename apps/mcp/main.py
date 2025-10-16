# apps/mcp/main.py
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Tuple

from fastapi import FastAPI
from fastmcp import FastMCP
from starlette.requests import Request
from starlette.responses import JSONResponse, PlainTextResponse

APP_NAME = "Horcrux MCP"
APP_VERSION = "2025.10.16"

# Resolve where your Horcrux JSON lives.
# Override with HORCRUX_JSON if you want a different path at deploy time.
DEFAULT_DATA = Path(__file__).resolve().parents[2] / "data" / "rob_horcrux.json"
HORCRUX_PATH = Path(os.getenv("HORCRUX_JSON", str(DEFAULT_DATA)))

# -----------------------
# Load data once at boot
# -----------------------
def load_horcrux() -> Dict[str, Any]:
    if not HORCRUX_PATH.exists():
        return {"error": f"Horcrux JSON not found at {HORCRUX_PATH}"}
    with HORCRUX_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)

HORCRUX = load_horcrux()

# -----------------------
# FastMCP server & tools
# -----------------------
mcp = FastMCP(name=APP_NAME)

@mcp.tool()
def get_horcrux() -> Dict[str, Any]:
    """Return the full Horcrux JSON."""
    return HORCRUX

def _walk(node: Any, path: str = "root") -> List[Tuple[str, str]]:
    """Yield (path, string_value) pairs for simple keyword scan."""
    out: List[Tuple[str, str]] = []
    if isinstance(node, dict):
        for k, v in node.items():
            out.extend(_walk(v, f"{path}.{k}"))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            out.extend(_walk(v, f"{path}[{i}]"))
    else:
        # Only match against strings and simple scalars
        if isinstance(node, (str, int, float, bool)) and node is not None:
            out.append((path, str(node)))
    return out

@mcp.tool()
def search_horcrux(q: str) -> List[Dict[str, str]]:
    """Keyword search over the Horcrux JSON. Returns matching paths/snippets."""
    q_lower = q.lower().strip()
    if not q_lower:
        return []
    results: List[Dict[str, str]] = []
    for p, text in _walk(HORCRUX, "corpus"):
        if q_lower in text.lower():
            results.append({"path": p, "snippet": text})
            if len(results) >= 50:
                break
    return results

# -----------------------
# ASGI app (Streamable HTTP)
# - The FastMCP app exposes /mcp (JSON-RPC over Streamable HTTP)
#   so mount it at "/" to make the final URL {host}/mcp
# -----------------------
mcp_app = mcp.http_app(path="/mcp")  # inner app serves /mcp
app = FastAPI(lifespan=mcp_app.lifespan)
app.mount("/", mcp_app)

# Optional: add a simple health route
@mcp.custom_route("/health", methods=["GET"])
async def health(_: Request) -> PlainTextResponse:
    return PlainTextResponse("ok")

# Optional: tiny info endpoint (handy in a browser)
@mcp.custom_route("/", methods=["GET"])
async def root(_: Request) -> JSONResponse:
    return JSONResponse({"name": APP_NAME, "version": APP_VERSION, "mcp_endpoint": "/mcp"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("apps.mcp.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
