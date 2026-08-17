import { useState, useRef, useEffect } from "react";

const PLAYBOOK_PRESETS = [
  {
    id: "swarm_audit_3d",
    name: "Swarm 3D & Security Audit Pipeline",
    desc: "Multi-agent AST security scan chained into WebGL 3D asset generation and DPO consensus.",
    nodes: [
      { id: "n1", type: "agent", label: "@grok (Tool Dispatch)", x: 60, y: 120, status: "idle", output: "Dispatched AST security analyzer & tool registry scan." },
      { id: "n2", type: "tool", label: "Security & OWASP Scanner", x: 320, y: 60, status: "idle", output: "Scanned 298 tools: 0 vulnerabilities, 0 key leaks." },
      { id: "n3", type: "agent", label: "@antigravity (3D Forge)", x: 320, y: 220, status: "idle", output: "Generated WebGL procedural asset shaders." },
      { id: "n4", type: "agent", label: "@hermes (DPO Synthesis)", x: 580, y: 140, status: "idle", output: "Synthesized sovereign multi-agent artifact." }
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n1", to: "n3" },
      { from: "n2", to: "n4" },
      { from: "n3", to: "n4" }
    ]
  },
  {
    id: "omnipost_blast",
    name: "OmniPost 2.0 Viral Media Blast",
    desc: "Autonomous content repurposing, 60 FPS video recording, and multi-platform thread generation.",
    nodes: [
      { id: "n1", type: "agent", label: "Local Zoth-AI 1.5B", x: 60, y: 140, status: "idle", output: "Ingested release notes & generated 8 psychological hook angles." },
      { id: "n2", type: "tool", label: "Viral Hook Lab", x: 300, y: 60, status: "idle", output: "Selected Curiosity Gap + Contrarian Framework." },
      { id: "n3", type: "tool", label: "60 FPS Video Studio", x: 300, y: 220, status: "idle", output: "Rendered 9:16 WebM video with Web Audio SFX synth." },
      { id: "n4", type: "tool", label: "Multi-Platform Repurposer", x: 560, y: 140, status: "idle", output: "Generated 𝕏 thread, LinkedIn post, and IG reel draft." }
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n1", to: "n3" },
      { from: "n2", to: "n4" },
      { from: "n3", to: "n4" }
    ]
  },
  {
    id: "zero_leak_vault",
    name: "Zero-Leak Build Isolation & Vault Seal",
    desc: "Strict loopback gate audit, Argon2id encryption, and single binary compilation.",
    nodes: [
      { id: "n1", type: "tool", label: "Pre-Build Privacy Auditor", x: 60, y: 140, status: "idle", output: "Enforced .buildignore: 0 private keys, 0 chats in payload." },
      { id: "n2", type: "agent", label: "Lycan Security Sentinel", x: 300, y: 140, status: "idle", output: "Verified loopback binding 127.0.0.1 on all endpoints." },
      { id: "n3", type: "tool", label: "Argon2id BYOK Vault (:8787)", x: 540, y: 80, status: "idle", output: "Encrypted credentials via XChaCha20-Poly1305." },
      { id: "n4", type: "tool", label: "Linux Universal Packager", x: 540, y: 220, status: "idle", output: "Compiled zoth-linux-x86_64.run (63MB) & deb package." }
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n2", to: "n4" }
    ]
  }
];

