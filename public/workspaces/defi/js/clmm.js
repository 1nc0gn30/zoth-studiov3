/**
 * CYBERDEX 3D — Solana Concentrated Liquidity Vaults Engine (CLMM)
 * Orca Whirlpools / Raydium CLMM mathematical model & position manager
 */

class ClmmManager {
  constructor() {
    this.vaults = [
      {
        id: "sol-usdc",
        tokenA: "SOL",
        tokenB: "USDC",
        name: "SOL / USDC Whirlpool",
        feeTier: "0.05%",
        feeBps: 5,
        baseApr: 48.5,
        tvlUsd: 182400000,
        volume24hUsd: 94200000,
        currentPrice: 174.45,
        colorA: "#9945FF",
        colorB: "#2775CA",
        description: "Primary deep liquidity routing vault for Solana ecosystem settlement."
      },
      {
        id: "jup-sol",
        tokenA: "JUP",
        tokenB: "SOL",
        name: "JUP / SOL Dynamic DLMM",
        feeTier: "0.30%",
        feeBps: 30,
        baseApr: 112.4,
        tvlUsd: 64200000,
        volume24hUsd: 42800000,
        currentPrice: 0.00511,
        colorA: "#00F0FF",
        colorB: "#9945FF",
        description: "Jupiter routing hub vault with high volatility fee capture."
      },
      {
        id: "bonk-sol",
        tokenA: "BONK",
        tokenB: "SOL",
        name: "BONK / SOL Hyper-Vault",
        feeTier: "1.00%",
        feeBps: 100,
        baseApr: 184.2,
        tvlUsd: 38900000,
        volume24hUsd: 58100000,
        currentPrice: 0.000000125,
        colorA: "#FFA500",
        colorB: "#9945FF",
        description: "Ultra-concentrated memecoin liquidity pool with 100bps LP fee harvest."
      },
      {
        id: "ray-usdc",
        tokenA: "RAY",
        tokenB: "USDC",
        name: "RAY / USDC Core Pool",
        feeTier: "0.25%",
        feeBps: 25,
        baseApr: 62.4,
        tvlUsd: 45100000,
        volume24hUsd: 21500000,
        currentPrice: 3.18,
        colorA: "#3B82F6",
        colorB: "#2775CA",
        description: "Native Raydium automated market maker concentrated depth vault."
      },
      {
        id: "wif-sol",
        tokenA: "WIF",
        tokenB: "SOL",
        name: "WIF / SOL Turbo CLMM",
        feeTier: "1.00%",
        feeBps: 100,
        baseApr: 210.5,
        tvlUsd: 52300000,
        volume24hUsd: 76400000,
        currentPrice: 0.01069,
        colorA: "#FF007A",
        colorB: "#9945FF",
        description: "Leading Solana community memecoin vault with dynamic tick spacing."
      },
      {
        id: "pyth-sol",
        tokenA: "PYTH",
        tokenB: "SOL",
        name: "PYTH / SOL Oracle Hub",
        feeTier: "0.05%",
        feeBps: 5,
        baseApr: 39.7,
        tvlUsd: 29800000,
        volume24hUsd: 16200000,
        currentPrice: 0.00221,
        colorA: "#9C27B0",
        colorB: "#9945FF",
        description: "Cross-chain oracle infrastructure liquidity pool with low slip protection."
      }
    ];

    this.activeVault = this.vaults[0];
    this.selectedPreset = "narrow"; // narrow (±5%), balanced (±15%), wide (±30%), full
    this.minPrice = this.activeVault.currentPrice * 0.95;
    this.maxPrice = this.activeVault.currentPrice * 1.05;

    // User active LP NFT positions
    this.userPositions = [
      {
        id: "pos-sol-usdc-1",
        vaultId: "sol-usdc",
        pair: "SOL / USDC",
        feeTier: "0.05%",
        minPrice: 162.50,
        maxPrice: 188.00,
        inRange: true,
        depositA: 4.5,
        symbolA: "SOL",
        depositB: 785.0,
        symbolB: "USDC",
        totalValueUsd: 1570.0,
        multiplier: 6.8,
        effectiveApr: 142.6,
        unclaimedFeesUsd: 24.85,
        createdAt: Date.now() - 86400000 * 2.5
      }
    ];

    this.listeners = [];
    this.startYieldTicker();
  }

  startYieldTicker() {
    // Accumulate real-time pending fees for active user positions
    setInterval(() => {
      let changed = false;
      this.userPositions.forEach((pos) => {
        if (pos.inRange) {
          // Micro fee yield per second
          const secYield = (pos.totalValueUsd * (pos.effectiveApr / 100)) / (365 * 86400);
          pos.unclaimedFeesUsd += secYield * 1.2;
          changed = true;
        }
      });
      if (changed) {
        this.notify();
      }
    }, 1000);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getState());
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  getState() {
    return {
      vaults: this.vaults,
      activeVault: this.activeVault,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedPreset: this.selectedPreset,
      userPositions: this.userPositions,
      stats: this.calculateRangeStats()
    };
  }

