/**
 * CYBER STOIC PROTOCOL v3 - AUDIO SYNTHESIZER
 * Realtime Web Audio API synthesized ambient cyber-drone & telemetry SFX.
 * 100% self-contained, offline-ready, zero external audio assets required.
 */

class StoicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.volume = 0.35;
    this.droneRunning = false;
    this.droneNodes = [];
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  resume() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, now, 0.1);
    }
    if (!this.isMuted && !this.droneRunning) {
      this.startAmbientDrone();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.volume, now, 0.05);
    }
  }

  startAmbientDrone() {
    if (!this.ctx || this.droneRunning) return;
    this.droneRunning = true;

    try {
      // Base frequencies: 108Hz (Root), 162Hz (Fifth), 216Hz (Octave), 54Hz (Sub)
      const freqs = [54, 108, 162, 216];
      const now = this.ctx.currentTime;

      // Filter for warm, deep analog cyber texture
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(4.0, now);

      // Low frequency oscillator for subtle breathing filter modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now); // slow breath cycle (12.5s)
      lfoGain.gain.setValueAtTime(140, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.01, now);
      droneGain.gain.exponentialRampToValueAtTime(0.18, now + 3);

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), now);

        const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        if (pan) {
          pan.pan.setValueAtTime((idx - 1.5) * 0.4, now);
          osc.connect(pan);
          pan.connect(filter);
        } else {
          osc.connect(filter);
        }

        osc.start(now);
        this.droneNodes.push(osc);
      });

      filter.connect(droneGain);
      droneGain.connect(this.masterGain);

      this.droneNodes.push(lfo, lfoGain, filter, droneGain);
    } catch (e) {
      console.warn('Drone start error:', e);
    }
  }

  stopAmbientDrone() {
    this.droneNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.droneNodes = [];
    this.droneRunning = false;
  }

  // SFX: Crisp Cyber UI Click
  playClick() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // SFX: Soft Cyber UI Hover Blip
  playHover() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.03);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // SFX: Ethereal Quote Transition Chime (Harmonic chord)
  playChime() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio chord

      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.08, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 1.3);
      });
    } catch (e) {}
  }

  // SFX: Low frequency Warp / Mode Shift
  playWarp() {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  // SFX: Mind Centering Breath Tone
  playBreathPulse(phase) {
    if (this.isMuted) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = phase === 'inhale' ? 220 : phase === 'hold' ? 330 : 165;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    } catch (e) {}
  }
}

export const stoicAudio = new StoicAudioEngine();
