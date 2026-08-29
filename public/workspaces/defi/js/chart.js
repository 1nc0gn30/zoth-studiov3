/**
 * CYBERDEX 3D — Canvas Charting Engine
 * Ultra-fast 2D canvas renderers for DEX Candlesticks & CLMM Tick Depth
 */

class ChartRenderer {
  constructor() {
    this.priceCanvas = null;
    this.priceCtx = null;
    this.clmmCanvas = null;
    this.clmmCtx = null;
    this.timeframe = "15m";
    this.activeSymbol = "SOL";

    this.mouse = { x: -1, y: -1, active: false };
  }

  init(priceCanvasId, clmmCanvasId) {
    this.priceCanvas = document.getElementById(priceCanvasId);
    if (this.priceCanvas) {
      this.priceCtx = this.priceCanvas.getContext("2d");
      this.setupPriceEvents();
    }

    this.clmmCanvas = document.getElementById(clmmCanvasId);
    if (this.clmmCanvas) {
      this.clmmCtx = this.clmmCanvas.getContext("2d");
    }

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (this.priceCanvas && this.priceCanvas.parentElement) {
      const rect = this.priceCanvas.parentElement.getBoundingClientRect();
      this.priceCanvas.width = rect.width * (window.devicePixelRatio || 1);
      this.priceCanvas.height = rect.height * (window.devicePixelRatio || 1);
      this.renderPriceChart();
    }

    if (this.clmmCanvas && this.clmmCanvas.parentElement) {
      const rect = this.clmmCanvas.parentElement.getBoundingClientRect();
      this.clmmCanvas.width = rect.width * (window.devicePixelRatio || 1);
      this.clmmCanvas.height = rect.height * (window.devicePixelRatio || 1);
      this.renderClmmHistogram();
    }
  }

  setupPriceEvents() {
    this.priceCanvas.addEventListener("mousemove", (e) => {
      const rect = this.priceCanvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) * (window.devicePixelRatio || 1);
      this.mouse.y = (e.clientY - rect.top) * (window.devicePixelRatio || 1);
      this.mouse.active = true;
      this.renderPriceChart();
    });

