package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.PantheonDomain
import com.example.zothsignalbridge.data.repository.PantheonDataProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PantheonDataProviderTest {

    @Test
    fun testAll21PantheonAgentsExist() {
        val agents = PantheonDataProvider.getAllAgents()
        assertEquals(21, agents.size)

        // Check Unique IDs
        val uniqueIds = agents.map { it.id }.toSet()
        assertEquals(21, uniqueIds.size)
    }

    @Test
    fun testPantheonDomainDistribution() {
        val agents = PantheonDataProvider.getAllAgents()

        val architects = agents.filter { it.domain == PantheonDomain.ARCHITECTS }
        val synthesizers = agents.filter { it.domain == PantheonDomain.SYNTHESIZERS }
        val planners = agents.filter { it.domain == PantheonDomain.PLANNERS }
        val sensory = agents.filter { it.domain == PantheonDomain.SENSORY }
        val guardians = agents.filter { it.domain == PantheonDomain.GUARDIANS }

        assertEquals(3, architects.size)
        assertEquals(4, synthesizers.size)
        assertEquals(4, planners.size)
        assertEquals(4, sensory.size)
        assertEquals(6, guardians.size)
    }

    @Test
    fun testKeySovereignAgents() {
        val agents = PantheonDataProvider.getAllAgents()

        val agy = agents.find { it.id == "antigravity" }
        assertNotNull(agy)
        assertEquals("Antigravity", agy?.name)
        assertEquals("Sovereign Lead Architect", agy?.archetype)
        assertTrue(agy?.tools?.contains("replace_file_content") == true)

        val azoth = agents.find { it.id == "azoth" }
        assertNotNull(azoth)
        assertEquals("Master Azoth", azoth?.name)
        assertEquals("High Alchemist", azoth?.rank)

        val ollama = agents.find { it.id == "ollama" }
        assertNotNull(ollama)
        assertEquals(PantheonDomain.SENSORY, ollama?.domain)

        val astraea = agents.find { it.id == "astraea" }
        assertNotNull(astraea)
        assertEquals(PantheonDomain.GUARDIANS, astraea?.domain)
    }
}
