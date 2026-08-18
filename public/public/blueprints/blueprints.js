// Zoth Blueprint Foundry — Engine, Catalog & Interactive Composer

const BLUEPRINTS_DATA = [
  // AI & Agents
  {
    id: "nullai-hexstrike-terminal",
    title: "NullAI HexStrike AI Terminal",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Cyberpunk Neural Terminal & CLI Engine",
    stack: "React, Vite, Web Audio, Canvas",
    why: "Provides a complete retro-cyberpunk terminal interface, ANSI command parser, 20+ offline security tool simulations, and a 60fps Hex Matrix rain canvas.",
    superpower: "Allows AI agents to spin up authentic hacker CLI dashboards, command consoles, or developer playgrounds in 1 click without building command loops from scratch.",
    modules: ["HexMatrixCanvas.jsx", "CommandTerminal.jsx", "AgentStatusHud.jsx", "audioSynth.js", "offlineEngine.js"],
    wiring: ["ANSI Color Engine", "Up/Down Command Buffer", "CRT Scanline Shader Overlay", "Web Audio Beep/Chord Synth"],
    tags: ["Terminal CLI", "Web Audio", "Canvas 60fps", "CRT Filter", "Offline Mock Engine"]
  },
  {
    id: "agent-ax",
    title: "Agent AX Orchestration DAG",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Multi-Agent DAG Workflow Visualizer",
    stack: "Vanilla JS, SVG DAG, Netlify AX",
    why: "Visualizes complex multi-agent execution pipelines with real-time laser data pulses, agent state transitions (Idle -> Planning -> Executing -> Verified), and Merkle task signatures.",
    superpower: "Provides the visual orchestration surface for AI agents to explain multi-step workflows, autonomous reasoning paths, and distributed system executions to human users.",
    modules: ["DAG Canvas Engine", "Agent State Router", "Task Payload Inspector", "Consensus Verifier"],
    wiring: ["Animated SVG Curves", "Laser Telemetry Pulse", "Dynamic Task JSON Viewer", "Theme Matrix Switcher"],
    tags: ["DAG Visualizer", "Multi-Agent", "SVG Graph", "State Machines", "Telemetry"]
  },
  {
    id: "nullai-ui",
    title: "NullAI Transformer Neural Lab",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Interactive Transformer Layer & Latency Lab",
    stack: "React, Vite, HTML5 Canvas",
    why: "Renders multi-layer attention heads, forward-pass synapse pulses, latency benchmarking suites, and temperature/top_p parameter response comparators.",
    superpower: "Gives AI builders a drop-in neural network visualization laboratory for LLM tuning interfaces, model benchmarks, and explainable AI tooling.",
    modules: ["NeuronCanvas.jsx", "NeuralLab.jsx", "ModelComparator.jsx", "LatencyBenchmark.jsx"],
    wiring: ["Synaptic Weight Heatmaps", "Interactive Neuron Hover Inspector", "Dual-Temp Split Inference", "Throughput Profiler"],
    tags: ["Neural Canvas", "Transformer Viz", "Model Benchmark", "Inference Comparator"]
  },
  {
    id: "signalbridge-ai",
    title: "SignalBridge AI Node Hub",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "Autonomous IoT & Signal Node Network",
    stack: "React, Tailwind, Lucide, Web Audio",
    why: "Interactive network telemetry mesh with real-time signal strength meters, multi-band frequency analyzers, and defensive offline simulation queues.",
    superpower: "Enables instant generation of IoT monitoring dashboards, telecommunication signal radars, and mesh network management web apps.",
    modules: ["SignalMatrix.tsx", "FrequencyAnalyzer.tsx", "NodeHealthHUD.tsx", "TelemetryQueue.ts"],
    wiring: ["Web Audio Radar Ping", "Dynamic Node Graph Canvas", "Simulated Packet Stream", "Bandwidth Gauges"],
    tags: ["IoT Mesh", "Signal Radar", "Web Audio", "Telemetry"]
  },
  {
    id: "adytum-alchemist-ai-workflow",
    title: "Adytum Alchemist Workflow",
    category: "ai-agents",
    categoryLabel: "AI & Agents",
    archetype: "22-Node Constellation & Prompt Chain Visualizer",
    stack: "React, Vite, Canvas 2D, Framer Motion",
    why: "Archetypal node constellation canvas connecting high-level creative prompts to multi-tier deterministic transformation pipelines.",
    superpower: "Ideal template for node-based automation editors, creative prompt chaining engines, and visual rule builders.",
    modules: ["ConstellationCanvas.tsx", "AlchemistPipeline.tsx", "PromptChainer.tsx"],
    wiring: ["Force-Directed Node Physics", "Bezier Energy Splines", "Prompt Mutation Engine"],
    tags: ["Prompt Chaining", "Constellation Canvas", "Visual Pipeline"]
  },

  // SaaS & Web Apps
  {
    id: "nfc-link-hub",
    title: "NFC Link Hub Enterprise",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Smart Physical-to-Digital Routing Engine",
    stack: "React, Vite, Tailwind, Web NFC API",
    why: "Complete digital card and physical asset management SaaS with multi-route sitemaps, QR/NFC link routers, analytics HUDs, and dynamic redirection rules.",
    superpower: "Drop-in architecture for link-in-bio SaaS, smart business card managers, and physical NFC asset tracking products.",
    modules: ["NfcCardDesigner.tsx", "RoutingRulesEngine.tsx", "LiveTapAnalytics.tsx", "QrMatrixGenerator.tsx"],
    wiring: ["Web NFC Read/Write Fallback", "Multi-URL Sitemap XML", "Dynamic Redirection Matrix", "Client Lead Capture"],
    tags: ["NFC/QR SaaS", "Link Router", "Tap Analytics", "Lead Capture"]
  },
  {
    id: "757tech2025",
    title: "757tech Flagship Tech Hub",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Regional Tech Ecosystem & Radar Portal",
    stack: "Astro, Tailwind, Content Collections, Netlify",
    why: "Modern tech community portal featuring interactive ecosystem tech radars, terminal sandbox simulators, job boards, and automated RSS/Sitemap pipelines.",
    superpower: "Provides the gold standard for developer community portals, startup directories, and regional tech ecosystem showcases.",
    modules: ["TechRadarCanvas.astro", "TerminalSimulator.astro", "CommunityDirectory.astro"],
    wiring: ["Astro SSG + SSR Hybrid", "Strict Schema.org Organization", "Interactive Skill Radar"],
    tags: ["Astro Hub", "Tech Radar", "Content Collections", "SEO/AEO"]
  },
  {
    id: "edge-forge",
    title: "EdgeForge Edge Compute Manager",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Serverless Edge Function Management SaaS",
    stack: "React, TypeScript, Lucide, Netlify Edge",
    why: "Modern edge deployment simulator with latency telemetry, function routing maps, cache hit-rate counters, and real-time log tailers.",
    superpower: "Enables instant generation of cloud infrastructure consoles, DevOps dashboards, and serverless compute monitors.",
    modules: ["EdgeTopologyMap.tsx", "LatencyTelemetry.tsx", "FunctionDeployer.tsx"],
    wiring: ["Real-Time Edge Telemetry", "Cache Ratio Visualizer", "Mock Function Invoker"],
    tags: ["DevOps Console", "Edge Functions", "Latency Map"]
  },
  {
    id: "envguard-pro",
    title: "EnvGuard Pro Zero-Trust Vault",
    category: "saas-apps",
    categoryLabel: "SaaS & Products",
    archetype: "Environment Secrets & Zero-Trust Auditor",
    stack: "React, TypeScript, Tailwind",
    why: "Zero-trust secrets vulnerability analyzer with live linting, weak password detection, honeypot canary decoy generator, and encrypted vault storage.",
    superpower: "Provides the complete UI and validation logic for cybersecurity secrets management, environment auditors, and API key sanitizers.",
    modules: ["EnvLinter.tsx", "HoneypotGenerator.tsx", "ZeroTrustVault.tsx"],
    wiring: ["Entropy Scorer", "Secret Masking Filters", "Audit Trail Logger"],
    tags: ["Secrets Vault", "Zero-Trust", "Env Linter", "Honeypot Decoys"]
  },

  // Security & OSINT
  {
    id: "subsweep",
    title: "SubSweep Attack Surface Suite",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "3D Attack Surface & Subdomain Topology",
    stack: "React, Three.js / R3F, Web Audio, CRT.sh",
    why: "Interactive 3D threat orbit visualization, DNS record sweeper, port vulnerability auditor, and live security telemetry stream.",
    superpower: "Gives AI agents an instant 3D cybersecurity recon surface for domain intelligence, external attack surface management (EASM), and vulnerability scanners.",
    modules: ["ThreatOrbit3D.tsx", "DnsRecordSweeper.tsx", "PortScannerEngine.tsx", "ReconTelemetry.tsx"],
    wiring: ["Three.js Particle Satellites", "CRT.sh API + Fallbacks", "Web Audio Radar Sweep", "Export to CSV/JSON"],
    tags: ["Three.js 3D", "Attack Surface", "DNS Sweeper", "Port Auditor"]
  },
  {
    id: "local-business-lead-scanner",
    title: "Local Business Lead Recon Scanner",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "Geospatial OSINT & Digital Footprint Auditor",
    stack: "Vanilla JS, Overpass API, Web Audio",
    why: "Multi-stage digital gap analyzer extracting municipal/business leads, checking SSL/meta tags/mobile readiness, and generating automated cold outreach playbooks.",
    superpower: "Template for automated B2B lead scrapers, agency audit generators, and digital marketing pitch tools.",
    modules: ["NominatimEngine.js", "DigitalGapAuditor.js", "OutreachPlaybookGen.js", "AudioTelemetry.js"],
    wiring: ["Overpass OSINT Engine", "Regional Fallback Data", "Automated Scorecard Exporter"],
    tags: ["OSINT Scraper", "Lead Scanner", "Cold Outreach Gen", "Web Audio"]
  },
  {
    id: "cisa-grc-study-portal",
    title: "CISA & NIST CSF 2.0 Study Portal",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "GRC Control Crosswalk & Exam Engine",
    stack: "React, TypeScript, Web Speech API, Tailwind",
    why: "Cross-maps NIST CSF 2.0 to CISA domains, includes CMMI 1-5 audit readiness scoring calculators, Leitner 5-box flashcards with text-to-speech audio, and timed exam simulators.",
    superpower: "Perfect blueprint for compliance portals, corporate training apps, certification study engines, and governance risk compliance (GRC) tools.",
    modules: ["NistCisaExplorer.tsx", "GrcAuditCalculator.tsx", "EnhancedFlashcards.tsx", "DynamicQuizEngine.tsx"],
    wiring: ["Leitner 5-Box Spaced Repetition", "Web Speech API TTS", "CMMI 1-5 Formula", "Workpaper Export"],
    tags: ["GRC Compliance", "NIST CSF 2.0", "Spaced Repetition", "Web Speech TTS"]
  },
  {
    id: "privacy-toolbelt",
    title: "Privacy Toolbelt Zero-Knowledge Suite",
    category: "security-osint",
    categoryLabel: "Security & OSINT",
    archetype: "Browser Fingerprint Auditor & Crypto Toolset",
    stack: "Vanilla JS, Canvas 2D, Web Audio",
    why: "Calculates real-time device entropy (Canvas/Audio/WebGL GPU), simulates network telemetry blockers, generates Diceware passphrases, runs RFC 6238 TOTP 2FA, and strips image EXIF metadata client-side.",
    superpower: "Provides essential zero-knowledge privacy modules that AI agents can insert into any app requiring secure credentials or client-side privacy auditing.",
    modules: ["FingerprintAuditor.js", "TrackerBlockerSim.js", "TotpEngine.js", "ExifStripper.js"],
    wiring: ["Canvas 2D Hash Engine", "AudioContext Entropy", "Diceware Wordlist", "In-Memory Image Scrubbing"],
    tags: ["Browser Fingerprint", "EXIF Stripper", "TOTP 2FA", "Telemetry Blocker"]
  },

  // Arcade & Games
  {
    id: "street-fighter-arcade",
    title: "Street Fighter Arcade Canvas Combat",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "60 FPS HTML5 Canvas Fighter Engine",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Full 60 FPS combat state machine with special move input buffers (Hadoken, Shoryuken), input history visualizer, multi-hit combo banners, EX super meters, and procedural chiptune synth.",
    superpower: "Gives AI agents a proven, self-contained 2D canvas physics and state-machine framework for games, interactive landing page heroes, and gamified promotions.",
    modules: ["ArcadeFightEngine.tsx", "InputBuffer.ts", "arcadeAudio.ts", "ComboTracker.ts"],
    wiring: ["Circular Input Buffer", "Procedural 8-bit Audio", "60 FPS Render Loop", "4-tier CPU AI Logic"],
    tags: ["Canvas 60fps", "Arcade Game", "Combo Engine", "Chiptune Synth"]
  },
  {
    id: "mechshift-vr",
    title: "MechShift 3D Cockpit Combat Simulator",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "Pseudo-3D Flight HUD & Tactical Combat Engine",
    stack: "React, TypeScript, Canvas 2D/3D, Web Audio",
    why: "Cockpit simulation with starfield depth projection, 360° sweeping tactical radar, gimbal target lead prediction, tri-system power routing (Engines/Shields/Weapons), and overheating mechanics.",
    superpower: "Provides the mathematical and visual framework for futuristic cockpit HUDs, flight simulators, radar tracking displays, and game dashboards.",
    modules: ["MechCockpitSimulator.tsx", "TacticalRadar.ts", "PowerRouter.ts", "mechAudio.ts"],
    wiring: ["Pitch/Yaw Kinematics", "Continuous Hum Synth", "Gimbal Target Lock", "Emergency Heat Purge"],
    tags: ["Cockpit HUD", "Tactical Radar", "Flight Sim", "Power Routing"]
  },
  {
    id: "grip-and-grime-game-of-skate",
    title: "Grip & Grime S.K.A.T.E. Match Engine",
    category: "games-arcade",
    categoryLabel: "Arcade & 3D",
    archetype: "Authentic Action Sports Engine & Scorekeeper",
    stack: "React, TypeScript, Web Audio, Lucide",
    why: "90s street zine aesthetic with authentic maple board pop/landing sound synthesizer, 3D interactive trick dice, Berrics-style scorekeeper, and skateboard geometry visualizer.",
    superpower: "The blueprint for action sports trackers, competition scorekeepers, dice battle apps, and authentic street-culture aesthetic designs.",
    modules: ["TrickDice.tsx", "Scorekeeper.tsx", "DifficultyAnalyzer.tsx", "skateAudio.ts"],
    wiring: ["Synthesized Urethane SFX", "Offense/Defense Turn FSM", "Geometry Stance Multiplier"],
    tags: ["Skate Engine", "Turn-Based FSM", "Web Audio SFX", "90s Zine UI"]
  },

  // Web3 & Crypto
  {
    id: "solanaworldmap",
    title: "Solana Global Validator Mesh",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "3D Validator Globe & TPS Telemetry Engine",
    stack: "Three.js, Vanilla JS, Web Audio, Canvas",
    why: "3D interactive globe and 2D cyber hologram map displaying validator nodes, dynamic cluster switching (Mainnet/Testnet/Devnet), live TPS ticker with sparkline canvas, and global RPC sonar ping latency tests.",
    superpower: "Enables instant generation of blockchain explorers, decentralized network telemetry monitors, and distributed server visualizers.",
    modules: ["Globe3D.js", "TpsTickerCanvas.js", "RpcLatencyTester.js", "ValidatorModal.js"],
    wiring: ["Three.js Shader Glow", "RPC Sonar Chirp Audio", "Dynamic Epoch Ticker", "Stake Delegation Calculator"],
    tags: ["Three.js Globe", "TPS Ticker", "Solana Mesh", "Latency Sonar"]
  },
  {
    id: "crypto-tracker-agent",
    title: "Autonomous Crypto Market Sentiment Agent",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "Candlestick Charting & AI Sentiment Agent",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Real-time HTML5 Canvas candlestick and sparkline charts (EMA/SMA overlays), AI sentiment reasoning agent with step-by-step logic, $50k paper trading portfolio simulator, and custom price alerts.",
    superpower: "Provides the foundational components for fintech trading terminals, crypto analytics portals, and autonomous investment agent dashboards.",
    modules: ["CandlestickCanvas.tsx", "SentimentAgent.tsx", "PortfolioSimulator.tsx", "PriceAlertEngine.ts"],
    wiring: ["Canvas OHLC Crosshairs", "Technical Indicator Overlays", "Audio Frequency Alerts", "Paper Trading Order Book"],
    tags: ["Candlestick Chart", "Paper Trading", "AI Sentiment", "Price Alerts"]
  },
  {
    id: "blockfans",
    title: "BlockFans Creator Token & AMM Suite",
    category: "crypto-web3",
    categoryLabel: "Web3 & Crypto",
    archetype: "Bonding Curve AMM & NFT Fan Pass Minting",
    stack: "React, TypeScript, HTML5 Canvas, Web Audio",
    why: "Mathematical AMM bonding curve visualizer (P(S) = a*S^k), 4-tier NFT fan pass minting sandbox, creator tip jar with full-screen confetti canvas & arpeggio chimes, and staking yield APY calculators.",
    superpower: "Gives AI agents an out-of-the-box tokenomics and Web3 creator monetization engine ready to embed into any decentralized social or creator economy app.",
    modules: ["BondingCurveCanvas.tsx", "FanPassMinter.tsx", "TipJarConfetti.tsx", "StakingCalculator.tsx"],
    wiring: ["Mathematical Bonding Formula", "Full-Screen Particle Confetti", "Arpeggio Web Audio", "Simulated Web3 Signature"],
    tags: ["Bonding Curve", "AMM Math", "NFT Minting", "Staking APY", "Confetti Canvas"]
  },

  // Local & Client Services
  {
    id: "frn2026",
    title: "Family Reunite Network Portal",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "Non-Profit Humanitarian Case Intake & Search",
    stack: "React, Vite, Tailwind, Netlify",
    why: "Humanitarian case intake system with secure document upload flows, searchable case registry, emergency help hotline triggers, and multilingual support.",
    superpower: "Ready-made architecture for case management, non-profit portals, humanitarian relief networks, and sensitive client intake applications.",
    modules: ["CaseIntakeForm.tsx", "CaseSearchFilter.tsx", "EmergencyHotlineBar.tsx"],
    wiring: ["Client-side Sanitization", "Netlify Forms Integration", "Accessible Intake Stepper"],
    tags: ["Non-Profit", "Case Intake", "Humanitarian", "Form Stepper"]
  },
  {
    id: "lfcf",
    title: "Living Faith Community Fellowship",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "Modern Community & Ministry Media Hub",
    stack: "Astro, Tailwind, Schema.org LocalBusiness",
    why: "Complete community organization portal with sermon audio streams, event calendars, ministry directories, and structured JSON-LD church schemas.",
    superpower: "Template for community centers, religious institutions, non-profits, and event-driven organizations.",
    modules: ["SermonAudioPlayer.astro", "EventCalendar.astro", "MinistryGrid.astro"],
    wiring: ["Schema.org Church Graph", "Audio Stream Fallback", "Responsive Media Gallery"],
    tags: ["Astro Local", "Media Stream", "Church Schema", "Event Calendar"]
  },
  {
    id: "valetninjasv2",
    title: "Valet Ninjas Premium Service Platform",
    category: "clients-services",
    categoryLabel: "Local & Client",
    archetype: "On-Demand Logistics & Dynamic Contract Generator",
    stack: "React, Vite, Tailwind, Lucide",
    why: "Dynamic event service estimator, instant contract agreement generator with digital signature canvas, and real-time attendant dispatch tracker.",
    superpower: "Provides the complete booking, estimation, and digital signing flow for local service providers, logistics operations, and catering/event companies.",
    modules: ["InstantEstimator.tsx", "DigitalSignatureCanvas.tsx", "ContractGenerator.tsx"],
    wiring: ["Dynamic Rate Formula", "Canvas Signature Capture", "PDF Workpaper Generator"],
    tags: ["Service Estimator", "Digital Signature", "Contract Generator", "Local Business"]
  },

  // Fintech & Tools
  {
    id: "stripe-mastery-hub",
    title: "Stripe Mastery Architecture Designer",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Fintech Billing Architecture & Webhook Sandbox",
    stack: "React, TypeScript, Netlify Functions",
    why: "Interactive subscription billing flow designer, payment intent lifecycle visualizer, webhook event testing sandbox, and Stripe checkout blueprints.",
    superpower: "Enables AI agents to immediately wire production Stripe subscription models, multi-tier pricing plans, and webhook handlers into any new app without API guesswork.",
    modules: ["SubscriptionDesigner.tsx", "WebhookSimulator.tsx", "CheckoutBlueprint.tsx"],
    wiring: ["Webhook Payload Validator", "Pricing Tier Matrix", "Payment Intent State Machine"],
    tags: ["Stripe Billing", "Webhook Sandbox", "Fintech Architecture", "Pricing Engine"]
  },
  {
    id: "html-to-pdf-invoice-generator",
    title: "Zero-Dependency HTML to PDF Invoice Suite",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Client-Side Financial Document Generator",
    stack: "Vanilla HTML5, CSS3, JavaScript",
    why: "Zero-dependency, purely client-side invoice and receipt generator with multi-currency math, tax calculations, dynamic line items, and print/PDF rendering.",
    superpower: "Provides an instant in-browser invoicing and document generation engine requiring no external PDF microservices or paid APIs.",
    modules: ["InvoiceMathEngine.js", "PrintStyles.css", "CurrencyFormatter.js"],
    wiring: ["Browser Print Optimization", "LocalStorage Invoice History", "Multi-Currency Table"],
    tags: ["PDF Generator", "Invoice Suite", "Zero-Dependency", "In-Browser Math"]
  },
  {
    id: "certpath-roadmaps",
    title: "CertPath Interactive Certification Roadmaps",
    category: "fintech-tools",
    categoryLabel: "Fintech & Tools",
    archetype: "Interactive Career Skill Tree & Node Graph",
    stack: "React, TypeScript, HTML5 Canvas, Lucide",
    why: "Skill-tree visualizer with prerequisite unlocks, career milestone tracking, salary estimator curves, and certification study progress persistence.",
    superpower: "Ideal blueprint for skill trees, learning paths, interactive career roadmaps, and gamified onboarding funnels.",
    modules: ["CertCanvas.tsx", "SkillPrereqTree.tsx", "ProgressTracker.tsx"],
    wiring: ["Canvas Node Dragging", "Prerequisite Dependency Resolution", "Salary Curve Interpolator"],
    tags: ["Skill Tree", "Node Graph", "Interactive Canvas", "Career Roadmap"]
  }
];

