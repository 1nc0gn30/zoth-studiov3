# Host `zoth.nealfrazier.tech` on this PC (sandboxed)

**Goal:** Public subdomain of `nealfrazier.tech`, served from **this machine**, without installing a permanent host nginx/cloudflared stack that can mess with the laptop.

## Architecture (recommended)

```
Visitors
   │
   ▼
Cloudflare DNS + CDN (orange cloud)
   │  HTTPS terminates at Cloudflare
   ▼
Cloudflare Tunnel (outbound only — no open ports on the laptop)
   │
   ▼
Docker network  zoth-net
   │
   ├─ cloudflared  (profile: tunnel)
   └─ nginx        → serves  ../public  (static hub only)
         ▲
         │  local preview only
         └── 127.0.0.1:8088  (loopback — not LAN-wide)
```

**Not exposed by default**

| Service | Port | Public? |
|---------|------|---------|
| Public hub (static) | tunnel → nginx | ✅ yes |
| Local preview | 127.0.0.1:8088 | laptop only |
| Vault UI (static under hub) | 127.0.0.1:8088/vault/ | laptop only (static also on public hub) |
| **Vault daemon** | **127.0.0.1:8787** | **❌ never public — host loopback only** |
| Orchestrator dashboard | 127.0.0.1:8484 | ❌ private |
| Studio proxy (optional) | 127.0.0.1:8089 | ❌ private until Access/auth |

This keeps the full Zoth studio and vault secrets API off the public internet while the marketing/docs hub is reachable at `https://zoth.nealfrazier.tech`.

---

## Why Cloudflare Tunnel (not port-forward + bare nginx)

| Approach | Pros | Cons |
|----------|------|------|
| **Tunnel (this stack)** | No router ports; works on CGNAT/Wi‑Fi; Cloudflare HTTPS; easy DNS CNAME; laptop IP can change | Laptop must be awake + stack running |
| Port-forward 80/443 | Simple | Exposes laptop; dynamic IP; sleep kills site; security risk |
| Host nginx install | Familiar | Pollutes system packages; fights Parrot defaults |

**Sandboxing**

- All services are **Docker containers**
- **No host network mode**
- **Loopback-only** published ports
- **CPU/RAM limits** on containers
- **read_only** root FS + dropped capabilities
- Token lives in `hosting/.env` (gitignored)

---

## One-time Cloudflare setup

### 1) Domain on Cloudflare

1. Cloudflare dashboard → domain **nealfrazier.tech** must use Cloudflare nameservers.
2. Zero Trust (or “Networks”) → **Tunnels** → **Create a tunnel**
3. Name it e.g. `zoth-home`
4. Choose **Docker** connector → copy the token  
   (`eyJhIjoi...`)

### 2) Public hostname on the tunnel

In the tunnel config → **Public Hostname** → Add:

| Field | Value |
|-------|--------|
| Subdomain | `zoth` |
| Domain | `nealfrazier.tech` |
| Type | `HTTP` |
| URL | `http://web:80` |

> Important: service name is **`web`** (compose service name on `zoth-net`).  
> Cloudflare’s UI is for the *connector*; when cloudflared runs **inside** this compose file it resolves `web` via Docker DNS.

If you created the tunnel route in the dashboard, set the service to:

```text
http://web:80
```

(If Cloudflare only allows hostnames after connect, you can set this after first `docker compose --profile tunnel up`.)

### 3) DNS record

Tunnel UI usually creates:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `zoth` | `<tunnel-id>.cfargotunnel.com` | **Proxied** (orange) |

If not auto-created, add that CNAME manually under **nealfrazier.tech** DNS.

### 4) SSL/TLS

- SSL/TLS mode: **Full** is fine (Cloudflare ↔ tunnel is encrypted; origin is HTTP inside Docker only).
- Always Use HTTPS: on

---

## Install / run on this laptop

### Prerequisites

- Docker Engine + Compose plugin (already present: Docker 26.x)
- This repo path mounted (external drive)

### Start local preview (no public DNS yet)

```bash
cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/hosting
chmod +x scripts/*.sh
./scripts/up.sh local
# → http://127.0.0.1:8088/
```

### Start public tunnel

