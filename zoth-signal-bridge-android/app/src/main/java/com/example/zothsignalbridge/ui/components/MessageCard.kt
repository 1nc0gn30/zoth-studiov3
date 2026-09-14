package com.example.zothsignalbridge.ui.components

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.PantheonData
import com.example.zothsignalbridge.data.models.SwarmMessage
import com.example.zothsignalbridge.theme.AgentAntigravity
import com.example.zothsignalbridge.theme.AgentAzoth
import com.example.zothsignalbridge.theme.AgentGrok
import com.example.zothsignalbridge.theme.AgentHermes
import com.example.zothsignalbridge.theme.AgentOllama
import com.example.zothsignalbridge.theme.AgentOperator
import com.example.zothsignalbridge.theme.AgentSystem
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
import com.example.zothsignalbridge.theme.TextDim
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack

data class AgentInfo(
    val id: String,
    val displayName: String,
    val color: Color,
    val emoji: String,
    val role: String,
    val avatarAsset: String? = null
)

fun getAgentInfo(agentId: String): AgentInfo {
    val cleanId = agentId.lowercase().trim().removePrefix("@")
    val avatar = when (cleanId) {
        "antigravity" -> "agents/antigravity.jpg"
        "grok" -> "agents/grok.jpg"
        "hermes" -> "agents/hermes.jpg"
        "ollama" -> "agents/ollama.jpg"
        "azoth" -> "pets/azoth-neon.jpg"
        "solon" -> "pets/athena-neon.jpg"
        "draco" -> "pets/draco-neon.jpg"
        "kai" -> "pets/kai-neon.jpg"
        "kitsune" -> "pets/kitsune-neon.jpg"
        "lycan" -> "pets/lycan-neon.jpg"
        else -> null
    }

    val archetype = PantheonData.getArchetypeById(cleanId)
    if (archetype != null) {
        return AgentInfo(
            id = archetype.id,
            displayName = archetype.name,
            color = archetype.primaryColor,
            emoji = archetype.emoji,
            role = archetype.title,
            avatarAsset = avatar
        )
    }
    return when (cleanId) {
        "ollama" -> AgentInfo(
            id = "ollama",
            displayName = "Ollama Neural",
            color = AgentOllama,
            emoji = "🦙",
            role = "Local Zero-Cloud Inference (:11434)",
            avatarAsset = "agents/ollama.jpg"
        )
        "operator", "user", "you" -> AgentInfo(
            id = "operator",
            displayName = "Operator",
            color = AgentOperator,
            emoji = "👤",
            role = "Human Field Commander",
            avatarAsset = null
        )
        "all" -> AgentInfo(
            id = "all",
            displayName = "Swarm Broadcast",
            color = CyanSoft,
            emoji = "📡",
            role = "All Active Swarm Nodes",
            avatarAsset = null
        )
        else -> AgentInfo(
            id = agentId,
            displayName = agentId.replaceFirstChar { it.uppercase() },
            color = AgentSystem,
            emoji = "⚙️",
            role = "Swarm Autonomous Node",
            avatarAsset = avatar
        )
    }
}

fun getAgentMetadata(agentId: String): Pair<Color, String> {
    val info = getAgentInfo(agentId)
    return Pair(info.color, info.emoji)
}

sealed class MessageBlock {
    data class Text(val content: String) : MessageBlock()
    data class Code(val language: String, val code: String) : MessageBlock()
    data class Voice(val durationSec: Int, val transcript: String) : MessageBlock()
}

