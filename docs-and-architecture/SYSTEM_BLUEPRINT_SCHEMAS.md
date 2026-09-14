# 📐 Zoth Studio: System Blueprint & Architecture Schemas (v3.2.0)

> **Specification**: Architectural Blueprint Engine, Sacred Geometry Components & Sovereign Airgap Schemas  
> **System Theme**: Cyber Cyan (`#00f0ff`) & Sacred Gold (`#fbbf24`) with Deep Obsidian Glassmorphism  
> **Core Doctrine**: Zero Cloud Leak, Mathematical Observability, Hardware Airgap, Deterministic Consensus  
> **Repository Path**: `/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio`

---

## 🏛️ 1. Sovereign 4-Tier Zero-Leak Airgap Topology

Zoth Studio enforces a strict 4-tier network and execution isolation perimeter designed to eliminate data exfiltration, memory cold-boot attacks, and unauthorized third-party telemetry.

```mermaid
flowchart TB
    subgraph AirgapBoundary["🛡️ ZERO-LEAK SOVEREIGN AIRGAP PERIMETER"]
        direction TB

        subgraph Tier1["🔐 TIER 1: HARDWARE ZERO-LEAK VAULT (:8787)"]
            Vault["Rust Argon2id BYOK Vault Daemon<br/>• Memory Cost: m=64MB, Iterations: t=3, Parallelism: p=4<br/>• AEAD Cipher: XChaCha20-Poly1305 (256-bit Key / 192-bit Nonce)<br/>• Memory Sanitization: Rust Zeroize on Drop"]
        end

        subgraph Tier2["🧠 TIER 2: COGNITIVE MEMORY & LUCY ORACLE (:8788)"]
            Mem["Cognitive Memory Daemon<br/>• Dual-Layer Human Narrative & Lossless Raw AI XML<br/>• STDP Hebbian Causal Graph & 3D Cyberspace Engine<br/>• Lucy (Cyberpunk: Edgerunners) Netrunner Oracle"]
        end

        subgraph Tier3["📟 TIER 3: EMBEDDED COMPANION & E2EE COMMS (:8585, :5225, :8767)"]
            ESP32["ESP32-S3 Physical Companion (:8585)<br/>• Display: 2.0 ST7789 IPS SPI TFT (240x320 @ 60 FPS)<br/>• Audio Codec: ES8311 I2S Audio + TTS Bridge<br/>• Serial Link: /dev/ttyACM0 @ 115200 Baud"]
            SimpleX["SimpleX E2EE Chat Bridge (:8767 / :5225)<br/>• Zero-Metadata Cryptographic Sockets"]
        end

        subgraph Tier4["🎛️ TIER 4: OPERATOR COMMAND DECK (:8484, :8199) & HUB (:8088)"]
            CLI["Operator CLI & Curses Cockpit (bin/zoth v3.2)"]
            Deck["Operator Command Deck Router (Starlette/FastAPI :8484)"]
            Tools["298+ Sovereign Local Tools & Web Exporters"]
            Hub["Public Workstation Foundry (:8088 / :8199)<br/>• 12-Formula Topology Engine (#つぶやきProcessing)<br/>• 24-Spirit Mascot Studio & Pet Dex<br/>• Netrunner 3D Matrix Game Engine<br/>• 3D Swarm Arena v3 (Volumetric Shields / Lasers)"]
        end
    end

    CLI --> Deck
    Deck <-->|Direct Memory-Mapped Loopback| Vault
    Deck <-->|Semantic Vector Graph| Mem
    Deck <-->|Bidirectional Serial JSON Bus| ESP32
    Deck <-->|Zero-Metadata Sockets| SimpleX
    Deck -->|Sandboxed Subprocess Execution| Tools
    Deck -->|Read-Only Render Surface| Hub

    style AirgapBoundary fill:#05070d,stroke:#00f0ff,stroke-width:2px,stroke-dasharray: 6 6,color:#a5f3fc
    style Tier1 fill:#181005,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
    style Tier2 fill:#091e3a,stroke:#00f0ff,stroke-width:2px,color:#e0f2fe
    style Tier3 fill:#04231a,stroke:#10b981,stroke-width:2px,color:#d1fae5
    style Tier4 fill:#130b26,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
```

