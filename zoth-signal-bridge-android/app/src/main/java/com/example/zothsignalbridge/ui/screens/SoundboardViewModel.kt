package com.example.zothsignalbridge.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.zothsignalbridge.audio.PlaybackState
import com.example.zothsignalbridge.audio.SoundCategory
import com.example.zothsignalbridge.audio.SoundPad
import com.example.zothsignalbridge.audio.SoundboardAudioEngine
import com.example.zothsignalbridge.audio.SoundboardCatalog
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

class SoundboardViewModel(
    val audioEngine: SoundboardAudioEngine = SoundboardAudioEngine()
) : ViewModel() {

    val playbackState: StateFlow<PlaybackState> = audioEngine.playbackState

    fun getFilteredPads(): List<SoundPad> {
        val state = playbackState.value
        val byCat = if (state.activeCategory == SoundCategory.ALL) {
            SoundboardCatalog.ALL_PADS
        } else {
            SoundboardCatalog.ALL_PADS.filter { it.category == state.activeCategory }
        }

        return if (state.searchQuery.isBlank()) {
            byCat
        } else {
            val q = state.searchQuery.trim().lowercase()
            byCat.filter {
                it.title.lowercase().contains(q) ||
                it.subtitle.lowercase().contains(q) ||
                it.narrationText.lowercase().contains(q) ||
                it.tag.lowercase().contains(q)
            }
        }
    }

    val filteredPads: StateFlow<List<SoundPad>> = playbackState
        .combine(MutableStateFlow(SoundboardCatalog.ALL_PADS)) { state, allPads ->
            val byCat = if (state.activeCategory == SoundCategory.ALL) {
                allPads
            } else {
                allPads.filter { it.category == state.activeCategory }
            }

            if (state.searchQuery.isBlank()) {
                byCat
            } else {
                val q = state.searchQuery.trim().lowercase()
                byCat.filter {
                    it.title.lowercase().contains(q) ||
                    it.subtitle.lowercase().contains(q) ||
                    it.narrationText.lowercase().contains(q) ||
                    it.tag.lowercase().contains(q)
                }
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.Eagerly,
            initialValue = SoundboardCatalog.ALL_PADS
        )

    fun togglePlayPad(pad: SoundPad) {
        val currentState = playbackState.value
        if (currentState.isPlaying && currentState.activePadId == pad.id) {
            audioEngine.stopAll()
        } else {
            audioEngine.playSound(pad)
        }
    }

    fun playSound(pad: SoundPad) {
        audioEngine.playSound(pad)
    }

    fun stopAll() {
        audioEngine.stopAll()
    }

    fun setVolume(volume: Float) {
        audioEngine.setVolume(volume)
    }

    fun toggleMute() {
        audioEngine.toggleMute()
    }

    fun toggleLoop() {
        audioEngine.toggleLoop()
    }

    fun selectCategory(category: SoundCategory) {
        audioEngine.selectCategory(category)
    }

    fun setSearchQuery(query: String) {
        audioEngine.setSearchQuery(query)
    }

    fun toggleReverb() {
        audioEngine.toggleReverb()
    }

    fun toggleBassBoost() {
        audioEngine.toggleBassBoost()
    }

    override fun onCleared() {
        super.onCleared()
        audioEngine.release()
    }
}
