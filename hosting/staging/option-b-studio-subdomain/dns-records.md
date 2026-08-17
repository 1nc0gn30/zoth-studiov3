# DNS records for hPanel — nullai.tech + studio.nullai.tech

## Prerequisites
- Nameservers for `nullai.tech` must point to Hostinger (NS1.DNS-PARKING.COM, NS2.DNS-PARKING.COM, etc.) **or** the DNS zone must be imported into hPanel if the domain is currently on another registrar.
- Do **not** mix Cloudflare proxy (orange cloud) with Hostinger origin A records for the same apex unless you are intentionally fronting Hostinger with Cloudflare. If Cloudflare manages the apex, add the records there and keep the orange cloud off for `studio` if you want Hostinger TLS, or keep it on and terminate at Cloudflare.

---

## Apex — `nullai.tech`

| Type | Name | Value | TTL | Notes |
|------|------|-------|-----|-------|
| A | `@` | `<HOSTINGER_APEX_IP>` | 3600 | Points the apex to Hostinger. IP is visible in hPanel → Hosting → Details. |
| A | `@` | `<HOSTINGER_APEX_IPV6>` | 3600 | Optional AAAA if Hostinger provides IPv6. |
| CNAME | `www` | `nullai.tech` | 3600 | www → apex. |

> **Do NOT** overwrite or delete existing apex records that serve the current `nullai.tech` homepage unless the operator explicitly confirms cutover. Layout B keeps the apex as-is.

---

## Subdomain — `studio.nullai.tech`

| Type | Name | Value | TTL | Notes |
|------|------|-------|-----|-------|
| CNAME | `studio` | `<HOSTINGER_SUBDOMAIN_TARGET>` | 3600 | Points to the Hostinger-assigned subdomain host, e.g. `s40195.hostinger-test.com` or the dedicated Hostinger hostname. |

> In hPanel this may appear as an **A** record if the panel resolves the CNAME to a fixed IP. If you only see A/CNAME, use:
> - Type: **CNAME**
> - Name: `studio`
> - Target: the Hostinger hostname shown in **Hosting → Details** (often `hostingXXXXX.hostinger.com` or similar).
>
> If hPanel forces a numeric A record, ask the operator for the exact IP in Hosting Details and enter:
> - Type: **A**
> - Name: `studio`
> - Value: `<HOSTINGER_SUBDOMAIN_IP>`

---

## Redirect surface — `zoth.nealfrazier.tech`

This domain is currently served via Cloudflare Tunnel from `:8088`. Update its origin rule or DNS after `studio.nullai.tech` is live:

- If managed in Cloudflare DNS / Tunnel: change the Tunnel ingress from `http://127.0.0.1:8088` to a **301 redirect** to `https://studio.nullai.tech/$1` (or simpler: set a **Page Rule** → *Forwarding URL (301)*).
- If managed as an external CNAME in hPanel (not recommended while on Cloudflare): CNAME `zoth` → `studio.nullai.tech`.

---

## SSL

- In hPanel → **Hosting** → **SSL** → enable **Let's Encrypt** for:
  - `nullai.tech`
  - `www.nullai.tech`
  - `studio.nullai.tech`
- Force HTTPS (redirect HTTP → HTTPS) in hPanel → **Hosting** → **SSL** → **Force HTTPS**.

---

## Verification steps after adding records

```bash
# 1. Check apex resolution
dig +short nullai.tech A
dig +short nullai.tech AAAA

# 2. Check subdomain resolution
dig +short studio.nullai.tech CNAME
# or if A record:
dig +short studio.nullai.tech A

# 3. Check propagation from outside the local network
curl -I https://studio.nullai.tech/
curl -I https://nullai.tech/
```

Expected:
- `studio.nullai.tech` returns 200 from Hostinger nginx (not from `:8088`).
- `nullai.tech` returns the existing live homepage (Layout B preserves apex).
