/**
 * Ambient Three.js Hearth Embers & Coastal Mist Background
 * Tasteful, subtle atmospheric motion for Cinder & Tide
 */

(function () {
  const canvas = document.getElementById('ambient-hearth-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Particle System (Warm Woodfire Embers & Salty Sea Haze)
  const particleCount = 75;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = [];

  const colorPalette = [
    new THREE.Color('#f59e0b'), // Warm Amber
    new THREE.Color('#e07a5f'), // Hearth Ember
    new THREE.Color('#d97706'), // Deep Gold
    new THREE.Color('#78350f'), // Smoked Timber
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 140;
    const y = (Math.random() - 0.5) * 100 - 20;
    const z = (Math.random() - 0.5) * 60;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    sizes[i] = Math.random() * 2.5 + 0.8;

    velocities.push({
      vx: (Math.random() - 0.5) * 0.04,
      vy: Math.random() * 0.05 + 0.02,
      vz: (Math.random() - 0.5) * 0.02,
      swayFreq: Math.random() * 0.02 + 0.005,
      swayAmp: Math.random() * 0.3 + 0.1,
      baseX: x,
      age: Math.random() * 100
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Circular soft particle shader/texture
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 200, 150, 0.8)');
    gradient.addColorStop(0.7, 'rgba(240, 120, 60, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Mouse interactivity (subtle parallax)
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 12;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 8;
  }, { passive: true });

  let animationFrameId;
  let isVisible = true;

  // Visibility API for battery efficiency
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      lastTime = performance.now();
      animate();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });

  let lastTime = performance.now();

  function animate() {
    if (!isVisible) return;
    animationFrameId = requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) * 0.001;
    lastTime = now;

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX;
    camera.position.y = -mouseY;
    camera.lookAt(0, 0, 0);

    const posArray = geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const v = velocities[i];
      v.age += 0.02;

      // Vertical rise
      posArray[i * 3 + 1] += v.vy;

      // Horizontal subtle wave sway
      posArray[i * 3] = v.baseX + Math.sin(v.age * v.swayFreq * 10) * v.swayAmp * 5;

      // Reset when floating out of upper boundary
      if (posArray[i * 3 + 1] > 60) {
        posArray[i * 3 + 1] = -50;
        posArray[i * 3] = (Math.random() - 0.5) * 130;
        v.baseX = posArray[i * 3];
      }
    }

    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }, { passive: true });
})();
