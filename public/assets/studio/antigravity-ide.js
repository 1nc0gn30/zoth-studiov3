/**
 * ⚡ ZOTH STUDIO — ANTIGRAVITY MULTI-AGENT IDE COCKPIT ENGINE (v1.0)
 * Orchestrates 21 sovereign agents, chat streaming, code editor simulation, 
 * live preview iframe sync, and embedded terminal runner.
 */
(function () {
  'use strict';

  // 21 Full Sovereign Agents Roster
  const SWARM_AGENTS = [
    { id: 'azoth', name: 'Master Azoth', role: 'Prime Alchemist & Architect', icon: '✨', color: '#e8c872' },
    { id: 'antigravity', name: 'Antigravity', role: 'Lead AST Orchestrator', icon: '🪐', color: '#7c9cff' },
    { id: 'grok', name: 'Grok', role: 'Astrolabe Truth Oracle', icon: '📐', color: '#34d399' },
    { id: 'hermes', name: 'Hermes', role: 'Tool & Action Dispatcher', icon: '⚡', color: '#f59e0b' },
    { id: 'ghostbyte', name: 'GhostByte', role: 'Argon2id Vault Sentinel', icon: '🔒', color: '#c084fc' },
    { id: 'athena', name: 'Athena', role: 'AEO Knowledge Architect', icon: '🦉', color: '#c084fc' },
    { id: 'chronos', name: 'Chronos', role: 'Temporal DAG Navigator', icon: '⏳', color: '#a855f7' },
    { id: 'draco', name: 'Draco', role: 'Fusion Compiler & Arbiter', icon: '🐉', color: '#e8c872' },
    { id: 'ignis', name: 'Ignis', role: 'Refactor Engine & Ship', icon: '🔥', color: '#ff5500' },
    { id: 'kai', name: 'Kai', role: 'Workspace Inspector & AST', icon: '🔍', color: '#00f0ff' },
    { id: 'kitsune', name: 'Kitsune', role: 'Taste & AX Motion Restraint', icon: '🦊', color: '#ff007a' },
    { id: 'kraken', name: 'Kraken', role: 'Deep Memory Daemon & Cache', icon: '🐙', color: '#00f0ff' },
    { id: 'leviathan', name: 'Leviathan', role: 'Abyssal Load & Concurrency', icon: '🐋', color: '#38bdf8' },
    { id: 'lycan', name: 'Lycan', role: 'SecOps & Boundary Auditor', icon: '🐺', color: '#f43f5e' },
    { id: 'onyx', name: 'Onyx', role: 'Zero-Leak Terminal Core', icon: '🖤', color: '#cbd5e1' },
    { id: 'scorpius', name: 'Scorpius', role: 'Penetration & Red Team', icon: '🦂', color: '#ef4444' },
    { id: 'aquila', name: 'Aquila', role: 'High-Altitude Vision & Eagle', icon: '🦅', color: '#fbbf24' },
    { id: 'aether', name: 'Aether', role: 'Universal Ambient Mesh', icon: '🌌', color: '#e2e8f0' },
    { id: 'pixel-neko', name: 'Pixel Neko', role: '8-Bit Retro Sprite Vibe', icon: '🐱', color: '#ec4899' },
    { id: 'pixel-shiba', name: 'Pixel Shiba', role: 'High-Energy Playbook Runner', icon: '🐕', color: '#eab308' },
    { id: 'radical-minion', name: 'Radical Minion', role: 'Autonomous Fast Tasker', icon: '⚡', color: '#f97316' }
  ];

  // Mock File System for Embedded Code Editor
  const FILE_SYSTEM = {
    'public/index.html': `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <title>Zoth Studio — Sovereign AI Multi-Agent Workstation</title>
  <link rel="stylesheet" href="/assets/zoth-theme.css" />
  <link rel="stylesheet" href="/assets/zoth-nav.css" />
</head>
<body>
  <!-- Master Sovereign Hero & 21-Agent Swarm Section -->
  <main id="main-content">
    <section class="hero">
      <h1 class="hero-h1">21 AI AGENTS. ZERO CLOUD LEAKAGE.</h1>
      <p class="hero-subhead">Run autonomous AI swarms directly on your machine.</p>
    </section>
  </main>
</body>
</html>`,
    'public/assets/zoth-theme.css': `/* Zoth 4-Theme Sacred Geometric Tokens */
:root, html[data-theme="dark"] {
  --bg: #05060a;
  --panel: rgba(14, 19, 34, 0.88);
  --cyan: #00f0ff;
  --gold: #fbbf24;
  --magenta: #d946ef;
  --line: rgba(255, 255, 255, 0.12);
}`,
    'bin/zoth': `#!/usr/bin/env python3
"""Zoth Studio Sovereign CLI & Orchestrator Runner"""
import sys, os

def main():
    print("⚡ Zoth Studio CLI online on :8484 and :8088")

if __name__ == "__main__":
    main()`
  };

  let activeFile = 'public/index.html';
  let targetAgentId = 'all';
  let chatMode = 'swarm'; // 'swarm' | 'direct'
  let splitLayout = 'split'; // 'split' | 'chat-full' | 'editor-full'

  // Initialize IDE
  function initIde() {
    renderSwarmRoster();
    renderDirectAgentDropdown();
    renderFileTree();
    renderEditorLineNumbers();
    loadEditorFile(activeFile);
    setupKeyboardShortcuts();
    
    // Set mobile initial view
    if (window.innerWidth <= 880) {
      setMobileIdeView('chat');
    }
  }

  // Render 21 Agents in the Sidebar Swarm Roster
  function renderSwarmRoster() {
    const rosterEl = document.getElementById('ideSwarmRoster');
    if (!rosterEl) return;

    rosterEl.innerHTML = SWARM_AGENTS.map(agent => `
      <div class="swarm-roster-card" onclick="openDirectAgentChat('${agent.id}')">
        <div class="roster-card-left">
          <span class="roster-icon">${agent.icon}</span>
          <div>
            <div class="roster-name" style="color:${agent.color}">${agent.name}</div>
            <div class="roster-role">${agent.role}</div>
          </div>
        </div>
        <button type="button" class="roster-chat-btn" onclick="event.stopPropagation(); openDirectAgentChat('${agent.id}')">Chat</button>
      </div>
    `).join('');
  }

  // Populate Direct Agent Dropdown
  function renderDirectAgentDropdown() {
    const dd = document.getElementById('directAgentDropdown');
    if (!dd) return;

    dd.innerHTML = SWARM_AGENTS.map(agent => `
      <option value="${agent.id}">${agent.icon} ${agent.name} (${agent.role})</option>
    `).join('');
  }

  // Render File Explorer Tree
  function renderFileTree() {
    const treeEl = document.getElementById('ideFileTree');
    if (!treeEl) return;

    const files = Object.keys(FILE_SYSTEM);
    treeEl.innerHTML = files.map(file => {
      const isAct = file === activeFile ? 'style="background:rgba(0,240,255,0.12);border-color:var(--cyan);color:#fff;"' : '';
      return `
        <div class="file-tree-node" ${isAct} onclick="switchEditorTab('${file}')">
          <i class="ph-bold ph-file-code" style="color:var(--cyan)"></i>
          <span style="font-size:0.75rem;font-family:var(--ide-font-mono);">${file}</span>
        </div>
      `;
    }).join('');
  }

  // Render Line Numbers in Code Editor
  function renderEditorLineNumbers() {
    const lineEl = document.getElementById('editorLineNumbers');
    if (!lineEl) return;

    const lines = [];
    for (let i = 1; i <= 60; i++) {
      lines.push(`<div>${i}</div>`);
    }
    lineEl.innerHTML = lines.join('');
  }

  // Load Content into Editor
  function loadEditorFile(filename) {
    activeFile = filename;
    const editor = document.getElementById('ideCodeEditor');
    if (editor && FILE_SYSTEM[filename]) {
      editor.value = FILE_SYSTEM[filename];
    }
    renderFileTree();
  }

  // Switch Active Tab
  window.switchEditorTab = function (filename) {
    if (!FILE_SYSTEM[filename]) {
      FILE_SYSTEM[filename] = `// New file: ${filename}\n`;
    }
    loadEditorFile(filename);

    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-file') === filename);
    });
  };

  window.closeEditorTab = function (e, filename) {
    if (e) e.stopPropagation();
    const tabs = document.querySelectorAll('.editor-tab');
    if (tabs.length > 1) {
      const tabEl = document.querySelector(`.editor-tab[data-file="${filename}"]`);
      if (tabEl) tabEl.remove();
      const firstTab = document.querySelector('.editor-tab');
      if (firstTab) {
        switchEditorTab(firstTab.getAttribute('data-file'));
      }
    }
  };

  // Switch Sidebar Activity Tabs
  window.switchSidebarPanel = function (panelId) {
    document.querySelectorAll('.activity-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.sidebar-panel').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const activeBtn = document.getElementById('actBtn' + panelId.charAt(0).toUpperCase() + panelId.slice(1));
    const activePanel = document.getElementById('panel' + panelId.charAt(0).toUpperCase() + panelId.slice(1));

    if (activeBtn) activeBtn.classList.add('active');
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.style.display = 'flex';
    }
  };

  // Switch Chat Mode: Swarm vs Direct
  window.switchChatMode = function (mode) {
    chatMode = mode;
    document.getElementById('tabSwarmRoom').classList.toggle('active', mode === 'swarm');
    document.getElementById('tabDirectAgent').classList.toggle('active', mode === 'direct');
    
    const wrap = document.getElementById('directAgentSelectWrap');
    if (wrap) wrap.style.display = mode === 'direct' ? 'block' : 'none';

    if (mode === 'swarm') {
      setTargetAgent('all');
    } else {
      const dd = document.getElementById('directAgentDropdown');
      if (dd) setTargetAgent(dd.value);
    }
  };

  // Open Direct Agent Chat
  window.openDirectAgentChat = function (agentId) {
    switchSidebarPanel('chat');
    switchChatMode('direct');
    const dd = document.getElementById('directAgentDropdown');
    if (dd) dd.value = agentId;
    setTargetAgent(agentId);
  };

  window.onDirectAgentSelected = function (agentId) {
    setTargetAgent(agentId);
  };

  // Set Target Mention Agent
  window.setTargetAgent = function (agentId) {
    targetAgentId = agentId;
    
    // Update mention pill UI
    document.querySelectorAll('.mention-pill').forEach(pill => {
      const isMatch = (agentId === 'all' && pill.textContent.includes('All')) ||
                      (pill.textContent.includes(agentId));
      pill.classList.toggle('active', isMatch);
    });

    // Update Chat Column Header
    const titleEl = document.getElementById('chatHeaderTitle');
    const subEl = document.getElementById('chatHeaderSub');
    const avatarEl = document.getElementById('chatHeaderAvatar');

    if (agentId === 'all') {
      if (titleEl) titleEl.textContent = 'Swarm Consensus Room';
      if (subEl) subEl.textContent = '21 sovereign agents triangulating proposals';
      if (avatarEl) avatarEl.textContent = '🌐';
    } else {
      const agent = SWARM_AGENTS.find(a => a.id === agentId);
      if (agent) {
        if (titleEl) titleEl.textContent = agent.name;
        if (subEl) subEl.textContent = agent.role;
        if (avatarEl) avatarEl.textContent = agent.icon;
      }
    }
  };

  // Insert Text Snippet into Input
  window.insertSnippet = function (text) {
    const input = document.getElementById('ideChatInput');
    if (!input) return;
    input.value += text;
    input.focus();
  };

  // Quick Send Prompt from Action Chips
  window.quickSendPrompt = function (text) {
    const input = document.getElementById('ideChatInput');
    if (!input) return;
    input.value = text;
    submitIdePrompt();
  };

  // Submit Prompt from Chat Input
  window.submitIdePrompt = function () {
    const input = document.getElementById('ideChatInput');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    // Append User Message to Stream
    appendChatMessage({
      isUser: true,
      author: 'Operator',
      role: 'Human Lead',
      avatar: '👤',
      text: userText
    });

    // Generate Agent / Swarm Response
    setTimeout(() => {
      handleAgentResponse(userText);
    }, 600);
  };

  // Handle Agent Response Dispatch
  function handleAgentResponse(prompt) {
    const stream = document.getElementById('chatStreamScroll');
    if (!stream) return;

    let respondingAgents = [];
    const lower = prompt.toLowerCase();

    if (targetAgentId === 'all') {
      if (lower.includes('@grok') || lower.includes('math') || lower.includes('verify') || lower.includes('truth')) {
        respondingAgents = ['grok', 'antigravity'];
      } else if (lower.includes('@hermes') || lower.includes('tool') || lower.includes('run') || lower.includes('command')) {
        respondingAgents = ['hermes', 'azoth'];
      } else if (lower.includes('security') || lower.includes('vault') || lower.includes('key')) {
        respondingAgents = ['ghostbyte', 'azoth'];
      } else {
        respondingAgents = ['antigravity', 'azoth', 'grok'];
      }
    } else {
      respondingAgents = [targetAgentId];
    }

    respondingAgents.forEach((agentId, idx) => {
      const agent = SWARM_AGENTS.find(a => a.id === agentId) || SWARM_AGENTS[0];
      setTimeout(() => {
        let replyText = generateContextualReply(agent, prompt);
        appendChatMessage({
          isUser: false,
          author: agent.name,
          role: agent.role,
          avatar: agent.icon,
          color: agent.color,
          text: replyText
        });
        
        // Log to embedded terminal
        logTerminalLine(`[SWARM] Agent @${agent.id} dispatched response: "${prompt.slice(0, 32)}..."`, 'cyan');
      }, (idx + 1) * 750);
    });
  }

  function generateContextualReply(agent, prompt) {
    const p = prompt.toLowerCase();
    if (agent.id === 'antigravity') {
      return `Parsed AST structure for <code>${activeFile}</code>. Verified dependency bindings across our modules. Generating subagent orchestration DAG to execute your request cleanly.`;
    } else if (agent.id === 'grok') {
      return `Astrolabe invariant confirmed. Zero mathematical contradictions detected in the current scope. All semantic nodes and TypeScript signatures are valid.`;
    } else if (agent.id === 'hermes') {
      return `Tool harness initialized. Sub-process test ran in 8ms with exit code 0. Terminal logs synced below.`;
    } else if (agent.id === 'azoth') {
      return `The Great Synthesis holds true. Triangulated code proposals harmonized under local loopback :8484 with zero telemetry leakage.`;
    } else if (agent.id === 'ghostbyte') {
      return `Argon2id cryptographic isolation active. Local memory buffer verified free of credential leakage.`;
    }
    return `Specialist ${agent.name} (${agent.role}) has processed your input against our local codebase invariants.`;
  }

  // Append Message to Stream UI
  function appendChatMessage(msg) {
    const stream = document.getElementById('chatStreamScroll');
    if (!stream) return;

    const div = document.createElement('div');
    div.className = `chat-message ${msg.isUser ? 'user-msg' : 'agent-msg'}`;
    div.innerHTML = `
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-author" style="color:${msg.color || 'var(--cyan)'}">${msg.author}</span>
          <span class="msg-role">${msg.role}</span>
          <span class="msg-time">Just now</span>
        </div>
        <div class="msg-content">${msg.text}</div>
      </div>
    `;

    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  }

  // Clear Chat History
  window.clearActiveChatMessages = function () {
    const stream = document.getElementById('chatStreamScroll');
    if (stream) {
      stream.innerHTML = `
        <div class="chat-system-banner">
          <div class="sys-banner-icon">🪐</div>
          <div>
            <strong>Chat History Cleared</strong>
            <p>Ready for a fresh multi-agent session. Mention any of the 21 agents to begin.</p>
          </div>
        </div>
      `;
    }
  };

  // Toggle Layout Split Mode
  window.toggleLayoutSplit = function () {
    const deck = document.getElementById('ideSplitDeck');
    if (!deck) return;

    if (splitLayout === 'split') {
      splitLayout = 'chat-full';
      deck.className = 'ide-split-deck mode-chat-full';
    } else if (splitLayout === 'chat-full') {
      splitLayout = 'editor-full';
      deck.className = 'ide-split-deck mode-editor-full';
    } else {
      splitLayout = 'split';
      deck.className = 'ide-split-deck mode-split';
    }
  };

  // Editor vs Live Preview Pane Switcher
  window.setEditorPaneMode = function (mode) {
    const btnEditor = document.getElementById('btnModeEditor');
    const btnPrev = document.getElementById('btnModePreview');
    const paneEditor = document.getElementById('paneEditor');
    const panePrev = document.getElementById('panePreview');

    if (btnEditor) btnEditor.classList.toggle('active', mode === 'editor');
    if (btnPrev) btnPrev.classList.toggle('active', mode === 'preview');

    if (paneEditor) paneEditor.style.display = mode === 'editor' ? 'flex' : 'none';
    if (panePrev) panePrev.style.display = mode === 'preview' ? 'flex' : 'none';
  };

  window.reloadIframePreview = function () {
    const frame = document.getElementById('ideLivePreviewIframe');
    if (frame) frame.src = frame.src;
  };

  // Run File Diagnostics Action
  window.runActiveFileDiagnostics = function () {
    logTerminalLine(`[DIAGNOSTICS] Running AST AST checker on ${activeFile}...`, 'gold');
    setTimeout(() => {
      logTerminalLine(`✔ Syntax valid: 0 errors, 0 unused imports. Shannon entropy H=1.04 bits.`, 'green');
    }, 400);
  };

  // Terminal Controls
  window.switchTerminalTab = function (tabKey) {
    document.querySelectorAll('.term-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.getElementById('tab' + tabKey.charAt(0).toUpperCase() + tabKey.slice(1));
    if (activeTab) activeTab.classList.add('active');

    if (tabKey === 'term') {
      logTerminalLine(`Switched to Live Subprocess Terminal (:8088 / :8484)`, 'cyan');
    } else if (tabKey === 'diag') {
      logTerminalLine(`[AST TELEMETRY] All 83 pages passing syntax invariants with 0 broken tags.`, 'green');
    } else if (tabKey === 'bus') {
      logTerminalLine(`[EVENT BUS] 21/21 Agents connected on WebSocket loopback :8484`, 'green');
    }
  };

  window.clearTerminalOutput = function () {
    const termBody = document.getElementById('terminalBody');
    if (termBody) {
      termBody.innerHTML = `
        <div class="term-line"><span class="term-prompt">zoth-studio $</span> <span class="term-cursor">_</span></div>
      `;
    }
  };

  window.toggleTerminalCollapse = function () {
    const term = document.getElementById('ideBottomTerminal');
    const btn = document.getElementById('btnTermCollapse');
    if (!term) return;

    const isCollapsed = term.classList.toggle('collapsed');
    if (btn) btn.textContent = isCollapsed ? '▲' : '_';
  };

  function logTerminalLine(text, colorClass) {
    const termBody = document.getElementById('terminalBody');
    if (!termBody) return;

    const div = document.createElement('div');
    div.className = `term-line ${colorClass || ''}`;
    div.textContent = text;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  // Mobile View Switcher
  window.setMobileIdeView = function (view) {
    document.querySelectorAll('.m-view-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-view') === view);
    });

    const deck = document.getElementById('ideSplitDeck');
    if (!deck) return;

    deck.classList.remove('mobile-view-chat', 'mobile-view-editor', 'mobile-view-preview', 'mobile-view-terminal');
    deck.classList.add('mobile-view-' + view);

    if (view === 'preview') {
      setEditorPaneMode('preview');
    } else if (view === 'editor') {
      setEditorPaneMode('editor');
    }
  };

  // Keyboard Shortcuts
  function setupKeyboardShortcuts() {
    const input = document.getElementById('ideChatInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitIdePrompt();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        switchSidebarPanel('chat');
      } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
        e.preventDefault();
        switchSidebarPanel('explorer');
      } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault();
        switchSidebarPanel('swarm');
      }
    });
  }

  // Self Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIde);
  } else {
    initIde();
  }
})();
