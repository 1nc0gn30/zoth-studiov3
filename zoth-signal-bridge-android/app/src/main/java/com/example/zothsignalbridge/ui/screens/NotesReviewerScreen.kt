package com.example.zothsignalbridge.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.CropFree
import androidx.compose.material.icons.filled.DataObject
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.RadioButtonChecked
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Replay
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.SwarmNote
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderGold
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.EmeraldSoft
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
import com.example.zothsignalbridge.ui.components.getAgentMetadata
import kotlinx.coroutines.launch

enum class StatusFilterOption(val displayName: String) {
    ALL("All"),
    OPEN("Open"),
    RESOLVED("Resolved")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesReviewerScreen(
    notes: List<SwarmNote>,
    onToggleStatus: (noteId: String) -> Unit = {},
    onQuickReply: (to: String, text: String, priority: String) -> Unit = { _, _, _ -> },
    onRefresh: () -> Unit = {},
    onCreateNote: (title: String, author: String, content: String, tags: List<String>) -> Unit = { _, _, _, _ -> },
    onUpdateNoteStatus: (noteId: String, newStatus: NoteStatus) -> Unit = { _, _ -> },
    modifier: Modifier = Modifier
) {
    var statusFilter by remember { mutableStateOf(StatusFilterOption.ALL) }
    var selectedPageFilter by remember { mutableStateOf<String?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedNoteForModal by remember { mutableStateOf<SwarmNote?>(null) }
    var isRefreshing by remember { mutableStateOf(false) }

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    // Aggregate unique pages present in dataset
    val availablePages = remember(notes) {
        val defaults = listOf("/", "/zoth/", "/studio/swarm.html")
        val found = notes.map { it.pathname }.filter { it.isNotBlank() }
        (defaults + found).distinct()
    }

    val openCount = remember(notes) { notes.count { it.isOpen } }
    val resolvedCount = remember(notes) { notes.count { it.isResolved } }

    // Filter notes based on status, page, and search query
    val filteredNotes = remember(notes, statusFilter, selectedPageFilter, searchQuery) {
        notes.filter { note ->
            val matchesStatus = when (statusFilter) {
                StatusFilterOption.ALL -> true
                StatusFilterOption.OPEN -> note.isOpen
                StatusFilterOption.RESOLVED -> note.isResolved
            }

            val matchesPage = selectedPageFilter == null ||
                note.pathname.equals(selectedPageFilter, ignoreCase = true) ||
                (selectedPageFilter == "/" && (note.pathname == "/" || note.pathname.isBlank()))

            val matchesSearch = if (searchQuery.isBlank()) {
                true
            } else {
                val q = searchQuery.trim().lowercase()
                note.text.lowercase().contains(q) ||
                note.selector.lowercase().contains(q) ||
                note.displaySelector.lowercase().contains(q) ||
                note.pathname.lowercase().contains(q) ||
                note.taggedAgents.any { it.lowercase().contains(q) } ||
                note.category.lowercase().contains(q) ||
                note.id.lowercase().contains(q)
            }

            matchesStatus && matchesPage && matchesSearch
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 70.dp)
        ) {
            // Header with Live Telemetry Stats & Refresh
            NotesReviewerHeader(
                totalCount = notes.size,
                openCount = openCount,
                resolvedCount = resolvedCount,
                isRefreshing = isRefreshing,
                onRefreshClick = {
                    isRefreshing = true
                    onRefresh()
                    coroutineScope.launch {
                        kotlinx.coroutines.delay(800)
                        isRefreshing = false
                    }
                }
            )

            // Search Bar
            NotesReviewerSearchBar(
                searchQuery = searchQuery,
                onQueryChange = { searchQuery = it },
                onClear = { searchQuery = "" }
            )

            // Filter Pills Row (Status & Page Filters)
            NotesFilterPillsRow(
                statusFilter = statusFilter,
                onStatusFilterSelected = { statusFilter = it },
                availablePages = availablePages,
                selectedPage = selectedPageFilter,
                onPageSelected = { selectedPageFilter = it },
                totalCount = notes.size,
                openCount = openCount,
                resolvedCount = resolvedCount,
                notes = notes
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Notes List
            if (filteredNotes.isEmpty()) {
                EmptyNotesState(
                    onClearFilters = {
                        statusFilter = StatusFilterOption.ALL
                        selectedPageFilter = null
                        searchQuery = ""
                    }
                )
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item {
                        Spacer(modifier = Modifier.height(2.dp))
                    }

                    items(filteredNotes, key = { it.id }) { note ->
                        VisualAnnotationCard(
                            note = note,
                            onCardClick = { selectedNoteForModal = note },
                            onToggleStatus = { onToggleStatus(note.id) }
                        )
                    }

                    item {
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }
        }
    }

    // Modal Bottom Sheet: Full Target Details & Quick Reply to Swarm
    selectedNoteForModal?.let { note ->
        // Keep modal note state in sync if status was toggled
        val activeNoteInList = notes.find { it.id == note.id } ?: note

        ModalBottomSheet(
            onDismissRequest = { selectedNoteForModal = null },
            sheetState = sheetState,
            containerColor = SurfaceDark,
            dragHandle = {
                Box(
                    modifier = Modifier
                        .padding(top = 12.dp, bottom = 8.dp)
                        .size(width = 44.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(if (activeNoteInList.isOpen) BorderGold else BorderCyan)
                )
            },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            AnnotationDetailModalContent(
                note = activeNoteInList,
                onToggleStatus = {
                    onToggleStatus(activeNoteInList.id)
                },
                onSendQuickReply = { to, text, priority ->
                    onQuickReply(to, text, priority)
                },
                onClose = {
                    coroutineScope.launch {
                        sheetState.hide()
                        selectedNoteForModal = null
                    }
                }
            )
        }
    }
}

@Composable
private fun NotesReviewerHeader(
    totalCount: Int,
    openCount: Int,
    resolvedCount: Int,
    isRefreshing: Boolean,
    onRefreshClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (openCount > 0) AmberWarning else EmeraldOnline)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "VISUAL NOTES REVIEWER",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.2.sp
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Live DOM Swarm Annotations · :8484 /api/annotations",
                fontSize = 10.5.sp,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            // Live Status Count Pill
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(horizontal = 9.dp, vertical = 5.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "🔴 $openCount",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = CrimsonAlert,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "·", color = TextMuted, fontSize = 11.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "✅ $resolvedCount",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldOnline,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = onRefreshClick,
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(SurfaceElevated)
            ) {
                if (isRefreshing) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        color = CyanSoft,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Sync Annotations",
                        tint = CyanSoft,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun NotesReviewerSearchBar(
    searchQuery: String,
    onQueryChange: (String) -> Unit,
    onClear: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp)
    ) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = onQueryChange,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            placeholder = {
                Text(
                    text = "Filter by selector, prompt, agent, or page...",
                    fontSize = 12.sp,
                    color = TextMuted
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = TextMuted,
                    modifier = Modifier.size(17.dp)
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = onClear) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Clear",
                            tint = TextMuted,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceCard,
                unfocusedContainerColor = SurfaceCard,
                focusedBorderColor = BorderCyan,
                unfocusedBorderColor = BorderSubtle,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )
    }
}

@Composable
private fun NotesFilterPillsRow(
    statusFilter: StatusFilterOption,
    onStatusFilterSelected: (StatusFilterOption) -> Unit,
    availablePages: List<String>,
    selectedPage: String?,
    onPageSelected: (String?) -> Unit,
    totalCount: Int,
    openCount: Int,
    resolvedCount: Int,
    notes: List<SwarmNote>
) {
    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp)
    ) {
        // Status: All
        item {
            FilterPillChip(
                label = "All ($totalCount)",
                isSelected = statusFilter == StatusFilterOption.ALL && selectedPage == null,
                selectedColor = CyanSoft,
                onClick = {
                    onStatusFilterSelected(StatusFilterOption.ALL)
                    onPageSelected(null)
                }
            )
        }

        // Status: Open
        item {
            FilterPillChip(
                label = "🔴 Open ($openCount)",
                isSelected = statusFilter == StatusFilterOption.OPEN,
                selectedColor = AmberWarning,
                onClick = {
                    onStatusFilterSelected(
                        if (statusFilter == StatusFilterOption.OPEN) StatusFilterOption.ALL else StatusFilterOption.OPEN
                    )
                }
            )
        }

        // Status: Resolved
        item {
            FilterPillChip(
                label = "✅ Resolved ($resolvedCount)",
                isSelected = statusFilter == StatusFilterOption.RESOLVED,
                selectedColor = EmeraldOnline,
                onClick = {
                    onStatusFilterSelected(
                        if (statusFilter == StatusFilterOption.RESOLVED) StatusFilterOption.ALL else StatusFilterOption.RESOLVED
                    )
                }
            )
        }

        // Page Filter Pills
        items(availablePages) { page ->
            val pageNotesCount = notes.count { it.pathname.equals(page, ignoreCase = true) || (page == "/" && it.pathname.isBlank()) }
            val isSelected = selectedPage.equals(page, ignoreCase = true)

            FilterPillChip(
                label = "📄 $page ($pageNotesCount)",
                isSelected = isSelected,
                selectedColor = AlchemicalGold,
                onClick = {
                    onPageSelected(if (isSelected) null else page)
                }
            )
        }
    }
}

