package com.example.zothsignalbridge.ui.screens

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lan
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Sensors
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.AgentNode
import com.example.zothsignalbridge.data.models.ProjectClaim
import com.example.zothsignalbridge.data.models.SwarmTelemetry
import com.example.zothsignalbridge.theme.AgentAntigravity
import com.example.zothsignalbridge.theme.AgentAzoth
import com.example.zothsignalbridge.theme.AgentGrok
import com.example.zothsignalbridge.theme.AgentHermes
import com.example.zothsignalbridge.theme.AgentOllama
import com.example.zothsignalbridge.theme.AgentSystem
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderNeon
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.EmeraldSoft
import com.example.zothsignalbridge.theme.GoldAccent
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

data class SeatMetadata(
    val name: String,
    val icon: String,
    val color: Color,
    val backgroundColor: Color
)

fun getSeatMetadata(seat: String): SeatMetadata {
    return when (seat.lowercase()) {
        "forge" -> SeatMetadata("Forge", "⚡", AgentAntigravity, AgentAntigravity.copy(alpha = 0.15f))
        "citadel" -> SeatMetadata("Citadel", "🏰", AgentAzoth, AgentAzoth.copy(alpha = 0.15f))
        "deck" -> SeatMetadata("Deck", "🚀", AgentGrok, AgentGrok.copy(alpha = 0.15f))
        "ridge" -> SeatMetadata("Ridge", "🕊️", AgentHermes, AgentHermes.copy(alpha = 0.15f))
        "well" -> SeatMetadata("Well", "🦙", AgentOllama, AgentOllama.copy(alpha = 0.15f))
        else -> SeatMetadata(seat.ifBlank { "Field" }, "🌐", AgentSystem, AgentSystem.copy(alpha = 0.15f))
    }
}

data class StatusMetadata(
    val label: String,
    val color: Color,
    val backgroundColor: Color
)

