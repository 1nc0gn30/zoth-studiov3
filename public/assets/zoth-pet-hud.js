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

    bindEvents: function () {
      var trigger = document.getElementById("pet-hud-trigger");
      var closeBtn = document.getElementById("pet-hud-close-btn");
      var dockBtn = document.getElementById("pet-hud-dock-btn");
      var switcher = document.getElementById("pet-hud-switcher");
      var copyCmd = document.getElementById("pet-hud-copy-cmd");
      var hud = document.getElementById("zoth-pet-hud");

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
