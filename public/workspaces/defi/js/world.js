/**
 * CYBERDEX 3D — Solana Concentrated Liquidity 3D WebGL World
 * Built with Three.js: Floating Vault Monoliths, AMM Fusion Core, Orbiting Satellites, Raycasting & Drone Controls
 */

class CyberDexWorld {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Camera Navigation Modes: 'orbit', 'fps', 'tour', 'clmm'
    this.cameraMode = "orbit";
    this.targetLookAt = new THREE.Vector3(0, 5, 0);

    // Orbit controls state
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.orbitAngles = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 45 };

    // FPS / Drone controls state
    this.fpsPos = new THREE.Vector3(0, 6, 32);
    this.fpsYaw = 0;
    this.fpsPitch = 0;
    this.keys = {};

    // Interactive 3D Objects Registry
    this.interactiveObjects = [];
    this.vaultMeshes = [];
    this.tokenSatellites = [];
    this.voxelBars = [];
    this.laserBeams = [];

    // Raycasting & Hover
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2(-999, -999);
    this.hoveredObject = null;

    // Animation & Clocks
    this.clock = new THREE.Clock();
    this.time = 0;

    // Tour spline checkpoints
    this.tourIndex = 0;
    this.tourProgress = 0;
    this.tourPoints = [
      { pos: new THREE.Vector3(0, 18, 38), look: new THREE.Vector3(0, 4, 0) }, // Central Core
      { pos: new THREE.Vector3(26, 12, 16), look: new THREE.Vector3(20, 6, 0) }, // Vault 1 SOL/USDC
      { pos: new THREE.Vector3(16, 12, -26), look: new THREE.Vector3(10, 6, -18) }, // Vault 2 JUP/SOL
      { pos: new THREE.Vector3(-18, 12, -24), look: new THREE.Vector3(-12, 6, -16) }, // Vault 3 BONK/SOL
      { pos: new THREE.Vector3(-28, 12, 14), look: new THREE.Vector3(-20, 6, 0) }, // Vault 4 RAY/USDC
      { pos: new THREE.Vector3(0, 42, 0.1), look: new THREE.Vector3(0, 0, 0) } // High Cosmos God-View
    ];

    this.init();
  }

  init() {
    this.container = document.getElementById("webgl-container");
    if (!this.container) return;

    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080914);
    this.scene.fog = new THREE.FogExp2(0x080914, 0.015);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 300);
    this.updateOrbitCamera();

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Environment & Floor Grid
    this.setupCyberGrid();
    this.setupStarfield();

    // 6. Central AMM Fusion Reactor Core
    this.setupCentralFusionCore();

    // 7. Concentrated Liquidity Vault Monoliths
    this.setupVaultMonoliths();

    // 8. Orbiting Token Holo-Satellites
    this.setupTokenSatellites();

    // 9. 3D Concentrated Voxel AMM Depth Grid
    this.setupClmmVoxelDepth();

    // 10. Data Conduits & Flowing Streams
    this.setupDataConduits();

    // 11. Event Listeners
    this.setupEvents();

    // 12. Start Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x2A1B4E, 1.2);
    this.scene.add(ambientLight);

    // Central Solana Core Point Light (Cyan/Green Glow)
    this.coreLight = new THREE.PointLight(0x14F195, 3.5, 60);
    this.coreLight.position.set(0, 6, 0);
    this.scene.add(this.coreLight);

    // Purple Ambient Accent Light
    this.purpleLight = new THREE.PointLight(0x9945FF, 3.0, 80);
    this.purpleLight.position.set(0, 25, 0);
    this.scene.add(this.purpleLight);

    // Cyan Directional Key Light
    const dirLight = new THREE.DirectionalLight(0x00F0FF, 0.8);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);
  }

  setupCyberGrid() {
    // Large Ground Grid
    const gridHelper = new THREE.GridHelper(160, 80, 0x9945FF, 0x181B38);
    gridHelper.position.y = 0;
    this.scene.add(gridHelper);

    // Concentric Glowing Rings on Floor
    for (let r of [12, 24, 36, 48]) {
      const ringGeo = new THREE.RingGeometry(r - 0.15, r + 0.15, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 24 === 0 ? 0x14F195 : 0x00F0FF,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.05;
      this.scene.add(ringMesh);
    }
  }

  setupStarfield() {
    const starCount = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0x9945FF);
    const c2 = new THREE.Color(0x14F195);
    const c3 = new THREE.Color(0x00F0FF);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 80 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const pickC = Math.random() > 0.6 ? c1 : Math.random() > 0.3 ? c2 : c3;
      colors[i * 3] = pickC.r;
      colors[i * 3 + 1] = pickC.g;
      colors[i * 3 + 2] = pickC.b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.starfield = new THREE.Points(geo, mat);
    this.scene.add(this.starfield);
  }

  setupCentralFusionCore() {
    this.fusionGroup = new THREE.Group();
    this.fusionGroup.position.set(0, 5.5, 0);

    // Inner Pulsating Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x14F195,
      emissive: 0x14F195,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: true
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.fusionGroup.add(this.coreMesh);

    // Inner solid crystal
    const innerGeo = new THREE.OctahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00F0FF,
      emissive: 0x00F0FF,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8
    });
    this.innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    this.fusionGroup.add(this.innerCrystal);

    // 3 Rotating Gyro Rings
    this.gyroRings = [];
    const ringRadii = [3.2, 4.0, 4.8];
    const ringColors = [0x9945FF, 0x14F195, 0x00F0FF];

    ringRadii.forEach((rad, idx) => {
      const ringGeo = new THREE.TorusGeometry(rad, 0.08, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        emissive: ringColors[idx],
        emissiveIntensity: 0.6,
        metalness: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = (idx * Math.PI) / 3;
      ring.rotation.y = (idx * Math.PI) / 4;
      this.fusionGroup.add(ring);
      this.gyroRings.push(ring);
    });

    // Base pedestal
    const pedGeo = new THREE.CylinderGeometry(4.5, 6, 2.5, 32);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x121528,
      roughness: 0.4,
      metalness: 0.8
    });
    const pedMesh = new THREE.Mesh(pedGeo, pedMat);
    pedMesh.position.y = -4.2;
    this.fusionGroup.add(pedMesh);

    this.scene.add(this.fusionGroup);
  }

  setupVaultMonoliths() {
    const clmm = window.clmmManager;
    if (!clmm) return;

    const radius = 24;
    const vaults = clmm.vaults;
    const numVaults = vaults.length;

    vaults.forEach((v, i) => {
      const angle = (i / numVaults) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Monolith Obelisk Body
      const monoGeo = new THREE.BoxGeometry(2.4, 10, 2.4);
      const monoMat = new THREE.MeshStandardMaterial({
        color: 0x101326,
        roughness: 0.3,
        metalness: 0.7
      });
      const monoMesh = new THREE.Mesh(monoGeo, monoMat);
      monoMesh.position.y = 5;
      group.add(monoMesh);

      // Glowing Neon Spine Strip
      const spineGeo = new THREE.BoxGeometry(0.3, 10.2, 2.5);
      const spineMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(v.colorA),
        emissive: new THREE.Color(v.colorA),
        emissiveIntensity: 1.0
      });
      const spineMesh = new THREE.Mesh(spineGeo, spineMat);
      spineMesh.position.y = 5;
      group.add(spineMesh);

      // Floating Energy Crystal on top of Monolith
      const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(v.colorB),
        emissive: new THREE.Color(v.colorB),
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.9
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalMesh.position.y = 11.8;
      group.add(crystalMesh);

      // Local Point Light for Vault Glow
      const vLight = new THREE.PointLight(new THREE.Color(v.colorA), 1.6, 18);
      vLight.position.set(0, 11.8, 0);
      group.add(vLight);

      // Floating Holographic Ring around Monolith
      const haloGeo = new THREE.TorusGeometry(2.2, 0.06, 16, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(v.colorA),
        transparent: true,
        opacity: 0.7
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      haloMesh.position.y = 8.5;
      group.add(haloMesh);

      // Interaction Hitbox (Invisible enlarged box for easy mouse clicks)
      const hitGeo = new THREE.BoxGeometry(5.0, 14, 5.0);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 7;
      hitMesh.userData = {
        type: "vault",
        vaultId: v.id,
        vaultName: v.name,
        feeTier: v.feeTier,
        apr: `${v.baseApr}%`,
        parentGroup: group,
        crystalMesh,
        haloMesh,
        spineMat
      };
      group.add(hitMesh);

      this.interactiveObjects.push(hitMesh);
      this.vaultMeshes.push({
        vault: v,
        group,
        crystalMesh,
        haloMesh,
        hitMesh,
        baseY: 0,
        floatPhase: i * 1.05
      });

      this.scene.add(group);
    });
  }

  setupTokenSatellites() {
    const tokens = window.dexEngine ? window.dexEngine.getAllTokens() : [];
    const orbitRadii = [8, 11, 14, 17, 19, 21, 23, 25];

    tokens.forEach((t, idx) => {
      const rad = orbitRadii[idx % orbitRadii.length];
      const satGroup = new THREE.Group();

      const sphereGeo = new THREE.SphereGeometry(0.75, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(t.color),
        emissive: new THREE.Color(t.color),
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.8
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      satGroup.add(sphereMesh);

      // Mini equatorial ring
      const ringGeo = new THREE.RingGeometry(1.0, 1.15, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(t.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      satGroup.add(ringMesh);

      // Hitbox
      const hitGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = {
        type: "token",
        symbol: t.symbol,
        name: t.name,
        price: t.price,
        color: t.color,
        sphereMesh
      };
      satGroup.add(hitMesh);
      this.interactiveObjects.push(hitMesh);

      this.tokenSatellites.push({
        token: t,
        group: satGroup,
        radius: rad,
        speed: (0.15 + (idx % 4) * 0.05) * (idx % 2 === 0 ? 1 : -1),
        phase: (idx / tokens.length) * Math.PI * 2,
        heightOffset: Math.sin(idx) * 2 + 5.5,
        hitMesh
      });

      this.scene.add(satGroup);
    });
  }

  setupClmmVoxelDepth() {
    this.clmmVoxelGroup = new THREE.Group();
    this.clmmVoxelGroup.position.set(0, 0.1, 0);

    const numVoxels = 30;
    const radius = 16;

    for (let i = 0; i < numVoxels; i++) {
      const angle = (i / numVoxels) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const barGeo = new THREE.BoxGeometry(0.8, 1, 0.8);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0x14F195,
        emissive: 0x14F195,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.8
      });
      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(x, 0.5, z);
      barMesh.rotation.y = -angle;

      this.clmmVoxelGroup.add(barMesh);
      this.voxelBars.push({ mesh: barMesh, angle, baseHeight: 1 + Math.sin(i * 0.8) * 3 });
    }

    this.scene.add(this.clmmVoxelGroup);
  }

  setupDataConduits() {
    // Flowing Spline Curves between Vaults and Central Core
    this.conduitCurves = [];
    const clmm = window.clmmManager;
    if (!clmm) return;

    const radius = 24;
    clmm.vaults.forEach((v, i) => {
      const angle = (i / clmm.vaults.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const p0 = new THREE.Vector3(x, 4, z);
      const p1 = new THREE.Vector3(x * 0.5, 8, z * 0.5);
      const p2 = new THREE.Vector3(0, 5.5, 0);

      const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      this.conduitCurves.push({ curve, color: v.colorA });

      // Static faint tube
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(v.colorA),
        transparent: true,
        opacity: 0.25
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(tubeMesh);
    });

    // Particle pulses along curves
    const pulseCount = 36;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pulseCount * 3);
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 1.2,
      transparent: true,
      opacity: 0.9
    });
    this.pulseParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.pulseParticles);
  }

  // Trigger 3D Laser Beam between tokens during DEX Swap!
  fireSwapLaser(fromSymbol, toSymbol) {
    const fromSat = this.tokenSatellites.find((s) => s.token.symbol === fromSymbol);
    const toSat = this.tokenSatellites.find((s) => s.token.symbol === toSymbol);

    const startPos = fromSat ? fromSat.group.position.clone() : new THREE.Vector3(10, 6, 10);
    const endPos = toSat ? toSat.group.position.clone() : new THREE.Vector3(-10, 6, -10);
    const corePos = new THREE.Vector3(0, 5.5, 0);

    // Create 2 laser beams: Start -> Core -> End
    const createBeam = (p1, p2, col) => {
      const dist = p1.distanceTo(p2);
      const cylGeo = new THREE.CylinderGeometry(0.18, 0.18, dist, 8);
      const cylMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 1.0
      });
      const beam = new THREE.Mesh(cylGeo, cylMat);

      // Position halfway and orient
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      beam.position.copy(mid);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());

      this.scene.add(beam);
      return { mesh: beam, life: 1.0 };
    };

    this.laserBeams.push(createBeam(startPos, corePos, 0x9945FF));
    this.laserBeams.push(createBeam(corePos, endPos, 0x14F195));

    // Flash central light
    if (this.coreLight) {
      this.coreLight.intensity = 8.0;
      setTimeout(() => {
        if (this.coreLight) this.coreLight.intensity = 3.5;
      }, 400);
    }
  }

  // Focus Camera onto a Vault or Central Core smoothly
  focusOnVault(vaultId) {
    const vm = this.vaultMeshes.find((v) => v.vault.id === vaultId);
    if (!vm) return;

    const pos = vm.group.position;
    const targetCam = new THREE.Vector3(pos.x * 1.3, pos.y + 12, pos.z * 1.3);

    this.cameraMode = "orbit";
    this.targetLookAt.copy(new THREE.Vector3(pos.x, 8, pos.z));
    
    // Smoothly lerp orbit angles
    const dx = targetCam.x - pos.x;
    const dz = targetCam.z - pos.z;
    this.orbitAngles.theta = Math.atan2(dx, dz);
    this.orbitAngles.radius = 28;
    this.updateOrbitCamera();
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    const webglContainer = document.getElementById("webgl-container");

    if (mode === "fps") {
      webglContainer.classList.add("fps-active");
    } else {
      webglContainer.classList.remove("fps-active");
    }

    if (mode === "clmm") {
      this.orbitAngles.radius = 22;
      this.orbitAngles.phi = Math.PI / 4;
      this.targetLookAt.set(0, 2, 0);
      this.updateOrbitCamera();
    } else if (mode === "orbit") {
      this.targetLookAt.set(0, 5, 0);
      this.orbitAngles.radius = 45;
      this.updateOrbitCamera();
    }
  }

  updateOrbitCamera() {
    const r = this.orbitAngles.radius;
    const t = this.orbitAngles.theta;
    const p = this.orbitAngles.phi;

    const x = this.targetLookAt.x + r * Math.sin(p) * Math.sin(t);
    const y = this.targetLookAt.y + r * Math.cos(p);
    const z = this.targetLookAt.z + r * Math.sin(p) * Math.cos(t);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.targetLookAt);
  }

  setupEvents() {
    window.addEventListener("resize", () => this.onResize());

    // Mouse Navigation for Orbit & FPS
    window.addEventListener("mousedown", (e) => {
      if (e.target.closest(".interactive-ui") || e.target.closest(".modal-backdrop.open")) return;
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      // Raycasting coords
      this.mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!this.isDragging) return;

      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.prevMouse = { x: e.clientX, y: e.clientY };

      if (this.cameraMode === "orbit" || this.cameraMode === "clmm") {
        this.orbitAngles.theta -= dx * 0.006;
        this.orbitAngles.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, this.orbitAngles.phi - dy * 0.006));
        this.updateOrbitCamera();
      } else if (this.cameraMode === "fps") {
        this.fpsYaw -= dx * 0.004;
        this.fpsPitch = Math.max(-1.4, Math.min(1.4, this.fpsPitch - dy * 0.004));
      }
    });

    window.addEventListener("wheel", (e) => {
      if (this.cameraMode === "orbit" || this.cameraMode === "clmm") {
        this.orbitAngles.radius = Math.max(12, Math.min(90, this.orbitAngles.radius + e.deltaY * 0.04));
        this.updateOrbitCamera();
      }
    }, { passive: true });

    // Keyboard WASD Controls for FPS / Drone mode
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // 3D Object Click Handler
    window.addEventListener("click", (e) => {
      if (e.target.closest(".interactive-ui") || e.target.closest(".modal-backdrop.open")) return;
      if (this.hoveredObject) {
        const u = this.hoveredObject.userData;
        if (u.type === "vault") {
          if (window.cyberAudio) window.cyberAudio.playClick();
          if (window.clmmManager) window.clmmManager.selectVault(u.vaultId);
          const modal = document.getElementById("vault-modal");
          if (modal) modal.classList.add("open");
        } else if (u.type === "token") {
          if (window.cyberAudio) window.cyberAudio.playClick();
          // Select token in swap input
          if (window.app) window.app.selectSwapToken(u.symbol);
        }
      }
    });
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateFPSControls(dt) {
    const moveSpeed = 16 * dt;
    const forward = new THREE.Vector3(Math.sin(this.fpsYaw), 0, Math.cos(this.fpsYaw)).negate();
    const right = new THREE.Vector3(Math.cos(this.fpsYaw), 0, -Math.sin(this.fpsYaw));

    if (this.keys["w"] || this.keys["arrowup"]) this.fpsPos.addScaledVector(forward, moveSpeed);
    if (this.keys["s"] || this.keys["arrowdown"]) this.fpsPos.addScaledVector(forward, -moveSpeed);
    if (this.keys["a"] || this.keys["arrowleft"]) this.fpsPos.addScaledVector(right, -moveSpeed);
    if (this.keys["d"] || this.keys["arrowright"]) this.fpsPos.addScaledVector(right, moveSpeed);
    if (this.keys[" "]) this.fpsPos.y += moveSpeed;
    if (this.keys["shift"]) this.fpsPos.y = Math.max(1.5, this.fpsPos.y - moveSpeed);

    this.camera.position.copy(this.fpsPos);

    const lookTarget = this.fpsPos.clone().add(new THREE.Vector3(
      Math.sin(this.fpsYaw) * Math.cos(this.fpsPitch),
      Math.sin(this.fpsPitch),
      Math.cos(this.fpsYaw) * Math.cos(this.fpsPitch)
    ));
    this.camera.lookAt(lookTarget);
  }

  updateTourMode(dt) {
    this.tourProgress += dt * 0.12;
    if (this.tourProgress >= 1) {
      this.tourProgress = 0;
      this.tourIndex = (this.tourIndex + 1) % this.tourPoints.length;
    }

    const currentPt = this.tourPoints[this.tourIndex];
    const nextPt = this.tourPoints[(this.tourIndex + 1) % this.tourPoints.length];

    // Smooth spline interpolation
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const alpha = ease(this.tourProgress);

    this.camera.position.lerpVectors(currentPt.pos, nextPt.pos, alpha);
    this.targetLookAt.lerpVectors(currentPt.look, nextPt.look, alpha);
    this.camera.lookAt(this.targetLookAt);
  }

  checkRaycasting() {
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    const tooltip = document.getElementById("scene-tooltip");

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (this.hoveredObject !== hit) {
        this.hoveredObject = hit;
        if (window.cyberAudio) window.cyberAudio.playHoverNode();
      }

      const u = hit.userData;
      if (tooltip) {
        tooltip.style.display = "block";
        const screenPos = hit.position.clone();
        hit.getWorldPosition(screenPos);
        screenPos.project(this.camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;

        if (u.type === "vault") {
          tooltip.querySelector(".tooltip-title").textContent = u.vaultName;
          tooltip.querySelector(".tooltip-desc").textContent = `Fee: ${u.feeTier} · APR: ${u.apr} · Click to Open Vault`;
        } else if (u.type === "token") {
          tooltip.querySelector(".tooltip-title").textContent = `${u.name} ($${u.symbol})`;
          tooltip.querySelector(".tooltip-desc").textContent = `Price: $${u.price} · Click to Swap`;
        }
      }
    } else {
      this.hoveredObject = null;
      if (tooltip) tooltip.style.display = "none";
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = this.clock.getDelta();
    this.time += dt;

    // 1. Camera navigation
    if (this.cameraMode === "fps") {
      this.updateFPSControls(dt);
    } else if (this.cameraMode === "tour") {
      this.updateTourMode(dt);
    }

    // 2. Fusion Core Animation
    if (this.fusionGroup) {
      this.coreMesh.rotation.x += dt * 0.6;
      this.coreMesh.rotation.y += dt * 0.8;
      this.innerCrystal.rotation.y -= dt * 1.2;

      this.gyroRings.forEach((ring, i) => {
        ring.rotation.x += dt * (0.4 + i * 0.2);
        ring.rotation.y += dt * (0.3 + i * 0.3);
      });
    }

    // 3. Vault Monoliths floating & crystal spin
    this.vaultMeshes.forEach((vm) => {
      const floatY = Math.sin(this.time * 1.8 + vm.floatPhase) * 0.5;
      vm.crystalMesh.position.y = 11.8 + floatY;
      vm.crystalMesh.rotation.y += dt * 1.2;
      vm.crystalMesh.rotation.z += dt * 0.6;
      vm.haloMesh.rotation.z += dt * 0.8;
    });

    // 4. Orbiting Token Satellites
    this.tokenSatellites.forEach((sat) => {
      sat.phase += dt * sat.speed;
      const x = Math.cos(sat.phase) * sat.radius;
      const z = Math.sin(sat.phase) * sat.radius;
      const y = sat.heightOffset + Math.sin(this.time * 2 + sat.radius) * 0.6;

      sat.group.position.set(x, y, z);
      sat.group.rotation.y += dt * 1.5;
    });

    // 5. CLMM Voxel Bars animated pulse
    this.voxelBars.forEach((vb, idx) => {
      const scaleH = vb.baseHeight + Math.sin(this.time * 2.5 + vb.angle * 2) * 1.2;
      vb.mesh.scale.y = Math.max(0.2, scaleH);
      vb.mesh.position.y = vb.mesh.scale.y * 0.5;
    });

    // 6. Data Stream Pulses
    if (this.pulseParticles && this.conduitCurves) {
      const posAttr = this.pulseParticles.geometry.attributes.position;
      const arr = posAttr.array;
      const numCurves = this.conduitCurves.length;

      for (let i = 0; i < arr.length / 3; i++) {
        const cIdx = i % numCurves;
        const curve = this.conduitCurves[cIdx].curve;
        const t = ((this.time * 0.4 + (i / arr.length)) % 1.0);
        const p = curve.getPoint(t);

        arr[i * 3] = p.x;
        arr[i * 3 + 1] = p.y;
        arr[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;
    }

    // 7. Laser Beams decay
    for (let i = this.laserBeams.length - 1; i >= 0; i--) {
      const b = this.laserBeams[i];
      b.life -= dt * 2.5;
      b.mesh.material.opacity = Math.max(0, b.life);
      if (b.life <= 0) {
        this.scene.remove(b.mesh);
        this.laserBeams.splice(i, 1);
      }
    }

    // 8. Starfield rotation
    if (this.starfield) {
      this.starfield.rotation.y = this.time * 0.02;
    }

    // 9. Raycasting
    this.checkRaycasting();

    // 10. Render
    this.renderer.render(this.scene, this.camera);
  }
}

window.cyberWorld = new CyberDexWorld();
