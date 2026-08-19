import { API_BASE } from './constants'

async function jsonFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options)
  return res.json()
}

export const api = {
  getTools: () => jsonFetch('/api/tools'),
  getPresets: () => jsonFetch('/api/presets'),
  upsertPreset: (payload) =>
    jsonFetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),
  deletePreset: (presetId) => jsonFetch(`/api/presets/${presetId}`, { method: 'DELETE' }),
  launchPreset: (presetId, variables) =>
    jsonFetch(`/api/presets/${presetId}/launch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variables })
    }),
  getAiModels: () => jsonFetch('/api/ai/models'),
  aiChat: (prompt, model) =>
    jsonFetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model })
    }),
  heartbeatStatus: () => jsonFetch('/api/heartbeat/status'),
  heartbeatStart: (model) =>
    jsonFetch('/api/heartbeat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        interval_seconds: 60,
        prompt: 'Reply with exactly: HEARTBEAT_OK'
      })
    }),
  heartbeatStop: () => jsonFetch('/api/heartbeat/stop', { method: 'POST' }),
  heartbeatPing: () => jsonFetch('/api/heartbeat/ping', { method: 'POST' }),
  agentStatus: () => jsonFetch('/api/agent/status'),
  agentStart: (model) =>
    jsonFetch('/api/agent/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'codex-ollama-agent',
        executable: 'codex',
        args: [],
        model,
        auto_restart: true,
        max_restarts: 100,
        sync_heartbeat: true,
        heartbeat_interval_seconds: 60
      })
    }),
  agentStop: () => jsonFetch('/api/agent/stop', { method: 'POST' }),

  // --- Playbook API ---
  listPlaybooks: () => jsonFetch('/api/playbooks'),
  getPlaybook: (id) => jsonFetch(`/api/playbooks/${id}`),
  startPlaybookSession: (sid, playbookId) =>
    jsonFetch('/api/playbooks/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, playbook_id: playbookId })
    }),
  getPlaybookSession: (sid) => jsonFetch(`/api/playbooks/session?sid=${sid}`),
  transitionPlaybook: (sid, condition, findingNote = '') =>
    jsonFetch('/api/playbooks/transition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, condition, finding_note: findingNote })
    }),
}
