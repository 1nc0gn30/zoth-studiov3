<div align="center">

# <img src="/assets/mascot/azoth-mask.jpg" width="40" height="40" style="border-radius: 50%; vertical-align: middle; border: 2px solid #e8c872; box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO OPERATOR MANUAL & USER GUIDE

### *Sovereign Local-First Multi-Agent Architecture, 3D CAD Omniverse & ESP32-S3 Companion*

[![Version](https://img.shields.io/badge/manual-v2.6.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/docs/)
[![Local-First](https://img.shields.io/badge/architecture-100%25%20Local--First-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)

<br>

</div>

<p align="center"><img src="/assets/brand/azoth-watermark-seal.svg" width="120" height="120" /></p>

---

## 🔌 1. System Topology & Network Ports

| Surface | Port / URL | Function | Security & Isolation Doctrine |
| :--- | :--- | :--- | :--- |
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

<div align="center">
  <img src="/assets/media/cyber-esp32-companion-photoreal.jpg" width="480" style="border-radius: 12px; border: 2px solid #34d399;" />
</div>

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
// Host -> ESP32-S3 (State & Emotion Broadcast)
{"type":"state_update","companion":"azoth","mood":"focused","cpu_load":38.2,"status_text":"Refactoring Shader"}

// ESP32-S3 -> Host (Hardware Event)
{"type":"button_press","button":"UP","hold_ms":350,"trigger":"TRIGGER_SWARM_CYCLE"}
```

---

## 🔐 4. Zero-Knowledge BYOK Vault (`/vault/`)

* **Rust Daemon (`:8686`)**: Encrypted using Argon2id ($m=64\text{MB}, t=3, p=4$) and XChaCha20-Poly1305.
* **Zero-Leak Memory Policy**: Sensitive buffers are wrapped in Rust `Zeroize` traits and zeroed upon drop.
* **In-Browser Web Crypto Fallback**: Uses PBKDF2 (100,000 iterations) + AES-GCM 256-bit for client-side storage.

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

## 🏛️ 5. Creative & Diagnostic Web Studios (`/studio/`)

| Studio Suite | Endpoint Path | Role & Capabilities |
| :--- | :--- | :--- |
| **Master Azoth Portal** | `/zoth/` | Sacred Fibonacci token visualizer, AST code synthesis, and alchemical core. |
| **Nexus 3D CAD Omniverse** | `/studio/nexus-3d.html` | Three.js 3D viewport with GLTF asset loader, Wireframe/PBR modes, and HDRI skyboxes. |
| **Consensus Arena v2** | `/studio/consensus.html` | 3-agent triangulation with Shannon entropy and Jaccard token overlap metrics. |
| **Swarm Command Arena** | `/studio/swarm.html` | Craig Reynolds Boids 3D kinetic flocking simulation tracking agent communication vectors. |
| **OmniPost 2.0 Video Engine**| `/studio/omnipost.html` | 60 FPS HTML5 Canvas video synthesizer, thumbnail forge, subtitle & speech narration syncer. |
| **Vision Link Spatial HUD** | `/studio/vision-link.html` | Webcam hand gesture recognition, 3D holographic overlays, and air typing keyboard. |
| **AI Math Observability** | `/studio/math-pillars.html` | Real-time cross-entropy loss descent, cosine learning rate scheduler, and weight convergence visualizer. |
| **Visual DAG Agent Composer**| `/studio/agent-composer.html` | Interactive node graph editor with bezier connecting wires and JSON playbook exporter. |
| **Edge Function Forge** | `/studio/edge-forge.html` | Serverless V8 isolate sandbox with Solana RPC connectors and waterfall telemetry. |
| **SubSweep Recon** | `/studio/subsweep.html` | OSINT attack surface scanner, Certificate Transparency log probe, and TLS security auditor. |

---

<div align="center">
  <img src="/assets/mascot/azoth-mask.jpg" width="30" height="30" style="border-radius:50%; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Documentation Group</strong> · Licensed under Apache License 2.0
</div>
