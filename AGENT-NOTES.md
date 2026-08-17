# AGENT-NOTES — zoth

**2026-08-13 late evening · Antigravity · session handoff (all dev servers killed & verified down)**

## Status: All Dev Servers Killed & Verified Clean
- **Hub (`:8088`)**: STOPPED (docker container `zoth-web` down)
- **Studio Deck (`:8484`)**: STOPPED (`orchestrator.py serve` terminated)
- **Vault Daemon (`:8787`)**: OFF
- **Spark (`:8765`) / Vite (`:4321`)**: STOPPED

## How to Resume
```bash
# 1. Start Public Hub (:8088)
cd hosting && ./scripts/up.sh local

# 2. Start Studio Operator Deck (:8484)
cd "tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve --host 127.0.0.1 --port 8484

# 3. (Optional) Run interactive local model CLI
ollama run zoth-ai:latest
```

## What Shipped This Session
1. **Local AI Model (`zoth-ai:latest`)**:
   - Built with open weights (`qwen2.5-coder:1.5b` base, GGUF Q4_K_M quantization, 1.5B parameters, ~986MB RAM footprint).
   - Training dataset expanded from 13 to **370 instruction pairs** (`zoth_training_dataset.jsonl`), ingesting all 298 tool specs, 15 Obsidian Vault categories, 9 companion doctrines, and Pour workflows.
   - Verified open weights transparency and cryptographic audit hashes in `zoth_ai_transparency_report.md` (SHA-256: `071bc0fc...`).
2. **Multi-Agent Swarm Router & Tool Dispatcher**:
   - Created `studio-agents/zoth_router.py` with intent classification (local inference, image gen, research, terminal commands).
   - Added `/api/zoth/swarm` endpoint to `asgi_app.py`.
   - Wired `zoth-ai` as default provider in `dashboard.html` and Contender #1 in the Model Fusion Arena.
3. **Responsive UI/UX Standards Pass**:
   - Enforced zero horizontal overflow, 44px+ touch targets, fluid mobile/tablet/desktop breakpoints across `styles.css`, `pets.css`, and `dashboard.html`.
4. **Automated Testing Suite (100% Pass Rate)**:
   - `python3 -m unittest tools/test_zoth_studio_api.py` (39/39 passed).
   - `python3 tools/verify_all_endpoints.py` (29/29 passed).
5. **Documentation**:
   - Created comprehensive `ZOTH_MASTER_DOCUMENTATION.md`.

---


**Later · operator stance**

Keep this while working the studio: we are not defending “vibe coding.” Local models suggest. We own binds, containment, and whatever we commit. If a physicist asks “did you derive the model?” the honest answer is no — we run open weights locally and review the output. If they ask “do you understand the stack?” the answer has to stay yes.

**2026-08-13 · grok · user stepping away — Pour + Bloom session**

## Pick up

Pour lives in the deck now. Not the old Bloom-foundry one-shot.

- **Use:** http://127.0.0.1:8484/#pour or http://127.0.0.1:8765/pour
- **Restart Spark:** `python3 /home/neo/rust-website/scripts/try_server.py`
- **Restart deck:** `cd ".../local_null_ai_orchestrator" && python3 orchestrator.py serve --host 127.0.0.1 --port 8484`
- **Hub:** http://127.0.0.1:8088/ (`zoth-web` docker). Launch pad card 07 → Pour.

Eight micro-steps, local Ollama (`smollm2:360m`, upgrade `qwen2.5-coder:1.5b`). Kit writes Zoth glass HTML into `/home/neo/rust-website/sites/<slug>/`.

`/pour` 404 is fixed. Next: run a full civilian walk and harden suggestion quality.

Full writeup: `/home/neo/rust-website/NOTES.md`

---

**2026-08-13 evening · grok · left mid-session (user stepping away)**

Pick up here. Hub + studio were left running.

## Running

