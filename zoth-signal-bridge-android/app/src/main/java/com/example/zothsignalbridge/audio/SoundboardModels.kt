package com.example.zothsignalbridge.audio

import androidx.compose.ui.graphics.Color
import com.example.zothsignalbridge.theme.AgentAntigravity
import com.example.zothsignalbridge.theme.AgentAzoth
import com.example.zothsignalbridge.theme.AgentGrok
import com.example.zothsignalbridge.theme.AgentHermes
import com.example.zothsignalbridge.theme.AgentOllama
import com.example.zothsignalbridge.theme.AgentOperator
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.GoldAccent
import com.example.zothsignalbridge.theme.PurpleSoft
import com.example.zothsignalbridge.theme.SovereignPurple

enum class SoundCategory(
    val id: String,
    val displayName: String,
    val icon: String,
    val description: String
) {
    ALL("all", "All Sounds", "⚡", "All sovereign audio drops and synthesizers"),
    AGENT_VOICES("agent_voices", "Agent Voices", "🎙️", "Neural voice drops & agent transmissions"),
    SWARM_SFX("swarm_sfx", "Swarm SFX", "📡", "Consensus, telemetry & alchemical signals"),
    AMBIENT_SYNTH("ambient_synth", "Ambient Synth", "🎹", "Generative atmospheric soundscapes & loops"),
    MUSIC_DROPS("music_drops", "Music Stems", "🎧", "Ivoxygen, Lucidbeatz & Willow Kayne music drops")
}

enum class SynthWaveType {
    SINE,
    SQUARE,
    SAWTOOTH,
    TRIANGLE,
    FM_VOICE,
    CHORD_PAD,
    NOISE_BURST,
    BELL_HARMONIC,
    ARPEGGIATOR,
    SUB_BASS_808
}

data class ToneStep(
    val frequencyHz: Float,
    val durationMs: Int,
    val volume: Float = 1.0f,
    val waveType: SynthWaveType = SynthWaveType.SINE
)

data class SoundPad(
    val id: String,
    val title: String,
    val subtitle: String,
    val narrationText: String,
    val category: SoundCategory,
    val icon: String,
    val durationMs: Long,
    val glowColor: Color,
    val tag: String,
    val waveType: SynthWaveType = SynthWaveType.SINE,
    val baseFrequencies: List<Float> = listOf(440f),
    val toneSteps: List<ToneStep> = emptyList(),
    val isAmbientLoopable: Boolean = false,
    val assetPath: String? = null
)

data class PlaybackState(
    val isPlaying: Boolean = false,
    val activePadId: String? = null,
    val progress: Float = 0f,
    val currentAmplitude: Float = 0f,
    val waveformBands: List<Float> = List(16) { 0f },
    val isLooping: Boolean = false,
    val volume: Float = 0.85f,
    val isMuted: Boolean = false,
    val activeCategory: SoundCategory = SoundCategory.ALL,
    val searchQuery: String = "",
    val reverbEnabled: Boolean = true,
    val bassBoostEnabled: Boolean = true,
    val isLowLatencyActive: Boolean = true
)

object SoundboardCatalog {

