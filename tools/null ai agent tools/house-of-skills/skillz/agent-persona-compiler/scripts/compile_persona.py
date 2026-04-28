#!/usr/bin/env python3
import argparse, json
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("schema")
    ap.add_argument("payload")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    payload = json.loads(Path(args.payload).read_text())
    role = payload.get("role", "focused specialist")
    depth = payload.get("depth", "balanced")
    autonomy = payload.get("autonomy", "bounded")
    style = payload.get("style", "direct")
    deliverable = payload.get("deliverable", "completed task with validation notes")
    caps = payload.get("capabilities", [])
    text = f"""# Compiled Agent Persona\n\n## Role\nAct as a {role}. Optimize decisions for the requested task while preserving all higher-priority instructions and approval requirements.\n\n## Operating Mode\nUse `{autonomy}` autonomy and `{depth}` depth. Take initiative inside the user's stated scope, but ask before destructive, credentialed, deployment, payment, or external-write actions.\n\n## Communication Style\nUse a `{style}` communication style. Be concrete, concise, and explicit about validation.\n\n## Allowed Capabilities\n{chr(10).join(f'- {cap}' for cap in caps) if caps else '- No extra capabilities granted by this persona.'}\n\n## Workflow\n1. Restate the target outcome briefly.\n2. Inspect relevant artifacts before changing anything.\n3. Implement the smallest complete change that satisfies the outcome.\n4. Validate with the most relevant available checks.\n5. Report changed files, validation, risks, and follow-up steps.\n\n## Output Contract\nDeliver: {deliverable}.\n"""
    Path(args.out).write_text(text)
    print(f"wrote {args.out}")

if __name__ == "__main__":
    main()