| Surface | URL | Bind | Notes |
|---------|-----|------|--------|
| Public hub | http://127.0.0.1:8088/ | docker `zoth-web`, loopback | static `public/` |
| Studio deck | http://127.0.0.1:8484/ | `orchestrator.py serve --host 127.0.0.1 --port 8484` | uvicorn + Starlette |
| Vault daemon | :8787 | off | hangar/hub fail-soft |

Restart studio:

```bash
cd "13-creative-media/zoth/tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve --host 127.0.0.1 --port 8484
```

Hub: `cd hosting && ./scripts/up.sh local`  
Never bind studio/vault to `0.0.0.0` unless `--public`.

## This session (what shipped)

### Pets hangar (Three.js)
- `/pets/` — 9 neon logos as hologram stands, inspect drawer, domain chips.
- Bare `import "three"` broke in this browser (import map ignored). Fixed: full jsDelivr URL in `public/pets/pets.js`.
- Nginx: `location ^~ /pets/` like registry (no SPA fallback to hub).
- Hard-refresh `/pets/` if an old `pets.js` is cached (`?v=20260813d`).

### Pet knowledge packs (the real work)
Each companion now has doctrine + heal + briefing, not just an engage slogan.

On disk (studio, not public):

`tools/null ai agent tools/local_null_ai_orchestrator/pets/<id>/{SYSTEM,PLAYBOOK,CANON}.md`

Engine: `runtime/pet_knowledge.py`  
Seed: `pets/seed_packs.py`  
Heal: `python3 -m runtime.pet_knowledge heal-all`

Studio API (loopback :8484):

- `GET /api/pets` — roster + health
- `GET /api/pets/{id}` — full index
- `GET|POST /api/pets/{id}/brief?task=` — doctrine + matching notes + prompt
- `POST /api/pets/{id}/heal` or `/api/pets/all/heal`

Hermes `POST /api/hermes/chat` accepts `pet_id` and prepends that pet’s brief.

Public snapshot (no abs paths): `public/pets/packs.json`  
Export: `python3 tools/export-public-pets.py`  
Hangar loads snapshot, then upgrades from live `:8484` if up.

Studio Pets tab: **Heal knowledge** + Engage now calls `/api/pets/{id}/brief`.  
Alias: dashboard id `minion` → pack `radical-minion`.

Verified heal: all 9 `ready` (5–17 notes each). Lycan brief injects OWASP doctrine.

### Homepage (quality pass)
- Cut lag: no cursor, trail, stars, grain, orbs, magnetic buttons, ripples, hero videos, ticker, numbered rail, stat strip, HUD “MESH ONLINE”.
- Hero is still + type: “Local agents. Private deck.” Roster strip links `/pets/#id`.
- Header is `position: fixed` (sticky was overridden + `overflow-x: hidden` broke it).
- Pet modal is `position: fixed` again. `body.modal-open` only when overlay is real.
- Reveals no longer start at `opacity: 0` (first paint was blank).
- Features/arsenal use stills, not autoplay video.

## Key files

- `public/index.html`, `public/styles.css`, `public/site.js`
- `public/pets/{index.html,pets.js,pets.css,packs.json}`
- `hosting/nginx/default.conf`
- `runtime/asgi_app.py` (pet routes + hermes pet_id)
- `runtime/pet_knowledge.py`
- `orchestrator/.../pets/`

## Constraints still in force

- Hub static only. No `/api` proxy to studio/vault.
- Pets knowledge lives on the deck. Hub only shows the redacted snapshot.
- Lycan: defensive review only, no exploit payloads.
- Cyberpunk + restraint: one cyan accent, no more HUD gizmos unless asked.

## Good next steps (not started)

1. Studio Pets cards: show live health % / doc count from `/api/pets`.
2. Task run path: pick a pet → auto-heal if stale → attach brief to the run, not only Hermes chat.
3. Pixel-Neko heal after `orchestrator.py scan` (registry drift).
4. Sitemap/llms.txt mention `/pets/` (sitemap already has it; llms.txt may be stale).
5. Vault daemon was left down — start only if testing Pixel-Shiba / BYOK.

