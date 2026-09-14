package com.example.zothsignalbridge.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.zothsignalbridge.audio.PlaybackState
import com.example.zothsignalbridge.audio.SoundboardAudioEngine
import com.example.zothsignalbridge.audio.SoundboardCatalog
import com.example.zothsignalbridge.data.models.AgentNode
import com.example.zothsignalbridge.data.models.AppScreen
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
import com.example.zothsignalbridge.data.repository.SwarmRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MainUiState(
    val selectedTab: Int = 0,
    val selectedScreen: AppScreen = AppScreen.TRANSMISSIONS,
    val selectedChannel: String = "all",
    val messages: List<SwarmMessage> = emptyList(),
    val agents: List<AgentNode> = emptyList(),
    val claims: List<ProjectClaim> = emptyList(),
    val telemetry: SwarmTelemetry = SwarmTelemetry(),
    val connectionStatus: ConnectionStatus = ConnectionStatus(),
    val config: TailscaleConfig = TailscaleConfig()
)

class MainScreenViewModel(
    private val repository: SwarmRepository = SwarmRepository(),
    val audioEngine: SoundboardAudioEngine = SoundboardAudioEngine()
) : ViewModel() {

    private val _selectedTab = MutableStateFlow(0)
    val selectedTab: StateFlow<Int> = _selectedTab.asStateFlow()

    private val _selectedScreen = MutableStateFlow(AppScreen.TRANSMISSIONS)
    val selectedScreen: StateFlow<AppScreen> = _selectedScreen.asStateFlow()

    val selectedChannel: StateFlow<String> = repository.selectedChannel
    val messages: StateFlow<List<SwarmMessage>> = repository.messages
    val agents: StateFlow<List<AgentNode>> = repository.agents
    val claims: StateFlow<List<ProjectClaim>> = repository.claims
    val telemetry: StateFlow<SwarmTelemetry> = repository.telemetry
    val connectionStatus: StateFlow<ConnectionStatus> = repository.connectionStatus
    val config: StateFlow<TailscaleConfig> = repository.config
    val consensusState: StateFlow<ConsensusArenaState> = repository.consensusState
    val pantheonAgents: StateFlow<List<PantheonAgent>> = repository.pantheonAgents
    val notes: StateFlow<List<SwarmNote>> = repository.notes
    val pets: StateFlow<List<SwarmPet>> = repository.pets
    val soundEffects: StateFlow<List<SoundEffect>> = repository.soundEffects
    val activePlayingSoundId: StateFlow<String?> = repository.activePlayingSoundId
    val isMuted: StateFlow<Boolean> = repository.isMuted
    val hapticsEnabled: StateFlow<Boolean> = repository.hapticsEnabled
    val diagnosticLogs: StateFlow<List<DiagnosticLog>> = repository.diagnosticLogs
    val playbackState: StateFlow<PlaybackState> = audioEngine.playbackState

    private val _studioTargetUrl = MutableStateFlow<String?>(null)
    val studioTargetUrl: StateFlow<String?> = _studioTargetUrl.asStateFlow()

    fun openStudioUrl(url: String) {
        _studioTargetUrl.value = url
        selectTab(7)
    }

    fun clearDiagnosticLogs() {
        repository.clearLogs()
    }

    fun clearCache() {
        repository.clearCache()
    }

    fun pingHost(host: String = config.value.host, token: String? = config.value.apiToken) {
        viewModelScope.launch {
            repository.pingHost(host, token?.ifBlank { null })
        }
    }

    fun triggerPing() {
        pingHost()
    }

    fun selectTab(tab: Int) {
        _selectedTab.value = tab
        _selectedScreen.value = when (tab) {
            0 -> AppScreen.TRANSMISSIONS
            1 -> AppScreen.RADAR
            2 -> AppScreen.ARENA
            3 -> AppScreen.PANTHEON
            4 -> AppScreen.NOTES
            5 -> AppScreen.PETS
            6 -> AppScreen.SOUNDBOARD
            7 -> AppScreen.WEB_HUD
            8 -> AppScreen.SETTINGS
            else -> AppScreen.TRANSMISSIONS
        }
    }

    fun navigateTo(screen: AppScreen) {
        _selectedScreen.value = screen
        _selectedTab.value = when (screen) {
            AppScreen.TRANSMISSIONS -> 0
            AppScreen.RADAR -> 1
            AppScreen.ARENA -> 2
            AppScreen.PANTHEON -> 3
            AppScreen.NOTES -> 4
            AppScreen.PETS -> 5
            AppScreen.SOUNDBOARD -> 6
            AppScreen.WEB_HUD -> 7
            AppScreen.SETTINGS -> 8
        }
    }

    fun selectChannel(channel: String) {
        repository.selectChannel(channel)
        if (_selectedTab.value != 0) {
            selectTab(0)
        }
    }

    fun sendMessage(to: String, text: String, priority: String) {
        repository.sendMessage(to, text, priority)
    }

    fun saveConfig(newConfig: TailscaleConfig) {
        repository.updateConfig(newConfig)
    }

    fun releaseClaim(project: String) {
        repository.releaseClaim(project)
    }

    fun refresh() {
        viewModelScope.launch {
            repository.syncNow()
        }
    }

    // Consensus Arena delegations
    fun selectDialecticStage(stage: DialecticStage) {
        repository.selectDialecticStage(stage)
    }

    fun selectProposal(proposalId: String) {
        repository.selectProposal(proposalId)
    }

    fun toggleAgentVote(agentId: String, decision: VoteDecision) {
        repository.toggleAgentVote(agentId, decision)
    }

    fun toggleByzantineStatus(agentId: String) {
        repository.toggleByzantineStatus(agentId)
    }

    fun reverifyMerkleProof() {
        repository.reverifyMerkleProof()
    }

    fun resetConsensus() {
        repository.resetConsensusState()
    }

    // Notes & Visual Annotations delegations
    fun createNote(title: String, author: String, content: String, tags: List<String>) {
        repository.createNote(title, author, content, tags)
    }

    fun updateNoteStatus(noteId: String, newStatus: NoteStatus) {
        repository.updateNoteStatus(noteId, newStatus)
    }

    fun toggleNoteStatus(noteId: String) {
        repository.toggleAnnotationStatus(noteId)
    }

    fun resolveNote(noteId: String, resolvedBy: String = "@operator") {
        repository.resolveAnnotation(noteId, resolvedBy)
    }

    fun reopenNote(noteId: String) {
        repository.reopenAnnotation(noteId)
    }

    fun dispatchAnnotationReply(noteId: String, targetAgent: String, replyText: String, priority: String = "normal") {
        repository.dispatchAnnotationReply(noteId, targetAgent, replyText, priority)
    }

    fun refreshAnnotations() {
        viewModelScope.launch {
            repository.syncAnnotationsNow()
        }
    }

    // Pets delegations
    fun feedPet(petId: String) {
        repository.feedPet(petId)
    }

    fun petCompanion(petId: String) {
        repository.petCompanion(petId)
    }

    fun trainPet(petId: String) {
        repository.trainPet(petId)
    }

    fun sendPetPrompt(petId: String, promptText: String) {
        repository.sendPetPrompt(petId, promptText)
    }

    // Soundboard delegations
    fun playSound(soundId: String) {
        repository.playSound(soundId)
    }

    fun toggleMute() {
        repository.toggleMute()
    }

    fun toggleHaptics() {
        repository.toggleHaptics()
    }

    fun togglePlayActiveAudio() {
        val current = audioEngine.playbackState.value
        val activePad = current.activePadId?.let { SoundboardCatalog.getPadById(it) }
            ?: SoundboardCatalog.ALL_PADS.firstOrNull()
        if (activePad != null) {
            if (current.isPlaying) {
                audioEngine.stopAll()
            } else {
                audioEngine.playSound(activePad)
            }
        }
    }

    fun stopActiveAudio() {
        audioEngine.stopAll()
    }
}
