package com.example.zothsignalbridge.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import com.example.zothsignalbridge.ui.components.AssetPetCardImage
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.HealthAndSafety
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.ModelTraining
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
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
import com.example.zothsignalbridge.data.models.KnowledgeDoc
import com.example.zothsignalbridge.data.models.SwarmPet
import com.example.zothsignalbridge.data.repository.PetsDataProvider
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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class PetsViewTab(val title: String) {
    SPIRITS_DECK("Companion Spirits"),
    KNOWLEDGE_DOCS("Knowledge Docs")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PetsScreen(
    pets: List<SwarmPet> = emptyList(),
    onFeedPet: (petId: String) -> Unit = {},
    onPetCompanion: (petId: String) -> Unit = {},
    onTrainPet: (petId: String) -> Unit = {},
    onSendPetPrompt: (petId: String, prompt: String) -> Unit = { _, _ -> },
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val listState = rememberLazyListState()

    // Default pets if empty
    val effectivePets = remember(pets) {
        if (pets.isNotEmpty()) pets else PetsDataProvider.getInitialPets()
    }

    // Knowledge docs catalog state
    val knowledgeDocs = remember { PetsDataProvider.getInitialKnowledgeDocs() }
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategoryFilter by remember { mutableStateOf("ALL") }
    var currentTab by remember { mutableStateOf(PetsViewTab.SPIRITS_DECK) }

    // Re-indexing state per pet ID (petId -> ReindexProgress/State)
    val reindexingStateMap = remember { mutableStateMapOf<String, Boolean>() }
    val reindexStepMap = remember { mutableStateMapOf<String, String>() }
    val localHealedMap = remember { mutableStateMapOf<String, String>() }

    // Selected pet for detailed diagnostic modal sheet
    var selectedPetForModal by remember { mutableStateOf<SwarmPet?>(null) }
    val activeModalPet = effectivePets.find { it.id == selectedPetForModal?.id } ?: selectedPetForModal

    // Filter knowledge docs
    val filteredDocs = remember(searchQuery, selectedCategoryFilter, knowledgeDocs) {
        knowledgeDocs.filter { doc ->
            val matchesCategory = selectedCategoryFilter == "ALL" || doc.category.equals(selectedCategoryFilter, ignoreCase = true)
            val matchesSearch = if (searchQuery.isBlank()) {
                true
            } else {
                val q = searchQuery.trim().lowercase()
                doc.title.lowercase().contains(q) ||
                doc.snippet.lowercase().contains(q) ||
                doc.category.lowercase().contains(q) ||
                doc.petName.lowercase().contains(q) ||
                doc.petId.lowercase().contains(q) ||
                doc.tags.any { it.lowercase().contains(q) }
            }
            matchesCategory && matchesSearch
        }
    }

    // Filter spirits deck if searching
    val filteredSpirits = remember(searchQuery, effectivePets) {
        if (searchQuery.isBlank()) {
            effectivePets
        } else {
            val q = searchQuery.trim().lowercase()
            effectivePets.filter { pet ->
                pet.name.lowercase().contains(q) ||
                pet.species.lowercase().contains(q) ||
                pet.roleTitle.lowercase().contains(q) ||
                pet.specialty.lowercase().contains(q) ||
                pet.activeWatchdogs.any { it.lowercase().contains(q) }
            }
        }
    }

    // Total docs indexed across all spirits
    val totalDocsCount = remember(effectivePets) {
        effectivePets.sumOf { it.docCount }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        // 1. Companion Spirits Deck Header
        CompanionSpiritsHeader(
            spiritsCount = effectivePets.size,
            totalDocs = totalDocsCount,
            avgHealth = if (effectivePets.isNotEmpty()) effectivePets.map { it.healthPercentage }.average().toInt() else 99
        )

        // 2. Knowledge Docs & Spirits Search Bar
        KnowledgeSearchBar(
            searchQuery = searchQuery,
            onQueryChange = { searchQuery = it },
            onClear = { searchQuery = "" }
        )

        // 3. Tab & Category Selector
        DeckAndDocTabSelector(
            currentTab = currentTab,
            onTabSelected = { currentTab = it },
            docsCount = filteredDocs.size,
            spiritsCount = filteredSpirits.size,
            selectedCategory = selectedCategoryFilter,
            onCategorySelected = { selectedCategoryFilter = it }
        )

        Spacer(modifier = Modifier.height(4.dp))

        // 4. Main Content: Spirits Deck or Knowledge Docs
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

            if (currentTab == PetsViewTab.SPIRITS_DECK) {
                // Section Title
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "COMPANION SPIRITS DECK",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = AlchemicalGold,
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "${filteredSpirits.size} Spirits Active",
                            fontSize = 11.sp,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Companion Spirit Cards List
                items(filteredSpirits, key = { it.id }) { spirit ->
                    val isReindexing = reindexingStateMap[spirit.id] == true
                    val currentStep = reindexStepMap[spirit.id] ?: ""
                    val healedTime = localHealedMap[spirit.id] ?: spirit.lastHealed

                    CompanionSpiritCard(
                        pet = spirit,
                        lastHealedDisplay = healedTime,
                        isReindexing = isReindexing,
                        reindexStep = currentStep,
                        onClick = { selectedPetForModal = spirit },
                        onReindexClick = {
                            coroutineScope.launch {
                                reindexingStateMap[spirit.id] = true
                                reindexStepMap[spirit.id] = "Scanning AST tree..."
                                delay(600)
                                reindexStepMap[spirit.id] = "Generating 1536-dim vector embeddings..."
                                delay(700)
                                reindexStepMap[spirit.id] = "Verifying Merkle hash..."
                                delay(500)
                                reindexingStateMap[spirit.id] = false
                                reindexStepMap[spirit.id] = ""
                                localHealedMap[spirit.id] = "Just now"
                                Toast.makeText(context, "✓ ${spirit.name}'s knowledge index synchronized (${spirit.docCount} docs)", Toast.LENGTH_SHORT).show()
                            }
                        },
                        onFeed = { onFeedPet(spirit.id) },
                        onPraise = { onPetCompanion(spirit.id) },
                        onTrain = { onTrainPet(spirit.id) }
                    )
                }
            } else {
                // Knowledge Docs Library View
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "INDEXED KNOWLEDGE BASE",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "${filteredDocs.size} / ${knowledgeDocs.size} Docs",
                            fontSize = 11.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                if (filteredDocs.isEmpty()) {
                    item {
                        EmptyKnowledgeDocsView(
                            searchQuery = searchQuery,
                            onReset = {
                                searchQuery = ""
                                selectedCategoryFilter = "ALL"
                            }
                        )
                    }
                } else {
                    items(filteredDocs, key = { it.id }) { doc ->
                        KnowledgeDocCard(
                            doc = doc,
                            onReindexDoc = {
                                Toast.makeText(context, "⚡ Re-indexing: ${doc.title}", Toast.LENGTH_SHORT).show()
                            },
                            onInspectPet = {
                                val targetPet = effectivePets.find { it.id == doc.petId }
                                if (targetPet != null) {
                                    selectedPetForModal = targetPet
                                }
                            }
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }

    // 5. Modal Bottom Sheet for Pet Diagnostic Details and Re-Indexing
    activeModalPet?.let { spirit ->
        val isReindexing = reindexingStateMap[spirit.id] == true
        val currentStep = reindexStepMap[spirit.id] ?: ""
        val healedTime = localHealedMap[spirit.id] ?: spirit.lastHealed

        ModalBottomSheet(
            onDismissRequest = { selectedPetForModal = null },
            sheetState = sheetState,
            containerColor = SurfaceDark,
            dragHandle = {
                Box(
                    modifier = Modifier
                        .padding(top = 12.dp, bottom = 8.dp)
                        .size(width = 42.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(BorderCyan)
                )
            },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            CompanionDiagnosticsModalContent(
                pet = spirit,
                lastHealedDisplay = healedTime,
                isReindexing = isReindexing,
                reindexStep = currentStep,
                onReindexDocs = {
                    coroutineScope.launch {
                        reindexingStateMap[spirit.id] = true
                        reindexStepMap[spirit.id] = "Scanning AST tree & symbol nodes..."
                        delay(600)
                        reindexStepMap[spirit.id] = "Embedding chunks into 1536-dim vector space..."
                        delay(700)
                        reindexStepMap[spirit.id] = "Verifying Merkle root (${spirit.merkleRoot})..."
                        delay(500)
                        reindexingStateMap[spirit.id] = false
                        reindexStepMap[spirit.id] = ""
                        localHealedMap[spirit.id] = "Just now"
                        Toast.makeText(context, "✓ Re-indexed ${spirit.docCount} docs for ${spirit.name}", Toast.LENGTH_SHORT).show()
                    }
                },
                onTriggerSelfHealing = {
                    localHealedMap[spirit.id] = "Just now"
                    Toast.makeText(context, "✨ Self-Healing Sweep complete. Integrity restored to 100%.", Toast.LENGTH_SHORT).show()
                },
                onFeed = { onFeedPet(spirit.id) },
                onPraise = { onPetCompanion(spirit.id) },
                onTrain = { onTrainPet(spirit.id) },
                onSendPrompt = { prompt ->
                    onSendPetPrompt(spirit.id, prompt)
                    coroutineScope.launch {
                        sheetState.hide()
                        selectedPetForModal = null
                    }
                },
                onClose = {
                    coroutineScope.launch {
                        sheetState.hide()
                        selectedPetForModal = null
                    }
                }
            )
        }
    }
}

@Composable
private fun CompanionSpiritsHeader(
    spiritsCount: Int,
    totalDocs: Int,
    avgHealth: Int
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
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = "Companion Spirits",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "COMPANION SPIRITS DECK",
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.2.sp
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "Kai · Nyx · Sol · Zephyr · Knowledge Mesh",
                fontSize = 11.sp,
                color = TextSecondary
            )
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(SurfaceElevated)
                .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = "$totalDocs Docs · $avgHealth% Health",
                fontSize = 10.5.sp,
                fontWeight = FontWeight.Medium,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
private fun KnowledgeSearchBar(
    searchQuery: String,
    onQueryChange: (String) -> Unit,
    onClear: () -> Unit
) {
    OutlinedTextField(
        value = searchQuery,
        onValueChange = onQueryChange,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        placeholder = {
            Text(
                text = "Search knowledge docs, AST symbols, protocols, spirits...",
                fontSize = 12.sp,
                color = TextMuted
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = CyanSoft,
                modifier = Modifier.size(18.dp)
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
            focusedBorderColor = CyanSoft,
            unfocusedBorderColor = BorderSubtle,
            focusedTextColor = TextPrimary,
            unfocusedTextColor = TextPrimary,
            cursorColor = CyanSoft
        )
    )
}

@Composable
private fun DeckAndDocTabSelector(
    currentTab: PetsViewTab,
    onTabSelected: (PetsViewTab) -> Unit,
    docsCount: Int,
    spiritsCount: Int,
    selectedCategory: String,
    onCategorySelected: (String) -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // Main Tab Row (Spirits Deck vs Knowledge Docs)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            PetsViewTab.values().forEach { tab ->
                val isSelected = currentTab == tab
                val count = if (tab == PetsViewTab.SPIRITS_DECK) spiritsCount else docsCount

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(if (isSelected) SurfaceElevated else SurfaceCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) CyanSoft else BorderSubtle,
                            shape = RoundedCornerShape(10.dp)
                        )
                        .clickable { onTabSelected(tab) }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (tab == PetsViewTab.SPIRITS_DECK) Icons.Default.Pets else Icons.Default.Description,
                            contentDescription = tab.title,
                            tint = if (isSelected) CyanSoft else TextMuted,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = tab.title,
                            fontSize = 11.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) TextPrimary else TextMuted
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(if (isSelected) CyanSoft.copy(alpha = 0.2f) else SurfaceDark)
                                .padding(horizontal = 5.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = count.toString(),
                                fontSize = 9.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) CyanSoft else TextMuted,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }

        // Category Filter Chips for Knowledge Docs
        if (currentTab == PetsViewTab.KNOWLEDGE_DOCS) {
            val categories = listOf("ALL", "AST / Architecture", "Security", "Governance", "Network", "UI / Sensory", "Intelligence")
            LazyRow(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(categories) { category ->
                    val isSelected = selectedCategory == category
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) SurfaceHighlight else SurfaceCard)
                            .border(
                                width = 1.dp,
                                color = if (isSelected) CyanSoft else BorderSubtle,
                                shape = RoundedCornerShape(16.dp)
                            )
                            .clickable { onCategorySelected(category) }
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = category,
                            fontSize = 10.5.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) CyanSoft else TextSecondary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CompanionSpiritCard(
    pet: SwarmPet,
    lastHealedDisplay: String,
    isReindexing: Boolean,
    reindexStep: String,
    onClick: () -> Unit,
    onReindexClick: () -> Unit,
    onFeed: () -> Unit,
    onPraise: () -> Unit,
    onTrain: () -> Unit
) {
    val context = LocalContext.current
    val signatureColor = getSpiritSignatureColor(pet.id)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCard)
            .border(1.dp, signatureColor.copy(alpha = 0.35f), RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Column {
            // Header Row: Avatar, Name & Role, Health Status Indicator
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Spirit Portrait Avatar
                AssetPetCardImage(
                    petId = pet.id,
                    fallbackEmoji = pet.avatarEmoji,
                    size = 48.dp
                )

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = pet.name,
                                fontSize = 15.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "@${pet.id}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = signatureColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        // Health Status Indicator Badge
                        HealthStatusPill(
                            status = pet.healthStatus,
                            percentage = pet.healthPercentage
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = pet.roleTitle.ifBlank { pet.specialty },
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = signatureColor,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Subtitle / Specialty
            Text(
                text = pet.specialty,
                fontSize = 11.5.sp,
                color = TextSecondary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Clean Metrics Badges Row: Doc Count & Healed Timestamp
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Doc Count Indicator
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Description,
                            contentDescription = "Docs",
                            tint = CyanSoft,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = "${pet.docCount} Knowledge Docs",
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Healed Timestamp Indicator
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.HealthAndSafety,
                            contentDescription = "Healed",
                            tint = EmeraldSoft,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = "Healed: $lastHealedDisplay",
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.Medium,
                            color = EmeraldSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Vitality & Energy Progress Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Energy Bar
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Energy", fontSize = 9.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
                        Text(text = "${pet.energy}%", fontSize = 9.sp, color = EmeraldSoft, fontFamily = FontFamily.Monospace)
                    }
                    Spacer(modifier = Modifier.height(3.dp))
                    LinearProgressIndicator(
                        progress = { (pet.energy.toFloat() / 100f).coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp)
                            .clip(RoundedCornerShape(2.dp)),
                        color = EmeraldOnline,
                        trackColor = SurfaceElevated
                    )
                }

                // Bond Affinity Bar
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Bond Affinity", fontSize = 9.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
                        Text(text = "${pet.bondLevel}%", fontSize = 9.sp, color = SovereignPurple, fontFamily = FontFamily.Monospace)
                    }
                    Spacer(modifier = Modifier.height(3.dp))
                    LinearProgressIndicator(
                        progress = { (pet.bondLevel.toFloat() / 100f).coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp)
                            .clip(RoundedCornerShape(2.dp)),
                        color = SovereignPurple,
                        trackColor = SurfaceElevated
                    )
                }
            }

            // Re-indexing In-Progress Animation Banner
            if (isReindexing) {
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceHighlight)
                        .border(1.dp, CyanNeon.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 6.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Syncing",
                                tint = CyanNeon,
                                modifier = Modifier.size(12.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Re-indexing: $reindexStep",
                                fontSize = 10.sp,
                                color = CyanNeon,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(3.dp)
                                .clip(RoundedCornerShape(1.5.dp)),
                            color = CyanNeon,
                            trackColor = SurfaceElevated
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Action Buttons & Diagnostics CTA
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Feed
                    Button(
                        onClick = {
                            onFeed()
                            Toast.makeText(context, "⚡ Fed Data Core to ${pet.name}", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = AlchemicalGold),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(30.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Bolt, contentDescription = "Feed", modifier = Modifier.size(11.dp))
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(text = "Feed", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Praise
                    Button(
                        onClick = {
                            onPraise()
                            Toast.makeText(context, "💖 Praised ${pet.name}", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = SovereignPurple),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(30.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Favorite, contentDescription = "Praise", modifier = Modifier.size(11.dp))
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(text = "Praise", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Quick Re-index Trigger
                    Button(
                        onClick = onReindexClick,
                        enabled = !isReindexing,
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = CyanSoft),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.height(30.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Refresh, contentDescription = "Re-index", modifier = Modifier.size(11.dp))
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(text = "Re-index", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Diagnostics ➔",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = signatureColor
                    )
                }
            }
        }
    }
}

@Composable
fun HealthStatusPill(status: String, percentage: Int) {
    val (statusColor, badgeText) = when {
        percentage >= 99 -> EmeraldOnline to "${status.ifBlank { "HEALTHY" }} ($percentage%)"
        percentage >= 95 -> CyanSoft to "${status.ifBlank { "OPTIMAL" }} ($percentage%)"
        percentage >= 80 -> AmberWarning to "${status.ifBlank { "ALERT" }} ($percentage%)"
        else -> CrimsonAlert to "${status.ifBlank { "DEGRADED" }} ($percentage%)"
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(statusColor.copy(alpha = 0.15f))
            .border(1.dp, statusColor.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(statusColor)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = badgeText,
            fontSize = 9.5.sp,
            fontWeight = FontWeight.Bold,
            color = statusColor,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun KnowledgeDocCard(
    doc: KnowledgeDoc,
    onReindexDoc: () -> Unit,
    onInspectPet: () -> Unit
) {
    val petColor = getSpiritSignatureColor(doc.petId)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(12.dp)
    ) {
        Column {
            // Header Row: Category Badge, Title, Associated Companion
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = doc.category.uppercase(),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Companion attribution pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(petColor.copy(alpha = 0.12f))
                        .clickable(onClick = onInspectPet)
                        .padding(horizontal = 7.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "Indexed by @${doc.petName}",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = petColor,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = doc.title,
                fontSize = 13.5.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = doc.snippet,
                fontSize = 11.5.sp,
                color = TextSecondary,
                lineHeight = 16.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Tags & Meta Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    doc.tags.take(3).forEach { tag ->
                        Text(
                            text = "#$tag",
                            fontSize = 10.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "${doc.chunkCount} Chunks · ${doc.lastUpdated}",
                        fontSize = 9.5.sp,
                        color = TextMuted,
                        fontFamily = FontFamily.Monospace
                    )

                    Button(
                        onClick = onReindexDoc,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SurfaceElevated,
                            contentColor = CyanSoft
                        ),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.height(26.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reindex",
                                modifier = Modifier.size(10.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(text = "Sync", fontSize = 9.5.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EmptyKnowledgeDocsView(
    searchQuery: String,
    onReset: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = "🔍", fontSize = 36.sp)
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "No Knowledge Docs Found",
                fontSize = 14.5.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (searchQuery.isNotBlank()) "No docs matching \"$searchQuery\"." else "No documentation found in this category.",
                fontSize = 12.sp,
                color = TextMuted,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onReset,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SurfaceElevated,
                    contentColor = CyanSoft
                ),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(text = "Reset Search Filters", fontSize = 11.5.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CompanionDiagnosticsModalContent(
    pet: SwarmPet,
    lastHealedDisplay: String,
    isReindexing: Boolean,
    reindexStep: String,
    onReindexDocs: () -> Unit,
    onTriggerSelfHealing: () -> Unit,
    onFeed: () -> Unit,
    onPraise: () -> Unit,
    onTrain: () -> Unit,
    onSendPrompt: (String) -> Unit,
    onClose: () -> Unit
) {
    var promptText by remember { mutableStateOf("") }
    val clipboardManager = LocalClipboardManager.current
    val context = LocalContext.current
    val signatureColor = getSpiritSignatureColor(pet.id)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp)
            .navigationBarsPadding()
    ) {
        // Modal Header: Avatar, Name, Role, Health Pill, Close
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(SurfaceElevated)
                        .border(2.dp, signatureColor, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = pet.avatarEmoji, fontSize = 28.sp)
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = pet.name,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        HealthStatusPill(status = pet.healthStatus, percentage = pet.healthPercentage)
                    }
                    Text(
                        text = pet.roleTitle.ifBlank { pet.species },
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = signatureColor,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Species: ${pet.species} · LVL ${pet.level}",
                        fontSize = 11.5.sp,
                        color = TextSecondary
                    )
                }
            }

            IconButton(
                onClick = onClose,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(SurfaceElevated)
                    .size(32.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Close",
                    tint = TextMuted,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Diagnostic Telemetry Metrics Grid
        Text(
            text = "DIAGNOSTIC TELEMETRY & HEALTH",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(6.dp))

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                DiagnosticStatItem(title = "Health Integrity", value = "${pet.healthPercentage}% (Healthy)", color = EmeraldOnline, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                DiagnosticStatItem(title = "Indexed Knowledge", value = "${pet.docCount} Documents", color = CyanSoft, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                DiagnosticStatItem(title = "Last Healed Sweep", value = lastHealedDisplay, color = EmeraldSoft, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                DiagnosticStatItem(title = "Query Latency", value = "${pet.latencyMs}ms (Sub-ms)", color = AlchemicalGold, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                DiagnosticStatItem(title = "Memory Allocation", value = "${pet.memoryUsageMb} MB / 128 MB", color = TextPrimary, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                DiagnosticStatItem(title = "Vector Embeddings", value = "${pet.vectorChunkCount} Chunks", color = SovereignPurple, modifier = Modifier.weight(1f))
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Merkle Tree Root Hash Box (with Copy button)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(SurfaceElevated)
                .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                .padding(horizontal = 12.dp, vertical = 10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "MERKLE AST ROOT HASH",
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = pet.merkleRoot,
                        fontSize = 11.5.sp,
                        color = TextPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                }

                IconButton(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(pet.merkleRoot))
                        Toast.makeText(context, "Copied Merkle root: ${pet.merkleRoot}", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy Hash",
                        tint = CyanSoft,
                        modifier = Modifier.size(15.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Active Watchdog Subroutines
        Text(
            text = "ACTIVE WATCHDOG SUBROUTINES",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = CyanSoft,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(6.dp))

        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val watchdogs = if (pet.activeWatchdogs.isNotEmpty()) pet.activeWatchdogs else listOf("Health Daemon", "Vector Indexer", "Heartbeat Monitor")
            watchdogs.forEach { watchdog ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(EmeraldOnline)
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = watchdog,
                        fontSize = 10.5.sp,
                        color = TextSecondary,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Re-Indexing Engine Box
        Text(
            text = "KNOWLEDGE RE-INDEXING ENGINE",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(6.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, signatureColor.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Vector & AST Indexer",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "${pet.docCount} docs mapped to 1536-dim embeddings",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }

                    Button(
                        onClick = onReindexDocs,
                        enabled = !isReindexing,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = signatureColor,
                            contentColor = VoidBlack
                        ),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reindex",
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (isReindexing) "Indexing..." else "Re-index Docs",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                if (isReindexing) {
                    Spacer(modifier = Modifier.height(10.dp))
                    LinearProgressIndicator(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp)
                            .clip(RoundedCornerShape(2.dp)),
                        color = signatureColor,
                        trackColor = SurfaceElevated
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = reindexStep,
                        fontSize = 10.sp,
                        color = signatureColor,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Diagnostic Operations Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = onTriggerSelfHealing,
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = EmeraldSoft),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.HealthAndSafety, contentDescription = "Heal", modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Heal Sweep", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            Button(
                onClick = {
                    onFeed()
                    Toast.makeText(context, "⚡ Fed Data Core to ${pet.name}", Toast.LENGTH_SHORT).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = AlchemicalGold),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Bolt, contentDescription = "Feed", modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Feed (+25%)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            Button(
                onClick = {
                    onPraise()
                    Toast.makeText(context, "💖 Praised ${pet.name}", Toast.LENGTH_SHORT).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = SovereignPurple),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.weight(1f)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Favorite, contentDescription = "Praise", modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Praise (+5%)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Direct Neural Bridge Command Dispatcher
        Text(
            text = "TRANSMIT VIA ${pet.name.uppercase()}'S NEURAL BRIDGE",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = CyanSoft,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Route operator dispatches directly through ${pet.name}'s verified knowledge tunnel.",
            fontSize = 11.5.sp,
            color = TextMuted
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = promptText,
                onValueChange = { promptText = it },
                placeholder = { Text("Command to route through ${pet.name}...", fontSize = 12.sp, color = TextMuted) },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = SurfaceCard,
                    unfocusedContainerColor = SurfaceCard,
                    focusedBorderColor = CyanSoft,
                    unfocusedBorderColor = BorderSubtle,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                )
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (promptText.isNotBlank()) {
                        onSendPrompt(promptText.trim())
                        Toast.makeText(context, "Dispatched via ${pet.name}", Toast.LENGTH_SHORT).show()
                        promptText = ""
                    }
                },
                enabled = promptText.isNotBlank(),
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(if (promptText.isNotBlank()) CyanNeon else SurfaceElevated)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Send",
                    tint = if (promptText.isNotBlank()) VoidBlack else TextMuted,
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun DiagnosticStatItem(
    title: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(text = title, fontSize = 9.5.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = value, fontSize = 12.5.sp, fontWeight = FontWeight.Bold, color = color, fontFamily = FontFamily.Monospace)
    }
}

fun getSpiritSignatureColor(id: String): Color {
    return when (id.lowercase()) {
        "kai" -> CyanSoft
        "nyx" -> SovereignPurple
        "sol" -> AlchemicalGold
        "zephyr" -> EmeraldOnline
        "azor" -> GoldAccent
        "ignis" -> AmberWarning
        else -> CyanSoft
    }
}

