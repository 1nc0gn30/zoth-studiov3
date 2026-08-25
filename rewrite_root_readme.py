import re

with open('../README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace azoth-mask.jpg with the new premium golden logo
content = re.sub(
    r'core-app/public/assets/mascot/azoth-mask\.jpg',
    r'core-app/public/assets/brand/zoth-golden-z-192.png',
    content
)

# Ensure the badges don't look broken, maybe modernize the layout.
# Let's completely rewrite it based on project-readme-hardening skill guidelines.
new_readme = """<div align="center">

# <img src="core-app/public/assets/brand/zoth-golden-z-192.png" width="48" height="48" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" /> ZOTH STUDIO `v2.6.0`

**The Sovereign Local-First AI Agent Powerhouse, 3D CAD Omniverse & Hardware Companion Hub**

[![Version](https://img.shields.io/badge/version-2.6.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](https://github.com/NullAITech/zoth-studio)
[![License](https://img.shields.io/badge/license-Apache%202.0-e8c872?style=for-the-badge&logo=apache&logoColor=black)](LICENSE)
[![Local-First](https://img.shields.io/badge/architecture-100%25%20Local--First-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Multi-Agent](https://img.shields.io/badge/swarm-21%20Pantheon%20Agents-a855f7?style=for-the-badge&logo=probot&logoColor=white)](http://127.0.0.1:8088/agents/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)

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
*   A **100% local** autonomous agent runtime consisting of 21 specialized AI agents (The Pantheon).
*   A fully localized web client (`core-app/public`) hosting 23+ studios including a 3D Omniverse viewer, Node-based workflow planners, and a comic reader.
*   A Python-based operator orchestrator (`core-app/orchestrator`) built on Starlette that manages agent state and local LLM connections via Ollama.
*   A secure Rust-based BYOK (Bring Your Own Key) vault daemon using military-grade memory parameters (Argon2id + XChaCha20-Poly1305).
*   A fully autonomous hardware bridge designed for ESP32-S3 IoT companion devices.

**What it is NOT:**
*   A hosted SaaS product. No data leaves your machine.
*   A cloud-dependent application. There are zero third-party CDNs or external trackers included in the codebase.
*   A bloated Electron app. It is lightweight, running purely via local HTTP daemons accessed through your existing browser.

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🛠️ Stack & Technologies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vanilla JS, WebGL, Tailwind | `N/A` | Ultra-fast local client execution |
| **Orchestrator** | Python (Starlette, Uvicorn) | `>=0.37` | Core agent execution & loopback API |
| **Vault Daemon** | Rust (Axum, Argon2, Tokio) | `Edition 2021` | Secure zero-leak credential storage |
| **Models** | Ollama | `Latest` | Local offline inference (`Modelfile.zoth`) |
| **Tooling** | Puppeteer, Framer Motion | `^25.8`, `^13.1` | Agent browser automation & UI FX |

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 📂 Project Structure

```text
zoth-studio/
├── core-app/                          # Main Application Directory
│   ├── public/                        # 23+ Web Suites & Static Assets (Serves on :8088)
│   │   ├── studio/                    # Specialized visual workspaces (Nexus 3D, Node Editor)
│   │   ├── agents/                    # 21-Agent interactive profile pages
│   │   └── index.html                 # Flagship launchpad dashboard
│   ├── orchestrator/                  # Python backend engine & operator deck (:8484)
│   └── data/                          # 3D AI datasets, manifests, and system schemas
├── hardware-arduino/                  # ESP32-S3 Physical Hardware Companion & Bridges
│   ├── firmware/                      # C++ firmware (Network, LED, Audio)
│   └── bridges/                       # Python bridge services & dashboards
├── vault-daemon/                      # Rust Argon2id BYOK Hardware Key Vault Daemon
│   ├── Cargo.toml                     # High-performance Rust RPC daemon dependencies
│   └── src/                           # Rust Axum source code
├── tools-and-automation/              # Python CLI tools, Signal daemon & dataset generators
├── releases-and-binaries/             # Precompiled standalone executables & packages
└── docs-and-architecture/             # Blueprints, design systems, and animated banners
```

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🚀 Quick Start & Runbooks

Start the entire suite with 1 command, or run services individually:

### 1. Launch Everything
```bash
# Navigate to the workspace root
cd zoth-studio

# Start Public Hub (:8088), Operator Deck (:8484), Hardware Bridge & Vault Daemon
./start-zoth-studio.sh --with-all
```

* **Public Hub**: `http://127.0.0.1:8088/`
* **Operator NOC Deck**: `http://127.0.0.1:8484/`
* **Secure Vault**: `http://127.0.0.1:8686/`

### 2. Standalone Launchers
```bash
# Start ONLY the static web hub manually
cd core-app
python3 -m http.server 8088 --bind 127.0.0.1 --directory public

# Start ONLY the Orchestrator API
cd core-app/orchestrator
python3 orchestrator.py serve --host 127.0.0.1 --port 8484

# Start ONLY the Rust Vault Daemon
cd vault-daemon
cargo run --release
```

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🔐 Environment & Credentials

Zoth Studio is built on a **Zero-Leak, Bring Your Own Key (BYOK)** architecture. 
You do not configure API keys in standard `.env` files. 

Instead, keys (such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) are stored in the local **Argon2id Vault Daemon** (`vault-daemon`). The `orchestrator` communicates with the vault over `localhost` to unseal keys strictly in-memory during agent execution, preventing accidental commits or filesystem scrapes.

<p align="center"><img src="docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🎯 Next Steps & Active Development

- [ ] **Agent Swarm Synchronization**: Finalize the bus messaging system for seamless 21-agent peer-to-peer delegation.
- [ ] **Nexus 3D Omniverse Additions**: Support dynamic glTF injection directly from agent LLM outputs.
- [ ] **Hardware Companion V2**: Extend ESP32-S3 firmware to support offline voice activation (Wakeword).

---

<div align="center">
<img src="core-app/public/assets/brand/zoth-golden-z-192.png" width="36" height="36" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.35);" />
<br><br>
**ZOTH STUDIO** — *Crafted for Sovereign AI Operators & Independent Engineers*<br>
Licensed under the **Apache License, Version 2.0**.
</div>
"""

with open('../README.md', 'w', encoding='utf-8') as f:
    f.write(new_readme)

print("Root README updated.")
