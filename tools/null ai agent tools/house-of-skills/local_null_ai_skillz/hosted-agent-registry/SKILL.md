---
name: hosted-agent-registry
description: Build public websites or static endpoints that AI agents can fetch to discover hosted skills, parameter packs, command presets, manifests, and versioned agent transformation bundles. Use when creating an agent-readable registry, registry.json endpoint, skill catalog, hosted pack index, or fetchable website for AI-agent behavior modules.
---

# Hosted Agent Registry

## Core Workflow

1. Define the registry audience: Codex skills, ChatGPT Apps, local CLIs, browser agents, or a mixed ecosystem.
2. Publish a small static `registry.json` at a stable HTTPS URL before building richer UI.
3. Keep the registry machine-first: every visible website card should map to a manifest URL, version, checksum, and compatibility list.
4. Treat the website as documentation and discovery, not the source of truth. The manifest files are the source of truth.
5. Add strict cache and version semantics: immutable versioned packs plus a mutable `latest` pointer.
6. Validate generated registries with `scripts/build_registry.py` before deployment.

## Registry Shape

Use this minimum shape unless a target runtime requires another contract:

```json
{
  "schema_version": "agent-registry/v1",
  "name": "Neo Skill Registry",
  "updated_at": "2026-04-24T00:00:00Z",
  "packs": [
    {
      "id": "frontend-dark-ui",
      "name": "Frontend Dark UI",
      "version": "1.0.0",
      "summary": "Build mature dark UI screens.",
      "manifest_url": "https://example.com/packs/frontend-dark-ui/manifest.json",
      "checksum_sha256": "...",
      "compatibility": ["codex-skill"],
      "tags": ["frontend", "design"]
    }
  ]
}
```

## Hosting Rules

- Prefer static hosting for public registries: Netlify, Cloudflare Pages, GitHub Pages, or S3-compatible object storage.
- Use HTTPS only. Do not document HTTP fetch paths as acceptable production routes.
- Keep all secrets out of the registry. Hosted packs can describe required env vars but must never include values.
- Add `robots.txt` and sitemap when the registry has a public website UI.
- Add CORS only for static JSON assets that browser-based agents need to fetch.

## Versioning Rules

- Use semantic versions for pack releases.
- Never mutate content behind a versioned URL after publishing.
- Let `/latest/manifest.json` redirect or point to the newest stable version.
- Include deprecation notices in the registry before removing a pack.

## Resources

- Read `references/registry-contract.md` when designing an endpoint contract.
- Run `scripts/build_registry.py <packs-dir> <output-registry.json>` to build a registry from pack manifests.
