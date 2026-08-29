// Neal's Deals On Wheels - 3D Interactive Town Center Engine
// Built with Three.js (r128)

class TownCenter3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animFrameId = null;
    
    // Interactive Objects & State
    this.buildings = [];
    this.pins = [];
    this.interactiveMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredObject = null;
    
    // Courier State
    this.courier = null;
    this.courierTarget = null;
    this.courierSpeed = 0.55;
    this.courierAngle = 0;
    this.courierWheels = [];
    this.courierWaypoints = [];
    this.currentWaypointIndex = 0;
    this.isDelivering = false;
    this.activeRoute = null;

    // Mini-Game Mode State
    this.gameMode = false;
    this.gameScore = 0;
    this.gameTimeLeft = 60;
    this.gameInterval = null;
    this.keys = { forward: false, backward: false, left: false, right: false };
    this.pickupItems = [];
    this.dropZones = [];

    // Camera Modes
    this.cameraMode = 'orbit'; // 'orbit', 'courier', 'penthouse', 'plaza'
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.targetCameraPos = new THREE.Vector3(0, 48, 68);
    this.orbitRadius = 82;
    this.orbitTheta = 0.8;
    this.orbitPhi = 1.1;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    
    // Environment & Theme
    this.currentTheme = 'night'; // 'day', 'sunset', 'night'
    this.isRaining = false;
    this.rainParticles = null;
    this.fountainParticles = null;
    this.radarRing = null;
    this.sweepBeam = null;
    this.lights = {};

    // Temp Marker
    this.tempMarker = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 550;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070c18);
    this.scene.fog = new THREE.FogExp2(0x070c18, 0.007);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800);
    this.camera.position.set(0, 52, 75);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Build Environment
    this.setupLighting();
    this.buildTerrainAndRoads();
    this.buildFountain();
    this.build1MileRadiusZone();
    this.buildTownCenterBuildings();
    this.buildStreetDetails();
    this.buildCourier();
    this.setupCourierWaypoints();
    this.setupRainSystem();

    // 5. Event Listeners
    this.setupEventListeners();

    // 6. Start Loop
    this.clock = new THREE.Clock();
    this.animate();

    // Initial theme setup
    this.setTheme('night');
  }

  setupLighting() {
    // Ambient
    this.lights.ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(this.lights.ambient);

    // Directional (Moon/Sun)
    this.lights.dir = new THREE.DirectionalLight(0x60a5fa, 1.5);
    this.lights.dir.position.set(40, 80, 50);
    this.lights.dir.castShadow = true;
    this.lights.dir.shadow.mapSize.width = 2048;
    this.lights.dir.shadow.mapSize.height = 2048;
    this.lights.dir.shadow.camera.near = 10;
    this.lights.dir.shadow.camera.far = 250;
    const d = 75;
    this.lights.dir.shadow.camera.left = -d;
    this.lights.dir.shadow.camera.right = d;
    this.lights.dir.shadow.camera.top = d;
    this.lights.dir.shadow.camera.bottom = -d;
    this.lights.dir.shadow.bias = -0.0005;
    this.scene.add(this.lights.dir);

    // Plaza Central Accent Light (Cyan Glow)
    this.lights.plaza = new THREE.PointLight(0x00f0ff, 2.5, 50, 1.2);
    this.lights.plaza.position.set(0, 5, 0);
    this.scene.add(this.lights.plaza);

    // Westin Skyscraper Rooftop Beacon Light
    this.lights.westinBeacon = new THREE.PointLight(0x38bdf8, 3, 60, 1.5);
    this.lights.westinBeacon.position.set(18, 42, -14);
    this.scene.add(this.lights.westinBeacon);

    // Hemisphere Light
    this.lights.hemi = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.8);
    this.scene.add(this.lights.hemi);
  }

  buildTerrainAndRoads() {
    const terrainGroup = new THREE.Group();

    // Base ground / grass & plaza foundation
    const groundGeo = new THREE.PlaneGeometry(240, 240, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0d1424,
      roughness: 0.85,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'ground';
    terrainGroup.add(ground);

    // Central Plaza Courtyard Disc
    const plazaDiscGeo = new THREE.CircleGeometry(22, 48);
    const plazaDiscMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.3
    });
    const plazaDisc = new THREE.Mesh(plazaDiscGeo, plazaDiscMat);
    plazaDisc.rotation.x = -Math.PI / 2;
    plazaDisc.position.y = 0.03;
    plazaDisc.receiveShadow = true;
    terrainGroup.add(plazaDisc);

    // Decorative Plaza Paver Rings
    const paverRingGeo = new THREE.RingGeometry(16, 17.5, 48);
    const paverRingMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const paverRing = new THREE.Mesh(paverRingGeo, paverRingMat);
    paverRing.rotation.x = -Math.PI / 2;
    paverRing.position.y = 0.04;
    terrainGroup.add(paverRing);

    // Town Center Grid Roads
    // Main St, Commerce St, Columbus St, Central Park Ave, Market St
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const crosswalkMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });

    const roads = [
      // East-West Roads
      { x: 0, z: 0, w: 180, d: 7, dir: 'x' }, // Central Park Ave
      { x: 0, z: -28, w: 180, d: 8, dir: 'x' }, // Virginia Beach Blvd
      { x: 0, z: 28, w: 180, d: 7, dir: 'x' }, // Market St
      // North-South Roads
      { x: 0, z: 0, w: 7, d: 180, dir: 'z' }, // Main Promenade
      { x: -35, z: 0, w: 7, d: 180, dir: 'z' }, // Columbus St
      { x: 35, z: 0, w: 7, d: 180, dir: 'z' }  // Commerce St
    ];

    roads.forEach(r => {
      const roadGeo = new THREE.PlaneGeometry(r.w, r.d);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.position.set(r.x, 0.05, r.z);
      roadMesh.receiveShadow = true;
      terrainGroup.add(roadMesh);

      // Yellow Center Dash Lines
      if (r.dir === 'x') {
        for (let lx = -75; lx <= 75; lx += 8) {
          const dashGeo = new THREE.PlaneGeometry(4, 0.35);
          const dash = new THREE.Mesh(dashGeo, lineMat);
          dash.rotation.x = -Math.PI / 2;
          dash.position.set(lx, 0.06, r.z);
          terrainGroup.add(dash);
        }
      } else {
        for (let lz = -75; lz <= 75; lz += 8) {
          const dashGeo = new THREE.PlaneGeometry(0.35, 4);
          const dash = new THREE.Mesh(dashGeo, lineMat);
          dash.rotation.x = -Math.PI / 2;
          dash.position.set(r.x, 0.06, lz);
          terrainGroup.add(dash);
        }
      }

      // Pedestrian Crosswalk stripes near intersections
      [-35, 0, 35].forEach(ix => {
        [-28, 0, 28].forEach(iz => {
          if (r.dir === 'x' && Math.abs(ix) > 0) {
            for (let c = -2.5; c <= 2.5; c += 1) {
              const cw = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.4), crosswalkMat);
              cw.rotation.x = -Math.PI / 2;
              cw.position.set(ix + (ix > 0 ? -5 : 5), 0.07, iz + c);
              terrainGroup.add(cw);
            }
          }
        });
      });
    });

    this.scene.add(terrainGroup);
  }

  buildFountain() {
    const fountainGroup = new THREE.Group();

    // Basin
    const basinGeo = new THREE.CylinderGeometry(5.5, 6, 1.2, 32);
    const basinMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.5 });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.set(0, 0.6, 0);
    basin.castShadow = true;
    basin.receiveShadow = true;
    fountainGroup.add(basin);

    // Water Surface
    const waterGeo = new THREE.CircleGeometry(5.2, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 1.15, 0);
    fountainGroup.add(water);

    // Center Spire
    const spireGeo = new THREE.CylinderGeometry(0.6, 1.2, 3, 16);
    const spireMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, 2, 0);
    spire.castShadow = true;
    fountainGroup.add(spire);

    // Fountain Water Spray Particles
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      pPositions[i * 3 + 1] = 2 + Math.random() * 4;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      pVelocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: 0.08 + Math.random() * 0.08,
        z: (Math.random() - 0.5) * 0.05,
        initY: 2
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.fountainParticles = new THREE.Points(pGeo, pMat);
    this.fountainParticleVels = pVelocities;
    fountainGroup.add(this.fountainParticles);

    this.scene.add(fountainGroup);
  }

  build1MileRadiusZone() {
    const radiusGroup = new THREE.Group();
    const radiusSize = 78; // 1-Mile perimeter in 3D scene scale

    // 1. Glowing Ground Perimeter Ring
    const ringGeo = new THREE.RingGeometry(radiusSize - 0.7, radiusSize + 0.7, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.radarRing = new THREE.Mesh(ringGeo, ringMat);
    this.radarRing.rotation.x = -Math.PI / 2;
    this.radarRing.position.y = 0.12;
    radiusGroup.add(this.radarRing);

    // Outer faint pulse ring
    const outerRingGeo = new THREE.RingGeometry(radiusSize + 2, radiusSize + 2.5, 96);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.11;
    radiusGroup.add(outerRing);

    // Inner 0.5-Mile Reference Ring
    const halfRingGeo = new THREE.RingGeometry(39 - 0.4, 39 + 0.4, 64);
    const halfRingMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const halfRing = new THREE.Mesh(halfRingGeo, halfRingMat);
    halfRing.rotation.x = -Math.PI / 2;
    halfRing.position.y = 0.1;
    radiusGroup.add(halfRing);

    // 2. Holographic Translucent Cylinder Boundary Dome
    const domeGeo = new THREE.CylinderGeometry(radiusSize, radiusSize, 12, 64, 1, true);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 6;
    radiusGroup.add(dome);

    // 3. Rotating 360-degree Radar Scanning Beam
    const beamGeo = new THREE.PlaneGeometry(radiusSize, 2);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.sweepBeam = new THREE.Mesh(beamGeo, beamMat);
    this.sweepBeam.rotation.x = -Math.PI / 2;
    this.sweepBeam.position.set(radiusSize / 2, 0.15, 0);
    this.sweepBeamPivot = new THREE.Group();
    this.sweepBeamPivot.add(this.sweepBeam);
    radiusGroup.add(this.sweepBeamPivot);

    this.scene.add(radiusGroup);
  }

  buildTownCenterBuildings() {
    const data = window.TOWN_CENTER_DATA;
    if (!data) return;

    // Combine Residences, Venues, and Landmarks
    const allLocations = [
      ...data.residences.map(r => ({ ...r, locType: 'residence' })),
      ...data.venues.map(v => ({ ...v, locType: 'venue' })),
      ...data.landmarks.filter(l => l.id !== 'lm-fountain').map(l => ({ ...l, locType: 'landmark' }))
    ];

    allLocations.forEach(loc => {
      const c = loc.coord;
      const bGroup = new THREE.Group();
      bGroup.position.set(c.x, 0, c.z);

      // Main Building Mesh
      const bGeo = new THREE.BoxGeometry(c.width, c.height, c.depth);
      
      // Building Materials
      let bColor = c.color;
      let emissive = 0x051020;
      let roughness = 0.3;
      let metalness = 0.7;

      if (loc.id === 'res-westin') {
        // Skyscraper Glass Look
        bColor = 0x38bdf8;
        roughness = 0.1;
        metalness = 0.9;
        emissive = 0x0c4a6e;
      } else if (loc.id === 'res-armada') {
        bColor = 0x60a5fa;
        roughness = 0.2;
        metalness = 0.8;
      } else if (loc.locType === 'venue') {
        roughness = 0.5;
        metalness = 0.4;
      }

      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        roughness: roughness,
        metalness: metalness,
        emissive: emissive,
        emissiveIntensity: 0.35
      });

      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.y = c.height / 2;
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      bMesh.userData = { locationData: loc, baseColor: bColor, isBuilding: true };
      bGroup.add(bMesh);
      this.interactiveMeshes.push(bMesh);
      this.buildings.push(bMesh);

      // Rooftop Details & Spire for Skyscraper
      if (loc.id === 'res-westin') {
        // Penthouse crown
        const crownGeo = new THREE.BoxGeometry(c.width * 0.75, 4, c.depth * 0.75);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = c.height + 2;
        bGroup.add(crown);

        // Roof Spire
        const spireGeo = new THREE.ConeGeometry(1, 8, 8);
        const spireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.position.y = c.height + 8;
        bGroup.add(spire);
      }

      // Armada Hoffler Roof Tier
      if (loc.id === 'res-armada') {
        const topGeo = new THREE.BoxGeometry(c.width * 0.6, 5, c.depth * 0.6);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.8 });
        const topTier = new THREE.Mesh(topGeo, topMat);
        topTier.position.y = c.height + 2.5;
        bGroup.add(topTier);
      }

      // Window Grid Glow Lines (Texture illusion using edge lines)
      const edgeGeo = new THREE.EdgesGeometry(bGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: loc.locType === 'venue' ? 0xfacc15 : 0x00f0ff,
        transparent: true,
        opacity: 0.6
      });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLine.position.y = c.height / 2;
      bGroup.add(edgeLine);

      // Floating 3D POI Pin
      const pin = this.createPOIPin(loc, c.height);
      bGroup.add(pin);
      this.pins.push(pin);

      this.scene.add(bGroup);
    });

    // Add generic surrounding cityscape fill buildings around outer grid
    this.buildSurroundingFillBuildings();
  }

  createPOIPin(loc, buildingHeight) {
    const pinGroup = new THREE.Group();
    pinGroup.position.set(0, buildingHeight + 3, 0);
    pinGroup.userData = { locationData: loc, baseHeight: buildingHeight + 3 };

    // Floating Diamond Marker
    const diamondGeo = new THREE.OctahedronGeometry(1.4, 0);
    let pinColor = 0x10b981; // Green
    if (loc.locType === 'venue') pinColor = 0xf59e0b; // Amber
    if (loc.locType === 'residence') pinColor = 0x38bdf8; // Sky Blue
    if (loc.locType === 'landmark') pinColor = 0xa855f7; // Purple

    const diamondMat = new THREE.MeshStandardMaterial({
      color: pinColor,
      emissive: pinColor,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.castShadow = true;
    diamond.userData = { isPin: true, locationData: loc };
    pinGroup.add(diamond);
    this.interactiveMeshes.push(diamond);

    // Glowing Pulse Ring beneath pin
    const pRingGeo = new THREE.RingGeometry(0.8, 1.4, 24);
    const pRingMat = new THREE.MeshBasicMaterial({
      color: pinColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const pRing = new THREE.Mesh(pRingGeo, pRingMat);
    pRing.rotation.x = -Math.PI / 2;
    pRing.position.y = -1.6;
    pinGroup.add(pRing);

    return pinGroup;
  }

  buildSurroundingFillBuildings() {
    const fillCoords = [
      { x: -55, z: -50, w: 18, h: 14, d: 18 },
      { x: -55, z: 50, w: 16, h: 12, d: 16 },
      { x: 55, z: -50, w: 20, h: 16, d: 20 },
      { x: 55, z: 50, w: 18, h: 15, d: 18 },
      { x: -60, z: -10, w: 14, h: 12, d: 22 },
      { x: 60, z: 10, w: 15, h: 11, d: 20 },
      { x: -10, z: -55, w: 24, h: 10, d: 14 },
      { x: 10, z: 55, w: 22, h: 12, d: 15 }
    ];

    fillCoords.forEach(fc => {
      const geo = new THREE.BoxGeometry(fc.w, fc.h, fc.d);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(fc.x, fc.h / 2, fc.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  buildStreetDetails() {
    const detailsGroup = new THREE.Group();

    // Trees in Town Center Plaza & Sidewalks
    const treePositions = [
      { x: -12, z: -12 }, { x: 12, z: -12 }, { x: -12, z: 12 }, { x: 12, z: 12 },
      { x: -22, z: 0 }, { x: 22, z: 0 }, { x: 0, z: -22 }, { x: 0, z: 22 },
      { x: -45, z: -15 }, { x: 45, z: -15 }, { x: -45, z: 15 }, { x: 45, z: 15 }
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 });

    treePositions.forEach(tp => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2, 8), trunkMat);
      trunk.position.set(tp.x, 1, tp.z);
      trunk.castShadow = true;
      detailsGroup.add(trunk);

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.5, 8), foliageMat);
      foliage.position.set(tp.x, 3.2, tp.z);
      foliage.castShadow = true;
      detailsGroup.add(foliage);
    });

    // Streetlamps with glowing light heads
    const lampPositions = [
      { x: -5, z: -15 }, { x: 5, z: -15 }, { x: -5, z: 15 }, { x: 5, z: 15 },
      { x: -20, z: -5 }, { x: -20, z: 5 }, { x: 20, z: -5 }, { x: 20, z: 5 }
    ];

    lampPositions.forEach(lp => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      pole.position.set(lp.x, 2.25, lp.z);
      detailsGroup.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      bulb.position.set(lp.x, 4.4, lp.z);
      detailsGroup.add(bulb);
    });

    this.scene.add(detailsGroup);
  }

  buildCourier() {
    this.courier = new THREE.Group();
    this.courier.position.set(0, 0.1, 14);

    // E-Bike / Cargo Scooter Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8, roughness: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const neonGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // Main Chassis Bar
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 2.2), frameMat);
    chassis.position.y = 0.7;
    chassis.castShadow = true;
    this.courier.add(chassis);

    // Steering Column & Handlebars
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), chromeMat);
    column.position.set(0, 1.2, 0.9);
    column.rotation.x = -0.15;
    this.courier.add(column);

    const handlebars = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.1), chromeMat);
    handlebars.position.set(0, 1.85, 0.8);
    this.courier.add(handlebars);

    // Neal's Insulated Thermal Delivery Box (Rear)
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      emissive: 0x065f46,
      emissiveIntensity: 0.4,
      roughness: 0.4
    });
    const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), boxMat);
    cargoBox.position.set(0, 1.3, -0.6);
    cargoBox.castShadow = true;
    this.courier.add(cargoBox);

    // Box Neon Stripe (Neal's Branding)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.2, 1.15), neonGlowMat);
    stripe.position.set(0, 1.4, -0.6);
    this.courier.add(stripe);

    // Wheels (Front & Back)
    const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.2, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });

    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.position.set(0, 0.55, 1.1);
    frontWheel.castShadow = true;
    this.courier.add(frontWheel);
    this.courierWheels.push(frontWheel);

    const rearWheel = new THREE.Mesh(wheelGeo, wheelMat);
    rearWheel.position.set(0, 0.55, -0.9);
    rearWheel.castShadow = true;
    this.courier.add(rearWheel);
    this.courierWheels.push(rearWheel);

    // Glowing Rims on Wheels
    [1.1, -0.9].forEach(zPos => {
      const rimGeo = new THREE.RingGeometry(0.3, 0.4, 16);
      const rimMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.y = Math.PI / 2;
      rim.position.set(0.12, 0.55, zPos);
      this.courier.add(rim);
    });

    // Headlight Beam
    const headlight = new THREE.SpotLight(0xffffff, 4, 30, Math.PI / 5, 0.4, 1);
    headlight.position.set(0, 1.3, 1.1);
    headlight.target.position.set(0, 0, 15);
    this.courier.add(headlight);
    this.courier.add(headlight.target);

    // Courier Rider (Stylized Low-Poly Avatar)
    const riderGroup = new THREE.Group();
    // Body / Torso with High-Vis Vest
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), torsoMat);
    torso.position.set(0, 1.8, 0.1);
    torso.rotation.x = 0.2;
    riderGroup.add(torso);

    // Helmet Head
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), helmetMat);
    head.position.set(0, 2.35, 0.25);
    riderGroup.add(head);

    // Helmet Visor (Cyan)
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.2), neonGlowMat);
    visor.position.set(0, 2.35, 0.4);
    riderGroup.add(visor);

    this.courier.add(riderGroup);

    // Ground Underglow Light
    const underglow = new THREE.PointLight(0x00f0ff, 2, 8, 1.5);
    underglow.position.set(0, 0.4, 0);
    this.courier.add(underglow);

    this.scene.add(this.courier);
  }

  setupCourierWaypoints() {
    // Dynamic circuit around Town Center plaza & roads
    this.courierWaypoints = [
      { x: 0, z: 14, speed: 0.55 },
      { x: 0, z: 28, speed: 0.65 },
      { x: 26, z: 28, speed: 0.60 },
      { x: 35, z: 20, speed: 0.50 },
      { x: 35, z: -10, speed: 0.65 }, // Near PF Changs
      { x: 35, z: -28, speed: 0.60 },
      { x: 18, z: -28, speed: 0.55 }, // Near Westin
      { x: 0, z: -28, speed: 0.65 },
      { x: -14, z: -28, speed: 0.50 }, // Near Cheesecake
      { x: -35, z: -28, speed: 0.60 },
      { x: -35, z: 0, speed: 0.65 },
      { x: -35, z: 28, speed: 0.55 },
      { x: -10, z: 28, speed: 0.60 },
      { x: 0, z: 20, speed: 0.50 },
      { x: 0, z: 0, speed: 0.35 } // Central Plaza Stop
    ];
  }

  setupRainSystem() {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = Math.random() * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.4,
      transparent: true,
      opacity: 0.6
    });

    this.rainParticles = new THREE.Points(geo, mat);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  toggleRain() {
    this.isRaining = !this.isRaining;
    if (this.rainParticles) {
      this.rainParticles.visible = this.isRaining;
    }
    return this.isRaining;
  }

  setTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'day') {
      this.scene.background.setHex(0x93c5fd);
      this.scene.fog.color.setHex(0x93c5fd);
      this.scene.fog.density = 0.003;
      this.lights.ambient.color.setHex(0xffffff);
      this.lights.ambient.intensity = 1.6;
      this.lights.dir.color.setHex(0xfffaed);
      this.lights.dir.intensity = 2.0;
      this.lights.hemi.color.setHex(0xbae6fd);
      this.lights.hemi.groundColor.setHex(0x334155);
      if (this.radarRing) this.radarRing.material.opacity = 0.6;
    } else if (theme === 'sunset') {
      this.scene.background.setHex(0x4c1d95);
      this.scene.fog.color.setHex(0x4c1d95);
      this.scene.fog.density = 0.005;
      this.lights.ambient.color.setHex(0xfbcfe8);
      this.lights.ambient.intensity = 1.3;
      this.lights.dir.color.setHex(0xf97316);
      this.lights.dir.intensity = 2.2;
      this.lights.hemi.color.setHex(0xf472b6);
      this.lights.hemi.groundColor.setHex(0x1e1b4b);
      if (this.radarRing) this.radarRing.material.opacity = 0.75;
    } else {
      // Cyber Neon Night
      this.scene.background.setHex(0x070c18);
      this.scene.fog.color.setHex(0x070c18);
      this.scene.fog.density = 0.007;
      this.lights.ambient.color.setHex(0x1e293b);
      this.lights.ambient.intensity = 1.1;
      this.lights.dir.color.setHex(0x60a5fa);
      this.lights.dir.intensity = 1.4;
      this.lights.hemi.color.setHex(0x38bdf8);
      this.lights.hemi.groundColor.setHex(0x020617);
      if (this.radarRing) this.radarRing.material.opacity = 0.9;
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    if (mode === 'orbit') {
      this.targetCameraPos.set(0, 48, 72);
      this.cameraTarget.set(0, 0, 0);
    } else if (mode === 'penthouse') {
      // High-Angle Tactical View
      this.targetCameraPos.set(18, 55, -8);
      this.cameraTarget.set(0, 0, 0);
    } else if (mode === 'plaza') {
      // Pedestrian Fountain View
      this.targetCameraPos.set(0, 3.5, 14);
      this.cameraTarget.set(0, 2, 0);
    } else if (mode === 'game') {
      this.startGameMode();
    }
  }

  focusBuilding(locationId) {
    const data = window.TOWN_CENTER_DATA;
    if (!data) return;

    const all = [...data.residences, ...data.venues, ...data.landmarks];
    const loc = all.find(l => l.id === locationId);
    if (!loc) return;

    const c = loc.coord;
    this.cameraMode = 'custom';
    this.cameraTarget.set(c.x, c.height / 2, c.z);
    this.targetCameraPos.set(c.x + 18, c.height + 14, c.z + 24);

    // Dispatch courier to this location to simulate live pickup/delivery
    this.dispatchCourierToLocation(c.x, c.z);
  }

  dispatchCourierToLocation(x, z) {
    this.isDelivering = true;
    this.courierTarget = new THREE.Vector3(x, 0.1, z);
  }

  setupEventListeners() {
    const dom = this.renderer.domElement;

    // Pointer Move / Hover
    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging && this.cameraMode === 'orbit') {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.orbitTheta -= deltaX * 0.007;
        this.orbitPhi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, this.orbitPhi - deltaY * 0.007));

        this.updateOrbitCameraPosition();
      }

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Pointer Down (Drag Orbit)
    dom.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Pointer Up
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Click / Select
    dom.addEventListener('click', (e) => {
      if (this.gameMode) return;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        let locData = topObj.userData.locationData;
        
        while (!locData && topObj.parent) {
          topObj = topObj.parent;
          locData = topObj.userData ? topObj.userData.locationData : null;
        }

        if (locData) {
          if (window.soundFX) window.soundFX.playClick();
          this.focusBuilding(locData.id);
          if (window.onLocationSelected) {
            window.onLocationSelected(locData);
          }
          return;
        }
      }

      // If clicked on ground, test 1-Mile radius
      const groundIntersects = this.raycaster.intersectObject(this.scene.getObjectByName('ground') || this.scene);
      if (groundIntersects.length > 0) {
        const pt = groundIntersects[0].point;
        this.testPointRadius(pt.x, pt.z);
      }
    });

    // Wheel Zoom
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.cameraMode === 'orbit') {
        this.orbitRadius = Math.max(25, Math.min(140, this.orbitRadius + e.deltaY * 0.05));
        this.updateOrbitCameraPosition();
      }
    }, { passive: false });

    // Keyboard (Mini-Game & Shortcuts)
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (e.code === 'KeyB' && window.soundFX) window.soundFX.playBikeBell();
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    });

    // Resize Handler
    window.addEventListener('resize', () => this.onWindowResize());
  }

  testPointRadius(x, z) {
    const distFromCenter = Math.sqrt(x * x + z * z);
    const maxRadius = 78; // 1 mile
    const distanceMiles = ((distFromCenter / maxRadius) * 1.0).toFixed(2);
    const isInside = distFromCenter <= maxRadius;

    // Drop or update 3D target ring
    if (!this.tempMarker) {
      const mGeo = new THREE.RingGeometry(1.5, 2.2, 32);
      const mMat = new THREE.MeshBasicMaterial({ color: isInside ? 0x10b981 : 0xef4444, side: THREE.DoubleSide });
      this.tempMarker = new THREE.Mesh(mGeo, mMat);
      this.tempMarker.rotation.x = -Math.PI / 2;
      this.scene.add(this.tempMarker);
    }
    this.tempMarker.position.set(x, 0.15, z);
    this.tempMarker.material.color.setHex(isInside ? 0x10b981 : 0xef4444);

    if (window.soundFX) window.soundFX.playRadarPing();

    if (window.onRadiusChecked) {
      window.onRadiusChecked({
        distanceMiles: parseFloat(distanceMiles),
        isInside: isInside,
        estDeliveryMin: isInside ? Math.round(8 + distanceMiles * 10) + ' min' : 'Out of Range',
        coords: { x, z }
      });
    }
  }

  updateOrbitCameraPosition() {
    this.targetCameraPos.x = this.cameraTarget.x + this.orbitRadius * Math.sin(this.orbitPhi) * Math.sin(this.orbitTheta);
    this.targetCameraPos.y = this.cameraTarget.y + this.orbitRadius * Math.cos(this.orbitPhi);
    this.targetCameraPos.z = this.cameraTarget.z + this.orbitRadius * Math.sin(this.orbitPhi) * Math.cos(this.orbitTheta);
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 550;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  startGameMode() {
    this.gameMode = true;
    this.gameScore = 0;
    this.gameTimeLeft = 45;
    this.cameraMode = 'game';
    if (this.courier) {
      this.courier.position.set(0, 0.1, 0);
      this.courierAngle = 0;
    }

    // Spawn pickup burger/box items
    this.spawnGameItems();

    if (window.onGameScoreUpdate) {
      window.onGameScoreUpdate(this.gameScore, this.gameTimeLeft);
    }

    if (this.gameInterval) clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.gameTimeLeft--;
      if (window.onGameScoreUpdate) {
        window.onGameScoreUpdate(this.gameScore, this.gameTimeLeft);
      }
      if (this.gameTimeLeft <= 0) {
        this.endGameMode();
      }
    }, 1000);
  }

  spawnGameItems() {
    // Clear old items
    this.pickupItems.forEach(item => this.scene.remove(item));
    this.pickupItems = [];

    const itemCoords = [
      { x: -14, z: 4, name: 'Cheesecake Drop' },
      { x: 12, z: 6, name: 'Yard House Wings' },
      { x: 26, z: -10, name: 'Chang’s Wok Box' },
      { x: 4, z: -18, name: 'Cold Pressed Juice' },
      { x: -8, z: 24, name: 'Tupelo Biscuits' }
    ];

    itemCoords.forEach(ic => {
      const group = new THREE.Group();
      group.position.set(ic.x, 1.2, ic.z);

      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.6, 1.6),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.8 })
      );
      group.add(cube);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.2, 1.8, 16),
        new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.1;
      group.add(ring);

      group.userData = { isPickup: true, name: ic.name };
      this.pickupItems.push(group);
      this.scene.add(group);
    });
  }

  endGameMode() {
    this.gameMode = false;
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (window.soundFX) window.soundFX.playSuccess();
    if (window.onGameOver) {
      window.onGameOver(this.gameScore);
    }
    this.setCameraMode('orbit');
  }

  updateCourier(delta) {
    if (!this.courier) return;

    if (this.gameMode) {
      // Manual Player Driving Controls
      const turnSpeed = 2.6 * delta;
      const moveSpeed = 18 * delta;

      if (this.keys.left) this.courierAngle += turnSpeed;
      if (this.keys.right) this.courierAngle -= turnSpeed;

      let speed = 0;
      if (this.keys.forward) speed = moveSpeed;
      if (this.keys.backward) speed = -moveSpeed * 0.5;

      this.courier.position.x += Math.sin(this.courierAngle) * speed;
      this.courier.position.z += Math.cos(this.courierAngle) * speed;
      this.courier.rotation.y = this.courierAngle;

      // Spin wheels
      this.courierWheels.forEach(w => w.rotation.x += speed * 3);

      // Check item collisions
      for (let i = this.pickupItems.length - 1; i >= 0; i--) {
        const item = this.pickupItems[i];
        const dist = this.courier.position.distanceTo(item.position);
        if (dist < 3.5) {
          this.scene.remove(item);
          this.pickupItems.splice(i, 1);
          this.gameScore += 100;
          this.gameTimeLeft += 5; // Bonus time
          if (window.soundFX) window.soundFX.playBikeBell();
          if (window.onGameScoreUpdate) window.onGameScoreUpdate(this.gameScore, this.gameTimeLeft);
        }
      }

      if (this.pickupItems.length === 0) {
        this.spawnGameItems();
      }

    } else if (this.isDelivering && this.courierTarget) {
      // Dispatch Delivery Drive
      const dx = this.courierTarget.x - this.courier.position.x;
      const dz = this.courierTarget.z - this.courier.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 1.0) {
        const targetAngle = Math.atan2(dx, dz);
        this.courierAngle = targetAngle;
        this.courier.rotation.y = targetAngle;

        const moveStep = this.courierSpeed * 1.5;
        this.courier.position.x += Math.sin(targetAngle) * moveStep;
        this.courier.position.z += Math.cos(targetAngle) * moveStep;

        this.courierWheels.forEach(w => w.rotation.x += moveStep * 2.5);
      } else {
        // Arrived at target!
        this.isDelivering = false;
        this.courierTarget = null;
        if (window.soundFX) window.soundFX.playBikeBell();
      }

    } else {
      // Autonomous Circuit Waypoints
      if (this.courierWaypoints.length > 0) {
        const wp = this.courierWaypoints[this.currentWaypointIndex];
        const dx = wp.x - this.courier.position.x;
        const dz = wp.z - this.courier.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 2.0) {
          this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.courierWaypoints.length;
        } else {
          const targetAngle = Math.atan2(dx, dz);
          // Smooth rotation
          this.courier.rotation.y = targetAngle;
          this.courierAngle = targetAngle;

          const step = wp.speed || this.courierSpeed;
          this.courier.position.x += Math.sin(targetAngle) * step;
          this.courier.position.z += Math.cos(targetAngle) * step;

          this.courierWheels.forEach(w => w.rotation.x += step * 2.5);
        }
      }
    }
  }

  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Courier
    this.updateCourier(delta);

    // 2. Rotate Radar Scanner & Pulse
    if (this.sweepBeamPivot) {
      this.sweepBeamPivot.rotation.y += 0.025;
    }
    if (this.radarRing) {
      const scale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.015;
      this.radarRing.scale.set(scale, scale, 1);
    }

    // 3. Animate POI Pins (Gentle Hover & Rotate)
    this.pins.forEach((pinGroup, index) => {
      const baseH = pinGroup.userData.baseHeight || 15;
      pinGroup.position.y = baseH + Math.sin(elapsedTime * 3 + index) * 0.5;
      pinGroup.rotation.y += 0.015;
    });

    // 4. Animate Fountain Particles
    if (this.fountainParticles && this.fountainParticleVels) {
      const pos = this.fountainParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.fountainParticleVels.length; i++) {
        const vel = this.fountainParticleVels[i];
        pos[i * 3 + 1] += vel.y;
        pos[i * 3] += vel.x;
        pos[i * 3 + 2] += vel.z;

        if (pos[i * 3 + 1] > 6.5) {
          pos[i * 3 + 1] = vel.initY;
          pos[i * 3] = (Math.random() - 0.5) * 1.5;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
      }
      this.fountainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Animate Rain if Active
    if (this.isRaining && this.rainParticles) {
      const rPos = this.rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < rPos.length; i += 3) {
        rPos[i] -= 2.5;
        if (rPos[i] < 0) rPos[i] = 80;
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Camera Position & LookAt Lerp
    if (this.cameraMode === 'courier' || this.cameraMode === 'game') {
      if (this.courier) {
        // Follow Cam behind Courier
        const backDist = 14;
        const heightDist = 8;
        const camX = this.courier.position.x - Math.sin(this.courierAngle) * backDist;
        const camZ = this.courier.position.z - Math.cos(this.courierAngle) * backDist;
        const camY = this.courier.position.y + heightDist;

        this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
        this.camera.lookAt(this.courier.position.x, this.courier.position.y + 2, this.courier.position.z);
      }
    } else {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.camera.lookAt(this.cameraTarget);
    }

    // 7. Raycast Hover Check
    if (!this.gameMode) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (!obj.userData.locationData && obj.parent) {
          obj = obj.parent;
        }

        if (this.hoveredObject !== obj) {
          this.hoveredObject = obj;
          document.body.style.cursor = 'pointer';
          if (obj.userData.locationData && window.onLocationHovered) {
            window.onLocationHovered(obj.userData.locationData);
          }
        }
      } else {
        if (this.hoveredObject) {
          this.hoveredObject = null;
          document.body.style.cursor = 'default';
          if (window.onLocationHovered) window.onLocationHovered(null);
        }
      }
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

window.TownCenter3DScene = TownCenter3DScene;
