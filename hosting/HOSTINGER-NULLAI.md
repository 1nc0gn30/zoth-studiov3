# Host Zoth / NullAI on Hostinger — `nullai.tech`

**Decision (2026-08-16):** `https://nullai.tech` is the **main public domain** for this project.
`zoth.nealfrazier.tech` becomes a redirect / alias, not the brand home.

This is a plan. Do not cut DNS or overwrite the live NullAI homepage until @user confirms the apex vs subdomain choice.

---

## What is already true

| Surface | Where it lives now | Public? |
|---------|--------------------|---------|
| Live site at `nullai.tech` | Existing NullAI “Decentralized Social Hub & Operator Tooling” (includes `/swarm`) | yes |
| Zoth public hub `public/` | Laptop Docker nginx `:8088`, optional Cloudflare Tunnel → `zoth.nealfrazier.tech` | optional |
| Studio harness | `127.0.0.1:8484` (Python ASGI + dashboard) | **never** |
| Vault daemon | `127.0.0.1:8787` | **never** |
| BYOK, GitHub token, rclone Drive | local `byok.json` / env | **never** |
| Agent bus | `agent-comms/` on this disk | **never** |

Hostinger can host the **public static hub**. It must not become the home of tokens, vault, chat, or agent terminals.

---

## Split the product

```
Visitors
   │
   ▼
nullai.tech  ── Hostinger (TLS + static files from zoth/public)
   │
   ├─ /            marketing + hangar + studio brochure
   ├─ /pets/       hologram hangar
   ├─ /studio/     launch pad (static)
   └─ /vault/      vault *UI shell only* — no daemon

Laptop (stays private)
   ├─ :8484  harness, GitHub/Drive tools, Generate, pets in chat
   ├─ :8787  Argon2id vault
   └─ agent-comms bus
```

`zoth.nealfrazier.tech` → 301 to the chosen public URL after cutover.

---

## Pick a Hostinger product

`nullai.tech` is already live. Prefer **not** dropping a new tree on top of `/` until we know what stays.

| Plan | Use for this project | Skip if |
|------|----------------------|---------|
| **Web / Cloud hosting** | Static `public/` via File Manager, Git, or SFTP. Cheap. Enough for the hub. | You need Docker, long-running Python, or custom nginx. |
| **VPS (KVM 2+)** | Nginx (or Caddy) + rsync/git of `public/`. Room to grow. Full root. | You only want a brochure site. |
| Shared WordPress-only | — | This is not a WP site. |

**Recommendation:** Hostinger **Cloud** or **VPS KVM 2** (2 vCPU / 8 GB) for `nullai.tech`. Cloud if the site stays static. VPS if we later add a public API or Docker.

Do **not** run `:8484` or `:8787` on Hostinger. Those hold keys.

---

## Domain layout (choose one)

@user picks. Agents do not invent a second brand.

| Option | URL | When |
|--------|-----|------|
| **A. Apex** | `https://nullai.tech/` | Replace / merge the current NullAI homepage with the Zoth hub. Highest risk to the live `/swarm` site. |
| **B. Studio host (safer)** | `https://studio.nullai.tech/` | Keep the existing apex. Zoth hub lives on a subdomain. Redirect `zoth.nealfrazier.tech` here. |
| **C. Path** | `https://nullai.tech/studio/` | Same host, no extra DNS. Easy to collide with whatever is already at `/studio`. |

**Safer first ship:** **B**. Promote to apex later if the homepage should be Zoth.

Also keep:

- `www.nullai.tech` → apex
- `zoth.nealfrazier.tech` → 301 to the chosen URL
- email / existing `/swarm` untouched until explicitly migrated

---

## What goes on Hostinger

**Upload** the contents of `13-creative-media/zoth/public/` as the web root (or as `/studio/` if option C).

Includes: landing, pets hangar, studio brochure, vault UI, assets (seal, mascot, media).

**Do not upload**

