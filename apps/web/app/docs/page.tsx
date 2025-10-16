// apps/web/app/docs/page.tsx
export const metadata = {
  title: "Horcrux — Project Docs",
  description: "What Horcrux is, how it works, and how to integrate it.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="opacity-90 leading-relaxed">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 rounded-md border border-green-500/20 bg-green-500/5 p-4 overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
  );
}

const curlTools = `curl -s https://mcp.horcrux.inc/mcp/tools | jq .`;
const curlGet = `curl -s -X POST -H "Content-Type: application/json" -d '{}' \\
  https://mcp.horcrux.inc/mcp/call/get_horcrux | jq .`;

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-black text-green-400 px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold tracking-tight">Horcrux Docs</h1>

        <Section title="What is Horcrux?">
          <p>
            Horcrux is your persistent personal context—portable memory your agents can query. Your data lives
            as a single <strong>Horcrux JSON</strong> (aka a <em>crux</em>) that tools and agents can read.
          </p>
        </Section>

        <Section title="Architecture (quick)">
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Web</strong> — This site (Next.js 15) with landing + docs.</li>
            <li><strong>MCP</strong> — HTTP server exposing tools <code>get_horcrux</code> and <code>search_horcrux</code>.</li>
            <li><strong>Horcrux JSON</strong> — Public file at <code>https://horcrux.inc/rob_horcrux.json</code>.</li>
          </ul>
        </Section>

        <Section title="MCP Integration (for engineers)">
          <p>
            The MCP server advertises tools at <code>/mcp/tools</code> and accepts calls at
            <code> /mcp/call/&lt;tool_name&gt;</code>. Interactive API docs live on the MCP subdomain.
          </p>
          <div className="flex gap-2 flex-col">
            <Code>{curlTools}</Code>
            <Code>{curlGet}</Code>
          </div>
          <p className="text-sm opacity-70">
            API docs: <a className="underline" href="https://mcp.horcrux.inc/docs" target="_blank" rel="noreferrer">Swagger UI</a> ·{" "}
            <a className="underline" href="https://mcp.horcrux.inc/redoc" target="_blank" rel="noreferrer">ReDoc</a>
          </p>
        </Section>

        <Section title="Roadmap">
          <ul className="list-disc ml-6 space-y-1">
            <li>Private layer + bearer auth for MCP.</li>
            <li>Multiple horcruxes per user (Free: 1 · Pro: 7).</li>
            <li>Importers: Raycast, Granola transcripts, GitHub issues.</li>
          </ul>
        </Section>

        <Section title="Notes">
          <p>
            This page is a server component in the Next.js App Router (the folder-based router). Add client
            hooks only inside <code>'use client'</code> components.
          </p>
        </Section>
      </div>
    </main>
  );
}
