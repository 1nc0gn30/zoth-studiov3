import { useEffect, useState } from "react";
import { getByok, getHarnessConnectors, invokeConnector, saveByok } from "../api";
import Tip from "./Tip";

const SECRET_KEY = /secret|token|password|passphrase|authorization|api[_-]?key|bearer/i;

function safeLog(value) {
  if (value == null || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(safeLog);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SECRET_KEY.test(k) ? (v ? "••••" : v) : safeLog(v);
    }
    return out;
  }
  return value;
}

export default function ConnectorsPanel() {
  const [connectors, setConnectors] = useState([]);
  const [byok, setByok] = useState({});
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(null);
  const [log, setLog] = useState("");
  const [focus, setFocus] = useState(null);
  const [copied, setCopied] = useState("");

  async function refresh() {
    const [c, b] = await Promise.all([getHarnessConnectors(), getByok().catch(() => ({ keys: {} }))]);
    setConnectors(c.connectors || []);
    setByok(b.keys || {});
  }

  useEffect(() => {
    refresh().catch((e) => setLog(String(e.message || e)));
  }, []);

  async function probe(c) {
    setBusy(c.id);
    try {
      const action = c.id === "solana" ? "balance" : c.id === "netlify" ? "sites" : c.id === "stripe" ? "balance" : c.id === "github" ? "user.me" : c.id === "gdrive" ? "about" : "status";
      const r = await invokeConnector(c.id, action);
      setLog(JSON.stringify(safeLog(r), null, 2));
      await refresh();
    } catch (e) {
      setLog(String(e.message || e));
    } finally {
      setBusy(null);
    }
  }

  async function saveKey(name) {
    const value = draft[name] || "";
    setBusy(name);
    try {
      const r = await saveByok(name, value);
      setByok(r.keys || {});
      setDraft((d) => ({ ...d, [name]: "" }));
      setLog(value ? `Saved ${name} locally.` : `Cleared ${name}.`);
      await refresh();
    } catch (e) {
      setLog(String(e.message || e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="conn-panel">
      <p className="empty-kicker">Accounts</p>
      <p className="muted">
        Probe first. Missing CLIs stay collapsed until you copy them. Keys stay on this machine.
      </p>
      <ul className="conn-list">
        {connectors.map((c) => (
          <li key={c.id} className={c.online || c.mode === "keyed" || c.mode === "rpc" ? "ok" : ""}>
            <div>
              <em className="conn-status">
                {c.online ? "online" : c.mode === "keyed" ? "keyed" : c.mode || "offline"}
              </em>
              <b>{c.name}</b>
              <small>
                {c.mode} · {c.detail || c.hint}
                {c.cli && !c.cli_path ? ` · missing \`${c.cli}\`` : ""}
                {c.cli_path ? ` · ${c.cli}` : ""}
              </small>
              {c.cli && !c.cli_path && c.install && (
                <div className="conn-install-row">
                  <Tip label="Copy the install command" kicker="Missing CLI">
                    <button
                      type="button"
                      className="conn-install-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(c.install).then(() => {
                          setCopied(c.id);
                          setTimeout(() => setCopied((cur) => (cur === c.id ? "" : cur)), 1400);
                        });
                      }}
                    >
                      {copied === c.id ? "Copied install" : `Install ${c.cli}`}
                    </button>
                  </Tip>
                </div>
              )}
            </div>
            <div className="conn-actions">
              {c.auth_url && (
                <Tip label="Open the sign-in page for this account" kicker="Auth">
                  <a
                    className="ghost"
                    href={c.auth_url}
                    target={c.auth_url.startsWith("/") ? "_self" : "_blank"}
                    rel="noreferrer"
                  >
                    Auth
                  </a>
                </Tip>
              )}
              {(c.env || []).length > 0 && (
                <Tip label="Paste a key that stays on this machine" kicker="Vault">
                  <button type="button" onClick={() => setFocus(focus === c.id ? null : c.id)}>
                    BYOK
                  </button>
                </Tip>
              )}
              <Tip label="Check if this connector answers locally" kicker="Status">
                <button type="button" disabled={busy === c.id} onClick={() => probe(c)}>
                  {busy === c.id ? "…" : "Probe"}
                </button>
              </Tip>
            </div>
            {focus === c.id && (
              <div className="conn-byok">
                {(c.env || []).map((key) => (
                  <label key={key}>
                    {key} {byok[key] ? "(set)" : "(empty)"}
                    <span>
                      <input
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        value={draft[key] || ""}
                        placeholder={byok[key] ? "••••••••" : "paste then save"}
                        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                      />
                      <button type="button" onClick={() => saveKey(key)} disabled={busy === key}>
                        Save
                      </button>
                    </span>
                  </label>
                ))}
                {c.auth_cli && <code className="conn-install">{c.auth_cli}</code>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {log && <pre className="conn-log">{log}</pre>}
    </div>
  );
}
