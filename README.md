# ⚡ Zoth Studio (v2.6.0)

<p align="center">
  <img src="public/assets/brand/zoth-seal-hermetic-hd.jpg" alt="Zoth Studio Seal" width="220" />
</p>

<p align="center">
  <strong>The Sovereign Local-First AI Agent Powerhouse & Multi-Tool Orchestrator</strong><br>
  <em>Autonomous Multi-Agent Consensus · 47+ Chained Tools · 3D CAD Omniverse · OmniPost Video Engine · Argon2id Hardware Vault</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Local--First%20Loopback-00f0ff?style=for-the-badge&logo=shield" alt="Local-First" />
  <img src="https://img.shields.io/badge/Agents-3--Node%20Consensus-a855f7?style=for-the-badge&logo=robot" alt="Agents" />
  <img src="https://img.shields.io/badge/Platform-Linux%20%7C%20Windows-10b981?style=for-the-badge&logo=linux" alt="Cross-Platform" />
  <img src="https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-fbbf24?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Security-Argon2id%20%2B%20XChaCha20-ff007a?style=for-the-badge&logo=rust" alt="Security" />
  <img src="https://img.shields.io/badge/License-MIT%20Sovereign-blue?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Executive Overview

**Zoth Studio** is an autonomous, local-first multi-agent AI operating system and creative engineering suite. Unlike cloud-dependent SaaS wrappers, Zoth runs **100% on your local hardware** with strict loopback port containment, ensuring zero cloud telemetry and zero credential leaks.

### 🛡️ Why Local-First?
- **Zero Data Egress**: Private conversations, API keys, and codebase queries never leave `127.0.0.1`.
- **Local AI Weights**: First-class integration with Ollama (`qwen2.5-coder`, `smollm2`, `hermes`) for completely offline intelligence.
- **Autonomous Swarm Consensus**: Automated 3-agent arbitration across `@antigravity` (security & contracts), `@grok` (high-throughput execution), and `@hermes` (schema validation & AST verification).
- **Universal Distribution**: Single-binary AppImage and Windows executables with automated dependency resolution.

---

## 🏛️ The Four Core Pillars

```
                     ┌──────────────────────────────────────────────────────────┐
                     │                 ⚡ ZOTH STUDIO ECOSYSTEM                 │
                     └────────────────────────────┬─────────────────────────────┘
                                                  │
         ┌─────────────────────────┬──────────────┴────────────┬─────────────────────────┐
         │                         │                           │                         │
         ▼                         ▼                           ▼                         ▼
┌─────────────────┐       ┌─────────────────┐         ┌─────────────────┐       ┌─────────────────┐
│ 🐝 MULTI-AGENT  │       │ 🛠️ SOVEREIGN    │         │ 🎬 3D OMNIVERSE │       │ 🔒 HARDWARE     │
│   SWARM ARENA   │       │   TOOL ARSENAL  │         │   & OMNIPOST    │       │   BYOK VAULT    │
├─────────────────┤       ├─────────────────┤         ├─────────────────┤       ├─────────────────┤
│ • Tri-Consensus │       │ • 47+ AI Tools  │         │ • Nexus 3D CAD  │       │ • Argon2id Rust │
│ • Shannon Gauge │       │ • Subsweep Recon│         │ • 60 FPS Video  │       │ • XChaCha20-P13 │
│ • DAG Composer  │       │ • AST Transform │         │ • GLSL Shader   │       │ • Zeroize Drop  │
│ • Peer Comms Bus│       │ • Repo Dispatch │         │ • 8 Companions  │       │ • Bitwarden CLI │
└─────────────────┘       └─────────────────┘         └─────────────────┘       └─────────────────┘
```

