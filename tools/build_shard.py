#!/usr/bin/env python3
"""
Build script to merge Raycast/Granola exports into rob_shard.json
"""

import json
import os
from datetime import datetime
from pathlib import Path

def build_shard():
    """Build the shard from various data sources"""
    
    # Load base shard
    base_path = Path("data/rob_shard.json")
    if base_path.exists():
        with open(base_path) as f:
            shard = json.load(f)
    else:
        shard = {"meta": {}, "skills": {}, "projects": [], "interviews": []}
    
    # Update timestamp
    shard["meta"]["updated"] = datetime.utcnow().isoformat() + "Z"
    shard["meta"]["version"] = datetime.now().strftime("%Y.%m.%d-1")
    
    # TODO: Add parsers for Raycast/Granola exports
    # parse_raycast_notes()
    # parse_granola_transcripts()
    
    # Write to public directory for Netlify
    output_path = Path("apps/web/public/rob_shard.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(shard, f, indent=2)
    
    print(f"✅ Shard built: {output_path}")
    print(f"📊 Version: {shard['meta']['version']}")
    print(f"🔄 Updated: {shard['meta']['updated']}")

if __name__ == "__main__":
    build_shard()
