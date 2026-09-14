package com.example.zothsignalbridge.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Equalizer
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.Waves
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.zothsignalbridge.audio.PlaybackState
import com.example.zothsignalbridge.audio.SoundCategory
import com.example.zothsignalbridge.audio.SoundPad
import com.example.zothsignalbridge.audio.SoundboardCatalog
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderNeon
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.GoldAccent
import com.example.zothsignalbridge.theme.PurpleSoft
import com.example.zothsignalbridge.theme.SovereignPurple
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.SurfaceHighlight
import com.example.zothsignalbridge.theme.TextDim
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SoundboardScreen(
    viewModel: SoundboardViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    val playbackState by viewModel.playbackState.collectAsStateWithLifecycle()
    val filteredPads by viewModel.filteredPads.collectAsStateWithLifecycle()
    val haptics = LocalHapticFeedback.current

    var showBottomSheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 100.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            // Header Section
            item(span = { GridItemSpan(2) }) {
                SoundboardHeader(
                    playbackState = playbackState,
                    onOpenControls = { showBottomSheet = true }
                )
            }

            // Real-time Waveform Spectrum Visualizer
            item(span = { GridItemSpan(2) }) {
                WaveformSpectrumBar(
                    bands = playbackState.waveformBands,
                    isPlaying = playbackState.isPlaying,
                    activePadId = playbackState.activePadId
                )
            }

            // Search and Category Tabs
            item(span = { GridItemSpan(2) }) {
                Column {
                    SoundboardSearchBar(
                        query = playbackState.searchQuery,
                        onQueryChange = { viewModel.setSearchQuery(it) }
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    CategoryFilterRow(
                        selectedCategory = playbackState.activeCategory,
                        onCategorySelect = { viewModel.selectCategory(it) }
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                }
            }

            // Grid Items: Sound Pads
            if (filteredPads.isEmpty()) {
                item(span = { GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "🔍", fontSize = 28.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "No sounds match \"${playbackState.searchQuery}\"",
                                fontSize = 13.sp,
                                color = TextMuted,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            } else {
                items(filteredPads, key = { it.id }) { pad ->
                    val isPadActive = playbackState.isPlaying && playbackState.activePadId == pad.id

                    SoundPadButton(
                        pad = pad,
                        isActive = isPadActive,
                        progress = if (isPadActive) playbackState.progress else 0f,
                        isLooping = playbackState.isLooping,
                        onClick = {
                            haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                            viewModel.togglePlayPad(pad)
                        }
                    )
                }
            }
        }

        // Floating Audio Dock Bar at the bottom
        FloatingAudioDeckDock(
            playbackState = playbackState,
            onTogglePlay = {
                haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                val activePad = SoundboardCatalog.getPadById(playbackState.activePadId ?: "")
                if (activePad != null) {
                    viewModel.togglePlayPad(activePad)
                } else if (filteredPads.isNotEmpty()) {
                    viewModel.playSound(filteredPads.first())
                }
            },
            onStopAll = {
                haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                viewModel.stopAll()
            },
            onToggleLoop = {
                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                viewModel.toggleLoop()
            },
            onOpenSheet = {
                showBottomSheet = true
            },
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp)
        )

        // Audio Controls Bottom Sheet
        if (showBottomSheet) {
            ModalBottomSheet(
                onDismissRequest = { showBottomSheet = false },
                sheetState = sheetState,
                containerColor = SurfaceDark,
                contentColor = TextPrimary,
                dragHandle = null,
                shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)
            ) {
                AudioDeckBottomSheetContent(
                    playbackState = playbackState,
                    onVolumeChange = { viewModel.setVolume(it) },
                    onToggleMute = {
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        viewModel.toggleMute()
                    },
                    onToggleLoop = {
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        viewModel.toggleLoop()
                    },
                    onToggleReverb = {
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        viewModel.toggleReverb()
                    },
                    onToggleBassBoost = {
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        viewModel.toggleBassBoost()
                    },
                    onStopAll = {
                        haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                        viewModel.stopAll()
                    },
                    onClose = {
                        scope.launch { sheetState.hide() }.invokeOnCompletion {
                            showBottomSheet = false
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun SoundboardHeader(
    playbackState: PlaybackState,
    onOpenControls: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(14.dp))
            .padding(14.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(SurfaceElevated)
                            .border(1.dp, CyanSoft.copy(alpha = 0.5f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "🎛️", fontSize = 15.sp)
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "CYBERPUNK",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = AlchemicalGold,
                                fontFamily = FontFamily.Monospace,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = " SOUND DECK",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyanSoft,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Text(
                            text = "Zero-Latency Real-Time Audio Synthesizer",
                            fontSize = 10.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Control Button
                IconButton(
                    onClick = onOpenControls,
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(SurfaceElevated)
                        .border(1.dp, BorderNeon, CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.Tune,
                        contentDescription = "Audio Controls",
                        tint = CyanSoft,
                        modifier = Modifier.size(17.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Hardware & Protocol Status Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                DeckStatusBadge(label = "DSP 44.1kHz", isOk = true)
                DeckStatusBadge(label = "Latency: ~4ms", isOk = playbackState.isLowLatencyActive)
                DeckStatusBadge(
                    label = if (playbackState.isLooping) "LOOP: ON" else "LOOP: OFF",
                    isOk = playbackState.isLooping,
                    activeColor = SovereignPurple
                )
                DeckStatusBadge(
                    label = "Vol ${(playbackState.volume * 100).roundToInt()}%",
                    isOk = !playbackState.isMuted,
                    activeColor = AlchemicalGold
                )
            }
        }
    }
}

@Composable
fun DeckStatusBadge(
    label: String,
    isOk: Boolean,
    activeColor: Color = EmeraldOnline
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceElevated)
            .padding(horizontal = 6.dp, vertical = 3.dp)
    ) {
        Box(
            modifier = Modifier
                .size(5.dp)
                .clip(CircleShape)
                .background(if (isOk) activeColor else TextDim)
        )
        Spacer(modifier = Modifier.width(5.dp))
        Text(
            text = label,
            fontSize = 9.5.sp,
            fontWeight = FontWeight.Medium,
            color = TextSecondary,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun WaveformSpectrumBar(
    bands: List<Float>,
    isPlaying: Boolean,
    activePadId: String?
) {
    val infiniteTransition = rememberInfiniteTransition(label = "spectrum_pulse")
    val pulseGlow by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_glow"
    )

    val activePad = SoundboardCatalog.getPadById(activePadId ?: "")
    val primaryColor = activePad?.glowColor ?: CyanNeon

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(
                1.dp,
                if (isPlaying) primaryColor.copy(alpha = 0.5f * pulseGlow) else BorderSubtle,
                RoundedCornerShape(12.dp)
            )
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.GraphicEq,
                        contentDescription = "Spectrum",
                        tint = if (isPlaying) primaryColor else TextMuted,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isPlaying) "OSCILLOSCOPE / ${activePad?.title ?: "TRANSMITTING"}" else "SPECTRUM ANALYZER (STANDBY)",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isPlaying) primaryColor else TextMuted,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Text(
                    text = if (isPlaying) "LIVE 16-BAND PCM" else "0 Hz IDLE",
                    fontSize = 9.sp,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Multi-band Animated Equalizer Bars
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(36.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                bands.forEachIndexed { index, amp ->
                    val effectiveAmp = if (isPlaying) amp else 0.05f
                    val barColor = when {
                        index < 4 -> CyanNeon
                        index < 9 -> SovereignPurple
                        index < 13 -> AlchemicalGold
                        else -> EmeraldOnline
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 1.5.dp)
                            .height((36 * effectiveAmp).coerceAtLeast(3f).dp)
                            .clip(RoundedCornerShape(topStart = 2.dp, topEnd = 2.dp))
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        barColor.copy(alpha = if (isPlaying) 1.0f else 0.3f),
                                        barColor.copy(alpha = if (isPlaying) 0.5f else 0.1f)
                                    )
                                )
                            )
                    )
                }
            }
        }
    }
}

@Composable
fun SoundboardSearchBar(
    query: String,
    onQueryChange: (String) -> Unit
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        placeholder = {
            Text(
                text = "Search sound drops, agents, tags...",
                fontSize = 11.5.sp,
                color = TextMuted
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = CyanSoft,
                modifier = Modifier.size(16.dp)
            )
        },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Clear",
                        tint = TextMuted,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        },
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = CyanSoft,
            unfocusedBorderColor = BorderSubtle,
            focusedContainerColor = SurfaceElevated,
            unfocusedContainerColor = SurfaceElevated,
            focusedTextColor = TextPrimary,
            unfocusedTextColor = TextPrimary
        ),
        singleLine = true,
        shape = RoundedCornerShape(10.dp)
    )
}

