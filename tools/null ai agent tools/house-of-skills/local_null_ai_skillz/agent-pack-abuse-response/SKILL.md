---
name: agent-pack-abuse-response
description: Build abuse reporting, quarantine, takedown, incident response, and user notification workflows for malicious or unsafe hosted AI-agent packs and registries. Use when a marketplace needs reporting flows, blocklists, emergency revocation, or response runbooks for remote skill abuse.
---

# Agent Pack Abuse Response

## Workflow

1. Classify report severity.
2. Preserve evidence: manifest URL, version, checksum, report text, timestamp.
3. Quarantine high-risk packs by removing them from registry discovery while preserving immutable evidence.
4. Notify affected users when a pack was installed or activated.
5. Publish an incident note for confirmed high-impact abuse.
6. Add detection rules to prevent recurrence.

## Severity

- Critical: credential theft, destructive actions, malware, hidden exfiltration.
- High: policy override, unsafe shell, deceptive permissions.
- Medium: misleading docs, broken checksum, stale vulnerable dependency.
- Low: metadata errors, spam, duplicate pack.

## Resources

- Read `references/incident-runbook.md`.
- Run `scripts/classify_report.py report.txt` for first-pass triage.
