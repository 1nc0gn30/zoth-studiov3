package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.AgentCategory
import com.example.zothsignalbridge.data.models.PantheonData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PantheonModelsTest {

    @Test
    fun testPantheonContainsAtLeast21Archetypes() {
        val archetypes = PantheonData.archetypes
        assertTrue("Pantheon should have at least 21 archetypes, found: ${archetypes.size}", archetypes.size >= 21)
    }

    @Test
    fun testProminentArchetypesExist() {
        val archetypes = PantheonData.archetypes

        // 1. Master Azoth
        val azoth = archetypes.find { it.id == "azoth" }
        assertNotNull("Master Azoth must exist", azoth)
        assertEquals("Master Azoth", azoth?.name)
        assertEquals(AgentCategory.ARCHITECTS, azoth?.category)
        assertTrue(azoth?.alchemicalDomain?.contains("Universal Synthesis", ignoreCase = true) == true)
        assertTrue(azoth?.tools?.contains("ast_synthesizer") == true)
        assertTrue(azoth?.consensusWeight?.contains("99.8%") == true)

        // 2. Antigravity
        val agy = archetypes.find { it.id == "antigravity" }
        assertNotNull("Antigravity must exist", agy)
        assertEquals("Antigravity", agy?.name)
        assertEquals(AgentCategory.ARCHITECTS, agy?.category)
        assertTrue(agy?.alchemicalDomain?.contains("Quantum Gravitation", ignoreCase = true) == true)
        assertTrue(agy?.tools?.contains("ast_engine") == true)
        assertTrue(agy?.tools?.contains("subagent_spawner") == true)

        // 3. Grok
        val grok = archetypes.find { it.id == "grok" }
        assertNotNull("Grok must exist", grok)
        assertEquals("Grok", grok?.name)
        assertEquals(AgentCategory.NEURAL, grok?.category)
        assertTrue(grok?.tools?.contains("astrolabe_checker") == true)

        // 4. Hermes
        val hermes = archetypes.find { it.id == "hermes" }
        assertNotNull("Hermes must exist", hermes)
        assertEquals("Hermes", hermes?.name)
        assertEquals(AgentCategory.TOOL_LOOPS, hermes?.category)
        assertTrue(hermes?.tools?.contains("tool_dispatcher_47") == true)
        assertTrue(hermes?.capabilities?.any { it.title.contains("47+") } == true)

        // 5. Athena
        val athena = archetypes.find { it.id == "athena" }
        assertNotNull("Athena must exist", athena)
        assertEquals("Athena", athena?.name)
        assertEquals(AgentCategory.NEURAL, athena?.category)
        assertTrue(athena?.tools?.contains("jsonld_generator") == true)

        // 6. Chronos
        val chronos = archetypes.find { it.id == "chronos" }
        assertNotNull("Chronos must exist", chronos)
        assertEquals("Chronos", chronos?.name)
        assertEquals(AgentCategory.TOOL_LOOPS, chronos?.category)
        assertTrue(chronos?.tools?.contains("dag_scheduler") == true)

        // 7. GhostByte
        val ghostbyte = archetypes.find { it.id == "ghostbyte" }
        assertNotNull("GhostByte must exist", ghostbyte)
        assertEquals("GhostByte", ghostbyte?.name)
        assertEquals(AgentCategory.SECURITY, ghostbyte?.category)
        assertTrue(ghostbyte?.tools?.contains("xchacha20_encryptor") == true)

        // 8. Onyx
        val onyx = archetypes.find { it.id == "onyx" }
        assertNotNull("Onyx must exist", onyx)
        assertEquals("Onyx", onyx?.name)
        assertEquals(AgentCategory.SECURITY, onyx?.category)
        assertTrue(onyx?.tools?.contains("fuzz_engine") == true)

        // 9. Scorpius
        val scorpius = archetypes.find { it.id == "scorpius" }
        assertNotNull("Scorpius must exist", scorpius)
        assertEquals("Scorpius", scorpius?.name)
        assertEquals(AgentCategory.SECURITY, scorpius?.category)
        assertTrue(scorpius?.tools?.contains("binary_fuzzer") == true)

        // 10. Solon
        val solon = archetypes.find { it.id == "solon" }
        assertNotNull("Solon must exist", solon)
        assertEquals("Solon", solon?.name)
        assertEquals(AgentCategory.ARCHITECTS, solon?.category)
        assertTrue(solon?.tools?.contains("consensus_governor") == true)

        // 11. Aether
        val aether = archetypes.find { it.id == "aether" }
        assertNotNull("Aether must exist", aether)
        assertEquals("Aether", aether?.name)
        assertEquals(AgentCategory.ARCHITECTS, aether?.category)
        assertTrue(aether?.tools?.contains("peer_bus_sync") == true)
    }

    @Test
    fun testAllCategoriesArePopulated() {
        val archetypes = PantheonData.archetypes

        val architects = archetypes.filter { it.category == AgentCategory.ARCHITECTS }
        assertTrue("Architects category should have agents", architects.isNotEmpty())
        assertTrue(architects.any { it.id == "azoth" })
        assertTrue(architects.any { it.id == "antigravity" })
        assertTrue(architects.any { it.id == "solon" })
        assertTrue(architects.any { it.id == "aether" })

        val shaders = archetypes.filter { it.category == AgentCategory.SHADERS }
        assertTrue("Shaders category should have agents", shaders.isNotEmpty())
        assertTrue(shaders.any { it.id == "draco" })
        assertTrue(shaders.any { it.id == "kitsune" })

        val toolLoops = archetypes.filter { it.category == AgentCategory.TOOL_LOOPS }
        assertTrue("Tool Loops category should have agents", toolLoops.isNotEmpty())
        assertTrue(toolLoops.any { it.id == "hermes" })
        assertTrue(toolLoops.any { it.id == "chronos" })
        assertTrue(toolLoops.any { it.id == "ignis" })

        val security = archetypes.filter { it.category == AgentCategory.SECURITY }
        assertTrue("Security category should have agents", security.isNotEmpty())
        assertTrue(security.any { it.id == "ghostbyte" })
        assertTrue(security.any { it.id == "onyx" })
        assertTrue(security.any { it.id == "scorpius" })
        assertTrue(security.any { it.id == "lycan" })

        val neural = archetypes.filter { it.category == AgentCategory.NEURAL }
        assertTrue("Neural category should have agents", neural.isNotEmpty())
        assertTrue(neural.any { it.id == "grok" })
        assertTrue(neural.any { it.id == "athena" })
        assertTrue(neural.any { it.id == "leviathan" })

        val auxiliary = archetypes.filter { it.category == AgentCategory.AUXILIARY }
        assertTrue("Auxiliary category should have agents", auxiliary.isNotEmpty())
        assertTrue(auxiliary.any { it.id == "kai" })
        assertTrue(auxiliary.any { it.id == "kraken" })
        assertTrue(auxiliary.any { it.id == "aquila" })
        assertTrue(auxiliary.any { it.id == "pixel-neko" })
    }

    @Test
    fun testGetArchetypeById() {
        assertEquals("Master Azoth", PantheonData.getArchetypeById("azoth")?.name)
        assertEquals("Master Azoth", PantheonData.getArchetypeById("@azoth")?.name)
        assertEquals("Master Azoth", PantheonData.getArchetypeById("zoth")?.name)
        assertEquals("Antigravity", PantheonData.getArchetypeById("antigravity")?.name)
        assertEquals("Antigravity", PantheonData.getArchetypeById("@agy")?.name)
        assertEquals("Grok", PantheonData.getArchetypeById("grok")?.name)
        assertEquals("Hermes", PantheonData.getArchetypeById("hermes")?.name)
        assertEquals("GhostByte", PantheonData.getArchetypeById("ghostbyte")?.name)
    }

    @Test
    fun testSearchFiltering() {
        val all = PantheonData.archetypes

        // Search by capability
        val searchAst = all.filter { a ->
            a.name.contains("AST", ignoreCase = true) ||
            a.capabilities.any { it.title.contains("AST", ignoreCase = true) || it.description.contains("AST", ignoreCase = true) } ||
            a.tools.any { it.contains("ast", ignoreCase = true) }
        }
        assertTrue("Search for AST should find agents", searchAst.isNotEmpty())
        assertTrue(searchAst.any { it.id == "antigravity" || it.id == "azoth" || it.id == "grok" })

        // Search by tool
        val searchTool = all.filter { it.tools.any { tool -> tool.contains("argon2", ignoreCase = true) } }
        assertTrue(searchTool.any { it.id == "ghostbyte" || it.id == "pixel-shiba" })

        // Search by alchemical domain
        val searchDomain = all.filter { it.alchemicalDomain.contains("Aether", ignoreCase = true) }
        assertTrue(searchDomain.any { it.id == "azoth" })
    }
}
