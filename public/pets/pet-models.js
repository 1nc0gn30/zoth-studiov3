/**
 * Zoth Pets — Photo-Volume & Procedural 3D Figures with Native Task Vibe Animations
 *
 * Each pet figure contains embedded procedural kinetic engines for:
 *  - 'idle': Calming breath float, luminance shell shimmer, slow yaw drift
 *  - 'coding': Agile rapid pulse, keyboard jitter tilt, neon matrix data splines
 *  - 'security': Rotating orbital defense shields, scanning radar cone, alert glow
 *  - 'aeo': Knowledge halo expansion, geometric node constellation, synaptic ripple
 *  - 'fusion': Resonant dual-energy vortex, golden consensus radiance, harmonic scale
 *  - 'celebrate': Upward spiraling victory launch, rainbow chromatic bounce
 */

export const SVG_PET_IDS = new Set([
  "glitchcat",
  "circuit-pup",
  "terminal-ghost",
  "savage-codex",
  "ai-workbot",
  "binary",
]);

export function petPortrait(id) {
  return SVG_PET_IDS.has(id) ? `/assets/pets/${id}.svg` : `/assets/pets/${id}-neon.jpg`;
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
      tex.generateMipmaps = false;
      resolve(tex);
    };
    if (String(url).toLowerCase().endsWith(".svg")) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const size = 512;
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        finish(new THREE.CanvasTexture(c));
      };
      img.onerror = () => resolve(null);
      img.src = url;
      return;
    }
    new THREE.TextureLoader().load(url, finish, undefined, () => resolve(null));
  });
}

export function fallbackPetTexture(THREE, hex = "#16120e") {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 16, 16);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

export const PET_SPECIES = {
  kai: { depth: 0.42, scale: 1.0, vibeColor: "#00e5ff" },
  draco: { depth: 0.46, scale: 1.04, vibeColor: "#ffaa00" },
  athena: { depth: 0.4, scale: 0.98, vibeColor: "#a855f7" },
  lycan: { depth: 0.4, scale: 1.02, vibeColor: "#10b981" },
  ignis: { depth: 0.44, scale: 1.06, vibeColor: "#ff007a" },
  kitsune: { depth: 0.4, scale: 1.02, vibeColor: "#ff7700" },
  "pixel-neko": { depth: 0.5, scale: 0.96, voxel: true, vibeColor: "#00f0ff" },
  "pixel-shiba": { depth: 0.4, scale: 1.0, voxel: true, vibeColor: "#ffcc00" },
  "radical-minion": { depth: 0.42, scale: 0.96, vibeColor: "#00d4aa" },
  glitchcat: { depth: 0.38, scale: 0.98, vibeColor: "#ff0055" },
  "circuit-pup": { depth: 0.4, scale: 1.02, vibeColor: "#00ffff" },
  "terminal-ghost": { depth: 0.36, scale: 1.0, vibeColor: "#38bdf8" },
  "savage-codex": { depth: 0.38, scale: 1.0, vibeColor: "#eab308" },
  "ai-workbot": { depth: 0.38, scale: 0.96, vibeColor: "#6366f1" },
  binary: { depth: 0.36, scale: 1.02, vibeColor: "#22c55e" },
  ghostbyte: { depth: 0.42, scale: 1.05, vibeColor: "#00e5ff" },
  aquila: { depth: 0.44, scale: 1.05, vibeColor: "#00f0ff" },
  leviathan: { depth: 0.46, scale: 1.08, vibeColor: "#06b6d4" },
  onyx: { depth: 0.42, scale: 1.04, vibeColor: "#ff007a" },
  chronos: { depth: 0.44, scale: 1.05, vibeColor: "#38bdf8" },
  aether: { depth: 0.48, scale: 1.10, vibeColor: "#fbbf24" },
  kraken: { depth: 0.45, scale: 1.04, vibeColor: "#00f0ff" },
  scorpius: { depth: 0.42, scale: 1.02, vibeColor: "#00e5ff" },
};

