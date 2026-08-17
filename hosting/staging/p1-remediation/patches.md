# P1 Remediation Patches — Hard-coded localhost references
**Source of truth:** `agent-comms/handoffs/hermes-sensitive-tree-audit.md`
**Target tree:** `13-creative-media/zoth/public/`
**Deploy target:** Hostinger (public production)

> These patches cover the 12 p1 items identified in the audit.  
> Do **not** apply them automatically to `public/`; review and apply via `patch` or CI.

---

## File: `pets/pets.js`

### 1. Live pets fetch → relative endpoint
- **Line:** 456
- **old_string:**
  ```js
  const live = await fetch("http://127.0.0.1:8484/api/pets", { cache: "no-store", signal: ctrl.signal });
  ```
- **new_string:**
  ```js
  const live = await fetch("/api/pets", { cache: "no-store", signal: ctrl.signal });
  ```
- **Rationale:** The public pets hangar must not call the private local studio deck. A relative `/api/pets` routes through the same-origin public hub when deployed; if no backend exists, the existing snapshot fallback keeps the page functional.

---

## File: `registry/registry.js`

### 2. Live tools fetch → relative endpoint
- **Line:** 71
- **old_string:**
  ```js
  const r = await fetch("http://127.0.0.1:8484/api/tools", {
  ```
- **new_string:**
  ```js
  const r = await fetch("/api/tools", {
  ```
- **Rationale:** The public registry snapshot must not hit the private local API. A relative `/api/tools` works with a same-origin proxy or static fallback; otherwise the static `all` array remains visible.

---

## File: `site.js`

### 3. Daemon health probe — guard with localhost check
- **Line:** 342
- **old_string:**
  ```js
  const data = await probe('http://127.0.0.1:8787/health');
  ```
- **new_string:**
  ```js
  const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8787/health') : null;
  ```
- **Rationale:** The vault daemon is loopback-only. Visitors on Hostinger cannot reach it, so the probe must be skipped in production; the badge stays hidden by default.

### 4. Studio dashboard probe — guard with localhost check
- **Line:** 352
- **old_string:**
  ```js
  const data = await probe('http://127.0.0.1:8484/api/dashboard');
  ```
- **new_string:**
  ```js
  const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8484/api/dashboard') : null;
  ```
- **Rationale:** The studio deck is private. The probe should only run in local dev; on Hostinger the deck badge remains hidden/offline.

### 5. Studio meta text — remove hard-coded localhost
- **Line:** 363
- **old_string:**
  ```js
        ? `${data.tool_count || 298} tools · 127.0.0.1:8484`
  ```
- **new_string:**
  ```js
        ? `${data.tool_count || 298} tools · Studio Deck`
  ```
- **Rationale:** Even when the probe succeeds in dev, the rendered text must not expose the private loopback address in production UI.

### 6. Spark health probe — guard with localhost check
- **Line:** 379
- **old_string:**
  ```js
    const data = await probe('http://127.0.0.1:8765/health');
  ```
- **new_string:**
  ```js
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8765/health') : null;
  ```
- **Rationale:** Spark is an undocumented local service. The probe must not execute from a visitor's browser; keep the launch button hidden/disabled in production.

---

## File: `connectors/index.js`

### 7. Vault daemon default URL → empty string
- **Line:** 132
- **old_string:**
  ```js
  async getSecret(key, vaultDaemonUrl = "http://127.0.0.1:8787") {
  ```
- **new_string:**
  ```js
  async getSecret(key, vaultDaemonUrl = "") {
  ```
- **Rationale:** The public hub must not default to a loopback daemon. An empty default forces callers to explicitly pass a relative/prod URL or rely on the in-memory fallback, which is the correct production-safe behavior.

---

## File: `blueprints/index.html`

### 8. Studio deck link → public path
- **Line:** 60
- **old_string:**
  ```html
  <a href="http://127.0.0.1:8484" class="btn-deck" target="_blank" rel="noopener">
  ```
- **new_string:**
  ```html
  <a href="/studio/" class="btn-deck" target="_blank" rel="noopener">
  ```
- **Rationale:** The public blueprint page must not link to localhost. `/studio/` resolves to the public-facing launch pad on Hostinger.

---

## File: `blueprints/zoth-knowledge-graph.json`

### 9–13. JSON-LD structured-data URLs → public Hub canonical
Replace every `"url": "http://127.0.0.1:8484/#..."` with the public canonical.

- **Line 137 (`#agent-runner`)**
  - **old_string:** `"url": "http://127.0.0.1:8484/#agent-runner",`
  - **new_string:** `"url": "https://zoth.nealfrazier.tech/",`
  - **Rationale:** Private studio feature; public Hub canonical prevents search engines indexing dead localhost URLs.

- **Line 148 (`#fusion`)**
  - **old_string:** `"url": "http://127.0.0.1:8484/#fusion",`
  - **new_string:** `"url": "https://zoth.nealfrazier.tech/",`
  - **Rationale:** Same as above.

- **Line 181 (`#parrot-tools`)**
  - **old_string:** `"url": "http://127.0.0.1:8484/#parrot-tools",`
  - **new_string:** `"url": "https://zoth.nealfrazier.tech/",`
  - **Rationale:** Same as above.

- **Line 192 (`#terminal`)**
  - **old_string:** `"url": "http://127.0.0.1:8484/#terminal",`
  - **new_string:** `"url": "https://zoth.nealfrazier.tech/",`
  - **Rationale:** Same as above.

- **Line 203 (`#pour`)**
  - **old_string:** `"url": "http://127.0.0.1:8484/#pour",`
  - **new_string:** `"url": "https://zoth.nealfrazier.tech/",`
  - **Rationale:** Same as above.

---

## Verification checklist

1. Grep `public/` for `127.0.0.1`, `localhost`, `:8088`, `:8484`, `:8787`, `:8765`, `:11434`, `:8989` — zero hits in deployable JS/HTML/JSON.
2. Load each patched page in an incognito window with network tab open; confirm no requests to loopback addresses.
3. Confirm JSON-LD validators (e.g. Google Rich Results Test) show no localhost URLs.
4. Confirm `site.js` deck/spark/daemon badges stay hidden when served from a non-localhost origin.
