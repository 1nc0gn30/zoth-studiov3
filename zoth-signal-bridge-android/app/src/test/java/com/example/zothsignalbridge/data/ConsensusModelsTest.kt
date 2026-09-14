package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.DialecticStage
import com.example.zothsignalbridge.data.models.DiffType
import com.example.zothsignalbridge.data.models.VoteDecision
import com.example.zothsignalbridge.data.repository.ConsensusDataProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ConsensusModelsTest {

    @Test
    fun testDefaultConsensusState() {
        val state = ConsensusDataProvider.createInitialState()

        // Dialectic Flow
        assertEquals(DialecticStage.SYNTHESIS, state.selectedDialecticStage)
        assertEquals(3, state.dialecticItems.size)
        assertTrue(state.dialecticItems.any { it.stage == DialecticStage.THESIS && it.authorAgentId == "antigravity" })
        assertTrue(state.dialecticItems.any { it.stage == DialecticStage.ANTITHESIS && it.authorAgentId == "grok" })
        assertTrue(state.dialecticItems.any { it.stage == DialecticStage.SYNTHESIS && it.authorAgentId == "azoth" })

        // Multi-Agent Proposals
        assertEquals(4, state.proposals.size)
        val synthesisProposal = state.proposals.find { it.agentId == "synthesis" }
        assertNotNull(synthesisProposal)
        assertTrue(synthesisProposal!!.diffLines.isNotEmpty())
        assertTrue(synthesisProposal.diffLines.any { it.type == DiffType.ADDED })
        assertTrue(synthesisProposal.diffLines.any { it.type == DiffType.DELETED })
        assertTrue(synthesisProposal.diffLines.any { it.type == DiffType.UNCHANGED })

        val agyProposal = state.proposals.find { it.agentId == "antigravity" }
        assertNotNull(agyProposal)
        assertEquals("AstRingBuffer.kt", agyProposal?.fileName)

        val grokProposal = state.proposals.find { it.agentId == "grok" }
        assertNotNull(grokProposal)
        assertEquals("PartitionedAstBuffer.kt", grokProposal?.fileName)

        val ollamaProposal = state.proposals.find { it.agentId == "ollama" }
        assertNotNull(ollamaProposal)
        assertEquals("LocalAstPruner.kt", ollamaProposal?.fileName)
    }

    @Test
    fun testBftQuorumCalculation() {
        val state = ConsensusDataProvider.createInitialState()

        // Default: 35.0 (antigravity) + 32.5 (grok) + 20.0 (ollama) + 5.0 (azoth) = 92.5%
        assertEquals(92.5, state.approvingStakePercent, 0.01)
        assertEquals(66.7, state.bftThresholdPercent, 0.01)
        assertTrue(state.isQuorumAchieved)
        assertEquals(1, state.maxTolerableFaultyNodes)
        assertEquals(0, state.currentByzantineCount)
    }

    @Test
    fun testQuorumCompromisedWhenVoteRejected() {
        val state = ConsensusDataProvider.createInitialState()

        // Antigravity (35%) votes REJECT -> Stake drops to 92.5 - 35.0 = 57.5% (< 66.7%)
        val updatedNodes = state.stakeNodes.map { node ->
            if (node.agentId == "antigravity") node.copy(vote = VoteDecision.REJECT) else node
        }
        val compromisedState = state.copy(stakeNodes = updatedNodes)

        assertEquals(57.5, compromisedState.approvingStakePercent, 0.01)
        assertFalse(compromisedState.isQuorumAchieved)
    }

    @Test
    fun testQuorumCompromisedWhenByzantineFaultInjected() {
        val state = ConsensusDataProvider.createInitialState()

        // Grok (32.5%) becomes Byzantine -> Approving stake drops to 92.5 - 32.5 = 60.0% (< 66.7%)
        val updatedNodes = state.stakeNodes.map { node ->
            if (node.agentId == "grok") node.copy(isByzantine = true) else node
        }
        val byzantineState = state.copy(stakeNodes = updatedNodes)

        assertEquals(60.0, byzantineState.approvingStakePercent, 0.01)
        assertFalse(byzantineState.isQuorumAchieved)
        assertEquals(1, byzantineState.currentByzantineCount)
    }

    @Test
    fun testMerkleAstTriangulationProof() {
        val proof = ConsensusDataProvider.createInitialState().merkleProof

        assertTrue(proof.isValidated)
        assertTrue(proof.rootHash.startsWith("0x"))
        assertEquals(6, proof.treeDepth)
        assertEquals(64, proof.leafCount)
        assertEquals(3, proof.engines.size)
        assertTrue(proof.engines.all { it.isMatch })
        assertTrue(proof.proofBranchHashes.isNotEmpty())
    }

    @Test
    fun testConsensusTelemetry() {
        val telemetry = ConsensusDataProvider.createInitialState().telemetry

        assertEquals(4289L, telemetry.roundNumber)
        assertTrue(telemetry.p50LatencyMs > 0.0)
        assertTrue(telemetry.p99LatencyMs > telemetry.p50LatencyMs)
        assertTrue(telemetry.astNodeCount > 0)
        assertTrue(telemetry.rawAstGraph.contains("[AST-ROOT]"))
        assertTrue(telemetry.mathFormula.contains("BFT Quorum Condition"))
    }
}
