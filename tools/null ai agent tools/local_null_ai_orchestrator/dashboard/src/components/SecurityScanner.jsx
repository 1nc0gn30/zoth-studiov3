import { useState, useEffect, useCallback } from "react";

async function runSecurityScan() {
  const res = await fetch("/api/security/scan");
  if (!res.ok) throw new Error(`Scan: ${res.status}`);
  return res.json();
}

async function getScanStatus() {
  const res = await fetch("/api/security/scan-status");
  if (!res.ok) throw new Error(`Scan status: ${res.status}`);
  return res.json();
}

const SEVERITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
};

function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="as-card"
      style={{
        borderLeft: `3px solid ${SEVERITY_COLORS[finding.severity] || "#94a3b8"}`,
        padding: "10px 12px",
        marginBottom: 6,
        cursor: "pointer",
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: SEVERITY_COLORS[finding.severity] || "#94a3b8",
            display: "inline-block",
          }}
        />
        <strong style={{ fontSize: "0.78rem" }}>{finding.type}</strong>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>
          {finding.severity.toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: 2 }}>
        {finding.file}:{finding.line}
      </div>
      {expanded && (
        <div
          className="as-action-result"
          style={{ marginTop: 8, padding: 8, fontSize: "0.72rem" }}
        >
          <code style={{ color: "var(--text-primary)", wordBreak: "break-all" }}>
            {finding.match}
          </code>
          {finding.entropy && (
            <div style={{ marginTop: 6, color: "var(--text-muted)" }}>
              Entropy: {finding.entropy}
            </div>
          )}
          {finding.context && finding.context !== finding.match && (
            <div style={{ marginTop: 6, color: "var(--text-muted)", wordBreak: "break-word" }}>
              Context: {finding.context}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SecurityScanner() {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadStatus = useCallback(async () => {
    try {
      const s = await getScanStatus();
      setStatus(s);
      if (Array.isArray(s.findings)) {
        setResult(s);
      }
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const runScan = async () => {
    setScanning(true);
    setError(null);
    try {
      const r = await runSecurityScan();
      setResult(r);
      setStatus({
        status: "ok",
        findings_count: r.findings_count,
        high_count: r.high_count,
        medium_count: r.medium_count,
        low_count: r.low_count,
        files_scanned: r.files_scanned,
        timestamp: r.timestamp,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setScanning(false);
    }
  };

  const filteredFindings =
    filter === "all"
      ? result?.findings || []
      : (result?.findings || []).filter((f) => f.severity === filter);

  const groupedByFile = {};
  for (const f of filteredFindings) {
    groupedByFile[f.file] = groupedByFile[f.file] || [];
      groupedByFile[f.file].push(f);
  }

  return (
    <section className="main">
      <p className="empty-kicker">A NullAI studio</p>
      <div className="section-title">Security Scanner</div>

      {error && (
        <div className="error-banner">
          <span>⚠ {error}</span>
          <button className="retry-btn" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="as-layout">
        <div className="as-column" style={{ maxWidth: 280, flexShrink: 0 }}>
          <div className="card as-card">
            <h3 className="as-card-title">Status</h3>
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading…</p>
            ) : status ? (
              <div style={{ display: "grid", gap: 8 }}>
                <div className="as-ai-plan-row">
                  <span>Findings</span>
                  <strong style={{ color: status.high_count > 0 ? "var(--accent-red)" : "var(--accent-green)" }}>
                    {status.findings_count}
                  </strong>
                </div>
                <div className="as-ai-plan-row">
                  <span>High Risk</span>
                  <strong style={{ color: "var(--accent-red)" }}>{status.high_count}</strong>
                </div>
                <div className="as-ai-plan-row">
                  <span>Medium Risk</span>
                  <strong style={{ color: "var(--accent-amber)" }}>{status.medium_count}</strong>
                </div>
                <div className="as-ai-plan-row">
                  <span>Low / Example</span>
                  <strong style={{ color: "var(--accent-cyan)" }}>{status.low_count || 0}</strong>
                </div>
                <div className="as-ai-plan-row">
                  <span>Files Scanned</span>
                  <strong>{status.files_scanned}</strong>
                </div>
                <div className="as-ai-plan-row">
                  <span>Last Scan</span>
                  <strong style={{ fontSize: "0.7rem" }}>{status.timestamp?.slice(0, 19) || "—"}</strong>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>No scan data.</p>
            )}
            <div className="as-action-row" style={{ marginTop: 12 }}>
              <button
                className="as-btn as-btn-primary"
                onClick={runScan}
                disabled={scanning}
              >
                {scanning ? "Scanning…" : "Full scan"}
              </button>
            </div>
          </div>

          <div className="card as-card">
            <h3 className="as-card-title">Filter</h3>
            <div style={{ display: "grid", gap: 6 }}>
              {["all", "high", "medium", "low"].map((f) => (
                <button
                  key={f}
                  className={`as-btn ${filter === f ? "as-btn-primary" : "as-btn-secondary"} as-btn-small`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "high" ? "High" : f === "medium" ? "Medium" : "Low"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="as-column">
          {!result && !scanning && (
            <div className="card as-card">
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 30 }}>
                Cached findings load automatically when available. Run a full scan to refresh exposed secrets, API keys, tokens, credentials, private keys, and high-entropy secret-like values.
              </p>
            </div>
          )}

          {result?.risk_summary?.recommendations?.length > 0 && (
            <div className="card as-card" style={{ borderLeft: "3px solid var(--accent-cyan)" }}>
              <h3 className="as-card-title">Next Actions</h3>
              <ul style={{ color: "var(--text-secondary)", fontSize: "0.78rem", lineHeight: 1.6, paddingLeft: 18 }}>
                {result.risk_summary.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {scanning && (
            <div className="card as-card">
              <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>Scanning workspace… this may take a moment.</p>
            </div>
          )}

          {result && filteredFindings.length === 0 && (
            <div className="card as-card" style={{ borderLeft: "3px solid var(--accent-green)" }}>
              <p style={{ color: "var(--accent-green)", textAlign: "center", padding: 20 }}>✅ No sensitive information detected in scanned files.</p>
            </div>
          )}

          {Object.entries(groupedByFile).map(([file, findings]) => (
            <div key={file} className="card as-card">
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>📄</span>
                {file}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    marginLeft: "auto",
                  }}
                >
                  {findings.length} finding{findings.length !== 1 ? "s" : ""}
                </span>
              </div>
              {findings.map((f, i) => (
                <FindingCard key={`${f.file}-${f.line}-${i}`} finding={f} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
