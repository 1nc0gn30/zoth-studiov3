---
name: agent-pack-monetization
description: Design monetization, pricing, entitlement, billing, and access-control models for hosted AI-agent packs and skill marketplaces without exposing secrets or blocking public trust metadata. Use when adding paid packs, subscriptions, Stripe checkout, license tiers, or private registry access.
---

# Agent Pack Monetization

## Workflow

1. Decide what is paid: hosted access, premium packs, team governance, analytics, private registry, support, or publishing tools.
2. Keep public metadata visible even for paid packs: name, summary, permissions, trust, version, and docs preview.
3. Gate private resources server-side, never with frontend-only checks.
4. Use Stripe for checkout, subscriptions, invoices, and billing portal unless another provider is explicitly required.
5. Keep entitlement checks separate from manifest safety checks.
6. Document env vars, webhook events, product IDs, price IDs, and local dev flow.

## Models

- Free public registry with paid authoring tools.
- Paid private team registry.
- Premium verified packs.
- Enterprise allowlist and audit logs.
- Publisher revenue share.

## Rules

- Do not put Stripe secret keys in frontend code.
- Do not make safety metadata paid-only.
- Do not let expired billing bypass takedown or security workflows.
