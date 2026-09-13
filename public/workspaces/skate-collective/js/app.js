/**
 * OBSIDIAN OATH // SKATE COLLECTIVE — MAIN INTERACTIVE APPLICATION ENGINE
 * Features:
 * - Dynamic Canvas VHS Tape Player with real-time procedural skate sequence render & audio sync
 * - Interactive Spot Radar with filter, live search, and GPS coordinate clipboard copy
 * - Interactive Drag-and-Drop Sticker Wall with sound synthesis, custom text stamps & localStorage persistence
 * - Full-Featured Keyboard-Accessible Photo Lightbox with EXIF metadata
 * - Terminal Submissions & Encrypted PGP drop point simulator
 * - Toast notification manager & accessibility focus handlers
 */

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================
class ToastSystem {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  }

  show(message, duration = 3200) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<span style="color: var(--gold-primary); font-weight: bold; margin-right: 6px;">[•]</span> ${message}`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

window.toast = new ToastSystem();

// ============================================================================
// VHS / RAW STREET TAPE CANVAS PLAYER
// ============================================================================
class VhsTapePlayer {
  constructor() {
    this.canvas = document.getElementById('vhs-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.isPlaying = true;
    this.currentTime = 14.2;
    this.duration = 184.0; // 3m 04s
    this.currentTapeIndex = 0;
    this.scanlinesEnabled = true;

    this.tapes = [
      {
        id: 'tape-1',
        title: 'TAPE 01: MIDNIGHT CURBS // DOWNTOWN',
        location: 'FINANCIAL DISTRICT LEDGES',
        skater: 'MALIK VANCE & SORA LIN',
        format: 'SONY DCR-VX1000 // MK1 FISHEYE',
        duration: 184.0,
        bpm: 92,
        bookmarks: [
          { time: 14.2, label: '0:14 — Switch Heel Over Can', trick: 'pop' },
          { time: 48.6, label: '0:48 — BS Smith 180 Out', trick: 'grind' },
          { time: 92.1, label: '1:32 — Line: Ollie Up + Tre Down', trick: 'pop' },
          { time: 140.5, label: '2:20 — 50-50 Kinked Red Rail', trick: 'grind' }
        ]
      },
      {
        id: 'tape-2',
        title: 'TAPE 02: THE VAULT KINK // NIGHT SHIFT',
        location: 'MUNICIPAL PLAZA 8-STAIR',
        skater: 'NIKO BELLIC & KAELEN REED',
        format: 'PANASONIC HVX200 // OPTEKA 72MM',
        duration: 215.0,
        bpm: 88,
        bookmarks: [
          { time: 22.0, label: '0:22 — Hardflip 8-Stair', trick: 'pop' },
          { time: 76.4, label: '1:16 — FS Feeble Long Rail', trick: 'grind' },
          { time: 135.0, label: '2:15 — Security Chase Fast Cut', trick: 'pop' }
        ]
      },
      {
        id: 'tape-3',
        title: 'TAPE 03: UNDERPASS RAW CUT // DITCH SESH',
        location: 'CANAL BRUTALIST DITCH',
        skater: 'OBSIDIAN ROSTER SQUAD',
        format: 'CANON GL2 // CENTURY DEATH LENS',
        duration: 160.0,
        bpm: 96,
        bookmarks: [
          { time: 18.3, label: '0:18 — Blunt Fakie Wallride', trick: 'grind' },
          { time: 64.0, label: '1:04 — Nollie Inward Heel Bank', trick: 'pop' },
          { time: 112.5, label: '1:52 — 360 Boneless Over Gap', trick: 'pop' }
        ]
      },
      {
        id: 'tape-4',
        title: 'TAPE 04: RAIN SESH & PARK DECK SLAPS',
        location: 'COVERED TRANSIT TERMINAL',
        skater: 'SORA LIN & SPECIAL GUEST',
        format: 'SONY TRV-900 // HI8 ARCHIVE',
        duration: 195.0,
        bpm: 85,
        bookmarks: [
          { time: 12.0, label: '0:12 — Slappy Crooked Waxed Curb', trick: 'grind' },
          { time: 85.2, label: '1:25 — Fakie Bigspin Heel', trick: 'pop' }
        ]
      }
    ];

    this.init();
  }

  init() {
    this.canvas.width = 1280;
    this.canvas.height = 720;
    
    // Bind buttons
    this.playBtn = document.getElementById('vhs-play-btn');
    this.timelineBar = document.getElementById('vhs-timeline-bar');
    this.timelineFill = document.getElementById('vhs-timeline-fill');
    this.timeDisplay = document.getElementById('vhs-time-display');
    this.scanlineBtn = document.getElementById('vhs-scanline-toggle');
    this.scanlineOverlay = document.getElementById('vhs-scanlines-layer');
    this.tapeTitleElem = document.getElementById('vhs-current-title');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.timelineBar) {
      this.timelineBar.addEventListener('click', (e) => {
        const rect = this.timelineBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.seek(pos * this.duration);
      });
    }

    if (this.scanlineBtn && this.scanlineOverlay) {
      this.scanlineBtn.addEventListener('click', () => {
        this.scanlinesEnabled = !this.scanlinesEnabled;
        if (this.scanlinesEnabled) {
          this.scanlineOverlay.classList.remove('disabled');
          this.scanlineBtn.textContent = 'CRT: ON';
        } else {
          this.scanlineOverlay.classList.add('disabled');
          this.scanlineBtn.textContent = 'CRT: OFF';
        }
        if (window.skateAudio) window.skateAudio.playTapeClick();
      });
    }

    // Playlist items
    const playlistItems = document.querySelectorAll('.tape-item');
    playlistItems.forEach((item, index) => {
      item.addEventListener('click', () => this.switchTape(index));
    });

    // Trick pills
    this.renderBookmarks();

    // Start render loop
    this.lastFrameTime = performance.now();
    this.renderLoop = this.renderLoop.bind(this);
    requestAnimationFrame(this.renderLoop);
  }

  switchTape(index) {
    if (index < 0 || index >= this.tapes.length) return;
    this.currentTapeIndex = index;
    this.currentTime = 0;
    this.duration = this.tapes[index].duration;
    
    // Update active playlist UI
    document.querySelectorAll('.tape-item').forEach((el, idx) => {
      if (idx === index) el.classList.add('active');
      else el.classList.remove('active');
    });

    if (this.tapeTitleElem) {
      this.tapeTitleElem.textContent = this.tapes[index].title;
    }

    this.renderBookmarks();
    if (window.skateAudio) {
      window.skateAudio.playTapeClick();
      window.skateAudio.playDeckPop();
    }
    window.toast.show(`Loaded tape: ${this.tapes[index].title}`);
  }

  renderBookmarks() {
    const list = document.getElementById('trick-bookmarks-list');
    if (!list) return;
    list.innerHTML = '';
    const tape = this.tapes[this.currentTapeIndex];
    tape.bookmarks.forEach(bm => {
      const btn = document.createElement('button');
      btn.className = 'trick-pill';
      btn.type = 'button';
      btn.textContent = bm.label;
      btn.addEventListener('click', () => {
        this.seek(bm.time);
        if (window.skateAudio) {
          if (bm.trick === 'grind') window.skateAudio.playGrindSound();
          else window.skateAudio.playDeckPop();
        }
        window.toast.show(`Scrubbed to trick timestamp: ${bm.label}`);
      });
      list.appendChild(btn);
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying 
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' 
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      this.playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause Video' : 'Play Video');
    }
    if (window.skateAudio) window.skateAudio.playTapeClick();
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(this.duration, time));
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  }

  renderLoop(now) {
    const dt = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    if (this.isPlaying) {
      this.currentTime += dt;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
      }
    }

    // Update timeline UI
    if (this.timelineFill) {
      const pct = (this.currentTime / this.duration) * 100;
      this.timelineFill.style.width = `${pct}%`;
    }
    if (this.timeDisplay) {
      this.timeDisplay.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}`;
    }

    this.drawFrame(now);
    requestAnimationFrame(this.renderLoop);
  }

  drawFrame(timeMs) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const tape = this.tapes[this.currentTapeIndex];
    const t = this.currentTime;

    // 1. Dark Urban Background
    ctx.fillStyle = '#08080c';
    ctx.fillRect(0, 0, w, h);

    // Procedural Brutalist Architecture Background
    ctx.fillStyle = '#101018';
    ctx.fillRect(0, h * 0.45, w, h * 0.55);

    // Distant city buildings silhouette
    ctx.fillStyle = '#141420';
    for (let i = 0; i < 15; i++) {
      const bx = i * 90;
      const bw = 70;
      const bh = 140 + Math.sin(i * 3) * 60;
      ctx.fillRect(bx, h * 0.45 - bh, bw, bh);
      // Small yellow window dots
      ctx.fillStyle = (i % 2 === 0) ? '#fbbf24' : '#52525b';
      for (let wy = h * 0.45 - bh + 20; wy < h * 0.45; wy += 25) {
        for (let wx = bx + 12; wx < bx + bw - 10; wx += 16) {
          if (Math.sin(wx + wy) > 0.2) {
            ctx.fillRect(wx, wy, 4, 6);
          }
        }
      }
      ctx.fillStyle = '#141420';
    }

    // Concrete Ledge / Stair Set
    const stairX = w * 0.55;
    const stairY = h * 0.62;
    ctx.fillStyle = '#1e1e2c';
    ctx.beginPath();
    ctx.moveTo(stairX - 250, stairY + 120);
    ctx.lineTo(stairX + 350, stairY - 80);
    ctx.lineTo(stairX + 350, stairY - 40);
    ctx.lineTo(stairX - 250, stairY + 160);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Handrail
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(stairX - 220, stairY + 70);
    ctx.lineTo(stairX + 320, stairY - 130);
    ctx.stroke();
    // Rail posts
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#a1a1aa';
    ctx.beginPath();
    ctx.moveTo(stairX - 180, stairY + 85);
    ctx.lineTo(stairX - 180, stairY + 140);
    ctx.moveTo(stairX + 50, stairY - 10);
    ctx.lineTo(stairX + 50, stairY + 40);
    ctx.moveTo(stairX + 280, stairY - 110);
    ctx.lineTo(stairX + 280, stairY - 60);
    ctx.stroke();

    // 2. Animated Skater Simulation
    const cycle = (t * 0.8) % 3; // 3-second trick cycle
    let skaterX, skaterY, boardAngle, skaterPose;

    if (cycle < 1.0) {
      // Run-up speed
      const prog = cycle / 1.0;
      skaterX = 200 + prog * 300;
      skaterY = h * 0.65 - Math.sin(prog * Math.PI * 4) * 4;
      boardAngle = 0;
      skaterPose = 'push';
    } else if (cycle < 2.0) {
      // Pop & Air over rail/stair
      const prog = (cycle - 1.0) / 1.0;
      skaterX = 500 + prog * 450;
      const jumpArc = Math.sin(prog * Math.PI) * 160;
      skaterY = h * 0.65 - jumpArc - (prog * 60);
      boardAngle = prog * Math.PI * 2 * (this.currentTapeIndex % 2 === 0 ? 1 : -1);
      skaterPose = 'air';
    } else {
      // Land & Roll away
      const prog = (cycle - 2.0) / 1.0;
      skaterX = 950 + prog * 280;
      skaterY = h * 0.60 + Math.sin(prog * Math.PI * 6) * 3;
      boardAngle = 0;
      skaterPose = 'land';
    }

    // Draw Skateboard
    ctx.save();
    ctx.translate(skaterX, skaterY + 30);
    ctx.rotate(boardAngle);
    
    // Deck
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(-45, -6, 90, 10, 4);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Wheels
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-30, 8, 5, 0, Math.PI * 2);
    ctx.arc(30, 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Skater Figure (Minimalist High-Contrast Silhouette with Gold Highlights)
    ctx.save();
    ctx.translate(skaterX, skaterY);

    // Head / Beanie
    ctx.fillStyle = '#f4f4f5';
    ctx.beginPath();
    ctx.arc(0, -55, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-10, -68, 20, 8); // Beanie

    // Torso / Baggy Hoodie
    ctx.fillStyle = '#0f0f15';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -42);
    ctx.lineTo(16, -42);
    ctx.lineTo(22, -10);
    ctx.lineTo(-22, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arms
    ctx.strokeStyle = '#f4f4f5';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    if (skaterPose === 'air') {
      ctx.beginPath();
      ctx.moveTo(-16, -40);
      ctx.lineTo(-38, -55);
      ctx.moveTo(16, -40);
      ctx.lineTo(40, -45);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-16, -38);
      ctx.lineTo(-26, -18);
      ctx.moveTo(16, -38);
      ctx.lineTo(26, -20);
      ctx.stroke();
    }

    // Baggy Cargo Pants / Legs
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    if (skaterPose === 'air') {
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-12, 28);
      ctx.moveTo(10, -10);
      ctx.lineTo(20, 10);
      ctx.lineTo(16, 28);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(-15, 14);
      ctx.lineTo(-20, 30);
      ctx.moveTo(10, -10);
      ctx.lineTo(12, 14);
      ctx.lineTo(16, 30);
      ctx.stroke();
    }

    // Skate Shoes (Suede)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-26, 26, 16, 6);
    ctx.fillRect(10, 26, 16, 6);

    ctx.restore();

    // 3. VHS OSD / Fisheye Ring Simulation
    // Subtle fisheye vignette
    const vigGrad = ctx.createRadialGradient(w/2, h/2, h*0.4, w/2, h/2, h*0.75);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(0.85, 'rgba(0,0,0,0.4)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Tape Noise Bar (occasional tape tracking artifact)
    if (Math.random() < 0.15) {
      const ny = Math.random() * h;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
      ctx.fillRect(0, ny, w, 8 + Math.random() * 20);
    }

    // OSD HUD Text
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 20px "Space Grotesk", monospace';
    ctx.fillText(`PLAY ► ${tape.format}`, 36, 50);
    ctx.fillText(`LOC: ${tape.location}`, 36, 80);
    ctx.fillText(`RIDER: ${tape.skater}`, 36, 110);

    // Frame counter
    const frameNum = Math.floor(t * 30);
    ctx.font = '700 22px "Space Grotesk", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`TC: ${this.formatTime(t)} [F#${frameNum}]`, w - 320, 50);
    ctx.fillText(`SP 100% // NO AUDIO CUT`, w - 320, 80);
  }
}

