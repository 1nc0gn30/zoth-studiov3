# Zoth Signal Bridge // Android v12.0.0

![Version](https://img.shields.io/badge/version-v12.0.0-blueviolet?style=flat-square)
![Min SDK](https://img.shields.io/badge/minSdk-24-blue?style=flat-square&logo=android)
![Target SDK](https://img.shields.io/badge/targetSdk-36-green?style=flat-square&logo=android)
![Kotlin](https://img.shields.io/badge/Kotlin-2.x-7f52ff?style=flat-square&logo=kotlin)
![Compose](https://img.shields.io/badge/Jetpack_Compose-✓-4285F4?style=flat-square&logo=jetpackcompose)

> **Native Android companion for Zoth Studio v12 — the Sovereign Multi-Agent AI Operating System.**
> Built with Jetpack Compose, this app embeds 28+ flagship workstations via WebView, connects to the 21-agent Pantheon swarm, bridges a PTY terminal over your private Tailnet, and ships as a self-contained ADB-sideloadable APK.

---

## ✨ Features

- **28+ Workstation Presets** — Full WebView launcher for every Zoth Studio tool, categorized and searchable by badge
- **21-Agent Pantheon Swarm** — Sovereign AI agents with individual avatar cards, dossiers, and live dispatch
- **PTY Terminal Bridge** — Loopback daemon SSH-style shell access over Tailscale (zero cloud)
- **Cyberpunk HUD** — Fullscreen tactical cockpit with 360° radar, oscilloscope, and 6-pillar telemetry
- **OmniPost Social Engine** — Live multi-platform post previews (X, Warpcast, Bluesky, LinkedIn) with AI tone-shifters
- **Netrunner Memory Hub** — 3D synaptic force graph connected to the biomorphic memory daemon on `:8788`
- **Nexus 3D Sculptor** — Procedural shader presets (Hologram Grid, Azoth Gold, Obsidian Matte, Neon Wireframe), 4K turnaround recorder, and GLTF exporter
- **Encrypted Journal** — Day journal with local encryption for private reflection logs
- **Argon2id Vault** — E2EE passphrase manager with zero-knowledge client-side key derivation
- **Desktop-class Viewport Modes** — Phone (390px), Tablet (768px), Desktop (1440px) with real UA switching
- **Live Console Overlay** — In-app WebView console log capture (ERR / WARN / INFO / LOG / DEBUG)
- **Zero-Cloud Architecture** — All traffic over WireGuard/Tailscale; no public broker, no telemetry

---

## 📲 Install

### ADB Sideload (Recommended)
```bash
adb install zoth-signal-bridge-v12.0.0-android.apk
```

### Build from Source
```bash
# Clone the repo
git clone https://github.com/NullAITech/zoth-studio.git
cd zoth-studio/core-app/zoth-signal-bridge-android

# Build release APK
./gradlew assembleRelease

# Output location
# app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 🆕 New in v12.0.0

| Preset | Badge | Description |
|---|---|---|
| **Cyberpunk Tactical HUD** | `HUD` | Fullscreen omniverse cockpit with 360° radar, oscilloscope & 6-pillar telemetry |
| **OmniPost Social Engine** | `POST` | Multi-platform live previews (X, Warpcast, Bluesky, LinkedIn) & AI tone-shifters |
| **Math Pillars Academy** | `MATH` | Complete 6-pillar mathematical telemetry calculus engine |
| **Netrunner Memory Hub** | `MEM` | 3D synaptic force graph, biomorphic memory daemon (`:8788`), Obsidian dossier export |
| **Notes Reviewer** | `NOTES` | AI-powered study note review, spaced repetition, and knowledge consolidation |
| **Consensus Arena REPL** | `REPL` | Socratic multi-agent debate simulator with real-time typed consensus synthesis |
| **Nexus-3D Procedural Shaders** | `3D` | Shader presets: Hologram Grid, Azoth Gold, Obsidian Matte, Neon Wireframe + 4K recorder & GLTF exporter |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               Android Device (Zoth Signal Bridge)           │
│  • Jetpack Compose UI  •  Navigation3 routing               │
│  • WebView Bridge — 28+ workstation presets                 │
│  • PTY loopback terminal shell  •  E2EE Vault               │
└────────────────────────────┬────────────────────────────────┘
                             │  🔒 WireGuard / Tailscale
                             │  Private Mesh (100.x.y.z)
┌────────────────────────────▼────────────────────────────────┐
│              Zoth Swarm Workstation / Server                 │
│  • Orchestrator API  (:8484) → /api/swarm, /api/bus         │
│  • Studio Hub        (:8088) → all workstation HTML         │
│  • Memory Daemon     (:8788) → Netrunner synaptic graph     │
│  • Local AI          (:11434) → Ollama inference            │
│  • Consensus Engine  (:8484) → BFT Merkle validation        │
└─────────────────────────────────────────────────────────────┘
```

### App Channels

| Channel | Purpose |
|---|---|
| Studio Hub | WebView launcher for all 28+ workstations |
| Pantheon Swarm | 21 sovereign AI agents with avatar cards |
| PTY Terminal | Loopback daemon SSH-style shell bridge |
| Zoth Journal | Encrypted day journal & reflection log |
| Vault | Argon2id key vault & E2EE passphrase manager |
| Settings | Preferences, theme, server URL |

---

## ⚙️ Configuration

Open the app → **Settings** tab:

| Setting | Default | Description |
|---|---|---|
| Studio Base URL | `http://100.125.220.102:8088` | WebView base — your Tailscale host + port |
| Orchestrator URL | `http://100.125.220.102:8484` | Swarm API endpoint |
| Theme | Dark | Dark / Light / Matrix / Gold |

---

## 🛡️ Security & Privacy

- **Zero Public Brokers** — Messages never traverse public messaging servers
- **WireGuard Encryption** — Peer-to-peer through your private Tailnet
- **Argon2id Key Derivation** — Vault passphrase hardened with 64MB memory cost
- **XChaCha20-Poly1305** — Authenticated encryption for journal and vault entries
- **Local AST Execution** — Code analysis and tool loops run strictly on private hardware

---

## 📦 Releases

Pre-built APKs are published at:
[https://github.com/NullAITech/zoth-studio/releases](https://github.com/NullAITech/zoth-studio/releases)

---

## 📐 Tech Stack

| Layer | Technology |
|---|---|
| UI | Jetpack Compose + Material3 |
| Navigation | Navigation3 (androidx.navigation3) |
| Language | Kotlin 2.x |
| Min SDK | 24 (Android 7.0 Nougat) |
| Target SDK | 36 (Android 16) |
| WebView | Android WebView + JS bridge |
| Crypto | Argon2id · XChaCha20-Poly1305 |
| Networking | Tailscale WireGuard mesh |

---

*Zoth Signal Bridge is a sovereign, zero-cloud tool. No analytics. No crash reporting. No accounts.*
