package com.example.zothsignalbridge.ui.screens

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Computer
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.Tablet
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.window.Dialog
import com.example.zothsignalbridge.data.models.ConnectionState
import com.example.zothsignalbridge.data.models.ConnectionStatus
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.AmberWarning
import com.example.zothsignalbridge.theme.BorderNeon
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CrimsonAlert
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.EmeraldOnline
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
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun StudioWebViewScreen(
    initialUrl: String,
    onConfigureTailscaleClick: () -> Unit,
    modifier: Modifier = Modifier,
    connectionStatus: ConnectionStatus = ConnectionStatus(state = ConnectionState.CONNECTED)
) {
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var currentUrl by remember { mutableStateOf(initialUrl) }
    var pageTitle by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var loadProgress by remember { mutableFloatStateOf(0f) }
    var hasError by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var canGoBack by remember { mutableStateOf(false) }
    var canGoForward by remember { mutableStateOf(false) }

    // Viewport Mode
    var viewportMode by remember { mutableStateOf(ViewportMode.PHONE) }

    // Console logs
    val consoleLogs = remember { mutableStateListOf<ConsoleLogEntry>() }
    var showConsoleDrawer by remember { mutableStateOf(false) }
    var showCustomUrlDialog by remember { mutableStateOf(false) }
    var showPresetsHubSheet by remember { mutableStateOf(false) }
    var copiedFeedback by remember { mutableStateOf<String?>(null) }

    val clipboardManager = LocalClipboardManager.current
    val scope = rememberCoroutineScope()
    val bottomSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    val errorCount = consoleLogs.count { it.level == ConsoleLogLevel.ERROR }
    val warnCount = consoleLogs.count { it.level == ConsoleLogLevel.WARN }

    fun addLog(level: ConsoleLogLevel, message: String, sourceId: String? = null, lineNumber: Int = 0) {
        val time = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        val entry = ConsoleLogEntry(
            id = System.currentTimeMillis() + (0..999).random(),
            timestamp = time,
            level = level,
            message = message,
            sourceId = sourceId,
            lineNumber = lineNumber
        )
        consoleLogs.add(0, entry)
        if (consoleLogs.size > 200) {
            consoleLogs.removeAt(consoleLogs.lastIndex)
        }
    }

    fun navigateToUrl(targetUrl: String) {
        val resolved = resolvePresetUrl(currentUrl.ifBlank { initialUrl }, targetUrl)
        currentUrl = resolved
        hasError = false
        errorMessage = null
        isLoading = true
        addLog(ConsoleLogLevel.INFO, "Navigating to: $resolved")
        webViewInstance?.loadUrl(resolved)
    }

    LaunchedEffect(initialUrl) {
        if (initialUrl.isNotBlank() && initialUrl != currentUrl) {
            navigateToUrl(initialUrl)
        }
    }

    LaunchedEffect(viewportMode) {
        webViewInstance?.let { webView ->
            webView.settings.apply {
                if (viewportMode.isDesktop) {
                    userAgentString = ViewportMode.DESKTOP_USER_AGENT
                    useWideViewPort = true
                    loadWithOverviewMode = true
                } else {
                    userAgentString = null
                    useWideViewPort = true
                    loadWithOverviewMode = true
                }
            }
            webView.reload()
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(VoidBlack)
    ) {
        // --- 1. Sleek Google Chrome / Safari Style Top Address Bar ---
        TopChromeAddressBar(
            currentUrl = currentUrl,
            pageTitle = pageTitle,
            isLoading = isLoading,
            loadProgress = loadProgress,
            canGoBack = canGoBack,
            canGoForward = canGoForward,
            viewportMode = viewportMode,
            connectionStatus = connectionStatus,
            errorCount = errorCount,
            logCount = consoleLogs.size,
            onBackClick = { if (webViewInstance?.canGoBack() == true) webViewInstance?.goBack() },
            onForwardClick = { if (webViewInstance?.canGoForward() == true) webViewInstance?.goForward() },
            onReloadClick = {
                hasError = false
                errorMessage = null
                addLog(ConsoleLogLevel.INFO, "Reloading current page")
                webViewInstance?.reload()
            },
            onAddressBarClick = { showCustomUrlDialog = true },
            onViewportModeChange = { mode -> viewportMode = mode },
            onConsoleDrawerClick = { showConsoleDrawer = true },
            onTailscaleStatusClick = onConfigureTailscaleClick
        )

        // --- 2. Main Sandbox Canvas / Error Fallback ---
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(VoidBlack)
        ) {
            // Viewport Container (Phone, Tablet 768px, Desktop 1440px)
            ViewportSandboxContainer(
                viewportMode = viewportMode,
                modifier = Modifier.fillMaxSize()
            ) {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { context ->
                        WebView(context).apply {
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                databaseEnabled = true
                                loadWithOverviewMode = true
                                useWideViewPort = true
                                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                setSupportZoom(true)
                                builtInZoomControls = true
                                displayZoomControls = false
                                allowContentAccess = true
                                allowFileAccess = true
                            }

                            addJavascriptInterface(
                                ZothNativeBridge(
                                    onNavigateUrl = { path -> navigateToUrl(path) },
                                    onAddLog = { lvl, msg -> addLog(lvl, msg) }
                                ),
                                "ZothBridge"
                            )

                            webChromeClient = object : WebChromeClient() {
                                override fun onReceivedTitle(view: WebView?, title: String?) {
                                    if (!title.isNullOrBlank()) {
                                        pageTitle = title
                                    }
                                }

                                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                    loadProgress = newProgress / 100f
                                    isLoading = newProgress < 100
                                    canGoBack = view?.canGoBack() == true
                                    canGoForward = view?.canGoForward() == true
                                }

                                override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                                    consoleMessage?.let {
                                        val level = when (it.messageLevel()) {
                                            ConsoleMessage.MessageLevel.ERROR -> ConsoleLogLevel.ERROR
                                            ConsoleMessage.MessageLevel.WARNING -> ConsoleLogLevel.WARN
                                            ConsoleMessage.MessageLevel.LOG -> ConsoleLogLevel.LOG
                                            ConsoleMessage.MessageLevel.TIP -> ConsoleLogLevel.INFO
                                            ConsoleMessage.MessageLevel.DEBUG -> ConsoleLogLevel.DEBUG
                                            else -> ConsoleLogLevel.LOG
                                        }
                                        addLog(
                                            level = level,
                                            message = it.message() ?: "",
                                            sourceId = it.sourceId(),
                                            lineNumber = it.lineNumber()
                                        )
                                    }
                                    return super.onConsoleMessage(consoleMessage)
                                }
                            }

                            webViewClient = object : WebViewClient() {
                                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                    isLoading = true
                                    hasError = false
                                    if (!url.isNullOrBlank()) {
                                        currentUrl = url
                                    }
                                    canGoBack = view?.canGoBack() == true
                                    canGoForward = view?.canGoForward() == true
                                }

                                override fun onPageFinished(view: WebView?, url: String?) {
                                    isLoading = false
                                    if (!url.isNullOrBlank()) {
                                        currentUrl = url
                                    }
                                    canGoBack = view?.canGoBack() == true
                                    canGoForward = view?.canGoForward() == true
                                    addLog(ConsoleLogLevel.LOG, "Page loaded: ${url ?: ""}")
                                }

                                override fun onReceivedError(
                                    view: WebView?,
                                    request: WebResourceRequest?,
                                    error: WebResourceError?
                                ) {
                                    val isMain = request?.isForMainFrame == true
                                    val desc = error?.description?.toString() ?: "Network connection failed"
                                    addLog(
                                        level = ConsoleLogLevel.ERROR,
                                        message = "Error [${error?.errorCode}]: $desc for ${request?.url}",
                                        sourceId = request?.url?.toString(),
                                        lineNumber = 0
                                    )
                                    if (isMain) {
                                        isLoading = false
                                        hasError = true
                                        errorMessage = desc
                                    }
                                }

                                override fun onReceivedHttpError(
                                    view: WebView?,
                                    request: WebResourceRequest?,
                                    errorResponse: WebResourceResponse?
                                ) {
                                    val statusCode = errorResponse?.statusCode ?: 0
                                    val phrase = errorResponse?.reasonPhrase ?: "HTTP Error"
                                    addLog(
                                        level = if (statusCode >= 500) ConsoleLogLevel.ERROR else ConsoleLogLevel.WARN,
                                        message = "HTTP $statusCode ($phrase) on ${request?.url}",
                                        sourceId = request?.url?.toString()
                                    )
                                    if (request?.isForMainFrame == true && statusCode >= 400) {
                                        hasError = true
                                        errorMessage = "HTTP $statusCode: $phrase"
                                    }
                                }
                            }

                            loadUrl(currentUrl)
                            webViewInstance = this
                        }
                    },
                    update = { webView ->
                        webViewInstance = webView
                    }
                )
            }

            // --- 5. Offline Friendly Fallback Screen ---
            if (hasError) {
                OfflineFallbackView(
                    targetUrl = currentUrl,
                    errorMessage = errorMessage,
                    onRetryClick = {
                        hasError = false
                        errorMessage = null
                        addLog(ConsoleLogLevel.INFO, "Retrying connection to: $currentUrl")
                        webViewInstance?.loadUrl(currentUrl)
                    },
                    onConfigureTailscaleClick = onConfigureTailscaleClick,
                    onOpenConsoleClick = { showConsoleDrawer = true },
                    onSelectPreset = { presetPath -> navigateToUrl(presetPath) },
                    modifier = Modifier.fillMaxSize()
                )
            }

            // --- 2. Floating Bottom Pill / Preset Action Bar ---
            FloatingBottomPillBar(
                currentUrl = currentUrl,
                onPresetClick = { preset -> navigateToUrl(preset.path) },
                onHubClick = { showPresetsHubSheet = true },
                onCustomUrlClick = { showCustomUrlDialog = true },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 12.dp)
            )

            // Copied notification popup
            if (copiedFeedback != null) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 16.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceElevated)
                        .border(1.dp, CyanNeon, RoundedCornerShape(20.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = copiedFeedback ?: "",
                        fontSize = 12.sp,
                        color = CyanNeon,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }

    // --- 4. Console Log & Error Drawer (Modal Bottom Sheet) ---
    if (showConsoleDrawer) {
        ModalBottomSheet(
            onDismissRequest = { showConsoleDrawer = false },
            sheetState = bottomSheetState,
            containerColor = SurfaceDark,
            contentColor = TextPrimary,
            dragHandle = {
                Box(
                    modifier = Modifier
                        .padding(vertical = 10.dp)
                        .size(width = 36.dp, height = 4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(TextMuted.copy(alpha = 0.5f))
                )
            }
        ) {
            ConsoleDrawerSheetContent(
                logs = consoleLogs,
                onClearLogs = { consoleLogs.clear() },
                onCopyAllLogs = {
                    val fullText = consoleLogs.joinToString("\n") { "[${it.timestamp}] [${it.level.label}] ${it.message} (${it.sourceId ?: "inline"}:${it.lineNumber})" }
                    clipboardManager.setText(AnnotatedString(fullText))
                    copiedFeedback = "Copied ${consoleLogs.size} logs"
                    scope.launch {
                        kotlinx.coroutines.delay(2000)
                        copiedFeedback = null
                    }
                },
                onCopyLogItem = { entry ->
                    val text = "[${entry.timestamp}] [${entry.level.label}] ${entry.message}"
                    clipboardManager.setText(AnnotatedString(text))
                    copiedFeedback = "Copied log"
                    scope.launch {
                        kotlinx.coroutines.delay(2000)
                        copiedFeedback = null
                    }
                },
                onClose = {
                    scope.launch { bottomSheetState.hide() }.invokeOnCompletion {
                        if (!bottomSheetState.isVisible) {
                            showConsoleDrawer = false
                        }
                    }
                }
            )
        }
    }

    // --- Presets Hub Bottom Sheet ---
    if (showPresetsHubSheet) {
        ModalBottomSheet(
            onDismissRequest = { showPresetsHubSheet = false },
            containerColor = SurfaceDark,
            contentColor = TextPrimary
        ) {
            PresetsHubSheetContent(
                currentUrl = currentUrl,
                onSelectPreset = { preset: StudioPreset ->
                    showPresetsHubSheet = false
                    navigateToUrl(preset.path)
                },
                onOpenCustomUrl = {
                    showPresetsHubSheet = false
                    showCustomUrlDialog = true
                }
            )
        }
    }

    // --- Custom URL Entry Dialog ---
    if (showCustomUrlDialog) {
        CustomUrlDialog(
            initialUrl = currentUrl,
            onDismiss = { showCustomUrlDialog = false },
            onNavigate = { url ->
                showCustomUrlDialog = false
                navigateToUrl(url)
            }
        )
    }
}

// =========================================================================================
// 1. Google Chrome / Safari Style Mobile Top Address Bar
// =========================================================================================

@Composable
fun TopChromeAddressBar(
    currentUrl: String,
    pageTitle: String,
    isLoading: Boolean,
    loadProgress: Float,
    canGoBack: Boolean,
    canGoForward: Boolean,
    viewportMode: ViewportMode,
    connectionStatus: ConnectionStatus,
    errorCount: Int,
    logCount: Int,
    onBackClick: () -> Unit,
    onForwardClick: () -> Unit,
    onReloadClick: () -> Unit,
    onAddressBarClick: () -> Unit,
    onViewportModeChange: (ViewportMode) -> Unit,
    onConsoleDrawerClick: () -> Unit,
    onTailscaleStatusClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val displayTitle = extractDisplayTitle(currentUrl, pageTitle)
    val displayHost = extractDisplayHost(currentUrl)
    val displayPath = extractPath(currentUrl)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(SurfaceDark)
            .border(1.dp, BorderSubtle)
    ) {
        // --- Row 1: Tailscale Indicator, Safari/Chrome Capsule Address Bar, Reload Action ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Tailscale Status Indicator Pill
            TailscaleConnectionPill(
                status = connectionStatus,
                host = displayHost,
                onClick = onTailscaleStatusClick
            )

            // Sleek Capsule Address Bar
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(20.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, BorderNeon, RoundedCornerShape(20.dp))
                    .clickable(onClick = onAddressBarClick)
                    .padding(horizontal = 10.dp, vertical = 5.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Secure Mesh Link",
                        tint = CyanNeon,
                        modifier = Modifier.size(13.dp)
                    )

                    Spacer(modifier = Modifier.width(6.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = displayTitle,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Text(
                            text = if (displayPath.isNotEmpty() && displayPath != "/") "$displayHost$displayPath" else displayHost,
                            fontSize = 10.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    Spacer(modifier = Modifier.width(4.dp))

                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit URL",
                        tint = TextMuted,
                        modifier = Modifier.size(13.dp)
                    )
                }
            }

            // Reload / Stop Button
            IconButton(
                onClick = onReloadClick,
                modifier = Modifier.size(34.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        color = CyanNeon,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Reload",
                        tint = CyanSoft,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // --- Row 2: Navigation Buttons, Device Viewport Mode Switcher, DevTools Trigger ---
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // History Navigation
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = onBackClick,
                    enabled = canGoBack,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = if (canGoBack) CyanNeon else TextDim,
                        modifier = Modifier.size(16.dp)
                    )
                }

                IconButton(
                    onClick = onForwardClick,
                    enabled = canGoForward,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Forward",
                        tint = if (canGoForward) CyanNeon else TextDim,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // 3. Viewport Mode Switcher (Phone 390px, Tablet 768px, Desktop 1440px)
            ViewportSwitcherSegment(
                activeMode = viewportMode,
                onModeSelect = onViewportModeChange
            )

            // 4. Console & Log Drawer Trigger with dynamic badge
            ConsoleDrawerBadgeButton(
                logCount = logCount,
                errorCount = errorCount,
                onClick = onConsoleDrawerClick
            )
        }

        // Loading Progress Bar
        if (isLoading) {
            LinearProgressIndicator(
                progress = { loadProgress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp),
                color = CyanNeon,
                trackColor = SurfaceHighlight
            )
        }
    }
}

