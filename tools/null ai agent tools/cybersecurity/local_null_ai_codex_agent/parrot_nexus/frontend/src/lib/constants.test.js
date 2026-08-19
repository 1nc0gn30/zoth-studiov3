import { describe, expect, test } from 'vitest'
import { formatAgentStatus, formatHeartbeatStatus } from './constants'

describe('status formatters', () => {
  test('formats heartbeat line with error', () => {
    const line = formatHeartbeatStatus({
      last_ok: false,
      running: true,
      model: 'gemma4:31b-cloud',
      last_latency_ms: 42,
      last_error: 'timeout'
    })

    expect(line).toContain('HB FAIL')
    expect(line).toContain('running')
    expect(line).toContain('gemma4:31b-cloud')
    expect(line).toContain('42ms')
    expect(line).toContain('timeout')
  })

  test('formats agent line with pid and log', () => {
    const line = formatAgentStatus({
      running: true,
      enabled: true,
      pid: 1234,
      restart_count: 2,
      model: 'gemma4:31b-cloud',
      log_path: '/tmp/agent.log'
    })

    expect(line).toContain('AGENT RUNNING')
    expect(line).toContain('pid=1234')
    expect(line).toContain('restarts=2')
    expect(line).toContain('log=/tmp/agent.log')
  })
})
