---
name: agent-manifest-designer
description: Design agent-readable JSON manifests for hosted skills, command packs, persona packs, tool presets, and fetchable AI-agent behavior modules. Use when defining manifest fields, compatibility metadata, parameter schemas, trust metadata, versioning, checksums, or machine-readable package contracts.
---

# Agent Manifest Designer

## Workflow

1. Identify the runtime that will consume the manifest.
2. Choose the smallest stable contract that lets an agent decide: fetch, reject, preview, install, or ask the user.
3. Separate metadata, parameters, instructions, resources, and trust fields.
4. Make every external resource explicit with URL, media type, checksum, and purpose.
5. Add a JSON Schema for user-configurable parameters.
6. Validate with `scripts/validate_agent_manifest.py`.

## Required Manifest Sections

- `schema_version`: Contract version, such as `agent-pack/v1`.
- `id`: Stable lowercase ID.
- `name`: Human label.
- `version`: Semantic version.
- `summary`: One-sentence job.
- `compatibility`: Target runtimes.
- `parameters`: JSON Schema object for user options.
- `instructions`: Ordered instruction blocks or URLs.
- `resources`: Files, scripts, templates, or API docs the agent may use.
- `trust`: Publisher, license, permissions, checksums, and update policy.

## Design Rules

- Prefer explicit deny-by-default permissions.
- Do not put executable code inline unless the target runtime requires it.
- Require user approval for network fetch, file writes outside workspace, shell execution, credentials, deploys, or purchases.
- Do not include secrets, bearer tokens, private URLs, or hidden prompt injection text.
- Keep natural language instructions concise and auditable.

## Resources

- Read `references/manifest-template.json` for the baseline contract.
- Run `scripts/validate_agent_manifest.py manifest.json` before publishing.
