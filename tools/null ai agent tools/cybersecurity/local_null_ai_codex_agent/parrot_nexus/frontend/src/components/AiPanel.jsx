import React from 'react';

export default function AiPanel({
  open,
  onClose,
  chatMessages,
  aiModel,
  onAiModelChange,
  aiModels,
  onStartHeartbeat,
  onPingHeartbeat,
  onStopHeartbeat,
  heartbeatLine,
  onStartAgent,
  onStopAgent,
  agentLine,
  aiInput,
  onAiInputChange,
  onSendAI,
  aiStatus,
  // New Playbook Props
  playbookSession,
  currentPlaybook,
  onTransitionPlaybook
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 z-40 flex flex-col shadow-2xl bg-[#111] border-l border-[#262626] transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-[#262626] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="https://nullai.tech/DarkMode-NullAI-Icon.png" alt="NullAI Ghost" className="w-8 h-8" />
          <h2 className="text-xl font-bold neon-text">INTELLIGENCE</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">
          &times;
        </button>
      </div>

      {/* Playbook Status Header */}
      {playbookSession && currentPlaybook && (
        <div className="bg-[#00ff41]/10 border-b border-[#00ff41]/30 p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-widest">Active Mission</span>
            <span className="text-[10px] text-gray-400 font-mono">ID: {playbookSession.playbook_id}</span>
          </div>
          <div className="text-xs font-bold text-white truncate">
            {currentPlaybook.nodes[playbookSession.current_node]?.label || 'Unknown Phase'}
          </div>
          <div className="text-[10px] text-gray-400 italic mt-1 line-clamp-2">
            {currentPlaybook.nodes[playbookSession.current_node]?.ai_guidance}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(currentPlaybook.nodes[playbookSession.current_node]?.transitions || {}).map(([cond, target]) => (
              <button 
                key={cond}
                onClick={() => onTransitionPlaybook(cond)}
                className="px-2 py-1 bg-black border border-[#00ff41]/40 text-[#00ff41] text-[9px] font-bold rounded hover:bg-[#00ff41]/20 transition-colors"
              >
                {cond.replace(/_/g, ' ').toUpperCase()} → {currentPlaybook.nodes[target]?.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div
            key={`chat-${idx}`}
            className={`p-3 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-[#222] border-r-2 border-[#444] text-white ml-8'
                : 'bg-[#1a1a1a] border-l-2 border-[#00ff41] text-gray-300 mr-8'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#262626] bg-[#0a0a0a]">
        <div className="mb-3 grid grid-cols-1 gap-2">
          <input
            type="text"
            list="ai-model-list"
            value={aiModel}
            onChange={(e) => onAiModelChange(e.target.value)}
            placeholder="Model (e.g. gemma4:31b-cloud)"
            className="px-3 py-2 rounded-lg text-xs font-mono bg-[#111] text-white border border-[#333]"
          />
          <datalist id="ai-model-list">
            {aiModels.map((model) => (
              <option key={model} value={model} />
            ))}
          </datalist>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onStartHeartbeat}
              className="px-2 py-2 bg-[#003b14] text-[#00ff41] border border-[#00ff41]/40 rounded text-[10px] font-bold"
            >
              HB START
            </button>
            <button
              onClick={onPingHeartbeat}
              className="px-2 py-2 bg-[#1a1a1a] text-gray-200 border border-[#444] rounded text-[10px] font-bold"
            >
              HB PING
            </button>
            <button
              onClick={onStopHeartbeat}
              className="px-2 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded text-[10px] font-bold"
            >
              HB STOP
            </button>
          </div>
          <div className="text-[10px] font-mono text-gray-500">{heartbeatLine}</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onStartAgent}
              className="px-2 py-2 bg-[#003b14] text-[#00ff41] border border-[#00ff41]/40 rounded text-[10px] font-bold"
            >
              AGENT START
            </button>
            <button
              onClick={onStopAgent}
              className="px-2 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded text-[10px] font-bold"
            >
              AGENT STOP
            </button>
          </div>
          <div className="text-[10px] font-mono text-gray-500">{agentLine}</div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask local AI..."
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-[#111] text-white border border-[#333]"
            value={aiInput}
            onChange={(e) => onAiInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSendAI()
            }}
          />
          <button
            onClick={onSendAI}
            className="px-3 py-2 bg-[#00ff41] text-black font-bold rounded-lg text-xs hover:bg-[#00cc33]"
          >
            SEND
          </button>
        </div>
        <div className="mt-2 flex justify-between items-center text-[10px] text-gray-600 font-mono">
          <span className="opacity-50 italic">Null AI Engine active</span>
          <span className={aiStatus.className}>{aiStatus.text}</span>
        </div>
      </div>
    </div>
  )
}
