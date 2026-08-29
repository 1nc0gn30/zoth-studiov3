/**
 * CYBERDEX 3D — Master Application Orchestrator
 * Connects 3D WebGL World, DEX Swap, CLMM Concentrated Vaults, Phantom Wallet & Live HUD
 */

class CyberDexApp {
  constructor() {
    this.swapFromToken = "SOL";
    this.swapToToken = "USDC";
    this.slippageBps = 50; // 0.5%
    this.priorityFee = "Turbo (0.0005 SOL)";
    this.activeTab = "swap"; // 'swap' | 'clmm' | 'positions' | 'orderbook'

    this.tokenSelectorTarget = null; // 'from' | 'to'

    this.init();
  }

  init() {
    // 1. Initialize Chart
    if (window.chartRenderer) {
      window.chartRenderer.init("dex-chart-canvas", "clmm-depth-canvas");
    }

    // 2. Setup Wallet State Subscription
    if (window.solanaWallet) {
      window.solanaWallet.subscribe((state) => this.renderWalletState(state));
    }

    // 3. Setup DEX Engine Subscription
    if (window.dexEngine) {
      window.dexEngine.subscribe((event) => this.handleDexEvent(event));
    }

    // 4. Setup CLMM State Subscription
    if (window.clmmManager) {
      window.clmmManager.subscribe((state) => this.renderClmmState(state));
    }

    // 5. Setup UI Event Listeners
    this.setupEventListeners();

    // 6. Initial Renders
    this.renderTickerCards();
    this.renderVaultList();
    this.updateSwapCalculation();
    this.renderOrderBook();
    this.renderRecentTrades();

    console.log("⚡ CYBERDEX 3D Initialized — Solana Concentrated Liquidity Matrix Ready");
  }

  /* ==========================================================================
     Wallet & Account Interface
     ========================================================================== */
  renderWalletState(state) {
    const btnWallet = document.getElementById("btn-wallet-connect");
    const walletBalanceEl = document.getElementById("wallet-header-balance");
    const solBal = state.balances["SOL"] || 0;

    if (state.connected) {
      btnWallet.classList.add("connected");
      btnWallet.innerHTML = `
        <span class="wallet-icon">🟣</span>
        <span>${state.shortAddress}</span>
        <span class="wallet-balance">${solBal.toFixed(2)} SOL</span>
      `;
    } else {
      btnWallet.classList.remove("connected");
      btnWallet.innerHTML = `
        <span class="wallet-icon">👻</span>
        <span>Connect Phantom</span>
      `;
    }

    // Update Swap Balance labels
    const fromBal = document.getElementById("swap-from-bal");
    const toBal = document.getElementById("swap-to-bal");
    if (fromBal) fromBal.textContent = `${(state.balances[this.swapFromToken] || 0).toLocaleString()} ${this.swapFromToken}`;
    if (toBal) toBal.textContent = `${(state.balances[this.swapToToken] || 0).toLocaleString()} ${this.swapToToken}`;

    // Update positions tab if open
    this.renderUserPositions();
  }

