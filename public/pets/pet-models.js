/**
 * Zoth Pets — High-Fidelity 3D Neon Figurine & Volumetric Hologram Engine (v3.2 Ultra)
 * 
 * Accurately renders the vivid neon character artwork with physical relief embossing,
 * beveled obsidian chassis, glowing dynamic rim shaders, orbiting celestial aura rings,
 * live task vibe kinetic systems, interactive gaze tracking, and material tuning.
 */

export const SVG_PET_IDS = new Set([
  "glitchcat",
  "circuit-pup",
  "terminal-ghost",
  "savage-codex",
  "ai-workbot",
  "binary",
]);

export const PET_SPECIES = {
  kai: {
    depth: 0.42, scale: 1.04, vibeColor: "#00e5ff",
    name: "Kai", species: "Holographic Cat", domain: "build",
    role: "Site Inspector & A11y Auditor",
    harness: "@kai (Chrome DevTools MCP)",
    harnessType: "kai",
    desc: "Live DOM inspection, WCAG 2.2 accessibility verification, and performance profiling."
  },
  draco: {
    depth: 0.46, scale: 1.08, vibeColor: "#ffaa00",
    name: "Draco", species: "Cyber Dragon", domain: "build",
    role: "JSON Schemas, Contracts & DAG Tools",
    harness: "@hermes (Hermes Agent CLI)",
    harnessType: "hermes",
    desc: "Contract verification, multi-agent function calling, and visual DAG playbooks."
  },
  athena: {
    depth: 0.40, scale: 1.02, vibeColor: "#a855f7",
    name: "Athena", species: "Mecha Owl", domain: "knowledge",
    role: "Knowledge Graph & AEO Architect",
    harness: "@athena (llms.txt & Obsidian Graph)",
    harnessType: "athena",
    desc: "Answer Engine Optimization, llms.txt indexer, and semantic retrieval vector pipelines."
  },
  lycan: {
    depth: 0.42, scale: 1.05, vibeColor: "#10b981",
    name: "Lycan", species: "Cybernetic Wolf", domain: "security",
    role: "Lead Security Architect & AST Enforcer",
    harness: "@antigravity (Google Antigravity agy CLI)",
    harnessType: "antigravity",
    desc: "Autonomous security sentinel enforcing Python AST boundaries, zero-trust loopback isolation, and memory leak analysis."
  },
  ignis: {
    depth: 0.44, scale: 1.06, vibeColor: "#ff007a",
    name: "Ignis", species: "Neon Phoenix", domain: "build",
    role: "Refactoring & WASM Specialist",
    harness: "@ignis (Local WASM Engine)",
    harnessType: "ignis",
    desc: "High-performance code refactoring, Rust WASM acceleration, and profiling."
  },
  kitsune: {
    depth: 0.42, scale: 1.05, vibeColor: "#ff7700",
    name: "Kitsune", species: "Cyber Fox", domain: "creative",
    role: "High-Throughput Execution & Taste",
    harness: "@grok (xAI Grok CLI)",
    harnessType: "grok",
    desc: "Rapid codebase generation, GitHub Octokit live tool harness, and motion design synthesis."
  },
  "pixel-neko": {
    depth: 0.46, scale: 1.0, voxel: true, vibeColor: "#00f0ff",
    name: "Pixel-Neko", species: "16-Bit Retro Cat", domain: "ops",
    role: "Tool Registry Indexer",
    harness: "@registry (47+ Chained Tool Indexer)",
    harnessType: "registry",
    desc: "Contract-validated registry indexer for 47+ chained tools."
  },
  "pixel-shiba": {
    depth: 0.42, scale: 1.02, voxel: true, vibeColor: "#ffcc00",
    name: "Pixel-Shiba", species: "16-Bit Cyber Doge", domain: "ops",
    role: "Vault Guardian & Keymaster",
    harness: "@vault (Argon2id Vault Daemon on :8787)",
    harnessType: "vault",
    desc: "Protects BYOK cryptographic credentials on local loopback."
  },
  "radical-minion": {
    depth: 0.42, scale: 1.0, vibeColor: "#00d4aa",
    name: "Radical Minion", species: "Hermes Autonomous Partner", domain: "autonomy",
    role: "Hermes Autonomous Executor",
    harness: "@hermes (Hermes Autonomous Engine)",
    harnessType: "hermes",
    desc: "Autonomous step-by-step task execution."
  },
  "ai-workbot": {
    depth: 0.38, scale: 1.0, vibeColor: "#6366f1",
    name: "Workbot", species: "Task Robot", domain: "autonomy",
    role: "Local Neural Weights Engine",
    harness: "@ollama (Ollama Local Weights on :11434)",
    harnessType: "ollama",
    desc: "Zero-cloud private local inference (qwen2.5-coder, hermes-3)."
  },
  zoth: {
    depth: 0.48, scale: 1.12, vibeColor: "#fbbf24",
    name: "Azoth", species: "Hermetic Sovereign Core", domain: "autonomy",
    role: "Master Antigravity Architect",
    harness: "@azoth (Google Antigravity agy CLI)",
    harnessType: "antigravity",
    desc: "Primary autonomous Antigravity coding agent with full codebase reasoning & terminal execution."
  },
  azoth: {
    depth: 0.48, scale: 1.12, vibeColor: "#fbbf24",
    name: "Azoth", species: "Hermetic Sovereign Core", domain: "autonomy",
    role: "Master Antigravity Architect",
    harness: "@azoth (Google Antigravity agy CLI)",
    harnessType: "antigravity",
    desc: "Primary autonomous Antigravity coding agent with full codebase reasoning & terminal execution."
  },
  aquila: {
    depth: 0.44, scale: 1.05, vibeColor: "#00f0ff",
    name: "Aquila", species: "Cyber Eagle", domain: "edge",
    role: "Global Edge Dispatcher",
    harness: "@edge (Edge CDN & DNS Mapper)",
    harnessType: "edge",
    desc: "Global edge dispatching and latency routing."
  },
  leviathan: {
    depth: 0.46, scale: 1.08, vibeColor: "#06b6d4",
    name: "Leviathan", species: "Cyber Whale", domain: "knowledge",
    role: "Deep Tensor & Vector Memory",
    harness: "@memory (Vector Store)",
    harnessType: "memory",
    desc: "Multi-modal vector indexing and long-context RAG memory."
  },
  onyx: {
    depth: 0.44, scale: 1.05, vibeColor: "#ff007a",
    name: "Onyx", species: "Shadow Panther", domain: "security",
    role: "Stealth Recon & Red Team",
    harness: "@subsweep (SubSweep OSINT Recon)",
    harnessType: "subsweep",
    desc: "Autonomous penetration testing and port discovery."
  },
  chronos: {
    depth: 0.44, scale: 1.05, vibeColor: "#38bdf8",
    name: "Chronos", species: "Cyber Stag", domain: "build",
    role: "Temporal DAG & Git Navigator",
    harness: "@git (Git DAG Engine)",
    harnessType: "git",
    desc: "Version history visualization and branch arbitration."
  },
  aether: {
    depth: 0.48, scale: 1.10, vibeColor: "#fbbf24",
    name: "Aether", species: "Cyber Griffin", domain: "autonomy",
    role: "Swarm Overlord & Conductor",
    harness: "@swarm (Swarm IPC Bus)",
    harnessType: "swarm",
    desc: "Multi-agent dialectic arbitration."
  },
  kraken: {
    depth: 0.45, scale: 1.04, vibeColor: "#00f0ff",
    name: "Kraken", species: "Cyber Octopus", domain: "security",
    role: "Deep Packet Sniffer",
    harness: "@radare2 (Binary Disassembler)",
    harnessType: "disassembler",
    desc: "Network packet inspection and binary reverse engineering."
  },
  scorpius: {
    depth: 0.42, scale: 1.02, vibeColor: "#00e5ff",
    name: "Scorpius", species: "Cyber Scorpion", domain: "security",
    role: "Zero-Day Penetration Tester",
    harness: "@subsweep (OSINT Recon Engine)",
    harnessType: "osint",
    desc: "Subdomain discovery, TLS cipher audits, and attack surface mapping."
  },
  ghostbyte: {
    depth: 0.42, scale: 1.05, vibeColor: "#00e5ff",
    name: "Ghostbyte", species: "NullAI Ghost", domain: "autonomy",
    role: "Quantum Shader & Swarm Weaver",
    harness: "@webgpu (GPU Shader Engine)",
    harnessType: "shader",
    desc: "WebGL/WebGPU hardware acceleration."
  },
  glitchcat: {
    depth: 0.38, scale: 0.98, vibeColor: "#ff0055",
    name: "Glitchcat", species: "RGB Glitch Cat", domain: "creative",
    role: "Chaos Disruptor & UI Polisher",
    harness: "@creative (CSS FX Generator)",
    harnessType: "creative",
    desc: "Procedural CSS effects and glitch shaders."
  },
  "circuit-pup": {
    depth: 0.40, scale: 1.02, vibeColor: "#00ffff",
    name: "Circuit Pup", species: "LED Circuit Dog", domain: "ops",
    role: "Port & Daemon Sniffer",
    harness: "@network (Socket Scanner)",
    harnessType: "network",
    desc: "Loopback socket health monitoring."
  },
  "terminal-ghost": {
    depth: 0.36, scale: 1.0, vibeColor: "#38bdf8",
    name: "Terminal Ghost", species: "Phosphor Spirit", domain: "ops",
    role: "Terminal Trace Verifier",
    harness: "@terminal (PTY Multiplexer)",
    harnessType: "terminal",
    desc: "Live PTY session streaming."
  },
  "savage-codex": {
    depth: 0.38, scale: 1.0, vibeColor: "#eab308",
    name: "Savage Codex", species: "Hacker Familiar", domain: "security",
    role: "Diff Threat Modeler",
    harness: "@diff (AST Threat Scanner)",
    harnessType: "diff",
    desc: "Git commit diff security auditing."
  },
  binary: {
    depth: 0.36, scale: 1.02, vibeColor: "#22c55e",
    name: "Binary", species: "Data Spirit", domain: "knowledge",
    role: "Schema & Connector Verifier",
    harness: "@schema (JSON Validator)",
    harnessType: "schema",
    desc: "Live JSON-RPC contract validation."
  }
};

