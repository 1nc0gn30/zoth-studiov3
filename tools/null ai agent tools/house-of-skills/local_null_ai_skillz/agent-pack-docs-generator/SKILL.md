---
name: agent-pack-docs-generator
description: Generate human-readable documentation, catalog copy, install instructions, parameter tables, permission summaries, and trust pages from hosted AI-agent pack manifests. Use when turning manifest JSON into markdown docs or website pages for a skill marketplace.
---

# Agent Pack Docs Generator

## Workflow

1. Load the manifest.
2. Generate overview, compatibility, parameters, permissions, resources, install/fetch, and trust sections.
3. Explain what the pack does and what it cannot do.
4. Include exact manifest URL and checksum when available.
5. Keep docs synced with manifest fields; do not invent capabilities.

## Resources

- Read `references/doc-sections.md` for page structure.
- Run `scripts/manifest_to_markdown.py manifest.json --out PACK.md`.
