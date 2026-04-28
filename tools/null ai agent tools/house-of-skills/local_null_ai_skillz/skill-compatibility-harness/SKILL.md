---
name: skill-compatibility-harness
description: Create and run compatibility checks for hosted AI-agent skills, manifests, parameter packs, and transformation bundles across target runtimes such as Codex skills, ChatGPT Apps, generic agents, CLIs, and static registry clients. Use when validating schema shape, trigger descriptions, resource paths, scripts, example prompts, and install readiness.
---

# Skill Compatibility Harness

## Workflow

1. List target runtimes and their hard requirements.
2. Validate manifest JSON shape and checksums.
3. Validate local skill folder anatomy where applicable: `SKILL.md`, frontmatter, optional `agents/openai.yaml`, `references/`, `scripts/`, `assets/`.
4. Run bundled scripts with `--help` or safe sample inputs.
5. Check example prompts trigger the intended skill and not adjacent skills.
6. Produce a compatibility matrix with pass, fail, blocked, and notes.

## Runtime Checks

- Codex skill: valid `SKILL.md` YAML frontmatter with `name` and `description` only.
- Hosted registry: valid `/registry.json` and HTTPS manifest URLs.
- Generic agent: manifest includes concise instructions and safe parameter schema.
- CLI fetcher: validates URLs, checksums, cache path, and preview output.
- Netlify website: build emits static JSON, robots, sitemap, redirects, and headers.

## Resources

- Read `references/matrix-template.md` for reporting.
- Run `scripts/run_harness.py <path>` for basic local checks.
