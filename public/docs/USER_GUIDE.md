# ⚡ Zoth Studio (v2.6.0) — Master Operator Manual & User Guide

> **Sovereign Local-First Multi-Agent Architecture, 3D CAD Omniverse & ESP32-S3 Physical Companion on Parrot OS**

Zoth Studio is an autonomous AI agent orchestration framework, CAD-grade 3D creative suite, cryptographic hardware key vault, and physical hardware companion hub. This manual covers operational directives, tools, API endpoints, hardware pinouts, and keyboard ergonomics.

---

## 🔌 1. System Topology & Network Ports

| Surface | Port / URL | Function | Security & Isolation Doctrine |
|---|---|---|---|
| **Public Hub** | `http://127.0.0.1:8088/` | Static brochures, 23+ creative suites, 3D showcases, AEO graph | Public / Tunnel Safe |
| **Operator Deck** | `http://127.0.0.1:8484/` | Multi-model chat harness, terminal dock, swarm arbitration engine | **Loopback Only** (`127.0.0.1`) |
| **ESP32-S3 Serial Bridge** | `http://127.0.0.1:8585/` | Hardware Web HUD, serial monitor & TTS audio server | Private Loopback |
| **Argon2id Vault Daemon** | `http://127.0.0.1:8686/` | Hardware-isolated zero-leak key store (Rust RPC daemon) | **Zero-Leak Loopback** |
| **Local LLM (Ollama)** | `http://127.0.0.1:11434/` | Offline `zoth-micro`, Qwen 2.5 Coder, SmolLM2, Hermes 3 | Private Loopback |

---

## 🎛️ 2. Operator Command Deck (`:8484`)

### ⚡ Interactive Keyboard Shortcuts
* `Enter`: Send message or execute active slash command.
* `Shift + Enter`: Multi-line prompt formatting in chat composer.
* `↑ ArrowUp`: When input is empty, loads your previous prompt for instant editing and re-running.
* `⌘K / Ctrl+K`: Focus the composer dock.
* `⌘N / Ctrl+N`: Start a fresh multi-agent session.
* `Alt + P`: Open 24 Cyber Pet Companion selector.
* `Alt + V`: Open Zero-Knowledge Argon2id Vault unseal modal.

### 📜 Master Slash Commands
* `/doctor`: Run automated system dependency audit and diagnostic scan (`orchestrator.py doctor`).
* `/scan`: Re-index and verify all 47+ local tool manifests (`orchestrator.py scan`).
* `/github [repos|dispatch]`: Query GitHub Octokit REST endpoints or trigger Actions workflows.
* `/models`: Switch neural providers (Ollama `zoth-micro`, `qwen2.5-coder:1.5b`, `smollm2:360m`, OpenAI, Groq, Cerebras).
* `/pet <name>`: Engage specialized companion cyber pets (`azoth`, `kai`, `draco`, `ignis`, `athena`, `lycan`).
* `/studio [brief]`: Launch the 8-step Astro / Tailwind website generator with live preview.
* `/who`: Query active swarm agents, project locks, and heartbeat status.
* `/vault`: Inspect or unlock local Argon2id credentials.

---

## 🤖 3. ESP32-S3 Physical Hardware Companion

<p align="center">
  <img src="/assets/pets/azoth-neon.jpg" width="280" style="border-radius: 12px; border: 2px solid #00f0ff;" />
</p>

### Hardware Specifications & Pinouts
* **MCU**: ESP32-S3 N16R8 (Dual Core Xtensa LX7 @ 240MHz, 16MB Flash, 8MB PSRAM)
* **Screen**: 2.0" ST7789 IPS SPI TFT (240x320 resolution, RGB565 format)
  - `MOSI: GPIO 11`, `SCLK: GPIO 12`, `CS: GPIO 10`, `DC: GPIO 13`, `RST: GPIO 1`
* **Audio**: ES8311 I2S Audio Codec + PA Power Amplifier + Speaker
  - `BCLK: GPIO 15`, `WS/LRCK: GPIO 16`, `DOUT: GPIO 7`, `DIN: GPIO 8`
* **LEDs**: Addressable WS2812B RGB Status Ring on `GPIO 48`
* **Inputs**: Tactile buttons on `GPIO 20` (Up/Next) and `GPIO 19` (Down/Action)

### Launching the Serial & TTS Bridges
```bash
# 1. Start bridge daemon
./start-hardware-bridge.sh

# 2. Bridge connects to /dev/ttyACM0 @ 115200 baud
# Web HUD available at http://127.0.0.1:8585/
```

### Compact Serial JSON Protocol
```json
// Host -> ESP32-S3
{"type":"state_update","companion":"azoth","mood":"focused","cpu_load":38.2,"status_text":"Refactoring Shader"}

// ESP32-S3 -> Host
{"type":"button_press","button":"UP","hold_ms":350,"trigger":"TRIGGER_SWARM_CYCLE"}
```

---

## 🔐 4. Zero-Knowledge BYOK Vault (`/vault/`)

* **Rust Daemon (`:8686`)**: Encrypted using Argon2id ($m=64\text{MB}, t=3, p=4$) and XChaCha20-Poly1305.
* **Zero-Leak Memory Policy**: Sensitive buffers are wrapped in Rust `Zeroize` traits and zeroed upon drop.
* **In-Browser Web Crypto Fallback**: Uses PBKDF2 (100,000 iterations) + AES-GCM 256-bit for client-side storage.

