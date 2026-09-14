package com.example.zothsignalbridge.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.AppScreen
import com.example.zothsignalbridge.data.models.PantheonData
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.SurfaceHighlight
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack
import com.example.zothsignalbridge.ui.screens.StudioCategory
import com.example.zothsignalbridge.ui.screens.StudioPreset
import com.example.zothsignalbridge.ui.screens.StudioPresets
import kotlinx.coroutines.launch

enum class SpotlightFilterType(val label: String, val icon: String) {
    ALL("All", "⚡"),
    TOOLS("Tools & Hubs", "🛠️"),
    AGENTS("Agents (21)", "👥"),
    ACTIONS("Swarm Commands", "⚡"),
    SCREENS("Screen Jumps", "📱")
}

data class SpotlightSearchResult(
    val id: String,
    val title: String,
    val subtitle: String,
    val categoryLabel: String,
    val iconEmoji: String,
    val badge: String = "",
    val accentColor: Color = CyanSoft,
    val onExecute: () -> Unit
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SpotlightCommandModal(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    onNavigateToScreen: (AppScreen) -> Unit,
    onOpenStudioPreset: (StudioPreset) -> Unit,
    onStartChatWithAgent: (String) -> Unit,
    onExecuteSlashCommand: (to: String, command: String, priority: String) -> Unit,
    modifier: Modifier = Modifier
) {
    if (!isOpen) return

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(SpotlightFilterType.ALL) }
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        try {
            focusRequester.requestFocus()
        } catch (_: Exception) {}
    }

    // Build Search Index
    val allResults = remember(searchQuery, selectedFilter) {
        val results = mutableListOf<SpotlightSearchResult>()

        // 1. Zoth Studio Tools & Workstations
        if (selectedFilter == SpotlightFilterType.ALL || selectedFilter == SpotlightFilterType.TOOLS) {
            StudioPresets.PRESETS.forEach { preset ->
                results.add(
                    SpotlightSearchResult(
                        id = "preset_${preset.id}",
                        title = preset.title,
                        subtitle = "${preset.category.displayName} · ${preset.description}",
                        categoryLabel = "ZOTH STUDIO",
                        iconEmoji = preset.category.emoji,
                        badge = preset.badge,
                        accentColor = AlchemicalGold,
                        onExecute = {
                            scope.launch { sheetState.hide() }.invokeOnCompletion {
                                onDismiss()
                                onOpenStudioPreset(preset)
                            }
                        }
                    )
                )
            }
        }

        // 2. 21 Sovereign Agents
        if (selectedFilter == SpotlightFilterType.ALL || selectedFilter == SpotlightFilterType.AGENTS) {
            PantheonData.archetypes.forEach { agent ->
                results.add(
                    SpotlightSearchResult(
                        id = "agent_${agent.id}",
                        title = "${agent.name} (@${agent.id})",
                        subtitle = "${agent.title} · Domain: ${agent.alchemicalDomain}",
                        categoryLabel = "PANTHEON AGENT",
                        iconEmoji = agent.emoji,
                        badge = agent.category.displayName,
                        accentColor = agent.primaryColor,
                        onExecute = {
                            scope.launch { sheetState.hide() }.invokeOnCompletion {
                                onDismiss()
                                onStartChatWithAgent(agent.id)
                            }
                        }
                    )
                )
            }
        }

        // 3. Swarm Actions & Slash Macros
        if (selectedFilter == SpotlightFilterType.ALL || selectedFilter == SpotlightFilterType.ACTIONS) {
            val swarmActions = listOf(
                Triple("/status", "Query active swarm node health & tailnet latency", "⚡"),
                Triple("/who", "List all 21 active agent seats and capabilities", "👥"),
                Triple("/claims", "Inspect active workspace claims & AST mutex locks", "🔒"),
                Triple("/consensus", "Trigger Merkle AST consensus validation round", "⚖️"),
                Triple("/route", "Dispatch prompt to autonomous swarm router", "🎯"),
                Triple("/ping", "Measure WireGuard tunnel RTT & node ping", "📡"),
                Triple("/heal", "Trigger companion self-healing integrity sweep", "✨")
            )
            swarmActions.forEach { (cmd, desc, icon) ->
                results.add(
                    SpotlightSearchResult(
                        id = "cmd_$cmd",
                        title = cmd,
                        subtitle = desc,
                        categoryLabel = "SWARM COMMAND",
                        iconEmoji = icon,
                        badge = "EXEC",
                        accentColor = CyanNeon,
                        onExecute = {
                            scope.launch { sheetState.hide() }.invokeOnCompletion {
                                onDismiss()
                                onExecuteSlashCommand("all", cmd, "normal")
                            }
                        }
                    )
                )
            }
        }

        // 4. Screen Jumps
        if (selectedFilter == SpotlightFilterType.ALL || selectedFilter == SpotlightFilterType.SCREENS) {
            val screens = listOf(
                Triple(AppScreen.TRANSMISSIONS, "Chat / Transmissions", "💬"),
                Triple(AppScreen.RADAR, "Swarm AST Radar", "📡"),
                Triple(AppScreen.ARENA, "Consensus Arena", "⚖️"),
                Triple(AppScreen.PANTHEON, "Pantheon 21 Dossiers", "⚡"),
                Triple(AppScreen.NOTES, "Notes & DOM Reviewer", "📝"),
                Triple(AppScreen.PETS, "Companion Spirits Deck", "🐾"),
                Triple(AppScreen.SOUNDBOARD, "SFX Soundboard", "🔊"),
                Triple(AppScreen.WEB_HUD, "Zoth Studio Web HUD", "🌐"),
                Triple(AppScreen.SETTINGS, "Tailscale Mesh Settings", "⚙️")
            )
            screens.forEach { (screen, name, icon) ->
                results.add(
                    SpotlightSearchResult(
                        id = "screen_${screen.name}",
                        title = name,
                        subtitle = "Jump directly to $name screen",
                        categoryLabel = "APP SCREEN",
                        iconEmoji = icon,
                        badge = "JUMP",
                        accentColor = EmeraldOnline,
                        onExecute = {
                            scope.launch { sheetState.hide() }.invokeOnCompletion {
                                onDismiss()
                                onNavigateToScreen(screen)
                            }
                        }
                    )
                )
            }
        }

        // Filter results by search query
        if (searchQuery.isBlank()) {
            results
        } else {
            val q = searchQuery.trim().lowercase()
            results.filter {
                it.title.lowercase().contains(q) ||
                it.subtitle.lowercase().contains(q) ||
                it.categoryLabel.lowercase().contains(q) ||
                it.badge.lowercase().contains(q)
            }
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceDark,
        tonalElevation = 0.dp,
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(top = 10.dp, bottom = 6.dp)
                    .width(36.dp)
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(BorderSubtle)
            )
        }
    ) {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .heightIn(max = 640.dp)
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = "Spotlight",
                        tint = AlchemicalGold,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "TACTICAL OMNIBAR",
                        fontSize = 13.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }

                IconButton(
                    onClick = {
                        scope.launch { sheetState.hide() }.invokeOnCompletion { onDismiss() }
                    },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextMuted,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Main Omnibar Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = {
                    Text(
                        text = "Type tool name, @agent, /command, screen...",
                        fontSize = 12.sp,
                        color = TextMuted
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = CyanNeon,
                        modifier = Modifier.size(17.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear",
                                tint = TextMuted,
                                modifier = Modifier.size(15.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceCard,
                    unfocusedContainerColor = SurfaceCard,
                    focusedBorderColor = CyanNeon,
                    unfocusedBorderColor = BorderSubtle,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    cursorColor = CyanNeon
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .focusRequester(focusRequester)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Filter Chips
            LazyRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(SpotlightFilterType.values()) { filter ->
                    val isSelected = selectedFilter == filter
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isSelected) SurfaceElevated else SurfaceCard)
                            .border(
                                width = 1.dp,
                                color = if (isSelected) CyanSoft else BorderSubtle,
                                shape = RoundedCornerShape(14.dp)
                            )
                            .clickable { selectedFilter = filter }
                            .padding(horizontal = 9.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = filter.icon, fontSize = 10.sp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = filter.label,
                                fontSize = 10.5.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) CyanSoft else TextSecondary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Search Results List
            if (allResults.isEmpty()) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(text = "🔍", fontSize = 28.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No tools, agents or commands match \"$searchQuery\"",
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(allResults, key = { it.id }) { item ->
                        SpotlightResultCard(item = item)
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
fun SpotlightResultCard(
    item: SpotlightSearchResult
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
            .clickable(onClick = item.onExecute)
            .padding(horizontal = 10.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(SurfaceElevated)
                    .border(1.dp, item.accentColor.copy(alpha = 0.5f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(text = item.iconEmoji, fontSize = 15.sp)
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.title,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    if (item.badge.isNotBlank()) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(item.accentColor.copy(alpha = 0.15f))
                                .padding(horizontal = 4.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = item.badge,
                                fontSize = 8.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = item.accentColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
                Text(
                    text = item.subtitle,
                    fontSize = 10.5.sp,
                    color = TextSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        Text(
            text = item.categoryLabel,
            fontSize = 9.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
    }
}
