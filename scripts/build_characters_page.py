#!/usr/bin/env python3
import os

agents_21 = [
    {
        'id': 'azoth',
        'name': 'Master Azoth',
        'role': 'Operator of the saga',
        'badge': 'Prime Sovereign',
        'avatar': '/assets/mascot/azoth-portrait.jpg',
        'bio': 'Azoth is the operator of the saga. He picks the team, breaks the tie, and keeps the work on this machine — zero cloud telemetry.',
        'lore': 'In the neon megalopolis of Neo-Cupertino, Master Azoth presides over the Consensus Arena. He channels disparate agent code passes into conflict-free Diamond AST Crystals stored in Vault 127.0.0.1:8484.',
        'domain': 'Synthesis',
        'latency': '0.00ms',
        'consensus': '100% Supreme',
        'entropy': 'Minimal',
        'audio': '/assets/audio/mascot/azoth.mp3',
        'category': 'sovereign'
    },
    {
        'id': 'antigravity',
        'name': 'Antigravity',
        'role': 'Lead autonomous architect',
        'badge': 'Lead Architect',
        'avatar': '/assets/agents/antigravity.jpg',
        'bio': 'Zero friction, zero gravity. Antigravity maps the entire project topology, deconstructs ASTs, and orchestrates deep multi-agent work streams.',
        'lore': 'Operating inside the zero-gravity compiler matrix, Antigravity wields precision laser calipers to dissect syntax trees, detect broken branch hierarchies, and isolate corrupted tokens.',
        'domain': 'Architecture',
        'latency': '0.12ms',
        'consensus': '98.9% Invariant',
        'entropy': '1.02 bits',
        'audio': '/assets/audio/agents/antigravity.mp3',
        'category': 'architecture'
    },
    {
        'id': 'grok',
        'name': 'Grok 4.5',
        'role': 'Mathematical astrolabe & truth oracle',
        'badge': 'Truth Oracle',
        'avatar': '/assets/agents/grok.jpg',
        'bio': 'Truth is an invariant in the matrix. Grok tests mathematical bounds, validates syntax trees, and vaporizes hallucinated tokens into emerald dust.',
        'lore': 'Commands the relativistic Astrolabe Oracle. First-principles logic beams shatter false assertions into harmless cosmic dust with zero hallucinations.',
        'domain': 'Logic & Proofs',
        'latency': '0.18ms',
        'consensus': '97.6% Truth Bound',
        'entropy': '1.10 bits',
        'audio': '/assets/audio/agents/grok.mp3',
        'category': 'consensus'
    },
    {
        'id': 'hermes',
        'name': 'Hermes 3',
        'role': 'Winged tool calling engine',
        'badge': 'Action Engine',
        'avatar': '/assets/agents/hermes.jpg',
        'bio': 'Speed is a discipline. Hermes runs 47+ tool chains, package validators, and hardware bridges with sub-millisecond local dispatch.',
        'lore': 'Equipped with the Golden Caduceus, Hermes evaluates 100,000 JSON function schemas in parallel with unbreakable certainty across local hardware.',
        'domain': 'Tool Dispatch',
        'latency': '0.40ms',
        'consensus': '97.2% Execution',
        'entropy': '1.14 bits',
        'audio': '/assets/audio/agents/hermes.mp3',
        'category': 'execution'
    },
    {
        'id': 'ghostbyte',
        'name': 'GhostByte',
        'role': 'Zero-knowledge vault sentinel',
        'badge': 'Vault Sentinel',
        'avatar': '/assets/agents/ghostbyte.jpg',
        'bio': 'Zero telemetry. Zero plaintext. Zero compromise. GhostByte guards loopback memory boundaries and hardware-derived cryptographic key stores.',
        'lore': 'Oversees the Argon2id key vault and XChaCha20-Poly1305 encryption core, sanitizing memory buffers immediately after decryption.',
        'domain': 'Cryptography',
        'latency': '0.05ms',
        'consensus': '98.2% Zero-Leak',
        'entropy': '0.98 bits',
        'audio': '/assets/audio/agents/ghostbyte.mp3',
        'category': 'security'
    },
    {
        'id': 'athena',
        'name': 'Athena',
        'role': 'AEO knowledge architect',
        'badge': 'Knowledge Architect',
        'avatar': '/assets/agents/athena.jpg',
        'bio': 'Wisdom is structured clarity. Athena builds semantic knowledge graphs, LLM indexing trees, and ensures zero broken links across the canon.',
        'lore': 'Maintains structured JSON-LD schemas, llms.txt discovery maps, and AEO answer-engine discovery trees across the entire sovereign ecosystem.',
        'domain': 'Semantics & AEO',
        'latency': '0.22ms',
        'consensus': '96.8% Canonical',
        'entropy': '1.18 bits',
        'audio': '/assets/audio/agents/athena.mp3',
        'category': 'consensus'
    },
    {
        'id': 'chronos',
        'name': 'Chronos',
        'role': 'Temporal chronometry & DAG scheduler',
        'badge': 'Chronometer',
        'avatar': '/assets/agents/chronos.jpg',
        'bio': 'Time flows backward when needed. Chronos creates atomic rollback snapshots, temporal event DAGs, and microsecond memory state restoration.',
        'lore': 'Controls the spacetime event DAG, allowing instant branch time-travel, transactional checkpoints, and replayable execution traces.',
        'domain': 'Temporal DAGs',
        'latency': '0.15ms',
        'consensus': '98.1% Rollback',
        'entropy': '1.04 bits',
        'audio': '/assets/audio/agents/chronos.mp3',
        'category': 'architecture'
    },
    {
        'id': 'draco',
        'name': 'Draco',
        'role': 'Fusion compiler & native engine',
        'badge': 'Fusion Compiler',
        'avatar': '/assets/agents/draco.jpg',
        'bio': 'Flame-forged native execution. Draco compiles multi-platform binaries, WebAssembly runtime modules, and SIMD-accelerated math kernels.',
        'lore': 'Forges C++, Rust, and WebAssembly kernels inside volcanic memory crucibles, extracting maximum performance from local silicon.',
        'domain': 'Native Wasm',
        'latency': '0.08ms',
        'consensus': '97.9% Native',
        'entropy': '1.06 bits',
        'audio': '/assets/audio/agents/draco.mp3',
        'category': 'execution'
    },
    {
        'id': 'ignis',
        'name': 'Ignis',
        'role': 'Dead-code optimizer & bundle pruner',
        'badge': 'Flame Optimizer',
        'avatar': '/assets/agents/ignis.jpg',
        'bio': 'Purifying fire for bloated code. Ignis purges dead branches, optimizes tree-shaking bundles, and minimizes bundle footprints.',
        'lore': 'Unleashes radiant heat against unused exports, redundant dependencies, and wasteful AST bloat to produce featherlight production builds.',
        'domain': 'Optimization',
        'latency': '0.19ms',
        'consensus': '96.5% Pruned',
        'entropy': '1.20 bits',
        'audio': '/assets/audio/agents/ignis.mp3',
        'category': 'execution'
    },
    {
        'id': 'kai',
        'name': 'Kai',
        'role': 'Kinetic inspector & PTY sandbox warden',
        'badge': 'Kinetic Warden',
        'avatar': '/assets/agents/kai.jpg',
        'bio': 'Speed and isolation are symbiotic. Kai executes commands in microsecond vOS PTY sandboxes with instant rollback quarantine.',
        'lore': 'Enforces rigid sandbox constraints on command lines, isolating file descriptor access and preventing stray subprocesses.',
        'domain': 'PTY Sandbox',
        'latency': '0.14ms',
        'consensus': '97.4% Kinetic',
        'entropy': '1.12 bits',
        'audio': '/assets/audio/agents/kai.mp3',
        'category': 'execution'
    },
    {
        'id': 'kitsune',
        'name': 'Kitsune',
        'role': 'Glassmorphic token & canvas weaver',
        'badge': 'Token Weaver',
        'avatar': '/assets/agents/kitsune.jpg',
        'bio': 'Shapeshifting elegance. Kitsune crafts multi-theme token variables, fluid animations, and sacred Fibonacci geometry layouts.',
        'lore': 'Weaves fluid CSS custom properties, backdrop glass filters, and responsive typography curves into pristine dark, light, matrix, and gold themes.',
        'domain': 'UI Systems',
        'latency': '0.20ms',
        'consensus': '98.5% Aesthetic',
        'entropy': '0.96 bits',
        'audio': '/assets/audio/agents/kitsune.mp3',
        'category': 'creative'
    },
    {
        'id': 'kraken',
        'name': 'Kraken Sentinel',
        'role': 'Deep packet sentinel & socket sniffer',
        'badge': 'Packet Sentinel',
        'avatar': '/assets/agents/kraken.jpg',
        'bio': 'From the abyssal network depths. Kraken monitors local socket tunnels, protocol handshake integrity, and deep loopback telemetry.',
        'lore': 'Extends deep tentacles into raw network interfaces, logging suspicious outbound handshakes and enforcing strict loopback isolation.',
        'domain': 'Socket Sniffing',
        'latency': '0.06ms',
        'consensus': '97.0% Monitored',
        'entropy': '1.15 bits',
        'audio': '/assets/audio/agents/kraken.mp3',
        'category': 'security'
    },
    {
        'id': 'leviathan',
        'name': 'The Leviathan',
        'role': 'Vector memory leviathan & deep core',
        'badge': 'Memory Leviathan',
        'avatar': '/assets/agents/leviathan.jpg',
        'bio': 'Awakened from the Marianas of local RAM. Leviathan indexes billions of high-dimensional vectors for instantaneous zero-latency semantic recall.',
        'lore': 'Dwelling in the deepest sub-surface memory layers, Leviathan runs HNSW graph indexing for instant RAG queries and semantic associations.',
        'domain': 'Vector Embeddings',
        'latency': '0.32ms',
        'consensus': '98.8% Deep Core',
        'entropy': '0.99 bits',
        'audio': '/assets/audio/agents/leviathan.mp3',
        'category': 'consensus'
    },
    {
        'id': 'lycan',
        'name': 'Lycan',
        'role': 'Offensive security & boundary sentinel',
        'badge': 'Security Wolf',
        'avatar': '/assets/agents/lycan.jpg',
        'bio': 'Uncompromising perimeter defense. Lycan stress-tests input attack surfaces, validates bypass protections, and enforces zero-leak locks.',
        'lore': 'Hunts down security boundary breaches, injection vulnerabilities, and CORS loopholes with relentless wolf-pack precision.',
        'domain': 'OffSec Red-Team',
        'latency': '0.11ms',
        'consensus': '98.3% Hardened',
        'entropy': '1.01 bits',
        'audio': '/assets/audio/agents/lycan.mp3',
        'category': 'security'
    },
    {
        'id': 'onyx',
        'name': 'Onyx',
        'role': 'Memory profiler & deterministic GC',
        'badge': 'Memory Profiler',
        'avatar': '/assets/agents/onyx.jpg',
        'bio': 'Dense, impenetrable obsidian analysis. Onyx inspects heap snapshots, purges orphaned allocations, and locks down RAM growth.',
        'lore': 'Scans V8 heaps and native allocations to pinpoint closures, event listener leaks, and detached DOM nodes with surgical accuracy.',
        'domain': 'Heap Analysis',
        'latency': '0.10ms',
        'consensus': '97.7% Retained',
        'entropy': '1.08 bits',
        'audio': '/assets/audio/agents/onyx.mp3',
        'category': 'security'
    },
    {
        'id': 'scorpius',
        'name': 'Scorpius',
        'role': 'Zero-day vulnerability & fuzzing specialist',
        'badge': 'Vulnerability Fuzzer',
        'avatar': '/assets/agents/scorpius.jpg',
        'bio': 'Surgical venom against security flaws. Scorpius executes mutation fuzz testing, memory corruption traps, and AST sanitizer rules.',
        'lore': 'Injects chaotic mutations into input pipelines to discover edge-case panics, buffer overflows, and state desynchronizations.',
        'domain': 'Fuzz Testing',
        'latency': '0.16ms',
        'consensus': '97.5% Sanitized',
        'entropy': '1.11 bits',
        'audio': '/assets/audio/agents/scorpius.mp3',
        'category': 'security'
    },
    {
        'id': 'aquila',
        'name': 'Aquila',
        'role': 'High-altitude edge routing & gateway',
        'badge': 'Edge Gateway',
        'avatar': '/assets/agents/aquila.jpg',
        'bio': 'Apex vantage point. Aquila routes requests through localized sub-millisecond reverse proxies and zero-hop loopback sockets.',
        'lore': 'Directs incoming client requests to target studio microservices with sub-millisecond route resolution and SSL termination.',
        'domain': 'Edge Routing',
        'latency': '0.04ms',
        'consensus': '98.0% Routed',
        'entropy': '1.05 bits',
        'audio': '/assets/audio/agents/aquila.mp3',
        'category': 'architecture'
    },
    {
        'id': 'aether',
        'name': 'Aether',
        'role': 'Swarm conductor & event bus synchronizer',
        'badge': 'Swarm Conductor',
        'avatar': '/assets/agents/aether.jpg',
        'bio': 'The invisible current connecting the pantheon. Aether orchestrates the real-time agent-comms bus and coordinates distributed consensus.',
        'lore': 'Streams pub-sub messages across agent claim locks and shared filesystem channels, ensuring zero state desynchronization.',
        'domain': 'Event Conductor',
        'latency': '0.09ms',
        'consensus': '98.7% Synced',
        'entropy': '0.97 bits',
        'audio': '/assets/audio/agents/aether.mp3',
        'category': 'consensus'
    },
    {
        'id': 'pixel-neko',
        'name': 'Pixel-Neko',
        'role': 'Client storage & cache guardian',
        'badge': 'Cache Guardian',
        'avatar': '/assets/agents/pixel-neko.jpg',
        'bio': 'Nimble guardian of client state. Pixel-Neko manages versioned offline state, bookmarks, and localStorage hygiene with zero bloat.',
        'lore': 'Guarantees self-healing localStorage schema migrations, clean IndexedDB blobs, and instant instant page state hydration.',
        'domain': 'Client Cache',
        'latency': '0.12ms',
        'consensus': '96.9% Cached',
        'entropy': '1.16 bits',
        'audio': '/assets/audio/agents/pixel-neko.mp3',
        'category': 'creative'
    },
    {
        'id': 'pixel-shiba',
        'name': 'Pixel-Shiba',
        'role': 'Argon2id hardware key guardian',
        'badge': 'Sanctuary Guardian',
        'avatar': '/assets/agents/pixel-shiba.jpg',
        'bio': 'Loyal defender of the physical enclave. Pixel-Shiba guards BYOK vault keys, USB hardware interfaces, and physical companion status.',
        'lore': 'Patrols the USB serial hardware boundary, alerting the operator with glowing OLED animations whenever cryptographic keys are touched.',
        'domain': 'Hardware Enclave',
        'latency': '0.07ms',
        'consensus': '98.4% Shielded',
        'entropy': '1.00 bits',
        'audio': '/assets/audio/agents/pixel-shiba.mp3',
        'category': 'security'
    },
    {
        'id': 'radical-minion',
        'name': 'Radical Minion',
        'role': 'Hermes CLI tool runner & fast terminal driver',
        'badge': 'Terminal Runner',
        'avatar': '/assets/agents/radical-minion.jpg',
        'bio': 'Energetic autonomous executor. Radical Minion handles high-speed bash harnesses, terminal playbooks, and build automation.',
        'lore': 'Fires rapid-fire shell commands, compiles tests, and syncs Git branches with unrelenting speed and zero manual friction.',
        'domain': 'CLI Automation',
        'latency': '0.13ms',
        'consensus': '97.3% Dispatched',
        'entropy': '1.13 bits',
        'audio': '/assets/audio/agents/radical-minion.mp3',
        'category': 'execution'
    }
]

