import { useState } from "react";

export default function AskUserCard({
  questions,
  answered,
  answers,
  disabled,
  onSubmit,
  onDismiss,
  onOpenPanel,
}) {
  const [draft, setDraft] = useState(() => {
    const init = {};
    (questions || []).forEach((q) => {
      init[q.id] = q.type === "multi" ? [] : "";
    });
    return init;
  });
  const [customInput, setCustomInput] = useState("");
  const [showConfigHelper, setShowConfigHelper] = useState(null);

  if (!questions?.length) return null;

  if (answered) {
    return (
      <div className="ask-card is-done">
        <p className="ask-kicker">✓ Choice Recorded</p>
        <ul>
          {(answers || questions).map((q) => (
            <li key={q.id}>
              <span>{q.prompt}</span>
              <b>{Array.isArray(q.answer) ? q.answer.join(", ") : q.answer || "—"}</b>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function toggleMulti(id, opt) {
    setDraft((d) => {
      const cur = Array.isArray(d[id]) ? d[id] : [];
      return {
        ...d,
        [id]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt],
      };
    });
  }

  function selectSingle(id, opt) {
    setDraft((d) => ({ ...d, [id]: opt }));
  }

  function ready() {
    return questions.every((q) => {
      const v = draft[q.id];
      if (q.type === "multi") return Array.isArray(v) && v.length > 0;
      return String(v || "").trim().length > 0;
    });
  }

  function detectConnectorHint(text) {
    const low = String(text || "").toLowerCase();
    if (low.includes("github")) return { id: "github", label: "GitHub Token", action: "connect" };
    if (low.includes("netlify")) return { id: "netlify", label: "Netlify Token", action: "connect" };
    if (low.includes("solana")) return { id: "solana", label: "Solana RPC / Key", action: "connect" };
    if (low.includes("stripe")) return { id: "stripe", label: "Stripe Secret", action: "connect" };
    if (low.includes("vault") || low.includes("bitwarden")) return { id: "vault", label: "Argon2id Vault", action: "vault" };
    if (low.includes("ollama") || low.includes("model")) return { id: "models", label: "Local Ollama / Models", action: "models" };
    return null;
  }

  return (
    <form
      className="ask-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready() || disabled) return;
        onSubmit(draft);
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p className="ask-kicker" style={{ margin: 0 }}>⚡ Option Selection & Input</p>
        <div style={{ display: "flex", gap: 6 }}>
          {onDismiss && (
            <button
              type="button"
              className="ghost"
              style={{ fontSize: "0.74rem", padding: "2px 8px", color: "var(--muted)" }}
              onClick={onDismiss}
              title="Skip this prompt and continue chat"
            >
              ✕ Skip
            </button>
          )}
        </div>
      </div>

      {questions.map((q) => {
        const hint = detectConnectorHint(q.prompt);
        return (
          <fieldset key={q.id} className="ask-q" style={{ border: "none", padding: 0, margin: "0 0 12px 0" }}>
            <legend style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 6, color: "#fff" }}>
              {q.prompt}
            </legend>

            {hint && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0 8px 0", fontSize: "0.75rem" }}>
                <span style={{ color: "var(--amber, #f59e0b)", fontFamily: "var(--font-mono)" }}>
                  💡 Requires {hint.label}
                </span>
                {onOpenPanel && (
                  <button
                    type="button"
                    className="ghost"
                    style={{ fontSize: "0.72rem", padding: "2px 6px", color: "var(--cyan, #00f0ff)", borderColor: "rgba(0,240,255,0.3)" }}
                    onClick={() => onOpenPanel(hint.action)}
                  >
                    Open {hint.action.toUpperCase()} Settings ↗
                  </button>
                )}
              </div>
            )}

            {q.type === "text" && (
              <input
                type="text"
                value={draft[q.id] || ""}
                onChange={(e) => setDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                placeholder="Type your response or value..."
                disabled={disabled}
                style={{ width: "100%", padding: "8px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--line)", borderRadius: 6, color: "#fff" }}
              />
            )}

            {q.type === "choice" && (
              <div className="ask-opts" role="radiogroup" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(q.options || []).map((opt) => {
                  const isSelected = draft[q.id] === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      className={isSelected ? "on" : ""}
                      onClick={() => selectSingle(q.id, opt)}
                      disabled={disabled}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: isSelected ? "1px solid var(--cyan, #00f0ff)" : "1px solid rgba(255,255,255,0.1)",
                        background: isSelected ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.03)",
                        color: isSelected ? "var(--cyan, #00f0ff)" : "#e2e8f0",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-mono, monospace)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isSelected ? "● " : "○ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "multi" && (
              <div className="ask-opts" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(q.options || []).map((opt) => {
                  const isSelected = (draft[q.id] || []).includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      className={isSelected ? "on" : ""}
                      onClick={() => toggleMulti(q.id, opt)}
                      disabled={disabled}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: isSelected ? "1px solid var(--cyan, #00f0ff)" : "1px solid rgba(255,255,255,0.1)",
                        background: isSelected ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.03)",
                        color: isSelected ? "var(--cyan, #00f0ff)" : "#e2e8f0",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-mono, monospace)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isSelected ? "☑ " : "☐ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        );
      })}

      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button
          type="submit"
          disabled={disabled || !ready()}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            background: ready() ? "var(--cyan, #00f0ff)" : "rgba(255,255,255,0.1)",
            color: ready() ? "#000" : "var(--muted)",
            fontWeight: 700,
            border: "none",
            cursor: ready() ? "pointer" : "default",
          }}
        >
          Confirm & Send
        </button>

        {onDismiss && (
          <button
            type="button"
            className="ghost"
            onClick={onDismiss}
            style={{ fontSize: "0.8rem", padding: "6px 12px" }}
          >
            Skip / Ignore
          </button>
        )}
      </div>
    </form>
  );
}
