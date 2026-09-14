package com.example.zothsignalbridge.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Reply
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Radio
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.SwarmMessage
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.TextDim
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class SlashCommandItem(
    val command: String,
    val description: String,
    val samplePayload: String,
    val icon: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ComposerBar(
    onSendMessage: (to: String, message: String, priority: String) -> Unit,
    replyToMessage: SwarmMessage? = null,
    onDismissReply: () -> Unit = {},
    initialTargetAgent: String = "all",
    modifier: Modifier = Modifier
) {
    var text by remember { mutableStateOf("") }
    var targetAgent by remember(initialTargetAgent) { mutableStateOf(initialTargetAgent) }
    var priority by remember { mutableStateOf("normal") }
    var showToolsSheet by remember { mutableStateOf(false) }
    var isRecordingAudio by remember { mutableStateOf(false) }
    var recordingDurationSec by remember { mutableIntStateOf(0) }

    val agents = listOf("all", "antigravity", "azoth", "grok", "hermes", "ollama")
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current

    // Timer for audio note simulation
    LaunchedEffect(isRecordingAudio) {
        if (isRecordingAudio) {
            recordingDurationSec = 0
            while (isRecordingAudio) {
                delay(1000)
                recordingDurationSec++
            }
        }
    }

    // If replyToMessage changed, update target agent to the sender
    LaunchedEffect(replyToMessage) {
        if (replyToMessage != null && replyToMessage.from != "operator") {
            targetAgent = replyToMessage.from
        }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(VoidBlack)
            .padding(horizontal = 12.dp, vertical = 6.dp)
            .navigationBarsPadding()
            .imePadding()
    ) {
        // Reply Preview Banner
        AnimatedVisibility(
            visible = replyToMessage != null,
            enter = fadeIn() + slideInVertically { it },
            exit = fadeOut() + slideOutVertically { it }
        ) {
            if (replyToMessage != null) {
                val replyingAgent = getAgentInfo(replyToMessage.from)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 6.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, replyingAgent.color.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Reply,
                            contentDescription = "Reply",
                            tint = replyingAgent.color,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = "Replying to @${replyingAgent.id}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = replyingAgent.color,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = replyToMessage.message.replace("\n", " ").take(60),
                                fontSize = 11.sp,
                                color = TextMuted,
                                maxLines = 1
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismissReply,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Dismiss reply",
                            tint = TextMuted,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            }
        }

        // Inline Slash Command Suggestions Carousel
        AnimatedVisibility(
            visible = text.startsWith("/") && !isRecordingAudio,
            enter = fadeIn() + slideInVertically { it },
            exit = fadeOut() + slideOutVertically { it }
        ) {
            val matchingCommands = remember(text) {
                val q = text.lowercase()
                listOf(
                    Triple("/status", "Swarm health & latency", "⚡"),
                    Triple("/who", "Active agent seats", "👥"),
                    Triple("/claims", "AST mutex locks", "🔒"),
                    Triple("/consensus", "Merkle validation", "⚖️"),
                    Triple("/route", "Swarm prompt router", "🎯"),
                    Triple("/ping", "WireGuard RTT", "📡"),
                    Triple("/heal", "Integrity sweep", "✨")
                ).filter { it.first.startsWith(q) || q == "/" }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 6.dp)
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                matchingCommands.forEach { (cmd, desc, icon) ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceElevated)
                            .border(1.dp, CyanSoft.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                            .clickable {
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                text = "$cmd "
                            }
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = icon, fontSize = 10.sp)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = cmd,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = AlchemicalGold,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = desc,
                                fontSize = 9.5.sp,
                                color = TextMuted
                            )
                        }
                    }
                }
            }
        }

        // Active Audio Recording Bar or Sleek Composer Pill
        if (isRecordingAudio) {
            AudioRecordingBar(
                durationSec = recordingDurationSec,
                onCancel = { isRecordingAudio = false },
                onSend = {
                    val duration = if (recordingDurationSec < 1) 3 else recordingDurationSec
                    val simulatedTranscript = when (targetAgent) {
                        "antigravity" -> "AST verify and workspace dispatch requested on port :8484."
                        "azoth" -> "Alchemical geometry synthesis confirmation acknowledged."
                        "grok" -> "Trigger consensus triangulation benchmark."
                        "hermes" -> "Execute diagnostic DAG loop."
                        "ollama" -> "Run local zero-cloud inference cycle."
                        else -> "Tactical field voice transmission to @$targetAgent."
                    }
                    val audioMsg = "🎙️ [Tactical Audio Transmission - 0:${duration.toString().padStart(2, '0')}] Transcribed: $simulatedTranscript"
                    onSendMessage(targetAgent, audioMsg, priority)
                    isRecordingAudio = false
                    onDismissReply()
                }
            )
        } else {
            // Google Messages / Signal Single-Line Pill
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(26.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(26.dp))
                    .padding(horizontal = 6.dp, vertical = 5.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Circular Attachment / Menu (+) Button
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(SurfaceElevated)
                        .border(1.dp, CyanSoft.copy(alpha = 0.4f), CircleShape)
                        .clickable { showToolsSheet = true },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Attachment & Slash Commands",
                        tint = CyanNeon,
                        modifier = Modifier.size(19.dp)
                    )
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Target Agent Pill with Quick Cycle
                val agentInfo = getAgentInfo(targetAgent)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(agentInfo.color.copy(alpha = 0.15f))
                        .border(1.dp, agentInfo.color.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                        .clickable {
                            val nextIdx = (agents.indexOf(targetAgent) + 1) % agents.size
                            targetAgent = agents[nextIdx]
                        }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "@${agentInfo.id}",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = agentInfo.color,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Priority Badge Indicator if not normal
                if (priority != "normal") {
                    Spacer(modifier = Modifier.width(4.dp))
                    val prioColor = if (priority == "urgent") CrimsonAlert else AmberWarning
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(prioColor.copy(alpha = 0.15f))
                            .border(0.5.dp, prioColor, RoundedCornerShape(10.dp))
                            .clickable {
                                priority = when (priority) {
                                    "urgent" -> "normal"
                                    "high" -> "urgent"
                                    else -> "normal"
                                }
                            }
                            .padding(horizontal = 6.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = priority.take(3).uppercase(),
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = prioColor,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Main Text Input Field
                Box(
                    modifier = Modifier.weight(1f),
                    contentAlignment = Alignment.CenterStart
                ) {
                    if (text.isEmpty()) {
                        Text(
                            text = "Message @$targetAgent...",
                            fontSize = 13.5.sp,
                            color = TextMuted
                        )
                    }
                    BasicTextField(
                        value = text,
                        onValueChange = { text = it },
                        textStyle = TextStyle(
                            color = TextPrimary,
                            fontSize = 13.5.sp,
                            lineHeight = 18.sp
                        ),
                        cursorBrush = SolidColor(CyanNeon),
                        maxLines = 4,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                        keyboardActions = KeyboardActions(
                            onSend = {
                                if (text.isNotBlank()) {
                                    val finalMsg = if (replyToMessage != null) {
                                        "[In reply to @${replyToMessage.from}: \"${replyToMessage.message.take(30)}...\"]\n${text.trim()}"
                                    } else {
                                        text.trim()
                                    }
                                    onSendMessage(targetAgent, finalMsg, priority)
                                    text = ""
                                    onDismissReply()
                                }
                            }
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Dynamic Action Button (Voice Note simulation when empty, Send when typed)
                AnimatedContent(
                    targetState = text.isNotBlank(),
                    transitionSpec = { fadeIn() togetherWith fadeOut() },
                    label = "actionButton"
                ) { hasText ->
                    if (hasText) {
                        // Send Button
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(CyanNeon)
                                .clickable {
                                    if (text.isNotBlank()) {
                                        val finalMsg = if (replyToMessage != null) {
                                            "[In reply to @${replyToMessage.from}: \"${replyToMessage.message.take(30)}...\"]\n${text.trim()}"
                                        } else {
                                            text.trim()
                                        }
                                        onSendMessage(targetAgent, finalMsg, priority)
                                        text = ""
                                        onDismissReply()
                                    }
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Send,
                                contentDescription = "Send",
                                tint = VoidBlack,
                                modifier = Modifier.size(17.dp)
                            )
                        }
                    } else {
                        // Voice Note / SFX Simulation Button
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(SurfaceElevated)
                                .border(1.dp, BorderSubtle, CircleShape)
                                .clickable { isRecordingAudio = true },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Mic,
                                contentDescription = "Record Audio Note",
                                tint = CyanSoft,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        }
    }

    // Attachment & Tools Modal Bottom Sheet
    if (showToolsSheet) {
        ModalBottomSheet(
            onDismissRequest = { showToolsSheet = false },
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
            ToolsAndSlashCommandsSheet(
                currentAgent = targetAgent,
                currentPriority = priority,
                onSelectAgent = { agent ->
                    targetAgent = agent
                },
                onSelectPriority = { prio ->
                    priority = prio
                },
                onSelectCommand = { cmdText ->
                    text = cmdText
                    scope.launch {
                        sheetState.hide()
                        showToolsSheet = false
                    }
                },
                onExecuteMacro = { macroText, macroAgent, macroPrio ->
                    onSendMessage(macroAgent, macroText, macroPrio)
                    scope.launch {
                        sheetState.hide()
                        showToolsSheet = false
                    }
                },
                onClose = {
                    scope.launch {
                        sheetState.hide()
                        showToolsSheet = false
                    }
                }
            )
        }
    }
}

@Composable
fun AudioRecordingBar(
    durationSec: Int,
    onCancel: () -> Unit,
    onSend: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "recordingWave")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(26.dp))
            .background(SurfaceElevated)
            .border(1.dp, CrimsonAlert.copy(alpha = 0.6f), RoundedCornerShape(26.dp))
            .padding(horizontal = 10.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Discard / Cancel Button
        IconButton(
            onClick = onCancel,
            modifier = Modifier.size(34.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Delete,
                contentDescription = "Discard",
                tint = TextMuted,
                modifier = Modifier.size(18.dp)
            )
        }

        // Live Pulsing Recording Status & Waveform
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(CrimsonAlert.copy(alpha = pulseAlpha))
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "REC 0:${durationSec.toString().padStart(2, '0')}",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = CrimsonAlert,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.width(8.dp))

            // Simulated dynamic soundwave
            val heights = listOf(8, 16, 24, 12, 20, 14, 22, 10)
            heights.forEachIndexed { idx, h ->
                val dynamicHeight = (h * if (idx % 2 == 0) pulseAlpha else (1.2f - pulseAlpha)).coerceIn(4f, 24f).dp
                Box(
                    modifier = Modifier
                        .width(3.dp)
                        .height(dynamicHeight)
                        .clip(RoundedCornerShape(2.dp))
                        .background(CyanNeon)
                )
            }
        }

        // Send Voice Note Button
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(CyanNeon)
                .clickable(onClick = onSend),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.Send,
                contentDescription = "Send Voice Transmission",
                tint = VoidBlack,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
fun ToolsAndSlashCommandsSheet(
    currentAgent: String,
    currentPriority: String,
    onSelectAgent: (String) -> Unit,
    onSelectPriority: (String) -> Unit,
    onSelectCommand: (String) -> Unit,
    onExecuteMacro: (macroText: String, agent: String, priority: String) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val agents = listOf("all", "antigravity", "azoth", "grok", "hermes", "ollama")
    val priorities = listOf("normal", "high", "urgent")

    val slashCommands = listOf(
        SlashCommandItem(
            command = "/status",
            description = "Query active swarm node health & tailnet latency",
            samplePayload = "/status",
            icon = "⚡"
        ),
        SlashCommandItem(
            command = "/who",
            description = "List all active agent seats and capabilities",
            samplePayload = "/who",
            icon = "👥"
        ),
        SlashCommandItem(
            command = "/claims",
            description = "Inspect active workspace claims & mutex locks",
            samplePayload = "/claims",
            icon = "🔒"
        ),
        SlashCommandItem(
            command = "/route",
            description = "Dispatch prompt to autonomous swarm router",
            samplePayload = "/route ast-audit",
            icon = "🎯"
        ),
        SlashCommandItem(
            command = "/consensus",
            description = "Trigger Merkle AST consensus validation",
            samplePayload = "/consensus audit-root",
            icon = "⚖️"
        ),
        SlashCommandItem(
            command = "/ping",
            description = "Measure WireGuard tunnel RTT",
            samplePayload = "/ping",
            icon = "📡"
        )
    )

    val macros = listOf(
        Triple("⚡ Run Full AST Audit", "antigravity", "high"),
        Triple("⚗️ Transmute UI Doctrine", "azoth", "normal"),
        Triple("🚀 Trigger Refactoring Pipeline", "grok", "high"),
        Triple("🕊️ Run Diagnostic DAG Loop", "hermes", "normal"),
        Triple("🦙 Run Local Zero-Cloud Inference", "ollama", "normal")
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .navigationBarsPadding()
    ) {
        // Sheet Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = "🛠️", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "SWARM COMMAND TOOLS",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 0.5.sp
                )
            }
            IconButton(onClick = onClose, modifier = Modifier.size(28.dp)) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = TextMuted, modifier = Modifier.size(16.dp))
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Target Agent Selector
        Text(
            text = "TARGET AGENT",
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Bold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            agents.forEach { agentId ->
                val isSelected = currentAgent == agentId
                val info = getAgentInfo(agentId)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) info.color.copy(alpha = 0.2f) else SurfaceCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) info.color else BorderSubtle,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable { onSelectAgent(agentId) }
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = info.emoji, fontSize = 12.sp)
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = "@${info.id}",
                            fontSize = 11.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) info.color else TextSecondary,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Priority Selector
        Text(
            text = "TRANSMISSION PRIORITY",
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Bold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            priorities.forEach { prio ->
                val isSelected = currentPriority == prio
                val color = when (prio) {
                    "urgent" -> CrimsonAlert
                    "high" -> AmberWarning
                    else -> CyanSoft
                }
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isSelected) color.copy(alpha = 0.2f) else SurfaceCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) color else BorderSubtle,
                            shape = RoundedCornerShape(10.dp)
                        )
                        .clickable { onSelectPriority(prio) }
                        .padding(vertical = 6.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = prio.uppercase(),
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) color else TextSecondary,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Slash Commands Grid
        Text(
            text = "SLASH COMMANDS",
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Bold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            slashCommands.forEach { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceCard)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                        .clickable { onSelectCommand(item.samplePayload) }
                        .padding(horizontal = 10.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = item.icon, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = item.command,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = AlchemicalGold,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = item.description,
                                fontSize = 10.5.sp,
                                color = TextMuted,
                                maxLines = 1
                            )
                        }
                    }
                    Text(
                        text = "INSERT",
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Tactical Macros
        Text(
            text = "QUICK TACTICAL DISPATCHES",
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Bold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            macros.forEach { (label, macroAgent, macroPrio) ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                        .clickable { onExecuteMacro(label, macroAgent, macroPrio) }
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        color = TextPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))
    }
}
