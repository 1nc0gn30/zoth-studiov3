/**
 * Zoth Studio — Sovereign Web Audio SFX & Soundscape Engine
 * File: core-app/public/tools/site-audio-sfx.js
 * 
 * 100% Sovereign procedural audio synthesizer using the Web Audio API.
 * Zero external MP3, WAV, or remote audio assets.
 * 
 * Features:
 * - 45+ synthesized sonic presets (UI clicks, laser pulses, Solfeggio 528Hz, success fanfares, cyberpunk sweeps)
 * - Continuous ambient generative soundscapes (Space drone, Zen 528, Cyber rain, Cyber pulse)
 * - Polyphonic voice allocation with master dynamic compression & soft limiting
 * - Full volume buses (Master, SFX, Ambient) & Mute toggle with LocalStorage persistence
 * - Accessibility guards: prefers-reduced-motion, prefers-reduced-sound, user-defined reduced audio mode
 * - HTML data-attribute auto-binding (data-sfx="ui_click", data-sfx-hover="ui_hover")
 * - Zoth Tool Bench integration (sfx.play, sfx.list, sfx.ambient_start, sfx.volume, etc.)
 * - UMD wrapper compatible with Node.js tests and browser environments
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    var instance = factory();
    root.SiteAudioSFX = instance;
    root.ZothAudio = instance;
    // Auto-init on browser window load if available
    if (typeof window !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () { instance.init(); });
      } else {
        instance.init();
      }
    }
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // --- Configuration & Constants ---
  var STORAGE_KEYS = {
    MUTED: "zoth_audio_muted",
    MASTER_VOL: "zoth_audio_master_vol",
    SFX_VOL: "zoth_audio_sfx_vol",
    AMBIENT_VOL: "zoth_audio_ambient_vol",
    REDUCED_AUDIO: "zoth_audio_reduced_mode"
  };

  var SOLFEGGIO_FREQS = {
    UT: 396,  // Liberating Guilt and Fear
    RE: 417,  // Undoing Situations and Facilitating Change
    MI: 528,  // Transformation and Miracles (DNA Repair)
    FA: 639,  // Connecting / Relationships
    SOL: 741, // Awakening Intuition / Expression
    LA: 852,  // Returning to Spiritual Order
    SI: 963,  // Pure Cosmic Consciousness
    A432: 432 // Natural Harmonic Tuning
  };

  // --- State ---
  var state = {
    ctx: null,
    isUnlocked: false,
    isMuted: false,
    masterVolume: 0.8,
    sfxVolume: 0.85,
    ambientVolume: 0.5,
    reducedAudioMode: false,
    activeAmbient: null,
    ambientGainNode: null,
    ambientNodes: [],
    masterGain: null,
    sfxGain: null,
    compressor: null,
    noiseBuffers: {
      white: null,
      pink: null,
      brown: null
    },
    voiceCount: 0,
    maxPolyphony: 32,
    listenersAttached: false
  };

  // --- Noise Buffer Generators ---
  function createWhiteNoiseBuffer(ctx, durationSec) {
    var bufferSize = Math.floor(ctx.sampleRate * (durationSec || 2.0));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var output = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function createPinkNoiseBuffer(ctx, durationSec) {
    var bufferSize = Math.floor(ctx.sampleRate * (durationSec || 2.0));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var output = buffer.getChannelData(0);
    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  function createBrownNoiseBuffer(ctx, durationSec) {
    var bufferSize = Math.floor(ctx.sampleRate * (durationSec || 2.0));
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var output = buffer.getChannelData(0);
    var lastOut = 0.0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  function getNoiseBuffer(ctx, type) {
    if (!state.noiseBuffers[type]) {
      if (type === "pink") state.noiseBuffers.pink = createPinkNoiseBuffer(ctx, 2.5);
      else if (type === "brown") state.noiseBuffers.brown = createBrownNoiseBuffer(ctx, 2.5);
      else state.noiseBuffers.white = createWhiteNoiseBuffer(ctx, 2.5);
    }
    return state.noiseBuffers[type];
  }

  // --- Distortion Curves ---
  function makeDistortionCurve(amount) {
    var k = typeof amount === "number" ? amount : 50;
    var n_samples = 44100;
    var curve = new Float32Array(n_samples);
    var deg = Math.PI / 180;
    for (var i = 0; i < n_samples; ++i) {
      var x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // --- AudioContext Initialization ---
  function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!state.ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        state.ctx = new AudioCtx();
        setupMasterNodes(state.ctx);
      }
    }
    return state.ctx;
  }

  function setupMasterNodes(ctx) {
    if (!ctx) return;

    // Master Dynamics Compressor (Limiter) to prevent clipping
    state.compressor = ctx.createDynamicsCompressor();
    state.compressor.threshold.setValueAtTime(-12, ctx.currentTime);
    state.compressor.knee.setValueAtTime(30, ctx.currentTime);
    state.compressor.ratio.setValueAtTime(12, ctx.currentTime);
    state.compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    state.compressor.release.setValueAtTime(0.25, ctx.currentTime);

    // Master Gain
    state.masterGain = ctx.createGain();
    var effectiveMaster = state.isMuted ? 0 : state.masterVolume;
    state.masterGain.gain.setValueAtTime(effectiveMaster, ctx.currentTime);

    // SFX Gain Bus
    state.sfxGain = ctx.createGain();
    state.sfxGain.gain.setValueAtTime(state.sfxVolume, ctx.currentTime);

    // Ambient Gain Bus
    state.ambientGainNode = ctx.createGain();
    state.ambientGainNode.gain.setValueAtTime(state.ambientVolume, ctx.currentTime);

    // Connect routing graph:
    // sfxGain -> compressor -> masterGain -> destination
    // ambientGainNode -> compressor -> masterGain -> destination
    state.sfxGain.connect(state.compressor);
    state.ambientGainNode.connect(state.compressor);
    state.compressor.connect(state.masterGain);
    state.masterGain.connect(ctx.destination);
  }

  // --- Audio State Persistence & Hydration ---
  function loadPersistedSettings() {
    if (typeof localStorage === "undefined") return;
    try {
      var muted = localStorage.getItem(STORAGE_KEYS.MUTED);
      if (muted !== null) state.isMuted = muted === "true";

      var mVol = localStorage.getItem(STORAGE_KEYS.MASTER_VOL);
      if (mVol !== null) state.masterVolume = Math.max(0, Math.min(1, parseFloat(mVol)));

      var sVol = localStorage.getItem(STORAGE_KEYS.SFX_VOL);
      if (sVol !== null) state.sfxVolume = Math.max(0, Math.min(1, parseFloat(sVol)));

      var aVol = localStorage.getItem(STORAGE_KEYS.AMBIENT_VOL);
      if (aVol !== null) state.ambientVolume = Math.max(0, Math.min(1, parseFloat(aVol)));

      var red = localStorage.getItem(STORAGE_KEYS.REDUCED_AUDIO);
      if (red !== null) state.reducedAudioMode = red === "true";
      else {
        // Check system preference
        if (typeof window !== "undefined" && window.matchMedia) {
          state.reducedAudioMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
      }
    } catch (e) {
      /* fail soft on storage restrictions */
    }
  }

  function persistSettings() {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.MUTED, String(state.isMuted));
      localStorage.setItem(STORAGE_KEYS.MASTER_VOL, String(state.masterVolume));
      localStorage.setItem(STORAGE_KEYS.SFX_VOL, String(state.sfxVolume));
      localStorage.setItem(STORAGE_KEYS.AMBIENT_VOL, String(state.ambientVolume));
      localStorage.setItem(STORAGE_KEYS.REDUCED_AUDIO, String(state.reducedAudioMode));
    } catch (e) {
      /* fail soft */
    }
  }

  // --- User Gesture Unlock ---
  function unlock() {
    var ctx = getAudioContext();
    if (!ctx) return Promise.resolve(false);
    if (ctx.state === "suspended") {
      return ctx.resume().then(function () {
        state.isUnlocked = true;
        emitEvent("unlocked", { state: ctx.state });
        return true;
      }).catch(function () {
        return false;
      });
    }
    state.isUnlocked = true;
    return Promise.resolve(true);
  }

  function autoUnlockOnInteraction() {
    if (state.listenersAttached || typeof window === "undefined") return;
    state.listenersAttached = true;

    var unlockHandler = function () {
      unlock();
      window.removeEventListener("click", unlockHandler, true);
      window.removeEventListener("keydown", unlockHandler, true);
      window.removeEventListener("touchstart", unlockHandler, true);
      window.removeEventListener("pointerdown", unlockHandler, true);
    };

    window.addEventListener("click", unlockHandler, { capture: true, passive: true });
    window.addEventListener("keydown", unlockHandler, { capture: true, passive: true });
    window.addEventListener("touchstart", unlockHandler, { capture: true, passive: true });
    window.addEventListener("pointerdown", unlockHandler, { capture: true, passive: true });
  }

  // --- Event Dispatcher ---
  function emitEvent(name, detail) {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      try {
        var evt = new CustomEvent("zoth:audio", {
          detail: Object.assign({ event: name, ts: new Date().toISOString() }, detail || {})
        });
        window.dispatchEvent(evt);
      } catch (e) { /* ignore */ }
    }
  }

  // =========================================================================
  // --- 45+ Web Audio Synthesized Sound Definitions ---
  // =========================================================================

  var SOUND_LIBRARY = {
    // -----------------------------------------------------------------------
    // Category 1: UI & Interactive Haptics (11 SFX)
    // -----------------------------------------------------------------------
    ui_click: {
      id: "ui_click",
      category: "ui",
      title: "UI Micro Click",
      description: "Crisp, subtle tactile click with high-pitch sine transient",
      duration: 0.04,
      tags: ["button", "tap", "minimal"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, t0);
        osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.035);

        filter.type = "highpass";
        filter.frequency.setValueAtTime(200, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.45 * (opts.volume || 1), t0 + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.038);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.04);
      }
    },

    ui_hover: {
      id: "ui_hover",
      category: "ui",
      title: "UI Soft Hover",
      description: "Gentle ascending sine pop for element focus/hover",
      duration: 0.05,
      tags: ["hover", "focus", "airy"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, t0);
        osc.frequency.exponentialRampToValueAtTime(1100, t0 + 0.04);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.2 * (opts.volume || 1), t0 + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.048);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.05);
      }
    },

    ui_toggle_on: {
      id: "ui_toggle_on",
      category: "ui",
      title: "Toggle Switch ON",
      description: "Ascending affirmative two-tone blip",
      duration: 0.12,
      tags: ["toggle", "switch", "affirmative"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, t0);
        osc.frequency.setValueAtTime(880, t0 + 0.05);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 0.01);
        gain.gain.setValueAtTime(0.35 * (opts.volume || 1), t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.12);
      }
    },

    ui_toggle_off: {
      id: "ui_toggle_off",
      category: "ui",
      title: "Toggle Switch OFF",
      description: "Descending dismissive two-tone blip",
      duration: 0.12,
      tags: ["toggle", "switch", "dismiss"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(660, t0);
        osc.frequency.setValueAtTime(330, t0 + 0.05);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.3 * (opts.volume || 1), t0 + 0.01);
        gain.gain.setValueAtTime(0.3 * (opts.volume || 1), t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.12);
      }
    },

    ui_modal_open: {
      id: "ui_modal_open",
      category: "ui",
      title: "Modal Open Swell",
      description: "Warm harmonic swell with low-mid resonance",
      duration: 0.22,
      tags: ["modal", "dialog", "swell"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "triangle";
        osc1.frequency.setValueAtTime(220, t0);
        osc1.frequency.exponentialRampToValueAtTime(587.33, t0 + 0.18); // D5
        osc2.frequency.setValueAtTime(440, t0);
        osc2.frequency.exponentialRampToValueAtTime(880, t0 + 0.18);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, t0);
        filter.frequency.exponentialRampToValueAtTime(2400, t0 + 0.18);
        filter.Q.setValueAtTime(3, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.21);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t0);
        osc2.start(t0);
        osc1.stop(t0 + 0.22);
        osc2.stop(t0 + 0.22);
      }
    },

    ui_modal_close: {
      id: "ui_modal_close",
      category: "ui",
      title: "Modal Close Sweep",
      description: "Descending lowpass filter sweep dismiss",
      duration: 0.18,
      tags: ["modal", "close", "whoosh"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(587, t0);
        osc.frequency.exponentialRampToValueAtTime(160, t0 + 0.16);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1800, t0);
        filter.frequency.exponentialRampToValueAtTime(120, t0 + 0.16);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.17);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.18);
      }
    },

    ui_tab_switch: {
      id: "ui_tab_switch",
      category: "ui",
      title: "Tab Switch Sweep",
      description: "Snappy resonant bandpass sweep for tab transitions",
      duration: 0.08,
      tags: ["tabs", "switch", "slide"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, t0);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(700, t0);
        filter.frequency.exponentialRampToValueAtTime(2200, t0 + 0.07);
        filter.Q.setValueAtTime(4, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.25 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.078);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.08);
      }
    },

    ui_keystroke: {
      id: "ui_keystroke",
      category: "ui",
      title: "Mechanical Keystroke",
      description: "Tactile mechanical keyboard thud + plastic click",
      duration: 0.06,
      tags: ["keyboard", "typing", "retro"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        // Body thud
        var osc = ctx.createOscillator();
        var oscGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, t0);
        osc.frequency.exponentialRampToValueAtTime(50, t0 + 0.05);
        oscGain.gain.setValueAtTime(0.3 * (opts.volume || 1), t0);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
        osc.connect(oscGain);
        oscGain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 0.055);

        // Click transient
        var noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx, "pink");
        var nFilter = ctx.createBiquadFilter();
        var nGain = ctx.createGain();
        nFilter.type = "highpass";
        nFilter.frequency.setValueAtTime(3200, t0);
        nGain.gain.setValueAtTime(0.4 * (opts.volume || 1), t0);
        nGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.025);
        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(dest);
        noise.start(t0);
        noise.stop(t0 + 0.03);
      }
    },

    ui_copy: {
      id: "ui_copy",
      category: "ui",
      title: "Clipboard Copy Ping",
      description: "Crisp double harmonic ping (C6 - E6)",
      duration: 0.15,
      tags: ["copy", "clipboard", "harmonic"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var pings = [1046.5, 1318.5]; // C6, E6
        pings.forEach(function (freq, idx) {
          var offset = idx * 0.045;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t0 + offset);
          gain.gain.setValueAtTime(0.001, t0 + offset);
          gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + offset + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + offset + 0.09);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0 + offset);
          osc.stop(t0 + offset + 0.095);
        });
      }
    },

    ui_delete: {
      id: "ui_delete",
      category: "ui",
      title: "Delete Buzz",
      description: "Crunchy downward sawtooth buzz for delete or discard",
      duration: 0.14,
      tags: ["delete", "trash", "discard"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t0);
        osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.13);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, t0);
        filter.frequency.exponentialRampToValueAtTime(100, t0 + 0.13);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.135);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.14);
      }
    },

    ui_select: {
      id: "ui_select",
      category: "ui",
      title: "Resonant Glass Tap",
      description: "Clean high-register crystalline glass tap",
      duration: 0.07,
      tags: ["select", "glass", "minimal"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1760, t0); // A6
        osc.frequency.exponentialRampToValueAtTime(1200, t0 + 0.06);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.068);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.07);
      }
    },

    // -----------------------------------------------------------------------
    // Category 2: Cyberpunk & Sci-Fi SFX (11 SFX)
    // -----------------------------------------------------------------------
    laser_pulse: {
      id: "laser_pulse",
      category: "cyberpunk",
      title: "Laser Pulse Blast",
      description: "Classic punchy sci-fi laser shot with exponential pitch drop",
      duration: 0.15,
      tags: ["laser", "scifi", "weapon"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var shaper = ctx.createWaveShaper();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(2600, t0);
        osc.frequency.exponentialRampToValueAtTime(80, t0 + 0.13);

        shaper.curve = makeDistortionCurve(30);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.55 * (opts.volume || 1), t0 + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);

        osc.connect(shaper);
        shaper.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.15);
      }
    },

    laser_heavy: {
      id: "laser_heavy",
      category: "cyberpunk",
      title: "Heavy Plasma Cannon",
      description: "Bass-heavy plasma beam pulse with dual oscillator punch",
      duration: 0.28,
      tags: ["plasma", "cannon", "subbass"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(1600, t0);
        osc1.frequency.exponentialRampToValueAtTime(45, t0 + 0.25);

        osc2.type = "square";
        osc2.frequency.setValueAtTime(120, t0);
        osc2.frequency.exponentialRampToValueAtTime(30, t0 + 0.25);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3000, t0);
        filter.frequency.exponentialRampToValueAtTime(150, t0 + 0.25);
        filter.Q.setValueAtTime(6, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.6 * (opts.volume || 1), t0 + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.27);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc1.start(t0);
        osc2.start(t0);
        osc1.stop(t0 + 0.28);
        osc2.stop(t0 + 0.28);
      }
    },

    cyber_sweep_up: {
      id: "cyber_sweep_up",
      category: "cyberpunk",
      title: "Cyber Resonant Sweep UP",
      description: "High-resonance bandpass filter riser with harmonic saturation",
      duration: 0.35,
      tags: ["riser", "sweep", "transition"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var shaper = ctx.createWaveShaper();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, t0);
        osc.frequency.exponentialRampToValueAtTime(480, t0 + 0.32);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(250, t0);
        filter.frequency.exponentialRampToValueAtTime(4200, t0 + 0.32);
        filter.Q.setValueAtTime(8, t0);

        shaper.curve = makeDistortionCurve(20);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.5 * (opts.volume || 1), t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.34);

        osc.connect(filter);
        filter.connect(shaper);
        shaper.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.35);
      }
    },

    cyber_sweep_down: {
      id: "cyber_sweep_down",
      category: "cyberpunk",
      title: "Cyber Downward Fall",
      description: "Dark dystopian transition drop with sub rumble",
      duration: 0.4,
      tags: ["drop", "fall", "dystopian"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, t0);
        osc.frequency.exponentialRampToValueAtTime(50, t0 + 0.38);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, t0);
        filter.frequency.exponentialRampToValueAtTime(80, t0 + 0.38);
        filter.Q.setValueAtTime(5, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.5 * (opts.volume || 1), t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.39);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.4);
      }
    },

    warp_jump: {
      id: "warp_jump",
      category: "cyberpunk",
      title: "Hyperspace Warp Jump",
      description: "Doppler whoosh surge across hyper-frequency spectrum",
      duration: 0.5,
      tags: ["warp", "speed", "space"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx, "white");
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(100, t0);
        filter.frequency.exponentialRampToValueAtTime(4500, t0 + 0.25);
        filter.frequency.exponentialRampToValueAtTime(80, t0 + 0.48);
        filter.Q.setValueAtTime(6, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.6 * (opts.volume || 1), t0 + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.49);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t0);
        noise.stop(t0 + 0.5);
      }
    },

    shield_activate: {
      id: "shield_activate",
      category: "cyberpunk",
      title: "Deflector Shield Activate",
      description: "Harmonic crystalline shield bubble resonance",
      duration: 0.45,
      tags: ["shield", "defense", "energy"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var freqs = [528, 792, 1056]; // Solfeggio 528 harmonics
        freqs.forEach(function (f) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f * 0.7, t0);
          osc.frequency.exponentialRampToValueAtTime(f, t0 + 0.2);

          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(0.25 * (opts.volume || 1), t0 + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.43);

          osc.connect(gain);
          gain.connect(dest);

          osc.start(t0);
          osc.stop(t0 + 0.45);
        });
      }
    },

    shield_hit: {
      id: "shield_hit",
      category: "cyberpunk",
      title: "Shield Impact Deflection",
      description: "Metallic deflection ring with resonant feedback",
      duration: 0.3,
      tags: ["shield", "hit", "metallic"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(950, t0);
        osc.frequency.exponentialRampToValueAtTime(320, t0 + 0.28);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1400, t0);
        filter.Q.setValueAtTime(10, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.5 * (opts.volume || 1), t0 + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.29);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.3);
      }
    },

    teleport: {
      id: "teleport",
      category: "cyberpunk",
      title: "Quantum Teleportation",
      description: "Phase-shifted shimmering particle dispersion",
      duration: 0.38,
      tags: ["teleport", "quantum", "shimmer"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var steps = [587, 880, 1174, 1760, 2349];
        steps.forEach(function (freq, idx) {
          var stepTime = t0 + idx * 0.045;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, stepTime);
          gain.gain.setValueAtTime(0.001, stepTime);
          gain.gain.linearRampToValueAtTime(0.22 * (opts.volume || 1), stepTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.14);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(stepTime);
          osc.stop(stepTime + 0.15);
        });
      }
    },

    glitch_burst: {
      id: "glitch_burst",
      category: "cyberpunk",
      title: "Glitch Data Burst",
      description: "Bitcrushed / modulated noise burst with stutter gating",
      duration: 0.18,
      tags: ["glitch", "noise", "error"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx, "white");
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1800, t0);
        filter.Q.setValueAtTime(5, t0);

        // Gated volume pulses
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.setValueAtTime(0.5 * (opts.volume || 1), t0 + 0.01);
        gain.gain.setValueAtTime(0.001, t0 + 0.05);
        gain.gain.setValueAtTime(0.55 * (opts.volume || 1), t0 + 0.08);
        gain.gain.setValueAtTime(0.001, t0 + 0.12);
        gain.gain.setValueAtTime(0.4 * (opts.volume || 1), t0 + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.175);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t0);
        noise.stop(t0 + 0.18);
      }
    },

    data_stream: {
      id: "data_stream",
      category: "cyberpunk",
      title: "Matrix Data Stream",
      description: "Rapid binary computational sequence blips",
      duration: 0.25,
      tags: ["matrix", "data", "compute"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var notes = [1200, 1500, 1800, 2400, 1800, 2700, 3200];
        notes.forEach(function (n, i) {
          var start = t0 + i * 0.032;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(n, start);
          gain.gain.setValueAtTime(0.18 * (opts.volume || 1), start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.028);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(start);
          osc.stop(start + 0.03);
        });
      }
    },

    emp_blast: {
      id: "emp_blast",
      category: "cyberpunk",
      title: "EMP Shockwave",
      description: "Electromagnetic pulse with deep sub-bass dissipation",
      duration: 0.6,
      tags: ["emp", "shockwave", "subbass"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        // Sub drop
        var osc = ctx.createOscillator();
        var oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, t0);
        osc.frequency.exponentialRampToValueAtTime(25, t0 + 0.55);
        oscGain.gain.setValueAtTime(0.7 * (opts.volume || 1), t0);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.58);
        osc.connect(oscGain);
        oscGain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 0.6);

        // Dispersal noise
        var noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx, "pink");
        var filter = ctx.createBiquadFilter();
        var nGain = ctx.createGain();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2500, t0);
        filter.frequency.exponentialRampToValueAtTime(60, t0 + 0.5);
        nGain.gain.setValueAtTime(0.4 * (opts.volume || 1), t0);
        nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(dest);
        noise.start(t0);
        noise.stop(t0 + 0.6);
      }
    },

    // -----------------------------------------------------------------------
    // Category 3: Solfeggio & Sacred Harmonic Tones (9 SFX)
    // -----------------------------------------------------------------------
    solfeggio_528: {
      id: "solfeggio_528",
      category: "solfeggio",
      title: "528 Hz Transformation & DNA Repair",
      description: "Pure 528 Hz miracle tone with warm sub-bass & 4th harmonic chime",
      duration: 1.5,
      tags: ["528hz", "miracle", "dna", "healing"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var freqs = [
          { f: 528, g: 0.45 },
          { f: 264, g: 0.25 },  // Sub-octave
          { f: 1056, g: 0.12 }, // 2nd harmonic
          { f: 1584, g: 0.05 }  // 3rd harmonic
        ];
        freqs.forEach(function (item) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(item.f, t0);
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(item.g * (opts.volume || 1), t0 + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0);
          osc.stop(t0 + 1.5);
        });
      }
    },

    solfeggio_432: {
      id: "solfeggio_432",
      category: "solfeggio",
      title: "432 Hz Natural Cosmic Tuning",
      description: "Warm 432 Hz harmonic resonance with subtle binaural beating",
      duration: 1.5,
      tags: ["432hz", "cosmic", "natural", "calm"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var freqs = [
          { f: 432, g: 0.45 },
          { f: 434, g: 0.2 }, // 2Hz gentle binaural beat
          { f: 216, g: 0.25 } // Sub-harmonic
        ];
        freqs.forEach(function (item) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(item.f, t0);
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(item.g * (opts.volume || 1), t0 + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0);
          osc.stop(t0 + 1.5);
        });
      }
    },

    solfeggio_396: {
      id: "solfeggio_396",
      category: "solfeggio",
      title: "396 Hz Liberating Fear & Guilt",
      description: "Deep grounding root frequency for releasing tension",
      duration: 1.5,
      tags: ["396hz", "root", "grounding"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(396, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.5 * (opts.volume || 1), t0 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 1.5);
      }
    },

    solfeggio_639: {
      id: "solfeggio_639",
      category: "solfeggio",
      title: "639 Hz Connection & Harmony",
      description: "Warm heart-centered harmonic connection tone",
      duration: 1.5,
      tags: ["639hz", "heart", "harmony"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var freqs = [639, 639 * 1.5]; // Perfect fifth harmony
        freqs.forEach(function (f, i) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t0);
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime((0.4 / (i + 1)) * (opts.volume || 1), t0 + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.45);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0);
          osc.stop(t0 + 1.5);
        });
      }
    },

    solfeggio_741: {
      id: "solfeggio_741",
      category: "solfeggio",
      title: "741 Hz Awakening Intuition",
      description: "Crystalline clarity tone for mental focus and problem solving",
      duration: 1.4,
      tags: ["741hz", "intuition", "clarity"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(741, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.42 * (opts.volume || 1), t0 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 1.4);
      }
    },

    solfeggio_852: {
      id: "solfeggio_852",
      category: "solfeggio",
      title: "852 Hz Spiritual Order",
      description: "High ethereal sine bell for elevating consciousness",
      duration: 1.4,
      tags: ["852hz", "spiritual", "ethereal"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(852, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.38 * (opts.volume || 1), t0 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 1.4);
      }
    },

    solfeggio_963: {
      id: "solfeggio_963",
      category: "solfeggio",
      title: "963 Hz Cosmic Pineal Awakening",
      description: "Crown chakra high bell resonance with pure crystal ring",
      duration: 1.4,
      tags: ["963hz", "crown", "pineal"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(963, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t0);
        osc.stop(t0 + 1.4);
      }
    },

    tibetan_bowl: {
      id: "tibetan_bowl",
      category: "solfeggio",
      title: "Tibetan Singing Bowl",
      description: "Acoustic metal bowl simulation with non-harmonic beating partials",
      duration: 2.2,
      tags: ["meditation", "bowl", "zen"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        // Partials for acoustic singing bowl
        var partials = [
          { f: 216, g: 0.45 },
          { f: 598, g: 0.3 },
          { f: 1042, g: 0.18 },
          { f: 1610, g: 0.08 }
        ];
        partials.forEach(function (p) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(p.f, t0);
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(p.g * (opts.volume || 1), t0 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.15);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0);
          osc.stop(t0 + 2.2);
        });
      }
    },

    binaural_alpha: {
      id: "binaural_alpha",
      category: "solfeggio",
      title: "10 Hz Alpha Wave Focus Tone",
      description: "Binaural beat (210 Hz + 220 Hz) for deep focus & calm",
      duration: 2.0,
      tags: ["binaural", "alpha", "focus"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var oscL = ctx.createOscillator();
        var oscR = ctx.createOscillator();
        var gainL = ctx.createGain();
        var gainR = ctx.createGain();

        oscL.type = "sine";
        oscL.frequency.setValueAtTime(210, t0);

        oscR.type = "sine";
        oscR.frequency.setValueAtTime(220, t0); // 10Hz Alpha difference

        gainL.gain.setValueAtTime(0.001, t0);
        gainL.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 0.2);
        gainL.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.95);

        gainR.gain.setValueAtTime(0.001, t0);
        gainR.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 0.2);
        gainR.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.95);

        oscL.connect(gainL);
        gainL.connect(dest);
        oscR.connect(gainR);
        gainR.connect(dest);

        oscL.start(t0);
        oscR.start(t0);
        oscL.stop(t0 + 2.0);
        oscR.stop(t0 + 2.0);
      }
    },

    // -----------------------------------------------------------------------
    // Category 4: Gaming, Fanfares & Notifications (10 SFX)
    // -----------------------------------------------------------------------
    success_fanfare: {
      id: "success_fanfare",
      category: "gaming",
      title: "Victory Success Fanfare",
      description: "Triumphant arpeggiated major chord fanfare (C5 - E5 - G5 - C6)",
      duration: 0.55,
      tags: ["success", "fanfare", "victory"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach(function (freq, i) {
          var start = t0 + i * 0.08;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.45 * (opts.volume || 1), start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(start);
          osc.stop(start + 0.3);
        });
      }
    },

    level_up: {
      id: "level_up",
      category: "gaming",
      title: "Level Up Sparkle",
      description: "Ascending sparkling 8-bit / synth chord cascade with shimmer",
      duration: 0.48,
      tags: ["levelup", "upgrade", "sparkle"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        notes.forEach(function (freq, i) {
          var start = t0 + i * 0.055;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), start + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(start);
          osc.stop(start + 0.2);
        });
      }
    },

    error_buzz: {
      id: "error_buzz",
      category: "gaming",
      title: "Dissonant Error Buzz",
      description: "Tritone dissonant warning buzz with fast tremolo",
      duration: 0.25,
      tags: ["error", "fail", "warning"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(130.81, t0); // C3
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(185.00, t0); // F#3 (Tritone)

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.45 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(dest);

        osc1.start(t0);
        osc2.start(t0);
        osc1.stop(t0 + 0.25);
        osc2.stop(t0 + 0.25);
      }
    },

    warning_alarm: {
      id: "warning_alarm",
      category: "gaming",
      title: "Alert Warning Siren",
      description: "Dual-tone oscillating klaxon alarm",
      duration: 0.45,
      tags: ["alarm", "alert", "siren"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, t0);
        osc.frequency.setValueAtTime(1100, t0 + 0.12);
        osc.frequency.setValueAtTime(800, t0 + 0.24);
        osc.frequency.setValueAtTime(1100, t0 + 0.36);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.44);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.45);
      }
    },

    achievement_unlock: {
      id: "achievement_unlock",
      category: "gaming",
      title: "Achievement Unlock Chime",
      description: "Majestic Major 9th chord sparkle with warm resonance",
      duration: 0.7,
      tags: ["achievement", "unlock", "reward"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var chord = [523.25, 659.25, 783.99, 987.77, 1174.66]; // Cmaj9
        chord.forEach(function (f, i) {
          var delay = i * 0.04;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, t0 + delay);
          gain.gain.setValueAtTime(0.001, t0 + delay);
          gain.gain.linearRampToValueAtTime(0.3 * (opts.volume || 1), t0 + delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + 0.48);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t0 + delay);
          osc.stop(t0 + delay + 0.5);
        });
      }
    },

    coin_pickup: {
      id: "coin_pickup",
      category: "gaming",
      title: "Retro Coin Pickup",
      description: "Bright 2-stage arcade coin chime (B5 -> E6)",
      duration: 0.22,
      tags: ["coin", "retro", "arcade"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, t0); // B5
        osc.frequency.setValueAtTime(1318.51, t0 + 0.06); // E6

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.45 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.21);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.22);
      }
    },

    power_up: {
      id: "power_up",
      category: "gaming",
      title: "FM Power Up Surge",
      description: "Rising FM synth frequency charge",
      duration: 0.35,
      tags: ["powerup", "charge", "boost"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var carrier = ctx.createOscillator();
        var mod = ctx.createOscillator();
        var modGain = ctx.createGain();
        var gain = ctx.createGain();

        carrier.type = "sine";
        carrier.frequency.setValueAtTime(220, t0);
        carrier.frequency.exponentialRampToValueAtTime(880, t0 + 0.32);

        mod.type = "triangle";
        mod.frequency.setValueAtTime(30, t0);
        mod.frequency.exponentialRampToValueAtTime(120, t0 + 0.32);

        modGain.gain.setValueAtTime(150, t0);

        mod.connect(carrier.frequency);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.34);

        carrier.connect(gain);
        gain.connect(dest);

        mod.start(t0);
        carrier.start(t0);
        mod.stop(t0 + 0.35);
        carrier.stop(t0 + 0.35);
      }
    },

    countdown_tick: {
      id: "countdown_tick",
      category: "gaming",
      title: "Digital Countdown Tick",
      description: "Precise digital clock countdown blip",
      duration: 0.05,
      tags: ["countdown", "clock", "tick"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, t0);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.048);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.05);
      }
    },

    radar_ping: {
      id: "radar_ping",
      category: "gaming",
      title: "Sonar Radar Ping",
      description: "Submarine acoustic sonar pulse with decaying resonance",
      duration: 0.75,
      tags: ["radar", "sonar", "pulse"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1500, t0);
        osc.frequency.exponentialRampToValueAtTime(1400, t0 + 0.7);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.45 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.72);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.75);
      }
    },

    sub_bass_drop: {
      id: "sub_bass_drop",
      category: "gaming",
      title: "808 Sub-Bass Impact Boom",
      description: "Deep cinematic 808 sub-bass drop with long decay",
      duration: 0.85,
      tags: ["subbass", "808", "boom", "impact"],
      synthesize: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(130, t0);
        osc.frequency.exponentialRampToValueAtTime(32, t0 + 0.7);

        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.7 * (opts.volume || 1), t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.82);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        osc.stop(t0 + 0.85);
      }
    },

    // -----------------------------------------------------------------------
    // Category 5: Continuous Generative Soundscapes & Ambient Drones (4 Presets)
    // -----------------------------------------------------------------------
    ambient_space_drone: {
      id: "ambient_space_drone",
      category: "ambient",
      title: "Deep Space Cosmic Drone",
      description: "Warm multi-oscillator space drone with slow breathing filter modulation",
      isContinuous: true,
      tags: ["ambient", "drone", "space", "cosmic"],
      createLoop: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var nodes = [];

        // Dual detuned sub-bass oscillators
        var sub1 = ctx.createOscillator();
        var sub2 = ctx.createOscillator();
        sub1.type = "sawtooth";
        sub1.frequency.setValueAtTime(55, t0); // A1
        sub2.type = "triangle";
        sub2.frequency.setValueAtTime(55.5, t0); // Detuned A1

        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(180, t0);
        filter.Q.setValueAtTime(4, t0);

        // LFO for filter breathing
        var lfo = ctx.createOscillator();
        var lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.08, t0); // 12.5s cycle
        lfoGain.gain.setValueAtTime(120, t0);
        lfo.connect(filter.frequency);

        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.4 * (opts.volume || 1), t0 + 1.5);

        sub1.connect(filter);
        sub2.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        sub1.start(t0);
        sub2.start(t0);
        lfo.start(t0);

        nodes.push(sub1, sub2, lfo, lfoGain, filter, gain);
        return {
          nodes: nodes,
          gainNode: gain,
          stop: function (fadeMs) {
            var fadeSec = (fadeMs || 800) / 1000;
            var stopTime = ctx.currentTime + fadeSec;
            gain.gain.linearRampToValueAtTime(0.0001, stopTime);
            setTimeout(function () {
              nodes.forEach(function (n) {
                try { if (n.stop) n.stop(); n.disconnect(); } catch (e) {}
              });
            }, (fadeMs || 800) + 50);
          }
        };
      }
    },

    ambient_zen_528: {
      id: "ambient_zen_528",
      category: "ambient",
      title: "528Hz Solfeggio Zen Soundscape",
      description: "Gentle harmonic meditative bed combining 528Hz and 432Hz with soft tremolo",
      isContinuous: true,
      tags: ["ambient", "zen", "528hz", "meditation"],
      createLoop: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var nodes = [];

        var osc528 = ctx.createOscillator();
        var osc432 = ctx.createOscillator();
        var osc264 = ctx.createOscillator(); // Sub

        osc528.type = "sine";
        osc528.frequency.setValueAtTime(528, t0);

        osc432.type = "sine";
        osc432.frequency.setValueAtTime(432, t0);

        osc264.type = "sine";
        osc264.frequency.setValueAtTime(264, t0);

        var tremolo = ctx.createOscillator();
        var tremoloGain = ctx.createGain();
        tremolo.type = "sine";
        tremolo.frequency.setValueAtTime(0.12, t0);
        tremoloGain.gain.setValueAtTime(0.15, t0);

        var masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, t0);
        masterGain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 1.2);

        osc528.connect(masterGain);
        osc432.connect(masterGain);
        osc264.connect(masterGain);
        masterGain.connect(dest);

        osc528.start(t0);
        osc432.start(t0);
        osc264.start(t0);

        nodes.push(osc528, osc432, osc264, masterGain);
        return {
          nodes: nodes,
          gainNode: masterGain,
          stop: function (fadeMs) {
            var fadeSec = (fadeMs || 800) / 1000;
            var stopTime = ctx.currentTime + fadeSec;
            masterGain.gain.linearRampToValueAtTime(0.0001, stopTime);
            setTimeout(function () {
              nodes.forEach(function (n) {
                try { if (n.stop) n.stop(); n.disconnect(); } catch (e) {}
              });
            }, (fadeMs || 800) + 50);
          }
        };
      }
    },

    ambient_cyber_rain: {
      id: "ambient_cyber_rain",
      category: "ambient",
      title: "Cyberpunk Rain Generator",
      description: "Continuous brownian / pink noise rain simulation with dynamic filter modulations",
      isContinuous: true,
      tags: ["ambient", "rain", "cyberpunk", "whitenoise"],
      createLoop: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var nodes = [];

        var noise = ctx.createBufferSource();
        noise.buffer = getNoiseBuffer(ctx, "pink");
        noise.loop = true;

        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, t0);

        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.38 * (opts.volume || 1), t0 + 1.0);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        noise.start(t0);

        nodes.push(noise, filter, gain);
        return {
          nodes: nodes,
          gainNode: gain,
          stop: function (fadeMs) {
            var fadeSec = (fadeMs || 800) / 1000;
            var stopTime = ctx.currentTime + fadeSec;
            gain.gain.linearRampToValueAtTime(0.0001, stopTime);
            setTimeout(function () {
              nodes.forEach(function (n) {
                try { if (n.stop) n.stop(); n.disconnect(); } catch (e) {}
              });
            }, (fadeMs || 800) + 50);
          }
        };
      }
    },

    ambient_cyber_pulse: {
      id: "ambient_cyber_pulse",
      category: "ambient",
      title: "Synthwave Cyber Pulse Drone",
      description: "Rhythmic 120BPM pulsing bass drone with resonant filter modulation",
      isContinuous: true,
      tags: ["ambient", "synthwave", "pulse", "cyberpunk"],
      createLoop: function (ctx, dest, opts) {
        var t0 = ctx.currentTime;
        var nodes = [];

        var osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(65.41, t0); // C2

        var filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(200, t0);
        filter.Q.setValueAtTime(6, t0);

        // 2Hz = 120BPM pulse
        var lfo = ctx.createOscillator();
        var lfoGain = ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(2.0, t0);
        lfoGain.gain.setValueAtTime(300, t0);
        lfo.connect(filter.frequency);

        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.35 * (opts.volume || 1), t0 + 1.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(t0);
        lfo.start(t0);

        nodes.push(osc, lfo, lfoGain, filter, gain);
        return {
          nodes: nodes,
          gainNode: gain,
          stop: function (fadeMs) {
            var fadeSec = (fadeMs || 800) / 1000;
            var stopTime = ctx.currentTime + fadeSec;
            gain.gain.linearRampToValueAtTime(0.0001, stopTime);
            setTimeout(function () {
              nodes.forEach(function (n) {
                try { if (n.stop) n.stop(); n.disconnect(); } catch (e) {}
              });
            }, (fadeMs || 800) + 50);
          }
        };
      }
    }
  };

  // =========================================================================
  // --- Engine Methods & API ---
  // =========================================================================

  /**
   * Initialize audio subsystem, load persistence, attach unlock listeners
   */
  function init() {
    loadPersistedSettings();
    autoUnlockOnInteraction();
    bindUI();
    return this;
  }

  /**
   * Play a synthesized sound effect by ID
   * @param {string} soundId - The key in SOUND_LIBRARY
   * @param {Object} [opts] - Optional parameters: { volume: 0..1, pitch: 0.5..2.0 }
   * @returns {boolean} Whether play was triggered
   */
  function play(soundId, opts) {
    opts = opts || {};
    if (state.isMuted || state.reducedAudioMode) {
      emitEvent("blocked_by_guard", { soundId: soundId, muted: state.isMuted, reduced: state.reducedAudioMode });
      return false;
    }

    var def = SOUND_LIBRARY[soundId];
    if (!def) {
      console.warn("[SiteAudioSFX] Unknown sound effect:", soundId);
      return false;
    }

    // In SSR or Headless Node environment
    if (typeof window === "undefined") {
      return true;
    }

    var ctx = getAudioContext();
    if (!ctx) return false;

    // Auto-resume if needed
    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }

    try {
      def.synthesize(ctx, state.sfxGain, opts);
      emitEvent("played", { soundId: soundId, category: def.category });
      return true;
    } catch (err) {
      console.warn("[SiteAudioSFX] Error playing sound:", soundId, err);
      return false;
    }
  }

  /**
   * Start a continuous ambient soundscape
   * @param {string} ambientId - Key in SOUND_LIBRARY (must be isContinuous)
   * @param {Object} [opts] - Options { volume: 0..1, crossfadeMs: 800 }
   */
  function startAmbient(ambientId, opts) {
    opts = opts || {};
    if (state.isMuted || state.reducedAudioMode) {
      emitEvent("blocked_by_guard", { ambientId: ambientId });
      return false;
    }

    var def = SOUND_LIBRARY[ambientId];
    if (!def || !def.isContinuous) {
      console.warn("[SiteAudioSFX] Invalid ambient preset:", ambientId);
      return false;
    }

    // Stop currently running ambient loop with crossfade
    if (state.activeAmbient) {
      stopAmbient(opts.crossfadeMs || 800);
    }

    if (typeof window === "undefined") {
      state.activeAmbient = { id: ambientId, stop: function () {} };
      return true;
    }

    var ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }

    try {
      var loopHandle = def.createLoop(ctx, state.ambientGainNode, opts);
      state.activeAmbient = Object.assign({ id: ambientId }, loopHandle);
      emitEvent("ambient_started", { ambientId: ambientId });
      return true;
    } catch (err) {
      console.warn("[SiteAudioSFX] Error starting ambient:", ambientId, err);
      return false;
    }
  }

  /**
   * Stop active continuous ambient soundscape
   * @param {number} [fadeMs=800] - Fade out duration in milliseconds
   */
  function stopAmbient(fadeMs) {
    if (state.activeAmbient && typeof state.activeAmbient.stop === "function") {
      state.activeAmbient.stop(fadeMs || 800);
      var stoppedId = state.activeAmbient.id;
      state.activeAmbient = null;
      emitEvent("ambient_stopped", { ambientId: stoppedId });
      return true;
    }
    return false;
  }

  /**
   * Set Master Volume (0.0 to 1.0)
   */
  function setMasterVolume(val) {
    var v = Math.max(0, Math.min(1, Number(val)));
    state.masterVolume = v;
    if (state.masterGain && state.ctx) {
      var effective = state.isMuted ? 0 : v;
      state.masterGain.gain.setValueAtTime(effective, state.ctx.currentTime);
    }
    persistSettings();
    emitEvent("volume_change", { masterVolume: v });
    return v;
  }

  /**
   * Set SFX Volume (0.0 to 1.0)
   */
  function setSFXVolume(val) {
    var v = Math.max(0, Math.min(1, Number(val)));
    state.sfxVolume = v;
    if (state.sfxGain && state.ctx) {
      state.sfxGain.gain.setValueAtTime(v, state.ctx.currentTime);
    }
    persistSettings();
    emitEvent("volume_change", { sfxVolume: v });
    return v;
  }

  /**
   * Set Ambient Volume (0.0 to 1.0)
   */
  function setAmbientVolume(val) {
    var v = Math.max(0, Math.min(1, Number(val)));
    state.ambientVolume = v;
    if (state.ambientGainNode && state.ctx) {
      state.ambientGainNode.gain.setValueAtTime(v, state.ctx.currentTime);
    }
    persistSettings();
    emitEvent("volume_change", { ambientVolume: v });
    return v;
  }

  /**
   * Toggle Mute State
   */
  function toggleMute() {
    return setMute(!state.isMuted);
  }

  /**
   * Set Mute explicitly
   */
  function setMute(muted) {
    state.isMuted = !!muted;
    if (state.masterGain && state.ctx) {
      var effective = state.isMuted ? 0 : state.masterVolume;
      state.masterGain.gain.setValueAtTime(effective, state.ctx.currentTime);
    }
    if (state.isMuted && state.activeAmbient) {
      stopAmbient(200);
    }
    persistSettings();
    emitEvent("mute_change", { isMuted: state.isMuted });
    return state.isMuted;
  }

  /**
   * Set Accessibility Reduced Audio Mode
   */
  function setReducedAudioMode(enabled) {
    state.reducedAudioMode = !!enabled;
    if (state.reducedAudioMode && state.activeAmbient) {
      stopAmbient(200);
    }
    persistSettings();
    emitEvent("reduced_audio_change", { reducedAudioMode: state.reducedAudioMode });
    return state.reducedAudioMode;
  }

  /**
   * List all available sounds in catalog
   */
  function listSounds(category) {
    var keys = Object.keys(SOUND_LIBRARY);
    var res = keys.map(function (k) {
      var s = SOUND_LIBRARY[k];
      return {
        id: s.id,
        category: s.category,
        title: s.title,
        description: s.description,
        duration: s.duration || null,
        isContinuous: !!s.isContinuous,
        tags: s.tags || []
      };
    });
    if (category) {
      res = res.filter(function (item) { return item.category === category; });
    }
    return res;
  }

  /**
   * Get sound definition by ID
   */
  function getSound(id) {
    return SOUND_LIBRARY[id] || null;
  }

  /**
   * Declarative DOM Autobinding
   * Scans elements for data-sfx, data-sfx-hover, data-sfx-focus and attaches sounds
   */
  function bindUI(rootEl) {
    if (typeof document === "undefined") return;
    var root = rootEl || document;

    // Click triggers
    var clickEls = root.querySelectorAll("[data-sfx]");
    clickEls.forEach(function (el) {
      if (el._sfxBoundClick) return;
      el._sfxBoundClick = true;
      el.addEventListener("click", function () {
        var sfx = el.getAttribute("data-sfx") || "ui_click";
        var vol = parseFloat(el.getAttribute("data-sfx-vol")) || 1.0;
        play(sfx, { volume: vol });
      });
    });

    // Hover triggers
    var hoverEls = root.querySelectorAll("[data-sfx-hover]");
    hoverEls.forEach(function (el) {
      if (el._sfxBoundHover) return;
      el._sfxBoundHover = true;
      el.addEventListener("mouseenter", function () {
        var sfx = el.getAttribute("data-sfx-hover") || "ui_hover";
        var vol = parseFloat(el.getAttribute("data-sfx-vol")) || 0.8;
        play(sfx, { volume: vol });
      });
    });
  }

  // =========================================================================
  // --- Zoth Tool Bench Uniform Harness Interface ---
  // =========================================================================

  var ACTIONS = [
    "sfx.list",
    "sfx.play",
    "sfx.ambient_start",
    "sfx.ambient_stop",
    "sfx.volume",
    "sfx.mute",
    "sfx.reduced_mode",
    "sfx.status"
  ];

  function validate(request) {
    if (!request || typeof request !== "object") {
      return { ok: false, error: { code: "invalid_request", message: "Request must be an object" } };
    }
    if (!request.action || ACTIONS.indexOf(request.action) === -1) {
      return {
        ok: false,
        error: { code: "unknown_action", message: "Action must be one of: " + ACTIONS.join(", ") }
      };
    }
    var p = request.params || {};
    if (request.action === "sfx.play" && (!p.sound_id || !SOUND_LIBRARY[p.sound_id])) {
      return {
        ok: false,
        error: { code: "invalid_sound_id", message: "sound_id is required and must exist in SOUND_LIBRARY" }
      };
    }
    if (request.action === "sfx.ambient_start" && (!p.ambient_id || !SOUND_LIBRARY[p.ambient_id])) {
      return {
        ok: false,
        error: { code: "invalid_ambient_id", message: "ambient_id is required and must exist in SOUND_LIBRARY" }
      };
    }
    return { ok: true };
  }

  async function runTool(request, opts) {
    var v = validate(request);
    if (!v.ok) return v;

    var p = request.params || {};
    var action = request.action;

    switch (action) {
      case "sfx.list":
        return {
          ok: true,
          data: {
            total: Object.keys(SOUND_LIBRARY).length,
            sounds: listSounds(p.category)
          }
        };

      case "sfx.play":
        var played = play(p.sound_id, { volume: p.volume, pitch: p.pitch });
        return {
          ok: true,
          data: {
            played: played,
            sound_id: p.sound_id,
            meta: getSound(p.sound_id)
          }
        };

      case "sfx.ambient_start":
        var started = startAmbient(p.ambient_id, { volume: p.volume, crossfadeMs: p.crossfade_ms });
        return {
          ok: true,
          data: {
            started: started,
            ambient_id: p.ambient_id
          }
        };

      case "sfx.ambient_stop":
        var stopped = stopAmbient(p.fade_ms);
        return {
          ok: true,
          data: {
            stopped: stopped
          }
        };

      case "sfx.volume":
        if (p.master !== undefined) setMasterVolume(p.master);
        if (p.sfx !== undefined) setSFXVolume(p.sfx);
        if (p.ambient !== undefined) setAmbientVolume(p.ambient);
        return {
          ok: true,
          data: {
            master: state.masterVolume,
            sfx: state.sfxVolume,
            ambient: state.ambientVolume
          }
        };

      case "sfx.mute":
        var muted = p.muted !== undefined ? setMute(p.muted) : toggleMute();
        return {
          ok: true,
          data: {
            isMuted: muted
          }
        };

      case "sfx.reduced_mode":
        var red = setReducedAudioMode(p.enabled);
        return {
          ok: true,
          data: {
            reducedAudioMode: red
          }
        };

      case "sfx.status":
        return {
          ok: true,
          data: {
            isUnlocked: state.isUnlocked,
            isMuted: state.isMuted,
            masterVolume: state.masterVolume,
            sfxVolume: state.sfxVolume,
            ambientVolume: state.ambientVolume,
            reducedAudioMode: state.reducedAudioMode,
            activeAmbient: state.activeAmbient ? state.activeAmbient.id : null,
            totalPresets: Object.keys(SOUND_LIBRARY).length
          }
        };

      default:
        return { ok: false, error: { code: "unhandled_action", message: action } };
    }
  }

  // --- Auto-register with ZothToolBench if present ---
  var toolContract = {
    id: "site-audio-sfx",
    name: "Zoth Web Audio SFX & Soundscape Engine",
    version: "2026-08-22",
    actions: ACTIONS,
    validate: validate,
    run: runTool,
    meta: function (reqId) {
      return { request_id: reqId, engine: "Web Audio API (Procedural Synthesis)" };
    }
  };

  if (typeof root !== "undefined" && root.ZothToolBench && typeof root.ZothToolBench.register === "function") {
    try { root.ZothToolBench.register(toolContract); } catch (e) {}
  }

  // --- Public API Export ---
  var api = {
    // Lifecycle
    init: init,
    unlock: unlock,
    // Playback
    play: play,
    startAmbient: startAmbient,
    stopAmbient: stopAmbient,
    // Volume & Controls
    setMasterVolume: setMasterVolume,
    setSFXVolume: setSFXVolume,
    setAmbientVolume: setAmbientVolume,
    toggleMute: toggleMute,
    setMute: setMute,
    isMuted: function () { return state.isMuted; },
    setReducedAudioMode: setReducedAudioMode,
    isReducedAudio: function () { return state.reducedAudioMode; },
    // Catalog & Metadata
    listSounds: listSounds,
    getSound: getSound,
    SOUND_LIBRARY: SOUND_LIBRARY,
    SOLFEGGIO_FREQS: SOLFEGGIO_FREQS,
    // DOM Autobinding
    bindUI: bindUI,
    // Tool Bench Contract
    toolContract: toolContract,
    validate: validate,
    run: runTool
  };

  return api;
});
