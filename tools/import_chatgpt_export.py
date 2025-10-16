#!/usr/bin/env python3
"""
Convert ChatGPT export (conversations.json or chat.html) into markdown notes
for the Horcrux builder.

Usage:
  uv run python tools/import_chatgpt_export.py \
    --export-dir ~/Downloads/chatgpt-export \
    --out-root data/sources/chatgpt
"""

from __future__ import annotations
import argparse, json, os, re, sys, zipfile, datetime
from pathlib import Path
from html.parser import HTMLParser

def slugify(s: str) -> str:
    s = re.sub(r"[^\w\- ]+", "", s).strip().lower()
    s = re.sub(r"\s+", "-", s)
    return s[:80] or "untitled"

def dt_iso(ts):
    try:
        return datetime.datetime.utcfromtimestamp(float(ts)).strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:
        return None

def ensure_out(out_root: Path):
    out_root.mkdir(parents=True, exist_ok=True)

def write_note(out_root: Path, title: str, created: str | None, messages: list[dict]):
    fname = f"{slugify(title)}.md"
    p = out_root / fname
    lines = []
    lines.append(f"---\ntitle: {title}\ncreated: {created or ''}\n---\n")
    lines.append(f"# {title}\n")
    for m in messages:
        role = m.get("role") or m.get("author") or "unknown"
        content = m.get("content") or ""
        if isinstance(content, dict):
            # OpenAI export sometimes nests content.parts
            parts = content.get("parts")
            if isinstance(parts, list):
                content = "\n\n".join(str(x) for x in parts)
            else:
                content = json.dumps(content, ensure_ascii=False)
        lines.append(f"\n**{role}:**\n\n{content}\n")
    p.write_text("\n".join(lines), encoding="utf-8")
    return p

def parse_conversations_json(path: Path, out_root: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    count = 0
    # Handle both array and object-with-array shapes
    convos = data if isinstance(data, list) else data.get("conversations", [])
    for c in convos:
        title = c.get("title") or "ChatGPT Conversation"
        created = dt_iso(c.get("create_time"))
        msgs = []

        # Two common shapes: mapping-based (older) or messages list (newer)
        if "mapping" in c and isinstance(c["mapping"], dict):
            # Walk mapping DAG in insertion order
            for node in c["mapping"].values():
                m = node.get("message")
                if not m: continue
                role = (m.get("author") or {}).get("role") or "unknown"
                parts = (m.get("content") or {}).get("parts") or []
                text = "\n\n".join(str(x) for x in parts) if parts else ""
                msgs.append({"role": role, "content": text})
        elif "messages" in c and isinstance(c["messages"], list):
            for m in c["messages"]:
                role = (m.get("author") or {}).get("role") or m.get("role") or "unknown"
                content = ""
                if "content" in m:
                    cont = m["content"]
                    if isinstance(cont, dict) and isinstance(cont.get("parts"), list):
                        content = "\n\n".join(str(x) for x in cont["parts"])
                    elif isinstance(cont, str):
                        content = cont
                    else:
                        content = json.dumps(cont, ensure_ascii=False)
                msgs.append({"role": role, "content": content})
        else:
            # Fallback: dump whole convo
            msgs.append({"role": "system", "content": json.dumps(c, ensure_ascii=False, indent=2)})

        write_note(out_root, title, created, msgs)
        count += 1
    return count

class SimpleHTMLDump(HTMLParser):
    def __init__(self):
        super().__init__()
        self.chunks = []
    def handle_data(self, data):
        if data and data.strip():
            self.chunks.append(data.strip())
    def text(self):
        return "\n\n".join(self.chunks)

def parse_chat_html(path: Path, out_root: Path) -> int:
    html = path.read_text(encoding="utf-8", errors="ignore")
    # Extremely simple fallback—put the whole HTML text into one md
    parser = SimpleHTMLDump()
    parser.feed(html)
    title = "ChatGPT Export"
    msgs = [{"role": "export", "content": parser.text()}]
    write_note(out_root, title, None, msgs)
    return 1

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--export-dir", required=True, help="Folder containing ChatGPT export (with conversations.json or chat.html)")
    ap.add_argument("--out-root", required=True, help="Destination folder for markdown notes")
    args = ap.parse_args()

    export_dir = Path(args.export_dir).expanduser().resolve()
    out_root = Path(args.out_root).expanduser().resolve()
    ensure_out(out_root)

    cj = export_dir / "conversations.json"
    ch = export_dir / "chat.html"

    total = 0
    if cj.exists():
        total = parse_conversations_json(cj, out_root)
    elif ch.exists():
        total = parse_chat_html(ch, out_root)
    else:
        raise SystemExit(f"Could not find conversations.json or chat.html in {export_dir}")

    print(f"Wrote {total} conversation files to {out_root}")

if __name__ == "__main__":
    sys.exit(main())
