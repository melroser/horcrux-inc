# Horcrux: Load Your Personal Context in ChatGPT

This guide shows anyone (recruiters, teammates, you on a new laptop) how to load Rob’s Horcrux into ChatGPT using an MCP connector.

> **What is it?**  
> A small HTTP service exposing two tools:
> - `get_horcrux` → returns the full JSON
> - `search_horcrux` → keyword search with path + snippet

- **MCP base URL:** `https://mcp.horcrux.inc/mcp`
- **Public JSON (marketing site):** `https://horcrux.inc/rob_horcrux.json`

---

## 1) Load the Horcrux into ChatGPT (MCP)

### A. Enable developer tools
1. Open ChatGPT (web).
2. Go to **Settings → Connectors → Advanced**.
3. Turn on **Developer mode**.

### B. Create the connector
1. **Settings → Connectors → Create**.
2. Name: **Horcrux**  
   Description: *Persistent personal context. Tools: `get_horcrux`, `search_horcrux`.*
3. **Connector URL:** `https://mcp.horcrux.inc/mcp`
4. Save. You should see both tools in the preview.

### C. Turn it on in a chat
1. Start a new chat.
2. Click the **+ Tools** button (near the composer).
3. Toggle **Horcrux** on.

### D. First message to the model
Paste this:

> Use the **Horcrux** connector as primary context.  
> 1) Call `get_horcrux` once and keep the result in working memory.  
> 2) For questions about my background/projects/interviews, call `search_horcrux` first and cite `path` + `snippet`.  
> 3) If results look stale, call `get_horcrux` again.

---

## 2) Verify it works (cURL)

```bash
# List tools
curl -s https://mcp.horcrux.inc/mcp/tools | jq .

# Fetch the Horcrux
curl -s -X POST -H "Content-Type: application/json" -d '{}' \
  https://mcp.horcrux.inc/mcp/call/get_horcrux | jq '.content.meta, (.content.projects // .content.entries)'

# Search for something specific
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"q":"ResQ"}' https://mcp.horcrux.inc/mcp/call/search_horcrux | jq .
