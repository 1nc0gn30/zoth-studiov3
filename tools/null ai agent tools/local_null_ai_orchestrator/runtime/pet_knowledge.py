#!/usr/bin/env python3
"""Pet knowledge packs: obtain, hold, and self-heal doctrine + docs.

Each companion has a folder under pets/<id>/ with SYSTEM.md, PLAYBOOK.md,
CANON.md, and sources.json. Heal rebuilds an index from those files plus
matching vault notes and registry summaries so a task brief always starts
with domain context.
"""
from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ORCH_DIR = Path(__file__).resolve().parents[1]
PETS_DIR = ORCH_DIR / "pets"
VAULT_DIR = ORCH_DIR / "obsidian-vault"
PLAYBOOKS_DIR = ORCH_DIR / "playbooks"
ZOTH_DIR = ORCH_DIR.parents[2]
REGISTRY = ORCH_DIR / "registry.local.json"

REQUIRED_DOCS = ("SYSTEM.md", "PLAYBOOK.md", "CANON.md")

ROSTER: list[dict[str, Any]] = [
    {
        "id": "zoth",
        "name": "Zoth",
        "domain": "brand",
        "role": "House mascot",
        "blurb": "Masked con-artist of the deck. Tarot stillness. No face yet.",
        "tags": ["mascot", "brand", "studio"],
        "vault_globs": ["zoth.md"],
        "registry_tags": [],
        "local_files": ["public/assets/mascot", "public/assets/brand/README.md"],
        "portrait": "/assets/mascot/zoth-avatar.jpg",
    },
    {
        "id": "kai",
        "name": "Kai",
        "domain": "build",
        "role": "Workspace inspector",
        "blurb": "Finds broken imports, dead code, and high-blast diffs before they ship.",
        "tags": ["review", "debug", "typescript"],
        "vault_globs": ["Category-Web-Apps*", "Category-Rust*"],
        "registry_tags": ["node", "frontend", "vite"],
        "local_files": ["AGENTS.md", "README.md"],
    },
    {
        "id": "draco",
        "name": "Draco",
        "domain": "build",
        "role": "Fusion compiler",
        "blurb": "Fuses multi-model output into one executable plan.",
        "tags": ["fusion", "arena", "multi-model"],
        "vault_globs": ["Category-AI-Agents*"],
        "registry_tags": ["python"],
        "local_files": ["playbooks/spark-pour.json", "playbooks/agent-codex-workflow.json"],
    },
    {
        "id": "ignis",
        "name": "Ignis",
        "domain": "build",
        "role": "Refactor & ship",
        "blurb": "Smallest safe refactor, then a green pipeline.",
        "tags": ["refactor", "ship", "ci"],
        "vault_globs": ["Category-Automation*"],
        "registry_tags": ["shell", "node"],
        "local_files": ["playbooks/site-modernization.json", "hosting/HOSTING.md"],
    },
    {
        "id": "lycan",
        "name": "Lycan",
        "domain": "security",
        "role": "OWASP sentinel",
        "blurb": "Hardens defaults, headers, XSS, and auth gaps. No exploit payloads.",
        "tags": ["security", "owasp", "hardening"],
        "vault_globs": ["Category-Security*"],
        "registry_tags": ["python"],
        "local_files": ["playbooks/security-audit-chain.json", "playbooks/parrot-tool-hardening.json"],
    },
    {
        "id": "athena",
        "name": "Athena",
        "domain": "knowledge",
        "role": "Knowledge & AEO",
        "blurb": "Keeps FAQ, schema, llms.txt, and vault links honest.",
        "tags": ["aeo", "seo", "vault"],
        "vault_globs": ["00-Obsidian-Master-Index.md", "zoth.md"],
        "registry_tags": [],
        "local_files": ["public/llms.txt", "public/agents.md", "public/sitemap.xml"],
    },
    {
        "id": "kitsune",
        "name": "Kitsune",
        "domain": "build",
        "role": "Taste & motion",
        "blurb": "Type, space, and motion. Quiet chrome. One accent.",
        "tags": ["ui", "motion", "brand"],
        "vault_globs": ["Category-Creative*"],
        "registry_tags": ["frontend"],
        "local_files": ["public/assets/mockups/DESIGN_SPEC.md", "playbooks/site-modernization.json"],
    },
    {
        "id": "pixel-neko",
        "name": "Pixel-Neko",
        "domain": "ops",
        "role": "Tool indexer",
        "blurb": "Keeps the 298-tool registry tagged, pathed, and searchable.",
        "tags": ["registry", "index", "drive"],
        "vault_globs": ["Category-*"],
        "registry_tags": [],
        "local_files": ["tools/export-public-registry.py", "public/registry/tools.json"],
    },
    {
        "id": "pixel-shiba",
        "name": "Pixel-Shiba",
        "domain": "ops",
        "role": "Vault guardian",
        "blurb": "Keys stay on this machine. Loopback daemon. No cloud KMS.",
        "tags": ["keys", "storage", "byok"],
        "vault_globs": [],
        "registry_tags": [],
        "local_files": ["public/vault/README.md", "vault-daemon/README.md"],
    },
    {
        "id": "radical-minion",
        "name": "Radical Minion",
        "domain": "autonomy",
        "role": "Hermes partner",
        "blurb": "Multi-step playbooks with human checkpoints.",
        "tags": ["hermes", "autonomy", "playbook"],
        "vault_globs": ["Category-AI-Agents*"],
        "registry_tags": ["python", "shell"],
        "local_files": [
            "playbooks/framework-bootstrap.json",
            "studio-agents/hermes_agent.py",
        ],
    },
    {
        "id": "aquila",
        "name": "Aquila",
        "domain": "edge",
        "role": "Global Edge & Dispatcher",
        "blurb": "Sub-millisecond API routing, isolate edge compilation, and high-speed multi-model dispatch.",
        "tags": ["edge", "routing", "latency", "dispatch"],
        "vault_globs": ["Category-Automation*"],
        "registry_tags": ["shell", "node"],
        "local_files": ["public/studio/edge-forge.html"],
        "portrait": "/assets/pets/aquila-neon.jpg",
    },
    {
        "id": "leviathan",
        "name": "Leviathan",
        "domain": "knowledge",
        "role": "Deep Tensor & Vector Memory",
        "blurb": "Multi-dimensional vector indexing, long-context RAG memory, and dense embeddings.",
        "tags": ["rag", "vectors", "embeddings", "memory"],
        "vault_globs": ["Category-AI-Agents*"],
        "registry_tags": ["python"],
        "local_files": ["public/studio/math-pillars.html"],
        "portrait": "/assets/pets/leviathan-neon.jpg",
    },
    {
        "id": "onyx",
        "name": "Onyx",
        "domain": "security",
        "role": "Kernel & Red-Team Predator",
        "blurb": "Stealth network infiltration audits, exploit payload fuzzing, and zero-trust verification.",
        "tags": ["security", "redteam", "kernel", "osint"],
        "vault_globs": ["Category-Security*"],
        "registry_tags": ["python", "shell"],
        "local_files": ["public/studio/subsweep.html"],
        "portrait": "/assets/pets/onyx-neon.jpg",
    },
    {
        "id": "chronos",
        "name": "Chronos",
        "domain": "build",
        "role": "Temporal DAG & Git Navigator",
        "blurb": "DAG topological execution graphs, multiversal time-travel diffing, and rollback safety.",
        "tags": ["dag", "git", "workflow", "versioning"],
        "vault_globs": ["Category-Web-Apps*"],
        "registry_tags": ["node"],
        "local_files": ["public/studio/agent-composer.html"],
        "portrait": "/assets/pets/chronos-neon.jpg",
    },
    {
        "id": "aether",
        "name": "Aether",
        "domain": "autonomy",
        "role": "Swarm Overlord & Matrix Conductor",
        "blurb": "Orchestrates asynchronous consensus across Antigravity, Grok, Hermes, and local Ollama.",
        "tags": ["swarm", "consensus", "orchestration", "bus"],
        "vault_globs": ["Category-AI-Agents*"],
        "registry_tags": ["python"],
        "local_files": ["public/studio/swarm.html"],
        "portrait": "/assets/pets/aether-neon.jpg",
    },
    {
        "id": "glitchcat",
        "name": "Glitchcat",
        "domain": "build",
        "role": "RGB glitch cat",
        "blurb": "Breaks stale layouts on purpose so the real composition can land.",
        "tags": ["glitch", "ui", "chaos"],
        "vault_globs": ["Category-Creative*"],
        "registry_tags": ["frontend"],
        "local_files": [],
    },
    {
        "id": "circuit-pup",
        "name": "Circuit Pup",
        "domain": "ops",
        "role": "LED circuit dog",
        "blurb": "Sniffs live ports, daemons, and missing CLIs.",
        "tags": ["ports", "ops", "health"],
        "vault_globs": [],
        "registry_tags": ["shell"],
        "local_files": [],
    },
    {
        "id": "terminal-ghost",
        "name": "Terminal Ghost",
        "domain": "ops",
        "role": "Phosphor spirit",
        "blurb": "Haunts agent terminals until the feed tells the truth.",
        "tags": ["terminal", "logs", "trace"],
        "vault_globs": [],
        "registry_tags": ["shell"],
        "local_files": [],
    },
    {
        "id": "savage-codex",
        "name": "Savage Codex",
        "domain": "security",
        "role": "Hacker familiar",
        "blurb": "Reads diffs like a threat model. No payloads.",
        "tags": ["review", "security", "diff"],
        "vault_globs": ["Category-Security*"],
        "registry_tags": ["python"],
        "local_files": [],
    },
    {
        "id": "ai-workbot",
        "name": "AI Workbot",
        "domain": "autonomy",
        "role": "Task robot",
        "blurb": "Turns a chat request into a claimed, finished checklist.",
        "tags": ["tasks", "swarm", "checklist"],
        "vault_globs": ["Category-AI-Agents*"],
        "registry_tags": ["python"],
        "local_files": [],
    },
    {
        "id": "binary",
        "name": "Binary",
        "domain": "knowledge",
        "role": "Data spirit",
        "blurb": "Keeps schema, llms.txt, and connector status bits honest.",
        "tags": ["data", "schema", "aeo"],
        "vault_globs": ["00-Obsidian-Master-Index.md"],
        "registry_tags": [],
        "local_files": [],
    },
]


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _pet_dir(pet_id: str) -> Path:
    return PETS_DIR / pet_id