// ============================================================================
// SPOT RADAR & INTERACTIVE SPOT DIRECTORY
// ============================================================================
class SpotRadar {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.searchInput = document.getElementById('spot-search');
    this.spotsGrid = document.getElementById('spots-grid');
    this.spotCards = document.querySelectorAll('.spot-card');

    this.currentFilter = 'all';
    this.searchQuery = '';

    this.init();
  }

  init() {
    // Filter click events
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter') || 'all';
        this.applyFilters();
        if (window.skateAudio) window.skateAudio.playTapeClick();
      });
    });

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // Coordinate copy buttons
    const coordBtns = document.querySelectorAll('.spot-coord-btn');
    coordBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const coords = btn.getAttribute('data-coords') || '40.7128 N, 74.0060 W';
        navigator.clipboard.writeText(coords).then(() => {
          window.toast.show(`Coordinates copied to clipboard: ${coords}`);
          if (window.skateAudio) window.skateAudio.playTapeClick();
        }).catch(() => {
          window.toast.show(`Coordinates: ${coords}`);
        });
      });
    });
  }

  applyFilters() {
    let visibleCount = 0;
    this.spotCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = card.querySelector('.spot-title')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.spot-desc')?.textContent?.toLowerCase() || '';
      const surface = card.querySelector('.spot-surface')?.textContent?.toLowerCase() || '';

      const matchesFilter = (this.currentFilter === 'all') || (category === this.currentFilter);
      const matchesSearch = !this.searchQuery || 
        title.includes(this.searchQuery) || 
        desc.includes(this.searchQuery) || 
        surface.includes(this.searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyMessage = document.getElementById('spots-empty-message');
    if (emptyMessage) {
      emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }
}

// ============================================================================
// INTERACTIVE STICKER WALL (SLAP BOARD)
// ============================================================================
class StickerWall {
  constructor() {
    this.board = document.getElementById('sticker-board');
    if (!this.board) return;

    this.trayItems = document.querySelectorAll('.sticker-tray-item');
    this.clearBtn = document.getElementById('clear-stickers-btn');
    this.exportBtn = document.getElementById('export-stickers-btn');
    this.customTextBtn = document.getElementById('add-custom-text-sticker-btn');
    this.customTextInput = document.getElementById('custom-sticker-text');

    this.stickers = [];
    this.activeDrag = null;
    this.storageKey = 'obsidian_skate_sticker_wall_v1';

    this.init();
  }

  init() {
    // Load from localStorage or seed defaults
    this.loadFromStorage();

    // Add stickers from tray
    this.trayItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const name = item.getAttribute('data-name') || 'STICKER';
        this.addSticker({
          type: 'image',
          src: src,
          name: name,
          x: 60 + Math.random() * (this.board.clientWidth - 200),
          y: 60 + Math.random() * (this.board.clientHeight - 200),
          rotation: (Math.random() * 40 - 20),
          scale: 1.0
        });
      });
    });

    // Custom text stamp
    if (this.customTextBtn && this.customTextInput) {
      this.customTextBtn.addEventListener('click', () => {
        const text = this.customTextInput.value.trim();
        if (!text) {
          window.toast.show('Please enter text for custom street stamp');
          return;
        }
        this.addSticker({
          type: 'text',
          text: text,
          x: 80 + Math.random() * (this.board.clientWidth - 240),
          y: 80 + Math.random() * (this.board.clientHeight - 180),
          rotation: (Math.random() * 30 - 15),
          scale: 1.0
        });
        this.customTextInput.value = '';
      });

      this.customTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.customTextBtn.click();
        }
      });
    }

    // Clear board
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.board.innerHTML = '';
        this.stickers = [];
        this.saveToStorage();
        if (window.skateAudio) window.skateAudio.playTapeClick();
        window.toast.show('Sticker wall cleared. Ready for fresh slaps.');
      });
    }

    // Export layout snapshot count
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => {
        window.toast.show(`Sticker wall snapshot saved! ${this.stickers.length} slaps active on the street board.`);
        if (window.skateAudio) window.skateAudio.playTapeClick();
      });
    }
  }

  loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(data => this.createStickerDOM(data));
          return;
        }
      } catch (e) {
        console.warn('Could not parse saved stickers', e);
      }
    }

    // Seed default slaps if empty
    const defaults = [
      { type: 'image', src: 'assets/stickers/hermetic_seal.svg', name: 'Hermetic Seal', x: 80, y: 70, rotation: -8, scale: 1.2 },
      { type: 'image', src: 'assets/stickers/death_lens.svg', name: 'Death Lens 8mm', x: 380, y: 140, rotation: 12, scale: 1.1 },
      { type: 'image', src: 'assets/stickers/raw_stamp.svg', name: 'Raw Street', x: 220, y: 260, rotation: -18, scale: 1.0 },
      { type: 'text', text: 'NO SPONSORS // NO MASTERS', x: 620, y: 80, rotation: 6, scale: 1.1 },
      { type: 'image', src: 'assets/stickers/broken_board.svg', name: 'Broken Board', x: 540, y: 240, rotation: -14, scale: 1.0 },
      { type: 'image', src: 'assets/stickers/void_ouroboros.svg', name: 'Void Serpent', x: 820, y: 190, rotation: 15, scale: 1.15 }
    ];

    defaults.forEach(d => this.addSticker(d, false));
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.stickers));
  }

  addSticker(data, save = true) {
    this.createStickerDOM(data);
    this.stickers.push(data);
    if (save) this.saveToStorage();

    if (window.skateAudio) {
      window.skateAudio.playStickerSlap();
    }
    window.toast.show(`Sticker slapped onto wall! [${data.name || data.text || 'STAMP'}]`);
  }

  createStickerDOM(data) {
    const el = document.createElement('div');
    el.className = 'slapped-sticker';
    el.style.left = `${data.x}px`;
    el.style.top = `${data.y}px`;
    el.style.transform = `rotate(${data.rotation || 0}deg) scale(${data.scale || 1.0})`;

    if (data.type === 'text') {
      el.innerHTML = `
        <div style="
          padding: 8px 14px;
          background: #000;
          color: #fbbf24;
          border: 2px dashed #fbbf24;
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 0.95rem;
          letter-spacing: 0.12em;
          box-shadow: 0 4px 15px rgba(0,0,0,0.8);
          white-space: nowrap;
        ">${data.text}</div>
      `;
    } else {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.name || 'Skate Sticker';
      img.style.width = '130px';
      img.style.height = '130px';
      img.style.display = 'block';
      el.appendChild(img);
    }

    // Drag-and-drop mechanics (Mouse & Touch)
    let isDragging = false;
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;

    const onPointerDown = (e) => {
      e.preventDefault();
      isDragging = true;
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      startX = clientX;
      startY = clientY;
      origLeft = el.offsetLeft;
      origTop = el.offsetTop;
      el.style.zIndex = '100';

      const onPointerMove = (ev) => {
        if (!isDragging) return;
        const curX = ev.clientX || (ev.touches && ev.touches[0].clientX);
        const curY = ev.clientY || (ev.touches && ev.touches[0].clientY);
        const dx = curX - startX;
        const dy = curY - startY;

        const boardRect = this.board.getBoundingClientRect();
        const newX = Math.max(0, Math.min(boardRect.width - el.offsetWidth, origLeft + dx));
        const newY = Math.max(0, Math.min(boardRect.height - el.offsetHeight, origTop + dy));

        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
        data.x = newX;
        data.y = newY;
      };

      const onPointerUp = () => {
        if (isDragging) {
          isDragging = false;
          el.style.zIndex = '10';
          this.saveToStorage();
          if (window.skateAudio) window.skateAudio.playTapeClick();
        }
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
      };

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove);
      window.addEventListener('touchend', onPointerUp);
    };

    el.addEventListener('mousedown', onPointerDown);
    el.addEventListener('touchstart', onPointerDown, { passive: false });

    // Double click to remove sticker
    el.addEventListener('dblclick', () => {
      el.remove();
      this.stickers = this.stickers.filter(s => s !== data);
      this.saveToStorage();
      if (window.skateAudio) window.skateAudio.playTapeClick();
      window.toast.show('Sticker peeled off wall.');
    });

    this.board.appendChild(el);
  }
}

