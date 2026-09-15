# 🛡️ Zoth Studio Security Policy & Sovereign Threat Model

**Version**: 3.2.0  
**Status**: Active  
**Scope**: `NullAITech/zoth-studio` (Core Workstation, CLI Engine, Daemons & Cryptographic Vault)

---

## 🏛️ 1. Sovereign Security Philosophy & Zero-Trust Architecture

Zoth Studio is architected around a strict **Sovereign, Local-First, Zero-Cloud Egress** security model. Unlike conventional cloud-hosted developer platforms, Zoth Studio operates entirely on the user's local machine, treating external network interfaces with zero trust.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           LOCAL HOST PERIMETER (127.0.0.1)                        │
│                                                                                   │
│  ┌───────────────────────┐   HTTP / SSE    ┌───────────────────────────────────┐  │
│  │   Browser Cockpit     │ <─────────────> │  Zoth Studio Hub (:8088)          │  │
│  │  (23+ Web Workstations│                 │  Zoth Dev Server (:8199)          │  │
│  └───────────────────────┘                 └───────────────────────────────────┘  │
│             │                                                │                    │
│             │ DOM Events / SSE                               │ Loopback REST      │
│             ▼                                                ▼                    │
│  ┌───────────────────────┐                 ┌───────────────────────────────────┐  │
│  │ Netrunner Memory (:8788│                │ Master Orchestrator Deck (:8484)  │  │
│  │ Dual-Layer Vector STDP │                │ Unix PTY Harness / AST Consensus  │  │
│  └───────────────────────┘                 └───────────────────────────────────┘  │
│             │                                                │                    │
│             │ Local IPC                                      │ Token Auth         │
│             ▼                                                ▼                    │
│  ┌───────────────────────┐                 ┌───────────────────────────────────┐  │
│  │ Argon2id Vault (:8787)│                 │ SimpleX E2EE Bridge (:5225/:8767) │  │
│  │ Hardware/Rust Enclave │                 │ Post-Quantum Double-Ratchet Relay │  │
│  └───────────────────────┘                 └───────────────────────────────────┘  │
│             ▲                                                ▲                    │
│             └───────────────────┬────────────────────────────┘                    │
│                                 │                                                 │
│                      NO EXTERNAL EGRESS / NO TELEMETRY                            │
└─────────────────────────────────┼─────────────────────────────────────────────────┘
                                  │
                                  X  [BLOCKED: External Internet / Third-Party CDNs]
```

### Core Tenets:
1. **Zero Telemetry Guarantee**: No tracking beacons, no analytics pings, no telemetry daemons, and zero third-party cloud analytics. All fonts, shader scripts, stylesheets, and WebAssembly binaries are 100% vendored locally within `public/assets/`.
2. **Strict Loopback Binding (`127.0.0.1`)**: Every daemon, HTTP server, SSE stream, and WebSocket relay is strictly bound to `127.0.0.1` by default. No server listens on `0.0.0.0` unless explicitly passed an override flag by the sovereign operator.
3. **Bring-Your-Own-Key (BYOK) Ephemeral Key Isolation**: Secrets and API tokens never touch disk unencrypted. Keys are protected by high-memory Argon2id key derivation and in-memory zeroization.
4. **Deterministic AST Consensus**: Multi-agent code synthesis and automated tool execution must satisfy Shannon Agreement Entropy thresholds ($H(P) < 0.20\text{ bits}$) and AST validation before code modification is permitted.

---

## 🌐 2. Sovereign Loopback Port Matrix

All network-accessible components are isolated to the local loopback interface:

| Port | Subsystem / Daemon | Protocol / Binding | Security Controls & Enforcement |
|:---:|---|---|---|
| **`:8199`** | **Zoth Dev Server** | `HTTP / SSE` (`127.0.0.1`) | Local development server, annotation event proxy, memory gateway. Enforces local-origin headers. |
| **`:8484`** | **Master Orchestrator Deck** | `REST / PTY` (`127.0.0.1`) | Token-authenticated Unix PTY terminal streaming (`pty.fork`). Restricts execution paths; requires `--confirm` for mutating commands. |
| **`:8088`** | **Zoth Studio Hub** | `HTTP / WebGL` (`127.0.0.1`) | Serves 23+ offline static web workstations. Zero external scripts or CDN dependencies. |
| **`:8788`** | **Cognitive Memory Daemon** | `REST / SSE` (`127.0.0.1`) | Associative dual-layer vector memory matrix. Local-only IPC; sanitized JSON payloads. |
| **`:5225`** | **SimpleX WebSocket Relay** | `WebSocket` (`127.0.0.1`) | Post-quantum encrypted socket stream for mobile/desktop asynchronous agent coordination. |
| **`:8767`** | **SimpleX E2EE Web Bridge** | `HTTP REST` (`127.0.0.1`) | Loopback proxy bridging web workstations with SimpleX chat network. Zero metadata retention. |
| **`:11434`** | **Ollama Local AI Server** | `REST Tensor Pipe` (`127.0.0.1`) | Completely offline LLM inference (`zoth-micro`, `qwen2.5-coder`, `hermes-3`). Air-gapped AI execution. |
| **`:8787`** | **Rust Argon2id Key Vault** | `Argon2id + XChaCha20` (`127.0.0.1`) | Hardware-isolated BYOK key storage with memory zeroization on drop. |
| **`:8585`** | **ESP32-S3 Hardware Bridge** | `Serial JSON` (`/dev/ttyACM0`) | Physical companion bridge for ST7789 display & I2S audio. Device-permission restricted. |

---

## 🔐 3. Cryptographic Specifications

### 3.1 Argon2id Keymaster Vault Daemon
The Zoth Keymaster Vault (`vault-daemon/`) provides encrypted key storage and cryptographic operations:
- **Key Derivation Function (KDF)**: `Argon2id` (RFC 9106)
  - **Memory Cost ($m$)**: $65,536\text{ KiB}$ ($64\text{ MB}$)
  - **Time Cost / Iterations ($t$)**: $3\text{ passes}$
  - **Parallelism ($p$)**: $4\text{ threads/lanes}$
  - **Salt**: 32-byte cryptographically secure pseudorandom number generator (CSPRNG) generated per vault initialization.
- **Symmetric Cipher**: `XChaCha20-Poly1305` (IETF draft) with 192-bit nonces to prevent nonce-reuse hazards.
- **Memory Zeroization**: In-memory keys, plaintext buffers, and intermediate derivation keys implement the `zeroize::ZeroizeOnDrop` trait in Rust, wiping memory pages immediately upon handle deallocation to thwart RAM dump attacks.

### 3.2 SimpleX E2EE Double-Ratchet Bridge
Asynchronous agent communication and operator bridge channels (`:5225`, `:8767`) use the SimpleX Chat protocol:
- **Zero Identifiers**: No phone numbers, email addresses, user handles, or centralized registry IDs.
- **Double Ratchet Algorithm**: Ephemeral Diffie-Hellman keys rotated per message exchange with forward secrecy and post-compromise security.
- **Isolated Queues**: Unidirectional simplex queues operating over Tor or direct local loopback sockets.

---

## ⚡ 4. Sandboxing & Safe Execution Policies

1. **Dry-Run by Default**: All tool runs, workspace mutations, and filesystem edits initiated via the CLI or orchestrator default to dry-run mode. Mutation requires explicit operator confirmation (`--confirm`).
2. **PTY Process Isolation**: Terminal sessions spawned by `:8484` run under the current user's Unix permissions via dedicated pseudo-terminals (`pty.fork`), preventing terminal escape code injection and unauthenticated privilege escalation.
3. **AST Consensus Fuzzing & Entropy Gate**: Automated agent code generation pipelines enforce Shannon Agreement Entropy limits ($H(P) = -\sum p_i \log_2 p_i < 0.20\text{ bits}$) across independent model prompts and validate Abstract Syntax Trees (AST) before writes are committed.
4. **PII Scrubbing Gate**: Release packaging scripts (`scripts/build-linux-packages.sh`, `scripts/build-windows-package.sh`, `scripts/scrub-pii.sh`) enforce automated string audits to prevent private keys, internal paths, and developer identities from leaking into release binaries.

---

## 📋 5. Supported Versions

Security updates and patches are actively provided for the following releases:

| Version | Supported | Security Maintenance Level |
|---|:---:|---|
| **`v3.2.x`** (Current) | ✅ Yes | Full active security support, zero-day patching, dependency audits. |
| **`v3.1.x`** | ✅ Yes | Critical vulnerability backports only. |
| **`v3.0.x`** | ⚠️ Limited | End of standard support; upgrade to v3.2+ recommended. |
| **`< v3.0.0`** | ❌ No | Deprecated. Unsupported legacy architecture. |

---

## 🚨 6. Reporting a Vulnerability

We deeply appreciate responsible disclosure from security researchers and the sovereign developer collective.

### Reporting Channels:
- **Primary / Private Security Reporting**: Submit via [GitHub Private Vulnerability Reporting](https://github.com/NullAITech/zoth-studio/security/advisories/new).
- **Encrypted Comms (SimpleX / PGP)**: For highly sensitive reports or 0-day findings, reach out via the SimpleX Sovereign Bridge or email our security maintainers with PGP encryption:
  - **Email**: `security@nullai.tech`
  - **Subject**: `[SECURITY VULNERABILITY] Zoth Studio - <Brief Subsystem Description>`

### Please Include:
1. **Vulnerability Type**: (e.g., Loopback bypass, Argon2id derivation flaw, PTY escape, XSS in static workstation, memory disclosure).
2. **Impact**: Potential consequences and access required to exploit.
3. **Steps to Reproduce / PoC**: Minimal, reproducible proof-of-concept script or command sequence.
4. **Environment**: OS (Parrot OS, Debian, Ubuntu, macOS, Windows), Architecture (`x86_64`, `aarch64`), Zoth Studio version (`zoth --version`), Node & Python versions.

### Vulnerability Response SLA:
- **Initial Acknowledgment**: Within **24 hours**.
- **Triage & Severity Assessment**: Within **72 hours**.
- **Remediation & Patch Delivery**: Within **7 business days** for high/critical vulnerabilities.
- **Public Disclosure**: Coordinated disclosure after patch release and notification to affected operators.

---

## 🤝 7. Safe Harbor & Researcher Protections

We consider security research conducted under this policy to be:
- **Authorized**: We will not initiate legal action against researchers who discover and report vulnerabilities in good faith in accordance with this policy.
- **Protected**: We will work cooperatively with you to understand and resolve the issue quickly.
- **Credited**: Valid security reports will be acknowledged in our release notes and Hall of Contributors (unless anonymity is requested).