### Vault API Operations
```bash
# Store Secret
curl -X POST http://127.0.0.1:8686/api/vault/store \
  -H "Content-Type: application/json" \
  -d '{"key_alias":"OPENAI_API_KEY","secret_value":"sk-xxx","passphrase":"master-secret"}'

# Retrieve Secret
curl -X POST http://127.0.0.1:8686/api/vault/retrieve \
  -H "Content-Type: application/json" \
  -d '{"key_alias":"OPENAI_API_KEY","passphrase":"master-secret"}'
```

---

## 🎨 5. Creative & Diagnostic Web Suites Roster

1. **Nexus 3D Omniverse (`/studio/nexus-3d.html`)**: CAD-grade Three.js viewport with GLTF/OBJ asset loaders, procedural wireframe/PBR/point shaders, and 3D pet model animators.
2. **Swarm Command Arena (`/studio/swarm.html`)**: Craig Reynolds Boids 3D flocking algorithm simulating multi-agent interaction dynamics, split-screen conversation telemetry, and agent bus events.
3. **Consensus Arena v2 (`/studio/consensus.html`)**: Autonomous 3-agent arbitration engine with live Shannon entropy calculation, Jaccard token overlap metrics, and unified contract synthesizers.
4. **OmniPost 2.0 Video Engine (`/studio/omnipost.html`)**: 60 FPS HTML5 Canvas video generator, 16:9 thumbnail forge, subtitle syncer, and Web Speech API vocal narration.
5. **Vision Link Spatial HUD (`/studio/vision-link.html`)**: Webcam-based computer vision hand gesture tracking, 3D overlays, air typing keyboard, and touchless window pinch-zooming.
6. **AI Math Observability (`/studio/math-pillars.html`)**: Real-time cross-entropy loss descent, cosine learning rate schedulers, and neural weight convergence visualizer.
7. **Visual DAG Agent Composer (`/studio/agent-composer.html`)**: Interactive node graph editor with bezier connecting wires, conditional logic branches, and JSON playbook exporter.
8. **Edge Function Forge (`/studio/edge-forge.html`)**: Serverless V8 isolate code editor with built-in rate limiters, Solana RPC connectors, and waterfall latency telemetry.
9. **SubSweep Reconnaissance (`/studio/subsweep.html`)**: OSINT attack surface scanner, Certificate Transparency log probe, and TLS 1.3 cryptographic security auditor.

---

## 🐾 6. 24 Cyber Pet Companions & Doctrines

| Companion | Species | Specialization & Role | Key Directive |
|:---|:---|:---|:---|
| **Azoth** | Sovereign AI Phoenix | Lead Pair Programmer & System Architect | Holistic system coherence, zero regression. |
| **Kai** | Holographic Cat | Workspace Inspector & Diff Auditor | Smallest proof, rank findings by blast radius. |
| **Draco** | Cyber Dragon | Multi-Agent Fusion Compiler | Agreement is evidence, conflict is a ticket. |
| **Luna** | Lunar Fox | Creative Media & Canvas Synthesizer | Fluid 60 FPS canvas animation, radiant design. |
| **Zephyr** | Wind Falcon | High-Velocity Code Refactorer | Eliminate dead abstractions, maximize throughput. |
| **Nyx** | Shadow Panther | Cryptographic & Threat Sentinel | Zero trust, encrypt at rest, verify contracts. |
| **Sol** | Solar Lion | AEO & Discoverability Architect | Machine-readable schemas, llms.txt optimization. |
| **Ignis** | Neon Phoenix | Dead-Code Eliminator & Optimizer | Turn red to green with smallest clean change. |
| **Lycan** | Mecha Wolf | OWASP Sentinel & CSP Enforcer | Defensive sanitization, CSP strictness. |
| **Athena** | Cyber Owl | Graph Coherence & Obsidian Sync | Bi-directional linking, structured indexing. |
| **Kitsune** | 16-Bit Cyber Fox | UI/UX Glassmorphism & Token Stylist | Cyberpunk polish, micro-interactions. |
| **Pixel-Neko** | Retro 8-Bit Cat | Drive Tool Indexer & Registry Sentinel| Scan tools, audit endpoints. |
| **Pixel-Shiba** | Mecha Doge | BYOK Vault Hardware Guardian | Protect root secrets, loopback verification. |
| **Radical Minion**| Hermes Bot | Nous Research Autonomous Tool Caller | Multi-step chained CLI automation. |

---

## 📦 7. Standalone Precompiled Executables

Universal standalone binaries reside in `releases-and-binaries/`:
* **Linux (x86_64)**: `Zoth_Studio-v2.6.0-x86_64.AppImage`, `zoth-studio_2.6.0_all.deb`, `zoth-studio-v2.6.0-linux-x86_64.tar.gz`, `zoth-linux-x86_64.run`
* **Windows (x86_64)**: `zoth-studio-v2.6.0-windows-x86_64.zip`, `zoth-windows-x86_64.exe`

---
*Manual Version: v2.6.0 · Zoth Studio Autonomous Architecture · Parrot OS / Linux*