- `tools/null ai agent tools/local_null_ai_orchestrator/` (8484)
- `runtime/data/byok.json`, `conversations.json`
- vault daemon, agent-comms, rclone config, git bundles
- anything with `GITHUB_TOKEN`, `HOSTINGER_API_TOKEN`, Drive remotes

---

## Cutover steps

### 0. Confirm (human)

1. Hostinger plan: Cloud vs VPS.
2. Layout: A / B / C above.
3. Whether the current `nullai.tech` homepage stays.

### 1. DNS in hPanel

- If nameservers are already Hostinger, add records there.
- If the domain is on Cloudflare, either keep CF as DNS and point **A/AAAA/CNAME** at Hostinger, or move NS to Hostinger. Don’t do both.

Typical:

| Type | Name | Value |
|------|------|--------|
| A | `@` | Hostinger site IP (from hPanel) |
| CNAME | `www` | `nullai.tech` |
| CNAME | `studio` | Hostinger host (option B) |

Turn on Hostinger SSL (Let’s Encrypt) for every hostname.

### 2. Stage, don’t clobber

- Option B: create `studio.nullai.tech`, deploy `public/` there, test.
- Option A: deploy to a **staging** directory or `staging.nullai.tech` first.
- Keep a zip of the current `nullai.tech` document root before any overwrite.

### 3. Deploy `public/`

**Cloud / shared (SFTP):**

```bash
# from the zoth repo
rsync -avz --delete \
  --exclude '.git' \
  public/ \
  USER@HOSTINGER_HOST:public_html/
```

**VPS:**

```bash
# once: nginx root /var/www/nullai
rsync -avz --delete public/ root@VPS:/var/www/nullai/
```

Git deploy (if the Hostinger site is linked to `1nc0gn30/zoth`): set the publish directory to `public/`.

`HOSTINGER_API_TOKEN` in BYOK is for later automation only. First ship is SFTP/rsync so we can see the files.

### 4. Point the old name

Cloudflare Tunnel / DNS for `zoth.nealfrazier.tech`:

- 301 everything to `https://studio.nullai.tech$uri` (or apex).
- Leave the laptop `:8088` as a **local preview**, not the public origin.

### 5. Canonicals (after the URL is live)

Antigravity owns the **8088 / `public/`** hub. Then update:

- `<link rel="canonical">`, OG/Twitter, JSON-LD in `public/**/*.html`
- `public/llms.txt`, `public/agents.md`, `public/sitemap.xml`
- Hermes schemas that hard-code `zoth.nealfrazier.tech`

Do **not** mass-replace across the 133 other projects.

### 6. Smoke

- `https://…/` 200, HTTPS, seal + Zoth mascot load
- `/pets/`, `/studio/`, `/vault/` (UI only)
- `/swarm` on the apex still works if we chose B
- No `8484`, no `8787`, no token files in the Hostinger tree

---

## Agent lanes

| Agent | Owns |
|-------|------|
| **Grok** | This plan, 8484 harness, bus announce, Hostinger connector later |
| **Antigravity** | `public/` hub files, canonical/OG/sitemap once the URL is chosen |
| **Hermes** | Tool schemas / AX URLs that mention the old domain |
| **@user** | Hostinger login, plan pick, DNS, “don’t overwrite /swarm” |

Nobody pushes DNS or overwrites `nullai.tech` `/` without @user.

---

## Later (not this cutover)

- Hostinger API deploy from `/connect hostinger` once `HOSTINGER_API_TOKEN` is in BYOK.
- Optional Cloudflare in front of Hostinger for CDN (orange cloud → Hostinger origin).
- Private `deck.nullai.tech` **only** behind Cloudflare Access / VPN if we ever expose 8484. Default remains laptop-only.

---

## First actions when @user says go

1. Which layout: **A / B / C**?
2. Cloud or VPS?
3. Snapshot the current `nullai.tech` root.
4. Rsync `public/` to the staging host.
5. Then DNS + 301.
