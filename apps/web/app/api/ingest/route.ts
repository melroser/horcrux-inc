import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

type Horcrux = {
  content: {
    notes?: { id: string; text: string; source?: string; created_at?: string }[];
    [k: string]: any;
  };
  [k: string]: any;
};

export async function POST(req: NextRequest) {
  // Disable in prod to avoid ephemeral FS + accidental writes on Netlify
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Ingest disabled in production. Run locally." }, { status: 501 });
  }

  const { text } = await req.json().catch(() => ({}));
  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Missing 'text' (string)" }, { status: 400 });
  }

  const file = path.join(process.cwd(), "public", "rob_horcrux.json");
  let json: Horcrux;
  try {
    const raw = await fs.readFile(file, "utf-8");
    json = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ error: `Failed to read horcrux: ${String(e)}` }, { status: 500 });
  }

  const note = {
    id: crypto.randomUUID(),
    text: text.trim(),
    source: "web-ingest",
    created_at: new Date().toISOString()
  };

  if (!json.content) json.content = { notes: [note] };
  else json.content.notes = Array.isArray(json.content.notes) ? [...json.content.notes, note] : [note];

  try {
    await fs.writeFile(file, JSON.stringify(json, null, 2), "utf-8");
  } catch (e) {
    return NextResponse.json({ error: `Failed to write horcrux: ${String(e)}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, notesCount: json.content.notes?.length ?? 0 });
}
