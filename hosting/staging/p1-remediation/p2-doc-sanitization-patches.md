# P2 Remediation Patches — Public-facing localhost exposures

**Source of truth:** `agent-comms/handoffs/hermes-sensitive-tree-audit.md`  
**Target tree:** `13-creative-media/zoth/public/`  
**Status:** Not applied; awaiting user review

> These patches sanitize public-facing copy that exposes private ports to visitors/search engines. They do not change functionality. Review carefully before applying: some localhost references are intentional architectural transparency.

---

## Rationale for selective p2 cleanup

- `studio/*.html`, `vault/*.md`, `docs/*` intentionally explain local-first architecture. These can keep loopback references but should drop exact port numbers from meta/SEO text.
- `ai.txt`, `llms.txt`, `agents.md` are answer-engine docs. Replace `127.0.0.1:*` with “private operator deck” / “local Rust daemon” language.
- `blueprints/*.md` can replace exact URLs with generic descriptions.

---

## Proposed patches

### 1. `ai.txt` — sanitize description
- **old_string:** `private operator deck on 127.0.0.1:8484`
- **new_string:** `private operator deck on the local host`

### 2. `llms.txt` — replace local variants in tables
- **old_string:** `| Operator deck | — | http://127.0.0.1:8484/ | no |`
- **new_string:** `| Operator deck | — | localhost | no |`
- **old_string:** `| Vault daemon | — | http://127.0.0.1:8787/health | no |`
- **new_string:** `| Vault daemon | — | localhost | no |`
- And similarly for other local URL rows.

### 3. `agents.md` — replace exact ports
- **old_string:** `**Studio** (\`/studio/\` → \`127.0.0.1:8484\`) — operator deck. Private.`
- **new_string:** `**Studio** (\`/studio/\` → localhost) — operator deck. Private.`

### 4. `index.html` meta/FAQ — drop exact ports
- Replace `127.0.0.1:8484` with `the operator deck`
- Replace `127.0.0.1:8787` with `the local vault daemon`

### 5. `vault/*` meta/FAQ — drop exact ports
- Replace exact `127.0.0.1:8787` with `the local vault daemon`

### 6. `blueprints/*.md` and `zoth-knowledge-graph.json` names/descriptions
- Replace exact localhost URLs with “private operator deck” / “local vault daemon”

### 7. `studio/*.html` meta
- Replace exact ports in `<meta>` tags and visible footer text with generic “operator deck”

---

## Recommended approach

Apply p2 only if the user wants zero localhost exposure on the public web. Otherwise, the current state is functionally safe for deploy; p1 is the hard blocker, and p1 is now resolved.
