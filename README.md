<div align="center">

# <img src="public/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO `core-app`

### *Web Suites, 3D CAD Omniverse, Autonomous Agents & Tool Runtime*

[![Core Version](https://img.shields.io/badge/core--app-v2.6.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](https://github.com/NullAITech/zoth-studio)
[![Local-First](https://img.shields.io/badge/runtime-100%25%20Local--First-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Multi-Agent](https://img.shields.io/badge/agents-21%20Pantheon%20Sandboxes-a855f7?style=for-the-badge&logo=probot&logoColor=white)](http://127.0.0.1:8088/agents/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)

<br>

<p align="center">
  <img src="../docs-and-architecture/assets/zoth_studio_banner_1785757680832.png" alt="Zoth Studio Banner" width="100%" style="border-radius: 14px; border: 1px solid rgba(0,240,255,0.4);" />
</p>

<!-- Live Animated Telemetry HUD -->
<p align="center">
  <img src="../docs-and-architecture/assets/zoth-telemetry-banner.svg" alt="Live Telemetry HUD" width="100%" />
</p>

</div>

<p align="center"><img src="../docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> 🌟 Core Application Architecture

`core-app/` houses the primary web application suites, the Python FastAPI/Starlette multi-agent orchestrator, Three.js 3D CAD engines, and client-side cryptographic harnesses.

```mermaid
graph TD
    CA["⚡ CORE-APP WORKSPACE"] --> PUB["🌐 public/ (:8088)<br/>23+ Web Suites & Static Assets"]
    CA --> ORCH["🎛️ orchestrator/ (:8484)<br/>FastAPI / Starlette Swarm Engine"]
    CA --> DATA["📊 data/<br/>3D AI Training & Blueprints"]
    CA --> MODEL["🧠 Local Model Files<br/>Modelfile.zoth & Modelfile.zoth-micro"]

    style CA fill:#1e1035,stroke:#e8c872,stroke-width:2px,color:#fff
    style PUB fill:#091528,stroke:#00f0ff,stroke-width:2px,color:#fff
    style ORCH fill:#0c172f,stroke:#818cf8,stroke-width:2px,color:#fff
    style DATA fill:#062d22,stroke:#34d399,stroke-width:2px,color:#fff
    style MODEL fill:#350d24,stroke:#f472b6,stroke-width:2px,color:#fff
```

<p align="center"><img src="../docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> 🏛️ Public Web Suites (`public/`)

| Directory / File | Port URL | Description & Purpose |
| :--- | :--- | :--- |
| **`public/zoth/`** | `http://127.0.0.1:8088/zoth/` | Flagship Master Azoth portal with Sacred Fibonacci geometry tokens. |
| **`public/studio/`** | `http://127.0.0.1:8088/studio/` | 14+ specialized studios (Nexus 3D, Consensus, Swarm, OmniPost, Vision Link). |
| **`public/agents/`** | `http://127.0.0.1:8088/agents/` | 21-Agent interactive sandbox pages and doctrine briefs. |
| **`public/comic/`** | `http://127.0.0.1:8088/comic/` | Cyber Graphic Novel webtoon reader, audio player, and timeline lore. |
| **`public/pets/`** | `http://127.0.0.1:8088/pets/` | 24 Cyber Pet companion 3D sanctuary, neon skins, and model studio. |
| **`public/vault/`** | `http://127.0.0.1:8088/vault/` | Argon2id BYOK key store interface with zero-leak memory wipe. |
| **`public/tools/`** | `http://127.0.0.1:8088/tools/` | 47+ client-side tool scripts, framework exporters, and sanitizers. |

<p align="center"><img src="../docs-and-architecture/assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> 🚀 Quickstart & Server Execution

```bash
# 1. Start public static web hub (:8088)
python3 -m http.server 8088 --bind 127.0.0.1 --directory public

# 2. Start operator orchestrator deck (:8484)
cd orchestrator
python3 orchestrator.py serve --host 127.0.0.1 --port 8484
```

---

<div align="center">
  <img src="public/assets/mascot/azoth-mask.jpg" width="30" height="30" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Core Team</strong> · Licensed under the Apache License 2.0
</div>
