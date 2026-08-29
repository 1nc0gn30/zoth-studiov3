/**
 * CYBERDEX 3D — Real-Time Solana DEX & Pricing Engine
 * Simulates high-frequency micro-ticks, Jupiter Aggregator routes, and live order books
 */

class DexEngine {
  constructor() {
    this.tokens = {
      SOL: {
        symbol: "SOL",
        name: "Solana",
        color: "#9945FF",
        decimals: 9,
        price: 174.45,
        basePrice: 174.45,
        change24h: 5.82,
        high24h: 178.90,
        low24h: 164.30,
        volume24h: "2.41B",
        icon: "🟣"
      },
      USDC: {
        symbol: "USDC",
        name: "USD Coin",
        color: "#2775CA",
        decimals: 6,
        price: 1.0001,
        basePrice: 1.00,
        change24h: 0.01,
        high24h: 1.0008,
        low24h: 0.9995,
        volume24h: "4.85B",
        icon: "💵"
      },
      JUP: {
        symbol: "JUP",
        name: "Jupiter",
        color: "#00F0FF",
        decimals: 6,
        price: 0.892,
        basePrice: 0.892,
        change24h: 8.45,
        high24h: 0.945,
        low24h: 0.812,
        volume24h: "385.2M",
        icon: "🪐"
      },
      RAY: {
        symbol: "RAY",
        name: "Raydium",
        color: "#3B82F6",
        decimals: 6,
        price: 3.18,
        basePrice: 3.18,
        change24h: -1.45,
        high24h: 3.32,
        low24h: 3.05,
        volume24h: "142.7M",
        icon: "⚡"
      },
      BONK: {
        symbol: "BONK",
        name: "Bonk",
        color: "#FFA500",
        decimals: 5,
        price: 0.0000218,
        basePrice: 0.0000218,
        change24h: 12.35,
        high24h: 0.0000235,
        low24h: 0.0000189,
        volume24h: "298.4M",
        icon: "🐕"
      },
      WIF: {
        symbol: "WIF",
        name: "dogwifhat",
        color: "#FF007A",
        decimals: 6,
        price: 1.865,
        basePrice: 1.865,
        change24h: 14.80,
        high24h: 1.980,
        low24h: 1.610,
        volume24h: "420.1M",
        icon: "🎩"
      },
      PYTH: {
        symbol: "PYTH",
        name: "Pyth Network",
        color: "#9C27B0",
        decimals: 6,
        price: 0.386,
        basePrice: 0.386,
        change24h: 3.20,
        high24h: 0.405,
        low24h: 0.368,
        volume24h: "89.5M",
        icon: "🔮"
      },
      JTO: {
        symbol: "JTO",
        name: "Jito",
        color: "#14F195",
        decimals: 6,
        price: 2.485,
        basePrice: 2.485,
        change24h: 6.75,
        high24h: 2.620,
        low24h: 2.310,
        volume24h: "115.8M",
        icon: "🟩"
      }
    };

    this.activePair = {
      base: "SOL",
      quote: "USDC"
    };

    this.orderBook = {
      asks: [],
      bids: []
    };

    this.recentTrades = [];
    this.priceHistory = {};
    this.listeners = [];

    this.initPriceHistory();
    this.generateOrderBook();
    this.startTickStream();
  }

  initPriceHistory() {
    // Generate initial candlestick/tick history for active pairs
    Object.keys(this.tokens).forEach((sym) => {
      this.priceHistory[sym] = [];
      let cur = this.tokens[sym].price * 0.95;
      for (let i = 0; i < 40; i++) {
        const delta = (Math.random() - 0.48) * (cur * 0.008);
        cur += delta;
        this.priceHistory[sym].push({
          time: Date.now() - (40 - i) * 60000,
          open: cur,
          high: cur * (1 + Math.random() * 0.004),
          low: cur * (1 - Math.random() * 0.004),
          close: cur + (Math.random() - 0.5) * 0.002,
          volume: Math.floor(5000 + Math.random() * 20000)
        });
      }
    });
  }

  startTickStream() {
    setInterval(() => {
      // Pick 1-3 random tokens to tick
      const keys = Object.keys(this.tokens);
      const count = 1 + Math.floor(Math.random() * 2);

      for (let i = 0; i < count; i++) {
        const sym = keys[Math.floor(Math.random() * keys.length)];
        if (sym === "USDC") continue; // keep stablecoin ~1.00

        const token = this.tokens[sym];
        const volatility = 0.003;
        const drift = (Math.random() - 0.495) * (token.price * volatility);
        const oldPrice = token.price;
        token.price = Math.max(token.price * 0.5, token.price + drift);
        
        // Update 24h change slightly
        token.change24h += (drift / token.basePrice) * 10;

        const isUp = token.price >= oldPrice;
        this.notifyTick(sym, token.price, isUp);
      }

      // Generate streaming trade
      this.simulateIncomingTrade();
      this.generateOrderBook();
    }, 1000);
  }

