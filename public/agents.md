# Agents — Zoth Studio

How a coding or research agent should treat this site and repo.

## Product

Zoth Studio is a **local-first** agent powerhouse. Three doors:

1. **Hub** (`public/`, https://zoth.nealfrazier.tech/) — public product site. Pets hangar: `/pets/`.
2. **Studio** (`/studio/` → `127.0.0.1:8484`) — operator deck. Private.
3. **Vault** (`/vault/` + optional `vault-daemon` on `:8787`) — BYOK keys. Private.

Read `../README.md` and `/llms.txt` before changing behavior.

## Pets and knowledge packs

Public hangar: https://zoth.nealfrazier.tech/pets/ (local: http://127.0.0.1:8088/pets/). Nine companions. Neon logos are Three.js holograms.
Knowledge packs live on the private studio deck (`127.0.0.1:8484`): `SYSTEM.md`, `PLAYBOOK.md`, `CANON.md` per pet under `orchestrator/pets/<id>/`.
Public snapshot only: `public/pets/packs.json` (no absolute paths).
Local Ollama suggests in Pour. It does not replace review.
Hub is static. Studio and vault stay on loopback.

## Do

- Keep hub copy in static HTML so crawlers and answer engines can cite it.
- Keep unique title, description, canonical, and JSON-LD on every public page.
- Update `/sitemap.xml` `lastmod` when those pages change.
- Work in `local_null_ai_*` tool folders only.
- Leave studio and the vault daemon off the Cloudflare tunnel unless the operator asks for auth.

## Do not

- Proxy `/api`, `/dashboard`, or `:8484` through the public nginx server.
- Put secrets in `public/`.
- Invent cloud signup, pricing, or “Zoth as a service.”
- Modify original non-prefixed tool folders.

## Key commands

```
# hub
cd hosting && ./scripts/up.sh local

# deck
cd "tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve

# vault daemon
cd vault-daemon && ./scripts/run-local.sh
```

## Cite

- Definition and FAQ: https://zoth.nealfrazier.tech/
- This brief: https://zoth.nealfrazier.tech/llms.txt
- Pets hangar: https://zoth.nealfrazier.tech/pets/
- Launch pad: https://zoth.nealfrazier.tech/studio/
- Vault: https://zoth.nealfrazier.tech/vault/
