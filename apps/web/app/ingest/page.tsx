"use client";

import { useState } from "react";

export default function IngestPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  const submit = async () => {
    setStatus("Saving…");
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus(`OK: ${data?.notesCount ?? "updated"}`);
      setText("");
    } else {
      setStatus(`Error: ${data?.error ?? res.statusText}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 p-6 space-y-4">
      <h1 className="text-3xl font-bold">Paste text → Append to Horcrux</h1>
      <textarea
        className="w-full h-64 bg-green-950/20 border border-green-800/50 rounded p-3 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste any plaintext here…"
      />
      <div className="flex gap-3">
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="px-4 py-2 rounded border border-green-700 hover:bg-green-900/30 disabled:opacity-50"
        >
          Append
        </button>
        {status && <div className="text-sm opacity-80">{status}</div>}
      </div>
      <p className="text-green-300/70 text-sm">
        Writes to <code>public/rob_horcrux.json</code> in <b>local dev only</b>. In production this endpoint is read-only.
      </p>
    </main>
  );
}