```bash
cp .env.example .env
# paste CLOUDFLARE_TUNNEL_TOKEN=...

./scripts/up.sh tunnel
# → https://zoth.nealfrazier.tech/
```

### Stop (full cleanup of this stack)

```bash
./scripts/down.sh
```

Does **not** touch host nginx, other containers, or system packages.

### Status / health

```bash
./scripts/status.sh
# vault stack (hub + /vault/ + daemon :8787):
./scripts/vault-stack-status.sh
```

---

## Local vault stack (zoth-web + vault-daemon)

The BYOK vault UI is static files under `public/vault/`. The **security boundary** is the Rust **vault-daemon** on host loopback. Run both processes for full local use.

### Recommended architecture

```
Browser (this laptop only)
   │
   ├─► http://127.0.0.1:8088/           zoth-web (Docker nginx → ../public)
   │      └─ /vault/                    static UI (JS probes daemon)
   │
   └─► http://127.0.0.1:8787/           vault-daemon (host process, loopback bind)
          └─ /health, /v1/*             secrets API — NEVER public
```

**Why direct browser → :8787 (preferred)**

- Daemon stays on `127.0.0.1` (see `vault-daemon/scripts/run-local.sh` — no `0.0.0.0`)
- No Docker bridge hop; no risk of accidentally putting secrets behind the Cloudflare Tunnel
- UI already probes `http://127.0.0.1:8787` then `http://localhost:8787` and falls back to browser `localStorage` if offline

### How to run (two terminals)

```bash
# Terminal A — static hub + vault UI
cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/hosting
./scripts/up.sh local
# → http://127.0.0.1:8088/
# → http://127.0.0.1:8088/vault/

# Terminal B — vault daemon (host, not in compose)
cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/13-creative-media/zoth/vault-daemon
./scripts/run-local.sh
# → http://127.0.0.1:8787/health
```

### Status (all three endpoints)

```bash
cd …/zoth/hosting
chmod +x scripts/vault-stack-status.sh
./scripts/vault-stack-status.sh
```

Checks:

| Probe | Expect |
|-------|--------|
| `http://127.0.0.1:8088/` | HTTP 200 |
| `http://127.0.0.1:8088/vault/` | HTTP 200 (vault page) |
| `http://127.0.0.1:8787/health` | body mentions `zoth-vault-daemon` |
| `http://127.0.0.1:8787/v1/status` | JSON status |

Exit code `0` only if all pass. Env overrides: `ZOTH_HUB_URL`, `ZOTH_VAULT_URL`, `ZOTH_CURL_TIMEOUT`.

### Vault security (non-negotiable)

| Rule | Detail |
|------|--------|
| **Never expose :8787 publicly** | No port-forward, no LAN bind, no Cloudflare Public Hostname to the daemon |
| **Never bind daemon to `0.0.0.0`** | Default is `127.0.0.1`. Do not pass `--i-understand-network-risk` unless you accept full network exposure |
| **CF tunnel = static hub only** | Tunnel service URL stays `http://web:80` (compose nginx). Do **not** add a tunnel route for 8787 or `/vault-api/` |
| **Public `/vault/` is UI only** | Static JS/HTML may be on the public hub; without a local daemon on the visitor’s machine, secrets stay browser-fallback or unavailable — operator secrets never leave this laptop’s daemon |
| **Compose stays bridge** | Do not switch the hub to `network_mode: host` just to proxy the vault |

### Optional: nginx `/vault-api/` proxy (advanced, not recommended)

Same-origin proxy is **optional** and **not** the preferred security model. Prefer browser → `127.0.0.1:8787` direct.

If you still need it for a private experiment:

1. **Do not** add the location to `nginx/default.conf` (that vhost is tunnel-facing).
2. See commented example: [`nginx/vault-api.snippet.example.conf`](nginx/vault-api.snippet.example.conf).
3. **Docker host network considerations:**
   - nginx in this compose uses a **bridge** network. Inside the container, `127.0.0.1` is the container itself — **not** the host daemon.
   - To reach the host daemon from a container you would need `proxy_pass http://host.docker.internal:8787/` **and** `extra_hosts: ["host.docker.internal:host-gateway"]` on that service (same pattern as `studio-proxy`).
   - That still only works for **local** preview. If the same location exists on the tunnel-facing `web` service, anyone hitting the public site could hit your laptop’s vault API — **unacceptable**.
   - Host-installed nginx (not used by this stack) could use `proxy_pass http://127.0.0.1:8787/;` on a loopback-only listen — still keep it off any public vhost.