  selectVault(vaultId) {
    const found = this.vaults.find((v) => v.id === vaultId);
    if (found) {
      this.activeVault = found;
      this.applyPreset(this.selectedPreset);
      this.notify();
    }
  }

  applyPreset(presetKey) {
    this.selectedPreset = presetKey;
    const cur = this.activeVault.currentPrice;

    if (presetKey === "narrow") {
      this.minPrice = cur * 0.95;
      this.maxPrice = cur * 1.05;
    } else if (presetKey === "balanced") {
      this.minPrice = cur * 0.85;
      this.maxPrice = cur * 1.15;
    } else if (presetKey === "wide") {
      this.minPrice = cur * 0.65;
      this.maxPrice = cur * 1.45;
    } else if (presetKey === "full") {
      this.minPrice = cur * 0.05;
      this.maxPrice = cur * 5.0;
    }
    this.notify();
  }

  setManualRange(min, max) {
    this.minPrice = Math.max(0.00000001, min);
    this.maxPrice = Math.max(this.minPrice * 1.01, max);
    this.selectedPreset = "custom";
    this.notify();
  }

  calculateRangeStats() {
    const cur = this.activeVault.currentPrice;
    const min = this.minPrice;
    const max = this.maxPrice;

    // Capital efficiency formula: M = 1 / (1 - sqrt(Pmin / Pmax))
    let ratio = Math.sqrt(Math.max(0.00001, min / max));
    if (ratio >= 0.999) ratio = 0.999;
    let multiplier = 1 / (1 - ratio);
    multiplier = Math.min(48.0, Math.max(1.0, multiplier));

    const effectiveApr = this.activeVault.baseApr * (multiplier * 0.35 + 0.65);
    const inRange = cur >= min && cur <= max;

    return {
      multiplier: multiplier.toFixed(1),
      effectiveApr: effectiveApr.toFixed(1),
      inRange,
      estDailyYieldPer1k: ((1000 * (effectiveApr / 100)) / 365).toFixed(2),
      ilRisk: multiplier > 10 ? "High" : multiplier > 4 ? "Medium" : "Low"
    };
  }

  createPosition(depositAmtA, depositAmtB) {
    const stats = this.calculateRangeStats();
    const tokenAObj = window.dexEngine ? window.dexEngine.getToken(this.activeVault.tokenA) : null;
    const tokenBObj = window.dexEngine ? window.dexEngine.getToken(this.activeVault.tokenB) : null;

    const valA = depositAmtA * (tokenAObj ? tokenAObj.price : 1);
    const valB = depositAmtB * (tokenBObj ? tokenBObj.price : 1);
    const totalUsd = valA + valB;

    const newPos = {
      id: `pos-${this.activeVault.id}-${Date.now().toString().slice(-4)}`,
      vaultId: this.activeVault.id,
      pair: `${this.activeVault.tokenA} / ${this.activeVault.tokenB}`,
      feeTier: this.activeVault.feeTier,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      inRange: stats.inRange,
      depositA: parseFloat(depositAmtA),
      symbolA: this.activeVault.tokenA,
      depositB: parseFloat(depositAmtB),
      symbolB: this.activeVault.tokenB,
      totalValueUsd: totalUsd,
      multiplier: parseFloat(stats.multiplier),
      effectiveApr: parseFloat(stats.effectiveApr),
      unclaimedFeesUsd: 0.00,
      createdAt: Date.now()
    };

    this.userPositions.unshift(newPos);
    this.notify();
    return newPos;
  }

  harvestFees(posId) {
    const pos = this.userPositions.find((p) => p.id === posId);
    if (!pos) return 0;
    const claimed = pos.unclaimedFeesUsd;
    pos.unclaimedFeesUsd = 0;
    
    // Add reward to USDC balance
    if (window.solanaWallet) {
      window.solanaWallet.updateBalance("USDC", claimed);
    }
    this.notify();
    return claimed;
  }

  withdrawPosition(posId) {
    const idx = this.userPositions.findIndex((p) => p.id === posId);
    if (idx === -1) return null;
    const pos = this.userPositions[idx];

    // Return tokens to wallet
    if (window.solanaWallet) {
      window.solanaWallet.updateBalance(pos.symbolA, pos.depositA);
      window.solanaWallet.updateBalance(pos.symbolB, pos.depositB);
      if (pos.unclaimedFeesUsd > 0) {
        window.solanaWallet.updateBalance("USDC", pos.unclaimedFeesUsd);
      }
    }

    this.userPositions.splice(idx, 1);
    this.notify();
    return pos;
  }
}

window.clmmManager = new ClmmManager();
