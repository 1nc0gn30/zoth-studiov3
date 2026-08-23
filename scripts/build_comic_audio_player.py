#!/usr/bin/env python3
import os

target_js = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/comic/comic-audio-player.js"
target_css = "/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/comic/comic-audio-player.css"

css_content = """/* ==========================================================================
   AZOTH COMIC AUDIO PLAYER — PERSISTENT GLOBAL FLOATING BOTTOM HUD
   Cybernetic Glassmorphism, 432Hz Narration, Waveform Visualizer & Panel Jumper
   ========================================================================== */

:root {
  --cap-bg: rgba(6, 9, 20, 0.94);
  --cap-surface: rgba(13, 19, 38, 0.88);
  --cap-surface-hover: rgba(22, 32, 64, 0.92);
  --cap-border: rgba(0, 240, 255, 0.28);
  --cap-border-active: rgba(0, 240, 255, 0.65);
  --cap-cyan: #00f0ff;
  --cap-gold: #fbbf24;
  --cap-purple: #a855f7;
  --cap-rose: #ff007a;
  --cap-emerald: #10b981;
  --cap-text: #f1f5f9;
  --cap-text-muted: #94a3b8;
  --cap-font-display: 'Syne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cap-font-mono: 'IBM Plex Mono', monospace, 'Courier New';
  --cap-font-body: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --cap-z-index: 99999;
}

/* Floating Bottom Audio HUD Container */
#comic-audio-player-root {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--cap-z-index);
  background: var(--cap-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid var(--cap-border);
  box-shadow: 
    0 -12px 45px rgba(0, 0, 0, 0.85),
    0 -2px 18px rgba(0, 240, 255, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  font-family: var(--cap-font-body);
  color: var(--cap-text);
  padding: 10px 18px 12px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0.3s ease;
  user-select: none;
  box-sizing: border-box;
}

/* Ambient Top Accent Flare */
#comic-audio-player-root::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(168, 85, 247, 0.6) 20%, 
    rgba(0, 240, 255, 0.95) 50%, 
    rgba(251, 191, 36, 0.85) 80%, 
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
  pointer-events: none;
}

.cap-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  gap: 18px;
  align-items: center;
  position: relative;
}

/* ==========================================================================
   LEFT SECTION: Track & Panel Metadata
   ========================================================================== */
.cap-left-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.cap-thumb-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--cap-border);
  background: #030610;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.cap-thumb-wrapper:hover {
  transform: scale(1.05);
  border-color: var(--cap-cyan);
  box-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
}

.cap-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Live Equalizer Overlay on Thumbnail */
.cap-thumb-eq {
  position: absolute;
  inset: 0;
  background: rgba(5, 8, 18, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  padding-bottom: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cap-is-playing .cap-thumb-eq {
  opacity: 1;
}

.cap-eq-bar {
  width: 3px;
  height: 6px;
  background: var(--cap-cyan);
  border-radius: 2px;
  box-shadow: 0 0 6px var(--cap-cyan);
}

.cap-is-playing .cap-eq-bar:nth-child(1) {
  animation: cap-eq-anim 0.8s infinite ease-in-out;
}
.cap-is-playing .cap-eq-bar:nth-child(2) {
  animation: cap-eq-anim 1.1s infinite ease-in-out 0.2s;
}
.cap-is-playing .cap-eq-bar:nth-child(3) {
  animation: cap-eq-anim 0.9s infinite ease-in-out 0.4s;
}
.cap-is-playing .cap-eq-bar:nth-child(4) {
  animation: cap-eq-anim 1.2s infinite ease-in-out 0.1s;
}

@keyframes cap-eq-anim {
  0%, 100% { height: 4px; background: var(--cap-cyan); }
  50% { height: 20px; background: var(--cap-gold); }
}

.cap-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 3px;
}

.cap-badge-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.cap-badge {
  font-family: var(--cap-font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(0, 240, 255, 0.14);
  color: var(--cap-cyan);
  border: 1px solid rgba(0, 240, 255, 0.35);
  text-transform: uppercase;
  white-space: nowrap;
}

.cap-badge-panel {
  background: rgba(251, 191, 36, 0.14);
  color: var(--cap-gold);
  border-color: rgba(251, 191, 36, 0.4);
}

.cap-badge-live {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 0, 122, 0.16);
  color: var(--cap-rose);
  border-color: rgba(255, 0, 122, 0.4);
  font-size: 0.6rem;
}

.cap-pulse-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--cap-rose);
  box-shadow: 0 0 8px var(--cap-rose);
  animation: cap-pulse 1.4s infinite;
}

@keyframes cap-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

.cap-track-title {
  font-family: var(--cap-font-display);
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.cap-track-subtitle {
  font-family: var(--cap-font-mono);
  font-size: 0.72rem;
  color: var(--cap-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==========================================================================
   CENTER SECTION: Transport Controls & Interactive Waveform Progress
   ========================================================================== */
.cap-center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.cap-controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.cap-btn {
  background: var(--cap-surface);
  border: 1px solid var(--cap-border);
  color: var(--cap-text);
  border-radius: 8px;
  padding: 6px 12px;
  font-family: var(--cap-font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  min-height: 34px;
}

.cap-btn:hover {
  background: var(--cap-surface-hover);
  border-color: var(--cap-cyan);
  color: #ffffff;
  box-shadow: 0 0 14px rgba(0, 240, 255, 0.28);
  transform: translateY(-1px);
}

.cap-btn:active {
  transform: translateY(1px);
}

.cap-btn:focus-visible {
  outline: 2px solid var(--cap-cyan);
  outline-offset: 2px;
}

/* Master Play/Pause Glowing Button */
.cap-btn-play {
  width: 44px;
  height: 44px;
  min-height: 44px;
  border-radius: 50%;
  padding: 0;
  background: linear-gradient(135deg, #00f0ff 0%, #0284c7 100%);
  color: #040714;
  border: 1px solid #7dd3fc;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.cap-btn-play:hover {
  background: linear-gradient(135deg, #38bdf8 0%, #00f0ff 100%);
  box-shadow: 0 0 28px rgba(0, 240, 255, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.8);
  transform: scale(1.08);
}

.cap-is-playing .cap-btn-play {
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
  border-color: #fde68a;
  box-shadow: 0 0 24px rgba(251, 191, 36, 0.6);
  color: #040714;
}

.cap-is-playing .cap-btn-play:hover {
  background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.85);
}

/* Panel Jump Buttons (Prev / Next Panel) */
.cap-btn-jump {
  font-size: 0.76rem;
  padding: 6px 11px;
  border-radius: 6px;
  color: #e2e8f0;
}

.cap-btn-jump .cap-jump-icon {
  font-size: 0.9rem;
  color: var(--cap-cyan);
}

.cap-btn-jump:hover .cap-jump-icon {
  color: #ffffff;
}

/* Secondary Action Toggles (Auto-advance, Loop, 5s seek) */
.cap-btn-icon {
  padding: 6px 8px;
  font-size: 0.85rem;
  border-radius: 6px;
  min-width: 32px;
}

.cap-btn.cap-active {
  background: rgba(0, 240, 255, 0.18);
  border-color: var(--cap-cyan);
  color: var(--cap-cyan);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
}

/* Waveform Scrubber Row */
.cap-waveform-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cap-time-display {
  font-family: var(--cap-font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--cap-text-muted);
  letter-spacing: 0.05em;
  min-width: 42px;
}

.cap-time-current {
  text-align: right;
  color: var(--cap-cyan);
}

.cap-time-total {
  text-align: left;
}

/* Interactive Waveform Canvas & Track Wrapper */
.cap-waveform-track {
  position: relative;
  flex: 1;
  height: 38px;
  background: rgba(10, 15, 30, 0.7);
  border: 1px solid rgba(0, 240, 255, 0.16);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cap-waveform-track:hover {
  border-color: var(--cap-border-active);
  box-shadow: 0 0 18px rgba(0, 240, 255, 0.2);
}

.cap-waveform-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Scrub Progress Bar Glow Layer */
.cap-progress-glow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0%;
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.18) 0%, rgba(0, 240, 255, 0.28) 100%);
  pointer-events: none;
  border-right: 2px solid var(--cap-cyan);
  box-shadow: 2px 0 10px var(--cap-cyan);
  transition: width 0.08s linear;
}

/* Hover Cursor Line & Tooltip */
.cap-waveform-hover-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(251, 191, 36, 0.9);
  box-shadow: 0 0 6px var(--cap-gold);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 3;
}

.cap-waveform-hover-tip {
  position: absolute;
  top: -26px;
  transform: translateX(-50%);
  background: #090e1f;
  color: var(--cap-gold);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: var(--cap-font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  z-index: 4;
}

.cap-waveform-track:hover .cap-waveform-hover-line,
.cap-waveform-track:hover .cap-waveform-hover-tip {
  opacity: 1;
}

/* ==========================================================================
   RIGHT SECTION: Volume, Speed, Episode Switcher & Min/Max
   ========================================================================== */
.cap-right-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* Volume Control */
.cap-volume-box {
  display: flex;
  align-items: center;
  gap: 7px;
}

.cap-btn-volume {
  background: transparent;
  border: none;
  color: var(--cap-text-muted);
  cursor: pointer;
  padding: 4px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.cap-btn-volume:hover {
  color: var(--cap-cyan);
  transform: scale(1.1);
}

.cap-volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 76px;
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cap-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--cap-cyan);
  box-shadow: 0 0 8px var(--cap-cyan);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.cap-volume-slider::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border: none;
  border-radius: 50%;
  background: var(--cap-cyan);
  box-shadow: 0 0 8px var(--cap-cyan);
  cursor: pointer;
}

.cap-volume-slider:hover::-webkit-slider-thumb {
  transform: scale(1.2);
  background: var(--cap-gold);
  box-shadow: 0 0 10px var(--cap-gold);
}

/* Playback Speed Button */
.cap-btn-speed {
  font-family: var(--cap-font-mono);
  font-size: 0.72rem;
  padding: 4px 8px;
  min-height: 28px;
  min-width: 44px;
}

/* Episode Selector Dropdown */
.cap-episode-select {
  background: var(--cap-surface);
  border: 1px solid var(--cap-border);
  color: #e2e8f0;
  font-family: var(--cap-font-mono);
  font-size: 0.72rem;
  padding: 5px 8px;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cap-episode-select:hover,
.cap-episode-select:focus {
  border-color: var(--cap-cyan);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.cap-episode-select option {
  background: #090e1f;
  color: #ffffff;
}

/* Minimize / Close Buttons */
.cap-btn-action {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--cap-text-muted);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cap-btn-action:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: var(--cap-cyan);
}

/* ==========================================================================
   MINIMIZED FLOATING BADGE / PILL STATE
   ========================================================================== */
#comic-audio-player-root.cap-minimized {
  transform: translateY(120%);
  pointer-events: none;
}

#comic-audio-player-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--cap-z-index);
  background: rgba(8, 12, 28, 0.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--cap-cyan);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(0, 240, 255, 0.35);
  border-radius: 30px;
  padding: 6px 14px 6px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #ffffff;
  font-family: var(--cap-font-mono);
  font-size: 0.75rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, opacity 0.3s ease;
  user-select: none;
  opacity: 0;
  transform: scale(0.85) translateY(20px);
  pointer-events: none;
}

#comic-audio-player-pill.cap-pill-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

#comic-audio-player-pill:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.9), 0 0 28px rgba(0, 240, 255, 0.6);
  border-color: #7dd3fc;
}

.cap-pill-play-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--cap-cyan);
  color: #030712;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.cap-pill-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.cap-pill-title {
  color: #ffffff;
  font-weight: 700;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cap-pill-sub {
  font-size: 0.65rem;
  color: var(--cap-gold);
}

.cap-pill-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.cap-pill-bar {
  width: 2px;
  height: 4px;
  background: var(--cap-cyan);
  border-radius: 1px;
}

.cap-is-playing .cap-pill-bar:nth-child(1) { animation: cap-eq-anim 0.7s infinite ease-in-out; }
.cap-is-playing .cap-pill-bar:nth-child(2) { animation: cap-eq-anim 1.0s infinite ease-in-out 0.2s; }
.cap-is-playing .cap-pill-bar:nth-child(3) { animation: cap-eq-anim 0.8s infinite ease-in-out 0.4s; }

/* ==========================================================================
   BODY PADDING ADJUSTMENT FOR GLOBAL PERSISTENCE
   ========================================================================== */
body.has-comic-audio-player {
  padding-bottom: 74px !important;
}

/* ==========================================================================
   RESPONSIVE DESIGN (Tablets & Mobile)
   ========================================================================== */
@media (max-width: 1080px) {
  .cap-inner {
    grid-template-columns: 220px 1fr 200px;
    gap: 12px;
  }
  .cap-episode-select {
    display: none;
  }
}

@media (max-width: 860px) {
  #comic-audio-player-root {
    padding: 8px 12px 10px;
  }
  .cap-inner {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 8px;
  }
  .cap-left-section {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  .cap-right-section {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    gap: 8px;
  }
  .cap-volume-slider {
    width: 50px;
  }
  .cap-center-section {
    grid-column: 1 / -1;
    grid-row: 2 / 3;
    width: 100%;
  }
  .cap-controls-row {
    gap: 8px;
  }
  .cap-btn-jump {
    padding: 5px 8px;
    font-size: 0.7rem;
  }
  .cap-waveform-track {
    height: 30px;
  }
  body.has-comic-audio-player {
    padding-bottom: 110px !important;
  }
}

@media (max-width: 480px) {
  .cap-thumb-wrapper {
    width: 40px;
    height: 40px;
  }
  .cap-track-title {
    font-size: 0.82rem;
    max-width: 140px;
  }
  .cap-volume-box {
    display: none;
  }
  .cap-btn-jump span.cap-jump-text {
    display: none;
  }
  .cap-btn-jump {
    padding: 5px 8px;
  }
  .cap-btn-play {
    width: 38px;
    height: 38px;
    min-height: 38px;
  }
  .cap-btn-speed {
    min-width: 36px;
    padding: 3px 5px;
    font-size: 0.65rem;
  }
}
"""

with open(target_css, "w", encoding="utf-8") as f:
    f.write(css_content)

print(f"Updated {target_css} ({len(css_content)} bytes)")
