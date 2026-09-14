package com.example.zothsignalbridge.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CleaningServices
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.NetworkPing
import androidx.compose.material.icons.filled.Pets
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.AppScreen
import com.example.zothsignalbridge.data.models.ConnectionState
import com.example.zothsignalbridge.data.models.ConnectionStatus
import com.example.zothsignalbridge.data.models.TailscaleConfig
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.GoldAccent
import com.example.zothsignalbridge.theme.PurpleSoft
import com.example.zothsignalbridge.theme.SovereignPurple
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.SurfaceHighlight
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack

import androidx.compose.material3.MaterialTheme

data class DrawerNavCategory(
    val title: String,
    val items: List<DrawerNavItem>
)

data class DrawerNavItem(
    val screen: AppScreen,
    val label: String,
    val icon: ImageVector,
    val badge: String? = null
)

@Composable
fun ZothNavigationDrawer(
    currentScreen: AppScreen,
    connectionStatus: ConnectionStatus,
    config: TailscaleConfig,
    onNavigate: (AppScreen) -> Unit,
    onOpenDiagnosticLogs: () -> Unit,
    onOpenAdvancedSettings: () -> Unit,
    onForceSync: () -> Unit,
    onClearCache: () -> Unit,
    onCloseDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    ModalDrawerSheet(
        drawerContainerColor = MaterialTheme.colorScheme.surface,
        drawerContentColor = MaterialTheme.colorScheme.onSurface,
        drawerShape = RoundedCornerShape(topEnd = 16.dp, bottomEnd = 16.dp),
        modifier = modifier
            .fillMaxHeight()
            .width(310.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Drawer Header
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AssetAvatar(
                            assetPath = "agents/antigravity.jpg",
                            fallbackEmoji = "⚡",
                            size = 38.dp,
                            borderColor = CyanSoft.copy(alpha = 0.8f)
                        )

                        Spacer(modifier = Modifier.width(10.dp))

                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "ZOTH",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = AlchemicalGold,
                                    fontFamily = FontFamily.Monospace,
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = " BRIDGE",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 16.sp,
                                    color = CyanSoft,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                            Text(
                                text = "Tailscale Sovereign NOC Hub",
                                fontSize = 11.sp,
                                color = TextMuted
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Tailscale Node Topology Banner
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceCard)
                            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                            .padding(10.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "TAILNET MESH",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextMuted,
                                    fontFamily = FontFamily.Monospace,
                                    letterSpacing = 0.5.sp
                                )

                                val (statusColor, statusLabel) = when (connectionStatus.state) {
                                    ConnectionState.CONNECTED -> Pair(EmeraldOnline, if (connectionStatus.latencyMs > 0) "${connectionStatus.latencyMs}ms" else "ONLINE")
                                    ConnectionState.CONNECTING -> Pair(GoldAccent, "CONNECTING")
                                    ConnectionState.OFFLINE -> Pair(CrimsonAlert, "STANDBY")
                                    ConnectionState.ERROR -> Pair(CrimsonAlert, "ERROR")
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(statusColor)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = statusLabel,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = statusColor,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "100.125.220.102",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = AlchemicalGold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("⇄", fontSize = 11.sp, color = TextMuted)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "100.106.39.46",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = CyanSoft,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = BorderSubtle, thickness = 1.dp)
            Spacer(modifier = Modifier.height(10.dp))

            // Navigation Items Section
            Text(
                text = "COMMUNICATIONS & HUBS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = TextMuted,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
            )

            val primaryNavItems = listOf(
                DrawerNavItem(AppScreen.TRANSMISSIONS, "Transmissions", Icons.AutoMirrored.Filled.Chat),
                DrawerNavItem(AppScreen.RADAR, "Swarm Radar", Icons.Default.Radar),
                DrawerNavItem(AppScreen.WEB_HUD, "Zoth Studio HUD", Icons.Default.Language, "40+"),
                DrawerNavItem(AppScreen.ARENA, "Consensus Arena", Icons.Default.Gavel),
                DrawerNavItem(AppScreen.PANTHEON, "Pantheon 21", Icons.Default.AutoAwesome, "21"),
                DrawerNavItem(AppScreen.NOTES, "Notes Reviewer", Icons.Default.Description),
                DrawerNavItem(AppScreen.PETS, "Cyber Pets", Icons.Default.Pets),
                DrawerNavItem(AppScreen.SOUNDBOARD, "Soundboard", Icons.Default.VolumeUp),
                DrawerNavItem(AppScreen.SETTINGS, "Tailscale Settings", Icons.Default.Settings)
            )

            primaryNavItems.forEach { item ->
                val isSelected = currentScreen == item.screen
                NavigationDrawerItem(
                    label = {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = item.label,
                                fontSize = 13.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) CyanSoft else TextPrimary
                            )
                            if (item.badge != null) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(if (isSelected) CyanSoft.copy(alpha = 0.2f) else SurfaceElevated)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = item.badge,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) CyanSoft else TextMuted,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            tint = if (isSelected) CyanSoft else TextMuted,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    selected = isSelected,
                    onClick = {
                        onNavigate(item.screen)
                        onCloseDrawer()
                    },
                    colors = NavigationDrawerItemDefaults.colors(
                        selectedContainerColor = SurfaceElevated,
                        unselectedContainerColor = Color.Transparent
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.padding(vertical = 2.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = BorderSubtle, thickness = 1.dp)
            Spacer(modifier = Modifier.height(10.dp))

            // NOC Diagnostics & Tools Section
            Text(
                text = "NOC TOOLS & DIAGNOSTICS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = TextMuted,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(start = 6.dp, bottom = 4.dp)
            )

            // Diagnostic Logs Action
            DrawerActionItem(
                title = "Diagnostic Logs Viewer",
                icon = Icons.Default.Speed,
                iconTint = CyanSoft,
                onClick = {
                    onCloseDrawer()
                    onOpenDiagnosticLogs()
                }
            )

            // Advanced Network Action
            DrawerActionItem(
                title = "Advanced Network Settings",
                icon = Icons.Default.Tune,
                iconTint = AlchemicalGold,
                onClick = {
                    onCloseDrawer()
                    onOpenAdvancedSettings()
                }
            )

            // Force Sync Action
            DrawerActionItem(
                title = "Force Swarm Sync",
                icon = Icons.Default.Refresh,
                iconTint = EmeraldOnline,
                onClick = {
                    onCloseDrawer()
                    onForceSync()
                }
            )

            // Clear Cache Action
            DrawerActionItem(
                title = "Clear Cache & Logs",
                icon = Icons.Default.CleaningServices,
                iconTint = CrimsonAlert,
                onClick = {
                    onCloseDrawer()
                    onClearCache()
                }
            )

            // App Update Action
            DrawerActionItem(
                title = "Check App Updates (OTA)",
                icon = Icons.Default.SystemUpdate,
                iconTint = CyanNeon,
                onClick = {
                    onCloseDrawer()
                    onNavigate(AppScreen.SETTINGS)
                }
            )

            Spacer(modifier = Modifier.weight(1f))
            Spacer(modifier = Modifier.height(16.dp))

            // Footer Notice
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                    .padding(10.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "🛡️", fontSize = 12.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "ZERO-CLOUD WIREGUARD",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = AlchemicalGold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Encrypted peer tunnel between 100.125.220.102 and 100.106.39.46.",
                        fontSize = 10.5.sp,
                        color = TextMuted,
                        lineHeight = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun DrawerActionItem(
    title: String,
    icon: ImageVector,
    iconTint: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 9.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = iconTint,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = title,
            fontSize = 12.5.sp,
            fontWeight = FontWeight.Medium,
            color = TextPrimary
        )
    }
}
