import { useState, useEffect, useCallback } from "react";

const AI_TOOLS = [
  {
    id: "codex",
    label: "OpenAI Codex",
    icon: "⌘",
    desc: "Autonomous coding agent by OpenAI. Edits files, runs commands, and iterates on code in a sandboxed environment.",
    pkg: "@openai/codex",
    checkCmd: "codex",
    installCmd: "npm install -g @openai/codex",
    category: "Coding Agent",
    mcp: false,
  },
  {
    id: "gemini",
    label: "Gemini CLI",
    icon: "✦",
    desc: "Google's AI assistant for the terminal. Multi-modal reasoning, code generation, and file analysis via Gemini models.",
    pkg: "@google/gemini-cli",
    checkCmd: "gemini",
    installCmd: "npm install -g @google/gemini-cli",
    category: "Coding Agent",
    mcp: false,
  },
  {
    id: "ollama",
    label: "Ollama",
    icon: "🦙",
    desc: "Run LLMs locally (Llama, Gemma, Mistral, DeepSeek, etc.) with a simple CLI and REST API on port 11434.",
    pkg: "ollama",
    checkCmd: "ollama",
    installCmd: "curl -fsSL https://ollama.com/install.sh | sh",
    category: "Local LLM Runtime",
    mcp: false,
  },
  {
    id: "hexstrike",
    label: "HexStrike AI",
    icon: "⚔",
    desc: "AI-Powered MCP Cybersecurity Automation Platform for Parrot OS. Runs offensive security tools through AI agents with MCP protocol.",
    pkg: "hexstrike-ai",
    checkCmd: "hexstrike_mcp",
    installCmd: "sudo apt install hexstrike-ai",
    category: "Security AI",
    mcp: true,
    mcpConfig: { command: "python3", args: ["/usr/share/hexstrike-ai/hexstrike_mcp.py", "--server", "http://127.0.0.1:8888"] },
  },
  {
    id: "aider",
    label: "Aider",
    icon: "🤝",
    desc: "AI pair programming in your terminal. Works with GPT-4o, Claude, Gemini, DeepSeek, and local Ollama models. Edits code in your git repo.",
    pkg: "aider-chat",
    checkCmd: "aider",
    installCmd: "pip install aider-chat",
    category: "Coding Agent",
    mcp: false,
  },
  {
    id: "openai-cli",
    label: "OpenAI CLI",
    icon: "◈",
    desc: "Official OpenAI command-line interface for direct API access to GPT-4o, DALL-E, Whisper, and other OpenAI models.",
    pkg: "openai",
    checkCmd: "openai",
    installCmd: "pip install openai",
    category: "API Client",
    mcp: false,
  },
  {
    id: "copilot",
    label: "GitHub Copilot CLI",
    icon: "🐙",
    desc: "AI-powered command suggestions and code completions from GitHub. Integrates with VS Code and terminal.",
    pkg: "@githubnext/github-copilot-cli",
    checkCmd: "github-copilot-cli",
    installCmd: "npm install -g @githubnext/github-copilot-cli",
    category: "Coding Agent",
    mcp: false,
  },
  {
    id: "llm",
    label: "llm (Datasette)",
    icon: "🗣",
    desc: "CLI tool for running prompts against LLMs. Supports OpenAI, Anthropic, Google, Mistral, local models via Ollama, and more.",
    pkg: "llm",
    checkCmd: "llm",
    installCmd: "pip install llm",
    category: "CLI Wrapper",
    mcp: false,
  },
  {
    id: "fabric",
    label: "Fabric",
    icon: "🧵",
    desc: "Augment human capabilities with AI. Pattern-based CLI for summarization, extraction, and content generation using LLMs.",
    pkg: "fabric",
    checkCmd: "fabric",
    installCmd: "pip install fabric",
    category: "CLI Wrapper",
    mcp: false,
  },
  {
    id: "continue",
    label: "Continue",
    icon: "▶",
    desc: "Open-source AI code assistant. Connects to Codex, Claude, Ollama, and local models as a VS Code / JetBrains extension.",
    pkg: "continue",
    checkCmd: "continue",
    installCmd: "code --install-extension continue.continue",
    category: "IDE Extension",
    mcp: true,
  },
  {
    id: "hermes",
    label: "Hermes",
    icon: "𓁟",
    desc: "Autonomous agent framework for multi-step task execution and orchestration.",
    pkg: "hermes",
    checkCmd: "hermes",
    installCmd: "pip install hermes",
    category: "Agent Framework",
    mcp: false,
  },
  {
    id: "aicommit",
    label: "AI Commit",
    icon: "📝",
    desc: "Auto-generate meaningful git commit messages using AI. Works with OpenAI, Anthropic, and local models.",
    pkg: "aicommit",
    checkCmd: "aicommit",
    installCmd: "pip install aicommit",
    category: "Dev Utility",
    mcp: false,
  },
];