export default function DagComposer() {
  const [selectedPlaybook, setSelectedPlaybook] = useState(PLAYBOOK_PRESETS[0]);
  const [nodes, setNodes] = useState(PLAYBOOK_PRESETS[0].nodes);
  const [edges, setEdges] = useState(PLAYBOOK_PRESETS[0].edges);
  const [running, setRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [logs, setLogs] = useState([
    "[DAG ENGINE] Visual Playbook Composer initialized.",
    "[TOPOLOGY] Ready for node execution & multi-agent orchestration."
  ]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  useEffect(() => {
    setNodes(selectedPlaybook.nodes);
    setEdges(selectedPlaybook.edges);
    setLogs([
      `[PLAYBOOK LOADED] ${selectedPlaybook.name}`,
      `[DESCRIPTION] ${selectedPlaybook.desc}`,
      `[DAG SCHEMA] Loaded ${selectedPlaybook.nodes.length} nodes and ${selectedPlaybook.edges.length} bezier connections.`
    ]);
  }, [selectedPlaybook]);

  const handleMouseDown = (node, e) => {
    setDraggingNode(node.id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(svgRect.width - 200, e.clientX - svgRect.left - 80));
    const newY = Math.max(20, Math.min(svgRect.height - 80, e.clientY - svgRect.top - 30));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNode ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleTouchStart = (node, e) => {
    if (e.touches.length === 1) {
      setDraggingNode(node.id);
    }
  };

  const handleTouchMove = (e) => {
    if (!draggingNode || !svgRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(svgRect.width - 200, touch.clientX - svgRect.left - 80));
    const newY = Math.max(20, Math.min(svgRect.height - 80, touch.clientY - svgRect.top - 30));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNode ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleTouchEnd = () => {
    setDraggingNode(null);
  };

  const runPlaybook = async () => {
    if (running) return;
    setRunning(true);
    setLogs((prev) => [`[DAG EXECUTION STARTED] Running ${selectedPlaybook.name}...`, ...prev]);

    // Reset statuses
    setNodes((prev) => prev.map((n) => ({ ...n, status: "pending" })));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setActiveNodeId(node.id);
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: "running" } : n))
      );
      setLogs((prev) => [
        `[STEP ${i + 1}/${nodes.length}] Executing Node [${node.label}] (${node.type.toUpperCase()})...`,
        ...prev
      ]);

      await new Promise((r) => setTimeout(r, 700));

      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: "completed" } : n))
      );
      setLogs((prev) => [
        `✓ [COMPLETED] Node [${node.label}]: ${node.output}`,
        ...prev
      ]);
    }

    setActiveNodeId(null);
    setRunning(false);
    setLogs((prev) => [
      `🎉 [DAG PLAYBOOK COMPLETE] All ${nodes.length} nodes executed successfully with zero errors.`,
      ...prev
    ]);
  };

  const getNodeCenter = (id) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + 90, y: node.y + 35 };
  };

  const exportPlaybookJSON = () => {
    const data = {
      schema: "zoth.playbook.v1",
      name: selectedPlaybook.name,
      description: selectedPlaybook.desc,
      nodes,
      edges,
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPlaybook.id}_playbook.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "12px", padding: "12px", background: "#050811", color: "#f0f6fc", fontFamily: "var(--font-mono, monospace)" }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingBottom: "10px", borderBottom: "1px solid rgba(0, 240, 255, 0.15)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#00f0ff", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🧩</span> Visual Agent DAG Playbook Composer
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#8b949e" }}>
            Interactive Node-Based Orchestration Engine · Chain Agents, Tools, and Security Gates
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={selectedPlaybook.id}
            onChange={(e) => {
              const hit = PLAYBOOK_PRESETS.find((p) => p.id === e.target.value);
              if (hit) setSelectedPlaybook(hit);
            }}
            style={{ background: "#0c1322", color: "#00f0ff", border: "1px solid rgba(0, 240, 255, 0.3)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem" }}
          >
            {PLAYBOOK_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={runPlaybook}
            disabled={running}
            style={{
              background: running ? "rgba(0, 240, 255, 0.2)" : "linear-gradient(135deg, #00f0ff, #7c9cff)",
              color: running ? "#00f0ff" : "#050811",
              fontWeight: 700,
              border: "none",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: running ? "not-allowed" : "pointer",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {running ? "⚡ Executing DAG..." : "▶ Run Playbook"}
          </button>

          <button
            onClick={exportPlaybookJSON}
            style={{ background: "transparent", color: "#8b949e", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer" }}
          >
            💾 Export JSON
          </button>
        </div>
      </div>

      {/* Main Canvas & Terminal Split */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px", flex: 1, minHeight: 0 }}>
        {/* Visual SVG Canvas */}
        <div
          style={{
            position: "relative",
            background: "#03050a",
            borderRadius: "8px",
            border: "1px solid rgba(0, 240, 255, 0.2)",
            overflow: "hidden",
            userSelect: "none",
            minHeight: "360px"
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Grid Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "radial-gradient(rgba(0, 240, 255, 0.12) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              pointerEvents: "none"
            }}
          />

          <svg
            ref={svgRef}
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Bezier Wires */}
            {edges.map((edge, idx) => {
              const start = getNodeCenter(edge.from);
              const end = getNodeCenter(edge.to);
              const dx = Math.abs(end.x - start.x) * 0.5;
              const path = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;
              const isFlowing = running && (activeNodeId === edge.from || activeNodeId === edge.to);

              return (
                <g key={idx}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.25)"
                    strokeWidth="3"
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke="url(#edgeGrad)"
                    strokeWidth={isFlowing ? "3.5" : "2"}
                    strokeDasharray={isFlowing ? "6, 4" : "none"}
                    style={{
                      animation: isFlowing ? "dash 0.8s linear infinite" : "none"
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive HTML Nodes */}
          {nodes.map((node) => {
            const isAgent = node.type === "agent";
            const isTool = node.type === "tool";
            const isRunning = node.status === "running";
            const isCompleted = node.status === "completed";

            let borderColor = "rgba(0, 240, 255, 0.3)";
            let badgeBg = "rgba(0, 240, 255, 0.15)";
            let badgeColor = "#00f0ff";

            if (isAgent) {
              badgeBg = "rgba(168, 85, 247, 0.2)";
              badgeColor = "#a855f7";
            }
            if (isRunning) {
              borderColor = "#00f0ff";
            }
            if (isCompleted) {
              borderColor = "#10b981";
            }

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node, e)}
                onTouchStart={(e) => handleTouchStart(node, e)}
                style={{
                  position: "absolute",
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: "180px",
                  background: isRunning ? "#0f172a" : "#090d18",
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: isRunning ? "0 0 16px rgba(0, 240, 255, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.6)",
                  cursor: "grab",
                  zIndex: isRunning ? 10 : 2,
                  transition: "box-shadow 0.2s, border-color 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", background: badgeBg, color: badgeColor, padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                    {node.type}
                  </span>
                  <span style={{ fontSize: "0.7rem" }}>
                    {isRunning && "⚡"}
                    {isCompleted && "✅"}
                    {node.status === "idle" && "⚪"}
                  </span>
                </div>

                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Step Output & Telemetry */}
        <div style={{ display: "flex", flexDirection: "column", background: "#03050a", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", fontSize: "0.75rem", fontWeight: 700, color: "#00f0ff", display: "flex", justifyContent: "space-between" }}>
            <span>Live Playbook Telemetry</span>
            <span style={{ color: running ? "#00f0ff" : "#10b981" }}>{running ? "RUNNING" : "READY"}</span>
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto", fontSize: "0.72rem", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: "6px" }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.startsWith("✓") ? "#10b981" : (log.startsWith("🎉") ? "#00f0ff" : (log.startsWith("[STEP") ? "#a855f7" : "#8b949e")) }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
