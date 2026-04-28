import { useCallback, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { API_BASE } from '../lib/constants'

export function useTerminalSession({ workspaceOpen, currentToolName, onStatusChange }) {
  const terminalContainerRef = useRef(null)
  const termRef = useRef(null)
  const fitAddonRef = useRef(null)
  const socketRef = useRef(null)
  const terminalPayloadRef = useRef({ command: '/bin/bash', tool_name: 'native-shell' })

  const cleanupTerminal = useCallback((emitTerminate = true) => {
    if (socketRef.current) {
      if (emitTerminate) socketRef.current.emit('terminate_terminal')
      socketRef.current.disconnect()
      socketRef.current = null
    }
    if (termRef.current) {
      termRef.current.dispose()
      termRef.current = null
      fitAddonRef.current = null
    }
  }, [])

  const focusTerminal = useCallback(() => {
    if (termRef.current) termRef.current.focus()
  }, [])

  const typeIntoTerminal = useCallback((value, appendEnter = false) => {
    const socket = socketRef.current
    if (!socket || !value) return
    socket.emit('terminal_input', { input: appendEnter ? `${value}\n` : value })
    focusTerminal()
  }, [focusTerminal])

  const setLaunchPayload = useCallback((payload) => {
    terminalPayloadRef.current = payload
  }, [])

  const terminateTerminal = useCallback(() => {
    cleanupTerminal(true)
  }, [cleanupTerminal])

  useEffect(() => {
    return () => cleanupTerminal(true)
  }, [cleanupTerminal])

  useEffect(() => {
    if (!workspaceOpen || !terminalContainerRef.current) return

    cleanupTerminal(false)

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      theme: { background: '#000', foreground: '#fff' },
      fontSize: 14,
      lineHeight: 1.25,
      scrollback: 5000,
      fontFamily: 'JetBrains Mono, Fira Code, monospace'
    })

    const fit = new FitAddon()
    terminal.loadAddon(fit)
    terminal.open(terminalContainerRef.current)
    fit.fit()
    terminal.focus()

    const socket = io(API_BASE, { transports: ['websocket', 'polling'] })

    socket.on('connect', () => {
      onStatusChange({ text: '● CONNECTED', className: 'text-green-500' })
      socket.emit('start_terminal', terminalPayloadRef.current)
      socket.emit('terminal_resize', { cols: terminal.cols, rows: terminal.rows })
      terminal.focus()
    })

    socket.on('terminal_output', (data) => {
      terminal.write(data?.data || '')
    })

    socket.on('terminal_started', (data) => {
      const suffix = data?.tool ? ` (${data.tool})` : ''
      onStatusChange({ text: `● SESSION ACTIVE${suffix}`, className: 'text-green-500' })
      if (data?.log_path) {
        terminal.write(`\r\n[nexus] logging to ${data.log_path}\r\n`)
      }
    })

    socket.on('terminal_error', (data) => {
      onStatusChange({ text: '● ERROR', className: 'text-red-500' })
      terminal.write(`\r\n[terminal_error] ${data?.message || 'Unknown error'}\r\n`)
    })

    socket.on('terminal_closed', (data) => {
      onStatusChange({ text: `● CLOSED (${data?.reason || 'closed'})`, className: 'text-red-500' })
    })

    socket.on('disconnect', () => {
      onStatusChange({ text: '● DISCONNECTED', className: 'text-red-500' })
    })

    terminal.onData((data) => {
      socket.emit('terminal_input', { input: data })
    })

    terminal.onResize((size) => {
      socket.emit('terminal_resize', { cols: size.cols, rows: size.rows })
    })

    const handleClick = () => terminal.focus()
    terminalContainerRef.current.addEventListener('click', handleClick)

    termRef.current = terminal
    fitAddonRef.current = fit
    socketRef.current = socket

    const timer = window.setTimeout(() => {
      fit.fit()
      terminal.focus()
    }, 100)

    return () => {
      window.clearTimeout(timer)
      if (terminalContainerRef.current) {
        terminalContainerRef.current.removeEventListener('click', handleClick)
      }
      cleanupTerminal(false)
    }
  }, [workspaceOpen, currentToolName, cleanupTerminal, onStatusChange])

  return {
    terminalContainerRef,
    setLaunchPayload,
    typeIntoTerminal,
    focusTerminal,
    cleanupTerminal,
    terminateTerminal
  }
}
