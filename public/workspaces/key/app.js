/**
 * KEY! (FATMANKEY) - MAIN APPLICATION CONTROLLER
 * Discography, Interactive Beat Lab UI, Network Graph, Cinema, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdlibButtons();
  initSequencerUI();
  initDiscographyFilters();
  initTrackModals();
  initNetworkTree();
  initCinemaPlayer();
  initFloatingPlayer();
});

/* ==========================================================================
   AD-LIB SOUND STRIP & BUTTONS
   ========================================================================== */
function initAdlibButtons() {
  const buttons = document.querySelectorAll('.adlib-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-adlib');
      if (window.TrapEngine) {
        window.TrapEngine.playAdlib(tag);
      }
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => { btn.style.transform = ''; }, 120);
    });
  });
}

/* ==========================================================================
   BEAT LAB (16-STEP SEQUENCER UI)
   ========================================================================== */
function initSequencerUI() {
  const engine = window.TrapEngine;
  if (!engine) return;

  const playBtn = document.getElementById('seq-play-toggle');
  const bpmSlider = document.getElementById('seq-bpm-slider');
  const bpmVal = document.getElementById('seq-bpm-val');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const clearBtn = document.getElementById('seq-clear-btn');
  const randBtn = document.getElementById('seq-rand-btn');
  const filterKnob = document.getElementById('seq-filter-slider');
  const distKnob = document.getElementById('seq-dist-slider');

  // Generate Step Buttons in DOM
  const channels = ['c-808', 'c-snare', 'c-hat', 'c-open', 'c-melody'];
  channels.forEach((chId, chIdx) => {
    const row = document.getElementById(chId);
    if (!row) return;

    row.innerHTML = '';
    for (let step = 0; step < 16; step++) {
      const btn = document.createElement('button');
      btn.className = 'step-btn';
      btn.setAttribute('data-channel', chIdx);
      btn.setAttribute('data-step', step);

      if (engine.grid[chIdx][step]) {
        btn.classList.add('active');
        if (chIdx === 4 || chIdx === 0) btn.classList.add('gold');
      }

      btn.addEventListener('click', () => {
        engine.ensureContext();
        const active = engine.toggleStep(chIdx, step);
        btn.classList.toggle('active', active === 1);
        if (chIdx === 4 || chIdx === 0) btn.classList.toggle('gold', active === 1);

        // Preview sound on click
        if (active) {
          if (chIdx === 0) engine.play808();
          else if (chIdx === 1) engine.playSnare();
          else if (chIdx === 2) engine.playHiHat();
          else if (chIdx === 3) engine.playOpenHat();
          else if (chIdx === 4) engine.playMelodyLead();
        }
      });

      row.appendChild(btn);
    }
  });

  // Play / Pause
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (engine.isPlaying) {
        engine.stopSequencer();
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<span>▶</span> START BEAT LAB';
      } else {
        engine.startSequencer();
        playBtn.classList.add('playing');
        playBtn.innerHTML = '<span>⏹</span> STOP SEQUENCER';
      }
    });
  }

  // BPM Slider
  if (bpmSlider && bpmVal) {
    bpmSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      bpmVal.textContent = val;
      engine.setBpm(val);
    });
  }

  // Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      engine.loadPreset(presetKey);

      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (bpmSlider && bpmVal) {
        bpmSlider.value = engine.bpm;
        bpmVal.textContent = engine.bpm;
      }

      refreshStepGrid(engine);
    });
  });

  // Clear
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      engine.clearGrid();
      refreshStepGrid(engine);
    });
  }

  // Randomize
  if (randBtn) {
    randBtn.addEventListener('click', () => {
      engine.randomizeGrid();
      refreshStepGrid(engine);
    });
  }

  // Filter & Distortion
  if (filterKnob) {
    filterKnob.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      engine.setFilterCutoff(val);
    });
  }
  if (distKnob) {
    distKnob.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      engine.setDistortion(val);
    });
  }

  // Step highlight animation callback
  engine.onStep((stepIndex) => {
    document.querySelectorAll('.step-btn').forEach(b => {
      if (parseInt(b.getAttribute('data-step'), 10) === stepIndex) {
        b.classList.add('current-step');
      } else {
        b.classList.remove('current-step');
      }
    });
  });
}

