package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.SwarmNote
import com.example.zothsignalbridge.data.network.SwarmApiClient
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SwarmApiClientTest {

    private val client = SwarmApiClient()

    @Test
    fun testDefaultAgentsCatalog() {
        val agents = client.getDefaultAgents()
        assertEquals(5, agents.size)
        
        val agy = agents.find { it.id == "antigravity" }
        assertNotNull(agy)
        assertEquals("Antigravity", agy?.name)
        assertEquals("Forge", agy?.region)

        val azoth = agents.find { it.id == "azoth" }
        assertNotNull(azoth)
        assertEquals("Master Azoth", azoth?.name)

        val grok = agents.find { it.id == "grok" }
        assertNotNull(grok)
        assertEquals("Deck", grok?.region)

        val hermes = agents.find { it.id == "hermes" }
        assertNotNull(hermes)
        assertEquals("Ridge", hermes?.region)

        val ollama = agents.find { it.id == "ollama" }
        assertNotNull(ollama)
        assertEquals("Well", ollama?.region)
    }

    @Test
    fun testSampleTransmissions() {
        val msgs = client.getSampleTransmissions()
        assertTrue(msgs.isNotEmpty())
        assertTrue(msgs.any { it.from == "antigravity" })
        assertTrue(msgs.any { it.from == "hermes" })
        assertTrue(msgs.any { it.from == "grok" })
        assertTrue(msgs.any { it.from == "azoth" })
    }

    @Test
    fun testMockAnnotationsCatalog() {
        val notes = client.getMockAnnotations()
        assertTrue("Mock annotations must contain at least 8 real visual notes", notes.size >= 8)

        // Check real note 1: zn-1787454179985-rg6u
        val note1 = notes.find { it.id == "zn-1787454179985-rg6u" }
        assertNotNull(note1)
        assertEquals(NoteStatus.APPROVED, note1?.status)
        assertEquals("/", note1?.pathname)
        assertEquals("#zoth-guide > img", note1?.selector)
        assertEquals("img", note1?.target?.elementTag)
        assertEquals("Normal", note1?.priority)
        assertTrue(note1?.isResolved == true)
        assertFalse(note1?.isOpen == true)
        assertEquals(14.0, note1?.target?.rect?.x ?: 0.0, 0.01)
        assertEquals(78.0, note1?.target?.rect?.width ?: 0.0, 0.01)

        // Check real note 6 (Open): zn-1787465034685-fw8n
        val note6 = notes.find { it.id == "zn-1787465034685-fw8n" }
        assertNotNull(note6)
        assertEquals(NoteStatus.IN_REVIEW, note6?.status)
        assertEquals("/zoth/", note6?.pathname)
        assertTrue(note6?.isOpen == true)
        assertTrue(note6?.taggedAgents?.contains("hermes") == true)
        assertEquals("h1", note6?.target?.elementTag)
        assertEquals(558.0, note6?.target?.rect?.width ?: 0.0, 0.01)

        // Check real note 8 (Urgent): zn-1787465440177-yp63
        val note8 = notes.find { it.id == "zn-1787465440177-yp63" }
        assertNotNull(note8)
        assertEquals("Urgent", note8?.priority)
        assertEquals("/zoth/", note8?.pathname)
        assertTrue(note8?.taggedAgents?.contains("hermes") == true)
        assertEquals(1222.0, note8?.target?.rect?.width ?: 0.0, 0.01)
    }

    @Test
    fun testParseSwarmNoteFromJson() {
        val rawJson = """
        {
            "id": "zn-test-001",
            "created_at": "2026-08-23T06:00:00.000Z",
            "created_local": "8/23/2026, 6:00:00 AM",
            "status": "open",
            "text": "Refactor DOM selector on studio HUD",
            "category": "UI / Visual",
            "priority": "High",
            "tagged_agents": ["antigravity", "hermes"],
            "page_url": "http://127.0.0.1:8088/studio/swarm.html",
            "pathname": "/studio/swarm.html",
            "viewport": {
                "width": 1920,
                "height": 920,
                "scrollX": 0,
                "scrollY": 150
            },
            "target": {
                "type": "element",
                "label": "#swarm-hud",
                "selector": "#swarm-hud > div.panel",
                "xpath": "/html/body/main/div",
                "elementTag": "div",
                "elementText": "SWARM HUD STATUS",
                "pageX": 400.0,
                "pageY": 600.0,
                "clientX": 400.0,
                "clientY": 450.0,
                "rect": {
                    "x": 100.0,
                    "y": 250.0,
                    "width": 800.0,
                    "height": 400.0
                }
            },
            "pageX": 400.0,
            "pageY": 600.0,
            "selector": "#swarm-hud > div.panel"
        }
        """.trimIndent()

        val jsonObject = JSONObject(rawJson)
        val note = client.parseSwarmNoteFromJson(jsonObject)

        assertEquals("zn-test-001", note.id)
        assertEquals(NoteStatus.IN_REVIEW, note.status)
        assertTrue(note.isOpen)
        assertFalse(note.isResolved)
        assertEquals("Refactor DOM selector on studio HUD", note.text)
        assertEquals("High", note.priority)
        assertEquals(2, note.taggedAgents.size)
        assertEquals("antigravity", note.taggedAgents[0])
        assertEquals("hermes", note.taggedAgents[1])
        assertEquals("/studio/swarm.html", note.pathname)
        assertEquals(1920, note.viewport.width)
        assertEquals(150, note.viewport.scrollY)
        assertEquals("#swarm-hud > div.panel", note.displaySelector)
        assertEquals("div", note.target.elementTag)
        assertEquals(800.0, note.target.rect.width, 0.01)
        assertEquals(400.0, note.target.rect.height, 0.01)
        assertEquals(100.0, note.target.rect.x, 0.01)
        assertEquals(250.0, note.target.rect.y, 0.01)
    }

    @Test
    fun testTailnetPresets() {
        val presets = client.getTailnetPresets()
        assertEquals(6, presets.size)

        val parrotPreset = presets.find { it.id == "parrot-workstation" }
        assertNotNull(parrotPreset)
        assertEquals("Parrot Workstation", parrotPreset?.title)
        assertEquals("http://100.125.220.102:8484", parrotPreset?.hostUrl)
        assertEquals("http://100.125.220.102:8088/studio/swarm.html", parrotPreset?.studioUrl)
        assertTrue(parrotPreset?.isTailscale == true)

        val magicDnsPreset = presets.find { it.id == "magicdns" }
        assertNotNull(magicDnsPreset)
        assertEquals("MagicDNS (parrot:8484)", magicDnsPreset?.title)
        assertEquals("http://parrot:8484", magicDnsPreset?.hostUrl)

        val clientPreset = presets.find { it.id == "client-phone" }
        assertNotNull(clientPreset)
        assertTrue(clientPreset?.title?.contains("Client Phone") == true)
        assertEquals("http://100.106.39.46:8484", clientPreset?.hostUrl)

        val lanPreset = presets.find { it.id == "lan-workstation" }
        assertNotNull(lanPreset)
        assertEquals("http://192.168.1.100:8484", lanPreset?.hostUrl)

        val emuPreset = presets.find { it.id == "emulator" }
        assertNotNull(emuPreset)
        assertEquals("http://10.0.2.2:8484", emuPreset?.hostUrl)

        val localPreset = presets.find { it.id == "localhost" }
        assertNotNull(localPreset)
        assertEquals("http://127.0.0.1:8484", localPreset?.hostUrl)
    }

    @Test
    fun testDiagnosticLogsTrackingAndClearing() {
        val logs = client.diagnosticLogs.value
        assertTrue("Diagnostic logs should have seed entries", logs.isNotEmpty())

        val pingLog = logs.find { it.method == "PING" }
        assertNotNull(pingLog)
        assertTrue(pingLog?.isSuccess == true)

        client.clearLogs()
        assertEquals(0, client.diagnosticLogs.value.size)
    }
}
