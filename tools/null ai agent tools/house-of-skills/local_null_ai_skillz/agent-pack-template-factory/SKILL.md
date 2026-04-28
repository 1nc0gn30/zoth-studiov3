---
name: agent-pack-template-factory
description: Generate starter hosted AI-agent packs with manifest, instructions, parameter schema, trust metadata, docs stub, checksums, and release-ready directory layout. Use when creating many consistent packs quickly or bootstrapping a new pack from a command-line template.
---

# Agent Pack Template Factory

## Workflow

1. Gather pack ID, name, summary, runtime compatibility, and primary role.
2. Generate manifest and instruction files.
3. Include safe default permissions: empty unless requested.
4. Add parameter schema with `additionalProperties: false`.
5. Create docs draft and checksums file.
6. Validate with manifest and policy tools before publishing.

## Resources

- Read `references/template-fields.md`.
- Run `scripts/new_pack.py --id my-pack --name "My Pack" --out packs/my-pack`.