    this.priceCanvas.addEventListener("mouseleave", () => {
      this.mouse.active = false;
      this.renderPriceChart();
    });
  }

  setSymbol(sym) {
    this.activeSymbol = sym;
    this.renderPriceChart();
  }

  renderPriceChart() {
    if (!this.priceCtx || !this.priceCanvas) return;
    const ctx = this.priceCtx;
    const w = this.priceCanvas.width;
    const h = this.priceCanvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w, h);

    const history = window.dexEngine ? window.dexEngine.priceHistory[this.activeSymbol] : [];
    if (!history || history.length < 2) return;

    // Determine min/max price
    let minP = Infinity;
    let maxP = -Infinity;
    history.forEach((d) => {
      if (d.low < minP) minP = d.low;
      if (d.high > maxP) maxP = d.high;
    });

    const padY = (maxP - minP) * 0.15 || 1;
    minP -= padY;
    maxP += padY;

    const chartHeight = h * 0.75;
    const volHeight = h * 0.22;

    const stepX = w / (history.length - 1);

    // Draw Subtle Grid Lines
    ctx.strokeStyle = "rgba(153, 69, 255, 0.08)";
    ctx.lineWidth = 1 * dpr;
    for (let i = 1; i <= 3; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Area Gradient under price line
    const isBull = history[history.length - 1].close >= history[0].open;
    const grad = ctx.createLinearGradient(0, 0, 0, chartHeight);
    if (isBull) {
      grad.addColorStop(0, "rgba(20, 241, 149, 0.35)");
      grad.addColorStop(1, "rgba(20, 241, 149, 0.0)");
    } else {
      grad.addColorStop(0, "rgba(255, 59, 48, 0.35)");
      grad.addColorStop(1, "rgba(255, 59, 48, 0.0)");
    }

    // Path for Price Line & Area
    ctx.beginPath();
    history.forEach((pt, i) => {
      const x = i * stepX;
      const y = chartHeight - ((pt.close - minP) / (maxP - minP)) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // Save line for stroke
    const linePath = new Path2D(ctx);
    history.forEach((pt, i) => {
      const x = i * stepX;
      const y = chartHeight - ((pt.close - minP) / (maxP - minP)) * chartHeight;
      if (i === 0) linePath.moveTo(x, y);
      else linePath.lineTo(x, y);
    });

    // Complete area fill
    ctx.lineTo((history.length - 1) * stepX, chartHeight);
    ctx.lineTo(0, chartHeight);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Glow Line
    ctx.strokeStyle = isBull ? "#14F195" : "#FF3B30";
    ctx.lineWidth = 2 * dpr;
    ctx.shadowColor = isBull ? "rgba(20, 241, 149, 0.6)" : "rgba(255, 59, 48, 0.6)";
    ctx.shadowBlur = 8 * dpr;
    ctx.stroke(linePath);
    ctx.shadowBlur = 0; // reset

    // Draw Volume Bars
    const barWidth = Math.max(2 * dpr, stepX * 0.6);
    let maxVol = 1;
    history.forEach((d) => { if (d.volume > maxVol) maxVol = d.volume; });

    history.forEach((pt, i) => {
      const x = i * stepX - barWidth / 2;
      const vH = (pt.volume / maxVol) * volHeight;
      const y = h - vH;
      ctx.fillStyle = pt.close >= pt.open ? "rgba(20, 241, 149, 0.25)" : "rgba(255, 59, 48, 0.25)";
      ctx.fillRect(x, y, barWidth, vH);
    });

    // Crosshair & Tooltip
    if (this.mouse.active) {
      ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([4 * dpr, 4 * dpr]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(this.mouse.x, 0);
      ctx.lineTo(this.mouse.x, h);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, this.mouse.y);
      ctx.lineTo(w, this.mouse.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate price at cursor
      const idx = Math.min(history.length - 1, Math.max(0, Math.round(this.mouse.x / stepX)));
      const pt = history[idx];
      const curP = maxP - (this.mouse.y / chartHeight) * (maxP - minP);

      // Price Tag on Right
      ctx.fillStyle = "#00F0FF";
      ctx.font = `${10 * dpr}px JetBrains Mono, monospace`;
      const txt = `$${curP.toFixed(curP < 1 ? 4 : 2)}`;
      ctx.fillText(txt, Math.min(w - 60 * dpr, this.mouse.x + 8 * dpr), Math.max(16 * dpr, this.mouse.y - 6 * dpr));
    }
  }

  renderClmmHistogram() {
    if (!this.clmmCtx || !this.clmmCanvas) return;
    const ctx = this.clmmCtx;
    const w = this.clmmCanvas.width;
    const h = this.clmmCanvas.height;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, w, h);

    const clmm = window.clmmManager;
    if (!clmm) return;

    const vault = clmm.activeVault;
    const curP = vault.currentPrice;
    const minP = clmm.minPrice;
    const maxP = clmm.maxPrice;

    const numBins = 32;
    const rangeSpan = curP * 0.6; // show ±30% range around current price
    const chartMin = Math.max(0.000001, curP - rangeSpan);
    const chartMax = curP + rangeSpan;
    const binWidth = (w - 20 * dpr) / numBins;

    // Draw baseline
    ctx.strokeStyle = "rgba(153, 69, 255, 0.15)";
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    ctx.moveTo(10 * dpr, h - 20 * dpr);
    ctx.lineTo(w - 10 * dpr, h - 20 * dpr);
    ctx.stroke();

    // Gaussian bell curve peak around current price
    for (let i = 0; i < numBins; i++) {
      const binPrice = chartMin + (i / numBins) * (chartMax - chartMin);
      const distFromCenter = Math.abs(binPrice - curP) / (rangeSpan * 0.5);
      const density = Math.exp(-Math.pow(distFromCenter, 2) * 2.5);
      const binHeight = (h - 40 * dpr) * density * (0.8 + Math.sin(i * 1.5) * 0.15);

      const x = 10 * dpr + i * binWidth;
      const y = h - 20 * dpr - binHeight;

      const isInUserRange = binPrice >= minP && binPrice <= maxP;

      if (isInUserRange) {
        // Glowing concentrated liquidity bar
        const grad = ctx.createLinearGradient(0, y, 0, h - 20 * dpr);
        grad.addColorStop(0, "rgba(20, 241, 149, 0.9)");
        grad.addColorStop(1, "rgba(20, 241, 149, 0.15)");
        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(20, 241, 149, 0.5)";
        ctx.shadowBlur = 6 * dpr;
      } else {
        // Inactive depth bar
        ctx.fillStyle = "rgba(153, 69, 255, 0.2)";
        ctx.shadowBlur = 0;
      }

      ctx.fillRect(x + 1 * dpr, y, binWidth - 2 * dpr, binHeight);
      ctx.shadowBlur = 0;
    }

    // Draw Current Price Marker Line
    const curX = 10 * dpr + ((curP - chartMin) / (chartMax - chartMin)) * (w - 20 * dpr);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2 * dpr;
    ctx.setLineDash([3 * dpr, 3 * dpr]);
    ctx.beginPath();
    ctx.moveTo(curX, 10 * dpr);
    ctx.lineTo(curX, h - 20 * dpr);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current Price Tag
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${9 * dpr}px JetBrains Mono, monospace`;
    ctx.fillText("CURRENT", curX - 22 * dpr, 12 * dpr);

    // Min Range Handle
    const minX = Math.max(10 * dpr, Math.min(w - 10 * dpr, 10 * dpr + ((minP - chartMin) / (chartMax - chartMin)) * (w - 20 * dpr)));
    ctx.strokeStyle = "#00F0FF";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(minX, 20 * dpr);
    ctx.lineTo(minX, h - 20 * dpr);
    ctx.stroke();

    ctx.fillStyle = "#00F0FF";
    ctx.fillRect(minX - 4 * dpr, 16 * dpr, 8 * dpr, 8 * dpr);

    // Max Range Handle
    const maxX = Math.max(10 * dpr, Math.min(w - 10 * dpr, 10 * dpr + ((maxP - chartMin) / (chartMax - chartMin)) * (w - 20 * dpr)));
    ctx.strokeStyle = "#FF007A";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(maxX, 20 * dpr);
    ctx.lineTo(maxX, h - 20 * dpr);
    ctx.stroke();

    ctx.fillStyle = "#FF007A";
    ctx.fillRect(maxX - 4 * dpr, 16 * dpr, 8 * dpr, 8 * dpr);
  }
}

window.chartRenderer = new ChartRenderer();