### 1. 🐝 Autonomous Multi-Agent Swarm (`/studio/consensus.html`)
- **Tri-Agent Arbitration**: Evaluates competing code proposals from `@antigravity`, `@grok`, and `@hermes`.
- **Shannon Agreement Entropy**: Computes real-time mutual agreement entropy $H(P) = -\sum P(x) \log_2 P(x)$ alongside Jaccard token overlap matrices.
- **Visual DAG Playbook Builder**: Drag-and-drop node graph architect with dynamic bezier connecting wires and topological execution.
- **Lockless Peer Bus**: Fast file-based IPC coordination (`agent-comms/bus.py`) between local and peer agents.

### 2. 🛠️ 47+ Sovereign Tool Arsenal (`/studio/tool-bench.html`)
- Chained workflows across network reconnaissance (Subsweep), Python AST security validation, SEO / Answer Engine Optimization (AEO), media generation, and GitHub automation.
- Central orchestrator CLI (`orchestrator.py`) supporting dry-run simulation and automated execution.

### 3. 🎬 Creative 3D Omniverse & Video Studio (`/studio/omnipost.html` & `/studio/nexus-3d.html`)
- **OmniPost 2.0**: README-to-60 FPS Canvas Video slideshow generator with Web Speech narration and multi-platform post repurposing.
- **Nexus 3D Omniverse**: CAD-grade WebGL engine with parametric primitive synthesis (Cubes, Spheres, Torus Knots, Crystals), live transform gizmos, skeletal rigging, and UnrealBloomPass shaders.
- **3D Pets Sanctuary**: GPU-accelerated Simplex 3D Space Liquid vertex wave displacement shader with 8 companion avatars and Web Audio acoustic chord synthesis.

### 4. 🔒 Zero-Leak Security & BYOK Vault (`/vault/`)
- Encrypted key management running on isolated loopback port `:8787`.
- Multi-tier cryptography: Argon2id key derivation + XChaCha20-Poly1305 with automatic memory zeroization on drop.
- Local Bitwarden CLI integration for seamless secret population.

---

## 🌐 Network Topology & Port Isolation

| Service | Port | Binding | Description |
| :--- | :--- | :--- | :--- |
| **Public Studio Hub** | `:8088` | `127.0.0.1:8088` | Static WebGL Showcases, 3D Pet Sanctuary, Documentation |
| **Operator Deck** | `:8484` | `127.0.0.1:8484` | Private Multi-Agent Orchestrator, DAG UI, Chat Console |
| **BYOK Vault Daemon** | `:8787` | `127.0.0.1:8787` | Hardware-Contained Argon2id + XChaCha20 Key Store |
| **Ollama Local Engine** | `:11434` | `127.0.0.1:11434` | Offline Neural Model Weights (Zero Cloud Egress) |

> ⚠️ **Security Doctrine**: Ports `:8484` and `:8787` must never be exposed over public tunnels or reverse proxies without authenticated TLS wrappers.

---

## 🚀 Quick Start Guide

### 🐧 Linux Installation

#### Option A: Standalone AppImage (Recommended)
```bash
# 1. Download the AppImage
curl -LO http://127.0.0.1:8088/dist-linux/Zoth_Studio-v2.6.0-x86_64.AppImage

# 2. Make executable and run
chmod +x Zoth_Studio-v2.6.0-x86_64.AppImage
./Zoth_Studio-v2.6.0-x86_64.AppImage
```

#### Option B: Native Debian / Ubuntu Package (`.deb`)
```bash
sudo dpkg -i dist-linux/zoth-studio_2.6.0_all.deb
zoth --hub
```

#### Option C: Self-Extracting Executable (`.run`)
```bash
chmod +x dist-linux/zoth-linux-x86_64.run
./dist-linux/zoth-linux-x86_64.run --install
```

---

### 🪟 Windows Installation (Windows 10 / 11)

#### Option A: Standalone Executable (.exe)
1. Download **[`zoth-windows-x86_64.exe`](dist-windows/zoth-windows-x86_64.exe)**.
2. Double-click to extract and launch.
3. Automatically opens the Operator Deck in your default browser at `http://127.0.0.1:8484/`.

