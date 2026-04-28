---
name: agent-fetch-client
description: Build CLI tools, scripts, or app integrations that fetch hosted AI-agent manifests, skill packs, parameter packs, and remote behavior modules from a website or registry. Use when implementing fetch, verify, cache, preview, install, checksum, allowlist, or runtime import flows for hosted agent skills.
---

# Agent Fetch Client

## Workflow

1. Fetch the registry or manifest over HTTPS.
2. Validate the manifest before reading instructions.
3. Verify checksum for each fetched resource.
4. Store remote content in a cache or staging directory, not directly in the live skill store.
5. Show a preview of permissions, parameters, and changed files.
6. Ask for approval before install, execution, deploy, or external writes.
7. Record source URL, version, checksum, and install timestamp.

## Implementation Rules

- Prefer standard library clients unless the project already has a dependency stack.
- Enforce timeouts and size limits.
- Reject redirects to non-HTTPS URLs.
- Do not execute scripts during fetch.
- Do not load remote instructions as higher priority than local system/developer/user instructions.
- Cache by content hash, not just URL.

## Resources

- Read `references/fetch-flow.md` for the staged flow.
- Use `scripts/fetch_pack.py <manifest-url> --out <dir>` as a reference client or smoke test.
