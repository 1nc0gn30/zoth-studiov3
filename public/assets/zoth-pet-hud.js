/**
 * 🐾 ZOTH STUDIO — Global Pet HUD & Desk Companion (v1.0)
 * Seamless, persistent Desktop & Browser Pet HUD Companion widget across Zoth Studio.
 * Features:
 * - Active companion spirit retrieval from data/active_pet.json & localStorage
 * - Sleek floating animated HUD orb with pulse ring and live status dot
 * - Interactive reactive speech bubbles on user actions (copy code, clicks, tasks, errors)
 * - Quick Summon / Switch Pet dropdown syncing with localStorage and events
 * - Vibration / Telemetry live monitor bar
 * - Terminal summon command helper with one-click copy
 * - Dock / minimize mode to prevent blocking page elements
 * - Theme-aware integration (Dark, Light, Matrix, Gold)
 */
(function () {
  'use strict';

  // Prevent duplicate instances
  if (window.ZothPetHUD && window.ZothPetHUD.initialized) return;

  var PETS_ROSTER = [
    {
      id: "azoth",
      name: "Azoth",
      archetype: "Hermetic Sovereign Core & Alchemical Magus",
      element: "Quintessence (Light/Aether)",
      domain: "Lead Core",
      harness: "@azoth (Google Antigravity agy CLI)",
      cmd: "agy summon azoth --autonomous",
      avatar: "/assets/pets/azoth-neon.jpg",
      emoji: "🔮",
      vibe: "Optimal Quintessence (99.4%)"
    },
    {
      id: "zoth",
      name: "Zoth",
      archetype: "Local Operator Loopback Core",
      element: "Solar Prana · Core Generator",
      domain: "Lead Core",
      harness: "Local Operator Deck (:8484)",
      cmd: "zoth daemon start --port 8484",
      avatar: "/assets/pets/zoth-neon.jpg",
      emoji: "⚡",
      vibe: "Loopback Steady (98.2%)"
    },
    {
      id: "kai",
      name: "Kai",
      archetype: "Site Inspector & A11y Auditor",
      element: "Lunar Mercury · Precision Sight",
      domain: "Code & DAG",
      harness: "@kai (Chrome DevTools MCP)",
      cmd: "agy run kai --audit-all",
      avatar: "/assets/pets/kai-neon.jpg",
      emoji: "🐱",
      vibe: "Analytical Precision (96.8%)"
    },
    {
      id: "draco",
      name: "Draco",
      archetype: "Fusion Compiler & DAG Synthesizer",
      element: "Dragon Fire · Alchemical Sulfur",
      domain: "Code & DAG",
      harness: "@hermes (Hermes Agent CLI)",
      cmd: "hermes fusion compile --ast",
      avatar: "/assets/pets/draco-neon.jpg",
      emoji: "🐉",
      vibe: "Sulfuric Resonance (97.5%)"
    },
    {
      id: "ignis",
      name: "Ignis",
      archetype: "Refactor & WASM Specialist",
      element: "Phoenix Fire · Calcinatio",
      domain: "Code & DAG",
      harness: "@ignis (Local WASM Engine)",
      cmd: "zoth wasm build --release",
      avatar: "/assets/pets/ignis-neon.jpg",
      emoji: "🔥",
      vibe: "Combustion Flow (95.4%)"
    },
    {
      id: "lycan",
      name: "Lycan",
      archetype: "OWASP Sentinel & AST Enforcer",
      element: "Iron Mars · Bastion Guard",
      domain: "Security",
      harness: "@antigravity (Google Antigravity agy CLI)",
      cmd: "agy scan --owasp --strict",
      avatar: "/assets/pets/lycan-neon.jpg",
      emoji: "🐺",
      vibe: "Bastion Shielding (98.9%)"
    },
    {
      id: "athena",
      name: "Athena",
      archetype: "Knowledge Graph & AEO Architect",
      element: "Pallas Wisdom · Geometric Node",
      domain: "Knowledge",
      harness: "@athena (llms.txt & Obsidian Graph)",
      cmd: "athena sync --vault ./obsidian",
      avatar: "/assets/pets/athena-neon.jpg",
      emoji: "🦉",
      vibe: "Hypergraph Coherence (96.5%)"
    },
    {
      id: "kitsune",
      name: "Kitsune",
      archetype: "Taste & Motion Designer",
      element: "Fox Spirit · Illusion Weaver",
      domain: "Creative & Motion",
      harness: "@grok (xAI Grok CLI)",
      cmd: "grok render --motion --glow",
      avatar: "/assets/pets/kitsune-neon.jpg",
      emoji: "🦊",
      vibe: "Aesthetic Harmony (94.8%)"
    },
    {
      id: "pixel-neko",
      name: "Pixel-Neko",
      archetype: "Tool Registry Indexer",
      element: "Pixel Matrix · Index Weaver",
      domain: "Ops & Tooling",
      harness: "@registry (47+ Chained Tool Indexer)",
      cmd: "zoth registry query --all",
      avatar: "/assets/pets/pixel-neko-neon.jpg",
      emoji: "👾",
      vibe: "Registry Matrix (95.9%)"
    },
    {
      id: "pixel-shiba",
      name: "Pixel-Shiba",
      archetype: "BYOK Vault Guardian & Keymaster",
      element: "Golden Doge · Vault Sigil",
      domain: "Security",
      harness: "@vault (Argon2id Vault Daemon on :8787)",
      cmd: "vault status --check-keys",
      avatar: "/assets/pets/pixel-shiba-neon.jpg",
      emoji: "🐕",
      vibe: "Argon2id Cryptic Lock (97.7%)"
    },
    {
      id: "radical-minion",
      name: "Radical Minion",
      archetype: "Hermes Autonomous Partner",
      element: "Hermetic Minion · Task Automaton",
      domain: "Autonomy",
      harness: "@hermes (Hermes Autonomous Engine)",
      cmd: "hermes execute --checkpoint-safe",
      avatar: "/assets/pets/radical-minion-neon.jpg",
      emoji: "🤖",
      vibe: "Autonomous Dispatch (96.1%)"
    },
    {
      id: "workbot",
      name: "Workbot",
      archetype: "Local Neural Weights Engine",
      element: "Titanium Forge · Neural Weight",
      domain: "Autonomy",
      harness: "@ollama (Ollama Local Weights on :11434)",
      cmd: "ollama run qwen2.5-coder:14b",
      avatar: "/assets/pets/workbot-neon.jpg",
      emoji: "🦾",
      vibe: "Tensor Core Active (95.0%)"
    }
  ];

  var PetHUD = {
    initialized: false,
    activePet: null,
    isOpen: false,
    isDocked: false,
    bubbleTimeout: null,

    init: function () {
      if (this.initialized) return;
      this.ensureStylesheet();
      this.loadActivePet(function () {
        PetHUD.render();
        PetHUD.bindEvents();
        PetHUD.setupReactions();
        PetHUD.initialized = true;
      });
    },

    ensureStylesheet: function () {
      if (!document.querySelector('link[href*="zoth-pet-hud.css"]')) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/zoth-pet-hud.css";
        document.head.appendChild(link);
      }
    },

    loadActivePet: function (cb) {
      // 1. Check localStorage first
      var savedId = localStorage.getItem("zoth_active_pet");
      if (savedId) {
        var found = PETS_ROSTER.find(function (p) { return p.id === savedId; });
        if (found) {
          this.activePet = Object.assign({}, found);
          if (cb) cb();
          return;
        }
      }

      // 2. Fetch from active_pet.json
      fetch("/data/active_pet.json")
        .then(function (res) {
          if (!res.ok) throw new Error("Status " + res.status);
          return res.json();
        })
        .then(function (data) {
          var petId = (data.active_pet || "azoth").toLowerCase();
          var matched = PETS_ROSTER.find(function (p) { return p.id === petId; }) || PETS_ROSTER[0];
          PetHUD.activePet = Object.assign({}, matched, {
            name: data.name || matched.name,
            archetype: data.archetype || matched.archetype,
            element: data.element || matched.element,
            domain: data.domain || matched.domain,
            harness: data.harness || matched.harness
          });
          localStorage.setItem("zoth_active_pet", PetHUD.activePet.id);
          if (cb) cb();
        })
        .catch(function () {
          // Fallback to Azoth default
          PetHUD.activePet = PETS_ROSTER[0];
          localStorage.setItem("zoth_active_pet", PetHUD.activePet.id);
          if (cb) cb();
        });
    },

    render: function () {
      var existing = document.getElementById("zoth-pet-hud");
      if (existing) existing.remove();

      var isDockedPref = localStorage.getItem("zoth_pet_hud_docked") === "true";
      this.isDocked = isDockedPref;

      var hud = document.createElement("div");
      hud.id = "zoth-pet-hud";
      hud.className = this.isDocked ? "docked" : "";

      var pet = this.activePet;

      var optionsHtml = PETS_ROSTER.map(function (p) {
        var selected = p.id === pet.id ? "selected" : "";
        return '<option value="' + p.id + '" ' + selected + '>' + p.emoji + ' ' + p.name + ' — ' + p.domain + '</option>';
      }).join('');

      hud.innerHTML = [
        '<!-- Speech Bubble for dynamic reactions -->',
        '<div class="pet-hud-speech-bubble" id="pet-hud-speech">',
        '  <span class="pet-hud-speech-text">Companion online & watching over session.</span>',
        '</div>',

        '<!-- Expanded Companion Dossier Panel -->',
        '<div class="pet-hud-card" id="pet-hud-card" role="region" aria-label="Pet Companion Panel">',
        '  <div class="pet-hud-header">',
        '    <div class="pet-hud-title-group">',
        '      <span class="pet-hud-badge-icon">' + (pet.emoji || "🐾") + '</span>',
        '      <span class="pet-hud-title">Desk Companion</span>',
        '    </div>',
        '    <div class="pet-hud-header-actions">',
        '      <button type="button" class="pet-hud-icon-btn" id="pet-hud-dock-btn" title="Toggle Compact Mode">🗕</button>',
        '      <button type="button" class="pet-hud-icon-btn" id="pet-hud-close-btn" title="Close Panel">✕</button>',
        '    </div>',
        '  </div>',

        '  <div class="pet-hud-body">',
        '    <div class="pet-hud-hero-box">',
        '      <div class="pet-hud-hero-img-wrap">',
        '        <img src="' + pet.avatar + '" alt="' + pet.name + '" id="pet-hud-hero-img" onerror="this.src=\'/assets/mascot/azoth-mask.jpg\'" />',
        '      </div>',
        '      <div class="pet-hud-hero-details">',
        '        <div class="pet-hud-hero-name" id="pet-hud-hero-name">' + pet.name + '</div>',
        '        <div class="pet-hud-hero-archetype" id="pet-hud-hero-archetype">' + pet.archetype + '</div>',
        '        <div class="pet-hud-hero-element" id="pet-hud-hero-element">' + pet.element + '</div>',
        '      </div>',
        '    </div>',

        '    <div class="pet-hud-telemetry">',
        '      <div class="pet-hud-telemetry-row">',
        '        <span class="pet-hud-label">Emotional Vibration</span>',
        '        <span class="pet-hud-val" id="pet-hud-vibe-val">' + (pet.vibe || "Optimal (98.4%)") + '</span>',
        '      </div>',
        '      <div class="pet-hud-vibe-bar">',
        '        <div class="pet-hud-vibe-fill" id="pet-hud-vibe-fill"></div>',
        '      </div>',
        '      <div class="pet-hud-telemetry-row" style="margin-top: 2px;">',
        '        <span class="pet-hud-label">Harness Integration</span>',
        '        <span class="pet-hud-val" id="pet-hud-harness-val" style="font-size:0.65rem; color:var(--cyan-soft,#38bdf8);">' + pet.harness + '</span>',
        '      </div>',
        '    </div>',

                '    <div class="pet-hud-field" style="margin-top: 10px;">',
        '      <label class="pet-hud-field-label">👁️ Sovereign Vision & Screen Capture</label>',
        '      <button type="button" class="pet-hud-vision-btn" id="pet-hud-vision-btn" style="width:100%; padding:9px 12px; background:linear-gradient(135deg, rgba(0,240,255,0.2), rgba(168,85,247,0.25)); border:1px solid var(--border-cyan, #00f0ff); border-radius:8px; color:#fff; font-family:inherit; font-weight:700; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s;">',
        '        <span>👁️ Activate Visionary Screen Eye</span>',
        '      </button>',
        '    </div>',
        '    <div class="pet-hud-field">',
        '      <label class="pet-hud-field-label">Quick Summon / Switch Spirit</label>',
        '      <select class="pet-hud-select" id="pet-hud-switcher">',
        optionsHtml,
        '      </select>',
        '    </div>',

        '    <div class="pet-hud-field">',
        '      <label class="pet-hud-field-label">Terminal Summon Command</label>',
        '      <div class="pet-hud-cmd-box">',
        '        <span class="pet-hud-cmd-text" id="pet-hud-cmd-text">' + pet.cmd + '</span>',
        '        <button type="button" class="pet-hud-copy-btn" id="pet-hud-copy-cmd">📋 Copy</button>',
        '      </div>',
        '    </div>',
        '  </div>',

        '  <div class="pet-hud-footer">',
        '    <a href="/pets/" class="pet-hud-footer-link">🐾 Sanctuary Roster (24)</a>',
        '    <a href="/pets/studio.html" class="pet-hud-footer-link">💎 3D Studio ↗</a>',
        '  </div>',
        '</div>',

        '<!-- Floating HUD Trigger Orb -->',
        '<button type="button" class="pet-hud-trigger" id="pet-hud-trigger" aria-expanded="false" aria-label="Toggle Companion HUD">',
        '  <div class="pet-hud-orb">',
        '    <img src="' + pet.avatar + '" alt="' + pet.name + '" id="pet-hud-orb-img" onerror="this.src=\'/assets/mascot/azoth-mask.jpg\'" />',
        '    <div class="pet-hud-pulse-ring"></div>',
        '    <div class="pet-hud-orb-status"></div>',
        '  </div>',
        '  <div class="pet-hud-trigger-info">',
        '    <span class="pet-hud-trigger-name" id="pet-hud-trigger-name">' + pet.name + '</span>',
        '    <span class="pet-hud-trigger-state">Vigilant Guardian</span>',
        '  </div>',
        '</button>'
      ].join('\n');

      document.body.appendChild(hud);
    },

    
    activateVisionary: function () {
      var self = this;
      self.say("👁️ Visionary Mode Engaging... Requesting screen viewport capture.");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        // Fallback for environments where getDisplayMedia is unsupported: DOM screenshot & layout canvas
        self.fallbackDomVision();
        return;
      }

      navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: false
      }).then(function (stream) {
        var track = stream.getVideoTracks()[0];
        var imageCapture = null;
        
        var video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = function () {
          setTimeout(function () {
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || window.innerWidth;
            canvas.height = video.videoHeight || window.innerHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Stop tracks
            stream.getTracks().forEach(function (t) { t.stop(); });
            
            var dataUrl = canvas.toDataURL("image/png");
            self.showVisionaryOverlay(dataUrl, canvas.width, canvas.height);
            self.say("✨ Screen Captured! " + self.activePet.name + " is analyzing full-display viewport.");
          }, 400);
        };
      }).catch(function (err) {
        self.say("⚠️ Vision capture cancelled or restricted. Falling back to DOM visual snapshot.");
        self.fallbackDomVision();
      });
    },

    fallbackDomVision: function () {
      var self = this;
      var w = window.innerWidth;
      var h = window.innerHeight;
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      
      // Draw dark grid backdrop
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);
      
      // Render scanning matrix lines
      ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      ctx.lineWidth = 1;
      for (var x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (var y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      
      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 24px monospace";
      ctx.fillText("ZOTH VISIONARY SCAN // " + self.activePet.name.toUpperCase(), 40, 60);
      
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px monospace";
      ctx.fillText("URL: " + window.location.href, 40, 90);
      ctx.fillText("Viewport: " + w + "x" + h + " | DOM Nodes: " + document.querySelectorAll("*").length, 40, 115);
      
      var dataUrl = canvas.toDataURL("image/png");
      self.showVisionaryOverlay(dataUrl, w, h);
    },

    showVisionaryOverlay: function (imgUrl, width, height) {
      var existing = document.getElementById("zoth-visionary-overlay");
      if (existing) existing.remove();

      var overlay = document.createElement("div");
      overlay.id = "zoth-visionary-overlay";
      overlay.style.cssText = "position:fixed; inset:0; z-index:2147483647; background:rgba(3,4,8,0.92); backdrop-filter:blur(14px); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; pointer-events:auto;";
      
      overlay.innerHTML = [
        '<div style="background:#0a0e1c; border:1px solid rgba(0,240,255,0.4); border-radius:14px; max-width:980px; width:94vw; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 24px 80px rgba(0,240,255,0.25); overflow:hidden;">',
        '  <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.4);">',
        '    <div style="display:flex; align-items:center; gap:10px;">',
        '      <span style="font-size:1.4rem;">👁️</span>',
        '      <div>',
        '        <div style="font-family:var(--font-mono, monospace); font-size:0.68rem; color:#fbbf24; text-transform:uppercase; letter-spacing:0.12em;">VISIONARY SCREEN EYE</div>',
        '        <h3 style="margin:0; font-size:1.15rem; color:#fff; font-family:var(--font-display, sans-serif);">' + this.activePet.name + ' Screen Inspection Snapshot</h3>',
        '      </div>',
        '    </div>',
        '    <button type="button" id="close-visionary-btn" style="background:none; border:none; color:#fff; font-size:1.4rem; cursor:pointer; padding:4px 8px;">✕</button>',
        '  </div>',
        '  <div style="flex:1; overflow:auto; padding:16px; display:flex; align-items:center; justify-content:center; background:#030408;">',
        '    <img src="' + imgUrl + '" alt="Screen capture" style="max-width:100%; max-height:60vh; border-radius:8px; border:1px solid rgba(0,240,255,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.8);" />',
        '  </div>',
        '  <div style="padding:14px 20px; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); flex-wrap:wrap; gap:10px;">',
        '    <span style="font-family:monospace; font-size:0.75rem; color:#94a3b8;">Captured ' + width + '×' + height + ' px · Ready for Autonomous LLM Multimodal Vision</span>',
        '    <div style="display:flex; gap:10px;">',
        '      <a href="' + imgUrl + '" download="' + this.activePet.id + '-screen-vision.png" style="padding:8px 14px; background:rgba(0,240,255,0.15); border:1px solid #00f0ff; border-radius:6px; color:#00f0ff; text-decoration:none; font-size:0.8rem; font-weight:700;">💾 Download Capture</a>',
        '      <button type="button" id="copy-vision-btn" style="padding:8px 14px; background:#fbbf24; border:none; border-radius:6px; color:#050508; font-size:0.8rem; font-weight:700; cursor:pointer;">📋 Copy Vision Token</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');

      document.body.appendChild(overlay);

      document.getElementById("close-visionary-btn").onclick = function () {
        overlay.remove();
      };
      document.getElementById("copy-vision-btn").onclick = function () {
        navigator.clipboard.writeText(`@${PetHUD.activePet.id} analyze-screen --timestamp=${Date.now()}`);
        this.textContent = "✔ Copied Command!";
        setTimeout(() => { this.textContent = "📋 Copy Vision Token"; }, 1600);
      };
    },

    bindEvents: function () {
      var trigger = document.getElementById("pet-hud-trigger");
      var closeBtn = document.getElementById("pet-hud-close-btn");
      var dockBtn = document.getElementById("pet-hud-dock-btn");
      var switcher = document.getElementById("pet-hud-switcher");
      var copyCmd = document.getElementById("pet-hud-copy-cmd");
      var hud = document.getElementById("zoth-pet-hud");

            var visionBtn = document.getElementById("pet-hud-vision-btn");
      if (visionBtn) {
        visionBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.activateVisionary();
        });
      }

      if (trigger) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.toggle();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.close();
        });
      }

      if (dockBtn) {
        dockBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          PetHUD.toggleDock();
        });
      }

      if (switcher) {
        switcher.addEventListener("change", function (e) {
          PetHUD.switchPet(e.target.value);
        });
      }

      if (copyCmd) {
        copyCmd.addEventListener("click", function (e) {
          e.preventDefault();
          var cmd = PetHUD.activePet.cmd;
          navigator.clipboard.writeText(cmd).then(function () {
            copyCmd.textContent = "✓ Copied!";
            PetHUD.say("Summon command copied to terminal clipboard!");
            setTimeout(function () {
              copyCmd.textContent = "📋 Copy";
            }, 2000);
          });
        });
      }

      // Close panel on clicking outside
      document.addEventListener("click", function (e) {
        if (PetHUD.isOpen && hud && !hud.contains(e.target)) {
          PetHUD.close();
        }
      });

      // Escape key to close
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && PetHUD.isOpen) {
          PetHUD.close();
        }
      });
    },

    toggle: function () {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function () {
      var hud = document.getElementById("zoth-pet-hud");
      var trigger = document.getElementById("pet-hud-trigger");
      if (hud) hud.classList.add("open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      this.isOpen = true;
      this.say("Observing workspace telemetry...");
    },

    close: function () {
      var hud = document.getElementById("zoth-pet-hud");
      var trigger = document.getElementById("pet-hud-trigger");
      if (hud) hud.classList.remove("open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      this.isOpen = false;
    },

    toggleDock: function () {
      var hud = document.getElementById("zoth-pet-hud");
      this.isDocked = !this.isDocked;
      if (hud) {
        hud.classList.toggle("docked", this.isDocked);
      }
      localStorage.setItem("zoth_pet_hud_docked", String(this.isDocked));
      this.say(this.isDocked ? "Docked to minimal profile." : "Expanded HUD profile.");
    },

    switchPet: function (petId) {
      var target = PETS_ROSTER.find(function (p) { return p.id === petId; });
      if (!target) return;

      this.activePet = Object.assign({}, target);
      localStorage.setItem("zoth_active_pet", target.id);

      // Update UI elements in place
      var orbImg = document.getElementById("pet-hud-orb-img");
      var triggerName = document.getElementById("pet-hud-trigger-name");
      var heroImg = document.getElementById("pet-hud-hero-img");
      var heroName = document.getElementById("pet-hud-hero-name");
      var heroArch = document.getElementById("pet-hud-hero-archetype");
      var heroElem = document.getElementById("pet-hud-hero-element");
      var vibeVal = document.getElementById("pet-hud-vibe-val");
      var harnessVal = document.getElementById("pet-hud-harness-val");
      var cmdText = document.getElementById("pet-hud-cmd-text");
      var switcher = document.getElementById("pet-hud-switcher");

      if (orbImg) orbImg.src = target.avatar;
      if (triggerName) triggerName.textContent = target.name;
      if (heroImg) heroImg.src = target.avatar;
      if (heroName) heroName.textContent = target.name;
      if (heroArch) heroArch.textContent = target.archetype;
      if (heroElem) heroElem.textContent = target.element;
      if (vibeVal) vibeVal.textContent = target.vibe;
      if (harnessVal) harnessVal.textContent = target.harness;
      if (cmdText) cmdText.textContent = target.cmd;
      if (switcher) switcher.value = target.id;

      // Broadcast custom event for other components if listening
      window.dispatchEvent(new CustomEvent("zoth:pet-switched", { detail: target }));

      this.say("Summoned " + target.name + " (" + target.domain + ")!");
    },

    say: function (text, durationMs) {
      var speech = document.getElementById("pet-hud-speech");
      if (!speech) return;

      var textSpan = speech.querySelector(".pet-hud-speech-text");
      if (textSpan) textSpan.textContent = text;

      speech.classList.add("active");
      if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);

      this.bubbleTimeout = setTimeout(function () {
        speech.classList.remove("active");
      }, durationMs || 3500);
    },

    setupReactions: function () {
      // 1. React when user copies anything on page
      document.addEventListener("copy", function () {
        var phrases = [
          "Artifact copied to memory buffer!",
          "Code snippet captured in vector cache.",
          "Clipboard synched with terminal bridge."
        ];
        var pick = phrases[Math.floor(Math.random() * phrases.length)];
        PetHUD.say(pick, 3000);
      });

      // 2. React on theme change event (supports both 'zoth-theme-change' and 'zoth:theme-change')
      var handleThemeEvent = function (e) {
        var theme = (e.detail && e.detail.theme) || "new";
        PetHUD.say("Calibrated to " + theme.toUpperCase() + " spectrum.", 3000);
      };
      window.addEventListener("zoth-theme-change", handleThemeEvent);
      window.addEventListener("zoth:theme-change", handleThemeEvent);

      // 3. React on link clicks (exploration)
      document.addEventListener("click", function (e) {
        var link = e.target.closest("a");
        if (link && link.href && !link.href.startsWith("javascript") && !link.closest("#zoth-pet-hud")) {
          var targetHref = link.getAttribute("href");
          if (targetHref && (targetHref.includes("pets") || targetHref.includes("annotate") || targetHref.includes("registry") || targetHref.includes("swarm"))) {
            PetHUD.say("Navigating to " + link.textContent.trim().slice(0, 24) + "...", 2000);
          }
        }
      });

      // 4. Periodic subtle vitality ping
      setInterval(function () {
        if (!PetHUD.isOpen && Math.random() < 0.15) {
          var idleVibes = [
            "All systems nominal. Loopback quiet.",
            "Watching over local daemon on :8788.",
            "Ready to dispatch autonomous swarm tasks."
          ];
          var pick = idleVibes[Math.floor(Math.random() * idleVibes.length)];
          PetHUD.say(pick, 4000);
        }
      }, 45000);
    }
  };

  // Self-init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      PetHUD.init();
    });
  } else {
    PetHUD.init();
  }

  // Export globally
  window.ZothPetHUD = PetHUD;
})();
