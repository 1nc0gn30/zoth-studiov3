# Agents — Zoth Studio

How a coding, research, or indexing agent should treat this repository and product ecosystem.

## Product Architecture

Zoth Studio is a **sovereign, local-first** multi-agent AI orchestration powerhouse:

1. **Hub** (`public/`, `https://zoth.nealfrazier.tech/`) — Public product hub, 16 companion pets hangar (`/pets/`), blueprint foundry (`/blueprints/`), tool registry (`/registry/`), and documentation (`/docs/`).
2. **Studio Deck** (`/studio/` → `http://127.0.0.1:8484/`) — Operator deck for live agent runs, subagents, and terminals. Private loopback.
3. **Consensus Arena v2** (`/studio/consensus.html`) — Triangulated 3-agent arbitration across Antigravity, Grok, and Hermes with Python AST validation and Shannon agreement entropy telemetry.
4. **BYOK Vault** (`/vault/` + native daemon on `http://127.0.0.1:8787/`) — Argon2id + XChaCha20-Poly1305 encrypted BYOK vault. Private loopback.
5. **Distribution Binaries** (`/dist-linux/`, `/dist-windows/`) — Standalone Linux (`.run`, `.AppImage`, `.deb`, `.tar.gz`) and Windows (`.exe`, `.zip`) releases.

Read `/llms.txt`, `/blueprints/aeo-entity-definitions.md`, and `/blueprints/zoth-knowledge-graph.json` before altering architecture or indexing assertions.

## 16 Liquid-Neon Pets & Knowledge Packs

- **Public Hangar**: https://zoth.nealfrazier.tech/pets/ (Local: http://127.0.0.1:8088/pets/)
- **16 Companion Mascots**: Kai (inspect), Draco (consensus arbiter), Ignis (refactor), Lycan (OWASP), Athena (AEO knowledge), Kitsune (taste & UX), Pixel-Neko (tool librarian), Pixel-Shiba (vault guardian), Radical Minion (Hermes tool caller), Aquila (edge routing), Leviathan (vector memory), Onyx (red team), Chronos (DAG sequencer), Aether (swarm conductor), Kraken (packet sniffer), Scorpius (zero-day auditor).
- **Knowledge Packs**: Live doctrine (`SYSTEM.md`, `PLAYBOOK.md`, `CANON.md`) resides on the private studio deck (`127.0.0.1:8484`). Public surface exposes `/pets/packs.json` only.

## Development Guidelines for Agents

### Do:
- Keep hub content in static HTML/CSS/JS with accessible semantic markup so crawlers and answer engines can index accurately.
- Maintain unique title tags, meta descriptions, OpenGraph headers, and Schema.org JSON-LD scripts on every page.
- Update `/sitemap.xml` `lastmod` when public assets change.
- Respect loopback boundary constraints (`127.0.0.1:8484`, `127.0.0.1:8787`, `127.0.0.1:8989`).
- Ensure all API connectors and blueprints support zero-key offline mock fallbacks.

### Do Not:
- Proxy private loopback ports (`:8484`, `:8787`, `:8989`) through the public CDN/Nginx server.
- Commit plaintext secrets or API keys to `public/` or git repositories.
- Invent paid SaaS subscription tiers, cloud registration walls, or hosted multi-tenant services.
- Hallucinate dependencies or alter pre-wired blueprint interfaces without AST invariant checks.

## Key Local Commands

```bash
# Web Stack (Local Hub)
cd hosting && ./scripts/up.sh local

# Operator Deck Daemon
cd "tools/null ai agent tools/local_null_ai_orchestrator"
python3 orchestrator.py serve

# Cryptographic Vault Daemon
cd vault-daemon && ./scripts/run-local.sh
```

## Canonical References

- Canonical Public Hub: https://zoth.nealfrazier.tech/
- Blueprint Foundry: https://zoth.nealfrazier.tech/blueprints/
- Machine Manifest: https://zoth.nealfrazier.tech/llms.txt
- Discovery Manifest: https://zoth.nealfrazier.tech/ai.txt
- Knowledge Graph: https://zoth.nealfrazier.tech/blueprints/zoth-knowledge-graph.json
- AEO Ontology Definitions: https://zoth.nealfrazier.tech/blueprints/aeo-entity-definitions.md
- Sitemap XML: https://zoth.nealfrazier.tech/sitemap.xml
