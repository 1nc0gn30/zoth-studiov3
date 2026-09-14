package com.example.zothsignalbridge.data.repository

import com.example.zothsignalbridge.data.models.SoundCategory
import com.example.zothsignalbridge.data.models.SoundEffect

object SoundboardDataProvider {

    fun getInitialSounds(): List<SoundEffect> = listOf(
        SoundEffect(
            id = "sfx-01",
            name = "Swarm Boot Sequence",
            category = SoundCategory.SWARM_EVENTS,
            icon = "⚡",
            durationMs = 1200L,
            description = "Initializes WireGuard tunnel and broadcasts handshake across 21 swarm nodes",
            hapticPattern = "Double-Pulse Sharp"
        ),
        SoundEffect(
            id = "sfx-02",
            name = "Merkle AST Verified",
            category = SoundCategory.ALCHEMY,
            icon = "🔒",
            durationMs = 850L,
            description = "Triangulated root hash validated across all 3 independent parsers",
            hapticPattern = "Single-Thud Solid"
        ),
        SoundEffect(
            id = "sfx-03",
            name = "Consensus Quorum Achieved",
            category = SoundCategory.SWARM_EVENTS,
            icon = "⚖️",
            durationMs = 1500L,
            description = "2/3 supermajority stake vote passed (>66.7% BFT threshold)",
            hapticPattern = "Harmonic Triple-Tick"
        ),
        SoundEffect(
            id = "sfx-04",
            name = "Threat Alert / Port Scan",
            category = SoundCategory.SYSTEM,
            icon = "🚨",
            durationMs = 1800L,
            description = "Zero-trust anomaly detected outside encrypted WireGuard subnet",
            hapticPattern = "High-Frequency Alarm"
        ),
        SoundEffect(
            id = "sfx-05",
            name = "Alchemical Resonance Peak",
            category = SoundCategory.ALCHEMY,
            icon = "⚗️",
            durationMs = 2000L,
            description = "UI & Hermetic design ratios converged at golden mean",
            hapticPattern = "Resonant Sweep"
        ),
        SoundEffect(
            id = "sfx-06",
            name = "Hermes Tool Loop Executed",
            category = SoundCategory.SWARM_EVENTS,
            icon = "🕊️",
            durationMs = 650L,
            description = "Parrot OS DAG tool pipeline dispatched successfully",
            hapticPattern = "Rapid Click-Step"
        ),
        SoundEffect(
            id = "sfx-07",
            name = "Local Ollama Inference Ready",
            category = SoundCategory.SYSTEM,
            icon = "🦙",
            durationMs = 900L,
            description = "Local neural model computed token with zero cloud egress",
            hapticPattern = "Sub-Bass Tone"
        ),
        SoundEffect(
            id = "sfx-08",
            name = "Pet Companion Level Up",
            category = SoundCategory.FEEDBACK,
            icon = "🐾",
            durationMs = 1400L,
            description = "Neural companion affinity reaches next mastery tier",
            hapticPattern = "Ascending Fanfare"
        ),
        SoundEffect(
            id = "sfx-09",
            name = "WireGuard Handshake Ack",
            category = SoundCategory.FEEDBACK,
            icon = "📡",
            durationMs = 450L,
            description = "Direct mobile-to-workstation UDP WireGuard packet confirmed",
            hapticPattern = "Short Crisp Tap"
        ),
        SoundEffect(
            id = "sfx-10",
            name = "Byzantine Fault Injected",
            category = SoundCategory.SYSTEM,
            icon = "⚠️",
            durationMs = 1100L,
            description = "Simulated malicious validator injected for fault-tolerance stress test",
            hapticPattern = "Stutter Buzz"
        )
    )
}
