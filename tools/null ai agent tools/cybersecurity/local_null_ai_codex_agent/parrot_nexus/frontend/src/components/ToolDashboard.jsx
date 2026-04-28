export default function ToolDashboard({
  searchTerm,
  onSearchChange,
  onOpenNative,
  onToggleAI,
  toolInsights,
  toolProgressByName,
  toolsLoading,
  toolLoadProgress,
  toolLoadStage,
  currentFilter,
  categories,
  onFilterChange,
  filteredTools,
  onOpenWorkspace
}) {
  return (
    <div className="max-w-7xl mx-auto relative">
      <header className="mb-8 panel-surface rounded-3xl overflow-hidden">
        <div className="hero-mesh px-6 md:px-8 py-8 md:py-10">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => window.location.reload()}
              title="Reload dashboard"
            >
              <img
                src="https://nullai.tech/DarkMode-NullAI-Icon.png"
                alt="NullAI mascot icon"
                className="w-14 h-14 rounded-2xl ghost-float ring-1 ring-[#36fca0]/35 bg-black/50"
              />
              <div>
                <h1 className="text-4xl md:text-6xl font-bold neon-text tracking-tight leading-none">
                  PARROT NEXUS
                </h1>
                <p className="text-[#9db1be] mt-3 max-w-xl text-sm md:text-base">
                  Ethical Operator Command Center with guided tool mastery and real-time mission workflows.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center flex-wrap justify-end">
              <input
                type="text"
                placeholder="Search tools, categories, use cases..."
                className="px-4 py-2 rounded-lg w-72"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button
                onClick={onOpenNative}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all btn-subtle"
              >
                NATIVE TERMINAL
              </button>
              <button
                onClick={onToggleAI}
                className="px-4 py-2 rounded-lg text-xs font-bold transition-all btn-subtle"
              >
                AI ASSISTANT
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="metric-block">
              <div className="metric-label">TOOLS INDEXED</div>
              <div className="metric-value">{toolInsights?.total || 0}</div>
            </div>
            <div className="metric-block">
              <div className="metric-label">TRAINING MODULES</div>
              <div className="metric-value">{toolInsights?.withTraining || 0}</div>
            </div>
            <div className="metric-block">
              <div className="metric-label">LABS COMPLETE</div>
              <div className="metric-value">
                {(toolInsights?.completedTrainingLevels || 0)}/{toolInsights?.totalTrainingLevels || 0}
              </div>
            </div>
          </div>

          {Array.isArray(toolInsights?.topCategories) && toolInsights.topCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {toolInsights.topCategories.map(([name, count]) => (
                <span
                  key={`top-${name}`}
                  className="text-xs px-3 py-1 rounded-full bg-[#101926] border border-[#2a3a51] text-[#93a7b4]"
                >
                  {name}: {count}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="academy-banner mb-6 px-4 py-3 rounded-xl border border-[#2f4060] text-xs text-[#c3d1db]">
        Academy Mode: Progress through Foundation, Operator, and Advanced labs per tool. Authorized use only.
      </div>

      {toolsLoading && (
        <div className="mb-6 p-4 rounded-xl border border-[#334765] bg-[#101927]">
          <div className="flex justify-between items-center text-xs text-[#b5c7d5] mb-2">
            <span>{toolLoadStage || 'Loading tools...'}</span>
            <span>{Math.round(toolLoadProgress || 0)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#1b2739] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2fd48d] to-[#5ab4ff] transition-all duration-300"
              style={{ width: `${Math.max(4, Math.min(100, toolLoadProgress || 0))}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              currentFilter === cat
                ? 'bg-[#36fca0] text-black'
                : 'bg-[#131821] text-[#93a7b4] border border-[#252e3b] hover:bg-[#1b2230]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.length === 0 && (
          <div className="col-span-full text-center py-20 text-[#6f8292]">No tools found.</div>
        )}
        {filteredTools.map((tool) => {
          const progress = toolProgressByName?.[tool.name] || { completed: 0, total: 0, ratio: 0 }
          return (
          <div
            key={tool.name}
            className="tool-card p-5 rounded-xl group relative overflow-hidden cursor-pointer"
            onClick={() => onOpenWorkspace(tool)}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-[#6f8292] uppercase tracking-widest">
                {tool.category}
              </span>
              <span className="text-[10px] text-[#95adc4] font-semibold">ACADEMY READY</span>
            </div>
            <h3 className="text-xl font-semibold mb-1 group-hover:text-[#00ff41] transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-[#7b8e9b] font-mono mb-3">bin/{tool.command || tool.name}</p>
            <p className="text-xs text-[#90a4b0] line-clamp-2 min-h-[2.2rem]">{tool.desc}</p>
            {progress.total > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-[#94aabc] mb-1">
                  <span>ACADEMY</span>
                  <span>
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1a2535] overflow-hidden">
                  <div
                    className="h-full bg-[#36fca0] transition-all duration-300"
                    style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {Array.isArray(tool.tags) && tool.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span
                    key={`${tool.name}-${tag}`}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-[#2b3647] text-[#9ab0be] bg-[#0f1520]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3 text-[10px] uppercase tracking-widest text-[#36fca0] font-semibold">Open ➔</div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
