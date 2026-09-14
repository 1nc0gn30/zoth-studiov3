---
type: architecture_plan
title: Zoth Studio Architecture & Logic Blueprint (v3.2.0)
status: active
tags: #architecture #logic #ai-harness #3d-cad #hardware-companion #vault #netrunner-memory #tsubuyaki #pet-dex #cli
last_updated: 2026-09-13
---

<div align="center">

# <img src="../core-app/public/assets/brand/zoth-golden-z-192.png" width="40" height="40" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> 🏗️ Zoth Studio Architecture & Logic Blueprint (v3.2.0)

### *Technical Specification: Multi-Agent Consensus, 3D Cyberspace Engine, 12-Formula Topologies, 24 Mascot Spirits, STDP Memory & Argon2id Vault*

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
    subgraph Layer1["🛡️ 1. OPERATOR INTERFACE & COMMAND DECK"]
        direction LR
        CLI["💻 zoth CLI v3.2 & Curses TUI<br/>60 FPS Matrix Rain & Pet Dex"]
        UI["🎛️ Zoth Command Deck (:8484, :8199)<br/>PTY Terminal & Task Dispatch"]
        Hub["🌐 Public Studio Hub (:8088)<br/>23+ Web Workstations & 3D Matrix"]
        HW["📟 ESP32-S3 Companion (:8585)<br/>ST7789 TFT · ES8311 I2S Audio"]
        SX["🔒 SimpleX E2EE Comms (:8767 / :5225)<br/>Zero-Metadata P2P Sockets"]
    end

    subgraph Layer2["🔮 2. AGENT HARNESS & CONSENSUS DAG ARBITRATION"]
        direction TB
        MO["⚡ Swarm Router & Dispatcher"]
        
        subgraph AgentMesh["Autonomous Agent Mesh (21 Agents)"]
            AZ["🔮 @azoth Sovereign Lead"]
            LU["🌌 @lucy Netrunner Oracle"]
            AG["🛡️ @antigravity Pair Programmer"]
            GK["⚡ @grok Kinetic Core"]
            HA["📜 @hermes Tool Caller"]
            DR["🐉 @draco Fusion Compiler"]
            LY["🐺 @lycan Security Sentinel"]
            AT["🦉 @athena Logic Verifier"]
            OL["🧠 @ollama (Local GGUF)"]
        end

        SE["⚔️ Shannon Consensus Arbiter<br/>H(S) = -∑ p_i log2(p_i) < 0.20b"]
    end

    subgraph Layer3["⚙️ 3. SOVEREIGN ENGINE SUITES & DAEMONS"]
        direction LR
        MEM["🧠 Memory Daemon (:8788)<br/>Dual-Layer Human/AI & STDP"]
        TOP["🪐 Topology Engine<br/>12 #つぶやきProcessing Formulas"]
        PET["🐾 24 Mascot Spirits Dex<br/>ASCII Sprites & Soul Lore"]
        CAD["🧊 Nexus 3D & Swarm Arena<br/>Three.js 60 FPS WebGL"]
        VT["🔐 Argon2id Key Vault (:8787)<br/>m=64MB, t=3, p=4 · Zeroize"]
        VOS["💻 vOS Wasm Sandbox<br/>Browser-Native VFS & Runtime"]
    end

    subgraph Layer4["💾 4. LOCAL STORAGE & BUS INFRASTRUCTURE"]
        direction LR
        DRV["📁 Standalone Drive (/zoth-studio)"]
        OBS["📚 Obsidian Vector Matrix"]
        SER["📟 /dev/ttyACM0 Serial Bus"]
    end

    CLI --> MO
    UI --> MO
    HW --> MO
    SX --> MO
    MO --> AZ
    MO --> LU
    MO --> AG
    MO --> GK
    MO --> HA
    MO --> DR
    MO --> LY
    MO --> AT
    MO --> OL

    AZ --> SE
    LU --> SE
    AG --> SE
    GK --> SE
    HA --> SE
    DR --> SE
    LY --> SE
    AT --> SE
    OL --> SE

    SE --> MEM
    SE --> TOP
    SE --> PET
    SE --> CAD
    SE --> VT
    SE --> VOS

    MEM --> DRV
    TOP --> DRV
    PET --> DRV
    CAD --> DRV
    VT --> DRV
    VOS --> DRV
    DRV --> OBS
    HW --> SER

    style Layer1 fill:#081326,stroke:#00f0ff,stroke-width:2px,color:#e0f2fe
    style Layer2 fill:#181005,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
    style Layer3 fill:#100926,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
    style Layer4 fill:#051e18,stroke:#10b981,stroke-width:2px,color:#d1fae5
