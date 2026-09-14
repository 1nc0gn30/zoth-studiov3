package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.SoundCategory
import com.example.zothsignalbridge.data.repository.SoundboardDataProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SoundboardCatalogTest {

    @Test
    fun testSoundboardEffectsCatalog() {
        val sounds = SoundboardDataProvider.getInitialSounds()
        assertTrue(sounds.size >= 10)

        val bootSound = sounds.find { it.id == "sfx-01" }
        assertNotNull(bootSound)
        assertEquals("Swarm Boot Sequence", bootSound?.name)
        assertEquals(SoundCategory.SWARM_EVENTS, bootSound?.category)
        assertTrue(bootSound?.durationMs ?: 0L > 0L)
    }

    @Test
    fun testSoundCategoriesDistribution() {
        val sounds = SoundboardDataProvider.getInitialSounds()

        val eventSounds = sounds.filter { it.category == SoundCategory.SWARM_EVENTS }
        val alchemySounds = sounds.filter { it.category == SoundCategory.ALCHEMY }
        val systemSounds = sounds.filter { it.category == SoundCategory.SYSTEM }
        val feedbackSounds = sounds.filter { it.category == SoundCategory.FEEDBACK }

        assertTrue(eventSounds.isNotEmpty())
        assertTrue(alchemySounds.isNotEmpty())
        assertTrue(systemSounds.isNotEmpty())
        assertTrue(feedbackSounds.isNotEmpty())
    }
}