@Composable
fun CategoryFilterRow(
    selectedCategory: SoundCategory,
    onCategorySelect: (SoundCategory) -> Unit
) {
    val categories = listOf(
        SoundCategory.ALL,
        SoundCategory.AGENT_VOICES,
        SoundCategory.SWARM_SFX,
        SoundCategory.AMBIENT_SYNTH,
        SoundCategory.MUSIC_DROPS
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        categories.forEach { cat ->
            val isSelected = selectedCategory == cat
            val count = when (cat) {
                SoundCategory.ALL -> SoundboardCatalog.ALL_PADS.size
                SoundCategory.AGENT_VOICES -> SoundboardCatalog.AGENT_VOICE_PADS.size
                SoundCategory.SWARM_SFX -> SoundboardCatalog.SWARM_SFX_PADS.size
                SoundCategory.AMBIENT_SYNTH -> SoundboardCatalog.AMBIENT_SYNTH_PADS.size
                SoundCategory.MUSIC_DROPS -> SoundboardCatalog.MUSIC_DROP_PADS.size
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (isSelected) SurfaceElevated else SurfaceCard)
                    .border(
                        1.dp,
                        if (isSelected) CyanSoft.copy(alpha = 0.8f) else BorderSubtle,
                        RoundedCornerShape(16.dp)
                    )
                    .clickable { onCategorySelect(cat) }
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = cat.icon, fontSize = 11.sp)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "${cat.displayName} ($count)",
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) CyanSoft else TextSecondary
                    )
                }
            }
        }
    }
}

