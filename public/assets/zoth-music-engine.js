/**
 * Zoth Procedural Web Audio Music Synthesizer & Soundtrack Engine
 * 100% Client-Side, Zero External MP3 Dependencies.
 * Features Rick Rubin "Reducer" Minimalist Beats & Cyberpunk Arpeggiators.
 */

(function(window) {
  'use strict';

  class ZothMusicEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.currentTrack = 'rubin_808';
      this.bpm = 92;
      this.step = 0;
      this.timerId = null;
      this.masterGain = null;
      this.filterNode = null;
      this.delayNode = null;
      this.delayFeedback = null;
      this.analyser = null;
      this.dataArray = null;

      // Track Definitions & Scales (Frequencies in Hz)
      this.tracks = {
        solfeggio_432: {
          name: "✨ 432Hz Sacred Solfeggio",
          genre: "Hermetic Resonance & Golden Drone",
          bpm: 72,
          scale: [432.00, 528.00, 639.00, 741.00, 852.00, 963.00, 216.00, 288.00],
          bassSeq: [108.00, 0, 0, 0, 144.00, 0, 0, 0, 216.00, 0, 0, 0, 108.00, 0, 0, 0],
          leadSeq: [0, 1, 2, 0, 3, 0, 4, 5, 0, 1, 3, 2, 5, 4, 1, 0],
          drumPattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        rubin_808: {
          name: "🧘 Rubin 808 Reducer",
          genre: "Minimalist Raw 808 & Silence",
          bpm: 90,
          scale: [130.81, 146.83, 164.81, 196.00, 220.00],
          bassSeq: [55.00, 0, 0, 0, 0, 0, 55.00, 0, 0, 0, 65.41, 0, 0, 0, 0, 0],
          leadSeq: [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
          drumPattern: [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0]
        },
        primal_truth: {
          name: "🌑 Primal Truth",
          genre: "Deep Heartbeat & Ambient Space",
          bpm: 74,
          scale: [110.00, 130.81, 146.83, 164.81, 196.00],
          bassSeq: [55.00, 0, 0, 0, 0, 0, 0, 0, 48.99, 0, 0, 0, 0, 0, 0, 0],
          leadSeq: [0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          drumPattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        azoth_transmutation: {
          name: "🌌 Azoth's Transmutation",
          genre: "Cyberpunk Synthwave",
          bpm: 122,
          scale: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63],
          bassSeq: [65.41, 0, 65.41, 0, 77.78, 0, 87.31, 0, 65.41, 0, 65.41, 0, 98.00, 0, 87.31, 0],
          leadSeq: [0, 4, 2, 7, 0, 5, 3, 7, 0, 4, 2, 7, 5, 4, 2, 1],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 2, 0]
        },
        parrot_airgap: {
          name: "🛡️ Parrot Airgap Protocol",
          genre: "Industrial Glitch & Sub-Bass",
          bpm: 130,
          scale: [110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00],
          bassSeq: [55.00, 55.00, 0, 55.00, 65.41, 0, 55.00, 0, 55.00, 55.00, 0, 55.00, 73.42, 65.41, 55.00, 0],
          leadSeq: [0, 0, 3, 0, 5, 0, 7, 6, 0, 0, 3, 0, 7, 0, 5, 3],
          drumPattern: [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 0, 1, 2, 2, 2]
        },
        hermetic_sanctum: {
          name: "👑 Hermetic Sovereign Sanctum",
          genre: "Ambient Ethereal Drone & Chimes",
          bpm: 86,
          scale: [216.00, 288.00, 324.00, 432.00, 528.00, 639.00, 864.00, 963.00],
          bassSeq: [108.00, 0, 0, 0, 216.00, 0, 0, 0, 432.00, 0, 0, 0, 216.00, 0, 0, 0],
          leadSeq: [0, 2, 4, 6, 7, 5, 3, 1, 0, 2, 4, 6, 7, 6, 4, 2],
          drumPattern: [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        draco_swarm: {
          name: "🐉 Draco Swarm Arena",
          genre: "High-Octane Kinetic Drum & Bass",
          bpm: 140,
          scale: [123.47, 138.59, 146.83, 164.81, 185.00, 196.00, 220.00, 246.94],
          bassSeq: [61.74, 61.74, 61.74, 0, 73.42, 0, 82.41, 0, 61.74, 61.74, 61.74, 0, 98.00, 0, 82.41, 73.42],
          leadSeq: [7, 5, 3, 2, 7, 5, 4, 2, 7, 5, 3, 2, 1, 2, 3, 5],
          drumPattern: [1, 0, 0, 2, 0, 1, 2, 0, 1, 0, 0, 2, 0, 1, 2, 1]
        },
        quantum_nexus: {
          name: "⚡ Quantum Nexus 3D",
          genre: "Lo-Fi Neural Waves",
          bpm: 96,
          scale: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23],
          bassSeq: [65.41, 0, 0, 65.41, 77.78, 0, 0, 0, 87.31, 0, 0, 87.31, 65.41, 0, 0, 0],
          leadSeq: [0, 1, 2, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 2, 4, 5],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0]
        }
      };
      this.targetVolume = 0.38;
    }

    initContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(this.targetVolume, this.ctx.currentTime + 0.05);

        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(2600, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime);

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.25, this.ctx.currentTime);
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.24, this.ctx.currentTime);

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.filterNode);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTrack(trackKey) {
      this.initContext();
      if (trackKey && this.tracks[trackKey]) {
        this.currentTrack = trackKey;
        this.bpm = this.tracks[trackKey].bpm;
      }
      if (this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
        this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 0.05);
      }
      this.isPlaying = true;
      this.step = 0;
      this.scheduleNextStep();
    }

    stopTrack() {
      this.isPlaying = false;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      }
    }

    scheduleNextStep() {
      if (!this.isPlaying) return;

      const track = this.tracks[this.currentTrack];
      if (!track) return;
      const now = this.ctx.currentTime;
      const stepTime = (60 / this.bpm) / 4;

      const drumType = track.drumPattern[this.step % 16];
      if (drumType === 1) this.triggerKick(now, this.currentTrack === 'rubin_808');
      else if (drumType === 2) this.triggerSnare(now);
      if (this.currentTrack !== 'rubin_808' || this.step % 4 === 0) {
        this.triggerHiHat(now, this.step % 2 === 0);
      }

      const bassFreq = track.bassSeq[this.step % 16];
      if (bassFreq > 0) {
        this.triggerBass(now, bassFreq, stepTime * 1.8);
      }

      const leadIdx = track.leadSeq[this.step % 16];
      const leadFreq = track.scale[leadIdx % track.scale.length];
      if (leadFreq > 0) {
        this.triggerLead(now, leadFreq, stepTime * 0.9);
      }

      this.step++;
      this.timerId = setTimeout(() => this.scheduleNextStep(), stepTime * 1000);
    }

    triggerKick(time, isRubinHeavy = false) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startFreq = isRubinHeavy ? 160 : 130;
      const endFreq = isRubinHeavy ? 28 : 35;
      const duration = isRubinHeavy ? 0.28 : 0.14;
      const peak = isRubinHeavy ? 1.0 : 0.85;

      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);
      
      // Micro attack ramp to prevent DC pop
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + duration);

      setTimeout(() => {
        try { osc.disconnect(); gain.disconnect(); } catch(e) {}
      }, (duration + 0.05) * 1000);
    }

    triggerSnare(time) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.1), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      noise.buffer = buffer;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.38, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
      
      noise.connect(gain);
      gain.connect(this.filterNode);
      noise.start(time);
      noise.stop(time + 0.1);

      setTimeout(() => {
        try { noise.disconnect(); gain.disconnect(); } catch(e) {}
      }, 150);
    }

    triggerHiHat(time, accent) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(7500, time);
      
      const peak = accent ? 0.12 : 0.05;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);
      
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.035);

      setTimeout(() => {
        try { osc.disconnect(); gain.disconnect(); } catch(e) {}
      }, 80);
    }

    triggerBass(time, freq, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.55, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + duration);

      setTimeout(() => {
        try { osc.disconnect(); gain.disconnect(); } catch(e) {}
      }, (duration + 0.05) * 1000);
    }

    triggerLead(time, freq, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 2, time);
      
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gain);
      gain.connect(this.filterNode);
      gain.connect(this.delayNode);
      osc.start(time);
      osc.stop(time + duration);

      setTimeout(() => {
        try { osc.disconnect(); gain.disconnect(); } catch(e) {}
      }, (duration + 0.05) * 1000);
    }

    setFilterCutoff(freq) {
      if (this.filterNode && this.ctx) {
        this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.02);
      }
    }

    setVolume(val) {
      this.targetVolume = parseFloat(val) || 0.35;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.targetVolume, this.ctx.currentTime, 0.02);
      }
    }

    setBpm(val) {
      this.bpm = parseInt(val, 10) || 90;
    }

    getAnalyserData() {
      if (!this.analyser || !this.dataArray) return new Uint8Array(32);
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }

    getAudioDestinationStream() {
      this.initContext();
      const dest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(dest);
      return dest.stream;
    }
  }

  window.ZothMusicEngine = new ZothMusicEngine();
})(window);
