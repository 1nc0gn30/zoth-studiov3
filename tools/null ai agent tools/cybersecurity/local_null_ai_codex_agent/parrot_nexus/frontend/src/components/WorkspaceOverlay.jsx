export default function WorkspaceOverlay({
  open,
  currentTool,
  wsStatus,
  onClose,
  onFocus,
  onTerminate,
  terminalContainerRef,
  onTypeCheat,
  presets,
  onSelectPreset,
  selectedPreset,
  presetVars,
  onPresetVarChange,
  onTypePreset,
  onRunPreset,
  editor,
  onEditorChange,
  onSavePreset,
  onDeletePreset,
  academyProgress,
  onToggleAcademyLevel
}) {
  if (!open) return null

  const training = currentTool.training || null
  const completedLevels = Array.isArray(academyProgress?.[currentTool.name])
    ? academyProgress[currentTool.name]
    : []
  const totalLevels = Array.isArray(training?.levels) ? training.levels.length : 0
  const completedCount = totalLevels
    ? training.levels.filter((level) => completedLevels.includes(level.name)).length
    : 0
  const completionPct = totalLevels ? Math.round((completedCount / totalLevels) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090e15]">
      <nav className="h-14 border-b border-[#2b3646] bg-[#0d141e] flex justify-between items-center px-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">
            ← Back
          </button>
          <span className="text-lg font-bold neon-text ml-2 truncate">{currentTool.name.toUpperCase()}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className={`text-[10px] font-mono ${wsStatus.className}`}>{wsStatus.text}</span>
          <button
            onClick={onFocus}
            className="px-3 py-1 bg-[#16202d] text-gray-300 border border-[#34465d] rounded text-xs"
          >
            FOCUS
          </button>
          <button
            onClick={onTerminate}
            className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/50 rounded text-xs"
          >
            TERMINATE
          </button>
        </div>
      </nav>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-black p-2 overflow-hidden">
          <div ref={terminalContainerRef} className="h-full" />
        </div>
        <div className="w-[29rem] border-l border-[#2b3646] bg-[#0d141e] p-5 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Reference Guide</h3>
          <div className="text-sm text-gray-300 mb-4 leading-relaxed italic">{currentTool.desc}</div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Full Documentation</h3>
          <div className="text-xs text-gray-400 mb-5 leading-normal bg-[#0a0f16] p-3 border border-[#243246] rounded">
            {currentTool.help_docs}
          </div>

          {Array.isArray(currentTool.tags) && currentTool.tags.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tags</h3>
              <div className="mb-5 flex flex-wrap gap-1.5">
                {currentTool.tags.map((tag) => (
                  <span
                    key={`${currentTool.name}-tag-${tag}`}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-[#2b3647] text-[#9ab0be] bg-[#101927]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {Array.isArray(currentTool.use_cases) && currentTool.use_cases.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Use Cases</h3>
              <div className="mb-5 bg-[#0a0f16] p-3 border border-[#243246] rounded">
                <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                  {currentTool.use_cases.map((useCase) => (
                    <li key={`${currentTool.name}-${useCase}`}>{useCase}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {training && (
            <>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Operator Academy</h3>
              <div className="mb-5 bg-[#0a0f16] p-3 border border-[#243246] rounded">
                <div className="text-xs text-[#d3dde6] font-semibold">{training.title}</div>
                <div className="text-[11px] text-[#8ea2b2] mt-1">{training.focus}</div>
                <div className="text-[10px] text-amber-300 mt-2">{training.legal_notice}</div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-[#9cb1c0] mb-1">
                    <span>Progress</span>
                    <span>
                      {completedCount}/{totalLevels}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1a2535] overflow-hidden">
                    <div className="h-full bg-[#36fca0]" style={{ width: `${completionPct}%` }} />
                  </div>
                </div>
                {Array.isArray(training.levels) && (
                  <div className="mt-3 space-y-2">
                    {training.levels.map((level) => (
                      <div
                        key={`${currentTool.name}-${level.name}`}
                        className="p-2 rounded border border-[#2f3f58] bg-[#0d1725]"
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="text-[10px] uppercase tracking-widest font-semibold text-[#36fca0]">
                            {level.name}
                          </div>
                          <button
                            onClick={() => onToggleAcademyLevel(currentTool.name, level.name)}
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              completedLevels.includes(level.name)
                                ? 'border-[#36fca0] text-[#36fca0] bg-[#103225]'
                                : 'border-[#3b4f69] text-[#94a8b6] bg-[#101a29]'
                            }`}
                          >
                            {completedLevels.includes(level.name) ? 'COMPLETED' : 'MARK DONE'}
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-300 mt-1">{level.objective}</div>
                        {level.lab?.command && (
                          <button
                            onClick={() => onTypeCheat(level.lab.command)}
                            className="mt-2 w-full text-left p-2 bg-[#131f2f] border border-[#365072] rounded hover:border-[#36fca0]"
                          >
                            <div className="text-[10px] text-[#8fa2b1]">{level.lab.title}</div>
                            <div className="text-[11px] font-mono text-white">{level.lab.command}</div>
                            <div className="text-[10px] text-[#9fb3c3] mt-1">{level.lab.outcome}</div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(training.milestones) && training.milestones.length > 0 && (
                  <ul className="list-disc pl-4 mt-3 space-y-1 text-[11px] text-[#b7c8d6]">
                    {training.milestones.map((milestone) => (
                      <li key={`${currentTool.name}-${milestone}`}>{milestone}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
            Insert Command (Click to type)
          </h3>
          <div className="space-y-2 mb-6">
            {(currentTool.cheats || []).map((cheat) => (
              <button
                key={`${currentTool.name}-${cheat.cmd}`}
                className="w-full text-left p-3 bg-[#111b2a] border-l-2 border-[#00ff41] rounded-r-lg hover:bg-[#172335]"
                onClick={() => onTypeCheat(cheat.cmd)}
              >
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">{cheat.desc}</div>
                <div className="text-xs font-mono text-white">{cheat.cmd}</div>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Preset Launchpad</h3>
          <div className="space-y-2 mb-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                className="w-full text-left p-2 rounded border border-[#2b3647] bg-[#101927] hover:border-[#00ff41]"
                onClick={() => onSelectPreset(preset.id)}
              >
                <div className="text-xs font-semibold text-white">{preset.name}</div>
                <div className="text-[10px] text-gray-500">{preset.category || 'Custom'}</div>
              </button>
            ))}
          </div>

          {selectedPreset && (
            <div className="p-3 border border-[#2b3647] rounded bg-[#0f1622] mb-6">
              <div className="text-xs text-white font-semibold mb-2">{selectedPreset.name}</div>
              <div className="text-[10px] text-gray-500 mb-2">{selectedPreset.description || ''}</div>
              <div className="space-y-2">
                {(selectedPreset.variables || []).map((v) => (
                  <div key={v.name}>
                    <label className="text-[10px] text-gray-500 uppercase">{v.label || v.name}</label>
                    <input
                      className="w-full px-2 py-1 rounded text-xs font-mono"
                      value={presetVars[v.name] || ''}
                      onChange={(e) => onPresetVarChange(v.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={onTypePreset}
                  className="px-2 py-2 bg-[#162131] border border-[#34465e] text-gray-200 rounded text-xs"
                >
                  Type Preset
                </button>
                <button
                  onClick={onRunPreset}
                  className="px-2 py-2 bg-[#003b14] border border-[#00ff41]/40 text-[#00ff41] rounded text-xs"
                >
                  Run Preset
                </button>
              </div>
            </div>
          )}

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Preset Config Editor</h3>
          <div className="space-y-2 text-xs">
            <input
              placeholder="Preset ID (optional for new)"
              value={editor.id}
              onChange={(e) => onEditorChange('id', e.target.value)}
            />
            <input
              placeholder="Name"
              value={editor.name}
              onChange={(e) => onEditorChange('name', e.target.value)}
            />
            <input
              placeholder="Executable (e.g. nmap)"
              value={editor.executable}
              onChange={(e) => onEditorChange('executable', e.target.value)}
            />
            <input
              placeholder="Args comma-separated (e.g. -F,{{target}})"
              value={editor.args}
              onChange={(e) => onEditorChange('args', e.target.value)}
            />
            <input
              placeholder="Category"
              value={editor.category}
              onChange={(e) => onEditorChange('category', e.target.value)}
            />
            <textarea
              rows="2"
              placeholder="Description"
              value={editor.description}
              onChange={(e) => onEditorChange('description', e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={onSavePreset}
                className="flex-1 px-3 py-2 bg-[#003b14] text-[#00ff41] border border-[#00ff41]/40 rounded"
              >
                Save
              </button>
              <button
                onClick={onDeletePreset}
                className="flex-1 px-3 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
