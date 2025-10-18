#!/usr/bin/env python3
"""
Builds a single Horcrux JSON from mixed sources (md/txt/json) under data/sources/**.
Usage:
  uv run python tools/build_horcrux.py --name "Robert Melrose" --title "Senior Full-Stack Engineer" --location "Miami, FL" --out apps/web/public/rob_horcrux.json data/sources
"""

from __future__ import annotations
import argparse, json, os, re, sys, uuid, datetime
from pathlib import Path
from typing import Any, Dict, List

ISO = "%Y-%m-%dT%H:%M:%SZ"

def now_iso() -> str:
    return datetime.datetime.utcnow().strftime(ISO)

def read_text(p: Path) -> str:
    return p.read_text(encoding="utf-8", errors="ignore")

def sniff_title(body: str, fallback: str) -> str:
    # First Markdown heading or first non-empty line
    for line in body.splitlines():
        s = line.strip()
        if s.startswith("#"):
            return re.sub(r"^#+\s*", "", s)[:140]
        if s:
            return s[:140]
    return fallback[:140]

def normalize_entry(source: str, title: str, body: str, tags=None, created_at=None) -> Dict[str, Any]:
    return {
        "id": str(uuid.uuid4()),
        "source": source,             # e.g., "raycast", "granola", "manual"
        "title": title,
        "body": body,
        "tags": tags or [],
        "created_at": created_at or now_iso(),
    }

def parse_json_file(p: Path, source: str) -> List[Dict[str, Any]]:
    data = json.loads(read_text(p))
    entries: List[Dict[str, Any]] = []

    # Very forgiving: try common shapes; otherwise store the whole doc.
    if isinstance(data, dict):
        # PromptLab / custom exporters might have "chats" / "items"
        candidates = []
        for k in ("chats", "items", "conversations", "notes", "entries"):
            if k in data and isinstance(data[k], list):
                candidates = data[k]
                break
        if candidates:
            for i, item in enumerate(candidates):
                title = (item.get("title") or item.get("name") or f"{source} {p.name} #{i+1}")
                body = (
                    item.get("content") or
                    item.get("body") or
                    item.get("text") or
                    json.dumps(item, ensure_ascii=False, indent=2)
                )
                entries.append(normalize_entry(source, str(title), str(body)))
        else:
            # Just capture entire file as one entry
            entries.append(normalize_entry(source, f"{source}:{p.stem}", json.dumps(data, ensure_ascii=False, indent=2)))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, str):
                entries.append(normalize_entry(source, sniff_title(item, f"{source} #{i+1}"), item))
            else:
                entries.append(normalize_entry(source, f"{source} #{i+1}", json.dumps(item, ensure_ascii=False, indent=2)))
    else:
        entries.append(normalize_entry(source, f"{source}:{p.stem}", json.dumps(data, ensure_ascii=False)))
    return entries

def parse_text_file(p: Path, source: str) -> List[Dict[str, Any]]:
    body = read_text(p)
    title = sniff_title(body, f"{source}:{p.stem}")
    return [normalize_entry(source, title, body)]

def discover_entries(root: Path) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    for p in sorted(root.rglob("*")):
        if not p.is_file():
            continue
        # Determine source from immediate parent directory name
        parent = p.parent.name.lower()
        source = "manual"
        if "raycast" in parent:
            source = "raycast"
        elif "granola" in parent:
            source = "granola"

        ext = p.suffix.lower()
        try:
            if ext in (".md", ".txt"):
                entries += parse_text_file(p, source)
            elif ext in (".json",):
                entries += parse_json_file(p, source)
            else:
                # Ignore binaries, but you could add .html here if needed
                continue
        except Exception as e:
            entries.append(normalize_entry("builder", f"READ_ERROR:{p.name}", f"{type(e).__name__}: {e}"))
    return entries

def build_horcrux(args) -> Dict[str, Any]:
    # Optional seed (if you want to start from your earlier file)
    seed: Dict[str, Any] = {}
    seed_path = Path("data/seed_corpus.json")
    if seed_path.exists():
        try:
            seed = json.loads(seed_path.read_text(encoding="utf-8"))
        except Exception:
            seed = {}

    sources_root = Path(args.sources[0]).resolve()
    entries = discover_entries(sources_root)

    # Basic top-level shape; feel free to evolve later
    horcrux: Dict[str, Any] = {
        "meta": {
            "name": args.name,
            "title": args.title,
            "location": args.location,
            "updated": now_iso(),
            "version": datetime.datetime.utcnow().strftime("%Y.%m.%d-%H%M"),
            "contact": {
                "linkedin": "linkedin.com/in/robertmelrose",
                "github": "github.com/robmelrose",
            },
        },
        # Keep seed.skills/projects if present
        "skills": seed.get("skills", {}),
        "projects": seed.get("projects", []),
        "entries": entries,
    }
    return horcrux

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--location", required=True)
    ap.add_argument("--out", required=True, help="Output JSON path, e.g. apps/web/public/rob_horcrux.json")
    ap.add_argument("sources", nargs=1, help="Root folder containing sources (md/txt/json)")
    args = ap.parse_args()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    horcrux = build_horcrux(args)
    out_path.write_text(json.dumps(horcrux, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} with {len(horcrux.get('entries', []))} entries")

if __name__ == "__main__":
    sys.exit(main())
