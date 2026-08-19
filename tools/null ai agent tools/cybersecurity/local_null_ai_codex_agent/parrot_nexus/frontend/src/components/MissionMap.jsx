import React, { useMemo, useState } from 'react'

export default function MissionMap({ session, playbook, onTransition, onLaunchCommand }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [findingNote, setFindingNote] = useState('')

  if (!session || !playbook) return null

  const nodes = playbook.nodes || {}
  const currentId = session.current_node
  const history = session.history || []
  const transitionLog = session.transition_log || []
  const selectedId = selectedNodeId || currentId
  const selectedNode = nodes[selectedId] || null
  const progressPct = Math.round((history.length / Math.max(1, Object.keys(nodes).length - 1)) * 100)

  const visiblePath = useMemo(() => {
    const path = [...history, currentId]
    return Array.from(new Set(path))
  }, [history, currentId])

  return (
    <div className="fixed inset-0 z-30 bg-black/65 backdrop-blur-sm p-5 md:p-8">
      <div className="h-full w-full grid grid-cols-1 xl:grid-cols-[1.3fr,1fr] gap-4">
        <div className="rounded-2xl border border-[#27374d] bg-[#0b121d] overflow-hidden flex flex-col">
          <div className="p-4 md:p-5 border-b border-[#27374d] flex justify-between items-center">
            <div className="flex items-center gap-3 min-w-0">
              <img src="https://nullai.tech/DarkMode-NullAI-Icon.png" alt="Logo" className="w-8 h-8" />
              <div>
                <h2 className="text-base md:text-lg font-bold text-[#d8e4ee] truncate">{playbook.name}</h2>
                <p className="text-[10px] text-[#8aa0b1] uppercase tracking-widest">
                  Session {session.sid || '-'} • Status {currentId === 'rce_final' ? 'Complete' : 'Active'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#8aa0b1] uppercase tracking-widest">Progress</div>
              <div className="text-sm text-[#36fca0] font-semibold">{progressPct}%</div>
            </div>
          </div>

          <div className="p-4 md:p-5 overflow-auto">
            <div className="flex flex-col gap-3">
              {Object.entries(nodes).map(([id, node]) => {
                const isCurrent = id === currentId
                const isVisited = visiblePath.includes(id)
                const isSelected = id === selectedId
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedNodeId(id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-[#36fca0] bg-[#0f2430]'
                        : isSelected
                          ? 'border-[#4f6b85] bg-[#132030]'
                          : isVisited
                            ? 'border-[#304861] bg-[#111b29]'
                            : 'border-[#243448] bg-[#0e1723]'
                    }`}
                  >
                    <div className="flex justify-between gap-2 items-start">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#8ba0b1]">{id}</div>
                        <div className="text-sm text-[#d4e2ec] font-semibold">{node.label}</div>
                      </div>
                      <div className="text-[10px] text-[#8ba0b1]">
                        {isCurrent ? 'CURRENT' : isVisited ? 'VISITED' : 'PENDING'}
                      </div>
                    </div>
                    <div className="text-xs text-[#94a8b7] mt-1 line-clamp-2">{node.description}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#27374d] bg-[#0b121d] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#27374d]">
            <div className="text-[10px] text-[#8ba0b1] uppercase tracking-widest">Mission Control</div>
            <div className="text-lg text-[#d8e4ee] font-semibold mt-1">
              {selectedNode?.label || 'No node selected'}
            </div>
          </div>

          <div className="p-4 overflow-auto flex-1 space-y-4">
            {selectedNode && (
              <>
                <div className="text-sm text-[#a9bccb]">{selectedNode.description}</div>
                <div className="text-xs text-[#8ba0b1] italic">{selectedNode.ai_guidance}</div>

                <div className="p-3 rounded-lg border border-[#2d4158] bg-[#0f1b2a]">
                  <div className="text-[10px] uppercase tracking-widest text-[#8ba0b1] mb-1">
                    Suggested Command
                  </div>
                  <div className="text-xs font-mono text-white break-all">{selectedNode.tool_suggestion}</div>
                  <button
                    onClick={() => onLaunchCommand?.(selectedNode.tool_suggestion)}
                    className="mt-2 px-3 py-1.5 rounded border border-[#36fca0]/45 text-[#36fca0] text-xs hover:bg-[#123225]"
                  >
                    Open In Workspace
                  </button>
                </div>

                {selectedId === currentId ? (
                  <div className="p-3 rounded-lg border border-[#2d4158] bg-[#0f1b2a]">
                    <div className="text-[10px] uppercase tracking-widest text-[#8ba0b1] mb-2">
                      Transition Decision
                    </div>
                    <textarea
                      rows={3}
                      value={findingNote}
                      onChange={(e) => setFindingNote(e.target.value)}
                      placeholder="Add finding note / evidence summary for this transition..."
                      className="w-full text-xs rounded"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.keys(selectedNode.transitions || {}).map((condition) => (
                        <button
                          key={condition}
                          onClick={() => {
                            onTransition(condition, findingNote)
                            setFindingNote('')
                          }}
                          className="px-3 py-1.5 text-[10px] font-semibold rounded border border-[#36fca0]/40 text-[#36fca0] hover:bg-[#103225]"
                        >
                          {condition.replace(/_/g, ' ')} {'->'} {selectedNode.transitions[condition]}
                        </button>
                      ))}
                      {Object.keys(selectedNode.transitions || {}).length === 0 && (
                        <span className="text-xs text-[#8ba0b1]">No further transitions from this node.</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#8ba0b1]">
                    Select the current node to execute a transition.
                  </div>
                )}
              </>
            )}

            <div className="pt-2 border-t border-[#243448]">
              <div className="text-[10px] uppercase tracking-widest text-[#8ba0b1] mb-2">Timeline</div>
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {transitionLog.length === 0 && (
                  <div className="text-xs text-[#8ba0b1]">No transitions recorded yet.</div>
                )}
                {[...transitionLog].reverse().map((item, idx) => (
                  <div key={`tl-${idx}`} className="text-xs p-2 rounded border border-[#27374d] bg-[#0f1a28]">
                    <div className="text-[#c9d8e3]">
                      {item.from} {'->'} {item.to} via <span className="text-[#36fca0]">{item.condition}</span>
                    </div>
                    {item.note ? <div className="text-[#8ba0b1] mt-1">{item.note}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
