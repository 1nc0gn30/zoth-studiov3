# Path Collision Notes — /studio/ on nullai.tech

**Layout C:** Deploy `public/` as `nullai.tech/studio/`. Same origin, no extra DNS. Same host, no extra DNS, but any existing or future `/studio` route on the apex can collide with the Zoth hub.

---

## Likely /studio collisions

| Collision | Source | Impact | Mitigation |
|-----------|--------|--------|------------|
| Existing `public_html/studio/` already contains unrelated files | Previous project, staging upload, or Hostinger demo | Old files shadow or interleave with Zoth pages | **Delete or archive** `public_html/studio/` before first rsync. Rsync `--delete` plus explicit `--exclude` list keeps the tree clean. |
| Future apex `/studio` route added by @user on nullai.tech | Custom landing, app segment, or marketing path | Nginx `location ^~ /studio/` would serve Zoth instead of the new apex route | Lock down: only add apex routes under paths **not** consumed by the Zoth subpath (`/pets/`, `/vault/`, `/swarm/` are safe). If a new `/studio` route is needed, move Zoth to Option B (`studio.nullai.tech`) — not a path rewrite. |
| Canonical / sitemap URLs still point to root-relative paths | `public/index.html`, `sitemap.xml`, JSON-LD | Search engines may index `nullai.tech/studio/` as `nullai.tech/` if canonicals aren’t updated | Update `<link rel="canonical">` to `https://nullai.tech/studio/...` after cutover. Update `sitemap.xml` lastmod and `llms.txt` citations. |
| `zoth.nealfrazier.tech/studio/` duplicate path | Old domain + new subpath = `/studio/studio/` | Broken links, 404s | Ensure 301 from `zoth.nealfrazier.tech/*` drops the redundant segment and lands on `nullai.tech/studio/`. Test both `/studio` and `/studio/`. |
| Hostinger default `public_html/` already has `index.html` at root | Existing site files | Apex homepage changes unexpectedly | Snapshot `public_html/` before deploy. Deploy only into `public_html/studio/`. Keep apex untouched unless Option A is explicitly chosen. |
| Hotlink / scraping of `/studio/assets/` from old domain | External sites referencing old paths | Bandwidth burn, stale cache | Keep `public_html/studio/` clean. Add `Cache-Control: no-cache` on HTML. Add `robots.txt` inside `/studio/` only if needed. |
| `studio.nullai.tech` accidentally created | Option B leftover or parallel test | Split traffic, SEO split | Do not create `studio.nullai.tech` in Layout C. If it exists, remove DNS or set it to 301 → `nullai.tech/studio/` to consolidate. |

---

## Recommended mitigations (deterministic)

1. **Pre-flight snapshot**
   ```bash
   rsync -avz --dry-run uXXXXX@hostinger.host:public_html/ ./hostinger-preflight-snapshot/
   ```

2. **Explicit directory creation**
   ```bash
   ssh uXXXXX@hostinger.host "mkdir -p public_html/studio"
   ```

3. **Rsync with exclusions + delete**
   Use the `--delete` and `--exclude` lists in `deploy-manifest.json`.

4. **Post-deploy path scan**
   ```bash
   ssh uXXXXX@hostinger.host "find public_html/studio -maxdepth 1 -type f | sort"
   ```

5. **Canonical lock**
   Update all canonicals, OG URLs, and JSON-LD `@id` to `https://nullai.tech/studio/` after the URL is confirmed live.

---

## Risk summary

Layout C is the lowest-cost option (no extra DNS, no apex overwrite) but carries the highest path-collision risk because the `/studio/` subtree lives under the same origin as whatever already occupies `nullai.tech/`. Any legacy `public_html/studio/` files, future apex `/studio` routes, or stale `zoth.nealfrazier.tech/studio/` links can interleave with or shadow the Zoth hub. The mitigations above (pre-flight snapshot, explicit mkdir, rsync delete, and canonical updates) are deterministic and cheap; follow them before and after every deploy to keep the subtree isolated and unambiguous.