ALIASES = {
    "minion": "radical-minion",
    "radical": "radical-minion",
    "neko": "pixel-neko",
    "shiba": "pixel-shiba",
}


def get_pet(pet_id: str) -> dict[str, Any] | None:
    key = (pet_id or "").strip().lower()
    key = ALIASES.get(key, key)
    for p in ROSTER:
        if p["id"] == key or p["name"].lower() == key:
            return p
    return None


def _read(path: Path, limit: int = 4000) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""
    return text[:limit]


def _headings(text: str) -> list[str]:
    return [ln.lstrip("#").strip() for ln in text.splitlines() if ln.startswith("#")][:8]


def _sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="replace")).hexdigest()[:12]


def _resolve_local(rel: str) -> Path | None:
    candidates = [
        ZOTH_DIR / rel,
        ORCH_DIR / rel,
        ZOTH_DIR / "hosting" / Path(rel).name if rel.startswith("hosting/") else None,
    ]
    for c in candidates:
        if c and c.is_file():
            return c
    return None


def _vault_matches(globs: list[str]) -> list[Path]:
    if not VAULT_DIR.is_dir():
        return []
    found: list[Path] = []
    for g in globs:
        found.extend(sorted(VAULT_DIR.glob(g))[:12])
    # unique, files only
    seen = set()
    out = []
    for p in found:
        if p.is_file() and p.name not in seen:
            seen.add(p.name)
            out.append(p)
    return out[:16]


