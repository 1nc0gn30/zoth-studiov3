<div align="center">

# <img src="public/assets/brand/zoth-golden-z-192.png" width="48" height="48" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" /> ZOTH STUDIO: CORE APP & WORKSTATION SUITE `v3.2.0`

### *Local-First Multi-Agent Browser Cockpit, Autonomous Web Foundry & 3D WebGL Omniverse*

[![Version](https://img.shields.io/badge/version-3.2.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](https://github.com/NullAITech/zoth-studio)
[![License](https://img.shields.io/badge/license-Apache%202.0-e8c872?style=for-the-badge&logo=apache&logoColor=black)](LICENSE)
[![CLI](https://img.shields.io/badge/cli-bin%2Fzoth%20v3.2-fbbf24?style=for-the-badge&logo=gnubash&logoColor=black)](bin/zoth)
[![Topology](https://img.shields.io/badge/topology-12%20Tsubuyaki%20Formulas-38bdf8?style=for-the-badge&logo=wolframmathematica&logoColor=white)](public/showcase/tsubuyaki-vortex.html)
[![Pet Dex](https://img.shields.io/badge/pet--dex-24%20Mascot%20Spirits-34d399?style=for-the-badge&logo=safari&logoColor=white)](public/pets/)
[![Memory Whitespace](https://img.shields.io/badge/memory-Sovereign%20Whitespace-00f0ff?style=for-the-badge&logo=brainz&logoColor=white)](public/memory/)
[![Speed](https://img.shields.io/badge/speed-Sub--5ms%20Latency-a855f7?style=for-the-badge&logo=speedtest&logoColor=white)](public/assets/zoth-speed-engine.js)

</div>

<p align="center"><img src="../docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🛡️ Overview & Scope

`core-app` is the primary frontend workstation suite, CLI execution deck, and Unix PTY harness for **Zoth Studio**. It provides 23+ zero-cloud, client-side web workstations serving the entire 21-agent Pantheon, WebGen autonomous code synthesis, real-time 3D spatial monitoring, the **AI Math Pillars Theory Academy**, the **12-Formula #つぶやきProcessing Topology Lab**, and the **Lucy Netrunner Memory Whitespace Matrix**.

### What is in this directory:
- **`bin/zoth`**: High-performance Python 3 CLI & Curses TUI (v3.2 Sovereign Master Edition) symlinked to `~/.local/bin/zoth`.
- **`public/`**: 23+ static web workstations, interactive theory academies, 24-spirit pet dex, manga reader, and assets.
- **`tools/`**: Local Unix PTY engine (`pty.fork`), DuckyScript compiler, and loopback agent orchestrator (`:8484`).
- **`public/assets/`**: Vectorized agent badges, 3D shader scripts (`zoth-world.js`, `zoth-3d-logo.js`), 16-brand theme stylesheets (`zoth-theme.css`), and authentic Lucy Cyberpunk mascot assets.

---

## ⚡ The `zoth` CLI v3.2 Master Deck

The `bin/zoth` executable is the primary sovereign command deck for controlling Zoth Studio:

```bash
# 🛰️ System, Lifecycle & Live Telemetry
zoth status                         # Inspect 8-port loopback matrix, memory, and companion
zoth watch [-i 1.0]                 # ⚡ Real-time terminal live telemetry stream
zoth serve [port]                   # 🚀 Launch unified Zoth Dev Server (:8199)
zoth start / stop                   # 🔄 Lifecycle management for all background daemons
zoth sync                           # 🔄 Synchronize universal master navbar across 117+ pages
zoth speed audit                    # 🔍 136-page asset integrity & broken link scanner
zoth speed bench                    # ⚡ Benchmark local HTTP response latency (< 5ms)
zoth doctor                         # 🩺 16-point deep system & environment audit
zoth tui                            # 🎛️ Launch fullscreen curses terminal cockpit (v3.1)
zoth completion [bash|zsh|fish]     # ⚡ Generate shell tab autocompletion script
zoth update                         # 🔄 Self-update Zoth Studio & refresh binaries

# 🤖 Autonomous AI Agents & Swarm DAG
zoth ask "<query>"                  # Query AI agent with vector memory recall & doc grounding
zoth repl                           # Multi-turn REPL with /pet, /agent, /mem, /swarm commands
zoth swarm run "<goal>"             # Execute 4-stage AST consensus pipeline (H < 0.20b)
zoth agent list / show <name>       # ⚡ Inspect 21 Sovereign Pantheon AI Agents
zoth pet summon <name>              # 🐾 Summon and bind active mascot spirit (24 Pet Dex)
zoth pet ascii <name>               # 🐾 Render high-resolution animated ASCII sprite
zoth pet play <name>                # 🐾 Interactive companion tamagotchi & mood status

# 🧠 Cognitive Vector Memory Matrix (:8788)
zoth mem status                     # Inspect CLS + STDP biomorphic brain metrics
zoth mem search "<query>"           # Semantic memory recall with full spectrum AI telemetry
zoth mem store "<text>"             # Store a memory engram into associative vector matrix
zoth mem record-tool <tool_id>      # Record tool execution telemetry into Netrunner memory
zoth mem record-code <file_path>    # Record verified AST code mutation into memory matrix
zoth mem prompt-context             # Emit deterministic XML <memory_context> for LLM prompts
zoth mem graph                      # Biomorphic ASCII synaptic network graph
zoth mem beat                       # Trigger STDP synaptic weight consolidation
zoth mem web                        # Launch 3D Volumetric Memory Maze in browser

# 💬 Sovereign Comms & Security
zoth simplex status                 # 💬 Post-Quantum SimpleX E2EE Comms Bridge (:5225/:8767)
zoth simplex send "<text>"          # Send encrypted zero-metadata message over socket stream
zoth vault status                   # 🔐 BYOK Argon2id Keymaster Vault status (:8787)
zoth bus status / emit <event>      # 🌐 Local IPC Swarm Bus event emitter and claim status
zoth note list / add "<text>"       # 📌 Visual canvas annotations & task board manager

# 🪐 Creative Coding, Topologies & Media
zoth matrix                         # 🟢 60 FPS cyberpunk digital rain (7 themes, 6 glyph sets)
zoth tsubuyaki list                 # 🪐 Explore 12 #つぶやきProcessing formulas
zoth tsubuyaki render v3            # ✦ Live interactive ASCII stipple field simulation
zoth site list / export <tpl>       # 🎨 In-house website blueprints (298+ templates)
zoth tool list / run <tool>         # 🛠️ Sovereign tool runners & orchestrator engine
zoth comic list / play <ep>         # 📖 AZOTH manga reader & terminal audio player
zoth audio list / play <id>         # 🎵 Play manga narration tracks and Web Audio SFX
```

---

## 🌐 Sovereign Port Topology Matrix

All services execute strictly on local loopback with zero external cloud telemetry:

| Port | Service Name | Protocol / Binding | Core Functionality |
|:---:|---|---|---|
| **`:8199`** | **Zoth Dev Server** | `HTTP / SSE` (`127.0.0.1`) | Primary development server, visual notes proxy, and memory gateway (`zoth serve`). |
| **`:8484`** | **Master Orchestrator Deck** | `REST / PTY / Token Auth` (`127.0.0.1`) | Sovereign operator command deck, PTY terminal streaming, tool execution, and agent task dispatch. |
| **`:8088`** | **Zoth Studio Hub** | `HTTP / SSE / WebGL` (`0.0.0.0` / `127.0.0.1`) | Production-grade 23+ web workstations, AEO schema grounding, 3D WebGL scenes, and AZOTH manga reader. |
| **`:8788`** | **Cognitive Memory Daemon** | `REST / SSE / Vector Graph` (`127.0.0.1`) | Dual-layer human/AI memory matrix, STDP Hebbian graph traversal, and Lucy 3D cyberspace engine. |
| **`:5225`** | **SimpleX WebSocket Relay** | `WebSocket JSON-RPC` (`127.0.0.1`) | Post-quantum encrypted socket stream for mobile/desktop asynchronous agent coordination. |
| **`:8767`** | **SimpleX E2EE Web Bridge** | `HTTP REST / Proxy` (`127.0.0.1`) | HTTP loopback bridge interfacing web workstations with the SimpleX chat network. |
| **`:11434`** | **Ollama Local AI Server** | `REST Tensor Pipe` (`127.0.0.1`) | Private offline LLM inference (`zoth-micro`, `qwen2.5-coder`, `hermes-3`). |
| *`:8787`* | **Rust Argon2id Key Vault** | `Argon2id + XChaCha20` (`127.0.0.1`) | Hardware-isolated BYOK key storage with memory zeroization on drop. |
| *`:8585`* | **ESP32-S3 Hardware Bridge** | `Serial JSON` (`/dev/ttyACM0`) | Physical companion bridge for ST7789 IPS display and ES8311 I2S audio TTS. |

---

## 🎨 16-Brand Visual Identity Themes (`zoth-theme.js`)

Zoth Studio includes 16 switchable brand archetypes with `localStorage` persistence, custom Web Audio synthesizer chimes, and full WCAG AA contrast compliance:

| Category | Theme ID | Display Name | Emoji | Primary Accent | Background Token | Archetype Identity |
|---|---|---|:---:|:---:|:---:|---|
| **✦ Studio Originals** | `dark` | **Dark Void** | 🌙 | `#00f0ff` | `#05060a` | Zoth Cyber HUD & Electric Cyan (Default) |
| | `light` | **Solar Light** | ☀️ | `#0a2540` | `#f7f9fc` | High-contrast Swiss Precision & Pure Alabaster (100% WCAG AA) |
| | `matrix` | **Matrix CRT** | 📟 | `#00ff41` | `#000a00` | Phosphor Green Terminal & Digital Rain |
| | `gold` | **Hermetic Gold** | ⚗️ | `#fbbf24` | `#050300` | 24K Alchemical Obsidian & Golden Ratio $\Phi$ |
| **🌐 Frontier AI & Tech** | `google` | **Google Material** | 🌐 | `#8ab4f8` | `#121212` | Material You, Gemini 4-Color & 28px Curves |
| | `microsoft` | **Microsoft Fluent** | 🪟 | `#0078d4` | `#0a0d14` | Fluent 2, Mica Glass & Windows 11 Specular Glow |
| | `apple` | **Apple Cupertino** | 🍎 | `#0a84ff` | `#000000` | Cupertino HIG, VisionOS Glass & Deep OLED |
| | `openai` | **OpenAI Slate** | ✨ | `#10a37f` | `#0d0d0d` | ChatGPT Minimalist Zinc & Emerald Mint |
| | `amazon` | **AWS Console** | ☁️ | `#ff9900` | `#0b131e` | AWS Squid-Ink Navy, Amber Sparks & Telemetry |
| | `anthropic` | **Claude Editorial**| 🏺 | `#d97757` | `#141210` | Terracotta Obsidian, Literary Serif & Warmth |
| | `xai` | **Grok Stark Cyber** | ⚡ | `#00d4aa` | `#000000` | xAI Pitch Black & 2px Brutalist Mint Wireframes |
| **⚡ Developer Archetypes**| `dracula` | **Dracula Gothic** | 🧛 | `#bd93f9` | `#282a36` | Gothic Vampire Slate & Neon Pink/Purple |
| | `nord` | **Nord Glacier** | ❄️ | `#88c0d0` | `#2e3440` | Arctic Scandinavian Frost & Clean Polar Slate |
| | `synthwave` | **Synthwave '84** | 🌴 | `#ff2a85` | `#1a102f` | 80s Outrun Neon Sunset & Retrowave Grid |
| | `solana` | **Solana Matrix** | 🪙 | `#14f195` | `#120924` | Web3 Concentrated Liquidity & Purple/Mint |
| | `monokai` | **Monokai Sublime**| 🔥 | `#a6e22e` | `#272822` | Hacker Sublime Syntax Charcoal & Acid Lime |

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Alternative | Action / Target Subsystem | Handler File |
|---|---|---|---|
| **`Ctrl + K`** | `Cmd + K` | **Global Command Palette**: Instant modal search to teleport across all 23+ workstations, launch tools, filter agents, and trigger actions. | `public/assets/zoth-workbench.js`<br>`public/assets/zoth-nav.js` |
| **`Shift + T`** | Topbar Theme Button | **Cycle 16 Themes**: Instantly rotates through all 16 brand identity themes in sequence with Web Audio chime feedback. | `public/assets/zoth-theme.js` |
| **`Shift + A`** | `Ctrl + Alt + A` | **Toggle Visual Annotator**: Injects and toggles the canvas annotation overlay, pin drop mode, and developer task drawer. | `public/assets/zoth-annotator.js`<br>`public/assets/zoth-nav.js` |
| **`?`** | `Shift + /` | **Hotkeys Modal**: Displays the floating help dialog listing all interactive navigation shortcuts and operational hotkeys. | `public/assets/zoth-nav.js` |
| **`Escape`** | — | **Close Modal / Palette**: Dismisses any active command palette, tool sidebar, configuration modal, or theme popover. | `public/assets/zoth-workbench.js`<br>`public/assets/zoth-nav.js` |

---

## 🧭 Master Universal Navigation Engine (v12.0)

Every page across Zoth Studio features a sovereign, high-end floating glassmorphic dock:
- **Liquid Magnetic Capsule & Spotlight Physics**: Tracks mouse cursor (`--nav-mouse-x`), smoothly moving a rounded pill behind hovered navigation items with spring easing and active-route memory.
- **Real-Time Reading Scroll Progress Line**: An ultra-thin neon indicator anchored beneath the topbar border that dynamically fills from `0%` to `100%` scroll depth across documentation, whitepapers, and comic issues.
- **Active Companion Spirit Quick Pill**: Displays the bound mascot companion from the 24-Spirit Pet Dex (e.g. `🐾 Azoth 🔮`) with one-click HUD summon and procedural audio feedback.
- **Inline Route Breadcrumb Teleport**: Dynamic situational route breadcrumbs (e.g. `ZOTH / STUDIO / VOS SANDBOX`) on desktop displays.
- **16-Brand Visual Identity Studio**: Live searchable theme popover and mobile drawer grid with categorized filtering (**✦ Originals**, **🌐 Frontier AI**, **⚡ Developer Archetypes**) and Web Audio sound synthesizer chimes.
- **100% WCAG AA High Contrast**: Dedicated Solar Light mode, Matrix CRT phosphor, and Hermetic Gold tokens ensuring crisp readability across all archetypes.
- **Zero-Break Viewport Scaling**: Responsive collapsing from ultra-wide 4K monitors down to 320px mobile screens with safe-area insets (`env(safe-area-inset-top)`).

---

## 🏛️ Flagship Workstation Catalog (`/studio/`)

| Workstation | Route | Description | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Launchpad** | [`/index.html`](http://127.0.0.1:8088/) | Flagship cockpit with live status, agent launcher, and theme switcher | Vanilla HTML5 / CSS3 / ESModules |
| **Topology Lab** | [`/showcase/tsubuyaki-vortex.html`](http://127.0.0.1:8199/showcase/tsubuyaki-vortex.html) | 12 #つぶやきProcessing 280B mathematical formulas in 3D WebGPU & ASCII | p5.js / WebGPU / KaTeX / ASCII Shader |
| **Pet Dex & Studio** | [`/pets/`](http://127.0.0.1:8088/pets/) | 24 Sovereign Mascot Spirits with animated 3D models, lore, and sound | Three.js / Web Audio / Sprite Canvas |
| **Memory Whitespace** | [`/memory/`](http://127.0.0.1:8088/memory/) | Distraction-free sovereign cognitive space with dual-layer story digests | Dual-Layer JSON / Obsidian Graph / SSE |
| **Math Pillars Academy** | [`/studio/math-pillars.html`](http://127.0.0.1:8088/studio/math-pillars.html) | Interactive mathematical theory academy: manifolds, STDP, and KAN | KaTeX / Three.js Visualizers / Canvas Math |
| **Netrunner Cyberspace** | [`/studio/netrunner-memory.html`](http://127.0.0.1:8088/studio/netrunner-memory.html) | AAA 3D Cyberspace world, 360° radar, AR scanner mode, stepped altars & Lucy oracle | Three.js / Dual-Layer Memory / SpeechSynthesis |
| **WebGen Studio** | [`/studio/webgen.html`](http://127.0.0.1:8088/studio/webgen.html) | Natural-language web foundry with live split-screen preview and PTY terminal | `xterm.js` / Three.js kinetic orb |
| **3D Swarm Arena** | [`/studio/swarm.html`](http://127.0.0.1:8088/studio/swarm.html) | Tactical 3D battle radar, volumetric shields, laser weapons & 5 camera modes | WebGL / UnrealBloomPass / Web Audio |
| **vOS Sandbox** | [`/studio/vos-sandbox.html`](http://127.0.0.1:8088/studio/vos-sandbox.html) | In-browser WebAssembly virtual OS, file explorer, and WebContainer runner | Wasm / `xterm.js` / Virtual FS |
| **Consensus Arena v2** | [`/studio/consensus.html`](http://127.0.0.1:8088/studio/consensus.html) | 3-model prompt triangulation with Shannon Agreement Entropy ($H(p) < 0.20\text{b}$) | Mathematical Consensus / AST Fuzzer |
| **Nexus 3D Sanctum** | [`/studio/nexus-3d.html`](http://127.0.0.1:8088/studio/nexus-3d.html) | 3D alchemical sphere with Fresnel iridescence and 10,000+ swirling nebula stars | Three.js `InstancedMesh` / OrbitControls |
| **AZOTH Comic Suite** | [`/comic/index.html`](http://127.0.0.1:8088/comic/) | S01E01–S01E04 manga reader with terminal audio player integration | HTML5 Canvas / Web Audio / mpv / ffplay |
| **Agent Registry** | [`/agents/`](http://127.0.0.1:8088/agents/) | Interactive dossiers and skill matrices for all 21 Pantheon AI agents | Responsive UI / JSON Grounding |
| **Keymaster Vault** | [`/vault/`](http://127.0.0.1:8088/vault/) | Hardware-isolated Argon2id key enclave and secret store | Argon2id / XChaCha20-Poly1305 |
| **SimpleX Messaging**| [`/secure-messaging/`](http://127.0.0.1:8088/secure-messaging/) | Post-quantum zero-metadata E2EE communication bridge | WebSocket / Socket :5225 / Bridge :8767 |

---

## 🪐 The 12 #つぶやきProcessing Creative Coding Topologies

All 12 topological presets fit within 280-byte Twitter creative coding constraints:

```
  1.  v1  - Celestial Torus Vortex (Toroids, 222 B)       sin(9/k) singular harmonic ripples
  2.  v2  - Hexa-Strand Möbius Vortex (Toroids, 245 B)    6-fold ribbon knot with d^3/9 cubic surges
  3.  v3  - Triskelion Crystalline Knot (Toroids, 239 B)  3-lobed trifold rotation & parabolic envelope
  4.  v4  - Hyperbolic Gyroid Mesh (Toroids, 242 B)       4-fold interwoven saddle geometry
  5.  v5  - Folium of Descartes Loop (Algebraic, 209 B)   Classical nodal folium algebraic loop
  6.  v6  - Acos Wave Collapse Toroid (Algebraic, 218 B)  cos(5 - acos(cos(3p))) inverse trig folding
  7.  v7  - Polar Cassini Oval Resonator (Algebraic, 224 B) Bi-focal orbital modulation & phase shifts
  8.  v8  - Order/Disorder Interference (Wavefield, 231 B) 2D lattice stipple with radial ripples
  9.  v9  - Polar Modulo Lissajous (Wavefield, 228 B)     Multi-harmonic resonance rings
  10. v10 - Clifford Strange Attractor (Wavefield, 248 B)  Fractal chaotic flow attractor basins
  11. v11 - Logarithmic Golden Spiral (Spirals, 214 B)    1.0008^y exponential phyllotaxis
  12. v12 - Quantum Fermat Phyllotaxis (Spirals, 238 B)   sqrt(i)*2.2 quantum spin warp modulation
```

---

## 🐾 The 24 Sovereign Mascot Spirits & Pet Dex

The 24 mascot familiars in `public/pets/` and `zoth pet`:

- **Master Azoth** (`🔮`, Lead Core) — Hermetic Sovereign Core & Alchemical Magus
- **Zoth** (`⚡`, Lead Core) — Local Operator Loopback Core (Zero Telemetry)
- **Kai** (`🐱`, Build) — Site Inspector & A11y WCAG Accessibility Auditor
- **Draco** (`🐉`, Build) — Fusion Compiler & DAG AST Synthesizer
- **Ignis** (`🔥`, Build) — Refactor Specialist & Rust WASM Speed Booster
- **Lycan** (`🐺`, Security) — OWASP Sentinel, AST Enforcer & Zero-Leak Perimeter
- **Athena** (`🦉`, Knowledge) — Knowledge Graph & AEO Schema Architect
- **Kitsune** (`🦊`, Creative) — Taste, Sacred Motion & Cyberpunk Dark Stylist
- **Pixel-Neko** (`🐾`, Ops) — Tool Indexer & Registry Sentinel
- **Pixel-Shiba** (`🐕`, Ops) — Vault Guardian & BYOK Enclave Familiar
- **Radical Minion** (`👾`, Autonomy) — Hermes Execution Partner for Atomic Step Playbooks
- **Glitchcat** (`🐱‍💻`, Creative) — RGB Glitch & Visual Chaos Familiar
- **Circuit Pup** (`🐶`, Ops) — LED Circuit & Daemon Sniffer
- **Terminal Ghost** (`👻`, Ops) — Phosphor Spirit & Trace Integrity Auditor
- **Savage Codex** (`📜`, Security) — Hacker Familiar & Diff Threat Modeler
- **AI Workbot** (`🤖`, Autonomy) — Task Checklister & Swarm Board Logger
- **Binary** (`💾`, Knowledge) — Schema Sentinel & llms.txt Machine Grounding
- **Aquila** (`🦅`, Edge) — Global Edge Dispatcher & WebGPU Sentinel
- **Leviathan** (`🐋`, Knowledge) — Deep Tensor & Vector Memory Ingestor
- **Onyx** (`💎`, Security) — Red-Team Exploit Predator & Enclave Master
- **Chronos** (`⏳`, Build) — Temporal DAG & Git Multi-Branch Navigator
- **Aether** (`✨`, Autonomy) — Swarm Overlord & Conductor
- **Kraken** (`🐙`, Ops) — Deep Packet Sniffer & OSINT Ingestor
- **Scorpius** (`🦂`, Security) — Zero-Day Memory Corruption Disassembler

---

## 📐 The Six Mathematical Pillars of Sovereign AI

Zoth Studio's multi-agent arbitration, memory indexing, and consensus engines are built on strict mathematical foundations accessible via the interactive [`/studio/math-pillars.html`](http://127.0.0.1:8088/studio/math-pillars.html) academy:

1. **Monoidal Category Theory & Sheaf Topologies**: Morphisms $f: A \to B$ in symmetric monoidal categories with monadic side-effect isolation and sheaf cohomology $\check{H}^1(\mathcal{U}, \mathcal{F}) = 0$.
2. **High-Dimensional Information Geometry & Riemannian Manifolds**: Fisher information metric $g_{ij}(\theta)$ and natural gradient descent $\tilde{\nabla} L(\theta) = g^{-1}(\theta) \nabla L(\theta)$ in Poincaré hyperbolic disk space $\mathbb{D}^n$.
3. **Spike-Timing-Dependent Plasticity (STDP)**: Hebbian synaptic weight dynamics $\Delta w = A_+ \exp(-\Delta t / \tau_+)$ for causal root-cause traversal.
4. **Shannon Agreement Entropy & Epistemic Triangulation**: Multi-model consensus metric $H(P) = -\sum p_i \log_2 p_i < 0.20\text{ bits}$.
5. **Kolmogorov-Arnold Networks (KAN)**: Learnable B-spline activations parameterized on graph edges $f(x) = \sum \Phi_q\left( \sum \phi_{q,p}(x_p) \right)$.
6. **Continuous Modern Hopfield Networks**: Dense associative exponential recall $E(x) = -\beta^{-1}\log\left(\sum \exp(\beta x^T x_i)\right) + \frac{1}{2}x^T x$.

---

## 🧠 Dual-Version Netrunner Memory Substrate (:8788)

The Netrunner Memory subsystem provides dual-version cognitive persistence across all workstations, CLI sessions, and autonomous agent loops:

### 1. Dual Data Representations

```json
{
  "id": "mem_20260913_tool_001",
  "topic": "Tool Execution: webgen_compiler (success)",
  "importance": 0.85,
  "neuromodulator": { "valence": 0.9, "arousal": 0.7, "dominance": 0.8 },
  "human_digest": "### 📖 Tool Execution: webgen_compiler (success)\n\n**Category**: build\n**Timestamp**: 2026-09-13T19:15:00Z\n\n#### 🎯 Context & Intent\nExecuted `webgen_compiler` to compile 3-page Astro workspace.\n\n#### ⚡ Key Actions & Parameters\n- **Tool Name**: `webgen_compiler`\n- **Status**: `success`\n- **Parameters**: `{\"target\": \"workspaces/showcase\"}`\n\n#### 📊 Outcome & Output Summary\nCompiled in 1.42s with zero warnings.\n\n#### 💡 Takeaways & Future Precedents\nTool `webgen_compiler` succeeded reliably under category `build`.",
  "ai_spectrum": {
    "event_type": "tool_run",
    "tool_name": "webgen_compiler",
    "status": "success",
    "category": "build",
    "args": { "target": "workspaces/showcase" },
    "exit_code": 0,
    "input_summary": "Compile 3-page Astro workspace",
    "output_tail": "Compiled in 1.42s with zero warnings.",
    "output_bytes": 384,
    "neuromodulator": { "valence": 0.9, "arousal": 0.7, "dominance": 0.8 }
  }
}
```

### 2. Client-Side JavaScript Event Bus (`public/assets/zoth-netrunner-memory.js`)

Web workstations emit custom DOM events which are automatically bridged to the Memory Daemon (:8788):

```javascript
// Record a tool execution event
window.dispatchEvent(new CustomEvent('zoth:tool:run', {
  detail: {
    tool_name: 'swarm_arbitration_engine',
    status: 'success',
    input_summary: 'Triangulate 3-agent prompt consensus',
    output_tail: 'Shannon entropy H(p) = 0.12 bits < 0.20 bits threshold',
    args: { models: ['antigravity', 'hermes-3', 'grok-4.5'] }
  }
}));

// Record a codebase mutation event
window.dispatchEvent(new CustomEvent('zoth:code:change', {
  detail: {
    file_path: 'public/studio/netrunner-memory.html',
    change_type: 'modified',
    summary: 'Added dual-version view toggle HUD and XML copy button',
    diff_stat: '+124 -18 lines',
    symbols: ['toggleDualViewMode', 'copyPromptContextXML']
  }
}));
```

### 3. Python Orchestrator Runtime Connector (`runtime/netrunner_memory.py`)

```python
from runtime.netrunner_memory import NetrunnerMemoryClient, format_human_digest, format_ai_spectrum

client = NetrunnerMemoryClient(base_url="http://127.0.0.1:8788")

# Record tool execution
client.record_tool_run(
    tool_name="webgen_compiler",
    status="success",
    input_summary="Synthesized Astro 5 portfolio layout",
    output_tail="Build completed in 1.2s",
    args={"framework": "astro", "pages": 3},
    category="build"
)

# Record code modification
client.record_code_change(
    file_path="public/assets/zoth-theme.css",
    change_type="modified",
    summary="Enhanced dark void cyan/amber contrast ratios",
    diff_stat="+34 -12 lines",
    symbols_modified=["--zoth-gold", "--zoth-cyan"]
)

# Ingest deterministic XML prompt context for LLMs
prompt_xml = client.get_prompt_context(query="webgen compiler", mode="dual", limit=3)
```

---

## 🚀 Development & Verification Loop

```bash
# 1. Run local dev server with visual annotation sync
python3 tools/zoth_dev_server.py 8199

# 2. Run deep diagnostics
zoth doctor

# 3. Benchmark sub-5ms response times
zoth speed bench

# 4. Audit 135+ HTML pages for 100% asset integrity
zoth speed audit
```