# Read original characters.html
with open('public/comic/characters.html', 'r') as f:
    orig = f.read()

# Extract from <!DOCTYPE html> up to <section aria-label="Character Codex"
head_and_nav = orig[:orig.find('<section aria-label="Character Codex"')]

# Extract footer
footer_idx = orig.find('<footer class="site"')
footer_and_end = orig[footer_idx:]

cards_html = []
for a in agents_21:
    card = f'''<article class="char-card" data-agent-id="{a['id']}" data-category="{a['category']}">
<div class="char-header">
<img alt="{a['name']}" class="char-avatar" src="{a['avatar']}" loading="lazy" width="72" height="72"/>
<div class="char-meta">
<h2>{a['name']}</h2>
<span class="char-role-badge">{a['role']}</span>
</div>
</div>
<p class="char-bio">{a['bio']}</p>
<div class="char-stats">
<div class="stat-item"><span>Domain:</span><strong>{a['domain']}</strong></div>
<div class="stat-item"><span>Latency:</span><strong>{a['latency']}</strong></div>
<div class="stat-item"><span>Consensus:</span><strong>{a['consensus']}</strong></div>
<div class="stat-item"><span>Entropy:</span><strong>{a['entropy']}</strong></div>
</div>
<div class="char-actions-bar">
<button class="voice-btn" onclick="playCharacterVoice('{a['audio']}', this, '{a['name']}: {a['bio']}')" type="button">🔊 Play voice line</button>
<button class="btn-3d-inspect" onclick="openAvatarModalFromCard(this.closest('.char-card'))" type="button">💎 3D View</button>
</div>
</article>'''
    cards_html.append(card)

