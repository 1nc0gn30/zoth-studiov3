package com.example.zothsignalbridge.ui

import com.example.zothsignalbridge.theme.AgentAntigravity
import com.example.zothsignalbridge.theme.AgentAzoth
import com.example.zothsignalbridge.theme.AgentGrok
import com.example.zothsignalbridge.theme.AgentHermes
import com.example.zothsignalbridge.theme.AgentOllama
import com.example.zothsignalbridge.theme.AgentOperator
import com.example.zothsignalbridge.ui.components.MessageBlock
import com.example.zothsignalbridge.ui.components.getAgentInfo
import com.example.zothsignalbridge.ui.components.getAgentMetadata
import com.example.zothsignalbridge.ui.components.parseMessageBlocks
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class MessageCardParsingTest {

    @Test
    fun testParseSimpleTextMessage() {
        val raw = "Hello from operator, AST verify requested."
        val blocks = parseMessageBlocks(raw)

        assertEquals(1, blocks.size)
        assertTrue(blocks[0] is MessageBlock.Text)
        assertEquals(raw, (blocks[0] as MessageBlock.Text).content)
    }

    @Test
    fun testParseCodeBlock() {
        val raw = """
            ⚡ [SWARM BOOT] Zoth Signal Bridge online.
            ```kotlin
            val node = SwarmNode(ip = "100.125.220.102", port = 8484)
            node.joinCluster()
            ```
            All AST trees synchronized.
        """.trimIndent()

        val blocks = parseMessageBlocks(raw)
        assertEquals(3, blocks.size)

        assertTrue(blocks[0] is MessageBlock.Text)
        assertEquals("⚡ [SWARM BOOT] Zoth Signal Bridge online.", (blocks[0] as MessageBlock.Text).content)

        assertTrue(blocks[1] is MessageBlock.Code)
        val codeBlock = blocks[1] as MessageBlock.Code
        assertEquals("kotlin", codeBlock.language)
        assertTrue(codeBlock.code.contains("val node = SwarmNode"))

        assertTrue(blocks[2] is MessageBlock.Text)
        assertEquals("All AST trees synchronized.", (blocks[2] as MessageBlock.Text).content)
    }

    @Test
    fun testParseMultipleCodeBlocks() {
        val raw = """
            First snippet:
            ```bash
            curl http://100.125.220.102:8484/api/swarm
            ```
            Second snippet:
            ```json
            {"status": "ok"}
            ```
        """.trimIndent()

        val blocks = parseMessageBlocks(raw)
        assertEquals(4, blocks.size)
        assertTrue(blocks[0] is MessageBlock.Text)
        assertTrue(blocks[1] is MessageBlock.Code)
        assertEquals("bash", (blocks[1] as MessageBlock.Code).language)
        assertTrue(blocks[2] is MessageBlock.Text)
        assertTrue(blocks[3] is MessageBlock.Code)
        assertEquals("json", (blocks[3] as MessageBlock.Code).language)
    }

    @Test
    fun testParseVoiceNoteTransmission() {
        val raw = "🎙️ [Tactical Audio Transmission - 0:04] Transcribed: Local neural weights loaded on port :11434. Zero cloud egress confirmed."
        val blocks = parseMessageBlocks(raw)

        assertEquals(1, blocks.size)
        assertTrue(blocks[0] is MessageBlock.Voice)
        val voiceBlock = blocks[0] as MessageBlock.Voice
        assertEquals(4, voiceBlock.durationSec)
        assertEquals("Local neural weights loaded on port :11434. Zero cloud egress confirmed.", voiceBlock.transcript)
    }

    @Test
    fun testAgentMetadataMapping() {
        val antigravity = getAgentInfo("antigravity")
        assertEquals("antigravity", antigravity.id)
        assertEquals("Antigravity", antigravity.displayName)
        assertEquals("🪐", antigravity.emoji)
        assertEquals(AgentAntigravity, antigravity.color)

        val azoth = getAgentInfo("azoth")
        assertEquals("azoth", azoth.id)
        assertEquals("Master Azoth", azoth.displayName)
        assertEquals("✨", azoth.emoji)
        assertEquals(AgentAzoth, azoth.color)

        val grok = getAgentInfo("grok")
        assertEquals("grok", grok.id)
        assertEquals("📐", grok.emoji)
        assertEquals(AgentGrok, grok.color)

        val hermes = getAgentInfo("hermes")
        assertEquals("hermes", hermes.id)
        assertEquals("⚡", hermes.emoji)
        assertEquals(AgentHermes, hermes.color)

        val ollama = getAgentInfo("ollama")
        assertEquals("ollama", ollama.id)
        assertEquals("🦙", ollama.emoji)
        assertEquals(AgentOllama, ollama.color)

        val operator = getAgentInfo("operator")
        assertEquals("operator", operator.id)
        assertEquals("👤", operator.emoji)
        assertEquals(AgentOperator, operator.color)

        val unknown = getAgentInfo("custom_agent")
        assertEquals("custom_agent", unknown.id)
        assertEquals("⚙️", unknown.emoji)
    }

    @Test
    fun testGetAgentMetadataPair() {
        val (color, emoji) = getAgentMetadata("antigravity")
        assertEquals(AgentAntigravity, color)
        assertEquals("🪐", emoji)

        val (azothColor, azothEmoji) = getAgentMetadata("azoth")
        assertEquals(AgentAzoth, azothColor)
        assertEquals("✨", azothEmoji)
    }
}