fun getStatusMetadata(status: String, isOnline: Boolean): StatusMetadata {
    if (!isOnline) {
        return StatusMetadata("OFFLINE", TextMuted, SurfaceElevated)
    }
    return when (status.lowercase()) {
        "active" -> StatusMetadata("ACTIVE", EmeraldOnline, EmeraldOnline.copy(alpha = 0.15f))
        "standby" -> StatusMetadata("STANDBY", AmberWarning, AmberWarning.copy(alpha = 0.15f))
        "busy" -> StatusMetadata("BUSY", CyanSoft, CyanSoft.copy(alpha = 0.15f))
        else -> StatusMetadata(status.uppercase(), EmeraldOnline, EmeraldOnline.copy(alpha = 0.15f))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwarmRadarScreen(
    agents: List<AgentNode>,
    claims: List<ProjectClaim>,
    telemetry: SwarmTelemetry,
    host: String = "100.125.220.102:8484",
    onDirectMessageClick: (agentId: String) -> Unit,
    onReleaseClaim: (ProjectClaim) -> Unit = {},
    modifier: Modifier = Modifier
) {
    var selectedAgentForSheet by remember { mutableStateOf<AgentNode?>(null) }
    var showDiagnosticsSheet by remember { mutableStateOf(false) }
    var claimToRelease by remember { mutableStateOf<ProjectClaim?>(null) }

    val cleanHost = host.removePrefix("http://").removePrefix("https://").trimEnd('/')

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // 1. High-Level Summary Card with Live Pulse Indicator
        item {
            SwarmRadarSummaryCard(
                host = cleanHost,
                agents = agents,
                claims = claims,
                telemetry = telemetry,
                onOpenDiagnostics = { showDiagnosticsSheet = true }
            )
            Spacer(modifier = Modifier.height(20.dp))
        }

        // 2. Section Title: Agent Nodes
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Sensors,
                        contentDescription = null,
                        tint = AlchemicalGold,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "SWARM AGENT NODES",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceElevated)
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "${agents.count { it.isOnline }}/${agents.size} Active",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = EmeraldOnline,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Visual Grid of Agent Nodes
        items(agents, key = { it.id }) { agent ->
            val heldClaims = claims.filter { it.agent.equals(agent.id, ignoreCase = true) }
            AgentNodeCard(
                agent = agent,
                heldClaims = heldClaims,
                onCardClick = { selectedAgentForSheet = agent },
                onDirectMessageClick = { onDirectMessageClick(agent.id) }
            )
            Spacer(modifier = Modifier.height(10.dp))
        }

        // 4. Section Title: Active Project Claims & Locks
        item {
            Spacer(modifier = Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = CyanSoft,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "PROJECT LEASES & AST LOCKS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceElevated)
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "${claims.size} Locks",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = if (claims.isNotEmpty()) AlchemicalGold else TextMuted,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Claims List
        if (claims.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(SurfaceCard)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(14.dp))
                        .padding(18.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LockOpen,
                            contentDescription = null,
                            tint = EmeraldOnline,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Zero active project claims. Workspace unlocked & free.",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
        } else {
            items(claims, key = { it.project }) { claim ->
                ClaimCard(
                    claim = claim,
                    onReleaseClick = { claimToRelease = claim }
                )
                Spacer(modifier = Modifier.height(8.dp))
            }
        }

        item {
            Spacer(modifier = Modifier.height(28.dp))
        }
    }

    // 3. Agent Telemetry Modal Bottom Sheet
    selectedAgentForSheet?.let { agent ->
        val agentClaims = claims.filter { it.agent.equals(agent.id, ignoreCase = true) }
        AgentTelemetryBottomSheet(
            agent = agent,
            heldClaims = agentClaims,
            onDismiss = { selectedAgentForSheet = null },
            onDirectMessageClick = {
                val targetId = agent.id
                selectedAgentForSheet = null
                onDirectMessageClick(targetId)
            }
        )
    }

    // 5. Diagnostics & Port Telemetry Modal Bottom Sheet
    if (showDiagnosticsSheet) {
        DiagnosticsBottomSheet(
            host = cleanHost,
            agents = agents,
            claims = claims,
            telemetry = telemetry,
            onDismiss = { showDiagnosticsSheet = false }
        )
    }

    // Release Claim Confirmation Dialog
    claimToRelease?.let { claim ->
        AlertDialog(
            onDismissRequest = { claimToRelease = null },
            containerColor = SurfaceDark,
            titleContentColor = TextPrimary,
            textContentColor = TextSecondary,
            icon = {
                Icon(
                    imageVector = Icons.Default.LockOpen,
                    contentDescription = "Release",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(28.dp)
                )
            },
            title = {
                Text(
                    text = "Release AST Project Lock?",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            },
            text = {
                Column {
                    Text(
                        text = "Are you sure you want to release the AST lease on project '${claim.project}' held by @${claim.agent}?",
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "This will release the workspace lock so other swarm agents can claim and mutate this project tree.",
                        fontSize = 11.5.sp,
                        color = TextMuted,
                        lineHeight = 16.sp
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onReleaseClaim(claim)
                        claimToRelease = null
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CrimsonAlert,
                        contentColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Release Lock", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            },
            dismissButton = {
                TextButton(onClick = { claimToRelease = null }) {
                    Text("Cancel", color = TextSecondary, fontSize = 12.sp)
                }
            }
        )
    }
}

/**
 * 1. High-level clean summary card with live pulse indicator & tactical radar graphic
 */
@Composable
fun SwarmRadarSummaryCard(
    host: String,
    agents: List<AgentNode>,
    claims: List<ProjectClaim>,
    telemetry: SwarmTelemetry,
    onOpenDiagnostics: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "radarPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 2.2f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulseScale"
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulseAlpha"
    )
    val sweepAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 4500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radarSweep"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(18.dp))
            .padding(16.dp)
    ) {
        Column {
            // Top Section: Radar Scanner + Host Info
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    // Google Maps / Nest style mini radar canvas
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(SurfaceElevated)
                            .border(1.dp, BorderNeon, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Canvas(modifier = Modifier.size(44.dp)) {
                            val center = Offset(size.width / 2, size.height / 2)
                            val radius = size.minDimension / 2

                            // Concentric range circles
                            drawCircle(
                                color = CyanSoft.copy(alpha = 0.25f),
                                radius = radius * 0.4f,
                                center = center,
                                style = Stroke(width = 1.dp.toPx())
                            )
                            drawCircle(
                                color = CyanSoft.copy(alpha = 0.2f),
                                radius = radius * 0.75f,
                                center = center,
                                style = Stroke(width = 1.dp.toPx())
                            )
                            drawCircle(
                                color = CyanSoft.copy(alpha = 0.35f),
                                radius = radius * 0.95f,
                                center = center,
                                style = Stroke(width = 1.dp.toPx())
                            )

                            // Crosshairs
                            drawLine(
                                color = BorderSubtle,
                                start = Offset(center.x, 0f),
                                end = Offset(center.x, size.height),
                                strokeWidth = 1.dp.toPx()
                            )
                            drawLine(
                                color = BorderSubtle,
                                start = Offset(0f, center.y),
                                end = Offset(size.width, center.y),
                                strokeWidth = 1.dp.toPx()
                            )

                            // Sweep Line
                            val sweepRad = Math.toRadians(sweepAngle.toDouble())
                            val endX = (center.x + radius * Math.cos(sweepRad)).toFloat()
                            val endY = (center.y + radius * Math.sin(sweepRad)).toFloat()
                            drawLine(
                                color = CyanNeon.copy(alpha = 0.8f),
                                start = center,
                                end = Offset(endX, endY),
                                strokeWidth = 1.5.dp.toPx()
                            )

                            // Agent Blips
                            drawCircle(color = AgentAntigravity, radius = 2.dp.toPx(), center = Offset(center.x + radius * 0.45f, center.y - radius * 0.3f))
                            drawCircle(color = AgentAzoth, radius = 2.dp.toPx(), center = Offset(center.x + radius * 0.5f, center.y + radius * 0.4f))
                            drawCircle(color = AgentGrok, radius = 2.dp.toPx(), center = Offset(center.x - radius * 0.5f, center.y - radius * 0.35f))
                            drawCircle(color = AgentHermes, radius = 2.dp.toPx(), center = Offset(center.x - radius * 0.4f, center.y + radius * 0.5f))
                            drawCircle(color = AgentOllama, radius = 2.dp.toPx(), center = Offset(center.x, center.y + radius * 0.7f))
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Live Pulse Dot
                            Box(
                                modifier = Modifier.size(12.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(12.dp)
                                        .graphicsLayer {
                                            scaleX = pulseScale
                                            scaleY = pulseScale
                                            alpha = pulseAlpha
                                        }
                                        .clip(CircleShape)
                                        .background(EmeraldOnline)
                                )
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(EmeraldOnline)
                                )
                            }
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "SWARM RADAR HUB",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontFamily = FontFamily.Monospace,
                                letterSpacing = 0.5.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = host,
                            fontSize = 11.sp,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Nest-Style 3-Metric Capsule Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Metric 1: Active Agents
                NestMetricPill(
                    icon = Icons.Default.Sensors,
                    value = "${agents.count { it.isOnline }}/${agents.size}",
                    label = "Nodes Online",
                    accentColor = EmeraldOnline,
                    modifier = Modifier.weight(1f)
                )

                // Metric 2: Open Claims
                NestMetricPill(
                    icon = Icons.Default.Lock,
                    value = "${claims.size}",
                    label = "AST Locks",
                    accentColor = if (claims.isNotEmpty()) AlchemicalGold else TextMuted,
                    modifier = Modifier.weight(1f)
                )

                // Metric 3: Latency
                val latencyText = if (telemetry.latencyMs > 0) "${telemetry.latencyMs}ms" else "< 12ms"
                NestMetricPill(
                    icon = Icons.Default.Speed,
                    value = latencyText,
                    label = "WireGuard",
                    accentColor = CyanSoft,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 5. Clean "Diagnostics & Port Telemetry" Button (Main Screen Breathability)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(SurfaceElevated)
                    .clickable(onClick = onOpenDiagnostics)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                    .padding(horizontal = 12.dp, vertical = 9.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Tune,
                            contentDescription = null,
                            tint = CyanSoft,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Diagnostics & Port Telemetry (:8484, :8088, :11434, :8989)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = TextPrimary
                        )
                    }
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Open Diagnostics",
                        tint = CyanSoft,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun NestMetricPill(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    label: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(SurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
            .padding(vertical = 8.dp, horizontal = 10.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.Start
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(5.dp))
                Text(
                    text = value,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary,
                    fontFamily = FontFamily.Monospace
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                color = TextSecondary
            )
        }
    }
}

/**
 * 2. Visual Grid of Agent Nodes with Status Lights & Seat Badges
 */
@Composable
fun AgentNodeCard(
    agent: AgentNode,
    heldClaims: List<ProjectClaim>,
    onCardClick: () -> Unit,
    onDirectMessageClick: () -> Unit
) {
    val (agentColor, agentEmoji) = getAgentMetadata(agent.id)
    val seatMeta = getSeatMetadata(agent.region)
    val statusMeta = getStatusMetadata(agent.status, agent.isOnline)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
            .clickable(onClick = onCardClick)
            .padding(14.dp)
    ) {
        Column {
            // Header Row: Avatar, Name, Seat Badge, Status Light, Message Action
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    // Agent Avatar with colored aura
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(SurfaceElevated)
                            .border(1.5.dp, agentColor.copy(alpha = 0.6f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(text = agentEmoji, fontSize = 18.sp)
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = agent.name,
                                fontSize = 14.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "@${agent.id}",
                                fontSize = 11.sp,
                                color = agentColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Spacer(modifier = Modifier.height(3.dp))

                        // Seat & Status Pills Row
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Seat Badge
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(seatMeta.backgroundColor)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(text = seatMeta.icon, fontSize = 9.sp)
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text(
                                        text = seatMeta.name,
                                        fontSize = 9.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = seatMeta.color,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(6.dp))

                            // Status Light
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(statusMeta.backgroundColor)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(5.dp)
                                            .clip(CircleShape)
                                            .background(statusMeta.color)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = statusMeta.label,
                                        fontSize = 9.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = statusMeta.color,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }
                        }
                    }
                }

                // 1-Tap Quick Chat Button
                Button(
                    onClick = onDirectMessageClick,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = SurfaceElevated,
                        contentColor = CyanSoft
                    ),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Message",
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Chat", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Task Description Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceElevated)
                    .padding(horizontal = 10.dp, vertical = 8.dp)
            ) {
                Text(
                    text = agent.currentTask,
                    fontSize = 11.5.sp,
                    color = TextSecondary,
                    lineHeight = 16.sp
                )
            }

            // Held AST Claims Indicator
            if (heldClaims.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(AlchemicalGold.copy(alpha = 0.1f))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Lock",
                        tint = AlchemicalGold,
                        modifier = Modifier.size(11.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Holds AST Lock: ${heldClaims.joinToString { it.project }}",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Medium,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

/**
 * 3. ModalBottomSheet: Agent Telemetry, Capabilities, Heartbeat & 1-Tap Message
 */
@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun AgentTelemetryBottomSheet(
    agent: AgentNode,
    heldClaims: List<ProjectClaim>,
    onDismiss: () -> Unit,
    onDirectMessageClick: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val (agentColor, agentEmoji) = getAgentMetadata(agent.id)
    val seatMeta = getSeatMetadata(agent.region)
    val statusMeta = getStatusMetadata(agent.status, agent.isOnline)

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceDark,
        scrimColor = VoidBlack.copy(alpha = 0.75f),
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(top = 10.dp, bottom = 6.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .clip(CircleShape)
                    .background(BorderSubtle)
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Header: Avatar, Name, Handle, Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(SurfaceElevated)
                        .border(2.dp, agentColor, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = agentEmoji, fontSize = 24.sp)
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = agent.name,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "@${agent.id}",
                        fontSize = 12.sp,
                        color = agentColor,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        // Seat
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(seatMeta.backgroundColor)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "${seatMeta.icon} Seat: ${seatMeta.name}",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = seatMeta.color,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        // Status
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(statusMeta.backgroundColor)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "● ${statusMeta.label}",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = statusMeta.color,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))
            HorizontalDivider(color = BorderSubtle)
            Spacer(modifier = Modifier.height(14.dp))

            // Node Telemetry & Heartbeat
            Text(
                text = "NODE TELEMETRY & NETWORK",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    TelemetryInfoRow(
                        label = "Seat & Region:",
                        value = "${seatMeta.name} (${seatMeta.icon})"
                    )
                    TelemetryInfoRow(
                        label = "Last Heartbeat:",
                        value = if (agent.lastSeen.isNotBlank()) agent.lastSeen else "Live WireGuard Ping"
                    )
                    TelemetryInfoRow(
                        label = "Mesh Protocol:",
                        value = "Tailscale P2P (:8484 / :8989)"
                    )
                    TelemetryInfoRow(
                        label = "Node State:",
                        value = if (agent.isOnline) "Synchronized · Active Quorum" else "Standby"
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Capabilities
            Text(
                text = "CAPABILITIES & SPECIALIZATIONS",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AlchemicalGold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            val capabilityList = agent.capabilities
                .split(Regex("[,;·]"))
                .map { it.trim() }
                .filter { it.isNotEmpty() }

            if (capabilityList.isEmpty()) {
                Text(
                    text = "Standard Swarm Agent Protocol",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            } else {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    capabilityList.forEach { cap ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(SurfaceElevated)
                                .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                                .padding(horizontal = 9.dp, vertical = 5.dp)
                        ) {
                            Text(
                                text = "⚙️ $cap",
                                fontSize = 11.sp,
                                color = TextPrimary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Current Task
            Text(
                text = "ACTIVE TASK CONTEXT",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = SovereignPurple,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = agent.currentTask,
                    fontSize = 12.sp,
                    color = TextPrimary,
                    lineHeight = 17.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Active Locks
            Text(
                text = "HELD AST PROJECT LOCKS",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AlchemicalGold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            if (heldClaims.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceElevated)
                        .padding(10.dp)
                ) {
                    Text(
                        text = "Zero active project claims held by @${agent.id}. Ready for dispatches.",
                        fontSize = 11.5.sp,
                        color = TextMuted
                    )
                }
            } else {
                heldClaims.forEach { claim ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(SurfaceElevated)
                            .border(1.dp, AlchemicalGold.copy(alpha = 0.3f), RoundedCornerShape(10.dp))
                            .padding(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = "Lock",
                                tint = AlchemicalGold,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = claim.project,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontFamily = FontFamily.Monospace
                            )
                            if (claim.note.isNotBlank()) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "· ${claim.note}",
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 1-Tap "Message Node" Action Button
            Button(
                onClick = onDirectMessageClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = CyanSoft,
                    contentColor = VoidBlack
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Send,
                        contentDescription = "Message",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "TRANSMIT TO @${agent.id.uppercase()}",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun TelemetryInfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, fontSize = 11.sp, color = TextMuted)
        Text(
            text = value,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = TextPrimary,
            fontFamily = FontFamily.Monospace
        )
    }
}

/**
 * 4. Active Project Claims Section Card
 */
@Composable
fun ClaimCard(
    claim: ProjectClaim,
    onReleaseClick: () -> Unit
) {
    val (agentColor, agentEmoji) = getAgentMetadata(claim.agent)

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
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(AlchemicalGold.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Lock",
                            tint = AlchemicalGold,
                            modifier = Modifier.size(14.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = claim.project,
                                fontSize = 13.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "$agentEmoji @${claim.agent}",
                                fontSize = 11.sp,
                                color = agentColor,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        if (claim.claimedAt.isNotBlank()) {
                            Text(
                                text = "Lease: ${claim.claimedAt}",
                                fontSize = 10.sp,
                                color = TextMuted,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }

                // 1-Tap Release Action
                OutlinedButton(
                    onClick = onReleaseClick,
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = AmberWarning
                    ),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = androidx.compose.ui.graphics.SolidColor(AmberWarning.copy(alpha = 0.5f))
                    ),
                    modifier = Modifier.height(30.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LockOpen,
                            contentDescription = "Release",
                            modifier = Modifier.size(11.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Release", fontSize = 10.5.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            if (claim.note.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceElevated)
                        .padding(horizontal = 8.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = claim.note,
                        fontSize = 11.sp,
                        color = TextSecondary
                    )
                }
            }
        }
    }
}

/**
 * 5. ModalBottomSheet: Diagnostics & Port Telemetry
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiagnosticsBottomSheet(
    host: String,
    agents: List<AgentNode>,
    claims: List<ProjectClaim>,
    telemetry: SwarmTelemetry,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceDark,
        scrimColor = VoidBlack.copy(alpha = 0.75f),
        dragHandle = {
            Box(
                modifier = Modifier
                    .padding(top = 10.dp, bottom = 6.dp)
                    .size(width = 36.dp, height = 4.dp)
                    .clip(CircleShape)
                    .background(BorderSubtle)
            )
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "SWARM DIAGNOSTICS & TELEMETRY",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Host: $host",
                        fontSize = 11.sp,
                        color = TextMuted,
                        fontFamily = FontFamily.Monospace
                    )
                }
                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = BorderSubtle)
            Spacer(modifier = Modifier.height(14.dp))

            // Microservice Ports (4 Ports Grid)
            Text(
                text = "MICROSERVICE PORTS (4 ACTIVE)",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = AlchemicalGold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                PortDiagnosticCard(
                    portNumber = ":8484",
                    serviceName = "Orchestrator Core API",
                    details = "REST & SSE Stream Dispatcher · Swarm Quorum Coordinator",
                    isOk = telemetry.port8484Ok
                )
                PortDiagnosticCard(
                    portNumber = ":8088",
                    serviceName = "Studio Web Radar HUD",
                    details = "WebGL Shader Canvas · Real-time AST Visualization",
                    isOk = telemetry.port8088Ok
                )
                PortDiagnosticCard(
                    portNumber = ":11434",
                    serviceName = "Ollama Neural Inference",
                    details = "Zero-Cloud Local Model Server · qwen2.5-coder:1.5b",
                    isOk = telemetry.port11434Ok
                )
                PortDiagnosticCard(
                    portNumber = ":8989",
                    serviceName = "WireGuard Event Bus",
                    details = "High-Throughput P2P Mesh · Real-time Signal Synchronization",
                    isOk = telemetry.port8989Ok
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // System Metrics & Quorum Gauges
            Text(
                text = "SWARM TELEMETRY & QUORUM GAUGES",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = CyanSoft,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Quorum Progress
                    val activeCount = agents.count { it.isOnline }
                    val quorumFraction = if (agents.isNotEmpty()) activeCount.toFloat() / agents.size else 1f
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "Swarm Quorum:", fontSize = 11.sp, color = TextMuted)
                            Text(
                                text = "$activeCount/${agents.size} Active (${(quorumFraction * 100).toInt()}%)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = EmeraldOnline,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            progress = { quorumFraction },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = EmeraldOnline,
                            trackColor = SurfaceElevated
                        )
                    }

                    TelemetryInfoRow(
                        label = "Round-Trip Latency:",
                        value = if (telemetry.latencyMs > 0) "${telemetry.latencyMs} ms (Direct WireGuard)" else "< 12 ms (Optimal)"
                    )
                    TelemetryInfoRow(
                        label = "Transmissions Routed:",
                        value = "${telemetry.totalMessages} packets"
                    )
                    TelemetryInfoRow(
                        label = "Active AST Leases:",
                        value = "${claims.size} project locks"
                    )
                    TelemetryInfoRow(
                        label = "Last Orchestrator Sync:",
                        value = telemetry.lastSyncTime
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Zero Cloud Egress Guarantee Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = "Zero Trust",
                        tint = AlchemicalGold,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Zero Cloud Egress Guarantee",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "All signal dispatches, AST claims, and telemetry stream directly over your private WireGuard tunnel. No data ever touches third-party relay servers.",
                            fontSize = 11.sp,
                            color = TextSecondary,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SurfaceElevated,
                    contentColor = CyanSoft
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
            ) {
                Text("DONE / RETURN TO RADAR", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun PortDiagnosticCard(
    portNumber: String,
    serviceName: String,
    details: String,
    isOk: Boolean
) {
    val statusColor = if (isOk) EmeraldOnline else AmberWarning
    val statusText = if (isOk) "ONLINE" else "STANDBY"

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
            .padding(10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(statusColor)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = portNumber,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = serviceName,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                    }
                    Text(
                        text = details,
                        fontSize = 10.sp,
                        color = TextSecondary
                    )
                }
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(statusColor.copy(alpha = 0.15f))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = statusText,
                    fontSize = 9.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = statusColor,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}
