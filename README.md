<div align="center">

# <img src="public/assets/brand/zoth-golden-z-192.png" width="48" height="48" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" /> ZOTH STUDIO: CORE APP & WORKSTATION SUITE

### *Local-First Multi-Agent Browser Cockpit, Autonomous Web Foundry & 3D WebGL Omniverse*

[![Version](https://img.shields.io/badge/version-3.0.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](https://github.com/NullAITech/zoth-studio)
[![License](https://img.shields.io/badge/license-Apache%202.0-e8c872?style=for-the-badge&logo=apache&logoColor=black)](LICENSE)
[![Workstations](https://img.shields.io/badge/workstations-23%2B%20Sovereign%20Apps-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![3D Graphics](https://img.shields.io/badge/webgl-Three.js%20%2B%20Bloom%20(60FPS)-f472b6?style=for-the-badge&logo=three.js&logoColor=white)](http://127.0.0.1:8088/studio/swarm.html)
[![Netrunner](https://img.shields.io/badge/oracle-Lucy%20(Edgerunners)-00f0ff?style=for-the-badge&logo=matrix&logoColor=white)](http://127.0.0.1:8088/studio/netrunner-memory.html)

</div>

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🛡️ Overview & Scope

`core-app` is the primary frontend workstation suite and Unix PTY harness for **Zoth Studio**. It provides 23+ zero-cloud, client-side web workstations serving the entire 21-agent Pantheon, WebGen autonomous code synthesis, real-time 3D spatial monitoring, and the Lucy Netrunner Memory matrix.

### What is in this directory:
- **`public/`**: 23+ static web workstations, interactive dashboards, agent dossiers, and assets.
- **`tools/`**: Local Unix PTY engine (`pty.fork`), DuckyScript compiler, and loopback agent orchestrator (`:8484`).
- **`public/assets/`**: Vectorized agent badges, 3D shader scripts (`zoth-world.js`, `zoth-three-orb.js`), 16-brand theme stylesheets (`zoth-theme.css`), and authentic Lucy Cyberpunk mascot assets.

---

## 🏛️ Flagship Workstation Catalog (`/studio/`)

| Workstation | Route | Description | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Launchpad** | [`/index.html`](http://127.0.0.1:8088/) | Flagship cockpit with live status, agent launcher, and theme switcher | Vanilla HTML5 / CSS3 / ESModules |
| **WebGen Studio** | [`/studio/webgen.html`](http://127.0.0.1:8088/studio/webgen.html) | Natural-language web foundry with live split-screen preview and PTY terminal | `xterm.js` / Three.js kinetic orb |
| **Netrunner Memory Hub** | [`/studio/netrunner-memory.html`](http://127.0.0.1:8088/studio/netrunner-memory.html) | AAA 3D Cyberspace world, 360° radar, AR scanner mode, stepped altars & Lucy oracle | Three.js / Dual-Layer Memory / SpeechSynthesis |
| **3D Swarm Arena** | [`/studio/swarm.html`](http://127.0.0.1:8088/studio/swarm.html) | Tactical 3D battle radar, volumetric shields, laser weapons & 5 camera modes | WebGL / UnrealBloomPass / Web Audio |
| **vOS Sandbox** | [`/studio/vos-sandbox.html`](http://127.0.0.1:8088/studio/vos-sandbox.html) | In-browser WebAssembly virtual OS, file explorer, and WebContainer runner | Wasm / `xterm.js` / Virtual FS |
| **Consensus Arena v2** | [`/studio/consensus.html`](http://127.0.0.1:8088/studio/consensus.html) | 3-model prompt triangulation with Shannon Agreement Entropy ($H(p) < 0.20\text{b}$) | Mathematical Consensus / AST Fuzzer |
| **Nexus 3D Sanctum** | [`/studio/nexus-3d.html`](http://127.0.0.1:8088/studio/nexus-3d.html) | 3D alchemical sphere with Fresnel iridescence and 10,000+ swirling nebula stars | Three.js `InstancedMesh` / OrbitControls |
| **Agent Registry** | [`/agents/`](http://127.0.0.1:8088/agents/) | Interactive dossiers and skill matrices for all 21 Pantheon AI agents | Responsive UI / JSON Grounding |
| **AX Specification** | [`/ax/`](http://127.0.0.1:8088/ax/) | Agent Experience and AEO Schema.org knowledge grounding layer | JSON-LD / Machine Grounding |

---

## 🌌 3D WebGL Graphics & Shader Pipeline

All 3D scenes in `core-app/` follow AAA WebGL engineering standards:

1. **60 FPS Performance Capping**: Renderers automatically cap `devicePixelRatio` at `Math.min(window.devicePixelRatio || 1, 2)` to eliminate thermal throttling and GPU stutter.
2. **ACESFilmic Tone Mapping & Unreal Bloom**: Volumetric radiance passes with threshold `0.70`, strength `0.65`, and radius `0.42` for neon luminescence.
3. **16-Brand Theme Synchronization**: 3D scenes listen to `window.addEventListener('zoth-theme-change')` to smoothly tween lighting, particle hues, and fog colors to match the active brand aesthetic:
   - **Dark Void**: Cyan (`#00f0ff`) & Neon Violet (`#a855f7`)
   - **Hermetic Gold**: Pure Gold (`#fbbf24`) & Amber
   - **Matrix Rain**: Cyber Emerald (`#34d399`) & Mint
   - **Cyberpunk / Synthwave**: Hot Pink (`#f472b6`) & Electric Blue

---

## 📂 Project Structure

```text
core-app/
├── public/                            # Static Web Application Root (Served on :8088)
│   ├── studio/                        # Workstations (WebGen, Netrunner, Swarm, vOS, Consensus)
│   ├── agents/                        # 21 Agent profile pages and knowledge dossiers
│   ├── assets/                        # Shared UI assets, fonts, stylesheets, and 3D scripts
│   │   ├── brand/                     # Golden Z emblems, logos, and favicons
│   │   ├── mascot/                    # Authentic Lucy and Pantheon mascot portraits
│   │   ├── vendor/                    # Sovereign Three.js, OrbitControls, and Postprocessing
│   │   ├── zoth-world.js              # 3D Alchemical sphere with 10k particle stars
│   │   ├── zoth-three-orb.js          # Kinetic compiler loading orb
│   │   ├── zoth-theme.css             # Universal 16-brand theme engine
│   │   └── zoth-nav.js                # Universal persistent navigation drawer & HUD
│   ├── ax/                            # Agent Experience (AX) specification & endpoints
│   ├── faqs/                          # Architecture FAQ knowledge base
│   ├── llms.txt                       # Machine-readable fact sheet for LLMs
│   └── index.html                     # Master flagship launchpad cockpit
├── tools/                             # PTY Orchestration & DuckyScript Spawner (:8484)
│   └── null ai agent tools/
│       └── local_null_ai_orchestrator/
│           └── orchestrator.py        # Starlette/Uvicorn PTY backend daemon
└── docs-and-architecture/             # Architectural blueprints and diagrams
```

---

## 🚀 Quick Start & Development Runbook

### 1. Serve the Workstations
```bash
# Serve public static assets on port 8088
python3 -m http.server 8088 --directory public
```
Access the cockpit at [`http://127.0.0.1:8088/`](http://127.0.0.1:8088/).

### 2. Launch the PTY Orchestrator
```bash
python3 "tools/null ai agent tools/local_null_ai_orchestrator/orchestrator.py" serve --host 0.0.0.0 --port 8484 --public --server stdlib
```
Access the operator deck at [`http://127.0.0.1:8484/`](http://127.0.0.1:8484/).

---

<div align="center">
  <img src="public/assets/brand/zoth-golden-z-192.png" width="32" height="32" style="border-radius:6px; vertical-align:middle; border:1px solid #fbbf24;" />
  <br>
  <strong>Zoth Studio Core Architecture</strong> · Built with Sovereign Local Privacy
</div>
  <small>© 2026 NullAI Tech. Sovereign Open Source Architecture.</small>
</div>
