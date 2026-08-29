/**
 * 3D World Scene Architecture & Procedural Sanctuary Builder
 * Stoa Poikile — The Inner Citadel
 * Three.js WebGL Engine
 */

import { STOIC_DATA } from './stoic-data.js';

export class StoicWorld {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Lighting & Environment
    this.dirLight = null;
    this.hemiLight = null;
    this.ambientLight = null;
    this.centralFlameLight = null;
    this.beaconLights = [];

    // Interactive Objects
    this.interactiveObjects = [];
    this.hoveredObject = null;
    this.selectedObject = null;

    // Animated Elements
    this.animatedItems = [];
    this.waterMesh = null;
    this.starField = null;

    // Atmosphere presets
    this.atmospheres = {
      dawn: {
        skyTop: 0x2e1a47,
        skyBottom: 0xffaa77,
        fog: 0x4a2e5a,
        fogDensity: 0.007,
        dirColor: 0xffd1a4,
        dirIntensity: 1.2,
        dirPos: [60, 40, 50],
        ambientColor: 0x554477,
        ambientIntensity: 0.7,
        name: "Olympian Dawn"
      },
      noon: {
        skyTop: 0x0f3b6c,
        skyBottom: 0x6ba4d8,
        fog: 0x8ab8e6,
        fogDensity: 0.004,
        dirColor: 0xfffaed,
        dirIntensity: 1.7,
        dirPos: [20, 100, 30],
        ambientColor: 0x8899aa,
        ambientIntensity: 0.9,
        name: "Golden Noon"
      },
      dusk: {
        skyTop: 0x1f1135,
        skyBottom: 0xf56545,
        fog: 0x441b38,
        fogDensity: 0.006,
        dirColor: 0xff7b39,
        dirIntensity: 1.3,
        dirPos: [-70, 30, -40],
        ambientColor: 0x443355,
        ambientIntensity: 0.6,
        name: "Aegean Sunset"
      },
      night: {
        skyTop: 0x02040a,
        skyBottom: 0x0a1128,
        fog: 0x040817,
        fogDensity: 0.008,
        dirColor: 0x7799cc,
        dirIntensity: 0.4,
        dirPos: [-30, 80, -20],
        ambientColor: 0x141e38,
        ambientIntensity: 0.35,
        name: "Midnight Cosmos"
      }
    };
    this.currentAtmosphere = "dusk";

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    // 1. Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x1e293b, 0.006);

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 3.5, 28);

    // 3. Renderer Setup with graceful fallback
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.container.appendChild(this.renderer.domElement);
    } catch (e) {
      console.warn("Standard WebGLRenderer failed, rendering fallback UI notice", e);
      const notice = document.createElement("div");
      notice.style.position = "absolute";
      notice.style.top = "50%";
      notice.style.left = "50%";
      notice.style.transform = "translate(-50%, -50%)";
      notice.style.color = "#f59e0b";
      notice.style.fontFamily = "sans-serif";
      notice.style.textAlign = "center";
      notice.innerHTML = "<h3>WebGL Acceleration</h3><p>Your browser environment is preparing the WebGL context.</p>";
      this.container.appendChild(notice);
    }

    // 4. Build Environment & Architecture
    this._setupLighting();
    this._buildSkyAndStars();
    this._buildTerrainAndPlaza();
    this._buildCentralRotunda();
    this._buildWisdomShrine();
    this._buildCourageBastion();
    this._buildJusticeForum();
    this._buildTemperanceGarden();
    this._buildLandscapeFoliage();
    this._buildInteractiveWaypoints();

    // 5. Apply Default Atmosphere
    this.setAtmosphere("dusk");

    // 6. Handle Resizing
    window.addEventListener("resize", () => this.onResize());
  }

  _setupLighting() {
    this.dirLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    this.dirLight.position.set(40, 70, 40);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 250;
    const d = 60;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x7788aa, 0x223344, 0.6);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0x334455, 0.4);
    this.scene.add(this.ambientLight);

    this.centralFlameLight = new THREE.PointLight(0xff9922, 2.5, 30, 1.2);
    this.centralFlameLight.position.set(0, 3.2, 0);
    this.centralFlameLight.castShadow = true;
    this.scene.add(this.centralFlameLight);
  }

  _buildSkyAndStars() {
    const starCount = 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 350 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 1.8 - 0.9);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) + 10;
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.5;
      } else if (tint > 0.6) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.starField = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starField);
  }

  _buildTerrainAndPlaza() {
    const groundGeo = new THREE.PlaneGeometry(300, 300, 48, 48);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      if (dist > 35) {
        const hill = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 2.5 + Math.sin(dist * 0.1) * 1.5;
        pos.setZ(i, hill);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a2332,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const plazaGroup = new THREE.Group();
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x243044,
      roughness: 0.35,
      metalness: 0.15
    });

    const mainPlaza = new THREE.Mesh(new THREE.CylinderGeometry(20, 20.8, 0.4, 48), marbleMat);
    mainPlaza.position.y = 0.2;
    mainPlaza.receiveShadow = true;
    plazaGroup.add(mainPlaza);

    const avenueNS = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 90), marbleMat);
    avenueNS.position.y = 0.18;
    avenueNS.receiveShadow = true;
    plazaGroup.add(avenueNS);

    const avenueEW = new THREE.Mesh(new THREE.BoxGeometry(90, 0.35, 8), marbleMat);
    avenueEW.position.y = 0.18;
    avenueEW.receiveShadow = true;
    plazaGroup.add(avenueEW);

    this.scene.add(plazaGroup);
  }

  createMarbleColumn(x, z, height = 7, radius = 0.45) {
    const colGroup = new THREE.Group();
    colGroup.position.set(x, 0, z);

    const marbleWhite = new THREE.MeshStandardMaterial({
      color: 0xd8e2ec,
      roughness: 0.3,
      metalness: 0.1
    });

    const marbleDark = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.15
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(radius * 3.2, 0.4, radius * 3.2), marbleDark);
    base.position.y = 0.2;
    base.castShadow = true;
    base.receiveShadow = true;
    colGroup.add(base);

    const torusBase = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.3, radius * 1.45, 0.3, 24), marbleWhite);
    torusBase.position.y = 0.55;
    torusBase.castShadow = true;
    colGroup.add(torusBase);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.85, radius, height - 1.2, 24), marbleWhite);
    shaft.position.y = height * 0.5 + 0.1;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    colGroup.add(shaft);

    const echinus = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.4, radius * 0.9, 0.35, 24), marbleWhite);
    echinus.position.y = height - 0.35;
    echinus.castShadow = true;
    colGroup.add(echinus);

    const abacus = new THREE.Mesh(new THREE.BoxGeometry(radius * 3.2, 0.35, radius * 3.2), marbleDark);
    abacus.position.y = height - 0.05;
    abacus.castShadow = true;
    colGroup.add(abacus);

    return colGroup;
  }

  _buildCentralRotunda() {
    const rotunda = new THREE.Group();
    rotunda.position.set(0, 0.4, 0);

    const marbleCream = new THREE.MeshStandardMaterial({
      color: 0xebf2f8,
      roughness: 0.28,
      metalness: 0.12
    });

    const goldAccent = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.8
    });

    // 3 steps
    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(new THREE.CylinderGeometry(14 - s * 0.8, 14.5 - s * 0.8, 0.35, 48), marbleCream);
      step.position.y = s * 0.35;
      step.receiveShadow = true;
      rotunda.add(step);
    }

    // 12 columns
    const numColumns = 12;
    const ringRadius = 9.8;
    const colHeight = 8;

    for (let i = 0; i < numColumns; i++) {
      const angle = (i / numColumns) * Math.PI * 2;
      const cx = Math.cos(angle) * ringRadius;
      const cz = Math.sin(angle) * ringRadius;
      const col = this.createMarbleColumn(cx, cz, colHeight, 0.42);
      col.position.y = 1.05;
      rotunda.add(col);
    }

    // Entablature
    const architrave = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.55, 16, 48), marbleCream);
    architrave.rotation.x = Math.PI / 2;
    architrave.position.y = colHeight + 1.4;
    architrave.castShadow = true;
    rotunda.add(architrave);

    // Dome with oculus
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(ringRadius + 0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide })
    );
    dome.position.y = colHeight + 1.2;
    dome.castShadow = true;
    rotunda.add(dome);

    const oculusRing = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.25, 16, 36), goldAccent);
    oculusRing.rotation.x = Math.PI / 2;
    oculusRing.position.y = colHeight + 4.6;
    rotunda.add(oculusRing);

    // Volumetric light ray
    const lightRay = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 5.8, 12, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffe8b5, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
    );
    lightRay.position.y = 6.2;
    rotunda.add(lightRay);
    this.animatedItems.push({
      mesh: lightRay,
      update: (delta, time) => {
        lightRay.material.opacity = 0.10 + Math.sin(time * 1.5) * 0.03;
      }
    });

    // Central altar & brazier
    const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 1.2, 24), marbleCream);
    altarBase.position.y = 1.6;
    altarBase.castShadow = true;
    altarBase.receiveShadow = true;
    rotunda.add(altarBase);

    const brazier = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 })
    );
    brazier.position.y = 2.4;
    brazier.rotation.x = Math.PI;
    brazier.castShadow = true;
    rotunda.add(brazier);

    this._buildFlameParticles(0, 3.2, 0);
    this.scene.add(rotunda);
  }

  _buildFlameParticles(x, y, z) {
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = [];

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = x + (Math.random() - 0.5) * 0.8;
      pPositions[i * 3 + 1] = y + Math.random() * 1.5;
      pPositions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.8;

      pVelocities.push({
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.8 + Math.random() * 1.2,
        vz: (Math.random() - 0.5) * 0.3,
        startY: y
      });
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const fireParticles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xffaa22,
        size: 0.45,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      })
    );
    this.scene.add(fireParticles);

    this.animatedItems.push({
      mesh: fireParticles,
      update: (delta, time) => {
        const positions = fireParticles.geometry.attributes.position.array;
        for (let i = 0; i < pCount; i++) {
          const v = pVelocities[i];
          positions[i * 3] += v.vx * delta;
          positions[i * 3 + 1] += v.vy * delta;
          positions[i * 3 + 2] += v.vz * delta;

          if (positions[i * 3 + 1] > v.startY + 2.4) {
            positions[i * 3] = x + (Math.random() - 0.5) * 0.7;
            positions[i * 3 + 1] = v.startY + Math.random() * 0.3;
            positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.7;
          }
        }
        fireParticles.geometry.attributes.position.needsUpdate = true;

        if (this.centralFlameLight) {
          this.centralFlameLight.intensity = 2.2 + Math.sin(time * 12) * 0.3 + Math.sin(time * 23) * 0.2;
        }
      }
    });
  }

  _buildWisdomShrine() {
    const shrine = new THREE.Group();
    shrine.position.set(0, 0, -35);

    const marbleBlue = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.25, metalness: 0.1 });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.4 }));
    plinth.position.y = 0.4;
    plinth.receiveShadow = true;
    shrine.add(plinth);

    for (let c = -2.5; c <= 2.5; c += 1) {
      const col = this.createMarbleColumn(c * 3.4, 6.5, 7.5, 0.42);
      col.position.y = 0.8;
      shrine.add(col);
    }

    const architrave = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 15), marbleBlue);
    architrave.position.y = 8.6;
    architrave.castShadow = true;
    shrine.add(architrave);

    const orreryGroup = new THREE.Group();
    orreryGroup.position.set(0, 4.2, 0);

    const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2, emissive: 0x0369a1, emissiveIntensity: 0.4 });
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.08, 16, 48), ringMat);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.07, 16, 48), ringMat);
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), new THREE.MeshBasicMaterial({ color: 0x7dd3fc }));
    orreryGroup.add(r1, r2, coreSphere);
    shrine.add(orreryGroup);

    this.animatedItems.push({
      mesh: orreryGroup,
      update: (delta, time) => {
        r1.rotation.x = time * 0.6;
        r1.rotation.y = time * 0.4;
        r2.rotation.y = time * 0.8;
        orreryGroup.position.y = 4.2 + Math.sin(time * 2) * 0.2;
      }
    });

    const beaconLight = new THREE.PointLight(0x38bdf8, 1.8, 20);
    beaconLight.position.set(0, 4.2, 0);
    shrine.add(beaconLight);
    this.beaconLights.push(beaconLight);

    this._addInteractiveNode(shrine, "wisdom", { x: 0, y: 1.8, z: -35 });
    this.scene.add(shrine);
  }

  _buildCourageBastion() {
    const bastion = new THREE.Group();
    bastion.position.set(-35, 0, 0);

    const stoneDark = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.3 });
    const goldWar = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(18, 1.2, 18), stoneDark);
    base.position.y = 0.6;
    base.receiveShadow = true;
    bastion.add(base);

    const towerCoords = [[-7, -7], [7, -7], [-7, 7], [7, 7]];
    towerCoords.forEach(([tx, tz]) => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 8, 2.4), stoneDark);
      tower.position.set(tx, 4.6, tz);
      tower.castShadow = true;
      bastion.add(tower);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), goldWar);
      cap.position.set(tx, 9.7, tz);
      cap.rotation.y = Math.PI / 4;
      cap.castShadow = true;
      bastion.add(cap);
    });

    const hourglassGroup = new THREE.Group();
    hourglassGroup.position.set(0, 4.5, 0);

    const coneTop = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true }));
    coneTop.position.y = 1.1;
    const coneBottom = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 24), new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true }));
    coneBottom.rotation.x = Math.PI;
    coneBottom.position.y = -1.1;
    hourglassGroup.add(coneTop, coneBottom);
    bastion.add(hourglassGroup);

    this.animatedItems.push({
      mesh: hourglassGroup,
      update: (delta, time) => {
        hourglassGroup.rotation.y = time * 0.4;
        hourglassGroup.position.y = 4.5 + Math.sin(time * 1.8) * 0.25;
      }
    });

    const beaconLight = new THREE.PointLight(0xf59e0b, 1.8, 20);
    beaconLight.position.set(0, 4.5, 0);
    bastion.add(beaconLight);
    this.beaconLights.push(beaconLight);

    this._addInteractiveNode(bastion, "courage", { x: -35, y: 1.8, z: 0 });
    this.scene.add(bastion);
  }

  _buildJusticeForum() {
    const forum = new THREE.Group();
    forum.position.set(35, 0, 0);

    const marbleWhite = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.1 });
    const emeraldMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.7, emissive: 0x047857, emissiveIntensity: 0.35 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(11, 11.5, 0.8, 32, 1, false, -Math.PI / 2, Math.PI), marbleWhite);
    base.position.y = 0.4;
    base.receiveShadow = true;
    forum.add(base);

    const colCount = 7;
    for (let i = 0; i < colCount; i++) {
      const angle = -Math.PI / 2 + (i / (colCount - 1)) * Math.PI;
      const cx = Math.cos(angle) * 9.5;
      const cz = Math.sin(angle) * 9.5;
      const col = this.createMarbleColumn(cx, cz, 6.5, 0.38);
      col.position.y = 1.9;
      forum.add(col);
    }

    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 3.8, 0);
    const mainGlobe = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 24), emeraldMat);
    const wireframeGlobe = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), new THREE.MeshBasicMaterial({ color: 0x6ee7b7, wireframe: true, transparent: true, opacity: 0.5 }));
    globeGroup.add(mainGlobe, wireframeGlobe);
    forum.add(globeGroup);

    this.animatedItems.push({
      mesh: globeGroup,
      update: (delta, time) => {
        globeGroup.rotation.y = time * 0.5;
        wireframeGlobe.rotation.x = time * 0.3;
        globeGroup.position.y = 3.8 + Math.sin(time * 1.6) * 0.2;
      }
    });

    const beaconLight = new THREE.PointLight(0x10b981, 1.8, 20);
    beaconLight.position.set(0, 3.8, 0);
    forum.add(beaconLight);
    this.beaconLights.push(beaconLight);

    this._addInteractiveNode(forum, "justice", { x: 35, y: 1.8, z: 0 });
    this.scene.add(forum);
  }

  _buildTemperanceGarden() {
    const garden = new THREE.Group();
    garden.position.set(0, 0, 35);

    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.15 });

    const basinOuter = new THREE.Mesh(new THREE.BoxGeometry(20, 0.8, 14), marbleMat);
    basinOuter.position.y = 0.4;
    basinOuter.receiveShadow = true;
    garden.add(basinOuter);

    const waterGeo = new THREE.PlaneGeometry(17.5, 11.5, 24, 24);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.y = 0.75;
    garden.add(this.waterMesh);

    this.animatedItems.push({
      mesh: this.waterMesh,
      update: (delta, time) => {
        const v = waterGeo.attributes.position;
        for (let i = 0; i < v.count; i++) {
          const u = v.getX(i);
          const w = v.getY(i);
          const wave = Math.sin(u * 0.8 + time * 2) * 0.05 + Math.cos(w * 0.8 + time * 1.5) * 0.04;
          v.setZ(i, wave);
        }
        waterGeo.computeVertexNormals();
        waterGeo.attributes.position.needsUpdate = true;
      }
    });

    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(0, 2.5, 0);
    const octahedron = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.3, 0),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.15, metalness: 0.8, emissive: 0x7e22ce, emissiveIntensity: 0.45 })
    );
    lotusGroup.add(octahedron);
    garden.add(lotusGroup);

    this.animatedItems.push({
      mesh: lotusGroup,
      update: (delta, time) => {
        octahedron.rotation.y = time * 0.6;
        octahedron.rotation.x = time * 0.4;
        lotusGroup.position.y = 2.5 + Math.sin(time * 1.4) * 0.2;
      }
    });

    const beaconLight = new THREE.PointLight(0xa855f7, 1.8, 20);
    beaconLight.position.set(0, 2.5, 0);
    garden.add(beaconLight);
    this.beaconLights.push(beaconLight);

    this._addInteractiveNode(garden, "temperance", { x: 0, y: 1.8, z: 35 });
    this.scene.add(garden);
  }

  createCypressTree(x, z, scale = 1.0) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.4 * scale, 2.5 * scale, 8), trunkMat);
    trunk.position.y = 1.25 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x14342b, roughness: 0.85, flatShading: true });
    const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.6 * scale, 4.5 * scale, 8), foliageMat);
    f1.position.y = 3.5 * scale;
    f1.castShadow = true;
    tree.add(f1);

    const f2 = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 4.0 * scale, 8), foliageMat);
    f2.position.y = 5.8 * scale;
    f2.castShadow = true;
    tree.add(f2);

    return tree;
  }

  _buildLandscapeFoliage() {
    const foliageGroup = new THREE.Group();
    const treePositions = [
      [-6, -18], [6, -18], [-6, -26], [6, -26],
      [-6, 18], [6, 18], [-6, 26], [6, 26],
      [18, -6], [18, 6], [26, -6], [26, 6],
      [-18, -6], [-18, 6], [-26, -6], [-26, 6],
      [-25, -25], [25, -25], [-25, 25], [25, 25]
    ];

    treePositions.forEach(([tx, tz]) => {
      const s = 0.8 + Math.random() * 0.45;
      const tree = this.createCypressTree(tx, tz, s);
      foliageGroup.add(tree);
    });

    this.scene.add(foliageGroup);
  }

  _buildInteractiveWaypoints() {
    const waypoints = [
      { id: "rotunda", x: 0, z: 0, color: 0xffeedd },
      { id: "wisdom", x: 0, z: -35, color: 0x38bdf8 },
      { id: "courage", x: -35, z: 0, color: 0xf59e0b },
      { id: "justice", x: 35, z: 0, color: 0x10b981 },
      { id: "temperance", x: 0, z: 35, color: 0xa855f7 }
    ];

    waypoints.forEach(wp => {
      const ringGeo = new THREE.RingGeometry(2.5, 2.9, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: wp.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(wp.x, 0.45, wp.z);
      this.scene.add(ring);

      this.animatedItems.push({
        mesh: ring,
        update: (delta, time) => {
          ring.rotation.z = time * 0.3;
          ring.material.opacity = 0.45 + Math.sin(time * 3 + wp.x) * 0.25;
        }
      });
    });
  }

  _addInteractiveNode(parent, virtueId, targetCoords) {
    const hitBox = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 4.5, 6, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 3;
    hitBox.userData = { virtueId, targetCoords };
    parent.add(hitBox);
    this.interactiveObjects.push(hitBox);
  }

  setAtmosphere(presetKey) {
    const preset = this.atmospheres[presetKey];
    if (!preset) return;
    this.currentAtmosphere = presetKey;

    this.scene.background.setHex(preset.skyTop);
    this.scene.fog.color.setHex(preset.fog);
    this.scene.fog.density = preset.fogDensity;

    if (this.dirLight) {
      this.dirLight.color.setHex(preset.dirColor);
      this.dirLight.intensity = preset.dirIntensity;
      this.dirLight.position.set(...preset.dirPos);
    }
    if (this.ambientLight) {
      this.ambientLight.color.setHex(preset.ambientColor);
      this.ambientLight.intensity = preset.ambientIntensity;
    }
    if (this.starField) {
      this.starField.visible = presetKey === "night" || presetKey === "dawn" || presetKey === "dusk";
    }
  }

  checkIntersection(normalizedMouse) {
    this.raycaster.setFromCamera(normalizedMouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.hoveredObject = hit;
      return hit.userData.virtueId;
    } else {
      this.hoveredObject = null;
      return null;
    }
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    if (this.camera && this.renderer) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }
  }

  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    for (let i = 0; i < this.animatedItems.length; i++) {
      this.animatedItems[i].update(delta, time);
    }

    if (this.starField) {
      this.starField.rotation.y = time * 0.005;
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