function refreshStepGrid(engine) {
  for (let ch = 0; ch < 5; ch++) {
    for (let step = 0; step < 16; step++) {
      const btn = document.querySelector(`.step-btn[data-channel="${ch}"][data-step="${step}"]`);
      if (btn) {
        const active = engine.grid[ch][step] === 1;
        btn.classList.toggle('active', active);
        if (ch === 4 || ch === 0) btn.classList.toggle('gold', active);
      }
    }
  }
}

/* ==========================================================================
   DISCOGRAPHY FILTERS & INTERACTION
   ========================================================================== */
function initDiscographyFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.disco-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   TRACK MODALS & DEEP DIVE VAULT
   ========================================================================== */
const albumVaultData = {
  '777': {
    title: '777 (with Kenny Beats)',
    year: '2018',
    producer: 'Kenny Beats (Entire Project)',
    studio: 'The Cave, Los Angeles, CA',
    summary: 'The landmark, critically celebrated collaborative album that solidified KEY! as a premier force and launched Kenny Beats into super-producer stardom. Featuring pristine crisp 808s, infectious melodic hooks, and iconic tracks like "Demolition 1 + 2", "Love On Ice" (ft. 6LACK), "Kelly Price Freestyle", and "Boss".',
    highlights: ['Demolition 1 + 2', 'Kelly Price Freestyle', 'Love On Ice (ft. 6LACK)', 'Boss', 'Dig It', 'Toronto'],
    lore: 'Recorded in intense sleepless studio sessions at Kenny Beats\' home studio. KEY! famously shouted "Whoa, Kenny!" during a session, which Kenny clipped and turned into his globally recognized producer tag.',
    stems: 'Heavy 808 sub bass, razor-sharp 1/32 hi-hat rolls, pitched vocal chops, saturated 808 glides.'
  },
  'marquis': {
    title: 'MARQUIS',
    year: '2024',
    producer: 'Marc B & KEY!',
    studio: 'Atlanta, GA',
    summary: 'A mature, deeply introspective self-titled project showing KEY! at the peak of his lyricism and distinct vocal delivery. Featuring rich, soulful trap production with atmospheric synths and honest reflections on longevity in hip hop.',
    highlights: ['Comfortable', 'No Fluke', 'Underground King', 'The Marquis Flow'],
    lore: 'KEY! chose to work with one singular producer (Marc B) to maintain a cohesive sonic universe from front to back, emphasizing vocal timbre and song structure.',
    stems: 'Warm vinyl rhodes, organic trap drums, melodic auto-tune layers, smooth 808 transitions.'
  },
  'alphajerk': {
    title: 'The Alpha Jerk (with Tony Seltzer)',
    year: '2021',
    producer: 'Tony Seltzer',
    studio: 'Brooklyn, NYC / Atlanta',
    summary: 'A gritty, lo-fi underground masterpiece fusing NYC drill/underground sample work with Atlanta bounce. Experimental vocal inflections, distorted beats, and unhinged energy.',
    highlights: ['Fallacy', 'My Team', 'Acetone', 'Spilt Milk', 'Ice Cream'],
    lore: 'A cross-regional underground collision that was hailed by Pitchfork and underground rap connoisseurs as one of the most creatively daring rap projects of the decade.',
    stems: 'Overdriven cassette saturation, crunchy bit-crushed snares, dark detuned synth melodies.'
  },
  'two9': {
    title: 'Two-9 Forever & Early Classics',
    year: '2011 - 2014',
    producer: 'FKi, TrapMoneyBenny, Childish Major, Metro Boomin',
    studio: 'East Atlanta, GA',
    summary: 'The genesis of the new Atlanta underground wave. Founding the Two-9 collective with Curtis Williams, Reese LaFlare, Jace, and Ceej, KEY! set the blueprint for mid-2010s internet rap culture.',
    highlights: ['Look At Wrist (ft. Father & Makonnen)', 'Give Em Hell', 'Mothers Are The Blame', 'Fathers Are The Curse'],
    lore: 'KEY! co-wrote and featured on the viral sensation "Look At Wrist" with Father and iLoveMakonnen, triggering the massive Awful Records era.',
    stems: 'Hypnotic repetitive chime melodies, minimalist 808 bounces, raw studio ad-libs.'
  }
};

