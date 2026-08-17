# Zoth-AI — Local Neural Model Transparency Report

> **Specification & Architectural Verification · v2.6.0**

This report documents the architectural configuration, weights, hyperparameters, and local-first compliance for the sovereign **Zoth-AI** model family running on Ollama (`127.0.0.1:11434`).

---

## 1. Model Hierarchy & Comparison

| Specification | `zoth-ai:latest` (Flagship) | `zoth-ai-micro:latest` (Edge) |
|---|---|---|
| **Base Foundation** | `Qwen2.5-Coder:1.5b` | `SmolLM2:360m` |
| **Parameter Count** | 1.54 Billion | 360 Million |
| **Quantization Format** | 4-bit (`Q4_K_M`) | 4-bit (`Q4_K_M`) |
| **Disk / RAM Footprint** | ~986 MB | ~725 MB |
| **Target Hardware** | Laptops, Workstations, Desktops (8GB+ RAM) | Edge devices, Raspberry Pi 5, Low-RAM Rigs |
| **Context Window (`num_ctx`)**| 4096 tokens | 2048 tokens |
| **Inference Latency (Local CPU)**| ~35–50 tokens/sec | ~80–120 tokens/sec |

---

## 2. Embedded Domain Knowledge

Both models have been tailored with embedded domain knowledge covering the entire Zoth Studio stack:

1. **System Topology & Bindings**:
   - Public Hub (`http://127.0.0.1:8088/`)
   - Private Operator Deck (`http://127.0.0.1:8484/`)
   - Local Ollama Engine (`http://127.0.0.1:11434/`)
   - BYOK Argon2id Vault Daemon (`http://127.0.0.1:8787/`)
2. **OmniPost Powerhouse**:
   - 60 FPS WebM video canvas export via HTML5 `MediaRecorder`.
   - Web Speech API narrator and Web Audio synthesizer.
   - Multi-platform repurposer (𝕏, LinkedIn, IG, TikTok, Bluesky, Reddit).
   - 8-angle psychological Viral Hook Lab.
3. **Visual Agent DAG Composer**:
   - Bezier node wiring and DAG simulation runner.
   - Playbook presets: Swarm 3D, Security Audit, OmniPost Blast, Site Forge.
4. **AI Math Observability Suite**:
   - **Pillar I: Linear Algebra** — Scaled Dot-Product Attention, RoPE ($10000.0$), LoRA ($r=16$).
   - **Pillar II: Multivariable Calculus** — Cross-Entropy Loss, AdamW gradients ($\eta=3e-4, \lambda=0.01$).
   - **Pillar III: Information Theory** — Softmax distributions, Shannon Entropy ($H(X)$), Perplexity ($PPL = \exp(\mathcal{L})$).
5. **Security Doctrine**:
   - Strict loopback isolation.
   - Zero key leakage to disk or public ingress tunnels.

---

## 3. How to Run Locally

```bash
# Run Flagship 1.5B Model:
ollama run zoth-ai "Explain how Zoth Studio protects API keys with Argon2id."

# Run Ultra-Lightweight 360M Model:
ollama run zoth-ai-micro "List the core Zoth Studio slash commands."
```

---
*Verification Date: 2026.08.17 · Publisher: 757tech / NullAI*
