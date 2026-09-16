# Cyberpunk HUD — Multi-Device Cockpit & Sovereign Telemetry

The Zoth Cyberpunk HUD is the **sovereign command cockpit** wrapping all 298+ verified tools and 21 autonomous AI agents into an adaptive, responsive workspace tailored specifically for **Desktop computers**, **Touch Tablets**, and **Mobile Smartphones**.

Launch URL: [http://127.0.0.1:8088/studio/cyberpunk-hud.html](/studio/cyberpunk-hud.html)

---

## 1. Multi-Device Responsive Architectures

The HUD dynamically detects viewport dimensions and touch capabilities, automatically acclimating its layout across three distinct device profiles:

### 🖥️ A. Desktop Cockpit (Widescreen >= 1200px)
- **2-Column Command Cockpit**: Full left operations deck + maximized center stage viewport.
- **Header Audio Visualizer**: 60 FPS real-time audio oscilloscope reacting to Web Audio synthesizer beeps, clicks, and keystrokes (Waveform, FFT Frequency Equalizer, and Lissajous Phase Orbital modes).
- **Dual-Tool Split Stage**: Run and cross-compare two workstations simultaneously (`Shift+S`).
- **Telemetry Calculus Deck**: 360° Polar radar mini-map, STDP synaptic memory graph, Sovereign Terminal REPL, and 6 Sacred Math Pillars telemetry grid.
- **Bottom Quick-Dock**: 8 flagship tabs, learned recents, and live loopback daemon health.

### 📱 B. Tablet Command Cockpit (768px – 1199px)
- **Stage-First Viewport**: 100% full stage focus with zero horizontal overflow.
- **Segmented Tablet Tactical Bar**: Touch-friendly floating bar (`🎯 STAGE`, `📊 TELEMETRY`, `🔮 SWARM (21)`, `⚡ TERMINAL`, `🧠 MEMORY`, `📐 PILLARS`).
- **Collapsible Floating Operations Deck**: Smooth slide-out drawer (`380px`) with blurred backdrop overlay and edge-swipe support.
- **Touch-Optimized Targets**: 44px+ minimum touch buttons, high-contrast states, and orientation-aware split viewport.

### 📲 C. Phone Tactical Deck (<= 768px)
- **One-Thumb Mobile Experience**: Edge-to-edge full viewport stage with zero root scrolling.
- **Compact Sticky Top Bar (48px)**: Agent avatar pill, active workstation name with dropdown, theme cycle button (`🎨`), audio SFX toggle (`🔊 / 🔇`), and tool search (`🔍`).
- **5-Button Tactical Bottom Tab Bar (56px)**:
  1. `🎯 Stage` — Focuses the active workstation canvas.
  2. `🛠️ Tools` — Slides up the searchable 298+ tool drawer with 1-tap loading.
  3. `🔮 Swarm` — Slides up the 21-Agent fleet attunement sheet with domain tags.
  4. `⚡ REPL` — Slides up the mobile Sovereign Terminal with quick chips and touch input.
  5. `📊 Telemetry` — Slides up the live polar radar, memory stats, and 6-pillar calculus meters.
- **Mobile Bottom Sheets (`hud-mobile-sheet`)**: Smooth drag handle, backdrop tap-to-dismiss, and keyboard-safe viewport unit scaling (`100dvh`).

---

## 2. Device Mode Switching & Simulator

You can force a specific device layout or leave on Auto-Detect via:
1. **Header Device Button**: Click `[ 💻 DESKTOP ▾ ]` or press `Shift+V`.
2. **URL Parameter**: `?device=desktop`, `?device=tablet`, `?device=mobile`, `?device=auto`.
3. **Terminal REPL**: Type `device desktop`, `device tablet`, `device mobile`, or `device auto`.
4. **JavaScript API**: `ZothHUD.setDeviceMode('mobile')` / `ZothHUD.getDeviceMode()`.

---

## 3. Cyber Audio SFX & Sound Bus

- **Procedural Synthesizer**: Custom Web Audio oscillator chirps, radar sweeps, clicks, and error tones.
- **Autoplay Safe**: One-time user gesture unlock on first tap/keystroke without console warnings.
- **Global Mute Toggle**: Click `[ 🔊 ]` in the header, press `Shift+M` / `M`, or type `mute` / `audio` in the REPL.

---

## 4. Keyboard Shortcuts & Gestures

| Shortcut | Description |
| --- | --- |
| `1 - 9` | Instant 1-click stage tool switch across 9 flagship workstations |
| `Shift + T` | Cycle 4 Themes (Dark Void, Solar Light, Matrix CRT, Hermetic Gold) |
| `Shift + V` | Open Device Profile Selector (Desktop, Tablet, Phone, Auto) |
| `Shift + M` or `M` | Toggle Cyber Sound FX (Mute / Unmute) |
| `Shift + S` | Toggle Dual-Tool Split Stage Mode |
| `Shift + D` | Toggle Left Telemetry Operations Deck Drawer |
| `Shift + R` | Ping All 21 Agents on 360° Polar Radar Sweep |
| `Shift + O` | Cycle Audio Oscilloscope Mode (Waveform / FFT / Lissajous) |
| `Ctrl + K` / `Cmd + K` | Open Master Tool Manager (Search 298+ Verified Tools) |
| `` ` `` or `Escape` | Focus Command Line Terminal REPL / Dismiss Open Modal or Sheet |
| `Alt + ◀ / ▶` | Navigate Stage Tool History (Back / Forward) |
| `F11` | Toggle Fullscreen Cockpit Viewport |

---

## 5. Architectural Files

- [`public/studio/cyberpunk-hud.html`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/studio/cyberpunk-hud.html): Master HUD Cockpit markup with device bar and mobile nav.
- [`public/assets/zoth-cyberpunk-hud.css`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-cyberpunk-hud.css): Device-specific CSS responsive layouts (Desktop, Tablet, Mobile).
- [`public/assets/zoth-cyberpunk-hud.js`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-cyberpunk-hud.js): Master HUD Engine, `DeviceEngine`, `TabletController`, and `MobileSheets`.
- [`public/assets/zoth-hud-intel.js`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-hud-intel.js): Grok intelligence layer, dashboard mode, auto-acclimation, and self-healing watchdog.
- [`public/assets/zoth-hud-workstations.js`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-hud-workstations.js): 21-workstation catalog mapping paths to HUD `?tool=...` routes.
- [`public/assets/zoth-cyberpunk-hud.test.js`](file:///media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/zoth-cyberpunk-hud.test.js): 20 automated unit verification test suites (100% passing).
