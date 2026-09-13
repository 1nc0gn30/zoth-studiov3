/**
 * OBSIDIAN OATH // SKATE COLLECTIVE — 3D SKATEBOARD DECK LAB
 * High-detail procedural 3D skateboard model using Three.js with realistic
 * 7-ply maple deck, gold foil leaf graphics, trucks, urethane wheels, and
 * physics-based trick animations (Kickflip, Tre Flip, Pop Shuvit).
 */

class SkateDeckViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.boardGroup = null;
    this.deckMesh = null;
    this.bottomTextureCanvas = null;
    this.bottomTexture = null;

    this.isRotating = true;
    this.isAnimatingTrick = false;
    this.currentGraphic = 'sacred_hex';
    this.animationFrameId = null;

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 3.5, 6.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 3.5;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI * 0.85;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Build Skateboard Assembly
    this.buildSkateboard();

    // 7. Event listeners
    window.addEventListener('resize', () => this.onWindowResize());

    // 8. Animation loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Radiant Gold Key Light
    const goldKeyLight = new THREE.DirectionalLight(0xfbbf24, 2.5);
    goldKeyLight.position.set(5, 8, 5);
    goldKeyLight.castShadow = true;
    goldKeyLight.shadow.mapSize.width = 1024;
    goldKeyLight.shadow.mapSize.height = 1024;
    this.scene.add(goldKeyLight);

    // Cool Obsidian Fill Light
    const coolFillLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    coolFillLight.position.set(-6, -3, -4);
    this.scene.add(coolFillLight);

    // Gold Rim Light
    const rimLight = new THREE.PointLight(0xfef08a, 2.0, 15);
    rimLight.position.set(0, -2, -3);
    this.scene.add(rimLight);
  }

  // Generate high-resolution graphic canvas for the bottom of the deck
  createDeckGraphicCanvas(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Obsidian Background
    ctx.fillStyle = '#0a0a0e';
    ctx.fillRect(0, 0, 1024, 2048);

    // Sacred Gold Border
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 12;
    ctx.strokeRect(50, 80, 924, 1888);

    ctx.lineWidth = 4;
    ctx.setLineDash([16, 12]);
    ctx.strokeRect(75, 105, 874, 1838);
    ctx.setLineDash([]);

    // Hermetic Center Illustration
    const cx = 512;
    const cy = 1024;

    // Metallic Gold Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, 1024, 2048);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.3, '#fbbf24');
    goldGrad.addColorStop(0.7, '#d97706');
    goldGrad.addColorStop(1, '#78350f');

    if (type === 'sacred_hex') {
      // Sacred Hexagram & All-Seeing Eye
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.arc(cx, cy, 320, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 280, 0, Math.PI * 2);
      ctx.stroke();

      // Triangle 1 (up)
      ctx.beginPath();
      ctx.moveTo(cx, cy - 250);
      ctx.lineTo(cx + 216, cy + 125);
      ctx.lineTo(cx - 216, cy + 125);
      ctx.closePath();
      ctx.stroke();

      // Triangle 2 (down)
      ctx.beginPath();
      ctx.moveTo(cx, cy + 250);
      ctx.lineTo(cx + 216, cy - 125);
      ctx.lineTo(cx - 216, cy - 125);
      ctx.closePath();
      ctx.stroke();

      // Eye
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0a0e';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();

    } else if (type === 'alchemical_sun') {
      // Radiant Alchemical Sun
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.stroke();

      // Rays
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12;
        const r1 = 240;
        const r2 = i % 2 === 0 ? 360 : 300;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
        ctx.stroke();
      }

      ctx.fillStyle = goldGrad;
      ctx.font = 'bold 72px Cinzel, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOL INVICTUS', cx, cy + 24);

    } else if (type === 'ouroboros') {
      // Ouroboros Serpent Circle
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 260, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = goldGrad;
      ctx.font = '900 80px Cinzel, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE VOID', cx, cy + 28);
    } else {
      // Raw Street Stencil
      ctx.fillStyle = goldGrad;
      ctx.font = '900 110px Cinzel, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('OBSIDIAN', cx, cy - 60);
      ctx.fillText('STREET SECT', cx, cy + 60);
    }

    // Top Typography
    ctx.fillStyle = goldGrad;
    ctx.font = '900 64px Cinzel, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('OBSIDIAN OATH', cx, 280);

    ctx.font = 'bold 36px Space Grotesk, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('HERMETIC 7-PLY MAPLE • 8.25"', cx, 340);

    // Bottom Typography
    ctx.font = '900 48px Cinzel, Georgia, serif';
    ctx.fillStyle = goldGrad;
    ctx.fillText('NO SPONSORS • FREE TAPE', cx, 1720);

    ctx.font = '600 32px Space Grotesk, sans-serif';
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText('STREET CERTIFIED MMXXVI', cx, 1780);

    return canvas;
  }

  // Create griptape abrasive texture
  createGripTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 512, 1024);

    // Noise grain for sandpaper texture
    const imgData = ctx.getImageData(0, 0, 512, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() * 45) - 20;
      data[i] = Math.max(10, Math.min(60, 26 + grain));
      data[i + 1] = Math.max(10, Math.min(60, 26 + grain));
      data[i + 2] = Math.max(10, Math.min(60, 28 + grain));
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Gold grip cutline
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(512, 300);
    ctx.stroke();

    // Sacred dot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(256, 300, 10, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  buildSkateboard() {
    this.boardGroup = new THREE.Group();

    // 1. Deck Geometry with Concave and Kicktail/Nose curves
    const deckShape = new THREE.Shape();
    const w = 1.0; // Width
    const l = 3.6; // Length
    const r = 0.45; // Nose/Tail radius

    // Create realistic skateboard deck perimeter contour
    deckShape.moveTo(-w / 2 + r, -l / 2);
    deckShape.lineTo(w / 2 - r, -l / 2);
    deckShape.quadraticCurveTo(w / 2, -l / 2, w / 2, -l / 2 + r);
    deckShape.lineTo(w / 2, l / 2 - r);
    deckShape.quadraticCurveTo(w / 2, l / 2, w / 2 - r, l / 2);
    deckShape.lineTo(-w / 2 + r, l / 2);
    deckShape.quadraticCurveTo(-w / 2, l / 2, -w / 2, l / 2 - r);
    deckShape.lineTo(-w / 2, -l / 2 + r);
    deckShape.quadraticCurveTo(-w / 2, -l / 2, -w / 2 + r, -l / 2);

    const extrudeSettings = {
      steps: 2,
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    };

    const deckGeometry = new THREE.ExtrudeGeometry(deckShape, extrudeSettings);
    deckGeometry.center();

    // Curve the deck vertices (Kicktail, Nose, Concave)
    const pos = deckGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      let z = pos.getZ(i);

      // Concave along X axis
      const concave = Math.pow(x / (w / 2), 2) * 0.035;
      z += concave;

      // Nose curve (top)
      if (y > 1.2) {
        const kickNose = Math.pow((y - 1.2) / 0.6, 2) * 0.16;
        z += kickNose;
      }
      // Tail curve (bottom)
      if (y < -1.2) {
        const kickTail = Math.pow((-y - 1.2) / 0.6, 2) * 0.14;
        z += kickTail;
      }

      pos.setZ(i, z);
    }
    deckGeometry.computeVertexNormals();

    // Canvas texture for the bottom graphic
    this.bottomTextureCanvas = this.createDeckGraphicCanvas(this.currentGraphic);
    this.bottomTexture = new THREE.CanvasTexture(this.bottomTextureCanvas);
    this.bottomTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.bottomTexture.wrapT = THREE.ClampToEdgeWrapping;

    const gripTexture = this.createGripTexture();

    // Deck Materials
    const bottomMaterial = new THREE.MeshStandardMaterial({
      map: this.bottomTexture,
      roughness: 0.25,
      metalness: 0.65,
      bumpScale: 0.02
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x92400e, // Maple ply edge
      roughness: 0.7,
      metalness: 0.1
    });

    const gripMaterial = new THREE.MeshStandardMaterial({
      map: gripTexture,
      roughness: 0.9,
      metalness: 0.1
    });

    this.deckMesh = new THREE.Mesh(deckGeometry, [
      bottomMaterial, // Front/Back face
      edgeMaterial    // Side edge
    ]);
    this.deckMesh.castShadow = true;
    this.deckMesh.receiveShadow = true;
    this.boardGroup.add(this.deckMesh);

    // 2. Hardware Bolts on top of deck (8 gold bolts)
    const boltGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 });

    const boltOffsets = [
      [-0.25, 0.9], [0.25, 0.9], [-0.25, 1.2], [0.25, 1.2],
      [-0.25, -0.9], [0.25, -0.9], [-0.25, -1.2], [0.25, -1.2]
    ];

    boltOffsets.forEach(([bx, by]) => {
      const bolt = new THREE.Mesh(boltGeom, boltMat);
      bolt.position.set(bx, by, 0.05);
      bolt.rotation.x = Math.PI / 2;
      this.boardGroup.add(bolt);
    });

    // 3. Trucks & Wheels
    this.buildTrucksAndWheels();

    // Default angle for aesthetic presentation
    this.boardGroup.rotation.x = -Math.PI / 3;
    this.boardGroup.rotation.y = Math.PI / 6;
    this.boardGroup.rotation.z = -Math.PI / 8;

    this.scene.add(this.boardGroup);
  }

  buildTrucksAndWheels() {
    const truckMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.85,
      roughness: 0.2
    });

    const bushingMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.3,
      roughness: 0.4
    });

    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3, // 52mm Urethane white/cream
      roughness: 0.4,
      metalness: 0.1
    });

    const goldHubMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2
    });

    const truckPositions = [1.05, -1.05];

    truckPositions.forEach((yPos) => {
      const truckAssembly = new THREE.Group();

      // Baseplate
      const baseplateGeom = new THREE.BoxGeometry(0.5, 0.35, 0.06);
      const baseplate = new THREE.Mesh(baseplateGeom, truckMat);
      baseplate.position.set(0, 0, -0.07);
      truckAssembly.add(baseplate);

      // Kingpin & Bushings
      const bushingGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12);
      const bushing = new THREE.Mesh(bushingGeom, bushingMat);
      bushing.position.set(0, yPos > 0 ? -0.04 : 0.04, -0.15);
      bushing.rotation.x = Math.PI / 2;
      truckAssembly.add(bushing);

      // Hanger / Axle rod
      const axleGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
      const axle = new THREE.Mesh(axleGeom, truckMat);
      axle.position.set(0, 0, -0.22);
      axle.rotation.z = Math.PI / 2;
      truckAssembly.add(axle);

      // Left & Right Wheels
      [-0.66, 0.66].forEach((wheelX) => {
        const wheelGroup = new THREE.Group();

        const wheelGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24);
        const wheel = new THREE.Mesh(wheelGeom, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheelGroup.add(wheel);

        // Gold Bearing Hub
        const hubGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.17, 16);
        const hub = new THREE.Mesh(hubGeom, goldHubMat);
        hub.rotation.z = Math.PI / 2;
        wheelGroup.add(hub);

        wheelGroup.position.set(wheelX, 0, -0.22);
        truckAssembly.add(wheelGroup);
      });

      truckAssembly.position.set(0, yPos, 0);
      this.boardGroup.add(truckAssembly);
    });
  }

  // Switch Graphic
  setGraphic(type) {
    this.currentGraphic = type;
    const canvas = this.createDeckGraphicCanvas(type);
    this.bottomTexture.image = canvas;
    this.bottomTexture.needsUpdate = true;
    if (window.skateAudio) window.skateAudio.playTapeClick();
  }

  // Physics animation: Kickflip, Tre Flip, Pop Shuvit
  performTrick(trickType = 'kickflip') {
    if (this.isAnimatingTrick) return;
    this.isAnimatingTrick = true;
    if (window.skateAudio) window.skateAudio.playDeckPop();

    const startTime = performance.now();
    const duration = 900; // ms

    const startRotX = this.boardGroup.rotation.x;
    const startRotY = this.boardGroup.rotation.y;
    const startRotZ = this.boardGroup.rotation.z;
    const startPosZ = this.boardGroup.position.z;

    let targetRotY = startRotY;
    let targetRotZ = startRotZ;
    let targetRotX = startRotX;

    if (trickType === 'kickflip') {
      // 360 roll on length axis (Z in local space)
      targetRotZ = startRotZ + Math.PI * 2;
    } else if (trickType === 'treflip') {
      // 360 shuvit (Y) + 360 kickflip (Z)
      targetRotY = startRotY + Math.PI * 2;
      targetRotZ = startRotZ + Math.PI * 2;
    } else if (trickType === 'pop_shuvit') {
      // 180 horizontal spin
      targetRotY = startRotY + Math.PI;
    }

    const animateTrick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease in-out
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Pop jump height (parabola)
      const jumpHeight = Math.sin(progress * Math.PI) * 1.2;
      this.boardGroup.position.z = startPosZ + jumpHeight;

      this.boardGroup.rotation.x = startRotX + (targetRotX - startRotX) * ease;
      this.boardGroup.rotation.y = startRotY + (targetRotY - startRotY) * ease;
      this.boardGroup.rotation.z = startRotZ + (targetRotZ - startRotZ) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateTrick);
      } else {
        this.boardGroup.position.z = startPosZ;
        this.isAnimatingTrick = false;
        if (window.skateAudio) window.skateAudio.playDeckPop();
      }
    };

    requestAnimationFrame(animateTrick);
  }

  toggleRotation() {
    this.isRotating = !this.isRotating;
    if (window.skateAudio) window.skateAudio.playTapeClick();
    const btn = document.getElementById('spin-toggle-btn');
    if (btn) btn.textContent = this.isRotating ? 'AUTO-SPIN: ON' : 'AUTO-SPIN: OFF';
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    // Gentle auto-rotation when not in user drag or trick
    if (this.isRotating && !this.isAnimatingTrick && this.boardGroup) {
      this.boardGroup.rotation.y += 0.008;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Global hook
window.SkateDeckViewer = SkateDeckViewer;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('deck-canvas-container')) {
    window.deckViewer = new SkateDeckViewer('deck-canvas-container');

    // Button Binds
    const kickflipBtn = document.getElementById('trick-kickflip-btn');
    if (kickflipBtn) {
      kickflipBtn.addEventListener('click', () => window.deckViewer.performTrick('kickflip'));
    }

    const treflipBtn = document.getElementById('trick-treflip-btn');
    if (treflipBtn) {
      treflipBtn.addEventListener('click', () => window.deckViewer.performTrick('treflip'));
    }

    const spinBtn = document.getElementById('spin-toggle-btn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => window.deckViewer.toggleRotation());
    }

    const graphicSelect = document.getElementById('deck-graphic-select');
    if (graphicSelect) {
      graphicSelect.addEventListener('change', (e) => window.deckViewer.setGraphic(e.target.value));
    }
  }
});
