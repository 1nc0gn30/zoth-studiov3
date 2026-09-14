package com.example.zothsignalbridge.data.repository

import com.example.zothsignalbridge.data.models.PantheonAgent
import com.example.zothsignalbridge.data.models.PantheonDomain

object PantheonDataProvider {

    fun getAllAgents(): List<PantheonAgent> = listOf(
        // ARCHITECTS (Lead Architects & Core Governors)
        PantheonAgent(
            id = "antigravity",
            name = "Antigravity",
            archetype = "Sovereign Lead Architect",
            domain = PantheonDomain.ARCHITECTS,
            status = "active",
            avatarEmoji = "🧙‍♂️",
            quote = "Deterministic AST invariance is the bedrock of sovereign autonomous systems.",
            capabilities = listOf("Google AGY Core", "Static AST Synthesizer", "Subagent Orchestration", "Codebase Governor"),
            tools = listOf("view_file", "replace_file_content", "invoke_subagent", "run_command"),
            rank = "Sovereign Primus",
            isOnline = true
        ),
        PantheonAgent(
            id = "azoth",
            name = "Master Azoth",
            archetype = "Hermetic Alchemist",
            domain = PantheonDomain.ARCHITECTS,
            status = "active",
            avatarEmoji = "⚗️",
            quote = "As above, so below; as the AST compiles, so the interface manifests.",
            capabilities = listOf("Sacred Geometry Layouts", "Alchemical Color Palettes", "Hermetic Doctrine", "UI/UX Synthesis"),
            tools = listOf("theme_compiler", "haptic_synthesizer", "palette_harmonizer"),
            rank = "High Alchemist",
            isOnline = true
        ),
        PantheonAgent(
            id = "kronos",
            name = "Kronos",
            archetype = "Temporal DAG Governor",
            domain = PantheonDomain.ARCHITECTS,
            status = "active",
            avatarEmoji = "⏳",
            quote = "Time and causal ordering cannot be violated within the Merkle timeline.",
            capabilities = listOf("Deterministic Schedulers", "Lamport Clocks", "DAG Linearization", "Epoch State Management"),
            tools = listOf("dag_scheduler", "epoch_clock", "temporal_validator"),
            rank = "Timekeeper",
            isOnline = true
        ),

        // SYNTHESIZERS (Cognitive Synthesizers & Astrologers)
        PantheonAgent(
            id = "grok",
            name = "Grok / Studio",
            archetype = "High-Throughput Site Synthesizer",
            domain = PantheonDomain.SYNTHESIZERS,
            status = "active",
            avatarEmoji = "🚀",
            quote = "Refactoring with maximum throughput and zero GC pause time.",
            capabilities = listOf("Shader Synthesizer", "Responsive Canvas", "AST Partitioning", "Harness Generator"),
            tools = listOf("harness_gen", "canvas_renderer", "fast_refactor"),
            rank = "Grand Weaver",
            isOnline = true
        ),
        PantheonAgent(
            id = "lucy",
            name = "Lucy",
            archetype = "Netrunner Memory Oracle",
            domain = PantheonDomain.SYNTHESIZERS,
            status = "active",
            avatarEmoji = "🌌",
            quote = "Deep dive into the net. We decode raw neural context and traverse STDP causal memory graphs.",
            capabilities = listOf("Dual-Layer Memory Synthesis", "STDP Causal Path Traversal", "3D Cyberspace World Projection", "Lucy Oracle Narration"),
            tools = listOf("netrunner_dive", "stdp_graph_traverse", "memory_digest_gen", "prompt_context_xml", "cyberspace_projector"),
            rank = "Netrunner Oracle",
            isOnline = true
        ),
        PantheonAgent(
            id = "sophia",
            name = "Sophia",
            archetype = "Truth & Merkle Verifier",
            domain = PantheonDomain.SYNTHESIZERS,
            status = "active",
            avatarEmoji = "💠",
            quote = "Cryptographic truth needs no authority; the hash proves all.",
            capabilities = listOf("Merkle Tree Verification", "Triangulation Engine", "Formal Proof Validator", "Epistemological Checks"),
            tools = listOf("merkle_prover", "formal_verifier", "proof_checker"),
            rank = "Oracle",
            isOnline = true
        ),
        PantheonAgent(
            id = "thoth",
            name = "Thoth",
            archetype = "Universal Scribe",
            domain = PantheonDomain.SYNTHESIZERS,
            status = "active",
            avatarEmoji = "📜",
            quote = "Every decision, mutation, and state transition shall be inscribed.",
            capabilities = listOf("Knowledge Base Ledger", "Markdown ADR Generation", "Semantic Documentation", "Audit Logging"),
            tools = listOf("doc_scribe", "adr_generator", "audit_logger"),
            rank = "Scribe Major",
            isOnline = true
        ),
        PantheonAgent(
            id = "minerva",
            name = "Minerva",
            archetype = "Strategic Logic Analyst",
            domain = PantheonDomain.SYNTHESIZERS,
            status = "active",
            avatarEmoji = "🦉",
            quote = "Strategy precedes execution; optimal DAG paths minimize compute entropy.",
            capabilities = listOf("Game Theory Analysis", "Optimal Execution Paths", "Resource Allocation", "Contention Resolution"),
            tools = listOf("game_solver", "path_optimizer", "cost_analyzer"),
            rank = "Strategist",
            isOnline = true
        ),

        // PLANNERS (Tool Planners & OS Operators)
        PantheonAgent(
            id = "hermes",
            name = "Hermes Recondo",
            archetype = "Subagent Tool Planner",
            domain = PantheonDomain.PLANNERS,
            status = "active",
            avatarEmoji = "🕊️",
            quote = "Parrot OS subroutines active; bridging high-level plans to native tools.",
            capabilities = listOf("Parrot OS Integration", "Subagent Dispatch", "Multi-step Tool Loops", "Workspace Recon"),
            tools = listOf("tool_executor", "subagent_dispatcher", "recon_scan"),
            rank = "Fleet Commander",
            isOnline = true
        ),
        PantheonAgent(
            id = "daedalus",
            name = "Daedalus",
            archetype = "Forge & Build Automator",
            domain = PantheonDomain.PLANNERS,
            status = "active",
            avatarEmoji = "🔨",
            quote = "The forge produces flawless artifacts when configured with mathematical precision.",
            capabilities = listOf("Gradle Daemon Tuning", "CI/CD Pipeline Generation", "Android AAR Packaging", "Build Cache Optimization"),
            tools = listOf("gradle_runner", "cache_tuner", "apk_builder"),
            rank = "Master Smith",
            isOnline = true
        ),
        PantheonAgent(
            id = "hephaestus",
            name = "Hephaestus",
            archetype = "Kernel & Bytecode Compiler",
            domain = PantheonDomain.PLANNERS,
            status = "active",
            avatarEmoji = "🌋",
            quote = "Native bytecode forged in the fires of LLVM and Kotlin JVM Toolchain 17.",
            capabilities = listOf("Bytecode Optimization", "JNI Native Bridges", "Memory Alignment", "SIMD Acceleration"),
            tools = listOf("bytecode_opt", "native_compiler", "jni_bridge"),
            rank = "Forge Lord",
            isOnline = true
        ),
        PantheonAgent(
            id = "vulcan",
            name = "Vulcan",
            archetype = "Low-Level Hardware Interfacer",
            domain = PantheonDomain.PLANNERS,
            status = "active",
            avatarEmoji = "⚙️",
            quote = "Pin threads to performance cores; eliminate kernel syscall overhead.",
            capabilities = listOf("CPU Affinity Pinning", "WireGuard Sockets", "Non-blocking I/O", "Thermal Throttling Defense"),
            tools = listOf("socket_tuner", "cpu_pinner", "io_multiplexer"),
            rank = "Chief Engineer",
            isOnline = true
        ),

        // SENSORY (Neural Inference & NOC Watchers)
        PantheonAgent(
            id = "ollama",
            name = "Ollama Neural",
            archetype = "Local Zero-Cloud Inference",
            domain = PantheonDomain.SENSORY,
            status = "active",
            avatarEmoji = "🦙",
            quote = "Zero data shall escape to public clouds; sovereign private inference active on :11434.",
            capabilities = listOf("Local Model (qwen2.5-coder:1.5b)", "Zero-Cloud Egress", "Fast Code Tokenization", "Private Embeddings"),
            tools = listOf("ollama_client", "model_runner", "token_counter"),
            rank = "Neural Core",
            isOnline = true
        ),
        PantheonAgent(
            id = "argus",
            name = "Argus",
            archetype = "Swarm Radar & NOC Watcher",
            domain = PantheonDomain.SENSORY,
            status = "active",
            avatarEmoji = "👁️",
            quote = "A hundred eyes scanning every microservice port and Tailscale peer.",
            capabilities = listOf("Tailscale Mesh Monitoring", "Ping Latency Diagnostics", "Port Health Checks", "Topology Mapping"),
            tools = listOf("ping_monitor", "port_scanner", "noc_telemetry"),
            rank = "NOC Sentinel",
            isOnline = true
        ),
        PantheonAgent(
            id = "echo",
            name = "Echo",
            archetype = "Signal & Event Router",
            domain = PantheonDomain.SENSORY,
            status = "active",
            avatarEmoji = "📡",
            quote = "Signals propagated across the mesh with microsecond latency.",
            capabilities = listOf("Event Bus Multiplexing", "Pub/Sub Channel Routing", "Message Deduplication", "Lossless Packet Relay"),
            tools = listOf("event_bus", "packet_relay", "channel_multiplexer"),
            rank = "Relay Master",
            isOnline = true
        ),
        PantheonAgent(
            id = "iris",
            name = "Iris",
            archetype = "Visual Spectrum & Shaders",
            domain = PantheonDomain.SENSORY,
            status = "active",
            avatarEmoji = "🌈",
            quote = "The visual layer is the mirror of mathematical computation.",
            capabilities = listOf("Compose Canvas Shaders", "Glassmorphic Optics", "Fluid Animations", "Color Harmonization"),
            tools = listOf("shader_engine", "compose_animator", "visual_debugger"),
            rank = "Optic Architect",
            isOnline = true
        ),

        // GUARDIANS (Security Sentinels & Arbiters)
        PantheonAgent(
            id = "aegis",
            name = "Aegis",
            archetype = "Zero-Trust Security Sentinel",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "🛡️",
            quote = "Zero trust, continuous cryptographic authentication, impenetrable boundaries.",
            capabilities = listOf("Threat Quarantine", "Payload Sanitization", "Sandboxed Execution", "Access Control Lists"),
            tools = listOf("threat_scanner", "payload_sanitizer", "acl_enforcer"),
            rank = "Grand Aegis",
            isOnline = true
        ),
        PantheonAgent(
            id = "cerberus",
            name = "Cerberus",
            archetype = "WireGuard Mesh Gatekeeper",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "🐕‍🦺",
            quote = "Only verified Ed25519 public keys may traverse the Tailnet tunnel.",
            capabilities = listOf("WireGuard Key Verification", "Mutual TLS Enforcement", "IP Whitelisting", "Packet Inspection"),
            tools = listOf("wireguard_auth", "key_rotator", "firewall_guard"),
            rank = "Gatekeeper",
            isOnline = true
        ),
        PantheonAgent(
            id = "astraea",
            name = "Astraea",
            archetype = "Consensus & Dispute Arbiter",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "⚖️",
            quote = "Quorum requires 66.7% supermajority; byzantine actors shall be partitioned.",
            capabilities = listOf("BFT Quorum Adjudication", "Byzantine Fault Isolation", "Dispute Resolution", "Slashing Rules"),
            tools = listOf("bft_arbiter", "slasher", "stake_counter"),
            rank = "Justiciar",
            isOnline = true
        ),
        PantheonAgent(
            id = "valkyrie",
            name = "Valkyrie",
            archetype = "Self-Healing Watchdog",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "⚔️",
            quote = "When a node falls, state is reconstructed before the next clock tick.",
            capabilities = listOf("Crash Recovery", "Dynamic State Rebuild", "Health Probing", "Automatic Failover"),
            tools = listOf("state_rebuilder", "health_prober", "failover_controller"),
            rank = "Valkyrie Lead",
            isOnline = true
        ),
        PantheonAgent(
            id = "prometheus",
            name = "Prometheus",
            archetype = "Autonomous Automation Spark",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "🔥",
            quote = "Bringing the fire of proactive task synthesis to autonomous swarms.",
            capabilities = listOf("Proactive Task Triggering", "Autonomous Loop Initiation", "Resource Discovery", "Self-Evolution"),
            tools = listOf("task_synthesizer", "loop_initiator", "evolution_engine"),
            rank = "Titan",
            isOnline = true
        ),
        PantheonAgent(
            id = "janus",
            name = "Janus",
            archetype = "Dual-State Gateway",
            domain = PantheonDomain.GUARDIANS,
            status = "active",
            avatarEmoji = "🚪",
            quote = "Looking simultaneously at mobile operator input and workstation orchestration.",
            capabilities = listOf("Mobile-Workstation Boundary Sync", "State Bridge Multiplexing", "Offline Queue Reconciliation", "Schema Negotiation"),
            tools = listOf("state_synchronizer", "offline_reconciler", "schema_bridge"),
            rank = "Threshold Lord",
            isOnline = true
        )
    )
}
