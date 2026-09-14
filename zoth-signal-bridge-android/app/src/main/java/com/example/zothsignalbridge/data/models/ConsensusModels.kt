package com.example.zothsignalbridge.data.models

enum class DialecticStage {
    THESIS,
    ANTITHESIS,
    SYNTHESIS
}

data class DialecticItem(
    val stage: DialecticStage,
    val title: String,
    val authorAgentId: String,
    val authorName: String,
    val status: String,
    val summary: String,
    val keyPoints: List<String>,
    val timestamp: String
)

enum class DiffType {
    ADDED,
    DELETED,
    UNCHANGED
}

data class DiffLine(
    val type: DiffType,
    val text: String,
    val oldLineNum: Int? = null,
    val newLineNum: Int? = null
)

enum class VoteDecision {
    APPROVE,
    REJECT,
    ABSTAIN
}

data class AgentStakeNode(
    val agentId: String,
    val name: String,
    val stakePercent: Double,
    val vote: VoteDecision = VoteDecision.APPROVE,
    val isByzantine: Boolean = false,
    val publicKeyFingerprint: String,
    val weightVotes: Long
)

data class AgentCodeProposal(
    val agentId: String,
    val agentName: String,
    val version: String,
    val fileName: String,
    val language: String,
    val code: String,
    val astComplexity: Int,
    val memoryFootprintKb: Double,
    val executionLatencyMicros: Double,
    val voteDecision: VoteDecision,
    val diffLines: List<DiffLine> = emptyList()
)

data class TriangulationEngine(
    val id: String,
    val name: String,
    val role: String,
    val version: String,
    val latencyMs: Double,
    val isMatch: Boolean = true
)

data class MerkleAstProof(
    val rootHash: String,
    val shortRootHash: String,
    val treeDepth: Int,
    val leafCount: Int,
    val isValidated: Boolean,
    val verifiedAt: String,
    val proofBranchHashes: List<String>,
    val engines: List<TriangulationEngine>
)

data class ConsensusTelemetry(
    val roundNumber: Long,
    val epoch: String,
    val p50LatencyMs: Double,
    val p99LatencyMs: Double,
    val networkJitterMs: Double,
    val lamportTimestamp: Long,
    val astNodeCount: Int,
    val gasComputeUnits: Long,
    val rawAstGraph: String,
    val mathFormula: String
)

data class ConsensusArenaState(
    val selectedDialecticStage: DialecticStage = DialecticStage.SYNTHESIS,
    val dialecticItems: List<DialecticItem> = emptyList(),
    val selectedAgentProposalId: String = "synthesis",
    val proposals: List<AgentCodeProposal> = emptyList(),
    val stakeNodes: List<AgentStakeNode> = emptyList(),
    val merkleProof: MerkleAstProof,
    val telemetry: ConsensusTelemetry,
    val isReverifying: Boolean = false,
    val lastActionMessage: String? = null
) {
    /**
     * Calculates the total approving stake percentage (excluding Byzantine nodes).
     */
    val approvingStakePercent: Double
        get() {
            val total = stakeNodes
                .filter { it.vote == VoteDecision.APPROVE && !it.isByzantine }
                .sumOf { it.stakePercent }
            return Math.round(total * 10.0) / 10.0
        }

    /**
     * Required threshold for Byzantine Fault Tolerance quorum (66.7%).
     */
    val bftThresholdPercent: Double = 66.7

    /**
     * Whether the active consensus has satisfied the 2/3 supermajority quorum.
     */
    val isQuorumAchieved: Boolean
        get() = approvingStakePercent >= bftThresholdPercent

    /**
     * Max Byzantine nodes tolerable under N >= 3f + 1.
     */
    val maxTolerableFaultyNodes: Int
        get() = (stakeNodes.size - 1) / 3

    val currentByzantineCount: Int
        get() = stakeNodes.count { it.isByzantine }
}
