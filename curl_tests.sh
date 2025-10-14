# Static corpus from Netlify
curl https://horcrux.inc/rob_corpus.json | jq

# MCP discovery on Render
curl https://mcp.horcrux.inc/mcp/tools | jq

# MCP calls
curl -X POST https://mcp.horcrux.inc/mcp/call/get_horcrux | jq
curl -X POST https://mcp.horcrux.inc/mcp/call/search_horcrux  -H "Content-Type: application/json" -d '{"q":"Next.js"}' | jq