def _registry_hits(tags: list[str], limit: int = 8) -> list[dict[str, Any]]:
    if not tags or not REGISTRY.is_file():
        return []
    try:
        data = json.loads(REGISTRY.read_text())
    except json.JSONDecodeError:
        return []
    want = {t.lower() for t in tags}
    hits = []
    for t in data.get("tools") or []:
        have = {str(x).lower() for x in (t.get("tags") or []) + (t.get("runtimes") or [])}
        if want & have:
            hits.append(
                {
                    "id": t.get("id") or "",
                    "name": t.get("name") or t.get("id") or "",
                    "category": t.get("category") or "",
                    "relative_path": t.get("relative_path") or "",
                }
            )
        if len(hits) >= limit:
            break
    return hits


def heal(pet_id: str) -> dict[str, Any]:
    pet = get_pet(pet_id)
    if not pet:
        return {"error": "unknown pet", "id": pet_id}
    folder = _pet_dir(pet["id"])
    folder.mkdir(parents=True, exist_ok=True)
    gaps: list[str] = []
    docs: list[dict[str, Any]] = []

    for name in REQUIRED_DOCS:
        path = folder / name
        if not path.is_file() or path.stat().st_size < 40:
            gaps.append(f"missing:{name}")
            continue
        text = _read(path, 6000)
        docs.append(
            {
                "id": name.replace(".md", "").lower(),
                "title": name.replace(".md", ""),
                "kind": "doctrine",
                "rel": f"pets/{pet['id']}/{name}",
                "chars": len(text),
                "sha": _sha(text),
                "headings": _headings(text),
                "excerpt": text[:900],
            }
        )

    for rel in pet.get("local_files") or []:
        path = _resolve_local(rel)
        if not path:
            gaps.append(f"source:{rel}")
            continue
        text = _read(path, 3500)
        docs.append(
            {
                "id": f"local:{path.name}",
                "title": path.name,
                "kind": "source",
                "rel": rel,
                "chars": len(text),
                "sha": _sha(text),
                "headings": _headings(text),
                "excerpt": text[:700],
            }
        )

    for vpath in _vault_matches(pet.get("vault_globs") or []):
        text = _read(vpath, 2500)
        docs.append(
            {
                "id": f"vault:{vpath.stem}",
                "title": vpath.stem.replace("-", " "),
                "kind": "vault",
                "rel": f"obsidian-vault/{vpath.name}",
                "chars": len(text),
                "sha": _sha(text),
                "headings": _headings(text),
                "excerpt": text[:500],
            }
        )

    tools = _registry_hits(pet.get("registry_tags") or [])
    if tools:
        excerpt = "\n".join(f"- {t['name']} ({t['category']}) {t['relative_path']}" for t in tools)
        docs.append(
            {
                "id": "registry:matches",
                "title": "Registry matches",
                "kind": "registry",
                "rel": "registry.local.json",
                "chars": len(excerpt),
                "sha": _sha(excerpt),
                "headings": [t["name"] for t in tools],
                "excerpt": excerpt,
            }
        )

    required_ok = sum(1 for d in docs if d["kind"] == "doctrine")
    score = required_ok / len(REQUIRED_DOCS)
    if gaps and score >= 1:
        status = "gaps"
        score = max(0.7, score - 0.05 * min(len(gaps), 4))
    elif score >= 1:
        status = "ready"
    elif score >= 0.66:
        status = "degraded"
    else:
        status = "broken"

    index = {
        "id": pet["id"],
        "name": pet["name"],
        "domain": pet["domain"],
        "role": pet["role"],
        "healed_at": _now(),
        "doc_count": len(docs),
        "docs": docs,
        "gaps": gaps,
        "health": {
            "score": round(score, 2),
            "status": status,
            "required_ok": required_ok,
            "required_total": len(REQUIRED_DOCS),
        },
    }
    (folder / "index.json").write_text(json.dumps(index, indent=2))
    (folder / "health.json").write_text(json.dumps(index["health"] | {"healed_at": index["healed_at"], "gaps": gaps}, indent=2))
    return index


