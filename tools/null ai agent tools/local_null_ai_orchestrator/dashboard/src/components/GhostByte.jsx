import { useState, useEffect, useCallback } from "react";
import { getTools, execTool } from "../api";
import Terminal from "./Terminal";

const AGENTS = [
  { id: "codex", label: "Codex", icon: "⌘" },
  { id: "hermes", label: "Hermes", icon: "𓁟" },
  { id: "ollama", label: "Ollama", icon: "🦙" },
  { id: "openclaw", label: "OpenClaw", icon: "⚔" },
  { id: "shell", label: "Shell", icon: ">$" },
];

const COMMAND_PRESETS = {
  python: [
    { label: "Run entrypoint", cmd: "python3 {entrypoint}" },
    { label: "Install deps", cmd: "pip3 install -r requirements.txt" },
    { label: "Syntax check", cmd: "python3 -m py_compile {entrypoint}" },
  ],
  node: [
    { label: "Dev server", cmd: "npm run dev" },
    { label: "Build", cmd: "npm run build" },
    { label: "Install deps", cmd: "npm install" },
  ],
  vite: [
    { label: "Dev server", cmd: "npx vite" },
    { label: "Build", cmd: "npx vite build" },
  ],
  streamlit: [
    { label: "Run app", cmd: "streamlit run app.py" },
  ],
  astro: [
    { label: "Dev server", cmd: "npm run dev" },
    { label: "Build", cmd: "npm run build" },
  ],
  go: [
    { label: "Build", cmd: "go build ." },
    { label: "Run", cmd: "go run ." },
  ],
  shell: [
    { label: "Run script", cmd: "bash {entrypoint}" },
  ],
};

const CUSTOM_COMMANDS = [
  { label: "Shell (custom)", cmd: "custom" },
];

