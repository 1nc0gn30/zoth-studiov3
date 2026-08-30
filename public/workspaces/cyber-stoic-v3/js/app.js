/**
 * CYBER STOIC PROTOCOL v3 - MAIN CONTROLLER
 * Coordinates 3D Three.js Particle Engine, Web Audio API Synth,
 * Meditations Quotes Engine, Box Breathing, and Cyber Stoic Modules.
 */

import { STOIC_QUOTES, STOIC_PILLARS, DICHOTOMY_SCENARIOS, SENECA_JOURNAL_PROMPTS } from './stoic-data.js';
import { stoicAudio } from './audio-synth.js';
import { StoicParticlePortal } from './three-portal.js';

class CyberStoicApp {
  constructor() {
    this.portal = null;
    this.quotes = STOIC_QUOTES;
    this.currentQuoteIndex = 0;
    this.activeTheme = 'gold';
    this.savedFavorites = new Set();
    this.isHudVisible = true;

    // Breathing module state
    this.breathingTimer = null;
    this.breathingPhase = 'inhale';
    this.breathingSec = 4;
    this.breathingActive = false;

    // Dom elements
    this.dom = {};
  }

  init() {
    this.cacheDom();
    this.loadPersistedState();
    
    // Initialize 3D Particle Canvas
    try {
      this.portal = new StoicParticlePortal('webgl-canvas-container');
    } catch (e) {
      console.error('Failed to init 3D Particle Canvas:', e);
    }

    this.renderCurrentQuote(false);
    this.initTelemetryClock();
    this.bindEvents();
    this.renderCodexArchive();
    this.renderDichotomyPresets();
    this.renderMementoMori(28); // default 28 years old
    this.loadSenecaJournal();

    console.log('🏛️ CYBER STOIC PROTOCOL v3 INITIALIZED');
  }

  cacheDom() {
    this.dom = {
      root: document.documentElement,
      quoteTag: document.getElementById('quote-pillar-tag'),
      quoteRef: document.getElementById('quote-ref-badge'),
      quoteText: document.getElementById('quote-body-text'),
      quoteLatin: document.getElementById('quote-latin-sub'),
      quoteCommentary: document.getElementById('quote-commentary-content'),
      quoteAuthor: document.getElementById('quote-author-name'),
      quoteSource: document.getElementById('quote-source-title'),
      
      // Control buttons
      btnPrevQuote: document.getElementById('btn-prev-quote'),
      btnNextQuote: document.getElementById('btn-next-quote'),
      btnRandomQuote: document.getElementById('btn-random-quote'),
      btnCopyQuote: document.getElementById('btn-copy-quote'),
      btnSpeakQuote: document.getElementById('btn-speak-quote'),
      btnFavQuote: document.getElementById('btn-fav-quote'),
      btnExportCard: document.getElementById('btn-export-card'),

      // Navigation / Modals
      btnOpenCodex: document.getElementById('btn-open-codex'),
      btnOpenBreathing: document.getElementById('btn-open-breathing'),
      btnOpenDichotomy: document.getElementById('btn-open-dichotomy'),
      btnOpenMemento: document.getElementById('btn-open-memento'),
      btnOpenJournal: document.getElementById('btn-open-journal'),
      btnToggleMute: document.getElementById('btn-toggle-mute'),
      btnToggleHud: document.getElementById('btn-toggle-hud'),
      btnToggleDrawer: document.getElementById('btn-toggle-drawer'),
      drawerPanel: document.getElementById('drawer-panel'),
      btnCloseDrawer: document.getElementById('btn-close-drawer'),

      // Modals
      modals: document.querySelectorAll('.modal-backdrop'),
      closeModalBtns: document.querySelectorAll('.btn-close-modal'),

      // Telemetry
      romanTime: document.getElementById('telemetry-roman-time'),
      epochSeconds: document.getElementById('telemetry-epoch'),
      eudaimoniaIndex: document.getElementById('telemetry-eudaimonia'),

      // Codex DOM
      codexSearch: document.getElementById('codex-search-input'),
      codexPillars: document.getElementById('codex-pillar-filters'),
      codexList: document.getElementById('codex-quotes-container'),

      // Breathing DOM
      breathingCore: document.getElementById('breathing-visual-core'),
      breathingCount: document.getElementById('breathing-count-display'),
      breathingPhaseText: document.getElementById('breathing-phase-text'),
      btnToggleBreathingPlay: document.getElementById('btn-toggle-breathing-play'),

      // Dichotomy DOM
      dichotomyPresets: document.getElementById('dichotomy-preset-select'),
      dichotomyInControlList: document.getElementById('dichotomy-in-control-list'),
      dichotomyOutControlList: document.getElementById('dichotomy-out-control-list'),
      dichotomyCustomInput: document.getElementById('dichotomy-custom-input'),
      btnAnalyzeDichotomy: document.getElementById('btn-analyze-dichotomy'),

      // Memento Mori DOM
      mementoAgeInput: document.getElementById('memento-age-input'),
      mementoWeeksLived: document.getElementById('memento-weeks-lived'),
      mementoWeeksLeft: document.getElementById('memento-weeks-left'),
      mementoPctUsed: document.getElementById('memento-pct-used'),
      mementoDotsGrid: document.getElementById('memento-dots-grid'),

      // Seneca Journal DOM
      senecaInputsContainer: document.getElementById('seneca-inputs-container'),
      btnSaveJournal: document.getElementById('btn-save-journal'),

      // Toast
      toast: document.getElementById('cyber-toast')
    };
  }

