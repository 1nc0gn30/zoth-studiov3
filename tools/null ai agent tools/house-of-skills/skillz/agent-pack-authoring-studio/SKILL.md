---
name: agent-pack-authoring-studio
description: Design and implement authoring interfaces for creating hosted AI-agent packs, manifests, parameter schemas, instructions, trust metadata, preview pages, and publish-ready releases. Use when building a dashboard or local editor for non-experts to create agent transformation packs safely.
---

# Agent Pack Authoring Studio

## Workflow

1. Model the authoring flow as draft, validate, preview, review, publish.
2. Keep the user editing structured fields before raw JSON.
3. Generate manifest JSON from form state, not by hand.
4. Show permission impact beside each capability toggle.
5. Require validation before publish controls unlock.
6. Export both human docs and machine manifests.

## Interface Sections

- Pack identity: ID, name, summary, category, tags.
- Behavior: role, workflow, constraints, output contract.
- Parameters: fields, defaults, enums, required values.
- Permissions: capabilities and approvals.
- Resources: files, URLs, checksums.
- Review: manifest preview, docs preview, validation results.

## Resources

- Use `assets/authoring-flow.json` as a state-machine baseline.
- Read `references/form-fields.md` before designing the editor.
