from fastapi import FastAPI, Request
import httpx, os

app = FastAPI()
SHARD_URL = os.getenv("SHARD_URL", "https://horcrux.inc/rob_shard.json")

@app.get("/mcp/tools")
def list_tools():
    return {"tools": [
        {
          "name": "get_horcrux",
          "description": "Return the public shard JSON",
          "input_schema": {"type": "object", "properties": {}}
        },
        {
          "name": "search_horcrux",
          "description": "Keyword search over the shard JSON",
          "input_schema": {
            "type": "object",
            "properties": {"q": {"type": "string"}},
            "required": ["q"]
          }
        }
    ]}

@app.post("/mcp/call/get_horcrux")
async def get_horcrux():
    async with httpx.AsyncClient(timeout=10) as c:
        resp = await c.get(SHARD_URL)
        resp.raise_for_status()
        return {"content": resp.json()}

@app.post("/mcp/call/search_horcrux")
async def search_horcrux(request: Request):
    payload = await request.json()
    query = (payload or {}).get("q", "").lower()
    async with httpx.AsyncClient(timeout=10) as c:
        resp = await c.get(SHARD_URL)
        resp.raise_for_status()
        corpus = resp.json()

    results = []
    def scan(path, val):
        if isinstance(val, str) and query in val.lower():
            results.append({"path": path, "snippet": val})
        elif isinstance(val, list):
            for i, v in enumerate(val):
                scan(f"{path}[{i}]", v)
        elif isinstance(val, dict):
            for k, v in val.items():
                scan(f"{path}.{k}", v)

    if query:
        scan("corpus", corpus)
    return {"results": results[:50]}
