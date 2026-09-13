const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = '/home/neo/.gemini/antigravity-cli/brain/4c1ce0a3-92bf-4ef0-8a38-b125f49d4b27/scratch/promo_frames';
const OUTPUT_VIDEO = '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/media/zoth-studio-3d-logo-promo.mp4';
const AUDIO_TRACK = '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/audio/music/lucidbeatz-drift.mp3';

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

// Clean old frames
const oldFiles = fs.readdirSync(FRAMES_DIR);
for (const file of oldFiles) {
  fs.unlinkSync(path.join(FRAMES_DIR, file));
}

const TOTAL_FRAMES = 360; // 6 seconds @ 60 FPS
const FPS = 60;
const WIDTH = 1920;
const HEIGHT = 1080;

console.log(`Starting v2.0 Ultra 3D Logo Promo Video Render: ${TOTAL_FRAMES} frames @ ${FPS} FPS (${WIDTH}x${HEIGHT})...`);

const THREE_JS_CODE = fs.readFileSync('/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/vendor/three.min.js', 'utf-8');

const renderHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 45%, #0e172e 0%, #05070e 65%, #010204 100%);
      font-family: 'Figtree', -apple-system, sans-serif;
    }
    #stage {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
    }
    .hud-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 60px 80px;
      z-index: 10;
    }
    .hud-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hud-pill {
      font-family: "JetBrains Mono", monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #00f0ff;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.3);
      padding: 8px 18px;
      border-radius: 999px;
      box-shadow: 0 0 25px rgba(0, 240, 255, 0.2);
    }
    .hud-pill-gold {
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.08);
      border-color: rgba(251, 191, 36, 0.3);
      box-shadow: 0 0 25px rgba(251, 191, 36, 0.2);
    }
    .hud-bottom {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .hud-title {
      font-size: 46px;
      font-weight: 900;
      letter-spacing: 0.06em;
      color: #fff;
      text-transform: uppercase;
      text-shadow: 0 0 40px rgba(251, 191, 36, 0.5), 0 0 80px rgba(0, 240, 255, 0.3);
    }
    .hud-sub {
      font-family: "JetBrains Mono", monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #fbbf24;
    }
    .hud-ticker {
      display: flex;
      gap: 24px;
      margin-top: 6px;
      font-family: "JetBrains Mono", monospace;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }
    .hud-ticker span {
      color: #00f0ff;
    }
    .hud-footer-meta {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-family: "JetBrains Mono", monospace;
      font-size: 13px;
      color: #64748b;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="stage"></div>
  <div class="hud-overlay">
    <div class="hud-top">
      <div class="hud-pill">● QUANTUM 3D VOLUMETRIC ENGINE</div>
      <div class="hud-pill hud-pill-gold">21 AUTONOMOUS AGENTS</div>
    </div>
    <div class="hud-bottom">
      <div class="hud-title">ZOTH STUDIO</div>
      <div class="hud-sub">SOVEREIGN AI WORKSPACE &amp; 3D FORGE</div>
      <div class="hud-ticker" id="ticker-text">
        <span>⚡ 24K ALCHEMICAL GOLD PBR</span> • <span>3-TIER ASTROLABE</span> • <span>100% PRIVATE &amp; LOCAL</span>
      </div>
      <div class="hud-footer-meta">
        <div>ENDPOINT: <strong>127.0.0.1:8484</strong></div>
        <div>WEB: <strong>zoth.nullai.tech</strong></div>
        <div>SECURITY: <strong>ARGON2ID E2EE</strong></div>
      </div>
    </div>
  </div>

  <script>
    ${THREE_JS_CODE}
  </script>

  <script>
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, ${WIDTH} / ${HEIGHT}, 0.1, 100);
    camera.position.set(0, 0.4, 9.2);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(${WIDTH}, ${HEIGHT});
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.25;
    document.getElementById("stage").appendChild(renderer.domElement);

    // Root Hierarchy
    var rootGroup = new THREE.Group();
    scene.add(rootGroup);

    var zGroup = new THREE.Group();
    var astrolabeGroup = new THREE.Group();
    rootGroup.add(zGroup);
    rootGroup.add(astrolabeGroup);

    // Dynamic Procedural Studio Environment
    var envCanvas = document.createElement("canvas");
    envCanvas.width = 256; envCanvas.height = 256;
    var ctx = envCanvas.getContext("2d");
    var bg = ctx.createLinearGradient(0, 0, 256, 256);
    bg.addColorStop(0, "#1e1b18"); bg.addColorStop(0.5, "#05070e"); bg.addColorStop(1, "#020305");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256);
    var goldGlint = ctx.createRadialGradient(200, 50, 0, 200, 50, 110);
    goldGlint.addColorStop(0, "rgba(255, 245, 200, 1)"); goldGlint.addColorStop(0.4, "rgba(251, 191, 36, 0.7)"); goldGlint.addColorStop(1, "rgba(251, 191, 36, 0)");
    ctx.fillStyle = goldGlint; ctx.beginPath(); ctx.arc(200, 50, 110, 0, Math.PI * 2); ctx.fill();
    var cyanGlint = ctx.createRadialGradient(50, 200, 0, 50, 200, 90);
    cyanGlint.addColorStop(0, "rgba(0, 240, 255, 0.9)"); cyanGlint.addColorStop(0.5, "rgba(56, 189, 248, 0.4)"); cyanGlint.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = cyanGlint; ctx.beginPath(); ctx.arc(50, 200, 90, 0, Math.PI * 2); ctx.fill();
    var envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTex;

    // Outer Z Shape
    var scale = 0.092;
    var shape = new THREE.Shape();
    shape.moveTo(-18 * scale, 22 * scale);
    shape.lineTo(20 * scale, 22 * scale);
    shape.quadraticCurveTo(24 * scale, 22 * scale, 23 * scale, 18 * scale);
    shape.lineTo(-10 * scale, -14 * scale);
    shape.lineTo(20 * scale, -14 * scale);
    shape.quadraticCurveTo(24 * scale, -14 * scale, 24 * scale, -18 * scale);
    shape.quadraticCurveTo(24 * scale, -22 * scale, 20 * scale, -22 * scale);
    shape.lineTo(-20 * scale, -22 * scale);
    shape.quadraticCurveTo(-24 * scale, -22 * scale, -23 * scale, -18 * scale);
    shape.lineTo(10 * scale, 14 * scale);
    shape.lineTo(-18 * scale, 14 * scale);
    shape.quadraticCurveTo(-22 * scale, 14 * scale, -22 * scale, 18 * scale);
    shape.quadraticCurveTo(-22 * scale, 22 * scale, -18 * scale, 22 * scale);

    var extrudeSettings = {
      steps: 2,
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.26,
      bevelSize: 0.22,
      bevelOffset: 0,
      bevelSegments: 5
    };

    var geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    var goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0x3d1a00,
      metalness: 0.96,
      roughness: 0.14,
      envMap: envTex,
      envMapIntensity: 1.8
    });

    var zMesh = new THREE.Mesh(geom, goldMaterial);
    zGroup.add(zMesh);

    // Inner Quantum Wireframe Core
    var innerShape = new THREE.Shape();
    var iscale = 0.082;
    innerShape.moveTo(-18 * iscale, 22 * iscale);
    innerShape.lineTo(20 * iscale, 22 * iscale);
    innerShape.quadraticCurveTo(24 * iscale, 22 * iscale, 23 * iscale, 18 * iscale);
    innerShape.lineTo(-10 * iscale, -14 * iscale);
    innerShape.lineTo(20 * iscale, -14 * iscale);
    innerShape.quadraticCurveTo(24 * iscale, -14 * iscale, 24 * iscale, -18 * iscale);
    innerShape.quadraticCurveTo(24 * iscale, -22 * iscale, 20 * iscale, -22 * iscale);
    innerShape.lineTo(-20 * iscale, -22 * iscale);
    innerShape.quadraticCurveTo(-24 * iscale, -22 * iscale, -23 * iscale, -18 * iscale);
    innerShape.lineTo(10 * iscale, 14 * iscale);
    innerShape.lineTo(-18 * iscale, 14 * iscale);
    innerShape.quadraticCurveTo(-22 * iscale, 14 * iscale, -22 * iscale, 18 * iscale);
    innerShape.quadraticCurveTo(-22 * iscale, 22 * iscale, -18 * iscale, 22 * iscale);

    var innerGeom = new THREE.ExtrudeGeometry(innerShape, { steps: 1, depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 });
    innerGeom.center();
    var coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    var coreMesh = new THREE.Mesh(innerGeom, coreMat);
    zGroup.add(coreMesh);

    // 3-Tier Concentric Astrolabe Gimbal Rings
    var ring1Geom = new THREE.TorusGeometry(3.3, 0.048, 12, 64);
    var ring1Mat = new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfde047, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.2 });
    var ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    astrolabeGroup.add(ring1);

    var ring2Geom = new THREE.TorusGeometry(2.7, 0.038, 10, 48);
    var ring2Mat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.15 });
    var ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 3.8;
    astrolabeGroup.add(ring2);

    var ring3Geom = new THREE.TorusGeometry(2.1, 0.025, 8, 36);
    var ring3Mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    var ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.z = Math.PI / 4;
    astrolabeGroup.add(ring3);

    // Cardinal Nodes & Satellites
    var nodesGroup = new THREE.Group();
    var nodeGeom = new THREE.SphereGeometry(0.14, 16, 16);
    var goldNodeMat = new THREE.MeshBasicMaterial({ color: 0xfff7cc });
    var cyanNodeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    var nTop = new THREE.Mesh(nodeGeom, goldNodeMat); nTop.position.set(0, 3.3, 0);
    var nBtm = new THREE.Mesh(nodeGeom, goldNodeMat); nBtm.position.set(0, -3.3, 0);
    var nLeft = new THREE.Mesh(nodeGeom, cyanNodeMat); nLeft.position.set(-3.3, 0, 0);
    var nRight = new THREE.Mesh(nodeGeom, cyanNodeMat); nRight.position.set(3.3, 0, 0);
    nodesGroup.add(nTop, nBtm, nLeft, nRight);
    astrolabeGroup.add(nodesGroup);

    // Satellite Drone
    var satGeom = new THREE.SphereGeometry(0.16, 16, 16);
    var satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var satellite = new THREE.Mesh(satGeom, satMat);
    astrolabeGroup.add(satellite);

    // 240-Particle Quantum Stardust Vortex
    var pCount = 240;
    var pGeom = new THREE.BufferGeometry();
    var pPos = new Float32Array(pCount * 3);
    var pCol = new Float32Array(pCount * 3);
    var cGold = new THREE.Color(0xfbbf24);
    var cCyan = new THREE.Color(0x00f0ff);
    var cWhite = new THREE.Color(0xffffff);

    for (var i = 0; i < pCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos((Math.random() * 2) - 1);
      var r = 1.9 + Math.random() * 3.0;
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);

      var pick = Math.random();
      var c = pick < 0.5 ? cGold : (pick < 0.85 ? cCyan : cWhite);
      pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    // Radial Gradient Particle Texture
    var ptCanvas = document.createElement("canvas"); ptCanvas.width = 64; ptCanvas.height = 64;
    var pctx = ptCanvas.getContext("2d");
    var pgrad = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pgrad.addColorStop(0, "rgba(255,255,255,1)");
    pgrad.addColorStop(0.3, "rgba(251,191,36,0.9)");
    pgrad.addColorStop(0.6, "rgba(0,240,255,0.4)");
    pgrad.addColorStop(1, "rgba(0,0,0,0)");
    pctx.fillStyle = pgrad; pctx.fillRect(0, 0, 64, 64);

    var pMat = new THREE.PointsMaterial({
      size: 0.22,
      map: new THREE.CanvasTexture(ptCanvas),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    var particles = new THREE.Points(pGeom, pMat);
    rootGroup.add(particles);

    // Lighting
    var ambient = new THREE.AmbientLight(0x1e293b, 2.0);
    scene.add(ambient);

    var keyLight = new THREE.DirectionalLight(0xfff7cc, 4.0);
    keyLight.position.set(6, 8, 10);
    scene.add(keyLight);

    var cyanRim = new THREE.PointLight(0x00f0ff, 3.4, 20);
    cyanRim.position.set(-8, -4, 6);
    scene.add(cyanRim);

    var goldFill = new THREE.PointLight(0xf59e0b, 2.5, 18);
    goldFill.position.set(4, -6, 4);
    scene.add(goldFill);

    // Global step function for exact deterministic frame rendering
    window.renderFrame = function(frameIndex) {
      var t = (frameIndex / ${FPS});
      var progress = frameIndex / ${TOTAL_FRAMES};

      // Cinematic Camera Orbital Sweep & Drift
      var camDist = 9.2 + Math.sin(t * 1.5) * 0.4;
      var camAngle = (t * 0.55);
      camera.position.x = Math.sin(camAngle) * 2.8;
      camera.position.y = 0.4 + Math.sin(t * 1.2) * 0.3;
      camera.position.z = Math.cos(camAngle) * 2.8 + camDist;
      camera.lookAt(0, 0.1, 0);

      // 3D Logo Rotation & Celestial Mechanics
      rootGroup.rotation.y = (t * 1.4);
      rootGroup.rotation.x = Math.sin(t * 0.9) * 0.18;
      rootGroup.rotation.z = Math.cos(t * 0.7) * 0.10;
      rootGroup.position.y = Math.sin(t * 1.8) * 0.16;

      // Astrolabe Gimbal Rings
      ring1.rotation.z = t * 1.6;
      ring2.rotation.z = -t * 1.3;
      ring3.rotation.x = t * 1.9;
      nodesGroup.rotation.z = t * 1.1;

      // Satellite Drone Orbit
      satellite.position.x = Math.sin(t * 2.2) * 3.4;
      satellite.position.y = Math.cos(t * 1.1) * 2.6;
      satellite.position.z = Math.sin(t * 1.7) * 3.0;

      // Core Pulse Luminescence
      coreMat.emissiveIntensity = 0.6 + Math.sin(t * 4.0) * 0.35;

      // Particle Vortex Update
      var pos = pGeom.attributes.position.array;
      for (var i = 0; i < pCount; i++) {
        var px = pos[i * 3];
        var py = pos[i * 3 + 1];
        var pz = pos[i * 3 + 2];
        var angle = 0.016 + (i % 5) * 0.004;
        var cosA = Math.cos(angle);
        var sinA = Math.sin(angle);
        pos[i * 3] = px * cosA - pz * sinA;
        pos[i * 3 + 2] = px * sinA + pz * cosA;
        pos[i * 3 + 1] = py + Math.sin(t * 2.0 + i) * 0.006;
      }
      pGeom.attributes.position.needsUpdate = true;

      // Supernova Glint Flare at t = 2.0s & t = 4.2s
      var glint1 = Math.max(0, 1.0 - Math.abs(t - 2.0) * 4.0);
      var glint2 = Math.max(0, 1.0 - Math.abs(t - 4.2) * 4.0);
      keyLight.intensity = 4.0 + (glint1 * 7.0) + (glint2 * 6.0);

      // Ticker updates
      var ticker = document.getElementById("ticker-text");
      if (t < 2.0) {
        ticker.innerHTML = '<span>⚡ 24K ALCHEMICAL GOLD PBR</span> • <span>3-TIER ASTROLABE</span> • <span>100% PRIVATE &amp; LOCAL</span>';
      } else if (t < 4.0) {
        ticker.innerHTML = '<span>🔮 21 SOVEREIGN AI AGENTS</span> • <span>LOCAL LLM ORCHESTRATION</span> • <span>BYOK ARGON2ID</span>';
      } else {
        ticker.innerHTML = '<span>🌐 WEBGPU SWARM ARENA</span> • <span>SIMPLEX E2EE COMMUNICATOR</span> • <span>0% CLOUD LEAKAGE</span>';
      }

      renderer.render(scene, camera);
    };
  </script>
</body>
</html>
`;

async function generatePromoVideo() {
  console.log('Launching headless browser with WebGL...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=gl-egl'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.setContent(renderHtml, { waitUntil: 'load' });

  // Warm-up renderer
  await page.evaluate(() => window.renderFrame(0));
  await new Promise(r => setTimeout(r, 500));

  console.log(`Capturing ${TOTAL_FRAMES} frames @ 60 FPS...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate((frameIdx) => {
      window.renderFrame(frameIdx);
    }, i);

    const frameNum = String(i).padStart(4, '0');
    const framePath = path.join(FRAMES_DIR, `frame_${frameNum}.png`);
    await page.screenshot({ path: framePath, type: 'png' });

    if (i % 60 === 0 || i === TOTAL_FRAMES - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = Math.round(((i + 1) / TOTAL_FRAMES) * 100);
      console.log(`[Frame ${i + 1}/${TOTAL_FRAMES}] ${pct}% complete (${elapsed}s elapsed)`);
    }
  }

  await browser.close();
  console.log(`All ${TOTAL_FRAMES} frames rendered in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);

  // Encode with ffmpeg + audio
  console.log('Encoding video with ffmpeg (H.264 High Profile, 60 FPS + Stereo AAC Audio)...');
  const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.png" -i "${AUDIO_TRACK}" -t 6.0 -c:v libx264 -pix_fmt yuv420p -preset medium -crf 17 -c:a aac -b:a 192k -af "afade=t=in:st=0:d=0.5,afade=t=out:st=5.4:d=0.6" "${OUTPUT_VIDEO}"`;

  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Clean frames scratch directory to save disk space
  console.log('Cleaning temporary scratch frames...');
  const renderedFiles = fs.readdirSync(FRAMES_DIR);
  for (const file of renderedFiles) {
    fs.unlinkSync(path.join(FRAMES_DIR, file));
  }

  console.log('🎉 3D Promo Video Generation Complete!');
  console.log(`Output: ${OUTPUT_VIDEO}`);
}

generatePromoVideo().catch(err => {
  console.error('Error generating promo video:', err);
  process.exit(1);
});
