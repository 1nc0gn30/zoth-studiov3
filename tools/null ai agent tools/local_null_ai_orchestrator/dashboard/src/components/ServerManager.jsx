import { useState, useEffect } from "react";

export default function ServerManager() {
  const [servers, setServers] = useState([]);
  const [containerStatus, setContainerStatus] = useState(null);
  const [containerConfig, setContainerConfig] = useState({ memory: "4g", cpus: "2" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [serversRes, containerRes] = await Promise.all([
        fetch("/api/servers"),
        fetch("/api/preview-container/status").catch(() => null),
      ]);
      if (!serversRes.ok) throw new Error(`API ${serversRes.status}`);
      const data = await serversRes.json();
      setServers(data.servers || []);
      setError(null);
      if (containerRes && containerRes.ok) {
        const cdata = await containerRes.json();
        setContainerStatus(cdata);
        if (cdata.config) {
          setContainerConfig(cdata.config);
        }
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  const stopServer = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/servers/${id}/stop`, { method: "POST" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateContainerConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/preview-container/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(containerConfig),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const stopContainer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/preview-container/stop", { method: "POST" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const serverTypes = [...new Set(servers.map((s) => s.type))];

  return (
    <section>
      <p className="empty-kicker">A NullAI studio</p>
      <h2 className="section-title">Running Servers</h2>
      {error && (
        <div className="error-banner">
          <span>⚠</span> {error}
          <button className="retry-btn" onClick={load}>
            retry
          </button>
        </div>
      )}

      {/* Preview Container Status */}
      {containerStatus && containerStatus.enabled && (
        <div className="card as-card" style={{ marginBottom: 20 }}>
          <h3 className="as-card-title">Preview Container</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className={`server-status ${containerStatus.running ? "status-ok" : "status-err"}`}>
              {containerStatus.running ? "● running" : "○ stopped"}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>RAM:</label>
              <input
                className="as-input"
                style={{ width: 60, fontSize: "0.78rem" }}
                value={containerConfig.memory}
                onChange={(e) => setContainerConfig({ ...containerConfig, memory: e.target.value })}
              />
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>CPUs:</label>
              <input
                className="as-input"
                style={{ width: 40, fontSize: "0.78rem" }}
                value={containerConfig.cpus}
                onChange={(e) => setContainerConfig({ ...containerConfig, cpus: e.target.value })}
              />
              <button className="as-btn as-btn-primary as-btn-small" onClick={updateContainerConfig} disabled={loading}>
                Update
              </button>
              {containerStatus.running && (
                <button className="as-btn as-btn-danger as-btn-small" onClick={stopContainer} disabled={loading}>
                  Stop Container
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {servers.length === 0 && (
        <p className="empty-state">No running servers.</p>
      )}
      {serverTypes.map((type) => (
        <div key={type} className="server-group">
          <h3 className="server-group-title">{type}</h3>
          <div className="server-list">
            {servers
              .filter((s) => s.type === type)
              .map((s) => (
                <div key={s.id} className={`server-card ${s.alive ? "alive" : "dead"}`}>
                  <div className="server-header">
                    <span className="server-name">{s.name}</span>
                    <span className={`server-status ${s.alive ? "status-ok" : "status-err"}`}>
                      {s.alive ? "● running" : "○ dead"}
                    </span>
                  </div>
                  <div className="server-meta">
                    {s.pid && <span className="server-meta-item">PID: {s.pid}</span>}
                    {s.port && <span className="server-meta-item">Port: {s.port}</span>}
                    {s.cwd && <span className="server-meta-item">CWD: {s.cwd}</span>}
                    {s.containerized && <span className="server-meta-item" style={{ color: "var(--accent-cyan)" }}>container</span>}
                  </div>
                  {s.venv_path && (
                    <div className="server-meta">
                      <span className="server-meta-item venv">Venv: {s.venv_path}</span>
                    </div>
                  )}
                  <div className="server-actions">
                    <button
                      className="as-btn as-btn-danger as-btn-small"
                      onClick={() => stopServer(s.id)}
                      disabled={loading || !s.alive}
                    >
                      ⏹ Stop
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
