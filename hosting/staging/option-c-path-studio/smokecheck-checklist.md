# Smokecheck Checklist — Layout C (nullai.tech/studio/)

Run after every deploy to `public_html/studio/`. Mark each check as **PASS** or **FAIL**.

---

## 1. Apex / subpath reachability

- [ ] `https://nullai.tech/studio/` → **HTTP 200**
- [ ] `https://nullai.tech/studio` (no trailing slash) → **301 → /studio/** then **200**
- [ ] `https://nullai.tech/` (apex) still serves the intended homepage or placeholder → **HTTP 200**

## 2. Static assets

- [ ] `https://nullai.tech/studio/assets/` opens / lists
- [ ] Any key image (e.g. `/studio/zoth_logo.png`) returns **200**, not **403/404**
- [ ] CSS loads: `/studio/styles.css` → **200**, `Content-Type: text/css`
- [ ] JS loads: `/studio/site.js` → **200**, `Content-Type: application/javascript`

## 3. SPA / clean URLs

- [ ] `/studio/pets/` → **200** (pet hangar)
- [ ] `/studio/vault/` → **200** (vault UI shell)
- [ ] `/studio/studio/` → **404** (no double-mounted path)
- [ ] Deep link inside studio, e.g. `/studio/models.html` → **200** (no redirect to apex)

## 4. Security headers

Run for `/studio/` and a deep link:
```bash
curl -sI https://nullai.tech/studio/ | grep -E 'X-Frame-Options|X-Content-Type-Options|Content-Security-Policy'
```

- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Content-Security-Policy` present
- [ ] `server_tokens off` → header does not reveal nginx version

## 5. Cache headers

```bash
curl -sI https://nullai.tech/studio/zoth_logo.png | grep -i cache-control
curl -sI https://nullai.tech/studio/styles.css | grep -i cache-control
curl -sI https://nullai.tech/studio/ | grep -i cache-control
```

- [ ] Images: `public, max-age=604800`
- [ ] CSS/JS: `public, max-age=86400, must-revalidate`
- [ ] HTML: `no-cache` (or equivalent)

## 6. Old domain redirect

```bash
curl -sI https://zoth.nealfrazier.tech/ | grep -i location
```

- [ ] `zoth.nealfrazier.tech/` → **301** → `https://nullai.tech/studio/`
- [ ] `zoth.nealfrazier.tech/pets` → **301** → `https://nullai.tech/studio/`
- [ ] No **200** response serves content from `zoth.nealfrazier.tech` after redirect

## 7. SEO / AI engine files

- [ ] `https://nullai.tech/studio/llms.txt` → **200**, `Content-Type: text/plain`
- [ ] `https://nullai.tech/studio/ai.txt` → **200**, `Content-Type: text/plain`
- [ ] `https://nullai.tech/studio/robots.txt` → **200**
- [ ] `https://nullai.tech/studio/sitemap.xml` → **200**, `Content-Type: application/xml`

## 8. Private path blocks (must never serve)

```bash
curl -sI https://nullai.tech/studio/api/health
curl -sI https://nullai.tech/studio/dashboard/
curl -sI https://nullai.tech/studio/ws/
```

- [ ] `/studio/api/` → **404**
- [ ] `/studio/dashboard/` → **404**
- [ ] `/studio/ws/` → **404**

## 9. File integrity

```bash
ssh uXXXXX@hostinger.host "find public_html/studio -maxdepth 2 -type f | wc -l"
ssh uXXXXX@hostinger.host "diff -rq public_html/studio/ ~/zoth/public/ 2>/dev/null | head -20"
```

- [ ] File count matches expected deployment (no partial rsync)
- [ ] No unexpected files from previous `public_html/studio/` contents
- [ ] No `.git/`, `tools/`, `vault-daemon/`, or `.env*` present

## 10. Canonical / URL sanity

- [ ] `<link rel="canonical">` in any sampled HTML page points to `https://nullai.tech/studio/...`
- [ ] JSON-LD `@id` uses `nullai.tech/studio/` (not `zoth.nealfrazier.tech`)

---

## Failure triage

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `/studio/` returns **403** | Permissions on `public_html/studio/` | `chmod 755` on directories, `644` on files |
| `/studio/` returns old content | Rsync `--delete` not used / stale `public_html/studio/` | Re-run rsync with `--delete` |
| `/studio/studio/` returns **200** | Double mount or old directory | Clean `public_html/studio/studio/` |
| Assets **404** | Case sensitivity or wrong `alias` path in nginx | Verify `alias` matches upload path exactly |
| Canonicals still point to old domain | Not yet updated in source HTML | Update in `public/*.html`, re-deploy |
| `zoth.nealfrazier.tech` still serves content | Redirect not set in CF / hPanel | Add 301 rule; confirm with `curl -I` |
| `/api/` or `/dashboard/` returns something | nginx snippet not mounted | Verify `server` block is active on Hostinger |
