/**
 * CYBER STOIC PROTOCOL v3 - 3D THREE.JS PARTICLE ENGINE
 * Holographic 3D Particle Cloud with 4 Morph Formations,
 * Gravitational Pointer Physics, Additive Shimmer, and Breathing Pulses.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class StoicParticlePortal {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.particleSystem = null;

    this.particleCount = 10000;
    this.currentMode = 'citadel'; // 'bust', 'citadel', 'logos', 'dichotomy'
    this.morphProgress = 1.0;
    this.morphSpeed = 0.04;

    // Buffer attributes
    this.positions = null;
    this.currentPositions = null;
    this.targetPositions = null;
    this.colors = null;
    this.targetColors = null;
    this.sizes = null;
    this.baseVelocities = null;

    // Theme colors
    this.themePalette = {
      primary: new THREE.Color(0xffb000),   // Aurelius Gold
      secondary: new THREE.Color(0x00f0ff), // Cyan Neon
      accent: new THREE.Color(0xff5500),    // Molten Amber
      dim: new THREE.Color(0x223344)        // Deep Grid
    };

    // Interaction state
    this.mouse = new THREE.Vector2(-999, -999);
    this.mouseWorld = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.pointerActive = false;

    // Animation & Breathing state
    this.clock = new THREE.Clock();
    this.breathingPulse = 1.0;
    this.isBreathingActive = false;
    this.warpFactor = 0.0;
    this.targetWarp = 0.0;
    this.autoRotate = true;

    // Outer accent geometry (Holographic Gimbal Rings)
    this.ringsGroup = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x03060a, 0.0035);

    // 2. Camera setup
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    this.camera.position.set(0, 15, 140);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 350;
    this.controls.minDistance = 25;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.4;
    this.controls.enablePan = false;

    // 5. Build Procedural Particle Sprite
    const particleTexture = this.createParticleTexture();

    // 6. Init Particle Data Structures
    this.initParticles(particleTexture);

    // 7. Add Holographic Outer Wireframe Rings
    this.initHologramRings();

    // 8. Event Listeners
    this.setupEvents();

    // 9. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 220, 150, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 170, 0, 0.35)');
    gradient.addColorStop(0.8, 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  initParticles(texture) {
    const geometry = new THREE.BufferGeometry();
    const count = this.particleCount;

    this.currentPositions = new Float32Array(count * 3);
    this.targetPositions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.targetColors = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);
    this.baseVelocities = new Float32Array(count * 3);

    // Generate initial formation (Citadel)
    const initialCoords = this.generateCitadelGeometry(count);
    for (let i = 0; i < count * 3; i++) {
      this.currentPositions[i] = initialCoords.positions[i] + (Math.random() - 0.5) * 80;
      this.targetPositions[i] = initialCoords.positions[i];
      this.colors[i] = initialCoords.colors[i];
      this.targetColors[i] = initialCoords.colors[i];
      this.baseVelocities[i] = (Math.random() - 0.5) * 0.15;
    }

    for (let i = 0; i < count; i++) {
      this.sizes[i] = 1.8 + Math.random() * 2.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3.2,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  initHologramRings() {
    this.ringsGroup = new THREE.Group();

    // Ring 1: Equatorial Latitude Ring
    const ring1Geo = new THREE.TorusGeometry(55, 0.2, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffb000,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    this.ringsGroup.add(ring1);

    // Ring 2: Polar Meridian Ring
    const ring2Geo = new THREE.TorusGeometry(62, 0.15, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    this.ringsGroup.add(ring2);

    // Ring 3: Segmented Data Track
    const ring3Geo = new THREE.RingGeometry(68, 70, 36, 1, 0, Math.PI * 1.6);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    const ring3 = new THREE.Mesh(ring3Geo, ringMat3);
    ring3.rotation.x = Math.PI / 4;
    this.ringsGroup.add(ring3);

    this.scene.add(this.ringsGroup);
  }

  // --- FORMATION 1: MARCUS AURELIUS BUST & IMPERIAL LAUREL MATRIX ---
  generateBustGeometry(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cGold = this.themePalette.primary;
    const cCyan = this.themePalette.secondary;
    const cAmber = this.themePalette.accent;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ratio = i / count;

      if (ratio < 0.45) {
        // Head, Brow, Jawline Parametric Shell
        const u = Math.random() * Math.PI * 2;
        const v = (Math.random() - 0.5) * Math.PI;

        const rx = 18 * (1 + 0.12 * Math.cos(2 * v));
        const ry = 28 * (1 - 0.1 * Math.sin(v));
        const rz = 20 * (1 + 0.15 * Math.sin(v));

        let x = rx * Math.cos(v) * Math.sin(u);
        let y = ry * Math.sin(v) + 5;
        let z = rz * Math.cos(v) * Math.cos(u);

        // Chiseled Stoic facial sculpture modifications
        if (z > 0 && Math.abs(x) < 14) {
          // Nose bridge & brow ridge
          if (y > 2 && y < 14 && Math.abs(x) < 4) z += 6 * (1 - Math.abs(x) / 4);
          // Chin protrusion
          if (y < -12 && y > -24 && Math.abs(x) < 8) z += 5;
        }

        // Add subtle noise
        x += (Math.random() - 0.5) * 1.5;
        y += (Math.random() - 0.5) * 1.5;
        z += (Math.random() - 0.5) * 1.5;

        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;

        colors[idx] = cGold.r * (0.8 + Math.random() * 0.4);
        colors[idx + 1] = cGold.g * (0.8 + Math.random() * 0.4);
        colors[idx + 2] = cGold.b * (0.8 + Math.random() * 0.4);

      } else if (ratio < 0.70) {
        // Imperial Laurel Wreath Crown around the head
        const angle = Math.random() * Math.PI * 2;
        const radius = 22 + Math.sin(angle * 12) * 3.5;
        const height = 18 + Math.cos(angle * 6) * 4;

        positions[idx] = radius * Math.cos(angle);
        positions[idx + 1] = height + (Math.random() - 0.5) * 4;
        positions[idx + 2] = radius * Math.sin(angle);

        colors[idx] = cCyan.r * 1.2;
        colors[idx + 1] = cCyan.g * 1.2;
        colors[idx + 2] = cCyan.b * 1.2;

      } else if (ratio < 0.90) {
        // Imperial Neck & Shoulder Cyber-Armor Pedestal
        const theta = Math.random() * Math.PI * 2;
        const rad = 25 + (1 - ratio / 0.9) * 22;
        const y = -25 - Math.random() * 22;

        positions[idx] = rad * Math.cos(theta) * 1.3;
        positions[idx + 1] = y;
        positions[idx + 2] = rad * Math.sin(theta) * 0.8;

        colors[idx] = cAmber.r * 0.9;
        colors[idx + 1] = cAmber.g * 0.9;
        colors[idx + 2] = cAmber.b * 0.9;

      } else {
        // Floating Holographic Telemetry Motes
        const rad = 45 + Math.random() * 35;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;

        positions[idx] = rad * Math.sin(theta) * Math.cos(phi);
        positions[idx + 1] = rad * Math.cos(theta);
        positions[idx + 2] = rad * Math.sin(theta) * Math.sin(phi);

        colors[idx] = 1.0;
        colors[idx + 1] = 0.9;
        colors[idx + 2] = 0.6;
      }
    }

    return { positions, colors };
  }

  // --- FORMATION 2: THE INNER CITADEL (SACRED POLYHEDRAL FORTRESS) ---
  generateCitadelGeometry(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cGold = this.themePalette.primary;
    const cCyan = this.themePalette.secondary;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ratio = i / count;

      if (ratio < 0.40) {
        // Inner Core Dodecahedron & Golden Shield
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 24 + Math.sin(theta * 5) * Math.cos(phi * 5) * 4;

        positions[idx] = r * Math.sin(phi) * Math.cos(theta);
        positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[idx + 2] = r * Math.cos(phi);

        colors[idx] = cGold.r * 1.2;
        colors[idx + 1] = cGold.g * 1.1;
        colors[idx + 2] = cGold.b * 0.8;

      } else if (ratio < 0.75) {
        // Outer Hexagonal Bastion Walls & Defensive Ramparts
        const layer = Math.floor(Math.random() * 6);
        const angle = (layer * (Math.PI / 3)) + ((Math.random() - 0.5) * 0.45);
        const radius = 42 + Math.random() * 12;
        const y = (Math.random() - 0.5) * 45;

        positions[idx] = radius * Math.cos(angle);
        positions[idx + 1] = y;
        positions[idx + 2] = radius * Math.sin(angle);

        colors[idx] = cCyan.r;
        colors[idx + 1] = cCyan.g;
        colors[idx + 2] = cCyan.b;

      } else {
        // Orbital Energy Bastion Rings
        const ringAngle = Math.random() * Math.PI * 2;
        const ringRadius = 55 + Math.random() * 18;
        const tilt = 0.35;

        positions[idx] = ringRadius * Math.cos(ringAngle);
        positions[idx + 1] = Math.sin(ringAngle * 3) * 12 + (Math.random() - 0.5) * 5;
        positions[idx + 2] = ringRadius * Math.sin(ringAngle) * (1 + tilt);

        colors[idx] = 1.0;
        colors[idx + 1] = 0.7;
        colors[idx + 2] = 0.2;
      }
    }

    return { positions, colors };
  }

  // --- FORMATION 3: COSMIC LOGOS & AMOR FATI VORTEX ---
  generateLogosGeometry(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cGold = this.themePalette.primary;
    const cAmber = this.themePalette.accent;
    const cCyan = this.themePalette.secondary;

    const arms = 3;
    const armSeparation = (Math.PI * 2) / arms;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ratio = i / count;

      if (ratio < 0.85) {
        // Logarithmic Spiral Arms of Fate
        const armIndex = i % arms;
        const distance = Math.pow(Math.random(), 1.5) * 65 + 4;
        const angle = distance * 0.12 + armIndex * armSeparation + (Math.random() - 0.5) * 0.35;

        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = ((Math.random() - 0.5) * 14) * (1 - distance / 70) + (Math.sin(distance * 0.1) * 6);

        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;

        const mix = distance / 70;
        colors[idx] = THREE.MathUtils.lerp(cGold.r, cCyan.r, mix);
        colors[idx + 1] = THREE.MathUtils.lerp(cGold.g, cCyan.g, mix);
        colors[idx + 2] = THREE.MathUtils.lerp(cGold.b, cCyan.b, mix);

      } else {
        // Singularity Core (The Unmoved Mover)
        const rad = Math.random() * 8;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;

        positions[idx] = rad * Math.sin(theta) * Math.cos(phi);
        positions[idx + 1] = rad * Math.cos(theta);
        positions[idx + 2] = rad * Math.sin(theta) * Math.sin(phi);

        colors[idx] = 1.0;
        colors[idx + 1] = 0.95;
        colors[idx + 2] = 0.8;
      }
    }

    return { positions, colors };
  }

  // --- FORMATION 4: DICHOTOMY OF CONTROL (DUAL CORE & HELIX) ---
  generateDichotomyGeometry(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cGold = this.themePalette.primary;
    const cCyan = this.themePalette.secondary;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ratio = i / count;

      if (ratio < 0.40) {
        // INNER CORE: In Our Control (Solid, Bright, Symmetrical Sphere)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 16 * Math.cbrt(Math.random());

        positions[idx] = r * Math.sin(phi) * Math.cos(theta);
        positions[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[idx + 2] = r * Math.cos(phi);

        colors[idx] = cGold.r * 1.3;
        colors[idx + 1] = cGold.g * 1.1;
        colors[idx + 2] = cGold.b * 0.6;

      } else if (ratio < 0.75) {
        // DOUBLE HELIX: The Gateway of Reason
        const t = (i / (count * 0.35)) * Math.PI * 6;
        const strand = i % 2 === 0 ? 1 : -1;
        const helixRadius = 32;
        const height = ((ratio - 0.4) / 0.35 - 0.5) * 80;

        positions[idx] = Math.cos(t + (strand > 0 ? 0 : Math.PI)) * helixRadius + (Math.random() - 0.5) * 3;
        positions[idx + 1] = height;
        positions[idx + 2] = Math.sin(t + (strand > 0 ? 0 : Math.PI)) * helixRadius + (Math.random() - 0.5) * 3;

        colors[idx] = cCyan.r;
        colors[idx + 1] = cCyan.g;
        colors[idx + 2] = cCyan.b;

      } else {
        // OUTER FIELD: Outside Our Control (Dynamic, Dispersed Cloud of Externals)
        const rad = 45 + Math.random() * 25;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;

        positions[idx] = rad * Math.sin(theta) * Math.cos(phi);
        positions[idx + 1] = rad * Math.cos(theta);
        positions[idx + 2] = rad * Math.sin(theta) * Math.sin(phi);

        colors[idx] = 0.5;
        colors[idx + 1] = 0.6;
        colors[idx + 2] = 0.7;
      }
    }

    return { positions, colors };
  }

  // --- MORPH CONTROLLER ---
  setFormation(formationName) {
    if (this.currentMode === formationName && this.morphProgress >= 1.0) return;
    this.currentMode = formationName;
    this.morphProgress = 0.0;

    let targetData;
    switch (formationName) {
      case 'bust':
        targetData = this.generateBustGeometry(this.particleCount);
        break;
      case 'logos':
        targetData = this.generateLogosGeometry(this.particleCount);
        break;
      case 'dichotomy':
        targetData = this.generateDichotomyGeometry(this.particleCount);
        break;
      case 'citadel':
      default:
        targetData = this.generateCitadelGeometry(this.particleCount);
        break;
    }

    for (let i = 0; i < this.particleCount * 3; i++) {
      this.targetPositions[i] = targetData.positions[i];
      this.targetColors[i] = targetData.colors[i];
    }
  }

  // Shockwave burst on quote trigger
  triggerPulse() {
    this.targetWarp = 1.0;
    const pos = this.particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const factor = 1.25 + Math.random() * 0.3;
      pos[idx] *= factor;
      pos[idx + 1] *= factor;
      pos[idx + 2] *= factor;
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // Set Theme Palette dynamically
  applyTheme(themeKey) {
    let p, s, a;
    if (themeKey === 'cyan') {
      p = new THREE.Color(0x00f0ff);
      s = new THREE.Color(0x00ffa3);
      a = new THREE.Color(0x7000ff);
    } else if (themeKey === 'crimson') {
      p = new THREE.Color(0xff2a5f);
      s = new THREE.Color(0xff8800);
      a = new THREE.Color(0xa855f7);
    } else if (themeKey === 'emerald') {
      p = new THREE.Color(0x00ff9d);
      s = new THREE.Color(0x00f0ff);
      a = new THREE.Color(0xeab308);
    } else {
      // gold
      p = new THREE.Color(0xffb000);
      s = new THREE.Color(0x00f0ff);
      a = new THREE.Color(0xff5500);
    }

    this.themePalette.primary = p;
    this.themePalette.secondary = s;
    this.themePalette.accent = a;

    if (this.ringsGroup) {
      this.ringsGroup.children[0].material.color = p;
      this.ringsGroup.children[1].material.color = s;
      this.ringsGroup.children[2].material.color = a;
    }

    // Refresh current target formation colors
    this.setFormation(this.currentMode);
  }

  setBreathingScale(scale, isBreathing) {
    this.breathingPulse = scale;
    this.isBreathingActive = isBreathing;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Pointer Gravity Well
    const onPointerMove = (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.pointerActive = true;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.ray.intersectPlane(this.plane, this.mouseWorld);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', () => {
      this.pointerActive = false;
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Damping warp factor
    this.warpFactor += (this.targetWarp - this.warpFactor) * 0.08;
    this.targetWarp *= 0.92;

    // 2. Animate Outer Hologram Rings
    if (this.ringsGroup) {
      this.ringsGroup.rotation.y = elapsedTime * 0.15;
      this.ringsGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2;
      this.ringsGroup.rotation.z = Math.cos(elapsedTime * 0.08) * 0.15;
    }

    // 3. Update Particle Positions & Morph
    if (this.particleSystem) {
      const posAttr = this.particleSystem.geometry.attributes.position;
      const colAttr = this.particleSystem.geometry.attributes.color;
      const pos = posAttr.array;
      const col = colAttr.array;

      if (this.morphProgress < 1.0) {
        this.morphProgress = Math.min(1.0, this.morphProgress + this.morphSpeed);
      }

      const breathMod = this.isBreathingActive ? this.breathingPulse : (1 + Math.sin(elapsedTime * 1.2) * 0.035);

      for (let i = 0; i < this.particleCount; i++) {
        const idx = i * 3;

        // Interpolate toward target position
        let tx = this.targetPositions[idx] * breathMod;
        let ty = this.targetPositions[idx + 1] * breathMod;
        let tz = this.targetPositions[idx + 2] * breathMod;

        // Interpolate colors
        col[idx] += (this.targetColors[idx] - col[idx]) * 0.05;
        col[idx + 1] += (this.targetColors[idx + 1] - col[idx + 1]) * 0.05;
        col[idx + 2] += (this.targetColors[idx + 2] - col[idx + 2]) * 0.05;

        // Subtle ambient harmonic drift
        tx += Math.sin(elapsedTime * 0.8 + i) * 0.4;
        ty += Math.cos(elapsedTime * 0.6 + i) * 0.4;

        // Pointer Gravity Interaction
        if (this.pointerActive) {
          const dx = pos[idx] - this.mouseWorld.x;
          const dy = pos[idx + 1] - this.mouseWorld.y;
          const dz = pos[idx + 2] - this.mouseWorld.z;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 1600 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 40) * 14;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
            tz += (dz / dist) * force;
          }
        }

        // Smooth physics step
        pos[idx] += (tx - pos[idx]) * 0.08;
        pos[idx + 1] += (ty - pos[idx + 1]) * 0.08;
        pos[idx + 2] += (tz - pos[idx + 2]) * 0.08;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Slight global rotation
      this.particleSystem.rotation.y = elapsedTime * 0.05;
    }

    // 4. Update Orbit Controls
    if (this.controls) {
      this.controls.update();
    }

    // 5. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