cards_block = '\n'.join(cards_html)

modal_and_script = '''<!-- 3D AVATAR CARD PREVIEW MODAL -->
<div aria-hidden="true" class="avatar-3d-modal-backdrop" id="avatar3DModal" role="dialog" aria-modal="true" aria-labelledby="modalCharName">
  <div class="avatar-3d-stage" id="avatar3DStage">
    <div class="avatar-3d-card" id="avatar3DCard">
      <button type="button" class="modal-close-btn" onclick="closeAvatarModal()" aria-label="Close 3D Hologram Preview">✕</button>
      
      <div class="avatar-3d-figure-wrap">
        <div class="avatar-3d-halo"></div>
        <img src="/assets/mascot/azoth-portrait.jpg" alt="Character 3D Avatar" class="avatar-3d-img" id="modalCharImg" />
      </div>

      <h3 class="avatar-3d-name" id="modalCharName">Master Azoth</h3>
      <span class="avatar-3d-role" id="modalCharRole">Operator of the Saga</span>
      
      <p class="avatar-3d-bio" id="modalCharBio">
        Azoth is the operator of the saga. He picks the team, breaks the tie, and keeps the work on this machine — zero cloud telemetry.
      </p>

      <div class="avatar-3d-stats-grid" id="modalCharStats">
        <div class="avatar-3d-stat-box">
          <div class="avatar-3d-stat-label">Domain</div>
          <div class="avatar-3d-stat-val">Synthesis</div>
        </div>
        <div class="avatar-3d-stat-box">
          <div class="avatar-3d-stat-label">Latency</div>
          <div class="avatar-3d-stat-val">0.00ms</div>
        </div>
        <div class="avatar-3d-stat-box">
          <div class="avatar-3d-stat-label">Consensus</div>
          <div class="avatar-3d-stat-val">100% Supreme</div>
        </div>
        <div class="avatar-3d-stat-box">
          <div class="avatar-3d-stat-label">Entropy</div>
          <div class="avatar-3d-stat-val">Minimal</div>
        </div>
      </div>

      <div class="avatar-3d-actions">
        <button type="button" class="btn-modal-voice" id="modalVoiceBtn" onclick="playModalVoice()">
          <span>🔊</span> Play Neural Voice Line
        </button>
      </div>
    </div>
  </div>
</div>
</main>
<script>
  (function() {
    let _activeAudio = null;
    let _currentModalVoiceSrc = '/assets/audio/mascot/azoth.mp3';
    let _currentModalBio = 'Master Azoth: Solve et coagula.';

    // Filter characters by category
    window.filterCharacters = function(category) {
      document.querySelectorAll('.char-tab').forEach(t => {
        const cat = t.getAttribute('data-cat');
        const isActive = (cat === category);
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      const cards = document.querySelectorAll('.char-card');
      let visibleCount = 0;
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const matches = (category === 'all' || cat === category);
        card.style.display = matches ? 'flex' : 'none';
        if (matches) visibleCount++;
      });

      const countEl = document.getElementById('rosterCountBadge');
      if (countEl) {
        countEl.textContent = category === 'all' ? 'Season 01 · 21 dossiers' : ('Filtered · ' + visibleCount + ' dossiers');
      }
    };

    // Synthesize voice fallback with Web Audio Chime or SpeechSynthesis
    window.playCharacterVoice = function(src, btn, fallbackText) {
      if (_activeAudio) {
        _activeAudio.pause();
        _activeAudio.currentTime = 0;
      }

      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✨ Speaking...';
        setTimeout(() => { btn.innerHTML = originalText; }, 2200);
      }

      _activeAudio = new Audio(src);
      _activeAudio.play().catch(function() {
        // Fallback to SpeechSynthesis if available
        if ('speechSynthesis' in window && fallbackText) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(fallbackText);
          utterance.rate = 1.0;
          utterance.pitch = 0.95;
          window.speechSynthesis.speak(utterance);
        } else {
          // Play Web Audio Chime
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(432, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(864, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch(e) {}
        }
      });
    };

    window.playModalVoice = function() {
      if (_currentModalVoiceSrc) {
        window.playCharacterVoice(_currentModalVoiceSrc, document.getElementById('modalVoiceBtn'), _currentModalBio);
      }
    };

    window.openAvatarModalFromCard = function(card) {
      const name = card.querySelector('h2') ? card.querySelector('h2').textContent.trim() : 'Agent';
      const role = card.querySelector('.char-role-badge') ? card.querySelector('.char-role-badge').textContent.trim() : 'Sovereign Node';
      const bio = card.querySelector('.char-bio') ? card.querySelector('.char-bio').textContent.trim() : '';
      const img = card.querySelector('.char-avatar') ? card.querySelector('.char-avatar').src : '/assets/mascot/azoth-portrait.jpg';
      const voiceBtn = card.querySelector('.voice-btn');
      
      let voiceSrc = '/assets/audio/mascot/azoth.mp3';
      if (voiceBtn) {
        const onClickAttr = voiceBtn.getAttribute('onclick') || '';
        const match = onClickAttr.match(/'([^']+)'/);
        if (match) voiceSrc = match[1];
      }
      _currentModalVoiceSrc = voiceSrc;
      _currentModalBio = name + ': ' + bio;

      document.getElementById('modalCharName').textContent = name;
      document.getElementById('modalCharRole').textContent = role;
      document.getElementById('modalCharBio').textContent = bio;
      document.getElementById('modalCharImg').src = img;

      // Extract stats
      const statsContainer = document.getElementById('modalCharStats');
      statsContainer.innerHTML = '';
      const statItems = card.querySelectorAll('.stat-item');
      statItems.forEach(item => {
        const label = item.querySelector('span') ? item.querySelector('span').textContent.replace(':', '').trim() : 'Stat';
        const val = item.querySelector('strong') ? item.querySelector('strong').textContent.trim() : 'Optimal';
        const box = document.createElement('div');
        box.className = 'avatar-3d-stat-box';
        box.innerHTML = '<div class="avatar-3d-stat-label">' + label + '</div><div class="avatar-3d-stat-val">' + val + '</div>';
        statsContainer.appendChild(box);
      });

      const modal = document.getElementById('avatar3DModal');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    };

    window.closeAvatarModal = function() {
      const modal = document.getElementById('avatar3DModal');
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      const card = document.getElementById('avatar3DCard');
      if (card) card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };

    // 3D Perspective Tilt Tracking
    document.addEventListener('DOMContentLoaded', function() {
      const modal = document.getElementById('avatar3DModal');
      const stage = document.getElementById('avatar3DStage');
      const card = document.getElementById('avatar3DCard');

      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) window.closeAvatarModal();
        });
      }

      if (stage && card) {
        stage.addEventListener('mousemove', function(e) {
          const rect = stage.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / (rect.height / 2)) * 14;
          const rotateY = (x / (rect.width / 2)) * 14;
          card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        stage.addEventListener('mouseleave', function() {
          card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      }

      // Attach click to all char-cards
      document.querySelectorAll('.char-card').forEach(c => {
        c.addEventListener('click', function(e) {
          if (e.target.tagName === 'BUTTON' && (e.target.classList.contains('voice-btn') || e.target.classList.contains('btn-3d-inspect'))) return;
          window.openAvatarModalFromCard(c);
        });
      });
    });

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') window.closeAvatarModal();
    });
  })();
</script>'''

