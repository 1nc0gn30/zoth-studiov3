---
name: agent-pack-governance
description: Define governance for hosted AI-agent pack registries, including ownership, review gates, release approvals, deprecation, publisher policy, version control, incident response, and registry trust tiers. Use when creating operational rules for a public or team skill marketplace.
---

# Agent Pack Governance

## Workflow

1. Define owner, maintainer, reviewer, and publisher roles.
2. Set review gates by risk level.
3. Require manifest validation, permission review, and checksum generation before publish.
4. Track deprecations and security incidents in machine-readable fields.
5. Document rollback and takedown rules.

## Trust Tiers

- `experimental`: visible warning, not promoted.
- `reviewed`: validated and manually reviewed.
- `verified-publisher`: publisher identity and provenance confirmed.
- `restricted`: available only to allowlisted users or teams.

## Resources

- Read `references/governance-policy.md` for baseline policy.
- Run `scripts/governance_check.py manifest.json` for minimum release gate checks.
