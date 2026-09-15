/**
 * AURUM / V. KESTREL — Ambient Soundscape & Procedural Haptic Audio Engine
 * Built with Web Audio API (Zero external assets, pure harmonic synthesis)
 */

(function () {
  'use strict';

  class AmbientAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.isPlaying = false;
      this.masterGain = null;
      this.filter = null;
      this.droneOscillators = [];
      this.lfo = null;

      this.toggleBtn = document.getElementById('ambient-audio-toggle');
      this.soundBars = document.querySelectorAll('.sound-bar');

      this.init();
    }

    init() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggleSound());
      }

      // Micro-haptic audio on interactive elements
      document.addEventListener('click', (e) => {
        if (e.target.closest('.magnetic-btn, .nav-link, .vault-card, .tab-btn')) {
          this.playHapticChime();
        }
      });
    }

    setupAudioContext() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;

      this.audioCtx = new AudioContext();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Low Pass Warm Filter (320Hz for tranquil subterranean warmth)
      this.filter = this.audioCtx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);
      this.filter.Q.setValueAtTime(2.0, this.audioCtx.currentTime);
      this.filter.connect(this.masterGain);

      // Harmonic Drone Frequencies (Root A1 = 55Hz, Fifth E2 = 82.4Hz, Octave A2 = 110Hz, Major Third C#3 = 138.6Hz)
      const droneFreqs = [55, 82.41, 110, 138.59, 164.81];

      droneFreqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Individual gains
        const oscVol = 0.08 / (idx + 1);
        gain.gain.setValueAtTime(oscVol, this.audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(this.filter);
        osc.start();

        this.droneOscillators.push({ osc, gain });
      });

      // LFO for slow, natural breathing modulation (0.08 Hz)
      this.lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      this.lfo.frequency.setValueAtTime(0.08, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(120, this.audioCtx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);
      this.lfo.start();

      return true;
    }

    toggleSound() {
      if (!this.audioCtx) {
        if (!this.setupAudioContext()) return;
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.isPlaying) {
        // Fade out
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);
        this.isPlaying = false;
        this.updateUI(false);
      } else {
        // Fade in
        this.masterGain.gain.linearRampToValueAtTime(0.35, this.audioCtx.currentTime + 1.5);
        this.isPlaying = true;
        this.updateUI(true);
      }
    }

    playHapticChime() {
      if (!this.audioCtx || !this.isPlaying) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Harmonic pentatonic crystalline glint (e.g. 880Hz or 1320Hz)
      const freqs = [880, 1174.66, 1318.51, 1760];
      const selectedFreq = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(selectedFreq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    }

    updateUI(playing) {
      if (this.soundBars) {
        this.soundBars.forEach(bar => {
          if (playing) {
            bar.classList.add('playing');
          } else {
            bar.classList.remove('playing');
          }
        });
      }

      const label = document.getElementById('sound-status-label');
      if (label) {
        label.textContent = playing ? 'Soundscape: Active' : 'Soundscape: Muted';
      }
    }
  }

  // Auto initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.aurumAudio = new AmbientAudioEngine(); });
  } else {
    window.aurumAudio = new AmbientAudioEngine();
  }
})();
