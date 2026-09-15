# 🪐 Zoth Studio — Sovereign Workstation Suite & Cockpit Architecture

Welcome to the **Zoth Studio Workstation Suite**, the premier local-first, zero-cloud control surface and sovereign execution harness for autonomous AI multi-agent orchestration.

---

## 🌟 Executive Overview

Zoth Studio provides 21 purpose-built, high-performance visual workstations designed for sovereign operators, AI engineers, and autonomous agent swarms. Every station operates strictly on local hardware via loopback APIs, ensuring **100% data sovereignty, zero telemetry, and zero cloud lock-in**.

```
                           ┌────────────────────────┐
                           │   Master Azoth Core    │
                           │   (Sovereign Engine)   │
                           └───────────┬────────────┘
                                       │ Loopback Bus (:8484)
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌──────────────┐             ┌───────────────────┐            ┌────────────────┐
│ The Cockpit  │             │   Tool Bench 2.0  │            │ 3D Swarm Radar │
│ (Swarm Deck) │             │ (Contract Sim)    │            │ (Kinetic WebGL)│
└──────────────┘             └───────────────────┘            └────────────────┘
       │                               │                               │
       └───────────────────────────────┼───────────────────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │ Sovereign Operator IDE & PTY  │
                       │ (AST Inspector & Code Foundry)│
                       └───────────────────────────────┘
```

---

## 🧭 Complete Workstation Inventory (21 Sovereign Stations)

| # | Workstation | URL Path | Core Capabilities & Architecture |
|---|---|---|---|
| 1 | **Workstations Hub** | `/studio/index.html` | Master catalog, telemetry HUD strip, 21 station cards with category filtering. |
| 2 | **The Cockpit** | `/studio/cockpit.html` | 21-Agent autonomous swarm command deck, real-time memory sync, quick goals, emergency killswitches. |
| 3 | **Tool Bench 2.0 & Sim Suite** | `/studio/tool-bench.html` | 7-module validated tool harness, zero-latency HTTP mock, token throughput velocity, socket packet inspector. |
| 4 | **3D Swarm Arena & Radar** | `/studio/swarm.html` | Kinetic WebGL 3D arena (Craig Reynolds flocking boids, helix/sphere/torus modes), real-time dialogue feed. |
| 5 | **Sovereign Operator IDE** | `/studio/ide.html` | Multi-pane file tree, multi-tab code editor, real-time Tree-Sitter/V8 AST inspector, Shannon entropy meter, interactive PTY terminal. |
| 6 | **Consensus Battle Arena** | `/studio/consensus.html` | 3-Agent triangulation arena, AST synthesis, dialectical debate resolution. |
| 7 | **WebGen Studio** | `/studio/webgen.html` | Universal interactive PTY terminal, live frontend foundry, template generators. |
| 8 | **vOS Wasm Sandbox** | `/studio/vos-sandbox.html` | In-browser WebContainer, micro-Linux environment, sandbox file system. |
| 9 | **Nexus 3D Omniverse** | `/studio/nexus-3d.html` | WebGL CAD modeling, procedural AI meshes, spatial kinematic animations. |
| 10 | **OmniPost 2.0 Video** | `/studio/omnipost.html` | 60 FPS HTML5 Canvas video compositor, timeline sequencer, social motion export. |
| 11 | **AI Math Pillars** | `/studio/math-pillars.html` | Interactive visualizations for Linear Algebra, STDP Hebbian learning, Riemannian manifolds, and Shannon entropy. |
| 12 | **SimpleX ↔ Matrix Bridge** | `/secure-comms/` | Zero-knowledge end-to-end encrypted messaging gateway. |
| 13 | **Signal Swarm Bridge** | `/signal/` | Mobile phone operator command deck, voice dispatch, SSE real-time stream. |
| 14 | **Web3 & Solana DeFi Hub** | `/studio/web3-hub.html` | Non-custodial multi-chain wallets, live Solana RPC matrices, transaction builder. |
| 15 | **Master Azoth Sanctum** | `/zoth/` | Sovereign alchemical AI core, cognitive state inspector, multi-modal synthesis. |
| 16 | **21-Agent Pantheon** | `/agents/` | Complete directory of 21 model archetypes, system prompts, role specializations. |
| 17 | **Memory Whitespace** | `/memory/` | Biomorphic associative vector graph, Lucy Oracle semantic retrieval. |
| 18 | **Zoth World 3D Sanctum** | `/zoth-world.html` | Immersive 3D WebGL multiverse sanctum and living spatial swarm. |
| 19 | **Adytum Cryptographic Gateway** | `/adytum/` | Offline hardware security layer, cryptographic seed generator, zero-airgap key vaults. |
| 20 | **Companion Pets 3D** | `/pets/` | Volumetric mascot spirits (Azoth, Kitsu, Hermes, Lucy), custom soundboards, desktop companions. |
| 21 | **Sovereign Vault** | `/vault/` | Argon2id & XChaCha20-Poly1305 encrypted BYOK keyring and token store. |

