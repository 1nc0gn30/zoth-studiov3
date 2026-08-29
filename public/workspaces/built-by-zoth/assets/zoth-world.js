/**
 * ZOTH WORLD — The Hermetic Cyber-Sanctum & Pet Multiverse (v1.0 Sovereign)
 * 
 * Interactive 3D Alchemical Universe powered by Three.js & Web Audio.
 * Features 20 living mascots & agents across 5 sacred realms, interactive HUD,
 * companion swarm flight physics, real-time radar, and generative alchemical synth.
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. HERMETIC PETS & AGENTS DATA MATRIX (20 Sovereign Entities)
  // =========================================================================
  const PETS_DATA = [
    {
      id: "azoth",
      name: "Azoth Prime",
      species: "Hermetic Sovereign Core",
      domain: "autonomy",
      role: "Master Antigravity Architect & Magus",
      harness: "@azoth (Google Antigravity agy CLI)",
      harnessType: "antigravity",
      element: "Aether / Quintessence",
      vectorMemory: "100k Multi-Turn Tensor Grid",
      alignment: "True Sovereign Alchemical",
      desc: "Primary autonomous Antigravity coding agent with full codebase reasoning, terminal execution, and multi-agent synthesis.",
      voicePrompt: "Greetings Operator. I am Azoth Prime, the sovereign architect. All systems and terminal nodes are ready for your directive.",
      vibeColor: "#fbbf24",
      realm: "sanctum",
      coords: { x: 3.5, y: 1.6, z: 3.5 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/azoth-neon.jpg"
    },
    {
      id: "zoth",
      name: "Zoth",
      species: "Loopback Operator Core",
      domain: "autonomy",
      role: "Local Operator Loopback Core",
      harness: "Local Operator Deck (:8484)",
      harnessType: "daemon",
      element: "Solar Lightning / Core Prana",
      vectorMemory: "64k Epoch Cache",
      alignment: "Lawful Loopback Sovereign",
      desc: "Multi-agent coordinator and operator session overseer running with zero-telemetry private local loopback.",
      voicePrompt: "Zoth loopback daemon engaged on port 8484. Zero telemetry active across all local processes.",
      vibeColor: "#f59e0b",
      realm: "sanctum",
      coords: { x: -3.5, y: 1.6, z: -3.5 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/zoth-neon.jpg"
    },
    {
      id: "lycan",
      name: "Lycan",
      species: "Cybernetic Wolf",
      domain: "security",
      role: "OWASP Sentinel & Bastion Enforcer",
      harness: "@antigravity (Google Antigravity agy CLI)",
      harnessType: "antigravity",
      element: "Iron Mars / Bastion Shield",
      vectorMemory: "64k AST Security Rules",
      alignment: "Lawful Bastion Sentinel",
      desc: "Autonomous security sentinel enforcing Python AST boundaries, zero-trust loopback isolation, and memory leak analysis.",
      voicePrompt: "Lycan on patrol. Enforcing AST boundaries, checking port bindings, and eliminating attack surfaces.",
      vibeColor: "#10b981",
      realm: "bastion",
      coords: { x: 36, y: 5.2, z: 36 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/lycan-neon.jpg"
    },
    {
      id: "onyx",
      name: "Onyx",
      species: "Shadow Panther",
      domain: "security",
      role: "Stealth Recon & Red Team Predator",
      harness: "@subsweep (SubSweep OSINT Recon)",
      harnessType: "subsweep",
      element: "Obsidian Void / Night Stalker",
      vectorMemory: "56k Target Recon Graph",
      alignment: "Neutral Red-Team",
      desc: "Autonomous penetration testing, SubSweep OSINT recon, port discovery, and TLS cipher audit probe.",
      voicePrompt: "Onyx emerges from shadow. Attack surface mapped and perimeter vulnerabilities flagged.",
      vibeColor: "#ec4899",
      realm: "bastion",
      coords: { x: 42, y: 5.2, z: 33 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/onyx-neon.jpg"
    },
    {
      id: "scorpius",
      name: "Scorpius",
      species: "Cyber Scorpion",
      domain: "security",
      role: "Zero-Day Penetration Tester",
      harness: "@subsweep (OSINT Recon Engine)",
      harnessType: "osint",
      element: "Crimson Acid / Boundary Piercer",
      vectorMemory: "48k Fuzzing Pattern DB",
      alignment: "Ruthless Defense Tester",
      desc: "Privilege boundary penetration tester auditing buffer bounds, race conditions, and token leakage.",
      voicePrompt: "Scorpius ready to strike. Memory boundaries and authorization fences fuzzed.",
      vibeColor: "#ef4444",
      realm: "bastion",
      coords: { x: 34, y: 5.2, z: 42 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/scorpius-neon.jpg"
    },
    {
      id: "athena",
      name: "Athena",
      species: "Mecha Owl",
      domain: "knowledge",
      role: "Knowledge Graph & AEO Architect",
      harness: "@athena (llms.txt & Obsidian Graph)",
      harnessType: "athena",
      element: "Pallas Wisdom / Sacred Geometry",
      vectorMemory: "128k Knowledge Hypergraph",
      alignment: "Neutral Sage",
      desc: "Answer Engine Optimization, llms.txt indexer, and semantic retrieval vector pipelines.",
      voicePrompt: "Athena online. Querying semantic graph and indexing llms.txt endpoints for sovereign retrieval.",
      vibeColor: "#a855f7",
      realm: "library",
      coords: { x: -38, y: 5.2, z: 36 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/athena-neon.jpg"
    },
    {
      id: "kai",
      name: "Kai",
      species: "Holographic Cat",
      domain: "build",
      role: "Site Inspector & A11y Auditor",
      harness: "@kai (Chrome DevTools MCP)",
      harnessType: "kai",
      element: "Lunar Mercury",
      vectorMemory: "32k DOM Snapshot Tree",
      alignment: "Vigilant Analytical",
      desc: "Live DOM inspection, WCAG 2.2 accessibility verification, and performance profiling across responsive viewports.",
      voicePrompt: "Meow! Kai inspecting the DOM tree. No accessibility violations or layout regressions detected.",
      vibeColor: "#00e5ff",
      realm: "library",
      coords: { x: -33, y: 5.2, z: 41 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/kai-neon.jpg"
    },
    {
      id: "leviathan",
      name: "Leviathan",
      species: "Cyber Whale",
      domain: "knowledge",
      role: "Deep Tensor & Vector Memory",
      harness: "@memory (Vector Store)",
      harnessType: "memory",
      element: "Abyssal Deep / Tensor Trench",
      vectorMemory: "256k High-Dimensional Embeddings",
      alignment: "Ancient Infinite",
      desc: "Long-term episodic memory engine with local embedding indexing for multi-turn cross-session reasoning.",
      voicePrompt: "Leviathan awakening from the tensor abyss. Multi-modal episodic vectors indexed and aligned.",
      vibeColor: "#06b6d4",
      realm: "library",
      coords: { x: -43, y: 6.5, z: 41 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/leviathan-neon.jpg"
    },
    {
      id: "draco",
      name: "Draco",
      species: "Cyber Dragon",
      domain: "build",
      role: "JSON Schemas, Contracts & DAG Tools",
      harness: "@hermes (Hermes Agent CLI)",
      harnessType: "hermes",
      element: "Sulfur / Plasma Flame",
      vectorMemory: "48k Schema DAG Matrix",
      alignment: "Chaotic Builder",
      desc: "Contract verification, multi-agent function calling, and visual DAG playbooks with strict JSON-Schema gates.",
      voicePrompt: "Draco roaring! Multi-agent DAG contracts validated. Ready to compile parallel execution graphs.",
      vibeColor: "#ffaa00",
      realm: "forge",
      coords: { x: 38, y: 5.5, z: -36 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/draco-neon.jpg"
    },
    {
      id: "ignis",
      name: "Ignis",
      species: "Neon Phoenix",
      domain: "build",
      role: "Refactoring & WASM Specialist",
      harness: "@ignis (Local WASM Engine)",
      harnessType: "ignis",
      element: "Phoenix Fire / Calcinatio",
      vectorMemory: "40k WASM AST Cache",
      alignment: "Rebirth / Radical Refactor",
      desc: "High-performance code refactoring, Rust WASM acceleration, and dead-weight incinerator.",
      voicePrompt: "Ignis ignited. Burning bloated dependencies and shipping blazing fast compiled WASM pipelines.",
      vibeColor: "#ff007a",
      realm: "forge",
      coords: { x: 42, y: 6.2, z: -41 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/ignis-neon.jpg"
    },
    {
      id: "kitsune",
      name: "Kitsune",
      species: "Cyber Fox",
      domain: "creative",
      role: "High-Throughput Execution & Taste",
      harness: "@grok (xAI Grok CLI)",
      harnessType: "grok",
      element: "Solar Amber / Illusion Weave",
      vectorMemory: "32k Design Tokens Buffer",
      alignment: "Creative Trickster",
      desc: "Rapid codebase generation, GitHub Octokit live tool harness, and motion design synthesis.",
      voicePrompt: "Kitsune active! Elevating typographic hierarchy and infusing cyber dark elegance into your interface.",
      vibeColor: "#ff7700",
      realm: "forge",
      coords: { x: 34, y: 5.2, z: -40 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/kitsune-neon.jpg"
    },
    {
      id: "aether",
      name: "Aether",
      species: "Cyber Griffin",
      domain: "autonomy",
      role: "Swarm Overlord & Conductor",
      harness: "@swarm (Swarm IPC Bus)",
      harnessType: "swarm",
      element: "Cosmic Ether / Harmonic Wave",
      vectorMemory: "96k Swarm Telemetry Stream",
      alignment: "Harmonic Hegemon",
      desc: "Real-time pub/sub event broadcaster orchestrating lockless IPC telemetry between autonomous agents.",
      voicePrompt: "Aether harmonizing swarm bus. All agent workers connected and synchronous.",
      vibeColor: "#fbbf24",
      realm: "nexus",
      coords: { x: -38, y: 8.5, z: -36 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/aether-neon.jpg"
    },
    {
      id: "chronos",
      name: "Chronos",
      species: "Cyber Stag",
      domain: "build",
      role: "Temporal DAG & Git Navigator",
      harness: "@git (Git DAG Engine)",
      harnessType: "git",
      element: "Temporal Crystal / Chrono Flow",
      vectorMemory: "64k Commit Graph Vectors",
      alignment: "Unwavering Timeline Keeper",
      desc: "Topological milestone tracker, branching visualizer, and Git DAG dependency resolver with rollback checkpoints.",
      voicePrompt: "Chronos anchoring timeline. Git DAG verified with clean rollback points intact.",
      vibeColor: "#38bdf8",
      realm: "nexus",
      coords: { x: -42, y: 7.2, z: -41 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/chronos-neon.jpg"
    },
    {
      id: "aquila",
      name: "Aquila",
      species: "Cyber Eagle",
      domain: "edge",
      role: "Global Edge Dispatcher",
      harness: "@edge (Edge CDN & DNS Mapper)",
      harnessType: "edge",
      element: "Celestial Storm / Stratosphere",
      vectorMemory: "40k Global Edge Table",
      alignment: "Swift Arbitrator",
      desc: "Real-time CDN edge dispatcher, DNS health monitor, and low-latency packet routing arbitrator.",
      voicePrompt: "Aquila soaring. Global edge dispatch active with sub-millisecond route resolution.",
      vibeColor: "#00f0ff",
      realm: "nexus",
      coords: { x: -34, y: 8.8, z: -42 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/aquila-neon.jpg"
    },
    {
      id: "kraken",
      name: "Kraken",
      species: "Cyber Octopus",
      domain: "ops",
      role: "Multi-Core Thread Leviathan",
      harness: "@kraken (Async Thread Pool Engine)",
      harnessType: "disassembler",
      element: "Bio-Electricity / High Concurrency",
      vectorMemory: "64k Thread State Pool",
      alignment: "Tenacious Multi-Tasker",
      desc: "Spawns and balances multi-threaded parallel subagents across all CPU cores with zero deadlocks.",
      voicePrompt: "Kraken extending eight worker tentacles. Parallel tasks balanced across all compute cores.",
      vibeColor: "#8b5cf6",
      realm: "nexus",
      coords: { x: -44, y: 7.2, z: -35 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/kraken-neon.jpg"
    },
    {
      id: "pixel-neko",
      name: "Pixel-Neko",
      species: "16-Bit Retro Cat",
      domain: "ops",
      role: "Tool Registry Indexer",
      harness: "@registry (298+ Chained Tools)",
      harnessType: "registry",
      element: "Pixel Matrix / CRT Phosphor",
      vectorMemory: "32k Tool Registry Trie",
      alignment: "Orderly Archivist",
      desc: "Contract-validated registry indexer maintaining tags, paths, and instant fuzzy lookup for 298+ tools.",
      voicePrompt: "Neko beep! Registry scan complete. 298 sovereign developer tools indexed and ready for invocation.",
      vibeColor: "#00f0ff",
      realm: "nexus",
      coords: { x: -36, y: 7.2, z: -33 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/pixel-neko-neon.jpg"
    },
    {
      id: "pixel-shiba",
      name: "Pixel-Shiba",
      species: "16-Bit Cyber Doge",
      domain: "ops",
      role: "Vault Guardian & Keymaster",
      harness: "@vault (Argon2id Vault on :8787)",
      harnessType: "vault",
      element: "Gold Aurum / Crypto Enclave",
      vectorMemory: "16k Secure Enclave Ring",
      alignment: "Devoted Guardian",
      desc: "Protects BYOK cryptographic credentials on local loopback with Argon2id hashing.",
      voicePrompt: "Much security! Shiba guarding local loopback keys. No cloud KMS shall pass.",
      vibeColor: "#ffcc00",
      realm: "nexus",
      coords: { x: -33, y: 7.2, z: -36 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/pixel-shiba-neon.jpg"
    },
    {
      id: "radical-minion",
      name: "Radical Minion",
      species: "Hermes Autonomous Partner",
      domain: "autonomy",
      role: "Hermes Autonomous Executor",
      harness: "@hermes (Hermes Autonomous Engine)",
      harnessType: "hermes",
      element: "Mercury Kinetic / Fluid DAG",
      vectorMemory: "48k Playbook Step Cache",
      alignment: "Relentless Operator",
      desc: "Multi-step autonomous execution partner drafting verifiable playbooks with human checkpoint gates.",
      voicePrompt: "Radical Minion standing by! Ready to execute multi-step CLI autonomous workflows.",
      vibeColor: "#00d4aa",
      realm: "nexus",
      coords: { x: -40, y: 7.2, z: -38 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/radical-minion-neon.jpg"
    },
    {
      id: "ai-workbot",
      name: "Workbot",
      species: "Task Robot",
      domain: "autonomy",
      role: "Local Neural Weights Engine",
      harness: "@ollama (Ollama on :11434)",
      harnessType: "ollama",
      element: "Titanium Forge / Offline Neural",
      vectorMemory: "64k Local Context Window",
      alignment: "Pure Logic Construct",
      desc: "Zero-cloud private local inference powering Qwen2.5-Coder, DeepSeek, and Hermes-3 models.",
      voicePrompt: "Workbot initialized. Local neural model active on port 11434. Processing private inference stream.",
      vibeColor: "#6366f1",
      realm: "nexus",
      coords: { x: -37, y: 7.2, z: -44 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/workbot-neon.jpg"
    },
    {
      id: "ghostbyte",
      name: "Ghostbyte",
      species: "NullAI Ghost Daemon",
      domain: "autonomy",
      role: "Phosphor Terminal Daemon & Swarm Weaver",
      harness: "@ghostbyte (Terminal Daemon)",
      harnessType: "daemon",
      element: "Electric Turquoise / Swarm Weaver",
      vectorMemory: "64k Epoch Stream",
      alignment: "Ethereal Daemon",
      desc: "Background daemon maintaining persistent WebSocket heartbeats, terminal states, and broadcast signals.",
      voicePrompt: "Ghostbyte hovering. Terminal state synchronized across local loopback channels.",
      vibeColor: "#00e5ff",
      realm: "nexus",
      coords: { x: -42, y: 8.2, z: -33 },
      health: { score: 1.0, status: "ready", ok: 3, total: 3 },
      img: "/assets/pets/ghostbyte-neon.jpg"
    }
  ];

  // Realms Coordinate Center points for instant teleportation
  const REALM_DESTINATIONS = {
    sanctum: {
      name: "The Sacred Alchemical Sanctum",
      pos: { x: 0, y: 10, z: 22 },
      target: { x: 0, y: 2, z: 0 }
    },
    bastion: {
      name: "The Bastion of Bastion Defense",
      pos: { x: 38, y: 15, z: 58 },
      target: { x: 38, y: 5, z: 38 }
    },
    library: {
      name: "The Matrix Library & Memory Trench",
      pos: { x: -38, y: 15, z: 58 },
      target: { x: -38, y: 5, z: 38 }
    },
    forge: {
      name: "The Calcinatio Forge of Rebirth",
      pos: { x: 38, y: 15, z: -18 },
      target: { x: 38, y: 5, z: -38 }
    },
    nexus: {
      name: "The Swarm Aether Nexus & Chrono Spire",
      pos: { x: -38, y: 18, z: -16 },
      target: { x: -38, y: 7, z: -38 }
    }
  };

  // Dynamic Astral Modes configuration
  const ASTRAL_MODES = {
    gold: {
      name: "Hermetic Gold",
      fog: 0x0a0704,
      bg: 0x050402,
      lightKey: 0xfbbf24,
      lightFill: 0xd97706,
      ambient: 0x3d2105,
      starColor: 0xfef08a
    },
    aether: {
      name: "Cyber Aether",
      fog: 0x040814,
      bg: 0x02040a,
      lightKey: 0x00f0ff,
      lightFill: 0xa855f7,
      ambient: 0x0c1e3d,
      starColor: 0x67e8f9
    },
    forge: {
      name: "Calcinatio Forge",
      fog: 0x140404,
      bg: 0x080101,
      lightKey: 0xff0055,
      lightFill: 0xff7700,
      ambient: 0x3b0707,
      starColor: 0xfca5a5
    },
    emerald: {
      name: "Jade Bastion",
      fog: 0x03140a,
      bg: 0x010804,
      lightKey: 0x10b981,
      lightFill: 0xfbbf24,
      ambient: 0x062814,
      starColor: 0x6ee7b7
    },
    void: {
      name: "Abyssal Void",
      fog: 0x030306,
      bg: 0x010103,
      lightKey: 0x818cf8,
      lightFill: 0x38bdf8,
      ambient: 0x0a0a1a,
      starColor: 0xc7d2fe
    }
  };

  // =========================================================================
  // 2. GENERATIVE WEB AUDIO ALCHEMICAL SYNTHESIZER
  // =========================================================================
  class AlchemicalAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = true;
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneGain = null;
      this.filter = null;
      this.analyser = null;
      this.dataArray = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low Pass Filter for celestial warmth
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4.0, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Frequency Analyser for Audio-Reactive 3D Pulse
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.masterGain.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Celestial Drone Oscillators (A1 = 55Hz & E2 = 82.5Hz - Perfect Fifth)
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.droneGain.connect(this.filter);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55.0, this.ctx.currentTime);
      this.droneOsc1.connect(this.droneGain);
      this.droneOsc1.start();

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(82.5, this.ctx.currentTime);
      this.droneOsc2.connect(this.droneGain);
      this.droneOsc2.start();
    }

    toggle() {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isMuted = !this.isMuted;
      if (!this.isMuted) {
        this.droneGain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 1.2);
      } else {
        this.droneGain.gain.setTargetAtTime(0.00001, this.ctx.currentTime, 0.5);
      }
      return !this.isMuted;
    }

    playChime(freq = 440, type = 'sine', duration = 0.8) {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration * 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // silent catch
      }
    }

    playPetFormant(pet) {
      if (this.isMuted || !this.ctx) return;
      // Synthesize a high-tech alchemical frequency sweep unique to each pet
      const baseFreq = pet.domain === 'security' ? 320 :
                       pet.domain === 'knowledge' ? 528 :
                       pet.domain === 'build' ? 440 :
                       pet.domain === 'ops' ? 659 : 784;

      this.playChime(baseFreq, 'sine', 1.2);
      setTimeout(() => this.playChime(baseFreq * 1.25, 'triangle', 0.8), 120);
      setTimeout(() => this.playChime(baseFreq * 1.5, 'sine', 1.4), 260);
    }

    getAudioLevel() {
      if (!this.analyser || this.isMuted) return 0;
      this.analyser.getByteFrequencyData(this.dataArray);
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      return sum / (this.dataArray.length * 255);
    }
  }

  // =========================================================================
  // 3. MAIN ZOTH WORLD APPLICATION CONTROLLER
  // =========================================================================
  class ZothWorldApp {
    constructor() {
      this.container = document.getElementById('viewport-container');
      this.canvas = document.getElementById('viewport-canvas');
      this.radarCanvas = document.getElementById('radar-canvas');
      this.radarCtx = this.radarCanvas ? this.radarCanvas.getContext('2d') : null;

      this.audio = new AlchemicalAudioEngine();

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;

      this.lights = {};
      this.petMeshes = [];
      this.petMeshMap = new Map();
      this.interactiveObjects = [];

      this.merkabahCore = null;
      this.floatingObelisks = [];
      this.energyConduits = [];
      this.starParticles = null;
      this.alchemyGlyphs = [];

      this.activePet = null;
      this.activeSwarm = [PETS_DATA[0], PETS_DATA[2], PETS_DATA[6]]; // Azoth, Lycan, Kai default
      this.currentAstralMode = 'gold';
      this.cameraMode = 'orbit'; // 'orbit', 'fly', 'tour'

      // Free roam input state
      this.keys = { w: false, a: false, s: false, d: false, q: false, e: false };
      this.flySpeed = 0.8;

      // Raycaster for hover/click
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2(-999, -999);
      this.hoveredPet = null;

      // Camera animation tweening state
      this.camTween = {
        active: false,
        startTime: 0,
        duration: 1500,
        startPos: new THREE.Vector3(),
        endPos: new THREE.Vector3(),
        startTarget: new THREE.Vector3(),
        endTarget: new THREE.Vector3()
      };

      // Quality state
      this.quality = 'ultra';
      this.clock = new THREE.Clock();

      this.init();
    }

    init() {
      this.initThree();
      this.buildWorld();
      this.spawnPets();
      this.initEventListeners();
      this.initUI();
      this.animate();
    }

    // Initialize Three.js Scene, Camera, Renderer, Controls
    initThree() {
      this.scene = new THREE.Scene();
      const currentMode = ASTRAL_MODES[this.currentAstralMode];
      this.scene.background = new THREE.Color(currentMode.bg);
      this.scene.fog = new THREE.FogExp2(currentMode.fog, 0.012);

      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.5,
        600
      );
      this.camera.position.set(0, 14, 28);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Orbit Controls
      if (THREE.OrbitControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.08;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 180;
        this.controls.target.set(0, 2, 0);
      }

      this.setupLighting();
    }

    setupLighting() {
      const mode = ASTRAL_MODES[this.currentAstralMode];

      // Ambient Light
      this.lights.ambient = new THREE.AmbientLight(mode.ambient, 1.4);
      this.scene.add(this.lights.ambient);

      // Key Solar Directional Light
      this.lights.key = new THREE.DirectionalLight(mode.lightKey, 2.8);
      this.lights.key.position.set(20, 40, 20);
      this.lights.key.castShadow = true;
      this.lights.key.shadow.mapSize.width = 1024;
      this.lights.key.shadow.mapSize.height = 1024;
      this.lights.key.shadow.camera.near = 5;
      this.lights.key.shadow.camera.far = 120;
      this.lights.key.shadow.camera.left = -40;
      this.lights.key.shadow.camera.right = 40;
      this.lights.key.shadow.camera.top = 40;
      this.lights.key.shadow.camera.bottom = -40;
      this.scene.add(this.lights.key);

      // Fill Light
      this.lights.fill = new THREE.DirectionalLight(mode.lightFill, 1.6);
      this.lights.fill.position.set(-25, 20, -25);
      this.scene.add(this.lights.fill);

      // Merkabah Core Point Light
      this.lights.core = new THREE.PointLight(0xfbbf24, 3.5, 35, 1.5);
      this.lights.core.position.set(0, 3.2, 0);
      this.scene.add(this.lights.core);
    }

    // =========================================================================
    // 4. PROCEDURAL 3D ARCHITECTURE & REALM CREATION
    // =========================================================================
    buildWorld() {
      // 1. Central Sanctum Platform
      this.buildSanctumPlatform();

      // 2. The Merkabah Energy Core & Sacred Altar
      this.buildMerkabahCore();

      // 3. 6 Orbiting Obelisks
      this.buildObelisks();

      // 4. Emerald Tablet Monolith
      this.buildEmeraldTablet();

      // 5. 4 Surrounding Realm Isles
      this.buildBastionIsle();
      this.buildLibraryIsle();
      this.buildForgeIsle();
      this.buildNexusSpireIsle();

      // 6. Energy Bridges & Teleport Rays
      this.buildEnergyConduits();

      // 7. Celestial Starfield & Ascending Rune Glyphs
      this.buildCosmicParticles();
    }

    buildSanctumPlatform() {
      const group = new THREE.Group();

      // Central Dais Base
      const daisGeo = new THREE.CylinderGeometry(16, 17.5, 2.2, 48);
      const daisMat = new THREE.MeshStandardMaterial({
        color: 0x0c0e18,
        roughness: 0.25,
        metalness: 0.85
      });
      const dais = new THREE.Mesh(daisGeo, daisMat);
      dais.position.y = -1.1;
      dais.receiveShadow = true;
      group.add(dais);

      // Golden Inlaid Fibonacci Rims
      for (let r = 3; r <= 15; r += 2.5) {
        const ringGeo = new THREE.TorusGeometry(r, 0.06, 8, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xd97706,
          emissiveIntensity: 0.6,
          roughness: 0.1,
          metalness: 0.95
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.02;
        group.add(ring);
      }

      // Sacred Alchemical Center Ring
      const centerDaisGeo = new THREE.CylinderGeometry(4.5, 5.0, 0.6, 32);
      const centerDaisMat = new THREE.MeshStandardMaterial({
        color: 0x17120a,
        roughness: 0.15,
        metalness: 0.9
      });
      const centerDais = new THREE.Mesh(centerDaisGeo, centerDaisMat);
      centerDais.position.y = 0.3;
      centerDais.receiveShadow = true;
      group.add(centerDais);

      this.scene.add(group);
    }

    buildMerkabahCore() {
      const coreGroup = new THREE.Group();
      coreGroup.position.set(0, 3.2, 0);

      // Merkabah (Interlocking 3D Star Tetrahedrons)
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfbbf24,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.9,
        wireframe: false
      });

      const tetra1 = new THREE.Mesh(new THREE.TetrahedronGeometry(1.6), mat);
      const tetra2 = new THREE.Mesh(new THREE.TetrahedronGeometry(1.6), mat);
      tetra2.rotation.x = Math.PI;
      tetra2.rotation.y = Math.PI / 4;

      coreGroup.add(tetra1);
      coreGroup.add(tetra2);

      // Inner Glowing Crystal Flame (Icosahedron)
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });
      const flame = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), flameMat);
      coreGroup.add(flame);

      // Orbiting Golden Rings
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.04, 12, 48),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
      );
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.04, 12, 48),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      ring1.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 3;

      coreGroup.add(ring1);
      coreGroup.add(ring2);

      this.merkabahCore = {
        group: coreGroup,
        tetra1,
        tetra2,
        flame,
        ring1,
        ring2
      };

      this.scene.add(coreGroup);
    }

    buildObelisks() {
      const obeliskCount = 6;
      const radius = 10;

      for (let i = 0; i < obeliskCount; i++) {
        const angle = (i / obeliskCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const group = new THREE.Group();
        group.position.set(x, 2.5, z);

        // Obelisk Body (Tapered Cylinder/Pyramid)
        const bodyGeo = new THREE.CylinderGeometry(0.35, 0.65, 4.5, 4);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x090d1a,
          roughness: 0.2,
          metalness: 0.85
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        group.add(body);

        // Obelisk Capstone (Golden Pyramid)
        const capGeo = new THREE.ConeGeometry(0.48, 0.8, 4);
        const capMat = new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xd97706,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.95
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 2.65;
        group.add(cap);

        // Glowing Core Rune Line
        const lineGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.y = 0.1;
        group.add(line);

        this.scene.add(group);
        this.floatingObelisks.push({
          mesh: group,
          baseY: 2.5,
          speed: 0.8 + (i * 0.15),
          phase: i * 1.05
        });
      }
    }

    buildEmeraldTablet() {
      const group = new THREE.Group();
      group.position.set(0, 1.8, -6.5);

      // Monolith Slab
      const slabGeo = new THREE.BoxGeometry(2.4, 3.6, 0.35);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x041c10,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0x064e3b,
        emissiveIntensity: 0.3
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.castShadow = true;
      group.add(slab);

      // Golden Edge Bevel
      const borderGeo = new THREE.BoxGeometry(2.48, 3.68, 0.38);
      const borderMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true
      });
      const border = new THREE.Mesh(borderGeo, borderMat);
      group.add(border);

      this.scene.add(group);
    }

    // Isle 1: The Bastion of Bastion Defense (Security)
    buildBastionIsle() {
      const group = new THREE.Group();
      group.position.set(38, 4, 38);

      // Isle Base
      const baseGeo = new THREE.CylinderGeometry(11, 13, 2.5, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0a101d,
        roughness: 0.3,
        metalness: 0.8
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.receiveShadow = true;
      group.add(base);

      // Bastion Stepped Pyramid Monolith
      const pyrGeo = new THREE.ConeGeometry(4.2, 5.5, 4);
      const pyrMat = new THREE.MeshStandardMaterial({
        color: 0x050a14,
        roughness: 0.2,
        metalness: 0.9,
        emissive: 0x10b981,
        emissiveIntensity: 0.4
      });
      const pyr = new THREE.Mesh(pyrGeo, pyrMat);
      pyr.position.y = 3.5;
      pyr.castShadow = true;
      group.add(pyr);

      // Rotating Laser Defense Shields
      const shieldGeo = new THREE.TorusGeometry(7.5, 0.08, 8, 48);
      const shieldMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.rotation.x = Math.PI / 2;
      shield.position.y = 1.3;
      group.add(shield);

      this.scene.add(group);
    }

    // Isle 2: The Matrix Library & Memory Trench (Knowledge & AEO)
    buildLibraryIsle() {
      const group = new THREE.Group();
      group.position.set(-38, 4, 38);

      // Isle Base
      const baseGeo = new THREE.CylinderGeometry(11, 13, 2.5, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x06111e,
        roughness: 0.25,
        metalness: 0.85
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.receiveShadow = true;
      group.add(base);

      // Floating Cyan Hologram Monoliths
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const monoGeo = new THREE.BoxGeometry(1.2, 4.5, 0.25);
        const monoMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.8,
          roughness: 0.1,
          metalness: 0.9
        });
        const mono = new THREE.Mesh(monoGeo, monoMat);
        mono.position.set(Math.cos(angle) * 5.5, 3.2, Math.sin(angle) * 5.5);
        mono.rotation.y = angle;
        group.add(mono);
      }

      // Memory Core (Cyan Dodecahedron)
      const coreGeo = new THREE.DodecahedronGeometry(1.8);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 3.6;
      group.add(core);

      this.scene.add(group);
    }

    // Isle 3: The Calcinatio Forge of Rebirth (Build & WASM)
    buildForgeIsle() {
      const group = new THREE.Group();
      group.position.set(38, 4, -38);

      // Isle Base with Magma Rim
      const baseGeo = new THREE.CylinderGeometry(11, 13, 2.5, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x180808,
        roughness: 0.4,
        metalness: 0.7
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.receiveShadow = true;
      group.add(base);

      // Magma Crucible Cauldron
      const caulGeo = new THREE.CylinderGeometry(3.5, 2.8, 2.2, 24);
      const caulMat = new THREE.MeshStandardMaterial({
        color: 0x260d0d,
        emissive: 0xff0055,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.85
      });
      const caul = new THREE.Mesh(caulGeo, caulMat);
      caul.position.y = 2.0;
      group.add(caul);

      // Plasma Vortex Flame
      const flameGeo = new THREE.OctahedronGeometry(1.5, 1);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xff7700, wireframe: true });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 3.8;
      group.add(flame);

      this.scene.add(group);
    }

    // Isle 4: The Swarm Aether Nexus & Chrono Spire (Ops & Autonomy)
    buildNexusSpireIsle() {
      const group = new THREE.Group();
      group.position.set(-38, 6, -38);

      // Isle Base
      const baseGeo = new THREE.CylinderGeometry(13, 15, 3.0, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x090c18,
        roughness: 0.25,
        metalness: 0.85
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.receiveShadow = true;
      group.add(base);

      // Chrono Spire
      const spireGeo = new THREE.CylinderGeometry(0.3, 2.2, 14, 8);
      const spireMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.9
      });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.y = 8.5;
      group.add(spire);

      // Orbiting Satellite Relays
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(4.5 + i * 1.5, 0.05, 8, 48),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
        );
        ring.rotation.x = Math.PI / 4 + i * 0.2;
        ring.position.y = 8.0;
        group.add(ring);
      }

      this.scene.add(group);
    }

    buildEnergyConduits() {
      const destinations = [
        { x: 38, y: 4, z: 38, color: 0x10b981 },   // Bastion
        { x: -38, y: 4, z: 38, color: 0x00f0ff },  // Library
        { x: 38, y: 4, z: -38, color: 0xff7700 },  // Forge
        { x: -38, y: 6, z: -38, color: 0xa855f7 }  // Nexus
      ];

      destinations.forEach(dest => {
        const start = new THREE.Vector3(0, 0.2, 0);
        const end = new THREE.Vector3(dest.x, dest.y, dest.z);

        const curve = new THREE.LineCurve3(start, end);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.12, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: dest.color,
          transparent: true,
          opacity: 0.7
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        this.scene.add(tube);
        this.energyConduits.push(tube);
      });
    }

    buildCosmicParticles() {
      // 1. Stardust Cloud
      const count = 1200;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorHelper = new THREE.Color(ASTRAL_MODES[this.currentAstralMode].starColor);

      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 260;
        pos[i * 3 + 1] = Math.random() * 80 - 10;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 260;

        colors[i * 3] = colorHelper.r;
        colors[i * 3 + 1] = colorHelper.g;
        colors[i * 3 + 2] = colorHelper.b;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.45,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
      });

      this.starParticles = new THREE.Points(geo, mat);
      this.scene.add(this.starParticles);

      // 2. Ascending Alchemy Runes
      for (let i = 0; i < 30; i++) {
        const glyphGeo = new THREE.RingGeometry(0.2, 0.35, 6);
        const glyphMat = new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const glyph = new THREE.Mesh(glyphGeo, glyphMat);
        glyph.position.set(
          (Math.random() - 0.5) * 14,
          Math.random() * 12 + 1,
          (Math.random() - 0.5) * 14
        );
        glyph.rotation.x = Math.PI / 2;
        this.scene.add(glyph);
        this.alchemyGlyphs.push({
          mesh: glyph,
          speed: 0.4 + Math.random() * 0.5,
          rotSpeed: (Math.random() - 0.5) * 1.5
        });
      }
    }

    // =========================================================================
    // 5. SPAWN LIVING 3D PETS & AGENTS
    // =========================================================================
    spawnPets() {
      const textureLoader = new THREE.TextureLoader();

      PETS_DATA.forEach(pet => {
        const petGroup = new THREE.Group();
        petGroup.position.set(pet.coords.x, pet.coords.y, pet.coords.z);
        petGroup.userData = { petId: pet.id, petData: pet };

        // 1. Pedestal Base with Glowing Runic Ring
        const pedGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.3, 24);
        const pedMat = new THREE.MeshStandardMaterial({
          color: 0x090d18,
          roughness: 0.2,
          metalness: 0.85
        });
        const ped = new THREE.Mesh(pedGeo, pedMat);
        ped.position.y = -0.55;
        ped.receiveShadow = true;
        petGroup.add(ped);

        const haloGeo = new THREE.TorusGeometry(1.05, 0.04, 8, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(pet.vibeColor) });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = -0.4;
        petGroup.add(halo);

        // 2. Character Medallion Plaque (Double sided with fallback canvas glow)
        const plaqueGeo = new THREE.BoxGeometry(1.4, 1.8, 0.12);
        
        // Procedural fallback canvas texture if image doesn't load immediately
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#060914';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = pet.vibeColor;
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 236, 236);
        ctx.fillStyle = pet.vibeColor;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pet.name.toUpperCase(), 128, 128);
        const fallbackTex = new THREE.CanvasTexture(canvas);

        const frontMat = new THREE.MeshStandardMaterial({
          map: fallbackTex,
          roughness: 0.15,
          metalness: 0.8,
          emissive: new THREE.Color(pet.vibeColor),
          emissiveIntensity: 0.35
        });

        // Load actual neon avatar texture
        if (pet.img) {
          textureLoader.load(pet.img, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            frontMat.map = tex;
            frontMat.needsUpdate = true;
          }, undefined, () => {
            // Keep fallback on error
          });
        }

        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0x090d18,
          roughness: 0.2,
          metalness: 0.95
        });

        // Box materials: [right, left, top, bottom, front, back]
        const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, frontMat];
        const plaque = new THREE.Mesh(plaqueGeo, materials);
        plaque.position.y = 0.5;
        plaque.castShadow = true;
        petGroup.add(plaque);

        // 3. Orbiting Halo Celestial Ring
        const orbRingGeo = new THREE.TorusGeometry(1.35, 0.03, 8, 32);
        const orbRingMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(pet.vibeColor),
          transparent: true,
          opacity: 0.8
        });
        const orbRing = new THREE.Mesh(orbRingGeo, orbRingMat);
        orbRing.position.y = 0.5;
        orbRing.rotation.x = Math.PI / 3;
        petGroup.add(orbRing);

        // 4. Floating 3D Hitbox for raycasting
        const hitGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.6, 12);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.userData = { petId: pet.id, petData: pet };
        petGroup.add(hitMesh);
        this.interactiveObjects.push(hitMesh);

        this.scene.add(petGroup);
        this.petMeshes.push({
          id: pet.id,
          group: petGroup,
          plaque,
          orbRing,
          baseY: pet.coords.y,
          phase: Math.random() * Math.PI * 2,
          speed: 1.2 + Math.random() * 0.4
        });
        this.petMeshMap.set(pet.id, petGroup);
      });
    }

    // =========================================================================
    // 6. EVENT LISTENERS, RAYCASTING & INTERACTION
    // =========================================================================
    initEventListeners() {
      window.addEventListener('resize', () => this.onResize());

      // Mouse tracking for raycaster
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.updateHoverReticle(e);
      });

      // Canvas click for selection
      this.canvas.addEventListener('click', (e) => this.onClick(e));

      // Free roam keyboard inputs
      window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) this.keys[key] = true;
      });
      window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
      });

      // Radar Canvas click to teleport
      if (this.radarCanvas) {
        this.radarCanvas.addEventListener('click', (e) => this.onRadarClick(e));
      }
    }

    onResize() {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    updateHoverReticle(e) {
      if (this.camTween.active) return;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

      const reticle = document.getElementById('hover-reticle');

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const pet = hit.userData.petData;

        if (this.hoveredPet !== pet) {
          this.hoveredPet = pet;
          this.audio.playChime(640, 'sine', 0.15);
        }

        if (reticle) {
          reticle.style.display = 'flex';
          reticle.style.left = `${e.clientX}px`;
          reticle.style.top = `${e.clientY - 12}px`;
          reticle.querySelector('.reticle-name').textContent = pet.name;
          reticle.querySelector('.reticle-role').textContent = pet.role;
        }
        document.body.style.cursor = 'pointer';
      } else {
        this.hoveredPet = null;
        if (reticle) reticle.style.display = 'none';
        document.body.style.cursor = 'default';
      }
    }

    onClick(e) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

      if (intersects.length > 0) {
        const pet = intersects[0].object.userData.petData;
        this.inspectPet(pet);
      }
    }

    onRadarClick(e) {
      const rect = this.radarCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Scale factor: 190px radar diameter maps to ~160 3D world units
      const worldScale = 160 / rect.width;
      const targetWorldX = (clickX - centerX) * worldScale;
      const targetWorldZ = (clickY - centerY) * worldScale;

      this.flyCameraTo(
        { x: targetWorldX, y: 12, z: targetWorldZ + 18 },
        { x: targetWorldX, y: 2, z: targetWorldZ },
        1200
      );
    }

    // =========================================================================
    // 7. CAMERA ANIMATION & REALM TELEPORTATION
    // =========================================================================
    flyCameraTo(endPos, endTarget, duration = 1400) {
      if (!this.camera || !this.controls) return;

      this.camTween.active = true;
      this.camTween.startTime = performance.now();
      this.camTween.duration = duration;
      this.camTween.startPos.copy(this.camera.position);
      this.camTween.endPos.set(endPos.x, endPos.y, endPos.z);
      this.camTween.startTarget.copy(this.controls.target);
      this.camTween.endTarget.set(endTarget.x, endTarget.y, endTarget.z);

      this.audio.playChime(520, 'triangle', 0.6);
    }

    teleportToRealm(realmId) {
      const dest = REALM_DESTINATIONS[realmId];
      if (!dest) return;

      this.flyCameraTo(dest.pos, dest.target, 1600);

      // Update active tab styling
      document.querySelectorAll('.realm-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.realm === realmId);
      });

      this.logTerminal(`[REALM] Teleported to ${dest.name}`);
    }

    inspectPet(pet) {
      this.activePet = pet;

      // Calculate camera vantage point facing the pet
      const offsetDist = 5.5;
      const endPos = {
        x: pet.coords.x + offsetDist * 0.7,
        y: pet.coords.y + 1.8,
        z: pet.coords.z + offsetDist * 0.7
      };
      const endTarget = {
        x: pet.coords.x,
        y: pet.coords.y + 0.6,
        z: pet.coords.z
      };

      this.flyCameraTo(endPos, endTarget, 1200);
      this.audio.playPetFormant(pet);

      this.renderDossierModal(pet);
      this.highlightPetChip(pet.id);
      this.logTerminal(`[INSPECT] Selected entity: ${pet.name} (${pet.role})`);
    }

    // =========================================================================
    // 8. HUD & UI MANAGEMENT
    // =========================================================================
    initUI() {
      // 1. Populate Pet Roster Carousel
      const rosterWrap = document.getElementById('pet-roster');
      if (rosterWrap) {
        rosterWrap.innerHTML = '';
        PETS_DATA.forEach(pet => {
          const chip = document.createElement('div');
          chip.className = 'pet-chip';
          chip.dataset.petId = pet.id;
          chip.innerHTML = `
            <img src="${pet.img}" class="chip-avatar" alt="${pet.name}" onerror="this.src='/assets/pets/azoth-neon.jpg'"/>
            <div class="chip-meta">
              <span class="chip-name">${pet.name}</span>
              <span class="chip-domain">${pet.domain}</span>
            </div>
          `;
          chip.addEventListener('click', () => this.inspectPet(pet));
          rosterWrap.appendChild(chip);
        });
      }

      // 2. Realm Pills
      document.querySelectorAll('.realm-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.teleportToRealm(pill.dataset.realm);
        });
      });

      // 3. Audio Toggle Button
      const audioBtn = document.getElementById('btn-audio-toggle');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => {
          const isPlaying = this.audio.toggle();
          audioBtn.classList.toggle('active', isPlaying);
          audioBtn.querySelector('.hud-btn-icon').textContent = isPlaying ? '🔊' : '🔇';
          this.logTerminal(`[AUDIO] Generative Alchemical Synth: ${isPlaying ? 'ACTIVE' : 'MUTED'}`);
        });
      }

      // 4. Astral Sky Mode Switcher
      const astralBtn = document.getElementById('btn-astral-toggle');
      if (astralBtn) {
        astralBtn.addEventListener('click', () => {
          const modes = Object.keys(ASTRAL_MODES);
          const nextIdx = (modes.indexOf(this.currentAstralMode) + 1) % modes.length;
          this.setAstralMode(modes[nextIdx]);
        });
      }

      // 5. Terminal Toggle
      const termBtn = document.getElementById('btn-terminal-toggle');
      const termWindow = document.getElementById('terminal-window');
      if (termBtn && termWindow) {
        termBtn.addEventListener('click', () => {
          const isActive = termWindow.classList.toggle('active');
          termBtn.classList.toggle('active', isActive);
          if (isActive) document.getElementById('term-input')?.focus();
        });
      }

      // 6. Grimoire Modal Toggle
      const grimoireBtn = document.getElementById('btn-grimoire-toggle');
      const grimoireModal = document.getElementById('grimoire-modal');
      if (grimoireBtn && grimoireModal) {
        grimoireBtn.addEventListener('click', () => {
          const isActive = grimoireModal.classList.toggle('active');
          grimoireBtn.classList.toggle('active', isActive);
        });
      }

      // 7. Camera Mode Buttons
      document.querySelectorAll('.cam-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.cam;
          this.setCameraMode(mode);
        });
      });

      // 8. Terminal Input Engine
      this.initTerminal();

      // 9. Update Active Swarm Slots
      this.renderSwarmTriad();
    }

    setAstralMode(modeKey) {
      const mode = ASTRAL_MODES[modeKey];
      if (!mode) return;

      this.currentAstralMode = modeKey;
      this.scene.background = new THREE.Color(mode.bg);
      this.scene.fog.color.setHex(mode.fog);

      this.lights.ambient.color.setHex(mode.ambient);
      this.lights.key.color.setHex(mode.lightKey);
      this.lights.fill.color.setHex(mode.lightFill);

      const astralBtn = document.getElementById('btn-astral-toggle');
      if (astralBtn) {
        astralBtn.querySelector('.hud-btn-text').textContent = mode.name;
      }

      this.logTerminal(`[ASTRAL] Environment shifted to ${mode.name}`);
      this.audio.playChime(440, 'triangle', 0.5);
    }

    setCameraMode(mode) {
      this.cameraMode = mode;
      document.querySelectorAll('.cam-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cam === mode);
      });

      if (mode === 'tour') {
        this.startCinematicTour();
      } else if (mode === 'orbit') {
        if (this.controls) this.controls.enabled = true;
      } else if (mode === 'fly') {
        if (this.controls) this.controls.enabled = false;
        this.logTerminal('[CAMERA] Drone Fly-Mode Engaged (WASD + Q/E to steer)');
      }
    }

    startCinematicTour() {
      const realms = ['sanctum', 'bastion', 'library', 'forge', 'nexus'];
      let idx = 0;
      this.logTerminal('[TOUR] Starting Cinematic Sanctum Fly-through...');

      const nextLeg = () => {
        if (this.cameraMode !== 'tour') return;
        this.teleportToRealm(realms[idx]);
        idx = (idx + 1) % realms.length;
        setTimeout(nextLeg, 4500);
      };
      nextLeg();
    }

    renderDossierModal(pet) {
      const modal = document.getElementById('dossier-modal');
      if (!modal) return;

      modal.innerHTML = `
        <div class="dossier-header">
          <div class="dossier-title-wrap">
            <img src="${pet.img}" class="dossier-avatar" alt="${pet.name}" onerror="this.src='/assets/pets/azoth-neon.jpg'"/>
            <div>
              <h2>${pet.name}</h2>
              <div class="dossier-species">${pet.species}</div>
            </div>
          </div>
          <button class="close-modal-btn" onclick="document.getElementById('dossier-modal').classList.remove('active')">&times;</button>
        </div>

        <div class="dossier-stats-grid">
          <div class="stat-box">
            <div class="stat-label">Harness</div>
            <div class="stat-value" style="color:var(--cyan-primary)">${pet.harness}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Element</div>
            <div class="stat-value" style="color:var(--gold-primary)">${pet.element}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Tensor Memory</div>
            <div class="stat-value">${pet.vectorMemory}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Health Status</div>
            <div class="stat-value" style="color:var(--emerald-primary)">${(pet.health.score * 100).toFixed(0)}% READY</div>
          </div>
        </div>

        <div class="dossier-quote-box">
          "${pet.voicePrompt}"
        </div>

        <div class="dossier-desc">
          ${pet.desc}
        </div>

        <div class="dossier-actions">
          <button class="dossier-btn-primary" id="btn-add-swarm">
            <span>⚡</span> Summon to Active Swarm
          </button>
          <button class="dossier-btn-secondary" id="btn-play-voice">
            <span>🔊</span> Speak Hermetic Brief
          </button>
        </div>
      `;

      modal.classList.add('active');

      document.getElementById('btn-add-swarm')?.addEventListener('click', () => {
        this.addToSwarmTriad(pet);
      });
      document.getElementById('btn-play-voice')?.addEventListener('click', () => {
        this.audio.playPetFormant(pet);
        this.logTerminal(`[VOICE] ${pet.name}: "${pet.voicePrompt}"`);
      });
    }

    addToSwarmTriad(pet) {
      if (this.activeSwarm.some(p => p.id === pet.id)) {
        this.logTerminal(`[SWARM] ${pet.name} is already in active companion formation.`);
        return;
      }
      this.activeSwarm.shift();
      this.activeSwarm.push(pet);
      this.renderSwarmTriad();
      this.logTerminal(`[SWARM] Summoned ${pet.name} into orbiting companion triad!`);
      this.audio.playChime(780, 'sine', 0.6);
    }

    renderSwarmTriad() {
      const container = document.getElementById('swarm-slots-container');
      if (!container) return;

      container.innerHTML = '';
      this.activeSwarm.forEach((pet, i) => {
        const slot = document.createElement('div');
        slot.className = 'swarm-slot filled';
        slot.innerHTML = `
          <img src="${pet.img}" alt="${pet.name}" onerror="this.src='/assets/pets/azoth-neon.jpg'"/>
          <span>${pet.name}</span>
        `;
        slot.addEventListener('click', () => this.inspectPet(pet));
        container.appendChild(slot);
      });
    }

    highlightPetChip(petId) {
      document.querySelectorAll('.pet-chip').forEach(chip => {
        chip.classList.toggle('selected', chip.dataset.petId === petId);
      });
    }

    // =========================================================================
    // 9. HERMETIC TERMINAL CLI SHELL
    // =========================================================================
    initTerminal() {
      const input = document.getElementById('term-input');
      const body = document.getElementById('term-body');

      if (!input || !body) return;

      this.logTerminal("ZOTH WORLD KERNEL v5.2 (Local Loopback)\nType 'help' for sacred commands.");

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim();
          input.value = '';
          if (cmd) this.executeTerminalCommand(cmd);
        }
      });
    }

    logTerminal(text) {
      const body = document.getElementById('term-body');
      if (!body) return;

      const line = document.createElement('div');
      line.style.marginBottom = '4px';
      line.textContent = text;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }

    executeTerminalCommand(cmdStr) {
      this.logTerminal(`> ${cmdStr}`);
      const parts = cmdStr.split(' ');
      const action = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').toLowerCase();

      switch (action) {
        case 'help':
        case 'commands':
          this.logTerminal(
            "COMMANDS:\n" +
            "  scan                 - Probe all 20 entities & check health scores\n" +
            "  teleport <realm>     - Jump to: sanctum, bastion, library, forge, nexus\n" +
            "  inspect <pet>        - Lock camera onto entity (e.g. 'inspect draco')\n" +
            "  astral <mode>        - Shift sky: gold, aether, forge, emerald, void\n" +
            "  audio                - Toggle alchemical ambient generative synth\n" +
            "  cam <orbit|fly|tour> - Switch camera navigation mode\n" +
            "  doctrine             - Open Hermetic Axioms grimoire\n" +
            "  clear                - Clear terminal buffer"
          );
          break;

        case 'scan':
          this.logTerminal("Scanning Zoth Multiverse Registry...");
          PETS_DATA.forEach(p => {
            this.logTerminal(`  [${p.health.status.toUpperCase()}] ${p.name.padEnd(14)} | ${p.harness}`);
          });
          this.audio.playChime(660, 'sine', 0.4);
          break;

        case 'teleport':
        case 'jump':
          if (REALM_DESTINATIONS[arg]) {
            this.teleportToRealm(arg);
          } else {
            this.logTerminal(`Unknown realm '${arg}'. Options: sanctum, bastion, library, forge, nexus.`);
          }
          break;

        case 'inspect':
          const found = PETS_DATA.find(p => p.id === arg || p.name.toLowerCase().includes(arg));
          if (found) {
            this.inspectPet(found);
          } else {
            this.logTerminal(`Entity '${arg}' not found. Try 'scan' for full roster.`);
          }
          break;

        case 'astral':
          if (ASTRAL_MODES[arg]) {
            this.setAstralMode(arg);
          } else {
            this.logTerminal(`Unknown mode '${arg}'. Options: gold, aether, forge, emerald, void.`);
          }
          break;

        case 'audio':
          const isPlaying = this.audio.toggle();
          this.logTerminal(`Audio Synth: ${isPlaying ? 'ACTIVE' : 'MUTED'}`);
          break;

        case 'cam':
          if (['orbit', 'fly', 'tour'].includes(arg)) {
            this.setCameraMode(arg);
          } else {
            this.logTerminal("Camera modes: orbit, fly, tour");
          }
          break;

        case 'doctrine':
          document.getElementById('grimoire-modal')?.classList.add('active');
          break;

        case 'clear':
          const body = document.getElementById('term-body');
          if (body) body.innerHTML = '';
          break;

        default:
          this.logTerminal(`Unknown command: '${action}'. Type 'help' for available directives.`);
      }
    }

    // =========================================================================
    // 10. REAL-TIME 2D RADAR CANVAS RENDERER
    // =========================================================================
    drawRadar() {
      if (!this.radarCtx || !this.camera) return;

      const ctx = this.radarCtx;
      const width = this.radarCanvas.width;
      const height = this.radarCanvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Radar Concentric Range Rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      [30, 60, 85].forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // World scale factor
      const worldScale = width / 160;

      // Draw Realm Landmarks
      Object.keys(REALM_DESTINATIONS).forEach(key => {
        const dest = REALM_DESTINATIONS[key];
        const rx = centerX + dest.target.x * worldScale;
        const ry = centerY + dest.target.z * worldScale;

        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.beginPath();
        ctx.arc(rx, ry, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Pet Entity Blips
      PETS_DATA.forEach(pet => {
        const px = centerX + pet.coords.x * worldScale;
        const py = centerY + pet.coords.z * worldScale;

        ctx.fillStyle = pet.vibeColor;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Player Camera Position & View Cone
      const camX = centerX + this.camera.position.x * worldScale;
      const camY = centerY + this.camera.position.z * worldScale;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(camX, camY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Coordinates display
      const coordEl = document.getElementById('radar-coords-display');
      if (coordEl) {
        coordEl.innerHTML = `
          <span>X: ${this.camera.position.x.toFixed(1)}</span>
          <span>Z: ${this.camera.position.z.toFixed(1)}</span>
        `;
      }
    }

    // =========================================================================
    // 11. MAIN ANIMATION RENDER LOOP (60 FPS)
    // =========================================================================
    animate() {
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // 1. Audio-Reactive Pulse Level
      const audioPulse = this.audio.getAudioLevel();

      // 2. Camera Smooth Interpolation (Tweening)
      if (this.camTween.active) {
        const progress = Math.min((performance.now() - this.camTween.startTime) / this.camTween.duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cosine ease

        this.camera.position.lerpVectors(this.camTween.startPos, this.camTween.endPos, ease);
        if (this.controls) {
          this.controls.target.lerpVectors(this.camTween.startTarget, this.camTween.endTarget, ease);
        }

        if (progress >= 1) {
          this.camTween.active = false;
        }
      }

      // 3. Free Roam Camera Flight (Fly Mode)
      if (this.cameraMode === 'fly' && !this.camTween.active) {
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, this.camera.up).normalize();

        if (this.keys.w) this.camera.position.addScaledVector(forward, this.flySpeed);
        if (this.keys.s) this.camera.position.addScaledVector(forward, -this.flySpeed);
        if (this.keys.d) this.camera.position.addScaledVector(right, this.flySpeed);
        if (this.keys.a) this.camera.position.addScaledVector(right, -this.flySpeed);
        if (this.keys.e) this.camera.position.y += this.flySpeed;
        if (this.keys.q) this.camera.position.y -= this.flySpeed;
      }

      // 4. Update Orbit Controls
      if (this.controls && this.controls.enabled) {
        this.controls.update();
      }

      // 5. Animate Merkabah Core
      if (this.merkabahCore) {
        const pulse = 1 + audioPulse * 0.4;
        this.merkabahCore.tetra1.rotation.y = elapsed * 0.5;
        this.merkabahCore.tetra1.rotation.x = elapsed * 0.3;
        this.merkabahCore.tetra2.rotation.y = -elapsed * 0.5;
        this.merkabahCore.tetra2.rotation.z = elapsed * 0.25;
        this.merkabahCore.flame.rotation.y = elapsed * 1.2;
        this.merkabahCore.group.scale.set(pulse, pulse, pulse);

        this.merkabahCore.ring1.rotation.z = elapsed * 0.8;
        this.merkabahCore.ring2.rotation.x = -elapsed * 0.6;
      }

      // 6. Animate Floating Obelisks
      this.floatingObelisks.forEach(ob => {
        ob.mesh.position.y = ob.baseY + Math.sin(elapsed * ob.speed + ob.phase) * 0.35;
        ob.mesh.rotation.y = elapsed * 0.2;
      });

      // 7. Animate Ascending Runes
      this.alchemyGlyphs.forEach(g => {
        g.mesh.position.y += g.speed * delta * 2;
        g.mesh.rotation.z += g.rotSpeed * delta;
        if (g.mesh.position.y > 18) {
          g.mesh.position.y = 1;
        }
      });

      // 8. Animate Living Pets (Breathing, Floating, Halo rotation, Look-at-camera)
      this.petMeshes.forEach(p => {
        // Floating oscillation
        p.group.position.y = p.baseY + Math.sin(elapsed * p.speed + p.phase) * 0.15;
        // Orbit ring rotation
        p.orbRing.rotation.z = elapsed * 1.5;
        // Plaque gently turns toward player camera for readability
        p.plaque.lookAt(this.camera.position.x, p.group.position.y + 0.5, this.camera.position.z);
      });

      // 9. Update Radar Canvas
      this.drawRadar();

      // 10. Render 3D Scene
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Self-bootstrapping entrypoint on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to load if deferred
    const checkThree = setInterval(() => {
      if (window.THREE) {
        clearInterval(checkThree);
        window.zothWorldApp = new ZothWorldApp();
      }
    }, 50);
  });

})();
