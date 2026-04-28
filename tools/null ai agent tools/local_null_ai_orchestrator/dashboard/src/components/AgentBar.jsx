const AGENTS = [
  { id: "codex", label: "Codex", icon: "⌘" },
  { id: "hermes", label: "Hermes", icon: "𓁟" },
  { id: "openclaw", label: "OpenClaw", icon: "⚔" },
  { id: "ollama", label: "Ollama", icon: "🦙" },
  { id: "aicommit", label: "AI Commit", icon: "📝" },
  { id: "copilot", label: "Copilot", icon: "✦" },
];

function AgentCard({ agent, available, version }) {
  return (
    <div className={`agent-card ${available ? "available" : "unavailable"}`}>
      <div className="agent-status-dot" />
      <div className="agent-icon">{agent.icon}</div>
      <div className="agent-info">
        <span className="agent-label">{agent.label}</span>
        {version && <span className="agent-version">{version}</span>}
      </div>
      <span className={`agent-status-label ${available ? "up" : "down"}`}>
        {available ? "available" : "offline"}
      </span>
    </div>
  );
}

export default function AgentBar({ system }) {
  const backends = system?.agents || {};
  const agentVersions = {};
  if (system?.agent_versions) {
    Object.assign(agentVersions, system.agent_versions);
  }

  return (
    <section>
      <h2 className="section-title">
        <span className="section-icon">🤖</span> Agent Backends
      </h2>
      <div className="agent-grid">
        {AGENTS.map((agent) => {
          const backend = backends[agent.id];
          const available = backend?.available || false;
          return (
            <AgentCard
              key={agent.id}
              agent={agent}
              available={available}
              version={agentVersions[agent.id]}
            />
          );
        })}
      </div>
      <p className="agent-hint">
        Agents are detected automatically. Launch{" "}
        <code>orchestrator.py serve</code> to keep the API online.
      </p>
    </section>
  );
}
