package com.example.zothsignalbridge.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.Apps
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.zothsignalbridge.data.models.AppScreen
import com.example.zothsignalbridge.theme.AppThemeMode
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.VoidBlack
import androidx.compose.material3.MaterialTheme
import com.example.zothsignalbridge.ui.components.AdvancedNetworkSheet
import com.example.zothsignalbridge.ui.components.DiagnosticLogsModal
import com.example.zothsignalbridge.ui.components.SpotlightCommandModal
import com.example.zothsignalbridge.ui.components.ZothNavigationDrawer
import com.example.zothsignalbridge.ui.components.ZothTopAppBar
import com.example.zothsignalbridge.ui.screens.ConsensusScreen
import com.example.zothsignalbridge.ui.screens.NotesReviewerScreen
import com.example.zothsignalbridge.ui.screens.PantheonScreen
import com.example.zothsignalbridge.ui.screens.PetsScreen
import com.example.zothsignalbridge.ui.screens.SettingsScreen
import com.example.zothsignalbridge.ui.screens.SoundboardScreen
import com.example.zothsignalbridge.ui.screens.StudioWebViewScreen
import com.example.zothsignalbridge.ui.screens.SwarmRadarScreen
import com.example.zothsignalbridge.ui.screens.TransmissionsScreen
import kotlinx.coroutines.launch

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.layout.Column
import androidx.compose.ui.Alignment
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import com.example.zothsignalbridge.ui.components.FloatingMiniAudioBar
import com.example.zothsignalbridge.ui.components.QuickActionSpeedDial