@Composable
fun TailscaleConnectionPill(
    status: ConnectionStatus,
    host: String,
    onClick: () -> Unit
) {
    val (dotColor, label) = when (status.state) {
        ConnectionState.CONNECTED -> Pair(EmeraldOnline, "TS Active")
        ConnectionState.CONNECTING -> Pair(GoldAccent, "Mesh...")
        ConnectionState.OFFLINE -> Pair(CrimsonAlert, "TS Offline")
        ConnectionState.ERROR -> Pair(CrimsonAlert, "Link Err")
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceElevated)
            .border(1.dp, dotColor.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 7.dp, vertical = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(dotColor)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = label,
            fontSize = 9.5.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun ViewportSwitcherSegment(
    activeMode: ViewportMode,
    onModeSelect: (ViewportMode) -> Unit
) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ViewportSegmentItem(
            mode = ViewportMode.PHONE,
            icon = Icons.Default.Smartphone,
            isSelected = activeMode == ViewportMode.PHONE,
            onClick = { onModeSelect(ViewportMode.PHONE) }
        )
        ViewportSegmentItem(
            mode = ViewportMode.TABLET,
            icon = Icons.Default.Tablet,
            isSelected = activeMode == ViewportMode.TABLET,
            onClick = { onModeSelect(ViewportMode.TABLET) }
        )
        ViewportSegmentItem(
            mode = ViewportMode.DESKTOP,
            icon = Icons.Default.Computer,
            isSelected = activeMode == ViewportMode.DESKTOP,
            onClick = { onModeSelect(ViewportMode.DESKTOP) }
        )
    }
}

