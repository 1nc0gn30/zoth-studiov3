/**
 * KEY! (FATMANKEY) - VISUALIZER ENGINE
 * Real-time Canvas Particle Matrix, Audio Spectrum Analyzers & 3D Wireframe Dice
 */

class VisualizerEngine {
  constructor() {
    this.bgCanvas = document.getElementById('bg-canvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
    
    this.beatlabCanvas = document.getElementById('beatlab-vis-canvas');
    this.beatlabCtx = this.beatlabCanvas ? this.beatlabCanvas.getContext('2d') : null;
    
    this.playerCanvas = document.getElementById('player-vis-canvas');
    this.playerCtx = this.playerCanvas ? this.playerCanvas.getContext('2d') : null;

    this.particles = [];
    this.particleCount = 50;
    this.mouseX = -1000;
    this.mouseY = -1000;

    this.animationFrameId = null;
    this.init();
  }

  init() {
    this.resizeBg();
    window.addEventListener('resize', () => this.resizeBg());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.createParticles();
    this.animate();
  }

  resizeBg() {
    if (!this.bgCanvas) return;
    this.bgCanvas.width = window.innerWidth;
    this.bgCanvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? 'rgba(0, 255, 136, ' : 'rgba(255, 183, 0, ',
        alpha: Math.random() * 0.4 + 0.2,
        isDice: Math.random() > 0.85,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  animate() {
    this.renderBg();
    this.renderBeatlabVis();
    this.renderPlayerVis();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  renderBg() {
    if (!this.bgCtx || !this.bgCanvas) return;
    const ctx = this.bgCtx;
    const w = this.bgCanvas.width;
    const h = this.bgCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Check Audio Energy
    let audioEnergy = 0;
    if (window.TrapEngine && window.TrapEngine.analyser) {
      const freqData = new Uint8Array(window.TrapEngine.analyser.frequencyBinCount);
      window.TrapEngine.analyser.getByteFrequencyData(freqData);
      let sum = 0;
      for (let i = 0; i < 16; i++) sum += freqData[i];
      audioEnergy = (sum / 16) / 255.0; // 0.0 - 1.0
    }

    // Update & Draw Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx * (1 + audioEnergy * 1.5);
      p.y += p.vy * (1 + audioEnergy * 1.5);
      p.rot += p.rotSpeed;

      // Wrap boundaries
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // Mouse repulsion
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        p.x += (dx / dist) * 2;
        p.y += (dy / dist) * 2;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (p.isDice) {
        // Draw tiny wireframe glowing casino die
        const dSize = (p.size * 5) * (1 + audioEnergy * 0.4);
        ctx.strokeStyle = p.color + (p.alpha + audioEnergy * 0.4) + ')';
        ctx.lineWidth = 1;
        ctx.strokeRect(-dSize/2, -dSize/2, dSize, dSize);
        // Dots
        ctx.fillStyle = p.color + '0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Glowing dot
        const dotSize = p.size * (1 + audioEnergy * 0.8);
        ctx.fillStyle = p.color + (p.alpha + audioEnergy * 0.3) + ')';
        ctx.beginPath();
        ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Connecting lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const pdist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pdist < 100) {
          ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - pdist / 100) * 0.12 * (1 + audioEnergy)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  renderBeatlabVis() {
    if (!this.beatlabCtx || !this.beatlabCanvas) return;
    const ctx = this.beatlabCtx;
    const w = this.beatlabCanvas.width;
    const h = this.beatlabCanvas.height;

    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, w, h);

    if (window.TrapEngine && window.TrapEngine.analyser && (window.TrapEngine.isPlaying || window.TrapEngine.isRadioPlaying)) {
      const bufferLength = window.TrapEngine.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      window.TrapEngine.analyser.getByteFrequencyData(dataArray);

      const barCount = 32;
      const barWidth = (w / barCount) - 2;
      let x = 1;

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * 2] / 255.0;
        const barHeight = Math.max(2, val * (h - 6));

        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0, '#00ff88');
        grad.addColorStop(1, '#ffb700');

        ctx.fillStyle = grad;
        ctx.fillRect(x, h - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    } else {
      // Idle pulse line
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    }
  }

  renderPlayerVis() {
    if (!this.playerCtx || !this.playerCanvas) return;
    const ctx = this.playerCtx;
    const w = this.playerCanvas.width;
    const h = this.playerCanvas.height;

    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, w, h);

    if (window.TrapEngine && window.TrapEngine.analyser && window.TrapEngine.isRadioPlaying) {
      const bufferLength = 16;
      const dataArray = new Uint8Array(bufferLength);
      window.TrapEngine.analyser.getByteFrequencyData(dataArray);

      const barWidth = (w / bufferLength) - 2;
      let x = 1;

      for (let i = 0; i < bufferLength; i++) {
        const val = dataArray[i] / 255.0;
        const barHeight = Math.max(3, val * (h - 4));

        ctx.fillStyle = '#00ff88';
        ctx.fillRect(x, h - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    } else {
      // Resting bars
      const barWidth = (w / 12) - 2;
      let x = 1;
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = '#222634';
        ctx.fillRect(x, h - 4, barWidth, 3);
        x += barWidth + 2;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.Visualizer = new VisualizerEngine();
});
