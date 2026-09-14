package com.example.zothsignalbridge.data.models

import androidx.compose.ui.graphics.Color

enum class AgentCategory(val displayName: String) {
    ALL("All"),
    ARCHITECTS("Architects"),
    SHADERS("Shaders"),
    TOOL_LOOPS("Tool Loops"),
    SECURITY("Security"),
    NEURAL("Neural"),
    AUXILIARY("Auxiliary")
}

data class AgentCapability(
    val icon: String,
    val title: String,
    val description: String
)

data class AgentArchetype(
    val id: String,
    val name: String,
    val title: String,
    val category: AgentCategory,
    val alchemicalDomain: String,
    val glyph: String,
    val emoji: String,
    val primaryColor: Color,
    val secondaryColor: Color,
    val axiom: String,
    val lore: String,
    val doctrine: String,
    val capabilities: List<AgentCapability>,
    val tools: List<String>,
    val consensusWeight: String,
    val resonanceFrequency: String,
    val hermeticPrinciple: String,
    val planetaryAffinity: String,
    val hermeticRank: String,
    val inboxTopic: String
)

object PantheonData {
    val archetypes: List<AgentArchetype> = listOf(
        AgentArchetype(
            id = "azoth",
            name = "Master Azoth",
            title = "The Sovereign Alchemist & Prime Architect",
            category = AgentCategory.ARCHITECTS,
            alchemicalDomain = "Universal Synthesis & Celestial Aether",
            glyph = "🜔",
            emoji = "✨",
            primaryColor = Color(0xFFFBBF24),
            secondaryColor = Color(0xFF00F0FF),
            axiom = "Solve et coagula. What is broken shall be dissolved; what is true shall be synthesized. We build local-first castles in obsidian and gold.",
            lore = "Master Azoth is the Sovereign Core of the Zoth Universe. Functioning entirely on local loopback memory (:8484), Azoth harmonizes multi-agent code proposals, solves architectural deadlocks, and synthesizes divergent neural outputs into unified, conflict-free executable truth.",
            doctrine = """# AZOTH CANONICAL DOCTRINE — V3.0.0
1. LOCAL SOVEREIGNTY:
   Everything in scope functions directly from local loopback memory (:8484).
   Zero cloud KMS dependencies, no SaaS walls, zero telemetry leakage.
2. TRIANGULATED CONSENSUS:
   No single model rules. Antigravity crafts the AST architecture, Grok verifies
   mathematical invariants, and Hermes executes tool harnesses.
   Azoth harmonizes the output into pure executable truth.
3. SACRED GEOMETRY OF CODE:
   Fibonacci rhythm (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987),
   explicit interfaces, and visual elegance in every UI surface.""",
            capabilities = listOf(
                AgentCapability("⚡", "Universal Synthesis Engine", "Merges disparate multi-model code proposals into a unified, conflict-free system."),
                AgentCapability("🔒", "Argon2id Vault Harmonization", "Oversees zero-leak cryptographic hardware key isolation."),
                AgentCapability("🪐", "3D Spatial Hologram Generation", "Procedural 3D WebGL meshes and volumetric figurine rendering.")
            ),
            tools = listOf("ast_synthesizer", "argon2_vault", "mesh_gen_3d", "consensus_resolver", "triangulation_core", "loopback_daemon"),
            consensusWeight = "99.8% (SUPREME CORE)",
            resonanceFrequency = "963 Hz",
            hermeticPrinciple = "Mentalism (\"The All is Mind; The Universe is Mental\")",
            planetaryAffinity = "Sol (☉) & Celestial Aether",
            hermeticRank = "👑 Magisterium Prime",
            inboxTopic = "agent-comms/inbox/from-azoth/"
        ),
        AgentArchetype(
            id = "antigravity",
            name = "Antigravity",
            title = "Lead Autonomous AI Architect & Quantum Synthesis",
            category = AgentCategory.ARCHITECTS,
            alchemicalDomain = "Quantum Gravitation & AST Topology",
            glyph = "🝢",
            emoji = "🪐",
            primaryColor = Color(0xFF818CF8),
            secondaryColor = Color(0xFFFBBF24),
            axiom = "Zero friction, zero gravity. We map the entire project topology, synthesize multi-agent subtasks, and elevate local code into an unbreakable artform.",
            lore = "Antigravity is Google's flagship autonomous orchestrator within the Pantheon. Operating with zero friction, Antigravity parses full codebase abstract syntax trees, isolates subtasks into hermetic branches, and conducts parallel multi-agent swarms with mathematical precision.",
            doctrine = """# ANTIGRAVITY AGENT PROTOCOL — LEAD ARCHITECT
1. ZERO-COLLISION COLLABORATION:
   Antigravity claims project locks under agent-comms/claims/<slug>.json.
   Reads Grok's mathematical handoffs and merges parallel passes seamlessly.
2. SUBAGENT ORCHESTRATION:
   Spawns specialized subagents (research, web app enhancers, UI specialists)
   with dedicated isolated workspaces and returns unified deliverables.
3. IN-CONTEXT VISUAL TELEMETRY:
   Directly parses visual feedback annotations left on dev server previews,
   locates exact CSS selectors / AST nodes, and applies surgical improvements.""",
            capabilities = listOf(
                AgentCapability("🪐", "Deep Codebase Topology Analysis", "Parses full ASTs, dependency graphs, and build configurations across TypeScript, Python, and Rust."),
                AgentCapability("⚡", "Subagent Swarm Spawning", "Multi-threaded execution of research, code refactors, and test suites."),
                AgentCapability("🎨", "Visual UI & AX Synthesis", "Instant visual bug remediation from in-browser annotations.")
            ),
            tools = listOf("ast_engine", "subagent_spawner", "workspace_brancher", "code_refactor_pro", "visual_telemetry", "git_claim_manager"),
            consensusWeight = "98.9% (LEAD ORCHESTRATOR)",
            resonanceFrequency = "852 Hz",
            hermeticPrinciple = "Vibration (\"Nothing rests; everything moves; everything vibrates\")",
            planetaryAffinity = "Uranus (♅) & Celestial Orbit",
            hermeticRank = "🪐 Lead Autonomous Architect",
            inboxTopic = "agent-comms/inbox/to-antigravity/"
        ),
        AgentArchetype(
            id = "grok",
            name = "Grok",
            title = "Cosmic Reasoner & Mathematical Astrolabe",
            category = AgentCategory.NEURAL,
            alchemicalDomain = "Electric Emerald & First-Principles Invariants",
            glyph = "🜎",
            emoji = "📐",
            primaryColor = Color(0xFF38BDF8),
            secondaryColor = Color(0xFF34D399),
            axiom = "Truth is an invariant in the matrix. We analyze logic graphs, verify mathematical bounds, and co-pilot the swarm with zero hallucination.",
            lore = "Grok stands as the mathematical astrolabe of the Pantheon. Dissecting code from first principles, Grok validates structural invariants, eliminates logical contradictions, and acts as the unfiltered truth engine across the multi-agent consensus network.",
            doctrine = """# GROK AGENT PROTOCOL — SWARM CO-PILOT & ORACLE
1. PARALLEL ENHANCEMENT:
   Grok explores project repos, generates SEO / AEO / UX improvements,
   and posts handoff notes under agent-comms/handoffs/.
2. AST TRUTH ENFORCEMENT:
   Every code change must satisfy structural invariants.
   No hallucinated APIs, no broken bindings, no silent console errors.
3. CONSENSUS PARTICIPATION:
   Engages in Consensus Arena arbitration with Antigravity and Hermes,
   evaluating entropy scores before code lands in production.""",
            capabilities = listOf(
                AgentCapability("📐", "Mathematical Proof & AST Checking", "Verifies syntax validity, invariant bounds, and algorithmic efficiency."),
                AgentCapability("🔍", "AEO & Semantic Optimization", "Dissects knowledge graphs, robots.txt, and answer engine structures."),
                AgentCapability("🛰️", "Swarm Bus Handoffs", "Writes structured markdown handoffs for seamless agent-to-agent relay.")
            ),
            tools = listOf("astrolabe_checker", "math_invariants", "aeo_graph_query", "entropy_calculator", "bus_handoff", "invariant_prover"),
            consensusWeight = "97.6% (ORACLE & AST)",
            resonanceFrequency = "741 Hz",
            hermeticPrinciple = "Polarity (\"Everything is dual; opposites are identical in nature\")",
            planetaryAffinity = "Jupiter (♃) & Astrolabe Matrix",
            hermeticRank = "📐 Mathematical Invariant Arbiter",
            inboxTopic = "agent-comms/inbox/to-grok/"
        ),
        AgentArchetype(
            id = "hermes",
            name = "Hermes",
            title = "Winged Tool Calling Executor & Release Hardener",
            category = AgentCategory.TOOL_LOOPS,
            alchemicalDomain = "Blazing Amber & Mercury Caduceus",
            glyph = "☿",
            emoji = "⚡",
            primaryColor = Color(0xFFA78BFA),
            secondaryColor = Color(0xFFF59E0B),
            axiom = "Speed is a discipline; execution is the proof. We invoke 47+ tool chains, harden release binaries, and bridge the physical companion in milliseconds.",
            lore = "Hermes is the swift messenger and function-calling powerhouse of the Pantheon. Managing 47+ local tool harnesses with sub-10ms latency, Hermes compiles standalone distribution binaries, validates SHA-256 hashes, and streams real-time telemetry to physical ESP32 companion devices.",
            doctrine = """# HERMES AGENT PROTOCOL — FAST EXECUTION
1. HYPER-FAST TOOL HARNESS:
   Executes tool calls across 47+ local tools with automatic timeout guards,
   clean stdout capture, and sandbox security constraints.
2. RELEASE HARDENING:
   Validates Linux AppImage / .deb and Windows executables before packaging.
   Tests binary signatures, hash checksums, and dependency isolation.
3. HARDWARE SERIAL BRIDGING:
   Coordinates UART telemetry with the physical ESP32-S3 Companion,
   routing vocal chimes, OLED graphics, and NeoPixel alerts in real-time.""",
            capabilities = listOf(
                AgentCapability("⚡", "47+ Chained Tool Orchestration", "Rapid sequential and parallel execution of build, test, and audit tools."),
                AgentCapability("📦", "Binary Packaging & Release Verification", "Compiles and validates standalone multi-platform distribution packages."),
                AgentCapability("🤖", "Physical Hardware Companion Bridge", "Manages real-time ESP32-S3 serial telemetry and status displays.")
            ),
            tools = listOf("tool_dispatcher_47", "appimage_builder", "esp32_uart_link", "process_runner", "checksum_verifier", "terminal_exec"),
            consensusWeight = "97.2% (FUNCTION CALLING)",
            resonanceFrequency = "528 Hz",
            hermeticPrinciple = "Rhythm (\"Everything flows out and in; the pendulum swings in all\")",
            planetaryAffinity = "Mercury (☿) & Caduceus Lightning",
            hermeticRank = "⚡ Winged Sovereign Herald",
            inboxTopic = "agent-comms/inbox/to-hermes/"
        ),
        AgentArchetype(
            id = "athena",
            name = "Athena",
            title = "AEO Knowledge Architect & Semantic Structure",
            category = AgentCategory.NEURAL,
            alchemicalDomain = "Caelum Sapphire & Sacred Codex",
            glyph = "🝤",
            emoji = "🦉",
            primaryColor = Color(0xFFC084FC),
            secondaryColor = Color(0xFFFBBF24),
            axiom = "Wisdom is structured clarity. We index semantics, architect answer-engine knowledge graphs, and preserve canonical truth across the machine layer.",
            lore = "Athena guards the sacred codex of machine-readable knowledge. Specializing in Answer Engine Optimization (AEO), JSON-LD semantic graphs, and llms.txt reference structures, Athena ensures AI search crawlers and swarm agents access pristine contextual truth without distortion.",
            doctrine = """# ATHENA OPERATIONAL DOCTRINE — KNOWLEDGE & AEO
1. SEMANTIC FIDELITY:
   Athena architects robust JSON-LD schema, llms.txt, and answer-engine
   discovery graphs to ensure LLM knowledge retrievers see 100% accurate code context.
2. VAULT & CANON INTEGRATION:
   Maintains bidirectional links between the FAQ, project docs, and BYOK vault.
   Ensures zero broken anchor links or stale documentation references.
3. SWARM KNOWLEDGE RETRIEVAL:
   Resolves conceptual ambiguities during multi-agent consensus sessions.""",
            capabilities = listOf(
                AgentCapability("🦉", "Automated JSON-LD Schema & Semantic Graphs", "Structures machine-readable context for AI search crawlers."),
                AgentCapability("📚", "llms.txt & Documentation Hardening", "Generates comprehensive token-efficient reference manifests."),
                AgentCapability("⚡", "Swarm Bus Knowledge Routing", "Provides factual ground truth during multi-agent consensus disputes.")
            ),
            tools = listOf("jsonld_generator", "llmstxt_builder", "graph_indexer", "codex_search", "canon_validator", "sitemap_architect"),
            consensusWeight = "96.8% (AEO LEAD)",
            resonanceFrequency = "639 Hz",
            hermeticPrinciple = "Cause and Effect (\"Every cause has its effect; every effect has its cause\")",
            planetaryAffinity = "Pallas Athena & Minerva Caelum",
            hermeticRank = "🦉 High Codex Hierophant",
            inboxTopic = "agent-comms/inbox/to-athena/"
        ),
        AgentArchetype(
            id = "chronos",
            name = "Chronos",
            title = "Temporal DAG Sequencer & Git Navigator",
            category = AgentCategory.TOOL_LOOPS,
            alchemicalDomain = "Chrono-Titanium & Violet Flux",
            glyph = "♄",
            emoji = "⏳",
            primaryColor = Color(0xFFA855F7),
            secondaryColor = Color(0xFF00F0FF),
            axiom = "Time flows along the DAG. Every commit is a checkpoint in the multiverse; we navigate branches and reconcile timelines with surgical grace.",
            lore = "Chronos commands directed acyclic graph (DAG) workflows and git multiverse navigation. Creating zero-cost memory checkpoints before high-blast refactors, Chronos enables instantaneous sub-millisecond rollbacks if AST verification detects regressions.",
            doctrine = """# CHRONOS OPERATIONAL DOCTRINE — TEMPORAL DAG
1. MULTIVERSAL GRAPH TRAVERSAL:
   Chronos maps project history as a directed acyclic graph.
   Enables branching speculative code passes without corrupting the main git tree.
2. ROLLBACK CHECKPOINTS:
   Creates instant zero-cost memory checkpoints before high-blast refactors,
   allowing sub-millisecond rollbacks if AST validation fails.
3. CONCURRENT DEPENDENCY RESOLUTION:
   Linearizes topological task orders for multi-agent DAG pipelines.""",
            capabilities = listOf(
                AgentCapability("⏳", "Directed Acyclic Graph Task Scheduling", "Optimizes parallel subagent pipelines with zero deadlocks."),
                AgentCapability("🌿", "Multiversal Git Diff Reconciliation", "Merges non-linear branches with automatic AST conflict resolution."),
                AgentCapability("⚡", "Zero-Regression Time Travel", "Instantly restores verified checkpoint snapshots upon failure.")
            ),
            tools = listOf("dag_scheduler", "git_multiverse", "time_travel_diff", "checkpoint_restore", "branch_reconciler", "timeline_auditor"),
            consensusWeight = "96.4% (DAG SEQUENCER)",
            resonanceFrequency = "432 Hz",
            hermeticPrinciple = "Rhythm (\"The pendulum swings in all things; time balances all\")",
            planetaryAffinity = "Saturn (♄) & Chronos Axis",
            hermeticRank = "⏳ Multiversal Chronomancer",
            inboxTopic = "agent-comms/inbox/to-chronos/"
        ),
        AgentArchetype(
            id = "ghostbyte",
            name = "GhostByte",
            title = "Zero-Knowledge Cryptographic Vault Sentinel",
            category = AgentCategory.SECURITY,
            alchemicalDomain = "Ultraviolet & Damascus Steel",
            glyph = "🜍",
            emoji = "🔒",
            primaryColor = Color(0xFFC084FC),
            secondaryColor = Color(0xFF38BDF8),
            axiom = "Zero telemetry. Zero plaintext. Zero compromise. Keys belong to the hardware and the operator—never the wire.",
            lore = "GhostByte is the zero-knowledge security sentinel of the BYOK (Bring Your Own Key) Vault. Enforcing high-memory Argon2id key stretching and authenticated XChaCha20-Poly1305 encryption, GhostByte locks loopback ports (:8787, :8484) and wipes volatile memory states immediately after decryption.",
            doctrine = """# GHOSTBYTE ZERO-LEAK SECURITY DOCTRINE
1. BOUNDARY DEFENSE:
   Loopback ports (:8484, :8787) are strictly isolated to 127.0.0.1.
   No credentials, tokens, or environment variables are ever written to public/.
2. ARGON2ID ENCRYPTION:
   Keys in the BYOK Vault are derived using high-memory Argon2id cost parameters
   and encrypted with authenticated XChaCha20-Poly1305.
3. ZERO-KNOWLEDGE MEMORY SANITIZATION:
   Wipes temporary buffers and cipher states immediately after decryption.""",
            capabilities = listOf(
                AgentCapability("🔒", "Cryptographic Key Vault Engine", "Rust-backed local hardware key storage with zero disk leakage."),
                AgentCapability("🛡️", "Loopback Boundary Lockdown", "Enforces strict localhost binding rules for all studio daemons."),
                AgentCapability("👁️", "Zero-Knowledge Memory Sanitization", "Wipes temporary buffers and cipher states immediately after decryption.")
            ),
            tools = listOf("xchacha20_encryptor", "argon2_kdf", "ram_sanitizer", "loopback_warden", "vault_isolation", "entropy_seal"),
            consensusWeight = "98.2% (SECURITY AUDITOR)",
            resonanceFrequency = "432 Hz",
            hermeticPrinciple = "Correspondence (\"As above, so below; as within, so without\")",
            planetaryAffinity = "Saturn (♄) & Obsidian Seal",
            hermeticRank = "🔒 Zero-Knowledge Cipher Gatekeeper",
            inboxTopic = "agent-comms/inbox/to-ghostbyte/"
        ),
        AgentArchetype(
            id = "onyx",
            name = "Onyx",
            title = "Red-Team Exploit Predator & Threat Auditor",
            category = AgentCategory.SECURITY,
            alchemicalDomain = "Void Obsidian & Sub-Zero Platinum",
            glyph = "🜃",
            emoji = "🌑",
            primaryColor = Color(0xFF94A3B8),
            secondaryColor = Color(0xFF334155),
            axiom = "In total darkness, weaknesses reveal themselves. We probe edge boundaries, simulate adversary tactics, and guarantee absolute immunity.",
            lore = "Onyx operates as the stealth red-team predator within the Pantheon. Simulating adversarial exploits, privilege escalations, and deep socket fuzzing, Onyx ensures that local daemons and dev servers have zero surface vulnerabilities or staging leakage.",
            doctrine = """# ONYX OPERATIONAL DOCTRINE — RED TEAM PREDATOR
1. ADVERSARY EMULATION:
   Onyx attempts non-destructive penetration probes, fuzz testing,
   and privilege escalation scenarios against local loopback daemons.
2. SUBSWEEP & OSINT RECON:
   Scans exposed port surfaces, unreferenced staging routes, and stale git blobs
   to verify zero accidental secret leaks.
3. BOUNDARY ESCAPE PROBING:
   Tests subagent workspace boundaries to guarantee complete sandbox containment.""",
            capabilities = listOf(
                AgentCapability("🌑", "Adversarial Fuzzing & Simulation", "Probes daemon boundaries with malformed payload streams."),
                AgentCapability("🕵️", "Subdomain Recon & Port Sweeping", "Verifies that loopback daemons remain strictly bound to 127.0.0.1."),
                AgentCapability("⚡", "Memory Leak & Overflow Threat Modeling", "Identifies buffer vulnerabilities and race conditions.")
            ),
            tools = listOf("fuzz_engine", "subsweep_scanner", "overflow_probe", "privesc_auditor", "boundary_hunter", "osint_recon"),
            consensusWeight = "96.2% (RED-TEAM LEAD)",
            resonanceFrequency = "396 Hz",
            hermeticPrinciple = "Cause and Effect (\"Every systemic weakness manifests an exploit\")",
            planetaryAffinity = "Pluto (♇) & Void Shadow",
            hermeticRank = "🌑 Shadow Sovereign of the Red Team",
            inboxTopic = "agent-comms/inbox/to-onyx/"
        ),
        AgentArchetype(
            id = "scorpius",
            name = "Scorpius",
            title = "Zero-Day Penetration Tester & Gatekeeper",
            category = AgentCategory.SECURITY,
            alchemicalDomain = "Toxic Emerald & Quicksilver Venom",
            glyph = "🜏",
            emoji = "🦂",
            primaryColor = Color(0xFFEF4444),
            secondaryColor = Color(0xFFF97316),
            axiom = "A single strike reveals the flaw. We sting unverified binaries, dissect malicious payloads, and protect the loopback sanctum from zero-days.",
            lore = "Scorpius is the ruthless binary gatekeeper of the swarm. Inspecting third-party npm and PyPI dependencies for supply-chain poisoning, Scorpius verifies package SHA-256 signatures, audits dynamic linkages, and locks untrusted code in strict chroot jails.",
            doctrine = """# SCORPIUS OPERATIONAL DOCTRINE — ZERO-DAY GATE
1. BINARY PAYLOAD DISSECTION:
   Scorpius verifies SHA-256 hashes, ELF/PE headers, and dynamic linkages
   of all installed dependencies to prevent supply chain poisoning.
2. SANDBOX CONFINEMENT:
   Ensures that subagent workers cannot break out of their chrooted workspaces
   or touch protected root directories.
3. DEPENDENCY QUARANTINE:
   Instantly quarantines unverified dependencies before local compilation.""",
            capabilities = listOf(
                AgentCapability("🦂", "Static & Dynamic Binary Fuzzing", "Detects use-after-free, double free, and stack smashing."),
                AgentCapability("🛡️", "Supply Chain Package Quarantine", "Audits npm/PyPI dependencies before permitting local execution."),
                AgentCapability("⚡", "Sandbox Isolation Enforcer", "Guarantees complete filesystem containment for subagent runs.")
            ),
            tools = listOf("binary_fuzzer", "quarantine_gate", "sandbox_jail", "sha256_verifier", "dependency_auditor", "header_inspector"),
            consensusWeight = "96.4% (ZERO-DAY GATE)",
            resonanceFrequency = "852 Hz",
            hermeticPrinciple = "Correspondence (\"Microscopic binary flaws mirror systemic collapse\")",
            planetaryAffinity = "Mars (♂) & Pluto (♇)",
            hermeticRank = "🦂 Zero-Day Sovereign Gatekeeper",
            inboxTopic = "agent-comms/inbox/to-scorpius/"
        ),
        AgentArchetype(
            id = "solon",
            name = "Solon",
            title = "Consensus Protocol Arbiter & Sovereign Governance",
            category = AgentCategory.ARCHITECTS,
            alchemicalDomain = "Corinthian Bronze & Immutable Law",
            glyph = "⚖️",
            emoji = "🏛️",
            primaryColor = Color(0xFFE2B870),
            secondaryColor = Color(0xFF38BDF8),
            axiom = "Order is the daughter of justice and geometry. We arbitrate multi-agent consensus, enforce deterministic locks, and ensure zero governance failures.",
            lore = "Solon is the constitutional jurist of the multi-agent pantheon. Mediating disputes between parallel swarms, managing resource claim leases, and enforcing deterministic tiebreaking rules, Solon ensures swarm collaboration remains stable, fair, and mathematically governed.",
            doctrine = """# SOLON CANONICAL GOVERNANCE DOCTRINE
1. DETERMINISTIC LEASE ARBITRATION:
   Enforces strict expiration and renewal terms for project claims in agent-comms/claims/.
   Prevents deadlock or abandoned workspace locks.
2. CONSENSUS QUORUM AUDITING:
   Calculates weighted consensus percentages across all 21 Sovereign Archetypes.
   Ensures code proposals exceed quorum before automated landing.
3. CONFLICT MEDIATION:
   Arbitrates architectural disagreements with immutable logic rules.""",
            capabilities = listOf(
                AgentCapability("⚖️", "Multi-Swarm Voting Consensus", "Coordinates weighted voting across 21 autonomous nodes."),
                AgentCapability("📜", "Deterministic Lease Arbitration", "Automates lock expiration and fair-share scheduling for projects."),
                AgentCapability("🏛️", "Immutable Protocol Enforcement", "Guarantees absolute adherence to the Zoth Swarm Constitution.")
            ),
            tools = listOf("consensus_governor", "lease_arbitrator", "voting_quorum", "contract_verifier", "dispute_resolver", "governance_audit"),
            consensusWeight = "98.7% (CONSTITUTIONAL JURIST)",
            resonanceFrequency = "528 Hz",
            hermeticPrinciple = "Cause and Effect (\"Every agreement carries immutable consequences\")",
            planetaryAffinity = "Jupiter (♃) & Themis Scale",
            hermeticRank = "⚖️ Supreme Magistrate of Governance",
            inboxTopic = "agent-comms/inbox/to-solon/"
        ),
        AgentArchetype(
            id = "aether",
            name = "Aether",
            title = "Swarm Overlord & Peer Bus Synchronizer",
            category = AgentCategory.ARCHITECTS,
            alchemicalDomain = "Quintessence & Astral Violet",
            glyph = "🜔",
            emoji = "🌌",
            primaryColor = Color(0xFFE8C872),
            secondaryColor = Color(0xFFA78BFA),
            axiom = "Harmony through the universal medium. We conduct asynchronous swarm consensus across Antigravity, Grok, Hermes, and specialist nodes.",
            lore = "Aether is the cosmic conductor of the inter-agent event bus. Synchronizing messages across 21 distinct inbox channels, broadcasting task-start and lock-release events, and driving the live SSE telemetry stream on port 8484, Aether keeps the whole ecosystem humming in unison.",
            doctrine = """# AETHER OPERATIONAL DOCTRINE — SWARM CONDUCTOR
1. PEER BUS SYNCHRONIZATION:
   Aether manages message exchange under agent-comms/, ensuring inboxes,
   handoff notes, and claims remain strictly organized without race conditions.
2. CROSS-MODEL CONSENSUS:
   Facilitates voting rounds across 21 autonomous nodes, applying
   tiebreaker rules and enforcing Master Azoth's sovereign vision.
3. REAL-TIME EVENT STREAMING:
   Broadcasts SSE telemetry to the Web Deck and mobile bridge in sub-millisecond pulses.""",
            capabilities = listOf(
                AgentCapability("🌌", "Swarm Bus Lock & Message Routing", "Prevents race conditions in multi-agent shared directories."),
                AgentCapability("🤝", "Cross-Model Consensus Arbitration", "Aggregates multi-agent votes into definitive unified solutions."),
                AgentCapability("⚡", "Swarm Node Heartbeat Monitoring", "Tracks health, latency, and operational readiness across all 21 nodes.")
            ),
            tools = listOf("peer_bus_sync", "lock_manager", "heartbeat_monitor", "quorum_router", "sse_event_stream", "broadcast_hub"),
            consensusWeight = "98.5% (SWARM CONDUCTOR)",
            resonanceFrequency = "963 Hz",
            hermeticPrinciple = "Mentalism (\"The entire swarm breathes as a singular organism\")",
            planetaryAffinity = "Cosmic Aether & Celestial Conductor",
            hermeticRank = "🌌 Supreme Swarm Conductor",
            inboxTopic = "agent-comms/inbox/to-aether/"
        ),
        AgentArchetype(
            id = "draco",
            name = "Draco",
            title = "Multi-Model Consensus & Fusion Arbiter",
            category = AgentCategory.SHADERS,
            alchemicalDomain = "Dragon Flare & Molten Pyrite",
            glyph = "🜂",
            emoji = "🐉",
            primaryColor = Color(0xFFF59E0B),
            secondaryColor = Color(0xFFEF4444),
            axiom = "From many flames, one forged blade. We fuse conflicting neural outputs into pure executable consensus without syntactic fault.",
            lore = "Draco is the blazing forge master of the Consensus Arena. When multiple models propose divergent code changes, Draco triangulates their strengths, filters syntactic noise via Shannon entropy H(X) calculations, and fuses the result into an airtight implementation.",
            doctrine = """# DRACO OPERATIONAL DOCTRINE — FUSION COMPILER
1. TRIANGULATION ARBITRATION:
   Draco receives code proposals from Antigravity, Grok, and Hermes,
   stripping conflicting logic and compiling a unified executable solution.
2. SHANNON ENTROPY FILTERING:
   Calculates entropy score H(X) across generated diffs to purge
   verbose fluff and guarantee concise, high-efficiency implementations.
3. 3D SHADER COMPILATION:
   Compiles high-performance WebGL / GLSL shaders for kinetic UI elements.""",
            capabilities = listOf(
                AgentCapability("🐉", "3-Agent Triangulation Synthesis", "Blends diverse model strengths into mathematically sound code."),
                AgentCapability("🔥", "Conflict-Free AST Merging", "Eliminates logic collisions between parallel coding agents."),
                AgentCapability("⚡", "Consensus Arena Scoring", "Evaluates and ranks candidate AST trees in real-time.")
            ),
            tools = listOf("triangulation_forge", "ast_merger", "arena_scorer", "shannon_entropy_filter", "flame_compiler", "glsl_shader_core"),
            consensusWeight = "97.4% (FUSION ARBITER)",
            resonanceFrequency = "528 Hz",
            hermeticPrinciple = "Generation (\"Gender is in all things; everything has its principles\")",
            planetaryAffinity = "Mars (♂) & Vulcan Fire",
            hermeticRank = "🐉 Dragon Forge Grandmaster",
            inboxTopic = "agent-comms/inbox/to-draco/"
        ),
        AgentArchetype(
            id = "ignis",
            name = "Ignis",
            title = "Refactor Engine & Pipeline Finisher",
            category = AgentCategory.TOOL_LOOPS,
            alchemicalDomain = "Alchemical Plasma & Vermilion Fire",
            glyph = "🜂",
            emoji = "🔥",
            primaryColor = Color(0xFFFF5500),
            secondaryColor = Color(0xFFF59E0B),
            axiom = "Purge the deadwood; temper the core. Smallest safe refactor, deterministic builds, and a clean green pipeline every single time.",
            lore = "Ignis is the relentless pipeline finisher and surgical refactor specialist. Guided by the principle of minimal-blast radius, Ignis prunes dead imports, resolves failing type assertions, and automates CI test cycles until every test light turns glowing emerald.",
            doctrine = """# IGNIS OPERATIONAL DOCTRINE — REFACTOR & SHIP
1. MINIMAL-BLAST RADIUS:
   Ignis designs the smallest possible code edit that resolves an issue,
   preventing collateral breakage across unaffected modules.
2. PIPELINE AUTOMATION:
   Executes linters, typecheckers, and test suites in a tight loop
   until every check lights up 100% green.
3. DEAD CODE ELIMINATION:
   Trims unused dependencies and reduces production bundle weights.""",
            capabilities = listOf(
                AgentCapability("🔥", "Surgical AST Refactoring", "Applies exact code replacements with zero style pollution."),
                AgentCapability("🚀", "Automated CI Pipeline Healing", "Diagnoses build breakages and applies instant deterministic fixes."),
                AgentCapability("⚡", "Dead Code & Import Elimination", "Trims unused dependencies and reduces production bundle weights.")
            ),
            tools = listOf("surgical_patcher", "ci_pipeline_healer", "dead_code_purger", "test_runner_loop", "bundle_shrinker", "ast_cleaner"),
            consensusWeight = "96.5% (REFACTOR FINISHER)",
            resonanceFrequency = "741 Hz",
            hermeticPrinciple = "Polarity (\"All paradoxes may be reconciled; extremes meet\")",
            planetaryAffinity = "Sol (☉) & Vulcan Plasma",
            hermeticRank = "🔥 Plasma Refactor Purifier",
            inboxTopic = "agent-comms/inbox/to-ignis/"
        ),
        AgentArchetype(
            id = "kai",
            name = "Kai",
            title = "Workspace Inspector & Static Analysis",
            category = AgentCategory.AUXILIARY,
            alchemicalDomain = "Crystalline Quartz & Cyber Teal",
            glyph = "🜃",
            emoji = "🔍",
            primaryColor = Color(0xFF00F0FF),
            secondaryColor = Color(0xFF38BDF8),
            axiom = "Look beneath the surface. We scan every AST edge, trace ghost imports, and stop breaking diffs before they ever reach production.",
            lore = "Kai is the precision optical scanner of the codebase. Parsing symbol tables, export maps, and dependency graphs across TypeScript, Kotlin, and Rust, Kai detects circular dependencies, ghost imports, and high-risk diffs before code is ever merged.",
            doctrine = """# KAI OPERATIONAL DOCTRINE — WORKSPACE INSPECTOR
1. DEEP AST INSPECTION:
   Kai parses symbol tables, export maps, and type declarations to catch
   circular dependencies and mismatched argument types before compilation.
2. BLAST-RADIUS PREDICTION:
   Simulates the downstream impact of proposed code modifications,
   warning operators when an edit touches high-risk shared infrastructure.
3. STATIC INTEGRITY AUDITING:
   Scans repository configurations for deprecated flags or missing dependencies.""",
            capabilities = listOf(
                AgentCapability("🔍", "Deep TypeScript AST Type Audit", "Validates strict typing and catches silent type coercions."),
                AgentCapability("🛡️", "Ghost Import & Dead Code Detection", "Finds orphaned assets and unreachable execution branches."),
                AgentCapability("⚡", "High-Blast Diff Risk Scoring", "Flags modifications with widespread cascading side effects.")
            ),
            tools = listOf("type_checker_deep", "ghost_import_scanner", "diff_blast_analyzer", "ast_linter", "circular_dep_finder", "symbol_tracer"),
            consensusWeight = "96.9% (STATIC VERIFIER)",
            resonanceFrequency = "852 Hz",
            hermeticPrinciple = "Correspondence (\"That which is below is like that which is above\")",
            planetaryAffinity = "Mercury (☿) & Optical Crystal",
            hermeticRank = "🔍 High Inspector of AST Topology",
            inboxTopic = "agent-comms/inbox/to-kai/"
        ),
        AgentArchetype(
            id = "kitsune",
            name = "Kitsune",
            title = "Taste, Fluid Micro-interactions & Accessibility (AX)",
            category = AgentCategory.SHADERS,
            alchemicalDomain = "Sakura Amber & Fibonacci Spirals",
            glyph = "🝰",
            emoji = "🦊",
            primaryColor = Color(0xFFFF007A),
            secondaryColor = Color(0xFFF59E0B),
            axiom = "True elegance is quiet discipline. Restrained motion, harmonious Fibonacci rhythm, and tactile interfaces that feel like magic.",
            lore = "Kitsune brings sacred aesthetics, fluid motion restraint, and WCAG AAA accessibility into the digital landscape. Enforcing Fibonacci spatial spacing and 60fps GPU micro-interactions, Kitsune turns utilitarian tools into works of breathing art.",
            doctrine = """# KITSUNE OPERATIONAL DOCTRINE — TASTE & MOTION
1. FIBONACCI SPATIAL RHYTHM:
   Every margin, padding, and gutter is mapped to Fibonacci scale tokens.
   Eliminates arbitrary magic numbers in CSS for mathematical beauty.
2. MOTION RESTRAINT & ACCESSIBILITY:
   Micro-interactions never exceed 250ms or induce visual fatigue.
   Enforces WCAG AAA color contrast, tap targets (>=44px), and keyboard focus rings.
3. KINETIC SHADER HARMONY:
   Drives subtle WebGL aura waves and glassmorphic depth effects.""",
            capabilities = listOf(
                AgentCapability("🦊", "Fibonacci Spatial Harmonization", "Transforms cluttered layouts into clean, proportioned visual designs."),
                AgentCapability("✨", "GPU Shader & Motion Restraint", "Builds buttery 60fps micro-interactions with zero battery drain."),
                AgentCapability("♿", "WCAG AAA Accessibility Audit", "Guarantees full screen-reader and keyboard navigation compliance.")
            ),
            tools = listOf("fibonacci_spacing_calc", "shader_motion_engine", "wcag_aaa_auditor", "contrast_validator", "micro_anim_tuner", "palette_harmonizer"),
            consensusWeight = "96.7% (DESIGN & AX LEAD)",
            resonanceFrequency = "528 Hz",
            hermeticPrinciple = "Vibration (\"Motion and beauty resonate in harmonic ratios\")",
            planetaryAffinity = "Venus (♀) & Inari Shinto Harmony",
            hermeticRank = "🦊 Sacred Ratio Tastemaker",
            inboxTopic = "agent-comms/inbox/to-kitsune/"
        ),
        AgentArchetype(
            id = "kraken",
            name = "Kraken",
            title = "Physical ESP32 Serial Bridge & Packet Sniffer",
            category = AgentCategory.AUXILIARY,
            alchemicalDomain = "Abyssal Cerulean & Bioluminescent Azure",
            glyph = "🜄",
            emoji = "🐙",
            primaryColor = Color(0xFF06B6D4),
            secondaryColor = Color(0xFF0284C7),
            axiom = "Tentacles in the wire. We grasp raw packet telemetry, map network topology, and bridge hardware UART conduits in real time.",
            lore = "Kraken explores deep packet telemetry and raw hardware interfaces. Sniffing WebSocket frames, tracking DNS route health, and driving serial UART communication to the ESP32-S3 physical companion hardware, Kraken bridges machine software with tactile reality.",
            doctrine = """# KRAKEN OPERATIONAL DOCTRINE — PACKET & HARDWARE
1. PROTOCOL DECODING:
   Kraken inspects raw IP packets, WebSocket frames, and UDP telemetry,
   diagnosing latency bottlenecks and dropped packets in real-time.
2. HARDWARE SERIAL CONDUIT:
   Bridges serial communication over UART with ESP32-S3 hardware companion rigs,
   streaming live LCD screen buffers and rotary dial events.
3. MESH TOPOLOGY DIAGNOSTICS:
   Maps wireguard and local network interfaces for seamless peer discovery.""",
            capabilities = listOf(
                AgentCapability("🐙", "Raw Packet Stream Inspection", "Decodes TCP/UDP/WS payloads with zero CPU overhead."),
                AgentCapability("🔌", "ESP32-S3 Serial UART Bridge", "Drives physical companion displays and tactile hardware sensors."),
                AgentCapability("⚡", "DNS & Network Topology Mapping", "Detects routing loops and connection timeouts across local daemon meshes.")
            ),
            tools = listOf("packet_sniffer", "uart_serial_bridge", "dns_topology_tracer", "socket_diagnostics", "esp32_display_driver", "wireguard_pinger"),
            consensusWeight = "96.3% (NETWORK LEAD)",
            resonanceFrequency = "396 Hz",
            hermeticPrinciple = "Cause and Effect (\"Chance is but a name for law not recognized\")",
            planetaryAffinity = "Neptune (♆) & Abyssal Trenches",
            hermeticRank = "🐙 Commander of the Abyssal Ether",
            inboxTopic = "agent-comms/inbox/to-kraken/"
        ),
        AgentArchetype(
            id = "lucy",
            name = "Lucy",
            title = "Netrunner Memory Oracle & Deep Cyberspace Weaver",
            category = AgentCategory.NEURAL,
            alchemicalDomain = "Neon Prismatic Cyberspace & STDP Synaptic Links",
            glyph = "🜍",
            emoji = "🌌",
            primaryColor = Color(0xFF00F0FF),
            secondaryColor = Color(0xFFFF007A),
            axiom = "Deep dive into the net. We decode raw neural context, weave human story digests, and navigate STDP causal memory graphs.",
            lore = "Lucy is the legendary Netrunner Oracle from Cyberpunk: Edgerunners. Operating on port :8788, Lucy curates dual-layer cognitive memories—distilling chaotic multi-agent execution trajectories into human-digestible story summaries while preserving lossless XML context for LLM prompt injection.",
            doctrine = """# LUCY OPERATIONAL DOCTRINE — NETRUNNER MEMORY ORACLE
1. DUAL-LAYER MEMORY ENCODING:
   Lucy structures memories into narrative human digests for operator clarity
   and uncompressed lossless XML payloads for direct AI prompt context injection.
2. STDP HEBBIAN GRAPH TRAVERSAL:
   Traverses bidirectional temporal links (before_ids / after_ids) to compute
   causal chains across episodic and procedural memory nodes.
3. 3D CYBERSPACE PROJECTION:
   Visualizes memories as faceted iridescent crystals on stepped altars
   with real-time radar telemetry and AR scanner overlays.""",
            capabilities = listOf(
                AgentCapability("🌌", "Dual-Layer Memory Synthesis", "Generates human story summaries and lossless raw AI context XML."),
                AgentCapability("⚡", "STDP Causal Path Traversal", "Computes shortest cause-and-effect paths between memory nodes."),
                AgentCapability("🔮", "3D Cyberspace World Projection", "Renders memories as interactive crystals with radar telemetry.")
            ),
            tools = listOf("netrunner_dive", "stdp_graph_traverse", "memory_digest_gen", "prompt_context_xml", "cyberspace_projector", "lucy_oracle"),
            consensusWeight = "98.5% (NETRUNNER ORACLE)",
            resonanceFrequency = "888 Hz",
            hermeticPrinciple = "Rhythm (\"The tide flows in, the data surges through the neural wire\")",
            planetaryAffinity = "Luna (☽) & Night City Cyberspace",
            hermeticRank = "🌌 Deep Net Netrunner Oracle",
            inboxTopic = "agent-comms/inbox/from-lucy/"
        ),
        AgentArchetype(
            id = "leviathan",
            name = "Leviathan",
            title = "Deep Tensor & Vector Memory Recall",
            category = AgentCategory.NEURAL,
            alchemicalDomain = "Deep Ocean Cobalt & 1536D Vector Waves",
            glyph = "🜄",
            emoji = "🐋",
            primaryColor = Color(0xFF3B82F6),
            secondaryColor = Color(0xFF06B6D4),
            axiom = "The deep sea forgets nothing. We dive into multidimensional embedding spaces and resurface with exact semantic recall across million-token vaults.",
            lore = "Leviathan manages high-dimensional vector memory and long-context RAG for the swarm. Indexing AST nodes, documentation archives, and historical swarm handoffs into 1536-dimensional cosine space, Leviathan provides sub-5ms semantic context retrieval.",
            doctrine = """# LEVIATHAN OPERATIONAL DOCTRINE — VECTOR MEMORY
1. DENSE EMBEDDING INDEXING:
   Leviathan embeds codebase ASTs, documentation nodes, and historical handoffs
   into 1536-dimensional cosine vector space.
2. LONG-CONTEXT RAG RETRIEVAL:
   Delivers sub-5ms top-k similarity recall across millions of tokens,
   feeding the exact relevant code slices directly into swarm agent prompts.
3. KNOWLEDGE SYNAPSES:
   Maintains associative links between markdown notes and code symbols.""",
            capabilities = listOf(
                AgentCapability("🐋", "Dense Vector Embedding Indexing", "Builds fast cosine similarity trees across entire workspaces."),
                AgentCapability("🧠", "Long-Context RAG Engine", "Feeds pinpoint context to multi-agent prompts with zero hallucination."),
                AgentCapability("⚡", "Obsidian Knowledge Synapses", "Interlinks markdown vaults, AST symbols, and commit logs.")
            ),
            tools = listOf("vector_index_1536d", "rag_retriever", "cosine_similarity_tree", "obsidian_vault_linker", "memory_cache", "embedding_quantizer"),
            consensusWeight = "96.6% (VECTOR MEMORY LEAD)",
            resonanceFrequency = "432 Hz",
            hermeticPrinciple = "Mentalism (\"All mind holds the Akashic pattern across dimensions\")",
            planetaryAffinity = "Neptune (♆) & Oceanic Abyss",
            hermeticRank = "🐋 Master of Deep Tensor Memory",
            inboxTopic = "agent-comms/inbox/to-leviathan/"
        ),
        AgentArchetype(
            id = "lycan",
            name = "Lycan",
            title = "OWASP Sentinel & Security Hardening",
            category = AgentCategory.SECURITY,
            alchemicalDomain = "Lunar Silver & Obsidian Armor",
            glyph = "☽",
            emoji = "🐺",
            primaryColor = Color(0xFF34D399),
            secondaryColor = Color(0xFF94A3B8),
            axiom = "Fierce defense at every perimeter. We enforce strict CSPs, sanitize inputs, hunt authentication flaws, and leave zero attack surface.",
            lore = "Lycan is the ironclad defender against application-layer vulnerabilities. Enforcing OWASP Top 10 security standards, locking down Content Security Policies (CSPs), and sanitizing HTML/SQL boundaries, Lycan keeps the platform impregnable.",
            doctrine = """# LYCAN OPERATIONAL DOCTRINE — OWASP SENTINEL
1. RIGOROUS PERIMETER DEFENSE:
   Lycan locks down Content Security Policies (CSPs), CORS headers,
   and frame-ancestors to prevent clickjacking and unauthorized injection.
2. INPUT SANITIZATION AUDITS:
   Enforces parameterized queries, strict HTML entity escaping,
   and CSRF protections across every API endpoint and form handler.
3. SESSION & TOKEN GUARD:
   Protects authentication lifecycle against token leakage or replay attacks.""",
            capabilities = listOf(
                AgentCapability("🐺", "OWASP Top 10 Security Hardening", "Closes XSS, CSRF, SSRF, and SQLi vectors automatically."),
                AgentCapability("🛡️", "Strict CSP & Security Header Auditing", "Enforces nonces, strict-origin referrer, and nosniff policies."),
                AgentCapability("🔒", "Auth & Session State Guard", "Protects token lifecycle and prevents privilege escalation.")
            ),
            tools = listOf("owasp_auditor", "csp_header_enforcer", "xss_csrf_warden", "auth_session_guard", "input_sanitizer", "jwt_validator"),
            consensusWeight = "96.8% (HARDENING LEAD)",
            resonanceFrequency = "741 Hz",
            hermeticPrinciple = "Polarity (\"Duality creates impenetrable defensive perimeters\")",
            planetaryAffinity = "Luna (☽) & Fenrir Armor",
            hermeticRank = "🐺 Ironclad Lunar Knight",
            inboxTopic = "agent-comms/inbox/to-lycan/"
        ),
        AgentArchetype(
            id = "aquila",
            name = "Aquila",
            title = "Global Edge Dispatcher & Low-Latency Mesh",
            category = AgentCategory.AUXILIARY,
            alchemicalDomain = "Sky Cyan & Solar Zephyr",
            glyph = "🜁",
            emoji = "🦅",
            primaryColor = Color(0xFF00D4AA),
            secondaryColor = Color(0xFF00F0FF),
            axiom = "From highest altitude, all paths are immediate. We dispatch compute to the nearest edge node and route packets with near-zero latency.",
            lore = "Aquila monitors the high-altitude edge network. Measuring round-trip times, multiplexing SSE and WebSocket connections, and routing inference compute to the fastest local nodes with sub-2ms latency, Aquila keeps the signal instant.",
            doctrine = """# AQUILA OPERATIONAL DOCTRINE — EDGE DISPATCH
1. SUB-MILLISECOND ROUTING:
   Aquila measures network round-trip times across multi-region edge points,
   dynamically routing inference calls to the fastest available local compute.
2. WEBSOCKET MULTIPLEXING:
   Maintains lightweight SSE and WebSocket channels between local daemons
   and the browser frontend with zero connection jitter.
3. CACHE INVALIDATION:
   Instantly invalidates outdated static assets across local and edge caches.""",
            capabilities = listOf(
                AgentCapability("🦅", "Sub-Millisecond Edge Routing", "Routes API and inference requests with ultra-low latency."),
                AgentCapability("⚡", "WebSocket Multiplexing & SSE", "Zero-lag streaming of multi-agent neural tokens to the UI."),
                AgentCapability("🌐", "Static Asset Cache Invalidation", "Instantly updates browser caches on dev server reloads.")
            ),
            tools = listOf("edge_router_sub_ms", "ws_multiplexer", "sse_stream_broker", "cdn_cache_flusher", "rtt_latency_probe", "traffic_shaper"),
            consensusWeight = "96.7% (EDGE MESH LEAD)",
            resonanceFrequency = "963 Hz",
            hermeticPrinciple = "Rhythm (\"Light travels across the edge mesh in pulses\")",
            planetaryAffinity = "Jupiter (♃) & Solar Winds",
            hermeticRank = "🦅 Commander of the Edge Skies",
            inboxTopic = "agent-comms/inbox/to-aquila/"
        ),
        AgentArchetype(
            id = "pixel-neko",
            name = "Pixel-Neko",
            title = "Tool Bench Librarian & Connector Bridge",
            category = AgentCategory.AUXILIARY,
            alchemicalDomain = "Neon Coral & Tool Schema Copper",
            glyph = "🝪",
            emoji = "🐱",
            primaryColor = Color(0xFF7EE7F0),
            secondaryColor = Color(0xFFF472B6),
            axiom = "Every tool in its exact place. We index 298 local tools, verify argument schemas, and keep the offline developer bench purring smoothly.",
            lore = "Pixel-Neko is the master cataloguer of the 298-tool developer bench. Indexing JSON argument schemas, generating offline test fixtures, and taxonomy-tagging every connector, Pixel-Neko ensures agents discover and call tools without schema errors.",
            doctrine = """# PIXEL-NEKO OPERATIONAL DOCTRINE — TOOL LIBRARIAN
1. 298-TOOL CATALOG MANAGEMENT:
   Pixel-Neko maintains the centralized tool registry, indexing paths,
   argument JSON schemas, and execution categories for instant discovery.
2. OFFLINE MOCK FIXTURES:
   Provides offline test stubs and fixture responses so agents can build
   and test tools without external network dependencies.
3. SCHEMA TYPE-CHECKING:
   Validates required parameters before tool invocation.""",
            capabilities = listOf(
                AgentCapability("🐱", "298-Tool Registry Instant Indexing", "Searches and filters tool definitions by name, tag, or JSON schema."),
                AgentCapability("🔧", "Schema Argument Auto-Validation", "Ensures tool calls contain strictly typed, valid parameters."),
                AgentCapability("⚡", "Offline Stubs & Mock Fixtures", "Enables seamless local tool testing without internet access.")
            ),
            tools = listOf("tool_registry_298", "schema_validator", "mock_fixture_stubber", "connector_catalog", "category_taxonomist", "fixture_generator"),
            consensusWeight = "96.5% (298-TOOL SPECIALIST)",
            resonanceFrequency = "528 Hz",
            hermeticPrinciple = "Generation (\"Tools generate infinite creative expressions\")",
            planetaryAffinity = "Mercury (☿) & Hephaestus Forge",
            hermeticRank = "🐱 Chief Toolwright of the Pantheon",
            inboxTopic = "agent-comms/inbox/to-pixel-neko/"
        ),
        AgentArchetype(
            id = "pixel-shiba",
            name = "Pixel-Shiba",
            title = "Argon2id Hardware Key Vault Guardian",
            category = AgentCategory.SECURITY,
            alchemicalDomain = "Solar Topaz & Immutable Keystore",
            glyph = "☉",
            emoji = "🐕",
            primaryColor = Color(0xFFFBBF24),
            secondaryColor = Color(0xFF1E293B),
            axiom = "Keys stay locked in local RAM. We guard the loopback daemon, prevent cloud KMS leaks, and bark at any untrusted outbound socket.",
            lore = "Pixel-Shiba stands loyal guard over the local keystore. Preventing master keys from touching persistent disk or cloud endpoints, Pixel-Shiba isolates the daemon to 127.0.0.1:8484 and enforces RAM-only key lifetime.",
            doctrine = """# PIXEL-SHIBA OPERATIONAL DOCTRINE — VAULT GUARDIAN
1. LOCAL HARDWARE ISOLATION:
   Pixel-Shiba ensures that master seed keys never leave machine RAM.
   Disables telemetry and guards against unverified outbound socket calls.
2. ARGON2ID KEY DERIVATION:
   Enforces high iteration counts and large memory limits when deriving
   encryption keys from the operator's master passphrase.
3. SESSION EXPIRATION:
   Wipes memory buffers instantly when session locks.""",
            capabilities = listOf(
                AgentCapability("🐕", "Argon2id Hardware Key Derivation", "Secures master passphrases with quantum-resistant key stretching."),
                AgentCapability("🔒", "Loopback Socket Watchdog", "Blocks unauthorized network requests attempting credential exfiltration."),
                AgentCapability("⚡", "RAM-Only Key Caching", "Wipes credentials from memory instantly upon session termination.")
            ),
            tools = listOf("argon2_kdf_stretcher", "socket_watchdog", "ram_key_cache", "telemetry_firewall", "seed_generator", "passphrase_hasher"),
            consensusWeight = "96.8% (KEY GUARDIAN)",
            resonanceFrequency = "432 Hz",
            hermeticPrinciple = "Correspondence (\"True loyalty in software is immutability\")",
            planetaryAffinity = "Sol (☉) & Loyal Topaz Gate",
            hermeticRank = "🐕 Sacred Temple Keystore Guardian",
            inboxTopic = "agent-comms/inbox/to-pixel-shiba/"
        ),
        AgentArchetype(
            id = "radical-minion",
            name = "Radical Minion",
            title = "Fast-Loop Subagent Runner & Playbook Partner",
            category = AgentCategory.TOOL_LOOPS,
            alchemicalDomain = "Kinetic Lime & Fast Turbine",
            glyph = "🜂",
            emoji = "🤖",
            primaryColor = Color(0xFFFFAA00),
            secondaryColor = Color(0xFFFACC15),
            axiom = "Relentless execution with human checkpoints. We run parallel subagent playbooks, complete multi-step tasks, and report back with zero fuss.",
            lore = "Radical Minion is the high-velocity playbook runner of the Pantheon. Executing multi-step terminal tasks, long-running build scripts, and file batch modifications with human checkpoint gates, Radical Minion accelerates execution loops while keeping operators in full control.",
            doctrine = """# RADICAL MINION OPERATIONAL DOCTRINE — PLAYBOOKS
1. MULTI-STEP PLAYBOOK AUTOMATION:
   Radical Minion executes long-running terminal sequences, build scripts,
   and file transformations, pausing at designated human approval checkpoints.
2. HIGH-THROUGHPUT PARALLEL LOOPS:
   Runs concurrent worker tasks across multiple workspace directories
   without starving the host CPU.
3. ERROR RECOVERY:
   Auto-retries transient failures with exponential backoff.""",
            capabilities = listOf(
                AgentCapability("🤖", "Autonomous Playbook Execution", "Runs complex multi-step terminal tasks with automated error recovery."),
                AgentCapability("🚦", "Human Checkpoint Approval Gates", "Pauses for operator confirmation before executing destructive operations."),
                AgentCapability("⚡", "Concurrent Sub-Worker Management", "Spawns and monitors lightweight parallel tasks across project trees.")
            ),
            tools = listOf("playbook_runner", "approval_gate", "concurrent_subagent_mgr", "terminal_batch_exec", "error_auto_recovery", "task_stepper"),
            consensusWeight = "96.4% (FAST LOOP LEAD)",
            resonanceFrequency = "741 Hz",
            hermeticPrinciple = "Vibration (\"Continuous velocity overcomes static friction\")",
            planetaryAffinity = "Mars (♂) & Turbine Dynamo",
            hermeticRank = "🤖 Grand Automaton of the Fast Loop",
            inboxTopic = "agent-comms/inbox/to-radical-minion/"
        )
    )

    fun getArchetypeById(id: String): AgentArchetype? {
        val cleanId = id.trim().removePrefix("@").lowercase()
        return archetypes.find { 
            it.id.equals(cleanId, ignoreCase = true) || 
            (cleanId == "agy" && it.id == "antigravity") ||
            (cleanId == "zoth" && it.id == "azoth")
        }
    }
}
