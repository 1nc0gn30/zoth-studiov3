---
name: agent-pack-search-seo
description: Improve search, filtering, metadata, structured data, sitemap coverage, catalog copy, internal links, and discoverability for hosted AI-agent pack marketplaces and registry websites. Use when making packs findable by humans, search engines, and AI agents.
---

# Agent Pack Search SEO

## Workflow

1. Generate unique title and meta description for every pack page.
2. Build search index data from manifest fields, not duplicate hand-written content.
3. Add filters for runtime, category, permission risk, trust tier, and use case.
4. Include manifest URL, checksum, and compatibility in visible page content.
5. Keep `/registry.json`, `/sitemap.xml`, and pack detail pages aligned.
6. Audit for missing canonical URLs and duplicate descriptions.

## Required Page Metadata

- Title: pack name plus use case.
- Description: unique summary with runtime and outcome.
- Canonical URL.
- H1 with pack name.
- Internal links to docs, trust, and related packs.

## Resources

- Read `references/search-index-fields.md`.
- Run `scripts/build_search_index.py registry.json --out search-index.json`.
