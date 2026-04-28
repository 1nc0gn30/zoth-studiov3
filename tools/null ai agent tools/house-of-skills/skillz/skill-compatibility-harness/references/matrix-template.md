# Compatibility Matrix

| Target | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| Codex skill | pass/fail/blocked | SKILL.md validation | |
| Hosted registry | pass/fail/blocked | registry.json check | |
| Fetch client | pass/fail/blocked | checksum and preview | |
| Static site | pass/fail/blocked | build output | |
| Security review | pass/fail/blocked | audit findings | |

## Status Definitions

- `pass`: Verified in current run.
- `fail`: Checked and failed with evidence.
- `blocked`: Could not run because dependency, network, credentials, or target runtime was unavailable.