```

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🤖 1. Multi-Agent Arbitration & Consensus Logic

### Consensus Loop & Mathematical Formulation:
1. **Multi-Agent Prompt Ingestion**: Operator prompt is broadcast to peer models.
2. **Shannon Agreement Entropy**:
   $$\mathcal{H}(S) = -\sum_{i=1}^n p_i \log_2(p_i)$$
   Measures divergence across proposed AST modification plans.
3. **Consensus Arbiter**: When $\mathcal{H}(S) < 0.20\text{ bits}$, synthesizes a single unified action plan; if conflicts emerge, flags divergence points for operator review.
4. **Self-Correction & AST Validation**: Draco and Lycan compile AST invariants and audit OWASP security bounds before executing code writes.

---

## 🪐 2. #つぶやきProcessing 12-Formula Topology Engine
* **280-Byte Tweetable Constraints**: Formulated in pure golfed JavaScript and rendered in terminal ASCII via `zoth tsubuyaki render` and in 3D WebGPU via [`/showcase/tsubuyaki-vortex.html`](http://127.0.0.1:8199/showcase/tsubuyaki-vortex.html).
* **Mathematical Families**: Toroids (`v1`–`v4`), Algebraic Curves (`v5`–`v7`), Wavefields (`v8`–`v10`), and Spirals (`v11`–`v12`).

---

## 🐾 3. 24 Sovereign Mascot Spirits & Pet Dex System
* **Alchemical Companions**: 24 familiars binding domain expertise across Lead Core, Build, Security, Knowledge, Ops, Creative, Edge, and Autonomy.
* **CLI Interactivity**: Real-time multi-frame ASCII sprite animation (`zoth pet ascii`), companion status and tamagotchi interaction (`zoth pet play`), and session binding (`zoth pet summon`).

---

## 🧠 4. Cognitive Memory & Netrunner Cyberspace Engine (`:8788`)
* **Dual-Layer Architecture**: Narrative human story digest for clean operator review alongside lossless raw payload XML block for direct AI context injection.
* **STDP Hebbian Graph Traversal**: Bidirectional `before_ids` and `after_ids` synaptic links calculate weighted temporal causality for deep multi-hop reasoning.
* **First-Person 3D Video Game Matrix**: Stepped hexagonal altars, faceted iridescent shards, Lucy (Cyberpunk: Edgerunners) oracle billboard, 360° circular radar, and `[TAB]` AR scanner mode.

---

## 📟 5. ESP32-S3 Hardware Companion Protocol (`:8585`)
* **Serial Baud**: `115200` baud over USB `/dev/ttyACM0`
* **JSON State Machine**: Bi-directional asynchronous packets syncing companion mood, CPU load, active agent, and button triggers.
* **Audio Synthesis**: Local TTS bridge converting agent messages to speech streamed via ES8311 I2S PA amplifier.

---

## 🔐 6. Rust Argon2id BYOK Key Vault Logic (`:8787`)
* **Parameters**: Argon2id memory cost $m=64\text{MB}$, iterations $t=3$, parallelism $p=4$.
* **Cipher**: XChaCha20-Poly1305 with 256-bit key and 192-bit nonce.
* **Buffer Sanitization**: Rust `zeroize` guarantees private key buffers in RAM are overwritten with zeroes upon scope termination.

---

<div align="center">
  <img src="../core-app/public/assets/brand/zoth-golden-z-192.png" width="30" height="30" style="border-radius:6px; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Architecture & Logic Committee</strong> · Licensed under MIT / Apache-2.0
</div>
