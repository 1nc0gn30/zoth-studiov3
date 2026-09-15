/**
 * AURUM / V. KESTREL — Cinematic WebGL Engine (Awwwards / FWA Caliber)
 * Procedural Liquid Gold Ribbon with Simplex Noise GLSL, Kinetic Particle Vector Field & Chromatic Glint
 */

(function () {
  'use strict';

  // GLSL 3D Simplex Noise Shader Chunk
  const simplexNoiseGLSL = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `;

  // Custom Vertex Shader for Liquid Gold Ribbon
  const vertexShader = `
    ${simplexNoiseGLSL}

    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uIntensity;
    uniform float uVelocity;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;
    varying float vFresnel;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      float freq1 = 0.55;
      float freq2 = 1.25;
      float timeSlow = uTime * 0.38;
      
      // Multi-frequency wave turbulence
      float noise1 = snoise(vec3(pos.x * freq1 + timeSlow, pos.y * freq1, pos.z * freq1 + uScroll * 0.0012));
      float noise2 = snoise(vec3(pos.x * freq2 - timeSlow * 0.7, pos.y * freq2, pos.z * freq2));
      
      // Dynamic cursor inertia push
      float distToMouse = length(pos.xy - uMouse * 3.2);
      float mouseInfluence = smoothstep(3.8, 0.0, distToMouse) * (0.85 + uVelocity * 2.0);
      
      float totalDisplacement = (noise1 * 0.48 + noise2 * 0.22 + mouseInfluence) * uIntensity;
      vDisplacement = totalDisplacement;
      
      pos += normal * totalDisplacement;
      vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
      
      vec3 viewDir = normalize(-vPosition);
      vFresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Custom Fragment Shader with Anisotropic Reflectance & Cyan Rim Glint
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uGoldColor;
    uniform vec3 uCyanColor;
    uniform vec3 uLightPos;
    uniform float uVelocity;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vDisplacement;
    varying float vFresnel;

    void main() {
      vec3 viewDir = normalize(-vPosition);
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightPos - vPosition);
      
      // Diffuse term with soft shadow falloff
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Anisotropic Specular Highlight
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 42.0);
      
      // Metallic base with champagne tone
      vec3 goldBase = uGoldColor * (diff * 0.6 + 0.4);
      
      // Cyan iridescent rim glint (chromatic dispersion feel)
      vec3 cyanRim = uCyanColor * vFresnel * (0.8 + uVelocity * 1.5);
      
      // High-precision specular glint
      vec3 specularGlint = vec3(1.0, 0.97, 0.85) * spec * 1.8;
      
      // Displacement tint mapping
      vec3 displacementTint = mix(uGoldColor, uCyanColor, smoothstep(-0.35, 0.55, vDisplacement)) * 0.18;
      
      vec3 finalColor = goldBase + cyanRim + specularGlint + displacementTint;
      
      // Tranquil alpha falloff
      float alpha = smoothstep(0.0, 0.18, vFresnel + diff * 0.75 + 0.14);
      
      gl_FragColor = vec4(finalColor, min(alpha * 0.94, 0.98));
    }
  `;

  class WebGLHeroEngine {
    constructor() {
      this.container = document.getElementById('webgl-canvas-container');
      if (!this.container || typeof THREE === 'undefined') return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.ribbonMesh = null;
      this.particles = null;
      this.uniforms = null;
      this.clock = new THREE.Clock();

      // Mouse & Device coordinates with smooth spring inertia
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, lastX: 0, lastY: 0, velocity: 0 };
      this.gyro = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.scrollOffset = 0;
      this.targetScrollOffset = 0;

      // Dynamic Resolution Scaling (DRS)
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.frameCount = 0;
      this.lastTime = performance.now();
      this.fps = 60;

      this.init();
    }

    init() {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x050508, 0.075);

      const fov = 45;
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
      this.camera.position.set(0, 0, 8.5);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(this.dpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.18;
      this.container.appendChild(this.renderer.domElement);

      this.createRibbonArtifact();
      this.createParticleSwarm();
      this.setupLighting();
      this.bindEvents();
      this.animate();
    }

    createRibbonArtifact() {
      // Procedural Torus Knot with fine subdivision
      const isMobile = window.innerWidth < 768;
      const tubularSegments = isMobile ? 120 : 180;
      const radialSegments = isMobile ? 28 : 40;
      const geometry = new THREE.TorusKnotGeometry(2.1, 0.55, tubularSegments, radialSegments, 2, 3);

      this.uniforms = {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0.0 },
        uIntensity: { value: 1.0 },
        uVelocity: { value: 0.0 },
        uGoldColor: { value: new THREE.Color(0xd4af37) }, // Champagne Gold
        uCyanColor: { value: new THREE.Color(0x00e5ff) }, // Luminescent Cyan
        uLightPos: { value: new THREE.Vector3(5.0, 6.0, 7.0) }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: this.uniforms,
        transparent: true,
        side: THREE.DoubleSide
      });

      this.ribbonMesh = new THREE.Mesh(geometry, material);
      
      if (isMobile) {
        this.ribbonMesh.position.set(0, 0.3, -1.2);
        this.ribbonMesh.scale.set(0.72, 0.72, 0.72);
      } else {
        this.ribbonMesh.position.set(1.6, 0.1, 0);
        this.ribbonMesh.scale.set(1.0, 1.0, 1.0);
      }

      this.ribbonMesh.rotation.set(0.4, 0.2, 0.1);
      this.scene.add(this.ribbonMesh);
    }

    createParticleSwarm() {
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 800 : 1800;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorGold = new THREE.Color(0xd4af37);
      const colorLightGold = new THREE.Color(0xf3e5ab);
      const colorCyan = new THREE.Color(0x00e5ff);

      for (let i = 0; i < particleCount; i++) {
        const radius = 2.4 + Math.random() * 5.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 1.6;
        const y = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 1.6;
        const z = radius * Math.cos(phi) * 0.7 + (Math.random() - 0.5) * 2.2;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const pickedColor = Math.random() > 0.18 ? (Math.random() > 0.5 ? colorGold : colorLightGold) : colorCyan;
        colors[i * 3] = pickedColor.r;
        colors[i * 3 + 1] = pickedColor.g;
        colors[i * 3 + 2] = pickedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.042,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.particles = new THREE.Points(geometry, particleMat);
      this.particles.userData = { originalPositions };
      this.scene.add(this.particles);
    }

    setupLighting() {
      const ambientLight = new THREE.AmbientLight(0x0a0b0e, 1.4);
      this.scene.add(ambientLight);

      this.pointLight = new THREE.PointLight(0xd4af37, 2.6, 16);
      this.pointLight.position.set(4, 3, 5);
      this.scene.add(this.pointLight);

      this.cyanSubLight = new THREE.PointLight(0x00e5ff, 1.9, 14);
      this.cyanSubLight.position.set(-4, -3, 3);
      this.scene.add(this.cyanSubLight);
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Calculate pointer velocity
        const dx = e.clientX - this.mouse.lastX;
        const dy = e.clientY - this.mouse.lastY;
        this.mouse.velocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.015, 1.0);
        this.mouse.lastX = e.clientX;
        this.mouse.lastY = e.clientY;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
          this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
      }, { passive: true });

      window.addEventListener('scroll', () => {
        this.targetScrollOffset = window.scrollY;
      }, { passive: true });

      // iOS / Android Device Orientation (Gyroscope)
      if (window.DeviceOrientationEvent) {
        const handleOrientation = (e) => {
          if (e.gamma !== null && e.beta !== null) {
            this.gyro.targetX = (e.gamma / 45); // [-1, 1]
            this.gyro.targetY = ((e.beta - 45) / 45);
          }
        };

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          // iOS 13+ permission request trigger
          window.addEventListener('click', () => {
            DeviceOrientationEvent.requestPermission()
              .then(state => {
                if (state === 'granted') {
                  window.addEventListener('deviceorientation', handleOrientation, { passive: true });
                }
              })
              .catch(() => {});
          }, { once: true });
        } else {
          window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        }
      }

      window.addEventListener('resize', () => {
        this.onWindowResize();
      }, { passive: true });
    }

    onWindowResize() {
      if (!this.camera || !this.renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(this.dpr);

      if (width < 768) {
        this.ribbonMesh.position.set(0, 0.3, -1.2);
        this.ribbonMesh.scale.set(0.72, 0.72, 0.72);
      } else {
        this.ribbonMesh.position.set(1.6, 0.1, 0);
        this.ribbonMesh.scale.set(1.0, 1.0, 1.0);
      }
    }

    animate() {
      requestAnimationFrame(this.animate.bind(this));

      const elapsedTime = this.clock.getElapsedTime();
      const now = performance.now();
      this.frameCount++;

      // FPS & Dynamic Resolution Scaling (DRS)
      if (now - this.lastTime >= 1000) {
        this.fps = (this.frameCount * 1000) / (now - this.lastTime);
        this.frameCount = 0;
        this.lastTime = now;

        if (this.fps < 45 && this.dpr > 1.0) {
          this.dpr = 1.0;
          this.renderer.setPixelRatio(this.dpr);
        }
      }

      // Smooth inertia lerping
      const lerpFactor = 0.045;
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * lerpFactor;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * lerpFactor;
      this.gyro.x += (this.gyro.targetX - this.gyro.x) * lerpFactor;
      this.gyro.y += (this.gyro.targetY - this.gyro.y) * lerpFactor;
      this.mouse.velocity *= 0.92; // decay velocity

      this.scrollOffset += (this.targetScrollOffset - this.scrollOffset) * 0.06;

      // Update shader uniforms
      if (this.uniforms) {
        this.uniforms.uTime.value = elapsedTime;
        this.uniforms.uMouse.value.set(this.mouse.x + this.gyro.x * 0.5, this.mouse.y + this.gyro.y * 0.5);
        this.uniforms.uScroll.value = this.scrollOffset;
        this.uniforms.uVelocity.value = this.mouse.velocity;
      }

      // Rotate Ribbon Artifact
      if (this.ribbonMesh) {
        this.ribbonMesh.rotation.x = 0.35 + elapsedTime * 0.075 + (this.mouse.y + this.gyro.y) * 0.22;
        this.ribbonMesh.rotation.y = elapsedTime * 0.11 + (this.mouse.x + this.gyro.x) * 0.32 + this.scrollOffset * 0.0011;
        this.ribbonMesh.rotation.z = Math.sin(elapsedTime * 0.14) * 0.18;
      }

      // Dynamic Point Light tracking
      if (this.pointLight) {
        this.pointLight.position.x = 4.0 + this.mouse.x * 3.8;
        this.pointLight.position.y = 3.0 + this.mouse.y * 2.8;
        this.pointLight.position.z = 5.0 + Math.sin(elapsedTime * 0.45) * 1.2;
      }

      // Animate Kinetic Particle Swarm
      if (this.particles) {
        const positions = this.particles.geometry.attributes.position.array;
        const originals = this.particles.userData.originalPositions;
        const count = positions.length / 3;

        const cursorWorldX = this.mouse.x * 4.5;
        const cursorWorldY = this.mouse.y * 3.5;

        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const ox = originals[idx];
          const oy = originals[idx + 1];
          const oz = originals[idx + 2];

          const angle = elapsedTime * 0.05 + i * 0.004;
          const driftX = ox * Math.cos(angle) - oz * Math.sin(angle);
          const driftZ = ox * Math.sin(angle) + oz * Math.cos(angle);
          const driftY = oy + Math.sin(elapsedTime * 0.28 + i) * 0.12;

          const dx = positions[idx] - cursorWorldX;
          const dy = positions[idx + 1] - cursorWorldY;
          const distSq = dx * dx + dy * dy;

          if (distSq < 3.2) {
            const force = (3.2 - Math.sqrt(distSq)) * 0.11;
            positions[idx] += (dx / Math.sqrt(distSq)) * force;
            positions[idx + 1] += (dy / Math.sqrt(distSq)) * force;
          } else {
            positions[idx] += (driftX - positions[idx]) * 0.028;
            positions[idx + 1] += (driftY - positions[idx + 1]) * 0.028;
            positions[idx + 2] += (driftZ - positions[idx + 2]) * 0.028;
          }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Gentle Camera Parallax Sway
      this.camera.position.x = (this.mouse.x + this.gyro.x * 0.6) * 0.4;
      this.camera.position.y = (this.mouse.y + this.gyro.y * 0.6) * 0.3 - (this.scrollOffset * 0.00075);
      this.camera.lookAt(0, 0, 0);

      this.renderer.render(this.scene, this.camera);
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WebGLHeroEngine());
  } else {
    new WebGLHeroEngine();
  }
})();
