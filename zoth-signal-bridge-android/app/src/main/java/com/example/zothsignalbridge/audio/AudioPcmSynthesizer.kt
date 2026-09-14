package com.example.zothsignalbridge.audio

import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin
import kotlin.math.sqrt
import kotlin.math.tanh
import kotlin.random.Random

object AudioPcmSynthesizer {

    const val SAMPLE_RATE: Int = 44100
    private const val TWO_PI: Double = 2.0 * PI

    /**
     * Synthesizes a 16-bit mono Little-Endian PCM ByteArray for the given SoundPad.
     */
    fun synthesizePad(
        pad: SoundPad,
        reverb: Boolean = true,
        bassBoost: Boolean = true,
        masterVolume: Float = 1.0f
    ): ByteArray {
        val totalSamples = ((pad.durationMs / 1000.0) * SAMPLE_RATE).toInt().coerceAtLeast(SAMPLE_RATE / 4)
        val rawBuffer = DoubleArray(totalSamples)

        if (pad.toneSteps.isNotEmpty()) {
            var currentSampleOffset = 0
            for (step in pad.toneSteps) {
                val stepSamples = ((step.durationMs / 1000.0) * SAMPLE_RATE).toInt()
                val targetEnd = min(totalSamples, currentSampleOffset + stepSamples)

                renderToneStep(
                    buffer = rawBuffer,
                    startSample = currentSampleOffset,
                    endSample = targetEnd,
                    frequency = step.frequencyHz,
                    waveType = step.waveType,
                    volume = step.volume
                )
                currentSampleOffset = targetEnd
                if (currentSampleOffset >= totalSamples) break
            }
        } else {
            // Render from base frequencies
            val baseFreq = pad.baseFrequencies.firstOrNull() ?: 440f
            renderToneStep(
                buffer = rawBuffer,
                startSample = 0,
                endSample = totalSamples,
                frequency = baseFreq,
                waveType = pad.waveType,
                volume = 1.0f
            )
        }

        // Apply Bass Boost if enabled
        if (bassBoost) {
            applyBassBoost(rawBuffer)
        }

        // Apply Cyber Reverb / Echo Matrix if enabled
        if (reverb) {
            applyReverbMatrix(rawBuffer)
        }

        // Convert double array to 16-bit Little-Endian PCM byte array with soft saturation
        val pcmBytes = ByteArray(totalSamples * 2)
        val clampedVolume = masterVolume.coerceIn(0.0f, 1.0f).toDouble()

        for (i in 0 until totalSamples) {
            // Soft clipping using hyperbolic tangent to avoid harsh digital distortion
            val saturated = tanh(rawBuffer[i] * clampedVolume * 0.95)
            val sample16 = (saturated * 32767.0).toInt().coerceIn(-32768, 32767).toShort()

            val byteIndex = i * 2
            pcmBytes[byteIndex] = (sample16.toInt() and 0xFF).toByte()
            pcmBytes[byteIndex + 1] = ((sample16.toInt() shr 8) and 0xFF).toByte()
        }

        return pcmBytes
    }

    private fun renderToneStep(
        buffer: DoubleArray,
        startSample: Int,
        endSample: Int,
        frequency: Float,
        waveType: SynthWaveType,
        volume: Float
    ) {
        val count = endSample - startSample
        if (count <= 0) return

        var phase = 0.0
        val phaseIncrement = (TWO_PI * frequency) / SAMPLE_RATE

        for (i in 0 until count) {
            val globalIdx = startSample + i
            if (globalIdx >= buffer.size) break

            val t = i.toDouble() / SAMPLE_RATE
            val progress = i.toDouble() / count

            // ADSR Envelope
            val envelope = calculateAdsrEnvelope(progress, t, waveType)
            val sampleVal = generateWaveSample(phase, t, frequency, waveType) * volume * envelope

            buffer[globalIdx] += sampleVal

            phase += phaseIncrement
            if (phase >= TWO_PI) {
                phase -= TWO_PI
            }
        }
    }

