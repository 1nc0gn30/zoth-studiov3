---
name: agent-runtime-adapter
description: Adapt hosted AI-agent packs and manifests into runtime-specific formats for Codex skills, generic agent prompts, local CLIs, ChatGPT Apps, browser agents, or internal tool runners. Use when mapping a single hosted pack contract into multiple consuming agent environments.
---

# Agent Runtime Adapter

## Workflow

1. Read the source manifest and identify target runtime constraints.
2. Preserve manifest intent while lowering unsupported features to warnings.
3. Convert instructions into the target runtime's native format.
4. Keep permissions and approval notes visible after conversion.
5. Generate an adapter report listing lost, mapped, and blocked features.

## Target Notes

- Codex skill: output `SKILL.md` with concise frontmatter and body.
- Generic agent: output markdown instruction block plus parameter summary.
- CLI: output JSON config and install preview.
- ChatGPT App: do not invent MCP capabilities; map only documented tools/resources.

## Resources

- Read `references/runtime-map.md` for mapping guidance.
- Run `scripts/adapt_manifest.py manifest.json --target codex-skill --out out.md` for a basic Codex conversion.