export const TASK_VIBES = {
  idle: { name: "Idle / Rest", color: "#38bdf8", speed: 1.0, energy: 0.4, desc: "Gentle harmonic levitation & ambient stardust breathing." },
  coding: { name: "Coding / Build", color: "#00f0ff", speed: 2.6, energy: 1.2, desc: "Agile matrix pulsation, vertical data streams & compiler spark bursts." },
  security: { name: "Security / Scan", color: "#10b981", speed: 1.8, energy: 1.0, desc: "Rotating sentinel shield rings & sweeping conical radar sweeps." },
  aeo: { name: "AEO / Knowledge", color: "#a855f7", speed: 1.4, energy: 0.9, desc: "Celestial levitation & rotating sacred geometry knowledge halo." },
  fusion: { name: "Fusion / Swarm", color: "#ffaa40", speed: 2.2, energy: 1.4, desc: "Dual counter-rotating golden & cyan plasma vortex rings." },
  celebrate: { name: "Shipped / Victory", color: "#ff007a", speed: 3.2, energy: 1.8, desc: "Spiral victory launch, chromatic bounce & sparkling burst particles." }
};

export function petPortrait(id) {
  if (id === "azoth" || id === "zoth") return "/assets/mascot/azoth-quantum-orb.jpg";
  if (SVG_PET_IDS.has(id)) return `/assets/pets/${id}.svg`;
  return `/assets/pets/${id}-neon.jpg`;
}