  loadPersistedState() {
    try {
      const savedTheme = localStorage.getItem('cyber_stoic_theme');
      if (savedTheme) this.setTheme(savedTheme);

      const favs = localStorage.getItem('cyber_stoic_favorites');
      if (favs) this.savedFavorites = new Set(JSON.parse(favs));
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }

  // --- QUOTES ENGINE ---
  renderCurrentQuote(animate = true) {
    const quote = this.quotes[this.currentQuoteIndex];
    if (!quote) return;

    if (animate) {
      if (this.dom.quoteText) this.dom.quoteText.style.opacity = '0';
      setTimeout(() => {
        this.updateQuoteDom(quote);
        if (this.dom.quoteText) this.dom.quoteText.style.opacity = '1';
      }, 180);
    } else {
      this.updateQuoteDom(quote);
    }

    if (this.portal && animate) {
      this.portal.triggerPulse();
    }
  }

  updateQuoteDom(quote) {
    if (this.dom.quoteTag) {
      const pillarObj = STOIC_PILLARS.find(p => p.id === quote.pillar) || { label: quote.pillar };
      this.dom.quoteTag.innerHTML = `◆ ${pillarObj.label}`;
    }
    if (this.dom.quoteRef) this.dom.quoteRef.textContent = `REF: ${quote.source}`;
    if (this.dom.quoteText) this.dom.quoteText.textContent = `"${quote.text}"`;
    if (this.dom.quoteLatin) this.dom.quoteLatin.textContent = quote.latinRef ? `// ${quote.latinRef}` : '';
    if (this.dom.quoteCommentary) this.dom.quoteCommentary.textContent = quote.commentary;
    if (this.dom.quoteAuthor) this.dom.quoteAuthor.textContent = quote.author.toUpperCase();
    if (this.dom.quoteSource) this.dom.quoteSource.textContent = quote.source;

    // Update Favorite Icon State
    if (this.dom.btnFavQuote) {
      const isFav = this.savedFavorites.has(quote.id);
      this.dom.btnFavQuote.classList.toggle('active', isFav);
      this.dom.btnFavQuote.innerHTML = isFav ? '★ Saved' : '☆ Save';
    }
  }

  nextQuote() {
    stoicAudio.playClick();
    stoicAudio.playChime();
    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    this.renderCurrentQuote(true);
  }

  prevQuote() {
    stoicAudio.playClick();
    stoicAudio.playChime();
    this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.quotes.length) % this.quotes.length;
    this.renderCurrentQuote(true);
  }

  randomQuote() {
    stoicAudio.playClick();
    stoicAudio.playChime();
    let nextIdx = Math.floor(Math.random() * this.quotes.length);
    if (nextIdx === this.currentQuoteIndex) nextIdx = (nextIdx + 1) % this.quotes.length;
    this.currentQuoteIndex = nextIdx;
    this.renderCurrentQuote(true);
  }