fun parseMessageBlocks(raw: String): List<MessageBlock> {
    if (raw.isBlank()) return emptyList()

    val voiceRegex = Regex("""^🎙️\s*\[(?:Tactical Audio Transmission|Voice Transmission|Voice Note)\s*-\s*0:(\d+)\]\s*(?:Transcribed:\s*)?(.*)""", RegexOption.DOT_MATCHES_ALL)
    val voiceMatch = voiceRegex.find(raw.trim())
    if (voiceMatch != null) {
        val duration = voiceMatch.groupValues[1].toIntOrNull() ?: 4
        val transcript = voiceMatch.groupValues[2].trim()
        return listOf(MessageBlock.Voice(durationSec = duration, transcript = transcript))
    }

    val codeFenceRegex = Regex("""```([a-zA-Z0-9_\-#+]*)\r?\n?(.*?)```""", RegexOption.DOT_MATCHES_ALL)
    val blocks = mutableListOf<MessageBlock>()
    var currentIndex = 0

    codeFenceRegex.findAll(raw).forEach { match ->
        if (match.range.first > currentIndex) {
            val textSegment = raw.substring(currentIndex, match.range.first)
            if (textSegment.isNotBlank()) {
                blocks.add(MessageBlock.Text(textSegment.trim()))
            }
        }
        val lang = match.groupValues[1].ifBlank { "code" }
        val code = match.groupValues[2].trimEnd()
        blocks.add(MessageBlock.Code(language = lang, code = code))
        currentIndex = match.range.last + 1
    }

    if (currentIndex < raw.length) {
        val remaining = raw.substring(currentIndex).trim()
        if (remaining.isNotBlank()) {
            blocks.add(MessageBlock.Text(remaining))
        }
    }

    return if (blocks.isEmpty()) listOf(MessageBlock.Text(raw)) else blocks
}

@Composable
fun MessageCard(
    message: SwarmMessage,
    isFirstInGroup: Boolean = true,
    isLastInGroup: Boolean = true,
    replyPreview: String? = null,
    onAgentClick: (String) -> Unit = {},
    onMessageClick: (SwarmMessage) -> Unit = {},
    onMessageLongClick: (SwarmMessage) -> Unit = {},
    modifier: Modifier = Modifier
) {
    val agentInfo = getAgentInfo(message.from)
    val isOutbound = message.isOutbound || message.from.equals("operator", ignoreCase = true)
    val blocks = remember(message.message) { parseMessageBlocks(message.message) }

    // Dynamic vertical padding for message grouping
    val topPadding = if (isFirstInGroup) 6.dp else 2.dp
    val bottomPadding = if (isLastInGroup) 6.dp else 2.dp

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(top = topPadding, bottom = bottomPadding)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = if (isOutbound) Arrangement.End else Arrangement.Start,
            verticalAlignment = Alignment.Bottom
        ) {
            // Inbound Avatar (Only shown on the LAST message of an incoming group for clean rhythm)
            if (!isOutbound) {
                if (isLastInGroup) {
                    AssetAvatar(
                        assetPath = agentInfo.avatarAsset,
                        fallbackEmoji = agentInfo.emoji,
                        size = 32.dp,
                        borderColor = agentInfo.color.copy(alpha = 0.6f),
                        modifier = Modifier.clickable { onAgentClick(message.from) }
                    )
                } else {
                    Spacer(modifier = Modifier.width(32.dp))
                }
                Spacer(modifier = Modifier.width(8.dp))
            }

            // Signal / iMessage Asymmetrical Adaptive Rounded Geometry
            val bubbleShape = if (isOutbound) {
                RoundedCornerShape(
                    topStart = 16.dp,
                    topEnd = if (isFirstInGroup) 16.dp else 4.dp,
                    bottomStart = 16.dp,
                    bottomEnd = if (isLastInGroup) 4.dp else 4.dp
                )
            } else {
                RoundedCornerShape(
                    topStart = if (isFirstInGroup) 16.dp else 4.dp,
                    topEnd = 16.dp,
                    bottomStart = if (isLastInGroup) 4.dp else 4.dp,
                    bottomEnd = 16.dp
                )
            }

            // Outer Bubble Box
            Column(
                modifier = Modifier
                    .widthIn(min = 80.dp, max = 330.dp)
                    .clip(bubbleShape)
                    .background(
                        if (isOutbound) Color(0xFF132238) else SurfaceCard
                    )
                    .border(
                        width = 1.dp,
                        color = if (isOutbound) CyanSoft.copy(alpha = 0.4f) else BorderSubtle,
                        shape = bubbleShape
                    )
                    .clickable { onMessageClick(message) }
                    .padding(horizontal = 12.dp, vertical = 9.dp)
            ) {
                // Header: Sender Name & Target (Only on First in Group)
                if (isFirstInGroup) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f, fill = false)
                        ) {
                            Text(
                                text = if (isOutbound) "You" else agentInfo.displayName,
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isOutbound) CyanSoft else agentInfo.color,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.clickable {
                                    onAgentClick(if (isOutbound) "operator" else agentInfo.id)
                                }
                            )

                            if (!isOutbound && message.to.isNotBlank() && message.to != "all") {
                                val targetInfo = getAgentInfo(message.to)
                                Text(
                                    text = " ➔ ",
                                    fontSize = 10.sp,
                                    color = TextMuted
                                )
                                Text(
                                    text = "@${targetInfo.id}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = targetInfo.color.copy(alpha = 0.85f),
                                    modifier = Modifier.clickable { onAgentClick(targetInfo.id) }
                                )
                            }
                        }

                        // Priority indicator if urgent
                        val prio = message.priority.lowercase()
                        if (prio == "urgent" || prio == "high" || prio == "emergency") {
                            val badgeColor = if (prio == "urgent" || prio == "emergency") CrimsonAlert else AmberWarning
                            Box(
                                modifier = Modifier
                                    .padding(start = 6.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(badgeColor.copy(alpha = 0.15f))
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = prio.uppercase(),
                                    fontSize = 8.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = badgeColor,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                }

                // Optional Quoted Reply Preview
                if (!replyPreview.isNullOrBlank()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 6.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceDark.copy(alpha = 0.8f))
                            .border(1.dp, BorderCyan.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = replyPreview,
                            fontSize = 11.sp,
                            color = TextMuted,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            fontFamily = FontFamily.SansSerif
                        )
                    }
                }

                // Body Content Blocks
                blocks.forEachIndexed { index, block ->
                    if (index > 0) {
                        Spacer(modifier = Modifier.height(6.dp))
                    }
                    when (block) {
                        is MessageBlock.Text -> {
                            RichMessageText(
                                text = block.content,
                                onAgentClick = onAgentClick
                            )
                        }
                        is MessageBlock.Code -> {
                            CodeSnippetView(
                                language = block.language,
                                code = block.code
                            )
                        }
                        is MessageBlock.Voice -> {
                            VoiceNotePlayerView(
                                durationSec = block.durationSec,
                                transcript = block.transcript
                            )
                        }
                    }
                }

                // Footer Timestamp & Delivery Indicator
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (message.topic.isNotBlank() && message.topic != "chat" && message.topic != "all") {
                        Text(
                            text = "#${message.topic} · ",
                            fontSize = 9.sp,
                            color = AlchemicalGold.copy(alpha = 0.8f),
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    if (message.timestamp.isNotBlank()) {
                        Text(
                            text = message.timestamp,
                            fontSize = 9.5.sp,
                            color = TextMuted
                        )
                    }

                    if (isOutbound) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = if (message.isDelivered) Icons.Default.DoneAll else Icons.Default.Check,
                            contentDescription = "Delivered",
                            tint = if (message.isDelivered) CyanNeon else TextMuted,
                            modifier = Modifier.size(11.dp)
                        )
                    }
                }
            }

            // Outbound User Avatar (Only on last message)
            if (isOutbound) {
                Spacer(modifier = Modifier.width(8.dp))
                if (isLastInGroup) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(SurfaceDark)
                            .border(1.dp, CyanSoft.copy(alpha = 0.6f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = "👤", fontSize = 14.sp)
                    }
                } else {
                    Spacer(modifier = Modifier.width(32.dp))
                }
            }
        }
    }
}

