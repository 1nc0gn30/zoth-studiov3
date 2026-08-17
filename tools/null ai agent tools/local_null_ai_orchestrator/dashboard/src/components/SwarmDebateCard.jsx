import { useState } from "react";

export default function SwarmDebateCard({ debate, onExecuteSynthesis }) {
  const [activePeer, setActivePeer] = useState("antigravity");

  if (!debate) return null;

  const peers = debate.peers || [
    {
      id: "antigravity",
      name: "Antigravity",
      spirit: "🐺 Lycan (Systems Orchestrator)",
      color: "#7c9cff",
      argument: debate.antigravity_output || "Orchestrating local loopback bindings across :8484 and :8088. Enforcing zero key leakage and optimal 3D shader pipeline.",
      confidence: 96
    },
    {
      id: "grok",
      name: "Grok 4.5",
      spirit: "🦊 Kitsune (Tool & AST Dispatch)",
      color: "#00d4aa",
      argument: debate.grok_output || "Inspected tool registry & GitHub dispatch hooks. Verified AST syntax integrity across all generated TypeScript/Python modules.",
      confidence: 94
    },
    {
      id: "hermes",
      name: "Nous Hermes 3",
      spirit: "🐲 Radical Minion (DPO Synthesis)",
      color: "#ffaa40",
      argument: debate.hermes_output || "Applying DPO alignment filters and structuring final user-facing instructions with clean mathematical formulations.",
      confidence: 92
    },
    {
      id: "zoth_ai",
      name: "Zoth-AI 1.5B",
      spirit: "🐲 Sovereign Local Kernel",
      color: "#00f0ff",
      argument: debate.zoth_ai_output || "Running on 127.0.0.1:11434 (Q4_K_M). Verified OmniPost 60 FPS recording compatibility and Argon2id BYOK isolation.",
      confidence: 98
    }
  ];

  const currentPeer = peers.find((p) => p.id === activePeer) || peers[0];
  const consensusScore = debate.consensus_score || 95.8;
  const entropy = debate.agreement_entropy || 1.142;

  return (
    <div style={{ background: "rgba(9, 14, 28, 0.95)", border: "1px solid rgba(0, 240, 255, 0.3)", borderRadius: "10px", padding: "14px", margin: "10px 0", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.1rem" }}>🌐</span>
          <span style={{ fontWeight: 800, color: "#00f0ff", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Multi-Agent Swarm Consensus Matrix
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.75rem", fontFamily: "var(--font-mono, monospace)" }}>
          <span style={{ color: "#10b981", fontWeight: 700 }}>
            Consensus: {consensusScore}%
          </span>
          <span style={{ color: "#a855f7" }}>
            H(X): {entropy} bits
          </span>
        </div>
      </div>

      {/* Peer Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        {peers.map((peer) => (
          <button
            key={peer.id}
            onClick={() => setActivePeer(peer.id)}
            style={{
              background: activePeer === peer.id ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
              color: activePeer === peer.id ? "#00f0ff" : "#8b949e",
              border: `1px solid ${activePeer === peer.id ? "#00f0ff" : "transparent"}`,
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: peer.color }}></span>
            <span>{peer.name}</span>
          </button>
        ))}
      </div>

      {/* Peer Argument Pane */}
      <div style={{ background: "#03050a", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.72rem", color: currentPeer.color }}>
          <span>{currentPeer.spirit}</span>
          <span>Confidence: {currentPeer.confidence}%</span>
        </div>
        <div style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "#f0f6fc" }}>
          {currentPeer.argument}
        </div>
      </div>

      {/* Synthesized Output Banner */}
      {debate.synthesis && (
        <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase" }}>
              ⚡ Unified Consensus Artifact
            </div>
            <div style={{ fontSize: "0.8rem", color: "#fff", marginTop: "2px" }}>
              {debate.synthesis_title || "Multi-Agent Synthesized Action Plan & Directives"}
            </div>
          </div>

          {onExecuteSynthesis && (
            <button
              onClick={() => onExecuteSynthesis(debate.synthesis)}
              style={{ background: "#10b981", color: "#03050a", border: "none", fontWeight: 700, padding: "5px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "0.75rem" }}
            >
              ▶ Accept & Run
            </button>
          )}
        </div>
      )}
    </div>
  );
}