@Composable
fun ViewportSegmentItem(
    mode: ViewportMode,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(if (isSelected) CyanNeon.copy(alpha = 0.2f) else Color.Transparent)
            .border(
                width = if (isSelected) 1.dp else 0.dp,
                color = if (isSelected) CyanNeon else Color.Transparent,
                shape = RoundedCornerShape(6.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 6.dp, vertical = 3.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = mode.title,
                tint = if (isSelected) CyanNeon else TextMuted,
                modifier = Modifier.size(12.dp)
            )
            Spacer(modifier = Modifier.width(3.dp))
            Text(
                text = mode.subtitle,
                fontSize = 9.5.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) CyanNeon else TextMuted,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun ConsoleDrawerBadgeButton(
    logCount: Int,
    errorCount: Int,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (errorCount > 0) CrimsonAlert.copy(alpha = 0.15f) else SurfaceCard)
            .border(
                width = 1.dp,
                color = if (errorCount > 0) CrimsonAlert.copy(alpha = 0.6f) else BorderSubtle,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 7.dp, vertical = 3.dp)
    ) {
        Icon(
            imageVector = if (errorCount > 0) Icons.Default.BugReport else Icons.Default.Terminal,
            contentDescription = "DevTools Console",
            tint = if (errorCount > 0) CrimsonAlert else CyanSoft,
            modifier = Modifier.size(13.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = if (errorCount > 0) "$errorCount err" else "$logCount logs",
            fontSize = 9.5.sp,
            fontWeight = FontWeight.SemiBold,
            color = if (errorCount > 0) CrimsonAlert else TextSecondary,
            fontFamily = FontFamily.Monospace
        )
    }
}

// =========================================================================================
// 3. Viewport Sandbox Mode Container
// =========================================================================================

@Composable
fun ViewportSandboxContainer(
    viewportMode: ViewportMode,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    when (viewportMode) {
        ViewportMode.PHONE -> {
            Box(modifier = modifier.fillMaxSize()) {
                content()
            }
        }
        ViewportMode.TABLET -> {
            Column(
                modifier = modifier
                    .fillMaxSize()
                    .background(VoidBlack)
            ) {
                // Device Viewport Bezel Header
                DeviceBezelHeader(title = "📱 Tablet Viewport Mode · 768px Width (Scroll horizontally)")
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    contentAlignment = Alignment.TopCenter
                ) {
                    Box(
                        modifier = Modifier
                            .width(768.dp)
                            .fillMaxHeight()
                            .border(1.dp, BorderNeon)
                    ) {
                        content()
                    }
                }
            }
        }
        ViewportMode.DESKTOP -> {
            Column(
                modifier = modifier
                    .fillMaxSize()
                    .background(VoidBlack)
            ) {
                // Device Viewport Bezel Header
                DeviceBezelHeader(title = "💻 Desktop Viewport Mode · 1440px Width · Desktop UserAgent")
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                ) {
                    Box(
                        modifier = Modifier
                            .width(1440.dp)
                            .fillMaxHeight()
                            .border(1.dp, BorderNeon)
                    ) {
                        content()
                    }
                }
            }
        }
    }
}

