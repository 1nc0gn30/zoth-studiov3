/**
 * Zoth Studio — Cyberpunk & Retro Terminal Mode Engine (v2.0)
 * Provides interactive drop-down hacker terminal overlay with ANSI colors and executable commands.
 */
(function (global) {
  'use strict';
  const ZothTerminalMode = {
    VERSION: '2.0.0',
    commands: {
      help: () => 'Available commands: help, matrix, ping, deploy, status, sfx, clear',
      ping: () => 'PONG: 0.12ms to 127.0.0.1 (Local Loopback Node)',
      status: () => 'System Status: ALL 20 ENGINES OPERATIONAL (100% Zero-Drift)',
      matrix: () => 'Matrix Canvas Stream: 60 FPS GPU-Accelerated Rain Active',
      deploy: () => 'Deploying with Netlify AX v3.0... Health Score 95/100 verified!'
    },
    execute(cmdStr) {
      const clean = (cmdStr || '').trim().toLowerCase();
      if (this.commands[clean]) return this.commands[clean]();
      return `Command not recognized: '${clean}'. Type 'help' for command list.`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ZothTerminalMode; }
  else { global.ZothTerminalMode = ZothTerminalMode; }
})(typeof window !== 'undefined' ? window : globalThis);
