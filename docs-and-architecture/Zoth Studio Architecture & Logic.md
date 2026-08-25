---
type: architecture_plan
title: Zoth Studio Architecture & Logic Blueprint (v2.6.0)
status: active
tags: #architecture #logic #ai-harness #3d-cad #hardware-companion #vault
last_updated: 2026-08-23
---

<div align="center">

# <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> 🏗️ Zoth Studio Architecture & Logic Blueprint (v2.6.0)

### *Technical Specification: Multi-Agent Consensus, Three.js CAD Viewport, ESP32-S3 Serial Protocols & Argon2id BYOK Vault*

<br>

<p align="center">
  <img src="assets/zoth-agent-pantheon-banner.svg" alt="21-Agent Pantheon Constellation" width="100%" />
</p>

</div>

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🧩 System Architecture Overview

Zoth Studio utilizes a four-tier sovereign architecture designed for high-concurrency local execution:

```mermaid
flowchart TB
    subgraph Layer1["🛡️ 1. OPERATOR INTERFACE & EMBEDDED HARDWARE AIRGAP"]
        direction LR
        UI["🎛️ Zoth Command Deck (:8484)<br/>Loopback Operator Auth"]
        Hub["🌐 Public Studio Hub (:8088)<br/>23+ Web Workstations"]
        HW["📟 ESP32-S3 Companion (:8585)<br/>ST7789 TFT · ES8311 I2S Audio"]
    end

    subgraph Layer2["🔮 2. AGENT HARNESS & SACRED GEOMETRY ARBITRATION (Φ)"]
        direction TB
        MO["⚡ Swarm Router & Dispatcher"]
        
        subgraph AgentMesh["Autonomous Agent Mesh"]
            AZ["🔮 @azoth Sovereign Lead"]
            AG["🛡️ @antigravity Pair Programmer"]
            GK["⚡ @grok Kinetic Core"]
            HA["📜 @hermes Tool Caller"]
            OL["🧠 @ollama (zoth-micro)"]
        end

        SE["⚔️ Shannon Consensus Arbiter<br/>H(S) = -∑ p_i log2(p_i) ≥ 0.80"]
    end

    subgraph Layer3["⚙️ 3. SOVEREIGN ENGINE SUITES & VAULT"]
        direction LR
        CAD["🧊 Nexus 3D CAD (Three.js)"]
        OP["🎥 OmniPost 2.0 (60FPS Engine)"]
        VT["🔐 Argon2id Key Vault (:8686)<br/>m=64MB, t=3, p=4 · Zeroize"]
        LLM["🧠 Ollama Local AI (1.5B)"]
    end

    subgraph Layer4["💾 4. LOCAL REPOSITORIES & HARDWARE BUS"]
        direction LR
        DRV["📁 Standalone Drive (/zoth-studio)"]
        OBS["📚 Obsidian Vector Matrix"]
        SER["📟 /dev/ttyACM0 Serial Bus"]
    end

    UI --> MO
    HW --> MO
    MO --> AZ
    MO --> AG
    MO --> GK
    MO --> HA
    MO --> OL

    AZ --> SE
    AG --> SE
    GK --> SE
    HA --> SE
    OL --> SE

    SE --> CAD
    SE --> OP
    SE --> VT
    SE --> LLM

    CAD --> DRV
    OP --> DRV
    VT --> DRV
    LLM --> DRV
    DRV --> OBS
    HW --> SER

    style Layer1 fill:#081326,stroke:#00f0ff,stroke-width:2px,color:#e0f2fe
    style Layer2 fill:#181005,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
    style Layer3 fill:#100926,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
    style Layer4 fill:#051e18,stroke:#10b981,stroke-width:2px,color:#d1fae5

    style UI fill:#0369a1,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Hub fill:#0e7490,stroke:#22d3ee,stroke-width:2px,color:#fff
    style HW fill:#047857,stroke:#34d399,stroke-width:2px,color:#fff
    style MO fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
    style AZ fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#fff
    style AG fill:#1e293b,stroke:#60a5fa,stroke-width:2px,color:#fff
    style GK fill:#082f49,stroke:#00f0ff,stroke-width:2px,color:#fff
    style HA fill:#3b0764,stroke:#c084fc,stroke-width:2px,color:#fff
    style OL fill:#064e3b,stroke:#4ade80,stroke-width:2px,color:#fff
    style SE fill:#854d0e,stroke:#fde047,stroke-width:2px,color:#fff
    style VT fill:#831843,stroke:#f472b6,stroke-width:2px,color:#fff
```

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🤖 1. Multi-Agent Arbitration & Consensus Logic

### Consensus Loop & Mathematical Formulation:
1. **Multi-Agent Prompt Ingestion**: Operator prompt is broadcast to peer models.
2. **Token Overlap & Shannon Agreement Entropy**:
   $$\mathcal{H}(S) = -\sum_{i=1}^n p_i \log_2(p_i)$$
   Measures divergence across proposed implementation plans.
3. **Consensus Arbiter**: If agreement score $\ge 0.80$, synthesizes a single unified action ticket; if conflict arises, flags divergence points for operator review.
4. **Self-Correction & Build Validation**: Pre-validates syntax, runs automated endpoint tests, and audits security headers before final write.

---

## 📟 2. ESP32-S3 Hardware Companion Protocol
* **Serial Baud**: `115200` baud over USB `/dev/ttyACM0`
* **JSON State Machine**: Bi-directional asynchronous packets syncing companion mood, CPU load, active agent, and button triggers.
* **Audio Synthesis**: Local TTS bridge (`tts_bridge.py`) converting agent messages to speech streamed via ES8311 I2S PA amplifier.

---

## 🔐 3. Rust Argon2id BYOK Key Vault Logic
* **Parameters**: Argon2id memory cost $m=64\text{MB}$, iterations $t=3$, parallelism $p=4$.
* **Cipher**: XChaCha20-Poly1305 with 256-bit key and 192-bit nonce.
* **Buffer Sanitization**: Rust `zeroize` guarantees private key buffers in RAM are overwritten with zeroes upon scope termination.

---

<div align="center">
  <img src="../core-app/public/assets/mascot/azoth-mask.jpg" width="30" height="30" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Architecture & Logic</strong> · Licensed under Apache License 2.0
</div>
