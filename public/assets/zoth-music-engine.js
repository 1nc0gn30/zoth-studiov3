/**
 * Zoth Procedural Web Audio Music Synthesizer & Soundtrack Engine
 * 100% Client-Side, Zero External MP3 Dependencies, 16-Step Arpeggiator,
 * FM Synth Bass, Synthetic Drums, and Real-Time Audio Engine.
 */

(function(window) {
  'use strict';

  class ZothMusicEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.currentTrack = 'azoth_transmutation';
      this.bpm = 118;
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
        azoth_transmutation: {
          name: "🌌 Azoth\'s Transmutation",
          genre: "Cyberpunk Synthwave",
          bpm: 122,
          scale: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63], // C Minor
          bassSeq: [65.41, 0, 65.41, 0, 77.78, 0, 87.31, 0, 65.41, 0, 65.41, 0, 98.00, 0, 87.31, 0],
          leadSeq: [0, 4, 2, 7, 0, 5, 3, 7, 0, 4, 2, 7, 5, 4, 2, 1],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 1, 2, 0]
        },
        parrot_airgap: {
          name: "🛡️ Parrot Airgap Protocol",
          genre: "Industrial Glitch & Sub-Bass",
          bpm: 130,
          scale: [110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 220.00], // A Minor Phrygian
          bassSeq: [55.00, 55.00, 0, 55.00, 65.41, 0, 55.00, 0, 55.00, 55.00, 0, 55.00, 73.42, 65.41, 55.00, 0],
          leadSeq: [0, 0, 3, 0, 5, 0, 7, 6, 0, 0, 3, 0, 7, 0, 5, 3],
          drumPattern: [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 0, 1, 2, 2, 2]
        },
        hermetic_sanctum: {
          name: "👑 Hermetic Sovereign Sanctum",
          genre: "Ambient Ethereal Drone & Chimes",
          bpm: 86,
          scale: [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63, 370.00], // D Lydian
          bassSeq: [73.42, 0, 0, 0, 92.50, 0, 0, 0, 110.00, 0, 0, 0, 73.42, 0, 0, 0],
          leadSeq: [0, 2, 4, 6, 7, 5, 3, 1, 0, 2, 4, 6, 7, 6, 4, 2],
          drumPattern: [1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0]
        },
        draco_swarm: {
          name: "🐉 Draco Swarm Arena",
          genre: "High-Octane Kinetic Drum & Bass",
          bpm: 140,
          scale: [123.47, 138.59, 146.83, 164.81, 185.00, 196.00, 220.00, 246.94], // B Minor
          bassSeq: [61.74, 61.74, 61.74, 0, 73.42, 0, 82.41, 0, 61.74, 61.74, 61.74, 0, 98.00, 0, 82.41, 73.42],
          leadSeq: [7, 5, 3, 2, 7, 5, 4, 2, 7, 5, 3, 2, 1, 2, 3, 5],
          drumPattern: [1, 0, 0, 2, 0, 1, 2, 0, 1, 0, 0, 2, 0, 1, 2, 1]
        },
        quantum_nexus: {
          name: "⚡ Quantum Nexus 3D",
          genre: "Lo-Fi Neural Waves",
          bpm: 96,
          scale: [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23], // C Pentatonic
          bassSeq: [65.41, 0, 0, 65.41, 77.78, 0, 0, 0, 87.31, 0, 0, 87.31, 65.41, 0, 0, 0],
          leadSeq: [0, 1, 2, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 2, 4, 5],
          drumPattern: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0]
        }
      };
    }

    initContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master Output Chain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(3.0, this.ctx.currentTime);

        // Delay & Echo Feed
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.24, this.ctx.currentTime);
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.setValueAtTime(0.28, this.ctx.currentTime);

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.filterNode);

        // Analyser for real-time oscilloscope
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
    }

    scheduleNextStep() {
      if (!this.isPlaying) return;

      const track = this.tracks[this.currentTrack];
      const now = this.ctx.currentTime;
      const stepTime = (60 / this.bpm) / 4; // 16th note duration

      // 1. Trigger Synthetic Drums
      const drumType = track.drumPattern[this.step % 16];
      if (drumType === 1) this.triggerKick(now);
      else if (drumType === 2) this.triggerSnare(now);
      this.triggerHiHat(now, this.step % 2 === 0);

      // 2. Trigger FM Synth Bass
      const bassFreq = track.bassSeq[this.step % 16];
      if (bassFreq > 0) {
        this.triggerBass(now, bassFreq, stepTime * 1.5);
      }

      // 3. Trigger Kinetic Lead Arpeggio
      const leadIdx = track.leadSeq[this.step % 16];
      const leadFreq = track.scale[leadIdx % track.scale.length];
      if (leadFreq > 0) {
        this.triggerLead(now, leadFreq, stepTime * 0.9);
      }

      this.step++;
      this.timerId = setTimeout(() => this.scheduleNextStep(), stepTime * 1000);
    }

    triggerKick(time) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
      gain.gain.setValueAtTime(0.9, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.14);
    }

    triggerSnare(time) {
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      noise.connect(gain);
      gain.connect(this.filterNode);
      noise.start(time);
      noise.stop(time + 0.1);
    }

    triggerHiHat(time, accent) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(7000, time);
      gain.gain.setValueAtTime(accent ? 0.15 : 0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + 0.04);
    }

    triggerBass(time, freq, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(time);
      osc.stop(time + duration);
    }

    triggerLead(time, freq, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 2, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(this.filterNode);
      gain.connect(this.delayNode);
      osc.start(time);
      osc.stop(time + duration);
    }

    setFilterCutoff(freq) {
      if (this.filterNode) {
        this.filterNode.frequency.setValueAtTime(freq, this.ctx ? this.ctx.currentTime : 0);
      }
    }

    setVolume(val) {
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(val, this.ctx ? this.ctx.currentTime : 0);
      }
    }

    setBpm(val) {
      this.bpm = parseInt(val, 10) || 120;
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
