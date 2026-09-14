<div align="center">

# <img src="../core-app/public/assets/brand/zoth-golden-z-192.png" width="40" height="40" style="border-radius: 8px; vertical-align: middle; border: 1px solid rgba(251,191,36,0.3); box-shadow: 0 0 15px rgba(232,200,114,0.6);" /> ⚡ ZOTH STUDIO MASTER DOCUMENTATION (v3.2.0)

### *Sovereign Local-First AI Agent Powerhouse, 3D Omniverse, Netrunner Cyberspace, 12-Formula Topology Engine & Cryptographic Key Vault*

[![Version](https://img.shields.io/badge/manual-v3.2.0-00f0ff?style=for-the-badge&logo=target&logoColor=white)](http://127.0.0.1:8088/docs/)
[![Architecture](https://img.shields.io/badge/architecture-4--Tier%20Sovereign-34d399?style=for-the-badge&logo=safari&logoColor=white)](http://127.0.0.1:8088/)
[![CLI](https://img.shields.io/badge/cli-zoth%20v3.2-fbbf24?style=for-the-badge&logo=gnubash&logoColor=black)](../core-app/bin/zoth)
[![Multi-Agent](https://img.shields.io/badge/pantheon-21%20Autonomous%20Models-a855f7?style=for-the-badge&logo=probot&logoColor=white)](http://127.0.0.1:8088/agents/)
[![Mascots](https://img.shields.io/badge/pet--dex-24%20Mascot%20Spirits-fbbf24?style=for-the-badge&logo=githubsponsors&logoColor=black)](http://127.0.0.1:8088/pets/)
[![Topology](https://img.shields.io/badge/topology-12%20Tsubuyaki%20Formulas-38bdf8?style=for-the-badge&logo=wolframmathematica&logoColor=white)](http://127.0.0.1:8199/showcase/tsubuyaki-vortex.html)
[![Security](https://img.shields.io/badge/vault-Argon2id%20%2B%20XChaCha20-f472b6?style=for-the-badge&logo=rust&logoColor=white)](http://127.0.0.1:8088/vault/)
[![Netrunner](https://img.shields.io/badge/netrunner-Lucy%20Oracle%20%3A8788-00f0ff?style=for-the-badge&logo=matrix&logoColor=white)](http://127.0.0.1:8788/)

<br>

<!-- Live Animated Telemetry HUD -->
<p align="center">
  <img src="assets/zoth-telemetry-banner.svg" alt="Live Telemetry HUD" width="100%" />
</p>

</div>

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🏛️ 1. Executive Summary & Four-Tier Sovereign Architecture

**Zoth Studio** is an autonomous, sovereign local-first AI agent powerhouse, 3D CAD omniverse, multi-agent arbitration deck, cognitive memory daemon, and physical hardware companion hub. Operating entirely from local storage, it delivers zero-leak privacy, instant local execution, and total resilience against cloud SaaS vendor lock-in.

```mermaid
flowchart TB
    subgraph AirgapPerimeter["🛡️ SOVEREIGN 4-TIER AIRGAP TOPOLOGY (GOLD & CYAN MATRIX)"]
        direction TB
        
        subgraph Tier1["🔐 TIER 1: HARDWARE-ISOLATED ZERO-LEAK VAULT (:8787)"]
            Vault["Rust Argon2id BYOK Vault<br/>• m=64MB, t=3, p=4<br/>• XChaCha20-Poly1305<br/>• Zeroize-on-drop Memory Barrier"]
        end

        subgraph Tier2["🧠 TIER 2: COGNITIVE MEMORY DAEMON & LUCY ORACLE (:8788)"]
            Mem["Netrunner Memory Engine<br/>• Dual-Layer Human Story & Lossless Raw AI XML<br/>• STDP Hebbian Causal Graph Traversal<br/>• Lucy (Cyberpunk: Edgerunners) Oracle"]
        end

        subgraph Tier3["📟 TIER 3: EMBEDDED COMPANIONS & ENCRYPTED COMMS (:8585, :5225, :8767)"]
            ESP["ESP32-S3 Physical Companion (:8585)<br/>• ST7789 2.0 IPS TFT (240x320)<br/>• ES8311 I2S Audio Codec<br/>• /dev/ttyACM0 @ 115200 Baud"]
            SimpleX["SimpleX E2EE Chat Bridge (:8767 / :5225)<br/>• Zero-Metadata Cryptographic Sockets"]
        end

        subgraph Tier4["🎛️ TIER 4: LOCAL COMMAND COCKPIT (:8484, :8199) & HUB (:8088)"]
            Operator["🧑‍💻 Local Operator CLI & Curses TUI (bin/zoth)"]
            Router["⚡ Zoth Swarm Router (Starlette/FastAPI)"]
            Tools["🛠️ 298+ Sovereign Local Tools & Web Exporters"]
            Hub["🌐 23+ Sovereign Web Workstations (:8088 / :8199)<br/>• 12-Formula #つぶやきProcessing Topology Lab<br/>• 24-Spirit Mascot Studio & Pet Dex<br/>• Netrunner 3D Matrix Game Engine<br/>• 3D Swarm Arena v3 (Shields/Lasers)"]
        end
    end

    Operator -->|Loopback Control| Router
    Router <-->|Zero-Leak Memory Channel| Vault
    Router <-->|Semantic Vector Graph| Mem
    Router <-->|Serial JSON Packets| ESP
    Router <-->|Zero-Metadata Sockets| SimpleX
    Router -->|Deterministic Contracts| Tools
    Router -->|Render & Telemetry Stream| Hub

    style AirgapPerimeter fill:#05070d,stroke:#00f0ff,stroke-width:2px,stroke-dasharray: 5 5,color:#a5f3fc
    style Tier1 fill:#160f08,stroke:#fbbf24,stroke-width:2px,color:#fef3c7
    style Tier2 fill:#091e3a,stroke:#00f0ff,stroke-width:2px,color:#e0f2fe
    style Tier3 fill:#06231a,stroke:#10b981,stroke-width:2px,color:#d1fae5
    style Tier4 fill:#120e24,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
```

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🌐 2. Universal Port & Protocol Architecture

| Service / Workstation | Port | Loopback Binding | Encryption / Protocol | Purpose |
| :--- | :---: | :--- | :--- | :--- |
| **Zoth Dev Server** | `8199` | `127.0.0.1` (Local) | HTTP / SSE / Static | Primary development server, visual notes & memory proxy |
| **Zoth Studio Hub** | `8088` | `0.0.0.0` / `127.0.0.1` | HTTP / SSE / WebGL | 23+ Flagship workstations, 3D scenes, WebGen, vOS sandbox |
| **Master Orchestrator Deck** | `8484` | `127.0.0.1` (Local) | Token Auth / REST / PTY | Operator command center, PTY streaming, task dispatch |
| **Rust Argon2id Key Vault** | `8787` | `127.0.0.1` (Local) | Argon2id + XChaCha20-Poly1305 | Hardware-isolated BYOK key storage with Zeroize-on-drop |
| **Cognitive Memory Daemon** | `8788` | `127.0.0.1` (Local) | REST / SSE / Vector Graph | Dual-layer memories, STDP Hebbian graph, Lucy 3D cyberspace |
| **SimpleX WebSocket Relay** | `5225` | `127.0.0.1` (Local) | WebSocket JSON-RPC | Real-time post-quantum chat socket for agent coordination |
| **SimpleX E2EE Web Bridge** | `8767` | `127.0.0.1` (Local) | Zero-Metadata E2EE / REST | HTTP loopback bridge to SimpleX chat network |
| **ESP32-S3 Hardware Bridge**| `8585` | `127.0.0.1` (Local) | Serial JSON framing | USB `/dev/ttyACM0` companion telemetry & button triggers |
| **Ollama Local AI Server** | `11434` | `127.0.0.1` (Local) | REST Tensor Pipe | Local offline LLM inference (Llama, DeepSeek, Qwen) |

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## ⚡ 3. 21-Agent Autonomous Pantheon & 24 Mascot Spirits

<p align="center">
  <img src="assets/zoth-agent-pantheon-banner.svg" alt="21-Agent Pantheon Constellation" width="100%" />
</p>

### The 21 Pantheon Sovereign AI Agents:
* **Master Azoth**: Supreme lead sovereign architect, Fibonacci geometry enforcer, and AST synthesis core.
* **Lucy (Cyberpunk: Edgerunners)**: Lead Netrunner Oracle, neural context curator, and deep-dive memory indexer.
* **Antigravity (Google Deepmind AGY)**: Test-first diff generation, multi-step code pairing, and zero-drive-by refactor audits.
* **Grok (xAI)**: Real-time telemetry monitoring, deep code auditing, and security fuzzing.
* **Hermes 3 (Nous Research)**: Autonomous multi-step tool caller and recursive task planner.
* **Draco**: Multi-Agent AST compiler turning cross-agent conflicts into unified PRs.
* **Lycan**: OWASP defense sentinel, DOMPurify sanitizer, and strict CSP guard.
* **Athena**: Knowledge graph validator and AEO Schema.org architect.
* **Kitsune**: Creative motion, cyber dark taste, and visual synthesis.
* **Aether, Ignis, Chronos, Ghostbyte, Kraken, Leviathan, Scorpius, Onyx, Radical Minion, Pixel Shiba, Pixel Neko, Aquila**.

### The 24 Mascot Spirits & Pet Dex:
Full list accessible in CLI (`zoth pet list`), terminal companion simulator (`zoth pet play`), and web studio ([`/pets/`](http://127.0.0.1:8088/pets/)):
* `azoth`, `zoth`, `kai`, `draco`, `ignis`, `lycan`, `athena`, `kitsune`, `pixel-neko`, `pixel-shiba`, `radical-minion`, `glitchcat`, `circuit-pup`, `terminal-ghost`, `savage-codex`, `ai-workbot`, `binary`, `aquila`, `leviathan`, `onyx`, `chronos`, `aether`, `kraken`, `scorpius`.

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🪐 4. #つぶやきProcessing 12-Formula Topology Engine

All 12 topological mathematical formulas are golfed into 280-byte tweetable code and computed in real-time in terminal ASCII (`zoth tsubuyaki render`) and 3D WebGPU ([`/showcase/tsubuyaki-vortex.html`](http://127.0.0.1:8199/showcase/tsubuyaki-vortex.html)):

1. **`v1` Celestial Torus Vortex** (222 B): Twin-strand counter-rotating torus with singular harmonic ripples $\sin(9/k)$.
2. **`v2` Hexa-Strand Möbius Vortex** (245 B): 6-fold phase-split ribbon knot with cubic wave surges $d^3/9$.
3. **`v3` Triskelion Crystalline Knot** (239 B): 3-lobed trifold rotation with parabolic ripple surface.
4. **`v4` Hyperbolic Gyroid Mesh** (242 B): 4-fold interwoven saddle geometry with hyperbolic warping.
5. **`v5` Folium of Descartes Loop** (209 B): Classical algebraic folium nodal loop.
6. **`v6` Acos Wave Collapse Toroid** (218 B): Piecewise wave collapse with $\cos(5 - \arccos(\cos(3p)))99$.
7. **`v7` Polar Cassini Oval Resonator** (224 B): Bi-focal orbital modulation and harmonic lobes.
8. **`v8` Order/Disorder Interference** (231 B): 2D lattice stipple field with radial interference ripples.
9. **`v9` Polar Modulo Lissajous** (228 B): Multi-harmonic resonance rings woven by co-varying frequency phase modulations.
10. **`v10` Clifford Strange Attractor** (248 B): Fractal chaotic flow attractor with phase oscillations.
11. **`v11` Logarithmic Golden Spiral** (214 B): $(1.0008)^y$ exponential phyllotaxis spiral.
12. **`v12` Quantum Fermat Phyllotaxis** (238 B): $\sqrt{i}\cdot 2.2$ density grain packing with quantum spin warp.

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 🎮 5. First-Person 3D Video Game Matrix Engine & Lucy Oracle

The Netrunner Memory Hub (`:8788` / [`/studio/netrunner-memory.html`](http://127.0.0.1:8088/studio/netrunner-memory.html)) transforms abstract memory recall into a 3D Cyberpunk video game world:
* **Stepped Alchemical Altars**: Hexagonal stone & glowing cyan platforms with animated perimeter energy tracks.
* **Faceted Iridescent Shards**: 3D crystalline memory nodes with dual counter-rotating octahedral cores.
* **Lucy (Cyberpunk: Edgerunners) Oracle**: Authentic Lucy avatar billboard with holographic scanlines, radiant energy bursts, and interactive voice synthesis.
* **In-World Spatial Billboard UI**: HTML5 3D Canvas textures displaying live memory titles, timestamps, and STDP resonance scores floating above each node.
* **360° Circular Radar Mini-Map**: Top-down heads-up radar showing nearby memory shards and player coordinates.
* **`[TAB]` Netrunner AR Scanner**: Cyberpunk analytical scan mode revealing hidden STDP synaptic connections.

<p align="center"><img src="assets/zoth-cyber-divider.svg" width="100%" /></p>

## 📐 6. Mathematical Pillars of Sovereign AI (Theory Academy)

The entire Zoth Studio multi-agent consensus, arbitration, and vector memory matrix is anchored in six formal mathematical disciplines accessible through the interactive [`/studio/math-pillars.html`](http://127.0.0.1:8088/studio/math-pillars.html) academy:

### Pillar I: Monoidal Category Theory & Sheaf Cohomology
* **Categorical Functor Composition**: Agent tool pipelines are modeled as functors $F: \mathcal{C} \to \mathcal{D}$ between symmetric monoidal categories. Side effects are strictly confined to an IO Monad $(T, \eta, \mu)$.
* **Sheaf Cohomology on Swarm Graphs**: When agents propose conflicting code modifications, local AST consistency is measured as sections over open coverings $\mathcal{U} = \{U_i\}$. A global merge exists if and only if the first Čech cohomology group vanishes:
  $$\check{H}^1(\mathcal{U}, \mathcal{F}) = 0$$

### Pillar II: High-Dimensional Information Geometry & Riemannian Manifolds
* **Fisher Information Metric Tensor**: The probability simplex of agent actions is endowed with the Riemannian metric:
  $$g_{ij}(\theta) = \int p(x; \theta) \frac{\partial \log p(x; \theta)}{\partial \theta_i} \frac{\partial \log p(x; \theta)}{\partial \theta_j} dx$$
* **Natural Gradient Optimization**: Ensures invariant step lengths across different parameter scales:
  $$\tilde{\nabla} L(\theta) = g^{-1}(\theta) \nabla L(\theta)$$
* **Poincaré Hyperbolic Embeddings**: Memory and file hierarchies are mapped to the hyperbolic disk $\mathbb{D}^n$, preserving exponential tree branching without metric distortion.

### Pillar III: Spike-Timing-Dependent Plasticity (STDP) & Synaptic Hebbian Graph
* **Synaptic Weight Plasticity**: Links between memory nodes are formed dynamically based on causal execution timing differences $\Delta t = t_{\text{effect}} - t_{\text{cause}}$:
  $$\Delta w = \begin{cases} A_+ e^{-\Delta t / \tau_+} & \Delta t > 0 \text{ (Long-Term Potentiation)} \\ -A_- e^{\Delta t / \tau_-} & \Delta t < 0 \text{ (Long-Term Depression)} \end{cases}$$
* **Causal Root-Cause Discovery**: Enables `/v1/memories/causal-path` to traverse the directed graph in sub-millisecond latency to locate the exact commit or prompt that induced a bug.

### Pillar IV: Shannon Agreement Entropy & Epistemic Triangulation
* **Consensus Disagreement Entropy**: Quantifies uncertainty across multi-model arbitration (Antigravity, Grok, Hermes):
  $$H(P) = -\sum_{i=1}^N p_i \log_2 p_i$$
* **Automatic Commit Gate**: Execution proceeds autonomously only when $H(P) < 0.20\text{ bits}$, preventing divergent or unverified code writes.

### Pillar V: Kolmogorov-Arnold Networks (KAN) & Learnable B-Splines
* **Symbolic Representation**: Replaces black-box MLP matrix multiplications with parameterized 1D B-spline curves along graph edges:
  $$f(x_1, \dots, x_n) = \sum_{q=1}^{2n+1} \Phi_q\left( \sum_{p=1}^n \phi_{q,p}(x_p) \right)$$
* **Zero-Hallucination Equation Extraction**: Produces exact closed-form algebraic expressions explaining agent reasoning patterns.

### Pillar VI: Modern Continuous Hopfield Networks for Dense Associative Memory
* **Energy Minimization**: Provides exponential pattern capacity ($C \sim 2^{d/2}$) for instant episodic memory recall:
  $$E(x) = -\beta^{-1} \text{LSE}(\beta, X^T x) + \frac{1}{2} x^T x$$
* **Subconscious Associative Recall**: Guarantees single-iteration retrieval of closest historical context matching current prompt embeddings.

---

<div align="center">
  <img src="../core-app/public/assets/brand/zoth-golden-z-192.png" width="30" height="30" style="border-radius:6px; vertical-align:middle; border:1px solid #e8c872;" />
  <br>
  <strong>Zoth Studio Technical Architecture Committee</strong> · Licensed under MIT / Apache-2.0
</div>
