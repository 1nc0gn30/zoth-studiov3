package com.example.zothsignalbridge.ui.main

import com.example.zothsignalbridge.data.models.AppScreen
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

class MainScreenViewModelTest {

    @Test
    fun testInitialState() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        assertEquals(0, viewModel.selectedTab.first())
        assertEquals(AppScreen.TRANSMISSIONS, viewModel.selectedScreen.first())
        assertEquals("all", viewModel.selectedChannel.first())
        
        val agents = viewModel.agents.first()
        assertTrue(agents.isNotEmpty())
        assertTrue(agents.any { it.id == "antigravity" })
        assertTrue(agents.any { it.id == "azoth" })
        assertTrue(agents.any { it.id == "grok" })
        assertTrue(agents.any { it.id == "hermes" })
        assertTrue(agents.any { it.id == "ollama" })

        // Verify Consensus State Initialized
        val consensus = viewModel.consensusState.first()
        assertNotNull(consensus)
        assertEquals(DialecticStage.SYNTHESIS, consensus.selectedDialecticStage)
        assertTrue(consensus.isQuorumAchieved)
        assertEquals(92.5, consensus.approvingStakePercent, 0.01)

        // Verify Pantheon, Notes, Pets, Soundboard Initialized
        assertEquals(21, viewModel.pantheonAgents.first().size)
        assertTrue(viewModel.notes.first().isNotEmpty())
        assertEquals(6, viewModel.pets.first().size)
        assertTrue(viewModel.soundEffects.first().size >= 10)
    }

    @Test
    fun testAll9TabSelections() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        viewModel.selectTab(0)
        assertEquals(0, viewModel.selectedTab.first())
        assertEquals(AppScreen.TRANSMISSIONS, viewModel.selectedScreen.first())

        viewModel.selectTab(1)
        assertEquals(1, viewModel.selectedTab.first())
        assertEquals(AppScreen.RADAR, viewModel.selectedScreen.first())

        viewModel.selectTab(2)
        assertEquals(2, viewModel.selectedTab.first())
        assertEquals(AppScreen.ARENA, viewModel.selectedScreen.first())

        viewModel.selectTab(3)
        assertEquals(3, viewModel.selectedTab.first())
        assertEquals(AppScreen.PANTHEON, viewModel.selectedScreen.first())

        viewModel.selectTab(4)
        assertEquals(4, viewModel.selectedTab.first())
        assertEquals(AppScreen.NOTES, viewModel.selectedScreen.first())

        viewModel.selectTab(5)
        assertEquals(5, viewModel.selectedTab.first())
        assertEquals(AppScreen.PETS, viewModel.selectedScreen.first())

        viewModel.selectTab(6)
        assertEquals(6, viewModel.selectedTab.first())
        assertEquals(AppScreen.SOUNDBOARD, viewModel.selectedScreen.first())

        viewModel.selectTab(7)
        assertEquals(7, viewModel.selectedTab.first())
        assertEquals(AppScreen.WEB_HUD, viewModel.selectedScreen.first())

        viewModel.selectTab(8)
        assertEquals(8, viewModel.selectedTab.first())
        assertEquals(AppScreen.SETTINGS, viewModel.selectedScreen.first())
    }

    @Test
    fun testNavigateToAppScreen() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        viewModel.navigateTo(AppScreen.ARENA)
        assertEquals(AppScreen.ARENA, viewModel.selectedScreen.first())
        assertEquals(2, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.PANTHEON)
        assertEquals(AppScreen.PANTHEON, viewModel.selectedScreen.first())
        assertEquals(3, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.NOTES)
        assertEquals(AppScreen.NOTES, viewModel.selectedScreen.first())
        assertEquals(4, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.PETS)
        assertEquals(AppScreen.PETS, viewModel.selectedScreen.first())
        assertEquals(5, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.SOUNDBOARD)
        assertEquals(AppScreen.SOUNDBOARD, viewModel.selectedScreen.first())
        assertEquals(6, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.WEB_HUD)
        assertEquals(AppScreen.WEB_HUD, viewModel.selectedScreen.first())
        assertEquals(7, viewModel.selectedTab.first())

        viewModel.navigateTo(AppScreen.SETTINGS)
        assertEquals(AppScreen.SETTINGS, viewModel.selectedScreen.first())
        assertEquals(8, viewModel.selectedTab.first())
    }

    @Test
    fun testChannelSelectionSwitchesToTransmissions() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        viewModel.selectTab(1) // On Swarm Radar tab
        assertEquals(1, viewModel.selectedTab.first())

        viewModel.selectChannel("hermes")
        assertEquals("hermes", viewModel.selectedChannel.first())
        assertEquals(0, viewModel.selectedTab.first()) // Switched back to Transmissions tab
    }

    @Test
    fun testSendMessageAddsOutboundMessage() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialCount = viewModel.messages.first().size
        viewModel.sendMessage("antigravity", "Test AST analysis request", "high")

        val updatedMsgs = viewModel.messages.first()
        assertTrue(updatedMsgs.size > initialCount)
        val latest = updatedMsgs.first()
        assertEquals("operator", latest.from)
        assertEquals("antigravity", latest.to)
        assertEquals("Test AST analysis request", latest.message)
        assertEquals("high", latest.priority)
        assertTrue(latest.isOutbound)
    }

    @Test
    fun testConfigUpdate() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val newConfig = TailscaleConfig(
            host = "http://100.101.102.103:8484",
            studioUrl = "http://100.101.102.103:8088/studio/swarm.html",
            pollIntervalSec = 5
        )
        viewModel.saveConfig(newConfig)

        assertEquals("http://100.101.102.103:8484", viewModel.config.first().host)
        assertEquals(5, viewModel.config.first().pollIntervalSec)
    }

    @Test
    fun testConsensusDialecticSelection() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        viewModel.selectDialecticStage(DialecticStage.THESIS)
        assertEquals(DialecticStage.THESIS, viewModel.consensusState.first().selectedDialecticStage)

        viewModel.selectDialecticStage(DialecticStage.ANTITHESIS)
        assertEquals(DialecticStage.ANTITHESIS, viewModel.consensusState.first().selectedDialecticStage)
    }

    @Test
    fun testConsensusProposalSelection() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        viewModel.selectProposal("grok")
        assertEquals("grok", viewModel.consensusState.first().selectedAgentProposalId)

        viewModel.selectProposal("ollama")
        assertEquals("ollama", viewModel.consensusState.first().selectedAgentProposalId)
    }

    @Test
    fun testConsensusVoteToggleAndByzantineFault() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        // Initial Quorum Achieved (92.5%)
        assertTrue(viewModel.consensusState.first().isQuorumAchieved)

        // Grok (32.5%) votes REJECT -> 92.5 - 32.5 = 60.0% (< 66.7%)
        viewModel.toggleAgentVote("grok", VoteDecision.REJECT)
        assertEquals(60.0, viewModel.consensusState.first().approvingStakePercent, 0.01)
        assertFalse(viewModel.consensusState.first().isQuorumAchieved)

        // Restore Grok vote to APPROVE
        viewModel.toggleAgentVote("grok", VoteDecision.APPROVE)
        assertTrue(viewModel.consensusState.first().isQuorumAchieved)

        // Inject Byzantine Fault on Antigravity (35%)
        viewModel.toggleByzantineStatus("antigravity")
        assertEquals(1, viewModel.consensusState.first().currentByzantineCount)
        assertFalse(viewModel.consensusState.first().isQuorumAchieved)

        // Reset Consensus
        viewModel.resetConsensus()
        assertTrue(viewModel.consensusState.first().isQuorumAchieved)
        assertEquals(0, viewModel.consensusState.first().currentByzantineCount)
    }

    @Test
    fun testNotesDelegation() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialCount = viewModel.notes.first().size
        viewModel.createNote("Test ADR", "operator", "Test content", listOf("test"))
        assertEquals(initialCount + 1, viewModel.notes.first().size)

        val created = viewModel.notes.first().first()
        viewModel.updateNoteStatus(created.id, NoteStatus.APPROVED)
        assertEquals(NoteStatus.APPROVED, viewModel.notes.first().first().status)
    }

    @Test
    fun testPetsDelegation() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val kai = viewModel.pets.first().find { it.id == "kai" }
        assertNotNull(kai)

        viewModel.feedPet("kai")
        val fedKai = viewModel.pets.first().find { it.id == "kai" }
        assertTrue(fedKai!!.energy >= kai!!.energy)

        viewModel.petCompanion("kai")
        val praisedKai = viewModel.pets.first().find { it.id == "kai" }
        assertTrue(praisedKai!!.bondLevel >= fedKai.bondLevel)

        viewModel.trainPet("kai")
        val trainedKai = viewModel.pets.first().find { it.id == "kai" }
        assertTrue(trainedKai!!.exp > praisedKai.exp || trainedKai.level > praisedKai.level)
    }

    @Test
    fun testSoundboardDelegation() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        assertFalse(viewModel.isMuted.first())
        assertTrue(viewModel.hapticsEnabled.first())

        viewModel.toggleMute()
        assertTrue(viewModel.isMuted.first())

        viewModel.toggleHaptics()
        assertFalse(viewModel.hapticsEnabled.first())

        viewModel.toggleMute()
        assertFalse(viewModel.isMuted.first())

        viewModel.playSound("sfx-01")
        assertEquals("sfx-01", viewModel.activePlayingSoundId.first())
    }

    @Test
    fun testReleaseClaim() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialClaims = viewModel.claims.first()
        assertTrue(initialClaims.any { it.project == "zoth-studio" })

        viewModel.releaseClaim("zoth-studio")

        val updatedClaims = viewModel.claims.first()
        assertTrue(updatedClaims.none { it.project == "zoth-studio" })
        assertEquals(initialClaims.size - 1, updatedClaims.size)
    }
}
