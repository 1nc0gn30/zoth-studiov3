package com.example.zothsignalbridge.data

import com.example.zothsignalbridge.data.models.DialecticStage
import com.example.zothsignalbridge.data.models.VoteDecision
import com.example.zothsignalbridge.data.repository.ConsensusDataProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ConsensusArenaStateMachineTest {

    @Test
    fun testInitialConsensusState() {
        val state = ConsensusDataProvider.createInitialState()

        assertEquals(DialecticStage.SYNTHESIS, state.selectedDialecticStage)
        assertEquals(3, state.dialecticItems.size)
        assertTrue(state.proposals.isNotEmpty())
        assertTrue(state.stakeNodes.isNotEmpty())

        // Initial Approving Stake should satisfy BFT Quorum (> 66.7%)
        assertTrue(state.isQuorumAchieved)
        assertTrue(state.approvingStakePercent >= state.bftThresholdPercent)
    }

    @Test
    fun testByzantineFaultToleranceCalculations() {
        val state = ConsensusDataProvider.createInitialState()

        // 5 nodes: N >= 3f + 1 => max tolerable faulty nodes = (5-1)/3 = 1
        assertEquals(1, state.maxTolerableFaultyNodes)
        assertEquals(0, state.currentByzantineCount)

        // Inject 1 Byzantine Fault into Antigravity (35% stake)
        val modifiedNodes = state.stakeNodes.map { node ->
            if (node.agentId == "antigravity") node.copy(isByzantine = true) else node
        }
        val byzantineState = state.copy(stakeNodes = modifiedNodes)

        assertEquals(1, byzantineState.currentByzantineCount)
        // With antigravity (35%) excluded from valid approving stake: remaining = 92.5 - 35 = 57.5% < 66.7%
        assertFalse(byzantineState.isQuorumAchieved)
    }

    @Test
    fun testMerkleAstProofStructure() {
        val state = ConsensusDataProvider.createInitialState()
        val proof = state.merkleProof

        assertTrue(proof.isValidated)
        assertTrue(proof.rootHash.startsWith("0x"))
        assertEquals(6, proof.treeDepth)
        assertEquals(64, proof.leafCount)
        assertEquals(3, proof.engines.size)
        assertTrue(proof.engines.all { it.isMatch })
    }
}