---

## 🎨 UI & Design Specifications

All Zoth Studio workstations adhere strictly to the **Zoth Operator Aesthetic**:

### 1. Text-Emphasized HUD Layouts
- **Punchy Telemetry Headers**: Compact, high-information status strips with active daemon counts, latency counters, and invariant verifications.
- **Legible Monospace Snippets**: Standardized on `IBM Plex Mono` for all tool inputs, JSON parameters, logs, and code foundries.
- **State Badges**: Standardized visual indicators:
  - `RUNNING` / `ONLINE` (Emerald `#10b981`)
  - `EVALUATING` / `AST ACTIVE` (Cyan `#00e5ff`)
  - `INVARIANT PASS` (Gold `#fbbf24`)
  - `STANDBY` / `DISCONNECTED` (Muted `#94a3b8`)

### 2. Breathing Room & Glass Styling
- **Card & Panel Padding**: Generous `24px–32px` padding on all master panels, avoiding cramped, low-contrast toolboxes.
- **Subtle Glass Borders**: Layered `1px solid rgba(0, 229, 255, 0.18)` borders with `backdrop-filter: blur(20px–24px)`.
- **Subtle Hover Elevations**: Smooth `-2px` transform transitions with diffused glow halos.

### 3. Pure Vector SVG Standard
- **Zero Icon Fonts / Emojis**: All interactive controls, workstation pills, HUD buttons, and tab switchers use inline pure vector SVGs to eliminate font latency and layout shifts.

### 4. 4-Theme High-Contrast System
Zoth Studio guarantees flawless visual fidelity across four core themes:
1. **Dark Void** (`default`): Deep obsidian (`#030408`) with electric cyan (`#00e5ff`) and hermetic gold (`#fbbf24`) accents.
2. **Solar Light** (`html[data-theme="light"]`): Crisp clean porcelain (`#f8fafc`) with dark slate ink (`#0f172a`), deep cobalt (`#0284c7`), and amber (`#d97706`) accents. WCAG AAA compliant.
3. **Matrix CRT** (`html[data-theme="matrix"]`): Retro phosphor CRT green (`#00ff66`) on pitch black (`#000803`) with scanline overlays.
4. **Hermetic Gold** (`html[data-theme="gold"]`): Warm parchment & brass (`#fef08a`) on dark bronze (`#080602`).

---

## ⚡ Local Daemon & Port Topology

| Port | Service Daemon | Protocol | Security Boundary |
|---|---|---|---|
| **`:8484`** | Zoth Operator Deck & REST API | HTTP / SSE | Local Loopback (`127.0.0.1`) Only |
| **`:8787`** | Rust Vault Daemon (Argon2id) | Local Unix Socket / HTTP | Encrypted Memory Isolate |
| **`:8788`** | Memory Daemon & Lucy Vector Store | HTTP / REST | Local In-Memory Cache |
| **`:8989`** | Swarm Bus & WebSocket Mirror | WebSocket (RFC 6455) | Zero-Cloud Mesh Broadcast |
| **`:11434`**| Ollama / Local LLM Backend | HTTP REST | Local Hardware (VRAM/CPU) |

---

## 🛠️ Verification & Quality Assurance

To verify the studio suite locally:
1. Launch local test server or open `http://127.0.0.1:8484/studio/`.
2. Cycle themes with **Shift+T** or the top navigation theme picker to verify contrast in Dark, Light, Matrix, and Gold modes.
3. Verify that all buttons, tabs, and drawer controls render crisp vector SVGs.
4. Check that tool execution consoles and terminal runners respond with sub-millisecond local latency.

---
*Authored by the Studio & Cockpit Suite Specialist · Zoth Studio Sovereign Workstations*
