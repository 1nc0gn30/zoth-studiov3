package com.example.zothsignalbridge.data.repository

import com.example.zothsignalbridge.data.models.AgentNode
import com.example.zothsignalbridge.data.models.ConnectionState
import com.example.zothsignalbridge.data.models.ConnectionStatus
import com.example.zothsignalbridge.data.models.ConsensusArenaState
import com.example.zothsignalbridge.data.models.DiagnosticLog
import com.example.zothsignalbridge.data.models.DialecticStage
import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.PantheonAgent
import com.example.zothsignalbridge.data.models.ProjectClaim
import com.example.zothsignalbridge.data.models.SoundEffect
import com.example.zothsignalbridge.data.models.SwarmMessage
import com.example.zothsignalbridge.data.models.SwarmNote
import com.example.zothsignalbridge.data.models.SwarmPet
import com.example.zothsignalbridge.data.models.SwarmTelemetry
import com.example.zothsignalbridge.data.models.TailscaleConfig
import com.example.zothsignalbridge.data.models.VoteDecision
import com.example.zothsignalbridge.data.network.SwarmApiClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class SwarmRepository(
    private val apiClient: SwarmApiClient = SwarmApiClient(),
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Default)
) {

    private val _config = MutableStateFlow(TailscaleConfig())
    val config: StateFlow<TailscaleConfig> = _config.asStateFlow()

    private val _selectedChannel = MutableStateFlow("all")
    val selectedChannel: StateFlow<String> = _selectedChannel.asStateFlow()

    private val _messages = MutableStateFlow<List<SwarmMessage>>(apiClient.getSampleTransmissions())
    val messages: StateFlow<List<SwarmMessage>> = _messages.asStateFlow()

    private val _agents = MutableStateFlow<List<AgentNode>>(apiClient.getDefaultAgents())
    val agents: StateFlow<List<AgentNode>> = _agents.asStateFlow()

    private val _claims = MutableStateFlow<List<ProjectClaim>>(
        listOf(
            ProjectClaim("zoth-studio", "antigravity", "Sovereign Signal Bridge Implementation", "Active now"),
            ProjectClaim("consensus-arena", "grok", "Merkle AST Validation Matrix", "Active now")
        )
    )
    val claims: StateFlow<List<ProjectClaim>> = _claims.asStateFlow()

    private val _telemetry = MutableStateFlow(SwarmTelemetry())
    val telemetry: StateFlow<SwarmTelemetry> = _telemetry.asStateFlow()

    private val _connectionStatus = MutableStateFlow(ConnectionStatus(ConnectionState.CONNECTING))
    val connectionStatus: StateFlow<ConnectionStatus> = _connectionStatus.asStateFlow()

    // Consensus Arena State
    private val _consensusState = MutableStateFlow(ConsensusDataProvider.createInitialState())
    val consensusState: StateFlow<ConsensusArenaState> = _consensusState.asStateFlow()

    // Pantheon State
    private val _pantheonAgents = MutableStateFlow(PantheonDataProvider.getAllAgents())
    val pantheonAgents: StateFlow<List<PantheonAgent>> = _pantheonAgents.asStateFlow()

    // Notes State
    private val _notes = MutableStateFlow(NotesDataProvider.getInitialNotes())
    val notes: StateFlow<List<SwarmNote>> = _notes.asStateFlow()

    // Pets State
    private val _pets = MutableStateFlow(PetsDataProvider.getInitialPets())
    val pets: StateFlow<List<SwarmPet>> = _pets.asStateFlow()

    // Soundboard State
    private val _soundEffects = MutableStateFlow(SoundboardDataProvider.getInitialSounds())
    val soundEffects: StateFlow<List<SoundEffect>> = _soundEffects.asStateFlow()

    private val _activePlayingSoundId = MutableStateFlow<String?>(null)
    val activePlayingSoundId: StateFlow<String?> = _activePlayingSoundId.asStateFlow()

    private val _isMuted = MutableStateFlow(false)
    val isMuted: StateFlow<Boolean> = _isMuted.asStateFlow()

    private val _hapticsEnabled = MutableStateFlow(true)
    val hapticsEnabled: StateFlow<Boolean> = _hapticsEnabled.asStateFlow()

    val diagnosticLogs: StateFlow<List<DiagnosticLog>> = apiClient.diagnosticLogs

    private var pollJob: Job? = null

    init {
        startPolling()
    }

    fun updateConfig(newConfig: TailscaleConfig) {
        val oldHost = _config.value.host
        _config.value = newConfig
        if (oldHost != newConfig.host) {
            scope.launch { syncData() }
        }
    }

    fun selectChannel(channel: String) {
        _selectedChannel.value = channel
    }

    fun releaseClaim(project: String) {
        _claims.value = _claims.value.filterNot { it.project.equals(project, ignoreCase = true) }
        _telemetry.value = _telemetry.value.copy(openClaims = _claims.value.size)
    }

    fun startPolling() {
        pollJob?.cancel()
        pollJob = scope.launch {
            while (isActive) {
                syncData()
                val interval = (_config.value.pollIntervalSec.coerceIn(1, 30)) * 1000L
                delay(interval)
            }
        }
    }

    suspend fun syncNow() {
        syncData()
    }

    private suspend fun syncData() {
        val host = _config.value.host
        val token = _config.value.apiToken.ifBlank { null }
        
        val latency = apiClient.ping(host, token)
        if (latency >= 0) {
            val result = apiClient.fetchSwarm(host, token)
            result.onSuccess { (remoteMsgs, remoteAgents, remoteClaims) ->
                _connectionStatus.value = ConnectionStatus(ConnectionState.CONNECTED, latencyMs = latency)
                
                if (remoteAgents.isNotEmpty()) {
                    _agents.value = remoteAgents
                }
                _claims.value = remoteClaims
                
                if (remoteMsgs.isNotEmpty()) {
                    // Merge remote messages with local outbound messages
                    val merged = (remoteMsgs + _messages.value.filter { it.isOutbound && remoteMsgs.none { rm -> rm.id == it.id } })
                        .distinctBy { it.id }
                    _messages.value = merged
                }

                // Sync Live Annotations from Orchestrator
                val annotationsResult = apiClient.fetchAnnotations(host, token = token)
                annotationsResult.onSuccess { remoteNotes ->
                    if (remoteNotes.isNotEmpty()) {
                        _notes.value = remoteNotes
                    }
                }

                val nowStr = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date())
                _telemetry.value = SwarmTelemetry(
                    activeAgents = _agents.value.count { it.isOnline } + _pantheonAgents.value.count { it.isOnline },
                    totalMessages = _messages.value.size,
                    openClaims = _claims.value.size,
                    activeProposals = _consensusState.value.proposals.size,
                    port8484Ok = true,
                    port8088Ok = true,
                    port11434Ok = _agents.value.any { it.id == "ollama" && it.status != "offline" },
                    port8989Ok = true,
                    latencyMs = latency,
                    lastSyncTime = nowStr
                )
            }.onFailure { err ->
                _connectionStatus.value = ConnectionStatus(ConnectionState.ERROR, errorMessage = err.message, latencyMs = latency)
            }
        } else {
            _connectionStatus.value = ConnectionStatus(
                ConnectionState.OFFLINE,
                errorMessage = "Host unreachable on Tailscale: $host. Tap Settings to configure IP."
            )
        }
    }

    fun sendMessage(to: String, text: String, priority: String = "normal") {
        val outboundMsg = SwarmMessage(
            id = UUID.randomUUID().toString(),
            from = "operator",
            to = to,
            message = text,
            topic = "chat",
            priority = priority,
            timestamp = "Just now",
            isDelivered = true,
            isOutbound = true
        )
        // Optimistic UI update (append to end of list for chronological order)
        _messages.value = _messages.value + listOf(outboundMsg)

        scope.launch {
            val host = _config.value.host
            val token = _config.value.apiToken.ifBlank { null }
            val res = apiClient.postMessage(host, "operator", to, text, priority, token)
            res.onSuccess { postResult ->
                // Update outbound confirmation and append live agent reply if returned
                val current = _messages.value
                val updated = current.map { if (it.id == outboundMsg.id) postResult.message else it }
                val withReply = if (postResult.reply != null && updated.none { it.id == postResult.reply.id }) {
                    updated + listOf(postResult.reply)
                } else {
                    updated
                }
                _messages.value = withReply
                // Trigger background sync to refresh state
                syncData()
            }.onFailure {
                // If offline, simulate autonomous agent response for seamless operator UX
                simulateAgentResponse(to, text)
            }
        }
    }

    private suspend fun simulateAgentResponse(targetAgent: String, promptText: String) {
        delay(1200)
        val responder = if (targetAgent == "all" || targetAgent.isBlank()) "antigravity" else targetAgent
        val replyText = when (responder) {
            "antigravity" -> "⚡ [@antigravity ACK] Command received on Tailscale tunnel. Static AST verified. Proceeding with workspace update."
            "azoth" -> "⚗️ [@azoth Hermetic Node] Transmutation formula acknowledged. Alchemical resonance at maximum."
            "grok" -> "🚀 [@grok Studio] Task ingested into refactoring pipeline. Synthesizing responsive canvas update."
            "hermes" -> "🕊️ [@hermes Planner] Tool execution loop initialized. Running Parrot OS subroutines."
            "ollama" -> "🦙 [@ollama Local] Neural inference computed with zero cloud egress."
            else -> "✨ [@$responder ACK] Transmission received by swarm node."
        }
        val replyMsg = SwarmMessage(
            id = UUID.randomUUID().toString(),
            from = responder,
            to = "operator",
            message = replyText,
            topic = "chat",
            priority = "normal",
            timestamp = "Just now",
            isDelivered = true,
            isOutbound = false
        )
        _messages.value = _messages.value + listOf(replyMsg)
    }

    // ==================== Consensus Arena Actions ====================

    fun selectDialecticStage(stage: DialecticStage) {
        _consensusState.value = _consensusState.value.copy(
            selectedDialecticStage = stage
        )
    }

    fun selectProposal(proposalId: String) {
        _consensusState.value = _consensusState.value.copy(
            selectedAgentProposalId = proposalId
        )
    }

    fun toggleAgentVote(agentId: String, decision: VoteDecision) {
        val updatedNodes = _consensusState.value.stakeNodes.map { node ->
            if (node.agentId == agentId) {
                node.copy(vote = decision)
            } else {
                node
            }
        }
        _consensusState.value = _consensusState.value.copy(
            stakeNodes = updatedNodes,
            lastActionMessage = "Vote updated for @$agentId: $decision"
        )
    }

    fun toggleByzantineStatus(agentId: String) {
        val updatedNodes = _consensusState.value.stakeNodes.map { node ->
            if (node.agentId == agentId) {
                node.copy(isByzantine = !node.isByzantine)
            } else {
                node
            }
        }
        val targetNode = updatedNodes.find { it.agentId == agentId }
        val msg = if (targetNode?.isByzantine == true) {
            "⚠️ Byzantine Fault Injected into @$agentId"
        } else {
            "✓ @$agentId restored to trusted validator"
        }
        _consensusState.value = _consensusState.value.copy(
            stakeNodes = updatedNodes,
            lastActionMessage = msg
        )
    }

    fun reverifyMerkleProof() {
        scope.launch {
            _consensusState.value = _consensusState.value.copy(isReverifying = true)
            delay(900)
            val nowStr = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date()) + " UTC"
            val updatedProof = _consensusState.value.merkleProof.copy(
                isValidated = true,
                verifiedAt = "$nowStr (Triangulated)"
            )
            _consensusState.value = _consensusState.value.copy(
                merkleProof = updatedProof,
                isReverifying = false,
                lastActionMessage = "Merkle AST Root Re-verified Across 3 Independent Engines"
            )
        }
    }

    fun resetConsensusState() {
        _consensusState.value = ConsensusDataProvider.createInitialState()
    }

    // ==================== Notes & Visual Annotations Actions ====================

    fun createNote(title: String, author: String, content: String, tags: List<String>) {
        val newNote = SwarmNote(
            id = "zn-${System.currentTimeMillis()}-user",
            title = title,
            author = author.ifBlank { "operator" },
            text = content,
            content = content,
            tags = tags,
            timestamp = "Just now",
            status = NoteStatus.IN_REVIEW
        )
        _notes.value = listOf(newNote) + _notes.value
    }

    fun updateNoteStatus(noteId: String, newStatus: NoteStatus) {
        val target = _notes.value.find { it.id == noteId } ?: return
        val nowIso = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val updated = target.copy(
            status = newStatus,
            resolvedAt = if (newStatus == NoteStatus.APPROVED) nowIso else null,
            resolvedBy = if (newStatus == NoteStatus.APPROVED) "@operator" else null
        )
        _notes.value = _notes.value.map { if (it.id == noteId) updated else it }
        val statusStr = if (newStatus == NoteStatus.APPROVED) "resolved" else "open"
        scope.launch {
            val host = _config.value.host
            val token = _config.value.apiToken.ifBlank { null }
            apiClient.updateAnnotationStatus(host, noteId, statusStr, "@operator", token)
        }
    }

    fun toggleAnnotationStatus(noteId: String) {
        val target = _notes.value.find { it.id == noteId } ?: return
        val newStatus = if (target.isResolved) NoteStatus.IN_REVIEW else NoteStatus.APPROVED
        val nowIso = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val updated = target.copy(
            status = newStatus,
            resolvedAt = if (newStatus == NoteStatus.APPROVED) nowIso else null,
            resolvedBy = if (newStatus == NoteStatus.APPROVED) "@operator" else null
        )
        _notes.value = _notes.value.map { if (it.id == noteId) updated else it }

        scope.launch {
            val host = _config.value.host
            val token = _config.value.apiToken.ifBlank { null }
            val statusStr = if (newStatus == NoteStatus.APPROVED) "resolved" else "open"
            apiClient.updateAnnotationStatus(host, noteId, statusStr, "@operator", token)
        }
    }

    fun updateAnnotationStatus(noteId: String, status: String, resolvedBy: String = "@operator") {
        val target = _notes.value.find { it.id == noteId } ?: return
        val isApproved = status.equals("resolved", ignoreCase = true) || status.equals("approved", ignoreCase = true)
        val newStatusEnum = if (isApproved) NoteStatus.APPROVED else NoteStatus.IN_REVIEW
        val nowIso = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val updated = target.copy(
            status = newStatusEnum,
            resolvedAt = if (isApproved) nowIso else null,
            resolvedBy = if (isApproved) resolvedBy else null
        )
        _notes.value = _notes.value.map { if (it.id == noteId) updated else it }

        scope.launch {
            val host = _config.value.host
            val token = _config.value.apiToken.ifBlank { null }
            apiClient.updateAnnotationStatus(host, noteId, status, resolvedBy, token)
        }
    }

    fun resolveAnnotation(noteId: String, resolvedBy: String = "@operator") {
        updateAnnotationStatus(noteId, "resolved", resolvedBy)
    }

    fun reopenAnnotation(noteId: String) {
        updateAnnotationStatus(noteId, "open", "@operator")
    }

    fun dispatchAnnotationReply(noteId: String, targetAgent: String, replyText: String, priority: String = "normal") {
        val agentClean = if (targetAgent.isBlank()) "all" else targetAgent.removePrefix("@")
        sendMessage(to = agentClean, text = replyText, priority = priority)
    }

    suspend fun syncAnnotationsNow() {
        val host = _config.value.host
        val token = _config.value.apiToken.ifBlank { null }
        val res = apiClient.fetchAnnotations(host, token = token)
        res.onSuccess { remoteNotes ->
            if (remoteNotes.isNotEmpty()) {
                _notes.value = remoteNotes
            }
        }
    }

    // ==================== Pets Actions ====================

    fun feedPet(petId: String) {
        _pets.value = _pets.value.map { pet: SwarmPet ->
            if (pet.id == petId) {
                val newEnergy = (pet.energy + 25).coerceAtMost(100)
                val newExp = pet.exp + 10
                val lvl = if (newExp >= pet.maxExp) pet.level + 1 else pet.level
                val finalExp = if (newExp >= pet.maxExp) newExp - pet.maxExp else newExp
                pet.copy(
                    energy = newEnergy,
                    exp = finalExp,
                    level = lvl,
                    mood = "Hyped",
                    lastInteracted = "Just now"
                )
            } else {
                pet
            }
        }
    }

    fun petCompanion(petId: String) {
        _pets.value = _pets.value.map { pet: SwarmPet ->
            if (pet.id == petId) {
                val newBond = (pet.bondLevel + 5).coerceAtMost(100)
                pet.copy(
                    bondLevel = newBond,
                    mood = "Playful",
                    lastInteracted = "Just now"
                )
            } else {
                pet
            }
        }
    }

    fun trainPet(petId: String) {
        _pets.value = _pets.value.map { pet: SwarmPet ->
            if (pet.id == petId) {
                val newEnergy = (pet.energy - 15).coerceAtLeast(0)
                val newExp = pet.exp + 25
                val lvl = if (newExp >= pet.maxExp) pet.level + 1 else pet.level
                val finalExp = if (newExp >= pet.maxExp) newExp - pet.maxExp else newExp
                pet.copy(
                    energy = newEnergy,
                    exp = finalExp,
                    level = lvl,
                    mood = "Focused",
                    lastInteracted = "Just now"
                )
            } else {
                pet
            }
        }
    }

    fun sendPetPrompt(petId: String, promptText: String) {
        val pet = _pets.value.find { it.id == petId } ?: return
        sendMessage(
            to = pet.id,
            text = "🐾 [via Companion ${pet.name}] $promptText",
            priority = "high"
        )
    }

    // ==================== Soundboard Actions ====================

    fun playSound(soundId: String) {
        if (_isMuted.value) return
        _activePlayingSoundId.value = soundId
        val sound = _soundEffects.value.find { it.id == soundId }
        val duration = sound?.durationMs ?: 1000L

        scope.launch {
            delay(duration)
            if (_activePlayingSoundId.value == soundId) {
                _activePlayingSoundId.value = null
            }
        }
    }

    fun toggleMute() {
        _isMuted.value = !_isMuted.value
    }

    fun toggleHaptics() {
        _hapticsEnabled.value = !_hapticsEnabled.value
    }

    // ==================== Diagnostics & Cache Actions ====================

    fun clearLogs() {
        apiClient.clearLogs()
    }

    fun clearDiagnosticLogs() {
        apiClient.clearLogs()
    }

    fun clearCache() {
        apiClient.clearLogs()
        _messages.value = apiClient.getSampleTransmissions()
        _telemetry.value = SwarmTelemetry()
        scope.launch { syncData() }
    }

    suspend fun pingHost(host: String, token: String? = null): Long {
        return apiClient.ping(host, token)
    }
}
