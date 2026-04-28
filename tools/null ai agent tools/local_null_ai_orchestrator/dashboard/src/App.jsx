import { useState, useEffect, useCallback } from "react";
import { getDashboard, getSystem, getTools, getChains } from "./api";
import AIWorkbench from "./components/AIWorkbench";
import SystemPanel from "./components/SystemPanel";
import GhostByte from "./components/GhostByte";
import ZothStudio from "./components/ZothStudio";
import SecurityScanner from "./components/SecurityScanner";
import ParrotNexus from "./components/ParrotNexus";
import ServerManager from "./components/ServerManager";
import AgentFactory from "./components/AgentFactory";
import MediaForge from "./components/MediaForge";
import MalwareLab from "./components/MalwareLab";
import "./styles.css";

export default function App() {
  const [data, setData] = useState(null);
  const [system, setSystem] = useState(null);
  const [tools, setTools] = useState([]);
  const [chains, setChains] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("nexus");

  const load = useCallback(async () => {
    try {
      const [d, s, t, c] = await Promise.all([
        getDashboard(),
        getSystem(),
        getTools(),
        getChains(),
      ]);
      setData(d);
      setSystem(s);
      setTools(t.tools || []);
      setChains(c.chains || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, [load]);

  const categories = ["All", ...new Set(tools.map((t) => t.category))];

  return (
    <div className="app">
      {/* Top nav */}
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-text">
            <span className="brand-z0th">Z0TH</span>
          </span>
          <span className="brand-badge">v0.2</span>
          <span className="brand-byline">Built By NullAI</span>
        </div>
        <div className="topbar-status">
          {data && (
            <span className="status-indicator status-ok">
              {data.tool_count} tools
            </span>
          )}
          {error && (
            <span className="status-indicator status-err">
              disconnected
            </span>
          )}
          <button
            className="kill-switch-btn"
            title="Kill backend server (if terminal is frozen)"
            onClick={async () => {
              if (!window.confirm("Kill the backend server? This will stop all API endpoints. You'll need to restart manually.")) return;
              try {
                await fetch("/api/server/kill");
              } catch {}
            }}
          >
            ⏹ Kill Server
          </button>
          <button
            className="restart-switch-btn"
            title="Restart backend server"
            onClick={async () => {
              if (!window.confirm("Restart the backend server? It will go offline briefly.")) return;
              try {
                await fetch("/api/server/restart");
              } catch {}
            }}
          >
            ↻ Restart
          </button>
        </div>
        <nav className="topbar-tabs">
          <button
            className={`tab ${activeTab === "aiworkbench" ? "active" : ""}`}
            onClick={() => setActiveTab("aiworkbench")}
          >
            <span className="tab-icon">◈</span> AI Workbench
          </button>
          <button
            className={`tab ${activeTab === "ghostbyte" ? "active" : ""}`}
            onClick={() => setActiveTab("ghostbyte")}
          >
            <img
              className="tab-logo"
              src="https://nullai.tech/DarkMode-NullAI-Icon.png"
              alt=""
              onError={(e) => { e.target.style.display = "none"; }}
            />
            GhostByte
          </button>
          <button
            className={`tab ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            System
          </button>
          <button
            className={`tab ${activeTab === "chains" ? "active" : ""}`}
            onClick={() => setActiveTab("chains")}
          >
            Chains
          </button>
          <button
            className={`tab ${activeTab === "studio" ? "active" : ""}`}
            onClick={() => setActiveTab("studio")}
          >
            <span className="tab-icon">✦</span> Z0TH Studio
          </button>
          <button
            className={`tab ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            <span className="tab-icon">🎞️</span> AssetForge
          </button>
          <button
            className={`tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <span className="tab-icon">🔒</span> Security
          </button>
          <button
            className={`tab ${activeTab === "nexus" ? "active" : ""}`}
            onClick={() => setActiveTab("nexus")}
          >
            <span className="tab-icon">🦜</span> Parrot Nexus
          </button>
          <button
            className={`tab ${activeTab === "agentfactory" ? "active" : ""}`}
            onClick={() => setActiveTab("agentfactory")}
          >
            <span className="tab-icon">🤖</span> Agent Factory
          </button>
          <button
            className={`tab ${activeTab === "malwarelab" ? "active" : ""}`}
            onClick={() => setActiveTab("malwarelab")}
          >
            <span className="tab-icon">⛪</span> Malware Lab
          </button>
          <button
            className={`tab ${activeTab === "servers" ? "active" : ""}`}
            onClick={() => setActiveTab("servers")}
          >
            <span className="tab-icon">🖥️</span> Servers
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="main">
        {error && (
          <div className="error-banner">
            <span>⚠</span> Cannot reach orchestrator API — is{" "}
            <code>orchestrator.py serve</code> running?
            <button className="retry-btn" onClick={load}>
              retry
            </button>
          </div>
        )}

        {/* Agents tab */}
        {activeTab === "aiworkbench" && (
          <AIWorkbench system={system} />
        )}

        {/* GhostByte tab */}
        {activeTab === "ghostbyte" && (
          <GhostByte toolsList={tools} />
        )}

        {/* System tab */}
        {activeTab === "system" && (
          <SystemPanel data={data} system={system} />
        )}

        {/* Z0TH Studio tab */}
        {activeTab === "studio" && (
          <div style={{ padding: "1rem" }}>
            <ZothStudio />
          </div>
        )}

        {/* Security tab */}
        {activeTab === "security" && (
          <SecurityScanner />
        )}

        {/* Media generation tab */}
        {activeTab === "media" && (
          <MediaForge tools={tools} />
        )}

        {/* Parrot Nexus tab */}
        {activeTab === "nexus" && (
          <ParrotNexus />
        )}

        {/* Agent Factory tab */}
        {activeTab === "agentfactory" && (
          <AgentFactory />
        )}

        {/* Malware Lab tab */}
        {activeTab === "malwarelab" && (
          <MalwareLab />
        )}

        {/* Servers tab */}
        {activeTab === "servers" && (
          <ServerManager />
        )}

        {activeTab === "chains" && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">🔗</span> Tool Chains
            </h2>
            <div className="chain-list">
              {chains.length === 0 && (
                <p className="empty-state">No chains configured.</p>
              )}
              {chains.map((chain, i) => (
                <div key={i} className="chain-card">
                  <div className="chain-header">
                    <span className="chain-name">{chain.name || `Chain ${i + 1}`}</span>
                    <span className="chain-step-count">
                      {chain.steps?.length || 0} step
                      {(chain.steps?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {chain.description && (
                    <p className="chain-desc">{chain.description}</p>
                  )}
                  {chain.steps?.length > 0 && (
                    <div className="chain-steps">
                      {chain.steps.map((step, si) => (
                        <span key={si} className="chain-step">
                          {step.tool_id || step}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
