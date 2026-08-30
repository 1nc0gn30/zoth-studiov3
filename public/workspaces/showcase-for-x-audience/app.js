/**
 * ZOTH STUDIO — 𝕏 AUDIENCE SHOWCASE & SOVEREIGN LAUNCHPAD ENGINE
 * Local-First Multi-Agent Autonomous Framework
 */

// ==========================================================================
// 1. DATASETS (Transmissions, 21 Agents, Terminal Simulations)
// ==========================================================================

const TRANSMISSIONS_DATA = [
  {
    id: 'sovereign-developer',
    category: 'viral',
    author: {
      name: 'Master Azoth ⚡',
      handle: '@zothstudio',
      avatar: 'assets/brand/zoth-golden-z-192.png',
      verified: true
    },
    date: '2h ago',
    text: `You don't need a $2M seed round or a 15-person engineering agency to build world-class software in 2026.\n\nYou need <strong>1 developer, 21 autonomous local agents, and a local terminal cockpit</strong>.\n\nHere is how 1 solo builder ships full-stack platforms with <a href="#terminal-section" class="x-tag">#ZothStudio</a> 🧵👇⚡`,
    media: {
      type: 'image',
      src: 'assets/screenshots/zoth_tui_cockpit_hd.png',
      alt: 'Zoth TUI Terminal Cockpit'
    },
    metrics: {
      replies: 342,
      retweets: 1890,
      likes: 8420,
      views: '284K'
    },
    workflowPreset: 'app',
    threadPosts: [
      "1/5: You don't need a $2M seed round or a 15-person engineering agency in 2026. You need 1 developer, 21 autonomous local agents, and a local terminal cockpit.",
      "2/5: Meet your 21-Agent Engineering Pantheon: Azoth (Architect), Solon (BFT Arbiter), Kai (Three.js Spatial), Cypher (Argon2id Vault), Nyx (Token Optimizer), Maya (Growth). All coordinated over an in-memory event bus.",
      "3/5: Quickstart in 4 steps:\n$ curl -fsSL https://zoth.nullai.tech/install.sh | bash\n$ zoth tui\n$ zoth start\n$ open http://127.0.0.1:8484",
      "4/5: The Sovereign Developer Manifesto:\n• No vendor lock-in\n• No recurring SaaS tax\n• Code writes directly to local Git\n• Works 100% offline at 35,000 feet.",
      "5/5: Stop renting intelligence from cloud monopolies. Reclaim your sovereignty today with @zothstudio."
    ]
  },
  {
    id: 'consensus-arena',
    category: 'benchmarks',
    author: {
      name: 'Solon Arbiter ⚖️',
      handle: '@solon_zoth',
      avatar: 'assets/pets/athena-neon.jpg',
      verified: true
    },
    date: '4h ago',
    text: `Single LLMs don't fail loudly. <strong>They fail confidently.</strong>\n\nWhen a single model generates 400 lines of auth or DB migrations, it hallucinates deprecations with 99.8% tone certainty.\n\nHere is how we solved hallucinations using <strong>3-way Byzantine Consensus Triangulation</strong> (Claude 3.7 + Grok-3 + Hermes 3) 🧵👇`,
    media: {
      type: 'image',
      src: 'assets/screenshots/zoth_swarm_arena_hd.png',
      alt: 'Zoth Swarm Consensus Arena'
    },
    metrics: {
      replies: 198,
      retweets: 1240,
      likes: 5610,
      views: '192K'
    },
    workflowPreset: 'consensus',
    threadPosts: [
      "1/5: Single LLMs don't fail loudly. They fail confidently. Softmax probabilities mask deprecations.",
      "2/5: In Consensus Arena v2, three model families (Claude 3.7, Grok-3, and local Hermes 3 via Ollama) independently synthesize isolated diff patches.",
      "3/5: Shannon Entropy Scoring: H(X) <= 0.35 threshold filters out chaotic token distributions before disk writes.",
      "4/5: Production Metrics across 1,420 PRs:\nHallucinated API imports: 14.2% -> 0.04%\nType mismatch regressions: 9.8% -> 0.00%",
      "5/5: Never trust a single model with production code. Triangulate locally with @zothstudio."
    ]
  },
  {
    id: 'local-silicon',
    category: 'benchmarks',
    author: {
      name: 'Nyx Latency Lab ⚡',
      handle: '@nyx_perf',
      avatar: 'assets/pets/azoth-neon.jpg',
      verified: true
    },
    date: '6h ago',
    text: `The cloud AI bubble is popping. <strong>Local silicon won.</strong>\n\n⚡ Llama 3.3 70B: <strong>85 tok/s</strong> (M4 Max / RTX 5090)\n⚡ Hermes 3 8B: <strong>142 tok/s</strong> (Sub-10ms TTFT)\n⚡ Cloud API p99 latency: <strong>1,850ms</strong>\n⚡ Local Ollama p99 latency: <strong>42ms</strong>\n\nSpeed = developer flow state. Zero outbound telemetry. 💻⚡`,
    media: {
      type: 'image',
      src: 'assets/media/cyber-nexus-3d-photoreal.jpg',
      alt: 'Local Silicon Performance'
    },
    metrics: {
      replies: 412,
      retweets: 2480,
      likes: 9830,
      views: '340K'
    },
    workflowPreset: 'app',
    threadPosts: [
      "1/5: The cloud AI bubble is popping. Local silicon won.",
      "2/5: Latency kills flow: 42ms local TTFT vs 1,850ms cloud queue delays.",
      "3/5: Zero telemetry: proprietary IP and patient data stay locked in your local Rust memory daemon (:8485).",
      "4/5: Swap weights in 1 click: Llama 3.3 for deep reasoning, Hermes 3 for tool execution.",
      "5/5: Reclaim your hardware: curl -fsSL https://zoth.nullai.tech/install.sh | bash"
    ]
  },
  {
    id: 'rust-vault',
    category: 'infosec',
    author: {
      name: 'Cypher Infosec 🔐',
      handle: '@cypher_vault',
      avatar: 'assets/avatars/operator-cipher.svg',
      verified: true
    },
    date: '8h ago',
    text: `🚨 INFOSEC ALERT: 78% of modern AI platforms store API keys in plaintext <code>.env</code> files or cloud KMS with shared tenant access.\n\nZoth Vault implements <strong>RFC 9106 Argon2id ($m=64\\text{MB}, t=3$)</strong> and Rust <code>ZeroizeOnDrop</code> memory enclaves.\n\nKeys exist in RAM only for microsecond signing, then vanish. 🛡️🦀`,
    media: {
      type: 'image',
      src: 'assets/screenshots/zoth_byok_vault_hd.png',
      alt: 'Rust Argon2id Key Vault'
    },
    metrics: {
      replies: 165,
      retweets: 980,
      likes: 4320,
      views: '145K'
    },
    workflowPreset: 'vault',
    threadPosts: [
      "1/5: Plaintext .env files are an existential threat to autonomous agent security.",
      "2/5: Zoth Rust Vault Daemon (:8486) derives master keys with RFC 9106 Argon2id memory hardness.",
      "3/5: XChaCha20-Poly1305 192-bit nonces eliminate collision vectors.",
      "4/5: ZeroizeOnDrop: memory buffers are mathematically scrubbed on drop, leaving 0 byte residue in core dumps.",
      "5/5: Open source Rust security: inspect and run locally with Zoth Studio."
    ]
  },
  {
    id: 'agency-take',
    category: 'takes',
    author: {
      name: 'Maya Growth 🎨',
      handle: '@maya_zoth',
      avatar: 'assets/pets/kitsune-neon.jpg',
      verified: true
    },
    date: '10h ago',
    text: `HOT TAKE 🔥: The $100k/month software agency model is obsolete.\n\nOne solo developer wielding @zothstudio with 21 autonomous local agents will out-ship an entire traditional scrum team before lunch.\n\nShip code, not standup meeting notes. <a href="#hero" class="x-tag">#IndieHacker</a> <a href="#hero" class="x-tag">#BuildInPublic</a>`,
    media: null,
    metrics: {
      replies: 520,
      retweets: 3100,
      likes: 12400,
      views: '480K'
    },
    workflowPreset: 'app',
    threadPosts: [
      "The $100k/month software agency model is obsolete. One solo developer wielding @zothstudio with 21 autonomous local agents will out-ship an entire traditional scrum team before lunch. #IndieHacker #BuildInPublic"
    ]
  },
  {
    id: 'webcodecs-take',
    category: 'takes',
    author: {
      name: 'Kai Spatial 🧊',
      handle: '@kai_threejs',
      avatar: 'assets/pets/kai-neon.jpg',
      verified: true
    },
    date: '12h ago',
    text: `Why pay $0.25/min to render video on AWS Lambda FFmpeg when client GPUs are 4K 60FPS beasts?\n\nZoth uses <strong>W3C WebCodecs API + Three.js + 432Hz procedural Web Audio</strong> to render HD video 100% in-browser with zero cloud bills.\n\nYour laptop is the studio. 🎥💎`,
    media: {
      type: 'image',
      src: 'assets/media/hero-command-deck.jpg',
      alt: 'WebCodecs GPU Render'
    },
    metrics: {
      replies: 280,
      retweets: 1650,
      likes: 6790,
      views: '210K'
    },
    workflowPreset: 'cad',
    threadPosts: [
      "1/4: Why pay $0.25/min to render video on AWS Lambda when client GPUs are 4K 60FPS beasts?",
      "2/4: W3C WebCodecs VideoEncoder streams hardware-accelerated H.264/AV1 straight from HTML5 Canvas.",
      "3/4: 432Hz procedural Web Audio engine creates responsive soundtracks in <12KB of JavaScript.",
      "4/4: 10,000 video clips/mo: Cloud Lambda = $2,500/mo. Zoth WebCodecs = $0.00."
    ]
  }
];

