package com.example.zothsignalbridge.audio

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SoundboardCatalogTest {

    @Test
    fun testCatalogContainsRequiredCategories() {
        val agentVoices = SoundboardCatalog.getPadsByCategory(SoundCategory.AGENT_VOICES)
        val swarmSfx = SoundboardCatalog.getPadsByCategory(SoundCategory.SWARM_SFX)
        val ambientSynth = SoundboardCatalog.getPadsByCategory(SoundCategory.AMBIENT_SYNTH)
        val musicDrops = SoundboardCatalog.getPadsByCategory(SoundCategory.MUSIC_DROPS)
        val allSounds = SoundboardCatalog.getPadsByCategory(SoundCategory.ALL)

        assertTrue("Agent voices must not be empty", agentVoices.isNotEmpty())
        assertTrue("Swarm SFX must not be empty", swarmSfx.isNotEmpty())
        assertTrue("Ambient synth must not be empty", ambientSynth.isNotEmpty())
        assertTrue("Music drops must not be empty", musicDrops.isNotEmpty())
        assertEquals(allSounds.size, agentVoices.size + swarmSfx.size + ambientSynth.size + musicDrops.size)
    }

    @Test
    fun testRequiredAgentVoiceDropsPresent() {
        val agy = SoundboardCatalog.getPadById("voice_antigravity")
        val azoth = SoundboardCatalog.getPadById("voice_azoth")
        val grok = SoundboardCatalog.getPadById("voice_grok")
        val hermes = SoundboardCatalog.getPadById("voice_hermes")

        assertNotNull("Antigravity voice drop must exist", agy)
        assertNotNull("Azoth voice drop must exist", azoth)
        assertNotNull("Grok voice drop must exist", grok)
        assertNotNull("Hermes voice drop must exist", hermes)

        assertTrue(agy!!.narrationText.contains("Antigravity core online", ignoreCase = true))
        assertTrue(azoth!!.narrationText.contains("Solve et Coagula", ignoreCase = true))
        assertTrue(grok!!.narrationText.contains("Warp vector", ignoreCase = true))
        assertTrue(hermes!!.narrationText.contains("WireGuard mesh", ignoreCase = true))
    }

    @Test
    fun testRequiredSwarmSfxPresent() {
        val quorum = SoundboardCatalog.getPadById("sfx_quorum_achieved")
        val byzantine = SoundboardCatalog.getPadById("sfx_byzantine_alert")
        val ast = SoundboardCatalog.getPadById("sfx_ast_verified")

        assertNotNull("Quorum Achieved SFX must exist", quorum)
        assertNotNull("Byzantine Alert SFX must exist", byzantine)
        assertNotNull("AST Verified SFX must exist", ast)

        assertEquals("Quorum Achieved", quorum!!.title)
        assertEquals("Byzantine Alert", byzantine!!.title)
        assertEquals("AST Verified", ast!!.title)
    }

    @Test
    fun testAmbientSynthTracks() {
        val ambientPads = SoundboardCatalog.getPadsByCategory(SoundCategory.AMBIENT_SYNTH)
        assertTrue(ambientPads.any { it.id == "ambient_neon_void" })
        assertTrue(ambientPads.any { it.id == "ambient_alchemical_drone" })
        assertTrue(ambientPads.any { it.id == "ambient_sovereign_grid" })
        assertTrue(ambientPads.all { it.isAmbientLoopable })
    }

    @Test
    fun testSoundPadDurations() {
        for (pad in SoundboardCatalog.ALL_PADS) {
            assertTrue("Duration for ${pad.id} must be > 0", pad.durationMs > 0L)
            assertTrue("Duration for ${pad.id} must be reasonable (<= 15s)", pad.durationMs <= 15000L)
        }
    }
}
