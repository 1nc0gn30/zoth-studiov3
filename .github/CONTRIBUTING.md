# 🛠️ Contributing to Zoth Studio: Sovereign Developer Guide

Welcome to the **Zoth Studio** contributor ecosystem. Zoth Studio is an open, sovereign, local-first multi-agent browser cockpit, autonomous web foundry, and cognitive vector memory substrate.

We welcome contributions from researchers, systems programmers, cryptographers, UI designers, and creative coders who value user sovereignty, privacy, mathematical rigor, and aesthetic excellence.

---

## 🧭 1. Core Development Principles

1. **Local-First & Zero-Cloud Egress**: Everything must run strictly on `127.0.0.1` without external telemetry, tracking, or mandatory internet connectivity. All dependencies, fonts, WebAssembly modules, shaders, and scripts must be vendored into `public/assets/` or local Python/Rust packages.
2. **Mathematical & Architectural Rigor**: Multi-agent consensus, memory indexing, and topological visualizers must adhere to formal principles (Monoidal Category Theory, Riemannian Information Geometry, Spike-Timing-Dependent Plasticity, Shannon Agreement Entropy, and Kolmogorov-Arnold Networks).
3. **16-Brand Visual Integrity & 100% WCAG AA**: All frontend workstations and components must support the 16 switchable brand identity themes (`zoth-theme.js`), liquid magnetic navigation docks, and strict high-contrast accessibility standards.
4. **Zero-PII Leakage**: No personal identifying information (PII), absolute local paths (`/home/user/...`), or private keys may ever be committed to the public tree.

---

## 💻 2. Development Environment Setup

### Prerequisites:
- **Operating System**: Linux (Parrot OS, Debian, Ubuntu, Arch), macOS, or Windows (WSL2 / native)
- **Python**: `3.10+` (standard library + `curses`, `pty`, `hashlib`, `urllib`)
- **Node.js**: `18.0+` (for static asset verification, Playwright / Chrome tests)
- **Rust Toolchain**: `cargo 1.75+` (required for `vault-daemon/` Argon2id development)
- **Ollama**: (Optional for local offline LLM testing: `zoth-micro`, `qwen2.5-coder`)

### Initial Workspace Setup:
```bash
# 1. Clone the repository
git clone https://github.com/NullAITech/zoth-studio.git
cd zoth-studio/core-app

# 2. Symlink or alias the CLI executable
ln -sf "$(pwd)/bin/zoth" ~/.local/bin/zoth

# 3. Verify system health & dependencies
zoth doctor
```

---

## 🧪 3. Local Test Suite & Verification Protocols

Before submitting any code, verify all checks locally:

### 3.1 CLI & System Diagnostics
```bash
# Full 16-point deep system audit
zoth doctor

# Speed engine: scan 136+ static HTML pages for asset integrity & broken links
zoth speed audit

# Benchmark local HTTP response latency (< 5ms SLA)
zoth speed bench

# Tool orchestrator health audit
python3 tools/"null ai agent tools"/local_null_ai_orchestrator/orchestrator.py doctor
```

### 3.2 Frontend Code Hygiene & Zero-Egress Audit
Every frontend change must pass strict static verification:
```bash
# 1. Syntax check all modified JavaScript files
node --check public/assets/*.js

# 2. Verify all asset references resolve on local disk
python3 -c "
import glob, re, os
for html in glob.glob('public/**/*.html', recursive=True):
    content = open(html, encoding='utf-8', errors='ignore').read()
    for src in re.findall(r'(?:src|href)=[\"\']([^\"\']+)[\"\']', content):
        if src.startswith(('http://', 'https://', '//')) and not src.startswith('http://127.0.0.1'):
            print(f'🚨 EXTERNAL EGRESS FOUND in {html}: {src}')
"

# 3. Verify zero PII matches before staging
./scripts/scrub-pii.sh --check
```

---

## 🤖 4. Autonomous Agent & AST Consensus Rules

When contributing tools or autonomous agent pipelines:
1. **Schema-Contract Validation**: All tools in `tools/null ai agent tools/` must provide unambiguous parameter schemas, JSON outputs, dry-run safety modes, and `--confirm` flags for mutating operations.
2. **Shannon Agreement Consensus**: Swarm code synthesis routines must implement epistemic triangulation:
   $$H(P) = -\sum_{i=1}^n p_i \log_2 p_i < 0.20\text{ bits}$$
3. **Monadic Side-Effect Isolation**: State-altering operations must be staged and recorded into the Cognitive Vector Memory substrate (`:8788`) with both human-readable Markdown digests (`human_digest`) and structured telemetry (`ai_spectrum`).

---

## 🪐 5. Creative Coding & #つぶやきProcessing Topologies

When proposing new 3D WebGL, WebGPU, or mathematical topology visualizers for `/showcase/tsubuyaki-vortex.html` or `zoth tsubuyaki`:
- The core mathematical formula **must fit within the 280-byte constraints** of Twitter/X `#つぶやきProcessing` format.
- Code must support both high-performance 60 FPS WebGL/WebGPU rendering and ASCII stipple terminal rendering (`zoth tsubuyaki render <preset>`).
- Formulas must be accompanied by KaTeX mathematical explanations and category classification (Toroids, Algebraic Manifolds, Wavefields, or Quantum Phyllotaxis).

---

## 🐾 6. Mascot Spirits & Pet Dex Additions

When creating or refining a mascot spirit in `public/pets/`:
- Provide a distinctive emoji badge, role designation (Core, Build, Security, Knowledge, Creative, Edge, Ops, Autonomy), and thematic lore.
- Provide animated ASCII sprite frames in `public/assets/` and `bin/zoth pet ascii <name>`.
- Support procedural Web Audio synthesizer chimes and interactive tamagotchi status routines.

---

## 🔀 7. Pull Request & Commit Standards

### 7.1 Branch Naming Convention:
- `feat/<feature-name>`: New workstations, agent skills, or CLI commands.
- `fix/<bug-name>`: Bug fixes, layout rectifications, or port collision resolutions.
- `sec/<vulnerability>`: Security hardening, cryptographic updates, or sandbox enforcement.
- `agent/<persona>`: Autonomous agent dossiers, prompts, or tool wrappers.
- `topo/<formula>`: #つぶやきProcessing formulas and 3D visualizers.
- `docs/<topic>`: Documentation, theory academy guides, or architecture maps.

### 7.2 Atomic Commit Messages:
Follow the Conventional Commits specification with emoji accents:
- `feat(cli): add real-time streaming telemetry to zoth watch`
- `fix(vault): enforce zeroize on memory drop in keymaster daemon`
- `perf(memory): optimize STDP synaptic weight consolidation latency`
- `style(theme): enhance solar light mode contrast for WCAG AA compliance`
- `docs(math): add continuous modern hopfield energy derivation`

### 7.3 Pull Request Lifecycle:
1. Fork the repo and create your branch from `main`.
2. Ensure all tests, linters, and PII audits pass.
3. Open a Pull Request filling out all sections of `.github/PULL_REQUEST_TEMPLATE.md`.
4. Our maintainers and automated CI workflows will review your contribution for architectural harmony, zero-cloud egress compliance, and code quality.

---

## 📜 8. Developer Certificate of Origin (DCO)

By contributing to Zoth Studio, you certify that:
- The contribution was created in whole or in part by you and you have the right to submit it under the Apache-2.0 license; or
- The contribution is based upon previous work that, to the best of your knowledge, is covered under an appropriate open source license and you have the right to submit it with modifications.

Thank you for building sovereign, private, and mathematically grounded developer computing with Zoth Studio!