// ============================================================================
// PHOTO GALLERY & LIGHTBOX
// ============================================================================
class PhotoLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.modal = document.getElementById('lightbox-modal');
    if (!this.modal) return;

    this.imgElem = document.getElementById('lightbox-img');
    this.titleElem = document.getElementById('lightbox-title');
    this.metaElem = document.getElementById('lightbox-meta');
    this.closeBtn = document.getElementById('lightbox-close-btn');
    this.prevBtn = document.getElementById('lightbox-prev-btn');
    this.nextBtn = document.getElementById('lightbox-next-btn');

    this.photos = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-caption-title')?.textContent || 'STREET FRAME';
      const meta = item.querySelector('.gallery-caption-meta')?.textContent || 'ARCHIVE';
      
      this.photos.push({
        src: img?.src || '',
        alt: img?.alt || title,
        title: title,
        meta: meta
      });

      item.addEventListener('click', () => this.open(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }

    // Backdrop click close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.navigate(-1);
      else if (e.key === 'ArrowRight') this.navigate(1);
    });
  }

  open(index) {
    if (index < 0 || index >= this.photos.length) return;
    this.currentIndex = index;
    this.updateContent();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (this.closeBtn) this.closeBtn.focus();
    if (window.skateAudio) window.skateAudio.playTapeClick();
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.skateAudio) window.skateAudio.playTapeClick();
  }

  navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.photos.length) % this.photos.length;
    this.updateContent();
    if (window.skateAudio) window.skateAudio.playTapeClick();
  }

  updateContent() {
    const photo = this.photos[this.currentIndex];
    if (!photo) return;
    if (this.imgElem) {
      this.imgElem.src = photo.src;
      this.imgElem.alt = photo.alt;
    }
    if (this.titleElem) {
      this.titleElem.textContent = `${photo.title} [FRAME ${this.currentIndex + 1}/${this.photos.length}]`;
    }
    if (this.metaElem) {
      this.metaElem.textContent = photo.meta;
    }
  }
}

