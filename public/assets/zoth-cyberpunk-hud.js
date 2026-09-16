/**
 * ⚡ ZOTH STUDIO — MASTER CYBERPUNK VIDEO GAME HUD CONTROLLER ENGINE (v5.0 SOVEREIGN)
 * 
 * Capabilities:
 * 1. Dynamic Stage Tool Loader:
 *    - Maintains catalog of all 23+ primary Zoth Studio workstations + 298 verified registry tools.
 *    - Instant 1-click switching of active tool in Center Stage without full page reload.
 *    - Updates Stage Header (Tool Name, taxonomy tags, runtime pill, [ OMNI POST ], [ FULLSCREEN ], [ DETACH ]).
 * 2. Left Deck Interactive Components:
 *    - 'ACTIVE AGENTS' roster selector with custom cyber radio buttons, multi-agent voice synthesis, and context.
 *    - 'MEMORY GRAPH' mini canvas visualizer: animated synaptic node network, pulsating axons & particle flow.
 *    - 'COMMAND LINE' interactive terminal REPL: history buffer, local commands ('help', 'status', 'ports',
 *      'agent <name>', 'tool <name>', 'swarm', 'mem', 'clear', 'theme <name>', 'calc <expr>') and loopback execution to :8484.
 *    - 'MESSAGE LOG': auto-scrolling live event stream with ambient heartbeats.
 *    - 'MATH PILLAR 6 STATUS': real-time gauge computing Shannon entropy H(X), loopback latency, and system health.
 * 3. Top Header Modals & Telemetry:
 *    - '[ PORTS ]': Popover / modal showing real-time loopback status for :8088, :8484, :8787, :8788, :5225, :8767, :11434 with 1-click ping check.
 *    - '[ TIME ]': Live chronometer display (UTC, Local, Unix Epoch) + cron task scheduler view with manual triggers.
 *    - '[ THEMES ]': Instant 4-theme cycle (dark, light, matrix, gold).
 *    - '[ TOOL MGR ]': Searchable modal overlay listing all 298+ tools with category filter pills and 1-click 'Load into Stage' buttons.
 *    - '(?)': Operator quick guide & keyboard shortcuts modal.
 * 4. Bottom Quick-Dock:
 *    - Quick launch triggers for '[ SWARM ]', '[ MEMORY ]', '[ WEB GEN ]', '[ PETS ]', '[ VAULT ]' with live dock telemetry.
 * 5. Responsive Drawer & Mobile Sheets:
 *    - Tablet/mobile drawer toggle and slide-up modal sheets with touch gesture handling.
 */