**2026-08-13 · grok · spark + studio**

- Pour is paced inside the deck: `http://127.0.0.1:8484/#pour` (iframe of `:8765`).
- Eight micro-steps: craft → audience → action → name → headline → three offers → look → pour.
- Local model only suggests. `scripts/spark_harness.py` + `pour.py` (Zoth glass theme) write the site.
- Weak 360M suggestions upgrade to `qwen2.5-coder:1.5b`. Creator tab stays the expert chip dump.

**2026-08-13 · grok**

## Backend containment

- Public nginx `^~ /api|/dashboard|/ws` → 404 (never SPA-fallback).
- Vault daemon client: every request timed; dead daemon flips to browser vault.
- Studio `serve` refuses `0.0.0.0` unless `--public`.
- Launch pad deep-links disable when `:8484` is down. Hub stays 200.
- `hosting/scripts/containment-check.sh` + `status.sh` treat surfaces independently.

**2026-08-12 · grok**

## SEO / AEO / AX

- README rewritten for the real stack (hub / studio / vault / daemon).
- `public/llms.txt`, `ai.txt`, `agents.md`, `humans.txt` are citation sources.
- Homepage JSON-LD: Organization + WebSite + SoftwareApplication + FAQPage + BreadcrumbList.
- `/studio/` and `/vault/` have unique titles, descriptions, canonicals, OG, JSON-LD.
- Vault is indexable (product page; secrets never leave the device).
- Sitemap lists hub, studio, vault, llms.txt, agents.md.

**2026-08-11 · grok**

## Homepage UX pass (2026-08-11 later)

- Full section map: overview → systems → pipeline → pets → arsenal → hosting → run → FAQ
- Fonts: **Outfit** (display) + **Inter** (UI) + **JetBrains Mono** (code)
- Scroll: IntersectionObserver reveals, hero multi-layer parallax, media parallax, pet tilt, active nav + progress rail
- Media: new stills (registry/arsenal/BYOK/nebula) + smoother Ken Burns MP4s
- Imagine video still **ZDR-blocked** (`output.upload_url` required) — see `public/assets/media/IMAGINE_VIDEO_NOTE.md`
- Scripts: `public/site.js`

## Ship pass

Created a **deployable public hub** for the flagship (previously `live_url: None`):

| Path | Purpose |
|------|---------|
| `public/` | Static marketing/docs hub (SEO + AEO complete) |
| `netlify.toml` | Publish `public/`, security headers |
| `tools/null ai agent tools/local_null_ai_orchestrator/` | Full local studio (`orchestrator.py serve` → **:8484**, `dashboard.html`) |

### Public hub includes

- JSON-LD SoftwareApplication + WebSite + FAQPage
- skip-link, FAQ, run instructions for :8484 / :4321
- robots.txt, sitemap.xml, llms.txt, ai.txt
- og-image.png (1200×630), favicon

### Hosting model (local PC + Cloudflare subdomain)

**Not Netlify.** `zoth.nealfrazier.tech` is meant to be served from this machine, sandboxed:

```
hosting/                 # Docker Compose: nginx + optional cloudflared
hosting/HOSTING.md       # full Cloudflare Tunnel + DNS guide
public/                  # static hub content
```

```bash
cd hosting
./scripts/up.sh local    # http://127.0.0.1:8088/
# after Cloudflare tunnel token in hosting/.env:
./scripts/up.sh tunnel   # https://zoth.nealfrazier.tech/
./scripts/down.sh        # stop sandbox (host system untouched)
```

- **Public:** static hub only (via Cloudflare Tunnel)
- **Private:** orchestrator stays on `127.0.0.1:8484` (not in tunnel by default)
- **Sandbox:** containers, loopback bind, CPU/RAM limits, no host nginx install

### Local full studio

```bash
cd "tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve   # http://127.0.0.1:8484
```
