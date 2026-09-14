package com.example.zothsignalbridge.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.media.ToneGenerator
import android.os.Build
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.sin

class SoundboardAudioEngine(
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Default)
) {

    private val _playbackState = MutableStateFlow(PlaybackState())
    val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    // Cache of pre-synthesized PCM buffers for zero-latency instant response
    private val pcmCache = ConcurrentHashMap<String, ByteArray>()
    private val waveformCache = ConcurrentHashMap<String, List<Float>>()

    private var activeAudioTrack: AudioTrack? = null
    private var activeToneGenerator: ToneGenerator? = null
    private var playbackJob: Job? = null

    init {
        // Pre-warm synthesizer cache in background coroutine
        scope.launch {
            preWarmCache()
        }
    }

    private fun preWarmCache() {
        for (pad in SoundboardCatalog.ALL_PADS) {
            if (!pcmCache.containsKey(pad.id)) {
                val pcm = AudioPcmSynthesizer.synthesizePad(
                    pad = pad,
                    reverb = _playbackState.value.reverbEnabled,
                    bassBoost = _playbackState.value.bassBoostEnabled,
                    masterVolume = 1.0f
                )
                pcmCache[pad.id] = pcm
                waveformCache[pad.id] = AudioPcmSynthesizer.extractWaveformBands(pcm, 16)
            }
        }
    }

    /**
     * Plays the specified SoundPad immediately with zero-latency synthesized audio.
     */
    fun playSound(pad: SoundPad) {
        // Stop current sound first
        stopAudioInternal()

        val isLooping = _playbackState.value.isLooping
        val isMuted = _playbackState.value.isMuted
        val volume = if (isMuted) 0.0f else _playbackState.value.volume

        // Get or generate PCM buffer
        val pcm = pcmCache.getOrPut(pad.id) {
            AudioPcmSynthesizer.synthesizePad(
                pad = pad,
                reverb = _playbackState.value.reverbEnabled,
                bassBoost = _playbackState.value.bassBoostEnabled,
                masterVolume = 1.0f
            )
        }
        val staticWaveform = waveformCache.getOrPut(pad.id) {
            AudioPcmSynthesizer.extractWaveformBands(pcm, 16)
        }

        _playbackState.value = _playbackState.value.copy(
            isPlaying = true,
            activePadId = pad.id,
            progress = 0f,
            currentAmplitude = 0.8f,
            waveformBands = staticWaveform
        )

        playbackJob = scope.launch {
            var loopActive = true
            while (isActive && loopActive) {
                val started = playPcmBuffer(pcm, volume)
                if (!started) {
                    // Fallback to tone sequence or simulation
                    playFallbackTone(pad)
                }

                // Animate progress and waveform bars while playing
                val duration = pad.durationMs
                val startTime = System.currentTimeMillis()
                while (isActive) {
                    val elapsed = System.currentTimeMillis() - startTime
                    val progress = (elapsed.toFloat() / duration).coerceIn(0f, 1f)
                    
                    // Dynamic live oscillating waveform modulation
                    val t = elapsed / 1000.0
                    val liveBands = staticWaveform.mapIndexed { idx, baseAmp ->
                        val mod = (0.5 + 0.5 * sin(t * 12.0 + idx * 0.4)).toFloat()
                        (baseAmp * (0.4f + 0.6f * mod) * if (isMuted) 0f else 1f).coerceIn(0.05f, 1f)
                    }

                    _playbackState.value = _playbackState.value.copy(
                        progress = progress,
                        currentAmplitude = liveBands.maxOrNull() ?: 0.5f,
                        waveformBands = liveBands
                    )

                    if (elapsed >= duration) break
                    delay(30)
                }

                loopActive = _playbackState.value.isLooping || pad.isAmbientLoopable
                if (!loopActive) break
            }

            // Finished playback
            _playbackState.value = _playbackState.value.copy(
                isPlaying = false,
                activePadId = null,
                progress = 0f,
                currentAmplitude = 0f,
                waveformBands = List(16) { 0.05f }
            )
        }
    }

    private fun playPcmBuffer(pcm: ByteArray, volume: Float): Boolean {
        return try {
            val minBufferSize = AudioTrack.getMinBufferSize(
                AudioPcmSynthesizer.SAMPLE_RATE,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            ).coerceAtLeast(pcm.size)

            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()

            val audioFormat = AudioFormat.Builder()
                .setSampleRate(AudioPcmSynthesizer.SAMPLE_RATE)
                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                .build()

            val track = AudioTrack.Builder()
                .setAudioAttributes(audioAttributes)
                .setAudioFormat(audioFormat)
                .setBufferSizeInBytes(minBufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
                .build()

            track.setVolume(volume)
            track.play()
            track.write(pcm, 0, pcm.size)
            activeAudioTrack = track
            true
        } catch (e: Throwable) {
            // In JVM unit test environment or unsupported hardware
            false
        }
    }

    private fun playFallbackTone(pad: SoundPad) {
        try {
            val toneGen = ToneGenerator(AudioManager.STREAM_MUSIC, (_playbackState.value.volume * 100).toInt())
            activeToneGenerator = toneGen
            val toneType = when (pad.category) {
                SoundCategory.AGENT_VOICES -> ToneGenerator.TONE_PROP_BEEP
                SoundCategory.SWARM_SFX -> ToneGenerator.TONE_PROP_ACK
                SoundCategory.AMBIENT_SYNTH -> ToneGenerator.TONE_PROP_PROMPT
                else -> ToneGenerator.TONE_PROP_BEEP
            }
            toneGen.startTone(toneType, pad.durationMs.toInt().coerceAtMost(3000))
        } catch (e: Throwable) {
            // Ignored in headless JVM
        }
    }

    /**
     * Stops all active audio and resets playback state.
     */
    fun stopAll() {
        stopAudioInternal()
        _playbackState.value = _playbackState.value.copy(
            isPlaying = false,
            activePadId = null,
            progress = 0f,
            currentAmplitude = 0f,
            waveformBands = List(16) { 0.05f }
        )
    }

    private fun stopAudioInternal() {
        playbackJob?.cancel()
        playbackJob = null

        try {
            activeAudioTrack?.stop()
            activeAudioTrack?.release()
        } catch (ignored: Throwable) {}
        activeAudioTrack = null

        try {
            activeToneGenerator?.stopTone()
            activeToneGenerator?.release()
        } catch (ignored: Throwable) {}
        activeToneGenerator = null
    }

    fun setVolume(volume: Float) {
        val clamped = volume.coerceIn(0.0f, 1.0f)
        _playbackState.value = _playbackState.value.copy(volume = clamped)
        try {
            val effectiveVol = if (_playbackState.value.isMuted) 0f else clamped
            activeAudioTrack?.setVolume(effectiveVol)
        } catch (ignored: Throwable) {}
    }

    fun toggleMute() {
        val newMuted = !_playbackState.value.isMuted
        _playbackState.value = _playbackState.value.copy(isMuted = newMuted)
        try {
            val effectiveVol = if (newMuted) 0f else _playbackState.value.volume
            activeAudioTrack?.setVolume(effectiveVol)
        } catch (ignored: Throwable) {}
    }

    fun toggleLoop() {
        _playbackState.value = _playbackState.value.copy(isLooping = !_playbackState.value.isLooping)
    }

    fun selectCategory(category: SoundCategory) {
        _playbackState.value = _playbackState.value.copy(activeCategory = category)
    }

    fun setSearchQuery(query: String) {
        _playbackState.value = _playbackState.value.copy(searchQuery = query)
    }

    fun toggleReverb() {
        val newReverb = !_playbackState.value.reverbEnabled
        _playbackState.value = _playbackState.value.copy(reverbEnabled = newReverb)
        pcmCache.clear()
        scope.launch { preWarmCache() }
    }

    fun toggleBassBoost() {
        val newBass = !_playbackState.value.bassBoostEnabled
        _playbackState.value = _playbackState.value.copy(bassBoostEnabled = newBass)
        pcmCache.clear()
        scope.launch { preWarmCache() }
    }

    fun release() {
        stopAudioInternal()
    }
}
