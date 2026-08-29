# CYBERDEX 3D — Solana Concentrated Liquidity DEX & 3D Matrix

An interactive 3D WebGL Solana DeFi Liquidity DEX and Concentrated Liquidity Market Maker (CLMM) environment built with Three.js.

## 🚀 Key Features

1. **Interactive 3D WebGL World (Three.js)**:
   - **Central AMM Fusion Core**: Rotating gyroscope rings, glowing icosahedral plasma reactor, and dynamic swap laser cannons.
   - **6 Concentrated Liquidity Vault Monoliths**: Hexagonally distributed obelisks representing `SOL/USDC`, `JUP/SOL`, `BONK/SOL`, `RAY/USDC`, `WIF/SOL`, and `PYTH/SOL`.
   - **Orbiting Token Satellites**: 3D geometric tokens (`SOL`, `USDC`, `JUP`, `RAY`, `BONK`, `WIF`, `PYTH`, `JTO`) orbiting on distinct orbital planes.
   - **Data Conduits & Flowing Particles**: Real-time quadratic bezier energy pulses connecting liquidity vaults to the DEX core.
   - **3D Voxel Depth Visualizer**: 30+ interactive 3D animated voxel bars illustrating concentrated tick depth in 3D space.
   - **4 Navigation Modes**:
     - **🪐 Orbit View**: Smooth 360° mouse drag, zoom, and pitch.
     - **🚶 Cyber Drone (WASD)**: First-person free flight exploration with keyboard WASD + Space/Shift elevation.
     - **✨ Guided Tour**: Cinematic autopilot fly-through across vaults, fusion core, and cosmos.
     - **📈 3D Voxel Depth**: Close-up inspection of concentrated liquidity distributions.

2. **Phantom Wallet & Solana Web3 Integration**:
   - Auto-detection for `window.solana` (Phantom wallet extension).
   - Seamless sandbox simulation mode pre-funded with 42.5 SOL and 14,850 USDC for instant testing.
   - Real-time wallet balance tracking, live TPS meter (3,200+ TPS), and block slot ticker.
   - Sub-second transaction finality (~380ms) simulation with Solscan explorer links.

3. **Concentrated Liquidity Vaults (CLMM like Orca Whirlpools & Raydium CLMM)**:
   - Dynamic capital efficiency multiplier:
     $$M = \frac{1}{1 - \sqrt{\frac{P_{min}}{P_{max}}}}$$
   - Interactive 2D/3D Tick Bin distribution chart showing active earning zone.
   - Presets: Narrow (±5%, ~14.2x multiplier), Balanced (±15%, ~6.8x), Wide (±30%, ~3.4x), Full Range (1.0x).
   - Real-time yield simulation ticker with per-second fee accumulation.
   - Mint custom NFT LP positions, harvest accrued fees, and withdraw liquidity.

4. **Live Price Ticker Ribbon & Real-time Charting**:
   - Streaming simulated WebSocket price feed with realistic micro-ticks and 24h stats for SOL, JUP, RAY, BONK, WIF, PYTH, JTO, USDC.
   - Canvas-rendered Candlestick & Area chart with moving averages and crosshair HUD tooltip.

5. **Instant Solana DEX Swap Terminal**:
   - Jupiter-style smart routing simulation with route hops and price impact estimation.
   - Slippage tolerance selector (0.1%, 0.5%, 1.0%).
   - Dynamic 3D laser beam firing between tokens during swap execution.

6. **Procedural Web Audio Synthesizer**:
   - 100% local Web Audio API synthesis for UI clicks, laser firing, deposit chords, and wallet chimes.

## 🕹️ Controls Guide

- **Orbit Camera**: Left Click + Drag to rotate, Mouse Wheel to zoom.
- **Cyber Drone Mode**: WASD keys to move forward/left/back/right, `Space` to elevate, `Shift` to descend.
- **Inspect Objects**: Click any floating 3D Monolith or Token Satellite to open its terminal.
- **Sound Toggle**: Click 🔊 in the top right to enable/mute sound effects.

## 📦 Project Structure

```
defi/
├── index.html           # Main application markup & HUD layout
├── style.css            # Solana cyberpunk glassmorphism & dark neon theme
├── README.md            # Architecture & feature documentation
├── zoth.session.json    # Zoth Studio session metadata
└── js/
    ├── audio.js         # Procedural Web Audio API sound synthesizer
    ├── wallet.js        # Phantom wallet & sandbox wallet manager
    ├── dex.js           # Real-time token pricing, routing & orderbook engine
    ├── clmm.js          # Concentrated liquidity math & NFT position manager
    ├── chart.js         # Canvas candlestick & CLMM tick depth chart renderer
    ├── world.js         # Three.js 3D WebGL scene, lighting, monoliths & camera
    └── app.js           # Master application orchestrator connecting UI & 3D world
```
