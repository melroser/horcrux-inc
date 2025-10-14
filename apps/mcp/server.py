from fastapi import FastAPI, Request
import httpx, os

app = FastAPI()
HORCRUX_URL = os.getenv("HORCRUX_URL", "https://horcrux.inc/rob_corpus.json")

@app.get("/mcp/tools")
def tools():
    return {"tools": [
        {"name":"get_horcrux","description":"Return public Horcrux JSON","input_schema":{"type":"object","properties":{}}},
        {"name":"search_horcrux","description":"Keyword search over Horcrux fields","input_schema":{"type":"object","properties":{"q":{"type":"string"}},"required":["q"]}}
    ]}

@app.post("/mcp/call/get_horcrux")
async def get_horcrux():
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(HORCRUX_URL); r.raise_for_status()
        return {"content": r.json()}

@app.post("/mcp/call/search_horcrux")
async def search_horcrux(req: Request):
    q = ((await req.json()) or {}).get("q","").lower()
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(HORCRUX_URL); r.raise_for_status()
        corpus = r.json()
    hits=[]
    def scan(path,val):
        if isinstance(val,str) and q in val.lower(): hits.append({"path":path,"snippet":val})
        elif isinstance(val,list):
            for i,v in enumerate(val): scan(f"{path}[{i}]",v)
        elif isinstance(val,dict):
            for k,v in val.items(): scan(f"{path}.{k}",v)
    if q: scan("corpus",corpus)
    return {"results": hits[:50]}
