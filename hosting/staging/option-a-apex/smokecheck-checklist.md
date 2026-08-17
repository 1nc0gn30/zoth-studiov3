# Smokecheck Checklist — Layout A (apex)

Verify after rsync + DNS cutover to `nullai.tech`.

## HTTP basics

- [ ] `https://nullai.tech/` returns `200` and shows Zoth hub (not old NullAI home)
- [ ] `https://www.nullai.tech/` returns `301` -> `https://nullai.tech/`
- [ ] `https://nullai.tech/robots.txt` returns `200` and contains the expected rules
- [ ] `https://nullai.tech/sitemap.xml` returns `200` and `lastmod` is recent

## Public pages

- [ ] `https://nullai.tech/pets/` returns `200` and the hologram hangar loads
- [ ] `https://nullai.tech/studio/` returns `200` (static launch pad)
- [ ] `https://nullai.tech/vault/` returns `200` (UI shell only)
- [ ] `https://nullai.tech/llms.txt` returns `200` and contains public facts
- [ ] `https://nullai.tech/agents.md` returns `200`

## Assets and caching

- [ ] `https://nullai.tech/og-image.png` returns `200` and is public cacheable
- [ ] `https://nullai.tech/site.js` returns `200` with `Cache-Control: max-age=86400`
- [ ] CSS files return `200` with short-term cache headers

## Security headers

- [ ] `curl -I https://nullai.tech/` shows:
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Content-Security-Policy` set (no `unsafe-eval`, no `blob:` in script-src)
  - [ ] `server_tokens` not exposing nginx/PHP version
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`

## Redirects

- [ ] `curl -I https://zoth.nealfrazier.tech/` returns `301` -> `https://nullai.tech/`
- [ ] `curl -I https://zoth.nealfrazier.tech/pets/` returns `301` -> `https://nullai.tech/pets/`

## Negative checks (must not exist or must 404)

- [ ] `https://nullai.tech/api/` returns `404`
- [ ] `https://nullai.tech/dashboard/` returns `404`
- [ ] `https://nullai.tech/ws/` returns `404`
- [ ] `https://nullai.tech/vault/daemon` returns `404`
- [ ] `https://nullai.tech/tools/` returns `404`
- [ ] `https://nullai.tech/.git/` returns `404`
- [ ] `https://nullai.tech/.env` returns `404`
- [ ] `https://nullai.tech/byok.json` returns `404`

## File system checks

- [ ] No `.env` files in `public_html/`
- [ ] No `tools/` tree inside `public_html/`
- [ ] No `byok.json` inside `public_html/`
- [ ] No `agent-comms/` inside `public_html/`
- [ ] File permissions: directories `755`, files `644`, no `777`
- [ ] No hidden dotfiles leaked to root (`.git`, `.svn`)