**Bottom line:** keep the daemon on host loopback; let the browser talk to `:8787` directly; tunnel only static public content.

---

## Optional: local studio proxy (still private)

If the orchestrator is running on the host:

```bash
cd "…/tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve   # :8484
```

Then:

```bash
./scripts/up.sh studio
# → http://127.0.0.1:8089/  proxies to host :8484
```

**Do not** point the Cloudflare public hostname at the studio proxy until you add:

- Cloudflare Access (email OTP / Google) **or**
- nginx `auth_basic` **or**
- VPN-only access

---

## Laptop lifecycle notes

| Event | Effect | Mitigation |
|-------|--------|------------|
| Sleep / lid close | Site goes offline | Keep awake while “hosting”, or use a mini PC/NAS later |
| Wi‑Fi change | Tunnel reconnects automatically | Prefer tunnel over raw A record |
| External drive unplugged | Static files vanish | Keep zoth path on always-mounted disk or copy `public/` to internal SSD |
| `docker compose down` | Site offline | Intended sandbox off switch |

### Keep drive path reliable

If the USB path changes, either:

1. Symlink a stable path:  
   `ln -s /media/neo/f2fdda77-…/13-creative-media/zoth ~/zoth`
2. Or copy `public/` + `hosting/` to `~/zoth-hub` on internal disk for production hosting.

---

## Security checklist

- [x] Static public hub only on tunnel
- [x] Orchestrator not in tunnel by default
- [x] Vault daemon **not** in compose / tunnel — host `127.0.0.1:8787` only
- [x] Never publish daemon on `0.0.0.0` or open firewall ports for 8787
- [x] Prefer browser → daemon direct; optional `/vault-api/` proxy stays off public vhost
- [x] Containers: no-new-privileges, cap_drop ALL (minimal add-backs for nginx)
- [x] Memory/CPU limits
- [x] `.env` gitignored
- [ ] Cloudflare Bot Fight / WAF free rules (optional)
- [ ] Cloudflare Access if you later expose `/studio`
- [ ] Fail2ban not needed for tunnel (no open ports)

---

## Updating the site

Edit files under `../public/`, then:

```bash
# nginx mounts public read-only — changes are live immediately
# hard-refresh browser if CSS cached
```

Restart only if you change nginx/compose:

```bash
docker compose up -d web
```

---

## Troubleshooting

**Tunnel container restarts**

- Bad/expired token → recreate token in Cloudflare Zero Trust  
- Check: `docker logs zoth-tunnel`

**DNS not resolving**

- Wait 1–5 min for CNAME  
- Confirm orange-cloud proxy  
- `dig zoth.nealfrazier.tech +short`

**502 from Cloudflare**

- `web` container not healthy: `docker compose ps`  
- Public hostname service URL must be `http://web:80` (same Docker network)

**Host nginx conflict**

- This stack does **not** bind host :80/:443  
- Only `127.0.0.1:8088` — Parrot host nginx is untouched

**Vault daemon not detected / vault UI in browser fallback**

- Start daemon: `cd ../vault-daemon && ./scripts/run-local.sh`  
- Confirm: `curl -s http://127.0.0.1:8787/health`  
- Full check: `./scripts/vault-stack-status.sh`  
- Do **not** “fix” by binding daemon to LAN or adding it to the Cloudflare tunnel

---

## File map

```
hosting/
  docker-compose.yml
  HOSTING.md                      ← this file
  .env.example
  .gitignore
  nginx/default.conf              ← public hub (static only; no vault API)
  nginx/studio.conf               ← optional private studio proxy
  nginx/vault-api.snippet.example.conf  ← optional /vault-api/ notes (not mounted)
  scripts/up.sh
  scripts/down.sh
  scripts/status.sh
  scripts/vault-stack-status.sh   ← hub + vault page + daemon health
../public/                        ← site content (includes public/vault/)
../vault-daemon/                  ← Rust daemon (host process, not compose)
```