@Composable
fun DeviceBezelHeader(title: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceCard)
            .border(1.dp, BorderSubtle)
            .padding(horizontal = 12.dp, vertical = 3.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            fontSize = 10.sp,
            color = AlchemicalGold,
            fontFamily = FontFamily.Monospace
        )
    }
}

// =========================================================================================
// 2. Floating Bottom Pill / Preset Action Bar
// =========================================================================================

@Composable
fun FloatingBottomPillBar(
    currentUrl: String,
    onPresetClick: (StudioPreset) -> Unit,
    onHubClick: () -> Unit,
    onCustomUrlClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentPreset = StudioPresets.findMatchingPreset(currentUrl)

    Box(
        modifier = modifier
            .padding(horizontal = 12.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(SurfaceDark.copy(alpha = 0.94f))
            .border(1.dp, BorderNeon, RoundedCornerShape(24.dp))
            .padding(horizontal = 6.dp, vertical = 5.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            // Presets Hub Icon Button
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceElevated)
                    .clickable(onClick = onHubClick)
                    .padding(horizontal = 9.dp, vertical = 5.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Hub,
                        contentDescription = "All Tools & Hubs",
                        tint = AlchemicalGold,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "All Tools",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Quick Featured Preset Chips
            val quickFeatured = listOf("swarm", "nexus_3d", "netlify_ax", "comic_saga", "consensus_studio")
            val featuredPresets = StudioPresets.PRESETS.filter { it.id in quickFeatured }

            featuredPresets.forEach { preset ->
                val isSelected = currentPreset?.id == preset.id
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) CyanNeon.copy(alpha = 0.22f) else SurfaceCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) CyanNeon else BorderSubtle,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .clickable { onPresetClick(preset) }
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = preset.shortTitle,
                        fontSize = 10.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) CyanNeon else TextSecondary,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Custom URL Action
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceCard)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(16.dp))
                    .clickable(onClick = onCustomUrlClick)
                    .padding(horizontal = 6.dp, vertical = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Language,
                    contentDescription = "Custom URL",
                    tint = TextMuted,
                    modifier = Modifier.size(13.dp)
                )
            }
        }
    }
}