    val AGENT_VOICE_PADS = listOf(
        SoundPad(
            id = "voice_antigravity",
            title = "@antigravity Core",
            subtitle = "Quantum Matrix Nominal",
            narrationText = "Antigravity core online. Quantum gravity matrix nominal. AST parsing active.",
            category = SoundCategory.AGENT_VOICES,
            icon = "🧙‍♂️",
            durationMs = 2800L,
            glowColor = AgentAntigravity,
            tag = "Core Agent",
            waveType = SynthWaveType.FM_VOICE,
            baseFrequencies = listOf(220f, 440f, 660f, 880f),
            toneSteps = listOf(
                ToneStep(220f, 200, 0.8f, SynthWaveType.SINE),
                ToneStep(330f, 250, 0.9f, SynthWaveType.FM_VOICE),
                ToneStep(440f, 400, 1.0f, SynthWaveType.FM_VOICE),
                ToneStep(660f, 500, 0.95f, SynthWaveType.FM_VOICE),
                ToneStep(880f, 600, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(440f, 850, 0.7f, SynthWaveType.SINE)
            )
        ),
        SoundPad(
            id = "voice_azoth",
            title = "@azoth Transmute",
            subtitle = "Solve et Coagula",
            narrationText = "Solve et Coagula. The Great Work transmutes the code. Alchemical catalyst primed.",
            category = SoundCategory.AGENT_VOICES,
            icon = "⚗️",
            durationMs = 3200L,
            glowColor = AgentAzoth,
            tag = "Hermetic",
            waveType = SynthWaveType.BELL_HARMONIC,
            baseFrequencies = listOf(432f, 528f, 648f, 864f),
            toneSteps = listOf(
                ToneStep(432f, 400, 0.9f, SynthWaveType.BELL_HARMONIC),
                ToneStep(528f, 600, 1.0f, SynthWaveType.BELL_HARMONIC),
                ToneStep(648f, 800, 0.95f, SynthWaveType.BELL_HARMONIC),
                ToneStep(864f, 1400, 0.85f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "voice_grok",
            title = "@grok Telemetry",
            subtitle = "Warp Vector Engaged",
            narrationText = "Telemetry locked. Warp vector calculating at lightspeed. Sovereign node active.",
            category = SoundCategory.AGENT_VOICES,
            icon = "🚀",
            durationMs = 2400L,
            glowColor = AgentGrok,
            tag = "Quantum",
            waveType = SynthWaveType.SAWTOOTH,
            baseFrequencies = listOf(150f, 480f, 960f, 1920f),
            toneSteps = listOf(
                ToneStep(150f, 150, 0.9f, SynthWaveType.SAWTOOTH),
                ToneStep(300f, 150, 0.95f, SynthWaveType.SAWTOOTH),
                ToneStep(600f, 300, 1.0f, SynthWaveType.FM_VOICE),
                ToneStep(1200f, 500, 0.9f, SynthWaveType.SAWTOOTH),
                ToneStep(960f, 700, 0.8f, SynthWaveType.SINE),
                ToneStep(480f, 600, 0.6f, SynthWaveType.SINE)
            )
        ),
        SoundPad(
            id = "voice_hermes",
            title = "@hermes Relay",
            subtitle = "Sovereign Mesh Relayed",
            narrationText = "Sovereign signal relayed across the WireGuard mesh. Zero cloud leakage.",
            category = SoundCategory.AGENT_VOICES,
            icon = "🕊️",
            durationMs = 2900L,
            glowColor = AgentHermes,
            tag = "Messenger",
            waveType = SynthWaveType.CHORD_PAD,
            baseFrequencies = listOf(587.33f, 739.99f, 880.0f, 1174.66f),
            toneSteps = listOf(
                ToneStep(587.33f, 350, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(739.99f, 400, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(880.00f, 650, 1.0f, SynthWaveType.BELL_HARMONIC),
                ToneStep(1174.66f, 1500, 0.8f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "voice_ollama",
            title = "@ollama Neural",
            subtitle = "Local Weights Loaded",
            narrationText = "Local neural weights loaded. 8k context window locked. Local inference ready.",
            category = SoundCategory.AGENT_VOICES,
            icon = "🦙",
            durationMs = 2600L,
            glowColor = AgentOllama,
            tag = "Neural",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(55f, 110f, 220f, 440f),
            toneSteps = listOf(
                ToneStep(55f, 500, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(110f, 400, 0.9f, SynthWaveType.SAWTOOTH),
                ToneStep(220f, 500, 0.85f, SynthWaveType.FM_VOICE),
                ToneStep(440f, 700, 0.8f, SynthWaveType.SINE),
                ToneStep(110f, 500, 0.7f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "voice_operator",
            title = "Operator Directive",
            subtitle = "Command Acknowledged",
            narrationText = "Directive acknowledged by swarm coordinator. Executing pipeline immediately.",
            category = SoundCategory.AGENT_VOICES,
            icon = "👤",
            durationMs = 2100L,
            glowColor = AgentOperator,
            tag = "Operator",
            waveType = SynthWaveType.SINE,
            baseFrequencies = listOf(600f, 900f, 1200f, 1800f),
            toneSteps = listOf(
                ToneStep(1200f, 120, 0.9f, SynthWaveType.SINE),
                ToneStep(1800f, 180, 1.0f, SynthWaveType.SINE),
                ToneStep(900f, 300, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(600f, 1500, 0.75f, SynthWaveType.SINE)
            )
        )
    )

    val SWARM_SFX_PADS = listOf(
        SoundPad(
            id = "sfx_quorum_achieved",
            title = "Quorum Achieved",
            subtitle = "Consensus Verified",
            narrationText = "Swarm quorum reached with 100% Byzantine fault tolerance.",
            category = SoundCategory.SWARM_SFX,
            icon = "⚖️",
            durationMs = 2200L,
            glowColor = EmeraldOnline,
            tag = "Consensus",
            waveType = SynthWaveType.CHORD_PAD,
            baseFrequencies = listOf(523.25f, 659.25f, 783.99f, 1046.50f),
            toneSteps = listOf(
                ToneStep(523.25f, 200, 0.8f, SynthWaveType.BELL_HARMONIC),
                ToneStep(659.25f, 200, 0.85f, SynthWaveType.BELL_HARMONIC),
                ToneStep(783.99f, 300, 0.95f, SynthWaveType.BELL_HARMONIC),
                ToneStep(1046.50f, 1500, 1.0f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "sfx_byzantine_alert",
            title = "Byzantine Alert",
            subtitle = "Desync / Threat Detected",
            narrationText = "Warning: Byzantine anomaly detected in peer gossip layer!",
            category = SoundCategory.SWARM_SFX,
            icon = "🚨",
            durationMs = 2500L,
            glowColor = CrimsonAlert,
            tag = "Threat",
            waveType = SynthWaveType.SQUARE,
            baseFrequencies = listOf(880f, 440f),
            toneSteps = listOf(
                ToneStep(880f, 250, 1.0f, SynthWaveType.SQUARE),
                ToneStep(440f, 250, 0.9f, SynthWaveType.SQUARE),
                ToneStep(880f, 250, 1.0f, SynthWaveType.SQUARE),
                ToneStep(440f, 250, 0.9f, SynthWaveType.SQUARE),
                ToneStep(880f, 250, 1.0f, SynthWaveType.SQUARE),
                ToneStep(440f, 250, 0.9f, SynthWaveType.SQUARE),
                ToneStep(880f, 500, 0.8f, SynthWaveType.SQUARE),
                ToneStep(220f, 500, 0.6f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "sfx_ast_verified",
            title = "AST Verified",
            subtitle = "Grammar & Syntax Safe",
            narrationText = "Abstract Syntax Tree validated without diagnostic errors.",
            category = SoundCategory.SWARM_SFX,
            icon = "✨",
            durationMs = 1600L,
            glowColor = AlchemicalGold,
            tag = "Verification",
            waveType = SynthWaveType.BELL_HARMONIC,
            baseFrequencies = listOf(1046.5f, 1318.5f, 1567.98f, 2093.0f),
            toneSteps = listOf(
                ToneStep(1046.50f, 100, 0.8f, SynthWaveType.BELL_HARMONIC),
                ToneStep(1318.51f, 120, 0.9f, SynthWaveType.BELL_HARMONIC),
                ToneStep(1567.98f, 150, 0.95f, SynthWaveType.BELL_HARMONIC),
                ToneStep(2093.00f, 1230, 1.0f, SynthWaveType.BELL_HARMONIC)
            )
        ),
        SoundPad(
            id = "sfx_quantum_handshake",
            title = "Quantum Handshake",
            subtitle = "WireGuard Sync Burst",
            narrationText = "Cryptographic session key exchanged over noise protocol.",
            category = SoundCategory.SWARM_SFX,
            icon = "⚡",
            durationMs = 1800L,
            glowColor = CyanNeon,
            tag = "Protocol",
            waveType = SynthWaveType.FM_VOICE,
            baseFrequencies = listOf(1760f, 2640f, 3520f),
            toneSteps = listOf(
                ToneStep(1760f, 80, 0.9f, SynthWaveType.FM_VOICE),
                ToneStep(2640f, 100, 0.95f, SynthWaveType.FM_VOICE),
                ToneStep(3520f, 120, 1.0f, SynthWaveType.FM_VOICE),
                ToneStep(1760f, 300, 0.8f, SynthWaveType.CHORD_PAD),
                ToneStep(880f, 1200, 0.6f, SynthWaveType.SINE)
            )
        ),
        SoundPad(
            id = "sfx_consensus_locked",
            title = "Consensus Locked",
            subtitle = "Block Committed",
            narrationText = "Block state finalized and committed to immutable event stream.",
            category = SoundCategory.SWARM_SFX,
            icon = "🔒",
            durationMs = 2000L,
            glowColor = PurpleSoft,
            tag = "Immutable",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(65f, 130f, 260f),
            toneSteps = listOf(
                ToneStep(260f, 150, 0.9f, SynthWaveType.SINE),
                ToneStep(130f, 250, 0.95f, SynthWaveType.SAWTOOTH),
                ToneStep(65f, 1600, 1.0f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "sfx_memory_purged",
            title = "Memory Purged",
            subtitle = "Ephemeral Zero-Wipe",
            narrationText = "Ephemeral memory buffer securely overwritten with cryptographic zero-bytes.",
            category = SoundCategory.SWARM_SFX,
            icon = "🧹",
            durationMs = 1700L,
            glowColor = AmberWarning,
            tag = "Security",
            waveType = SynthWaveType.NOISE_BURST,
            baseFrequencies = listOf(2000f, 1000f, 500f, 60f),
            toneSteps = listOf(
                ToneStep(2000f, 150, 1.0f, SynthWaveType.NOISE_BURST),
                ToneStep(1000f, 200, 0.85f, SynthWaveType.NOISE_BURST),
                ToneStep(500f, 350, 0.7f, SynthWaveType.SAWTOOTH),
                ToneStep(60f, 1000, 0.5f, SynthWaveType.SUB_BASS_808)
            )
        )
    )

    val AMBIENT_SYNTH_PADS = listOf(
        SoundPad(
            id = "ambient_neon_void",
            title = "Neon Void 808",
            subtitle = "Cyber Sub-Bass Pulse",
            narrationText = "Hypnotic cyberpunk rhythmic pulse generated at 60 Hz with ambient atmospheric undertones.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🌌",
            durationMs = 8000L,
            glowColor = CyanNeon,
            tag = "Synthwave",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(55f, 110f, 220f, 330f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(55f, 1000, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(110f, 1000, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(55f, 1000, 0.95f, SynthWaveType.SUB_BASS_808),
                ToneStep(220f, 1000, 0.8f, SynthWaveType.CHORD_PAD),
                ToneStep(55f, 1000, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(330f, 1000, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(55f, 1000, 0.95f, SynthWaveType.SUB_BASS_808),
                ToneStep(110f, 1000, 0.75f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "ambient_alchemical_drone",
            title = "Alchemical Drone",
            subtitle = "528 Hz Solfeggio Matrix",
            narrationText = "Continuous harmonically resonant alchemical frequency at 528 Hz with subtle binaural beating.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🔮",
            durationMs = 10000L,
            glowColor = AlchemicalGold,
            tag = "Harmonic",
            waveType = SynthWaveType.BELL_HARMONIC,
            baseFrequencies = listOf(528f, 530f, 1056f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(528f, 2500, 0.9f, SynthWaveType.BELL_HARMONIC),
                ToneStep(530f, 2500, 0.95f, SynthWaveType.CHORD_PAD),
                ToneStep(1056f, 2500, 0.85f, SynthWaveType.BELL_HARMONIC),
                ToneStep(528f, 2500, 0.9f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "ambient_cyber_rain",
            title = "Cyber Rain & Fog",
            subtitle = "Binaural Rain Atmosphere",
            narrationText = "Binaural filtered atmospheric rain soundscape with cyberpunk synth pads.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🌧️",
            durationMs = 9000L,
            glowColor = AgentAntigravity,
            tag = "Atmosphere",
            waveType = SynthWaveType.NOISE_BURST,
            baseFrequencies = listOf(440f, 660f, 880f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(440f, 2250, 0.8f, SynthWaveType.NOISE_BURST),
                ToneStep(660f, 2250, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(440f, 2250, 0.8f, SynthWaveType.NOISE_BURST),
                ToneStep(880f, 2250, 0.75f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "ambient_sovereign_grid",
            title = "Sovereign Grid Arp",
            subtitle = "130 BPM Modular Sequence",
            narrationText = "Fast hypnotic modular synth arpeggio driving the sovereign network grid.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "⚡",
            durationMs = 7000L,
            glowColor = SovereignPurple,
            tag = "Arpeggiator",
            waveType = SynthWaveType.ARPEGGIATOR,
            baseFrequencies = listOf(220f, 277.18f, 329.63f, 440f, 554.37f, 659.25f, 880f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(220.00f, 500, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(277.18f, 500, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(329.63f, 500, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(440.00f, 500, 1.0f, SynthWaveType.ARPEGGIATOR),
                ToneStep(554.37f, 500, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(659.25f, 500, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(880.00f, 500, 1.0f, SynthWaveType.ARPEGGIATOR),
                ToneStep(440.00f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(220.00f, 1500, 0.8f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "ivoxygen_casino143",
            title = "IVOXYGEN · Casino 143",
            subtitle = "Cyberpunk Phonk Drift",
            narrationText = "Hypnotic bassline and dark neon synthesizer drift through Neo-Cupertino.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🎰",
            durationMs = 6000L,
            glowColor = CyanNeon,
            tag = "IVOXYGEN",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(55f, 110f, 165f, 220f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(55f, 1500, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(110f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(165f, 1500, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(55f, 1500, 1.0f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "ivoxygen_ghost",
            title = "IVOXYGEN · Ghost",
            subtitle = "Atmospheric Reverb Wave",
            narrationText = "Ethereal spatial reverberation for deep alchemical code synthesis.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "👻",
            durationMs = 6000L,
            glowColor = PurpleSoft,
            tag = "IVOXYGEN",
            waveType = SynthWaveType.CHORD_PAD,
            baseFrequencies = listOf(220f, 330f, 440f, 660f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(220f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(330f, 1500, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(440f, 1500, 0.95f, SynthWaveType.BELL_HARMONIC),
                ToneStep(220f, 1500, 0.8f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "ivoxygen_skate",
            title = "IVOXYGEN · Skate",
            subtitle = "Kinetic Sidechain Drift",
            narrationText = "Heavy rhythm glide with kinetic sidechain compression.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🛹",
            durationMs = 5000L,
            glowColor = AlchemicalGold,
            tag = "IVOXYGEN",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(60f, 120f, 240f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(60f, 1250, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(120f, 1250, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(240f, 1250, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(60f, 1250, 1.0f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "lucidbeatz_shadows",
            title = "Lucidbeatz · Shadows",
            subtitle = "Dark Melodic Drift",
            narrationText = "Menacing sub-bass and 808 percussion for Byzantine consensus battles.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🌑",
            durationMs = 6000L,
            glowColor = AmberWarning,
            tag = "Lucidbeatz",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(50f, 100f, 150f, 200f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(50f, 1500, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(100f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(150f, 1500, 0.9f, SynthWaveType.ARPEGGIATOR),
                ToneStep(50f, 1500, 1.0f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "lucidbeatz_drift",
            title = "Lucidbeatz · Night Drive",
            subtitle = "Hyper-Ambient Phonk",
            narrationText = "Analog cassette warmth and midnight atmospheric synthesizer pads.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🚗",
            durationMs = 6000L,
            glowColor = CyanSoft,
            tag = "Lucidbeatz",
            waveType = SynthWaveType.CHORD_PAD,
            baseFrequencies = listOf(216f, 432f, 864f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(216f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(432f, 1500, 0.95f, SynthWaveType.BELL_HARMONIC),
                ToneStep(864f, 1500, 0.8f, SynthWaveType.CHORD_PAD),
                ToneStep(216f, 1500, 0.85f, SynthWaveType.CHORD_PAD)
            )
        ),
        SoundPad(
            id = "lucidbeatz_memory",
            title = "Lucidbeatz · Memories",
            subtitle = "Alchemical 432Hz Wave",
            narrationText = "Deep nostalgic melodies infused with 432Hz harmonic sacred tuning.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🕯️",
            durationMs = 6000L,
            glowColor = AlchemicalGold,
            tag = "Lucidbeatz",
            waveType = SynthWaveType.BELL_HARMONIC,
            baseFrequencies = listOf(432f, 648f, 864f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(432f, 1500, 0.9f, SynthWaveType.BELL_HARMONIC),
                ToneStep(648f, 1500, 0.85f, SynthWaveType.CHORD_PAD),
                ToneStep(864f, 1500, 0.8f, SynthWaveType.BELL_HARMONIC),
                ToneStep(432f, 1500, 0.95f, SynthWaveType.BELL_HARMONIC)
            )
        ),
        SoundPad(
            id = "willow_kayne_two_seater",
            title = "Willow Kayne · Two Seater",
            subtitle = "Cyberpunk Bass Velocity",
            narrationText = "Punchy UK breakbeats and gritty high-velocity electronic attitude.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🏎️",
            durationMs = 5000L,
            glowColor = CrimsonAlert,
            tag = "Willow Kayne",
            waveType = SynthWaveType.SUB_BASS_808,
            baseFrequencies = listOf(65f, 130f, 260f, 520f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(65f, 1250, 1.0f, SynthWaveType.SUB_BASS_808),
                ToneStep(130f, 1250, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(260f, 1250, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(520f, 1250, 0.85f, SynthWaveType.ARPEGGIATOR)
            )
        ),
        SoundPad(
            id = "willow_kayne_opinion",
            title = "Willow Kayne · Opinion",
            subtitle = "UK Cyber Alt-Pop Hook",
            narrationText = "Distorted synthesizer hooks and energetic rebellious vocal cadence.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🔥",
            durationMs = 5000L,
            glowColor = SovereignPurple,
            tag = "Willow Kayne",
            waveType = SynthWaveType.FM_VOICE,
            baseFrequencies = listOf(140f, 280f, 560f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(140f, 1250, 0.9f, SynthWaveType.FM_VOICE),
                ToneStep(280f, 1250, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(560f, 1250, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(140f, 1250, 1.0f, SynthWaveType.SUB_BASS_808)
            )
        ),
        SoundPad(
            id = "willow_kayne_white_city",
            title = "Willow Kayne · White City",
            subtitle = "Glitch Electronic Groove",
            narrationText = "Crisp digital clipping and futuristic cyberpunk bass groove.",
            category = SoundCategory.AMBIENT_SYNTH,
            icon = "🏙️",
            durationMs = 5000L,
            glowColor = CyanNeon,
            tag = "Willow Kayne",
            waveType = SynthWaveType.ARPEGGIATOR,
            baseFrequencies = listOf(110f, 220f, 440f, 880f),
            isAmbientLoopable = true,
            toneSteps = listOf(
                ToneStep(110f, 1250, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(220f, 1250, 0.9f, SynthWaveType.CHORD_PAD),
                ToneStep(440f, 1250, 0.95f, SynthWaveType.ARPEGGIATOR),
                ToneStep(880f, 1250, 0.85f, SynthWaveType.CHORD_PAD)
            )
        )
    )

    val MUSIC_DROP_PADS = listOf(
        SoundPad(
            id = "music_ivoxygen_casino143",
            title = "Ivoxygen · Casino 143",
            subtitle = "Darkwave / Alt-Phonk",
            narrationText = "Hypnotic darkwave groove with distorted vocal cadence.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🎲",
            durationMs = 6000L,
            glowColor = AlchemicalGold,
            tag = "Ivoxygen",
            assetPath = "audio/music/ivoxygen-casino143.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.SUB_BASS_808
        ),
        SoundPad(
            id = "music_ivoxygen_ghost",
            title = "Ivoxygen · Ghost",
            subtitle = "Melodic Cyberwave",
            narrationText = "Ethereal synth hooks and ambient nocturnal textures.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "👻",
            durationMs = 6000L,
            glowColor = CyanNeon,
            tag = "Ivoxygen",
            assetPath = "audio/music/ivoxygen-ghost.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.CHORD_PAD
        ),
        SoundPad(
            id = "music_ivoxygen_skate",
            title = "Ivoxygen · Skate",
            subtitle = "Heavy Drift / Bass",
            narrationText = "Kinetic rhythm with sliding sub-bass drive.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🛹",
            durationMs = 6000L,
            glowColor = CyanSoft,
            tag = "Ivoxygen",
            assetPath = "audio/music/ivoxygen-skate.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.SUB_BASS_808
        ),
        SoundPad(
            id = "music_lucidbeatz_drift",
            title = "Lucidbeatz · Drift",
            subtitle = "Atmospheric Drift Phonk",
            narrationText = "Heavy 808 saturation and pitched phonk chords.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🏎️",
            durationMs = 6000L,
            glowColor = CrimsonAlert,
            tag = "Lucidbeatz",
            assetPath = "audio/music/lucidbeatz-drift.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.SUB_BASS_808
        ),
        SoundPad(
            id = "music_lucidbeatz_memory",
            title = "Lucidbeatz · Memory",
            subtitle = "Nostalgic Cyber Phonk",
            narrationText = "Reverb-drenched synth bells and rolling hi-hats.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "💾",
            durationMs = 6000L,
            glowColor = PurpleSoft,
            tag = "Lucidbeatz",
            assetPath = "audio/music/lucidbeatz-memory.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.BELL_HARMONIC
        ),
        SoundPad(
            id = "music_lucidbeatz_shadows",
            title = "Lucidbeatz · Shadows",
            subtitle = "Midnight Cyber Bass",
            narrationText = "Dark low-end resonance and punchy transient kick.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🌑",
            durationMs = 6000L,
            glowColor = SovereignPurple,
            tag = "Lucidbeatz",
            assetPath = "audio/music/lucidbeatz-shadows.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.SUB_BASS_808
        ),
        SoundPad(
            id = "music_willow_kayne_opinion",
            title = "Willow Kayne · Opinion",
            subtitle = "UK Cyber Alt-Pop",
            narrationText = "Distorted synthesizer hooks and rebellious cadence.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "⚡",
            durationMs = 6000L,
            glowColor = GoldAccent,
            tag = "Willow Kayne",
            assetPath = "audio/music/willow-kayne-opinion.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.FM_VOICE
        ),
        SoundPad(
            id = "music_willow_kayne_twoseater",
            title = "Willow Kayne · Two Seater",
            subtitle = "High-Energy Kinetic Pop",
            narrationText = "Rapid arpeggiated bass and punchy energetic lead.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🏎️",
            durationMs = 6000L,
            glowColor = CyanNeon,
            tag = "Willow Kayne",
            assetPath = "audio/music/willow-kayne-two-seater.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.ARPEGGIATOR
        ),
        SoundPad(
            id = "music_willow_kayne_whitecity",
            title = "Willow Kayne · White City",
            subtitle = "Urban Dystopia Groove",
            narrationText = "Crisp digital clipping and futuristic cyberpunk bass groove.",
            category = SoundCategory.MUSIC_DROPS,
            icon = "🏙️",
            durationMs = 6000L,
            glowColor = EmeraldOnline,
            tag = "Willow Kayne",
            assetPath = "audio/music/willow-kayne-white-city.mp3",
            isAmbientLoopable = true,
            waveType = SynthWaveType.CHORD_PAD
        )
    )

    val ALL_PADS = AGENT_VOICE_PADS + SWARM_SFX_PADS + AMBIENT_SYNTH_PADS + MUSIC_DROP_PADS

    fun getPadById(id: String): SoundPad? = ALL_PADS.find { it.id == id }

    fun getPadsByCategory(category: SoundCategory): List<SoundPad> {
        return when (category) {
            SoundCategory.ALL -> ALL_PADS
            SoundCategory.AGENT_VOICES -> AGENT_VOICE_PADS
            SoundCategory.SWARM_SFX -> SWARM_SFX_PADS
            SoundCategory.AMBIENT_SYNTH -> AMBIENT_SYNTH_PADS
            SoundCategory.MUSIC_DROPS -> MUSIC_DROP_PADS
        }
    }
}
