export const API_BASE = 'http://localhost:5000'

export const initialTool = {
  name: 'native-shell',
  desc: 'Interactive /bin/bash session for manual operations.',
  help_docs:
    'Use this mode for full terminal control. You can load preset commands or type manually.',
  cheats: [
    { desc: 'List files', cmd: 'ls -la' },
    { desc: 'Print working dir', cmd: 'pwd' },
    { desc: 'Show network ports', cmd: 'ss -tulpn' }
  ],
  command: ''
}

export function formatHeartbeatStatus(data) {
  if (!data) return 'HB unavailable'
  const state = data.last_ok === true ? 'OK' : data.last_ok === false ? 'FAIL' : 'IDLE'
  const running = data.running ? 'running' : 'stopped'
  const latency = data.last_latency_ms != null ? `${data.last_latency_ms}ms` : '-'
  const error = data.last_error ? ` err=${data.last_error}` : ''
  return `HB ${state} | ${running} | model=${data.model || '-'} | latency=${latency}${error}`
}

export function formatAgentStatus(data) {
  if (!data) return 'AGENT unavailable'
  const state = data.running ? 'RUNNING' : data.enabled ? 'STARTING/STOPPED' : 'STOPPED'
  const pid = data.pid != null ? data.pid : '-'
  const restarts = data.restart_count != null ? data.restart_count : 0
  const model = data.model || '-'
  const lastError = data.last_error ? ` err=${data.last_error}` : ''
  const logPath = data.log_path ? ` log=${data.log_path}` : ''
  return `AGENT ${state} | pid=${pid} | restarts=${restarts} | model=${model}${lastError}${logPath}`
}
