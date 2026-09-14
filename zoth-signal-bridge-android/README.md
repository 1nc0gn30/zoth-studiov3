# ⚡ Zoth Signal Bridge (Android Sovereign Swarm Remote NOC)

**A native, zero-cloud Android application to replace Signal Messenger for communicating with and commanding your autonomous Zoth Multi-Agent Swarm over Tailscale.**

---

## 🏛️ 1. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Android Phone (Zoth Signal Bridge)         │
│  • Transmissions Stream (#all, #agy, #azoth, #hermes)   │
│  • Direct Agent Command & Multi-Agent Dispatch          │
│  • Swarm Radar & Node Topology Telemetry                │
│  • Embedded Sovereign Studio HUD (WebView Bridge)       │
└────────────────────────────┬────────────────────────────┘
                             │  🔒 Encrypted WireGuard Tunnel
                             │  (Tailscale Private Mesh: 100.x.y.z)
┌────────────────────────────▼────────────────────────────┐
│              Zoth Swarm Workstation / Server            │
│  • Orchestrator API (:8484) -> /api/swarm, /api/bus     │
│  • Swarm Web Radar (:8088)  -> /studio/swarm.html       │
│  • Local Neural Model (:11434) -> Ollama (qwen2.5)      │
│  • Consensus Arena (:8484)  -> AST Merkle Validation    │
│  • Agent Event Bus -> agent-comms/bus.py                │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 2. Quick Start & Installation

### Install on Device via ADB:
```bash
adb install /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-signal-bridge-android/app/build/outputs/apk/debug/app-debug.apk
```

### Or Build from Source:
```bash
cd /media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-signal-bridge-android
./gradlew assembleDebug
```

---

## 🌐 3. Connecting with Tailscale

1. Ensure **Tailscale VPN** is connected on your Android device and workstation.
2. Note your workstation's Tailscale IP (e.g. `100.64.0.1` or `parrot-node`).
3. Open **Zoth Signal Bridge** on Android.
4. Tap the **⚙️ Tailscale** tab or the connection pill at the top right.
5. Set:
   - **Orchestrator Host URL**: `http://<your-tailscale-ip>:8484`
   - **Studio Web Radar URL**: `http://<your-tailscale-ip>:8088/studio/swarm.html`
6. Tap **Test Connection** to check ping latency, then tap **SAVE & CONNECT TAILSCALE BRIDGE**.

---

## 💬 4. Channels & Navigation

| Tab / Channel | Functionality |
| :--- | :--- |
| **📡 #all-transmissions** | Live global chatter, broadcast thoughts, test runs, and system alerts. |
| **🧙‍♂️ #antigravity** | Direct command channel to AGY Sovereign Lead Architect & AST engine. |
| **⚗️ #azoth** | Direct channel to Master Azoth Alchemical Core. |
| **🚀 #grok** | Studio refactoring, site synthesizer, and 3D shader engine. |
| **🕊️ #hermes** | Autonomous tool loop planner, subagents, and Parrot OS subroutines. |
| **🦙 #ollama** | Local zero-cloud neural inference engine (`:11434`). |
| **⚖️ #consensus** | Byzantine fault-tolerant consensus stream and Merkle root verification. |
| **🔒 #claims** | Active project locks, leases, and developer assignments. |

---

## ⚡ 5. Slash Commands & Shortcuts

- `/status` — Query real-time microservice port health & active agents.
- `/who` — List active nodes, seat regions (Forge, Deck, Ridge, Well), and heartbeat freshness.
- `/claims` — View active exclusive project leases.
- `/heartbeat` — Send an operator heartbeat to the swarm bus.
- `/route <prompt>` — Dispatch an intent-routed multi-agent execution pipeline.

---

## 🛡️ 6. Zero-Cloud Guarantee
- **No Third-Party Brokers**: Unlike Signal, Discord, or Telegram, messages never pass through public messaging servers.
- **WireGuard Encryption**: Secured directly peer-to-peer over your private Tailnet.
- **Local AST Execution**: Code analysis and tool loops run strictly on your private hardware.