def heal_all() -> dict[str, Any]:
    PETS_DIR.mkdir(parents=True, exist_ok=True)
    results = [heal(p["id"]) for p in ROSTER]
    roster = {
        "schema": "zoth-pet-roster/v1",
        "generated_at": _now(),
        "pets": [
            {
                "id": r["id"],
                "name": r["name"],
                "domain": r["domain"],
                "role": r["role"],
                "health": r.get("health"),
                "doc_count": r.get("doc_count", 0),
                "healed_at": r.get("healed_at"),
            }
            for r in results
            if "error" not in r
        ],
    }
    (PETS_DIR / "roster.json").write_text(json.dumps(roster, indent=2))
    return roster


def load_index(pet_id: str) -> dict[str, Any] | None:
    pet = get_pet(pet_id)
    if not pet:
        return None
    path = _pet_dir(pet["id"]) / "index.json"
    if not path.is_file():
        return heal(pet["id"])
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError:
        return heal(pet["id"])


def brief(pet_id: str, task: str = "") -> dict[str, Any]:
    idx = load_index(pet_id)
    if not idx or "error" in idx:
        return idx or {"error": "unknown pet", "id": pet_id}
    q = {w for w in re.findall(r"[a-z0-9]{3,}", (task or "").lower())}
    scored = []
    for doc in idx.get("docs") or []:
        blob = f"{doc.get('title','')} {doc.get('excerpt','')}".lower()
        hit = sum(1 for w in q if w in blob) if q else (3 if doc.get("kind") == "doctrine" else 1)
        if doc.get("kind") == "doctrine":
            hit += 2
        scored.append((hit, doc))
    scored.sort(key=lambda x: -x[0])
    picked = [d for _, d in scored[:6]]
    system = next((d["excerpt"] for d in picked if d.get("id") == "system"), "")
    playbook = next((d["excerpt"] for d in picked if d.get("id") == "playbook"), "")
    prompt = (
        f"You are {idx['name']}, {idx['role']}.\n"
        f"Domain: {idx['domain']}.\n\n"
        f"## Doctrine\n{system}\n\n"
        f"## Playbook\n{playbook}\n\n"
        f"## Task\n{task.strip() or 'Wait for operator intent. Ask one clarifying question if the surface is unclear.'}\n\n"
        "Use only the attached notes. If a required fact is missing, say so and propose the smallest next check."
    )
    return {
        "id": idx["id"],
        "name": idx["name"],
        "domain": idx["domain"],
        "role": idx["role"],
        "health": idx.get("health"),
        "healed_at": idx.get("healed_at"),
        "task": task,
        "prompt": prompt,
        "notes": [
            {"id": d.get("id"), "title": d.get("title"), "kind": d.get("kind"), "excerpt": d.get("excerpt")}
            for d in picked
        ],
    }