  notifyTick(symbol, price, isUp) {
    // Update price history
    const hist = this.priceHistory[symbol];
    if (hist && hist.length > 0) {
      const last = hist[hist.length - 1];
      last.close = price;
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
    }

    // Call subscribers
    this.listeners.forEach((fn) => fn({ type: "tick", symbol, price, isUp, token: this.tokens[symbol] }));
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  getToken(symbol) {
    return this.tokens[symbol];
  }

  getAllTokens() {
    return Object.values(this.tokens);
  }

  // Jupiter-style smart routing calculator
  calculateRoute(fromSymbol, toSymbol, inAmount) {
    if (!inAmount || isNaN(inAmount) || inAmount <= 0) {
      return {
        outAmount: 0,
        rate: 0,
        priceImpact: 0,
        feeTier: "0.05%",
        routes: ["Direct Whirlpool CLMM"],
        minReceived: 0,
        feeSol: 0.000005
      };
    }

    const fromToken = this.tokens[fromSymbol];
    const toToken = this.tokens[toSymbol];
    if (!fromToken || !toToken) return null;

    const fromUsd = inAmount * fromToken.price;
    const rawOut = fromUsd / toToken.price;

    // Price impact simulation based on trade size
    const impact = Math.min(1.5, (fromUsd / 2000000) * 0.2 + (Math.random() * 0.04));
    const effectiveOut = rawOut * (1 - impact / 100);

    // Routing path hops
    let routeHops = [];
    if (fromSymbol === "SOL" || toSymbol === "SOL" || fromSymbol === "USDC" || toSymbol === "USDC") {
      routeHops = [`Orca Whirlpool (${fromSymbol} → ${toSymbol})`];
    } else {
      routeHops = [
        `Raydium CLMM (${fromSymbol} → SOL)`,
        `Meteora DLMM (SOL → ${toSymbol})`
      ];
    }

    return {
      inAmount,
      outAmount: effectiveOut,
      rate: toToken.price > 0 ? (fromToken.price / toToken.price) : 0,
      priceImpact: impact.toFixed(2),
      routes: routeHops,
      minReceived: (effectiveOut * 0.995).toFixed(6),
      feeSol: 0.000005,
      savingUsd: (fromUsd * 0.0015).toFixed(2)
    };
  }

  generateOrderBook() {
    const base = this.tokens[this.activePair.base];
    const quote = this.tokens[this.activePair.quote];
    const midPrice = base.price / quote.price;

    const asks = [];
    const bids = [];
    let askCum = 0;
    let bidCum = 0;

    for (let i = 1; i <= 6; i++) {
      const askP = midPrice * (1 + i * 0.0008);
      const askAmt = (Math.random() * 45 + 5).toFixed(2);
      askCum += parseFloat(askAmt);
      asks.unshift({ price: askP.toFixed(2), amount: askAmt, total: askCum.toFixed(2) });

      const bidP = midPrice * (1 - i * 0.0008);
      const bidAmt = (Math.random() * 45 + 5).toFixed(2);
      bidCum += parseFloat(bidAmt);
      bids.push({ price: bidP.toFixed(2), amount: bidAmt, total: bidCum.toFixed(2) });
    }

    this.orderBook = { asks, bids, midPrice: midPrice.toFixed(2) };
  }

  simulateIncomingTrade() {
    const isBuy = Math.random() > 0.45;
    const baseSym = this.activePair.base;
    const token = this.tokens[baseSym];
    const amt = (Math.random() * 25 + 0.5).toFixed(2);
    const usd = (amt * token.price).toFixed(2);

    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let sig = "";
    for (let i = 0; i < 16; i++) sig += chars.charAt(Math.floor(Math.random() * chars.length));

    this.recentTrades.unshift({
      isBuy,
      symbol: baseSym,
      amount: amt,
      price: token.price.toFixed(token.price < 0.01 ? 7 : 2),
      usd,
      time: new Date().toLocaleTimeString(),
      sig: `${sig}...`
    });

    if (this.recentTrades.length > 20) {
      this.recentTrades.pop();
    }
  }

  formatPrice(sym, p) {
    if (p < 0.001) return `$${p.toFixed(7)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    return `$${p.toFixed(2)}`;
  }
}

window.dexEngine = new DexEngine();
