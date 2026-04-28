---
name: hosted-pack-publisher
description: Prepare and publish versioned hosted AI-agent skill packs with immutable release directories, manifest files, checksums, archives, registry entries, changelogs, and deployment-safe static assets. Use when releasing, updating, packaging, or deprecating a hosted agent pack for website or registry consumption.
---

# Hosted Pack Publisher

## Workflow

1. Confirm the pack ID and semantic version.
2. Create an immutable release directory: `packs/<id>/<version>/`.
3. Include `manifest.json`, `SKILL.md` or instruction file, referenced resources, and optional archive.
4. Generate SHA-256 checksums.
5. Update `packs/<id>/latest/manifest.json` only after the versioned release validates.
6. Update the top-level registry.
7. Document deprecations and breaking changes.

## Release Rules

- Never overwrite a published version in place.
- Do not publish secrets or environment values.
- Make checksums visible to both agents and humans.
- Keep release notes short and behavior-focused.
- Roll back by moving `latest`, not by editing old release files.

## Resources

- Read `references/release-layout.md` for directory structure.
- Run `scripts/package_pack.py <pack-dir> --out <release-dir>` to copy and checksum a pack.