export default function GhostByte({ toolsList }) {
  const [tools, setTools] = useState(toolsList || []);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedCommand, setSelectedCommand] = useState("");
  const [customCmd, setCustomCmd] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("shell");
  const [terminalLines, setTerminalLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [toolSearch, setToolSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    captureOutput: true,
    showFullPath: false,
    timeout: 30,
  });

  useEffect(() => {
    if (toolsList && toolsList.length > 0) {
      setTools(toolsList);
    } else {
      getTools().then((d) => setTools(d.tools || [])).catch(() => {});
    }
  }, [toolsList]);

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(toolSearch.toLowerCase())
  );

  const handleSelectTool = (tool) => {
    setSelectedTool(tool);
    setSelectedCommand("");
    setCustomCmd("");
    setTerminalLines([]);
  };

  const getRuntimes = () => selectedTool?.runtimes || [];
  const getEntrypoint = () => {
    const eps = selectedTool?.entrypoints || [];
    return eps.find((e) => e.endsWith(".py")) || eps[0] || "";
  };

  const getPresetCommands = () => {
    const cmds = [];
    const rt = getRuntimes();
    for (const r of rt) {
      const presets = COMMAND_PRESETS[r];
      if (presets) {
        for (const p of presets) {
          const filled = p.cmd.replace("{entrypoint}", getEntrypoint());
          cmds.push({ label: p.label, cmd: filled });
        }
      }
    }
    // De-duplicate by cmd text
    const seen = new Set();
    return cmds.filter((c) => {
      if (seen.has(c.cmd)) return false;
      seen.add(c.cmd);
      return true;
    });
  };

  const resolveCommand = () => {
    if (selectedCommand === "custom") return customCmd.trim();
    return selectedCommand;
  };

  const handleRun = async () => {
    const cmd = resolveCommand();
    if (!cmd || !selectedTool) return;

    setRunning(true);
    setTerminalLines((prev) => [
      ...prev,
      { type: "system", text: `⦻ ghostbyte exec — ${selectedTool.name} @ ${selectedAgent}` },
      { type: "system", text: `$ ${cmd}` },
    ]);

    try {
      const result = await execTool(selectedTool.id, cmd, selectedAgent);
      const lines = [];

      if (result.stdout) {
        const outLines = result.stdout.split("\n").filter(Boolean);
        for (const l of outLines) lines.push({ type: "output", text: l });
      }
      if (result.stderr) {
        const errLines = result.stderr.split("\n").filter(Boolean);
        for (const l of errLines) lines.push({ type: "error", text: l });
      }

      lines.push({
        type: "system",
        text: `exit code: ${result.exit_code}  |  duration: ${result.duration_ms}ms`,
      });

      setTerminalLines((prev) => [...prev, ...lines]);
    } catch (e) {
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: `Error: ${e.message}` },
      ]);
    } finally {
      setRunning(false);
    }
  };

  const handleClear = () => setTerminalLines([]);

  return (
    <div className="ghostbyte">
      {/* Header */}
      <div className="ghostbyte-header">
        <img
          className="ghostbyte-logo"
          src="https://nullai.tech/DarkMode-NullAI-Icon.png"
          alt="GhostByte"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="ghostbyte-brand">
          <span className="ghostbyte-title">GhostByte</span>
          <span className="ghostbyte-sub">agent launchpad</span>
        </div>
        <div className="ghostbyte-header-actions">
          <button
            className="gb-btn gb-btn-secondary"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {/* Agent selector */}
      <div className="gb-agent-strip">
        <span className="gb-agent-label">Agent:</span>
        {AGENTS.map((a) => (
          <button
            key={a.id}
            className={`gb-agent-chip ${selectedAgent === a.id ? "active" : ""}`}
            onClick={() => setSelectedAgent(a.id)}
          >
            <span className="gb-agent-icon">{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* Main workspace: sidebar + terminal */}
      <div className="gb-workspace">
        {/* Tool sidebar */}
        <div className="gb-sidebar">
          <input
            className="gb-search"
            type="text"
            placeholder="Search tools..."
            value={toolSearch}
            onChange={(e) => setToolSearch(e.target.value)}
          />
          <div className="gb-tool-list">
            {filteredTools.map((t) => (
              <button
                key={t.id}
                className={`gb-tool-item ${selectedTool?.id === t.id ? "active" : ""}`}
                onClick={() => handleSelectTool(t)}
                title={t.description || ""}
              >
                <span className="gb-tool-name">{t.name}</span>
                <span className="gb-tool-rts">
                  {(t.runtimes || []).slice(0, 2).join(", ")}
                </span>
                {t.description && (
                  <span className="gb-tool-desc">{t.description}</span>
                )}
              </button>
            ))}
            {filteredTools.length === 0 && (
              <div className="gb-empty-tools">No tools match</div>
            )}
          </div>
        </div>

        {/* Command + Terminal area */}
        <div className="gb-main">
          {/* Command bar */}
          <div className="gb-command-bar">
            {!selectedTool ? (
              <div className="gb-prompt-placeholder">
                Select a tool from the sidebar to begin
              </div>
            ) : (
              <>
                <div className="gb-command-presets">
                  {getPresetCommands().map((p, i) => (
                    <button
                      key={i}
                      className={`gb-preset-btn ${selectedCommand === p.cmd ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCommand(p.cmd);
                        setCustomCmd("");
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    className={`gb-preset-btn custom ${selectedCommand === "custom" ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCommand("custom");
                      setCustomCmd("");
                    }}
                  >
                    ✎ Custom
                  </button>
                </div>
                {selectedCommand === "custom" ? (
                  <div className="gb-custom-input-row">
                    <span className="gb-shell-prompt">$</span>
                    <input
                      className="gb-custom-input"
                      type="text"
                      placeholder="Enter command..."
                      value={customCmd}
                      onChange={(e) => setCustomCmd(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRun(); }}
                    />
                  </div>
                ) : selectedCommand ? (
                  <div className="gb-cmd-preview">
                    <code className="gb-cmd-text">{selectedCommand}</code>
                  </div>
                ) : (
                  <div className="gb-prompt-placeholder">Pick a preset command above</div>
                )}
                {/* Run button */}
                <div className="gb-action-row">
                  <button
                    className="gb-btn gb-btn-primary"
                    onClick={handleRun}
                    disabled={running || !selectedCommand || (selectedCommand === "custom" && !customCmd.trim())}
                  >
                    {running ? "⏳ Running..." : "▶ Run"}
                  </button>
                  <button className="gb-btn gb-btn-ghost" onClick={handleClear}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Terminal */}
          <div className="gb-terminal-wrap">
            <Terminal lines={terminalLines} running={running} />
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <div className="gb-settings-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="gb-settings-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="gb-settings-title">⚙ GhostByte Settings</h3>
            <label className="gb-setting-row">
              <span>Capture output</span>
              <input
                type="checkbox"
                checked={settings.captureOutput}
                onChange={(e) => setSettings({ ...settings, captureOutput: e.target.checked })}
              />
            </label>
            <label className="gb-setting-row">
              <span>Show full paths</span>
              <input
                type="checkbox"
                checked={settings.showFullPath}
                onChange={(e) => setSettings({ ...settings, showFullPath: e.target.checked })}
              />
            </label>
            <label className="gb-setting-row">
              <span>Command timeout (s)</span>
              <input
                type="number"
                className="gb-setting-input"
                value={settings.timeout}
                min={5}
                max={300}
                onChange={(e) => setSettings({ ...settings, timeout: parseInt(e.target.value) || 30 })}
              />
            </label>
            <button
              className="gb-btn gb-btn-secondary"
              onClick={() => setSettingsOpen(false)}
              style={{ marginTop: 12, width: "100%" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
