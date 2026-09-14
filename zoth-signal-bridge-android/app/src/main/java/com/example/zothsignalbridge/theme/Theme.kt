package com.example.zothsignalbridge.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

enum class AppThemeMode(val id: String, val displayName: String, val emoji: String, val description: String) {
    DARK("DARK", "Void Dark", "🌙", "Deep cybernetic black with neon cyan accents"),
    LIGHT("LIGHT", "Solar Alabaster", "☀️", "Crisp high-contrast light canvas"),
    MATRIX("MATRIX", "Phosphor Matrix", "📟", "CRT terminal phosphor green"),
    GOLD("GOLD", "Alchemical Gold", "⚗️", "Hermetic obsidian with warm sacred amber")
}

data class ZothCustomColors(
    val background: Color,
    val surface: Color,
    val surfaceCard: Color,
    val surfaceElevated: Color,
    val surfaceHighlight: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textMuted: Color,
    val textDim: Color,
    val borderSubtle: Color,
    val borderNeon: Color,
    val borderCyan: Color,
    val borderGold: Color,
    val cyanNeon: Color,
    val cyanSoft: Color,
    val alchemicalGold: Color,
    val goldAccent: Color,
    val sovereignPurple: Color,
    val emeraldOnline: Color,
    val emeraldSoft: Color,
    val amberWarning: Color,
    val crimsonAlert: Color,
    val isLight: Boolean
)

// 1. Dark (Void) Scheme
private val DarkZothColorScheme = darkColorScheme(
    primary = CyanNeon,
    onPrimary = VoidBlack,
    primaryContainer = SurfaceHighlight,
    onPrimaryContainer = CyanNeon,
    secondary = AlchemicalGold,
    onSecondary = VoidBlack,
    secondaryContainer = SurfaceElevated,
    onSecondaryContainer = GoldAccent,
    tertiary = SovereignPurple,
    onTertiary = VoidBlack,
    background = VoidBlack,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextSecondary,
    outline = BorderNeon,
    outlineVariant = BorderSubtle,
    error = CrimsonAlert,
    onError = VoidBlack
)

private val DarkCustomColors = ZothCustomColors(
    background = VoidBlack,
    surface = SurfaceDark,
    surfaceCard = SurfaceCard,
    surfaceElevated = SurfaceElevated,
    surfaceHighlight = SurfaceHighlight,
    textPrimary = TextPrimary,
    textSecondary = TextSecondary,
    textMuted = TextMuted,
    textDim = TextDim,
    borderSubtle = BorderSubtle,
    borderNeon = BorderNeon,
    borderCyan = BorderCyan,
    borderGold = BorderGold,
    cyanNeon = CyanNeon,
    cyanSoft = CyanSoft,
    alchemicalGold = AlchemicalGold,
    goldAccent = GoldAccent,
    sovereignPurple = SovereignPurple,
    emeraldOnline = EmeraldOnline,
    emeraldSoft = EmeraldSoft,
    amberWarning = AmberWarning,
    crimsonAlert = CrimsonAlert,
    isLight = false
)

// 2. Light (Solar Alabaster) Scheme
private val LightZothColorScheme = lightColorScheme(
    primary = LightCyanNeon,
    onPrimary = Color.White,
    primaryContainer = LightSurfaceElevated,
    onPrimaryContainer = LightCyanSoft,
    secondary = LightAlchemicalGold,
    onSecondary = Color.White,
    secondaryContainer = LightSurfaceHighlight,
    onSecondaryContainer = LightGoldAccent,
    tertiary = LightSovereignPurple,
    onTertiary = Color.White,
    background = LightBackground,
    onBackground = LightTextPrimary,
    surface = LightSurface,
    onSurface = LightTextPrimary,
    surfaceVariant = LightSurfaceCard,
    onSurfaceVariant = LightTextSecondary,
    outline = LightBorderNeon,
    outlineVariant = LightBorderSubtle,
    error = CrimsonAlert,
    onError = Color.White
)

private val LightCustomColors = ZothCustomColors(
    background = LightBackground,
    surface = LightSurface,
    surfaceCard = LightSurfaceCard,
    surfaceElevated = LightSurfaceElevated,
    surfaceHighlight = LightSurfaceHighlight,
    textPrimary = LightTextPrimary,
    textSecondary = LightTextSecondary,
    textMuted = LightTextMuted,
    textDim = LightTextDim,
    borderSubtle = LightBorderSubtle,
    borderNeon = LightBorderNeon,
    borderCyan = LightBorderCyan,
    borderGold = LightBorderGold,
    cyanNeon = LightCyanNeon,
    cyanSoft = LightCyanSoft,
    alchemicalGold = LightAlchemicalGold,
    goldAccent = LightGoldAccent,
    sovereignPurple = LightSovereignPurple,
    emeraldOnline = EmeraldOnline,
    emeraldSoft = EmeraldSoft,
    amberWarning = AmberWarning,
    crimsonAlert = CrimsonAlert,
    isLight = true
)

