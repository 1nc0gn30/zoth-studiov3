package com.example.zothsignalbridge.ui.screens

import com.example.zothsignalbridge.audio.SoundCategory
import com.example.zothsignalbridge.audio.SoundboardAudioEngine
import com.example.zothsignalbridge.audio.SoundboardCatalog
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SoundboardViewModelTest {

    @Test
    fun testInitialState() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        val state = viewModel.playbackState.first()
        assertFalse(state.isPlaying)
        assertEquals(null, state.activePadId)
        assertEquals(SoundCategory.ALL, state.activeCategory)
        assertEquals(0.85f, state.volume, 0.01f)
        assertFalse(state.isMuted)
        assertFalse(state.isLooping)
        assertTrue(state.reverbEnabled)
        assertTrue(state.bassBoostEnabled)

        val filtered = viewModel.filteredPads.first()
        assertEquals(SoundboardCatalog.ALL_PADS.size, filtered.size)
    }

    @Test
    fun testCategoryFiltering() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        viewModel.selectCategory(SoundCategory.AGENT_VOICES)
        val agentPads = viewModel.getFilteredPads()
        assertEquals(SoundboardCatalog.AGENT_VOICE_PADS.size, agentPads.size)
        assertTrue(agentPads.all { it.category == SoundCategory.AGENT_VOICES })

        viewModel.selectCategory(SoundCategory.SWARM_SFX)
        val sfxPads = viewModel.getFilteredPads()
        assertEquals(SoundboardCatalog.SWARM_SFX_PADS.size, sfxPads.size)
        assertTrue(sfxPads.all { it.category == SoundCategory.SWARM_SFX })

        viewModel.selectCategory(SoundCategory.AMBIENT_SYNTH)
        val ambientPads = viewModel.getFilteredPads()
        assertEquals(SoundboardCatalog.AMBIENT_SYNTH_PADS.size, ambientPads.size)
        assertTrue(ambientPads.all { it.category == SoundCategory.AMBIENT_SYNTH })

        viewModel.selectCategory(SoundCategory.MUSIC_DROPS)
        val musicPads = viewModel.getFilteredPads()
        assertEquals(SoundboardCatalog.MUSIC_DROP_PADS.size, musicPads.size)
        assertTrue(musicPads.all { it.category == SoundCategory.MUSIC_DROPS })
    }

    @Test
    fun testSearchFiltering() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        viewModel.setSearchQuery("antigravity")
        val searchResults = viewModel.getFilteredPads()
        assertTrue(searchResults.isNotEmpty())
        assertTrue(searchResults.all { it.title.contains("antigravity", ignoreCase = true) || it.tag.contains("antigravity", ignoreCase = true) || it.subtitle.contains("antigravity", ignoreCase = true) || it.narrationText.contains("antigravity", ignoreCase = true) })

        viewModel.setSearchQuery("byzantine alert")
        val alertResults = viewModel.getFilteredPads()
        assertEquals(1, alertResults.size)
        assertEquals("sfx_byzantine_alert", alertResults.first().id)
    }

    @Test
    fun testVolumeAndMuteControls() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        viewModel.setVolume(0.5f)
        assertEquals(0.5f, viewModel.playbackState.value.volume, 0.01f)

        viewModel.toggleMute()
        assertTrue(viewModel.playbackState.value.isMuted)

        viewModel.toggleMute()
        assertFalse(viewModel.playbackState.value.isMuted)
    }

    @Test
    fun testLoopToggle() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        viewModel.toggleLoop()
        assertTrue(viewModel.playbackState.value.isLooping)

        viewModel.toggleLoop()
        assertFalse(viewModel.playbackState.value.isLooping)
    }

    @Test
    fun testPlayAndStopPad() = runTest {
        val engine = SoundboardAudioEngine()
        val viewModel = SoundboardViewModel(engine)

        val pad = SoundboardCatalog.AGENT_VOICE_PADS.first()
        viewModel.togglePlayPad(pad)

        val activeState = viewModel.playbackState.value
        assertTrue(activeState.isPlaying)
        assertEquals(pad.id, activeState.activePadId)

        viewModel.stopAll()
        val stoppedState = viewModel.playbackState.value
        assertFalse(stoppedState.isPlaying)
        assertEquals(null, stoppedState.activePadId)
    }
}