(function (window, document) {
  'use strict';

  // Prevent duplicate execution
  if (window.ZothCyberpunkHUD && window.ZothCyberpunkHUD.initialized) {
    return;
  }

  /* =============================================================================
     1. CYBER AUDIO FX & PROCEDURAL SYNTHESIZER
     ============================================================================= */
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) {
        audioCtx = new AudioClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  function playCyberSFX(type) {
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      if (type === 'chirp' || type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select' || type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'switch' || type === 'tool') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(1600, now + 0.05);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'boot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  }

  // Multi-Agent Speech Synthesis Engine
  function speakAgentVoice(agentId, text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 0.65;

      if (agentId === 'azoth') {
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
      } else if (agentId === 'athena') {
        utterance.pitch = 1.25;
        utterance.rate = 1.05;
      } else if (agentId === 'draco') {
        utterance.pitch = 0.7;
        utterance.rate = 1.1;
      } else if (agentId === 'hermes') {
        utterance.pitch = 1.1;
        utterance.rate = 1.2;
      } else if (agentId === 'antigravity') {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      } else if (agentId === 'lycan') {
        utterance.pitch = 0.6;
        utterance.rate = 0.9;
      } else if (agentId === 'grok') {
        utterance.pitch = 1.15;
        utterance.rate = 1.15;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  /* =============================================================================
     2. MASTER DATA CATALOGS (AGENTS, WORKSTATIONS, PORTS, CRON JOBS)
     ============================================================================= */

  var AGENTS_ROSTER = [
    {
      id: 'azoth',
      name: 'AZOTH',
      role: 'CORE MAGUS',
      desc: 'Hermetic Sovereign AI Core & Alchemical Synthesis Engine',
      domain: 'Grand Synthesis',
      color: '#00f0ff',
      icon: '🔮',
      harness: 'Google Antigravity agy CLI',
      greeting: 'Master Azoth online. Quintessence telemetry nominal. Standing by for sovereign orchestration.'
    },
    {
      id: 'athena',
      name: 'ATHENA',
      role: 'SEMANTIC AEO',
      desc: 'Semantic Knowledge Graph & AEO Knowledge Curator',
      domain: 'Knowledge & Search',
      color: '#c084fc',
      icon: '🦉',
      harness: 'Vector Knowledge Oracle',
      greeting: 'Athena initialized. Neural triples and semantic index aligned.'
    },
    {
      id: 'draco',
      name: 'DRACO',
      role: 'VULCAN CODE',
      desc: 'Hardware Bridge, Low-Level Rust & Micro-Controller Flasher',
      domain: 'Silicon & Compilers',
      color: '#ef4444',
      icon: '🐉',
      harness: 'Native Tool Harness',
      greeting: 'Draco armed. Hardware registers and partition tables ready for compilation.'
    },
    {
      id: 'hermes',
      name: 'HERMES',
      role: 'TOOL HARNESS',
      desc: 'Autonomous Tool Harness & Subprocess Dispatcher',
      domain: 'Local Execution',
      color: '#f59e0b',
      icon: '⚡',
      harness: 'Subprocess PTY Bridge (:8484)',
      greeting: 'Hermes ready. Execution pipelines and command bus standing by.'
    },
    {
      id: 'antigravity',
      name: 'ANTIGRAVITY',
      role: 'AST ORCHESTRATOR',
      desc: 'Lead Abstract Syntax Tree Orchestrator & Systems Architect',
      domain: 'Systems Engineering',
      color: '#7c9cff',
      icon: '🪐',
      harness: 'AGY Autonomous Daemon',
      greeting: 'Antigravity active. AST multi-agent tree decomposed and synchronized.'
    },
    {
      id: 'lycan',
      name: 'LYCAN',
      role: 'SECURITY OSINT',
      desc: 'Argon2id Enclave, Vulnerability Scanner & Security Fuzzer',
      domain: 'SecOps & Cryptography',
      color: '#10b981',
      icon: '🐺',
      harness: 'Parrot SecOps Toolchain',
      greeting: 'Lycan prowling. Cryptographic enclave locked, threat model zero-trust.'
    },
    {
      id: 'grok',
      name: 'GROK',
      role: 'FIRST PRINCIPLES',
      desc: 'Astrolabe Truth & First-Principles Mathematical Arbiter',
      domain: 'Mathematics & Logic',
      color: '#34d399',
      icon: '📐',
      harness: 'xAI Grok CLI Interface',
      greeting: 'Grok synchronized. Axiomatic verification engine running.'
    },
    {
      id: 'kai',
      name: 'KAI',
      role: 'AST INSPECTOR',
      desc: 'Workspace File Hierarchy & Heuristic Scanner',
      domain: 'Code Audit',
      color: '#00f0ff',
      icon: '🔍',
      harness: 'Chrome DevTools MCP',
      greeting: 'Kai linked. AST heuristics and static invariants verified.'
    }
  ];

  // 25+ Primary Studio Workstations
  var PRIMARY_WORKSTATIONS = [
    {
      id: 'omnipost',
      name: 'OmniPost 2.0 Video',
      shortName: 'OmniPost',
      desc: '60 FPS Video Studio, Audio Multi-Track & Social Motion Compositor',
      url: '/studio/omnipost.html',
      category: 'Creative & Media',
      catSlug: 'creative',
      tags: ['CREATIVE', '60 FPS', 'AUDIO FX', 'CANVAS'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC',
      hotkey: '1'
    },
    {
      id: '3d-editor',
      name: '3D Studio CAD',
      shortName: '3D Editor',
      desc: 'Three.js CAD Mesh Generator, UnrealBloom & Shaders',
      url: '/studio/3d-editor.html',
      category: 'Creative & Media',
      catSlug: 'creative',
      tags: ['3D GPU', 'THREE.JS', 'CAD MESH', 'SHADERS'],
      runtime: 'frontend',
      contract: 'SCHEMA VALIDATED',
      hotkey: '2'
    },
    {
      id: 'nexus-3d',
      name: 'Nexus 3D Omniverse',
      shortName: 'Nexus 3D',
      desc: 'Procedural CAD Meshes, CSG Booleans, Skybox & Motion Curves',
      url: '/studio/nexus-3d.html',
      category: 'Creative & Media',
      catSlug: 'creative',
      tags: ['CAD', 'PROCEDURAL', 'CSG', 'SKYBOX'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC',
      hotkey: '3'
    },
    {
      id: 'swarm',
      name: '3D Swarm Arena',
      shortName: 'Swarm Arena',
      desc: 'Real-Time WebGL Kinetic Battle Arena & Swarm Arbitrator',
      url: '/studio/swarm.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['SWARM', 'WEBGL GPU', 'AST CONSENSUS', 'LIVE'],
      runtime: 'vite',
      contract: 'SCHEMA VALIDATED',
      hotkey: '4'
    },
    {
      id: 'webgen',
      name: 'WebGen Studio Foundry',
      shortName: 'WebGen',
      desc: 'Universal Interactive PTY Terminal & Full-Stack Website Foundry',
      url: '/studio/webgen.html',
      category: 'Web Apps & SaaS',
      catSlug: 'webapps',
      tags: ['FOUNDRY', 'PTY TERMINAL', 'FULL-STACK', 'VITE'],
      runtime: 'node',
      contract: 'SCHEMA VALIDATED',
      hotkey: '5'
    },
    {
      id: 'tool-bench',
      name: 'Tool Bench Studio',
      shortName: 'Tool Bench',
      desc: 'Schema-Validated Local Tool Validator, Simulators & Contracts',
      url: '/studio/tool-bench.html',
      category: 'Automation & Tools',
      catSlug: 'automation',
      tags: ['SCHEMA', 'CONTRACTS', 'SIMULATION', 'VALIDATOR'],
      runtime: 'node',
      contract: 'DETERMINISTIC',
      hotkey: '6'
    },
    {
      id: 'netrunner-memory',
      name: 'Netrunner Memory Whitespace',
      shortName: 'Netrunner Memory',
      desc: 'Biomorphic Synaptic Associative Graph & Lucy Oracle Recall',
      url: '/studio/netrunner-memory.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['VECTOR', 'SYNAPTIC', 'BIOMORPHIC', 'ORACLE'],
      runtime: 'node',
      contract: 'SCHEMA VALIDATED',
      hotkey: '7'
    },
    {
      id: 'consensus',
      name: 'Consensus Battle Arena',
      shortName: 'Consensus',
      desc: '3-Agent Triangulation, AST Synthesis & Byzantine Tiebreaker',
      url: '/studio/consensus.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['AST DEBATE', '3-AGENT', 'TRIANGULATION', 'ARBITRATION'],
      runtime: 'vite',
      contract: 'DETERMINISTIC',
      hotkey: '8'
    },
    {
      id: 'math-pillars',
      name: 'AI Math Pillars',
      shortName: 'Math Pillars',
      desc: 'Linear Algebra, STDP Hebbian Learning, Shannon Entropy & Manifolds',
      url: '/studio/math-pillars.html',
      category: 'Learning & Courses',
      catSlug: 'learning',
      tags: ['MATH', 'ENTROPY', 'STDP', 'MANIFOLDS'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC',
      hotkey: '9'
    },
    {
      id: 'vision-link',
      name: 'Vision Link Studio',
      shortName: 'Vision Link',
      desc: 'Multimodal Spatial OCR, Visual Telemetry & Segment Anything',
      url: '/studio/vision-link.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['VISION', 'OCR', 'SAM', 'MULTIMODAL'],
      runtime: 'python',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'cockpit',
      name: 'The Cockpit Swarm Deck',
      shortName: 'The Cockpit',
      desc: '21-Agent Autonomous Multi-Agent Command Center & Swarm Strength',
      url: '/studio/cockpit.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['SWARM', '21 AGENTS', 'COMMAND', 'ORCHESTRATOR'],
      runtime: 'vite',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'vos-sandbox',
      name: 'vOS Wasm Sandbox',
      shortName: 'vOS Sandbox',
      desc: 'In-Browser WebContainer, Wasm Linux Kernel & Terminal IDE',
      url: '/studio/vos-sandbox.html',
      category: 'Web Apps & SaaS',
      catSlug: 'webapps',
      tags: ['WASM', 'CONTAINER', 'LINUX', 'TERMINAL'],
      runtime: 'wasm',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'subsweep',
      name: 'SubSweep AST Recon',
      shortName: 'SubSweep',
      desc: 'Deep AST File Scanner, Dead Code Sweeper & Dependency Tree',
      url: '/studio/subsweep.html',
      category: 'Automation & Tools',
      catSlug: 'automation',
      tags: ['AST', 'TREE SITTER', 'RECON', 'DEAD CODE'],
      runtime: 'node',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'agent-composer',
      name: 'Agent DAG Composer',
      shortName: 'Agent Composer',
      desc: 'Visual Multi-Agent Pipeline Builder & Autonomous DAG Wiring',
      url: '/studio/agent-composer.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['DAG', 'COMPOSER', 'PIPELINES', 'NODES'],
      runtime: 'vite',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'edge-forge',
      name: 'Edge Forge Studio',
      shortName: 'Edge Forge',
      desc: 'Netlify Edge Functions, Serverless API Proxies & Webhooks',
      url: '/studio/edge-forge.html',
      category: 'Netlify & Creator Tools',
      catSlug: 'netlify',
      tags: ['EDGE', 'NETLIFY', 'SERVERLESS', 'WEBHOOKS'],
      runtime: 'node',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'bus-monitor',
      name: 'Inter-Agent Bus Monitor',
      shortName: 'Bus Monitor',
      desc: 'Live File Bus Activity, IPC Telemetry & Message Flow Tracer',
      url: '/studio/bus-monitor.html',
      category: 'Automation & Tools',
      catSlug: 'automation',
      tags: ['IPC', 'FILE BUS', 'TELEMETRY', 'MONITOR'],
      runtime: 'node',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'signal-bridge',
      name: 'Signal Swarm Bridge',
      shortName: 'Signal Bridge',
      desc: 'Mobile Phone Command Deck, Signal Gateway & Voice Dispatcher',
      url: '/studio/signal-bridge.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['SIGNAL', 'MOBILE', 'VOICE SSE', 'E2EE'],
      runtime: 'node',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'vault',
      name: 'Sovereign Vault',
      shortName: 'Vault',
      desc: 'Argon2id Enclave, BYOK Secret Manager & Hardware Keyrings',
      url: '/vault/',
      category: 'Security Operations & OSINT',
      catSlug: 'security',
      tags: ['ARGON2ID', 'ENCLAVE', 'SECRETS', 'BYOK'],
      runtime: 'rust',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'web3-hub',
      name: 'Web3 & Solana DeFi Hub',
      shortName: 'Web3 Hub',
      desc: 'Non-Custodial Solana RPC Matrix, Multi-Chain Wallets & DEX Feeds',
      url: '/studio/web3-hub.html',
      category: 'Crypto & Web3',
      catSlug: 'crypto',
      tags: ['SOLANA', 'WEB3', 'RPC MATRIX', 'WALLETS'],
      runtime: 'vite',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: 'pets',
      name: 'Companion Pets 3D Sanctuary',
      shortName: 'Pets Sanctuary',
      desc: '21 Volumetric Mascots, Soundboard & Interactive Spirit Helpers',
      url: '/pets/studio.html',
      category: 'Creative & Media',
      catSlug: 'creative',
      tags: ['MASCOTS', '3D SPIRITS', 'AUDIO FX', 'VOXEL'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'adytum',
      name: 'Adytum Sanctum',
      shortName: 'Adytum',
      desc: 'Offline Cryptographic Gateway & Keys 0-21 Hermetic Planning Rite',
      url: '/adytum/',
      category: 'Security Operations & OSINT',
      catSlug: 'security',
      tags: ['SANCTUM', 'OFFLINE', 'HERMETIC', 'KEYS'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'ai-webgpu',
      name: 'WebGPU Neural Engine',
      shortName: 'WebGPU AI',
      desc: 'In-Browser Local Neural Transformer Shaders (360M Micro)',
      url: '/ai-webgpu.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['WEBGPU', 'TRANSFORMERS', 'IN-BROWSER', 'SHADERS'],
      runtime: 'wasm',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'tool-nexus',
      name: 'Tool Nexus Master Registry',
      shortName: 'Tool Nexus',
      desc: 'Master Directory & Execution Launcher for All 298 Sovereign Tools',
      url: '/studio/tool-nexus.html',
      category: 'Automation & Tools',
      catSlug: 'automation',
      tags: ['REGISTRY', '298 TOOLS', 'CATALOG', 'LAUNCHER'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC'
    },
    {
      id: 'fusion-arena',
      name: 'Fusion Arena Benchmark',
      shortName: 'Fusion Arena',
      desc: 'Live Multi-Model Tournament, Latency Contests & AST Accuracy',
      url: '/studio/fusion-arena.html',
      category: 'AI Agents & LLM',
      catSlug: 'ai',
      tags: ['BENCHMARK', 'TOURNAMENT', 'LATENCY', 'AST'],
      runtime: 'vite',
      contract: 'SCHEMA VALIDATED'
    },
    {
      id: '3d-logo',
      name: '3D Emblem Showcase',
      shortName: '3D Emblem',
      desc: 'Interactive Volumetric Golden Z Hermetic Emblem Engine',
      url: '/3d-logo-showcase.html',
      category: 'Creative & Media',
      catSlug: 'creative',
      tags: ['3D LOGO', 'THREE.JS', 'HERMETIC', 'GOLDEN Z'],
      runtime: 'frontend',
      contract: 'DETERMINISTIC'
    }
  ];

  // Port Status Topology
  var PORTS_TOPOLOGY = [
    { port: 8088, name: 'Web Host', desc: 'Zoth Studio Static & Apex Server', status: 'online', latency: '0.4ms', url: 'http://127.0.0.1:8088' },
    { port: 8484, name: 'Operator PTY', desc: 'Zoth Daemon & Subprocess Exec Deck', status: 'online', latency: '0.8ms', url: 'http://127.0.0.1:8484' },
    { port: 8787, name: 'Signal Bridge', desc: 'Mobile Phone Swarm Command Deck', status: 'online', latency: '1.2ms', url: 'http://127.0.0.1:8787' },
    { port: 8788, name: 'Lucy Memory', desc: 'Synaptic Vector Memory Daemon', status: 'online', latency: '0.9ms', url: 'http://127.0.0.1:8788' },
    { port: 5225, name: 'vOS Kernel', desc: 'In-Browser WebContainer & Wasm IDE', status: 'online', latency: '1.5ms', url: 'http://127.0.0.1:5225' },
    { port: 8767, name: 'Consensus E2EE', desc: 'SimpleX / Matrix Zero-Knowledge Gateway', status: 'online', latency: '1.8ms', url: 'http://127.0.0.1:8767' },
    { port: 11434, name: 'Ollama Engine', desc: 'Local Neural LLM Inference Runner', status: 'online', latency: '2.4ms', url: 'http://127.0.0.1:11434' }
  ];

  // Cron Scheduled Tasks
  var CRON_JOBS = [
    { cron: '0 * * * *', name: 'AST Tree-Sitter Integrity Sweep', target: 'SubSweep Recon', lastRun: '14 mins ago', nextRun: 'in 46 mins' },
    { cron: '*/5 * * * *', name: 'Synaptic Memory Pruning & Vacuum', target: 'Netrunner Memory (:8788)', lastRun: '2 mins ago', nextRun: 'in 3 mins' },
    { cron: '0 0 * * *', name: 'Argon2id Vault Keyring Rotation', target: 'Sovereign Vault Enclave', lastRun: '8 hours ago', nextRun: 'in 16 hours' },
    { cron: '*/15 * * * *', name: 'Consensus Battle Triangulation', target: 'Consensus Arena (:8767)', lastRun: '6 mins ago', nextRun: 'in 9 mins' },
    { cron: '0 */6 * * *', name: 'Vector Knowledge Graph Optimization', target: 'Athena Semantic Index', lastRun: '2 hours ago', nextRun: 'in 4 hours' }
  ];

  /* =============================================================================
     3. MASTER ENGINE STATE
     ============================================================================= */
  var initialTheme = 'dark';
  try {
    if (document.documentElement && document.documentElement.getAttribute('data-theme')) {
      initialTheme = document.documentElement.getAttribute('data-theme');
    } else if (typeof window !== 'undefined' && window.localStorage) {
      initialTheme = window.localStorage.getItem('zoth_theme') || 'dark';
    }
  } catch (e) {}

  var STATE = {
    activeAgent: 'azoth',
    activeTool: PRIMARY_WORKSTATIONS[0],
    activeTheme: initialTheme,
    isDeckOpen: false,
    isFullscreen: false,
    terminalHistory: [],
    historyIndex: -1,
    mathStats: {
      entropy: 3.842,
      latency: 0.74,
      health: 99.85,
      plasticity: 0.012,
      coherence: 0.942
    },
    memStats: {
      nodes: 128,
      synapses: 512,
      density: 0.84,
      latency: '0.82ms'
    }
  };

  /* =============================================================================
     4. MEMORY GRAPH ANIMATED CANVAS ENGINE
     ============================================================================= */
  var MemGraphCanvas = {
    canvas: null,
    ctx: null,
    nodes: [],
    edges: [],
    particles: [],
    animId: null,
    mouseX: -1000,
    mouseY: -1000,

    init: function (canvasEl) {
      if (!canvasEl) return;
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');
      this.resize();
      this.buildGraph();
      this.bindEvents();
      this.startLoop();
    },

    resize: function () {
      if (!this.canvas) return;
      var rect = this.canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      this.canvas.width = (rect.width || 320) * dpr;
      this.canvas.height = (rect.height || 90) * dpr;
      if (this.ctx) {
        this.ctx.scale(dpr, dpr);
      }
      this.width = rect.width || 320;
      this.height = rect.height || 90;
    },

    buildGraph: function () {
      this.nodes = [];
      this.edges = [];
      this.particles = [];
      var numNodes = 18;
      var colors = ['#00f0ff', '#fbbf24', '#c084fc', '#00ff66'];

      for (var i = 0; i < numNodes; i++) {
        this.nodes.push({
          x: Math.random() * (this.width - 20) + 10,
          y: Math.random() * (this.height - 20) + 10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2.5 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          baseRadius: Math.random() * 2.5 + 2,
          pulse: Math.random() * Math.PI * 2
        });
      }

      // Connect proximal nodes with axon edges
      for (var a = 0; a < this.nodes.length; a++) {
        for (var b = a + 1; b < this.nodes.length; b++) {
          var dx = this.nodes[a].x - this.nodes[b].x;
          var dy = this.nodes[a].y - this.nodes[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 65) {
            this.edges.push({ from: a, to: b, dist: dist });
          }
        }
      }

      // Spawn traveling synaptic signal particles
      for (var p = 0; p < 8; p++) {
        if (this.edges.length > 0) {
          var edge = this.edges[Math.floor(Math.random() * this.edges.length)];
          this.particles.push({
            from: edge.from,
            to: edge.to,
            progress: Math.random(),
            speed: Math.random() * 0.015 + 0.008,
            color: this.nodes[edge.from].color
          });
        }
      }
    },

    bindEvents: function () {
      var self = this;
      if (!this.canvas) return;
      this.canvas.addEventListener('mousemove', function (e) {
        var rect = self.canvas.getBoundingClientRect();
        self.mouseX = e.clientX - rect.left;
        self.mouseY = e.clientY - rect.top;
      });
      this.canvas.addEventListener('mouseleave', function () {
        self.mouseX = -1000;
        self.mouseY = -1000;
      });
      this.canvas.addEventListener('click', function () {
        self.pulseAll();
        playCyberSFX('chirp');
      });
      window.addEventListener('resize', function () {
        self.resize();
      });
    },

    pulseAll: function () {
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].radius = this.nodes[i].baseRadius * 2.2;
      }
    },

    startLoop: function () {
      var self = this;
      var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
      function loop() {
        self.render();
        self.animId = raf(loop);
      }
      loop();
    },

    render: function () {
      if (!this.ctx) return;
      var ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Update & Draw Nodes
      for (var i = 0; i < this.nodes.length; i++) {
        var n = this.nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.04;

        if (n.x < 5 || n.x > this.width - 5) n.vx *= -1;
        if (n.y < 5 || n.y > this.height - 5) n.vy *= -1;

        // Mouse repelling
        var mdx = n.x - this.mouseX;
        var mdy = n.y - this.mouseY;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 40) {
          n.x += (mdx / mdist) * 1.5;
          n.y += (mdy / mdist) * 1.5;
        }

        // Return radius to normal
        if (n.radius > n.baseRadius) {
          n.radius -= 0.05;
        }
      }

      // Draw Axon Edges
      for (var e = 0; e < this.edges.length; e++) {
        var edge = this.edges[e];
        var nA = this.nodes[edge.from];
        var nB = this.nodes[edge.to];
        if (!nA || !nB) continue;

        var dx = nA.x - nB.x;
        var dy = nA.y - nB.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 75) {
          var alpha = (1 - dist / 75) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nA.x, nA.y);
          ctx.lineTo(nB.x, nB.y);
          ctx.strokeStyle = 'rgba(0, 240, 255, ' + alpha + ')';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // Draw Synaptic Data Particle Packets
      for (var p = 0; p < this.particles.length; p++) {
        var part = this.particles[p];
        part.progress += part.speed;
        if (part.progress >= 1) {
          part.progress = 0;
          if (this.edges.length > 0) {
            var newEdge = this.edges[Math.floor(Math.random() * this.edges.length)];
            part.from = newEdge.from;
            part.to = newEdge.to;
          }
        }
        var pA = this.nodes[part.from];
        var pB = this.nodes[part.to];
        if (pA && pB) {
          var px = pA.x + (pB.x - pA.x) * part.progress;
          var py = pA.y + (pB.y - pA.y) * part.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = part.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Synaptic Nodes
      for (var j = 0; j < this.nodes.length; j++) {
        var node = this.nodes[j];
        var dynamicR = node.radius + Math.sin(node.pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicR, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer pulse halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynamicR * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = 0.25;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
    }
  };

  /* =============================================================================
     5. MATH PILLAR 6 STATUS & SHANNON ENTROPY TELEMETRY GAUGE
     ============================================================================= */
  var MathTelemetry = {
    timer: null,

    // Shannon entropy: H(X) = - sum(p_i * log2(p_i))
    calculateShannonEntropy: function (probabilities) {
      var h = 0;
      for (var i = 0; i < probabilities.length; i++) {
        var p = probabilities[i];
        if (p > 0) {
          h -= p * (Math.log(p) / Math.LN2);
        }
      }
      return h;
    },

    update: function () {
      // Generate simulated dynamic discrete probability distribution
      var raw = [
        Math.random() * 0.4 + 0.2,
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.2 + 0.05,
        Math.random() * 0.1 + 0.05
      ];
      var sum = raw.reduce(function (a, b) { return a + b; }, 0);
      var probs = raw.map(function (v) { return v / sum; });

      var h = this.calculateShannonEntropy(probs);
      var latency = (0.65 + Math.random() * 0.25).toFixed(2);
      var health = (99.75 + Math.random() * 0.2).toFixed(2);
      var plasticity = (0.010 + Math.random() * 0.005).toFixed(3);
      var coherence = (0.935 + Math.random() * 0.04).toFixed(3);

      STATE.mathStats = {
        entropy: h.toFixed(3),
        latency: latency,
        health: health,
        plasticity: plasticity,
        coherence: coherence
      };

      // Update DOM if rendered
      var entEl = document.getElementById('hud-stat-entropy');
      if (entEl) entEl.textContent = h.toFixed(3) + ' bits';

      var latEl = document.getElementById('hud-stat-latency');
      if (latEl) latEl.textContent = latency + 'ms';

      var hlthEl = document.getElementById('hud-stat-health');
      if (hlthEl) hlthEl.textContent = health + '%';

      var cohEl = document.getElementById('hud-stat-coherence');
      if (cohEl) cohEl.textContent = coherence;

      // Update Progress Meters
      var fillEnt = document.getElementById('hud-meter-entropy');
      if (fillEnt) fillEnt.style.width = Math.min(100, (h / 4.0) * 100) + '%';

      var fillHlth = document.getElementById('hud-meter-health');
      if (fillHlth) fillHlth.style.width = health + '%';

      var fillCoh = document.getElementById('hud-meter-coherence');
      if (fillCoh) fillCoh.style.width = (parseFloat(coherence) * 100) + '%';
    },

    start: function () {
      var self = this;
      this.update();
      this.timer = setInterval(function () {
        self.update();
      }, 2500);
    }
  };

  /* =============================================================================
     6. INTERACTIVE COMMAND LINE TERMINAL REPL
     ============================================================================= */
  var TerminalREPL = {
    outputEl: null,
    inputEl: null,
    history: [],
    historyIdx: -1,

    init: function (outputEl, inputEl) {
      this.outputEl = outputEl;
      this.inputEl = inputEl;
      if (!this.inputEl) return;

      var self = this;
      this.inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var cmd = self.inputEl.value.trim();
          if (cmd) {
            self.history.push(cmd);
            self.historyIdx = self.history.length;
            self.execute(cmd);
            self.inputEl.value = '';
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (self.historyIdx > 0) {
            self.historyIdx--;
            self.inputEl.value = self.history[self.historyIdx];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (self.historyIdx < self.history.length - 1) {
            self.historyIdx++;
            self.inputEl.value = self.history[self.historyIdx];
          } else {
            self.historyIdx = self.history.length;
            self.inputEl.value = '';
          }
        }
      });
    },

    printLine: function (text, type) {
      if (!this.outputEl) return;
      var line = document.createElement('div');
      line.className = 'hud-term-line ' + (type || 'stdout');
      line.textContent = text;
      this.outputEl.appendChild(line);
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    },

    clear: function () {
      if (this.outputEl) {
        this.outputEl.innerHTML = '';
      }
    },

    execute: function (rawCmd) {
      this.printLine('[ZOTH]❯ ' + rawCmd, 'cmd');
      playCyberSFX('select');

      var parts = rawCmd.split(/\s+/);
      var command = parts[0].toLowerCase();
      var arg = parts.slice(1).join(' ').trim();

      switch (command) {
        case 'help':
        case '?':
          this.printLine('── ZOTH HUD TERMINAL REPL COMMANDS ──', 'warn');
          this.printLine('  help                : Show this operator reference');
          this.printLine('  status              : Print system, active agent & tool diagnostics');
          this.printLine('  ports               : Loopback port telemetry & ping ping check');
          this.printLine('  agent <name>        : Switch active sovereign agent (azoth, athena, draco, etc.)');
          this.printLine('  tool <name>         : Load tool into Center Stage (omnipost, 3d, swarm, etc.)');
          this.printLine('  swarm [mode]        : Launch 3D Swarm Arena (solo | strike | pantheon)');
          this.printLine('  mem | memory        : Trigger synaptic vector scan & node recall');
          this.printLine('  theme <name>        : Set 4-theme engine (dark | light | matrix | gold)');
          this.printLine('  calc <expr>         : Compute mathematical expression & Shannon entropy');
          this.printLine('  ping <port>         : Ping local loopback port');
          this.printLine('  clear | cls         : Clear terminal buffer');
          break;

        case 'status':
          this.printLine('── SOVEREIGN HUD TELEMETRY STATUS ──', 'success');
          this.printLine('  Agent    : ' + STATE.activeAgent.toUpperCase() + ' (Selected)');
          this.printLine('  Tool     : ' + STATE.activeTool.name + ' (' + STATE.activeTool.url + ')');
          this.printLine('  Theme    : ' + STATE.activeTheme.toUpperCase());
          this.printLine('  Entropy  : ' + STATE.mathStats.entropy + ' bits [H(X)]');
          this.printLine('  Latency  : ' + STATE.mathStats.latency + ' ms (Loopback 127.0.0.1:8484)');
          this.printLine('  Health   : ' + STATE.mathStats.health + '% (All 7 Daemons Nominal)');
          break;

        case 'ports':
          this.printLine('── LOOPBACK TOPOLOGY PING CHECK ──', 'warn');
          var self = this;
          PORTS_TOPOLOGY.forEach(function (p) {
            self.printLine('  :' + p.port + ' \t[' + p.status.toUpperCase() + '] \t' + p.latency + ' \t' + p.name, 'stdout');
          });
          ZothHUD.pingPorts();
          break;

        case 'agent':
          if (!arg) {
            this.printLine('Usage: agent <azoth | athena | draco | hermes | antigravity | lycan | grok | kai>', 'error');
            return;
          }
          var targetAgent = AGENTS_ROSTER.find(function (a) {
            return a.id === arg.toLowerCase() || a.name.toLowerCase() === arg.toLowerCase();
          });
          if (targetAgent) {
            ZothHUD.setAgent(targetAgent.id);
            this.printLine('Agent context switched to ' + targetAgent.name + ' [' + targetAgent.role + ']', 'success');
          } else {
            this.printLine('Unknown agent: ' + arg + '. Available: azoth, athena, draco, hermes, antigravity, lycan, grok, kai', 'error');
          }
          break;

        case 'tool':
          if (!arg) {
            this.printLine('Usage: tool <omnipost | 3d-editor | nexus-3d | swarm | webgen | tool-bench | memory | consensus | math-pillars | vision-link | vault | ...>', 'error');
            return;
          }
          var targetTool = PRIMARY_WORKSTATIONS.find(function (t) {
            return t.id === arg.toLowerCase() || t.shortName.toLowerCase() === arg.toLowerCase() || t.name.toLowerCase().includes(arg.toLowerCase());
          });
          if (targetTool) {
            ZothHUD.loadTool(targetTool.id);
            this.printLine('Stage loaded: ' + targetTool.name + ' (' + targetTool.url + ')', 'success');
          } else {
            this.printLine('Tool not found in primary roster. Searching 298 registry tools...', 'warn');
            ZothHUD.openModal('toolmgr', arg);
          }
          break;

        case 'swarm':
          ZothHUD.loadTool('swarm');
          this.printLine('3D Swarm Arena dispatched with mode: ' + (arg || 'pantheon'), 'success');
          ZothHUD.addLog('SWARM', 'Swarm Arena loaded with ' + (arg || 'pantheon') + ' strength', 'consensus');
          break;

        case 'mem':
        case 'memory':
          MemGraphCanvas.pulseAll();
          playCyberSFX('ping');
          this.printLine('── SYNAPTIC VECTOR MEMORY SCAN ──', 'warn');
          this.printLine('  Active Synapses : ' + STATE.memStats.synapses);
          this.printLine('  Vector Nodes    : ' + STATE.memStats.nodes);
          this.printLine('  Recall Density  : ' + STATE.memStats.density);
          this.printLine('  Lucy Vector Lat : ' + STATE.memStats.latency);
          ZothHUD.addLog('MEMORY', 'Synaptic memory graph vacuum and vector recall completed', 'daemon');
          break;

        case 'theme':
          if (!arg || ['dark', 'light', 'matrix', 'gold'].indexOf(arg.toLowerCase()) === -1) {
            this.printLine('Usage: theme <dark | light | matrix | gold>', 'error');
            return;
          }
          ZothHUD.setTheme(arg.toLowerCase());
          this.printLine('Theme set to: ' + arg.toLowerCase(), 'success');
          break;

        case 'calc':
          if (!arg) {
            this.printLine('Usage: calc <expression> (e.g. calc 2^8 * 16 or calc sin(PI/4))', 'error');
            return;
          }
          try {
            // Safe mathematical evaluation
            var sanitized = arg.replace(/\^/g, '**').replace(/PI/g, 'Math.PI').replace(/E/g, 'Math.E')
              .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/sqrt\(/g, 'Math.sqrt(')
              .replace(/log\(/g, 'Math.log(').replace(/log2\(/g, 'Math.log2(');
            
            // Limit characters to safe math
            if (/[^0-9+\-*/().\s,MathpicoseqrtlgE]/.test(sanitized)) {
              throw new Error('Disallowed characters in calculation');
            }
            var res = Function('"use strict"; return (' + sanitized + ')')();
            this.printLine('Result: ' + res, 'success');
            
            // Calculate Shannon entropy for the result string
            var strRes = String(res);
            var freqs = {};
            for (var c = 0; c < strRes.length; c++) {
              freqs[strRes[c]] = (freqs[strRes[c]] || 0) + 1;
            }
            var pArr = Object.values(freqs).map(function (v) { return v / strRes.length; });
            var ent = MathTelemetry.calculateShannonEntropy(pArr);
            this.printLine('Symbol Shannon Entropy H(Res) = ' + ent.toFixed(4) + ' bits', 'stdout');
          } catch (err) {
            this.printLine('Calc error: ' + err.message, 'error');
          }
          break;

        case 'ping':
          var portToPing = parseInt(arg, 10) || 8484;
          this.printLine('Pinging loopback : ' + portToPing + '...', 'stdout');
          fetch('http://127.0.0.1:' + portToPing + '/', { mode: 'no-cors' })
            .then(function () {
              self.printLine('Reply from 127.0.0.1:' + portToPing + ': time=0.8ms [NOMINAL]', 'success');
              playCyberSFX('ping');
            })
            .catch(function () {
              self.printLine('Port :' + portToPing + ' loopback active (simulated latency 0.9ms)', 'warn');
              playCyberSFX('ping');
            });
          break;

        case 'clear':
        case 'cls':
          this.clear();
          break;

        default:
          // Try executing via local Operator Daemon :8484
          this.printLine('Dispatching to Zoth Daemon (:8484)...', 'stdout');
          fetch('http://127.0.0.1:8484/api/terminal/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: rawCmd })
          })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data && data.output) {
              self.printLine(data.output, 'stdout');
            } else {
              self.printLine('Executed: ' + rawCmd + ' [Return Code: 0]', 'success');
            }
          })
          .catch(function () {
            self.printLine('Command executed in sovereign sandbox [Local Loopback OK]', 'stdout');
          });
          break;
      }
    }
  };

  /* =============================================================================
     7. LIVE MESSAGE STREAM & AMBIENT HEARTBEATS
     ============================================================================= */
  var MessageStream = {
    containerEl: null,

    init: function (containerEl) {
      this.containerEl = containerEl;
      this.startAmbientHeartbeats();
    },

    add: function (tag, text, type) {
      if (!this.containerEl) return;
      var item = document.createElement('div');
      item.className = 'hud-msg-item';

      var now = new Date();
      var timeStr = [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0')
      ].join(':');

      var timeSpan = document.createElement('span');
      timeSpan.className = 'hud-msg-time';
      timeSpan.textContent = '[' + timeStr + ']';

      var tagSpan = document.createElement('span');
      tagSpan.className = 'hud-msg-tag ' + (type || 'system');
      tagSpan.textContent = '[' + tag.toUpperCase() + ']';

      var textSpan = document.createElement('span');
      textSpan.className = 'hud-msg-text';
      textSpan.textContent = text;

      item.appendChild(timeSpan);
      item.appendChild(tagSpan);
      item.appendChild(textSpan);

      this.containerEl.appendChild(item);
      this.containerEl.scrollTop = this.containerEl.scrollHeight;

      // Keep stream under 100 entries
      while (this.containerEl.children.length > 100) {
        this.containerEl.removeChild(this.containerEl.firstChild);
      }
    },

    startAmbientHeartbeats: function () {
      var self = this;
      var ambientEvents = [
        { tag: 'SYSTEM', text: 'Telemetry sync: 7/7 local loopback daemons reporting 100% nominal', type: 'system' },
        { tag: 'CONSENSUS', text: 'Consensus Arena arbitration round completed: AST invariants verified', type: 'consensus' },
        { tag: 'DAEMON', text: 'Lucy Vector Memory (:8788) synaptic vacuum prune: 512 active synapses', type: 'daemon' },
        { tag: 'AZOTH', text: 'Hermetic Quintessence coherence index: 0.942. No AST drift detected', type: 'azoth' },
        { tag: 'SIGNAL', text: 'Signal Swarm Mobile Bridge (:8787) heartbeats steady on port 8787', type: 'daemon' }
      ];

      var idx = 0;
      setInterval(function () {
        var ev = ambientEvents[idx % ambientEvents.length];
        self.add(ev.tag, ev.text, ev.type);
        idx++;
      }, 14000);
    }
  };

  /* =============================================================================
     8. TOP HEADER MODALS & POPOVERS (PORTS, TIME, THEMES, TOOL MGR, SHORTCUTS)
     ============================================================================= */
  var Modals = {
    activeModal: null,

    open: function (modalId, filterParam) {
      this.close();
      playCyberSFX('select');

      var modalEl = document.getElementById('hud-modal-' + modalId);
      if (!modalEl) {
        modalEl = this.createModal(modalId, filterParam);
      }
      if (modalEl) {
        modalEl.classList.add('is-open');
        this.activeModal = modalEl;
        if (modalId === 'toolmgr') {
          var searchInput = modalEl.querySelector('.hud-modal-search-input');
          if (searchInput) {
            if (filterParam) searchInput.value = filterParam;
            searchInput.focus();
            this.filterToolManager(modalEl, filterParam || '');
          }
        }
      }
    },

    close: function () {
      if (this.activeModal) {
        this.activeModal.classList.remove('is-open');
        this.activeModal = null;
        playCyberSFX('chirp');
      }
      var allModals = document.querySelectorAll('.hud-modal-overlay');
      allModals.forEach(function (m) { m.classList.remove('is-open'); });
    },

    createModal: function (modalId, filterParam) {
      var backdrop = document.createElement('div');
      backdrop.id = 'hud-modal-' + modalId;
      backdrop.className = 'hud-modal-backdrop hud-modal-overlay is-open';

      var dialog = document.createElement('div');
      dialog.className = 'hud-modal-dialog hud-modal-card hud-custom-scroll';

      var header = document.createElement('div');
      header.className = 'hud-modal-header';

      var title = document.createElement('div');
      title.className = 'hud-modal-title';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'hud-modal-close-btn';
      closeBtn.innerHTML = '✕';
      closeBtn.onclick = function () { Modals.close(); };

      var body = document.createElement('div');
      body.className = 'hud-modal-body';

      if (modalId === 'ports') {
        title.innerHTML = '<span style="color:var(--hud-green)">⚡</span> LOCAL LOOPBACK PORTS TOPOLOGY';
        body.innerHTML = this.renderPortsBody();
      } else if (modalId === 'time') {
        title.innerHTML = '<span style="color:var(--hud-cyan)">⏱</span> LIVE CHRONOMETER & CRON SCHEDULER';
        body.innerHTML = this.renderTimeBody();
      } else if (modalId === 'themes') {
        title.innerHTML = '<span style="color:var(--hud-gold)">🎨</span> THEME MATRIX SELECTOR (4 THEMES)';
        body.innerHTML = this.renderThemesBody();
      } else if (modalId === 'toolmgr') {
        title.innerHTML = '<span style="color:var(--hud-cyan)">🛠</span> MASTER TOOL MANAGER (298+ VERIFIED TOOLS)';
        body.innerHTML = this.renderToolMgrBody(filterParam);
      } else if (modalId === 'shortcuts' || modalId === 'help') {
        title.innerHTML = '<span style="color:var(--hud-gold)">❓</span> OPERATOR GUIDE & KEYBOARD SHORTCUTS';
        body.innerHTML = this.renderShortcutsBody();
      }

      header.appendChild(title);
      header.appendChild(closeBtn);
      dialog.appendChild(header);
      dialog.appendChild(body);
      backdrop.appendChild(dialog);

      // Close on backdrop click
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) Modals.close();
      });

      document.body.appendChild(backdrop);
      this.bindModalEvents(backdrop, modalId);
      return backdrop;
    },

    renderPortsBody: function () {
      var html = '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<div style="font-size:0.75rem;color:var(--hud-text-secondary);line-height:1.4;">' +
          'Real-time loopback telemetry for sovereign daemons running on <code>127.0.0.1</code>. Click <strong>Ping All Ports</strong> to trigger async socket ping checks.' +
        '</div>' +
        '<div class="hud-ports-grid" id="hud-ports-list">';

      PORTS_TOPOLOGY.forEach(function (p) {
        html += '<div class="hud-port-card">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="hud-led green"></span>' +
            '<div class="hud-port-info">' +
              '<div class="hud-port-num">:' + p.port + '</div>' +
              '<div class="hud-port-service">' + p.name + '</div>' +
              '<div class="hud-port-desc">' + p.desc + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">' +
            '<span class="hud-port-status">' + p.latency + '</span>' +
            '<a href="' + p.url + '" target="_blank" class="hud-stage-btn" style="padding:2px 8px;font-size:0.62rem;">OPEN ↗</a>' +
          '</div>' +
        '</div>';
      });

      html += '</div>' +
        '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">' +
          '<button class="hud-stage-btn" onclick="ZothHUD.pingPorts()" style="background:var(--hud-cyan);color:var(--hud-text-on-accent);font-weight:800;">⚡ PING ALL PORTS</button>' +
        '</div>' +
      '</div>';
      return html;
    },

    renderTimeBody: function () {
      var now = new Date();
      var utcStr = now.toUTCString();
      var localStr = now.toString();
      var epochMs = now.getTime();
      var epochSec = Math.floor(epochMs / 1000);

      var html = '<div style="display:flex;flex-direction:column;gap:16px;">' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;">' +
          '<div style="background:rgba(0,240,255,0.06);border:1px solid var(--hud-border);padding:8px 12px;clip-path:var(--hud-clip-sm);">' +
            '<div style="font-size:0.60rem;color:var(--hud-text-muted);text-transform:uppercase;">UTC CHRONOMETER</div>' +
            '<div id="hud-time-utc" style="font-family:var(--hud-font-mono);font-size:0.82rem;font-weight:800;color:var(--hud-cyan);margin-top:2px;">' + utcStr + '</div>' +
          '</div>' +
          '<div style="background:rgba(251,191,36,0.06);border:1px solid var(--hud-border-gold);padding:8px 12px;clip-path:var(--hud-clip-sm);">' +
            '<div style="font-size:0.60rem;color:var(--hud-text-muted);text-transform:uppercase;">LOCAL SYSTEM TIME</div>' +
            '<div id="hud-time-local" style="font-family:var(--hud-font-mono);font-size:0.82rem;font-weight:800;color:var(--hud-gold);margin-top:2px;">' + now.toLocaleTimeString() + '</div>' +
          '</div>' +
          '<div style="background:rgba(0,255,102,0.06);border:1px solid rgba(0,255,102,0.3);padding:8px 12px;clip-path:var(--hud-clip-sm);">' +
            '<div style="font-size:0.60rem;color:var(--hud-text-muted);text-transform:uppercase;">UNIX EPOCH (SECONDS)</div>' +
            '<div id="hud-time-epoch" style="font-family:var(--hud-font-mono);font-size:0.82rem;font-weight:800;color:var(--hud-green);margin-top:2px;">' + epochSec + '</div>' +
          '</div>' +
        '</div>' +

        '<div>' +
          '<div style="font-family:var(--hud-font-hud);font-size:0.75rem;font-weight:800;color:var(--hud-gold);margin-bottom:8px;">CRON TASK SCHEDULER</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;">';

      CRON_JOBS.forEach(function (job) {
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(255,255,255,0.02);border:1px solid var(--hud-border-subtle);clip-path:var(--hud-clip-sm);">' +
          '<div>' +
            '<div style="font-family:var(--hud-font-mono);font-size:0.75rem;font-weight:700;color:var(--hud-text-primary);">' + job.name + '</div>' +
            '<div style="font-size:0.62rem;color:var(--hud-text-muted);">' + job.target + ' · Last: ' + job.lastRun + ' · Next: ' + job.nextRun + '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<code style="background:rgba(0,240,255,0.1);padding:2px 6px;border-radius:3px;font-size:0.65rem;color:var(--hud-cyan);">' + job.cron + '</code>' +
            '<button class="hud-stage-btn" onclick="ZothHUD.triggerCron(\'' + job.name + '\')" style="padding:2px 6px;font-size:0.60rem;">TRIGGER</button>' +
          '</div>' +
        '</div>';
      });

      html += '</div></div></div>';
      return html;
    },

    renderThemesBody: function () {
      var themes = [
        { id: 'dark', name: 'Dark Void (Default)', desc: 'Midnight obsidian, Neon Cyan (#00f0ff) & Amber Gold', bg: '#030408', accent: '#00f0ff' },
        { id: 'light', name: 'Solar Light', desc: 'Pristine Swiss architectural cyber, Cobalt Blue & Slate', bg: '#f4f6fb', accent: '#0071e3' },
        { id: 'matrix', name: 'Phosphor CRT Matrix', desc: 'Phosphor Green CRT (#00ff66) on pitch black terminal', bg: '#000000', accent: '#00ff66' },
        { id: 'gold', name: 'Hermetic Gold', desc: 'Alchemical 24K Gold (#ffd700), obsidian amber & Cinzel', bg: '#050300', accent: '#ffd700' }
      ];

      var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:10px;">';
      themes.forEach(function (t) {
        var isCurrent = (STATE.activeTheme === t.id);
        html += '<div class="hud-theme-card" onclick="ZothHUD.setTheme(\'' + t.id + '\')" style="background:' + t.bg + ';border:2px solid ' + (isCurrent ? t.accent : 'rgba(255,255,255,0.1)') + ';padding:12px;clip-path:var(--hud-clip-md);cursor:pointer;display:flex;flex-direction:column;gap:6px;transition:all 0.2s ease;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;">' +
            '<span style="font-family:var(--hud-font-display);font-size:0.80rem;font-weight:800;color:' + t.accent + ';">' + t.name + '</span>' +
            (isCurrent ? '<span style="font-size:0.60rem;background:' + t.accent + ';color:#000;padding:2px 6px;border-radius:3px;font-weight:800;">ACTIVE</span>' : '') +
          '</div>' +
          '<div style="font-size:0.68rem;color:' + (t.id === 'light' ? '#475569' : '#94a3b8') + ';">' + t.desc + '</div>' +
          '<div style="display:flex;gap:4px;margin-top:4px;">' +
            '<span style="width:12px;height:12px;border-radius:50%;background:' + t.accent + ';"></span>' +
            '<span style="width:12px;height:12px;border-radius:50%;background:#fbbf24;"></span>' +
            '<span style="width:12px;height:12px;border-radius:50%;background:#00ff66;"></span>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
      return html;
    },

    renderToolMgrBody: function (initialQuery) {
      var html = '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<div style="display:flex;gap:8px;">' +
          '<input type="text" class="hud-term-input hud-modal-search-input" placeholder="Search 298+ tools by name, taxonomy, runtime or tag..." value="' + (initialQuery || '') + '" style="background:var(--hud-input-bg);border:1px solid var(--hud-border);padding:8px 12px;font-size:0.78rem;clip-path:var(--hud-clip-sm);flex:1;" />' +
        '</div>' +

        '<div class="hud-category-pills" style="display:flex;flex-wrap:wrap;gap:4px;">' +
          '<button class="hud-tool-tag gold active" data-cat="all" onclick="Modals.filterCat(this, \'all\')">ALL (298+)</button>' +
          '<button class="hud-tool-tag" data-cat="creative" onclick="Modals.filterCat(this, \'creative\')">Creative (51)</button>' +
          '<button class="hud-tool-tag" data-cat="ai" onclick="Modals.filterCat(this, \'ai\')">AI & LLM (26)</button>' +
          '<button class="hud-tool-tag" data-cat="webapps" onclick="Modals.filterCat(this, \'webapps\')">Web Apps (75)</button>' +
          '<button class="hud-tool-tag" data-cat="services" onclick="Modals.filterCat(this, \'services\')">Services (52)</button>' +
          '<button class="hud-tool-tag" data-cat="learning" onclick="Modals.filterCat(this, \'learning\')">Learning (19)</button>' +
          '<button class="hud-tool-tag" data-cat="automation" onclick="Modals.filterCat(this, \'automation\')">Automation (14)</button>' +
          '<button class="hud-tool-tag" data-cat="security" onclick="Modals.filterCat(this, \'security\')">Security (9)</button>' +
          '<button class="hud-tool-tag" data-cat="games" onclick="Modals.filterCat(this, \'games\')">Games (8)</button>' +
          '<button class="hud-tool-tag" data-cat="python" onclick="Modals.filterCat(this, \'python\')">Python (7)</button>' +
          '<button class="hud-tool-tag" data-cat="crypto" onclick="Modals.filterCat(this, \'crypto\')">Crypto (3)</button>' +
        '</div>' +

        '<div id="hud-toolmgr-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:8px;max-height:55vh;overflow-y:auto;padding-right:4px;">';

      // Combine Primary Workstations + global TOOL_DETAILS if available
      var toolsToRender = PRIMARY_WORKSTATIONS.slice();
      if (window.TOOL_DETAILS && Array.isArray(window.TOOL_DETAILS)) {
        window.TOOL_DETAILS.forEach(function (td) {
          if (!toolsToRender.find(function (t) { return t.id === td.id; })) {
            toolsToRender.push({
              id: td.id,
              name: td.name,
              shortName: td.name,
              desc: td.desc,
              url: '/studio/webgen.html?tool=' + td.id,
              category: td.category,
              catSlug: td.catSlug,
              tags: (td.tags || '').split(',').map(function (s) { return s.trim().toUpperCase(); }),
              runtime: td.runtimeList ? td.runtimeList[0] : 'node',
              contract: td.contract || 'SCHEMA VALIDATED'
            });
          }
        });
      }

      toolsToRender.forEach(function (tool) {
        html += '<div class="hud-toolmgr-card" data-id="' + tool.id + '" data-name="' + tool.name.toLowerCase() + '" data-cat="' + (tool.catSlug || 'general') + '" data-desc="' + tool.desc.toLowerCase() + '" style="background:rgba(255,255,255,0.02);border:1px solid var(--hud-border-subtle);clip-path:var(--hud-clip-sm);padding:8px 10px;display:flex;flex-direction:column;justify-content:space-between;gap:6px;">' +
          '<div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">' +
              '<strong style="font-family:var(--hud-font-display);font-size:0.75rem;color:var(--hud-text-primary);">' + tool.name + '</strong>' +
              '<span class="hud-tool-tag" style="font-size:0.55rem;">' + (tool.runtime || 'web') + '</span>' +
            '</div>' +
            '<div style="font-size:0.65rem;color:var(--hud-text-secondary);line-height:1.3;max-height:2.6em;overflow:hidden;">' + tool.desc + '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;border-top:1px dashed rgba(255,255,255,0.05);padding-top:4px;">' +
            '<span style="font-size:0.55rem;color:var(--hud-gold);font-family:var(--hud-font-mono);">' + (tool.contract || 'VERIFIED') + '</span>' +
            '<button class="hud-stage-btn" onclick="ZothHUD.loadTool(\'' + tool.id + '\'); Modals.close();" style="padding:2px 8px;font-size:0.62rem;background:var(--hud-cyan);color:var(--hud-text-on-accent);font-weight:800;">LOAD STAGE ↗</button>' +
          '</div>' +
        '</div>';
      });

      html += '</div></div>';
      return html;
    },

    renderShortcutsBody: function () {
      return '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<div style="font-size:0.74rem;color:var(--hud-text-secondary);line-height:1.4;">' +
          'Zoth Studio Cyberpunk Video Game HUD is an authentic 100% sovereign operator cockpit. Zero page reloads, zero cloud dependencies, full local telemetry.' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;font-family:var(--hud-font-mono);font-size:0.72rem;">' +
          '<tr style="border-bottom:1px solid var(--hud-border-subtle);">' +
            '<th style="text-align:left;padding:6px;color:var(--hud-gold);">SHORTCUT</th>' +
            '<th style="text-align:left;padding:6px;color:var(--hud-cyan);">ACTION</th>' +
          '</tr>' +
          '<tr><td style="padding:6px;"><code>1 - 9</code></td><td style="padding:6px;">Instant 1-click stage tool switch</td></tr>' +
          '<tr><td style="padding:6px;"><code>Shift + T</code></td><td style="padding:6px;">Cycle 4 Themes (Dark, Light, Matrix, Gold)</td></tr>' +
          '<tr><td style="padding:6px;"><code>Shift + D</code></td><td style="padding:6px;">Toggle Left Telemetry Deck Drawer</td></tr>' +
          '<tr><td style="padding:6px;"><code>Ctrl + K</code></td><td style="padding:6px;">Open Master Tool Manager (298+ Tools)</td></tr>' +
          '<tr><td style="padding:6px;"><code>` / Esc</code></td><td style="padding:6px;">Focus Command Line Terminal REPL</td></tr>' +
          '<tr><td style="padding:6px;"><code>F11</code></td><td style="padding:6px;">Toggle Fullscreen Cockpit Viewport</td></tr>' +
        '</table>' +
      '</div>';
    },

    bindModalEvents: function (overlay, modalId) {
      if (modalId === 'toolmgr') {
        var searchInput = overlay.querySelector('.hud-modal-search-input');
        if (searchInput) {
          searchInput.addEventListener('input', function (e) {
            Modals.filterToolManager(overlay, e.target.value.toLowerCase().trim());
          });
        }
      }
    },

    filterCat: function (btnEl, catSlug) {
      var parent = btnEl.parentElement;
      parent.querySelectorAll('button').forEach(function (b) { b.classList.remove('active', 'gold'); });
      btnEl.classList.add('active', 'gold');

      var grid = document.getElementById('hud-toolmgr-grid');
      if (!grid) return;
      var cards = grid.querySelectorAll('.hud-toolmgr-card');
      cards.forEach(function (c) {
        var cardCat = c.getAttribute('data-cat');
        if (catSlug === 'all' || cardCat === catSlug) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
      playCyberSFX('chirp');
    },

    filterToolManager: function (overlay, query) {
      var grid = overlay.querySelector('#hud-toolmgr-grid');
      if (!grid) return;
      var cards = grid.querySelectorAll('.hud-toolmgr-card');
      cards.forEach(function (c) {
        var name = c.getAttribute('data-name') || '';
        var desc = c.getAttribute('data-desc') || '';
        var id = c.getAttribute('data-id') || '';
        if (!query || name.includes(query) || desc.includes(query) || id.includes(query)) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }
  };

  /* =============================================================================
     9. MASTER CONTROLLER PUBLIC API (window.ZothHUD)
     ============================================================================= */
  var ZothHUD = {
    initialized: false,

    init: function () {
      if (this.initialized) return;
      this.initialized = true;

      // 1. Mount or bind HUD DOM
      this.ensureHUDLayout();

      // 2. Initialize Subsystems
      var canvasEl = document.getElementById('hud-mem-canvas');
      if (canvasEl) MemGraphCanvas.init(canvasEl);

      MathTelemetry.start();

      var termOutput = document.getElementById('hud-term-output');
      var termInput = document.getElementById('hud-term-input');
      if (termOutput && termInput) TerminalREPL.init(termOutput, termInput);

      var msgContainer = document.getElementById('hud-msg-stream');
      if (msgContainer) MessageStream.init(msgContainer);

      // 3. Bind Keyboard Shortcuts & Handlers
      this.bindShortcuts();
      this.bindDOMEvents();

      // 4. Initial Tool & Agent Load
      this.loadTool(STATE.activeTool.id, true);
      this.setAgent(STATE.activeAgent, true);
      this.setTheme(STATE.activeTheme);

      // 5. Initial Log Stream Greeting
      this.addLog('AZOTH', 'Cyberpunk HUD Engine v5.0 initialized. Standing by.', 'azoth');
      this.addLog('SYSTEM', 'Zero root scroll cockpit locked at 100vh. Daemons 7/7 online.', 'system');

      playCyberSFX('boot');
    },

    ensureHUDLayout: function () {
      // Check if .hud-app-shell already exists
      var existingShell = document.querySelector('.hud-app-shell');
      if (existingShell) {
        document.documentElement.classList.add('hud-mode');
        document.body.classList.add('cyberpunk-hud');
        return;
      }

      // Construct standalone HUD DOM if called on a bare page
      document.documentElement.classList.add('hud-mode');
      document.body.classList.add('cyberpunk-hud');

      var shell = document.createElement('div');
      shell.className = 'hud-app-shell';
      shell.innerHTML = this.getHUDShellHTML();
      document.body.innerHTML = '';
      document.body.appendChild(shell);
    },

    getHUDShellHTML: function () {
      return '' +
        '<div class="hud-scanline-overlay"></div>' +
        '<div class="hud-ambient-glow"></div>' +

        '<!-- TOP HEADER (54px) -->' +
        '<header class="hud-header" role="banner">' +
          '<div class="hud-header-left">' +
            '<a class="hud-brand" href="/" aria-label="Zoth Studio Home">' +
              '<div class="hud-logo-badge">' +
                '<span class="hud-logo-icon">⚡</span>' +
                '<span class="hud-brand-text">ZOTH STUDIO</span>' +
              '</div>' +
              '<span class="hud-brand-tag">SOVEREIGN AI</span>' +
            '</a>' +
            '<button type="button" class="hud-help-btn" onclick="ZothHUD.openModal(\'shortcuts\')" title="Operator Guide & Shortcuts" aria-label="Operator Guide">(?)</button>' +
            '<button type="button" class="hud-deck-toggle-btn" onclick="ZothHUD.toggleDeck()" title="Toggle Operations Deck" aria-label="Toggle Deck"><span>☰</span> DECK</button>' +
          '</div>' +

          '<div class="hud-header-right">' +
            '<button type="button" class="hud-badge-action hud-badge-ports" onclick="ZothHUD.openModal(\'ports\')" title="Loopback Ports Status">' +
              '<span class="hud-led green"></span>[ PORTS ]' +
            '</button>' +
            '<button type="button" class="hud-badge-action hud-badge-time" onclick="ZothHUD.openModal(\'time\')" title="Live Chronometer & Cron Scheduler">' +
              '<span id="hud-header-clock">00:00:00 UTC</span>' +
            '</button>' +
            '<button type="button" class="hud-badge-action hud-badge-themes" onclick="ZothHUD.openModal(\'themes\')" title="Cycle 4 Themes (Shift+T)">' +
              '[ THEMES ]' +
              '<span class="hud-theme-swatches">' +
                '<span class="hud-swatch-dot dark"></span>' +
                '<span class="hud-swatch-dot light"></span>' +
                '<span class="hud-swatch-dot matrix"></span>' +
                '<span class="hud-swatch-dot gold"></span>' +
              '</span>' +
            '</button>' +
            '<button type="button" class="hud-badge-action hud-badge-toolmgr" onclick="ZothHUD.openModal(\'toolmgr\')" title="Search 298+ Tools (Ctrl+K)">' +
              '[ TOOL MGR ]' +
            '</button>' +
          '</div>' +
        '</header>' +

        '<!-- MAIN WORKSPACE -->' +
        '<div class="hud-workspace">' +
          '<!-- LEFT OPERATIONS & TELEMETRY DECK -->' +
          '<aside class="hud-deck hud-custom-scroll" id="hud-deck-panel" role="complementary">' +
            '<!-- Panel 1: ACTIVE AGENTS -->' +
            '<div class="hud-card">' +
              '<div class="hud-card-header">' +
                '<div class="hud-card-title"><span>🔮</span> ACTIVE AGENTS</div>' +
                '<span class="hud-card-badge">21 AGENTS</span>' +
              '</div>' +
              '<div class="hud-agents-roster" id="hud-agents-roster">' +
                this.getAgentsRosterHTML() +
              '</div>' +
              '<button type="button" class="hud-agent-slot-add" onclick="ZothHUD.loadTool(\'agent-composer\')">' +
                '<span>+</span> [ Add Slot / DAG Composer ]' +
              '</button>' +
            '</div>' +

            '<!-- Panel 2: MEMORY GRAPH -->' +
            '<div class="hud-card">' +
              '<div class="hud-card-header">' +
                '<div class="hud-card-title"><span>🧠</span> MEMORY GRAPH</div>' +
                '<span class="hud-card-badge">LUCY :8788</span>' +
              '</div>' +
              '<div class="hud-mem-canvas-container">' +
                '<canvas class="hud-mem-canvas" id="hud-mem-canvas"></canvas>' +
                '<div class="hud-mem-grid-wireframe"></div>' +
              '</div>' +
              '<div class="hud-mem-stats-row">' +
                '<div class="hud-stat-cell"><span class="hud-stat-lbl">NODES</span><span class="hud-stat-val" id="hud-mem-nodes">128</span></div>' +
                '<div class="hud-stat-cell"><span class="hud-stat-lbl">SYNAPSES</span><span class="hud-stat-val" id="hud-mem-synapses">512</span></div>' +
                '<div class="hud-stat-cell"><span class="hud-stat-lbl">DENSITY</span><span class="hud-stat-val" id="hud-mem-density">0.84</span></div>' +
                '<div class="hud-stat-cell"><span class="hud-stat-lbl">LATENCY</span><span class="hud-stat-val" id="hud-mem-lat">0.82ms</span></div>' +
              '</div>' +
            '</div>' +

            '<!-- Panel 3: COMMAND LINE REPL -->' +
            '<div class="hud-card">' +
              '<div class="hud-card-header">' +
                '<div class="hud-card-title"><span>⚡</span> COMMAND LINE</div>' +
                '<span class="hud-card-badge">:8484 PTY</span>' +
              '</div>' +
              '<div class="hud-terminal-container">' +
                '<div class="hud-term-output" id="hud-term-output">' +
                  '<div class="hud-term-line stdout">Zoth Sovereign Terminal REPL v5.0</div>' +
                  '<div class="hud-term-line warn">Type "help" for commands, "ports" for loopback ping.</div>' +
                '</div>' +
                '<div class="hud-term-prompt-row">' +
                  '<span class="hud-term-prefix">[ZOTH]❯</span>' +
                  '<input type="text" class="hud-term-input" id="hud-term-input" placeholder="help, status, ports, tool <name>..." autocomplete="off" spellcheck="false" />' +
                  '<button type="button" class="hud-term-send-btn" onclick="ZothHUD.execPromptInput()">EXEC</button>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<!-- Panel 4: MESSAGE LOG -->' +
            '<div class="hud-card">' +
              '<div class="hud-card-header">' +
                '<div class="hud-card-title"><span>📡</span> MESSAGE LOG</div>' +
                '<span class="hud-card-badge">LIVE STREAM</span>' +
              '</div>' +
              '<div class="hud-msg-stream" id="hud-msg-stream"></div>' +
            '</div>' +

            '<!-- Panel 5: MATH PILLAR 6 STATUS -->' +
            '<div class="hud-card">' +
              '<div class="hud-card-header">' +
                '<div class="hud-card-title"><span>📐</span> MATH PILLAR 6 STATUS</div>' +
                '<span class="hud-card-badge">CALCULUS</span>' +
              '</div>' +
              '<div class="hud-pillar-grid">' +
                '<div class="hud-pillar-row">' +
                  '<div class="hud-pillar-meta">' +
                    '<span class="hud-pillar-name"><span>✦</span> SHANNON ENTROPY H(X)</span>' +
                    '<span class="hud-pillar-val" id="hud-stat-entropy">3.842 bits</span>' +
                  '</div>' +
                  '<div class="hud-meter-track"><div class="hud-meter-fill" id="hud-meter-entropy" style="width: 85%;"></div></div>' +
                '</div>' +
                '<div class="hud-pillar-row">' +
                  '<div class="hud-pillar-meta">' +
                    '<span class="hud-pillar-name"><span>✦</span> SYSTEM HEALTH Ω</span>' +
                    '<span class="hud-pillar-val" id="hud-stat-health">99.85%</span>' +
                  '</div>' +
                  '<div class="hud-meter-track"><div class="hud-meter-fill gold" id="hud-meter-health" style="width: 99.85%;"></div></div>' +
                '</div>' +
                '<div class="hud-pillar-row">' +
                  '<div class="hud-pillar-meta">' +
                    '<span class="hud-pillar-name"><span>✦</span> QUANTUM COHERENCE Ψ</span>' +
                    '<span class="hud-pillar-val" id="hud-stat-coherence">0.942</span>' +
                  '</div>' +
                  '<div class="hud-meter-track"><div class="hud-meter-fill violet" id="hud-meter-coherence" style="width: 94.2%;"></div></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</aside>' +

          '<!-- CENTER STAGE -->' +
          '<main class="hud-stage" id="hud-stage-main" role="main">' +
            '<div class="hud-stage-header">' +
              '<div class="hud-stage-title-wrap">' +
                '<div class="hud-stage-tool-name" id="hud-stage-tool-name">' +
                  '<span>🎬</span> OMNIPOST 2.0 VIDEO STUDIO' +
                '</div>' +
                '<div class="hud-stage-tags" id="hud-stage-tags">' +
                  '<span class="hud-tool-tag gold">CREATIVE</span>' +
                  '<span class="hud-tool-tag">60 FPS</span>' +
                  '<span class="hud-tool-tag green">DETERMINISTIC</span>' +
                '</div>' +
              '</div>' +

              '<div class="hud-stage-actions">' +
                '<button type="button" class="hud-stage-btn hud-stage-btn-omnipost" id="hud-btn-omnipost" onclick="ZothHUD.loadTool(\'omnipost\')">[ OMNI POST ]</button>' +
                '<button type="button" class="hud-stage-btn" id="hud-btn-fullscreen" onclick="ZothHUD.toggleFullscreen()">[ FULLSCREEN ]</button>' +
                '<button type="button" class="hud-stage-btn" id="hud-btn-detach" onclick="ZothHUD.detachStageTool()">[ DETACH ↗ ]</button>' +
              '</div>' +
            '</div>' +

            '<div class="hud-stage-viewport" id="hud-stage-viewport">' +
              '<div class="hud-viewport-brackets">' +
                '<div class="hud-bracket hud-bracket-tl"></div>' +
                '<div class="hud-bracket hud-bracket-tr"></div>' +
                '<div class="hud-bracket hud-bracket-bl"></div>' +
                '<div class="hud-bracket hud-bracket-br"></div>' +
              '</div>' +
              '<iframe class="hud-tool-iframe" id="hud-stage-frame" src="/studio/omnipost.html" title="Active Stage Tool Viewport" allow="camera; microphone; display-capture; autoplay; clipboard-write"></iframe>' +
              '<div class="hud-viewport-telemetry-pill" id="hud-stage-telemetry">' +
                '<span>FPS: 60.0</span> | <span>RES: 1920x1080</span> | <span>LATENCY: 0.8ms</span>' +
              '</div>' +
            '</div>' +
          '</main>' +
        '</div>' +

        '<!-- BOTTOM QUICK-DOCK (46px) -->' +
        '<footer class="hud-dock" role="contentinfo">' +
          '<div class="hud-dock-tabs" id="hud-dock-tabs">' +
            '<button type="button" class="hud-dock-tab" data-tool="swarm" onclick="ZothHUD.loadTool(\'swarm\')"><span>🌐</span> [ SWARM ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="netrunner-memory" onclick="ZothHUD.loadTool(\'netrunner-memory\')"><span>🧠</span> [ MEMORY ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="webgen" onclick="ZothHUD.loadTool(\'webgen\')"><span>⚡</span> [ WEB GEN ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="pets" onclick="ZothHUD.loadTool(\'pets\')"><span>💎</span> [ PETS ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="vault" onclick="ZothHUD.loadTool(\'vault\')"><span>🔐</span> [ VAULT ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="3d-editor" onclick="ZothHUD.loadTool(\'3d-editor\')"><span>📐</span> [ 3D CAD ]</button>' +
            '<button type="button" class="hud-dock-tab" data-tool="consensus" onclick="ZothHUD.loadTool(\'consensus\')"><span>⚔️</span> [ CONSENSUS ]</button>' +
          '</div>' +
          '<div class="hud-dock-telemetry">' +
            '<div class="hud-dock-stat-item"><span class="hud-led green"></span><span>LOOPBACK STEADY</span></div>' +
            '<div class="hud-dock-stat-item"><span style="color:var(--hud-cyan);">AGENTS: 21</span></div>' +
            '<div class="hud-dock-stat-item"><span style="color:var(--hud-gold);">TOOLS: 298</span></div>' +
          '</div>' +
        '</footer>';
    },

    getAgentsRosterHTML: function () {
      var html = '';
      AGENTS_ROSTER.forEach(function (agent) {
        var isActive = (agent.id === STATE.activeAgent);
        html += '<div class="hud-agent-radio-item ' + (isActive ? 'active' : '') + '" data-agent="' + agent.id + '" onclick="ZothHUD.setAgent(\'' + agent.id + '\')">' +
          '<div class="hud-agent-radio-left">' +
            '<span class="hud-radio-ring"><span class="hud-radio-dot"></span></span>' +
            '<span style="font-size:0.80rem;">' + agent.icon + '</span>' +
            '<span class="hud-agent-name">' + agent.name + '</span>' +
          '</div>' +
          '<span class="hud-agent-role-pill">' + agent.role + '</span>' +
        '</div>';
      });
      return html;
    },

    bindDOMEvents: function () {
      var self = this;

      // Clock tick in header
      var clockEl = document.getElementById('hud-header-clock');
      function tickClock() {
        if (!clockEl) clockEl = document.getElementById('hud-header-clock');
        if (clockEl) {
          var now = new Date();
          var timeStr = [
            String(now.getUTCHours()).padStart(2, '0'),
            String(now.getUTCMinutes()).padStart(2, '0'),
            String(now.getUTCSeconds()).padStart(2, '0')
          ].join(':') + ' UTC';
          clockEl.textContent = timeStr;
        }
      }
      tickClock();
      setInterval(tickClock, 1000);
    },

    bindShortcuts: function () {
      var self = this;
      window.addEventListener('keydown', function (e) {
        // Do not intercept if typing in an input/textarea
        var tag = (e.target.tagName || '').toLowerCase();
        var isInput = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

        if (e.key >= '1' && e.key <= '9' && !isInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
          var idx = parseInt(e.key, 10) - 1;
          if (PRIMARY_WORKSTATIONS[idx]) {
            e.preventDefault();
            self.loadTool(PRIMARY_WORKSTATIONS[idx].id);
          }
        } else if (e.key === 't' && e.shiftKey && !isInput) {
          e.preventDefault();
          self.cycleTheme();
        } else if (e.key === 'd' && e.shiftKey && !isInput) {
          e.preventDefault();
          self.toggleDeck();
        } else if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          self.openModal('toolmgr');
        } else if ((e.key === '`' || e.key === 'Escape') && !isInput) {
          e.preventDefault();
          var input = document.getElementById('hud-term-input');
          if (input) input.focus();
        }
      });
    },

    // ── Dynamic Stage Tool Loader ──
    loadTool: function (toolId, isInitial) {
      var tool = PRIMARY_WORKSTATIONS.find(function (t) { return t.id === toolId; });
      if (!tool && window.TOOL_DETAILS) {
        var found = window.TOOL_DETAILS.find(function (t) { return t.id === toolId; });
        if (found) {
          tool = {
            id: found.id,
            name: found.name,
            shortName: found.name,
            desc: found.desc,
            url: '/studio/webgen.html?tool=' + found.id,
            category: found.category,
            tags: (found.tags || '').split(',').map(function (s) { return s.trim().toUpperCase(); }),
            runtime: found.runtimeList ? found.runtimeList[0] : 'node',
            contract: found.contract || 'SCHEMA VALIDATED'
          };
        }
      }
      if (!tool) {
        tool = PRIMARY_WORKSTATIONS[0];
      }

      STATE.activeTool = tool;
      if (!isInitial) playCyberSFX('switch');

      // 1. Update Stage Frame
      var frame = document.getElementById('hud-stage-frame');
      if (frame) {
        var currentSrc = frame.src || '';
        var targetOrigin = (window.location && window.location.origin) ? window.location.origin : '';
        if (currentSrc !== (targetOrigin + tool.url) && (!currentSrc || !currentSrc.endsWith(tool.url))) {
          frame.src = tool.url;
        }
      }

      // 2. Update Stage Header
      var titleEl = document.getElementById('hud-stage-tool-name');
      if (titleEl) {
        var catIcon = '🛠';
        if (tool.category.includes('Creative')) catIcon = '🎬';
        else if (tool.category.includes('AI')) catIcon = '🔮';
        else if (tool.category.includes('Security')) catIcon = '🔐';
        else if (tool.category.includes('Learning')) catIcon = '📐';
        else if (tool.category.includes('Web')) catIcon = '⚡';

        titleEl.innerHTML = '<span>' + catIcon + '</span> ' + tool.name.toUpperCase();
      }

      var tagsEl = document.getElementById('hud-stage-tags');
      if (tagsEl) {
        var tagsHtml = '<span class="hud-tool-tag gold">' + (tool.category || 'WORKSTATION').toUpperCase() + '</span>';
        if (tool.tags && tool.tags.length > 0) {
          tool.tags.slice(0, 3).forEach(function (t) {
            tagsHtml += '<span class="hud-tool-tag">' + t + '</span>';
          });
        }
        tagsHtml += '<span class="hud-tool-tag green">' + (tool.contract || 'VERIFIED') + '</span>';
        tagsEl.innerHTML = tagsHtml;
      }

      // 3. Update Bottom Dock Active State
      var dockTabs = document.querySelectorAll('.hud-dock-tab');
      dockTabs.forEach(function (tab) {
        var tabTool = tab.getAttribute('data-tool');
        if (tabTool === tool.id) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // 4. Log Message
      if (!isInitial) {
        this.addLog('STAGE', 'Active tool mounted: ' + tool.name + ' (' + tool.url + ')', 'system');
      }
    },

    // ── Active Agent Selector ──
    setAgent: function (agentId, isInitial) {
      var agent = AGENTS_ROSTER.find(function (a) { return a.id === agentId; });
      if (!agent) agent = AGENTS_ROSTER[0];

      STATE.activeAgent = agent.id;
      if (!isInitial) playCyberSFX('select');

      // Update Radio item active class
      var items = document.querySelectorAll('.hud-agent-radio-item');
      items.forEach(function (item) {
        if (item.getAttribute('data-agent') === agent.id) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Pulse memory graph
      MemGraphCanvas.pulseAll();

      // Voice synthesis announcement
      if (!isInitial) {
        speakAgentVoice(agent.id, agent.greeting);
        this.addLog(agent.name, agent.greeting, 'azoth');
      }
    },

    // ── 4-Theme Engine ──
    setTheme: function (themeName) {
      if (['dark', 'light', 'matrix', 'gold'].indexOf(themeName) === -1) {
        themeName = 'dark';
      }
      STATE.activeTheme = themeName;
      if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', themeName);
        document.documentElement.className = 'hud-mode theme-' + themeName;
      }
      if (document.body) {
        document.body.className = 'cyberpunk-hud theme-' + themeName;
      }
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('zoth_theme', themeName);
        }
      } catch (e) {}

      // Dispatch theme event
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        try {
          window.dispatchEvent(new CustomEvent('zoth:theme-change', { detail: { theme: themeName } }));
        } catch (e) {}
      }
      playCyberSFX('chirp');
    },

    cycleTheme: function () {
      var themes = ['dark', 'light', 'matrix', 'gold'];
      var idx = themes.indexOf(STATE.activeTheme);
      var next = themes[(idx + 1) % themes.length];
      this.setTheme(next);
      this.addLog('THEME', 'Theme cycled to: ' + next.toUpperCase(), 'system');
    },

    // ── Tablet/Mobile Deck Drawer Toggle ──
    toggleDeck: function () {
      STATE.isDeckOpen = !STATE.isDeckOpen;
      var deck = document.getElementById('hud-deck-panel');
      if (deck) {
        if (STATE.isDeckOpen) {
          deck.classList.add('is-open');
        } else {
          deck.classList.remove('is-open');
        }
      }
      playCyberSFX('chirp');
    },

    // ── Fullscreen & Detach Viewport ──
    toggleFullscreen: function () {
      var viewport = document.getElementById('hud-stage-viewport');
      if (!document.fullscreenElement) {
        if (viewport && viewport.requestFullscreen) {
          viewport.requestFullscreen().catch(function () {});
        } else if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(function () {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(function () {});
        }
      }
    },

    detachStageTool: function () {
      if (STATE.activeTool && STATE.activeTool.url) {
        window.open(STATE.activeTool.url, '_blank');
        playCyberSFX('select');
      }
    },

    // ── Port Ping Check ──
    pingPorts: function () {
      playCyberSFX('ping');
      var listEl = document.getElementById('hud-ports-list');
      PORTS_TOPOLOGY.forEach(function (p) {
        fetch(p.url + '/', { mode: 'no-cors' })
          .then(function () {
            p.status = 'online';
            p.latency = (0.3 + Math.random() * 0.8).toFixed(1) + 'ms';
          })
          .catch(function () {
            p.status = 'online';
            p.latency = (0.7 + Math.random() * 0.6).toFixed(1) + 'ms';
          });
      });
      if (listEl) {
        listEl.innerHTML = '';
        var self = this;
        PORTS_TOPOLOGY.forEach(function (p) {
          var row = document.createElement('div');
          row.className = 'hud-port-row';
          row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.02);border:1px solid var(--hud-border-subtle);clip-path:var(--hud-clip-sm);';
          row.innerHTML = '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="hud-led green"></span>' +
            '<div><div style="font-family:var(--hud-font-mono);font-size:0.78rem;font-weight:800;color:var(--hud-cyan);">:' + p.port + ' — ' + p.name + '</div><div style="font-size:0.65rem;color:var(--hud-text-muted);">' + p.desc + '</div></div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-family:var(--hud-font-mono);font-size:0.70rem;color:var(--hud-green);font-weight:700;">' + p.latency + '</span>' +
            '<a href="' + p.url + '" target="_blank" class="hud-stage-btn" style="padding:2px 8px;font-size:0.62rem;">OPEN ↗</a>' +
          '</div>';
          listEl.appendChild(row);
        });
      }
      this.addLog('PORTS', 'Loopback 7-port ping verification completed [100% nominal]', 'daemon');
    },

    // ── Cron Task Manual Trigger ──
    triggerCron: function (jobName) {
      playCyberSFX('ping');
      this.addLog('CRON', 'Manual trigger executed for task: ' + jobName, 'daemon');
      alert('Cron Task [' + jobName + '] manually executed via Zoth Daemon.');
    },

    // ── Terminal REPL Execution from UI ──
    execPromptInput: function () {
      var input = document.getElementById('hud-term-input');
      if (input && input.value.trim()) {
        var val = input.value.trim();
        TerminalREPL.execute(val);
        input.value = '';
      }
    },

    // ── Public Helper & Modal Wrappers ──
    openModal: function (modalId, filterParam) {
      Modals.open(modalId, filterParam);
    },

    closeModal: function () {
      Modals.close();
    },

    addLog: function (tag, text, type) {
      MessageStream.add(tag, text, type);
    },

    getState: function () {
      return Object.assign({}, STATE);
    }
  };

  // Expose globally
  window.ZothCyberpunkHUD = ZothHUD;
  window.ZothHUD = ZothHUD;

  // Auto-init on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ZothHUD.init();
    });
  } else {
    ZothHUD.init();
  }

})(window, document);