// 3. Matrix (Phosphor) Scheme
private val MatrixZothColorScheme = darkColorScheme(
    primary = MatrixCyanNeon,
    onPrimary = MatrixBackground,
    primaryContainer = MatrixSurfaceElevated,
    onPrimaryContainer = MatrixCyanNeon,
    secondary = MatrixAlchemicalGold,
    onSecondary = MatrixBackground,
    secondaryContainer = MatrixSurfaceHighlight,
    onSecondaryContainer = MatrixGoldAccent,
    tertiary = MatrixSovereignPurple,
    onTertiary = MatrixBackground,
    background = MatrixBackground,
    onBackground = MatrixTextPrimary,
    surface = MatrixSurface,
    onSurface = MatrixTextPrimary,
    surfaceVariant = MatrixSurfaceCard,
    onSurfaceVariant = MatrixTextSecondary,
    outline = MatrixBorderNeon,
    outlineVariant = MatrixBorderSubtle,
    error = CrimsonAlert,
    onError = MatrixBackground
)

private val MatrixCustomColors = ZothCustomColors(
    background = MatrixBackground,
    surface = MatrixSurface,
    surfaceCard = MatrixSurfaceCard,
    surfaceElevated = MatrixSurfaceElevated,
    surfaceHighlight = MatrixSurfaceHighlight,
    textPrimary = MatrixTextPrimary,
    textSecondary = MatrixTextSecondary,
    textMuted = MatrixTextMuted,
    textDim = MatrixTextDim,
    borderSubtle = MatrixBorderSubtle,
    borderNeon = MatrixBorderNeon,
    borderCyan = MatrixBorderCyan,
    borderGold = MatrixBorderGold,
    cyanNeon = MatrixCyanNeon,
    cyanSoft = MatrixCyanSoft,
    alchemicalGold = MatrixAlchemicalGold,
    goldAccent = MatrixGoldAccent,
    sovereignPurple = MatrixSovereignPurple,
    emeraldOnline = EmeraldOnline,
    emeraldSoft = EmeraldSoft,
    amberWarning = AmberWarning,
    crimsonAlert = CrimsonAlert,
    isLight = false
)

// 4. Gold (Hermetic) Scheme
private val GoldZothColorScheme = darkColorScheme(
    primary = GoldCyanNeon,
    onPrimary = GoldBackground,
    primaryContainer = GoldSurfaceElevated,
    onPrimaryContainer = GoldCyanNeon,
    secondary = GoldAlchemicalGold,
    onSecondary = GoldBackground,
    secondaryContainer = GoldSurfaceHighlight,
    onSecondaryContainer = GoldGoldAccent,
    tertiary = GoldSovereignPurple,
    onTertiary = GoldBackground,
    background = GoldBackground,
    onBackground = GoldTextPrimary,
    surface = GoldSurface,
    onSurface = GoldTextPrimary,
    surfaceVariant = GoldSurfaceCard,
    onSurfaceVariant = GoldTextSecondary,
    outline = GoldBorderNeon,
    outlineVariant = GoldBorderSubtle,
    error = CrimsonAlert,
    onError = GoldBackground
)

private val GoldCustomColors = ZothCustomColors(
    background = GoldBackground,
    surface = GoldSurface,
    surfaceCard = GoldSurfaceCard,
    surfaceElevated = GoldSurfaceElevated,
    surfaceHighlight = GoldSurfaceHighlight,
    textPrimary = GoldTextPrimary,
    textSecondary = GoldTextSecondary,
    textMuted = GoldTextMuted,
    textDim = GoldTextDim,
    borderSubtle = GoldBorderSubtle,
    borderNeon = GoldBorderNeon,
    borderCyan = GoldBorderCyan,
    borderGold = GoldBorderGold,
    cyanNeon = GoldCyanNeon,
    cyanSoft = GoldCyanSoft,
    alchemicalGold = GoldAlchemicalGold,
    goldAccent = GoldGoldAccent,
    sovereignPurple = GoldSovereignPurple,
    emeraldOnline = EmeraldOnline,
    emeraldSoft = EmeraldSoft,
    amberWarning = AmberWarning,
    crimsonAlert = CrimsonAlert,
    isLight = false
)

val LocalZothColors = staticCompositionLocalOf { DarkCustomColors }

object ZothTheme {
    val colors: ZothCustomColors
        @Composable
        @ReadOnlyComposable
        get() = LocalZothColors.current
}

@Composable
fun ZothSignalBridgeTheme(
    themeMode: String = "DARK",
    content: @Composable () -> Unit,
) {
    val (colorScheme: ColorScheme, customColors: ZothCustomColors) = when (themeMode.uppercase()) {
        "LIGHT" -> Pair(LightZothColorScheme, LightCustomColors)
        "MATRIX" -> Pair(MatrixZothColorScheme, MatrixCustomColors)
        "GOLD" -> Pair(GoldZothColorScheme, GoldCustomColors)
        else -> Pair(DarkZothColorScheme, DarkCustomColors)
    }

    CompositionLocalProvider(LocalZothColors provides customColors) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = Typography,
            content = content
        )
    }
}