export function loadPetTexture(THREE, url) {
  return new Promise((resolve) => {
    const finish = (tex) => {
      if (!tex) {
        resolve(null);
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      resolve(tex);
    };

    if (String(url).toLowerCase().endsWith(".svg")) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        const size = 1024;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.7);
        grad.addColorStop(0, "#0a0f24");
        grad.addColorStop(1, "#030408");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 30;
        ctx.drawImage(img, size * 0.12, size * 0.12, size * 0.76, size * 0.76);
        finish(new THREE.CanvasTexture(c));
      };
      img.onerror = () => resolve(null);
      img.src = url;
      return;
    }

    new THREE.TextureLoader().load(url, finish, undefined, () => resolve(null));
  });
}

export function fallbackPetTexture(THREE, hex = "#0a0f24") {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "#00f0ff";
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 232, 232);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds high-fidelity volumetric cyber figurine.
 * Supports dual calling conventions:
 * 1) createPetFigure(THREE, { id, color, texture, style, initialVibe, withAura })
 * 2) createPetFigure(THREE, texture, options)
 */
export function createPetFigure(THREE, arg1, arg2 = {}) {
  let tex = null;
  let opts = {};

  if (arg1 && arg1.isTexture) {
    tex = arg1;
    opts = arg2 || {};
  } else if (arg1 && typeof arg1 === "object") {
    opts = arg1;
    tex = opts.texture || (arg2 && arg2.isTexture ? arg2 : null);
  } else {
    opts = arg2 || {};
  }

  const id = opts.id || "kai";
  const spec = PET_SPECIES[id] || {};
  const color = opts.color !== undefined ? opts.color : (spec.vibeColor || 0x00f0ff);
  const depth = opts.depth !== undefined ? opts.depth : (spec.depth || 0.42);
  const scale = opts.scale !== undefined ? opts.scale : (spec.scale || 1.0);
  const style = opts.style || (spec.voxel ? "voxel" : "realistic");
  const withAura = opts.withAura !== false;
  let currentVibe = opts.initialVibe || opts.vibe || "idle";

  if (!tex) {
    tex = fallbackPetTexture(THREE);
  }

  const root = new THREE.Group();
  const hitMeshes = [];
  const disposers = [];
  const cColor = new THREE.Color(color);

  // Dimensions
  const width = 2.15 * scale;
  const height = 2.15 * scale;
  const panelDepth = depth * 0.38;

  let frontMat, backMat, chassisMat, rimMat;
  let frontMesh, backMesh, chassisMesh, rimMesh;
  let ring1, ring2, particles, scanBeam;

  if (style === "hologram") {
    // Hologram Laser Grid Wireframe
    const holoGeo = new THREE.PlaneGeometry(width, height, 48, 48);
    frontMat = new THREE.MeshBasicMaterial({
      map: tex,
      color: cColor,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    frontMesh = new THREE.Mesh(holoGeo, frontMat);
    root.add(frontMesh);
    hitMeshes.push(frontMesh);

    // Laser Scan Beam
    const scanGeo = new THREE.PlaneGeometry(width * 1.1, 0.08);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    scanBeam = new THREE.Mesh(scanGeo, scanMat);
    root.add(scanBeam);
    disposers.push(() => { holoGeo.dispose(); frontMat.dispose(); scanGeo.dispose(); scanMat.dispose(); });

  } else if (style === "voxel") {
    // 3D Voxelized Extruded Matrix
    const voxelGroup = new THREE.Group();
    const vGrid = 18;
    const vSize = width / vGrid;
    const boxGeo = new THREE.BoxGeometry(vSize * 0.92, vSize * 0.92, panelDepth * 0.85);
    const vMat = new THREE.MeshStandardMaterial({
      color: cColor,
      roughness: 0.25,
      metalness: 0.5,
      emissive: cColor,
      emissiveIntensity: 0.35
    });

    for (let x = 0; x < vGrid; x++) {
      for (let y = 0; y < vGrid; y++) {
        const dx = (x / vGrid - 0.5) * 2;
        const dy = (y / vGrid - 0.5) * 2;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0.94) {
          const mesh = new THREE.Mesh(boxGeo, vMat);
          mesh.position.set((x - vGrid/2 + 0.5) * vSize, (y - vGrid/2 + 0.5) * vSize, 0);
          voxelGroup.add(mesh);
        }
      }
    }
    root.add(voxelGroup);
    hitMeshes.push(voxelGroup);
    disposers.push(() => { boxGeo.dispose(); vMat.dispose(); });

  } else {
    // Realistic Collectible Volumetric Figurine (Default)
    const frontGeo = new THREE.PlaneGeometry(width, height, 64, 64);
    const pos = frontGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) / width + 0.5;
      const v = 0.5 - pos.getY(i) / height;
      const du = (u - 0.5) * 2;
      const dv = (v - 0.5) * 2;
      const r = Math.min(1.0, Math.hypot(du, dv));
      const dome = Math.cos(r * (Math.PI / 2));
      pos.setZ(i, dome * panelDepth * 0.5);
    }
    frontGeo.computeVertexNormals();

    frontMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: cColor,
      emissiveMap: tex,
      emissiveIntensity: 0.45,
      roughness: 0.18,
      metalness: 0.22,
      side: THREE.FrontSide
    });

    frontMesh = new THREE.Mesh(frontGeo, frontMat);
    frontMesh.position.z = panelDepth * 0.4;
    root.add(frontMesh);
    hitMeshes.push(frontMesh);

    // Symmetrical Back Plate
    const backGeo = frontGeo.clone();
    const bPos = backGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) bPos.setZ(i, -bPos.getZ(i));
    backGeo.computeVertexNormals();

    backMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: cColor,
      emissiveIntensity: 0.28,
      roughness: 0.3,
      metalness: 0.6,
      side: THREE.BackSide
    });
    backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -panelDepth * 0.4;
    backMesh.rotation.y = Math.PI;
    root.add(backMesh);
    hitMeshes.push(backMesh);

    // Beveled Obsidian Chassis
    const chassisGeo = new THREE.CylinderGeometry(width * 0.56, width * 0.56, panelDepth * 1.1, 48);
    chassisGeo.rotateX(Math.PI / 2);
    chassisMat = new THREE.MeshStandardMaterial({
      color: 0x060812,
      roughness: 0.2,
      metalness: 0.88,
      emissive: 0x020308
    });
    chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    root.add(chassisMesh);

    // Glowing Neon Chamfer Rim
    const rimGeo = new THREE.TorusGeometry(width * 0.57, 0.032, 16, 64);
    rimMat = new THREE.MeshBasicMaterial({
      color: cColor,
      transparent: true,
      opacity: 0.92
    });
    rimMesh = new THREE.Mesh(rimGeo, rimMat);
    root.add(rimMesh);

    disposers.push(() => {
      frontGeo.dispose(); frontMat.dispose();
      backGeo.dispose(); backMat.dispose();
      chassisGeo.dispose(); chassisMat.dispose();
      rimGeo.dispose(); rimMat.dispose();
    });
  }

  // Orbiting Celestial Rings & Particles
  if (withAura) {
    const ring1Geo = new THREE.TorusGeometry(width * 0.78, 0.016, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: cColor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    root.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(width * 0.88, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    root.add(ring2);

    const particleCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = width * (0.65 + Math.random() * 0.5);
      pPositions[i * 3] = Math.cos(angle) * rad;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * height * 0.85;
      pPositions[i * 3 + 2] = Math.sin(angle) * rad;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: cColor,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(pGeo, pMat);
    root.add(particles);

    disposers.push(() => {
      ring1Geo.dispose(); ring1Mat.dispose();
      ring2Geo.dispose(); ring2Mat.dispose();
      pGeo.dispose(); pMat.dispose();
    });
  }

  root.position.y = 0.98;

  // Gaze Tracking state
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;

  return {
    group: root,
    hitMeshes,
    disposers,
    ring1,
    ring2,
    particles,
    frontMat,
    backMat,
    chassisMat,
    rimMat,
    setVibe(vibeName) {
      currentVibe = vibeName;
    },
    setGaze(normX, normY) {
      targetTiltY = (normX || 0) * 0.35;
      targetTiltX = -(normY || 0) * 0.25;
    },
    setMaterialParams({ roughness, metalness, emissiveIntensity, colorHex }) {
      if (frontMat) {
        if (roughness !== undefined) frontMat.roughness = roughness;
        if (metalness !== undefined) frontMat.metalness = metalness;
        if (emissiveIntensity !== undefined) frontMat.emissiveIntensity = emissiveIntensity;
        if (colorHex) {
          frontMat.emissive.set(colorHex);
          if (rimMat) rimMat.color.set(colorHex);
          if (ring1) ring1.material.color.set(colorHex);
        }
      }
    },
    tick(time, delta = 0.016) {
      const vibeData = TASK_VIBES[currentVibe] || TASK_VIBES.idle;
      const speed = vibeData.speed || 1.0;
      const energy = vibeData.energy || 0.6;

      // Smooth gaze interpolation
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      root.rotation.x = currentTiltX + Math.sin(time * 1.5 * speed) * 0.03 * energy;
      root.rotation.z = Math.cos(time * 1.2 * speed) * 0.02 * energy;
      root.position.y = 0.98 + Math.sin(time * 1.8 * speed) * 0.08 * energy;

      if (ring1) ring1.rotation.z = time * 0.65 * speed;
      if (ring2) ring2.rotation.x = time * -0.45 * speed;
      if (particles) particles.rotation.y = time * 0.28 * speed;

      if (scanBeam) {
        scanBeam.position.y = Math.sin(time * 2.8) * height * 0.5;
      }
    },
    update(time, vibeData = TASK_VIBES[currentVibe] || TASK_VIBES.idle) {
      this.tick(time, 0.016);
    },
    dispose() {
      disposers.forEach((fn) => {
        try { fn(); } catch (e) {}
      });
      while (root.children.length > 0) {
        root.remove(root.children[0]);
      }
    }
  };
}

export function buildVibeAura(THREE, vibeKey = "idle", vibeColor = "#00f0ff") {
  const g = new THREE.Group();
  const auraColor = new THREE.Color(vibeColor);

  const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: auraColor,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.8;
  g.add(ring);

  return {
    group: g,
    update: (time, speed = 1.0) => {
      ring.rotation.z = time * 0.8 * speed;
    },
    dispose: () => {
      ringGeo.dispose();
      ringMat.dispose();
    }
  };
}

/**
 * Serializes a 3D figure into a standard Wavefront OBJ file for download or 3D printing.
 */
export function exportFigureToOBJ(THREE, figure, name = "companion") {
  let output = `# Zoth Studio 3D Wavefront OBJ Exporter\n# Mascot: ${name}\n# Timestamp: ${new Date().toISOString()}\no ${name}\n`;
  let vertOffset = 1;

  figure.group.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geo = child.geometry.toNonIndexed ? child.geometry.toNonIndexed() : child.geometry;
      const pos = geo.attributes.position;
      const normal = geo.attributes.normal;
      const uv = geo.attributes.uv;

      child.updateWorldMatrix(true, false);
      const matrix = child.matrixWorld;

      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(matrix);
        output += `v ${v.x.toFixed(4)} ${v.y.toFixed(4)} ${v.z.toFixed(4)}\n`;
      }

      if (uv) {
        for (let i = 0; i < uv.count; i++) {
          output += `vt ${uv.getX(i).toFixed(4)} ${uv.getY(i).toFixed(4)}\n`;
        }
      }

      if (normal) {
        for (let i = 0; i < normal.count; i++) {
          const n = new THREE.Vector3(normal.getX(i), normal.getY(i), normal.getZ(i)).transformDirection(matrix);
          output += `vn ${n.x.toFixed(4)} ${n.y.toFixed(4)} ${n.z.toFixed(4)}\n`;
        }
      }

      output += `g ${child.name || "part"}\n`;
      for (let i = 0; i < pos.count; i += 3) {
        const i1 = vertOffset + i;
        const i2 = vertOffset + i + 1;
        const i3 = vertOffset + i + 2;
        if (uv && normal) {
          output += `f ${i1}/${i1}/${i1} ${i2}/${i2}/${i2} ${i3}/${i3}/${i3}\n`;
        } else if (uv) {
          output += `f ${i1}/${i1} ${i2}/${i2} ${i3}/${i3}\n`;
        } else {
          output += `f ${i1} ${i2} ${i3}\n`;
        }
      }
      vertOffset += pos.count;
    }
  });

  return output;
}

if (typeof window !== "undefined") {
  window.PetModels = {
    PET_SPECIES,
    TASK_VIBES,
    petPortrait,
    loadPetTexture,
    createPetFigure,
    exportFigureToOBJ
  };
}


