/**
 * KEY! (FATMANKEY) SHOWCASE - WEB AUDIO ENGINE & BEAT LAB
 * Real-time synthesis of Atlanta 808s, Trap Hi-Hats, Snares, Plucks, and Sound Tags.
 * Zero external audio dependency — 100% reliable offline/online.
 */

class TrapAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filterNode = null;
    this.distortionNode = null;
    this.analyser = null;
    this.isInitialized = false;

    // Sequencer state
    this.isPlaying = false;
    this.bpm = 138;
    this.currentStep = 0;
    this.timerId = null;
    this.lookahead = 25.0; // ms
    this.scheduleAheadTime = 0.1; // seconds
    this.nextNoteTime = 0.0;
    this.stepCallbacks = [];

    // Sequencer grid: 5 channels x 16 steps
    // 0: 808, 1: Snare, 2: Hi-Hat, 3: Open Hat, 4: Melody
    this.grid = [
      [1,0,0,0, 0,0,1,0, 0,1,0,0, 0,0,0,0], // 808
      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0], // Snare
      [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], // Hi-Hat
      [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], // Open Hat
      [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,1,0]  // Melody
    ];

    this.channelMutes = [false, false, false, false, false];
    this.channelSolos = [false, false, false, false, false];

    // Presets
    this.presets = {
      '777': {
        bpm: 138,
        name: '777 Demolition (Kenny Beats Style)',
        grid: [
          [1,0,0,0, 0,0,1,0, 0,1,0,0, 0,0,1,0],
          [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
          [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
          [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,1],
          [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,1,0]
        ]
      },
      'wrist': {
        bpm: 144,
        name: 'Look At Wrist (Awful Records Bounce)',
        grid: [
          [1,0,0,0, 0,0,0,0, 1,0,0,1, 0,0,0,0],
          [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
          [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,1],
          [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
          [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
        ]
      },
      'alphajerk': {
        bpm: 132,
        name: 'The Alpha Jerk (Tony Seltzer Raw NYC/ATL)',
        grid: [
          [1,0,0,1, 0,0,1,0, 0,0,1,0, 0,1,0,0],
          [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
          [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
          [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
          [1,1,0,0, 1,0,0,1, 1,0,0,1, 0,1,0,0]
        ]
      },
      'marquis': {
        bpm: 125,
        name: 'Marquis Late Night (Marc B Melodic)',
        grid: [
          [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
          [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
          [1,1,1,0, 1,1,1,0, 1,1,1,0, 1,1,1,1],
          [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
          [1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,1,0]
        ]
      }
    };

    // Virtual Track Player state
    this.currentTrackIndex = 0;
    this.isRadioPlaying = false;
    this.radioInterval = null;
    this.tracks = [
      {
        id: 'demolition',
        title: 'Demolition 1 + 2',
        project: '777 (with Kenny Beats)',
        year: '2018',
        bpm: 138,
        cover: 'assets/777.jpg',
        notes: [55, 58, 62, 65, 58, 62, 55, 58], // MIDI notes
        bassRoot: 38 // D1
      },
      {
        id: 'lookatwrist',
        title: 'Look At Wrist',
        project: 'Single (with Father & Makonnen)',
        year: '2014',
        bpm: 144,
        cover: 'assets/two9.jpg',
        notes: [60, 63, 67, 65, 63, 60, 65, 63],
        bassRoot: 36 // C1
      },
      {
        id: 'cableguy',
        title: 'Cable Guy (ft. Jay Critch)',
        project: '777 Deluxe (with Kenny Beats)',
        year: '2018',
        bpm: 140,
        cover: 'assets/777.jpg',
        notes: [57, 60, 64, 67, 64, 60, 57, 62],
        bassRoot: 33 // A0
      },
      {
        id: 'loveonice',
        title: 'Love On Ice (ft. 6LACK)',
        project: '777 (with Kenny Beats)',
        year: '2018',
        bpm: 120,
        cover: 'assets/777.jpg',
        notes: [50, 53, 57, 60, 57, 53, 50, 52],
        bassRoot: 38
      },
      {
        id: 'alphajerk',
        title: 'Alpha Jerk Anthem',
        project: 'The Alpha Jerk (with Tony Seltzer)',
        year: '2021',
        bpm: 132,
        cover: 'assets/alphajerk.jpg',
        notes: [53, 56, 60, 63, 60, 56, 53, 55],
        bassRoot: 35 // B0
      },
      {
        id: 'marquis',
        title: 'Comfortable',
        project: 'MARQUIS (Produced by Marc B)',
        year: '2024',
        bpm: 128,
        cover: 'assets/marquis.jpg',
        notes: [58, 62, 65, 69, 65, 62, 58, 60],
        bassRoot: 34 // Bb0
      }
    ];
  }

  init() {
    if (this.isInitialized) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Create Master chain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.85;

    // Filter Node (Cutoff control)
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 20000;
    this.filterNode.Q.value = 1.0;

    // Distortion Waveshaper
    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionNode.curve = this.makeDistortionCurve(0);
    this.distortionNode.oversample = '4x';

    // Master Analyser for visualizers
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    // Connect Master Chain
    this.distortionNode.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  makeDistortionCurve(amount = 0) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      if (k === 0) {
        curve[i] = x;
      } else {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
    }
    return curve;
  }

  setDistortion(amount) {
    if (!this.distortionNode) return;
    this.distortionNode.curve = this.makeDistortionCurve(amount);
  }

  setFilterCutoff(freq) {
    if (!this.filterNode) return;
    this.filterNode.frequency.setValueAtTime(freq, this.ctx.currentTime);
  }

  setMasterVolume(val) {
    if (!this.masterGain) return;
    this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
  }

  /* ========================================================================
     SYNTHESIS ENGINES (Atlanta 808, Snare, HiHats, Plucks)
     ======================================================================== */

  // Heavy Atlanta 808 Sub Bass
  play808(time = null, freq = 42, duration = 0.65) {
    this.ensureContext();
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const subSat = this.ctx.createWaveShaper();
    subSat.curve = this.makeDistortionCurve(20);

    osc.type = 'sine';

    // Pitch envelope: quick transient drop for the kick punch, then sustained 808 tone
    osc.frequency.setValueAtTime(freq * 3.5, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.12);

    // Amplitude envelope
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.8, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(subSat);
    subSat.connect(gain);
    gain.connect(this.distortionNode);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Snappy Trap Snare / Clap
  playSnare(time = null) {
    this.ensureContext();
    const t = time || this.ctx.currentTime;

    // Noise component
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 1.2;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.distortionNode);

    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(oscGain);
    oscGain.connect(this.distortionNode);

    noise.start(t);
    osc.start(t);
    noise.stop(t + 0.2);
    osc.stop(t + 0.1);
  }

  // Trap Hi-Hat (Crisp & Sizzling)
  playHiHat(time = null, isRolled = false) {
    this.ensureContext();
    const t = time || this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    const vol = isRolled ? 0.45 : 0.65;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isRolled ? 0.03 : 0.05));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.distortionNode);

    noise.start(t);
    noise.stop(t + 0.06);
  }

  // Open Hi-Hat
  playOpenHat(time = null) {
    this.ensureContext();
    const t = time || this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.distortionNode);

    noise.start(t);
    noise.stop(t + 0.35);
  }

  // Melodic Trap Pluck / Bell
  playMelodyLead(time = null, midiNote = 60) {
    this.ensureContext();
    const t = time || this.ctx.currentTime;
    const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'sine';

    osc.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 2, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, t + 0.3);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.distortionNode);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.4);
    osc2.stop(t + 0.4);
  }

  // Iconic Vocal Soundboard & Adlib Tag Generator
  playAdlib(tagType) {
    this.ensureContext();
    const t = this.ctx.currentTime;

    switch (tagType) {
      case 'whoakenny': {
        // Riser chime + pitched vocal resonant chord ("WHOA, KENNY!")
        const chord = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.04);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.4);
          g.gain.setValueAtTime(0.25, t + idx * 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
          osc.connect(g);
          g.connect(this.distortionNode);
          osc.start(t + idx * 0.04);
          osc.stop(t + 0.7);
        });
        // 808 impact
        this.play808(t + 0.3, 40, 0.8);
        break;
      }

      case 'aye': {
        // Punchy pitched trap vocal chop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.distortionNode);
        osc.start(t);
        osc.stop(t + 0.25);
        break;
      }

      case 'key': {
        // High melodic signature chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1174, t + 0.1);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(this.distortionNode);
        osc.start(t);
        osc.stop(t + 0.5);
        break;
      }

      case '777': {
        // Casino slot chime + gold 808
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.07);
          g.gain.setValueAtTime(0.3, t + idx * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);
          osc.connect(g);
          g.connect(this.distortionNode);
          osc.start(t + idx * 0.07);
          osc.stop(t + idx * 0.07 + 0.4);
        });
        this.play808(t + 0.28, 44, 0.7);
        break;
      }

      case 'wrist': {
        // Hypnotic 2014 bounce pluck
        [65, 68, 72, 70].forEach((note, idx) => {
          this.playMelodyLead(t + idx * 0.12, note);
        });
        break;
      }

      case 'yeah': {
        // Deep hype shout synth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.08);
        osc.frequency.exponentialRampToValueAtTime(130, t + 0.25);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(this.distortionNode);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      }
    }
  }

  /* ========================================================================
     SEQUENCER SCHEDULER (16 Steps)
     ======================================================================== */

  setBpm(newBpm) {
    this.bpm = Math.max(60, Math.min(180, newBpm));
  }

  toggleStep(channelIndex, stepIndex) {
    this.grid[channelIndex][stepIndex] = this.grid[channelIndex][stepIndex] ? 0 : 1;
    return this.grid[channelIndex][stepIndex];
  }

  loadPreset(presetKey) {
    if (this.presets[presetKey]) {
      const p = this.presets[presetKey];
      this.bpm = p.bpm;
      this.grid = p.grid.map(row => [...row]);
    }
  }

  clearGrid() {
    this.grid = this.grid.map(row => row.map(() => 0));
  }

  randomizeGrid() {
    this.grid = [
      Array.from({ length: 16 }, () => (Math.random() > 0.7 ? 1 : 0)),
      Array.from({ length: 16 }, (_, i) => (i % 4 === 2 ? 1 : (Math.random() > 0.85 ? 1 : 0))),
      Array.from({ length: 16 }, () => (Math.random() > 0.2 ? 1 : 0)),
      Array.from({ length: 16 }, () => (Math.random() > 0.8 ? 1 : 0)),
      Array.from({ length: 16 }, () => (Math.random() > 0.65 ? 1 : 0))
    ];
  }

  onStep(cb) {
    this.stepCallbacks.push(cb);
  }

  startSequencer() {
    this.ensureContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.scheduler();
  }

  stopSequencer() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  scheduler() {
    if (!this.isPlaying) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }

    this.timerId = setTimeout(() => this.scheduler(), this.lookahead);
  }

  scheduleStep(step, time) {
    // Notify UI
    const now = this.ctx.currentTime;
    const delay = Math.max(0, (time - now) * 1000);
    setTimeout(() => {
      if (this.isPlaying) {
        this.stepCallbacks.forEach(cb => cb(step));
      }
    }, delay);

    const isAnySolo = this.channelSolos.some(s => s);

    // 0: 808
    if (this.shouldPlayChannel(0, isAnySolo) && this.grid[0][step]) {
      this.play808(time, 42, 0.45);
    }
    // 1: Snare
    if (this.shouldPlayChannel(1, isAnySolo) && this.grid[1][step]) {
      this.playSnare(time);
    }
    // 2: HiHat
    if (this.shouldPlayChannel(2, isAnySolo) && this.grid[2][step]) {
      // 16th or fast roll
      const isRoll = step % 4 === 3 && Math.random() > 0.5;
      this.playHiHat(time, isRoll);
      if (isRoll) {
        const stepTime = (60.0 / this.bpm) / 4.0;
        this.playHiHat(time + stepTime * 0.5, true);
      }
    }
    // 3: Open Hat
    if (this.shouldPlayChannel(3, isAnySolo) && this.grid[3][step]) {
      this.playOpenHat(time);
    }
    // 4: Melodic Lead
    if (this.shouldPlayChannel(4, isAnySolo) && this.grid[4][step]) {
      const melodyNotes = [58, 62, 65, 69, 72, 65, 62, 70];
      const note = melodyNotes[step % melodyNotes.length];
      this.playMelodyLead(time, note);
    }
  }

  shouldPlayChannel(idx, isAnySolo) {
    if (this.channelMutes[idx]) return false;
    if (isAnySolo && !this.channelSolos[idx]) return false;
    return true;
  }

  advanceStep() {
    const secondsPerBeat = 60.0 / this.bpm;
    const stepDuration = secondsPerBeat / 4.0; // 16th notes
    this.nextNoteTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  /* ========================================================================
     VIRTUAL TRACK PLAYER (Radio Player)
     ======================================================================== */

  playTrack(index = 0) {
    this.ensureContext();
    this.currentTrackIndex = index % this.tracks.length;
    const track = this.tracks[this.currentTrackIndex];

    this.stopRadio();
    this.isRadioPlaying = true;

    // Build synthesized groove for this track
    let beatStep = 0;
    const stepTime = (60.0 / track.bpm) / 4.0;

    this.radioInterval = setInterval(() => {
      if (!this.isRadioPlaying) return;
      const t = this.ctx.currentTime;

      // Drums
      if (beatStep % 8 === 0 || beatStep % 8 === 6) {
        this.play808(t, track.bassRoot, 0.5);
      }
      if (beatStep % 8 === 4) {
        this.playSnare(t);
      }
      this.playHiHat(t, beatStep % 4 === 3);

      // Melody
      const noteIdx = beatStep % track.notes.length;
      if (beatStep % 2 === 0) {
        this.playMelodyLead(t, track.notes[noteIdx]);
      }

      beatStep = (beatStep + 1) % 32;
    }, stepTime * 1000);
  }

  stopRadio() {
    this.isRadioPlaying = false;
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
  }

  nextTrack() {
    this.playTrack(this.currentTrackIndex + 1);
  }

  prevTrack() {
    this.playTrack((this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length);
  }
}

// Global instance
window.TrapEngine = new TrapAudioEngine();