export const TASK_VIBES = {
  idle: { name: "Idle / Rest", color: "#38bdf8", speed: 1.0, energy: 0.4 },
  coding: { name: "Coding / Build", color: "#00f0ff", speed: 2.8, energy: 1.2 },
  security: { name: "Security / Audit", color: "#10b981", speed: 1.8, energy: 1.0 },
  aeo: { name: "AEO / Knowledge", color: "#a855f7", speed: 1.4, energy: 0.9 },
  fusion: { name: "Fusion / Swarm", color: "#ffaa40", speed: 2.2, energy: 1.4 },
  celebrate: { name: "Shipped / Victory", color: "#ff007a", speed: 3.2, energy: 1.8 }
};

function sampleImage(tex, w, h) {
  const img = tex && tex.image;
  if (!img) return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas: c, data: ctx.getImageData(0, 0, w, h) };
}

function cornerBg(data, w, h) {
  const s = 8;
  let r = 0, g = 0, b = 0, n = 0;
  const acc = (x, y) => {
    const i = (y * w + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  };
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      acc(x, y);
      acc(w - 1 - x, y);
      acc(x, h - 1 - y);
      acc(w - 1 - x, h - 1 - y);
    }
  }
  return { r: r / n, g: g / n, b: b / n };
}

function looksLikeBackdrop(r, g, b, a, bg) {
  if (a < 14) return true;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  const dist = Math.hypot(r - bg.r, g - bg.g, b - bg.b);
  if (lum < 34 && sat < 48) return true;
  if (dist < 40 && lum < 58 && sat < 42) return true;
  if (dist < 22 && lum < 40) return true;
  return false;
}

function floodSubjectMask(data, w, h) {
  const bg = cornerBg(data, w, h);
  const mask = new Uint8Array(w * h);
  mask.fill(1);
  const seen = new Uint8Array(w * h);
  const stack = [];
  const seed = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (seen[i]) return;
    const p = i * 4;
    if (!looksLikeBackdrop(data[p], data[p + 1], data[p + 2], data[p + 3], bg)) return;
    seen[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) {
    seed(x, 0);
    seed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    seed(0, y);
    seed(w - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    mask[i] = 0;
    const x = i % w;
    const y = (i / w) | 0;
    seed(x + 1, y);
    seed(x - 1, y);
    seed(x, y + 1);
    seed(x, y - 1);
  }
  return { mask, bg };
}

function cleanMask(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      const n =
        mask[i - 1] +
        mask[i + 1] +
        mask[i - w] +
        mask[i + w] +
        mask[i - w - 1] +
        mask[i - w + 1] +
        mask[i + w - 1] +
        mask[i + w + 1];
      out[i] = n >= 3 ? 1 : 0;
    }
  }
  return out;
}