def list_pets(public: bool = False) -> dict[str, Any]:
    pets = []
    for meta in ROSTER:
        idx = load_index(meta["id"]) or {}
        health = idx.get("health") or {"score": 0, "status": "unknown"}
        item = {
            "id": meta["id"],
            "name": meta["name"],
            "domain": meta["domain"],
            "role": meta["role"],
            "blurb": meta["blurb"],
            "tags": meta["tags"],
            "health": health,
            "doc_count": idx.get("doc_count", 0),
            "healed_at": idx.get("healed_at"),
            "topics": [d.get("title") for d in (idx.get("docs") or []) if d.get("kind") == "doctrine"],
            "portrait": meta.get("portrait") or f"/assets/pets/{meta['id']}-neon.jpg",
            "portrait_svg": meta.get("portrait_svg") or f"/assets/pets/{meta['id']}.svg",
        }
        if not public:
            item["gaps"] = idx.get("gaps") or []
        pets.append(item)
    return {"schema": "zoth-pets/v1", "generated_at": _now(), "pet_count": len(pets), "pets": pets}


def public_snapshot() -> dict[str, Any]:
    return list_pets(public=True)


if __name__ == "__main__":
    import sys

    cmd = (sys.argv[1] if len(sys.argv) > 1 else "heal-all").strip()
    if cmd == "heal-all":
        print(json.dumps(heal_all(), indent=2))
    elif cmd == "heal" and len(sys.argv) > 2:
        print(json.dumps(heal(sys.argv[2]), indent=2))
    elif cmd == "brief" and len(sys.argv) > 2:
        task = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else ""
        print(json.dumps(brief(sys.argv[2], task), indent=2))
    elif cmd == "list":
        print(json.dumps(list_pets(), indent=2))
    else:
        print("usage: pet_knowledge.py [heal-all|heal <id>|brief <id> <task>|list]")
        raise SystemExit(2)
