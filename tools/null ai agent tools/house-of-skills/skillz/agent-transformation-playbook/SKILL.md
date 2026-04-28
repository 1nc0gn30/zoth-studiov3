---
name: agent-transformation-playbook
description: Design end-to-end systems where a hosted website exposes AI-agent skills, manifests, parameter presets, and fetchable behavior packs that transform an agent based on user-selected command parameters. Use for architecture planning, productizing hosted agent packs, registry-to-client flows, trust models, and implementation roadmaps.
---

# Agent Transformation Playbook

## Workflow

1. Start with the transformation promise: what the fetched pack makes the agent better at.
2. Split the system into four layers: website, registry, manifest, runtime client.
3. Design parameters as a safe schema before writing prompts.
4. Add security review before install or activation.
5. Add compatibility validation before publishing.
6. Ship a thin v1: static registry, one pack, one fetch command, one clear activation path.

## Architecture

- Website: human discovery, SEO, docs, trust, changelog.
- Registry: machine-readable pack list at `/registry.json`.
- Pack: versioned manifest plus instructions and resources.
- Client: fetches, validates, previews, stages, and activates packs.
- Runtime: applies instructions inside existing local policy and approval rules.

## Recommended Build Order

1. Create one excellent pack manually.
2. Write its manifest and parameter schema.
3. Host it under immutable static paths.
4. Build a registry from it.
5. Build the fetch client.
6. Add marketplace UI.
7. Add publisher tooling.
8. Add compatibility and security harnesses.
9. Only then scale to many packs.

## Product Rules

- Do not sell “agent jailbreaks.” Sell auditable specialist modes.
- Make trust visible: checksum, permissions, version, publisher, source, changelog.
- Make parameters feel powerful but bounded.
- Avoid a marketplace full of shallow personas. Each pack should ship a workflow, validation rules, and resources.

## Resources

- Read `references/launch-checklist.md` for the v1 checklist.
