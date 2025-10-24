"use client";

import { useEffect, useState } from "react";

type Horcrux = Record<string, any>;

export default function HorcruxPage() {
  const [data, setData] = useState<Horcrux | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Prefer MCP if NEXT_PUBLIC_HORCRUX_MCP_BASE is set; else use the static file.
  const MCP_BASE = process.env.NEXT_PUBLIC_HORCRUX_MCP_BASE?.trim();
  const FILE_URL = "/rob_horcrux.json";

  useEffect(() => {
    const fetchFromMcp = async () => {
      if (!MCP_BASE) throw new Error("NO_MCP_BASE");
      const res = await fetch(`${MCP_BASE.replace(/\/+$/, "")}/mcp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "get",
          method: "tools/call",
          params: { name: "get_horcrux", arguments: {} },
        }),
      });
      if (!res.ok) throw new Error(`MCP HTTP ${res.status}`);
      const body = await res.json();
      // FastMCP returns {"content": {...}} when hitting REST; JSON-RPC returns result.content
      const payload = body?.result?.content ?? body?.content ?? body;
      if (!payload) throw new Error("MCP_EMPTY");
      return payload;
    };

    const fetchFromFile = async () => {
      const r = await fetch(FILE_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(`FILE HTTP ${r.status}`);
      return r.json();
    };

    (async () => {
      try {
        const payload = MCP_BASE ? await fetchFromMcp() : await fetchFromFile();
        setData(payload);
      } catch (e: any) {
        // Fallback: try file if MCP failed
        try {
          const payload = await fetchFromFile();
          setData(payload);
        } catch (e2: any) {
          setErr(e2?.message || e?.message || "Unknown error");
        }
      }
    })();
  }, [MCP_BASE]);

  if (err) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-6">
        <h1 className="text-2xl font-bold mb-2">Horcrux</h1>
        <p className="text-red-400">Failed to load: {err}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-6">
        <h1 className="text-2xl font-bold mb-2">Horcrux</h1>
        <p>Loading…</p>
      </div>
    );
  }

  const root = data.meta ? data : data.content || data;

  const Meta = () => {
    const meta = root.meta || {};
    const contact = meta.contact || {};
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Meta</h2>
        <div className="space-y-1 text-green-300">
          {meta.name && <div><span className="text-green-500">Name:</span> {meta.name}</div>}
          {meta.title && <div><span className="text-green-500">Title:</span> {meta.title}</div>}
          {meta.location && <div><span className="text-green-500">Location:</span> {meta.location}</div>}
          {meta.updated && <div><span className="text-green-500">Updated:</span> {meta.updated}</div>}
          {meta.version && <div><span className="text-green-500">Version:</span> {meta.version}</div>}
          {(contact.linkedin || contact.github) && (
            <div className="flex gap-4">
              {contact.linkedin && <a className="underline" href={`https://${String(contact.linkedin).replace(/^https?:\/\//,'')}`} target="_blank">LinkedIn</a>}
              {contact.github && <a className="underline" href={`https://${String(contact.github).replace(/^https?:\/\//,'')}`} target="_blank">GitHub</a>}
            </div>
          )}
        </div>
      </section>
    );
  };

  const Skills = () => {
    const skills = root.skills;
    if (!skills) return null;
    const BadgeList = ({ title, arr }: { title: string; arr?: string[] }) =>
      arr?.length ? (
        <div className="mb-3">
          <div className="text-green-500 mb-1">{title}</div>
          <div className="flex flex-wrap gap-2">
            {arr.map((s) => (
              <span key={s} className="px-2 py-1 rounded-full bg-green-900/40 border border-green-700 text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null;

    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <BadgeList title="Primary" arr={skills.primary} />
        <BadgeList title="Secondary" arr={skills.secondary} />
        <BadgeList title="Learning" arr={skills.learning} />
        <BadgeList title="Domains" arr={skills.domains} />
      </section>
    );
  };

  const Projects = () => {
    const projects = root.projects;
    if (!Array.isArray(projects) || !projects.length) return null;
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p: any, i: number) => (
            <div key={i} className="rounded-2xl border border-green-800 p-4 bg-green-950/20">
              <div className="text-lg font-semibold">{p.name}</div>
              {p.status && <div className="text-xs uppercase tracking-widest text-green-500 mb-2">{p.status}</div>}
              {p.description && <p className="text-green-300 mb-2">{p.description}</p>}
              {Array.isArray(p.stack) && p.stack.length > 0 && (
                <div className="text-sm text-green-400 mb-2">Stack: {p.stack.join(", ")}</div>
              )}
              {Array.isArray(p.highlights) && p.highlights.length > 0 && (
                <ul className="list-disc list-inside text-green-300">
                  {p.highlights.map((h: string) => <li key={h}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const Interviews = () => {
    const interviews = root.interviews;
    if (!Array.isArray(interviews) || !interviews.length) return null;
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Interviews</h2>
        <div className="space-y-4">
          {interviews.map((iv: any, i: number) => (
            <div key={i} className="rounded-2xl border border-green-800 p-4 bg-green-950/20">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold">{iv.company}</div>
                {iv.role && <span className="text-green-400">· {iv.role}</span>}
                {iv.stage && <span className="text-green-500">· {iv.stage}</span>}
                {iv.date && <span className="text-green-500/70">· {iv.date}</span>}
              </div>
              {iv.feedback && <p className="text-green-300 mt-2">{iv.feedback}</p>}
              {Array.isArray(iv.topics) && iv.topics.length > 0 && (
                <div className="mt-2 text-sm text-green-400">Topics: {iv.topics.join(", ")}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const Learning = () => {
    const goals = root.learning_goals;
    if (!Array.isArray(goals) || !goals.length) return null;
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Learning Goals</h2>
        <ul className="list-disc list-inside text-green-300">
          {goals.map((g: string) => <li key={g}>{g}</li>)}
        </ul>
      </section>
    );
  };

  const Availability = () => {
    const avail = root.availability;
    if (!avail) return null;
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Availability</h2>
        <div className="space-y-1 text-green-300">
          {avail.status && <div><span className="text-green-500">Status:</span> {avail.status}</div>}
          {avail.target_start && <div><span className="text-green-500">Target Start:</span> {avail.target_start}</div>}
          {avail.location_preference && <div><span className="text-green-500">Preference:</span> {avail.location_preference}</div>}
          {Array.isArray(avail.role_types) && avail.role_types.length > 0 && (
            <div><span className="text-green-500">Roles:</span> {avail.role_types.join(", ")}</div>
          )}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-black text-green-400 p-6 md:p-10">
      <header className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold">Horcrux</h1>
        <a
          href="/rob_horcrux.json"
          target="_blank"
          className="text-xs px-3 py-1 rounded-full border border-green-700 hover:bg-green-900/40"
        >
          View JSON
        </a>
        <button
          onClick={() => location.reload()}
          className="text-xs px-3 py-1 rounded-full border border-green-700 hover:bg-green-900/40"
        >
          Reload
        </button>
      </header>

      <Meta />
      <Skills />
      <Projects />
      <Interviews />
      <Learning />
      <Availability />
    </main>
  );
}
