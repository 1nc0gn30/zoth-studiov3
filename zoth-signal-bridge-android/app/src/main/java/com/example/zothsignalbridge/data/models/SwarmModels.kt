package com.example.zothsignalbridge.data.models

enum class AppScreen(val route: String, val title: String, val category: String) {
    TRANSMISSIONS("transmissions", "Transmissions", "Core Comms"),
    RADAR("radar", "Swarm Radar", "Core Comms"),
    ARENA("arena", "Consensus Arena", "Governance"),
    PANTHEON("pantheon", "Pantheon (21)", "Intelligence"),
    NOTES("notes", "Notes Reviewer", "Intelligence"),
    PETS("pets", "Cyber Pets", "Companions"),
    SOUNDBOARD("soundboard", "Soundboard", "Sensory"),
    WEB_HUD("web_hud", "Web HUD", "Operations"),
    SETTINGS("settings", "Settings", "System")
}

data class SwarmMessage(
    val id: String,
    val from: String,
    val to: String = "all",
    val message: String,
    val topic: String = "chat",
    val priority: String = "normal",
    val timestamp: String = "",
    val isDelivered: Boolean = true,
    val isOutbound: Boolean = false
)

data class SwarmPostResponse(
    val message: SwarmMessage,
    val reply: SwarmMessage? = null
)

data class AgentNode(
    val id: String,
    val name: String,
    val status: String = "active",
    val currentTask: String = "Idle / Listening on Event Bus",
    val capabilities: String = "",
    val region: String = "Field",
    val lastSeen: String = "",
    val isOnline: Boolean = true
)

data class ProjectClaim(
    val project: String,
    val agent: String,
    val note: String = "",
    val claimedAt: String = ""
)

data class SwarmTelemetry(
    val activeAgents: Int = 21,
    val totalMessages: Int = 0,
    val openClaims: Int = 0,
    val activeProposals: Int = 0,
    val port8484Ok: Boolean = true,
    val port8088Ok: Boolean = true,
    val port11434Ok: Boolean = false,
    val port8989Ok: Boolean = true,
    val latencyMs: Long = 0L,
    val lastSyncTime: String = "Never"
)

data class TailscaleConfig(
    val host: String = "http://100.125.220.102:8484",
    val studioUrl: String = "http://100.125.220.102:8088/studio/swarm.html",
    val apiToken: String = "",
    val pollIntervalSec: Int = 3,
    val vibrateOnMessage: Boolean = true,
    val soundEnabled: Boolean = true,
    val activeChannel: String = "all",
    val themeMode: String = "DARK"
)

enum class ConnectionState {
    CONNECTED,
    CONNECTING,
    OFFLINE,
    ERROR
}

data class ConnectionStatus(
    val state: ConnectionState = ConnectionState.OFFLINE,
    val errorMessage: String? = null,
    val latencyMs: Long = 0L
)

// Consensus Arena Models
enum class ProposalStatus {
    ACTIVE,
    PASSED,
    REJECTED,
    EXECUTED
}

data class ConsensusProposal(
    val id: String,
    val title: String,
    val description: String,
    val proposer: String,
    val votes: Map<String, Boolean> = emptyMap(), // agentId -> true (Approve) / false (Reject)
    val status: ProposalStatus = ProposalStatus.ACTIVE,
    val quorumPercentage: Int = 0,
    val requiredQuorumPct: Int = 67,
    val createdAt: String = "",
    val merkleRoot: String = "",
    val targetSubsystem: String = "AST Validator"
)

// Pantheon Models
enum class PantheonDomain(val displayName: String) {
    ALL("All 21"),
    ARCHITECTS("Architects"),
    SYNTHESIZERS("Synthesizers"),
    PLANNERS("Planners"),
    SENSORY("Sensory"),
    GUARDIANS("Guardians")
}

data class PantheonAgent(
    val id: String,
    val name: String,
    val archetype: String,
    val domain: PantheonDomain,
    val status: String = "active",
    val avatarEmoji: String,
    val quote: String,
    val capabilities: List<String>,
    val tools: List<String>,
    val rank: String,
    val isOnline: Boolean = true
)

// Notes Reviewer Models
enum class NoteStatus {
    DRAFT,
    IN_REVIEW,
    APPROVED,
    REJECTED
}

data class AnnotationRect(
    val x: Double = 0.0,
    val y: Double = 0.0,
    val width: Double = 0.0,
    val height: Double = 0.0
)

data class AnnotationViewport(
    val width: Int = 1920,
    val height: Int = 920,
    val scrollX: Int = 0,
    val scrollY: Int = 0
)