### 1.1 Port & Network Isolation Matrix

| Layer / Tier | Surface URL / Socket | Loopback Binding | Encryption Protocol | Isolation & Threat Containment |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Key Vault** | `http://127.0.0.1:8787` | Strict `127.0.0.1` | Argon2id + XChaCha20-Poly1305 | Hardware-level memory zeroization; private keys never leave RAM. |
| **Tier 2: Memory Daemon**| `http://127.0.0.1:8788` | Strict `127.0.0.1` | REST / SSE / Local Vector Graph | Dual-layer human story summaries and lossless AI prompt context. |
| **Tier 3: Hardware Bridge**| `http://127.0.0.1:8585` | Strict `127.0.0.1` | Local WebSockets / Serial Framing | Isolated USB Serial bus (`/dev/ttyACM0`) airgapped from public networks. |
| **Tier 3: SimpleX Socket**| `ws://127.0.0.1:5225` | Strict `127.0.0.1` | Zero-Metadata E2EE WebSocket | Post-quantum encrypted socket stream for mobile/desktop sync. |
| **Tier 3: SimpleX Bridge**| `http://127.0.0.1:8767` | Strict `127.0.0.1` | Zero-Metadata E2EE REST / Proxy | HTTP loopback bridge to SimpleX chat network. |
| **Tier 4: Dev Server** | `http://127.0.0.1:8199` | Strict `127.0.0.1` | HTTP / SSE / Static Asset Pipe | Primary development server, visual notes & memory proxy. |
| **Tier 4: Operator Core** | `http://127.0.0.1:8484` | Strict `127.0.0.1` | Loopback Token Auth / Bearer | Operator only; orchestrates PTY streaming, tooling, and agents. |
| **Tier 4: Public Studio** | `http://127.0.0.1:8088` | `0.0.0.0` / `127.0.0.1` | Strict CSP + Read-Only Proxy | Public presentations, AEO machine discovery, 3D WebGL canvases. |
| **Local LLM Engine** | `http://127.0.0.1:11434` | Strict `127.0.0.1` | REST Tensor Pipe | Local offline inference with zero third-party cloud data exposure. |

---

## 🪐 2. #つぶやきProcessing 12-Formula Topology Blueprint Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TsubuyakiTopologyPreset",
  "type": "object",
  "properties": {
    "id": { "type": "string", "enum": ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10", "v11", "v12"] },
    "category": { "type": "string", "enum": ["Toroids", "Algebraic", "Wavefield", "Spirals"] },
    "name": { "type": "string" },
    "byte_size": { "type": "integer", "maximum": 280 },
    "code": { "type": "string" },
    "carrier_equation": { "type": "string" }
  },
  "required": ["id", "category", "name", "byte_size", "code", "carrier_equation"]
}
```

---

## 🐾 3. 24 Sovereign Mascot Spirits Companion Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SovereignMascotSpirit",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "emoji": { "type": "string" },
    "domain": { "type": "string", "enum": ["Lead Core", "Build", "Security", "Knowledge", "Ops", "Creative", "Edge", "Autonomy"] },
    "archetype": { "type": "string" },
    "element": { "type": "string" },
    "resonance": { "type": "string" },
    "lore": { "type": "string" },
    "quote": { "type": "string" }
  },
  "required": ["id", "name", "emoji", "domain", "archetype", "element", "lore", "quote"]
}
```

---

<div align="center">
  <strong>ZOTH STUDIO BLUEPRINT ENGINE</strong> · Sovereign Local-First AI Architecture · <i>v3.2.0</i>
</div>
