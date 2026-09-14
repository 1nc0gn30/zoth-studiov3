package com.example.zothsignalbridge.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.zothsignalbridge.data.models.PantheonData
import com.example.zothsignalbridge.theme.AlchemicalGold
import com.example.zothsignalbridge.theme.BorderCyan
import com.example.zothsignalbridge.theme.BorderSubtle
import com.example.zothsignalbridge.theme.CyanNeon
import com.example.zothsignalbridge.theme.CyanSoft
import com.example.zothsignalbridge.theme.SurfaceCard
import com.example.zothsignalbridge.theme.SurfaceElevated
import com.example.zothsignalbridge.theme.TextMuted
import com.example.zothsignalbridge.theme.TextPrimary
import com.example.zothsignalbridge.theme.TextSecondary
import com.example.zothsignalbridge.theme.VoidBlack

data class ChannelItem(
    val id: String,
    val label: String,
    val icon: String
)

@Composable
fun ChannelSelector(
    selectedChannel: String,
    onChannelSelected: (String) -> Unit,
    messageCounts: Map<String, Int> = emptyMap(),
    modifier: Modifier = Modifier
) {
    // Dynamic channels: Broadcast + Special + Pantheon Archetypes
    val baseChannels = listOf(
        ChannelItem("all", "Broadcast", "📡"),
        ChannelItem("consensus", "Consensus", "⚖️"),
        ChannelItem("claims", "Claims", "🔒")
    )
    val archetypeChannels = PantheonData.archetypes.map {
        ChannelItem(it.id, it.name.removePrefix("Master ").removePrefix("The "), it.emoji)
    }
    val allChannels = baseChannels + archetypeChannels

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(VoidBlack)
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 14.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        allChannels.forEach { channel ->
            val isSelected = selectedChannel.equals(channel.id, ignoreCase = true)
            val count = messageCounts[channel.id] ?: 0

            Box(
                modifier = Modifier
                    .padding(end = 6.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(if (isSelected) SurfaceElevated else SurfaceCard)
                    .border(
                        width = 1.dp,
                        color = if (isSelected) CyanNeon.copy(alpha = 0.7f) else BorderSubtle,
                        shape = RoundedCornerShape(14.dp)
                    )
                    .clickable { onChannelSelected(channel.id) }
                    .padding(horizontal = 11.dp, vertical = 6.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(text = channel.icon, fontSize = 13.sp)
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = channel.label,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                    if (count > 0 && !isSelected) {
                        Spacer(modifier = Modifier.width(5.dp))
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(BorderCyan.copy(alpha = 0.5f))
                                .padding(horizontal = 5.dp, vertical = 1.dp)
                        ) {
                            Text(
                                text = "$count",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = CyanSoft
                            )
                        }
                    }
                    if (isSelected) {
                        Spacer(modifier = Modifier.width(5.dp))
                        Box(
                            modifier = Modifier
                                .size(4.5.dp)
                                .clip(CircleShape)
                                .background(CyanNeon)
                        )
                    }
                }
            }
        }
    }
}