function initTrackModals() {
  const modal = document.getElementById('disco-modal');
  const closeBtn = document.getElementById('modal-close');
  const infoBtns = document.querySelectorAll('.disco-info-btn');

  infoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const albumKey = btn.getAttribute('data-album');
      const data = albumVaultData[albumKey];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-producer').textContent = `Producer: ${data.producer} • ${data.year}`;
      document.getElementById('modal-summary').textContent = data.summary;
      document.getElementById('modal-lore').textContent = data.lore;
      document.getElementById('modal-stems').textContent = data.stems;

      const trackList = document.getElementById('modal-tracks');
      trackList.innerHTML = '';
      data.highlights.forEach(tr => {
        const li = document.createElement('li');
        li.textContent = tr;
        trackList.appendChild(li);
      });

      modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

/* ==========================================================================
   RAP FAMILY TREE / COLLAB NETWORK
   ========================================================================== */
function initNetworkTree() {
  const nodes = document.querySelectorAll('.node-card');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const artist = node.getAttribute('data-artist');
      if (window.TrapEngine) {
        window.TrapEngine.playAdlib('aye');
      }
      nodes.forEach(n => n.style.borderColor = '');
      node.style.borderColor = 'var(--accent-gold)';
    });
  });
}

/* ==========================================================================
   VIDEO CINEMA
   ========================================================================== */
function initCinemaPlayer() {
  const items = document.querySelectorAll('.cinema-item');
  const iframe = document.getElementById('cinema-iframe');
  const titleDisplay = document.getElementById('cinema-active-title');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const videoId = item.getAttribute('data-video');
      const title = item.querySelector('.cinema-title').textContent;

      if (iframe && videoId) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      if (titleDisplay) {
        titleDisplay.textContent = title;
      }
    });
  });
}

/* ==========================================================================
   FLOATING MINI PLAYER
   ========================================================================== */
function initFloatingPlayer() {
  const engine = window.TrapEngine;
  if (!engine) return;

  const playBtn = document.getElementById('player-play-toggle');
  const prevBtn = document.getElementById('player-prev');
  const nextBtn = document.getElementById('player-next');
  const titleElem = document.getElementById('player-title');
  const metaElem = document.getElementById('player-meta');
  const thumbElem = document.getElementById('player-thumb');
  const progressFill = document.getElementById('player-progress-fill');
  const progressTrack = document.getElementById('player-progress-track');

  function updatePlayerUI() {
    const track = engine.tracks[engine.currentTrackIndex];
    if (titleElem) titleElem.textContent = track.title;
    if (metaElem) metaElem.textContent = `${track.project} • ${track.bpm} BPM`;
    if (thumbElem) thumbElem.src = track.cover;
    if (playBtn) {
      playBtn.textContent = engine.isRadioPlaying ? '⏸' : '▶';
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (engine.isRadioPlaying) {
        engine.stopRadio();
      } else {
        engine.playTrack(engine.currentTrackIndex);
      }
      updatePlayerUI();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      engine.prevTrack();
      updatePlayerUI();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      engine.nextTrack();
      updatePlayerUI();
    });
  }

  // Quick play from cards
  document.querySelectorAll('.disco-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-track-index') || '0', 10);
      engine.playTrack(idx);
      updatePlayerUI();
    });
  });

  // Progress animation
  setInterval(() => {
    if (engine.isRadioPlaying && progressFill) {
      const currentVal = parseFloat(progressFill.style.width || '0');
      const nextVal = (currentVal + 1.2) % 100;
      progressFill.style.width = `${nextVal}%`;
    }
  }, 200);
}