function buildAlphaMap(THREE, mask, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const id = ctx.createImageData(w, h);
  const d = id.data;
  for (let i = 0; i < mask.length; i++) {
    const p = i * 4;
    const v = mask[i] ? 255 : 0;
    d[p] = v;
    d[p + 1] = v;
    d[p + 2] = v;
    d[p + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function carvePlaneGeometry(THREE, mask, w, h, width, height, segs, depthScale) {
  const geo = new THREE.PlaneGeometry(width, height, segs, segs);
  const pos = geo.attributes.position;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const u = (pos.getX(i) / width + 0.5);
    const v = (0.5 - pos.getY(i) / height);
    const px = Math.min(w - 1, Math.max(0, (u * (w - 1)) | 0));
    const py = Math.min(h - 1, Math.max(0, (v * (h - 1)) | 0));
    const inside = mask[py * w + px];
    if (inside) {
      const edgeDist = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
      pos.setZ(i, Math.pow(edgeDist, 0.42) * depthScale);
    } else {
      pos.setZ(i, -0.05);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function buildPhotoVolume(THREE, tex, { color, depth = 0.4, width = 1.7, height = 1.7, segs = 96 }) {
  const group = new THREE.Group();
  const hitMeshes = [];
  const disposers = [];

  const sampled = sampleImage(tex, 96, 96);
  let mask = null;
  let alphaTex = null;
  if (sampled) {
    const { data, canvas } = sampled;
    const res = floodSubjectMask(data.data, canvas.width, canvas.height);
    mask = cleanMask(res.mask, canvas.width, canvas.height);
    alphaTex = buildAlphaMap(THREE, mask, canvas.width, canvas.height);
    disposers.push(() => alphaTex.dispose());
  }

  const baseMatProps = {
    map: tex,
    alphaMap: alphaTex,
    transparent: true,
    alphaTest: 0.08,
    roughness: 0.38,
    metalness: 0.18,
    side: THREE.DoubleSide,
  };

  const frontMat = new THREE.MeshStandardMaterial({
    ...baseMatProps,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.14,
  });
  const backMat = new THREE.MeshStandardMaterial({
    ...baseMatProps,
    roughness: 0.6,
    metalness: 0.1,
  });

  const geo = mask
    ? carvePlaneGeometry(THREE, mask, 96, 96, width, height, segs, depth)
    : new THREE.PlaneGeometry(width, height, segs, segs);

  const frontMesh = new THREE.Mesh(geo, frontMat);
  frontMesh.position.z = depth * 0.5;
  frontMesh.castShadow = true;
  frontMesh.receiveShadow = true;
  group.add(frontMesh);
  hitMeshes.push(frontMesh);

  const backGeo = geo.clone();
  const pos = backGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, -pos.getZ(i));
  }
  backGeo.computeVertexNormals();
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.z = -depth * 0.5;
  backMesh.rotation.y = Math.PI;
  group.add(backMesh);
  hitMeshes.push(backMesh);

  group.position.y = 0.98;

  disposers.push(() => {
    geo.dispose();
    frontMat.dispose();
    backGeo.dispose();
    backMat.dispose();
  });

  return { group, hitMeshes, disposers, frontMesh };
}

function buildVoxelFigure(THREE, tex, { color, size = 1.68, res = 44 }) {
  const group = new THREE.Group();
  const sampled = sampleImage(tex, res, res);
  if (!sampled) return group;
  const { data, canvas } = sampled;
  const w = canvas.width;
  const h = canvas.height;
  let { mask } = floodSubjectMask(data.data, w, h);
  mask = cleanMask(mask, w, h);
  const cells = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      const p = i * 4;
      const r = data.data[p];
      const g = data.data[p + 1];
      const b = data.data[p + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      cells.push({
        x: (x / (w - 1) - 0.5) * size,
        y: (0.5 - y / (h - 1)) * size,
        z: (lum - 0.32) * 0.42,
        r, g, b,
        d: 0.1 + lum * 0.48,
      });
    }
  }
  if (!cells.length) return group;
  const box = new THREE.BoxGeometry((size / res) * 0.94, (size / res) * 0.94, 1);
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.16,
    roughness: 0.4,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.2,
  });
  const mesh = new THREE.InstancedMesh(box, mat, cells.length);
  const dummy = new THREE.Object3D();
  const c = new THREE.Color();
  cells.forEach((cell, i) => {
    dummy.position.set(cell.x, cell.y, cell.z);
    dummy.scale.set(1, 1, cell.d);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    c.setRGB(cell.r / 255, cell.g / 255, cell.b / 255);
    mesh.setColorAt(i, c);
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  group.add(mesh);
  group.position.y = 0.98;
  return group;
}

/**
 * High-Quality Procedural Space Liquid Rainbow Aura
 * Features multi-frequency Simplex noise, chromatic dispersion, fluid vertex displacement, and iridescent sheen.
 */
function createKineticVibeEffects(THREE, vibeName, vibeColor) {
  const auraGroup = new THREE.Group();
  auraGroup.name = "vibe-aura";

  // Liquid Torus Vertex & Fragment Shader with Simplex Noise & Chromatic Dispersion
  const liquidShader = {
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 1.0 },
      uEnergy: { value: 1.0 },
      uBaseColor: { value: new THREE.Color(vibeColor) },
      uColorMix: { value: 0.85 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uEnergy;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying float vNoise;

      // 3D Simplex-style Noise Algorithm
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
        vec3 ns = n_ * D.wyz - D.xzx;
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
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;

        // Multi-frequency wave ripple
        float t = uTime * 0.85 * uSpeed;
        float n1 = snoise(position * 1.8 + vec3(0.0, t, 0.0));
        float n2 = snoise(position * 3.5 - vec3(t * 0.5, 0.0, t * 0.5));
        float noiseVal = n1 * 0.7 + n2 * 0.3;
        vNoise = noiseVal;

        // Smooth liquid surface displacement
        vec3 displacedPos = position + normal * (noiseVal * 0.14 * uEnergy);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec3 uBaseColor;
      uniform float uColorMix;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying float vNoise;

      // Cosine based smooth rainbow color palette generator
      vec3 rainbowPalette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.0, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);

        // Fluid chromatic dispersion based on noise and UV coordinates
        float wavePhase = vUv.x * 2.0 + vNoise * 1.5 + uTime * 0.4 * uSpeed;
        vec3 rainbow = rainbowPalette(wavePhase);

        // Blend between pet base vibe hue and iridescent rainbow liquid
        vec3 finalColor = mix(uBaseColor, rainbow, uColorMix);

        // Liquid transmission glow + edge highlights
        float alpha = clamp(0.35 + fresnel * 0.55 + vNoise * 0.15, 0.2, 0.85);

        gl_FragColor = vec4(finalColor + vec3(fresnel * 0.35), alpha * 0.55);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  };

  const liquidMat = new THREE.ShaderMaterial(liquidShader);

  // 1. Primary Orbiting Space Liquid Fluid Ring
  const fluidGeo1 = new THREE.TorusGeometry(1.28, 0.038, 32, 100);
  const ring1 = new THREE.Mesh(fluidGeo1, liquidMat);
  ring1.rotation.x = Math.PI / 2;
  auraGroup.add(ring1);

  // 2. Secondary Inclined Liquid Halo
  const fluidGeo2 = new THREE.TorusGeometry(1.42, 0.024, 24, 80);
  const ring2 = new THREE.Mesh(fluidGeo2, liquidMat);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  auraGroup.add(ring2);

  // 3. Floating Liquid Micro-Droplets
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 36;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    const angle = (i / 3 / pCount) * Math.PI * 2;
    const r = 1.1 + Math.random() * 0.45;
    pPos[i] = Math.cos(angle) * r;
    pPos[i + 1] = (Math.random() - 0.5) * 0.6;
    pPos[i + 2] = Math.sin(angle) * r;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const droplets = new THREE.Points(particleGeo, particleMat);
  auraGroup.add(droplets);

  auraGroup.position.y = 0.98;
  return { auraGroup, ring1, ring2, droplets, liquidMat };
}

/**
 * Factory for 3D Pet Model with Native Task Vibe Animations
 */
export function createPetFigure(THREE, { id, color, texture, style = "realistic", initialVibe = "idle", withAura = true }) {
  const spec = PET_SPECIES[id] || { depth: 0.4, scale: 1, vibeColor: color || "#c4a574" };
  const group = new THREE.Group();
  group.name = `pet-${id}`;
  const hitMeshes = [];
  const disposers = [];
  const useVoxel = style === "pixel" || spec.voxel;

  let currentVibe = initialVibe;
  let activeAura = null;

  let frontMesh = null;

  // Build Core Body Figure
  if (useVoxel) {
    const voxels = buildVoxelFigure(THREE, texture, {
      color: spec.vibeColor,
      size: 1.68,
      res: style === "pixel" ? 34 : 46,
    });
    group.add(voxels);
    voxels.traverse((o) => {
      if (o.isMesh) hitMeshes.push(o);
    });
  } else {
    const vol = buildPhotoVolume(THREE, texture, {
      color: spec.vibeColor,
      depth: spec.depth,
      width: 1.7,
      height: 1.7,
      segs: 104,
    });
    group.add(vol.group);
    frontMesh = vol.frontMesh;
    hitMeshes.push(...vol.hitMeshes);
    disposers.push(...vol.disposers);
  }

  group.scale.setScalar(spec.scale);

  function updateAura(vibe) {
    if (activeAura) {
      group.remove(activeAura.auraGroup);
      activeAura.auraGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      activeAura = null;
    }
    if (!withAura) return;
    const vibeCfg = TASK_VIBES[vibe] || TASK_VIBES.idle;
    activeAura = buildVibeAura(THREE, vibe, vibeCfg.color);
    group.add(activeAura.auraGroup);
  }

  updateAura(currentVibe);

  // Set Task Vibe Animation Mode
  function setTaskVibe(vibeName) {
    if (!TASK_VIBES[vibeName]) vibeName = "idle";
    currentVibe = vibeName;
    updateAura(vibeName);
  }

  // 60 FPS Kinetic Tick Engine
  function tick(t, delta = 0.016) {
    const vibeCfg = TASK_VIBES[currentVibe] || TASK_VIBES.idle;
    const speed = vibeCfg.speed;
    const energy = vibeCfg.energy;

    // 1. Base Kinematics per Vibe
    if (currentVibe === "idle") {
      // Gentle breathing float
      group.position.y = Math.sin(t * 1.35 * speed) * 0.04 * energy;
      group.rotation.y = Math.sin(t * 0.6) * 0.12;
      group.rotation.z = Math.sin(t * 0.8) * 0.02;
    } 
    else if (currentVibe === "coding") {
      // Agile rapid matrix bobbing & typing jitter tilt
      group.position.y = Math.sin(t * 4.2) * 0.06 * energy;
      group.rotation.y = Math.sin(t * 2.5) * 0.22;
      group.rotation.z = Math.cos(t * 5.0) * 0.04;
    } 
    else if (currentVibe === "security") {
      // Stately scanning pulse & sentinel sweeps
      group.position.y = Math.sin(t * 1.8) * 0.03 * energy;
      group.rotation.y = Math.sin(t * 1.2) * 0.35; // Scanning back and forth
      group.rotation.x = Math.sin(t * 2.0) * 0.03;
    } 
    else if (currentVibe === "aeo") {
      // Celestial hovering & cosmic elevation
      group.position.y = 0.08 + Math.sin(t * 1.6) * 0.05 * energy;
      group.rotation.y = t * 0.45; // Continuous graceful rotation
    } 
    else if (currentVibe === "fusion") {
      // Harmonic dual resonance & pulsing scale
      group.position.y = Math.sin(t * 3.0) * 0.05 * energy;
      group.rotation.y = Math.sin(t * 1.8) * 0.25;
      const s = spec.scale * (1 + Math.sin(t * 4.0) * 0.03);
      group.scale.set(s, s, s);
    } 
    else if (currentVibe === "celebrate") {
      // Victory spiral bounce
      group.position.y = 0.12 + Math.abs(Math.sin(t * 4.5)) * 0.15 * energy;
      group.rotation.y = t * 2.8; // Fast victory spin
      group.rotation.z = Math.sin(t * 3.0) * 0.1;
    }

    // 2. Subtle Glitch & Jitter Displacement Filter
    if (frontMesh && frontMesh.material) {
      const glitchChance = Math.sin(t * 13.7) * Math.cos(t * 19.3);
      if (glitchChance > 0.93) {
        frontMesh.position.x = (Math.random() - 0.5) * 0.03;
        frontMesh.material.emissiveIntensity = 0.38;
      } else {
        frontMesh.position.x = 0;
        frontMesh.material.emissiveIntensity = 0.14 + Math.sin(t * 2.0) * 0.04;
      }
    }

    // 2. Animate Space Liquid Rainbow Shader & Droplets
    if (activeAura) {
      if (activeAura.liquidMat && activeAura.liquidMat.uniforms) {
        activeAura.liquidMat.uniforms.uTime.value = t;
        activeAura.liquidMat.uniforms.uSpeed.value = speed;
        activeAura.liquidMat.uniforms.uEnergy.value = energy;
      }
      if (activeAura.ring1) activeAura.ring1.rotation.z += 0.012 * speed;
      if (activeAura.ring2) activeAura.ring2.rotation.z -= 0.008 * speed;
      if (activeAura.droplets) activeAura.droplets.rotation.y += 0.005 * speed;
      
      const shield = activeAura.auraGroup.getObjectByName("shield");
      if (shield) shield.rotation.z -= 0.025 * speed;

      const halo = activeAura.auraGroup.getObjectByName("halo");
      if (halo) {
        halo.rotation.z += 0.03 * speed;
        halo.position.y = 0.9 + Math.sin(t * 2.0) * 0.04;
      }
    }
  }

  function setTexture() {}

  function dispose() {
    disposers.forEach((fn) => fn());
    if (activeAura) {
      activeAura.auraGroup.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    }
    group.traverse((o) => {
      if (o.geometry && o.geometry.dispose) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => m.dispose && m.dispose());
      }
    });
  }

  return { 
    group, 
    hitMeshes, 
    sculpt: hitMeshes[0] || group, 
    tick, 
    setTaskVibe, 
    getTaskVibe: () => currentVibe,
    setTexture, 
    dispose, 
    id 
  };
}

export function avatarFile(id, style) {
  return `${id}-${style}.jpg`;
}
