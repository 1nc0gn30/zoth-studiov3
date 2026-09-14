package com.example.zothsignalbridge.ui.screens

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class StudioWebViewScreenTest {

    @Test
    fun testStudioPresetsCatalog() {
        val presets = StudioPresets.PRESETS
        assertEquals(5, presets.size)

        val swarm = presets.find { it.id == "swarm" }
        assertNotNull(swarm)
        assertEquals("/studio/swarm.html", swarm?.path)
        assertEquals("Swarm HUD", swarm?.title)
        assertEquals("AST", swarm?.badge)

        val dash = presets.find { it.id == "dashboard" }
        assertNotNull(dash)
        assertEquals("/dashboard", dash?.path)
        assertEquals("Dashboard", dash?.title)

        val comic = presets.find { it.id == "comic" }
        assertNotNull(comic)
        assertEquals("/comic/index.html", comic?.path)
        assertEquals("Comic Studio", comic?.title)

        val consensus = presets.find { it.id == "consensus" }
        assertNotNull(consensus)
        assertEquals("/studio/consensus.html", consensus?.path)
        assertEquals("Consensus Engine", consensus?.title)

        val hydrate = presets.find { it.id == "hydrate" }
        assertNotNull(hydrate)
        assertEquals("/previews/testhydratesite", hydrate?.path)
        assertEquals("Test Hydrate Site", hydrate?.title)
    }

    @Test
    fun testResolvePresetUrl_withRelativePath() {
        val base = "http://100.125.220.102:8088/studio/swarm.html"

        val resolvedDash = resolvePresetUrl(base, "/dashboard")
        assertEquals("http://100.125.220.102:8088/dashboard", resolvedDash)

        val resolvedComic = resolvePresetUrl(base, "/comic/index.html")
        assertEquals("http://100.125.220.102:8088/comic/index.html", resolvedComic)

        val resolvedConsensus = resolvePresetUrl(base, "studio/consensus.html")
        assertEquals("http://100.125.220.102:8088/studio/consensus.html", resolvedConsensus)

        val resolvedHydrate = resolvePresetUrl(base, "/previews/testhydratesite")
        assertEquals("http://100.125.220.102:8088/previews/testhydratesite", resolvedHydrate)
    }

    @Test
    fun testResolvePresetUrl_withAbsolutePath() {
        val base = "http://100.125.220.102:8088/studio/swarm.html"
        val custom = "https://custom-sandbox.mesh.ts.net:9000/app"

        val resolved = resolvePresetUrl(base, custom)
        assertEquals("https://custom-sandbox.mesh.ts.net:9000/app", resolved)
    }

    @Test
    fun testResolvePresetUrl_withEmptyOrFallbackBase() {
        val resolved = resolvePresetUrl("", "/dashboard")
        assertEquals("http://100.125.220.102:8088/dashboard", resolved)
    }

    @Test
    fun testExtractDisplayHost() {
        assertEquals("100.125.220.102:8088", extractDisplayHost("http://100.125.220.102:8088/studio/swarm.html"))
        assertEquals("tailscale.mesh.net", extractDisplayHost("https://tailscale.mesh.net/dashboard"))
        assertEquals("localhost:3000", extractDisplayHost("http://localhost:3000/comic/index.html"))
    }

    @Test
    fun testExtractPath() {
        assertEquals("/studio/swarm.html", extractPath("http://100.125.220.102:8088/studio/swarm.html"))
        assertEquals("/dashboard", extractPath("http://100.125.220.102:8088/dashboard"))
        assertEquals("/previews/testhydratesite", extractPath("https://mesh.net/previews/testhydratesite"))
    }

    @Test
    fun testExtractDisplayTitle() {
        val titleFromPage = extractDisplayTitle("http://100.125.220.102:8088/studio/swarm.html", "Swarm Live HUD")
        assertEquals("Swarm Live HUD", titleFromPage)

        val titleFromPreset = extractDisplayTitle("http://100.125.220.102:8088/dashboard", "")
        assertEquals("Dashboard", titleFromPreset)

        val titleFromComicPreset = extractDisplayTitle("http://100.125.220.102:8088/comic/index.html", null)
        assertEquals("Comic Studio", titleFromComicPreset)
    }

    @Test
    fun testFindMatchingPreset() {
        val matchSwarm = StudioPresets.findMatchingPreset("http://100.125.220.102:8088/studio/swarm.html")
        assertNotNull(matchSwarm)
        assertEquals("swarm", matchSwarm?.id)

        val matchDash = StudioPresets.findMatchingPreset("http://100.125.220.102:8088/dashboard")
        assertNotNull(matchDash)
        assertEquals("dashboard", matchDash?.id)

        val matchUnknown = StudioPresets.findMatchingPreset("http://100.125.220.102:8088/custom/api")
        assertNull(matchUnknown)
    }

    @Test
    fun testViewportModes() {
        assertEquals(390, ViewportMode.PHONE.widthDp)
        assertFalse(ViewportMode.PHONE.isDesktop)

        assertEquals(768, ViewportMode.TABLET.widthDp)
        assertFalse(ViewportMode.TABLET.isDesktop)

        assertEquals(1440, ViewportMode.DESKTOP.widthDp)
        assertTrue(ViewportMode.DESKTOP.isDesktop)
        assertTrue(ViewportMode.DESKTOP_USER_AGENT.contains("Chrome"))
    }

    @Test
    fun testConsoleLogFiltering() {
        val logs = listOf(
            ConsoleLogEntry(1L, "12:00:01", ConsoleLogLevel.LOG, "Page initialized", "init.js", 10),
            ConsoleLogEntry(2L, "12:00:02", ConsoleLogLevel.WARN, "High memory pressure in canvas", "canvas.js", 45),
            ConsoleLogEntry(3L, "12:00:03", ConsoleLogLevel.ERROR, "Uncaught TypeError: cannot read properties of null", "swarm.js", 108),
            ConsoleLogEntry(4L, "12:00:04", ConsoleLogLevel.INFO, "Swarm AST telemetry synced", "telemetry.js", 52),
            ConsoleLogEntry(5L, "12:00:05", ConsoleLogLevel.ERROR, "Network error: fetch failed on /api/claims", "api.js", 88)
        )

        // Filter by Level: ERROR
        val errorLogs = filterLogs(logs, ConsoleLogLevel.ERROR, "")
        assertEquals(2, errorLogs.size)
        assertTrue(errorLogs.all { it.level == ConsoleLogLevel.ERROR })

        // Filter by Level: WARN
        val warnLogs = filterLogs(logs, ConsoleLogLevel.WARN, "")
        assertEquals(1, warnLogs.size)
        assertEquals("canvas.js", warnLogs.first().sourceId)

        // Filter by Search Query: "telemetry"
        val queryLogs = filterLogs(logs, null, "telemetry")
        assertEquals(1, queryLogs.size)
        assertEquals("Swarm AST telemetry synced", queryLogs.first().message)

        // Filter by Search Query in sourceId: "swarm.js"
        val sourceLogs = filterLogs(logs, null, "swarm.js")
        assertEquals(1, sourceLogs.size)
        assertEquals(108, sourceLogs.first().lineNumber)

        // Filter by Level and Query together
        val errorApiLogs = filterLogs(logs, ConsoleLogLevel.ERROR, "claims")
        assertEquals(1, errorApiLogs.size)
        assertEquals(5L, errorApiLogs.first().id)
    }
}
