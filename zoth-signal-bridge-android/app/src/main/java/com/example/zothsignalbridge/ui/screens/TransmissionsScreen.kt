package com.example.zothsignalbridge.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Reply
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.ConnectionState
import com.example.zothsignalbridge.data.models.ConnectionStatus
import com.example.zothsignalbridge.data.models.PantheonData
import com.example.zothsignalbridge.data.models.SwarmMessage
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
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack
import com.example.zothsignalbridge.ui.components.ChannelSelector
import com.example.zothsignalbridge.ui.components.ComposerBar
import com.example.zothsignalbridge.ui.components.MessageCard
import com.example.zothsignalbridge.ui.components.getAgentInfo
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransmissionsScreen(
    messages: List<SwarmMessage>,
    selectedChannel: String,
    connectionStatus: ConnectionStatus,
    onChannelSelected: (String) -> Unit,
    onSendMessage: (to: String, message: String, priority: String) -> Unit,
    onConfigureTailscaleClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val listState = rememberLazyListState()
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val scope = rememberCoroutineScope()

    var activeActionMessage by remember { mutableStateOf<SwarmMessage?>(null) }
    var inspectingHeadersMessage by remember { mutableStateOf<SwarmMessage?>(null) }
    var replyingToMessage by remember { mutableStateOf<SwarmMessage?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    var isSearchActive by remember { mutableStateOf(false) }

    val actionSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    // Channel Filtering
    val channelFiltered = when (selectedChannel.lowercase()) {
        "all" -> messages
        "consensus" -> messages.filter { it.topic == "consensus" || it.message.contains("consensus", ignoreCase = true) }
        "claims" -> messages.filter { it.topic == "claims" || it.message.contains("claim", ignoreCase = true) }
        else -> messages.filter {
            it.from.equals(selectedChannel, ignoreCase = true) ||
            it.to.equals(selectedChannel, ignoreCase = true) ||
            it.message.contains("@$selectedChannel", ignoreCase = true)
        }
    }

    // Search Filtering
    val filteredMessages = if (searchQuery.isBlank()) {
        channelFiltered
    } else {
        val q = searchQuery.trim().lowercase()
        channelFiltered.filter {
            it.message.lowercase().contains(q) ||
            it.from.lowercase().contains(q) ||
            it.to.lowercase().contains(q) ||
            it.topic.lowercase().contains(q)
        }
    }

    // Auto-scroll to bottom on new messages
    LaunchedEffect(filteredMessages.size) {
        if (filteredMessages.isNotEmpty()) {
            listState.animateScrollToItem(filteredMessages.size - 1)
        }
    }

    val isScrolledUp by remember {
        derivedStateOf {
            val totalItems = filteredMessages.size
            if (totalItems == 0) false
            else {
                val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
                lastVisible < totalItems - 2
            }
        }
    }

    val channelCounts = messages.groupBy { it.from }.mapValues { it.value.size }
    val currentAgentInfo = getAgentInfo(selectedChannel)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        // 1. Channel Filter Chips
        ChannelSelector(
            selectedChannel = selectedChannel,
            onChannelSelected = onChannelSelected,
            messageCounts = channelCounts
        )

        // 2. Dynamic Conversation Header Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceDark)
                .border(width = 0.5.dp, color = BorderSubtle)
                .padding(horizontal = 14.dp, vertical = 8.dp)
        ) {
            if (isSearchActive) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = {
                            Text("Search in #$selectedChannel...", fontSize = 12.sp, color = TextMuted)
                        },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyanSoft,
                            unfocusedBorderColor = BorderSubtle,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            cursorColor = CyanNeon
                        ),
                        modifier = Modifier.weight(1f).height(46.dp),
                        shape = RoundedCornerShape(10.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    IconButton(
                        onClick = {
                            isSearchActive = false
                            searchQuery = ""
                        },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(Icons.Default.Close, contentDescription = "Close search", tint = TextMuted)
                    }
                }
            } else {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(SurfaceElevated)
                                .border(1.dp, currentAgentInfo.color.copy(alpha = 0.6f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = currentAgentInfo.emoji, fontSize = 16.sp)
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (selectedChannel == "all") "Swarm Broadcast" else currentAgentInfo.displayName,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(EmeraldOnline)
                                )
                            }
                            Text(
                                text = if (selectedChannel == "all") "All 12 Active Swarm Nodes" else currentAgentInfo.role,
                                fontSize = 10.5.sp,
                                color = TextMuted,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = { isSearchActive = true },
                            modifier = Modifier.size(34.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search messages",
                                tint = TextMuted,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        if (selectedChannel != "all") {
                            TextButton(
                                onClick = { onChannelSelected("all") },
                                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "All",
                                    fontSize = 11.sp,
                                    color = CyanSoft,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }

        // 3. Subtle Offline Banner
        if (connectionStatus.state == ConnectionState.OFFLINE || connectionStatus.state == ConnectionState.ERROR) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 14.dp, vertical = 4.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(AmberWarning.copy(alpha = 0.12f))
                    .clickable(onClick = onConfigureTailscaleClick)
                    .padding(horizontal = 10.dp, vertical = 5.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.WifiOff,
                            contentDescription = "Offline",
                            tint = AmberWarning,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Tailnet Standby (100.125.220.102:8484)",
                            fontSize = 11.sp,
                            color = TextPrimary
                        )
                    }
                    Text(
                        text = "RECONNECT",
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = AmberWarning,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // 4. Messages Stream
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            if (filteredMessages.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(SurfaceElevated)
                                .border(1.dp, BorderSubtle, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = currentAgentInfo.emoji, fontSize = 24.sp)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (searchQuery.isNotBlank()) "No matching transmissions" else "Start conversation with ${currentAgentInfo.displayName}",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (searchQuery.isNotBlank()) "Try another keyword or filter." else "Type a message below to dispatch prompts to this channel.",
                            fontSize = 12.sp,
                            color = TextMuted,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 12.dp)
                ) {
                    itemsIndexed(filteredMessages, key = { _, msg -> msg.id }) { index, msg ->
                        // Calculate clustering
                        val prev = filteredMessages.getOrNull(index - 1)
                        val next = filteredMessages.getOrNull(index + 1)

                        val isFirstInGroup = prev == null || prev.from != msg.from
                        val isLastInGroup = next == null || next.from != msg.from

                        MessageCard(
                            message = msg,
                            isFirstInGroup = isFirstInGroup,
                            isLastInGroup = isLastInGroup,
                            onAgentClick = { clickedAgent ->
                                onChannelSelected(clickedAgent)
                            },
                            onMessageClick = { clickedMsg ->
                                activeActionMessage = clickedMsg
                            },
                            onMessageLongClick = { clickedMsg ->
                                activeActionMessage = clickedMsg
                            }
                        )
                    }
                }
            }

            // Floating Scroll to Bottom Button
            this@Column.AnimatedVisibility(
                visible = isScrolledUp,
                enter = fadeIn() + slideInVertically { it },
                exit = fadeOut() + slideOutVertically { it },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceElevated.copy(alpha = 0.95f))
                        .border(1.dp, BorderCyan, RoundedCornerShape(20.dp))
                        .clickable {
                            scope.launch {
                                listState.animateScrollToItem(filteredMessages.size - 1)
                            }
                        }
                        .padding(horizontal = 14.dp, vertical = 7.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.ArrowDownward,
                            contentDescription = "Scroll to bottom",
                            tint = CyanNeon,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "New Messages",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                }
            }
        }

        // 5. Signal-Grade Composer Bar
        ComposerBar(
            onSendMessage = onSendMessage,
            replyToMessage = replyingToMessage,
            onDismissReply = { replyingToMessage = null },
            initialTargetAgent = if (selectedChannel in listOf("consensus", "claims")) "all" else selectedChannel
        )
    }

    // Message Action Bottom Sheet
    if (activeActionMessage != null) {
        val selectedMsg = activeActionMessage!!
        val senderInfo = getAgentInfo(selectedMsg.from)

        ModalBottomSheet(
            onDismissRequest = { activeActionMessage = null },
            sheetState = actionSheetState,
            containerColor = SurfaceDark
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = senderInfo.emoji, fontSize = 20.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "${senderInfo.displayName} · ${selectedMsg.timestamp}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = senderInfo.color
                        )
                        Text(
                            text = "ID: ${selectedMsg.id}",
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            color = TextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action Items
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable {
                            replyingToMessage = selectedMsg
                            activeActionMessage = null
                        }
                        .padding(vertical = 12.dp, horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.AutoMirrored.Filled.Reply, contentDescription = "Reply", tint = CyanSoft)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Reply to Transmission", color = TextPrimary, fontSize = 13.5.sp)
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable {
                            clipboardManager.setText(AnnotatedString(selectedMsg.message))
                            Toast.makeText(context, "Message copied to clipboard", Toast.LENGTH_SHORT).show()
                            activeActionMessage = null
                        }
                        .padding(vertical = 12.dp, horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = TextMuted)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Copy Message Text", color = TextPrimary, fontSize = 13.5.sp)
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable {
                            inspectingHeadersMessage = selectedMsg
                            activeActionMessage = null
                        }
                        .padding(vertical = 12.dp, horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Code, contentDescription = "Headers", tint = AlchemicalGold)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text("Inspect WireGuard Headers & Hash", color = TextPrimary, fontSize = 13.5.sp)
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
