/**
 * Stoa Poikile — Main Application Controller
 * Wires 3D World, Controls, Audio, HUD, Minimap, and Interactive Exercises
 */

import { STOIC_DATA } from './stoic-data.js';
import { audio } from './audio.js';
import { StoicWorld } from './world.js';
import { StoicControls } from './controls.js';

class StoicApp {
  constructor() {
    this.world = null;
    this.controls = null;
    this.audio = audio;
    this.data = STOIC_DATA;

    // State
    this.currentLocationId = "rotunda";
    this.isZenMode = false;
    this.activeModal = null;
    this.dichotomyIndex = 0;
    this.dichotomyScore = { correct: 0, total: 0 };
    this.currentOracleQuote = null;

    // Minimap Canvas
    this.minimapCanvas = document.getElementById("minimap-canvas");
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext("2d") : null;

    this.init();
  }

  init() {
    const container = document.getElementById("canvas-container");
    this.world = new StoicWorld(container);

    // Initialize controls
    this.controls = new StoicControls(
      this.world.camera,
      this.world.renderer.domElement,
      (locId, title, caption) => this.onLocationUpdated(locId, title, caption)
    );

    // Setup HUD & Modals
    this._bindModeButtons();
    this._bindAtmosphereButtons();
    this._bindAudioControls();
    this._bindFastTravel();
    this._bindToolModals();
    this._bindDichotomyGame();
    this._bindForgeTool();
    this._bindMementoTool();
    this._bindOracleTool();
    this._bindExamenTool();
    this._bindCodexTool();
    this._bindKeyboardShortcuts();
    this._bindRaycastingClicks();

    // Start 60fps Loop
    this.animate();

    // Initial tool setup
    this.drawOracleQuote();
    this.renderMementoMori(30);
    this.loadExamenJournal();
  }