@Composable
fun MainScreen(
    viewModel: MainScreenViewModel = viewModel(),
    modifier: Modifier = Modifier
) {
    val selectedTab by viewModel.selectedTab.collectAsStateWithLifecycle()
    val selectedChannel by viewModel.selectedChannel.collectAsStateWithLifecycle()
    val messages by viewModel.messages.collectAsStateWithLifecycle()
    val agents by viewModel.agents.collectAsStateWithLifecycle()
    val claims by viewModel.claims.collectAsStateWithLifecycle()
    val telemetry by viewModel.telemetry.collectAsStateWithLifecycle()
    val connectionStatus by viewModel.connectionStatus.collectAsStateWithLifecycle()
    val config by viewModel.config.collectAsStateWithLifecycle()
    val consensusState by viewModel.consensusState.collectAsStateWithLifecycle()
    val notes by viewModel.notes.collectAsStateWithLifecycle()
    val pets by viewModel.pets.collectAsStateWithLifecycle()
    val diagnosticLogs by viewModel.diagnosticLogs.collectAsStateWithLifecycle()
    val playbackState by viewModel.playbackState.collectAsStateWithLifecycle()
    val studioTargetUrl by viewModel.studioTargetUrl.collectAsStateWithLifecycle()

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current

    var showDiagnosticLogsModal by remember { mutableStateOf(false) }
    var showAdvancedSettingsSheet by remember { mutableStateOf(false) }
    var showSpotlightOmnibarModal by remember { mutableStateOf(false) }

    val currentScreen = when (selectedTab) {
        0 -> AppScreen.TRANSMISSIONS
        1 -> AppScreen.RADAR
        2 -> AppScreen.ARENA
        3 -> AppScreen.PANTHEON
        4 -> AppScreen.NOTES
        5 -> AppScreen.PETS
        6 -> AppScreen.SOUNDBOARD
        7 -> AppScreen.WEB_HUD
        8 -> AppScreen.SETTINGS
        else -> AppScreen.TRANSMISSIONS
    }

    // Google-style 5 Primary Bottom Navigation Destinations (concise, non-truncated single words)
    val primaryBottomTabs = listOf(
        Pair("Chat", Icons.AutoMirrored.Filled.Chat) to 0,
        Pair("Radar", Icons.Default.Radar) to 1,
        Pair("Arena", Icons.Default.AccountTree) to 2,
        Pair("Pantheon", Icons.Default.AutoAwesome) to 3,
        Pair(
            when (selectedTab) {
                4 -> "Notes"
                5 -> "Pets"
                6 -> "Sound"
                7 -> "Studio"
                8 -> "Settings"
                else -> "Tools"
            },
            when (selectedTab) {
                4 -> Icons.Default.Description
                5 -> Icons.Default.Pets
                6 -> Icons.Default.GraphicEq
                7 -> Icons.Default.Language
                8 -> Icons.Default.Settings
                else -> Icons.Default.Apps
            }
        ) to if (selectedTab in 4..8) selectedTab else 4
    )

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ZothNavigationDrawer(
                currentScreen = currentScreen,
                connectionStatus = connectionStatus,
                config = config,
                onNavigate = { screen ->
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    when (screen) {
                        AppScreen.TRANSMISSIONS -> viewModel.selectTab(0)
                        AppScreen.RADAR -> viewModel.selectTab(1)
                        AppScreen.ARENA -> viewModel.selectTab(2)
                        AppScreen.PANTHEON -> viewModel.selectTab(3)
                        AppScreen.NOTES -> viewModel.selectTab(4)
                        AppScreen.PETS -> viewModel.selectTab(5)
                        AppScreen.SOUNDBOARD -> viewModel.selectTab(6)
                        AppScreen.WEB_HUD -> viewModel.selectTab(7)
                        AppScreen.SETTINGS -> viewModel.selectTab(8)
                    }
                },
                onOpenDiagnosticLogs = { showDiagnosticLogsModal = true },
                onOpenAdvancedSettings = { showAdvancedSettingsSheet = true },
                onForceSync = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    viewModel.refresh()
                    viewModel.triggerPing()
                },
                onClearCache = {
                    viewModel.clearCache()
                },
                onCloseDrawer = {
                    scope.launch { drawerState.close() }
                }
            )
        }
    ) {
        Scaffold(
            modifier = modifier.fillMaxSize(),
            containerColor = MaterialTheme.colorScheme.background,
            topBar = {
                ZothTopAppBar(
                    connectionStatus = connectionStatus,
                    onRefreshClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        viewModel.refresh()
                    },
                    onSettingsClick = { viewModel.selectTab(8) },
                    onBadgeClick = { viewModel.selectTab(8) },
                    onSpotlightClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        showSpotlightOmnibarModal = true
                    },
                    onThemeClick = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        val modes = AppThemeMode.entries
                        val currentIdx = modes.indexOfFirst { it.id.equals(config.themeMode, ignoreCase = true) }.coerceAtLeast(0)
                        val nextMode = modes[(currentIdx + 1) % modes.size]
                        viewModel.saveConfig(config.copy(themeMode = nextMode.id))
                    },
                    onMenuClick = { scope.launch { drawerState.open() } }
                )
            },
            bottomBar = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    FloatingMiniAudioBar(
                        playbackState = playbackState,
                        onTogglePlay = { viewModel.togglePlayActiveAudio() },
                        onStop = { viewModel.stopActiveAudio() },
                        onClick = { viewModel.selectTab(6) }
                    )

                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surface,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                        tonalElevation = 0.dp,
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(width = 1.dp, color = MaterialTheme.colorScheme.outlineVariant, shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                            .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                            .navigationBarsPadding()
                    ) {
                        primaryBottomTabs.forEach { (tabInfo, targetIndex) ->
                            val (title, icon) = tabInfo
                            val isSelected = when (targetIndex) {
                                0, 1, 2, 3 -> selectedTab == targetIndex
                                else -> selectedTab in 4..8
                            }

                            NavigationBarItem(
                                selected = isSelected,
                                onClick = {
                                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                    if (title == "Tools" || (targetIndex in 4..8 && selectedTab !in 4..8)) {
                                        scope.launch { drawerState.open() }
                                    } else {
                                        viewModel.selectTab(targetIndex)
                                    }
                                },
                                icon = {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = title,
                                        modifier = Modifier.size(19.dp),
                                        tint = if (isSelected) CyanSoft else TextMuted
                                    )
                                },
                                label = {
                                    Text(
                                        text = title,
                                        fontSize = 9.5.sp,
                                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                                        color = if (isSelected) CyanSoft else TextMuted,
                                        maxLines = 1
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = CyanSoft,
                                    selectedTextColor = CyanSoft,
                                    indicatorColor = SurfaceElevated,
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted
                                )
                            )
                        }
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(VoidBlack)
            ) {
                AnimatedContent(
                    targetState = selectedTab,
                    transitionSpec = {
                        if (targetState > initialState) {
                            (slideInHorizontally { width -> width / 4 } + fadeIn()) togetherWith
                            (slideOutHorizontally { width -> -width / 4 } + fadeOut())
                        } else {
                            (slideInHorizontally { width -> -width / 4 } + fadeIn()) togetherWith
                            (slideOutHorizontally { width -> width / 4 } + fadeOut())
                        }
                    },
                    label = "ScreenTransition"
                ) { tab ->
                    when (tab) {
                        0 -> TransmissionsScreen(
                            messages = messages,
                            selectedChannel = selectedChannel,
                            connectionStatus = connectionStatus,
                            onChannelSelected = { viewModel.selectChannel(it) },
                            onSendMessage = { to, text, priority ->
                                viewModel.sendMessage(to, text, priority)
                            },
                            onConfigureTailscaleClick = { viewModel.selectTab(8) }
                        )
                        1 -> SwarmRadarScreen(
                            agents = agents,
                            claims = claims,
                            telemetry = telemetry,
                            onDirectMessageClick = { agentId ->
                                viewModel.selectChannel(agentId)
                            }
                        )
                        2 -> ConsensusScreen(
                            state = consensusState,
                            onSelectDialecticStage = { viewModel.selectDialecticStage(it) },
                            onSelectProposal = { viewModel.selectProposal(it) },
                            onToggleAgentVote = { agentId, decision ->
                                viewModel.toggleAgentVote(agentId, decision)
                            },
                            onToggleByzantine = { viewModel.toggleByzantineStatus(it) },
                            onReverifyMerkleProof = { viewModel.reverifyMerkleProof() },
                            onResetConsensus = { viewModel.resetConsensus() }
                        )
                        3 -> PantheonScreen(
                            onStartPrivateTransmission = { agentId ->
                                viewModel.selectChannel(agentId)
                            }
                        )
                        4 -> NotesReviewerScreen(
                            notes = notes,
                            onToggleStatus = { noteId ->
                                viewModel.toggleNoteStatus(noteId)
                            },
                            onQuickReply = { to, text, priority ->
                                viewModel.sendMessage(to, text, priority)
                            },
                            onRefresh = {
                                viewModel.refreshAnnotations()
                            },
                            onCreateNote = { title, author, content, tags ->
                                viewModel.createNote(title, author, content, tags)
                            },
                            onUpdateNoteStatus = { noteId, newStatus ->
                                viewModel.updateNoteStatus(noteId, newStatus)
                            }
                        )
                        5 -> PetsScreen(
                            pets = pets,
                            onFeedPet = { viewModel.feedPet(it) },
                            onPetCompanion = { viewModel.petCompanion(it) },
                            onTrainPet = { viewModel.trainPet(it) },
                            onSendPetPrompt = { petId, prompt ->
                                viewModel.sendPetPrompt(petId, prompt)
                            }
                        )
                        6 -> SoundboardScreen()
                        7 -> StudioWebViewScreen(
                            initialUrl = studioTargetUrl ?: config.studioUrl,
                            onConfigureTailscaleClick = { viewModel.selectTab(8) }
                        )
                        8 -> SettingsScreen(
                            currentConfig = config,
                            onSaveConfig = { newConfig ->
                                viewModel.saveConfig(newConfig)
                                viewModel.selectTab(0)
                            },
                            diagnosticLogs = diagnosticLogs,
                            onClearLogs = { viewModel.clearDiagnosticLogs() },
                            onClearCache = { viewModel.clearCache() }
                        )
                    }
                }

                // Speed Dial overlay for quick actions on Transmissions screen
                if (selectedTab == 0) {
                    QuickActionSpeedDial(
                        onBroadcastAll = {
                            viewModel.selectChannel("all")
                        },
                        onVoiceTransmission = {
                            viewModel.sendMessage("all", "🎙️ [Tactical Voice Drop] Neural telemetry stream verified.", "high")
                        },
                        onTriggerConsensus = {
                            viewModel.selectTab(2)
                        },
                        onNewAnnotation = {
                            viewModel.selectTab(4)
                        },
                        modifier = Modifier.align(Alignment.BottomEnd).padding(bottom = 70.dp)
                    )
                }
            }
        }
    }

    // Modal Overlays
    if (showDiagnosticLogsModal) {
        DiagnosticLogsModal(
            logs = diagnosticLogs,
            onDismiss = { showDiagnosticLogsModal = false },
            onClearLogs = { viewModel.clearDiagnosticLogs() },
            onTestPing = { viewModel.triggerPing() }
        )
    }

    if (showAdvancedSettingsSheet) {
        AdvancedNetworkSheet(
            config = config,
            onSaveConfig = { updated ->
                viewModel.saveConfig(updated)
            },
            onClearCache = { viewModel.clearCache() },
            onDismiss = { showAdvancedSettingsSheet = false }
        )
    }

    if (showSpotlightOmnibarModal) {
        SpotlightCommandModal(
            isOpen = showSpotlightOmnibarModal,
            onDismiss = { showSpotlightOmnibarModal = false },
            onNavigateToScreen = { screen ->
                viewModel.navigateTo(screen)
            },
            onOpenStudioPreset = { preset ->
                viewModel.openStudioUrl(preset.path)
            },
            onStartChatWithAgent = { agentId ->
                viewModel.selectChannel(agentId)
            },
            onExecuteSlashCommand = { to, cmd, prio ->
                viewModel.sendMessage(to, cmd, prio)
            }
        )
    }
}

