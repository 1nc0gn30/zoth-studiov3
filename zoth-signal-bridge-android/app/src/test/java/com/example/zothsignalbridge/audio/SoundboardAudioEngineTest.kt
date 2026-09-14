package com.example.zothsignalbridge.audio

import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SoundboardAudioEngineTest {

    @Test
    fun testAudioEngineStateControls() = runTest {
        val engine = SoundboardAudioEngine()

        engine.setVolume(0.7f)
        assertEquals(0.7f, engine.playbackState.first().volume, 0.01f)

        engine.toggleMute()
        assertTrue(engine.playbackState.first().isMuted)

        engine.toggleMute()
        assertFalse(engine.playbackState.first().isMuted)

        engine.toggleLoop()
        assertTrue(engine.playbackState.first().isLooping)

        engine.selectCategory(SoundCategory.SWARM_SFX)
        assertEquals(SoundCategory.SWARM_SFX, engine.playbackState.first().activeCategory)

        engine.setSearchQuery("quantum")
        assertEquals("quantum", engine.playbackState.first().searchQuery)

        val pad = SoundboardCatalog.SWARM_SFX_PADS.first()
        engine.playSound(pad)
        assertTrue(engine.playbackState.first().isPlaying)
        assertEquals(pad.id, engine.playbackState.first().activePadId)

        engine.stopAll()
        assertFalse(engine.playbackState.first().isPlaying)

        engine.release()
    }
}