// =========================================================================================
// 4. Console Log & Error Drawer Bottom Sheet
// =========================================================================================

@Composable
fun ConsoleDrawerSheetContent(
    logs: List<ConsoleLogEntry>,
    onClearLogs: () -> Unit,
    onCopyAllLogs: () -> Unit,
    onCopyLogItem: (ConsoleLogEntry) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedLevelFilter by remember { mutableStateOf<ConsoleLogLevel?>(null) }
    var searchQuery by remember { mutableStateOf("") }

    val filteredLogs = remember(logs, selectedLevelFilter, searchQuery) {
        filterLogs(logs, selectedLevelFilter, searchQuery)
    }

    val errorCount = logs.count { it.level == ConsoleLogLevel.ERROR }
    val warnCount = logs.count { it.level == ConsoleLogLevel.WARN }
    val infoCount = logs.count { it.level == ConsoleLogLevel.INFO || it.level == ConsoleLogLevel.LOG }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(max = 560.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Sheet Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Terminal,
                    contentDescription = "Console Logs",
                    tint = CyanNeon,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Console & DevTools Telemetry",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onCopyAllLogs, modifier = Modifier.size(30.dp)) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy All Logs",
                        tint = CyanSoft,
                        modifier = Modifier.size(16.dp)
                    )
                }
                IconButton(onClick = onClearLogs, modifier = Modifier.size(30.dp)) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Clear Logs",
                        tint = CrimsonAlert,
                        modifier = Modifier.size(16.dp)
                    )
                }
                IconButton(onClick = onClose, modifier = Modifier.size(30.dp)) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = TextMuted,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Filter Chips Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            ConsoleFilterChip(
                label = "All (${logs.size})",
                isSelected = selectedLevelFilter == null,
                activeColor = CyanNeon,
                onClick = { selectedLevelFilter = null }
            )
            ConsoleFilterChip(
                label = "Errors ($errorCount)",
                isSelected = selectedLevelFilter == ConsoleLogLevel.ERROR,
                activeColor = CrimsonAlert,
                onClick = { selectedLevelFilter = ConsoleLogLevel.ERROR }
            )
            ConsoleFilterChip(
                label = "Warnings ($warnCount)",
                isSelected = selectedLevelFilter == ConsoleLogLevel.WARN,
                activeColor = AmberWarning,
                onClick = { selectedLevelFilter = ConsoleLogLevel.WARN }
            )
            ConsoleFilterChip(
                label = "Logs ($infoCount)",
                isSelected = selectedLevelFilter == ConsoleLogLevel.LOG,
                activeColor = CyanSoft,
                onClick = { selectedLevelFilter = ConsoleLogLevel.LOG }
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Search text input
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Filter console output...", fontSize = 12.sp, color = TextMuted) },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = TextMuted,
                    modifier = Modifier.size(16.dp)
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }, modifier = Modifier.size(24.dp)) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Clear",
                            tint = TextMuted,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .height(44.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceCard,
                unfocusedContainerColor = SurfaceCard,
                focusedBorderColor = CyanNeon,
                unfocusedBorderColor = BorderSubtle,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            ),
            shape = RoundedCornerShape(8.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Log Items List
        if (filteredLogs.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(vertical = 32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = "No Logs",
                        tint = TextMuted,
                        modifier = Modifier.size(32.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (logs.isEmpty()) "No console logs captured yet.\nJavaScript telemetry from the Web HUD will stream here." else "No matching logs found.",
                        fontSize = 12.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(filteredLogs, key = { it.id }) { entry ->
                    ConsoleLogItemCard(
                        entry = entry,
                        onClick = { onCopyLogItem(entry) }
                    )
                }
            }
        }
    }
}