// ============================================================================
// INTAKE & SUBMISSION TERMINAL
// ============================================================================
class IntakeTerminal {
  constructor() {
    this.form = document.getElementById('intake-form');
    this.tabBtns = document.querySelectorAll('.intake-tab-btn');
    this.typeInput = document.getElementById('intake-type-input');
    this.termOutput = document.getElementById('terminal-log-output');

    this.init();
  }

  init() {
    // Tab switching
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type') || 'spot';
        if (this.typeInput) this.typeInput.value = type;

        const labelSpot = document.getElementById('field-spot-coords');
        const labelClip = document.getElementById('field-clip-link');
        if (labelSpot && labelClip) {
          if (type === 'spot') {
            labelSpot.style.display = 'block';
            labelClip.style.display = 'none';
          } else if (type === 'tape') {
            labelSpot.style.display = 'none';
            labelClip.style.display = 'block';
          } else {
            labelSpot.style.display = 'none';
            labelClip.style.display = 'none';
          }
        }
        if (window.skateAudio) window.skateAudio.playTapeClick();
      });
    });

    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const alias = document.getElementById('intake-alias')?.value || 'ANONYMOUS';
        const notes = document.getElementById('intake-notes')?.value || '';
        const submissionId = 'SUB-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        const hash = '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');

        const logLine = `\n[${new Date().toISOString().substring(11, 19)}] PACKET RECEIVED > ${submissionId}\n├─ ALIAS: ${alias}\n├─ STATUS: VERIFIED & ENCRYPTED\n└─ HASH: ${hash}\n> Collective spot curators notified.\n`;

        if (this.termOutput) {
          this.termOutput.textContent += logLine;
          this.termOutput.scrollTop = this.termOutput.scrollHeight;
        }

        if (window.skateAudio) window.skateAudio.playDeckPop();
        window.toast.show(`Submission dispatched! Receipt ID: ${submissionId}`);
        this.form.reset();
      });
    }

    // PGP Copy Button
    const pgpBtn = document.getElementById('copy-pgp-btn');
    if (pgpBtn) {
      pgpBtn.addEventListener('click', () => {
        const keyText = `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: Obsidian-Hermetic-v3\nmQGNBGba...79F4-C38A-9012-OBSIDIAN-OATH\n-----END PGP PUBLIC KEY BLOCK-----`;
        navigator.clipboard.writeText(keyText).then(() => {
          window.toast.show('PGP Fingerprint copied to clipboard.');
          if (window.skateAudio) window.skateAudio.playTapeClick();
        });
      });
    }
  }
}

// ============================================================================
// MOBILE NAVIGATION & GENERAL SITE INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
      const expanded = mainNav.classList.contains('mobile-open');
      menuBtn.setAttribute('aria-expanded', expanded);
    });
  }

  // Initialize Subsystems
  window.vhsPlayer = new VhsTapePlayer();
  window.spotRadar = new SpotRadar();
  window.stickerWall = new StickerWall();
  window.photoLightbox = new PhotoLightbox();
  window.intakeTerminal = new IntakeTerminal();
});
