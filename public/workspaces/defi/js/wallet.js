/**
 * CYBERDEX 3D — Solana & Phantom Wallet Controller
 * Supports real Phantom browser extension + seamless Sandbox Simulation Mode
 */

class SolanaWalletManager {
  constructor() {
    this.connected = false;
    this.isPhantom = false;
    this.publicKey = null;
    this.network = "mainnet-beta";
    this.tps = 3240;
    this.slot = 284910240;
    
    // Default simulated balance sheet
    this.balances = {
      SOL: 42.50,
      USDC: 14850.00,
      JUP: 2400.00,
      RAY: 850.00,
      BONK: 35000000.00,
      WIF: 450.00,
      PYTH: 1200.00,
      JTO: 350.00
    };

    this.listeners = [];
    this.init();
  }

  init() {
    // Check if Phantom exists
    if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
      this.isPhantom = true;
      window.solana.on("connect", (pk) => {
        this.publicKey = pk.toString();
        this.connected = true;
        this.notify();
      });
      window.solana.on("disconnect", () => {
        this.connected = false;
        this.publicKey = null;
        this.notify();
      });
      window.solana.on("accountChanged", (pk) => {
        if (pk) {
          this.publicKey = pk.toString();
          this.connected = true;
        } else {
          this.connected = false;
          this.publicKey = null;
        }
        this.notify();
      });
    }

    // TPS and Slot ticker
    setInterval(() => {
      this.tps = Math.floor(3100 + Math.random() * 450);
      this.slot += Math.floor(1 + Math.random() * 3);
      const tpsEl = document.getElementById("hud-tps-val");
      if (tpsEl) tpsEl.textContent = this.tps.toLocaleString();
    }, 1200);
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
      connected: this.connected,
      isPhantom: this.isPhantom,
      publicKey: this.publicKey,
      shortAddress: this.getShortAddress(),
      balances: { ...this.balances },
      network: this.network,
      tps: this.tps,
      slot: this.slot
    };
  }

  getShortAddress() {
    if (!this.publicKey) return "";
    return `${this.publicKey.slice(0, 4)}...${this.publicKey.slice(-4)}`;
  }

  async connect(preferSimulator = false) {
    if (window.cyberAudio) window.cyberAudio.playClick();

    if (!preferSimulator && window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        this.publicKey = resp.publicKey.toString();
        this.connected = true;
        this.notify();
        if (window.cyberAudio) window.cyberAudio.playWalletConnect();
        return { success: true, mode: "phantom", publicKey: this.publicKey };
      } catch (err) {
        console.warn("Phantom connection rejected or closed, falling back to simulated sandbox:", err);
      }
    }

    // Sandbox Mock Wallet Connection
    const mockChars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let mockPk = "Sol";
    for (let i = 0; i < 41; i++) {
      mockPk += mockChars.charAt(Math.floor(Math.random() * mockChars.length));
    }

    this.publicKey = mockPk;
    this.connected = true;
    this.notify();

    if (window.cyberAudio) window.cyberAudio.playWalletConnect();
    return { success: true, mode: "simulation", publicKey: this.publicKey };
  }

  disconnect() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    if (this.isPhantom && window.solana) {
      try {
        window.solana.disconnect();
      } catch (e) {}
    }
    this.connected = false;
    this.publicKey = null;
    this.notify();
  }

  setNetwork(net) {
    this.network = net;
    this.notify();
  }

  getBalance(symbol) {
    return this.balances[symbol] || 0;
  }

  updateBalance(symbol, delta) {
    if (this.balances[symbol] === undefined) {
      this.balances[symbol] = 0;
    }
    this.balances[symbol] = Math.max(0, this.balances[symbol] + delta);
    this.notify();
  }

  // Generate realistic Solana tx hash
  generateTxHash() {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let hash = "";
    for (let i = 0; i < 88; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  async executeSimulatedTransaction(txDetails) {
    // 400ms Solana sub-second finality delay
    await new Promise((res) => setTimeout(res, 420));
    const txHash = this.generateTxHash();
    return {
      success: true,
      signature: txHash,
      slot: this.slot,
      fee: 0.000005, // 5000 lamports
      confirmTimeMs: 384
    };
  }
}

window.solanaWallet = new SolanaWalletManager();