@Composable
fun ConsoleFilterChip(
    label: String,
    isSelected: Boolean,
    activeColor: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(if (isSelected) activeColor.copy(alpha = 0.2f) else SurfaceCard)
            .border(
                width = 1.dp,
                color = if (isSelected) activeColor else BorderSubtle,
                shape = RoundedCornerShape(6.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) activeColor else TextSecondary,
            fontFamily = FontFamily.Monospace
        )
    }
}

@Composable
fun ConsoleLogItemCard(
    entry: ConsoleLogEntry,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceCard)
            .border(1.dp, entry.level.color.copy(alpha = 0.25f), RoundedCornerShape(6.dp))
            .clickable(onClick = onClick)
            .padding(8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(entry.level.color.copy(alpha = 0.2f))
                        .padding(horizontal = 4.dp, vertical = 1.dp)
                ) {
                    Text(
                        text = entry.level.label,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = entry.level.color,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.width(6.dp))

                Text(
                    text = entry.timestamp,
                    fontSize = 10.sp,
                    color = TextMuted,
                    fontFamily = FontFamily.Monospace
                )
            }

            if (!entry.sourceId.isNullOrBlank()) {
                val shortSource = entry.sourceId.substringAfterLast('/')
                Text(
                    text = if (entry.lineNumber > 0) "$shortSource:${entry.lineNumber}" else shortSource,
                    fontSize = 9.5.sp,
                    color = SovereignPurple,
                    fontFamily = FontFamily.Monospace,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = entry.message,
            fontSize = 11.sp,
            color = TextPrimary,
            fontFamily = FontFamily.Monospace
        )
    }
}

// =========================================================================================
// 5. Offline Friendly Fallback with Friendly Retry Guide
// =========================================================================================

