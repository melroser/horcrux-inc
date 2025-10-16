// app/docs/page.tsx
import Link from "next/link";

export default function Docs() {
  return (
    <main className="min-h-screen bg-black text-green-400 px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Horcrux Docs</h1>
        <p className="opacity-80">
          Explore the API docs for the Horcrux MCP server.
        </p>
        <div className="flex gap-4">
          <a className="px-5 py-3 rounded-md border border-green-500/30 bg-green-500/10 hover:bg-green-500/20"
             href="https://mcp.horcrux.inc/docs" target="_blank" rel="noreferrer">
            Swagger UI (/docs)
          </a>
          <a className="px-5 py-3 rounded-md border border-green-500/30 bg-green-500/10 hover:bg-green-500/20"
             href="https://mcp.horcrux.inc/redoc" target="_blank" rel="noreferrer">
            ReDoc (/redoc)
          </a>
        </div>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Quick test</h2>
          <pre className="bg-green-500/5 border border-green-500/20 p-4 rounded">
curl -s https://mcp.horcrux.inc/mcp/tools | jq .
curl -s -X POST -H "Content-Type: application/json" -d '{{}}' \{"\n"}
  https://mcp.horcrux.inc/mcp/call/get_horcrux | jq .
          </pre>
        </section>
        <p className="text-sm opacity-70">
          Tip: use Next.js <code>&lt;Link&gt;</code> for internal routes. External links can be plain <code>&lt;a&gt;</code>.
        </p>
        <p className="text-xs opacity-50">
          Docs are provided by FastAPI’s built-ins at /docs (Swagger UI) and /redoc.
        </p>
      </div>
    </main>
  );
}
