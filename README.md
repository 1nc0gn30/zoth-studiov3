<div align="center">

# <img src="core-app/public/assets/brand/zoth-golden-z-192.png" width="48" height="48" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" /> ZOTH STUDIO `v3.0.0`

**The Sovereign Local-First AI Agent Operating System, Universal Web Foundry & 3D Omniverse**

[![Version](https://img.shields.io/badge/version-3.0.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](https://github.com/NullAITech/zoth-studio)
[![License](https://img.shields.io/badge/license-Apache%202.0-e8c872?style=for-the-badge&logo=apache&logoColor=black)](LICENSE)
[![Local-First](https://img.shields.io/badge/architecture-100%25%20Local--First-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Multi-Agent](https://img.shields.io/badge/swarm-21%20Pantheon%20Agents-a855f7?style=for-the-badge&logo=probot&logoColor=white)](http://127.0.0.1:8088/agents/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)
[![SimpleX E2EE](https://img.shields.io/badge/simplex-zero--metadata-00f0ff?style=for-the-badge&logo=matrix&logoColor=white)](http://127.0.0.1:8088/secure-comms/)

<br>

<p align="center">
  <img src="docs-and-architecture/assets/zoth_studio_banner_1785757680832.png" alt="Zoth Studio Banner" width="100%" style="border-radius: 16px; border: 1px solid rgba(0,240,255,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,240,255,0.2);" />
</p>

<!-- Live Animated Telemetry HUD -->
<p align="center">
  <img src="docs-and-architecture/assets/zoth-telemetry-banner.svg" alt="Live Telemetry HUD" width="100%" />
</p>

</div>

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🛡️ What This Repo Is (And Is Not)

**What it is:**
*   A **100% local, sovereign autonomous agent ecosystem** with 21 specialized AI agents (The Pantheon).
*   **Universal Interactive Web PTY Terminal**: Built-in, cross-platform terminal subsystem (`xterm.js` + Python PTY) that runs on Linux (Parrot OS, Ubuntu), macOS, and Windows.
*   **WebGen Studio**: Autonomous natural-language web foundry with live split-screen preview, Three.js kinetic particle loading screen, and DuckyScript keystroke automation.
*   **3D Swarm World & Kinetic Arena**: Real-time WebGL battle and monitoring NOC featuring vectorized extruded agent medallions and GLTF 3D sci-fi environments.
*   **Zero-Knowledge SimpleX ↔ Matrix Gateway**: End-to-end encrypted messaging bridge without user identifiers, central servers, or telemetry.
*   **Military-Grade Rust BYOK Key Vault**: Argon2id + XChaCha20-Poly1305 loopback-only encryption daemon.

**What it is NOT:**
*   A hosted SaaS product. No data leaves your machine.
*   A cloud-dependent application. There are zero third-party CDNs or external trackers included in the codebase.
*   A bloated Electron app. It is lightweight, running purely via local HTTP/WebSocket daemons accessed through your browser.

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🛠️ Stack & Technologies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | Vanilla JS, WebGL (Three.js), Tailwind CSS, xterm.js | Ultra-fast local client execution with 4-theme system |
| **PTY Kernel** | Python (`pty.fork`, `fcntl`, `termios`) | Real interactive pseudo-terminals with ANSI stream buffers |
| **Orchestrator** | Python (Starlette, Uvicorn, HTTP/SSE) | Swarm execution, DuckyScript injection & loopback API (`:8484`) |
| **Vault Daemon** | Rust (Axum, Argon2id, Tokio) | Secure zero-leak credential storage (`:8787`) |
| **Secure Comms** | SimpleX CLI + Matrix Gateway | Metadata-free private agent communications (`:8767` / `:5225`) |
| **3D Rendering** | Three.js + GLTFLoader | Vectorized 3D extrusions & interactive CAD/mesh scenes |

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 📂 Project Structure

```text
zoth-studio/
├── core-app/                          # Core Application Workstation
│   ├── public/                        # 23+ Web Suites & Static Assets (Serves on :8088)
│   │   ├── studio/                    # Specialized visual workspaces (WebGen, Nexus 3D, Swarm)
│   │   ├── agents/                    # 21-Agent interactive profile pages
│   │   ├── workspaces/                # Target directories synthesized by WebGen & AGY
│   │   └── index.html                 # Flagship launchpad dashboard
│   ├── tools/                         # PTY Engine, DuckyScript spawner & orchestrator
│   └── legacy-tools/                  # Retired legacy utilities & archives
├── hardware-arduino/                  # ESP32-S3 Physical Hardware Companion & Bridges
├── vault-daemon/                      # Rust Argon2id BYOK Hardware Key Vault Daemon (:8787)
├── tools-and-automation/              # Python CLI tools, Signal daemon & dataset generators
└── docs-and-architecture/             # Blueprints, design systems, and animated banners
```

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🚀 Quick Start & Runbooks

Start the entire suite with 1 command, or run services individually:

### 1. Launch Everything
```bash
# Navigate to the workspace root
cd zoth-studio

# Start Public Hub (:8088), Orchestrator PTY (:8484), SimpleX Bridge (:8767) & Vault Daemon (:8787)
./start-zoth-studio.sh --with-all
```

* **Public Hub**: `http://127.0.0.1:8088/`
* **WebGen Studio**: `http://127.0.0.1:8088/studio/webgen.html`
* **3D Swarm Arena**: `http://127.0.0.1:8088/studio/swarm.html`
* **Operator NOC Deck**: `http://127.0.0.1:8484/`
* **SimpleX Matrix**: `http://127.0.0.1:8088/secure-comms/`

---

<div align="center">
  <small>© 2026 NullAI Tech. Sovereign Open Source Architecture.</small>
</div>
