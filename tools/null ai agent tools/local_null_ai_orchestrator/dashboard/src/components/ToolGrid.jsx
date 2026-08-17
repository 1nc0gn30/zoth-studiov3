const RUNTIME_COLORS = {
  python: "#3572A5",
  node: "#339933",
  vite: "#646CFF",
  astro: "#FF5D01",
  streamlit: "#FF4B4B",
  go: "#00ADD8",
  shell: "#4EAA25",
  frontend: "#563D7C",
  unknown: "#666",
};

function ToolCard({ tool }) {
  const runtimes = tool.runtimes || [];
  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span className="tool-name">{tool.name}</span>
        <span className="tool-category">{tool.category || "Other"}</span>
      </div>
      {tool.description && (
        <p className="tool-desc">{tool.description}</p>
      )}
      {runtimes.length > 0 && (
        <div className="tool-runtimes">
          {runtimes.map((rt) => (
            <span
              key={rt}
              className="runtime-badge"
              style={{ "--rt-color": RUNTIME_COLORS[rt] || "#666" }}
            >
              {rt}
            </span>
          ))}
        </div>
      )}
      {tool.entrypoints && tool.entrypoints.length > 0 && (
        <div className="tool-entrypoints">
          {tool.entrypoints.slice(0, 3).map((ep, i) => (
            <code key={i} className="entrypoint">{ep}</code>
          ))}
          {tool.entrypoints.length > 3 && (
            <span className="entrypoint-more">+{tool.entrypoints.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ToolGrid({ tools }) {
  if (!tools || tools.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-kicker">A NullAI studio</p>
        <img className="empty-mascot" src="/assets/brand/zoth-seal-master.jpg" alt="Zoth Master Seal" width="48" height="48" />
        <p>No tools match your search.</p>
      </div>
    );
  }

  return (
    <div className="tool-grid">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
