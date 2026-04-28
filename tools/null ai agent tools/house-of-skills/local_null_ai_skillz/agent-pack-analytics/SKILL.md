---
name: agent-pack-analytics
description: Design privacy-safe analytics for hosted AI-agent skill marketplaces, registry usage, pack adoption, conversion funnels, fetch/install failures, retention, and search demand. Use when measuring hosted pack usage without collecting prompts, secrets, private files, or user content.
---

# Agent Pack Analytics

## Workflow

1. Define product questions before collecting data.
2. Use aggregate counters before user-level tracking.
3. Avoid prompt, file, and credential collection.
4. Segment by pack ID, version, runtime, status, and referrer class.
5. Report leading indicators: fetch success, activation, validation failure, rejection reason.

## Metrics

- Registry fetches.
- Manifest fetches by pack and version.
- Preview-to-install rate.
- Install-to-activation rate.
- Validation failures by reason.
- Search queries with zero results.
- Deprecated pack usage.

## Resources

- Read `references/metrics-plan.md`.
- Run `scripts/summarize_events.py events.jsonl` for local event summaries.