  showWalletModal() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const modal = document.getElementById("wallet-modal");
    if (modal) modal.classList.add("open");
  }

  /* ==========================================================================
     Price Tickers & Dex Events
     ========================================================================== */
  renderTickerCards() {
    const container = document.getElementById("ticker-track");
    if (!container || !window.dexEngine) return;

    const tokens = window.dexEngine.getAllTokens();
    container.innerHTML = tokens
      .map(
        (t) => `
      <div class="ticker-item ${t.symbol === this.swapFromToken ? "active" : ""}" data-symbol="${t.symbol}">
        <div class="ticker-token-icon">${t.icon}</div>
        <div class="ticker-symbol">${t.symbol}</div>
        <div class="ticker-price" id="tick-p-${t.symbol}">$${t.price < 0.01 ? t.price.toFixed(7) : t.price < 1 ? t.price.toFixed(4) : t.price.toFixed(2)}</div>
        <div class="ticker-change ${t.change24h >= 0 ? "pos" : "neg"}" id="tick-c-${t.symbol}">
          ${t.change24h >= 0 ? "+" : ""}${t.change24h.toFixed(2)}%
        </div>
      </div>
    `
      )
      .join("");

    // Click ticker to switch active DEX pair / token
    container.querySelectorAll(".ticker-item").forEach((el) => {
      el.addEventListener("click", () => {
        const sym = el.getAttribute("data-symbol");
        this.selectSwapToken(sym, "from");
      });
    });
  }

  handleDexEvent(event) {
    if (event.type === "tick") {
      const sym = event.symbol;
      const priceEl = document.getElementById(`tick-p-${sym}`);
      const changeEl = document.getElementById(`tick-c-${sym}`);

      if (priceEl) {
        const formatted = event.price < 0.01 ? event.price.toFixed(7) : event.price < 1 ? event.price.toFixed(4) : event.price.toFixed(2);
        priceEl.textContent = `$${formatted}`;
        priceEl.classList.remove("flash-green", "flash-red");
        void priceEl.offsetWidth; // trigger reflow
        priceEl.classList.add(event.isUp ? "flash-green" : "flash-red");
      }

      if (changeEl && event.token) {
        const c = event.token.change24h;
        changeEl.className = `ticker-change ${c >= 0 ? "pos" : "neg"}`;
        changeEl.textContent = `${c >= 0 ? "+" : ""}${c.toFixed(2)}%`;
      }

      // Re-render chart if active token ticked
      if (sym === this.swapFromToken && window.chartRenderer) {
        window.chartRenderer.renderPriceChart();
      }

      // Update swap output estimate
      if (sym === this.swapFromToken || sym === this.swapToToken) {
        this.updateSwapCalculation();
      }

      // Update orderbook and trade feed
      this.renderOrderBook();
      this.renderRecentTrades();
    }
  }

  /* ==========================================================================
     DEX Swap Engine & UI
     ========================================================================== */
  selectSwapToken(symbol, target = "from") {
    if (target === "from") {
      if (symbol === this.swapToToken) {
        this.swapToToken = this.swapFromToken;
      }
      this.swapFromToken = symbol;
    } else {
      if (symbol === this.swapFromToken) {
        this.swapFromToken = this.swapToToken;
      }
      this.swapToToken = symbol;
    }

    // Update UI elements
    const fromBtn = document.getElementById("btn-select-from");
    const toBtn = document.getElementById("btn-select-to");
    const tokenFrom = window.dexEngine.getToken(this.swapFromToken);
    const tokenTo = window.dexEngine.getToken(this.swapToToken);

    if (fromBtn && tokenFrom) {
      fromBtn.innerHTML = `<span>${tokenFrom.icon}</span> <span>${tokenFrom.symbol}</span> <span style="font-size:10px;">▼</span>`;
    }
    if (toBtn && tokenTo) {
      toBtn.innerHTML = `<span>${tokenTo.icon}</span> <span>${tokenTo.symbol}</span> <span style="font-size:10px;">▼</span>`;
    }

    // Update chart
    if (window.chartRenderer) {
      window.chartRenderer.setSymbol(this.swapFromToken);
    }
    const chartTitle = document.getElementById("chart-active-pair-name");
    if (chartTitle) chartTitle.textContent = `${this.swapFromToken} / ${this.swapToToken}`;

    // Highlight active ticker item
    document.querySelectorAll(".ticker-item").forEach((el) => {
      if (el.getAttribute("data-symbol") === this.swapFromToken) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // Refresh wallet balances
    if (window.solanaWallet) {
      this.renderWalletState(window.solanaWallet.getState());
    }

    this.updateSwapCalculation();
  }

  flipSwapTokens() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const temp = this.swapFromToken;
    this.selectSwapToken(this.swapToToken, "from");
    this.selectSwapToken(temp, "to");
  }

  updateSwapCalculation() {
    const inInput = document.getElementById("swap-input-from");
    const outInput = document.getElementById("swap-input-to");
    const usdFrom = document.getElementById("swap-usd-from");
    const usdTo = document.getElementById("swap-usd-to");
    const routeContainer = document.getElementById("swap-route-details");

    const inAmt = parseFloat(inInput ? inInput.value : 0) || 0;
    const calc = window.dexEngine.calculateRoute(this.swapFromToken, this.swapToToken, inAmt);

    const tokenFrom = window.dexEngine.getToken(this.swapFromToken);
    const tokenTo = window.dexEngine.getToken(this.swapToToken);

    if (usdFrom && tokenFrom) {
      usdFrom.textContent = `≈ $${(inAmt * tokenFrom.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (outInput && calc) {
      outInput.value = calc.outAmount > 0 ? (calc.outAmount < 0.001 ? calc.outAmount.toFixed(6) : calc.outAmount.toFixed(4)) : "";
    }

    if (usdTo && tokenTo && calc) {
      usdTo.textContent = `≈ $${(calc.outAmount * tokenTo.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (routeContainer && calc) {
      routeContainer.innerHTML = `
        <div class="detail-row">
          <span>Best Route (Jupiter CLMM)</span>
          <span class="route-pill">${calc.routes[0]}</span>
        </div>
        <div class="detail-row">
          <span>Price Impact</span>
          <span class="val" style="color: ${parseFloat(calc.priceImpact) < 0.2 ? "var(--sol-green)" : "var(--sol-gold)"};">${calc.priceImpact}%</span>
        </div>
        <div class="detail-row">
          <span>Minimum Received (0.5% Slip)</span>
          <span class="val">${calc.minReceived} ${this.swapToToken}</span>
        </div>
        <div class="detail-row">
          <span>Est. Network Fee</span>
          <span class="val">0.000005 SOL (<$0.01)</span>
        </div>
      `;
    }
  }

  async executeSwap() {
    const inInput = document.getElementById("swap-input-from");
    const inAmt = parseFloat(inInput ? inInput.value : 0);

    if (!inAmt || inAmt <= 0) {
      this.showToast("Invalid Input", "Please enter an amount to swap.", "warn");
      return;
    }

    // Check balance
    const curBal = window.solanaWallet.getBalance(this.swapFromToken);
    if (inAmt > curBal) {
      this.showToast("Insufficient Balance", `You only have ${curBal.toFixed(4)} ${this.swapFromToken}`, "warn");
      return;
    }

    const calc = window.dexEngine.calculateRoute(this.swapFromToken, this.swapToToken, inAmt);
    const btn = document.getElementById("btn-execute-swap");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⚡ Routing via Solana CLMM...</span>`;
    }

    // Audio SFX + 3D Laser Beam Animation!
    if (window.cyberAudio) window.cyberAudio.playSwapLaser();
    if (window.cyberWorld) window.cyberWorld.fireSwapLaser(this.swapFromToken, this.swapToToken);

    // Execute simulated Solana transaction
    const tx = await window.solanaWallet.executeSimulatedTransaction({
      from: this.swapFromToken,
      to: this.swapToToken,
      inAmt,
      outAmt: calc.outAmount
    });

    // Update wallet balances
    window.solanaWallet.updateBalance(this.swapFromToken, -inAmt);
    window.solanaWallet.updateBalance(this.swapToToken, calc.outAmount);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>⚡ Instant Swap (${this.swapFromToken} → ${this.swapToToken})</span>`;
    }

    if (inInput) inInput.value = "";
    this.updateSwapCalculation();

    this.showToast(
      "Swap Executed Successfully!",
      `Swapped ${inAmt} ${this.swapFromToken} for ${calc.outAmount.toFixed(4)} ${this.swapToToken} in ${tx.confirmTimeMs}ms`,
      "success",
      tx.signature
    );
  }

  /* ==========================================================================
     Concentrated Liquidity Vaults (CLMM) Manager & Modals
     ========================================================================== */
  renderVaultList() {
    const listEl = document.getElementById("vault-mini-list");
    if (!listEl || !window.clmmManager) return;

    const vaults = window.clmmManager.vaults;
    listEl.innerHTML = vaults
      .map(
        (v) => `
      <div class="vault-mini-card ${v.id === window.clmmManager.activeVault.id ? "selected" : ""}" data-vault="${v.id}">
        <div class="vault-pair-info">
          <div class="pair-icons">
            <div class="pair-icon-a" style="background:${v.colorA};">${v.tokenA.slice(0, 1)}</div>
            <div class="pair-icon-b" style="background:${v.colorB};">${v.tokenB.slice(0, 1)}</div>
          </div>
          <div>
            <div class="pair-name">${v.tokenA}/${v.tokenB}</div>
            <div class="fee-tier">${v.feeTier} Tier</div>
          </div>
        </div>
        <div class="vault-metrics">
          <div class="apr-val">${v.baseApr}% APR</div>
          <div class="tvl-val">$${(v.tvlUsd / 1000000).toFixed(1)}M TVL</div>
        </div>
      </div>
    `
      )
      .join("");

    listEl.querySelectorAll(".vault-mini-card").forEach((el) => {
      el.addEventListener("click", () => {
        const vid = el.getAttribute("data-vault");
        window.clmmManager.selectVault(vid);
        if (window.cyberWorld) window.cyberWorld.focusOnVault(vid);
        this.openVaultModal(vid);
      });
    });
  }

  openVaultModal(vaultId) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    if (window.clmmManager) window.clmmManager.selectVault(vaultId);

    const modal = document.getElementById("vault-modal");
    if (modal) modal.classList.add("open");

    setTimeout(() => {
      if (window.chartRenderer) window.chartRenderer.renderClmmHistogram();
    }, 50);
  }

  renderClmmState(state) {
    const v = state.activeVault;
    const stats = state.stats;

    // Modal Header Titles
    const modalTitle = document.getElementById("vault-modal-title");
    const modalDesc = document.getElementById("vault-modal-desc");
    const modalApr = document.getElementById("vault-modal-apr");
    const modalTvl = document.getElementById("vault-modal-tvl");
    const modalVol = document.getElementById("vault-modal-vol");

    if (modalTitle) modalTitle.textContent = `${v.name} (${v.feeTier})`;
    if (modalDesc) modalDesc.textContent = v.description;
    if (modalApr) modalApr.textContent = `${stats.effectiveApr}% Effective APR`;
    if (modalTvl) modalTvl.textContent = `$${(v.tvlUsd / 1000000).toFixed(1)}M TVL`;
    if (modalVol) modalVol.textContent = `$${(v.volume24hUsd / 1000000).toFixed(1)}M 24h Vol`;

    // Range Inputs
    const minInput = document.getElementById("range-input-min");
    const maxInput = document.getElementById("range-input-max");
    const multBadge = document.getElementById("multiplier-badge-val");
    const estDaily = document.getElementById("est-daily-yield-val");

    if (minInput && document.activeElement !== minInput) minInput.value = state.minPrice.toFixed(4);
    if (maxInput && document.activeElement !== maxInput) maxInput.value = state.maxPrice.toFixed(4);
    if (multBadge) multBadge.textContent = `${stats.multiplier}x Multiplier`;
    if (estDaily) estDaily.textContent = `$${stats.estDailyYieldPer1k} / day`;

    // Deposit Labels
    const depLabelA = document.getElementById("deposit-label-a");
    const depLabelB = document.getElementById("deposit-label-b");
    if (depLabelA) depLabelA.textContent = `${v.tokenA} Deposit`;
    if (depLabelB) depLabelB.textContent = `${v.tokenB} Deposit`;

    // Presets Active state
    document.querySelectorAll(".preset-btn").forEach((btn) => {
      if (btn.getAttribute("data-preset") === state.selectedPreset) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Re-render chart histogram
    if (window.chartRenderer) window.chartRenderer.renderClmmHistogram();
  }

  depositLiquidity() {
    const inputA = document.getElementById("deposit-input-a");
    const inputB = document.getElementById("deposit-input-b");

    const amtA = parseFloat(inputA ? inputA.value : 0) || 0;
    const amtB = parseFloat(inputB ? inputB.value : 0) || 0;

    if (amtA <= 0 && amtB <= 0) {
      this.showToast("Invalid Deposit", "Enter amount for token A or token B", "warn");
      return;
    }

    const v = window.clmmManager.activeVault;
    const balA = window.solanaWallet.getBalance(v.tokenA);
    const balB = window.solanaWallet.getBalance(v.tokenB);

    if (amtA > balA || amtB > balB) {
      this.showToast("Insufficient Balance", "You don't have enough tokens for this deposit", "warn");
      return;
    }

    // Deduct balances
    window.solanaWallet.updateBalance(v.tokenA, -amtA);
    window.solanaWallet.updateBalance(v.tokenB, -amtB);

    // Create CLMM Position
    const pos = window.clmmManager.createPosition(amtA, amtB);

    if (window.cyberAudio) window.cyberAudio.playDeposit();

    // Close modal
    const modal = document.getElementById("vault-modal");
    if (modal) modal.classList.remove("open");

    if (inputA) inputA.value = "";
    if (inputB) inputB.value = "";

    this.showToast(
      "Concentrated Position Minted!",
      `Added ${amtA} ${v.tokenA} + ${amtB} ${v.tokenB} at ${pos.multiplier}x leverage`,
      "success"
    );
  }

  /* ==========================================================================
     User LP NFT Positions
     ========================================================================== */
  renderUserPositions() {
    const container = document.getElementById("positions-list");
    if (!container || !window.clmmManager) return;

    const positions = window.clmmManager.userPositions;
    if (positions.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:11px;">No active concentrated liquidity positions found.</div>`;
      return;
    }

    container.innerHTML = positions
      .map(
        (p) => `
      <div class="position-card" id="card-${p.id}">
        <div class="position-card-header">
          <div style="font-weight:700; color:#FFF; font-size:12px;">${p.pair} <span style="color:var(--sol-cyan); font-size:10px;">(${p.feeTier})</span></div>
          <div class="in-range-badge">${p.inRange ? "🟢 In Range" : "🔴 Out of Range"}</div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-secondary); margin-bottom:4px;">
          <span>Range: [${p.minPrice.toFixed(2)} — ${p.maxPrice.toFixed(2)}]</span>
          <span style="color:var(--sol-gold); font-weight:700;">${p.multiplier}x Efficiency</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-secondary);">
          <span>Total Value: <b style="color:#FFF;">$${p.totalValueUsd.toFixed(2)}</b></span>
          <span>Unclaimed Yield: <b style="color:var(--sol-green);">$${p.unclaimedFeesUsd.toFixed(3)} USDC</b></span>
        </div>
        <div class="position-actions-row">
          <button class="btn-pos-action claim" onclick="window.app.claimPositionFees('${p.id}')">💰 Claim Fees</button>
          <button class="btn-pos-action" onclick="window.app.withdrawPosition('${p.id}')">🔻 Withdraw</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  claimPositionFees(posId) {
    if (window.cyberAudio) window.cyberAudio.playDeposit();
    const claimed = window.clmmManager.harvestFees(posId);
    this.showToast("Fees Harvested!", `Claimed $${claimed.toFixed(2)} USDC into wallet`, "success");
  }

  withdrawPosition(posId) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const pos = window.clmmManager.withdrawPosition(posId);
    if (pos) {
      this.showToast("Position Closed", `Withdrew ${pos.depositA} ${pos.symbolA} + ${pos.depositB} ${pos.symbolB}`, "success");
    }
  }

  /* ==========================================================================
     Order Book & Trade History
     ========================================================================== */
  renderOrderBook() {
    const asksEl = document.getElementById("orderbook-asks");
    const bidsEl = document.getElementById("orderbook-bids");
    const midEl = document.getElementById("orderbook-mid");

    if (!window.dexEngine) return;
    const ob = window.dexEngine.orderBook;

    if (midEl) midEl.textContent = `$${ob.midPrice}`;

    if (asksEl) {
      asksEl.innerHTML = ob.asks
        .map(
          (a) => `
        <div style="display:flex; justify-content:space-between; font-size:10px; font-family:var(--font-mono); padding:1px 0;">
          <span style="color:var(--sol-red);">$${a.price}</span>
          <span style="color:var(--text-secondary);">${a.amount}</span>
          <span style="color:var(--text-muted);">${a.total}</span>
        </div>
      `
        )
        .join("");
    }

    if (bidsEl) {
      bidsEl.innerHTML = ob.bids
        .map(
          (b) => `
        <div style="display:flex; justify-content:space-between; font-size:10px; font-family:var(--font-mono); padding:1px 0;">
          <span style="color:var(--sol-green);">$${b.price}</span>
          <span style="color:var(--text-secondary);">${b.amount}</span>
          <span style="color:var(--text-muted);">${b.total}</span>
        </div>
      `
        )
        .join("");
    }
  }

  renderRecentTrades() {
    const feed = document.getElementById("recent-trades-feed");
    if (!feed || !window.dexEngine) return;

    feed.innerHTML = window.dexEngine.recentTrades
      .slice(0, 6)
      .map(
        (t) => `
      <div style="display:flex; justify-content:space-between; font-size:10px; font-family:var(--font-mono); padding:2px 0;">
        <span style="color:${t.isBuy ? 'var(--sol-green)' : 'var(--sol-red)'}; font-weight:700;">${t.isBuy ? 'BUY' : 'SELL'} ${t.symbol}</span>
        <span style="color:#FFF;">$${t.price}</span>
        <span style="color:var(--text-muted);">${t.amount} (${t.time})</span>
      </div>
    `
      )
      .join("");
  }

  /* ==========================================================================
     Toast Notifications System
     ========================================================================== */
  showToast(title, message, type = "info", signature = null) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;

    const icon = type === "success" ? "✅" : type === "warn" ? "⚠️" : "⚡";
    const sigHtml = signature
      ? `<a href="https://solscan.io/tx/${signature}" target="_blank" class="toast-tx-link">View on Solscan (${signature.slice(0, 8)}...) ↗</a>`
      : "";

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
        ${sigHtml}
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* ==========================================================================
     UI Event Listeners Binding
     ========================================================================== */
  setupEventListeners() {
    // Wallet connect button
    const btnWallet = document.getElementById("btn-wallet-connect");
    if (btnWallet) {
      btnWallet.addEventListener("click", () => this.showWalletModal());
    }

    // Modal Close buttons
    document.querySelectorAll(".modal-close-btn, .modal-backdrop").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el || e.target.classList.contains("modal-close-btn")) {
          document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("open"));
        }
      });
    });

    // Wallet Connect Options
    const btnConnectPhantom = document.getElementById("btn-connect-phantom");
    const btnConnectSim = document.getElementById("btn-connect-sim");
    const btnDisconnect = document.getElementById("btn-wallet-disconnect");

    if (btnConnectPhantom) {
      btnConnectPhantom.addEventListener("click", async () => {
        await window.solanaWallet.connect(false);
        document.getElementById("wallet-modal").classList.remove("open");
        this.showToast("Phantom Wallet Connected", `Connected with public key ${window.solanaWallet.getShortAddress()}`, "success");
      });
    }

    if (btnConnectSim) {
      btnConnectSim.addEventListener("click", async () => {
        await window.solanaWallet.connect(true);
        document.getElementById("wallet-modal").classList.remove("open");
        this.showToast("Sandbox Wallet Initialized", "Pre-funded with 42.5 SOL + 14,850 USDC for instant DEX testing", "success");
      });
    }

    if (btnDisconnect) {
      btnDisconnect.addEventListener("click", () => {
        window.solanaWallet.disconnect();
        document.getElementById("wallet-modal").classList.remove("open");
        this.showToast("Wallet Disconnected", "Disconnected from CyberDEX Matrix", "info");
      });
    }

    // Audio Toggle
    const btnSound = document.getElementById("btn-toggle-sound");
    if (btnSound) {
      btnSound.addEventListener("click", () => {
        const isEnabled = window.cyberAudio.toggle();
        btnSound.textContent = isEnabled ? "🔊" : "🔇";
        btnSound.title = isEnabled ? "Sound Effects Enabled" : "Sound Muted";
      });
    }

    // Navigation Tabs
    document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".nav-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        this.switchMainTab(tab);
      });
    });

    // 3D Camera Mode Buttons
    document.querySelectorAll(".cam-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.cyberAudio) window.cyberAudio.playClick();
        document.querySelectorAll(".cam-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.getAttribute("data-mode");
        if (window.cyberWorld) window.cyberWorld.setCameraMode(mode);
      });
    });

    // Swap Flip Button
    const btnFlip = document.getElementById("btn-swap-flip");
    if (btnFlip) {
      btnFlip.addEventListener("click", () => this.flipSwapTokens());
    }

    // Swap Inputs
    const swapInputFrom = document.getElementById("swap-input-from");
    if (swapInputFrom) {
      swapInputFrom.addEventListener("input", () => this.updateSwapCalculation());
    }

    // Quick Balance Max Clicks
    const swapFromBal = document.getElementById("swap-from-bal");
    if (swapFromBal) {
      swapFromBal.addEventListener("click", () => {
        const bal = window.solanaWallet.getBalance(this.swapFromToken);
        if (swapInputFrom) swapInputFrom.value = bal > 0 ? (bal * 0.98).toFixed(4) : "0";
        this.updateSwapCalculation();
      });
    }

    // Token Selectors
    const btnSelectFrom = document.getElementById("btn-select-from");
    const btnSelectTo = document.getElementById("btn-select-to");
    if (btnSelectFrom) {
      btnSelectFrom.addEventListener("click", () => this.openTokenSelectModal("from"));
    }
    if (btnSelectTo) {
      btnSelectTo.addEventListener("click", () => this.openTokenSelectModal("to"));
    }

    // Execute Swap Button
    const btnSwap = document.getElementById("btn-execute-swap");
    if (btnSwap) {
      btnSwap.addEventListener("click", () => this.executeSwap());
    }

    // Slippage Chips
    document.querySelectorAll(".slip-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".slip-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        this.slippageBps = parseInt(chip.getAttribute("data-slip")) || 50;
        this.updateSwapCalculation();
      });
    });

    // CLMM Range Presets inside Modal
    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.cyberAudio) window.cyberAudio.playClick();
        const p = btn.getAttribute("data-preset");
        if (window.clmmManager) window.clmmManager.applyPreset(p);
      });
    });

    // CLMM Range Inputs Manual Edit
    const minInput = document.getElementById("range-input-min");
    const maxInput = document.getElementById("range-input-max");
    const onRangeChange = () => {
      const min = parseFloat(minInput.value);
      const max = parseFloat(maxInput.value);
      if (!isNaN(min) && !isNaN(max) && min < max) {
        window.clmmManager.setManualRange(min, max);
      }
    };
    if (minInput) minInput.addEventListener("change", onRangeChange);
    if (maxInput) maxInput.addEventListener("change", onRangeChange);

    // CLMM Deposit Button
    const btnDeposit = document.getElementById("btn-deposit-liquidity");
    if (btnDeposit) {
      btnDeposit.addEventListener("click", () => this.depositLiquidity());
    }
  }

  switchMainTab(tabKey) {
    this.activeTab = tabKey;
    const swapCard = document.getElementById("swap-card-container");
    const clmmCard = document.getElementById("clmm-vault-card-container");
    const positionsCard = document.getElementById("positions-card-container");
    const orderbookCard = document.getElementById("orderbook-card-container");

    if (swapCard) swapCard.style.display = tabKey === "swap" ? "block" : "none";
    if (clmmCard) clmmCard.style.display = tabKey === "clmm" ? "block" : "none";
    if (positionsCard) positionsCard.style.display = tabKey === "positions" ? "block" : "none";
    if (orderbookCard) orderbookCard.style.display = tabKey === "orderbook" ? "block" : "none";

    if (tabKey === "clmm" && window.cyberWorld) {
      window.cyberWorld.setCameraMode("clmm");
    } else if (tabKey === "swap" && window.cyberWorld) {
      window.cyberWorld.setCameraMode("orbit");
    }
  }

  openTokenSelectModal(target) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.tokenSelectorTarget = target;
    const modal = document.getElementById("token-modal");
    const listEl = document.getElementById("token-select-list");

    if (!listEl || !window.dexEngine) return;
    const tokens = window.dexEngine.getAllTokens();

    listEl.innerHTML = tokens
      .map(
        (t) => `
      <div class="token-list-item" data-symbol="${t.symbol}">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="font-size:18px;">${t.icon}</div>
          <div>
            <div style="font-weight:700; color:#FFF;">${t.name}</div>
            <div style="font-size:10px; color:var(--text-muted);">${t.symbol}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-mono); font-weight:700; color:#FFF;">$${t.price < 0.01 ? t.price.toFixed(7) : t.price < 1 ? t.price.toFixed(4) : t.price.toFixed(2)}</div>
          <div style="font-size:10px; color:var(--sol-cyan);">${(window.solanaWallet.getBalance(t.symbol) || 0).toLocaleString()} ${t.symbol}</div>
        </div>
      </div>
    `
      )
      .join("");

    listEl.querySelectorAll(".token-list-item").forEach((el) => {
      el.addEventListener("click", () => {
        const sym = el.getAttribute("data-symbol");
        this.selectSwapToken(sym, this.tokenSelectorTarget);
        if (modal) modal.classList.remove("open");
      });
    });

    if (modal) modal.classList.add("open");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.app = new CyberDexApp();
});
