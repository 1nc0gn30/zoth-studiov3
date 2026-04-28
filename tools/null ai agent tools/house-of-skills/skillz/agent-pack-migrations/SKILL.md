---
name: agent-pack-migrations
description: Migrate hosted AI-agent pack manifests, registry entries, parameter schemas, and release metadata between schema versions while preserving compatibility and changelog clarity. Use when upgrading agent-pack/v1 to newer contracts or maintaining backward-compatible registry clients.
---

# Agent Pack Migrations

## Workflow

1. Detect source schema version.
2. Create a copy before migration.
3. Apply deterministic field migrations.
4. Preserve unknown fields under `x_legacy` when safe.
5. Validate migrated output with the target schema.
6. Add migration notes to changelog.

## Rules

- Never mutate published immutable releases.
- Migrate into a new versioned release.
- Keep compatibility shims for active clients.

## Resources

- Read `references/schema-history.md`.
- Run `scripts/migrate_manifest.py old.json --to agent-pack/v1 --out new.json`.
