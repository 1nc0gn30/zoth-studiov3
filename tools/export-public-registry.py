#!/usr/bin/env python3
"""Export a redacted public snapshot of the orchestrator registry (no absolute paths)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = (
    ROOT
    / "tools"
    / "null ai agent tools"
    / "local_null_ai_orchestrator"
    / "registry.local.json"
)
OUT = ROOT / "public" / "registry" / "tools.json"


def main() -> int:
    reg = json.loads(SRC.read_text())
    cats: dict[str, int] = {}
    tools = []
    for t in reg.get("tools") or []:
        cat = t.get("category") or "Other"
        cats[cat] = cats.get(cat, 0) + 1
        tools.append(
            {
                "id": t.get("id") or "",
                "name": t.get("name") or t.get("id") or "Untitled",
                "description": (t.get("description") or "").strip()[:240],
                "category": cat,
                "relative_path": t.get("relative_path") or "",
                "runtimes": t.get("runtimes") or [],
                "tags": t.get("tags") or [],
            }
        )
    payload = {
        "schema": "zoth-public-registry/v1",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "tool_count": len(tools),
        "categories": [
            {"name": k, "count": cats[k]}
            for k in sorted(cats, key=lambda x: (-cats[x], x))
        ],
        "tools": tools,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")))
    print(f"wrote {OUT} ({len(tools)} tools)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
