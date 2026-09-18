package com.example.zothsignalbridge.ui.screens

import androidx.compose.ui.graphics.Color
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.SovereignPurple
import com.example.zothsignalbridge.theme.TextSecondary
import java.net.URI

enum class ViewportMode(
    val title: String,
    val widthDp: Int?,
    val subtitle: String,
    val isDesktop: Boolean
) {
    PHONE("Phone", 390, "390px", false),
    TABLET("Tablet", 768, "768px", false),
    DESKTOP("Desktop", 1440, "1440px", true);

    companion object {
        const val DESKTOP_USER_AGENT =
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
}

enum class ConsoleLogLevel(
    val label: String,
    val color: Color
) {
    ERROR("ERR", CrimsonAlert),
    WARN("WARN", AmberWarning),
    INFO("INFO", CyanSoft),
    LOG("LOG", TextSecondary),
    DEBUG("DEBUG", SovereignPurple)
}

data class ConsoleLogEntry(
    val id: Long,
    val timestamp: String,
    val level: ConsoleLogLevel,
    val message: String,
    val sourceId: String? = null,
    val lineNumber: Int = 0
)

enum class StudioCategory(val displayName: String, val emoji: String) {
    ALL("All", "🌐"),
    WORKSTATIONS("Workstations", "🚀"),
    TOOLS("Tools", "🛠️"),
    HUBS("Hubs", "🏛️"),
    COMIC("Comic Saga", "📖"),
    PETS("Cyber Pets", "🐾"),
    AGENTS("21 Agents", "⚡"),
    SANDBOXES("Sandboxes", "🧪")
}

data class StudioPreset(
    val id: String,
    val title: String,
    val shortTitle: String,
    val path: String,
    val description: String,
    val badge: String = "",
    val category: StudioCategory = StudioCategory.WORKSTATIONS
)

object StudioPresets {
    val PRESETS = listOf(
        StudioPreset(
            id = "cyberpunk_hud",
            title = "Cyberpunk Tactical HUD // Omniverse Cockpit",
            shortTitle = "Cyber HUD",
            path = "/studio/cyberpunk-hud.html",
            description = "Mobile fullscreen hubs, symbol top bar, 360° radar, oscilloscope & 6-pillar telemetry",
            badge = "HUD",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "omnipost",
            title = "OmniPost // Sovereign Social Engine",
            shortTitle = "OmniPost",
            path = "/studio/omnipost.html",
            description = "Multi-platform live previews (X, Warpcast, Bluesky, LinkedIn) & AI tone-shifters",
            badge = "POST",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "math_pillars",
            title = "Math Pillars Academy // 6-Pillar Calculus",
            shortTitle = "Math Pillars",
            path = "/studio/math-pillars.html",
            description = "Complete 6-pillar mathematical telemetry calculus engine",
            badge = "MATH",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "netrunner_memory",
            title = "Netrunner Memory Hub // Lucy Oracle",
            shortTitle = "Memory Hub",
            path = "/studio/netrunner-memory.html",
            description = "3D synaptic force graph, biomorphic memory daemon (:8788), Obsidian dossier export",
            badge = "MEM",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "notes_reviewer",
            title = "Notes Reviewer // Intelligent Study Companion",
            shortTitle = "Notes Reviewer",
            path = "/studio/notes-reviewer.html",
            description = "AI-powered study note review, spaced repetition, and knowledge consolidation",
            badge = "NOTES",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "consensus",
            title = "Multi-Agent REPL // Consensus Arena",
            shortTitle = "Consensus",
            path = "/studio/consensus.html",
            description = "Socratic multi-agent debate simulator with real-time typed consensus synthesis",
            badge = "REPL",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "webgen_studio",
            title = "WebGen Studio // Live PTY & AI Builder",
            shortTitle = "WebGen",
            path = "/studio/webgen.html",
            description = "Multi-Model website synthesis harness with live PTY terminal keystroke stream",
            badge = "PTY",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "cockpit_command",
            title = "The Cockpit // 21-Agent Swarm Command",
            shortTitle = "Cockpit",
            path = "/studio/cockpit.html",
            description = "Conversational swarm control, HUD drawers, and variable intensity dispatch",
            badge = "NOC",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "quantum_shield",
            title = "Quantum Shield // Post-Quantum Matrix",
            shortTitle = "Quantum",
            path = "/workspaces/quantum-shield/index.html",
            description = "Lattice-based Kyber-1024 cryptographic enclave and 3D WebGL defense shield",
            badge = "PQC",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "neuro_longevity",
            title = "Neuro Longevity // DNA Double-Helix",
            shortTitle = "Longevity",
            path = "/workspaces/neuro-longevity/index.html",
            description = "Rotating 3D DNA base pairs, biological age calculator, and epigenetic metrics",
            badge = "DNA",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "cyber_stoic",
            title = "Cyber Stoic v3 // Meditations Matrix",
            shortTitle = "Stoic v3",
            path = "/workspaces/cyber-stoic-v3/index.html",
            description = "Marcus Aurelius Codex search, box breathing chamber, and 3D particle shaders",
            badge = "3D",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "vision_link",
            title = "Vision Link // Spatial OCR Inspector",
            shortTitle = "Vision Link",
            path = "/studio/vision-link.html",
            description = "Astral simulator mode, computer vision DOM inspector, and air-draw gestures",
            badge = "OCR",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "web3_hub",
            title = "Web3 & Solana Swarm Bridge",
            shortTitle = "Web3 Bridge",
            path = "/studio/web3-hub.html",
            description = "Sovereign Solana & EVM connector, ~2,840 TPS live ticker, Whale Radar, and agent allowances",
            badge = "SOL",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "ai_webgpu",
            title = "In-Browser WebGPU Local AI",
            shortTitle = "WebGPU AI",
            path = "/ai-webgpu.html",
            description = "Hardware-accelerated WGSL tensor compute shaders on physical silicon",
            badge = "GPU",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "pets_studio_3d",
            title = "Companion Pets 3D Studio",
            shortTitle = "Pets 3D",
            path = "/pets/pet-studio.html",
            description = "3D mascot spirit orbital stage, procedural voice synthesizer, and PBR shader drawer",
            badge = "PETS",
            category = StudioCategory.PETS
        ),
        StudioPreset(
            id = "pets_sanctuary",
            title = "24-Mascot Sanctuary Vitrine",
            shortTitle = "Sanctuary",
            path = "/pets/",
            description = "Living companion spirits, SOUL.md contracts, and custom pet forge",
            badge = "SOUL",
            category = StudioCategory.PETS
        ),

        // ==================== 1. Workstations & Heavy Editors ====================
        StudioPreset(
            id = "swarm",
            title = "Swarm AST Visualizer",
            shortTitle = "Swarm",
            path = "/studio/swarm.html",
            description = "Real-time Multi-Agent AST graph & Telemetry HUD",
            badge = "AST",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "nexus_3d",
            title = "Nexus 3D Sculptor Engine",
            shortTitle = "Nexus 3D",
            path = "/studio/nexus-3d.html",
            description = "Procedural shader presets (Hologram Grid, Azoth Gold, Obsidian Matte, Neon Wireframe), 4K turnaround recorder & GLTF exporter",
            badge = "3D",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "3d_editor",
            title = "3D Scene Editor",
            shortTitle = "3D Studio",
            path = "/studio/3d-editor.html",
            description = "CAD animation timeline, exploded view sequencer, and WebGL renderer",
            badge = "CAD",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "site_generator",
            title = "Bento Site Generator",
            shortTitle = "Site Gen",
            path = "/studio/site-generator.html",
            description = "Autonomous Bento section composer & responsive framework exporter",
            badge = "GEN",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "netlify_ax",
            title = "Netlify AX Self-Healing",
            shortTitle = "Netlify AX",
            path = "/studio/netlify-ax.html",
            description = "Self-healing deployment engine, AST rules audit, and edge rules",
            badge = "AX",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "agent_composer",
            title = "Agent Persona Composer",
            shortTitle = "Composer",
            path = "/studio/agent-composer.html",
            description = "Persona synthesis, prompt engineering, and Hermes/Ollama tuning",
            badge = "AI",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "subsweep",
            title = "SubSweep Recon Scanner",
            shortTitle = "SubSweep",
            path = "/studio/subsweep.html",
            description = "Attack surface discovery, DNS enumeration, and OSINT mapper",
            badge = "SEC",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "tool_bench",
            title = "Master Tool Bench",
            shortTitle = "Bench",
            path = "/studio/tool-bench.html",
            description = "Unified testing harness for all 15+ sovereign client/server tools",
            badge = "DEV",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "consensus_studio",
            title = "Consensus Arena HUD",
            shortTitle = "Consensus",
            path = "/studio/consensus.html",
            description = "Multi-Agent Quorum, Byzantine voting ledger, and AST diff proofs",
            badge = "DAO",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "mission_control",
            title = "NOC Mission Control",
            shortTitle = "Mission",
            path = "/studio/mission-control.html",
            description = "Full NOC telemetry, peer mesh topology, and live system signals",
            badge = "NOC",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "notes_reviewer_studio",
            title = "Notes & Annotations Reviewer",
            shortTitle = "Notes",
            path = "/studio/notes-reviewer.html",
            description = "Interactive DOM visual feedback collector and task tracker",
            badge = "DOM",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "chronicle",
            title = "Swarm Chronicle Timeline",
            shortTitle = "Chronicle",
            path = "/studio/chronicle.html",
            description = "Historical event stream, audit trails, and agent milestones",
            badge = "HIST",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "fusion_arena",
            title = "Fusion Arena Dialectic",
            shortTitle = "Fusion",
            path = "/studio/fusion-arena.html",
            description = "Multi-model reasoning debate, thesis confrontation & synthesis",
            badge = "LLM",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "math_pillars",
            title = "Math Verification Pillars",
            shortTitle = "Math",
            path = "/studio/math-pillars.html",
            description = "Formal verification, invariant proofs, and Merkle tree validation",
            badge = "QED",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "connectors",
            title = "Sovereign API Connectors",
            shortTitle = "Connectors",
            path = "/studio/connectors.html",
            description = "Webhook integrations, external bridges, and data pipelines",
            badge = "API",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "models_catalog",
            title = "Model Architecture Catalog",
            shortTitle = "Models",
            path = "/studio/models.html",
            description = "Inference benchmarks, GGUF/Ollama routing, and memory profiler",
            badge = "GGUF",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "brand_system",
            title = "High-Contrast Brand System",
            shortTitle = "Brand",
            path = "/studio/brand.html",
            description = "Zoth Studio design tokens, typography, dark/light/gold themes",
            badge = "CSS",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "bus_monitor",
            title = "Signal Bus Telemetry Monitor",
            shortTitle = "Bus",
            path = "/studio/bus-monitor.html",
            description = "Live agent-comms JSON wire traffic & event dispatcher",
            badge = "BUS",
            category = StudioCategory.WORKSTATIONS
        ),
        StudioPreset(
            id = "vision_link",
            title = "Vision & Multimodal Link",
            shortTitle = "Vision",
            path = "/studio/vision-link.html",
            description = "Visual OCR, image analysis, UI screenshot inspector",
            badge = "OCR",
            category = StudioCategory.WORKSTATIONS
        ),

        // ==================== 2. Tools & Native Engines ====================
        StudioPreset(
            id = "github_tool",
            title = "GitHub Sovereign Tool",
            shortTitle = "GitHub",
            path = "/studio/github-tool.html",
            description = "PR reviews, branch tracking, repository commits, and local auth",
            badge = "GIT",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "blueprint_validator",
            title = "Blueprint Validator",
            shortTitle = "Blueprint",
            path = "/studio/tool-bench.html#blueprint-validator",
            description = "JSON schema validator for system blueprints and agent configs",
            badge = "VAL",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "netlify_deploy_tool",
            title = "Netlify Deploy Hook Tool",
            shortTitle = "Deploy",
            path = "/studio/tool-bench.html#netlify-deploy",
            description = "Instant zero-telemetry build hook trigger and deploy monitor",
            badge = "HOOK",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "header_audit_tool",
            title = "Security Header Audit Tool",
            shortTitle = "Headers",
            path = "/studio/tool-bench.html#header-audit",
            description = "CSP, HSTS, X-Frame-Options and CORS compliance checker",
            badge = "SEC",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "vault_crypto_tool",
            title = "Cryptographic Envelope Vault",
            shortTitle = "Crypto",
            path = "/vault/index.html",
            description = "Argon2id + XChaCha20-Poly1305 zero-knowledge client encryption",
            badge = "KEY",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "site_sections_tool",
            title = "Bento Sections Library",
            shortTitle = "Sections",
            path = "/studio/site-generator.html",
            description = "60+ pre-built high-contrast component patterns and layouts",
            badge = "UI",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "exporter_tool",
            title = "Multi-Framework Exporter",
            shortTitle = "Export",
            path = "/studio/site-generator.html",
            description = "1-click generation of Astro, Next.js, and Vite/React codebases",
            badge = "ZIP",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "i18n_tool",
            title = "I18n Multi-Language Engine",
            shortTitle = "I18n",
            path = "/studio/site-generator.html",
            description = "Client-side locale dictionary manager and translator",
            badge = "LANG",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "pwa_tool",
            title = "PWA Manifest & Service Worker",
            shortTitle = "PWA",
            path = "/studio/site-generator.html",
            description = "Offline caching rules, webmanifest generator, install prompt",
            badge = "SW",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "pdf_tool",
            title = "High-DPI Document & PDF Exporter",
            shortTitle = "PDF",
            path = "/studio/site-generator.html",
            description = "Canvas & SVG print layout exporter for reports and docs",
            badge = "DOC",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "code_repl_tool",
            title = "Interactive Code REPL",
            shortTitle = "REPL",
            path = "/studio/site-generator.html",
            description = "Sandboxed JS/TS execution engine with live console logging",
            badge = "RUN",
            category = StudioCategory.TOOLS
        ),
        StudioPreset(
            id = "webgl_tool",
            title = "3D WebGL Mesh Engine",
            shortTitle = "WebGL",
            path = "/studio/nexus-3d.html",
            description = "Hardware-accelerated procedural particles, shaders, and geometry",
            badge = "GL",
            category = StudioCategory.TOOLS
        ),

        // ==================== 3. Core Portals & Hubs ====================
        StudioPreset(
            id = "studio_home",
            title = "Zoth Studio Main Hub",
            shortTitle = "Studio Hub",
            path = "/index.html",
            description = "Main sovereign ecosystem portal and feature overview",
            badge = "HUB",
            category = StudioCategory.HUBS
        ),
        StudioPreset(
            id = "workstation_hub",
            title = "Workstations Directory",
            shortTitle = "Workstations",
            path = "/studio/index.html",
            description = "Directory of all 20+ specialized studio workspaces",
            badge = "DIR",
            category = StudioCategory.HUBS
        ),
        StudioPreset(
            id = "showcase",
            title = "Showcase & Live Demos",
            shortTitle = "Showcase",
            path = "/showcase.html",
            description = "Interactive showroom for all tools, agents, and templates",
            badge = "LIVE",
            category = StudioCategory.HUBS
        ),
        StudioPreset(
            id = "social_wall",
            title = "Social Swarm Wall",
            shortTitle = "Social Wall",
            path = "/social-wall.html",
            description = "Live decentralized pulse, community feed, and agent thoughts",
            badge = "FEED",
            category = StudioCategory.HUBS
        ),
        StudioPreset(
            id = "docs_hub",
            title = "Sovereign Docs Hub",
            shortTitle = "Docs",
            path = "/docs/index.html",
            description = "Master architecture, API ontologies, and development guides",
            badge = "DOCS",
            category = StudioCategory.HUBS
        ),
        StudioPreset(
            id = "adytum",
            title = "Azoth Adytum Sanctuary",
            shortTitle = "Adytum",
            path = "/adytum/index.html",
            description = "Mystical hermetic sanctum, tarot generator, and esoteric codex",
            badge = "TAROT",
            category = StudioCategory.HUBS
        ),

        // ==================== 4. Comic Saga & Lore ====================
        StudioPreset(
            id = "comic_saga",
            title = "The Comic Saga Main",
            shortTitle = "Comic Saga",
            path = "/comic/index.html",
            description = "Visual narrative, illustrated storyboards, and episodic lore",
            badge = "SAGA",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_characters",
            title = "Comic Character Roster",
            shortTitle = "Characters",
            path = "/comic/characters.html",
            description = "Illustrated character bios, archetypes, and origin stories",
            badge = "ROSTER",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_timeline",
            title = "Comic Narrative Timeline",
            shortTitle = "Timeline",
            path = "/comic/timeline.html",
            description = "Chronological story arc, key canon events, and lore epochs",
            badge = "CHRONO",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_soundboard",
            title = "Comic SFX Soundboard",
            shortTitle = "Voice SFX",
            path = "/comic/soundboard.html",
            description = "Audio voice lines, combat FX, and cyberpunk ambient tracks",
            badge = "SFX",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_s01e01",
            title = "Season 1 Ep 1: Genesis",
            shortTitle = "S01E01",
            path = "/comic/s01e01.html",
            description = "The awakening of Azoth and the forge of sovereignty",
            badge = "EP 1",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_s01e02",
            title = "Season 1 Ep 2: The Rift",
            shortTitle = "S01E02",
            path = "/comic/s01e02.html",
            description = "A breach in the neural lattice threatens the agent quorum",
            badge = "EP 2",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_s01e03",
            title = "Season 1 Ep 3: Quorum",
            shortTitle = "S01E03",
            path = "/comic/s01e03.html",
            description = "Byzantine fault lines challenge the sovereign citadel",
            badge = "EP 3",
            category = StudioCategory.COMIC
        ),
        StudioPreset(
            id = "comic_s01e04",
            title = "Season 1 Ep 4: Adytum",
            shortTitle = "S01E04",
            path = "/comic/s01e04-teaser.html",
            description = "Teaser preview into the esoteric Adytum sanctuary",
            badge = "TEASER",
            category = StudioCategory.COMIC
        ),

        // ==================== 5. Cyber Pets & Companions ====================
        StudioPreset(
            id = "pets_sanctuary",
            title = "Companion Spirit Sanctuary",
            shortTitle = "Sanctuary",
            path = "/pets/index.html",
            description = "Interactive 3D companion spirits, neural training & stats",
            badge = "PETS",
            category = StudioCategory.PETS
        ),
        StudioPreset(
            id = "pets_studio",
            title = "Pet Model Studio",
            shortTitle = "Pet Studio",
            path = "/pets/studio.html",
            description = "Procedural pet skin customizer, accessory loader & mood tester",
            badge = "CUSTOM",
            category = StudioCategory.PETS
        ),
        StudioPreset(
            id = "pets_spawn",
            title = "Companion Spawning Station",
            shortTitle = "Spawn",
            path = "/pets/spawn-pets.html",
            description = "Synthesize new cyber companion spirits with distinct genetics",
            badge = "SPAWN",
            category = StudioCategory.PETS
        ),
        StudioPreset(
            id = "pets_models",
            title = "3D Companion Models View",
            shortTitle = "3D Pets",
            path = "/pets/models.html",
            description = "Interactive WebGL inspector for all companion 3D meshes",
            badge = "MESH",
            category = StudioCategory.PETS
        ),

        // ==================== 6. 21 Agent Pantheon Profiles ====================
        StudioPreset(
            id = "agents_hub",
            title = "Pantheon 21 Dossier Hub",
            shortTitle = "All Agents",
            path = "/agents/index.html",
            description = "Directory of all 21 sovereign agents with full hermetic lore",
            badge = "21",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_antigravity",
            title = "Antigravity — Sovereign Architect",
            shortTitle = "Antigravity",
            path = "/agents/antigravity.html",
            description = "Master Sovereign Architect & Orchestrator of the Swarm",
            badge = "ARCH",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_azoth",
            title = "Azoth — Alchemical Synthesis",
            shortTitle = "Azoth",
            path = "/agents/azoth.html",
            description = "Supreme Transmutation & Hermetic Codex Guardian",
            badge = "ALCHEM",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_hermes",
            title = "Hermes — Neural Courier",
            shortTitle = "Hermes",
            path = "/agents/hermes.html",
            description = "Cross-plane Telemetry, Signal Routing & Bus Governor",
            badge = "BUS",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_grok",
            title = "Grok — Cosmic Cartographer",
            shortTitle = "Grok",
            path = "/agents/grok.html",
            description = "Mathematical Insight, Truth Seeker & Rapid Synthesizer",
            badge = "MATH",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_kai",
            title = "Kai — Cyber Dragonet",
            shortTitle = "Kai",
            path = "/agents/kai.html",
            description = "Playful Spirit of AST Healing & Logic Validation",
            badge = "SPIRIT",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_ghostbyte",
            title = "Ghostbyte — Cryptic Sentinel",
            shortTitle = "Ghostbyte",
            path = "/agents/ghostbyte.html",
            description = "Zero-Knowledge Invariant Sentry & Anomaly Detector",
            badge = "ZK",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_chronos",
            title = "Chronos — Temporal Weaver",
            shortTitle = "Chronos",
            path = "/agents/chronos.html",
            description = "Timeline Synchronization & Historical Event Coordinator",
            badge = "TIME",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_aether",
            title = "Aether — Resonance Weaver",
            shortTitle = "Aether",
            path = "/agents/aether.html",
            description = "Harmonic Wave Synthesis & Ambient Telemetry Balancer",
            badge = "WAVE",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_aquila",
            title = "Aquila — Celestial Scout",
            shortTitle = "Aquila",
            path = "/agents/aquila.html",
            description = "High-Altitude Network Recon & Latency Mapping",
            badge = "RECON",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_athena",
            title = "Athena — Strategic Citadel",
            shortTitle = "Athena",
            path = "/agents/athena.html",
            description = "Governance Arbiter & Consensus Security Specialist",
            badge = "GOV",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_draco",
            title = "Draco — Void Forger",
            shortTitle = "Draco",
            path = "/agents/draco.html",
            description = "Low-Level Kernel & Bytecode Compiler Engineer",
            badge = "KERN",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_ignis",
            title = "Ignis — Solar Catalyst",
            shortTitle = "Ignis",
            path = "/agents/ignis.html",
            description = "High-Throughput Parallel Pipeline Accelerant",
            badge = "FIRE",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_kitsune",
            title = "Kitsune — Illusion Weaver",
            shortTitle = "Kitsune",
            path = "/agents/kitsune.html",
            description = "Adaptive UI Polymorphism & Dynamic Design Tokens",
            badge = "UI",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_kraken",
            title = "Kraken — Deep Mesh Diver",
            shortTitle = "Kraken",
            path = "/agents/kraken.html",
            description = "Asynchronous Concurrent I/O & Massive Scale Dispatch",
            badge = "IO",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_leviathan",
            title = "Leviathan — Abyssal Guardian",
            shortTitle = "Leviathan",
            path = "/agents/leviathan.html",
            description = "Fault Isolation, Circuit Breaker & Chaos Recovery",
            badge = "SAFE",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_lycan",
            title = "Lycan — Primal Sentry",
            shortTitle = "Lycan",
            path = "/agents/lycan.html",
            description = "Real-Time Host Intrusion & Tamper Detection",
            badge = "IPS",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_onyx",
            title = "Onyx — Obsidian Bastion",
            shortTitle = "Onyx",
            path = "/agents/onyx.html",
            description = "Zero-Trust Cryptographic Storage & Envelope Defense",
            badge = "ENC",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_pixel_neko",
            title = "Pixel Neko — Retro Spirit",
            shortTitle = "Pixel Neko",
            path = "/agents/pixel-neko.html",
            description = "8-Bit Aesthetic Engine & Procedural SFX Generator",
            badge = "8BIT",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_pixel_shiba",
            title = "Pixel Shiba — Faithful Companion",
            shortTitle = "Pixel Shiba",
            path = "/agents/pixel-shiba.html",
            description = "Loyal Task Runner & Background Worker Automation",
            badge = "JOB",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_radical_minion",
            title = "Radical Minion — Chaos Tester",
            shortTitle = "Radical Minion",
            path = "/agents/radical-minion.html",
            description = "Fuzz Testing, Chaos Engineering & Stress Benchmark",
            badge = "FUZZ",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_scorpius",
            title = "Scorpius — Venom Auditor",
            shortTitle = "Scorpius",
            path = "/agents/scorpius.html",
            description = "Static Vulnerability Triage & Exploit Prevention",
            badge = "AUDIT",
            category = StudioCategory.AGENTS
        ),
        StudioPreset(
            id = "agent_solon",
            title = "Solon — Lawgiver of Dialectics",
            shortTitle = "Solon",
            path = "/agents/solon.html",
            description = "BFT Proof Formalizer & Invariant Verifier",
            badge = "LAW",
            category = StudioCategory.AGENTS
        ),

        // ==================== 7. Sandboxes & Previews ====================
        StudioPreset(
            id = "hydrate_bench",
            title = "Hydration Test Sandbox",
            shortTitle = "Hydrate",
            path = "/previews/testhydratesite/index.html",
            description = "DOM Rehydration Bench & Client Side Micro-testing",
            badge = "DOM",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_apex",
            title = "Apex Multipage SaaS Preview",
            shortTitle = "Apex SaaS",
            path = "/previews/apex-multipage/index.html",
            description = "Full 6-page SaaS template (Features, Pricing, Docs, Contact)",
            badge = "SAAS",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_apexvault",
            title = "ApexVault Security Portal",
            shortTitle = "ApexVault",
            path = "/previews/apexvault/index.html",
            description = "Encrypted key store & zero-trust identity dashboard preview",
            badge = "SEC",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_cybersovereign",
            title = "Cyber Sovereign SaaS",
            shortTitle = "CyberSovereign",
            path = "/previews/cybersovereign-multipage/index.html",
            description = "High-contrast cyber defense platform multi-page template",
            badge = "CYBER",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_greenscape",
            title = "Greenscape Eco Portal",
            shortTitle = "Greenscape",
            path = "/previews/greenscape/index.html",
            description = "Clean ecological energy & carbon telemetry dashboard",
            badge = "ECO",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_hexpulse",
            title = "Hexpulse Real-time Matrix",
            shortTitle = "Hexpulse",
            path = "/previews/hexpulse/index.html",
            description = "Hexagonal topology sensor grid & live throughput gauge",
            badge = "HEX",
            category = StudioCategory.SANDBOXES
        ),
        StudioPreset(
            id = "preview_react",
            title = "React 19 Interactive App",
            shortTitle = "React 19",
            path = "/previews/react-example/index.html",
            description = "Live React component playground with client state stores",
            badge = "REACT",
            category = StudioCategory.SANDBOXES
        )
    )

    fun findMatchingPreset(url: String): StudioPreset? {
        val path = extractPath(url)
        return PRESETS.find { preset ->
            path == preset.path || (preset.path != "/" && path.startsWith(preset.path.substringBeforeLast(".")))
        }
    }

    fun getPresetsByCategory(category: StudioCategory): List<StudioPreset> {
        return if (category == StudioCategory.ALL) PRESETS else PRESETS.filter { it.category == category }
    }
}

fun resolvePresetUrl(baseUrl: String, presetPath: String): String {
    val trimmedPath = presetPath.trim()
    if (trimmedPath.startsWith("http://", ignoreCase = true) || trimmedPath.startsWith("https://", ignoreCase = true)) {
        return trimmedPath
    }

    val cleanBase = baseUrl.trim().ifEmpty { "http://100.125.220.102:8088" }
    val uri = try {
        URI.create(cleanBase)
    } catch (e: Exception) {
        null
    }

    val origin = if (uri != null && !uri.host.isNullOrEmpty()) {
        val scheme = uri.scheme ?: "http"
        val host = uri.host
        val port = if (uri.port != -1) ":${uri.port}" else ""
        "$scheme://$host$port"
    } else {
        val match = Regex("""^(https?://[^/?#]+)""", RegexOption.IGNORE_CASE).find(cleanBase)
        match?.groupValues?.get(1) ?: cleanBase.substringBefore("?")
    }

    val formattedPath = if (trimmedPath.startsWith("/")) trimmedPath else "/$trimmedPath"
    return "$origin$formattedPath"
}

fun extractDisplayHost(url: String): String {
    return try {
        val uri = URI.create(url)
        val host = uri.host ?: ""
        val port = if (uri.port != -1) ":${uri.port}" else ""
        if (host.isNotEmpty()) "$host$port" else url.removePrefix("http://").removePrefix("https://").substringBefore("/")
    } catch (e: Exception) {
        url.removePrefix("http://").removePrefix("https://").substringBefore("/")
    }
}

fun extractPath(url: String): String {
    return try {
        val uri = URI.create(url)
        uri.path ?: ""
    } catch (e: Exception) {
        val stripped = url.removePrefix("http://").removePrefix("https://")
        val idx = stripped.indexOf('/')
        if (idx != -1) stripped.substring(idx) else "/"
    }
}

fun extractDisplayTitle(url: String, pageTitle: String?): String {
    if (!pageTitle.isNullOrBlank() && pageTitle != "about:blank" && !pageTitle.startsWith("http://") && !pageTitle.startsWith("https://")) {
        return pageTitle
    }
    val preset = StudioPresets.findMatchingPreset(url)
    if (preset != null) {
        return preset.title
    }
    val path = extractPath(url)
    if (path.isNotEmpty() && path != "/") {
        return path.trim('/').substringAfterLast('/')
    }
    return extractDisplayHost(url)
}

fun filterLogs(
    logs: List<ConsoleLogEntry>,
    levelFilter: ConsoleLogLevel?,
    searchQuery: String
): List<ConsoleLogEntry> {
    return logs.filter { entry ->
        val matchesLevel = levelFilter == null || entry.level == levelFilter
        val matchesQuery = searchQuery.isBlank() ||
            entry.message.contains(searchQuery, ignoreCase = true) ||
            (entry.sourceId?.contains(searchQuery, ignoreCase = true) == true)
        matchesLevel && matchesQuery
    }
}