#### Option B: Portable Archive (.zip)
1. Extract `zoth-studio-v2.6.0-windows-x86_64.zip`.
2. Double-click `zoth.bat` or run in PowerShell:
```powershell
.\zoth.ps1 -Hub
```

---

### 🛠️ Running From Source

```bash
# 1. Clone the repository
git clone https://github.com/757tech/zoth-studio.git
cd zoth-studio

# 2. Check and install system dependencies (Debian/Ubuntu/Parrot)
./scripts/deps-debian.sh --install

# 3. Launch both Operator Deck (:8484) and Public Hub (:8088)
./scripts/zoth-start.sh
```

---

## 📦 Building Cross-Platform Packages

Zoth Studio includes automated, pre-audited release packaging pipelines that guarantee **zero secret leaks**:

```bash
# Build all Linux packages (AppImage, .deb, .tar.gz, .run)
./scripts/build-linux-packages.sh

# Build all Windows packages (.exe, .zip)
./scripts/build-windows-package.sh
```

All generated binaries are output to `dist-linux/` and `dist-windows/` and automatically staged for local web downloads in `public/dist-*/`.

---

## 📂 Project Architecture

```
zoth-studio/
├── public/                       # Static WebGL Hub & Documentation (:8088)
│   ├── index.html                # Sovereign Landing Page & Kinetic HUD
│   ├── showcase.html             # Master 16-Suite Architectural Gallery
│   ├── studio/                   # Operator Launchpads & Simulators
│   │   ├── consensus.html        # Tri-Agent Arbitration & Shannon Entropy
│   │   ├── omnipost.html         # 60 FPS README-to-Video Engine
│   │   ├── nexus-3d.html         # CAD-Grade 3D Omniverse Viewport
│   │   ├── agent-composer.html   # Visual DAG Node Graph Playbook Builder
│   │   ├── math-pillars.html     # Real-Time Loss & Entropy Observability
│   │   └── connectors.html       # Web3, Cloud & Ollama Probe Matrix
│   ├── pets/                     # 3D Space Liquid Companion Sanctuary
│   └── vault/                    # BYOK Encrypted Key Store UI
│
├── tools/                        # Multi-Agent Tool Implementations
│   └── local_null_ai_orchestrator/
│       ├── orchestrator.py       # Central CLI & API Server (:8484)
│       ├── registry.local.json   # 47+ Tool Manifest
│       ├── playbooks/            # Automated Autonomous Workflow Playbooks
│       ├── runtime/              # Python Dispatcher, Tool Chaining & Bus
│       └── dashboard/            # React + Three.js Operator Deck UI
│
├── scripts/                      # Deployment & Packaging Pipelines
│   ├── zoth-start.sh             # Universal Multi-Service Launcher
│   ├── build-linux-packages.sh   # Linux AppImage, Deb, Run & Tar Builder
│   └── build-windows-package.sh  # Windows Standalone EXE & ZIP Builder
│
├── dist-linux/                   # Compiled Linux Universal Binaries
├── dist-windows/                 # Compiled Windows Portable & SFX Binaries
├── .buildignore                  # Master Zero-Leak Packaging Filter
└── .gitignore                    # Master Repository Hygiene Filter
```

---

## 🔒 Security & Privacy Guarantees

- **Hardware Memory Zeroization**: Key materials Derivation and storage use `zeroize` primitives on drop.
- **Automated Pre-Build Privacy Gates**: Build scripts execute an automated AST and regex scan preventing private keys, personal `.chat`/session logs, or unencrypted `.env` secrets from ever being packaged.
- **Fail-Soft Probe Architecture**: External network connectors (GitHub, Stripe, Solana, Cloudflare) operate with fallback mocks when offline.

---

## 📜 Sovereign License

Distributed under the **MIT Sovereign License**. Free for personal, commercial, and sovereign offline use.

**Engineered with Mathematical Precision by NullAI · Neal Frazier.**
