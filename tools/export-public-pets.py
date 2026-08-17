#!/usr/bin/env python3
"""Export a redacted public snapshot of pet knowledge packs."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ORCH = (
    Path(__file__).resolve().parents[1]
    / "tools"
    / "null ai agent tools"
    / "local_null_ai_orchestrator"
)
sys.path.insert(0, str(ORCH))

from runtime.pet_knowledge import heal_all, public_snapshot  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / "public" / "pets" / "packs.json"


def main() -> int:
    heal_all()
    payload = public_snapshot()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2))
    print(f"wrote {OUT} ({payload.get('pet_count')} pets)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
