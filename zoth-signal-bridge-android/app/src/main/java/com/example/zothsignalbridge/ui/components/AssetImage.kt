package com.example.zothsignalbridge.ui.components

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.SurfaceDark
import com.example.zothsignalbridge.theme.SurfaceElevated

@Composable
fun AssetAvatar(
    assetPath: String?,
    fallbackEmoji: String,
    modifier: Modifier = Modifier,
    size: Dp = 38.dp,
    borderColor: Color = BorderSubtle
) {
    val context = LocalContext.current
    val bitmap: ImageBitmap? = remember(assetPath) {
        if (assetPath.isNullOrBlank()) null
        else {
            try {
                context.assets.open(assetPath).use { input ->
                    BitmapFactory.decodeStream(input)?.asImageBitmap()
                }
            } catch (e: Exception) {
                null
            }
        }
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(SurfaceDark)
            .border(1.dp, borderColor, CircleShape),
        contentAlignment = Alignment.Center
    ) {
        if (bitmap != null) {
            Image(
                bitmap = bitmap,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        } else {
            Text(
                text = fallbackEmoji,
                fontSize = (size.value * 0.45).sp
            )
        }
    }
}

@Composable
fun AssetPetCardImage(
    petId: String,
    fallbackEmoji: String,
    modifier: Modifier = Modifier,
    size: Dp = 64.dp
) {
    val context = LocalContext.current
    val cleanId = petId.lowercase().trim()
    val assetPath = when {
        cleanId.contains("solon") || cleanId.contains("owl") || cleanId.contains("athena") -> "pets/athena-neon.jpg"
        cleanId.contains("hermes") || cleanId.contains("falcon") || cleanId.contains("aquila") -> "pets/aquila-neon.jpg"
        cleanId.contains("azoth") || cleanId.contains("chimera") || cleanId.contains("aether") -> "pets/azoth-neon.jpg"
        cleanId.contains("ignis") || cleanId.contains("phoenix") -> "pets/ignis-neon.jpg"
        cleanId.contains("draco") || cleanId.contains("dragon") -> "pets/draco-neon.jpg"
        cleanId.contains("kitsune") || cleanId.contains("fox") -> "pets/kitsune-neon.jpg"
        cleanId.contains("lycan") || cleanId.contains("wolf") -> "pets/lycan-neon.jpg"
        cleanId.contains("kraken") || cleanId.contains("squid") -> "pets/kraken-neon.jpg"
        cleanId.contains("neko") || cleanId.contains("cat") -> "pets/pixel-neko-neon.jpg"
        cleanId.contains("shiba") || cleanId.contains("dog") -> "pets/pixel-shiba-neon.jpg"
        else -> "pets/radical-minion-neon.jpg"
    }

    val bitmap: ImageBitmap? = remember(assetPath) {
        try {
            context.assets.open(assetPath).use { input ->
                BitmapFactory.decodeStream(input)?.asImageBitmap()
            }
        } catch (e: Exception) {
            null
        }
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(14.dp))
            .background(SurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(14.dp)),
        contentAlignment = Alignment.Center
    ) {
        if (bitmap != null) {
            Image(
                bitmap = bitmap,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        } else {
            Text(
                text = fallbackEmoji,
                fontSize = (size.value * 0.45).sp
            )
        }
    }
}