@Composable
fun SoundPadButton(
    pad: SoundPad,
    isActive: Boolean,
    progress: Float,
    isLooping: Boolean,
    onClick: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pad_glow")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow_pulse"
    )

    Card(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isActive) SurfaceElevated else SurfaceCard
        ),
        modifier = Modifier
            .fillMaxWidth()
            .height(148.dp)
            .border(
                width = if (isActive) 1.5.dp else 1.dp,
                color = if (isActive) pad.glowColor.copy(alpha = glowAlpha) else pad.glowColor.copy(alpha = 0.25f),
                shape = RoundedCornerShape(14.dp)
            )
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(10.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Top Row: Icon Badge & Tag Pill
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(CircleShape)
                            .background(pad.glowColor.copy(alpha = if (isActive) 0.35f else 0.15f))
                            .border(1.dp, pad.glowColor.copy(alpha = 0.6f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = pad.icon, fontSize = 14.sp)
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceDark)
                            .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
                            .padding(horizontal = 5.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = pad.tag.uppercase(),
                            fontSize = 8.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = pad.glowColor,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Middle: Title and Subtitle
                Column {
                    Text(
                        text = pad.title,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = pad.subtitle,
                        fontSize = 10.5.sp,
                        color = if (isActive) pad.glowColor else TextMuted,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Bottom Row: Duration & Play/Stop State Icon
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val durationSec = (pad.durationMs / 1000.0)
                    Text(
                        text = "${String.format("%.1f", durationSec)}s${if (pad.isAmbientLoopable) " 🔁" else ""}",
                        fontSize = 10.sp,
                        color = TextDim,
                        fontFamily = FontFamily.Monospace
                    )

                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(if (isActive) pad.glowColor else SurfaceElevated)
                            .border(1.dp, pad.glowColor.copy(alpha = 0.6f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isActive) Icons.Default.Stop else Icons.Default.PlayArrow,
                            contentDescription = if (isActive) "Stop" else "Play",
                            tint = if (isActive) VoidBlack else pad.glowColor,
                            modifier = Modifier.size(13.dp)
                        )
                    }
                }
            }

            // Playback Progress Bar at the card bottom
            if (isActive) {
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(3.dp)
                        .align(Alignment.BottomCenter),
                    color = pad.glowColor,
                    trackColor = pad.glowColor.copy(alpha = 0.2f)
                )
            }
        }
    }
}

