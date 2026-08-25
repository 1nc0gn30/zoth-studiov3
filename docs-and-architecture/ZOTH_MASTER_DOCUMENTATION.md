<div align="center">

# <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO MASTER DOCUMENTATION (v2.6.0)

### *Sovereign Local-First AI Agent Powerhouse, 3D CAD Omniverse & Hardware Companion Architecture*

[![Version](https://img.shields.io/badge/manual-v2.6.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/docs/)
[![Architecture](https://img.shields.io/badge/architecture-4--Tier%20Loopback-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Multi-Agent](https://img.shields.io/badge/pantheon-21%20Autonomous%20Models-a855f7?style=for-the-badge&logo=probot&logoColor=white)](http://127.0.0.1:8088/agents/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)

<br>

<!-- Live Animated Telemetry HUD -->
<p align="center">
  <img src="assets/zoth-telemetry-banner.svg" alt="Live Telemetry HUD" width="100%" />
</p>

</div>

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> 🏛️ 1. Executive Summary & Four-Tier Architecture

**Zoth Studio** is an autonomous, sovereign local-first AI agent powerhouse, 3D CAD engine, multi-agent arbitration deck, and physical hardware companion hub. Operating entirely from local storage, it delivers zero-leak privacy, instant local execution, and total resilience against cloud SaaS vendor lock-in.

```mermaid
flowchart TB
    subgraph AirgapPerimeter["🛡️ SOVEREIGN 4-TIER AIRGAP TOPOLOGY (GOLD & CYAN MATRIX)"]
        direction TB
        
        subgraph Tier1["🔐 TIER 1: HARDWARE-ISOLATED ZERO-LEAK VAULT (:8686)"]
            Vault["Rust Argon2id BYOK Vault<br/>• m=64MB, t=3, p=4<br/>• XChaCha20-Poly1305<br/>• Zeroize Memory Barrier"]
        end

        subgraph Tier2["📟 TIER 2: EMBEDDED HARDWARE COMPANION BRIDGE (:8585)"]
            ESP["ESP32-S3 Physical Companion<br/>• ST7789 2.0 IPS TFT (240x320)<br/>• ES8311 I2S Audio Codec<br/>• /dev/ttyACM0 @ 115200 Baud"]
        end

        subgraph Tier3["🎛️ TIER 3: LOCAL OPERATOR COMMAND CORE (:8484)"]
            Operator["🧑‍💻 Local Operator Deck"]
            Router["⚡ Zoth Swarm Router (Starlette/FastAPI)"]
            ZothMicro["🧠 zoth-micro (1.5B GGUF Q4_K_M)<br/>Offline Local AI Inference"]
            Tools["🛠️ 47+ Chained Local Tools<br/>SubSweep · V8 Forge · Solana RPC"]
            SwarmBus["📡 Multi-Agent Bus (agent-comms)<br/>@antigravity · @grok · @hermes"]
        end

        subgraph Tier4["🌐 TIER 4: PUBLIC / TUNNEL SAFE STUDIO HUB (:8088)"]
            Hub["🌐 23+ Web Workstations<br/>• Nexus 3D CAD Three.js Viewport<br/>• OmniPost 2.0 60FPS Video Engine<br/>• Schema.org AEO Knowledge Graph"]
        end
    end

    Operator -->|Loopback Control| Router
    Router <-->|Zero-Leak Memory Channel| Vault
    Router <-->|Serial JSON State Packets| ESP
    Router -->|Offline Tensor Graph| ZothMicro
    Router -->|Deterministic Contracts| Tools
    Router -->|SSE Event Stream| SwarmBus
    Router -->|Read-Only Render Pipe| Hub

    style AirgapPerimeter fill:#05070d,stroke:#00f0ff,stroke-width:2px,stroke-dasharray: 5 5,color:#a5f3fc
    style Tier1 fill:#160f08,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
    style Tier2 fill:#06231a,stroke:#10b981,stroke-width:2px,color:#d1fae5
    style Tier3 fill:#0a1224,stroke:#00f0ff,stroke-width:2px,color:#e0f2fe
    style Tier4 fill:#120e24,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
    
    style Vault fill:#241805,stroke:#fbbf24,stroke-width:2px,color:#fff
    style ESP fill:#0a3224,stroke:#34d399,stroke-width:2px,color:#fff
    style Operator fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Router fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
    style ZothMicro fill:#1e293b,stroke:#00f0ff,stroke-width:2px,color:#fff
    style Tools fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#fff
    style SwarmBus fill:#1e1b4b,stroke:#60a5fa,stroke-width:2px,color:#fff
    style Hub fill:#091e3a,stroke:#00f0ff,stroke-width:2px,color:#fff
```

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> ⚡ 2. 21-Agent Autonomous Pantheon

<p align="center">
  <img src="assets/zoth-agent-pantheon-banner.svg" alt="21-Agent Pantheon Constellation" width="100%" />
</p>

* **Master Azoth**: Supreme lead sovereign architect, Fibonacci geometry enforcer, and AST synthesis core.
* **Antigravity (Google Deepmind AGY)**: Test-first diff generation and zero-drive-by refactor audits.
* **Grok (xAI)**: Real-time telemetry monitoring, deep code auditing, and security fuzzing.
* **Hermes 3 (Nous Research)**: Autonomous multi-step tool caller and recursive task planner.
* **Draco**: Multi-Agent AST compiler turning cross-agent conflicts into unified PRs.
* **Lycan**: OWASP defense sentinel, DOMPurify sanitizer, and strict CSP guard.

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="24" height="24" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" /> 📟 3. Hardware Dataflow & Protocol

<p align="center">
  <img src="assets/zoth-hardware-flow.svg" alt="Hardware Protocol Flow" width="100%" />
</p>

* **Microcontroller**: Dual-Core Xtensa LX7 @ 240MHz, 16MB Flash, 8MB PSRAM.
* **ST7789 Display**: 2.0" IPS LCD at 240x320 resolution with 60 FPS DMA SPI rendering.
* **ES8311 Audio Codec**: 24-bit I2S audio DAC powering onboard speaker for TTS voice chimes.
* **Serial Protocol**: Bidirectional 115200 baud JSON protocol exchanging companion state and button triggers.

---

<div align="center">
  <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="30" height="30" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Technical Architecture Committee</strong> · Licensed under Apache License 2.0
</div>
