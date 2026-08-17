# Smokecheck Checklist — studio.nullai.tech

Run these checks after rsync, after nginx config reload, and after DNS propagation.

## 1. DNS resolution

```bash
dig +short studio.nullai.tech A
dig +short studio.nullai.tech CNAME
dig +short nullai.tech A
dig +short www.nullai.tech CNAME
```

Expected:
- `studio.nullai.tech` resolves to Hostinger IP (not `127.0.0.1`).
- `nullai.tech` still resolves to the existing apex host.

## 2. HTTP headers (probe from outside the local network)

```bash
curl -I https://studio.nullai.tech/
```

Expected headers:
- `HTTP/2 200`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` present
- `server` header hidden or set to `nginx` (not exposing version)

```bash
curl -I http://studio.nullai.tech/
```

Expected: `301` to `https://studio.nullai.tech/` (if Force HTTPS is enabled in hPanel).

## 3. Exact URLs and paths

| Check | Command | Expected |
|-------|---------|----------|
| Hub root | `curl -s https://studio.nullai.tech/ \| grep -o '<title>.*</title>'` | Contains `Zoth` or expected brand title |
| Sitemap | `curl -s https://studio.nullai.tech/sitemap.xml` | XML with `<urlset>` and `lastmod` dates |
| robots | `curl -s https://studio.nullai.tech/robots.txt` | Non-empty; `User-agent: *` or equivalent |
| llms.txt | `curl -s https://studio.nullai.tech/llms.txt` | Non-empty; answer-engine data present |
| ai.txt | `curl -s https://studio.nullai.tech/ai.txt` | Non-empty; answer-engine data present |
| humans.txt | `curl -s https://studio.nullai.tech/humans.txt` | Non-empty |
| agents.md | `curl -s https://studio.nullai.tech/agents.md` | Non-empty; markdown or text |
| Pets hangar | `curl -s https://studio.nullai.tech/pets/ \| grep -i 'hologram\|hangar\|pets'` | Brand / hangar copy present |
| Studio brochure | `curl -s https://studio.nullai.tech/studio/` | Studio brochure loads (no 404) |
| Vault UI shell | `curl -s https://studio.nullai.tech/vault/` | Vault shell loads (no daemon, just UI) |
| Asset (CSS) | `curl -sI https://studio.nullai.tech/styles.css` | `200`, `Content-Type: text/css`, `Cache-Control` |
| Asset (JS) | `curl -sI https://studio.nullai.tech/site.js` | `200`, `Content-Type: application/javascript` |
| Favicon | `curl -sI https://studio.nullai.tech/favicon.png` | `200`, image type |
| Seal/mascot | `curl -sI https://studio.nullai.tech/logo.png` | `200`, image type |
| 404 path | `curl -s -o /dev/null -w "%{http_code}" https://studio.nullai.tech/does-not-exist.html` | `404` |
| Hidden file | `curl -s -o /dev/null -w "%{http_code}" https://studio.nullai.tech/.env` | `404` or `403` |

## 4. Redirect chain

```bash
curl -I https://zoth.nealfrazier.tech/
```

Expected: `301` to `https://studio.nullai.tech/` (or `302` during testing; must be 301 before launch).

```bash
curl -I https://zoth.nealfrazier.tech/pets/
```

Expected: `301` preserving path to `https://studio.nullai.tech/pets/`.

## 5. SPA fallback

```bash
# If the hub uses client-side routing:
curl -s https://studio.nullai.tech/math-pillars.html
# Should return 200 with the HTML shell (not 404)
```

If the app is pure-static HTML (not SPA), this should also return 200.

## 6. Source integrity

```bash
# On Hostinger via SSH or File Manager, verify no secrets are present:
# - No byok.json
# - No GITHUB_TOKEN, HOSTINGER_API_TOKEN, or .env files
# - No 8484/8787 daemons
# - No vault-daemon/ or agent-comms/ directories
```

## 7. Apex preservation

```bash
curl -I https://nullai.tech/
curl -I https://nullai.tech/swarm   # if the existing site has /swarm
```

Expected: Apex returns its existing homepage. Layout B must not overwrite apex content.

## Risk Summary

The primary risk in Layout B is **partial DNS collision and stale cache**: `studio.nullai.tech` may inherit an old Hostinger parking page, Cloudflare orange-cloud proxy, or a lingering SSL certificate if any prior project used that subdomain, and browsers or search engines can cache the 301 redirect from `zoth.nealfrazier.tech` before the new origin is verified healthy; if the apex `nullai.tech` records are touched during the same session, an accidental delete or TTL drop could knock the live homepage offline. Mitigation is strict sequencing: verify `studio.nullai.tech` resolves and passes the full smokecheck before switching any `zoth.nealfrazier.tech` redirect, and never edit apex records unless the operator confirms the cutover window.
