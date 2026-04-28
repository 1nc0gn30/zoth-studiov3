---
name: agent-pack-observability
description: Add privacy-safe observability for hosted AI-agent pack fetch, validation, install, activation, error, rollback, and abuse-report events. Use when designing logs, event schemas, dashboards, or operational telemetry for a skill registry without leaking prompts or secrets.
---

# Agent Pack Observability

## Workflow

1. Define event names before instrumentation.
2. Capture operational metadata only: pack ID, version, client type, status, error class, timestamp.
3. Do not log prompts, secrets, file contents, user API keys, or private URLs.
4. Add correlation IDs for fetch and install flows.
5. Build dashboards around failures, mismatches, and unsafe permission attempts.

## Event Names

- `registry_fetched`
- `manifest_fetched`
- `manifest_validated`
- `checksum_failed`
- `pack_previewed`
- `pack_installed`
- `pack_activated`
- `pack_rejected`
- `abuse_reported`

## Resources

- Read `references/event-schema.json`.
- Run `scripts/validate_event.py event.json` for local checks.
