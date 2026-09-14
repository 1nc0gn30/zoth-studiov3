package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.SwarmPet
import com.example.zothsignalbridge.data.repository.NotesDataProvider
import com.example.zothsignalbridge.data.repository.PetsDataProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class NotesAndPetsTest {

    @Test
    fun testNotesCatalog() {
        val notes = NotesDataProvider.getInitialNotes()
        assertTrue(notes.size >= 5)

        val adr19 = notes.find { it.id == "note-001" }
        assertNotNull(adr19)
        assertEquals("antigravity", adr19?.author)
        assertEquals(NoteStatus.APPROVED, adr19?.status)
        assertTrue(adr19?.tags?.contains("wireguard") == true)
    }

    @Test
    fun testPetsCatalog() {
        val pets = PetsDataProvider.getInitialPets()
        assertEquals(6, pets.size)

        val kai = pets.find { it.id == "kai" }
        assertNotNull(kai)
        assertEquals("Cyber-Fox", kai?.species)
        assertEquals("Workspace Inspector", kai?.roleTitle)
        assertEquals(142, kai?.docCount)
        assertTrue(kai?.level ?: 0 > 0)
        assertTrue(kai?.energy ?: 0 in 0..100)
        assertTrue(kai?.bondLevel ?: 0 in 0..100)

        val nyx = pets.find { it.id == "nyx" }
        assertNotNull(nyx)
        assertEquals("Shadow Cat", nyx?.species)
        assertEquals("Dark Archon", nyx?.roleTitle)
        assertEquals(98, nyx?.docCount)

        val sol = pets.find { it.id == "sol" }
        assertNotNull(sol)
        assertEquals("Solar Validator", sol?.species)
        assertEquals("Solar Validator", sol?.roleTitle)
        assertEquals(215, sol?.docCount)

        val zephyr = pets.find { it.id == "zephyr" }
        assertNotNull(zephyr)
        assertEquals("Network Sentinel", zephyr?.species)
        assertEquals("Network Sentinel", zephyr?.roleTitle)
        assertEquals(176, zephyr?.docCount)

        val azor = pets.find { it.id == "azor" }
        assertNotNull(azor)
        assertEquals("Sovereign Griffin", azor?.species)

        val ignis = pets.find { it.id == "ignis" }
        assertNotNull(ignis)
        assertEquals("Phoenix Dragon", ignis?.species)
    }

    @Test
    fun testKnowledgeDocsCatalog() {
        val docs = PetsDataProvider.getInitialKnowledgeDocs()
        assertTrue(docs.size >= 8)

        val kaiDoc = docs.find { it.petId == "kai" }
        assertNotNull(kaiDoc)
        assertTrue(kaiDoc?.title?.contains("AST") == true)

        val nyxDoc = docs.find { it.petId == "nyx" }
        assertNotNull(nyxDoc)
        assertTrue(nyxDoc?.tags?.contains("wireguard") == true)

        val solDoc = docs.find { it.petId == "sol" }
        assertNotNull(solDoc)
        assertTrue(solDoc?.tags?.contains("consensus") == true)

        val zephyrDoc = docs.find { it.petId == "zephyr" }
        assertNotNull(zephyrDoc)
        assertTrue(zephyrDoc?.tags?.contains("tailscale") == true)
    }
}