@Composable
fun FloatingAudioDeckDock(
    playbackState: PlaybackState,
    onTogglePlay: () -> Unit,
    onStopAll: () -> Unit,
    onToggleLoop: () -> Unit,
    onOpenSheet: () -> Unit,
    modifier: Modifier = Modifier
) {
    val activePad = SoundboardCatalog.getPadById(playbackState.activePadId ?: "")
    val padColor = activePad?.glowColor ?: CyanSoft

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceDark.copy(alpha = 0.95f))
            .border(1.dp, if (playbackState.isPlaying) padColor.copy(alpha = 0.6f) else BorderNeon, RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Track Info / Status
            Row(
                modifier = Modifier
                    .weight(1f)
                    .clickable(onClick = onOpenSheet),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(if (playbackState.isPlaying) padColor.copy(alpha = 0.2f) else SurfaceElevated)
                        .border(1.dp, if (playbackState.isPlaying) padColor else BorderSubtle, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = activePad?.icon ?: "📡",
                        fontSize = 15.sp
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Text(
                        text = activePad?.title ?: "Deck Standby",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (playbackState.isPlaying) padColor else TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = if (playbackState.isPlaying) {
                            "Playing · ${(playbackState.progress * 100).toInt()}% · Tap for Controls"
                        } else {
                            "Tap pad or press play to synthesize"
                        },
                        fontSize = 10.sp,
                        color = TextMuted,
                        maxLines = 1,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Action Buttons
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Loop Toggle
                IconButton(
                    onClick = onToggleLoop,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Repeat,
                        contentDescription = "Loop",
                        tint = if (playbackState.isLooping) SovereignPurple else TextDim,
                        modifier = Modifier.size(17.dp)
                    )
                }

                // Stop Panic Button (if playing)
                if (playbackState.isPlaying) {
                    IconButton(
                        onClick = onStopAll,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Stop,
                            contentDescription = "Stop All",
                            tint = CrimsonAlert,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                // Play / Pause Toggle
                IconButton(
                    onClick = onTogglePlay,
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(if (playbackState.isPlaying) padColor else CyanSoft)
                ) {
                    Icon(
                        imageVector = if (playbackState.isPlaying) Icons.Default.Stop else Icons.Default.PlayArrow,
                        contentDescription = if (playbackState.isPlaying) "Stop" else "Play",
                        tint = VoidBlack,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun AudioDeckBottomSheetContent(
    playbackState: PlaybackState,
    onVolumeChange: (Float) -> Unit,
    onToggleMute: () -> Unit,
    onToggleLoop: () -> Unit,
    onToggleReverb: () -> Unit,
    onToggleBassBoost: () -> Unit,
    onStopAll: () -> Unit,
    onClose: () -> Unit
) {
    val activePad = SoundboardCatalog.getPadById(playbackState.activePadId ?: "")

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceDark)
            .padding(20.dp)
    ) {
        // Sheet Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Tune,
                    contentDescription = null,
                    tint = AlchemicalGold,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "MASTER AUDIO CONTROLS",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.sp
                )
            }

            IconButton(
                onClick = onClose,
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close",
                    tint = TextMuted,
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Active Track Narration Quote Card
        if (activePad != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceCard)
                    .border(1.dp, activePad.glowColor.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = activePad.icon, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = activePad.title,
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = activePad.glowColor
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "· ${activePad.category.displayName}",
                            fontSize = 10.5.sp,
                            color = TextMuted
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "\"${activePad.narrationText}\"",
                        fontSize = 11.5.sp,
                        color = TextSecondary,
                        lineHeight = 16.sp
                    )
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
        }

        // Master Volume Section
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (playbackState.isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
                            contentDescription = "Volume",
                            tint = if (playbackState.isMuted) CrimsonAlert else CyanSoft,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Master Volume",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }

                    Text(
                        text = if (playbackState.isMuted) "MUTED" else "${(playbackState.volume * 100).roundToInt()}%",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (playbackState.isMuted) CrimsonAlert else CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Slider(
                        value = if (playbackState.isMuted) 0f else playbackState.volume,
                        onValueChange = onVolumeChange,
                        valueRange = 0f..1f,
                        modifier = Modifier.weight(1f),
                        colors = SliderDefaults.colors(
                            thumbColor = CyanSoft,
                            activeTrackColor = CyanSoft,
                            inactiveTrackColor = BorderSubtle
                        )
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = onToggleMute,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (playbackState.isMuted) CrimsonAlert.copy(alpha = 0.2f) else SurfaceElevated,
                            contentColor = if (playbackState.isMuted) CrimsonAlert else TextSecondary
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Text(
                            text = if (playbackState.isMuted) "Unmute" else "Mute",
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Loop Mode & DSP Switches Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Loop Mode Switch
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Infinite Loop Mode",
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Seamless continuous pad & ambient repeating",
                            fontSize = 10.5.sp,
                            color = TextMuted
                        )
                    }
                    Switch(
                        checked = playbackState.isLooping,
                        onCheckedChange = { onToggleLoop() },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = VoidBlack,
                            checkedTrackColor = SovereignPurple,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = SurfaceElevated
                        )
                    )
                }

                // Reverb Matrix Switch
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Cyber Reverb Matrix",
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = "68ms multi-tap spatial comb feedback",
                            fontSize = 10.5.sp,
                            color = TextMuted
                        )
                    }
                    Switch(
                        checked = playbackState.reverbEnabled,
                        onCheckedChange = { onToggleReverb() },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = VoidBlack,
                            checkedTrackColor = CyanSoft,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = SurfaceElevated
                        )
                    )
                }

                // Bass Boost 808 Switch
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "808 Sub-Bass Boost",
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Low-shelf 60Hz saturation filter",
                            fontSize = 10.5.sp,
                            color = TextMuted
                        )
                    }
                    Switch(
                        checked = playbackState.bassBoostEnabled,
                        onCheckedChange = { onToggleBassBoost() },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = VoidBlack,
                            checkedTrackColor = AlchemicalGold,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = SurfaceElevated
                        )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Emergency Stop All Panic Button
        Button(
            onClick = onStopAll,
            colors = ButtonDefaults.buttonColors(
                containerColor = CrimsonAlert.copy(alpha = 0.15f),
                contentColor = CrimsonAlert
            ),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(44.dp)
                .border(1.dp, CrimsonAlert.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Stop,
                    contentDescription = "Stop All",
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "EMERGENCY AUDIO CUTOFF (STOP ALL)",
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}
