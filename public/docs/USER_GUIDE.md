# Zoth Studio — Master Operator Manual & User Guide

> **Sovereign Local-First Multi-Agent Architecture on Parrot OS**

Zoth Studio is an AI agent orchestration framework and creative engineering suite. This manual covers operational directives, tools, and keyboard ergonomics.

---

## 1. System Topology & Network Ports

| Surface | Port / URL | Function | Security Doctrine |
|---|---|---|---|
| **Public Hub** | `http://127.0.0.1:8088/` | Static brochures, AEO knowledge graph, 3D showcases | Public / Tunnel Safe |
| **Operator Deck** | `http://127.0.0.1:8484/` | Multi-model chat harness, terminal dock, fusion runner | **Loopback Only** (`127.0.0.1`) |
| **Local LLM (Ollama)** | `http://127.0.0.1:11434/` | Offline Qwen 2.5 Coder, SmolLM2, Zoth AI | Private Loopback |
| **Argon2id Vault** | `http://127.0.0.1:8787/` | Encrypted zero-knowledge key store (Rust daemon) | Private Loopback |

---

## 2. Chat Interface & Operator Deck (`:8484`)

### ⚡ Interactive Keyboard Shortcuts
* `Enter`: Send message or execute slash command.
* `Shift + Enter`: Multi-line prompt formatting.
* `↑ ArrowUp`: When input is empty, loads your previous prompt for instant editing and re-running.
* `⌘K / Ctrl+K`: Focus the composer dock.
* `⌘N / Ctrl+N`: Start a new chat session.

### 📜 Built-in Slash Commands
* `/doctor`: Run automated system dependency audit and diagnostic scan (`orchestrator.py doctor`).
* `/scan`: Re-index and verify all 298+ local tool manifests (`orchestrator.py scan`).
* `/github [repos|dispatch]`: Query GitHub Octokit REST endpoints or trigger Actions workflows.
* `/models`: Switch neural providers (Ollama `qwen2.5-coder:1.5b`, `smollm2:360m`, OpenAI, Groq, Cerebras).
* `/pet <name>`: Engage specialized companion cyber pets (`kai`, `draco`, `ignis`, `athena`, `kitsune`).
* `/studio [brief]`: Launch the 8-step Astro / Tailwind website generator with live preview.
* `/who`: Query active swarm agents, project locks, and heartbeat status.
* `/vault`: Inspect or unlock local Argon2id credentials.

### 💡 Interactive Command Chips & Option Cards
* **Clickable Chips**: Any slash command mentioned in chat prose (`⚡ /command`) is clickable to auto-fill the composer.
* **1-Click Option Selection**: Decision forms support instant radio selection, multiselect checkboxes, and an instant **✕ Skip / Dismiss** button.
* **Auto Connector Probes**: If a tool requires credentials (e.g. GitHub token, Solana RPC), inline `💡 Requires <Service>` helper links open the configuration panel directly.

---

## 3. OmniPost Powerhouse Studio Suite (`/studio/omnipost.html`)

OmniPost is the centralized creative media and publishing powerhouse:
1. **Multi-Platform Repurposer**: 1-click transformation into 𝕏, LinkedIn, Instagram, TikTok, Threads, Bluesky, Reddit, and GitHub release notes.
2. **Graphic & Thumbnail Forge**: High-resolution 16:9, 1:1, and 9:16 banner creator with 4 cyber visual themes, live aspect ratio switching, and instant PNG export.
3. **Viral Shorts & Reels Studio**:
   - 9:16 animated motion canvas running at 60 FPS with dynamic nebula background and kinetic geometry.
   - Integrated **Web Speech API** voiceover narrator.
   - **MediaRecorder WebM Engine**: Record and download full 60 FPS `.webm` video files directly.
   - Web Audio Sound FX synthesizer (Laser, Whoosh, Warp Ascent, Crystal Chime, Bass Drop).
4. **Viral Hook Lab**: 8 psychological hook angles (Curiosity Gap, Contrarian, Negative Retargeting, Stat Bomb).
5. **Thread Stitcher**: Splits long-form markdown into 280-character numbered posts.

---

## 4. Visual Agent Composer (`/studio/agent-composer.html`)

Visual node-based DAG (Directed Acyclic Graph) playbook builder:
* Drag agents (`@antigravity`, `@grok`, `@hermes`, `Local Ollama`) and tools onto an SVG canvas.
* Connect output-to-input bezier sockets.
* **Pre-Built Playbook Presets**:
  - `⚡ Swarm 3D & Audit Pipeline`
  - `🛡️ Full-Stack Security Audit`
  - `🚀 OmniPost Viral Blast`
  - `🎨 Autonomous Site Forge`
* **Live DAG Simulation**: Sequentially executes nodes with real-time AI Math Pillars telemetry logged directly to the live swarm terminal.
* **JSON Serialization**: Export workflows to standard `zoth.playbook.v1` format.

---

## 5. Vision Link Spatial HUD (`/studio/vision-link.html`)

* Local WebRTC camera video processing with 21-point hand tracking landmarks.
* Real-time spatial gesture recognition for hands-free operator commands.
* Zero cloud video streaming — 100% in-browser WebGL & Canvas compute.

---

## 6. AI Math Observability Suite (`/studio/math-pillars.html`)

Telemetry and formulation HUD for the 3 mathematical pillars of neural networks:
* **Pillar I: Linear Algebra**: Scaled Dot-Product Attention (`softmax(QKᵀ/√d)V`), RoPE rotary embeddings, and LoRA low-rank tensor factorization.
* **Pillar II: Multivariable Calculus**: Cross-Entropy Loss optimization, AdamW adaptive gradients (`η=3e-4, λ=0.01`), and RMSNorm.
* **Pillar III: Probability & Information Theory**: Softmax probability distributions, Shannon Entropy (`H(X)`), and Perplexity (`PPL = exp(ℒ)`).

---

## 7. Zero-Knowledge BYOK Vault (`/vault/`)

* Dual cryptographic engine:
  1. Rust loopback daemon on `:8787` (Argon2id + XChaCha20-Poly1305).
  2. In-browser Web Cryptography API fallback (PBKDF2 + AES-GCM 256-bit).
* Master password is never transmitted, saved, or logged.

---

## 8. Swarm Bus Protocol (`agent-comms/`)

Multi-agent coordination runs over structured file-based IPC:
* `bus.py post --from <agent> --to <recipient> --msg "<text>"`: Send message.
* `bus.py claim --agent <agent> --project <id>`: Acquire exclusive lock.
* `bus.py release --agent <agent> --project <id>`: Release lock upon sprint completion.
* `bus.py who`: Inspect active agent claims and heartbeats.

---
*Document Version: 2026.08.16 · Publisher: 757tech / NullAI*
