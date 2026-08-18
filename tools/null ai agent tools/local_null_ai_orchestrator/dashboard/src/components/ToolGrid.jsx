import { useMemo, useState } from "react";

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

function ToolCard({ tool, onUseTemplate }) {
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
      {tool.kind === "template" && onUseTemplate && (
        <button type="button" className="tool-use-btn" onClick={() => onUseTemplate(tool)}>
          Use in Studio
        </button>
      )}
    </div>
  );
}

export default function ToolGrid({ tools, onUseTemplate }) {
  const [view, setView] = useState("tool");
  const [q, setQ] = useState("");
  const catalog = tools || [];
  const toolsN = catalog.filter((t) => t.kind === "tool").length;
  const templatesN = catalog.filter((t) => (t.kind || "template") === "template").length;

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.filter((t) => {
      const kind = t.kind || "template";
      if (kind !== view) return false;
      if (!needle) return true;
      return (
        String(t.name || "").toLowerCase().includes(needle) ||
        String(t.id || "").toLowerCase().includes(needle) ||
        String(t.category || "").toLowerCase().includes(needle)
      );
    });
  }, [catalog, view, q]);

  return (
    <div className="tool-wall">
      <div className="tool-wall-bar">
        <div className="tool-wall-tabs">
          <button type="button" className={view === "tool" ? "on" : ""} onClick={() => setView("tool")}>
            Tools <small>{toolsN}</small>
          </button>
          <button type="button" className={view === "template" ? "on" : ""} onClick={() => setView("template")}>
            Templates <small>{templatesN}</small>
          </button>
        </div>
        <input
          className="tool-wall-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={view === "tool" ? "Find a tool" : "Find a template"}
          aria-label="Filter catalog"
        />
      </div>
      <p className="muted">
        {view === "tool"
          ? "Runnable tools only. Client sites and course shells live under Templates."
          : "Design templates and site shells. Use one as a shape for Studio — do not /run these."}
      </p>
      {shown.length === 0 ? (
        <div className="empty-state">
          <p className="empty-kicker">Catalog</p>
          <p>No {view === "tool" ? "tools" : "templates"} match.</p>
        </div>
      ) : (
        <div className="tool-grid">
          {shown.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onUseTemplate={onUseTemplate} />
          ))}
        </div>
      )}
    </div>
  );
}