@Composable
fun RichMessageText(
    text: String,
    onAgentClick: (String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    var isExpanded by remember { mutableStateOf(false) }
    val isLongText = text.length > 260 || text.count { it == '\n' } > 4
    val displayText = if (isLongText && !isExpanded) {
        text.take(240).trimEnd() + "..."
    } else {
        text
    }

    val annotated = remember(displayText) {
        buildAnnotatedString {
            val pattern = Regex("""(@\w+|`[^`]+`|/\w+)""")
            var lastIdx = 0

            pattern.findAll(displayText).forEach { match ->
                val start = match.range.first
                val end = match.range.last + 1

                if (start > lastIdx) {
                    append(displayText.substring(lastIdx, start))
                }

                val matchedStr = match.value
                when {
                    matchedStr.startsWith("@") -> {
                        val agentName = matchedStr.removePrefix("@")
                        val color = getAgentInfo(agentName).color
                        pushStyle(
                            SpanStyle(
                                color = color,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        )
                        append(matchedStr)
                        pop()
                    }
                    matchedStr.startsWith("`") && matchedStr.endsWith("`") -> {
                        val inlineCode = matchedStr.removeSurrounding("`")
                        pushStyle(
                            SpanStyle(
                                color = CyanSoft,
                                background = VoidBlack.copy(alpha = 0.6f),
                                fontFamily = FontFamily.Monospace,
                                fontSize = 12.sp
                            )
                        )
                        append(" $inlineCode ")
                        pop()
                    }
                    matchedStr.startsWith("/") -> {
                        pushStyle(
                            SpanStyle(
                                color = AlchemicalGold,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        )
                        append(matchedStr)
                        pop()
                    }
                }
                lastIdx = end
            }

            if (lastIdx < displayText.length) {
                append(displayText.substring(lastIdx))
            }
        }
    }

    Column(modifier = modifier) {
        Text(
            text = annotated,
            fontSize = 13.5.sp,
            color = TextPrimary,
            lineHeight = 19.sp
        )

        if (isLongText) {
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = if (isExpanded) "▲ Show Less" else "▼ Read More (${text.length} chars)",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                modifier = Modifier
                    .clickable { isExpanded = !isExpanded }
                    .padding(vertical = 2.dp)
            )
        }
    }
}

@Composable
fun CodeSnippetView(
    language: String,
    code: String,
    modifier: Modifier = Modifier
) {
    val clipboardManager = LocalClipboardManager.current
    val context = LocalContext.current
    var copied by remember { mutableStateOf(false) }
    var isExpanded by remember { mutableStateOf(false) }

    val codeLines = remember(code) { code.lines() }
    val isLongSnippet = codeLines.size > 8
    val displayCode = if (isLongSnippet && !isExpanded) {
        codeLines.take(6).joinToString("\n") + "\n// ... (${codeLines.size - 6} more lines hidden)"
    } else {
        code
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(VoidBlack)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceDark)
                .padding(horizontal = 10.dp, vertical = 5.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Terminal,
                    contentDescription = null,
                    tint = AlchemicalGold,
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = language.uppercase(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace,
                    color = AlchemicalGold
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "${codeLines.size}L",
                    fontSize = 9.sp,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }

            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .clickable {
                        clipboardManager.setText(AnnotatedString(code))
                        copied = true
                        Toast.makeText(context, "Code copied", Toast.LENGTH_SHORT).show()
                    }
                    .padding(horizontal = 6.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (copied) Icons.Default.Check else Icons.Default.ContentCopy,
                    contentDescription = "Copy code",
                    tint = if (copied) EmeraldOnline else TextMuted,
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (copied) "COPIED" else "COPY",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (copied) EmeraldOnline else TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(10.dp)
        ) {
            Text(
                text = displayCode,
                fontSize = 12.sp,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                lineHeight = 17.sp
            )
        }

        if (isLongSnippet) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SurfaceElevated)
                    .clickable { isExpanded = !isExpanded }
                    .padding(vertical = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (isExpanded) "▲ Collapse Snippet" else "▼ Expand Full Snippet (${codeLines.size} lines)",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = CyanSoft,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}

@Composable
fun VoiceNotePlayerView(
    durationSec: Int,
    transcript: String,
    modifier: Modifier = Modifier
) {
    var isPlaying by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceDark)
            .border(1.dp, AlchemicalGold.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(
                onClick = { isPlaying = !isPlaying },
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(AlchemicalGold.copy(alpha = 0.15f))
            ) {
                Icon(
                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Pause" else "Play",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Voice Transmission",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = AlchemicalGold
                    )
                    Text(
                        text = "0:${durationSec.toString().padStart(2, '0')}",
                        fontSize = 10.sp,
                        color = TextMuted,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val barHeights = listOf(0.4f, 0.7f, 1.0f, 0.6f, 0.8f, 0.3f, 0.9f, 0.5f, 0.7f, 0.4f, 0.8f, 0.6f, 0.3f, 0.9f, 0.5f)
                    barHeights.forEach { h ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height((14 * h).dp)
                                .clip(RoundedCornerShape(1.dp))
                                .background(if (isPlaying) AlchemicalGold else TextMuted.copy(alpha = 0.5f))
                        )
                    }
                }
            }
        }

        if (transcript.isNotBlank()) {
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = """"$transcript"""",
                fontSize = 11.5.sp,
                color = TextSecondary,
                fontFamily = FontFamily.SansSerif
            )
        }
    }
}
