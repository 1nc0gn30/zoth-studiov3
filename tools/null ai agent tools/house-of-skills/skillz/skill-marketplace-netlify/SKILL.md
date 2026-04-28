---
name: skill-marketplace-netlify
description: Build and ship a polished Netlify-hosted website for browsing, documenting, and serving AI-agent skills, hosted manifests, parameter packs, registry.json files, install snippets, SEO pages, redirects, and static JSON endpoints. Use for public skill marketplaces, agent-pack catalogs, and fetchable hosted agent websites.
---

# Skill Marketplace Netlify

## Workflow

1. Choose static-first Astro, Vite, Vue, React, or vanilla MPA. Do not default to Next.js.
2. Make `/registry.json` and `/packs/.../manifest.json` first-class build artifacts.
3. Build human pages around machine artifacts: overview, pack detail, install/fetch snippets, trust page, changelog, and docs.
4. Add full SEO: title, description, canonical, headings, sitemap, robots, OG image, and internal links.
5. Add Netlify `_headers` and `_redirects` for JSON, immutable pack versions, and latest aliases.
6. Validate build and static files before deploy.

## Site Requirements

- Homepage explains what the registry does in one screen.
- Catalog page filters by runtime, category, and risk level.
- Pack detail page shows version, manifest URL, checksum, permissions, parameters, and install command.
- Trust page explains publisher verification and review process.
- Docs page shows how agents fetch, preview, and activate packs.
- Every JSON endpoint remains usable without JavaScript.

## Netlify Defaults

Use these headers for machine-readable files unless the project has stricter needs:

```txt
/registry.json
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=300

/packs/*/manifest.json
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=31536000, immutable
```

## Resources

- Read `references/site-map.md` before designing the IA.
- Use `assets/registry-json-example.json` as starter content.