@Composable
private fun FilterPillChip(
    label: String,
    isSelected: Boolean,
    selectedColor: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) selectedColor.copy(alpha = 0.16f) else SurfaceCard)
            .border(
                width = 1.dp,
                color = if (isSelected) selectedColor else BorderSubtle,
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 7.dp)
    ) {
        Text(
            text = label,
            fontSize = 11.5.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) selectedColor else TextSecondary,
            fontFamily = FontFamily.Monospace
        )
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun VisualAnnotationCard(
    note: SwarmNote,
    onCardClick: () -> Unit,
    onToggleStatus: () -> Unit
) {
    val isOpen = note.isOpen
    val priorityColor = when (note.priority.lowercase()) {
        "urgent" -> CrimsonAlert
        "high" -> AmberWarning
        else -> CyanSoft
    }
    val priorityIcon = when (note.priority.lowercase()) {
        "urgent" -> "🚨"
        "high" -> "⚡"
        else -> "•"
    }

    val primaryAgent = note.taggedAgents.firstOrNull() ?: "operator"
    val (agentColor, agentEmoji) = getAgentMetadata(primaryAgent)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceCard)
            .border(
                width = 1.dp,
                color = if (isOpen) BorderGold.copy(alpha = 0.6f) else BorderSubtle,
                shape = RoundedCornerShape(14.dp)
            )
            .clickable(onClick = onCardClick)
            .padding(14.dp)
    ) {
        Column {
            // Top Metadata Row: Status Badge, Priority, Tagged Agent, Timestamp
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Status Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isOpen) AmberWarning.copy(alpha = 0.15f) else EmeraldOnline.copy(alpha = 0.15f))
                            .border(
                                width = 1.dp,
                                color = if (isOpen) AmberWarning else EmeraldOnline,
                                shape = RoundedCornerShape(6.dp)
                            )
                            .padding(horizontal = 6.dp, vertical = 2.5.dp)
                    ) {
                        Text(
                            text = if (isOpen) "🔴 OPEN" else "✅ RESOLVED",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isOpen) AmberWarning else EmeraldOnline,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Priority Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .padding(horizontal = 6.dp, vertical = 2.5.dp)
                    ) {
                        Text(
                            text = "$priorityIcon ${note.displayPriority.uppercase()}",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = priorityColor,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Tagged Agent Badge
                    if (note.taggedAgents.isNotEmpty()) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(agentColor.copy(alpha = 0.12f))
                                .padding(horizontal = 6.dp, vertical = 2.5.dp)
                        ) {
                            Text(text = agentEmoji, fontSize = 10.sp)
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(
                                text = "@${primaryAgent}",
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = agentColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                // Timestamp
                Text(
                    text = note.createdLocal.ifBlank { note.createdAt }.take(16),
                    fontSize = 10.sp,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Page Pathname & Target DOM Selector Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Page Path Badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderCyan.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "🌐 ${note.displayPage}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Selector Badge
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceDark)
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = note.displaySelector,
                        fontSize = 11.sp,
                        color = SovereignPurple,
                        fontFamily = FontFamily.Monospace,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // User Request / Note Content
            Text(
                text = note.text,
                fontSize = 13.5.sp,
                color = TextPrimary,
                lineHeight = 18.sp,
                fontWeight = FontWeight.Normal
            )

            // Optional Target Element Text Snippet
            if (note.target.elementText.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceDark)
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "Target: \"${note.target.elementText.take(80)}\"",
                        fontSize = 11.sp,
                        color = TextMuted,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // Resolution footer info if resolved
            if (note.isResolved && (note.resolvedBy != null || note.resolvedAt != null)) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "✓ Resolved by ${note.resolvedBy ?: "@operator"} on ${note.resolvedAt ?: "today"}",
                    fontSize = 10.5.sp,
                    color = EmeraldSoft,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Action Buttons Row (1-Tap Toggle & Details)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // 1-Tap Resolve / Reopen Button
                Button(
                    onClick = onToggleStatus,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isOpen) EmeraldOnline.copy(alpha = 0.18f) else AmberWarning.copy(alpha = 0.18f),
                        contentColor = if (isOpen) EmeraldOnline else AmberWarning
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.height(34.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (isOpen) Icons.Default.CheckCircle else Icons.Default.Replay,
                            contentDescription = if (isOpen) "Resolve" else "Reopen",
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = if (isOpen) "1-Tap Resolve" else "Reopen Note",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Inspect Target Button
                OutlinedButton(
                    onClick = onCardClick,
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = CyanSoft
                    ),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                    modifier = Modifier.height(34.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Visibility,
                            contentDescription = "Inspect Details",
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(text = "Inspect Target", fontSize = 11.5.sp)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AnnotationDetailModalContent(
    note: SwarmNote,
    onToggleStatus: () -> Unit,
    onSendQuickReply: (to: String, text: String, priority: String) -> Unit,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    var replyText by remember { mutableStateOf("") }
    var selectedTargetAgent by remember {
        mutableStateOf(note.taggedAgents.firstOrNull() ?: "hermes")
    }

    val isOpen = note.isOpen
    val targetRect = note.target.rect

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        // Top Modal Bar: ID, Status, Close
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = note.id,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    IconButton(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(note.id))
                            Toast.makeText(context, "Note ID copied!", Toast.LENGTH_SHORT).show()
                        },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ContentCopy,
                            contentDescription = "Copy ID",
                            tint = TextMuted,
                            modifier = Modifier.size(13.dp)
                        )
                    }
                }
                Text(
                    text = "Created: ${note.createdLocal.ifBlank { note.createdAt }}",
                    fontSize = 10.5.sp,
                    color = TextMuted
                )
            }

            IconButton(onClick = onClose) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close",
                    tint = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Main User Request Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderGold.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "OPERATOR REQUEST",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Priority: ${note.displayPriority}",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (note.priority.equals("urgent", true)) CrimsonAlert else CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = note.text,
                    fontSize = 14.sp,
                    color = TextPrimary,
                    lineHeight = 20.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Target Element & Geometry Inspector Card
        Text(
            text = "TARGET DOM & VIEWPORT GEOMETRY",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = CyanSoft,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Page URL
                GeometryDetailRow(
                    label = "Page URL",
                    value = note.pageUrl.ifBlank { "http://127.0.0.1:8088${note.pathname}" },
                    color = CyanSoft
                )

                // Selector
                GeometryDetailRow(
                    label = "Selector",
                    value = note.displaySelector,
                    color = SovereignPurple
                )

                // XPath
                if (note.target.xpath.isNotBlank()) {
                    GeometryDetailRow(
                        label = "XPath",
                        value = note.target.xpath,
                        color = TextSecondary
                    )
                }

                // Element Tag & Text
                if (note.target.elementTag.isNotBlank()) {
                    GeometryDetailRow(
                        label = "DOM Tag",
                        value = "<${note.target.elementTag}>",
                        color = AlchemicalGold
                    )
                }

                HorizontalDivider(color = BorderSubtle, modifier = Modifier.padding(vertical = 4.dp))

                // Bounding Rect Box
                Text(
                    text = "Element Bounding Rect:",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    fontFamily = FontFamily.Monospace
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    RectMetricBadge(label = "X", value = String.format(java.util.Locale.US, "%.1f", targetRect.x))
                    RectMetricBadge(label = "Y", value = String.format(java.util.Locale.US, "%.1f", targetRect.y))
                    RectMetricBadge(label = "Width", value = String.format(java.util.Locale.US, "%.1f px", targetRect.width))
                    RectMetricBadge(label = "Height", value = String.format(java.util.Locale.US, "%.1f px", targetRect.height))
                }

                Spacer(modifier = Modifier.height(2.dp))

                // Viewport & Click Coordinates
                Text(
                    text = "Viewport Coordinates:",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    fontFamily = FontFamily.Monospace
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    RectMetricBadge(label = "PageX", value = "${note.pageX.toInt()}")
                    RectMetricBadge(label = "PageY", value = "${note.pageY.toInt()}")
                    RectMetricBadge(label = "ScrollY", value = "${note.viewport.scrollY}")
                    RectMetricBadge(label = "Screen", value = "${note.viewport.width}x${note.viewport.height}")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Reply to Swarm Section
        Text(
            text = "QUICK DISPATCH PROMPT TO SWARM",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(6.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column {
                // Target Agent Selector Chips
                Text(
                    text = "Recipient Swarm Node:",
                    fontSize = 10.5.sp,
                    color = TextMuted
                )
                Spacer(modifier = Modifier.height(6.dp))

                val availableAgents = listOf("hermes", "azoth", "antigravity", "grok", "ollama", "all")
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    availableAgents.forEach { ag ->
                        val isSelected = selectedTargetAgent.equals(ag, ignoreCase = true)
                        val (agColor, agEmoji) = getAgentMetadata(ag)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) agColor.copy(alpha = 0.2f) else SurfaceElevated)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) agColor else BorderSubtle,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedTargetAgent = ag }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "$agEmoji @$ag",
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) agColor else TextSecondary,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Predefined Prompt Suggestion Chips
                Text(
                    text = "Quick Predefined Instructions:",
                    fontSize = 10.5.sp,
                    color = TextMuted
                )
                Spacer(modifier = Modifier.height(6.dp))

                val promptSuggestions = listOf(
                    "⚡ Fixing target DOM element now",
                    "🔍 Inspecting CSS hierarchy on :8088",
                    "✅ Visual alignment verified & clean",
                    "🚀 Task acknowledged & assigned to @$selectedTargetAgent"
                )

                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    promptSuggestions.forEach { prompt ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(SurfaceDark)
                                .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                                .clickable { replyText = prompt }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = prompt,
                                fontSize = 10.5.sp,
                                color = CyanSoft
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Reply Input TextField
                OutlinedTextField(
                    value = replyText,
                    onValueChange = { replyText = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text(
                            text = "Type instruction to @$selectedTargetAgent...",
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                    },
                    minLines = 2,
                    maxLines = 4,
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = SurfaceDark,
                        unfocusedContainerColor = SurfaceDark,
                        focusedBorderColor = BorderCyan,
                        unfocusedBorderColor = BorderSubtle,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Dispatch Button
                Button(
                    onClick = {
                        if (replyText.isNotBlank()) {
                            onSendQuickReply(selectedTargetAgent, replyText, "normal")
                            Toast.makeText(
                                context,
                                "Dispatched to @$selectedTargetAgent across Swarm Bus!",
                                Toast.LENGTH_SHORT
                            ).show()
                            replyText = ""
                        } else {
                            Toast.makeText(context, "Please enter instruction first", Toast.LENGTH_SHORT).show()
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CyanNeon,
                        contentColor = VoidBlack
                    ),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Send",
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Dispatch to Swarm Event Bus (:8484)",
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Modal Action Footer (Resolve / Reopen & Close)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Button(
                onClick = {
                    onToggleStatus()
                    Toast.makeText(
                        context,
                        if (isOpen) "Note marked as RESOLVED" else "Note REOPENED",
                        Toast.LENGTH_SHORT
                    ).show()
                },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isOpen) EmeraldOnline else AmberWarning,
                    contentColor = VoidBlack
                ),
                shape = RoundedCornerShape(10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isOpen) Icons.Default.CheckCircle else Icons.Default.Replay,
                        contentDescription = "Toggle",
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isOpen) "Mark as Resolved" else "Reopen Note",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            OutlinedButton(
                onClick = onClose,
                modifier = Modifier.weight(0.6f),
                shape = RoundedCornerShape(10.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary)
            ) {
                Text(text = "Close", fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun GeometryDetailRow(label: String, value: String, color: Color) {
    Column {
        Text(
            text = label,
            fontSize = 10.sp,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Text(
            text = value,
            fontSize = 11.5.sp,
            fontWeight = FontWeight.Medium,
            color = color,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
private fun RectMetricBadge(label: String, value: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceDark)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = label, fontSize = 9.5.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
            Text(text = value, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = CyanSoft, fontFamily = FontFamily.Monospace)
        }
    }
}

@Composable
private fun EmptyNotesState(onClearFilters: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = "🎯", fontSize = 38.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Zero Visual Notes Found",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "No annotations match your active filters or search query.",
                fontSize = 12.sp,
                color = TextMuted,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = onClearFilters,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SurfaceElevated,
                    contentColor = CyanSoft
                ),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(text = "Reset Filter Pills", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}