  toggleFavorite() {
    const q = this.quotes[this.currentQuoteIndex];
    if (!q) return;
    stoicAudio.playClick();

    if (this.savedFavorites.has(q.id)) {
      this.savedFavorites.delete(q.id);
      this.showToast('Removed from Codex bookmarks');
    } else {
      this.savedFavorites.add(q.id);
      this.showToast('Saved to Codex bookmarks');
    }

    try {
      localStorage.setItem('cyber_stoic_favorites', JSON.stringify(Array.from(this.savedFavorites)));
    } catch (e) {}

    this.renderCurrentQuote(false);
  }

  copyQuoteText() {
    const q = this.quotes[this.currentQuoteIndex];
    if (!q) return;
    stoicAudio.playClick();

    const textToCopy = `"${q.text}"\n— ${q.author}, ${q.source}\n[Cyber Stoic Protocol v3]`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.showToast('Copied Meditation to Clipboard');
    }).catch(() => {
      this.showToast('Clipboard access unavailable');
    });
  }

  speakQuote() {
    stoicAudio.playClick();
    const q = this.quotes[this.currentQuoteIndex];
    if (!q || !('speechSynthesis' in window)) {
      this.showToast('Speech synthesis not available');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${q.text}. ${q.author}, ${q.source}`);
    utterance.rate = 0.9;
    utterance.pitch = 0.85; // Calmer, deeper stoic cadence

    const voices = window.speechSynthesis.getVoices();
    const calmVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Google')));
    if (calmVoice) utterance.voice = calmVoice;

    window.speechSynthesis.speak(utterance);
    this.showToast('Transmitting Audio Synthesis...');
  }

  exportHolographicCard() {
    stoicAudio.playClick();
    const q = this.quotes[this.currentQuoteIndex];
    if (!q) return;

    // Render on dynamic Canvas 2D
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    // Background Cyber Fill
    ctx.fillStyle = '#030508';
    ctx.fillRect(0, 0, 1200, 675);

    // Accent grid lines
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 675);
      ctx.stroke();
    }
    for (let y = 0; y < 675; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Outer Cyber Border
    ctx.strokeStyle = '#ffb000';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1120, 595);

    // Corner brackets
    ctx.fillStyle = '#ffb000';
    ctx.fillRect(36, 36, 24, 6);
    ctx.fillRect(36, 36, 6, 24);
    ctx.fillRect(1140, 629, 24, 6);
    ctx.fillRect(1158, 611, 6, 24);

    // Top Header
    ctx.fillStyle = '#ffb000';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(`CYBER STOIC PROTOCOL // ${q.pillar.toUpperCase()} // ${q.source}`, 70, 90);

    // Latin subtitle
    if (q.latinRef) {
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'italic 16px "Courier New", monospace';
      ctx.fillText(`[ ${q.latinRef} ]`, 70, 120);
    }

    // Quote Text - Wrapped
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Georgia, serif';
    this.wrapText(ctx, `"${q.text}"`, 70, 200, 1050, 44);

    // Commentary Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(70, 450, 1060, 85);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 450, 4, 85);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('NEURAL TRANSLATION / PRINCIPLE:', 90, 475);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px sans-serif';
    this.wrapText(ctx, q.commentary, 90, 505, 1020, 24);

    // Footer Author
    ctx.fillStyle = '#ffb000';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText(`— ${q.author.toUpperCase()}`, 70, 595);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('SECURE LOCAL STACK // MEDITATIONS MATRIX v3', 800, 595);

    // Download Image
    const link = document.createElement('a');
    link.download = `cyber-stoic-quote-${q.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    this.showToast('Downloaded High-Res Holographic Card');
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // --- THEME & FORMATIONS CONTROLLER ---
  setTheme(themeId) {
    this.activeTheme = themeId;
    this.dom.root.setAttribute('data-theme', themeId);
    if (this.portal) this.portal.applyTheme(themeId);
    try {
      localStorage.setItem('cyber_stoic_theme', themeId);
    } catch (e) {}

    // Update active theme chips
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-theme-id') === themeId);
    });
  }

  setFormation(formationId) {
    stoicAudio.playWarp();
    if (this.portal) {
      this.portal.setFormation(formationId);
    }
    document.querySelectorAll('.formation-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-formation') === formationId);
    });
  }

  toggleHud() {
    this.isHudVisible = !this.isHudVisible;
    const uiChrome = document.querySelector('.cyber-ui-root');
    if (uiChrome) {
      uiChrome.style.opacity = this.isHudVisible ? '1' : '0';
      uiChrome.style.pointerEvents = this.isHudVisible ? 'none' : 'none';
    }
    this.showToast(this.isHudVisible ? 'HUD Active' : 'Immersive Screensaver Mode (Press H)');
  }

  toggleAudio() {
    const nextMute = !stoicAudio.isMuted;
    stoicAudio.setMute(nextMute);
    if (this.dom.btnToggleMute) {
      this.dom.btnToggleMute.classList.toggle('active', !nextMute);
      this.dom.btnToggleMute.innerHTML = nextMute ? '🔇 Audio Off' : '🔊 Audio On';
    }
    this.showToast(nextMute ? 'Audio Muted' : 'Ambient Cyber-Drone Engaged');
  }

  showToast(msg) {
    if (!this.dom.toast) return;
    this.dom.toast.textContent = `// ${msg}`;
    this.dom.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, 2400);
  }

  // --- MODULE 1: CODEX ARCHIVE ---
  renderCodexArchive(filterPillar = 'all', searchQuery = '') {
    if (!this.dom.codexList) return;

    // Render Filter Pills
    if (this.dom.codexPillars && !this.dom.codexPillars.children.length) {
      this.dom.codexPillars.innerHTML = STOIC_PILLARS.map(p => `
        <button class="filter-pill ${p.id === 'all' ? 'active' : ''}" data-pillar-id="${p.id}">
          ${p.label}
        </button>
      `).join('');

      this.dom.codexPillars.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        this.dom.codexPillars.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        stoicAudio.playClick();
        this.renderCodexArchive(btn.getAttribute('data-pillar-id'), this.dom.codexSearch ? this.dom.codexSearch.value : '');
      });
    }

    const qLower = searchQuery.toLowerCase().trim();
    const filtered = this.quotes.filter(q => {
      const matchPillar = filterPillar === 'all' || q.pillar === filterPillar;
      const matchSearch = !qLower || q.text.toLowerCase().includes(qLower) || q.source.toLowerCase().includes(qLower) || (q.latinRef && q.latinRef.toLowerCase().includes(qLower));
      return matchPillar && matchSearch;
    });

    this.dom.codexList.innerHTML = filtered.map(q => `
      <div class="codex-item" data-quote-id="${q.id}">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-main);">
          <span>◆ ${q.pillar.toUpperCase()}</span>
          <span>${q.source}</span>
        </div>
        <div style="font-size: 0.9rem; color: var(--text-pure); margin-bottom: 0.4rem;">
          "${q.text.substring(0, 130)}${q.text.length > 130 ? '...' : ''}"
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">
          ${q.commentary.substring(0, 110)}...
        </div>
      </div>
    `).join('');

    this.dom.codexList.querySelectorAll('.codex-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-quote-id'), 10);
        const idx = this.quotes.findIndex(q => q.id === id);
        if (idx !== -1) {
          stoicAudio.playClick();
          this.currentQuoteIndex = idx;
          this.renderCurrentQuote(true);
          this.closeAllModals();
        }
      });
    });
  }

  // --- MODULE 2: INNER CITADEL BOX BREATHING ---
  toggleBreathingSession() {
    this.breathingActive = !this.breathingActive;
    stoicAudio.playClick();

    if (this.breathingActive) {
      if (this.dom.btnToggleBreathingPlay) this.dom.btnToggleBreathingPlay.textContent = '■ Halt Protocol';
      this.breathingSec = 4;
      this.breathingPhase = 'inhale';
      this.runBreathingStep();
      this.breathingTimer = setInterval(() => this.tickBreathing(), 1000);
    } else {
      if (this.dom.btnToggleBreathingPlay) this.dom.btnToggleBreathingPlay.textContent = '▶ Begin 4-4-4-4 Protocol';
      clearInterval(this.breathingTimer);
      if (this.portal) this.portal.setBreathingScale(1.0, false);
      if (this.dom.breathingCore) {
        this.dom.breathingCore.className = 'breathing-visual-core';
      }
    }
  }

  tickBreathing() {
    this.breathingSec--;
    if (this.dom.breathingCount) this.dom.breathingCount.textContent = this.breathingSec;

    if (this.breathingSec <= 0) {
      this.breathingSec = 4;
      // Advance Phase: Inhale -> Hold -> Exhale -> Hold
      if (this.breathingPhase === 'inhale') this.breathingPhase = 'hold-in';
      else if (this.breathingPhase === 'hold-in') this.breathingPhase = 'exhale';
      else if (this.breathingPhase === 'exhale') this.breathingPhase = 'hold-out';
      else if (this.breathingPhase === 'hold-out') this.breathingPhase = 'inhale';

      this.runBreathingStep();
    }
  }

  runBreathingStep() {
    const phases = {
      'inhale': { label: 'Inhale Logos // Expand Citadel', class: 'inhale', scale: 1.35 },
      'hold-in': { label: 'Hold // Retain Sovereignty', class: 'hold', scale: 1.35 },
      'exhale': { label: 'Exhale // Release Externals', class: 'exhale', scale: 0.8 },
      'hold-out': { label: 'Stillness // The Inner Citadel', class: 'hold', scale: 0.8 }
    };

    const current = phases[this.breathingPhase];
    if (this.dom.breathingPhaseText) this.dom.breathingPhaseText.textContent = current.label;
    if (this.dom.breathingCount) this.dom.breathingCount.textContent = this.breathingSec;

    if (this.dom.breathingCore) {
      this.dom.breathingCore.className = `breathing-visual-core ${current.class}`;
    }

    if (this.portal) {
      this.portal.setBreathingScale(current.scale, true);
    }

    stoicAudio.playBreathPulse(this.breathingPhase.includes('inhale') ? 'inhale' : this.breathingPhase.includes('exhale') ? 'exhale' : 'hold');
  }

  // --- MODULE 3: DICHOTOMY OF CONTROL SORTER ---
  renderDichotomyPresets() {
    if (!this.dom.dichotomyPresets) return;

    this.dom.dichotomyPresets.innerHTML = DICHOTOMY_SCENARIOS.map(s => `
      <option value="${s.id}">${s.situation} [${s.category}]</option>
    `).join('');

    this.dom.dichotomyPresets.addEventListener('change', () => {
      stoicAudio.playClick();
      const sId = this.dom.dichotomyPresets.value;
      const scenario = DICHOTOMY_SCENARIOS.find(s => s.id === sId);
      if (scenario) this.populateDichotomy(scenario.inControl, scenario.outOfControl);
    });

    if (DICHOTOMY_SCENARIOS.length > 0) {
      this.populateDichotomy(DICHOTOMY_SCENARIOS[0].inControl, DICHOTOMY_SCENARIOS[0].outOfControl);
    }
  }

  populateDichotomy(inCtrl, outCtrl) {
    if (this.dom.dichotomyInControlList) {
      this.dom.dichotomyInControlList.innerHTML = inCtrl.map(i => `<li>✔ ${i}</li>`).join('');
    }
    if (this.dom.dichotomyOutControlList) {
      this.dom.dichotomyOutControlList.innerHTML = outCtrl.map(i => `<li>✖ ${i}</li>`).join('');
    }
  }

  analyzeCustomDichotomy() {
    const input = this.dom.dichotomyCustomInput ? this.dom.dichotomyCustomInput.value.trim() : '';
    if (!input) return;
    stoicAudio.playClick();

    // Stoic Neural Classifier
    const inCtrl = [
      `Your conscious response to: "${input.substring(0, 30)}"`,
      'Maintaining virtue & rational integrity',
      'Direct purposeful actions you can take today'
    ];
    const outCtrl = [
      `The external existence of: "${input.substring(0, 30)}"`,
      'Past occurrences & unchangeable realities',
      'Other people\'s reactions, opinions, and choices'
    ];

    this.populateDichotomy(inCtrl, outCtrl);
    this.showToast('Stoic Dichotomy Analysis Compiled');
  }

  // --- MODULE 4: MEMENTO MORI ---
  renderMementoMori(age) {
    const totalYears = 80;
    const totalWeeks = totalYears * 52;
    const weeksLived = Math.min(totalWeeks, Math.round(age * 52));
    const weeksLeft = Math.max(0, totalWeeks - weeksLived);
    const pctUsed = ((weeksLived / totalWeeks) * 100).toFixed(1);

    if (this.dom.mementoWeeksLived) this.dom.mementoWeeksLived.textContent = weeksLived.toLocaleString();
    if (this.dom.mementoWeeksLeft) this.dom.mementoWeeksLeft.textContent = weeksLeft.toLocaleString();
    if (this.dom.mementoPctUsed) this.dom.mementoPctUsed.textContent = `${pctUsed}%`;

    if (this.dom.mementoDotsGrid) {
      let dotsHtml = '';
      // Group by years (80 rows of 52 weeks)
      for (let w = 0; w < totalWeeks; w++) {
        const isLived = w < weeksLived;
        dotsHtml += `<div class="memento-dot ${isLived ? 'lived' : 'remaining'}" title="Week ${w + 1}"></div>`;
      }
      this.dom.mementoDotsGrid.innerHTML = dotsHtml;
    }
  }

  // --- MODULE 5: SENECA EVENING REVIEW JOURNAL ---
  loadSenecaJournal() {
    if (!this.dom.senecaInputsContainer) return;

    const todayKey = new Date().toISOString().split('T')[0];
    let savedEntry = {};
    try {
      const stored = localStorage.getItem(`cyber_stoic_journal_${todayKey}`);
      if (stored) savedEntry = JSON.parse(stored);
    } catch (e) {}

    this.dom.senecaInputsContainer.innerHTML = SENECA_JOURNAL_PROMPTS.map(p => `
      <div class="journal-prompt-card">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-main); font-weight: 600;">
          ◆ ${p.title.toUpperCase()}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.2rem;">
          ${p.question}
        </div>
        <textarea class="journal-textarea" data-key="${p.key}" placeholder="Log telemetry reflection...">${savedEntry[p.key] || ''}</textarea>
      </div>
    `).join('');
  }

  saveSenecaJournal() {
    stoicAudio.playClick();
    const todayKey = new Date().toISOString().split('T')[0];
    const data = {};
    const textareas = this.dom.senecaInputsContainer.querySelectorAll('.journal-textarea');
    textareas.forEach(ta => {
      data[ta.getAttribute('data-key')] = ta.value.trim();
    });

    try {
      localStorage.setItem(`cyber_stoic_journal_${todayKey}`, JSON.stringify(data));
      this.showToast('Daily Seneca Review Persisted Locally');
    } catch (e) {
      this.showToast('Storage error');
    }
  }

  // --- TELEMETRY & EPOCH CLOCK ---
  initTelemetryClock() {
    const toRoman = (num) => {
      const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
      let roman = '';
      for (let i in lookup) {
        while (num >= lookup[i]) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    };

    const update = () => {
      const now = new Date();
      const year = now.getFullYear();
      if (this.dom.romanTime) {
        this.dom.romanTime.textContent = `A.D. ${toRoman(year)} // ${now.toLocaleTimeString()}`;
      }
      if (this.dom.epochSeconds) {
        this.dom.epochSeconds.textContent = Math.floor(now.getTime() / 1000);
      }
      if (this.dom.eudaimoniaIndex) {
        const coherence = 98.4 + Math.sin(now.getTime() * 0.0005) * 1.4;
        this.dom.eudaimoniaIndex.textContent = `${coherence.toFixed(1)}%`;
      }
    };

    update();
    setInterval(update, 1000);
  }

  // --- MODAL UTILS ---
  openModal(modalId) {
    stoicAudio.playClick();
    this.closeAllModals();
    const m = document.getElementById(modalId);
    if (m) m.classList.add('open');
  }

  closeAllModals() {
    if (this.dom.modals) {
      this.dom.modals.forEach(m => m.classList.remove('open'));
    }
    if (this.breathingActive) {
      this.toggleBreathingSession();
    }
  }

  // --- EVENT BINDINGS ---
  bindEvents() {
    // Quote Controls
    this.dom.btnNextQuote?.addEventListener('click', () => this.nextQuote());
    this.dom.btnPrevQuote?.addEventListener('click', () => this.prevQuote());
    this.dom.btnRandomQuote?.addEventListener('click', () => this.randomQuote());
    this.dom.btnCopyQuote?.addEventListener('click', () => this.copyQuoteText());
    this.dom.btnSpeakQuote?.addEventListener('click', () => this.speakQuote());
    this.dom.btnFavQuote?.addEventListener('click', () => this.toggleFavorite());
    this.dom.btnExportCard?.addEventListener('click', () => this.exportHolographicCard());

    // Navigation & Modals
    this.dom.btnOpenCodex?.addEventListener('click', () => this.openModal('modal-codex'));
    this.dom.btnOpenBreathing?.addEventListener('click', () => this.openModal('modal-breathing'));
    this.dom.btnOpenDichotomy?.addEventListener('click', () => this.openModal('modal-dichotomy'));
    this.dom.btnOpenMemento?.addEventListener('click', () => this.openModal('modal-memento'));
    this.dom.btnOpenJournal?.addEventListener('click', () => {
      this.loadSenecaJournal();
      this.openModal('modal-journal');
    });

    this.dom.btnToggleMute?.addEventListener('click', () => this.toggleAudio());
    this.dom.btnToggleHud?.addEventListener('click', () => this.toggleHud());

    // Drawer Controls
    this.dom.btnToggleDrawer?.addEventListener('click', () => {
      stoicAudio.playClick();
      this.dom.drawerPanel?.classList.toggle('open');
    });
    this.dom.btnCloseDrawer?.addEventListener('click', () => {
      stoicAudio.playClick();
      this.dom.drawerPanel?.classList.remove('open');
    });

    // Close Modals
    this.dom.closeModalBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        stoicAudio.playClick();
        this.closeAllModals();
      });
    });

    this.dom.modals?.forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) this.closeAllModals();
      });
    });

    // Formations Switcher
    document.querySelectorAll('.formation-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const formation = btn.getAttribute('data-formation');
        this.setFormation(formation);
      });
    });

    // Themes Switcher Chips
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        stoicAudio.playClick();
        const tid = chip.getAttribute('data-theme-id');
        this.setTheme(tid);
      });
    });

    // Drawer Sliders
    const sliderSpeed = document.getElementById('slider-rotation-speed');
    if (sliderSpeed && this.portal) {
      sliderSpeed.addEventListener('input', (e) => {
        if (this.portal.controls) {
          this.portal.controls.autoRotateSpeed = parseFloat(e.target.value);
        }
      });
    }

    const sliderAudioVolume = document.getElementById('slider-audio-volume');
    if (sliderAudioVolume) {
      sliderAudioVolume.addEventListener('input', (e) => {
        stoicAudio.setVolume(parseFloat(e.target.value));
      });
    }

    // Module Sub-Events
    this.dom.btnToggleBreathingPlay?.addEventListener('click', () => this.toggleBreathingSession());
    this.dom.btnAnalyzeDichotomy?.addEventListener('click', () => this.analyzeCustomDichotomy());
    this.dom.btnSaveJournal?.addEventListener('click', () => this.saveSenecaJournal());

    if (this.dom.codexSearch) {
      this.dom.codexSearch.addEventListener('input', (e) => {
        const activePillarBtn = this.dom.codexPillars?.querySelector('.filter-pill.active');
        const pillar = activePillarBtn ? activePillarBtn.getAttribute('data-pillar-id') : 'all';
        this.renderCodexArchive(pillar, e.target.value);
      });
    }

    if (this.dom.mementoAgeInput) {
      this.dom.mementoAgeInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        this.renderMementoMori(val);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.nextQuote();
      } else if (e.key === 'm' || e.key === 'M') {
        this.toggleAudio();
      } else if (e.key === 'b' || e.key === 'B') {
        this.openModal('modal-breathing');
      } else if (e.key === 'd' || e.key === 'D') {
        this.openModal('modal-dichotomy');
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHud();
      } else if (e.key === '1') {
        this.setFormation('citadel');
      } else if (e.key === '2') {
        this.setFormation('bust');
      } else if (e.key === '3') {
        this.setFormation('logos');
      } else if (e.key === '4') {
        this.setFormation('dichotomy');
      } else if (e.key === 'Escape') {
        this.closeAllModals();
        this.dom.drawerPanel?.classList.remove('open');
      }
    });

    // Sound effects on hover for cyber buttons
    document.querySelectorAll('.cyber-btn, .formation-btn, .filter-pill').forEach(el => {
      el.addEventListener('mouseenter', () => stoicAudio.playHover());
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  const app = new CyberStoicApp();
  app.init();
  window.cyberStoicApp = app;
});
