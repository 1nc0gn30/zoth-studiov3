---
name: agent-permission-modeler
description: Design safe permission scopes, approval boundaries, capability labels, and trust levels for hosted AI-agent packs and remote skills. Use when deciding what a pack may read, write, fetch, execute, deploy, publish, bill, or access before an agent activates it.
---

# Agent Permission Modeler

## Workflow

1. Inventory every requested capability.
2. Classify each capability by impact: low, medium, high, critical.
3. Split capability intent from permission grant.
4. Require user approval for high-impact operations.
5. Put permission declarations into manifest `trust.permissions` and `trust.requires_user_approval`.
6. Lint with `scripts/model_permissions.py manifest.json`.

## Permission Labels

- `read-workspace`
- `write-workspace`
- `run-tests`
- `shell-readonly`
- `shell-write`
- `network-fetch`
- `external-write`
- `deploy-preview`
- `deploy-production`
- `read-secrets`
- `payment-action`

## Rules

- Default to no extra permissions.
- Do not combine `read-secrets` with `network-fetch` unless the flow is audited and user-approved.
- Treat production deploys, payments, destructive deletes, and credential access as critical.
