---
name: agent-pack-local-cache
description: Implement safe local caching for fetched hosted AI-agent packs, manifests, resources, checksums, and install previews. Use when designing cache directories, content-addressed storage, offline activation, invalidation, rollback, or quarantine for remote skill clients.
---

# Agent Pack Local Cache

## Workflow

1. Cache by content hash and source URL.
2. Store manifests in staging before install.
3. Keep installed packs separate from fetched-but-untrusted packs.
4. Add metadata: source URL, checksum, fetched time, verified time, activated time.
5. Support quarantine and rollback.
6. Never cache secrets or user prompts inside pack metadata.

## Directory Layout

```txt
cache/
  blobs/sha256/<digest>
  manifests/<pack-id>/<version>.json
  installed/<pack-id>/<version>/
  quarantine/<digest>/
  index.json
```

## Resources

- Read `references/cache-layout.md`.
- Run `scripts/cache_put.py <file> --cache <dir>` for content-addressed storage.
