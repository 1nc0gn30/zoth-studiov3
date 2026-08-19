import { useEffect, useMemo, useState } from 'react'
import AiPanel from './components/AiPanel'
import ToolDashboard from './components/ToolDashboard'
import WorkspaceOverlay from './components/WorkspaceOverlay'
import MissionMap from './components/MissionMap'
import { useTerminalSession } from './hooks/useTerminalSession'
import { api } from './lib/api'
import { formatAgentStatus, formatHeartbeatStatus, initialTool } from './lib/constants'

export default function App() {
  const ACADEMY_PROGRESS_KEY = 'parrot_nexus_academy_progress_v1'
  const [allTools, setAllTools] = useState([])
  const [toolsLoading, setToolsLoading] = useState(true)
  const [toolLoadProgress, setToolLoadProgress] = useState(5)
  const [toolLoadStage, setToolLoadStage] = useState('Booting tool indexer')
  const [currentFilter, setCurrentFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [academyProgress, setAcademyProgress] = useState({})

  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [currentTool, setCurrentTool] = useState(initialTool)
  const [wsStatus, setWsStatus] = useState({
    text: '● CONNECTING',
    className: 'text-yellow-500'
  })

  const [presets, setPresets] = useState([])
  const [selectedPresetId, setSelectedPresetId] = useState('')
  const [presetVars, setPresetVars] = useState({})
  const [editor, setEditor] = useState({
    id: '',
    name: '',
    executable: '',
    args: '',
    category: '',
    description: ''
  })

  const [aiOpen, setAiOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiModel, setAiModel] = useState('gemma4:31b-cloud')
  const [aiModels, setAiModels] = useState([])
  const [aiStatus, setAiStatus] = useState({ text: '● READY', className: 'text-green-500' })
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hello. I am connected to your local Ollama instance. How can I assist today?' }
  ])
  const [heartbeatLine, setHeartbeatLine] = useState('HB idle')
  const [agentLine, setAgentLine] = useState('AGENT idle')

  // --- Playbook State ---
  const [playbooks, setPlaybooks] = useState([])
  const [currentPlaybook, setCurrentPlaybook] = useState(null)
  const [playbookSession, setPlaybookSession] = useState(null)
  const [missionMapOpen, setMissionMapOpen] = useState(false)

  const {
    terminalContainerRef,
    setLaunchPayload,
    typeIntoTerminal,
    focusTerminal,
    cleanupTerminal,
    terminateTerminal
  } = useTerminalSession({
    workspaceOpen,
    currentToolName: currentTool.name,
    onStatusChange: setWsStatus
  })

  const categories = useMemo(
    () => ['All', ...new Set(allTools.map((tool) => tool.category))],
    [allTools]
  )

  const filteredTools = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return allTools.filter((tool) => {
      const searchableText = [
        tool.name,
        tool.command,
        tool.category,
        tool.desc,
        tool.help_docs,
        tool.path,
        ...(Array.isArray(tool.tags) ? tool.tags : []),
        ...(Array.isArray(tool.use_cases) ? tool.use_cases : [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const matchesSearch = searchableText.includes(term)
      const matchesCat = currentFilter === 'All' || tool.category === currentFilter
      return matchesSearch && matchesCat
    })
  }, [allTools, currentFilter, searchTerm])

  const toolInsights = useMemo(() => {
    const categoryCounts = allTools.reduce((acc, tool) => {
      const key = tool.category || 'Uncategorized'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
    const withTraining = allTools.filter((tool) => tool.training).length
    const totalTrainingLevels = allTools.reduce(
      (sum, tool) => sum + (Array.isArray(tool.training?.levels) ? tool.training.levels.length : 0),
      0
    )
    const completedTrainingLevels = Object.values(academyProgress).reduce(
      (sum, value) => sum + (Array.isArray(value) ? value.length : 0),
      0
    )
    return {
      total: allTools.length,
      categories: Object.keys(categoryCounts).length,
      withTraining,
      totalTrainingLevels,
      completedTrainingLevels,
      topCategories
    }
  }, [allTools, academyProgress])

  const toolProgressByName = useMemo(() => {
    const out = {}
    for (const tool of allTools) {
      const levels = Array.isArray(tool.training?.levels) ? tool.training.levels : []
      const completed = Array.isArray(academyProgress[tool.name]) ? academyProgress[tool.name] : []
      const completedCount = levels.filter((level) => completed.includes(level.name)).length
      out[tool.name] = {
        completed: completedCount,
        total: levels.length,
        ratio: levels.length ? completedCount / levels.length : 0
      }
    }
    return out
  }, [allTools, academyProgress])

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) || null,
    [presets, selectedPresetId]
  )

  async function fetchTools() {
    setToolsLoading(true)
    try {
      const payload = await api.getTools()
      setAllTools(payload.data || [])
      setToolLoadProgress(100)
      setToolLoadStage(`Indexed ${(payload.data || []).length} tools`)
    } catch {
      setAllTools([])
      setToolLoadStage('Tool indexing failed')
    } finally {
      setTimeout(() => {
        setToolsLoading(false)
      }, 250)
    }
  }

  async function fetchPresets() {
    try {
      const payload = await api.getPresets()
      setPresets(payload.data || [])
    } catch {
      setPresets([])
    }
  }

  async function fetchAiModels() {
    try {
      const payload = await api.getAiModels()
      if (payload.status === 'success') setAiModels(payload.data || [])
    } catch {
      setAiModels([])
    }
  }

  async function fetchHeartbeatStatus() {
    try {
      const payload = await api.heartbeatStatus()
      if (payload.status === 'success') {
        setHeartbeatLine(formatHeartbeatStatus(payload.data))
        if (payload.data?.model) setAiModel(payload.data.model)
      }
    } catch {
      setHeartbeatLine('HB unavailable')
    }
  }

  async function fetchAgentStatus() {
    try {
      const payload = await api.agentStatus()
      if (payload.status === 'success') setAgentLine(formatAgentStatus(payload.data))
    } catch {
      setAgentLine('AGENT unavailable')
    }
  }

  async function startHeartbeat() {
    const payload = await api.heartbeatStart(aiModel)
    if (payload.status === 'success') setHeartbeatLine(formatHeartbeatStatus(payload.data))
  }

  async function stopHeartbeat() {
    const payload = await api.heartbeatStop()
    if (payload.status === 'success') setHeartbeatLine(formatHeartbeatStatus(payload.data))
  }

  async function pingHeartbeat() {
    const payload = await api.heartbeatPing()
    if (payload.status === 'success') setHeartbeatLine(formatHeartbeatStatus(payload.data))
  }

  async function startAgent() {
    const payload = await api.agentStart(aiModel)
    if (payload.status === 'success') {
      setAgentLine(formatAgentStatus(payload.data))
      fetchHeartbeatStatus()
    }
  }

  async function stopAgent() {
    const payload = await api.agentStop()
    if (payload.status === 'success') {
      setAgentLine(formatAgentStatus(payload.data))
    }
  }

  async function sendAIQuery() {
    const prompt = aiInput.trim()
    if (!prompt) return

    setChatMessages((prev) => [...prev, { role: 'user', text: prompt }])
    setAiInput('')
    setAiStatus({ text: '● THINKING...', className: 'text-yellow-500' })

    try {
      const data = await api.aiChat(prompt, aiModel)
      if (data.status === 'success') {
        setChatMessages((prev) => [...prev, { role: 'ai', text: data.response }])
      } else {
        setChatMessages((prev) => [...prev, { role: 'ai', text: data.message || 'Error' }])
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Connection error. Is Ollama running?' }
      ])
    } finally {
      setAiStatus({ text: '● READY', className: 'text-green-500' })
    }
  }

  // --- Playbook Handlers ---
  async function fetchPlaybooks() {
    try {
      const res = await api.listPlaybooks();
      if (res.status === 'success') setPlaybooks(res.data);
    } catch (e) { console.error(e); }
  }

  async function startMission(playbookId) {
    const sid = "session_" + Math.random().toString(36).substr(2, 9);
    try {
      const res = await api.startPlaybookSession(sid, playbookId);
      if (res.status === 'success') {
        const pb = await api.getPlaybook(playbookId);
        setCurrentPlaybook(pb.data);
        setPlaybookSession(res.data);
        setMissionMapOpen(true);
      }
    } catch (e) { console.error(e); }
  }

  async function handleTransition(condition, findingNote = '') {
    if (!playbookSession) return;
    try {
      const res = await api.transitionPlaybook(playbookSession.sid, condition, findingNote);
      if (res.status === 'success') {
        setPlaybookSession(res.data);
      }
    } catch (e) { console.error(e); }
  }

  function launchMissionCommand(command) {
    if (!command || typeof command !== 'string') return
    const trimmed = command.trim()
    if (!trimmed) return
    const executable = trimmed.split(/\s+/)[0]
    const matched = allTools.find((tool) => tool.name === executable) || initialTool
    openWorkspace(matched)
    window.setTimeout(() => {
      typeIntoTerminal(trimmed, false)
    }, 200)
  }

  function openWorkspace(tool) {
    setLaunchPayload({ command: '/bin/bash', tool_name: tool.name })
    setCurrentTool(tool)
    setWorkspaceOpen(true)
    setWsStatus({ text: '● CONNECTING', className: 'text-yellow-500' })
    setSelectedPresetId('')
    setPresetVars({})
  }

  function openNativeWorkspace() {
    openWorkspace(initialTool)
  }

  function closeWorkspace() {
    cleanupTerminal(false)
    setWorkspaceOpen(false)
    setWsStatus({ text: '● TERMINATED', className: 'text-red-500' })
  }

  async function loadPresetCommand(appendEnter = false) {
    if (!selectedPreset) return
    const payload = await api.launchPreset(selectedPreset.id, presetVars)
    if (payload.status === 'success') typeIntoTerminal(payload.data.preview || '', appendEnter)
  }

  async function savePresetFromEditor() {
    const name = editor.name.trim()
    const executable = editor.executable.trim()
    if (!name || !executable) return

    const args = editor.args.trim()
      ? editor.args
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : []

    const payload = {
      id: editor.id.trim() || undefined,
      name,
      executable,
      args,
      category: editor.category.trim() || 'Custom',
      description: editor.description.trim(),
      variables: selectedPreset ? selectedPreset.variables || [] : [],
      cwd: selectedPreset ? selectedPreset.cwd || '' : '',
      env: selectedPreset ? selectedPreset.env || {} : {}
    }

    const result = await api.upsertPreset(payload)
    if (result.status === 'success') {
      await fetchPresets()
      setSelectedPresetId(result.data.id)
    }
  }

  async function deletePresetFromEditor() {
    const id = editor.id.trim()
    if (!id) return
    const result = await api.deletePreset(id)
    if (result.status === 'success') {
      setSelectedPresetId('')
      setPresetVars({})
      setEditor({ id: '', name: '', executable: '', args: '', category: '', description: '' })
      await fetchPresets()
    }
  }

  function toggleAcademyLevel(toolName, levelName) {
    if (!toolName || !levelName) return
    setAcademyProgress((prev) => {
      const current = Array.isArray(prev[toolName]) ? prev[toolName] : []
      const exists = current.includes(levelName)
      const next = exists ? current.filter((name) => name !== levelName) : [...current, levelName]
      return { ...prev, [toolName]: next }
    })
  }

  useEffect(() => {
    fetchTools()
    fetchPresets()
    fetchAiModels()
    fetchHeartbeatStatus()
    fetchAgentStatus()
    fetchPlaybooks()

    const hb = window.setInterval(fetchHeartbeatStatus, 15000)
    const ag = window.setInterval(fetchAgentStatus, 15000)
    return () => {
      window.clearInterval(hb)
      window.clearInterval(ag)
      cleanupTerminal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACADEMY_PROGRESS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') setAcademyProgress(parsed)
    } catch {
      setAcademyProgress({})
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(academyProgress))
    } catch {
      // no-op when storage is unavailable
    }
  }, [academyProgress])

  useEffect(() => {
    if (!toolsLoading) return
    const stages = [
      'Booting tool indexer',
      'Scanning executable paths',
      'Classifying categories and tags',
      'Generating academy tracks'
    ]
    let stageIndex = 0
    const interval = window.setInterval(() => {
      stageIndex = (stageIndex + 1) % stages.length
      setToolLoadStage(stages[stageIndex])
      setToolLoadProgress((prev) => Math.min(prev + 7, 92))
    }, 420)
    return () => window.clearInterval(interval)
  }, [toolsLoading])

  useEffect(() => {
    if (!selectedPreset) return
    const vars = {}
    ;(selectedPreset.variables || []).forEach((v) => {
      vars[v.name] = v.default || ''
    })
    setPresetVars(vars)
    setEditor({
      id: selectedPreset.id || '',
      name: selectedPreset.name || '',
      executable: selectedPreset.executable || '',
      args: (selectedPreset.args || []).join(','),
      category: selectedPreset.category || '',
      description: selectedPreset.description || ''
    })
  }, [selectedPreset])

  return (
    <div className="app-shell p-6 md:p-8 relative min-h-screen">
      <ToolDashboard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNative={openNativeWorkspace}
        onToggleAI={() => setAiOpen((prev) => !prev)}
        toolInsights={toolInsights}
        toolProgressByName={toolProgressByName}
        toolsLoading={toolsLoading}
        toolLoadProgress={toolLoadProgress}
        toolLoadStage={toolLoadStage}
        currentFilter={currentFilter}
        categories={categories}
        onFilterChange={setCurrentFilter}
        filteredTools={filteredTools}
        onOpenWorkspace={openWorkspace}
      />

      <WorkspaceOverlay
        open={workspaceOpen}
        currentTool={currentTool}
        wsStatus={wsStatus}
        onClose={closeWorkspace}
        onFocus={focusTerminal}
        onTerminate={() => {
          terminateTerminal()
          setWsStatus({ text: '● TERMINATED', className: 'text-red-500' })
        }}
        terminalContainerRef={terminalContainerRef}
        onTypeCheat={(cmd) => typeIntoTerminal(cmd, false)}
        presets={presets}
        onSelectPreset={setSelectedPresetId}
        selectedPreset={selectedPreset}
        presetVars={presetVars}
        onPresetVarChange={(name, value) =>
          setPresetVars((prev) => ({
            ...prev,
            [name]: value
          }))
        }
        onTypePreset={() => loadPresetCommand(false)}
        onRunPreset={() => loadPresetCommand(true)}
        editor={editor}
        onEditorChange={(field, value) => setEditor((prev) => ({ ...prev, [field]: value }))}
        onSavePreset={savePresetFromEditor}
        onDeletePreset={deletePresetFromEditor}
        academyProgress={academyProgress}
        onToggleAcademyLevel={toggleAcademyLevel}
      />

      <AiPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        chatMessages={chatMessages}
        aiModel={aiModel}
        onAiModelChange={setAiModel}
        aiModels={aiModels}
        onStartHeartbeat={startHeartbeat}
        onPingHeartbeat={pingHeartbeat}
        onStopHeartbeat={stopHeartbeat}
        heartbeatLine={heartbeatLine}
        onStartAgent={startAgent}
        onStopAgent={stopAgent}
        agentLine={agentLine}
        aiInput={aiInput}
        onAiInputChange={setAiInput}
        onSendAI={sendAIQuery}
        aiStatus={aiStatus}
        playbookSession={playbookSession}
        currentPlaybook={currentPlaybook}
        onTransitionPlaybook={handleTransition}
      />

      {missionMapOpen && (
        <MissionMap 
          session={playbookSession} 
          playbook={currentPlaybook} 
          onTransition={handleTransition}
          onLaunchCommand={launchMissionCommand}
        />
      )}

      {/* Mission Launcher Floating Button */}
      {!playbookSession && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          {playbooks.map(pb => (
            <button 
              key={pb.id}
              onClick={() => startMission(pb.id)}
              className="px-4 py-2 bg-[#00ff41] text-black font-bold rounded-lg text-xs hover:bg-[#00cc33] shadow-lg shadow-[#00ff41]/20 transition-all active:scale-95"
            >
              START MISSION: {pb.id}
            </button>
          ))}
        </div>
      )}

      {playbookSession && (
        <button 
          onClick={() => { setPlaybookSession(null); setMissionMapOpen(false); }}
          className="fixed bottom-8 right-8 z-50 px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700"
        >
          ABORT MISSION
        </button>
      )}
    </div>
  )
}
