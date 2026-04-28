---
name: agent-pack-policy-linter
description: Lint hosted AI-agent packs, manifests, instructions, and resources for unsafe permissions, prompt-injection phrases, missing trust metadata, mutable release risks, secret exposure, and policy violations before publication or activation.
---

# Agent Pack Policy Linter

## Workflow

1. Scan manifest fields for missing schema, permissions, trust, and compatibility.
2. Scan instruction text for policy override and stealth phrases.
3. Scan scripts and docs for credential references or destructive commands.
4. Produce findings with severity and remediation.
5. Block publication on critical or high findings.

## Resources

- Read `references/lint-rules.md`.
- Run `scripts/lint_pack.py <pack-dir>`.
