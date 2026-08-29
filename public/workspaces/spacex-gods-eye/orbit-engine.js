/**
 * orbit-engine.js - SpaceX God's Eye 3D WebGL Engine
 * Three.js 3D Earth, Starlink Constellation, Orbital Mechanics, Laser ISL Mesh & POV Cameras
 */

class OrbitEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Simulation Clock
    this.timeScale = 1.0; // 1x realtime
    this.isPaused = false;
    this.simTimeSeconds = 0;
    this.lastTimestamp = performance.now();
    this.earthRotationAngle = 0;
    this.earthRotationSpeed = (2 * Math.PI) / (24 * 3600); // 1 rev per 24 hours

    // Camera Modes
    this.CAMERA_MODES = {
      GLOBAL: 'GLOBAL',
      SATELLITE_POV: 'SATELLITE_POV',
      CHASE: 'CHASE',
      TARGET_LOCK: 'TARGET_LOCK'
    };
    this.cameraMode = this.CAMERA_MODES.GLOBAL;
    this.zoomLevel = 1.0; // 1x to 100x
    this.sensorFilter = 'OPTICAL'; // OPTICAL, SAR, FLIR, NIGHT_VISION, CYBER

    // Target tracking
    this.selectedSat = null;
    this.targetWaypoint = null;
    this.satellites = [];
    this.satMeshInstances = null;
    this.satPositions = []; // Float32Array for high performance
    this.laserLines = null;
    this.orbitTrailLine = null;
    this.groundFootprintCone = null;

    // Display Toggles
    this.showOrbits = true;
    this.showLasers = true;
    this.showGroundStations = true;
    this.showFootprint = true;
    this.showAtmosphere = true;
    this.showNightLights = true;

    // Callbacks
    this.onSatelliteSelected = null;
    this.onTelemetryUpdate = null;

    this.initThree();
    this.createStarfield();
    this.createEarth();
    this.createSunAndLighting();
    this.createGroundStations();
    this.initConstellation();
    this.createSatelliteDetailModel();
    this.setupInteractivity();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020208, 0.00008);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 50000);
    this.camera.position.set(0, 80, 240);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.2;
    this.controls.minDistance = 101.5; // Just above Earth surface (radius = 100)
    this.controls.maxDistance = 1200;
    this.controls.target.set(0, 0, 0);

    // Resize listener
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  createStarfield() {
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 8000 + Math.random() * 4000;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Star Spectral Colors (Blue-white, white, warm yellow, cyan)
      const colorType = Math.random();
      if (colorType > 0.85) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1.0; // Blue-white
      } else if (colorType > 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.8; // Warm yellow
      } else if (colorType > 0.4) {
        colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0; // Cyan
      } else {
        colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0; // Pure white
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);

    // Subtle Milky Way dust ring
    const mwGeo = new THREE.RingGeometry(3500, 7000, 64);
    const mwMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const mwMesh = new THREE.Mesh(mwGeo, mwMat);
    mwMesh.rotation.x = Math.PI / 3;
    mwMesh.rotation.y = Math.PI / 6;
    this.scene.add(mwMesh);
  }

  createProceduralEarthTextures() {
    // Canvas 1: Day Texture (Equirectangular 2048x1024)
    const dayCanvas = document.createElement('canvas');
    dayCanvas.width = 2048;
    dayCanvas.height = 1024;
    const ctx = dayCanvas.getContext('2d');

    // Deep Ocean Base Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#04162e'); // Arctic ocean
    oceanGrad.addColorStop(0.2, '#06284f');
    oceanGrad.addColorStop(0.5, '#0b3c6d'); // Equatorial blue
    oceanGrad.addColorStop(0.8, '#06284f');
    oceanGrad.addColorStop(1, '#04162e'); // Antarctic ocean
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Ocean current nuances
    ctx.fillStyle = 'rgba(12, 74, 110, 0.4)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 2048,
        200 + Math.random() * 624,
        80 + Math.random() * 200,
        15 + Math.random() * 35,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw Continents & Landmasses
    const drawLandmass = (cx, cy, rx, ry, col, rough = 12) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += Math.PI / rough) {
        const radX = rx * (0.8 + Math.sin(a * 4 + cx) * 0.2 + Math.cos(a * 7) * 0.1);
        const radY = ry * (0.8 + Math.cos(a * 3 + cy) * 0.2 + Math.sin(a * 5) * 0.1);
        const x = cx + Math.cos(a) * radX;
        const y = cy + Math.sin(a) * radY;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // North America
    drawLandmass(520, 320, 240, 140, '#2d5a27'); // Green forests
    drawLandmass(460, 360, 120, 90, '#5b5327'); // Rockies & Great Plains
    drawLandmass(480, 420, 80, 70, '#8c7b41'); // SW Desert
    drawLandmass(640, 200, 140, 90, '#dbeafe'); // Greenland Ice

    // South America
    drawLandmass(720, 640, 130, 200, '#1c4c1e'); // Amazon Basin
    drawLandmass(660, 720, 40, 160, '#4a482b'); // Andes Ridge
    drawLandmass(740, 790, 90, 90, '#365314'); // Pampas

    // Eurasia
    drawLandmass(1260, 280, 420, 160, '#2d5a27'); // Siberia & Taiga
    drawLandmass(1080, 320, 150, 100, '#3f6212'); // Europe
    drawLandmass(1440, 380, 180, 120, '#15803d'); // East Asia / China
    drawLandmass(1360, 460, 90, 80, '#166534'); // India & SE Asia
    drawLandmass(1200, 410, 180, 70, '#785f26'); // Central Asia Steppes
    drawLandmass(1150, 430, 110, 70, '#a16207'); // Middle East Desert

    // Africa
    drawLandmass(1120, 480, 160, 90, '#c28935'); // Sahara Desert
    drawLandmass(1140, 600, 140, 120, '#166534'); // Congo Rainforest
    drawLandmass(1160, 720, 100, 90, '#4d7c0f'); // Southern Africa Savanna

    // Australia & Oceania
    drawLandmass(1660, 680, 140, 90, '#9a3412'); // Outback Red Earth
    drawLandmass(1750, 720, 40, 60, '#15803d'); // East Coast / NZ
    drawLandmass(1580, 520, 120, 60, '#047857'); // Indonesia Archipelago

    // Polar Ice Caps
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.rect(0, 0, 2048, 70); // North Pole
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 950, 2048, 74); // Antarctica
    ctx.fill();

    // Canvas 2: Earth Night City Lights (High-Density Glow)
    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = 2048;
    nightCanvas.height = 1024;
    const nCtx = nightCanvas.getContext('2d');
    nCtx.fillStyle = '#000000';
    nCtx.fillRect(0, 0, 2048, 1024);

    const drawCityCluster = (cx, cy, count, spread, color = '#fbbf24') => {
      nCtx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const rad = Math.random() * spread;
        const ang = Math.random() * Math.PI * 2;
        const x = cx + Math.cos(ang) * rad;
        const y = cy + Math.sin(ang) * rad;
        const size = Math.random() < 0.1 ? 2.5 : Math.random() * 1.5 + 0.5;
        nCtx.beginPath();
        nCtx.arc(x, y, size, 0, Math.PI * 2);
        nCtx.fill();
      }
    };

    // Major Megalopolis Clusters
    // North America East Coast & Midwest
    drawCityCluster(580, 360, 800, 70, '#fde047');
    drawCityCluster(470, 380, 400, 60, '#fbbf24'); // West Coast LA/SF/Seattle
    drawCityCluster(520, 430, 350, 45, '#f59e0b'); // Texas / Florida
    // Europe
    drawCityCluster(1100, 320, 1200, 65, '#fef08a');
    drawCityCluster(1160, 340, 500, 50, '#fde047'); // Moscow / Eastern Europe
    // East Asia
    drawCityCluster(1520, 370, 1400, 60, '#fde047'); // Tokyo, Seoul, Shanghai, HK
    drawCityCluster(1350, 450, 1000, 70, '#fbbf24'); // India / New Delhi / Mumbai
    // Middle East / Nile
    drawCityCluster(1150, 420, 400, 35, '#f59e0b');
    drawCityCluster(1135, 435, 250, 15, '#fde047'); // Nile Delta
    // South America
    drawCityCluster(780, 720, 450, 45, '#fbbf24'); // Sao Paulo / Rio
    drawCityCluster(720, 770, 250, 30, '#f59e0b'); // Buenos Aires
    // Australia
    drawCityCluster(1720, 710, 300, 35, '#fde047'); // Sydney / Melbourne

    // Canvas 3: Specular Map (Oceans reflective, Land dark)
    const specCanvas = document.createElement('canvas');
    specCanvas.width = 2048;
    specCanvas.height = 1024;
    const sCtx = specCanvas.getContext('2d');
    sCtx.fillStyle = '#ffffff'; // Oceans reflect sunlight
    sCtx.fillRect(0, 0, 2048, 1024);
    // Darken land areas on specular map
    sCtx.fillStyle = '#0a0a0a';
    sCtx.drawImage(dayCanvas, 0, 0);

    // Canvas 4: Cloud Swirls
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 2048;
    cloudCanvas.height = 1024;
    const cCtx = cloudCanvas.getContext('2d');
    cCtx.clearRect(0, 0, 2048, 1024);
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';

    for (let i = 0; i < 90; i++) {
      const cx = Math.random() * 2048;
      const cy = 100 + Math.random() * 824;
      const rx = 60 + Math.random() * 180;
      const ry = 15 + Math.random() * 45;
      const angle = (Math.random() - 0.5) * 0.6;
      cCtx.beginPath();
      cCtx.ellipse(cx, cy, rx, ry, angle, 0, Math.PI * 2);
      cCtx.fill();
    }

    // Build Three Textures
    const dayTexture = new THREE.CanvasTexture(dayCanvas);
    const nightTexture = new THREE.CanvasTexture(nightCanvas);
    const specTexture = new THREE.CanvasTexture(specCanvas);
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);

    return { dayTexture, nightTexture, specTexture, cloudTexture };
  }

  createEarth() {
    this.earthGroup = new THREE.Group();
    this.scene.add(this.earthGroup);

    const { dayTexture, nightTexture, specTexture, cloudTexture } = this.createProceduralEarthTextures();

    this.earthTextures = { dayTexture, nightTexture, specTexture, cloudTexture };

    // Custom GLSL Shader for Dynamic Day/Night Terminator + Ocean Specular + Atmosphere Scattering
    const earthCustomShader = {
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        specularMap: { value: specTexture },
        sunDirection: { value: new THREE.Vector3(1, 0.2, 0.8).normalize() },
        showNightLights: { value: 1.0 },
        filterMode: { value: 0 } // 0: OPTICAL, 1: SAR, 2: FLIR, 3: NIGHT_VISION, 4: CYBER
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D specularMap;
        uniform vec3 sunDirection;
        uniform float showNightLights;
        uniform int filterMode;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec3 norm = normalize(vNormal);
          vec3 worldNorm = normalize(vPosition); // Sphere normal in model space
          vec3 sunDir = normalize(sunDirection);
          
          float sunDot = dot(worldNorm, sunDir);
          float dayIntensity = smoothstep(-0.15, 0.25, sunDot);
          float nightIntensity = 1.0 - dayIntensity;

          vec4 dayCol = texture2D(dayTexture, vUv);
          vec4 nightCol = texture2D(nightTexture, vUv);
          vec4 specVal = texture2D(specularMap, vUv);

          // Specular glint on daylight oceans
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 halfVec = normalize(sunDir + viewDir);
          float specAngle = max(dot(norm, halfVec), 0.0);
          float specular = pow(specAngle, 32.0) * specVal.r * 0.8 * dayIntensity;

          // Horizon rim atmosphere haze
          float rim = 1.0 - max(dot(viewDir, norm), 0.0);
          float atmosphereGlow = pow(rim, 3.5) * 0.45;
          vec3 atmoColor = vec3(0.15, 0.65, 1.0) * (dayIntensity * 0.8 + 0.2);

          // Base Composite Color
          vec3 finalColor = dayCol.rgb * (dayIntensity * 0.95 + 0.05);
          if (showNightLights > 0.5) {
            finalColor += nightCol.rgb * nightIntensity * 1.8;
          }
          finalColor += vec3(1.0, 0.9, 0.7) * specular;
          finalColor += atmoColor * atmosphereGlow;

          // Tactical Sensor Filter Modes
          if (filterMode == 1) {
            // SAR (Synthetic Aperture Radar)
            float lum = dot(finalColor, vec3(0.299, 0.587, 0.114));
            float scanline = sin(vUv.y * 800.0) * 0.1 + 0.9;
            float grid = (mod(vUv.x * 120.0, 1.0) < 0.05 || mod(vUv.y * 60.0, 1.0) < 0.05) ? 0.35 : 0.0;
            finalColor = vec3(0.05, 0.85 * lum, 0.65 * lum) * scanline + vec3(grid * 0.4);
          } else if (filterMode == 2) {
            // FLIR Thermal Infrared Heatmap (Ironbow false color)
            float lum = dot(finalColor, vec3(0.299, 0.587, 0.114));
            vec3 heatCol = vec3(0.0);
            if (lum < 0.33) {
              heatCol = mix(vec3(0.0, 0.0, 0.5), vec3(0.8, 0.0, 0.6), lum / 0.33);
            } else if (lum < 0.66) {
              heatCol = mix(vec3(0.8, 0.0, 0.6), vec3(1.0, 0.6, 0.0), (lum - 0.33) / 0.33);
            } else {
              heatCol = mix(vec3(1.0, 0.6, 0.0), vec3(1.0, 1.0, 0.8), (lum - 0.66) / 0.34);
            }
            finalColor = heatCol;
          } else if (filterMode == 3) {
            // Night Vision (Photon Intensifier Cyan/Green)
            float lum = dot(finalColor, vec3(0.299, 0.587, 0.114)) * 1.6;
            float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.12;
            finalColor = vec3(0.1, 0.95, 0.4) * (lum + noise);
          } else if (filterMode == 4) {
            // Cyber Constellation Mesh Mode
            float lum = dot(finalColor, vec3(0.299, 0.587, 0.114)) * 0.4;
            float cyberGrid = (mod(vUv.x * 180.0, 1.0) < 0.04 || mod(vUv.y * 90.0, 1.0) < 0.04) ? 0.3 : 0.0;
            finalColor = vec3(0.02, 0.15 + lum * 0.5, 0.35 + lum * 0.7) + vec3(0.0, cyberGrid * 0.8, cyberGrid);
          }

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    };

    this.earthShaderMaterial = new THREE.ShaderMaterial({
      uniforms: earthCustomShader.uniforms,
      vertexShader: earthCustomShader.vertexShader,
      fragmentShader: earthCustomShader.fragmentShader
    });

    const earthGeo = new THREE.SphereGeometry(SPACEX_CONFIG.THREE_EARTH_RADIUS, 128, 128);
    this.earthMesh = new THREE.Mesh(earthGeo, this.earthShaderMaterial);
    this.earthGroup.add(this.earthMesh);

    // Dynamic Atmosphere Glow Shell (Rayleigh scattering outer halo)
    const atmoGeo = new THREE.SphereGeometry(SPACEX_CONFIG.THREE_EARTH_RADIUS * 1.025, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 norm = normalize(vNormal);
          vec3 view = vec3(0.0, 0.0, 1.0);
          float intensity = pow(0.7 - dot(norm, view), 3.0);
          vec3 sunDir = normalize(sunDirection);
          float sunDot = max(dot(normalize(vPosition), sunDir), 0.0);
          vec3 col = mix(vec3(0.05, 0.35, 0.9), vec3(0.2, 0.7, 1.0), sunDot);
          gl_FragColor = vec4(col, intensity * 0.85);
        }
      `,
      uniforms: {
        sunDirection: { value: new THREE.Vector3(1, 0.2, 0.8).normalize() }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    this.atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    this.earthGroup.add(this.atmosphereMesh);

    // Rotating Clouds Sphere
    const cloudGeo = new THREE.SphereGeometry(SPACEX_CONFIG.THREE_EARTH_RADIUS * 1.004, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
    this.earthGroup.add(this.cloudsMesh);
  }

  createSunAndLighting() {
    this.sunLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    this.sunPosition = new THREE.Vector3(2500, 500, 2000);
    this.sunLight.position.copy(this.sunPosition);
    this.scene.add(this.sunLight);

    const ambientLight = new THREE.AmbientLight(0x1a243b, 0.4);
    this.scene.add(ambientLight);

    // Sun Visual Flare Billboard
    const sunGeo = new THREE.SphereGeometry(80, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.copy(this.sunPosition);
    this.scene.add(sunMesh);

    // Glow halo
    const haloGeo = new THREE.RingGeometry(80, 240, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.copy(this.sunPosition);
    haloMesh.lookAt(0, 0, 0);
    this.scene.add(haloMesh);
  }

  createGroundStations() {
    this.groundStationGroup = new THREE.Group();
    this.earthGroup.add(this.groundStationGroup);

    const markerGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    SPACEX_CONFIG.GROUND_STATIONS.forEach((gs) => {
      const pos = this.latLonToVector3(gs.lat, gs.lon, SPACEX_CONFIG.THREE_EARTH_RADIUS + 0.4);
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      marker.userData = { type: 'ground_station', data: gs };
      this.groundStationGroup.add(marker);

      // Uplink beacon cone
      const beamGeo = new THREE.ConeGeometry(0.8, 4.0, 8, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
        blending: THREE.AdditiveBlending
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos.clone().add(pos.clone().normalize().multiplyScalar(2.0)));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      this.groundStationGroup.add(beam);
    });
  }

  initConstellation() {
    this.satellites = window.generateConstellationData();
    const count = this.satellites.length;
    this.satPositions = new Float32Array(count * 3);

    // High performance InstancedMesh for thousands of satellites
    const satDotGeo = new THREE.SphereGeometry(0.45, 8, 8);
    const satDotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });

    this.satMeshInstances = new THREE.InstancedMesh(satDotGeo, satDotMat, count);
    this.satMeshInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const sat = this.satellites[i];
      color.setHex(sat.colorHex || 0x00f0ff);
      this.satMeshInstances.setColorAt(i, color);

      dummy.position.set(0, 0, 0);
      dummy.updateMatrix();
      this.satMeshInstances.setMatrixAt(i, dummy.matrix);
    }

    if (this.satMeshInstances.instanceColor) {
      this.satMeshInstances.instanceColor.needsUpdate = true;
    }
    this.scene.add(this.satMeshInstances);

    // Create Laser ISL Mesh Lines
    const maxLasers = 1200;
    const laserGeo = new THREE.BufferGeometry();
    const laserPositions = new Float32Array(maxLasers * 6); // 2 vertices per line
    laserGeo.setAttribute('position', new THREE.BufferAttribute(laserPositions, 3));

    const laserMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.laserLines = new THREE.LineSegments(laserGeo, laserMat);
    this.scene.add(this.laserLines);

    // Selected Satellite Orbit Track Line
    const trailGeo = new THREE.BufferGeometry();
    const trailPoints = new Float32Array(180 * 3);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPoints, 3));
    const trailMat = new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });
    this.orbitTrailLine = new THREE.Line(trailGeo, trailMat);
    this.scene.add(this.orbitTrailLine);

    // Nadir Ground Footprint Cone
    const coneGeo = new THREE.ConeGeometry(8, 25, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.groundFootprintCone = new THREE.Mesh(coneGeo, coneMat);
    this.scene.add(this.groundFootprintCone);

    // Select default satellite (e.g. Starship or high-tier Starlink v2)
    this.selectSatellite(this.satellites[0]);
  }

  createSatelliteDetailModel() {
    this.satDetailGroup = new THREE.Group();
    this.scene.add(this.satDetailGroup);

    // 1. Starlink Chassis (Flat-pack bus)
    const busGeo = new THREE.BoxGeometry(2.2, 0.35, 1.2);
    const busMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    this.chassisMesh = new THREE.Mesh(busGeo, busMat);
    this.satDetailGroup.add(this.chassisMesh);

    // 2. Phased Array Antennas (White bottom panels)
    const antennaGeo = new THREE.BoxGeometry(1.8, 0.08, 0.9);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.3,
      roughness: 0.5
    });
    const antennaMesh = new THREE.Mesh(antennaGeo, antennaMat);
    antennaMesh.position.y = -0.2;
    this.satDetailGroup.add(antennaMesh);

    // 3. Solar Array Wing (Huge single solar wing)
    this.solarWingGroup = new THREE.Group();
    this.solarWingGroup.position.set(1.1, 0, 0);

    const solarGeo = new THREE.BoxGeometry(4.5, 0.05, 1.4);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Photovoltaic deep blue
      metalness: 0.9,
      roughness: 0.15
    });
    const solarMesh = new THREE.Mesh(solarGeo, solarMat);
    solarMesh.position.set(2.25, 0, 0);
    this.solarWingGroup.add(solarMesh);
    this.satDetailGroup.add(this.solarWingGroup);

    // 4. Krypton/Argon Hall-Effect Ion Thruster
    const thrusterGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.position.set(-1.1, 0, 0);
    thruster.rotation.z = Math.PI / 2;
    this.satDetailGroup.add(thruster);

    // Thruster Blue Plasma Exhaust Plume
    const plumeGeo = new THREE.ConeGeometry(0.35, 1.8, 16);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.thrusterPlume = new THREE.Mesh(plumeGeo, plumeMat);
    this.thrusterPlume.position.set(-2.0, 0, 0);
    this.thrusterPlume.rotation.z = Math.PI / 2;
    this.satDetailGroup.add(this.thrusterPlume);

    // 4x Laser ISL Optical Turrets
    const turretGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const turretMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const offsets = [
      [-0.9, 0.18, -0.5],
      [-0.9, 0.18, 0.5],
      [0.9, 0.18, -0.5],
      [0.9, 0.18, 0.5]
    ];
    offsets.forEach(off => {
      const t = new THREE.Mesh(turretGeo, turretMat);
      t.position.set(...off);
      this.satDetailGroup.add(t);
    });

    // Optical Earth Recon Lens (Nadir camera)
    const lensGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.3, 16);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.95, roughness: 0.05 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, -0.3, 0);
    this.satDetailGroup.add(lens);
  }

  // Convert Keplerian Orbital State to Cartesian Position at Time T
  getSatelliteState(sat, simTimeSec) {
    const a = (SPACEX_CONFIG.EARTH_RADIUS_KM + sat.altitudeKm) * SPACEX_CONFIG.ORBIT_SCALE;
    const meanMotion = (2 * Math.PI) / (sat.periodMin * 60);
    const meanAnomaly = (sat.meanAnomalyRad + meanMotion * simTimeSec) % (2 * Math.PI);
    
    // Circular approximation for LEO constellation (eccentricity ~ 0.0001)
    const trueAnomaly = meanAnomaly;
    
    // In orbital plane
    const xOrb = a * Math.cos(trueAnomaly);
    const zOrb = a * Math.sin(trueAnomaly);
    const yOrb = 0;

    // Rotate by Inclination around X
    const inc = sat.inclinationRad;
    const xInc = xOrb;
    const yInc = yOrb * Math.cos(inc) - zOrb * Math.sin(inc);
    const zInc = yOrb * Math.sin(inc) + zOrb * Math.cos(inc);

    // Rotate by RAAN around Y (Earth polar axis)
    const raan = sat.raanRad;
    const x = xInc * Math.cos(raan) - zInc * Math.sin(raan);
    const y = yInc;
    const z = xInc * Math.sin(raan) + zInc * Math.cos(raan);

    // Velocity Vector
    const vSpeed = sat.speedKms;
    const vxOrb = -Math.sin(trueAnomaly);
    const vzOrb = Math.cos(trueAnomaly);
    const vyInc = -vzOrb * Math.sin(inc);
    const vzInc = vzOrb * Math.cos(inc);
    const vx = vxOrb * Math.cos(raan) - vzInc * Math.sin(raan);
    const vy = vyInc;
    const vz = vxOrb * Math.sin(raan) + vzInc * Math.cos(raan);
    const velocityVec = new THREE.Vector3(vx, vy, vz).normalize();

    // Sub-Satellite Coordinates (Lat/Lon)
    const r = Math.sqrt(x * x + y * y + z * z);
    const latDeg = (Math.asin(y / r) * 180) / Math.PI;
    
    // Account for Earth's rotation
    let lonRad = Math.atan2(z, x) - this.earthRotationAngle;
    let lonDeg = (lonRad * 180) / Math.PI;
    lonDeg = ((lonDeg + 180) % 360 + 360) % 360 - 180; // Normalize [-180, 180]

    return {
      position: new THREE.Vector3(x, y, z),
      velocity: velocityVec,
      lat: latDeg,
      lon: lonDeg,
      altitudeKm: sat.altitudeKm,
      speedKms: sat.speedKms
    };
  }

  latLonToVector3(lat, lon, radius = SPACEX_CONFIG.THREE_EARTH_RADIUS) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  selectSatellite(sat) {
    if (!sat) return;
    this.selectedSat = sat;
    if (this.onSatelliteSelected) {
      this.onSatelliteSelected(sat);
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    if (mode === this.CAMERA_MODES.GLOBAL) {
      this.controls.enabled = true;
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
    } else {
      this.controls.enabled = false;
    }
  }

  setZoom(zoomValue) {
    this.zoomLevel = Math.max(1.0, Math.min(100.0, zoomValue));
    if (this.cameraMode === this.CAMERA_MODES.SATELLITE_POV || this.cameraMode === this.CAMERA_MODES.TARGET_LOCK) {
      // Scale FOV from 55° (1x) down to 1.5° (100x magnification)
      const baseFov = 55.0;
      const minFov = 1.2;
      const targetFov = baseFov / Math.pow(this.zoomLevel, 0.82);
      this.camera.fov = Math.max(minFov, targetFov);
      this.camera.updateProjectionMatrix();
    }
  }

  setSensorFilter(filterName) {
    this.sensorFilter = filterName;
    const filterMap = {
      'OPTICAL': 0,
      'SAR': 1,
      'FLIR': 2,
      'NIGHT_VISION': 3,
      'CYBER': 4
    };
    const modeIdx = filterMap[filterName] || 0;
    if (this.earthShaderMaterial) {
      this.earthShaderMaterial.uniforms.filterMode.value = modeIdx;
    }
  }

  setTimeScale(scale) {
    this.timeScale = scale;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  setTargetWaypoint(waypoint) {
    this.targetWaypoint = waypoint;
    this.setCameraMode(this.CAMERA_MODES.TARGET_LOCK);
  }

  setupInteractivity() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener('pointerdown', (event) => {
      // Only handle click selection if in GLOBAL mode
      if (this.cameraMode !== this.CAMERA_MODES.GLOBAL) return;

      const rect = this.container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(this.satMeshInstances);

      if (intersects.length > 0) {
        const instanceId = intersects[0].instanceId;
        if (instanceId !== undefined && this.satellites[instanceId]) {
          this.selectSatellite(this.satellites[instanceId]);
        }
      }
    });
  }

  updateOrbitTrail(selectedSatState) {
    if (!this.selectedSat || !this.orbitTrailLine) return;
    const posAttr = this.orbitTrailLine.geometry.attributes.position;
    const totalSamples = 180;
    const sat = this.selectedSat;
    const periodSec = sat.periodMin * 60;

    for (let i = 0; i < totalSamples; i++) {
      const timeOffset = (i / totalSamples) * periodSec;
      const state = this.getSatelliteState(sat, this.simTimeSeconds + timeOffset);
      posAttr.setXYZ(i, state.position.x, state.position.y, state.position.z);
    }
    posAttr.needsUpdate = true;
  }

  updateLaserNetwork() {
    if (!this.showLasers || !this.laserLines) {
      this.laserLines.visible = false;
      return;
    }
    this.laserLines.visible = true;

    const laserPosAttr = this.laserLines.geometry.attributes.position;
    let lineIdx = 0;
    const maxLines = 1200;
    const satCount = this.satellites.length;

    // Connect adjacent satellites in same plane and neighboring planes
    for (let i = 0; i < satCount && lineIdx < maxLines; i += 2) {
      const p1x = this.satPositions[i * 3];
      const p1y = this.satPositions[i * 3 + 1];
      const p1z = this.satPositions[i * 3 + 2];

      // Intra-plane neighbor
      const nextIdx = (i + 1) % satCount;
      const p2x = this.satPositions[nextIdx * 3];
      const p2y = this.satPositions[nextIdx * 3 + 1];
      const p2z = this.satPositions[nextIdx * 3 + 2];

      const distSq = (p1x - p2x) ** 2 + (p1y - p2y) ** 2 + (p1z - p2z) ** 2;
      if (distSq < 150) { // Laser optical range limit
        laserPosAttr.setXYZ(lineIdx * 2, p1x, p1y, p1z);
        laserPosAttr.setXYZ(lineIdx * 2 + 1, p2x, p2y, p2z);
        lineIdx++;
      }
    }

    // Zero out unused lines
    for (let j = lineIdx; j < maxLines; j++) {
      laserPosAttr.setXYZ(j * 2, 0, 0, 0);
      laserPosAttr.setXYZ(j * 2 + 1, 0, 0, 0);
    }
    laserPosAttr.needsUpdate = true;
  }

  animate() {
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const deltaSec = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    if (!this.isPaused) {
      const stepSec = deltaSec * this.timeScale;
      this.simTimeSeconds += stepSec;
      this.earthRotationAngle += this.earthRotationSpeed * stepSec;
    }

    // Rotate Earth & Clouds
    if (this.earthGroup) {
      this.earthGroup.rotation.y = this.earthRotationAngle;
    }
    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y = this.earthRotationAngle * 1.15; // Clouds drift faster
    }

    // Update all Satellites
    const dummy = new THREE.Object3D();
    const count = this.satellites.length;
    let selectedState = null;

    for (let i = 0; i < count; i++) {
      const sat = this.satellites[i];
      const state = this.getSatelliteState(sat, this.simTimeSeconds);
      
      this.satPositions[i * 3] = state.position.x;
      this.satPositions[i * 3 + 1] = state.position.y;
      this.satPositions[i * 3 + 2] = state.position.z;

      dummy.position.copy(state.position);
      dummy.scale.setScalar(sat.isSpecial ? 2.5 : 1.0);
      dummy.updateMatrix();
      this.satMeshInstances.setMatrixAt(i, dummy.matrix);

      if (this.selectedSat && sat.id === this.selectedSat.id) {
        selectedState = state;
      }
    }
    this.satMeshInstances.instanceMatrix.needsUpdate = true;

    // Update Lasers
    this.updateLaserNetwork();

    // Selected Satellite Rig & Camera Sync
    if (selectedState) {
      this.satDetailGroup.position.copy(selectedState.position);
      
      // Orient Satellite: Nadir facing Earth (down), velocity facing forward
      const nadirDir = selectedState.position.clone().negate().normalize();
      const forwardDir = selectedState.velocity.clone().normalize();
      const rightDir = new THREE.Vector3().crossVectors(forwardDir, nadirDir).normalize();
      const correctedForward = new THREE.Vector3().crossVectors(nadirDir, rightDir).normalize();

      const rotMatrix = new THREE.Matrix4().makeBasis(rightDir, nadirDir.clone().negate(), correctedForward);
      this.satDetailGroup.quaternion.setFromRotationMatrix(rotMatrix);

      // Rotate Solar Array Wing toward Sun
      if (this.solarWingGroup) {
        const sunWorldDir = this.sunPosition.clone().normalize();
        this.solarWingGroup.lookAt(sunWorldDir);
      }

      // Thruster Plume pulse
      if (this.thrusterPlume) {
        const pulse = 1.0 + Math.sin(this.simTimeSeconds * 12) * 0.15;
        this.thrusterPlume.scale.set(pulse, pulse, pulse);
      }

      // Update Orbit Trail
      if (this.showOrbits) {
        this.orbitTrailLine.visible = true;
        this.updateOrbitTrail(selectedState);
      } else {
        this.orbitTrailLine.visible = false;
      }

      // Update Ground Footprint Cone
      if (this.showFootprint && this.groundFootprintCone) {
        this.groundFootprintCone.visible = true;
        this.groundFootprintCone.position.copy(selectedState.position);
        this.groundFootprintCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nadirDir);
      } else {
        this.groundFootprintCone.visible = false;
      }

      // Handle Camera Modes
      if (this.cameraMode === this.CAMERA_MODES.SATELLITE_POV) {
        // Position camera right at satellite's bottom recon optical sensor looking straight down at Nadir
        this.camera.position.copy(selectedState.position.clone().add(nadirDir.clone().multiplyScalar(0.5)));
        const lookTarget = selectedState.position.clone().add(nadirDir.clone().multiplyScalar(100));
        this.camera.lookAt(lookTarget);
        this.camera.up.copy(correctedForward); // Forward motion moves up the screen
      } else if (this.cameraMode === this.CAMERA_MODES.CHASE) {
        // Chase Cam behind satellite
        const chaseOffset = correctedForward.clone().multiplyScalar(-6.0).add(nadirDir.clone().multiplyScalar(-2.5));
        this.camera.position.copy(selectedState.position.clone().add(chaseOffset));
        this.camera.lookAt(selectedState.position.clone().add(correctedForward.clone().multiplyScalar(10)));
        this.camera.up.copy(nadirDir.clone().negate());
      } else if (this.cameraMode === this.CAMERA_MODES.TARGET_LOCK && this.targetWaypoint) {
        // Slew optical sensor at ground waypoint
        const targetWorldPos = this.latLonToVector3(this.targetWaypoint.lat, this.targetWaypoint.lon);
        // Apply Earth rotation to target
        targetWorldPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.earthRotationAngle);

        this.camera.position.copy(selectedState.position.clone().add(nadirDir.clone().multiplyScalar(0.5)));
        this.camera.lookAt(targetWorldPos);
        this.camera.up.copy(correctedForward);
      } else if (this.cameraMode === this.CAMERA_MODES.GLOBAL) {
        this.controls.update();
      }

      // Telemetry Callback for UI
      if (this.onTelemetryUpdate) {
        this.onTelemetryUpdate({
          satellite: this.selectedSat,
          state: selectedState,
          simTimeSeconds: this.simTimeSeconds
        });
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.OrbitEngine = OrbitEngine;
