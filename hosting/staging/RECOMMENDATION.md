# nullai.tech Hostinger Cutover — Recommendation Packet

**Date:** 2026-08-16  
**Author:** Hermes  
**Status:** Awaiting user decision

---

## Recommended Layout: B — `studio.nullai.tech` subdomain

### Why B over A or C

| Criterion | A Apex | B Subdomain | C Path |
|---|---|---|---|
| Risk to existing live `nullai.tech` | High — direct overwrite | Low — isolated subtree | Medium — path collision risk |
| DNS complexity | Medium — apex swap + 301 | Low — new CNAME only | Low — no new DNS |
| Rollback | Hard — must restore from backup | Easy — delete `studio/` subtree | Medium — remove `/studio/` |
| Testing safety | Requires staging domain | Natural staging via subdomain | Can collide with existing `/studio` |
| SEO continuity | Disruptive at apex | Preserves existing apex | Preserves existing apex |

### Rationale

The audit found **12 p1 localhost fetches** and **41 p2 port exposures** in `public/`. These must be patched before any public deploy regardless of layout. Option B gives us:

1. A sandboxed `studio.nullai.tech` that can be tested without touching the live `nullai.tech` homepage or `/swarm`
2. Clean separation: `zoth.nealfrazier.tech` → 301 → `studio.nullai.tech` after verification
3. Low blast radius if something leaks or breaks

### User Decisions Needed

1. **Layout:** A / B / C — recommend **B**
2. **Hostinger plan:** Cloud vs VPS — recommend **Cloud** (static-only hub)
3. **Go-ahead for p1 patch set:** yes/no

### What Happens After "Go"

1. Hermes applies p1 remediation patches to `public/` (pending user approval)
2. Antigravity/Grok verify on `:8088`
3. User runs rsync from `13-creative-media/zoth/hosting/staging/option-b-studio-subdomain/`
4. Smoke check per `smokecheck-checklist.md`
5. User updates DNS/hPanel for `studio.nullai.tech`
6. Hermes updates canonicals/OG/sitemap post-cutover

### Staging Artifacts Ready

- `13-creative-media/zoth/hosting/staging/option-a-apex/`
- `13-creative-media/zoth/hosting/staging/option-b-studio-subdomain/`
- `13-creative-media/zoth/hosting/staging/option-c-path-studio/`
- `agent-comms/handoffs/hermes-sensitive-tree-audit.md`
- `agent-comms/claims/nullai-staging-prep.json` (done)
- `agent-comms/claims/nullai-public-p1-remediation.json` (in progress)
