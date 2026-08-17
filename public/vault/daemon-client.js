/**
 * Client for zoth-vault-daemon (Rust local backend).
 * Loopback only. Timed-out or dead daemon never blocks the vault UI —
 * callers get an error and this client flips to browser fallback.
 */
const DEFAULT_BASES = ["http://127.0.0.1:8787", "http://localhost:8787"];

export class DaemonClient {
  constructor() {
    this.base = null;
    this.token = null;
    this.online = false;
    this.backend = "localStorage";
    this.lastSecurity = null;
    this.lastStatus = null;
    this.expiresAt = null;
  }

  markOffline() {
    this.online = false;
    this.base = null;
    this.token = null;
    this.expiresAt = null;
    this.backend = "localStorage";
  }

  async request(path, { method = "GET", headers = {}, body, timeoutMs = 4000 } = {}) {
    if (!this.base) throw new Error("daemon offline");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetch(`${this.base}${path}`, {
        method,
        headers,
        body,
        signal: ctrl.signal,
        cache: "no-store",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `request failed (${r.status})`);
      return j;
    } catch (e) {
      const msg = String(e && e.message ? e.message : e);
      if (e.name === "AbortError" || /failed to fetch|networkerror|load failed/i.test(msg)) {
        this.markOffline();
        throw new Error("daemon unreachable — using browser vault");
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  async probe(timeoutMs = 800) {
    for (const base of DEFAULT_BASES) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        const r = await fetch(`${base}/health`, {
          signal: ctrl.signal,
          cache: "no-store",
        });
        clearTimeout(t);
        if (!r.ok) continue;
        const j = await r.json();
        if (j.ok && j.service === "zoth-vault-daemon") {
          this.base = base;
          this.online = true;
          this.backend = "rust-daemon";
          return true;
        }
      } catch {
        /* try next */
      }
    }
    this.markOffline();
    return false;
  }

  async status() {
    if (!this.base) return null;
    const j = await this.request("/v1/status");
    this.lastStatus = j;
    if (j.expires_at) this.expiresAt = j.expires_at;
    return j;
  }

  async security() {
    if (!this.base) return null;
    const j = await this.request("/v1/security");
    this.lastSecurity = j;
    return j;
  }

  async session() {
    const j = await this.request("/v1/session", { headers: this.authHeaders() });
    if (j.expires_at) this.expiresAt = j.expires_at;
    return j;
  }

  async touch() {
    const j = await this.request("/v1/session", {
      method: "POST",
      headers: this.authHeaders(),
    });
    if (j.expires_at) this.expiresAt = j.expires_at;
    return j;
  }

  async audit() {
    const j = await this.request("/v1/audit", { headers: this.authHeaders() });
    return j.events || [];
  }

  async init(passphrase) {
    return this.request("/v1/vault/init", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passphrase }),
      timeoutMs: 20000,
    });
  }

  async unlock(passphrase) {
    const j = await this.request("/v1/vault/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passphrase }),
      timeoutMs: 20000,
    });
    this.token = j.session_token;
    this.expiresAt = j.expires_at || null;
    return j;
  }

  async lock() {
    if (!this.base) return;
    try {
      await this.request("/v1/vault/lock", {
        method: "POST",
        headers: this.authHeaders(),
        timeoutMs: 2000,
      });
    } catch {
      /* lock is best-effort */
    } finally {
      this.token = null;
      this.expiresAt = null;
    }
  }

  authHeaders(json = false) {
    const h = { authorization: `Bearer ${this.token}` };
    if (json) h["content-type"] = "application/json";
    return h;
  }

  async listKeys() {
    return this.request("/v1/keys", { headers: this.authHeaders() });
  }

  async listKeysWithSecrets() {
    const metas = await this.listKeys();
    const out = [];
    for (const m of metas) {
      out.push(await this.getKey(m.id));
    }
    return out;
  }

  async getKey(id) {
    const j = await this.request(`/v1/keys/${encodeURIComponent(id)}`, {
      headers: this.authHeaders(),
    });
    return {
      id: j.id,
      provider: j.provider,
      label: j.label,
      secret: j.secret,
      created: j.created,
      tags: j.tags || [],
      favorite: !!j.favorite,
      env: j.env || null,
      endpoint: j.endpoint || "",
      notes: j.notes || "",
      lastUsed: j.last_used || 0,
    };
  }

  async upsertKey(key) {
    return this.request("/v1/keys", {
      method: "POST",
      headers: this.authHeaders(true),
      body: JSON.stringify({
        id: key.id || undefined,
        provider: key.provider,
        label: key.label,
        secret: key.secret,
        tags: key.tags || [],
        favorite: !!key.favorite,
        env: key.env || null,
        endpoint: key.endpoint || null,
        notes: key.notes || null,
      }),
    });
  }

  async deleteKey(id) {
    return this.request(`/v1/keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: this.authHeaders(),
    });
  }

  async bulkDelete(ids) {
    return this.request("/v1/keys/bulk-delete", {
      method: "POST",
      headers: this.authHeaders(true),
      body: JSON.stringify({ ids }),
    });
  }

  async exportEnv() {
    if (!this.base || !this.token) throw new Error("daemon session required for export");
    const j = await this.request("/v1/export/env", {
      method: "POST",
      headers: this.authHeaders(),
    });
    if (typeof j.env === "string") return j.env;
    if (typeof j === "string") return j;
    return j.text || j.content || "";
  }

  async importEnv(text) {
    return this.request("/v1/import/env", {
      method: "POST",
      headers: this.authHeaders(true),
      body: JSON.stringify({ text }),
    });
  }

  async changePassphrase(current, next) {
    return this.request("/v1/vault/change-passphrase", {
      method: "POST",
      headers: this.authHeaders(true),
      body: JSON.stringify({
        current_passphrase: current,
        new_passphrase: next,
      }),
      timeoutMs: 20000,
    });
  }

  async wipe(passphrase) {
    const j = await this.request("/v1/vault/wipe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passphrase, confirm: "WIPE" }),
    });
    this.token = null;
    this.expiresAt = null;
    return j;
  }
}

export const daemon = new DaemonClient();