// The Complete 21-Agent Pantheon
const AGENTS_PANTHEON = [
  {
    id: 'azoth',
    name: 'Master Azoth',
    role: 'Lead Architect & Omniverse Conductor',
    category: 'core',
    avatar: 'assets/pets/azoth-neon.jpg',
    companion: 'Neon Azoth',
    models: ['Ollama smollm2', 'Hermes 3 8B', 'Claude 3.7'],
    tools: ['decompose_graph', 'dag_dispatcher', 'stream_ansi_pty'],
    description: 'Central conductor of the 21-agent swarm. Decomposes high-level natural language intent into deterministic DAG tasks and monitors consensus quorum.'
  },
  {
    id: 'solon',
    name: 'Solon Arbiter',
    role: 'Byzantine Fault Tolerance & Quorum Lead',
    category: 'core',
    avatar: 'assets/pets/athena-neon.jpg',
    companion: 'Athena Aegis',
    models: ['3-Way Triangulation', 'Entropy Shannon Filter'],
    tools: ['calc_shannon_entropy', 'bft_vote_quorum', 'ast_diff_triangulate'],
    description: 'Eliminates single-model hallucinations by requiring heterogeneous 3-model AST convergence and Shannon entropy filtering before physical storage commits.'
  },
  {
    id: 'kai',
    name: 'Kai Spatial',
    role: 'Three.js, WebGL & Spatial CAD Engineer',
    category: 'engineering',
    avatar: 'assets/pets/kai-neon.jpg',
    companion: 'Neon Kai',
    models: ['Qwen 2.5 Coder', 'Three.js Vectorizer'],
    tools: ['pbr_shader_forge', 'gltf_extrusion_engine', 'webcodecs_muxer'],
    description: 'Builds cinematic 60 FPS 3D worlds, extruded agent medallions, and hardware-accelerated WebCodecs video pipelines directly in the browser.'
  },
  {
    id: 'cypher',
    name: 'Cypher Vault',
    role: 'Cryptographic Security & Memory Enclave',
    category: 'security',
    avatar: 'assets/avatars/operator-cipher.svg',
    companion: 'Phantom Operator',
    models: ['Rust Native Crypto', 'Argon2id Enclave'],
    tools: ['argon2id_derive', 'xchacha20_encrypt', 'zeroize_memory'],
    description: 'Implements RFC 9106 Argon2id memory-hard key derivation and ZeroizeOnDrop buffers. Guarantees secrets never persist in plaintext memory.'
  },
  {
    id: 'nyx',
    name: 'Nyx Optimizer',
    role: 'Local Silicon Profiler & Token Acceleration',
    category: 'engineering',
    avatar: 'assets/pets/ghostbyte-neon.jpg',
    companion: 'Ghostbyte',
    models: ['Ollama Engine', 'vLLM Local'],
    tools: ['profile_ttft', 'token_throughput_meter', 'gpu_tensor_alloc'],
    description: 'Profiles local unified memory, tensor cores, and sub-50ms TTFT latency. Optimizes context windows and prompt compression for instant execution.'
  },
  {
    id: 'maya',
    name: 'Maya Growth',
    role: 'Omnichannel Marketer & 𝕏 Virality Engine',
    category: 'growth',
    avatar: 'assets/pets/kitsune-neon.jpg',
    companion: 'Kitsune Nine-Tail',
    models: ['Grok-3 API', 'Claude 3.7 Thinking'],
    tools: ['x_thread_synthesizer', 'social_reach_simulator', 'hook_matrix'],
    description: 'Engineers viral 𝕏 threads, build-in-public dispatches, and omnichannel developer campaigns grounded in hard production benchmarks.'
  },
  {
    id: 'ignis',
    name: 'Ignis WebGen',
    role: 'Autonomous Web Foundry & Split-Screen UI',
    category: 'engineering',
    avatar: 'assets/pets/ignis-neon.jpg',
    companion: 'Ignis Ember',
    models: ['Qwen 2.5 Coder', 'Tailwind AST Engine'],
    tools: ['live_split_preview', 'tailwind_synthesizer', 'duckyscript_keystroke'],
    description: 'Generates full-stack responsive web apps with instant live split-screen preview, kinetic loading screens, and DuckyScript automation.'
  },
  {
    id: 'draco',
    name: 'Draco Kernel',
    role: 'Hardware Peripheral & ESP32-S3 Bridge',
    category: 'engineering',
    avatar: 'assets/pets/draco-neon.jpg',
    companion: 'Draco Core',
    models: ['Rust / C Embedded', 'esptool'],
    tools: ['esp32_partition_scan', 'flash_firmware', 'serial_pty_bridge'],
    description: 'Connects sovereign software swarms to physical hardware companions, ESP32 devkits, and LED status matrices over local serial busses.'
  },
  {
    id: 'chronos',
    name: 'Chronos Engine',
    role: 'Temporal Event Bus & Cron Task Scheduler',
    category: 'core',
    avatar: 'assets/pets/chronos-neon.jpg',
    companion: 'Temporal Hound',
    models: ['Async Tokio Engine', 'Cron AST Parser'],
    tools: ['schedule_recurring', 'temporal_checkpoint', 'event_stream_mux'],
    description: 'Coordinates high-precision background cron jobs, task schedules, and historical checkpointing across local daemon processes.'
  },
  {
    id: 'athena',
    name: 'Athena Logic',
    role: 'Formal Verification & AST Gatekeeper',
    category: 'core',
    avatar: 'assets/pets/athena-neon.jpg',
    companion: 'Aegis Owl',
    models: ['Rust AST Analyzer', 'Formal Logic Solver'],
    tools: ['type_check_pipeline', 'ast_safety_gate', 'deprecate_scan'],
    description: 'Strict compile-time gatekeeper. Rejects invalid memory offsets, syntax regressions, and hallucinated import dependencies.'
  },
  {
    id: 'ghostbyte',
    name: 'Ghostbyte Comms',
    role: 'SimpleX & Matrix Metadata-Free Messaging',
    category: 'security',
    avatar: 'assets/pets/ghostbyte-neon.jpg',
    companion: 'Ghostbyte Sprite',
    models: ['SimpleX CLI', 'Matrix E2EE Protocol'],
    tools: ['simplex_handshake', 'ephemeral_channel_open', 'zero_meta_route'],
    description: 'Enables private, metadata-free P2P communications between autonomous agents and human operators with zero central servers.'
  },
  {
    id: 'kraken',
    name: 'Kraken Concurrency',
    role: 'High-Throughput WebSocket & Socket Engine',
    category: 'engineering',
    avatar: 'assets/pets/kraken-neon.jpg',
    companion: 'Abyssal Kraken',
    models: ['Epoll Native', 'Starlette WebSocket'],
    tools: ['spawn_10k_sockets', 'event_broadcaster', 'frame_compressor'],
    description: 'Handles 10,000+ concurrent local WebSocket connections, ANSI terminal frame streaming, and real-time telemetry pipelines.'
  },
  {
    id: 'lycan',
    name: 'Lycan RedTeam',
    role: 'Penetration Testing & Fuzzing Specialist',
    category: 'security',
    avatar: 'assets/pets/lycan-neon.jpg',
    companion: 'Cyber Lycan',
    models: ['Adversarial Fuzzer', 'AFL++ Driver'],
    tools: ['fuzz_rest_endpoints', 'buffer_overflow_probe', 'csrf_token_audit'],
    description: 'Continuously attacks and audits local endpoints, checking for authorization bypasses, memory leaks, and input sanitization flaws.'
  },
  {
    id: 'onyx',
    name: 'Onyx Memory',
    role: 'Local Vector Store & Rust Memory Daemon',
    category: 'security',
    avatar: 'assets/pets/onyx-neon.jpg',
    companion: 'Onyx Golem',
    models: ['FastEmbed Rust', 'HNSW Vector Index'],
    tools: ['query_vector_enclave', 'prune_ephemeral_embeddings', 'disk_compact'],
    description: 'Powers local persistent semantic memory on port :8485. Stores token embeddings locally with zero cloud API dependency.'
  },
  {
    id: 'aether',
    name: 'Aether Neural',
    role: 'Deep World Modeling & Scenario Simulation',
    category: 'core',
    avatar: 'assets/pets/aether-neon.jpg',
    companion: 'Aetherial Falcon',
    models: ['Llama 3.3 70B', 'DeepSeek-V3'],
    tools: ['simulate_adversarial_tree', 'monte_carlo_outcome', 'world_model_step'],
    description: 'Simulates complex deployment strategies, market dynamics, and multi-step agent decisions before committing changes.'
  },
  {
    id: 'aquila',
    name: 'Aquila Recon',
    role: 'High-Altitude Threat Recon & OSINT',
    category: 'security',
    avatar: 'assets/pets/aquila-neon.jpg',
    companion: 'Aquila Drone',
    models: ['OSINT Parser', 'DNS Resolver'],
    tools: ['domain_threat_recon', 'cve_database_scan', 'subdomain_enum'],
    description: 'Monitors external threat matrices, CVE advisories, and dependency vulnerabilities across open-source ecosystems.'
  },
  {
    id: 'leviathan',
    name: 'Leviathan Data',
    role: 'Petabyte Stream Buffer & Local Data Lake',
    category: 'engineering',
    avatar: 'assets/pets/leviathan-neon.jpg',
    companion: 'Leviathan Wyrm',
    models: ['Parquet Engine', 'DuckDB Local'],
    tools: ['stream_parquet_sink', 'duckdb_query_local', 'wal_log_flush'],
    description: 'High-speed ingestion and analytics engine for massive datasets, local telemetry logs, and agent audit trails.'
  },
  {
    id: 'scorpius',
    name: 'Scorpius Defense',
    role: 'Adversarial Security & Exploit Mitigation',
    category: 'security',
    avatar: 'assets/pets/scorpius-neon.jpg',
    companion: 'Scorpius Mech',
    models: ['eBPF Security Driver', 'Wasm Sandbox'],
    tools: ['ebpf_syscall_filter', 'wasm_jail_isolate', 'kill_rogue_process'],
    description: 'Enforces kernel-level eBPF syscall sandboxing to isolate untrusted code execution and stop rogue processes immediately.'
  },
  {
    id: 'radical-minion',
    name: 'Radical Minion',
    role: 'Autonomous Automation & Background Cleaner',
    category: 'mascots',
    avatar: 'assets/pets/radical-minion-neon.jpg',
    companion: 'Minion Bot',
    models: ['Shell Engine', 'Cron Helper'],
    tools: ['clean_temp_artifacts', 'auto_commit_git', 'health_check_sweep'],
    description: 'Tireless automation agent that sweeps temp builds, optimizes git trees, and ensures workspace hygiene.'
  },
  {
    id: 'pixel-neko',
    name: 'Pixel Neko',
    role: 'Dev Delight & Retro Micro-Interactions',
    category: 'mascots',
    avatar: 'assets/pets/pixel-neko.png',
    companion: 'Neko Mascot',
    models: ['Canvas 2D Shaders', 'Web Audio Synth'],
    tools: ['retro_scanline_render', 'chptune_synthesizer', 'easter_egg_bus'],
    description: 'Brings aesthetic joy, 8-bit scanlines, procedural audio chimes, and smooth micro-interactions to operator surfaces.'
  },
  {
    id: 'pixel-shiba',
    name: 'Pixel Shiba',
    role: 'Ergonomics & Interactive PTY Companion',
    category: 'mascots',
    avatar: 'assets/pets/pixel-shiba.png',
    companion: 'Shiba Sentinel',
    models: ['ANSI Colorizer', 'xterm.js Adapter'],
    tools: ['pty_ansi_beautifier', 'status_dock_widget', 'session_logger'],
    description: 'Monitors terminal sessions, formats ANSI stream logs, and provides real-time emotional and productivity feedback in the cockpit.'
  }
];

