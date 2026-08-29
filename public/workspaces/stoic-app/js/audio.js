/**
 * Procedural Web Audio API Soundscape & Chime Synthesizer
 * Zero external audio assets required.
 */

class StoicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.windGain = null;
    this.droneGain = null;
    this.fireGain = null;
    this.isInitialized = false;
    this.isPlayingAmbience = false;
    this.droneOscs = [];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  resumeContext() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  setVolume(val) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, val));
    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  startAmbience() {
    this.resumeContext();
    if (!this.ctx || this.isPlayingAmbience) return;
    this.isPlayingAmbience = true;

    this._startHarmonicDrone();
    this._startWindNoise();
    this._startFlameCrackle();
  }

  _startHarmonicDrone() {
    if (!this.ctx) return;
    // Harmonic frequencies for Athenian calm: D2 (73.4Hz), A2 (110Hz), D3 (146.8Hz), F#3 (185Hz), A3 (220Hz)
    const freqs = [73.4, 110.0, 146.83, 185.0, 220.0];

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 3);

    // Warm Lowpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    // LFO to slowly sweep filter frequency (breathing effect)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12.5 second breath
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.4, this.ctx.currentTime);

      const amp = 0.3 / (idx + 1);
      oscGain.gain.setValueAtTime(amp, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      this.droneOscs.push(osc);
    });

    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);
  }

  _startWindNoise() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate pinkish noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.1) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(450, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Wind gust LFO
    const windLfo = this.ctx.createOscillator();
    const windLfoGain = this.ctx.createGain();
    windLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    windLfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(bandpass.frequency);
    windLfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.windGain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 4);

    whiteNoise.connect(bandpass);
    bandpass.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start();
  }

  _startFlameCrackle() {
    if (!this.ctx) return;
    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

    // Flame low rumble
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = "sawtooth";
    rumbleOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.setValueAtTime(80, this.ctx.currentTime);

    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(this.fireGain);
    this.fireGain.connect(this.masterGain);
    rumbleOsc.start();
  }

  // Play a resonant temple bell / crystal chime
  playTempleChime(pitchMultiplier = 1.0) {
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    const baseFreq = 440 * pitchMultiplier; // A4
    const partials = [
      { ratio: 1.0, gain: 0.35, decay: 3.5 },
      { ratio: 1.503, gain: 0.22, decay: 2.8 },
      { ratio: 2.01, gain: 0.14, decay: 2.0 },
      { ratio: 2.76, gain: 0.08, decay: 1.4 },
      { ratio: 3.82, gain: 0.04, decay: 0.9 }
    ];

    const now = this.ctx.currentTime;
    const chimeGroup = this.ctx.createGain();
    chimeGroup.gain.setValueAtTime(1, now);
    chimeGroup.connect(this.masterGain);

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * p.ratio, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(p.gain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + p.decay);

      osc.connect(gain);
      gain.connect(chimeGroup);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }

  // Play an affirmation / virtue discovery chime
  playVirtueChime(virtueIndex = 0) {
    const scales = [1.0, 1.25, 1.333, 1.5, 1.75];
    const pitch = scales[virtueIndex % scales.length] || 1.0;
    this.playTempleChime(pitch);
  }

  // Play a soft water drop / pebble ripple sound
  playWaterDrop() {
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 800 + Math.random() * 300;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Play an alchemical forge flame burst sound
  playForgeIgnite() {
    this.resumeContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.6);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }
}

export const audio = new StoicAudioEngine();
