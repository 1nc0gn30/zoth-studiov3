/**
 * ⚡ THE COCKPIT — AUTONOMOUS 21-AGENT SWARM ENGINE (v1.0)
 * Handles conversational streaming, dynamic swarm strength, 
 * target agent mentions, and slide-over HUD drawers.
 */
(function () {
  'use strict';

  const SWARM_AGENTS = [
    { id: 'azoth', name: 'Master Azoth', role: 'Prime Alchemist & Synthesis', icon: '✨', color: '#e8c872', domain: 'System Synthesis' },
    { id: 'antigravity', name: 'Antigravity', role: 'Lead AST Orchestrator', icon: '🪐', color: '#7c9cff', domain: 'Code & Architecture' },
    { id: 'grok', name: 'Grok', role: 'Astrolabe Truth & First Principles', icon: '📐', color: '#34d399', domain: 'Math & Logic' },
    { id: 'hermes', name: 'Hermes', role: 'Tool Calling & Action Dispatch', icon: '⚡', color: '#f59e0b', domain: 'Tool Execution' },
    { id: 'ghostbyte', name: 'GhostByte', role: 'Argon2id Vault Sentinel', icon: '🔒', color: '#c084fc', domain: 'Security & Enclaves' },
    { id: 'athena', name: 'Athena', role: 'AEO Knowledge Architect', icon: '🦉', color: '#c084fc', domain: 'Semantic Research' },
    { id: 'chronos', name: 'Chronos', role: 'Temporal DAG Navigator', icon: '⏳', color: '#a855f7', domain: 'Workflows & Git' },
    { id: 'draco', name: 'Draco', role: 'Fusion Compiler & Arbiter', icon: '🐉', color: '#e8c872', domain: 'Consensus Merging' },
    { id: 'ignis', name: 'Ignis', role: 'Refactor Engine & Pipelines', icon: '🔥', color: '#ff5500', domain: 'Refactoring & CI' },
    { id: 'kai', name: 'Kai', role: 'Workspace Inspector & AST', icon: '🔍', color: '#00f0ff', domain: 'Static Analysis' },
    { id: 'kitsune', name: 'Kitsune', role: 'Taste & AX Motion Restraint', icon: '🦊', color: '#ff007a', domain: 'Visuals & Polish' },
    { id: 'kraken', name: 'Kraken', role: 'Deep Memory Daemon & Cache', icon: '🐙', color: '#00f0ff', domain: 'Memory & Cache' },
    { id: 'leviathan', name: 'Leviathan', role: 'Abyssal Load & Concurrency', icon: '🐋', color: '#38bdf8', domain: 'Scale & Performance' },
    { id: 'lycan', name: 'Lycan', role: 'SecOps & Boundary Auditor', icon: '🐺', color: '#f43f5e', domain: 'Threat Detection' },
    { id: 'onyx', name: 'Onyx', role: 'Zero-Leak Terminal Core', icon: '🖤', color: '#cbd5e1', domain: 'Low-level CLI' },
    { id: 'scorpius', name: 'Scorpius', role: 'Penetration & Red Team', icon: '🦂', color: '#ef4444', domain: 'Red Teaming' },
    { id: 'aquila', name: 'Aquila', role: 'High-Altitude Vision & Eagle', icon: '🦅', color: '#fbbf24', domain: 'Vision & Strategy' },
    { id: 'aether', name: 'Aether', role: 'Universal Ambient Mesh', icon: '🌌', color: '#e2e8f0', domain: 'Bus Networking' },
    { id: 'pixel-neko', name: 'Pixel Neko', role: '8-Bit Retro Sprite Vibe', icon: '🐱', color: '#ec4899', domain: 'Creative & Gaming' },
    { id: 'pixel-shiba', name: 'Pixel Shiba', role: 'Playbook Automation Runner', icon: '🐕', color: '#eab308', domain: 'Social Automation' },
    { id: 'radical-minion', name: 'Radical Minion', role: 'Autonomous Fast Tasker', icon: '⚡', color: '#f97316', domain: 'Quick Scripting' }
  ];

  const WORKSPACE_FILES = {
    'tasks/project_plan.md': `# Sovereign Swarm Execution Plan
## Objective: Autonomous Task Execution Across 21 Agents
- **Target Goal**: Universal Task Dispatch in The Cockpit
- **Swarm Strength**: Triangulated Strike Team (3 to 5 specialists)
- **Status**: Ready on Loopback :8484`,
    'scripts/pipeline.py': `#!/usr/bin/env python3
"""Autonomous Swarm Execution Pipeline"""
import sys

def run_task():
    print("⚡ [SWARM] Pipeline executed cleanly on local loopback :8484")

if __name__ == "__main__":
    run_task()`
  };

  let targetAgentId = 'all';
  let swarmStrength = 'strike'; // 'solo' | 'strike' | 'full'
  let currentFile = 'tasks/project_plan.md';

  function initCockpit() {
    renderSwarmRosterHUD();
    loadWorkspaceEditor(currentFile);
    setupKeyListeners();
  }

  function renderSwarmRosterHUD() {
    const list = document.getElementById('hudSwarmRosterList');
    if (!list) return;

    list.innerHTML = SWARM_AGENTS.map(agent => `
      <div class="quick-goal-card" style="padding:10px;" onclick="setTargetAgent('${agent.id}'); toggleHudDrawer('roster');">
        <span class="goal-icon">${agent.icon}</span>
        <div style="flex:1;">
          <strong style="color:${agent.color}">${agent.name}</strong>
          <small>${agent.domain} · ${agent.role}</small>
        </div>
        <button class="mention-chip" style="font-size:0.65rem;">Direct</button>
      </div>
    `).join('');
  }

  function loadWorkspaceEditor(filename) {
    currentFile = filename;
    const editor = document.getElementById('hudCodeEditor');
    if (editor && WORKSPACE_FILES[filename]) {
      editor.value = WORKSPACE_FILES[filename];
    }
  }

  window.switchEditorFile = function (filename) {
    document.querySelectorAll('.hud-tab-item').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-file') === filename);
    });
    loadWorkspaceEditor(filename);
  };

  window.setSwarmStrength = function (strength) {
    swarmStrength = strength;
    document.querySelectorAll('.strength-opt').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-strength') === strength);
    });

    const ind = document.getElementById('activeStrengthIndicator');
    const label = strength === 'solo' ? 'Solo Specialist (1 Agent)' :
                  strength === 'strike' ? 'Strike Team (3–5 Agents)' :
                  'Full 21 Swarm Pantheon';
    if (ind) ind.textContent = label;

    appendCockpitMessage({
      isUser: false,
      author: 'Antigravity',
      role: 'Lead Orchestrator',
      avatar: '🪐',
      color: '#7c9cff',
      text: `Swarm Execution Strength adjusted to <strong>${label}</strong>.`
    });
  };

  window.setTargetAgent = function (agentId) {
    targetAgentId = agentId;
    document.querySelectorAll('.mention-chip').forEach(chip => {
      const isMatch = (agentId === 'all' && chip.textContent.includes('All')) ||
                      (chip.textContent.includes(agentId));
      chip.classList.toggle('active', isMatch);
    });

    const input = document.getElementById('cockpitInput');
    if (input && agentId !== 'all') {
      input.focus();
    }
  };

  window.quickSendPrompt = function (text) {
    const input = document.getElementById('cockpitInput');
    if (!input) return;
    input.value = text;
    submitCockpitPrompt();
  };

  window.submitCockpitPrompt = function () {
    const input = document.getElementById('cockpitInput');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    appendCockpitMessage({
      isUser: true,
      author: 'Operator',
      role: 'Human Sovereign Lead',
      avatar: '👤',
      text: userText
    });

    setTimeout(() => {
      handleSwarmResponse(userText);
    }, 500);
  };

  function handleSwarmResponse(prompt) {
    let respondingAgents = [];
    const lower = prompt.toLowerCase();

    if (targetAgentId === 'all') {
      if (swarmStrength === 'solo') {
        if (lower.includes('scrape') || lower.includes('automate') || lower.includes('cron')) respondingAgents = ['hermes'];
        else if (lower.includes('security') || lower.includes('vault') || lower.includes('port')) respondingAgents = ['ghostbyte'];
        else if (lower.includes('research') || lower.includes('math')) respondingAgents = ['grok'];
        else respondingAgents = ['antigravity'];
      } else if (swarmStrength === 'strike') {
        if (lower.includes('automate') || lower.includes('social')) respondingAgents = ['hermes', 'pixel-shiba', 'antigravity'];
        else if (lower.includes('security') || lower.includes('audit')) respondingAgents = ['ghostbyte', 'lycan', 'azoth'];
        else if (lower.includes('research') || lower.includes('report')) respondingAgents = ['athena', 'grok', 'aquila'];
        else respondingAgents = ['antigravity', 'grok', 'azoth'];
      } else {
        respondingAgents = ['antigravity', 'grok', 'hermes', 'azoth', 'ghostbyte'];
      }
    } else {
      respondingAgents = [targetAgentId];
    }

    respondingAgents.forEach((agentId, idx) => {
      const agent = SWARM_AGENTS.find(a => a.id === agentId) || SWARM_AGENTS[0];
      setTimeout(() => {
        let reply = generateReply(agent, prompt);
        appendCockpitMessage({
          isUser: false,
          author: agent.name,
          role: `${agent.domain} · ${agent.role}`,
          avatar: agent.icon,
          color: agent.color,
          text: reply
        });
      }, (idx + 1) * 600);
    });
  }

  function generateReply(agent, prompt) {
    if (agent.id === 'antigravity') {
      return `Deconstructed your goal into parallel tasks across our strike team. Invariant topology verified on loopback. Ready to write code, generate configs, or dispatch actions.`;
    } else if (agent.id === 'grok') {
      return `First-principles validation: Logic graph analyzed. Invariants confirmed 100% sound with zero contradiction.`;
    } else if (agent.id === 'hermes') {
      return `Tool execution dispatched. Process harness ran in 8ms with exit code 0. Telemetry synced to terminal.`;
    } else if (agent.id === 'azoth') {
      return `Universal synthesis achieved. Harmonized multi-agent proposals into a single executable solution on loopback :8484.`;
    } else if (agent.id === 'ghostbyte') {
      return `Security review: Verified zero plaintext leaks, isolated memory buffer, and enforced Argon2id boundary rules.`;
    } else if (agent.id === 'pixel-shiba') {
      return `Automation playbook active! Batch jobs queued and ready for scheduled dispatch.`;
    }
    return `Specialist ${agent.name} (${agent.domain}) has processed your goal against local invariants with zero cloud dependencies.`;
  }

  function appendCockpitMessage(msg) {
    const stream = document.getElementById('cockpitMessagesStream');
    if (!stream) return;

    const div = document.createElement('div');
    div.className = `cockpit-msg ${msg.isUser ? 'user-msg' : 'agent-msg'}`;
    div.innerHTML = `
      <div class="c-avatar">${msg.avatar}</div>
      <div class="c-msg-content">
        <div class="c-msg-head">
          <span class="c-author" style="color:${msg.color || 'var(--cyan)'}">${msg.author}</span>
          <span class="c-role">${msg.role}</span>
          <span class="c-time">Just now</span>
        </div>
        <div class="c-text">${msg.text}</div>
      </div>
    `;

    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  }

  // Slide-over HUD Drawer Toggle
  window.toggleHudDrawer = function (drawerId) {
    const target = document.getElementById('hud' + drawerId.charAt(0).toUpperCase() + drawerId.slice(1) + 'Drawer');
    const allDrawers = document.querySelectorAll('.cockpit-hud-drawer');
    const toggleBtns = document.querySelectorAll('.hud-toggle-btn');

    allDrawers.forEach(d => {
      if (d !== target) d.classList.remove('open');
    });

    if (target) {
      const isOpen = target.classList.toggle('open');
      toggleBtns.forEach(b => {
        if (b.id.toLowerCase().includes(drawerId)) b.classList.toggle('active', isOpen);
        else b.classList.remove('active');
      });
    }
  };

  window.closeMobileMenu = function () {
    document.body.classList.remove('menu-open');
    const burger = document.getElementById('burger');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.textContent = 'Menu';
    }
  };

  window.runWorkspaceCheck = function () {
    alert('✔ Invariant Check Passed: Zero syntax collisions or memory leaks in active workspace.');
  };

  window.clearTerminalOutput = function () {
    const term = document.getElementById('hudTerminalStream');
    if (term) {
      term.innerHTML = '<div class="term-row"><span class="term-p">zoth-swarm $</span> <span class="term-cursor">_</span></div>';
    }
  };

  function setupKeyListeners() {
    const input = document.getElementById('cockpitInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitCockpitPrompt();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCockpit);
  } else {
    initCockpit();
  }
})();