const TERMINAL_PRESETS = {
  app: {
    command: 'zoth gen --prompt "Build sovereign SaaS with Tailwind & SQLite" --bft-quorum',
    steps: [
      { agent: 'AZOTH-PRIME', color: 'gold', text: 'Decomposing intent into 4 sub-tasks: [Schema, Backend, Frontend, BFT-Audit]...' },
      { agent: 'NYX-LOCAL', color: 'cyan', text: 'Allocated Hermes 3 (8B) on Ollama (:11434) • TTFT: 14ms (142 tok/s)' },
      { agent: 'IGNIS-WEBGEN', color: 'green', text: 'Synthesizing responsive glassmorphic dashboard (Tailwind + Vanilla JS)...' },
      { agent: 'SOLON-BFT', color: 'purple', text: 'Triangulating AST diffs across 3 models: Entropy H=0.08 <= 0.35 [QUORUM OK]' },
      { agent: 'ZOTH-KERNEL', color: 'cyan', text: '✓ 14 files generated directly to local disk. Microservice alive on http://127.0.0.1:8088' }
    ],
    codePreview: `<!-- Synthesized by Zoth Studio WebGen Foundry -->
<div class="sovereign-app-deck">
  <header class="flex justify-between items-center p-4 bg-slate-900/80 backdrop-blur border-b border-amber-500/30">
    <div class="flex items-center gap-3">
      <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
      <h1 class="font-mono text-sm font-bold text-amber-400">SOVEREIGN_NODE_ONLINE</h1>
    </div>
    <span class="text-xs font-mono text-cyan-400">Latency: 38ms (Local Silicon)</span>
  </header>
  <main class="grid grid-cols-3 gap-4 p-6">
    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
      <div class="text-xs text-slate-400">ACTIVE_AGENTS</div>
      <div class="text-2xl font-black text-white mt-1">21 / 21</div>
    </div>
    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
      <div class="text-xs text-slate-400">OUTBOUND_TELEMETRY</div>
      <div class="text-2xl font-black text-emerald-400 mt-1">0 BYTES</div>
    </div>
    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
      <div class="text-xs text-slate-400">ARGON2ID_STATUS</div>
      <div class="text-2xl font-black text-cyan-400 mt-1">ENCLAVE_LOCKED</div>
    </div>
  </main>
</div>`
  },
  cad: {
    command: 'zoth 3d --scene "Kinetic Cyber Arena" --pbr-shaders --webcodecs-export',
    steps: [
      { agent: 'AZOTH-PRIME', color: 'gold', text: 'Initializing Three.js WebGL viewport & WebCodecs H.264 muxer...' },
      { agent: 'KAI-SPATIAL', color: 'cyan', text: 'Synthesizing PBR metallic-roughness shaders & extruded 3D agent medallions...' },
      { agent: 'PIXEL-NEKO', color: 'purple', text: 'Generating 432Hz procedural harmonic solfeggio audio stream in Web Audio DSP...' },
      { agent: 'KAI-SPATIAL', color: 'green', text: 'Piping hardware-accelerated 60 FPS frames directly into client MP4 buffer...' },
      { agent: 'ZOTH-KERNEL', color: 'cyan', text: '✓ 3D Swarm Arena compiled. Zero server egress. Render time: 1.2s' }
    ],
    codePreview: `// Three.js PBR Shader & Kinetic Arena synthesized by Kai Spatial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// Kinetic Agent Node Geometry with Gold PBR Material
const agentGeometry = new THREE.OctahedronGeometry(2.5, 0);
const agentMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xfbbf24,
  emissive: 0xf59e0b,
  emissiveIntensity: 0.4,
  metalness: 0.95,
  roughness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const medallion = new THREE.Mesh(agentGeometry, agentMaterial);
scene.add(medallion);

// Real-time 60 FPS WebCodecs hardware encoding stream
const videoEncoder = new VideoEncoder({
  output: handleChunk,
  error: (e) => console.error(e)
});
videoEncoder.configure({ codec: 'avc1.640028', width: 1920, height: 1080, bitrate: 8_000_000 });`
  },
  vault: {
    command: 'zoth vault --rfc9106 --derive-master --memory-hardness 64MB --zeroize',
    steps: [
      { agent: 'AZOTH-PRIME', color: 'gold', text: 'Engaging Sovereign Rust Vault Daemon (:8486)...' },
      { agent: 'CYPHER-VAULT', color: 'cyan', text: 'Computing RFC 9106 Argon2id hash (m=64 MiB, t=3, p=1)...' },
      { agent: 'CYPHER-VAULT', color: 'green', text: 'Derived 256-bit key in 34ms RAM enclave. XChaCha20-Poly1305 nonce primed.' },
      { agent: 'CYPHER-VAULT', color: 'purple', text: 'ZeroizeOnDrop triggered: plaintext key memory scrubbed from heap.' },
      { agent: 'ZOTH-KERNEL', color: 'cyan', text: '✓ Zero-residue key verification complete. Core dumps contain 0 bytes.' }
    ],
    codePreview: `// Rust Vault Daemon: Memory Enclave with ZeroizeOnDrop
use zeroize::{Zeroize, ZeroizeOnDrop};
use argon2::{Argon2, Params};
use chacha20poly1305::{XChaCha20Poly1305, KeyInit, AeadCore};

#[derive(Zeroize, ZeroizeOnDrop)]
pub struct SovereignKeyBuffer {
    master_key: [u8; 32],
    ephemeral_nonce: [u8; 24],
}

impl SovereignKeyBuffer {
    pub fn derive_argon2id(passphrase: &[u8], salt: &[u8]) -> Self {
        let params = Params::new(65536, 3, 1, Some(32)).unwrap();
        let argon = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
        let mut key = [0u8; 32];
        argon.hash_password_into(passphrase, salt, &mut key).unwrap();
        
        Self { master_key: key, ephemeral_nonce: XChaCha20Poly1305::generate_nonce(&mut rand::rngs::OsRng).into() }
    }
}`
  },
  consensus: {
    command: 'zoth consensus --models "claude-3.7,grok-3,hermes-3-local" --pr-audit 142',
    steps: [
      { agent: 'AZOTH-PRIME', color: 'gold', text: 'Dispatching patch proposals to 3 heterogeneous model families...' },
      { agent: 'SOLON-ARBITER', color: 'cyan', text: 'Parsed proposals into Python AST trees. Comparing node graphs...' },
      { agent: 'SOLON-ARBITER', color: 'purple', text: 'Calculated Shannon Entropy: H(X) = -∑ P(x) log2 P(x) = 0.04' },
      { agent: 'ATHENA-VERIFY', color: 'green', text: 'Consensus Quorum reached (100% syntactic agreement). Zero regressions detected.' },
      { agent: 'ZOTH-KERNEL', color: 'cyan', text: '✓ Patch applied safely with BFT cryptographic seal.' }
    ],
    codePreview: `// Consensus Arena v2: 3-Way Byzantine Triangulation Engine
pub struct ConsensusQuorum {
    pub anthropic_ast_hash: String,
    pub grok_ast_hash: String,
    pub hermes_local_ast_hash: String,
    pub shannon_entropy: f64,
}

impl ConsensusQuorum {
    pub fn verify_safety_gate(&self) -> bool {
        // Strict threshold: Entropy must be <= 0.35 and 66.7% quorum
        let quorum_count = (self.anthropic_ast_hash == self.hermes_local_ast_hash) as u8
            + (self.grok_ast_hash == self.hermes_local_ast_hash) as u8
            + (self.anthropic_ast_hash == self.grok_ast_hash) as u8;
            
        quorum_count >= 2 && self.shannon_entropy <= 0.35
    }
}`
  }
};

