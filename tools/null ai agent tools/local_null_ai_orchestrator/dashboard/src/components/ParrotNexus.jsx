import { useState, useEffect, useMemo } from "react";

const CACHE_DURATION = 120000;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`);
  }
  return res.json();
}

function useDashboardData() {
  const [dashboard, setDashboard] = useState(null);
  const [tools, setTools] = useState(null);
  const [presets, setPresets] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dash, toolsData, presetsData, playbooksData] = await Promise.all([
        fetchJSON("/api/parrot-nexus/dashboard"),
        fetchJSON("/api/parrot-nexus/tools"),
        fetchJSON("/api/parrot-nexus/presets"),
        fetchJSON("/api/parrot-nexus/playbooks"),
      ]);
      setDashboard(dash);
      setTools(toolsData);
      setPresets(presetsData?.presets || []);
      setPlaybooks(playbooksData?.playbooks || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, CACHE_DURATION);
    return () => clearInterval(id);
  }, []);

  return { dashboard, tools, presets, playbooks, error, loading, reload: load };
}

const LAUNCH_TYPE_LABELS = {
  "on-demand": { label: "Available to Launch", color: "#f59e0b", icon: "⏸" },
  "cli": { label: "CLI", color: "#3b82f6", icon: "⟩" },
  "dev": { label: "Runtime", color: "#22c55e", icon: "⚙" },
};

function StatusRow({ dashboard }) {
  return (
    <div className="pn-status-row">
      <StatusChip label="System Tools" value={dashboard?.tool_count ?? "..."} />
      <StatusChip label="Categories" value={dashboard?.category_count ?? "..."} />
      <StatusChip label="Curated" value={dashboard?.curated ?? "..."} />
      <StatusChip label="Presets" value={dashboard?.preset_count ?? "..."} />
      <StatusChip label="Playbooks" value={dashboard?.playbook_count ?? "..."} />
      <span className="pn-hint">
        Tools are available to launch on demand — not auto-started
      </span>
    </div>
  );
}

function StatusChip({ label, ok, value }) {
  const bg = ok === true ? "var(--accent-green)" : ok === false ? "var(--accent-red)" : "var(--text-muted)";
  return (
    <div className="pn-chip">
      {ok !== undefined && <span className="pn-chip-dot" style={{ background: bg }} />}
      <span className="pn-chip-label">{label}</span>
      {value !== undefined && <span className="pn-chip-value">{value}</span>}
    </div>
  );
}

function CategoryBar({ categories }) {
  if (!categories) return null;
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  return (
    <div className="pn-category-bar">
      <div className="pn-section-label">Categories</div>
      {entries.map(([cat, count]) => (
        <div key={cat} className="pn-cat-row">
          <span className="pn-cat-label">{cat}</span>
          <div className="pn-cat-track">
            <div className="pn-cat-fill" style={{ width: `${(count / maxVal) * 100}%` }} />
          </div>
          <span className="pn-cat-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ToolCard({ tool, onSelect }) {
  const launchType = tool.launch_type || "cli";
  const lt = LAUNCH_TYPE_LABELS[launchType] || LAUNCH_TYPE_LABELS["cli"];
  return (
    <button className={`pn-tool-card pn-launch-${launchType}`} onClick={() => onSelect(tool)}>
      <div className="pn-tool-header">
        <span className="pn-tool-name">{tool.name}</span>
        <span className="pn-launch-badge" style={{ color: lt.color, borderColor: lt.color }}>
          {lt.icon} {lt.label}
        </span>
      </div>
      <div className="pn-tool-meta">
        <span className="pn-tool-cat">{tool.category}</span>
        {tool.version && <span className="pn-tool-version">{tool.version.slice(0, 40)}</span>}
      </div>
      {tool.description && <div className="pn-tool-desc">{tool.description}</div>}
      {tool.command && <code className="pn-tool-command">{tool.command}</code>}
      <div className="pn-tool-path" title={tool.path}>{tool.path}</div>
    </button>
  );
}

function ToolDetail({ tool, onClose }) {
  const launchType = tool.launch_type || "cli";
  const lt = LAUNCH_TYPE_LABELS[launchType] || LAUNCH_TYPE_LABELS["cli"];
  return (
    <div className="pn-detail-overlay" onClick={onClose}>
      <div className="pn-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="pn-detail-header">
          <span className="pn-detail-name">{tool.name}</span>
          <button className="pn-detail-close" onClick={onClose}>✕</button>
        </div>
        <div className="pn-detail-body">
          <div className="pn-detail-row">
            <span className="pn-detail-key">Category</span>
            <span className="pn-detail-val">{tool.category}</span>
          </div>
          <div className="pn-detail-row">
            <span className="pn-detail-key">Launch Type</span>
            <span className="pn-detail-val" style={{ color: lt.color }}>
              {lt.icon} {lt.label}
            </span>
          </div>
          {tool.version && (
            <div className="pn-detail-row">
              <span className="pn-detail-key">Version</span>
              <span className="pn-detail-val" style={{ fontFamily: "var(--font-mono)" }}>{tool.version}</span>
            </div>
          )}
          <div className="pn-detail-row">
            <span className="pn-detail-key">Path</span>
            <code className="pn-detail-path">{tool.path}</code>
          </div>
          {tool.description && (
            <div className="pn-detail-note">{tool.description}</div>
          )}
          {tool.command && (
            <div className="pn-detail-row">
              <span className="pn-detail-key">Command</span>
              <code className="pn-detail-path">{tool.command}</code>
            </div>
          )}
          {tool.examples?.length > 0 && (
            <div className="pn-detail-block">
              <span className="pn-detail-key">Examples</span>
              {tool.examples.map((cmd) => (
                <code key={cmd} className="pn-detail-code">{cmd}</code>
              ))}
            </div>
          )}
          {tool.how_to?.length > 0 && (
            <div className="pn-detail-block">
              <span className="pn-detail-key">How To</span>
              <ol className="pn-detail-list">
                {tool.how_to.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          )}
          {tool.playbooks?.length > 0 && (
            <div className="pn-detail-block">
              <span className="pn-detail-key">Playbooks</span>
              <div className="pn-detail-tags">
                {tool.playbooks.map((pb) => <span key={pb}>{pb}</span>)}
              </div>
            </div>
          )}
          <div className="pn-detail-note">
            {launchType === "on-demand"
              ? "This tool is available to launch from Parrot Nexus. It will not start automatically — click Launch when ready."
              : launchType === "cli"
              ? "Command-line tool. Invoke directly from the terminal or GhostByte."
              : "Development runtime. Available in your PATH for builds and scripting."}
          </div>
        </div>
        <div className="pn-detail-actions">
          {launchType === "on-demand" && (
            <button className="pn-btn pn-btn-launch" onClick={() => {
              // For now, just inform — actual launch integration can be added per-tool
                alert(`To launch ${tool.name}, run it from your Parrot OS applications menu or terminal:\n\n$ ${tool.command || tool.name}`);
            }}>
              ▶ Launch {tool.name}
            </button>
          )}
          {launchType === "cli" && (
            <button className="pn-btn pn-btn-cli" onClick={() => {
              navigator.clipboard?.writeText(tool.command || tool.name);
            }}>
              ⎘ Copy Command
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParrotNexus() {
  const { dashboard, tools, presets, playbooks, error, loading, reload } = useDashboardData();
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedPb, setSelectedPb] = useState(null);
  const [filterCat, setFilterCat] = useState("All");

  const filteredTools = useMemo(() => {
    if (!tools?.tools) return [];
    let list = tools.tools;
    if (filterCat !== "All") {
      list = list.filter((t) => t.category === filterCat);
    }
    const term = search.toLowerCase().trim();
    if (!term) return list;
    return list.filter((t) =>
      t.name.toLowerCase().includes(term) ||
      (t.command || "").toLowerCase().includes(term) ||
      (t.description || "").toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      (t.path || "").toLowerCase().includes(term) ||
      (t.playbooks || []).some((p) => p.toLowerCase().includes(term)) ||
      (t.how_to || []).some((p) => p.toLowerCase().includes(term))
    );
  }, [tools, search, filterCat]);

  const categories = useMemo(() => {
    if (!tools?.tools) return ["All"];
    return ["All", ...new Set(tools.tools.map((t) => t.category))];
  }, [tools]);

  if (loading && !tools) {
    return (
      <section className="pn-container">
        <div className="pn-title">🦜 Parrot Nexus</div>
        <p className="pn-loading">Scanning all Parrot OS tools…</p>
      </section>
    );
  }

  if (error && !tools) {
    return (
      <section className="pn-container">
        <div className="pn-title">🦜 Parrot Nexus</div>
        <div className="error-banner"><span>⚠ {error}</span><button className="retry-btn" onClick={reload}>Retry</button></div>
      </section>
    );
  }

  return (
    <section className="pn-container">
      <div className="pn-title-row">
        <span className="pn-title">🦜 Parrot Nexus</span>
        <span className="pn-subtitle">Parrot OS Tool Inventory</span>
        <button className="pn-refresh" onClick={reload}>↻ Refresh</button>
      </div>

      <StatusRow dashboard={dashboard} />

      <CategoryBar categories={dashboard?.categories} />

      {/* Category filter chips */}
      <div className="pn-filter-row">
        {categories.slice(0, 15).map((cat) => (
          <button
            key={cat}
            className={`pn-filter-chip ${filterCat === cat ? "active" : ""}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
            {cat !== "All" && tools?.tools && (
              <span className="pn-filter-count">
                {tools.tools.filter((t) => t.category === cat).length}
              </span>
            )}
          </button>
        ))}
        {categories.length > 15 && (
          <span className="pn-filter-more">+{categories.length - 15} more</span>
        )}
      </div>

      {/* Search */}
      <div className="pn-search-row">
        <input
          className="pn-search"
          type="text"
          placeholder="Search tools by name, category, or path…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tool grid */}
      <div className="pn-tool-grid">
        {filteredTools.slice(0, 200).map((tool) => (
          <ToolCard key={tool.name + tool.path} tool={tool} onSelect={setSelectedTool} />
        ))}
        {filteredTools.length === 0 && (
          <div className="pn-empty">No tools found{search ? ` for "${search}"` : ""}.</div>
        )}
        {filteredTools.length > 300 && (
          <div className="pn-more">Showing 200 of {filteredTools.length} — refine search to narrow down.</div>
        )}
      </div>

      {/* Launch type legend */}
      <div className="pn-legend">
        <span className="pn-legend-item">
          <span style={{ color: "#f59e0b" }}>⏸ Available to Launch</span> — GUI/heavy tools (Maltego, Burp, OWASP ZAP, etc.) — not auto-started
        </span>
        <span className="pn-legend-item">
          <span style={{ color: "#3b82f6" }}>⟩ CLI</span> — Command-line tools you can invoke from terminal or GhostByte
        </span>
        <span className="pn-legend-item">
          <span style={{ color: "#22c55e" }}>⚙ Runtime</span> — Development runtimes (python, node, go, etc.)
        </span>
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div className="pn-section">
          <div className="pn-section-label">⚡ Presets ({presets.length})</div>
          <div className="pn-presets">
            {presets.map((p) => (
              <div key={p.id} className="pn-preset-card">
                <div className="pn-preset-name">{p.name}</div>
                <code className="pn-preset-cmd">{p.executable} {p.args?.join(" ") || ""}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playbooks */}
      {playbooks.length > 0 && (
        <div className="pn-section">
          <div className="pn-section-label">🎯 Playbooks ({playbooks.length})</div>
          <div className="pn-playbooks">
            {playbooks.map((pb) => (
              <button
                key={pb.id}
                className={`pn-playbook-card ${selectedPb?.id === pb.id ? "selected" : ""}`}
                onClick={() => setSelectedPb(selectedPb?.id === pb.id ? null : pb)}
              >
                <div className="pn-playbook-name">{pb.name}</div>
                <div className="pn-playbook-desc">{pb.description?.slice(0, 120)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tool Detail Modal */}
      {selectedTool && <ToolDetail tool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </section>
  );
}
