package com.example.zothsignalbridge.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import com.example.zothsignalbridge.ui.components.AssetAvatar
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
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.SheetState
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.AgentArchetype
import com.example.zothsignalbridge.data.models.AgentCategory
import com.example.zothsignalbridge.data.models.PantheonData
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderGold
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PantheonScreen(
    onStartPrivateTransmission: (agentId: String) -> Unit,
    modifier: Modifier = Modifier,
    archetypes: List<AgentArchetype> = PantheonData.archetypes
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(AgentCategory.ALL) }
    var selectedArchetypeForModal by remember { mutableStateOf<AgentArchetype?>(null) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    // Filter archetypes based on search query and category
    val filteredArchetypes = remember(searchQuery, selectedCategory, archetypes) {
        archetypes.filter { archetype ->
            val matchesCategory = selectedCategory == AgentCategory.ALL || archetype.category == selectedCategory
            val matchesSearch = if (searchQuery.isBlank()) {
                true
            } else {
                val q = searchQuery.trim().lowercase()
                archetype.name.lowercase().contains(q) ||
                archetype.id.lowercase().contains(q) ||
                archetype.title.lowercase().contains(q) ||
                archetype.alchemicalDomain.lowercase().contains(q) ||
                archetype.axiom.lowercase().contains(q) ||
                archetype.hermeticRank.lowercase().contains(q) ||
                archetype.hermeticPrinciple.lowercase().contains(q) ||
                archetype.capabilities.any { it.title.lowercase().contains(q) || it.description.lowercase().contains(q) } ||
                archetype.tools.any { it.lowercase().contains(q) }
            }
            matchesCategory && matchesSearch
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        // Pantheon Top Header
        PantheonHeader(
            totalCount = archetypes.size,
            visibleCount = filteredArchetypes.size
        )

        // Search Bar
        PantheonSearchBar(
            searchQuery = searchQuery,
            onQueryChange = { searchQuery = it },
            onClear = { searchQuery = "" }
        )

        // Category Filter Chips
        PantheonCategoryFilterRow(
            selectedCategory = selectedCategory,
            onCategorySelected = { selectedCategory = it },
            archetypes = archetypes
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Archetypes Catalog List
        if (filteredArchetypes.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(text = "🔮", fontSize = 36.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "No Archetypes Match Query",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Try clearing filters or search by tool, domain, or principle.",
                        fontSize = 12.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Button(
                        onClick = {
                            searchQuery = ""
                            selectedCategory = AgentCategory.ALL
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SurfaceElevated,
                            contentColor = CyanSoft
                        ),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(text = "Reset Filters", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
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
                    Spacer(modifier = Modifier.height(4.dp))
                }

                items(filteredArchetypes, key = { it.id }) { archetype ->
                    ArchetypeCard(
                        archetype = archetype,
                        onClick = {
                            selectedArchetypeForModal = archetype
                        }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }

    // Full Character Lore Modal Sheet
    selectedArchetypeForModal?.let { archetype ->
        ModalBottomSheet(
            onDismissRequest = { selectedArchetypeForModal = null },
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
            CharacterLoreModalContent(
                archetype = archetype,
                onClose = {
                    coroutineScope.launch {
                        sheetState.hide()
                        selectedArchetypeForModal = null
                    }
                },
                onStartPrivateTransmission = {
                    coroutineScope.launch {
                        sheetState.hide()
                        selectedArchetypeForModal = null
                        onStartPrivateTransmission(archetype.id)
                    }
                }
            )
        }
    }
}

@Composable
private fun PantheonHeader(
    totalCount: Int,
    visibleCount: Int
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
                    contentDescription = "Pantheon",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "AGENT PANTHEON",
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.2.sp
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "21 Sovereign Archetypes · Local Mesh & Swarm Codex",
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
                text = "$visibleCount / $totalCount Active",
                fontSize = 10.5.sp,
                fontWeight = FontWeight.Medium,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
private fun PantheonSearchBar(
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
                text = "Search archetypes, domains, tools, lore...",
                fontSize = 12.5.sp,
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
private fun PantheonCategoryFilterRow(
    selectedCategory: AgentCategory,
    onCategorySelected: (AgentCategory) -> Unit,
    archetypes: List<AgentArchetype>
) {
    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(AgentCategory.values()) { category ->
            val count = if (category == AgentCategory.ALL) {
                archetypes.size
            } else {
                archetypes.count { it.category == category }
            }

            val isSelected = selectedCategory == category

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (isSelected) SurfaceHighlight else SurfaceCard)
                    .border(
                        width = 1.dp,
                        color = if (isSelected) CyanSoft else BorderSubtle,
                        shape = RoundedCornerShape(20.dp)
                    )
                    .clickable { onCategorySelected(category) }
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = category.displayName,
                        fontSize = 11.5.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) CyanSoft else TextSecondary
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(if (isSelected) CyanSoft.copy(alpha = 0.2f) else SurfaceElevated)
                            .padding(horizontal = 5.dp, vertical = 1.dp)
                    ) {
                        Text(
                            text = count.toString(),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) CyanSoft else TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ArchetypeCard(
    archetype: AgentArchetype,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCard)
            .border(1.dp, archetype.primaryColor.copy(alpha = 0.35f), RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Column {
            // Header Row: Avatar, Name, Pill, Rank
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Portrait Avatar Box
                val avatarPath = when (archetype.id) {
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
                AssetAvatar(
                    assetPath = avatarPath,
                    fallbackEmoji = archetype.emoji,
                    size = 46.dp,
                    borderColor = archetype.primaryColor
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
                                text = archetype.name,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "@${archetype.id}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = archetype.primaryColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        // Category Pill
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(SurfaceElevated)
                                .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = archetype.category.displayName.uppercase(),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = archetype.primaryColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = archetype.title,
                        fontSize = 11.5.sp,
                        color = TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Alchemical Domain Pill
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = archetype.glyph, fontSize = 13.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = archetype.alchemicalDomain,
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Key Capabilities Summary
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                archetype.capabilities.take(2).forEach { cap ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = cap.icon, fontSize = 11.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${cap.title}: ",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = cap.description,
                            fontSize = 11.sp,
                            color = TextMuted,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Footer Badges: Frequency, Weight, View Lore CTA
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Resonance Frequency Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "⚡ ${archetype.resonanceFrequency}",
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Medium,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // Consensus Weight Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "⚖️ ${archetype.consensusWeight.split(" ").firstOrNull() ?: ""}",
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Medium,
                            color = AlchemicalGold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Lore & Tools ➔",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = archetype.primaryColor
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun CharacterLoreModalContent(
    archetype: AgentArchetype,
    onClose: () -> Unit,
    onStartPrivateTransmission: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp)
            .navigationBarsPadding()
    ) {
        // Modal Header
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
                        .border(2.dp, archetype.primaryColor, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = archetype.emoji, fontSize = 28.sp)
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = archetype.name,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = archetype.glyph,
                            fontSize = 16.sp
                        )
                    }
                    Text(
                        text = "@${archetype.id} · ${archetype.hermeticRank}",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = archetype.primaryColor,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = archetype.title,
                        fontSize = 12.sp,
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

        // Alchemical & Hermetic Metrics Grid
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                .padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MetricColumn(title = "Alchemical Domain", value = archetype.alchemicalDomain, color = archetype.primaryColor, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                MetricColumn(title = "Resonance Frequency", value = archetype.resonanceFrequency, color = CyanSoft, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MetricColumn(title = "Hermetic Principle", value = archetype.hermeticPrinciple, color = SovereignPurple, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                MetricColumn(title = "Planetary Affinity", value = archetype.planetaryAffinity, color = AlchemicalGold, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MetricColumn(title = "Consensus Weight", value = archetype.consensusWeight, color = EmeraldOnline, modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.width(8.dp))
                MetricColumn(title = "Category / Role", value = archetype.category.displayName, color = TextPrimary, modifier = Modifier.weight(1f))
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Sacred Axiom Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(SurfaceElevated)
                .border(1.dp, archetype.primaryColor.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Column {
                Text(
                    text = "SACRED AXIOM",
                    fontSize = 9.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "“${archetype.axiom}”",
                    fontSize = 12.5.sp,
                    fontStyle = FontStyle.Italic,
                    color = TextPrimary,
                    lineHeight = 18.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Full Character Lore Description
        Text(
            text = "CHARACTER LORE & ESSENCE",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = CyanSoft,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = archetype.lore,
            fontSize = 13.sp,
            color = TextSecondary,
            lineHeight = 19.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Sovereign Capabilities Section
        Text(
            text = "SOVEREIGN CAPABILITIES",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            archetype.capabilities.forEach { cap ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceCard)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                        .padding(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.Top) {
                        Text(text = cap.icon, fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = cap.title,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = cap.description,
                                fontSize = 11.5.sp,
                                color = TextSecondary,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Accessible Tool Harnesses List
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "ACCESSIBLE TOOL HARNESSES",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp
            )
            Text(
                text = "${archetype.tools.size} Local Tools",
                fontSize = 10.5.sp,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            archetype.tools.forEach { tool ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceCard)
                        .border(1.dp, BorderCyan.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 9.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Build,
                            contentDescription = "Tool",
                            tint = CyanSoft,
                            modifier = Modifier.size(11.dp)
                        )
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = tool,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = TextPrimary,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Canonical Doctrine Box
        Text(
            text = "CANONICAL OPERATIONAL DOCTRINE",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = SovereignPurple,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(SurfaceElevated)
                .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                .padding(12.dp)
        ) {
            Text(
                text = archetype.doctrine,
                fontSize = 11.sp,
                color = TextSecondary,
                fontFamily = FontFamily.Monospace,
                lineHeight = 16.sp
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 1-Tap "Start Private Transmission" Button
        Button(
            onClick = onStartPrivateTransmission,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = archetype.primaryColor,
                contentColor = VoidBlack
            )
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Transmit",
                    modifier = Modifier.size(16.dp),
                    tint = VoidBlack
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "START PRIVATE TRANSMISSION (@${archetype.id})",
                    fontSize = 12.5.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 0.5.sp,
                    color = VoidBlack
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun MetricColumn(
    title: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(
            text = title.uppercase(),
            fontSize = 9.sp,
            fontWeight = FontWeight.Bold,
            color = TextMuted,
            fontFamily = FontFamily.Monospace
        )
        Spacer(modifier = Modifier.height(1.dp))
        Text(
            text = value,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = color,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