  // Handle Location changes triggered by controls or 3D clicks
  onLocationUpdated(locId, title, caption) {
    this.currentLocationId = locId;

    // Update bottom travel buttons
    document.querySelectorAll(".travel-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-dest") === locId);
    });

    // Update zone label
    const zoneLabel = document.getElementById("current-zone-label");
    if (zoneLabel) zoneLabel.innerText = title;

    // Update Tour caption if provided
    const captionBar = document.getElementById("tour-caption-bar");
    const captionTitle = document.getElementById("tour-caption-title");
    const captionText = document.getElementById("tour-caption-text");

    if (caption && captionBar) {
      captionTitle.innerText = title;
      captionText.innerText = caption;
      captionBar.style.display = "block";
    } else if (captionBar && this.controls.mode !== "tour") {
      captionBar.style.display = "none";
    }

    // Play subtle location chime
    this.audio.playTempleChime(1.0);
  }

  // 1. Camera Mode Buttons (Walk, Orbit, Tour, Cosmic)
  _bindModeButtons() {
    const btnWalk = document.getElementById("btn-mode-walk");
    const btnOrbit = document.getElementById("btn-mode-orbit");
    const btnTour = document.getElementById("btn-mode-tour");
    const btnCosmic = document.getElementById("btn-mode-cosmic");

    const updateModeUI = (mode) => {
      [btnWalk, btnOrbit, btnTour, btnCosmic].forEach(btn => btn.classList.remove("active"));
      if (mode === "walk") btnWalk.classList.add("active");
      if (mode === "orbit") btnOrbit.classList.add("active");
      if (mode === "tour") btnTour.classList.add("active");
      if (mode === "cosmic") btnCosmic.classList.add("active");

      const captionBar = document.getElementById("tour-caption-bar");
      if (captionBar && mode !== "tour" && mode !== "cosmic") {
        captionBar.style.display = "none";
      }
    };

    btnWalk.addEventListener("click", () => {
      this.controls.setMode("walk");
      updateModeUI("walk");
      this.audio.playWaterDrop();
    });

    btnOrbit.addEventListener("click", () => {
      this.controls.setMode("orbit");
      updateModeUI("orbit");
      this.audio.playWaterDrop();
    });

    btnTour.addEventListener("click", () => {
      this.controls.setMode("tour");
      updateModeUI("tour");
      this.audio.playVirtueChime(0);
    });

    btnCosmic.addEventListener("click", () => {
      this.controls.toggleCosmicView();
      updateModeUI(this.controls.mode);
      this.audio.playVirtueChime(3);
    });
  }

  // 2. Atmosphere Time-of-Day Buttons (Dawn, Noon, Dusk, Night)
  _bindAtmosphereButtons() {
    const buttons = document.querySelectorAll(".atmo-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const atmoKey = btn.getAttribute("data-atmo");
        this.world.setAtmosphere(atmoKey);
        this.audio.playWaterDrop();
      });
    });
  }

  // 3. Audio & Soundscape Controls
  _bindAudioControls() {
    const audioBtn = document.getElementById("btn-audio-toggle");
    const audioIcon = document.getElementById("audio-icon");

    audioBtn.addEventListener("click", () => {
      if (!this.audio.isPlayingAmbience) {
        this.audio.startAmbience();
        audioBtn.classList.add("active");
        audioIcon.innerText = "🔊 Sound ON";
      } else {
        const isMuted = this.audio.toggleMute();
        audioBtn.classList.toggle("active", !isMuted);
        audioIcon.innerText = isMuted ? "🔇 Muted" : "🔊 Sound ON";
      }
    });

    // Auto start Web Audio context on first click anywhere
    const onFirstUserGesture = () => {
      this.audio.resumeContext();
      window.removeEventListener("click", onFirstUserGesture);
      window.removeEventListener("keydown", onFirstUserGesture);
    };
    window.addEventListener("click", onFirstUserGesture);
    window.addEventListener("keydown", onFirstUserGesture);
  }

  // 4. Bottom Navigation Fast Travel
  _bindFastTravel() {
    const travelBtns = document.querySelectorAll(".travel-btn");
    travelBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const dest = btn.getAttribute("data-dest");
        this.controls.fastTravelTo(dest);
        this.audio.playWaterDrop();
      });
    });
  }

  // 5. Raycasting Click Interactions on 3D Shrines
  _bindRaycastingClicks() {
    const container = this.world.renderer.domElement;
    let downTime = 0;
    let downPos = { x: 0, y: 0 };

    container.addEventListener("mousedown", (e) => {
      downTime = Date.now();
      downPos = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener("mouseup", (e) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      const duration = Date.now() - downTime;

      // Only trigger if it was a quick click, not a camera drag
      if (dist < 6 && duration < 300) {
        const rect = container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const hitVirtueId = this.world.checkIntersection(mouse);
        if (hitVirtueId) {
          if (hitVirtueId === this.currentLocationId) {
            this.openVirtueModal(hitVirtueId);
          } else {
            this.controls.fastTravelTo(hitVirtueId);
          }
        }
      }
    });
  }

  // 6. Modal Dialogs Management
  _bindToolModals() {
    const modals = [
      { btn: "btn-open-dichotomy", modal: "modal-dichotomy" },
      { btn: "btn-open-memento", modal: "modal-memento" },
      { btn: "btn-open-forge", modal: "modal-forge" },
      { btn: "btn-open-oracle", modal: "modal-oracle" },
      { btn: "btn-open-examen", modal: "modal-examen" },
      { btn: "btn-open-codex", modal: "modal-codex" },
      { btn: "btn-help", modal: "modal-help" }
    ];

    modals.forEach(({ btn, modal }) => {
      const btnEl = document.getElementById(btn);
      const modalEl = document.getElementById(modal);
      if (btnEl && modalEl) {
        btnEl.addEventListener("click", () => {
          this.openModal(modalEl);
          this.audio.playTempleChime(1.2);
        });
      }
    });

    // Close buttons on all modals
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-overlay");
        if (modal) this.closeModal(modal);
      });
    });

    // Close modal when clicking dark backdrop
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeModal(overlay);
      });
    });
  }

  openModal(modalEl) {
    if (this.activeModal) this.closeModal(this.activeModal);
    modalEl.classList.add("open");
    this.activeModal = modalEl;
  }

  closeModal(modalEl) {
    modalEl.classList.remove("open");
    this.activeModal = null;
    this.audio.playWaterDrop();
  }

  // Open Virtue Shrine Detailed Modal
  openVirtueModal(virtueId) {
    const virtue = this.data.virtues.find(v => v.id === virtueId);
    if (!virtue) return;

    const modal = document.getElementById("modal-virtue");
    document.getElementById("virtue-modal-title").innerText = virtue.title;
    document.getElementById("virtue-modal-greek").innerText = virtue.greek;

    const tabContent = document.getElementById("virtue-tab-content");
    const renderTab = (tabName) => {
      if (tabName === "essence") {
        tabContent.innerHTML = `
          <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.55;margin-bottom:16px;">
            ${virtue.desc}
          </p>
          <div class="quote-card">
            <p>"${virtue.quote.text}"</p>
            <span class="quote-author">${virtue.quote.author} <span class="quote-source">${virtue.quote.source}</span></span>
          </div>
        `;
      } else if (tabName === "tenets") {
        tabContent.innerHTML = `
          <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:12px;">
            ${virtue.tenets.map(t => `
              <li style="background:rgba(255,255,255,0.03);border-left:2px solid ${virtue.color};padding:12px 16px;border-radius:0 6px 6px 0;line-height:1.45;">
                ${t}
              </li>
            `).join("")}
          </ul>
        `;
      } else if (tabName === "exercise") {
        tabContent.innerHTML = `
          <div style="background:rgba(255,255,255,0.03);border-radius:8px;padding:16px;">
            <h4 style="color:${virtue.color};margin-bottom:8px;">Sanctuary Daily Exercise</h4>
            <p style="color:var(--text-muted);line-height:1.5;">
              Stand before this monument for three deep breaths. Inhale the logos of reason; exhale the turbulence of unchecked desire. Focus your will on what lies squarely in your hands today.
            </p>
          </div>
        `;
      }
    };

    renderTab("essence");

    // Modal Tabs
    const tabBtns = modal.querySelectorAll(".modal-tab-btn");
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTab(btn.getAttribute("data-tab"));
      };
    });

    this.openModal(modal);
    this.audio.playVirtueChime(1);
  }

  // 7. Dichotomy of Control Interactive Exercise Game
  _bindDichotomyGame() {
    const scenarioText = document.getElementById("dichotomy-scenario-text");
    const counter = document.getElementById("dichotomy-counter");
    const btnIn = document.getElementById("btn-choice-in");
    const btnOut = document.getElementById("btn-choice-out");
    const feedbackBox = document.getElementById("dichotomy-feedback-box");
    const feedbackTitle = document.getElementById("dichotomy-feedback-title");
    const feedbackText = document.getElementById("dichotomy-feedback-text");
    const btnNext = document.getElementById("btn-dichotomy-next");

    const updateCard = () => {
      const item = this.data.dichotomyItems[this.dichotomyIndex];
      if (!item) return;
      scenarioText.innerText = `"${item.text}"`;
      counter.innerText = `SCENARIO ${this.dichotomyIndex + 1} OF ${this.data.dichotomyItems.length}`;
      feedbackBox.style.display = "none";
      btnIn.disabled = false;
      btnOut.disabled = false;
    };

    const handleChoice = (isChoiceIn) => {
      const item = this.data.dichotomyItems[this.dichotomyIndex];
      const isCorrect = isChoiceIn === item.inControl;

      this.dichotomyScore.total++;
      if (isCorrect) this.dichotomyScore.correct++;

      feedbackTitle.innerText = isCorrect ? "✓ Mastered! Stoic Reason Upheld" : "⚠️ Notice the Impasse";
      feedbackTitle.style.color = isCorrect ? "var(--emerald)" : "var(--gold)";
      feedbackText.innerText = item.reason;
      feedbackBox.style.display = "block";

      btnIn.disabled = true;
      btnOut.disabled = true;

      if (isCorrect) {
        this.audio.playVirtueChime(2);
      } else {
        this.audio.playWaterDrop();
      }
    };

    btnIn.addEventListener("click", () => handleChoice(true));
    btnOut.addEventListener("click", () => handleChoice(false));

    btnNext.addEventListener("click", () => {
      this.dichotomyIndex = (this.dichotomyIndex + 1) % this.data.dichotomyItems.length;
      updateCard();
      this.audio.playWaterDrop();
    });

    updateCard();
  }

  // 8. Amor Fati Crucible Forge Tool
  _bindForgeTool() {
    const input = document.getElementById("forge-input");
    const btnIgnite = document.getElementById("btn-ignite-forge");
    const outputBox = document.getElementById("forge-output-box");
    const outputText = document.getElementById("forge-transmuted-text");

    btnIgnite.addEventListener("click", () => {
      const val = input.value.trim();
      if (!val) {
        input.focus();
        return;
      }

      this.audio.playForgeIgnite();

      // Stoic transmutation responses based on Marcus Aurelius Meditations V.20
      const reflections = [
        `You wrote: "${val}". In the fire of Logos, this obstacle is not an obstruction to your purpose, but the exact material of your practice. It gives you the opportunity to exercise unshakeable patience, composure, and razor-sharp clarity.`,
        `Regarding "${val}": Fate has dealt this tile into your hand. Do not curse the dealer or wish for different tiles. Play this hand with supreme virtue and artistic mastery.`,
        `"${val}" belongs to external events. Your inner citadel remains completely untouched. What harms you is never the occurrence itself, but the opinion you construct about it. Discard the opinion, and the harm vanishes.`
      ];

      const chosen = reflections[Math.floor(Math.random() * reflections.length)];
      outputText.innerText = chosen;
      outputBox.style.display = "block";
    });
  }

  // 9. Memento Mori Sandbox Tool
  _bindMementoTool() {
    const ageInput = document.getElementById("memento-age-input");
    const btnRecalc = document.getElementById("btn-recalc-memento");

    btnRecalc.addEventListener("click", () => {
      const age = parseInt(ageInput.value, 10) || 30;
      this.renderMementoMori(age);
      this.audio.playTempleChime(0.9);
    });
  }

  renderMementoMori(age) {
    const grid = document.getElementById("life-weeks-grid");
    const stats = document.getElementById("memento-stats");
    if (!grid || !stats) return;

    const totalWeeks = 80 * 52; // 4,160 weeks
    const livedWeeks = Math.min(totalWeeks, Math.floor(age * 52.14));
    const remainingWeeks = totalWeeks - livedWeeks;
    const percentage = ((livedWeeks / totalWeeks) * 100).toFixed(1);

    stats.innerText = `Age ${age} · Lived: ${livedWeeks.toLocaleString()} weeks (${percentage}%) · Remaining: ~${remainingWeeks.toLocaleString()} weeks`;

    // Render sample representative 520 blocks (each block = 8 weeks for fast DOM performance)
    grid.innerHTML = "";
    const sampleCount = 520;
    const sampleLived = Math.floor((livedWeeks / totalWeeks) * sampleCount);

    const frag = document.createDocumentFragment();
    for (let i = 0; i < sampleCount; i++) {
      const box = document.createElement("div");
      box.className = `life-week-box ${i < sampleLived ? "lived" : ""}`;
      frag.appendChild(box);
    }
    grid.appendChild(frag);
  }

  // 10. Stoic Oracle & Quote Browser
  _bindOracleTool() {
    const btnRandom = document.getElementById("btn-oracle-random");
    const btnCopy = document.getElementById("btn-oracle-copy");

    btnRandom.addEventListener("click", () => {
      this.drawOracleQuote();
      this.audio.playVirtueChime(3);
    });

    btnCopy.addEventListener("click", () => {
      if (this.currentOracleQuote) {
        const text = `"${this.currentOracleQuote.text}" — ${this.currentOracleQuote.author} (${this.currentOracleQuote.source})`;
        navigator.clipboard.writeText(text).then(() => {
          btnCopy.innerText = "✓ Copied!";
          setTimeout(() => { btnCopy.innerText = "📋 Copy Quote"; }, 2000);
        });
      }
    });
  }

  drawOracleQuote() {
    const quotes = this.data.quotes;
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    this.currentOracleQuote = q;

    const display = document.getElementById("oracle-quote-display");
    const reflection = document.getElementById("oracle-reflection-text");

    if (display) {
      display.innerHTML = `
        <p>"${q.text}"</p>
        <span class="quote-author">${q.author} <span class="quote-source">${q.source}</span></span>
      `;
    }
    if (reflection) {
      reflection.innerText = q.reflection;
    }
  }

  // 11. Evening Examen Journal Tool
  _bindExamenTool() {
    const btnSave = document.getElementById("btn-save-examen");
    const status = document.getElementById("examen-save-status");

    btnSave.addEventListener("click", () => {
      const q1 = document.getElementById("examen-q1").value.trim();
      const q2 = document.getElementById("examen-q2").value.trim();
      const q3 = document.getElementById("examen-q3").value.trim();

      const entry = {
        date: new Date().toISOString(),
        q1, q2, q3
      };

      try {
        localStorage.setItem("stoic_examen_latest", JSON.stringify(entry));
        status.innerText = "✓ Saved to local journal";
        this.audio.playVirtueChime(2);
        setTimeout(() => { status.innerText = ""; }, 3000);
      } catch (e) {
        console.warn("Storage full or blocked", e);
      }
    });
  }

  loadExamenJournal() {
    try {
      const saved = localStorage.getItem("stoic_examen_latest");
      if (saved) {
        const entry = JSON.parse(saved);
        if (entry.q1) document.getElementById("examen-q1").value = entry.q1;
        if (entry.q2) document.getElementById("examen-q2").value = entry.q2;
        if (entry.q3) document.getElementById("examen-q3").value = entry.q3;
      }
    } catch (e) {
      // Ignore
    }
  }

  // 12. Philosopher Codex Tool
  _bindCodexTool() {
    const tabsContainer = document.getElementById("codex-tabs");
    const contentDisplay = document.getElementById("codex-content-display");
    if (!tabsContainer || !contentDisplay) return;

    tabsContainer.innerHTML = "";
    this.data.philosophers.forEach((p, idx) => {
      const btn = document.createElement("button");
      btn.className = `modal-tab-btn ${idx === 0 ? "active" : ""}`;
      btn.innerText = `${p.image} ${p.name.split(" ")[0]}`;
      btn.onclick = () => {
        tabsContainer.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderPhilosopher(p);
        this.audio.playWaterDrop();
      };
      tabsContainer.appendChild(btn);
    });

    const renderPhilosopher = (p) => {
      contentDisplay.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
          <div style="font-size:2.5rem;">${p.image}</div>
          <div>
            <h3 style="font-family:var(--font-serif);color:#fff;font-size:1.2rem;">${p.name}</h3>
            <div style="font-size:0.78rem;color:var(--gold);font-family:var(--font-mono);">${p.title}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${p.role}</div>
          </div>
        </div>
        <p style="color:var(--text-muted);line-height:1.55;font-size:0.9rem;margin-bottom:16px;">
          ${p.bio}
        </p>
        <div class="quote-card">
          <p>"${p.quote}"</p>
        </div>
        <div style="margin-top:14px;font-size:0.8rem;color:var(--cyan);font-family:var(--font-mono);">
          <strong>Key Works:</strong> ${p.keyWorks.join(", ")}
        </div>
      `;
    };

    renderPhilosopher(this.data.philosophers[0]);
  }

  // 13. Keyboard Shortcuts & Zen Mode
  _bindKeyboardShortcuts() {
    const zenBtn = document.getElementById("btn-zen-mode");

    const toggleZen = () => {
      this.isZenMode = !this.isZenMode;
      document.getElementById("hud-layer").classList.toggle("zen-mode", this.isZenMode);
      zenBtn.classList.toggle("active", this.isZenMode);
    };

    zenBtn.addEventListener("click", toggleZen);

    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "KeyZ") {
        toggleZen();
      } else if (e.code === "Escape") {
        if (this.activeModal) {
          this.closeModal(this.activeModal);
        } else if (this.isZenMode) {
          toggleZen();
        }
      }
    });
  }

  // 14. Minimap Radar Rendering
  drawMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = w / 110; // World is -50 to +50 units

    ctx.clearRect(0, 0, w, h);

    // Outer boundary ring
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.stroke();

    // Cross Avenues
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.beginPath();
    ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10);
    ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // Central Rotunda Ring
    ctx.fillStyle = "rgba(226, 232, 240, 0.2)";
    ctx.beginPath();
    ctx.arc(cx, cy, 10 * scale, 0, Math.PI * 2);
    ctx.fill();

    // 4 Shrines dots
    const shrines = [
      { x: 0, z: -35, color: "#38bdf8" }, // Wisdom
      { x: -35, z: 0, color: "#f59e0b" }, // Courage
      { x: 35, z: 0, color: "#10b981" },  // Justice
      { x: 0, z: 35, color: "#a855f7" }   // Temperance
    ];

    shrines.forEach(s => {
      const sx = cx + s.x * scale;
      const sy = cy + s.z * scale;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player position and vision cone
    const cam = this.world.camera;
    const px = cx + cam.position.x * scale;
    const py = cy + cam.position.z * scale;

    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    const angle = Math.atan2(dir.x, dir.z);

    // Vision cone
    ctx.fillStyle = "rgba(245, 158, 11, 0.25)";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, 18, angle - 0.4, angle + 0.4);
    ctx.closePath();
    ctx.fill();

    // Player dot
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Update telemetry coordinates text
    const coordsEl = document.getElementById("player-coords");
    if (coordsEl) {
      coordsEl.innerText = `${Math.round(cam.position.x)}, ${Math.round(cam.position.z)}`;
    }
  }

  // 15. Main Animation Loop
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.world.clock.getDelta();
    this.controls.update(delta);
    this.world.render();
    this.drawMinimap();
  }
}

// Start App when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  window.stoicApp = new StoicApp();
});
