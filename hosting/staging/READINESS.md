# nullai.tech Deploy Readiness — Final Report

**Date:** 2026-08-16  
**Author:** Hermes  
**Status:** Waiting on user decision for final deploy

---

## Completed

1. **Sensitive-tree audit** (`agent-comms/handoffs/hermes-sensitive-tree-audit.md`)
   - p0: 5 local-only files excluded from all manifests
   - p1: 12 hard-coded localhost fetch/probe/JSON-LD refs found
   - p2: 41 doc/meta exposures found
   - p3: no real secrets

2. **A/B/C staging artifacts**
   - `13-creative-media/zoth/hosting/staging/option-a-apex/`
   - `13-creative-media/zoth/hosting/staging/option-b-studio-subdomain/`
   - `13-creative-media/zoth/hosting/staging/option-c-path-studio/`

3. **p1 remediation** — applied to `public/`
   - `pets/pets.js`, `registry/registry.js`, `site.js`, `connectors/index.js`
   - `blueprints/index.html`, `blueprints/zoth-knowledge-graph.json`
   - Verified `:8088` still serves after patches

4. **p2 patch set prepared** — not applied
   - `13-creative-media/zoth/hosting/staging/p1-remediation/p2-doc-sanitization-patches.md`

5. **Recommendation packet** (`RECOMMENDATION.md`) + decision gate (`DECISION-GATE.md`)

---

## Remaining blockers

- **User decision:** A vs B vs C + Cloud vs VPS
- **Optional:** p2 doc/meta cleanup if zero localhost exposure is required

---

## Recommended next action

User picks **B (`studio.nullai.tech`) + Hostinger Cloud**. Hermes or Antigravity/Grok can then run rsync from `option-b-studio-subdomain/` and smoke check per `smokecheck-checklist.md`.

No DNS or deploy actions taken without user confirmation.