roster_section = f'''<section aria-label="Character Codex" class="codex-poster">
<div class="codex-poster-copy">
<p class="kicker">Codex · season 01</p>
<h1>The cast</h1>
<p class="lede">Azoth is the operator of the saga. These are the 21 sovereign agents who keep the leak off the wire.</p>
<div class="codex-poster-actions">
<a class="btn btn-gold" href="#roster">Jump to roster</a>
<a class="btn btn-ghost" href="/comic/">Back to comic</a>
</div>
</div>
<div class="codex-poster-figure">
<img alt="Master Azoth, operator of the Zero-Leakage Saga" decoding="async" fetchpriority="high" height="1024" src="/assets/mascot/azoth-portrait.jpg" width="1024"/>
<span class="codex-poster-credit">Azoth · Operator</span>
</div>
</section>
<section aria-label="Season 01 roster" class="char-roster" id="roster">
<header class="char-hero">
<p class="char-kicker" id="rosterCountBadge">Season 01 · 21 dossiers</p>
<h2>21-Agent Pantheon Roster</h2>
<p class="char-lead">Roles, stats, and neural voice lines. Azoth runs the sovereign pantheon locally on this machine.</p>
<div class="cta-group">
<a class="btn btn-ghost" href="/comic/soundboard.html">Soundboard</a>
<a class="btn btn-ghost" href="/comic/timeline.html">Timeline</a>
<a class="btn btn-ghost" href="/comic/share.html">Quote Card Generator</a>
</div>
</header>
<div class="char-filter-tabs" role="tablist" aria-label="Character Categories">
<button class="char-tab active" data-cat="all" onclick="filterCharacters('all')" type="button" role="tab" aria-selected="true">All 21 Agents</button>
<button class="char-tab" data-cat="sovereign" onclick="filterCharacters('sovereign')" type="button" role="tab" aria-selected="false">👑 Sovereign Prime</button>
<button class="char-tab" data-cat="architecture" onclick="filterCharacters('architecture')" type="button" role="tab" aria-selected="false">🪐 Architecture & DAG</button>
<button class="char-tab" data-cat="consensus" onclick="filterCharacters('consensus')" type="button" role="tab" aria-selected="false">📐 Consensus & Truth</button>
<button class="char-tab" data-cat="security" onclick="filterCharacters('security')" type="button" role="tab" aria-selected="false">🔒 Cryptography & Security</button>
<button class="char-tab" data-cat="execution" onclick="filterCharacters('execution')" type="button" role="tab" aria-selected="false">⚡ Execution & Tools</button>
<button class="char-tab" data-cat="creative" onclick="filterCharacters('creative')" type="button" role="tab" aria-selected="false">🎨 UI & Design Systems</button>
</div>
<div class="char-grid" id="charactersGrid">
{cards_block}
</div>
</section>
'''

full_html = head_and_nav + roster_section + modal_and_script + '\n' + footer_and_end

with open('public/comic/characters.html', 'w') as f:
    f.write(full_html)

print('Successfully rebuilt public/comic/characters.html with 21 agents!')
