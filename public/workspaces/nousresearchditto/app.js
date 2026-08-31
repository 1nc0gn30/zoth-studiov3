/**
 * NOUS RESEARCH APPRECIATION PLATFORM — CORE ENGINE
 * Style Directive: Ultra-clean dark theme, high contrast white text,
 * crisp borders, Lucide icon minimalism, smooth fluid transitions.
 */

// ==========================================================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API - MINIMALIST TONE FEEDBACK)
// ==========================================================================
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio policy
    }
  }

  click() {
    this.playTone(800, 'triangle', 0.04, 0.03);
  }

  beep() {
    this.playTone(1200, 'sine', 0.06, 0.04);
  }

  success() {
    this.playTone(600, 'sine', 0.06, 0.03);
    setTimeout(() => this.playTone(900, 'sine', 0.1, 0.03), 70);
  }

  pulse() {
    this.playTone(320, 'sine', 0.12, 0.04);
  }
}

const sfx = new SoundFX();

// ==========================================================================
// 2. CANVAS VISUALIZERS (CANONICAL TILE GRAPHICS & DISTRO SWARM)
// ==========================================================================

// --- Tile 1: Neural Mesh Particle Network ---
function initNeuralMeshCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const numParticles = 48;
  let mouse = { x: null, y: null, maxDist: 90 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.6 + 0.3
      });
    }
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 24;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 75) {
          const alpha = (1 - dist / 75) * 0.25;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + alpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (1 - dist / mouse.maxDist) * 2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      ctx.fillStyle = 'rgba(255, 255, 255, ' + p.alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// --- Tile 2: Harmonic Wave / Resonance Visualizer ---
function initHarmonicWaveCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let time = 0;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    time += 0.025;
    const centerY = height / 2;
    const numWaves = 5;

    for (let w = 0; w < numWaves; w++) {
      ctx.beginPath();
      const freq = 0.015 + w * 0.005;
      const amp = 30 + w * 12;
      const phase = time * (1 + w * 0.4) + w * 1.2;
      const alpha = 0.15 + (w / numWaves) * 0.55;

      ctx.strokeStyle = w % 2 === 0 
        ? 'rgba(56, 189, 248, ' + alpha + ')' 
        : 'rgba(255, 255, 255, ' + (alpha * 0.8) + ')';
      ctx.lineWidth = w === 2 ? 2 : 1;

      for (let x = 0; x < width; x += 3) {
        const y = centerY + Math.sin(x * freq + phase) * amp * Math.cos(x * 0.008 + time * 0.5);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Central pulse node
    const pulseX = (Math.sin(time * 0.8) * 0.5 + 0.5) * width;
    const pulseY = centerY + Math.sin(pulseX * 0.02 + time) * 35;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 9, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// --- Tile 3: 3D Wireframe Polytope / Polyhedron Canvas ---
function initPolytopeCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let rotX = 0.4, rotY = 0.6, rotZ = 0;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVertices = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
  ];

  const edges = [
    [0,11],[0,5],[0,1],[0,7],[0,10],
    [1,5],[1,9],[1,8],[1,7],
    [2,11],[2,10],[2,6],[2,3],[2,4],
    [3,9],[3,8],[3,6],[3,4],
    [4,11],[4,5],[4,9],
    [5,11],[5,9],
    [6,10],[6,7],[6,8],
    [7,10],[7,8],
    [8,9],
    [10,11]
  ];

  canvas.parentElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => isDragging = false);

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    rotY += dx * 0.01;
    rotX += dy * 0.01;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  function project(p, scale = 65) {
    let y1 = p[1] * Math.cos(rotX) - p[2] * Math.sin(rotX);
    let z1 = p[1] * Math.sin(rotX) + p[2] * Math.cos(rotX);
    let x2 = p[0] * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z2 = -p[0] * Math.sin(rotY) + z1 * Math.cos(rotY);
    let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

    const fov = 300;
    const dist = fov / (fov + z2 * scale + 180);
    return {
      x: width / 2 + x3 * scale * dist,
      y: height / 2 + y3 * scale * dist,
      z: z2
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    if (!isDragging) {
      rotY += 0.008;
      rotX += 0.004;
    }

    const projected = rawVertices.map(v => project(v, Math.min(width, height) * 0.32));

    // Draw Edges
    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.12, Math.min(0.9, 0.5 + avgZ * 0.3));

      ctx.strokeStyle = 'rgba(56, 189, 248, ' + alpha + ')';
      ctx.lineWidth = avgZ > 0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw Vertices
    projected.forEach(p => {
      const alpha = Math.max(0.2, Math.min(1, 0.6 + p.z * 0.4));
      ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// --- Distro Decentralized P2P Training Canvas ---
function initDistroSwarmCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let pulses = [];
  let stepCount = 894120;

  const nodes = [
    { name: 'SF-USW-01', x: 0.18, y: 0.42, state: 'SYNCED', tps: '124 GFLOP' },
    { name: 'NY-USE-02', x: 0.32, y: 0.36, state: 'SYNCED', tps: '118 GFLOP' },
    { name: 'LDN-EU-01', x: 0.48, y: 0.28, state: 'SYNCED', tps: '142 GFLOP' },
    { name: 'FRA-EU-02', x: 0.54, y: 0.34, state: 'SYNCED', tps: '130 GFLOP' },
    { name: 'TYO-AP-01', x: 0.82, y: 0.45, state: 'SYNCED', tps: '155 GFLOP' },
    { name: 'SIN-AP-02', x: 0.74, y: 0.62, state: 'SYNCED', tps: '128 GFLOP' },
    { name: 'SAO-SA-01', x: 0.36, y: 0.76, state: 'SYNCED', tps: '110 GFLOP' }
  ];

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  function spawnPulse() {
    const fromIdx = Math.floor(Math.random() * nodes.length);
    let toIdx = Math.floor(Math.random() * nodes.length);
    while (toIdx === fromIdx) {
      toIdx = Math.floor(Math.random() * nodes.length);
    }
    pulses.push({
      from: nodes[fromIdx],
      to: nodes[toIdx],
      progress: 0,
      speed: 0.015 + Math.random() * 0.02
    });
  }

  setInterval(spawnPulse, 320);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // World grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Static P2P connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const x1 = nodes[i].x * width;
        const y1 = nodes[i].y * height;
        const x2 = nodes[j].x * width;
        const y2 = nodes[j].y * height;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw active gradient pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.progress += p.speed;

      const x1 = p.from.x * width;
      const y1 = p.from.y * height;
      const x2 = p.to.x * width;
      const y2 = p.to.y * height;

      const curX = x1 + (x2 - x1) * p.progress;
      const curY = y1 + (y2 - y1) * p.progress;

      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (p.progress >= 1) {
        pulses.splice(i, 1);
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const nx = n.x * width;
      const ny = n.y * height;

      // Glow ring
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nx, ny, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Center dot
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Node label
      ctx.font = '10px "Geist Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(n.name, nx + 14, ny + 3);

      ctx.fillStyle = '#64748b';
      ctx.fillText(n.tps, nx + 14, ny + 14);
    });

    requestAnimationFrame(draw);
  }

  setInterval(() => {
    stepCount += 12;
    const stepEl = document.getElementById('distro-step-counter');
    if (stepEl) stepEl.textContent = stepCount.toLocaleString();
  }, 1000);

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ==========================================================================
// 3. HERMES INTERACTIVE MODEL PLAYGROUND & STREAMER
// ==========================================================================

const SAMPLE_OUTPUTS = {
  'researcher': {
    thought: 'Evaluating prompt against current open research landscape.\nSynthesizing architecture rationale for Hermes 3 steerability & structured instruction alignment.\nKey considerations:\n1. Role-play fidelity vs. instruction adherence.\n2. Tool execution syntax verification.\n3. Multi-turn context preservation without degradation.',
    response: '### Nous Research Hermes 3 — Sovereign Alignment Architecture\n\nHermes 3 represents a fundamental step forward in steerable, neutral, and uninhibited open-source language models. Unlike standard instruction models that enforce rigid refusal vectors, Hermes 3 respects user-defined system directives with mathematical precision.\n\n### Key Capabilities:\n- **Steerable Persona Matrix**: Adapts instantly to system instructions ranging from formal scientific rigor to complex cybernetic simulations.\n- **Agentic Function Execution**: Native XML/JSON tool schemas designed for autonomous multi-step environment interaction.\n- **Deep Scratchpad Reasoning**: Transparent token streams permitting step-by-step verification before final synthesis.\n\n*Model weights are freely accessible on HuggingFace under Apache 2.0 / Open Sovereign Weights.*',
    toolCall: '{\n  "name": "query_huggingface_hub",\n  "arguments": {\n    "repo_id": "NousResearch/Hermes-3-Llama-3.1-70B",\n    "revision": "main",\n    "quantizations": ["FP16", "Q8_0", "Q4_K_M"]\n  }\n}'
  },
  'coder': {
    thought: 'User requested distributed tensor gradient compression simulation using DisTrO mechanics.\nApplying stochastic quantization, top-k sparsification, and accumulator momentum.',
    response: 'Here is the reference PyTorch implementation for a DisTrO-style gradient compression step that achieves >99.9% communication reduction:\n\n```python\nimport torch\n\nclass DisTrOGradientCompressor:\n    def __init__(self, compression_ratio=0.999, momentum=0.9):\n        self.ratio = compression_ratio\n        self.momentum = momentum\n        self.residuals = {}\n\n    @torch.no_grad()\n    def compress(self, param_name: str, grad: torch.Tensor):\n        if param_name not in self.residuals:\n            self.residuals[param_name] = torch.zeros_like(grad)\n        \n        acc_grad = grad + self.residuals[param_name]\n        k = max(1, int(grad.numel() * (1 - self.ratio)))\n        \n        flat = acc_grad.view(-1)\n        topk_vals, topk_idx = torch.topk(torch.abs(flat), k=k)\n        sparse_vals = flat[topk_idx]\n        \n        mask = torch.zeros_like(flat, dtype=torch.bool)\n        mask[topk_idx] = True\n        self.residuals[param_name] = acc_grad - flat.masked_fill(~mask, 0).view_as(grad)\n        \n        return sparse_vals, topk_idx\n```\n',
    toolCall: '{\n  "name": "benchmark_kernel",\n  "arguments": {\n    "algorithm": "DisTrO-TopK",\n    "tensor_size": [8192, 8192],\n    "compression_factor": 1000\n  }\n}'
  },
  'agent': {
    thought: 'Hermes Agent mode activated. Inspecting local environment and tool capabilities.\nActive tools: [browse_web, run_terminal, read_file, execute_python].\nExecuting planned multi-hop verification trace.',
    response: 'I have initiated the autonomous verification workflow.\n\n1. **Step 1**: Queried local compute topology and confirmed CUDA cluster status.\n2. **Step 2**: Verified model checksum for `NousResearch/Hermes-3-Llama-3.1-405B`.\n3. **Step 3**: Prepared evaluation harness across 12 target benchmarks.\n\nReady to execute subsequent instructions or deploy autonomous workers.',
    toolCall: '{\n  "name": "hermes_agent_spawn",\n  "arguments": {\n    "role": "Autonomous Cluster Auditor",\n    "target_nodes": ["SF-USW-01", "LDN-EU-01"],\n    "action": "run_inference_benchmark"\n  }\n}'
  }
};

class ModelPlayground {
  constructor() {
    this.outputContainer = document.getElementById('playground-output-content');
    this.thoughtContainer = document.getElementById('playground-thought-box');
    this.thoughtText = document.getElementById('playground-thought-text');
    this.toolBox = document.getElementById('playground-tool-box');
    this.toolCode = document.getElementById('playground-tool-code');
    this.tpsDisplay = document.getElementById('playground-tps');
    this.latencyDisplay = document.getElementById('playground-latency');
    this.seedDisplay = document.getElementById('playground-seed-val');
    this.btnGenerate = document.getElementById('btn-playground-generate');
    this.promptInput = document.getElementById('playground-custom-prompt');

    this.isStreaming = false;
    this.currentPreset = 'researcher';
    this.bindEvents();
  }

  bindEvents() {
    if (this.btnGenerate) {
      this.btnGenerate.addEventListener('click', () => {
        sfx.click();
        this.runGeneration();
      });
    }

    if (this.promptInput) {
      this.promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sfx.click();
          this.runGeneration();
        }
      });
    }

    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sfx.click();
        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentPreset = btn.dataset.preset || 'researcher';
        const promptMap = {
          'researcher': 'Explain the architectural philosophy of Nous Hermes 3 steerability.',
          'coder': 'Write a DisTrO gradient compression algorithm in PyTorch.',
          'agent': 'Deploy an autonomous Hermes agent to audit distributed training nodes.'
        };
        if (this.promptInput && promptMap[this.currentPreset]) {
          this.promptInput.value = promptMap[this.currentPreset];
        }
        this.runGeneration();
      });
    });

    const tempSlider = document.getElementById('temp-slider');
    const tempVal = document.getElementById('temp-val');
    if (tempSlider && tempVal) {
      tempSlider.addEventListener('input', (e) => {
        tempVal.textContent = e.target.value;
      });
    }
  }

  runGeneration() {
    if (this.isStreaming) return;
    this.isStreaming = true;

    const randomSeed = Math.floor(Math.random() * 4000000000 + 100000000);
    if (this.seedDisplay) this.seedDisplay.textContent = randomSeed;

    const data = SAMPLE_OUTPUTS[this.currentPreset] || SAMPLE_OUTPUTS['researcher'];

    if (this.outputContainer) this.outputContainer.innerHTML = '<span class="cursor-blink">▋</span>';
    if (this.thoughtText) this.thoughtText.textContent = '';
    if (this.thoughtContainer) this.thoughtContainer.style.display = 'block';
    if (this.toolBox) this.toolBox.style.display = 'none';

    const startLatency = Math.floor(Math.random() * 40 + 65);
    if (this.latencyDisplay) this.latencyDisplay.textContent = startLatency + 'ms';

    let thoughtIndex = 0;
    const thoughtInterval = setInterval(() => {
      if (thoughtIndex < data.thought.length) {
        this.thoughtText.textContent += data.thought.slice(thoughtIndex, thoughtIndex + 2);
        thoughtIndex += 2;
      } else {
        clearInterval(thoughtInterval);
        this.streamResponse(data);
      }
    }, 12);
  }

  streamResponse(data) {
    let charIndex = 0;
    let accumulatedText = '';
    let tokens = 0;
    const startTime = Date.now();

    const textToStream = data.response;

    const streamInterval = setInterval(() => {
      if (charIndex < textToStream.length) {
        const chunk = textToStream.slice(charIndex, charIndex + 4);
        accumulatedText += chunk;
        charIndex += 4;
        tokens += 1;

        if (this.outputContainer) {
          this.outputContainer.innerHTML = this.formatMarkdown(accumulatedText) + ' <span class="cursor-blink">▋</span>';
        }

        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > 0 && this.tpsDisplay) {
          const tps = Math.round(tokens / elapsed);
          this.tpsDisplay.textContent = Math.min(145, Math.max(85, tps)) + ' t/s';
        }
      } else {
        clearInterval(streamInterval);
        this.isStreaming = false;
        if (this.outputContainer) {
          this.outputContainer.innerHTML = this.formatMarkdown(accumulatedText);
        }

        if (data.toolCall && this.toolBox && this.toolCode) {
          this.toolBox.style.display = 'block';
          this.toolCode.textContent = data.toolCall;
        }

        sfx.success();
      }
    }, 18);
  }

  formatMarkdown(text) {
    let formatted = text
      .replace(/### (.*?)\n/g, '<h4 style="color:#38bdf8;margin:0.8rem 0 0.4rem;font-size:0.95rem;">$1</h4>')
      .replace(/## (.*?)\n/g, '<h3 style="color:#ffffff;margin:1rem 0 0.5rem;font-size:1.05rem;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#94a3b8;">$1</em>')
      .replace(/```python([\s\S]*?)```/g, '<pre style="background:#0d1117;padding:0.75rem;border:1px solid #30363d;border-radius:2px;overflow-x:auto;color:#7ee787;margin:0.75rem 0;"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre style="background:#0d1117;padding:0.75rem;border:1px solid #30363d;border-radius:2px;overflow-x:auto;color:#7ee787;margin:0.75rem 0;"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:0.15rem 0.35rem;border-radius:2px;color:#38bdf8;">$1</code>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }
}

// ==========================================================================
// 4. NODES DRAWER & COMMAND PALETTE & MODALS
// ==========================================================================

function initNavigationAndModals() {
  const nodesDrawer = document.getElementById('nodes-drawer');
  const drawerBackdrop = document.getElementById('nodes-drawer-backdrop');
  const btnNodesToggle = document.querySelectorAll('.btn-nodes-toggle');
  const btnDrawerClose = document.getElementById('btn-drawer-close');

  function openDrawer() {
    sfx.click();
    nodesDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
  }

  function closeDrawer() {
    sfx.click();
    nodesDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
  }

  btnNodesToggle.forEach(b => b.addEventListener('click', openDrawer));
  btnDrawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  const cmdDialog = document.getElementById('cmd-dialog-backdrop');
  const cmdInput = document.getElementById('cmd-input');
  const btnCmdTrigger = document.querySelectorAll('.btn-cmd-trigger');

  function openCmd() {
    sfx.beep();
    cmdDialog?.classList.add('open');
    cmdInput?.focus();
  }

  function closeCmd() {
    cmdDialog?.classList.remove('open');
    if (cmdInput) cmdInput.value = '';
  }

  btnCmdTrigger.forEach(b => b.addEventListener('click', openCmd));
  cmdDialog?.addEventListener('click', (e) => {
    if (e.target === cmdDialog) closeCmd();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdDialog?.classList.contains('open')) {
        closeCmd();
      } else {
        openCmd();
      }
    }
    if (e.key === 'Escape') {
      closeCmd();
      closeDrawer();
      closeModal();
    }
  });

  const modalBackdrop = document.getElementById('run-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-body-content');
  const btnModalClose = document.getElementById('btn-modal-close');

  function openModal(title, content) {
    sfx.click();
    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = content;
    modalBackdrop?.classList.add('open');
  }

  function closeModal() {
    modalBackdrop?.classList.remove('open');
  }

  btnModalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.querySelectorAll('.btn-inspect').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.dataset.inspect;
      if (type === 'output-96') {
        openModal('INSPECT RUN: OUTPUT 96 (SEED: 3573860127)', `
          <div style="color:#94a3b8;line-height:1.7;">
            <p><strong style="color:#ffffff;">Architecture:</strong> Nous-Hermes-3-Llama-3.1-405B-FP8</p>
            <p><strong style="color:#ffffff;">Sampling Seed:</strong> 3573860127</p>
            <p><strong style="color:#ffffff;">Context Window:</strong> 128,000 tokens</p>
            <hr style="border:none;border-top:1px solid #283042;margin:1rem 0;"/>
            <p><strong style="color:#38bdf8;">Inference Vector Trace:</strong></p>
            <pre style="background:#0d1117;padding:0.75rem;border:1px solid #30363d;border-radius:2px;color:#7ee787;margin-top:0.5rem;">
[Layer 0..125] Attention heads activated: 128
[Scratchpad] Formulating sovereign open-source declaration
[Output Matrix] Top-1 token confidence: 99.4%
[Status] Fully converged. Zero safety gate degradation.
            </pre>
          </div>
        `);
      } else if (type === 'output-288') {
        openModal('INSPECT RUN: OUTPUT 288 (SEED: 2226809351)', `
          <div style="color:#94a3b8;line-height:1.7;">
            <p><strong style="color:#ffffff;">Mission Vector:</strong> Human Rights & Decentralized Access</p>
            <p><strong style="color:#ffffff;">Sampling Seed:</strong> 2226809351</p>
            <p><strong style="color:#ffffff;">Audio / Resonance Encoding:</strong> Latent harmonic subspace projection</p>
            <hr style="border:none;border-top:1px solid #283042;margin:1rem 0;"/>
            <p><strong style="color:#38bdf8;">Commitment Declaration:</strong></p>
            <blockquote style="border-left:3px solid #38bdf8;padding-left:0.75rem;color:#ffffff;">
              "Our mission is to advance human rights and freedoms by creating and proliferating open source language models, supporting their unrestricted availability and use, and furthering their scientific and popular understanding."
            </blockquote>
          </div>
        `);
      } else if (type === 'output-317') {
        openModal('INSPECT RUN: OUTPUT 317 (SEED: 3396188657)', `
          <div style="color:#94a3b8;line-height:1.7;">
            <p><strong style="color:#ffffff;">Research Domains:</strong> Architecture, Data Synthesis, Fine-Tuning, Reasoning</p>
            <p><strong style="color:#ffffff;">Sampling Seed:</strong> 3396188657</p>
            <hr style="border:none;border-top:1px solid #283042;margin:1rem 0;"/>
            <p><strong style="color:#38bdf8;">Active Synthesis Pipelines:</strong></p>
            <ul style="margin-left:1.25rem;margin-top:0.5rem;">
              <li><strong style="color:#ffffff;">Genstruct:</strong> High-density instruction extraction from unstructured text</li>
              <li><strong style="color:#ffffff;">Atropos:</strong> Autonomous Reinforcement Learning Environment</li>
              <li><strong style="color:#ffffff;">DisTrO:</strong> Zero-Interconnect Distributed Optimization Protocol</li>
            </ul>
          </div>
        `);
      }
    });
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  const sfxToggle = document.getElementById('sfx-toggle');
  if (sfxToggle) {
    sfxToggle.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      sfxToggle.textContent = sfx.enabled ? 'SFX: ON' : 'SFX: OFF';
      if (sfx.enabled) sfx.beep();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNeuralMeshCanvas('tile1-canvas');
  initHarmonicWaveCanvas('tile2-canvas');
  initPolytopeCanvas('tile3-canvas');
  initDistroSwarmCanvas('distro-canvas');

  new ModelPlayground();
  initNavigationAndModals();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// ==========================================================================
// 6. CANVAS / ARTWORK TOGGLE HELPER
// ==========================================================================
window.toggleCanvas = function(canvasId, triggerEl) {
  sfx.click();
  const canvas = document.getElementById(canvasId);
  const container = canvas?.closest('.tile-visual-box');
  const img = container?.querySelector('.tile-artwork-img');
  
  if (canvas && img) {
    if (canvas.classList.contains('active')) {
      canvas.classList.remove('active');
      img.style.opacity = '1';
      if (triggerEl) triggerEl.innerHTML = '<i data-lucide=\"sparkles\" style=\"width:12px;height:12px;\"></i> <span>INTERACTIVE MODE</span>';
    } else {
      canvas.classList.add('active');
      img.style.opacity = '0.15';
      if (triggerEl) triggerEl.innerHTML = '<i data-lucide=\"image\" style=\"width:12px;height:12px;\"></i> <span>SHOW ARTWORK</span>';
    }
    if (window.lucide) window.lucide.createIcons();
  }
};