// ==========================================================================
// 2. AMBIENT CANVAS BACKGROUND (Interactive Particle Constellation)
// ==========================================================================

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.6 ? '#fbbf24' : (Math.random() > 0.5 ? '#00f0ff' : '#a855f7')
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse repulsion/attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
}

// ==========================================================================
// 3. PROCEDURAL 432Hz WEB AUDIO SYNTHESIZER
// ==========================================================================

let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let osc1 = null, osc2 = null, filter = null;

function toggleAmbientAudio() {
  const btn = document.getElementById('audio-toggle-btn');
  
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    // 432Hz Sacred harmonic tone + 216Hz Sub-harmonic
    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, audioCtx.currentTime);

    osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(216, audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!isAudioPlaying) {
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.5);
    isAudioPlaying = true;
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = '<span>🔊</span> 432Hz ON';
    }
    showToast('Procedural 432Hz Solfeggio Audio Engaged ⚡');
  } else {
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    isAudioPlaying = false;
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = '<span>🔈</span> 432Hz Sound';
    }
  }
}

// ==========================================================================
// 4. RENDER 𝕏 TRANSMISSIONS
// ==========================================================================

function renderTransmissions(filter = 'all') {
  const container = document.getElementById('transmissions-container');
  if (!container) return;

  const filtered = filter === 'all' 
    ? TRANSMISSIONS_DATA 
    : TRANSMISSIONS_DATA.filter(t => t.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="x-card" data-id="${item.id}">
      <div class="x-card-header">
        <div class="x-author-info">
          <img src="${item.author.avatar}" alt="${item.author.name}" class="x-author-avatar" />
          <div class="x-author-names">
            <span class="x-author-name">
              ${item.author.name}
              ${item.author.verified ? '<span class="x-verified-badge">✓</span>' : ''}
            </span>
            <span class="x-author-handle">${item.author.handle} · ${item.date}</span>
          </div>
        </div>
        <div class="x-logo-badge">𝕏</div>
      </div>

      <div class="x-post-content">${item.text.replace(/\\n/g, '<br>')}</div>

      ${item.media ? `
        <div class="x-post-media" onclick="openMediaModal('${item.media.src}')">
          <img src="${item.media.src}" alt="${item.media.alt}" class="x-media-img" loading="lazy" />
          <span class="x-media-badge">HD Asset</span>
        </div>
      ` : ''}

      <div class="x-metrics-row">
        <span class="x-metric-item">💬 ${item.metrics.replies}</span>
        <span class="x-metric-item">🔁 ${item.metrics.retweets.toLocaleString()}</span>
        <span class="x-metric-item">❤️ ${item.metrics.likes.toLocaleString()}</span>
        <span class="x-metric-item">📊 ${item.metrics.views}</span>
      </div>

      <div class="x-card-actions">
        <button class="btn-x-action primary" onclick="launchWorkflowPreset('${item.workflowPreset}')">
          ⚡ Run in Terminal
        </button>
        <button class="btn-x-action" onclick="openThreadModal('${item.id}')">
          🧵 View Thread
        </button>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Building with @zothstudio! 21 autonomous agents running locally with zero cloud latency. ⚡ #ZothStudio #BuildInPublic`)}&url=${encodeURIComponent('https://zoth.nullai.tech')}" target="_blank" rel="noopener" class="btn-x-action">
          𝕏 Quote
        </a>
      </div>
    </div>
  `).join('');
}

function initTransmissionFilters() {
  const chips = document.querySelectorAll('.transmissions-filter-bar .filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderTransmissions(chip.getAttribute('data-filter'));
    });
  });
}

function openThreadModal(id) {
  const item = TRANSMISSIONS_DATA.find(t => t.id === id);
  if (!item) return;

  const modal = document.getElementById('general-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <img src="${item.author.avatar}" style="width:48px;height:48px;border-radius:50%;border:1.5px solid var(--gold-primary);" />
      <div>
        <h3 style="color:#fff;font-size:1.1rem;">${item.author.name}</h3>
        <p style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);">${item.author.handle} · Megathread</p>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:24px;">
      ${item.threadPosts.map((post, idx) => `
        <div style="padding:14px;background:#060910;border:1px solid var(--border-subtle);border-radius:8px;font-size:0.92rem;line-height:1.6;">
          ${post.replace(/\n/g, '<br>')}
        </div>
      `).join('')}
    </div>

    <div style="display:flex;gap:12px;justify-content:flex-end;">
      <button class="btn-secondary-dark" onclick="closeModal()">Close</button>
      <button class="btn-copy-main" onclick="launchWorkflowPreset('${item.workflowPreset}');closeModal();">
        ⚡ Launch in Cockpit
      </button>
    </div>
  `;

  modal.classList.add('active');
}

// ==========================================================================
// 5. LIVE TERMINAL SIMULATOR ENGINE
// ==========================================================================

let isTerminalRunning = false;

function launchWorkflowPreset(presetKey) {
  const preset = TERMINAL_PRESETS[presetKey] || TERMINAL_PRESETS.app;
  
  // Highlight active preset button
  document.querySelectorAll('.btn-preset').forEach(btn => {
    if (btn.getAttribute('data-preset') === presetKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Scroll smoothly to terminal section
  const termSection = document.getElementById('terminal-section');
  if (termSection) {
    termSection.scrollIntoView({ behavior: 'smooth' });
  }

  runTerminalSimulation(preset);
}

function runTerminalSimulation(preset) {
  if (isTerminalRunning) return;
  isTerminalRunning = true;

  const consoleOutput = document.getElementById('terminal-console-output');
  const codeBlock = document.getElementById('terminal-code-display');
  const previewBadge = document.getElementById('preview-badge-status');

  if (!consoleOutput) return;

  consoleOutput.innerHTML = `
    <div class="term-line gold bold">$ ${preset.command}</div>
    <div class="term-line dim">--- Starting Sovereign Swarm Orchestration ---</div>
  `;

  if (previewBadge) {
    previewBadge.innerText = 'SYNTHESIZING...';
    previewBadge.style.color = '#00f0ff';
  }
  if (codeBlock) codeBlock.innerText = '// Synthesizing AST nodes in ephemeral RAM...';

  let stepIdx = 0;

  function runNextStep() {
    if (stepIdx < preset.steps.length) {
      const s = preset.steps[stepIdx];
      const line = document.createElement('div');
      line.className = `term-line ${s.color}`;
      line.innerHTML = `<strong>[${s.agent}]</strong> ${s.text}`;
      consoleOutput.appendChild(line);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;

      stepIdx++;
      setTimeout(runNextStep, 550);
    } else {
      if (codeBlock) {
        codeBlock.innerText = preset.codePreview;
      }
      if (previewBadge) {
        previewBadge.innerText = 'QUORUM REACHED';
        previewBadge.style.color = '#10b981';
      }
      isTerminalRunning = false;
    }
  }

  setTimeout(runNextStep, 350);
}

function handleCustomTerminalInput() {
  const input = document.getElementById('terminal-custom-input');
  if (!input || !input.value.trim()) return;

  const userPrompt = input.value.trim();
  input.value = '';

  const customPreset = {
    command: `zoth gen --intent "${userPrompt}" --bft-quorum`,
    steps: [
      { agent: 'AZOTH-PRIME', color: 'gold', text: `Analyzing natural language intent: "${userPrompt}"` },
      { agent: 'ATHENA-LOGIC', color: 'cyan', text: 'Constructing deterministic AST dependency tree with 298 local tools...' },
      { agent: 'SOLON-BFT', color: 'purple', text: 'Triangulating logic proposals with Grok-3 + Claude 3.7 + local Hermes 3...' },
      { agent: 'CYPHER-VAULT', color: 'green', text: 'Verifying zero outbound telemetry & Argon2id credential lockdown...' },
      { agent: 'ZOTH-KERNEL', color: 'cyan', text: `✓ Generated autonomous solution for "${userPrompt}". Ready in workspace.` }
    ],
    codePreview: `// Autonomous result synthesized for: "${userPrompt}"
export async function runSovereignWorkflow() {
  const orchestrator = new ZothOrchestrator({ localFirst: true, telemetry: false });
  const result = await orchestrator.executeTask("${userPrompt}");
  console.log("Autonomous task complete with BFT quorum seal:", result.status);
  return result;
}`
  };

  runTerminalSimulation(customPreset);
}

// ==========================================================================
// 6. RENDER 21-AGENT PANTHEON
// ==========================================================================

function renderPantheon(category = 'all') {
  const grid = document.getElementById('pantheon-grid');
  if (!grid) return;

  const filtered = category === 'all'
    ? AGENTS_PANTHEON
    : AGENTS_PANTHEON.filter(a => a.category === category);

  grid.innerHTML = filtered.map(agent => `
    <div class="agent-card" onclick="openAgentDossier('${agent.id}')">
      <div class="agent-card-top">
        <div class="agent-avatar-wrap">
          <img src="${agent.avatar}" alt="${agent.name}" class="agent-avatar-img" />
          <div class="agent-status-ring"></div>
        </div>
        <div class="agent-identity">
          <span class="agent-name">${agent.name}</span>
          <span class="agent-title-tag">${agent.role}</span>
        </div>
      </div>

      <p class="agent-desc">${agent.description}</p>

      <div class="agent-tools-row">
        ${agent.tools.map(t => `<span class="tool-tag">⚡ ${t}</span>`).join('')}
      </div>

      <div class="agent-card-footer">
        <span>🐾 ${agent.companion}</span>
        <span class="agent-model-pill">${agent.models[0]}</span>
      </div>
    </div>
  `).join('');
}

function initPantheonTabs() {
  const tabs = document.querySelectorAll('.pantheon-tabs-bar .pantheon-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPantheon(tab.getAttribute('data-cat'));
    });
  });
}

function openAgentDossier(agentId) {
  const agent = AGENTS_PANTHEON.find(a => a.id === agentId);
  if (!agent) return;

  const modal = document.getElementById('general-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
      <img src="${agent.avatar}" style="width:64px;height:64px;border-radius:14px;border:2px solid var(--cyan-primary);box-shadow:0 0 15px var(--cyan-glow);" />
      <div>
        <h2 style="font-family:var(--font-display);color:#fff;font-size:1.4rem;">${agent.name}</h2>
        <span style="font-family:var(--font-mono);color:var(--cyan-primary);font-size:0.85rem;">${agent.role}</span>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <h4 style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">Directive & Capabilities</h4>
      <p style="font-size:0.95rem;line-height:1.6;color:var(--text-primary);">${agent.description}</p>
    </div>

    <div style="margin-bottom:20px;">
      <h4 style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Compatible Models</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${agent.models.map(m => `<span class="mock-badge" style="background:rgba(0,240,255,0.15);color:var(--cyan-primary);">${m}</span>`).join('')}
      </div>
    </div>

    <div style="margin-bottom:28px;">
      <h4 style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Indexed Deterministic Tools</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${agent.tools.map(t => `<span class="tool-tag" style="padding:4px 10px;font-size:0.75rem;">⚡ ${t}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--border-subtle);">
      <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--gold-primary);">Companion: ${agent.companion}</span>
      <button class="btn-primary-glow" onclick="launchWorkflowPreset('app');closeModal();">
        ⚡ Prompt ${agent.name}
      </button>
    </div>
  `;

  modal.classList.add('active');
}

// ==========================================================================
// 7. SOVEREIGN MATH & ROI CALCULATOR
// ==========================================================================

function initCalculator() {
  const teamInput = document.getElementById('calc-team-size');
  const spendInput = document.getElementById('calc-monthly-spend');
  
  const teamVal = document.getElementById('calc-team-val');
  const spendVal = document.getElementById('calc-spend-val');

  const annualSavings = document.getElementById('calc-annual-savings');
  const hoursReclaimed = document.getElementById('calc-hours-reclaimed');

  function updateCalc() {
    const team = parseInt(teamInput.value, 10);
    const spend = parseInt(spendInput.value, 10);

    if (teamVal) teamVal.innerText = `${team} Dev${team > 1 ? 's' : ''}`;
    if (spendVal) spendVal.innerText = `$${spend.toLocaleString()}/mo`;

    // Calculation formula:
    // Annual SaaS savings = (Monthly SaaS spend + $400/dev API tax) * 12
    const totalAnnual = (spend + (team * 250)) * 12;
    // Hours saved from eliminating API rate limits and network latency (approx 28 hrs/mo per dev)
    const totalHours = team * 28 * 12;

    if (annualSavings) {
      annualSavings.innerText = `$${totalAnnual.toLocaleString()}`;
    }
    if (hoursReclaimed) {
      hoursReclaimed.innerText = `${totalHours.toLocaleString()} hrs`;
    }
  }

  if (teamInput && spendInput) {
    teamInput.addEventListener('input', updateCalc);
    spendInput.addEventListener('input', updateCalc);
    updateCalc();
  }
}

// ==========================================================================
// 8. MEDIA SHOWCASE TABS
// ==========================================================================

function initMediaTabs() {
  const buttons = document.querySelectorAll('.media-tab-btn');
  const container = document.getElementById('media-display-frame');
  if (!buttons.length || !container) return;

  const mediaViews = {
    video: `
      <video controls autoplay loop muted playsinline class="media-frame-video">
        <source src="assets/media/zoth-showcase-desktop.mp4" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
    `,
    cockpit: `
      <img src="assets/screenshots/zoth_tui_cockpit_hd.png" alt="Zoth TUI Cockpit" class="media-frame-img" />
    `,
    swarm: `
      <img src="assets/screenshots/zoth_swarm_arena_hd.png" alt="Zoth 3D Swarm Arena" class="media-frame-img" />
    `,
    vault: `
      <img src="assets/screenshots/zoth_byok_vault_hd.png" alt="Zoth Rust Argon2id Key Vault" class="media-frame-img" />
    `
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const viewKey = btn.getAttribute('data-view');
      container.innerHTML = mediaViews[viewKey] || mediaViews.video;
    });
  });
}

// ==========================================================================
// 9. COPY TO CLIPBOARD & TOAST NOTICE
// ==========================================================================

function copyToClipboard(text, msg = 'Command Copied to Clipboard! ⚡') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(msg);
  });
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function closeModal() {
  const modal = document.getElementById('general-modal');
  if (modal) modal.classList.remove('active');
}

function openMediaModal(imgSrc) {
  const modal = document.getElementById('general-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <img src="${imgSrc}" style="width:100%;border-radius:12px;border:1px solid var(--border-subtle);display:block;margin-bottom:16px;" />
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn-secondary-dark" onclick="closeModal()">Close</button>
    </div>
  `;
  modal.classList.add('active');
}

// ==========================================================================
// 10. INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  renderTransmissions('all');
  initTransmissionFilters();
  renderPantheon('all');
  initPantheonTabs();
  initCalculator();
  initMediaTabs();

  // Terminal Preset Buttons
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      launchWorkflowPreset(presetKey);
    });
  });

  // Terminal Run Button
  const termRunBtn = document.getElementById('terminal-run-btn');
  if (termRunBtn) {
    termRunBtn.addEventListener('click', handleCustomTerminalInput);
  }

  // Terminal Input Keypress (Enter)
  const termInput = document.getElementById('terminal-custom-input');
  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCustomTerminalInput();
    });
  }

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAmbientAudio);
  }

  // Modal Backdrop Close
  const modal = document.getElementById('general-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close modal on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