@Composable
fun OfflineFallbackView(
    targetUrl: String,
    errorMessage: String?,
    onRetryClick: () -> Unit,
    onConfigureTailscaleClick: () -> Unit,
    onOpenConsoleClick: () -> Unit,
    onSelectPreset: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(VoidBlack.copy(alpha = 0.96f))
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(SurfaceCard)
                .border(1.dp, CrimsonAlert.copy(alpha = 0.45f), RoundedCornerShape(16.dp))
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Icon & Header
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(CircleShape)
                    .background(CrimsonAlert.copy(alpha = 0.12f))
                    .border(1.dp, CrimsonAlert.copy(alpha = 0.4f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Warning,
                    contentDescription = "Offline Warning",
                    tint = CrimsonAlert,
                    modifier = Modifier.size(28.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Tailscale Signal Link Paused",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Cannot reach studio node over Tailscale mesh network",
                fontSize = 11.5.sp,
                color = TextMuted,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Endpoint Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                    .padding(8.dp)
            ) {
                Column {
                    Text(
                        text = "TARGET: $targetUrl",
                        fontSize = 10.5.sp,
                        color = AlchemicalGold,
                        fontFamily = FontFamily.Monospace
                    )
                    if (!errorMessage.isNullOrBlank()) {
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "REASON: $errorMessage",
                            fontSize = 10.sp,
                            color = CrimsonAlert,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Friendly Diagnostic Checklist
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(SurfaceDark)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(10.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = "Diagnostic & Recovery Checklist:",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanSoft
                )
                Spacer(modifier = Modifier.height(6.dp))

                DiagnosticStepItem("1. Tailscale VPN", "Ensure Tailscale app is active and connected on your device.")
                DiagnosticStepItem("2. Target IP", "Verify the host IP matches your active Tailscale node.")
                DiagnosticStepItem("3. Web Service", "Check that the Studio daemon is listening on port 8088 / 8484.")
                DiagnosticStepItem("4. Firewall/ACL", "Confirm mesh ACL permits traffic between this client and host.")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onRetryClick,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = CyanNeon, contentColor = VoidBlack),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Retry",
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Retry Link", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                Button(
                    onClick = onConfigureTailscaleClick,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = AlchemicalGold),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Change IP", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = onOpenConsoleClick,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = SurfaceDark, contentColor = TextSecondary),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Terminal,
                    contentDescription = "Logs",
                    tint = CyanSoft,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text("Inspect DevTools Logs", fontSize = 11.5.sp)
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Quick Preset Try Alternatives
            Text(
                text = "Or switch to another sandbox endpoint:",
                fontSize = 10.5.sp,
                color = TextMuted
            )
            Spacer(modifier = Modifier.height(6.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                StudioPresets.PRESETS.take(3).forEach { preset ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(SurfaceElevated)
                            .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
                            .clickable { onSelectPreset(preset.path) }
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = preset.shortTitle,
                            fontSize = 10.sp,
                            color = CyanSoft,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DiagnosticStepItem(title: String, desc: String) {
    Column(modifier = Modifier.padding(vertical = 3.dp)) {
        Text(
            text = title,
            fontSize = 10.5.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextPrimary,
            fontFamily = FontFamily.Monospace
        )
        Text(
            text = desc,
            fontSize = 10.sp,
            color = TextMuted
        )
    }
}

// =========================================================================================
// Presets Hub & Custom URL Dialogs
// =========================================================================================

@Composable
fun PresetsHubSheetContent(
    currentUrl: String,
    onSelectPreset: (StudioPreset) -> Unit,
    onOpenCustomUrl: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(StudioCategory.ALL) }
    val activePreset = StudioPresets.findMatchingPreset(currentUrl)

    val filteredPresets = remember(searchQuery, selectedCategory) {
        val categoryList = if (selectedCategory == StudioCategory.ALL) {
            StudioPresets.PRESETS
        } else {
            StudioPresets.PRESETS.filter { it.category == selectedCategory }
        }

        if (searchQuery.isBlank()) {
            categoryList
        } else {
            val q = searchQuery.trim().lowercase()
            categoryList.filter {
                it.title.lowercase().contains(q) ||
                it.shortTitle.lowercase().contains(q) ||
                it.path.lowercase().contains(q) ||
                it.description.lowercase().contains(q) ||
                it.badge.lowercase().contains(q)
            }
        }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(max = 600.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Hub,
                    contentDescription = "Presets Hub",
                    tint = AlchemicalGold,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "ZOTH STUDIO CATALOG",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = AlchemicalGold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.sp
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceElevated)
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(
                    text = "${filteredPresets.size} / ${StudioPresets.PRESETS.size}",
                    fontSize = 10.5.sp,
                    color = CyanSoft,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            placeholder = {
                Text(
                    text = "Search 40+ studio tools, workstations, pages...",
                    fontSize = 11.5.sp,
                    color = TextMuted
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = CyanSoft,
                    modifier = Modifier.size(16.dp)
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Clear",
                            tint = TextMuted,
                            modifier = Modifier.size(15.dp)
                        )
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(10.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = SurfaceCard,
                unfocusedContainerColor = SurfaceCard,
                focusedBorderColor = CyanSoft,
                unfocusedBorderColor = BorderSubtle,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            )
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Category Filter Chips Row
        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            items(StudioCategory.values()) { cat ->
                val isSelected = selectedCategory == cat
                val count = if (cat == StudioCategory.ALL) StudioPresets.PRESETS.size else StudioPresets.PRESETS.count { it.category == cat }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) SurfaceElevated else SurfaceCard)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) CyanSoft else BorderSubtle,
                            shape = RoundedCornerShape(16.dp)
                        )
                        .clickable { selectedCategory = cat }
                        .padding(horizontal = 10.dp, vertical = 5.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = cat.emoji, fontSize = 11.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = cat.displayName,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) CyanSoft else TextSecondary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "($count)",
                            fontSize = 9.5.sp,
                            color = if (isSelected) CyanSoft else TextMuted,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Scrollable Presets Grid / List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filteredPresets, key = { it.id }) { preset ->
                val isSelected = activePreset?.id == preset.id
                PresetCardItem(
                    preset = preset,
                    isSelected = isSelected,
                    onClick = { onSelectPreset(preset) }
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Custom URL Button at bottom
        Button(
            onClick = onOpenCustomUrl,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = CyanNeon),
            shape = RoundedCornerShape(10.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Edit,
                contentDescription = "Custom URL",
                modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text("Enter Custom URL...", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(6.dp))
    }
}

@Composable
fun PresetCardItem(
    preset: StudioPreset,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyanNeon.copy(alpha = 0.12f) else SurfaceCard)
            .border(
                width = 1.dp,
                color = if (isSelected) CyanNeon else BorderSubtle,
                shape = RoundedCornerShape(10.dp)
            )
            .clickable(onClick = onClick)
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
                Text(
                    text = preset.category.emoji,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = preset.title,
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) CyanNeon else TextPrimary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(AlchemicalGold.copy(alpha = 0.2f))
                                .padding(horizontal = 4.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = preset.badge,
                                fontSize = 8.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = AlchemicalGold,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                    Text(
                        text = preset.path,
                        fontSize = 9.5.sp,
                        color = TextMuted,
                        fontFamily = FontFamily.Monospace,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                if (isSelected) {
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(CyanNeon)
                            .padding(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(5.dp)
                                .clip(CircleShape)
                                .background(VoidBlack)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // Description Preview
        Text(
            text = preset.description,
            fontSize = 10.5.sp,
            color = TextSecondary,
            lineHeight = 14.sp
        )
    }
}

@Composable
fun CustomUrlDialog(
    initialUrl: String,
    onDismiss: () -> Unit,
    onNavigate: (String) -> Unit
) {
    var urlText by remember { mutableStateOf(initialUrl) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = SurfaceDark,
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderNeon),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Navigate to Custom URL",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = urlText,
                    onValueChange = { urlText = it },
                    label = { Text("URL / Endpoint Path") },
                    placeholder = { Text("http://100.125.220.102:8088/studio/swarm.html") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Uri,
                        imeAction = ImeAction.Go
                    ),
                    keyboardActions = KeyboardActions(onGo = { onNavigate(urlText) }),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = CyanNeon,
                        unfocusedBorderColor = BorderSubtle,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Quick Path Helpers
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    QuickPathChip("/studio/swarm.html") { urlText = resolvePresetUrl(urlText, it) }
                    QuickPathChip("/dashboard") { urlText = resolvePresetUrl(urlText, it) }
                    QuickPathChip("/comic/index.html") { urlText = resolvePresetUrl(urlText, it) }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    Button(
                        onClick = onDismiss,
                        colors = ButtonDefaults.buttonColors(containerColor = SurfaceElevated, contentColor = TextSecondary)
                    ) {
                        Text("Cancel")
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = { onNavigate(urlText) },
                        colors = ButtonDefaults.buttonColors(containerColor = CyanNeon, contentColor = VoidBlack)
                    ) {
                        Text("Navigate", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun QuickPathChip(path: String, onClick: (String) -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(SurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
            .clickable { onClick(path) }
            .padding(horizontal = 6.dp, vertical = 3.dp)
    ) {
        Text(
            text = path.substringAfterLast('/'),
            fontSize = 9.5.sp,
            color = CyanSoft,
            fontFamily = FontFamily.Monospace
        )
    }
}

class ZothNativeBridge(
    private val onNavigateUrl: (String) -> Unit,
    private val onAddLog: (ConsoleLogLevel, String) -> Unit
) {
    @android.webkit.JavascriptInterface
    fun navigateTo(path: String) {
        onNavigateUrl(path)
    }

    @android.webkit.JavascriptInterface
    fun log(level: String, message: String) {
        val lvl = when (level.lowercase()) {
            "error" -> ConsoleLogLevel.ERROR
            "warn" -> ConsoleLogLevel.WARN
            "info" -> ConsoleLogLevel.INFO
            else -> ConsoleLogLevel.LOG
        }
        onAddLog(lvl, message)
    }

    @android.webkit.JavascriptInterface
    fun getPlatform(): String = "android-zoth-signal-bridge"
}

