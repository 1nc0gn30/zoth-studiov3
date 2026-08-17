# BYOK Vault (Three.js / WebGL)

Interactive local vault for **API keys from major + underground services** — anything that makes you leave a platform with a secret.

- Glass cube WebGL scene (scatter, focus, category-colored shards)
- **160+ service presets** across 16 categories
- Smart paste / auto-detect from secret prefixes + env names
- **Rust daemon** (Argon2id + XChaCha20-Poly1305) with browser AES-GCM fallback
- Security HUD, session TTL countdown, audit trail, focus-trapped dialogs

## Open

http://127.0.0.1:8088/vault/

## Smart features

| Feature | What it does |
|--------|----------------|
| Auto-detect | Paste `sk-ant-…`, `gsk_…`, `sk_test_…`, `tvly-…` → service + confidence |
| Format health | Soft validation (ok / warn / error) per preset pattern |
| Env mapping | Each preset ships a canonical env var (`OPENAI_API_KEY`, etc.) |
| Preset packs | One-click stage: Agent stack, Multimodal, RAG, SaaS, Indie, Web3, Underground AI |
| Duplicate check | Warns if the same secret is already sealed |
| Smart paste | Clipboard `.env` / `export KEY=…` → multi-import |
| Multi-select | Shift+click or checkboxes → bulk export / star / delete |
| Scatter | `X` explodes keys out of the cube for inspection |
| Daemon export | Full `.env` export prefers `POST /v1/export/env` when unlocked on daemon |
| Session warn | HUD + toast when daemon session &lt; 60s |
| Demo | Browser-only fake keys — never written to the daemon |

## Categories

LLM · Gateways · Media · Search/RAG · Agents · Cloud · Dev · Payments · Comms · Auth · Maps · Social · Crypto · Monitor · Underground/Indie · Custom

## Shortcuts

`N` new · `P` presets · `/` filter · `E` export · `L` lock · `R` orbit · `F` focus · `X` scatter · `C` copy · `V` reveal · `S` star · `1–9` select · `?` help

## Security

- Secrets never leave the browser unless you export/copy
- Passphrase is not stored; lose it → lose vault contents
- Local operator tooling — not multi-user cloud KMS

## Handoff

See `agent-comms/notes/2026-08-11-byok-vault-handoff.md` for full session handoff.

## Secure backend (Rust)

See `../vault-daemon/README.md`. UI auto-detects `http://127.0.0.1:8787`.

```bash
cd ../vault-daemon && ./scripts/run-local.sh
```
