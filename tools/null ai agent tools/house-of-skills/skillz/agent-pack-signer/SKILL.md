---
name: agent-pack-signer
description: Add signing, checksum, integrity, provenance, and verification workflows to hosted AI-agent packs, manifests, registry entries, and release archives. Use when a hosted skill marketplace needs tamper evidence, SHA-256 manifests, publisher identity, or install-time verification before activation.
---

# Agent Pack Signer

## Workflow

1. Generate checksums for every published manifest, instruction file, resource, and archive.
2. Put checksums beside immutable versioned releases, not only in the registry.
3. Include publisher, signing key identifier, release timestamp, and source repository when available.
4. Verify checksums before install or activation.
5. Treat checksum mismatch as a hard failure.
6. Use cryptographic signatures when a signing key process exists; otherwise ship SHA-256 as the minimum baseline.

## Rules

- Never sign mutable `latest` content as if it were immutable.
- Never publish private signing keys.
- Keep signatures detached from content where practical.
- Make verification output human-readable and machine-readable.

## Resources

- Read `references/provenance-fields.md` for manifest fields.
- Run `scripts/checksum_tree.py <dir> --out checksums.txt` for deterministic SHA-256 output.