// State
let currentCategory = "all";
let searchQuery = "";
let composerSlots = [null, null, null];
let soundEnabled = true;

// Web Audio API Synthesizer
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.1) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSlotSound() {
  playTone(523.25, 'triangle', 0.1, 0.12);
  setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.1), 60);
}

function playSynthesizeChime() {
  const freqs = [440, 554.37, 659.25, 880];
  freqs.forEach((f, idx) => {
    setTimeout(() => playTone(f, 'sine', 0.25, 0.08), idx * 70);
  });
}

// Background Neural Constellation Canvas
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(50, Math.floor(window.innerWidth / 30));
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.8 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.25;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update nodes
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Render Blueprints Cards
function renderBlueprints() {
  const container = document.getElementById('blueprints-grid');
  if (!container) return;

  const filtered = BLUEPRINTS_DATA.filter(bp => {
    const matchesCat = currentCategory === 'all' || bp.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesQuery = bp.title.toLowerCase().includes(query) ||
      bp.archetype.toLowerCase().includes(query) ||
      bp.why.toLowerCase().includes(query) ||
      bp.superpower.toLowerCase().includes(query) ||
      bp.stack.toLowerCase().includes(query) ||
      bp.tags.some(t => t.toLowerCase().includes(query));

    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
        <p style="font-family: var(--font-mono); font-size: 1.1rem; margin-bottom: 0.5rem;">No blueprint modules match your query.</p>
        <p style="font-size: 0.9rem;">Try searching for "3D", "Canvas", "Audio", "Stripe", or "Terminal".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(bp => `
    <article class="blueprint-card" data-id="${bp.id}">
      <div class="card-top">
        <span class="cat-tag ${bp.category}">${bp.categoryLabel}</span>
        <span class="stack-pill">${bp.stack}</span>
      </div>

      <h3 class="card-title">${bp.title}</h3>
      <div class="card-archetype">📐 ${bp.archetype}</div>

      <div class="card-why-block">
        <strong>Why it powers Zoth Studio</strong>
        ${bp.why}
      </div>

      <div class="features-tags">
        ${bp.tags.map(t => `<span class="feat-tag">${t}</span>`).join('')}
      </div>

      <div class="card-footer">
        <button class="btn-card-detail" type="button" onclick="openBlueprintModal('${bp.id}')">
          <span>View Spec</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="btn-card-add" type="button" onclick="addToComposer('${bp.id}')">
          + Add to Composer
        </button>
      </div>
    </article>
  `).join('');
}

// Modal View
window.openBlueprintModal = function(id) {
  const bp = BLUEPRINTS_DATA.find(b => b.id === id);
  if (!bp) return;

  playTone(600, 'sine', 0.05, 0.08);

  const modal = document.getElementById('blueprint-modal');
  document.getElementById('modal-category').textContent = bp.categoryLabel.toUpperCase();
  document.getElementById('modal-category').className = `modal-cat-badge ${bp.category}`;
  document.getElementById('modal-title').textContent = bp.title;
  document.getElementById('modal-archetype').textContent = `Archetype: ${bp.archetype} (${bp.stack})`;
  document.getElementById('modal-why').textContent = bp.why;
  document.getElementById('modal-superpower').textContent = bp.superpower;

  document.getElementById('modal-modules-list').innerHTML = bp.modules.map(m => `<li>${m}</li>`).join('');
  document.getElementById('modal-wiring-list').innerHTML = bp.wiring.map(w => `<li>${w}</li>`).join('');

  const samplePrompt = `zoth build --blueprint "${bp.id}" \\
  --archetype "${bp.archetype}" \\
  --include-modules "${bp.modules.join(',')}" \\
  --wiring "${bp.wiring.join(',')}" \\
  --deploy netlify`;
  
  document.getElementById('modal-prompt-code').textContent = samplePrompt;

  const addBtn = document.getElementById('modal-add-composer-btn');
  addBtn.onclick = () => {
    addToComposer(bp.id);
    modal.close();
  };

  const copyBtn = document.getElementById('modal-copy-prompt-btn');
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(samplePrompt);
    copyBtn.textContent = 'Copied!';
    playTone(880, 'sine', 0.08, 0.1);
    setTimeout(() => { copyBtn.textContent = 'Copy Agent Prompt'; }, 2000);
  };

  modal.showModal();
};

// Composer Slots Logic
window.addToComposer = function(id) {
  const bp = BLUEPRINTS_DATA.find(b => b.id === id);
  if (!bp) return;

  // Check if already present
  if (composerSlots.some(s => s && s.id === bp.id)) {
    playTone(300, 'sawtooth', 0.1, 0.1);
    return;
  }

  // Find first empty slot
  const emptyIdx = composerSlots.findIndex(s => s === null);
  if (emptyIdx === -1) {
    // replace last
    composerSlots[2] = bp;
  } else {
    composerSlots[emptyIdx] = bp;
  }

  playSlotSound();
  renderComposerSlots();
};

window.removeFromComposer = function(idx) {
  composerSlots[idx] = null;
  playTone(350, 'sine', 0.06, 0.08);
  renderComposerSlots();
};

function renderComposerSlots() {
  const container = document.getElementById('composer-slots');
  if (!container) return;

  container.innerHTML = composerSlots.map((slot, idx) => {
    if (!slot) {
      const labels = [
        "Select a Foundation UI / Client Block",
        "Select an Interactive Engine / Canvas Block",
        "Select a Logic / Web3 / Fintech Block"
      ];
      return `
        <div class="slot-empty" data-slot="${idx + 1}">
          <span class="slot-num">${idx + 1}</span>
          <span class="slot-text">${labels[idx]}</span>
        </div>
      `;
    }

    return `
      <div class="slot-filled" data-slot="${idx + 1}">
        <span class="slot-num">${idx + 1}</span>
        <div class="slot-filled-meta">
          <h4>${slot.title}</h4>
          <p>${slot.archetype}</p>
        </div>
        <button class="slot-remove-btn" type="button" aria-label="Remove slot" onclick="removeFromComposer(${idx})">✕</button>
      </div>
    `;
  }).join('');
}

// Generate Full Zoth Spec
function generateZothSpec() {
  const active = composerSlots.filter(Boolean);
  if (active.length === 0) {
    playTone(250, 'sawtooth', 0.15, 0.1);
    alert("Please select at least 1 blueprint block into the composer slots!");
    return;
  }

  playSynthesizeChime();

  const tray = document.getElementById('composer-output-tray');
  const codeBlock = document.getElementById('spec-code-block');

  const blueprintsFlag = active.map(b => b.id).join(' + ');
  const archetypes = active.map(b => b.archetype).join(' | ');
  const combinedModules = Array.from(new Set(active.flatMap(b => b.modules)));
  const combinedWiring = Array.from(new Set(active.flatMap(b => b.wiring)));

  const specText = `// ==========================================
// 🚀 ZOTH STUDIO COMPOSITE APP BLUEPRINT SPEC
// Generated: ${new Date().toISOString()}
// Blueprints: [ ${blueprintsFlag} ]
// ==========================================

$ zoth compose \\
  --blueprints "${active.map(b => b.id).join(',')}" \\
  --target-stack "Astro/Vite + Tailwind + Web Audio" \\
  --seo-aeo-mode "strict-schema-org" \\
  --wcag-audit "level-aa" \\
  --offline-mocks "enabled"

## 🏗️ Architecture Composite Graph:
${active.map((b, i) => `  ${i+1}. [${b.categoryLabel.toUpperCase()}] ${b.title} (${b.archetype})`).join('\n')}

## 📦 Bundled Core Modules:
${combinedModules.map(m => `  • ${m}`).join('\n')}

## ⚡ Technical Wiring & Integration Hooks:
${combinedWiring.map(w => `  • ${w}`).join('\n')}

## 🤖 Agent Execution Prompt:
"Act as the Zoth Studio Senior Systems Architect. Compose a unified production-ready web application by integrating the ${active.map(b => `'${b.title}'`).join(' and ')} blueprints. Ensure zero external broken API dependencies by embedding offline fallback mock engines, full WCAG 2.1 AA :focus-visible styling, schema.org JSON-LD structured data, and responsive glassmorphic UI tokens."
`;

  codeBlock.textContent = specText;
  tray.classList.remove('hidden');
  tray.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();

  // Set counts
  document.getElementById('count-all').textContent = BLUEPRINTS_DATA.length;
  document.getElementById('metric-total-blueprints').textContent = `${BLUEPRINTS_DATA.length}+`;

  renderBlueprints();
  renderComposerSlots();

  // Search input
  const searchInput = document.getElementById('blueprint-search');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderBlueprints();
  });

  // Hotkey / to search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('blueprint-modal');
      if (modal && modal.open) modal.close();
    }
    if (e.key === 'm' || e.key === 'M') {
      if (document.activeElement.tagName !== 'INPUT') {
        soundEnabled = !soundEnabled;
        playTone(440, 'sine', 0.05, 0.1);
      }
    }
  });

  // Category filter pills
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      p.classList.add('is-active');
      p.setAttribute('aria-selected', 'true');
      currentCategory = p.getAttribute('data-cat');
      playTone(500, 'sine', 0.04, 0.06);
      renderBlueprints();
    });
  });

  // Synthesize button
  document.getElementById('btn-synthesize').addEventListener('click', generateZothSpec);
  document.getElementById('btn-clear-composer').addEventListener('click', () => {
    composerSlots = [null, null, null];
    document.getElementById('composer-output-tray').classList.add('hidden');
    playTone(300, 'sine', 0.06, 0.08);
    renderComposerSlots();
  });

  // Copy Spec button
  document.getElementById('btn-copy-spec').addEventListener('click', () => {
    const code = document.getElementById('spec-code-block').textContent;
    navigator.clipboard.writeText(code);
    const copyBtn = document.getElementById('btn-copy-spec');
    copyBtn.innerHTML = '<span>Copied to Clipboard!</span>';
    playTone(880, 'sine', 0.08, 0.1);
    setTimeout(() => {
      copyBtn.innerHTML = '<span class="copy-text">Copy Prompt</span>';
    }, 2000);
  });

  // Modal Close
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('blueprint-modal').close();
  });

  // Sound toggle button
  document.getElementById('sound-toggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    playTone(soundEnabled ? 660 : 330, 'sine', 0.08, 0.1);
  });
});