function ToolCard({ tool, installed, version, onInstall, onRun, running }) {
  const isRunning = running?.[tool.id];
  return (
    <div className={`aw-card ${installed ? "aw-card-installed" : "aw-card-missing"}`}>
      <div className="aw-card-header">
        <span className="aw-icon">{tool.icon}</span>
        <div className="aw-card-info">
          <span className="aw-label">{tool.label}</span>
          <span className="aw-cat">{tool.category}</span>
        </div>
        <div className="aw-card-badges">
          {tool.mcp && <span className="aw-badge aw-badge-mcp">MCP</span>}
          {installed ? (
            <span className="aw-badge aw-badge-ok">✓ Installed</span>
          ) : (
            <span className="aw-badge aw-badge-missing">Not Found</span>
          )}
        </div>
      </div>
      <p className="aw-desc">{tool.desc}</p>
      {version && <p className="aw-version">v{version}</p>}
      <div className="aw-card-actions">
        {installed ? (
          <button className="aw-btn aw-btn-run" onClick={() => onRun(tool)} disabled={!!isRunning}>
            {isRunning ? "⏳ Running…" : "▶ Run"}
          </button>
        ) : (
          <button className="aw-btn aw-btn-install" onClick={() => onInstall(tool)}>
            ⬇ Install
          </button>
        )}
        {installed && tool.mcp && (
          <span className="aw-mcp-hint">MCP server available</span>
        )}
      </div>
    </div>
  );
}

function InstallModal({ tool, onClose, onConfirm }) {
  if (!tool) return null;
  return (
    <div className="aw-modal-overlay" onClick={onClose}>
      <div className="aw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aw-modal-header">
          <h3>⬇ Install {tool.label}</h3>
          <button className="aw-btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="aw-modal-body">
          <p className="aw-modal-desc">{tool.desc}</p>
          <div className="aw-install-cmd-section">
            <span className="aw-install-label">Install command:</span>
            <code className="aw-install-cmd">{tool.installCmd}</code>
          </div>
          <p className="aw-modal-warn">⚠ This will run the install command on your system. Make sure you trust the source.</p>
        </div>
        <div className="aw-modal-footer">
          <button className="aw-btn aw-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="aw-btn aw-btn-primary" onClick={() => onConfirm(tool)}>Run Install</button>
        </div>
      </div>
    </div>
  );
}

export default function AIWorkbench({ system }) {
  const [toolStatus, setToolStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [installTool, setInstallTool] = useState(null);
  const [running, setRunning] = useState({});
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all");

  const checkTools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-workbench/status");
      const data = await res.json();
      setToolStatus(data.tools || {});
    } catch {
      // Fallback: check from system data
      const backends = system?.agents || {};
      const fallback = {};
      AI_TOOLS.forEach((t) => {
        fallback[t.id] = { installed: !!backends[t.id]?.available, version: system?.agent_versions?.[t.id] || null };
      });
      setToolStatus(fallback);
    }
    setLoading(false);
  }, [system]);

  useEffect(() => { checkTools(); }, [checkTools]);

  const handleInstall = async (tool) => {
    const cmd = toolStatus[tool.id]?.install_cmd || tool.installCmd;
    try {
      const res = await fetch("/api/ai-workbench/install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_id: tool.id, install_cmd: cmd }),
      });
      const data = await res.json();
      setResult(data);
      setTimeout(() => checkTools(), 2000);
    } catch (e) {
      setResult({ error: e.message });
    }
    setInstallTool(null);
  };

  const handleRun = async (tool) => {
    setRunning((prev) => ({ ...prev, [tool.id]: true }));
    setResult(null);
    try {
      const res = await fetch("/api/ai-workbench/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_id: tool.id, check_cmd: tool.checkCmd }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    }
    setTimeout(() => setRunning((prev) => ({ ...prev, [tool.id]: false })), 3000);
  };

  const categories = ["all", ...new Set(AI_TOOLS.map((t) => t.category.toLowerCase()))];
  const filtered = AI_TOOLS.filter((t) => {
    if (filter === "all") return true;
    if (filter === "installed") return toolStatus[t.id]?.installed;
    if (filter === "missing") return !toolStatus[t.id]?.installed;
    return t.category.toLowerCase() === filter;
  });

  const installedCount = AI_TOOLS.filter((t) => toolStatus[t.id]?.installed).length;

  return (
    <section className="aw-container">
      <div className="aw-header">
        <div>
          <h2 className="aw-title">◈ AI Workbench</h2>
          <p className="aw-subtitle">Install, run, and manage AI coding agents, MCP servers, and CLI tools</p>
        </div>
        <div className="aw-header-stats">
          <span className="aw-stat">{installedCount}/{AI_TOOLS.length} installed</span>
          <button className="aw-btn aw-btn-secondary" onClick={checkTools} disabled={loading}>
            {loading ? "Scanning…" : "↻ Re-scan"}
          </button>
        </div>
      </div>

      <div className="aw-filters">
        {["all", "installed", "missing", "coding agent", "local llm runtime", "security ai", "cli wrapper", "api client", "ide extension", "agent framework", "dev utility"].map((f) => (
          <button key={f} className={`aw-filter ${filter === f ? "aw-filter-active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "installed" ? "✓ Installed" : f === "missing" ? "⬇ Not Installed" : f.replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="aw-loading">Scanning installed tools…</p>
      ) : (
        <div className="aw-grid">
          {filtered.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              installed={toolStatus[tool.id]?.installed}
              version={toolStatus[tool.id]?.version}
              onInstall={setInstallTool}
              onRun={handleRun}
              running={running}
            />
          ))}
        </div>
      )}

      {result && (
        <div className={`aw-result ${result.error ? "aw-result-err" : "aw-result-ok"}`}>
          {result.error ? `⚠ ${result.error}` : result.message || `✓ ${result.status}`}
          <button className="aw-btn-ghost" onClick={() => setResult(null)}>✕</button>
        </div>
      )}

      {installTool && (
        <InstallModal tool={installTool} onClose={() => setInstallTool(null)} onConfirm={handleInstall} />
      )}
    </section>
  );
}
