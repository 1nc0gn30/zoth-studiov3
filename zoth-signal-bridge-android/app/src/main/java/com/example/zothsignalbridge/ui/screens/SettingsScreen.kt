package com.example.zothsignalbridge.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CleaningServices
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Computer
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.NetworkPing
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.SystemUpdate
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.zothsignalbridge.data.models.DiagnosticLog
import com.example.zothsignalbridge.data.models.TailnetPreset
import com.example.zothsignalbridge.data.models.TailscaleConfig
import com.example.zothsignalbridge.data.network.AppUpdateManager
import com.example.zothsignalbridge.data.network.AppUpdateState
import com.example.zothsignalbridge.data.network.SwarmApiClient
import com.example.zothsignalbridge.theme.AppThemeMode
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderNeon
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
import com.example.zothsignalbridge.theme.GoldAccent
import com.example.zothsignalbridge.theme.PurpleSoft
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.SurfaceHighlight
import com.example.zothsignalbridge.theme.TextDim
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack
import com.example.zothsignalbridge.ui.components.AdvancedNetworkSheet
import com.example.zothsignalbridge.ui.components.DiagnosticLogsModal
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(
    currentConfig: TailscaleConfig,
    onSaveConfig: (TailscaleConfig) -> Unit,
    diagnosticLogs: List<DiagnosticLog> = emptyList(),
    onClearLogs: () -> Unit = {},
    onClearCache: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var host by remember { mutableStateOf(currentConfig.host) }
    var studioUrl by remember { mutableStateOf(currentConfig.studioUrl) }
    var apiToken by remember { mutableStateOf(currentConfig.apiToken) }
    var pollInterval by remember { mutableFloatStateOf(currentConfig.pollIntervalSec.toFloat()) }
    var vibrate by remember { mutableStateOf(currentConfig.vibrateOnMessage) }
    var soundEnabled by remember { mutableStateOf(currentConfig.soundEnabled) }
    var themeMode by remember { mutableStateOf(currentConfig.themeMode) }

    var isPinging by remember { mutableStateOf(false) }
    var pingResult by remember { mutableStateOf<String?>(null) }
    var isPingSuccess by remember { mutableStateOf<Boolean?>(null) }
    var pingLatency by remember { mutableStateOf<Long?>(null) }

    var showAdvancedSheet by remember { mutableStateOf(false) }
    var showDiagnosticLogsModal by remember { mutableStateOf(false) }
    var saveSuccessMessage by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()
    val apiClient = remember { SwarmApiClient() }
    val presets = remember { apiClient.getTailnetPresets() }

    fun triggerPing() {
        isPinging = true
        pingResult = null
        scope.launch {
            val lat = apiClient.ping(host, apiToken.ifBlank { null })
            isPinging = false
            if (lat >= 0) {
                isPingSuccess = true
                pingLatency = lat
                pingResult = "Connected (${lat}ms)"
            } else {
                isPingSuccess = false
                pingLatency = null
                pingResult = "Unreachable"
            }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // Screen Header
        Text(
            text = "TAILSCALE BRIDGE & NOC SETTINGS",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Google Settings style clean grouped controls for WireGuard direct sovereign mesh.",
            fontSize = 11.5.sp,
            color = TextMuted,
            lineHeight = 16.sp
        )

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 1: Tailscale Node Status Card ====================
        SectionTitle(title = "TAILSCALE NODE STATUS & TOPOLOGY")
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                // Nodes Dual Column
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Workstation Node Box
                    NodeBox(
                        title = "WORKSTATION",
                        nodeName = "Parrot OS",
                        ipAddress = "100.125.220.102",
                        ports = ":8484 Orch · :8088 Web",
                        icon = Icons.Default.Computer,
                        accentColor = AlchemicalGold,
                        modifier = Modifier.weight(1f)
                    )

                    Spacer(modifier = Modifier.width(10.dp))

                    // Client Phone Box
                    NodeBox(
                        title = "CLIENT PEER",
                        nodeName = "Android Phone",
                        ipAddress = "100.106.39.46",
                        ports = "Mobile Controller",
                        icon = Icons.Default.PhoneAndroid,
                        accentColor = CyanSoft,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = BorderSubtle, thickness = 1.dp)
                Spacer(modifier = Modifier.height(12.dp))

                // Live Ping Latency Badge & Ping Test Button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Latency Badge
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(SurfaceElevated)
                            .border(
                                1.dp,
                                if (isPingSuccess == true) EmeraldOnline.copy(alpha = 0.4f)
                                else if (isPingSuccess == false) CrimsonAlert.copy(alpha = 0.4f)
                                else BorderSubtle,
                                RoundedCornerShape(12.dp)
                            )
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        val dotColor = when {
                            isPinging -> GoldAccent
                            isPingSuccess == true -> EmeraldOnline
                            isPingSuccess == false -> CrimsonAlert
                            else -> EmeraldOnline
                        }
                        Box(
                            modifier = Modifier
                                .size(7.dp)
                                .clip(CircleShape)
                                .background(dotColor)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isPinging) "Pinging Node..." else pingResult ?: "Live Ping: 14ms",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isPingSuccess == true) EmeraldOnline else if (isPingSuccess == false) CrimsonAlert else TextPrimary,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // Test Ping Button
                    Button(
                        onClick = { triggerPing() },
                        enabled = !isPinging,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SurfaceElevated,
                            contentColor = CyanSoft
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (isPinging) {
                                CircularProgressIndicator(
                                    color = CyanSoft,
                                    modifier = Modifier.size(12.dp),
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(
                                    imageVector = Icons.Default.NetworkPing,
                                    contentDescription = "Ping",
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Test Ping", fontSize = 11.5.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 2: Presets Picker ====================
        SectionTitle(title = "CONNECTION PRESETS")
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .padding(14.dp)
        ) {
            Column {
                Text(
                    text = "Tap a preset to immediately configure orchestrator and web radar endpoints:",
                    fontSize = 11.5.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Presets 2x3 Grid
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val chunked = presets.chunked(2)
                    chunked.forEach { rowPresets ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            rowPresets.forEach { preset ->
                                val isSelected = host.trimEnd('/') == preset.hostUrl.trimEnd('/')
                                PresetCard(
                                    preset = preset,
                                    isSelected = isSelected,
                                    onSelect = {
                                        host = preset.hostUrl
                                        studioUrl = preset.studioUrl
                                    },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                            if (rowPresets.size == 1) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 2.5: Tailscale OTA In-App Updater ====================
        SectionTitle(title = "TAILSCALE IN-APP APP UPDATER")
        Spacer(modifier = Modifier.height(6.dp))
        TailscaleUpdateCard(
            config = currentConfig
        )

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 3: Active Host Configuration ====================
        SectionTitle(title = "ACTIVE HOST CONFIGURATION")
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Column {
                // Host field
                Text(
                    text = "Orchestrator Base URL (:8484):",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = host,
                    onValueChange = { host = it },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyanSoft,
                        unfocusedBorderColor = BorderSubtle,
                        focusedContainerColor = SurfaceElevated,
                        unfocusedContainerColor = SurfaceElevated,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Studio URL field
                Text(
                    text = "Studio Web Radar URL (:8088):",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(6.dp))
                OutlinedTextField(
                    value = studioUrl,
                    onValueChange = { studioUrl = it },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyanSoft,
                        unfocusedBorderColor = BorderSubtle,
                        focusedContainerColor = SurfaceElevated,
                        unfocusedContainerColor = SurfaceElevated,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    singleLine = true
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 4: Preferences & Diagnostics Hub ====================
        SectionTitle(title = "SYSTEM PREFERENCES & DIAGNOSTICS")
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .padding(4.dp)
        ) {
            Column {
                // Item 1: Advanced Network Settings Sheet Trigger
                SettingsPreferenceRow(
                    icon = Icons.Default.Tune,
                    iconTint = AlchemicalGold,
                    title = "Advanced Network Settings",
                    subtitle = "Bearer token auth, polling slider & cache flush",
                    onClick = { showAdvancedSheet = true }
                )

                HorizontalDivider(color = BorderSubtle, thickness = 1.dp, modifier = Modifier.padding(horizontal = 12.dp))

                // Item 2: Diagnostic Logs Modal Trigger
                SettingsPreferenceRow(
                    icon = Icons.Default.Speed,
                    iconTint = CyanSoft,
                    title = "Diagnostic Logs Viewer",
                    subtitle = "HTTP traces, status codes & latency inspector",
                    trailingBadge = "${diagnosticLogs.size.coerceAtLeast(4)} traces",
                    onClick = { showDiagnosticLogsModal = true }
                )

                HorizontalDivider(color = BorderSubtle, thickness = 1.dp, modifier = Modifier.padding(horizontal = 12.dp))

                // Item 3: Polling Interval Quick Slider
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Swarm Polling Interval",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = TextPrimary
                        )
                        Text(
                            text = "${pollInterval.toInt()}s",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Slider(
                        value = pollInterval,
                        onValueChange = { pollInterval = it },
                        valueRange = 1f..15f,
                        steps = 13,
                        colors = SliderDefaults.colors(
                            thumbColor = CyanSoft,
                            activeTrackColor = CyanSoft,
                            inactiveTrackColor = BorderSubtle
                        )
                    )
                }

                HorizontalDivider(color = BorderSubtle, thickness = 1.dp, modifier = Modifier.padding(horizontal = 12.dp))

                // Item 4: Haptic Feedback Switch
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Vibration,
                            contentDescription = "Haptics",
                            tint = CyanSoft,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("Haptic Feedback", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = TextPrimary)
                            Text("Vibrate on swarm transmissions", fontSize = 11.sp, color = TextMuted)
                        }
                    }

                    Switch(
                        checked = vibrate,
                        onCheckedChange = { vibrate = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = VoidBlack,
                            checkedTrackColor = CyanSoft,
                            uncheckedThumbColor = TextMuted,
                            uncheckedTrackColor = SurfaceElevated
                        )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ==================== Group 4.5: Theme Mode & Palette Selector ====================
        SectionTitle(title = "UI THEME & CONTRAST PALETTE")
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                .padding(14.dp)
        ) {
            Column {
                Text(
                    text = "Select contrast palette for all screens, text elements, and surfaces:",
                    fontSize = 11.5.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AppThemeMode.entries.forEach { mode ->
                        val isSelected = themeMode.equals(mode.id, ignoreCase = true)
                        ThemeModeCard(
                            mode = mode,
                            isSelected = isSelected,
                            onSelect = {
                                themeMode = mode.id
                                val updated = currentConfig.copy(
                                    host = host.trim(),
                                    studioUrl = studioUrl.trim(),
                                    apiToken = apiToken.trim(),
                                    pollIntervalSec = pollInterval.toInt(),
                                    vibrateOnMessage = vibrate,
                                    soundEnabled = soundEnabled,
                                    themeMode = mode.id
                                )
                                onSaveConfig(updated)
                            },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Save Success Banner
        AnimatedVisibility(visible = saveSuccessMessage != null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(EmeraldOnline.copy(alpha = 0.15f))
                    .border(1.dp, EmeraldOnline.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Check, contentDescription = "Success", tint = EmeraldOnline, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = saveSuccessMessage ?: "",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldOnline,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Save Button
        Button(
            onClick = {
                val updated = currentConfig.copy(
                    host = host.trim(),
                    studioUrl = studioUrl.trim(),
                    apiToken = apiToken.trim(),
                    pollIntervalSec = pollInterval.toInt(),
                    vibrateOnMessage = vibrate,
                    soundEnabled = soundEnabled,
                    themeMode = themeMode
                )
                onSaveConfig(updated)
                saveSuccessMessage = "✓ Configuration saved & synchronized to Tailscale tunnel"
            },
            colors = ButtonDefaults.buttonColors(containerColor = CyanSoft, contentColor = VoidBlack),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = Icons.Default.Save, contentDescription = "Save", modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("SAVE & CONNECT TAILSCALE", fontSize = 12.5.sp, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Zero-Trust Security Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(SurfaceCard)
                .border(1.dp, BorderSubtle, RoundedCornerShape(14.dp))
                .padding(14.dp)
        ) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Security,
                    contentDescription = "Lock",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "ZERO-CLOUD ENCRYPTED MESH",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(3.dp))
                    Text(
                        text = "Direct WireGuard tunnel between Parrot Workstation (100.125.220.102) and Client Phone (100.106.39.46). All transmissions authenticated with 256-bit ChaCha20-Poly1305 zero cloud egress guarantee.",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        lineHeight = 15.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }

    // Advanced Network Bottom Sheet
    if (showAdvancedSheet) {
        AdvancedNetworkSheet(
            config = currentConfig.copy(
                host = host,
                studioUrl = studioUrl,
                apiToken = apiToken,
                pollIntervalSec = pollInterval.toInt(),
                vibrateOnMessage = vibrate,
                soundEnabled = soundEnabled
            ),
            onSaveConfig = { updated ->
                apiToken = updated.apiToken
                pollInterval = updated.pollIntervalSec.toFloat()
                vibrate = updated.vibrateOnMessage
                soundEnabled = updated.soundEnabled
                onSaveConfig(updated)
            },
            onClearCache = onClearCache,
            onDismiss = { showAdvancedSheet = false }
        )
    }

    // Diagnostic Logs Modal
    if (showDiagnosticLogsModal) {
        DiagnosticLogsModal(
            logs = diagnosticLogs.ifEmpty { apiClient.diagnosticLogs.value },
            onDismiss = { showDiagnosticLogsModal = false },
            onClearLogs = onClearLogs,
            onTestPing = { triggerPing() }
        )
    }
}

@Composable
private fun SectionTitle(title: String) {
    Text(
        text = title,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        color = TextMuted,
        fontFamily = FontFamily.Monospace,
        letterSpacing = 1.sp
    )
}

@Composable
private fun NodeBox(
    title: String,
    nodeName: String,
    ipAddress: String,
    ports: String,
    icon: ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceElevated)
            .border(1.dp, accentColor.copy(alpha = 0.25f), RoundedCornerShape(12.dp))
            .padding(10.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    fontSize = 9.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 0.5.sp
                )
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = accentColor,
                    modifier = Modifier.size(15.dp)
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = nodeName,
                fontSize = 12.5.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = ipAddress,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = accentColor,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = ports,
                fontSize = 9.5.sp,
                color = TextSecondary
            )
        }
    }
}

@Composable
private fun PresetCard(
    preset: TailnetPreset,
    isSelected: Boolean,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyanSoft.copy(alpha = 0.15f) else SurfaceElevated)
            .border(
                1.dp,
                if (isSelected) CyanSoft else BorderSubtle,
                RoundedCornerShape(10.dp)
            )
            .clickable(onClick = onSelect)
            .padding(10.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = preset.title,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isSelected) CyanSoft else TextPrimary
                )
                if (isSelected) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Active",
                        tint = CyanSoft,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = preset.ipOrHost,
                fontSize = 10.sp,
                color = if (preset.isTailscale) AlchemicalGold else TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
private fun SettingsPreferenceRow(
    icon: ImageVector,
    iconTint: Color,
    title: String,
    subtitle: String,
    trailingBadge: String? = null,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f)
        ) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(SurfaceElevated)
                    .border(1.dp, iconTint.copy(alpha = 0.3f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = iconTint,
                    modifier = Modifier.size(16.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = title,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = TextSecondary
                )
            }
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            if (trailingBadge != null) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(SurfaceElevated)
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = trailingBadge,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = CyanSoft,
                        fontFamily = FontFamily.Monospace
                    )
                }
                Spacer(modifier = Modifier.width(6.dp))
            }
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                contentDescription = "Open",
                tint = TextMuted,
                modifier = Modifier.size(12.dp)
            )
        }
    }
}

@Composable
private fun TailscaleUpdateCard(
    config: TailscaleConfig,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val updateManager = remember { AppUpdateManager(context) }
    val updateState by updateManager.updateState.collectAsStateWithLifecycle()

    val hostOnly = config.host.removePrefix("http://").removePrefix("https://").substringBefore(":")
    val updateEndpoint = "http://$hostOnly:8088/assets/downloads/zoth-signal-bridge-latest.apk"

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderCyan.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
            .padding(14.dp)
    ) {
        Column {
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
                            .background(CyanNeon.copy(alpha = 0.15f))
                            .border(1.dp, CyanNeon.copy(alpha = 0.4f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.SystemUpdate,
                            contentDescription = "App Update",
                            tint = CyanNeon,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Zoth Signal Bridge",
                                fontSize = 13.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(SurfaceElevated)
                                    .padding(horizontal = 5.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = "v1.2.0",
                                    fontSize = 9.5.sp,
                                    color = CyanSoft,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "Tailscale Over-The-Air Binary Stream",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Update Channel / Host Info
            Text(
                text = "Target: $updateEndpoint",
                fontSize = 10.5.sp,
                fontFamily = FontFamily.Monospace,
                color = AlchemicalGold
            )

            Spacer(modifier = Modifier.height(12.dp))

            when (val state = updateState) {
                is AppUpdateState.Idle -> {
                    Button(
                        onClick = {
                            scope.launch {
                                updateManager.checkForUpdates("http://$hostOnly:8088")
                            }
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = SurfaceElevated,
                            contentColor = CyanNeon
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().height(42.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CloudDownload, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Check for Updates over Tailscale", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                is AppUpdateState.Checking -> {
                    Row(
                        modifier = Modifier.fillMaxWidth().height(42.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(color = CyanSoft, modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text("Querying Tailscale workstation (:8088)...", fontSize = 12.sp, color = CyanSoft)
                    }
                }
                is AppUpdateState.UpdateAvailable -> {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "✓ New Build Ready (${(state.sizeBytes / (1024 * 1024))} MB)",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = EmeraldOnline
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = {
                                scope.launch {
                                    updateManager.downloadAndInstallUpdate(state.downloadUrl)
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = CyanNeon,
                                contentColor = VoidBlack
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth().height(42.dp)
                        ) {
                            Text("Download & Install Update", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                is AppUpdateState.Downloading -> {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Downloading OTA Update: ${state.progressPercent}%",
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyanSoft
                            )
                            Text(
                                text = "${state.bytesDownloaded / (1024 * 1024)} MB / ${(state.totalBytes / (1024 * 1024)).coerceAtLeast(1)} MB",
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                color = TextMuted
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { state.progressPercent / 100f },
                            modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                            color = CyanNeon,
                            trackColor = SurfaceDark
                        )
                    }
                }
                is AppUpdateState.ReadyToInstall -> {
                    Button(
                        onClick = { updateManager.installApk(state.apkFile) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EmeraldOnline,
                            contentColor = VoidBlack
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().height(42.dp)
                    ) {
                        Text("Install & Restart App", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                is AppUpdateState.Error -> {
                    Column {
                        Text(
                            text = "Update Check: ${state.message}",
                            fontSize = 11.5.sp,
                            color = CrimsonAlert
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Button(
                            onClick = { updateManager.resetState() },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = SurfaceElevated,
                                contentColor = TextPrimary
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth().height(36.dp)
                        ) {
                            Text("Dismiss", fontSize = 11.5.sp)
                        }
                    }
                }
                is AppUpdateState.UpToDate -> {
                    Text(
                        text = "✓ App is up to date with latest build.",
                        fontSize = 12.sp,
                        color = EmeraldOnline
                    )
                }
            }
        }
    }
}

@Composable
fun ThemeModeCard(
    mode: AppThemeMode,
    isSelected: Boolean,
    onSelect: () -> Unit,
    modifier: Modifier = Modifier
) {
    val borderColor = if (isSelected) CyanSoft else BorderSubtle
    val containerBg = if (isSelected) CyanSoft.copy(alpha = 0.15f) else SurfaceElevated

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(containerBg)
            .border(if (isSelected) 1.5.dp else 1.dp, borderColor, RoundedCornerShape(12.dp))
            .clickable(onClick = onSelect)
            .padding(vertical = 10.dp, horizontal = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = mode.emoji, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = mode.displayName.split(" ").first(),
                fontSize = 10.5.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) CyanSoft else TextPrimary,
                maxLines = 1
            )
        }
    }
}

