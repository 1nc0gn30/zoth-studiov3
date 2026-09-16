<div align="center">

# <img src="/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO: MASTER CYBERPUNK VIDEO GAME HUD SYSTEM

### *1:1 Whiteboard Layout Specification, Dynamic Center Stage, 21-Agent Telemetry Deck & 4-Theme Standard*

[![Cockpit Surface](https://img.shields.io/badge/surface-studio%2Fcockpit.html-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Themes](https://img.shields.io/badge/themes-Dark%20%7C%20Light%20%7C%20Matrix%20%7C%20Gold-fbbf24?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Zero Root Scroll](https://img.shields.io/badge/layout-Zero%20Root%20Scroll%20100vh-34d399?style=for-the-badge&logo=w3c&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)
[![Tool Registry](https://img.shields.io/badge/tools-14%2B%20Modular%20Suites-a855f7?style=for-the-badge&logo=webgl&logoColor=white)](http://127.0.0.1:8088/studio/cockpit.html)

<br>

</div>

<p align="center"><img src="/assets/brand/azoth-watermark-seal.svg" width="120" height="120" alt="Zoth Sovereign Seal" /></p>

---

## 🏛️ 1. Executive Summary & The Whiteboard Origin

**The Cockpit** (`/studio/cockpit.html`) represents the flagship control surface of Zoth Studio. Originating directly from the core architectural whiteboard blueprint, the Cyberpunk Video Game HUD re-imagines multi-agent AI orchestration not as a generic chat interface, but as an **immersive, zero-root-scroll mission deck**.

Traditional AI dashboards force users to scroll through endless vertically stacked panels, disorienting operators and losing vital system state. The Cyberpunk HUD solves this with a **fixed, high-density 2-column tactical matrix**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [⚡ ZOTH STUDIO (SOVEREIGN)]  (?)   [☷ DECK]             [PORTS] [TIME UTC] [THEMES] [TOOL MGR]│
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ ⚡ ACTIVE AGENTS (21 FLEET)           │ 🎬 OMNIPOST 2.0 VIDEO STUDIO  [TAGS]                 │
│ (•) AZOTH          Prime Arbiter     │ ───────────────────────────────────────────────────  │
│ ( ) ATHENA         Math & Truth      │ [OMNI POST] [TOOL BENCH] [FULLSCREEN] [DETACH]       │
│ ( ) DRACO          Consensus Mesh    │                                                      │
│ ( ) HERMES         Tool Harness      │ ┌──────────────────────────────────────────────────┐ │
│ ( ) [ + Slot / Specialist ]          │ │ ┏                                              ┓ │ │
│                                      │ │                                                  │ │
│ 🧠 SYNAPTIC MEMORY (:8788 LIVE)      │ │              DYNAMIC MODULAR STAGE               │ │
│ ┌──────────────────────────────────┐ │ │                                                  │ │
│ │  ~ ~ ~ [ Canvas Graph ] ~ ~ ~    │ │ │          (Hosts Any Studio Workstation:          │ │
│ └──────────────────────────────────┘ │ │           OmniPost, Tool Bench, Swarm,           │ │
│ VECTORS: 1,024D   RECALL: <2.4ms     │ │           WebGen, Consensus, Nexus 3D,           │ │
│ NODES: 21 Live    ENTROPY: -0.042 H  │ │             vOS Sandbox, Memory, Vault)          │ │
│                                      │ │                                                  │ │
│ 💻 COMMAND LINE (REPL)               │ │                                                  │ │
│ [zoth-hud $ ________________ ] [EXEC]│ │ ┗                                              ┛ │ │
│                                      │ └──────────────────────────────────────────────────┘ │
│ 📜 MESSAGE LOG (STREAM)              │ STAGE: LOCAL 127.0.0.1      FPS: 60.0    E2EE ENCLAVE│
│ [CONSENSUS] Invariants verified pass.├──────────────────────────────────────────────────────┤
│ [MEMORY] STDP synaptic link adjusted.│ [SWARM] [MEMORY] [WEB GEN] [PETS] [VAULT] [CONSENSUS]│
│                                      │                                                      │
│ 📐 MAIN PILLAR 6 STATUS              │                                                      │
│ STDP Synaptic Growth: [████████] 98% │                                                      │
│ AST Invariant Sealing: [███████] 100%│                                                      │
└──────────────────────────────────────┴──────────────────────────────────────────────────────┘
```

---

## 🎨 2. The 4 Sovereign Visual Themes

The HUD enforces complete semantic color and typography tokens via `/assets/zoth-cyberpunk-hud.css`, guaranteeing WCAG AAA contrast across 4 distinct aesthetics:

| Theme Name | Primary Aesthetic | Background | Accent & Accents | Typography |
|---|---|---|---|---|
| **🌙 Dark Void** | Midnight Cyberpunk | `#030408` (Deep Obsidian) | `#00f0ff` (Neon Cyan) · `#fbbf24` (Gold) | `Orbitron` + `JetBrains Mono` |
| **☀️ Solar Light** | Swiss Architectural | `#f4f6fb` (Pristine Frost) | `#0071e3` (Cobalt) · `#059669` (Emerald) | `Plus Jakarta Sans` + `IBM Plex Mono` |
| **📟 Matrix CRT** | Phosphor Terminal | `#000000` (Pitch Black) | `#00ff66` (Phosphor Green) | `Share Tech Mono` |
| **⚗️ Hermetic Gold**| 24K Alchemical Amber | `#050300` (Celestial Bronze) | `#ffd700` (Alchemical Gold) | `Cinzel` + `IBM Plex Mono` |

*Theme controls*: Toggle instantly via `[ THEMES ]` in the top bar, `Shift+T` globally, or via terminal command `theme <dark|light|matrix|gold>`.

---

## 🧩 3. Architectural Component Breakdown

### 1. Top Header (`.hud-header` · 54px Fixed)
- **Brand Lockup**: `⚡ ZOTH STUDIO` emblem with chamfered neon badge (`.hud-logo-badge`).
- **Help Button `(?)`**: One-click trigger for keyboard shortcuts and HUD usage modal.
- **Deck Toggle Button (`[ DECK ]`)**: Responsive trigger for tablet and mobile slide-over operations.
- **Ports Badge (`[ PORTS ]`)**: Displays real-time loopback daemon status and opens the port topology modal.
- **Time Clock Badge (`[ TIME ]`)**: Live UTC/Local millisecond-precise clock. Click toggles time format.
- **Theme Badge (`[ THEMES ]`)**: Interactive theme switcher displaying color swatches.
- **Tool Manager Button (`[ TOOL MGR ➔ ]`)**: Opens the studio workstation directory and catalog modal.

### 2. Left Operations & Telemetry Deck (`.hud-deck` · 340px–380px)
- **Panel 1: ACTIVE AGENTS Roster**:
  - Custom cyber radio buttons (`(•)` active vs `( )` idle).
  - Instant focus attunement to any of the 21 sovereign agents (`@azoth`, `@athena`, `@draco`, `@hermes`, `@antigravity`, etc.).
  - `[ + Slot / Specialist ]`: Dynamically allocate custom subagents and roles into the active session.
- **Panel 2: SYNAPTIC MEMORY Canvas**:
  - Live 2D HTML5 Canvas simulation of 21 neural agent clusters with pulsing synaptic connections and STDP data packets.
  - High-precision telemetry metrics: Vectors (`1,024 Dim`), Nodes (`21 Live`), Recall latency (`< 2.4ms`), Shannon Entropy (`-0.042 H`).
- **Panel 3: COMMAND LINE REPL (TTY-0)**:
  - Interactive terminal shell with prompt history (Up/Down arrows) and execution output.
  - Commands: `help`, `status`, `tool <id>`, `agent <id>`, `theme <name>`, `ports`, `exec <prompt>`, `clear`, `time`.
- **Panel 4: MESSAGE LOG Stream**:
  - Rolling real-time event log with color-coded provenance tags (`[AZOTH]`, `[CONSENSUS]`, `[MEMORY]`, `[SYSTEM]`, `[DAEMON]`).
  - Integrated with the native sovereign Swarm Bus (`BroadcastChannel('zoth_swarm_bus')`).
- **Panel 5: MAIN PILLAR 6 STATUS**:
  - Real-time animated telemetry meters measuring STDP Synaptic Growth, AST Consensus Sealing, and Shannon Entropy Reduction.

### 3. Center Stage (`.hud-stage` · Dynamic Modular Workspace)
- **Stage Header Strip (44px)**:
  - Displays the active workstation name, category, and metadata tags (e.g., `VIDEO`, `60 FPS`, `MOTION`).
  - Quick launch buttons: `[ OMNI POST ]`, `[ TOOL BENCH ]`, `[ FULLSCREEN ]`, and `[ DETACH ]` (opens the workstation in a detached sovereign browser window).
- **Modular Viewport Container (100% Height)**:
  - Encased in four cyberpunk corner reticle brackets (`.hud-bracket-tl`, `.hud-bracket-tr`, `.hud-bracket-bl`, `.hud-bracket-br`).
  - Seamlessly hosts any studio workstation via dynamic zero-latency iframe orchestration (`/studio/omnipost.html`, `/studio/tool-bench.html`, `/studio/swarm.html`, `/studio/webgen.html`, `/studio/consensus.html`, etc.).
  - Overlay telemetry watermark showing active stage coordinate, 60.0 FPS lock, and E2EE enclave seal.

### 4. Bottom Quick-Dock (`.hud-dock` · 46px Fixed)
- **Quick-Launch Tabs**: Instant single-click switching between flagship studio suites:
  - `[ SWARM ]` ➔ `/studio/swarm.html` (3D WebGL Arena)
  - `[ MEMORY ]` ➔ `/memory/` (Associative Whitespace Graph)
  - `[ WEB GEN ]` ➔ `/studio/webgen.html` (Template Foundry)
  - `[ PETS ]` ➔ `/pets/` (3D Figurine Mascots)
  - `[ VAULT ]` ➔ `/vault/` (Argon2id Enclave)
  - `[ CONSENSUS ]` ➔ `/studio/consensus.html` (AST Battle Arena)
  - `[ NEXUS 3D ]` ➔ `/studio/nexus-3d.html` (Parametric CAD)
- **Right Telemetry Status**: Live LED indicators for Loopback `:8484`, `21 AGENTS`, and `ZERO TELEMETRY`.

---

## 📱 4. Responsive Viewport Strategy

| Viewport Category | Screen Width | Layout Behavior | Navigation / Controls |
|---|---|---|---|
| **Desktop Cockpit** | $\ge 1101\text{px}$ | Full 2-column fixed grid (Left Deck + Center Stage). Zero root scroll. | Permanent topbar, full deck visibility, fixed bottom dock. |
| **Tablet Viewport** | $769\text{px} - 1100\text{px}$ | Center Stage expands to 100% width. Left Deck operates as a slide-out HUD drawer. | `[ DECK ]` button in header toggles the telemetry deck with smooth Bezier slide. |
| **Mobile Handheld** | $\le 768\text{px}$ | Center Stage takes 100% viewport. Slide-up bottom sheets handle Agents, Terminal & Logs. | Simplified topbar, bottom quick dock optimized for touch targets. |

---

## ⌨️ 5. Global Keyboard Shortcuts

The Cockpit is fully keyboard-navigable for maximum power-user ergonomics:

| Keybinding | Action | Scope / Context |
|---|---|---|
| <kbd>1</kbd> | Quick Load **OmniPost 2.0 Video Studio** | Global (when not typing in inputs) |
| <kbd>2</kbd> | Quick Load **Tool Bench 2.0 Simulation Suite** | Global |
| <kbd>3</kbd> | Quick Load **3D Swarm Command Arena** | Global |
| <kbd>4</kbd> | Quick Load **Memory Whitespace & Lucy Oracle** | Global |
| <kbd>5</kbd> | Quick Load **WebGen Studio & Template Foundry** | Global |
| <kbd>Shift</kbd> + <kbd>T</kbd> | Cycle Visual Themes (`dark` $\to$ `light` $\to$ `matrix` $\to$ `gold`) | Global |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>M</kbd> | Open **Studio Workstations & Tool Manager Modal** | Global |
| <kbd>P</kbd> | Open **Loopback Port Topology Modal** | Global |
| <kbd>F</kbd> | Toggle **Fullscreen Center Stage** | Global |
| <kbd>?</kbd> | Open **Keyboard Shortcuts & Quick Help Modal** | Global |
| <kbd>Escape</kbd> | Close any open modal, sheet, or drawer | Global |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate Terminal REPL command history | Terminal Input |
| <kbd>Enter</kbd> | Execute command in Terminal REPL | Terminal Input |

---

## 🔌 6. Local Port Topology & Sovereign Endpoints

The Cockpit communicates exclusively over local loopback connections with zero cloud data transmission:

```
┌───────────┬──────────────────────────────────┬─────────────────────────────────────────────────┐
│ Port      │ Protocol / Service               │ Function & Responsibility                       │
├───────────┼──────────────────────────────────┼─────────────────────────────────────────────────┤
│ **:8088** │ HTTP (Static Server)             │ Core HTML/CSS/JS Studio Hub & Cockpit Surface   │
│ **:8484** │ WebSocket / HTTP / IPC           │ Sovereign Swarm Bus & Orchestration Gateway     │
│ **:8787** │ HTTP (Encrypted Vault)           │ Argon2id Cryptographic Secrets & Keyring Daemon │
│ **:8788** │ HTTP / GraphQL (Memory Graph)    │ 1,024-dim Vector Whitespace & Lucy Knowledge DB │
│ **:11434**│ HTTP (Local LLM Inference)       │ Ollama / Llama.cpp Local Sovereign Models       │
│ **:9000** │ HTTP (Tool Simulation Mock)      │ Zero-latency mock HTTP server for Tool Bench    │
└───────────┴──────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## 🛠️ 7. File Manifest & Exact Changes Made

1. **`public/assets/zoth-cyberpunk-hud.css`**:
   - Master Cyberpunk CSS system (1600+ lines).
   - Theme variables for `dark`, `light`, `matrix`, and `gold`.
   - Fixed 2-column zero-root-scroll layout, custom HUD scrollbars, and chamfer polygon clip-paths.
   - Modals and dialog styling for Ports, Tool Manager, Help shortcuts, and Mobile slide-up sheets.

2. **`public/assets/zoth-cyberpunk-hud.js`**:
   - Complete interactive state controller.
   - Dynamic Tool Registry supporting 14+ workstations (`switchTool`, `detachStage`, `toggleFullscreenStage`).
   - Active Agent radio system (`selectAgent`, `addCustomAgentSlot`).
   - Synaptic 2D Memory Canvas simulation with dynamic node rendering and particle impulses.
   - Terminal REPL engine with command parser and history.
   - Web Audio tactical chime synthesizer for tactile sound feedback.
   - Swarm Bus synchronization via `BroadcastChannel` and `localStorage`.

3. **`public/studio/cockpit.html`**:
   - Re-architected into the 1:1 master Cyberpunk Video Game HUD whiteboard layout.
   - Topbar: Brand, Help `(?)`, `[ DECK ]`, `[ PORTS ]`, `[ TIME ]`, `[ THEMES ]`, `[ TOOL MGR ]`.
   - Left Deck: Active Agents, Synaptic Memory Canvas, Terminal REPL, Message Log, Pillar 6 Status.
   - Center Stage: Modular tool viewport defaulting to OmniPost / Tool Bench, reticle brackets, telemetry watermark.
   - Bottom Dock: `[ SWARM ]`, `[ MEMORY ]`, `[ WEB GEN ]`, `[ PETS ]`, `[ VAULT ]`, `[ CONSENSUS ]`, `[ NEXUS 3D ]`.
   - Modals for Port Topology, Tool Catalog, and Keyboard Shortcuts.

4. **`public/studio/index.html`**:
   - Updated The Cockpit workstation card in the Workstations Directory to highlight the Master Cyberpunk HUD, 1:1 whiteboard layout, dynamic modular center stage, and 21-agent telemetry deck.

5. **`public/docs/cyberpunk-hud.md`**:
   - Master technical documentation specifying the HUD architecture, whiteboard origin, component breakdown, responsive rules, port mapping, and keyboard shortcuts.
