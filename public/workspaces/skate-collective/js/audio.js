/**
 * OBSIDIAN OATH // SKATE COLLECTIVE — WEB AUDIO SYNTHESIZER
 * Procedural skate sound effects: deck pops, grinds, tape clicks, sticker slaps,
 * and ambient street tape atmosphere. No external audio files needed!
 */

class SkateAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Authentic 7-ply maple skate pop sound (snappy transient + wooden body resonance)
  playDeckPop() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    // 1. High-frequency snap (urethane / grip contact)
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(800, t);
    snapOsc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
    snapGain.gain.setValueAtTime(0.7, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.09);

    // 2. Maple wood body resonance
    const woodOsc = this.ctx.createOscillator();
    const woodGain = this.ctx.createGain();
    woodOsc.type = 'triangle';
    woodOsc.frequency.setValueAtTime(240, t);
    woodOsc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    woodGain.gain.setValueAtTime(0.6, t);
    woodGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    woodOsc.connect(woodGain);
    woodGain.connect(this.ctx.destination);
    woodOsc.start(t);
    woodOsc.stop(t + 0.19);

    // 3. Crisp noise click
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Sticker slap sound (solid slap + adhesive snap)
  playStickerSlap() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.06);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);

    // Quick high click
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1600, t);
    osc2.frequency.exponentialRampToValueAtTime(300, t + 0.02);
    gain2.gain.setValueAtTime(0.3, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.03);
  }

  // Tape transport / mechanical button click
  playTapeClick() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.02);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Curb grind sound (crunchy metal & waxed concrete)
  playGrindSound() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const dur = 0.35;

    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Toggle lo-fi street tape ambient hum & subtle vinyl crackle
  toggleAmbientSound() {
    this.init();
    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
        setTimeout(() => {
          if (this.ambientNode) {
            this.ambientNode.stop();
            this.ambientNode.disconnect();
          }
          this.isAmbientPlaying = false;
          this.updateUI();
        }, 250);
      }
    } else {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.15; // Low volume tape hiss
      }

      this.ambientNode = this.ctx.createBufferSource();
      this.ambientNode.buffer = buffer;
      this.ambientNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.5);

      this.ambientNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNode.start(0);
      this.isAmbientPlaying = true;
      this.updateUI();
    }
  }

  updateUI() {
    const btn = document.getElementById('audio-toggle-btn');
    const ind = document.getElementById('audio-indicator');
    const text = document.getElementById('audio-btn-text');
    if (btn && ind && text) {
      if (this.isAmbientPlaying) {
        ind.classList.add('playing');
        text.textContent = 'STREET AUDIO: ON';
      } else {
        ind.classList.remove('playing');
        text.textContent = 'STREET AUDIO: OFF';
      }
    }
  }
}

window.skateAudio = new SkateAudioEngine();

document.addEventListener('DOMContentLoaded', () => {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      window.skateAudio.toggleAmbientSound();
    });
  }
});