data class AnnotationTarget(
    val type: String = "element",
    val label: String = "",
    val selector: String = "",
    val xpath: String = "",
    val elementTag: String = "",
    val elementText: String = "",
    val pageX: Double = 0.0,
    val pageY: Double = 0.0,
    val clientX: Double = 0.0,
    val clientY: Double = 0.0,
    val rect: AnnotationRect = AnnotationRect()
)

data class SwarmNote(
    val id: String,
    val createdAt: String = "",
    val createdLocal: String = "",
    val status: NoteStatus = NoteStatus.IN_REVIEW,
    val text: String = "",
    val category: String = "UI / Visual",
    val priority: String = "Normal",
    val taggedAgents: List<String> = emptyList(),
    val pageUrl: String = "http://127.0.0.1:8088/",
    val pathname: String = "/",
    val viewport: AnnotationViewport = AnnotationViewport(),
    val target: AnnotationTarget = AnnotationTarget(),
    val pageX: Double = 0.0,
    val pageY: Double = 0.0,
    val selector: String = "",
    val resolvedBy: String? = null,
    val resolvedAt: String? = null,
    val title: String = text.take(50),
    val author: String = taggedAgents.firstOrNull() ?: "operator",
    val content: String = text,
    val tags: List<String> = listOf(category, pathname) + taggedAgents,
    val timestamp: String = createdLocal.ifBlank { createdAt },
    val noteStatus: NoteStatus = status,
    val reviewers: List<String> = if (resolvedBy != null) listOf(resolvedBy) else emptyList()
) {
    val isOpen: Boolean
        get() = status != NoteStatus.APPROVED && status != NoteStatus.REJECTED

    val isResolved: Boolean
        get() = status == NoteStatus.APPROVED

    val rawStatus: String
        get() = if (isResolved) "resolved" else "open"

    val displaySelector: String
        get() = selector.ifBlank { target.selector.ifBlank { target.label } }

    val displayAuthor: String
        get() = if (taggedAgents.isNotEmpty()) taggedAgents.joinToString(", ") { "@$it" } else "@operator"

    val displayPriority: String
        get() = priority.ifBlank { "Normal" }

    val displayPage: String
        get() = pathname.ifBlank { "/" }
}

// Pets & Companion Spirits Models
data class SwarmPet(
    val id: String,
    val name: String,
    val species: String,
    val avatarEmoji: String,
    val level: Int = 1,
    val exp: Int = 0,
    val maxExp: Int = 100,
    val energy: Int = 100, // 0..100
    val mood: String = "Hyped",
    val specialty: String = "Subagent Recon",
    val bondLevel: Int = 50, // 0..100
    val lastInteracted: String = "Just now",
    val roleTitle: String = "Companion Spirit",
    val healthStatus: String = "HEALTHY",
    val healthPercentage: Int = 99,
    val docCount: Int = 120,
    val lastHealed: String = "2m ago",
    val integrityScore: Double = 0.99,
    val isReindexing: Boolean = false,
    val latencyMs: Long = 4L,
    val memoryUsageMb: Int = 48,
    val vectorChunkCount: Int = 4800,
    val merkleRoot: String = "0x7f8a9c...4e1d",
    val activeWatchdogs: List<String> = emptyList()
)

data class KnowledgeDoc(
    val id: String,
    val title: String,
    val category: String,
    val snippet: String,
    val petId: String,
    val petName: String,
    val tags: List<String> = emptyList(),
    val lastUpdated: String = "Just now",
    val chunkCount: Int = 32,
    val isVerified: Boolean = true
)

// Soundboard Models
enum class SoundCategory(val displayName: String) {
    ALL("All"),
    SWARM_EVENTS("Events"),
    ALCHEMY("Alchemy"),
    SYSTEM("System"),
    FEEDBACK("Haptic & Tone")
}

data class SoundEffect(
    val id: String,
    val name: String,
    val category: SoundCategory,
    val icon: String,
    val durationMs: Long,
    val description: String,
    val hapticPattern: String,
    val isPlaying: Boolean = false
)

data class DiagnosticLog(
    val id: String = java.util.UUID.randomUUID().toString(),
    val timestamp: String,
    val method: String, // "GET", "POST", "PING"
    val endpoint: String,
    val statusCode: Int,
    val statusText: String,
    val latencyMs: Long,
    val details: String = "",
    val isSuccess: Boolean = statusCode in 200..399
)

data class TailnetPreset(
    val id: String,
    val title: String,
    val subtitle: String,
    val hostUrl: String,
    val studioUrl: String,
    val ipOrHost: String,
    val isTailscale: Boolean = true
)