    private fun generateWaveSample(
        phase: Double,
        t: Double,
        frequency: Float,
        waveType: SynthWaveType
    ): Double {
        return when (waveType) {
            SynthWaveType.SINE -> sin(phase)

            SynthWaveType.SQUARE -> {
                if (sin(phase) >= 0.0) 0.75 else -0.75
            }

            SynthWaveType.SAWTOOTH -> {
                2.0 * (phase / TWO_PI - floor(phase / TWO_PI + 0.5))
            }

            SynthWaveType.TRIANGLE -> {
                2.0 * abs(2.0 * (phase / TWO_PI - floor(phase / TWO_PI + 0.5))) - 1.0
            }

            SynthWaveType.FM_VOICE -> {
                // Cyberpunk FM Vocoder / Robot voice modulator (Modulator at 3.5x carrier)
                val modPhase = phase * 3.5
                val modIndex = 2.8 * (1.0 + 0.5 * sin(TWO_PI * 4.0 * t))
                sin(phase + modIndex * sin(modPhase))
            }

            SynthWaveType.CHORD_PAD -> {
                // Ethereal Lush Major/Minor Harmonics (Root + Minor 3rd/Major 3rd + 5th + Octave)
                val f1 = sin(phase)
                val f2 = 0.6 * sin(phase * 1.2599) // Major third ratio
                val f3 = 0.5 * sin(phase * 1.4983) // Perfect fifth ratio
                val f4 = 0.3 * sin(phase * 2.0)    // Octave
                (f1 + f2 + f3 + f4) * 0.45
            }

            SynthWaveType.NOISE_BURST -> {
                // White noise burst with cyber resonant filter simulation
                val noise = Random.nextDouble(-0.9, 0.9)
                val resonantSweep = sin(phase * 1.5) * 0.4
                noise * 0.7 + resonantSweep
            }

            SynthWaveType.BELL_HARMONIC -> {
                // Solfeggio / Hermetic Alchemical Singing Bell
                val strike = sin(phase) * exp(-1.2 * t)
                val overtone1 = 0.5 * sin(phase * 2.76) * exp(-2.5 * t)
                val overtone2 = 0.25 * sin(phase * 5.40) * exp(-4.0 * t)
                strike + overtone1 + overtone2
            }

            SynthWaveType.ARPEGGIATOR -> {
                // Rapid 16th-note pulse saw
                val saw = 2.0 * (phase / TWO_PI - floor(phase / TWO_PI + 0.5))
                val pulseMod = if (sin(TWO_PI * 8.0 * t) > 0.0) 1.0 else 0.4
                saw * pulseMod
            }

            SynthWaveType.SUB_BASS_808 -> {
                // Deep Analog 808 Kick / Sub-bass with exponential pitch drop
                val pitchEnvelopeFreq = frequency * exp(-3.0 * t) + 40.0
                val subPhase = TWO_PI * pitchEnvelopeFreq * t
                val rawSine = sin(subPhase)
                tanh(1.8 * rawSine) // Analog saturation
            }
        }
    }

    private fun calculateAdsrEnvelope(progress: Double, t: Double, waveType: SynthWaveType): Double {
        return when (waveType) {
            SynthWaveType.BELL_HARMONIC -> {
                // Fast attack (10ms) and natural exponential decay
                val attack = min(1.0, t / 0.015)
                val decay = exp(-1.5 * t)
                attack * decay
            }
            SynthWaveType.NOISE_BURST -> {
                val attack = min(1.0, t / 0.005)
                val decay = exp(-4.0 * t)
                attack * decay
            }
            SynthWaveType.SUB_BASS_808 -> {
                val attack = min(1.0, t / 0.008)
                val decay = exp(-2.2 * t)
                attack * decay
            }
            SynthWaveType.CHORD_PAD -> {
                // Soft swelling attack (80ms) and gentle tail
                val attack = min(1.0, t / 0.08)
                val release = if (progress > 0.85) (1.0 - progress) / 0.15 else 1.0
                attack * release
            }
            else -> {
                // Standard musical envelope
                val attack = min(1.0, t / 0.02)
                val release = if (progress > 0.9) (1.0 - progress) / 0.1 else 1.0
                attack * release
            }
        }
    }

    private fun applyReverbMatrix(buffer: DoubleArray) {
        val delaySamples1 = (SAMPLE_RATE * 0.068).toInt() // 68ms delay
        val delaySamples2 = (SAMPLE_RATE * 0.125).toInt() // 125ms delay
        val feedback1 = 0.35
        val feedback2 = 0.22

        for (i in delaySamples1 until buffer.size) {
            buffer[i] += buffer[i - delaySamples1] * feedback1
        }
        for (i in delaySamples2 until buffer.size) {
            buffer[i] += buffer[i - delaySamples2] * feedback2
        }
    }

    private fun applyBassBoost(buffer: DoubleArray) {
        // Simple 1-pole low pass filter accumulator added to lower register
        var lastSample = 0.0
        val alpha = 0.15 // Low cutoff
        for (i in buffer.indices) {
            lastSample = lastSample + alpha * (buffer[i] - lastSample)
            buffer[i] += lastSample * 0.6
        }
    }

    /**
     * Analyzes PCM bytes and generates normalized amplitude bands for Compose animations.
     */
    fun extractWaveformBands(pcm: ByteArray, numBands: Int = 16): List<Float> {
        val totalShorts = pcm.size / 2
        if (totalShorts == 0) return List(numBands) { 0.05f }

        val chunkSize = max(1, totalShorts / numBands)
        val bands = ArrayList<Float>(numBands)

        for (b in 0 until numBands) {
            val start = b * chunkSize
            val end = min(totalShorts, start + chunkSize)
            var sumSquares = 0.0
            var count = 0

            for (i in start until end) {
                val byteIdx = i * 2
                if (byteIdx + 1 < pcm.size) {
                    val lo = pcm[byteIdx].toInt() and 0xFF
                    val hi = pcm[byteIdx + 1].toInt()
                    val sample = (hi shl 8) or lo
                    sumSquares += sample.toDouble() * sample.toDouble()
                    count++
                }
            }

            val rms = if (count > 0) sqrt(sumSquares / count) else 0.0
            val normalized = (rms / 22000.0).toFloat().coerceIn(0.05f, 1.0f)
            bands.add(normalized)
        }

        while (bands.size < numBands) {
            bands.add(0.05f)
        }
        return bands
    }
}
