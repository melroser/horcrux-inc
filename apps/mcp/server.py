from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Dict, Any, List

app = FastAPI(
    title="Horcrux MCP Server",
    description="Model Context Protocol server for Horcrux shards",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SHARD_URL = os.getenv("SHARD_URL", "https://horcrux.inc/rob_shard.json")

class MCPTool(BaseModel):
    name: str
    description: str
    inputSchema: Dict[str, Any]

class MCPCallRequest(BaseModel):
    name: str
    arguments: Dict[str, Any] = {}

@app.get("/mcp/tools")
async def list_tools() -> List[MCPTool]:
    """List available MCP tools"""
    return [
        MCPTool(
            name="get_horcrux",
            description="Retrieve the complete Horcrux shard data",
            inputSchema={
                "type": "object",
                "properties": {},
                "required": []
            }
        ),
        MCPTool(
            name="search_horcrux",
            description="Search within the Horcrux shard data",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    },
                    "section": {
                        "type": "string",
                        "description": "Specific section to search (skills, projects, interviews)",
                        "enum": ["skills", "projects", "interviews", "all"]
                    }
                },
                "required": ["query"]
            }
        )
    ]

@app.post("/mcp/call")
async def call_tool(request: MCPCallRequest):
    """Execute an MCP tool call"""
    if request.name == "get_horcrux":
        return await get_shard_data()
    elif request.name == "search_horcrux":
        query = request.arguments.get("query", "")
        section = request.arguments.get("section", "all")
        return await search_shard_data(query, section)
    else:
        raise HTTPException(status_code=404, detail=f"Tool {request.name} not found")

async def get_shard_data():
    """Fetch the complete shard data"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(SHARD_URL)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch shard: {str(e)}")

async def search_shard_data(query: str, section: str = "all"):
    """Search within shard data"""
    shard = await get_shard_data()
    results = []
    
    query_lower = query.lower()
    
    if section in ["all", "skills"]:
        # Search skills
        for skill_type, skills in shard.get("skills", {}).items():
            for skill in skills:
                if query_lower in skill.lower():
                    results.append({
                        "type": "skill",
                        "category": skill_type,
                        "value": skill
                    })
    
    if section in ["all", "projects"]:
        # Search projects
        for project in shard.get("projects", []):
            if (query_lower in project.get("name", "").lower() or 
                query_lower in project.get("description", "").lower() or
                any(query_lower in tech.lower() for tech in project.get("stack", []))):
                results.append({
                    "type": "project",
                    "value": project
                })
    
    if section in ["all", "interviews"]:
        # Search interviews
        for interview in shard.get("interviews", []):
            if (query_lower in interview.get("company", "").lower() or
                query_lower in interview.get("role", "").lower() or
                query_lower in interview.get("feedback", "").lower()):
                results.append({
                    "type": "interview",
                    "value": interview
                })
    
    return {
        "query": query,
        "section": section,
        "results": results,
        "count": len(results)
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "shard_url": SHARD_URL}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
