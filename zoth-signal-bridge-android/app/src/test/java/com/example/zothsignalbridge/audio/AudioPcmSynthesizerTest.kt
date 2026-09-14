package com.example.zothsignalbridge.audio

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class AudioPcmSynthesizerTest {

    @Test
    fun testSynthesizeAllCatalogPads() {
        for (pad in SoundboardCatalog.ALL_PADS) {
            val pcm = AudioPcmSynthesizer.synthesizePad(
                pad = pad,
                reverb = true,
                bassBoost = true,
                masterVolume = 1.0f
            )
            assertNotNull(pcm)
            assertTrue("PCM buffer for ${pad.id} must not be empty", pcm.isNotEmpty())
            assertTrue("PCM buffer size must be even for 16-bit audio", pcm.size % 2 == 0)

            val totalSamples = pcm.size / 2
            val minExpectedSamples = (AudioPcmSynthesizer.SAMPLE_RATE * 0.25).toInt()
            assertTrue(
                "Sample count for ${pad.id} ($totalSamples) should be >= $minExpectedSamples",
                totalSamples >= minExpectedSamples
            )
        }
    }

    @Test
    fun testWaveformBandsExtraction() {
        val pad = SoundboardCatalog.AGENT_VOICE_PADS.first()
        val pcm = AudioPcmSynthesizer.synthesizePad(pad)
        val bands = AudioPcmSynthesizer.extractWaveformBands(pcm, 16)

        assertEquals(16, bands.size)
        for (b in bands) {
            assertTrue("Band amplitude $b must be between 0.05 and 1.0", b in 0.05f..1.0f)
        }
    }

    @Test
    fun testVolumeScaling() {
        val pad = SoundboardCatalog.SWARM_SFX_PADS.first()
        val pcmFull = AudioPcmSynthesizer.synthesizePad(pad, masterVolume = 1.0f)
        val pcmQuiet = AudioPcmSynthesizer.synthesizePad(pad, masterVolume = 0.1f)
        val pcmMute = AudioPcmSynthesizer.synthesizePad(pad, masterVolume = 0.0f)

        assertNotNull(pcmFull)
        assertNotNull(pcmQuiet)
        assertNotNull(pcmMute)
        assertEquals(pcmFull.size, pcmQuiet.size)
        assertEquals(pcmFull.size, pcmMute.size)
    }

    @Test
    fun testDspToggles() {
        val pad = SoundboardCatalog.AMBIENT_SYNTH_PADS.first()
        val pcmDry = AudioPcmSynthesizer.synthesizePad(pad, reverb = false, bassBoost = false)
        val pcmWet = AudioPcmSynthesizer.synthesizePad(pad, reverb = true, bassBoost = true)

        assertNotNull(pcmDry)
        assertNotNull(pcmWet)
        assertEquals(pcmDry.size, pcmWet.size)
    }
}
