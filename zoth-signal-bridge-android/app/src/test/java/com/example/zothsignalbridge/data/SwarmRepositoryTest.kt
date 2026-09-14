package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.DialecticStage
import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.TailscaleConfig
import com.example.zothsignalbridge.data.models.VoteDecision
import com.example.zothsignalbridge.data.repository.SwarmRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SwarmRepositoryTest {

    @Test
    fun testInitialSwarmRepositoryState() = runTest {
        val repo = SwarmRepository()

        assertEquals("all", repo.selectedChannel.first())
        assertTrue(repo.messages.first().isNotEmpty())
        assertTrue(repo.agents.first().isNotEmpty())
        assertTrue(repo.claims.first().isNotEmpty())
        assertTrue(repo.pantheonAgents.first().size == 21)
        assertTrue(repo.notes.first().isNotEmpty())
        assertTrue(repo.pets.first().size >= 5)
        assertTrue(repo.soundEffects.first().size >= 10)
    }

    @Test
    fun testChannelSelection() = runTest {
        val repo = SwarmRepository()

        repo.selectChannel("azoth")
        assertEquals("azoth", repo.selectedChannel.first())

        repo.selectChannel("all")
        assertEquals("all", repo.selectedChannel.first())
    }

    @Test
    fun testSendMessage() = runTest {
        val repo = SwarmRepository()
        val initialSize = repo.messages.first().size

        repo.sendMessage("antigravity", "Execute AST verification subroutine", "high")
        val updated = repo.messages.first()

        assertTrue(updated.size > initialSize)
        val latest = updated.first()
        assertEquals("operator", latest.from)
        assertEquals("antigravity", latest.to)
        assertEquals("Execute AST verification subroutine", latest.message)
        assertEquals("high", latest.priority)
        assertTrue(latest.isOutbound)
    }

    @Test
    fun testConsensusArenaActions() = runTest {
        val repo = SwarmRepository()

        // Dialectic stage selection
        repo.selectDialecticStage(DialecticStage.THESIS)
        assertEquals(DialecticStage.THESIS, repo.consensusState.first().selectedDialecticStage)

        repo.selectDialecticStage(DialecticStage.SYNTHESIS)
        assertEquals(DialecticStage.SYNTHESIS, repo.consensusState.first().selectedDialecticStage)

        // Proposal selection
        repo.selectProposal("antigravity")
        assertEquals("antigravity", repo.consensusState.first().selectedAgentProposalId)

        // Vote toggling
        repo.toggleAgentVote("ollama", VoteDecision.REJECT)
        val ollamaNode = repo.consensusState.first().stakeNodes.find { it.agentId == "ollama" }
        assertNotNull(ollamaNode)
        assertEquals(VoteDecision.REJECT, ollamaNode?.vote)

        // Byzantine fault injection
        repo.toggleByzantineStatus("grok")
        val grokNode = repo.consensusState.first().stakeNodes.find { it.agentId == "grok" }
        assertNotNull(grokNode)
        assertTrue(grokNode?.isByzantine == true)

        // Reset
        repo.resetConsensusState()
        val resetGrok = repo.consensusState.first().stakeNodes.find { it.agentId == "grok" }
        assertFalse(resetGrok?.isByzantine ?: true)
    }

    @Test
    fun testNotesCreationAndStatusUpdate() = runTest {
        val repo = SwarmRepository()
        val initialCount = repo.notes.first().size

        repo.createNote(
            title = "ADR-099: Zero-Trust Local Key Rotation",
            author = "operator",
            content = "Detailed architectural rationale for local key rotation.",
            tags = listOf("security", "wireguard")
        )

        val updatedNotes = repo.notes.first()
        assertEquals(initialCount + 1, updatedNotes.size)
        val created = updatedNotes.first()
        assertEquals("ADR-099: Zero-Trust Local Key Rotation", created.title)
        assertEquals("operator", created.author)
        assertEquals(NoteStatus.IN_REVIEW, created.status)

        // Update status to APPROVED
        repo.updateNoteStatus(created.id, NoteStatus.APPROVED)
        val approved = repo.notes.first().find { it.id == created.id }
        assertNotNull(approved)
        assertEquals(NoteStatus.APPROVED, approved?.status)
    }

    @Test
    fun testPetsCompanionInteractions() = runTest {
        val repo = SwarmRepository()
        val initialKai = repo.pets.first().find { it.id == "kai" }
        assertNotNull(initialKai)

        // Feed
        val oldEnergy = initialKai!!.energy
        repo.feedPet("kai")
        val fedKai = repo.pets.first().find { it.id == "kai" }
        assertTrue(fedKai!!.energy >= oldEnergy)
        assertEquals("Hyped", fedKai.mood)

        // Pet / Praise
        val oldBond = fedKai.bondLevel
        repo.petCompanion("kai")
        val praisedKai = repo.pets.first().find { it.id == "kai" }
        assertTrue(praisedKai!!.bondLevel >= oldBond)
        assertEquals("Playful", praisedKai.mood)

        // Train
        val oldExp = praisedKai.exp
        repo.trainPet("kai")
        val trainedKai = repo.pets.first().find { it.id == "kai" }
        assertTrue(trainedKai!!.exp > oldExp || trainedKai.level > praisedKai.level)
        assertEquals("Focused", trainedKai.mood)
    }

    @Test
    fun testSoundboardState() = runTest {
        val repo = SwarmRepository()

        assertFalse(repo.isMuted.first())
        assertTrue(repo.hapticsEnabled.first())

        repo.toggleMute()
        assertTrue(repo.isMuted.first())

        repo.toggleMute()
        assertFalse(repo.isMuted.first())

        repo.toggleHaptics()
        assertFalse(repo.hapticsEnabled.first())

        repo.playSound("sfx-01")
        assertEquals("sfx-01", repo.activePlayingSoundId.first())
    }

    @Test
    fun testClaimsRelease() = runTest {
        val repo = SwarmRepository()
        val initialClaims = repo.claims.first()
        assertTrue(initialClaims.isNotEmpty())

        val targetClaim = initialClaims.first().project
        repo.releaseClaim(targetClaim)

        val remaining = repo.claims.first()
        assertFalse(remaining.any { it.project == targetClaim })
    }
}
