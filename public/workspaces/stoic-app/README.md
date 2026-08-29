# Stoa Poikile — Stoicisme 3D World (Arx Mentis)

An interactive 3D Greco-Roman philosophical sanctuary built with **Three.js** and WebGL. Explore the central **Rotunda of Reason**, the **Stoa of Wisdom**, the **Bastion of Courage**, the **Forum of Justice**, and the **Garden of Temperance**.

---

## 🏛️ Sanctuary Architecture & Shrines

1. **Central Rotunda (*Arx Mentis* — The Inner Citadel)**:
   - Pantheon-inspired open oculus casting volumetric light shafts.
   - 12 Corinthian marble columns and the eternal *Brazier of Logos* with rising flame particles.
   - Focus: The unassailable sanctuary of the rational mind (*Hegemonikon*).

2. **North Wing — Stoa of Wisdom (*Sophia / Phronesis*)**:
   - Celestial Orrery with rotating concentric rings of truth.
   - Inscription: *ΓΝΩΘΙ ΣΕΑΥΤΟΝ* (Know Thyself).
   - Interactive Tool: **Dichotomy of Control Engine** (sorting internal choices vs external fortune).

3. **South Wing — Bastion of Courage (*Andreia*)**:
   - Fortified parapets, obelisks, and the glowing **Memento Mori Sandglass**.
   - Interactive Tool: **Amor Fati Crucible** (transmuting adversity into fuel for character).

4. **East Wing — Forum of Justice (*Dikaiosyne*)**:
   - Classical semicircular amphitheater and globe of Cosmopolitanism (*Sympatheia*).
   - Inscription: *Hierocles' Concentric Circles of Humanity*.

5. **West Wing — Garden of Temperance (*Sophrosyne*)**:
   - Serene reflecting pool with animated caustic waves and floating Lotus prism of Equanimity (*Ataraxia*).
   - Mediterranean cypress groves and marble pergolas.

---

## 🎮 Navigation & Camera Controls

- **Walk Mode (`WASD` / Arrow Keys)**: First-person walking exploration with collision boundaries and sprint (`Shift`).
- **Orbit Mode (`Mouse Drag` / `Scroll`)**: Free 360° architectural inspection.
- **Guided Tour Mode**: Automated drone flight traversing all 4 virtue shrines with narration cards.
- **The View from Above (`V` Key / Cosmic View)**: Cinematic ascent into space looking down at the earth, shrinking worries to cosmic scale.
- **Fast Travel (`1` to `5` Keys)**: Instant smooth camera swoops to any of the 5 landmarks.
- **Zen Mode (`Z` Key)**: Hides the entire HUD for meditation, contemplation, and photography.

---

## 🛠️ Interactive Philosophy Modules

1. **Dichotomy of Control Flashcard Game**: Test your ability to distinguish between what depends on you vs external circumstance.
2. **Memento Mori Sandglass & Life Grid**: Input your age to visualize lived weeks vs remaining weeks across an 80-year horizon.
3. **Amor Fati Forge**: Input any frustration, worry, or regret and transmute it through Marcus Aurelius's alchemical lens.
4. **Stoic Quote Oracle**: 50+ searchable quotes from Marcus Aurelius, Seneca, and Epictetus with practical reflections.
5. **Seneca's Evening Examen**: 3-prompt nightly self-examination saved to local browser storage.
6. **Philosopher Codex**: Biographical profiles, key works, and core philosophies of the Stoic sages.

---

## 🎵 Synthesized Web Audio Soundscape

- **Harmonic Singing Bowl Drone**: Multi-oscillator harmonic chord (D-A-D-F#-A) with breathing LFO filters.
- **Aegean Wind Generator**: Pink noise swept through dynamic bandpass filters.
- **Temple Brazier Flame**: Brownian low-frequency crackle and flicker.
- **Crystal Temple Bell Chimes**: Pure harmonic partial synthesis on interaction.

---

## 🚀 File Structure

```
stoic-app/
├── index.html       # Main HUD shell, modals, and WebGL canvas mount
├── style.css        # Dark Greco-Roman aesthetic, glassmorphism, responsive styles
├── js/
│   ├── app.js       # Core application controller & event coordinator
│   ├── world.js     # Three.js procedural sanctuary builder & atmosphere engine
│   ├── controls.js  # Multi-mode camera navigation & easing controllers
│   ├── stoic-data.js# Curated philosophical texts, quotes, and exercise data
│   └── audio.js     # Procedural Web Audio API soundscape synthesizer
└── README.md        # Documentation
```
