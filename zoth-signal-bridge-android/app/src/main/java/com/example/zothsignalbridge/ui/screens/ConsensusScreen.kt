package com.example.zothsignalbridge.ui.screens

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
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
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Functions
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.AgentCodeProposal
import com.example.zothsignalbridge.data.models.AgentStakeNode
import com.example.zothsignalbridge.data.models.ConsensusArenaState
import com.example.zothsignalbridge.data.models.ConsensusTelemetry
import com.example.zothsignalbridge.data.models.DialecticItem
import com.example.zothsignalbridge.data.models.DialecticStage
import com.example.zothsignalbridge.data.models.DiffLine
import com.example.zothsignalbridge.data.models.DiffType
import com.example.zothsignalbridge.data.models.MerkleAstProof
import com.example.zothsignalbridge.data.models.VoteDecision
import com.example.zothsignalbridge.theme.AgentAntigravity
import com.example.zothsignalbridge.theme.AgentAzoth
import com.example.zothsignalbridge.theme.AgentGrok
import com.example.zothsignalbridge.theme.AgentHermes
import com.example.zothsignalbridge.theme.AgentOllama
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderGold
import com.example.zothsignalbridge.theme.BorderNeon
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
import com.example.zothsignalbridge.ui.components.getAgentMetadata

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConsensusScreen(
    state: ConsensusArenaState,
    onSelectDialecticStage: (DialecticStage) -> Unit,
    onSelectProposal: (String) -> Unit,
    onToggleAgentVote: (String, VoteDecision) -> Unit,
    onToggleByzantine: (String) -> Unit,
    onReverifyMerkleProof: () -> Unit,
    onResetConsensus: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showTelemetrySheet by remember { mutableStateOf(false) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        // Arena Header Banner
        item {
            ConsensusArenaHeader(
                round = state.telemetry.roundNumber,
                isQuorumAchieved = state.isQuorumAchieved,
                approvingStake = state.approvingStakePercent,
                onShowTelemetry = { showTelemetrySheet = true }
            )
            Spacer(modifier = Modifier.height(14.dp))
        }

        // Section 1: Active Dialectic Flow (Thesis -> Antithesis -> Synthesis)
        item {
            DialecticFlowSection(
                selectedStage = state.selectedDialecticStage,
                items = state.dialecticItems,
                onStageSelected = onSelectDialecticStage
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Section 2: Multi-Agent Code Proposals & AST Diff Viewer
        item {
            MultiAgentProposalsSection(
                proposals = state.proposals,
                selectedProposalId = state.selectedAgentProposalId,
                onSelectProposal = onSelectProposal
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Section 3: Interactive Byzantine Fault Tolerance (BFT) Quorum Gauge
        item {
            BftQuorumSection(
                state = state,
                onToggleVote = onToggleAgentVote,
                onToggleByzantine = onToggleByzantine,
                onResetConsensus = onResetConsensus
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Section 4: Merkle Root AST Triangulation Card
        item {
            MerkleAstTriangulationCard(
                proof = state.merkleProof,
                isReverifying = state.isReverifying,
                onReverify = onReverifyMerkleProof,
                onCopyHash = {
                    clipboardManager.setText(AnnotatedString(state.merkleProof.rootHash))
                    Toast.makeText(context, "Merkle Root Hash Copied to Clipboard", Toast.LENGTH_SHORT).show()
                }
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Section 5: Bottom Sheet Trigger Card
        item {
            TelemetryTriggerCard(
                telemetry = state.telemetry,
                onClick = { showTelemetrySheet = true }
            )
            Spacer(modifier = Modifier.height(28.dp))
        }
    }

    // Modal Bottom Sheet: Proof & Telemetry Details
    if (showTelemetrySheet) {
        ModalBottomSheet(
            onDismissRequest = { showTelemetrySheet = false },
            sheetState = sheetState,
            containerColor = SurfaceDark,
            contentColor = TextPrimary,
            dragHandle = {
                Box(
                    modifier = Modifier
                        .padding(top = 10.dp, bottom = 6.dp)
                        .size(width = 36.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(TextMuted.copy(alpha = 0.5f))
                )
            }
        ) {
            ProofAndTelemetryBottomSheetContent(
                state = state,
                onDismiss = { showTelemetrySheet = false }
            )
        }
    }
}

// ==================== 1. Header Banner ====================

@Composable
fun ConsensusArenaHeader(
    round: Long,
    isQuorumAchieved: Boolean,
    approvingStake: Double,
    onShowTelemetry: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(SurfaceCard, SurfaceDark)
                )
            )
            .border(1.dp, if (isQuorumAchieved) BorderCyan else BorderGold, RoundedCornerShape(14.dp))
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "CONSENSUS ARENA",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.2.sp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "R#$round",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = if (isQuorumAchieved) {
                        "Supermajority Quorum Verified · $approvingStake% Approving Stake"
                    } else {
                        "Quorum Compromised · $approvingStake% < 66.7% Threshold"
                    },
                    fontSize = 11.5.sp,
                    color = if (isQuorumAchieved) EmeraldSoft else CrimsonAlert,
                    fontFamily = FontFamily.Monospace
                )
            }

            IconButton(
                onClick = onShowTelemetry,
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(SurfaceElevated)
            ) {
                Icon(
                    imageVector = Icons.Default.Functions,
                    contentDescription = "Proof Math",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(17.dp)
                )
            }
        }
    }
}

// ==================== 2. Dialectic Flow Section ====================

@Composable
fun DialecticFlowSection(
    selectedStage: DialecticStage,
    items: List<DialecticItem>,
    onStageSelected: (DialecticStage) -> Unit
) {
    val activeItem = items.find { it.stage == selectedStage } ?: items.firstOrNull()

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "DIALECTIC FLOW",
                fontSize = 11.5.sp,
                fontWeight = FontWeight.Bold,
                color = AlchemicalGold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp
            )
            Text(
                text = "Thesis ➔ Antithesis ➔ Synthesis",
                fontSize = 10.sp,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Status Pills Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val stages = listOf(
                Triple(DialecticStage.THESIS, "Thesis", "1"),
                Triple(DialecticStage.ANTITHESIS, "Antithesis", "2"),
                Triple(DialecticStage.SYNTHESIS, "Synthesis", "3")
            )

            stages.forEachIndexed { index, (stage, label, num) ->
                val isSelected = selectedStage == stage
                val (pillBg, pillBorder, pillText) = when {
                    isSelected -> Triple(SurfaceElevated, CyanSoft, CyanNeon)
                    stage == DialecticStage.SYNTHESIS -> Triple(SurfaceCard, EmeraldOnline.copy(alpha = 0.4f), EmeraldSoft)
                    else -> Triple(SurfaceCard, BorderSubtle, TextSecondary)
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(10.dp))
                        .background(pillBg)
                        .border(1.dp, pillBorder, RoundedCornerShape(10.dp))
                        .clickable { onStageSelected(stage) }
                        .padding(vertical = 8.dp, horizontal = 6.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "$num. $label",
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = pillText
                            )
                        }
                        val statusText = items.find { it.stage == stage }?.status ?: ""
                        Text(
                            text = statusText,
                            fontSize = 8.5.sp,
                            color = if (isSelected) AlchemicalGold else TextMuted,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                if (index < stages.size - 1) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "to",
                        tint = TextDim,
                        modifier = Modifier.size(12.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Active Dialectic Detail Card
        if (activeItem != null) {
            val (agentColor, agentEmoji) = getAgentMetadata(activeItem.authorAgentId)

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
                            Text(text = agentEmoji, fontSize = 14.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = activeItem.title,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        }
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(agentColor.copy(alpha = 0.15f))
                                .border(1.dp, agentColor.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "@${activeItem.authorAgentId}",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = agentColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = activeItem.summary,
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 17.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Key Points List
                    activeItem.keyPoints.forEach { point ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Text(
                                text = "•",
                                fontSize = 12.sp,
                                color = AlchemicalGold,
                                modifier = Modifier.padding(end = 6.dp)
                            )
                            Text(
                                text = point,
                                fontSize = 11.sp,
                                color = TextMuted,
                                lineHeight = 15.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        Text(
                            text = activeItem.timestamp,
                            fontSize = 9.5.sp,
                            color = TextDim,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}

// ==================== 3. Multi-Agent Proposals & Diff Viewer ====================

@Composable
fun MultiAgentProposalsSection(
    proposals: List<AgentCodeProposal>,
    selectedProposalId: String,
    onSelectProposal: (String) -> Unit
) {
    val currentProposal = proposals.find { it.agentId == selectedProposalId } ?: proposals.firstOrNull()
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "MULTI-AGENT CODE PROPOSALS",
                fontSize = 11.5.sp,
                fontWeight = FontWeight.Bold,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp
            )
            Text(
                text = "AST Diff & Sandbox",
                fontSize = 10.sp,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Proposal Selection Chips
        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            items(proposals, key = { it.agentId }) { proposal ->
                val isSelected = proposal.agentId == selectedProposalId
                val (color, emoji) = when (proposal.agentId) {
                    "synthesis" -> Pair(EmeraldSoft, "✨")
                    "antigravity" -> Pair(AgentAntigravity, "🧙‍♂️")
                    "grok" -> Pair(AgentGrok, "🚀")
                    "ollama" -> Pair(AgentOllama, "🦙")
                    else -> Pair(TextPrimary, "📜")
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isSelected) SurfaceElevated else SurfaceCard)
                        .border(
                            1.dp,
                            if (isSelected) color else BorderSubtle,
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onSelectProposal(proposal.agentId) }
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = emoji, fontSize = 12.sp)
                        Spacer(modifier = Modifier.width(5.dp))
                        Text(
                            text = proposal.agentName,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) color else TextSecondary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = proposal.version,
                            fontSize = 9.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Code / Diff Container Card
        if (currentProposal != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceDark)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            ) {
                Column {
                    // Header Toolbar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(SurfaceElevated)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Terminal,
                                contentDescription = "File",
                                tint = CyanSoft,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = currentProposal.fileName,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "(${currentProposal.language})",
                                fontSize = 10.sp,
                                color = TextMuted,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        IconButton(
                            onClick = {
                                val textToCopy = if (currentProposal.diffLines.isNotEmpty()) {
                                    currentProposal.diffLines.joinToString("\n") { it.text }
                                } else {
                                    currentProposal.code
                                }
                                clipboardManager.setText(AnnotatedString(textToCopy))
                                Toast.makeText(context, "Code copied to clipboard", Toast.LENGTH_SHORT).show()
                            },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ContentCopy,
                                contentDescription = "Copy Code",
                                tint = TextMuted,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }

                    // Metrics Badges Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(SurfaceCard)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        MetricItem(label = "Complexity", value = "${currentProposal.astComplexity} AST")
                        MetricItem(label = "Memory", value = "${currentProposal.memoryFootprintKb} KB")
                        MetricItem(label = "Latency", value = "${currentProposal.executionLatencyMicros} µs")
                        MetricItem(label = "Vote", value = currentProposal.voteDecision.name)
                    }

                    // Code / Diff Content Area
                    if (currentProposal.diffLines.isNotEmpty()) {
                        DiffViewer(diffLines = currentProposal.diffLines)
                    } else {
                        SyntaxHighlightedCodeBlock(code = currentProposal.code)
                    }
                }
            }
        }
    }
}

@Composable
fun MetricItem(label: String, value: String) {
    Column {
        Text(text = label, fontSize = 9.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
        Text(text = value, fontSize = 10.5.sp, fontWeight = FontWeight.Bold, color = TextPrimary, fontFamily = FontFamily.Monospace)
    }
}

@Composable
fun DiffViewer(diffLines: List<DiffLine>) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState)
            .padding(vertical = 6.dp)
    ) {
        diffLines.forEach { line ->
            val (bg, textColor, prefix) = when (line.type) {
                DiffType.ADDED -> Triple(Color(0x2210B981), EmeraldSoft, "+")
                DiffType.DELETED -> Triple(Color(0x22EF4444), Color(0xFFF87171), "-")
                DiffType.UNCHANGED -> Triple(Color.Transparent, TextSecondary, " ")
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(bg)
                    .padding(horizontal = 8.dp, vertical = 1.5.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Line Numbers
                val oldNumStr = line.oldLineNum?.toString() ?: ""
                val newNumStr = line.newLineNum?.toString() ?: ""

                Text(
                    text = oldNumStr.padStart(3, ' '),
                    fontSize = 10.sp,
                    color = TextDim,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.width(24.dp)
                )
                Text(
                    text = newNumStr.padStart(3, ' '),
                    fontSize = 10.sp,
                    color = TextDim,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.width(24.dp)
                )

                Text(
                    text = prefix,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = textColor,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.width(14.dp)
                )

                Text(
                    text = line.text.removePrefix("+ ").removePrefix("- "),
                    fontSize = 11.sp,
                    color = textColor,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}

@Composable
fun SyntaxHighlightedCodeBlock(code: String) {
    val scrollState = rememberScrollState()
    val annotatedCode = remember(code) { highlightKotlinCode(code) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState)
            .padding(10.dp)
    ) {
        Text(
            text = annotatedCode,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace,
            lineHeight = 16.sp
        )
    }
}

fun highlightKotlinCode(code: String): AnnotatedString {
    return buildAnnotatedString {
        val lines = code.lines()
        val keywords = setOf(
            "package", "import", "class", "data", "fun", "val", "var",
            "return", "if", "else", "when", "while", "for", "sealed",
            "interface", "override", "true", "false", "null", "suspend",
            "private", "public", "throw", "try", "catch", "do", "in"
        )
        val types = setOf(
            "Int", "Long", "Float", "Double", "String", "Boolean",
            "ByteArray", "List", "Map", "Array", "AtomicReferenceArray",
            "AtomicLong", "AstNode", "MerkleAstProof", "PaddedBucket", "AstBucket"
        )

        lines.forEachIndexed { index, line ->
            // Line number prefix
            withStyle(SpanStyle(color = TextDim)) {
                append((index + 1).toString().padStart(2, ' ') + "  ")
            }

            if (line.trimStart().startsWith("//")) {
                withStyle(SpanStyle(color = TextMuted)) {
                    append(line)
                }
            } else {
                val tokens = line.split(Regex("(?<=[^a-zA-Z0-9_])|(?=[^a-zA-Z0-9_])"))
                tokens.forEach { token ->
                    when {
                        token in keywords -> withStyle(SpanStyle(color = PurpleSoft, fontWeight = FontWeight.Bold)) { append(token) }
                        token in types -> withStyle(SpanStyle(color = AlchemicalGold)) { append(token) }
                        token.startsWith("@") -> withStyle(SpanStyle(color = CyanSoft)) { append(token) }
                        token.startsWith("\"") || token.endsWith("\"") -> withStyle(SpanStyle(color = EmeraldSoft)) { append(token) }
                        token.toIntOrNull() != null || token.endsWith("L") || token.endsWith("f") -> withStyle(SpanStyle(color = GoldAccent)) { append(token) }
                        else -> withStyle(SpanStyle(color = TextPrimary)) { append(token) }
                    }
                }
            }
            append("\n")
        }
    }
}

// ==================== 4. BFT Quorum Section ====================

@Composable
fun BftQuorumSection(
    state: ConsensusArenaState,
    onToggleVote: (String, VoteDecision) -> Unit,
    onToggleByzantine: (String) -> Unit,
    onResetConsensus: () -> Unit
) {
    val animatedStake by animateFloatAsState(
        targetValue = state.approvingStakePercent.toFloat(),
        animationSpec = tween(durationMillis = 400),
        label = "stake"
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "BFT QUORUM GAUGE",
                fontSize = 11.5.sp,
                fontWeight = FontWeight.Bold,
                color = AlchemicalGold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp
            )
            Text(
                text = "Threshold: 66.7% (2f+1)",
                fontSize = 10.sp,
                color = TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Quorum Gauge Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(SurfaceCard)
                .border(
                    1.dp,
                    if (state.isQuorumAchieved) BorderCyan else BorderGold,
                    RoundedCornerShape(14.dp)
                )
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
                            text = "${state.approvingStakePercent}%",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (state.isQuorumAchieved) EmeraldOnline else CrimsonAlert,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "Active Approving Stake",
                            fontSize = 10.5.sp,
                            color = TextMuted
                        )
                    }

                    // Status Pill
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(
                                if (state.isQuorumAchieved) EmeraldOnline.copy(alpha = 0.15f)
                                else CrimsonAlert.copy(alpha = 0.15f)
                            )
                            .border(
                                1.dp,
                                if (state.isQuorumAchieved) EmeraldOnline.copy(alpha = 0.4f)
                                else CrimsonAlert.copy(alpha = 0.4f),
                                RoundedCornerShape(20.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = if (state.isQuorumAchieved) Icons.Default.CheckCircle else Icons.Default.Warning,
                                contentDescription = null,
                                tint = if (state.isQuorumAchieved) EmeraldOnline else CrimsonAlert,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(5.dp))
                            Text(
                                text = if (state.isQuorumAchieved) "QUORUM ACHIEVED" else "QUORUM FAULT",
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (state.isQuorumAchieved) EmeraldOnline else CrimsonAlert,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Linear Gauge Bar with 66.7% Threshold Marker
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(16.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(SurfaceElevated)
                ) {
                    // Fill bar
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(fraction = (animatedStake / 100f).coerceIn(0f, 1f))
                            .clip(RoundedCornerShape(8.dp))
                            .background(
                                if (state.isQuorumAchieved) {
                                    Brush.horizontalGradient(listOf(CyanSoft, EmeraldOnline))
                                } else {
                                    Brush.horizontalGradient(listOf(AmberWarning, CrimsonAlert))
                                }
                            )
                    )

                    // 66.7% Threshold Line Pin
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth(0.667f)
                    ) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.CenterEnd)
                                .width(2.5.dp)
                                .fillMaxHeight()
                                .background(AlchemicalGold)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "0%", fontSize = 9.sp, color = TextDim, fontFamily = FontFamily.Monospace)
                    Text(text = "▲ 66.7% Threshold", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = AlchemicalGold, fontFamily = FontFamily.Monospace)
                    Text(text = "100%", fontSize = 9.sp, color = TextDim, fontFamily = FontFamily.Monospace)
                }

                if (state.currentByzantineCount > 0) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(CrimsonAlert.copy(alpha = 0.1f))
                            .border(1.dp, CrimsonAlert.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                            .padding(8.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.BugReport,
                                contentDescription = "Byzantine",
                                tint = CrimsonAlert,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Adversarial nodes detected: ${state.currentByzantineCount} (Max tolerable: ${state.maxTolerableFaultyNodes})",
                                fontSize = 10.5.sp,
                                color = CrimsonAlert,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Live Stake Validator Cards
        state.stakeNodes.forEach { node ->
            ValidatorStakeCard(
                node = node,
                onToggleVote = { decision -> onToggleVote(node.agentId, decision) },
                onToggleByzantine = { onToggleByzantine(node.agentId) }
            )
            Spacer(modifier = Modifier.height(6.dp))
        }

        // Reset Quorum Action
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Button(
                onClick = onResetConsensus,
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = TextMuted),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.height(28.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Reset Stake Defaults", fontSize = 10.sp)
                }
            }
        }
    }
}

@Composable
fun ValidatorStakeCard(
    node: AgentStakeNode,
    onToggleVote: (VoteDecision) -> Unit,
    onToggleByzantine: () -> Unit
) {
    val (agentColor, agentEmoji) = getAgentMetadata(node.agentId)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(if (node.isByzantine) CrimsonAlert.copy(alpha = 0.08f) else SurfaceCard)
            .border(
                1.dp,
                if (node.isByzantine) CrimsonAlert.copy(alpha = 0.4f) else BorderSubtle,
                RoundedCornerShape(10.dp)
            )
            .padding(10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: Agent Info & Stake
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Text(text = agentEmoji, fontSize = 16.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = node.name,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${node.stakePercent}%",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = agentColor,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Text(
                        text = node.publicKeyFingerprint,
                        fontSize = 9.5.sp,
                        color = TextDim,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Right: Vote Toggle Chips & Byzantine Trigger
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Vote Decisions: APPROVE / REJECT / ABSTAIN
                listOf(VoteDecision.APPROVE, VoteDecision.REJECT, VoteDecision.ABSTAIN).forEach { decision ->
                    val isSelected = node.vote == decision && !node.isByzantine
                    val (btnColor, btnText) = when (decision) {
                        VoteDecision.APPROVE -> Pair(EmeraldOnline, "✓")
                        VoteDecision.REJECT -> Pair(CrimsonAlert, "✗")
                        VoteDecision.ABSTAIN -> Pair(TextMuted, "—")
                    }

                    Box(
                        modifier = Modifier
                            .padding(horizontal = 2.dp)
                            .size(26.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isSelected) btnColor.copy(alpha = 0.25f) else SurfaceElevated)
                            .border(1.dp, if (isSelected) btnColor else BorderSubtle, RoundedCornerShape(6.dp))
                            .clickable { onToggleVote(decision) },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = btnText,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) btnColor else TextMuted
                        )
                    }
                }

                Spacer(modifier = Modifier.width(6.dp))

                // Byzantine Fault Simulator Button
                IconButton(
                    onClick = onToggleByzantine,
                    modifier = Modifier
                        .size(26.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (node.isByzantine) CrimsonAlert else SurfaceElevated)
                ) {
                    Icon(
                        imageVector = Icons.Default.BugReport,
                        contentDescription = "Byzantine Fault",
                        tint = if (node.isByzantine) VoidBlack else TextMuted,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
    }
}

// ==================== 5. Merkle Root AST Triangulation ====================

@Composable
fun MerkleAstTriangulationCard(
    proof: MerkleAstProof,
    isReverifying: Boolean,
    onReverify: () -> Unit,
    onCopyHash: () -> Unit
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
                    Icon(
                        imageVector = Icons.Default.AccountTree,
                        contentDescription = "Merkle AST",
                        tint = CyanSoft,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "MERKLE ROOT AST PROOF",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(EmeraldOnline.copy(alpha = 0.15f))
                        .border(1.dp, EmeraldOnline.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "VERIFIED",
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Root Hash Box with Copy Action
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceElevated)
                    .clickable { onCopyHash() }
                    .padding(horizontal = 10.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "BLAKE3 MERKLE ROOT HASH", fontSize = 9.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
                        Text(
                            text = proof.shortRootHash,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = AlchemicalGold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy Hash",
                        tint = TextMuted,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Triangulation Engines
            Text(
                text = "3-ENGINE TRIANGULATION MATRIX",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = TextSecondary,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(6.dp))

            proof.engines.forEach { engine ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(5.dp)
                                .clip(CircleShape)
                                .background(if (engine.isMatch) EmeraldOnline else CrimsonAlert)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = engine.name,
                            fontSize = 11.5.sp,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "(${engine.version})",
                            fontSize = 9.5.sp,
                            color = TextDim,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Text(
                        text = "${engine.latencyMs}ms · MATCH ✓",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Re-verify Button
            Button(
                onClick = onReverify,
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = CyanSoft),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(36.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (isReverifying) {
                        CircularProgressIndicator(
                            color = CyanSoft,
                            modifier = Modifier.size(14.dp),
                            strokeWidth = 2.dp
                        )
                    } else {
                        Icon(imageVector = Icons.Default.Security, contentDescription = null, modifier = Modifier.size(14.dp))
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isReverifying) "TRIANGULATING AST..." else "RE-VERIFY MERKLE PROOF",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

// ==================== 6. Telemetry Trigger Card ====================

@Composable
fun TelemetryTriggerCard(
    telemetry: ConsensusTelemetry,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(SurfaceElevated, SurfaceDark)
                )
            )
            .border(1.dp, BorderNeon, RoundedCornerShape(14.dp))
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(SurfaceHighlight),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Speed,
                        contentDescription = "Telemetry",
                        tint = AlchemicalGold,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "PROOF & TELEMETRY DETAILS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "P50: ${telemetry.p50LatencyMs}ms · AST Nodes: ${telemetry.astNodeCount} · Tap to expand",
                        fontSize = 10.5.sp,
                        color = TextMuted
                    )
                }
            }

            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = "Open",
                tint = CyanSoft,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

// ==================== 7. Proof & Telemetry Bottom Sheet ====================

@Composable
fun ProofAndTelemetryBottomSheetContent(
    state: ConsensusArenaState,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.85f)
            .background(SurfaceDark)
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        // Sheet Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "CONSENSUS PROOF & TELEMETRY",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "${state.telemetry.epoch} · Lamport Clock: ${state.telemetry.lamportTimestamp}",
                    fontSize = 10.5.sp,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }

            IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = TextMuted)
            }
        }

        Spacer(modifier = Modifier.height(12.dp))
        HorizontalDivider(color = BorderSubtle)
        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier.fillMaxWidth().weight(1f)
        ) {
            // Telemetry Grid
            item {
                Text(
                    text = "MICRO-BENCHMARK TELEMETRY",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanSoft,
                    fontFamily = FontFamily.Monospace
                )
                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TelemetryMetricBox(label = "P50 Latency", value = "${state.telemetry.p50LatencyMs} ms", modifier = Modifier.weight(1f))
                    TelemetryMetricBox(label = "P99 Latency", value = "${state.telemetry.p99LatencyMs} ms", modifier = Modifier.weight(1f))
                    TelemetryMetricBox(label = "Jitter", value = "${state.telemetry.networkJitterMs} ms", modifier = Modifier.weight(1f))
                    TelemetryMetricBox(label = "Gas Compute", value = "${state.telemetry.gasComputeUnits}", modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(14.dp))
            }

            // Mathematical Proof Card
            item {
                Text(
                    text = "MATHEMATICAL CONSENSUS FORMULATION",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace
                )
                Spacer(modifier = Modifier.height(6.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceCard)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = state.telemetry.mathFormula,
                        fontSize = 11.sp,
                        color = TextSecondary,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 16.sp
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
            }

            // Raw Merkle AST Graph
            item {
                Text(
                    text = "RAW AST MERKLE GRAPH",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = PurpleSoft,
                    fontFamily = FontFamily.Monospace
                )
                Spacer(modifier = Modifier.height(6.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(VoidBlack)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = state.telemetry.rawAstGraph,
                        fontSize = 10.5.sp,
                        color = EmeraldSoft,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 15.sp
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
            }

            // Merkle Proof Branch Hashes
            item {
                Text(
                    text = "BLAKE3 INCLUSION PROOF PATH",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanSoft,
                    fontFamily = FontFamily.Monospace
                )
                Spacer(modifier = Modifier.height(6.dp))

                state.merkleProof.proofBranchHashes.forEachIndexed { idx, hash ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .padding(horizontal = 8.dp, vertical = 5.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Branch #$idx", fontSize = 10.sp, color = AlchemicalGold, fontFamily = FontFamily.Monospace)
                            Text(text = hash, fontSize = 9.5.sp, color = TextSecondary, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Export Actions Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = {
                    clipboardManager.setText(AnnotatedString(state.merkleProof.rootHash))
                    Toast.makeText(context, "Full Merkle Proof Hash Copied", Toast.LENGTH_SHORT).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = CyanSoft),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.weight(1f).height(38.dp)
            ) {
                Text("Copy Proof Hash", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = {
                    val exportJson = """
{
  "round": ${state.telemetry.roundNumber},
  "epoch": "${state.telemetry.epoch}",
  "merkle_root": "${state.merkleProof.rootHash}",
  "quorum_achieved": ${state.isQuorumAchieved},
  "approving_stake": ${state.approvingStakePercent},
  "p50_latency_ms": ${state.telemetry.p50LatencyMs},
  "p99_latency_ms": ${state.telemetry.p99LatencyMs}
}
                    """.trimIndent()
                    clipboardManager.setText(AnnotatedString(exportJson))
                    Toast.makeText(context, "Telemetry JSON Exported to Clipboard", Toast.LENGTH_SHORT).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyanSoft, contentColor = VoidBlack),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.weight(1f).height(38.dp)
            ) {
                Text("Export JSON", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun TelemetryMetricBox(label: String, value: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
        Column {
            Text(text = label, fontSize = 9.sp, color = TextMuted, fontFamily = FontFamily.Monospace)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = value, fontSize = 11.5.sp, fontWeight = FontWeight.Bold, color = TextPrimary, fontFamily = FontFamily.Monospace)
        }
    }
}
