import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const TERRAIN = "/assets/swarm/terrain.jpg";
const FACE = {
  antigravity: "/assets/swarm/antigravity.jpg",
  grok: "/assets/swarm/grok.jpg",
  hermes: "/assets/swarm/hermes.jpg",
  ollama: "/assets/swarm/ollama.jpg",
};

const W = 12;
const D = 9;

function seatToWorld(seat) {
  const x = ((((seat?.x ?? 50) / 100) - 0.5) * W);
  const z = ((((seat?.y ?? 50) / 100) - 0.5) * D);
  const ridge = (seat?.region || "").toLowerCase() === "ridge" ? 0.28 : 0;
  return new THREE.Vector3(x, 0.12 + ridge, z);
}

function loadTex(url) {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        resolve(tex);
      },
      undefined,
      () => resolve(null),
    );
  });
}

function labelSprite(text) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, 256, 64);
  ctx.fillStyle = "rgba(8,8,16,0.72)";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(28, 14, 200, 36, 8);
  else ctx.rect(28, 14, 200, 36);
  ctx.fill();
  ctx.strokeStyle = "rgba(167,139,250,0.45)";
  ctx.stroke();
  ctx.fillStyle = "#eceaf6";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set(0.95, 0.24, 1);
  spr.position.y = 1.12;
  return spr;
}

function makeStars() {
  const count = 900;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 80;
    pos[i * 3 + 1] = Math.random() * 28 - 4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    }),
  );
}

function makeUnit(agent, tex) {
  const group = new THREE.Group();
  group.userData.agentId = agent.id;

  const ped = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.1, 24),
    new THREE.MeshStandardMaterial({
      color: 0x12121c,
      metalness: 0.55,
      roughness: 0.35,
      emissive: 0x2a1848,
      emissiveIntensity: 0.45,
    }),
  );
  ped.position.y = 0.05;
  group.add(ped);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.018, 10, 40),
    new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.7 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.07;
  group.add(ring);
  group.userData.ring = ring;

  const face = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 32),
    new THREE.MeshStandardMaterial({
      map: tex || null,
      color: tex ? 0xffffff : 0xa78bfa,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x1a1030,
      emissiveIntensity: 0.25,
    }),
  );
  face.position.y = 0.62;
  group.add(face);
  group.userData.face = face;

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.39, 0.02, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0xc4b5fd }),
  );
  rim.position.y = 0.62;
  group.add(rim);

  const label = labelSprite(`@${agent.id}`);
  group.add(label);

  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 12, 12),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  hit.position.y = 0.5;
  hit.userData.agentId = agent.id;
  group.add(hit);
  group.userData.hit = hit;

  return group;
}

export default function SwarmWorld({ agents = [], seats = {}, links = [], picked, onPick, focus = 0 }) {
  const host = useRef(null);
  const api = useRef(null);
  const latest = useRef({ agents, seats, links, picked, onPick, focus });
  latest.current = { agents, seats, links, picked, onPick, focus };

  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    let dead = false;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.038);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0.2, 8.6, 11.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 7;
    controls.maxDistance = 18;
    controls.minPolarAngle = 0.62;
    controls.maxPolarAngle = 1.12;
    controls.target.set(0, 0.15, 0);
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.35;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });

    let composer = null;
    try {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(8, 8), reduced ? 0.18 : 0.42, 0.5, 0.82);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
    } catch {
      composer = null;
    }

    scene.add(new THREE.AmbientLight(0x6b5b95, 0.42));
    const key = new THREE.DirectionalLight(0xc4b5fd, 1.05);
    key.position.set(6, 12, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 3.2, 28);
    rim.position.set(-5, 3.2, -3);
    scene.add(rim);
    const fill = new THREE.PointLight(0xa78bfa, 2.2, 26);
    fill.position.set(5, 2.4, 4);
    scene.add(fill);

    const stars = makeStars();
    scene.add(stars);

    const underglow = new THREE.Mesh(
      new THREE.TorusGeometry(5.6, 0.035, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0x6d28d9, transparent: true, opacity: 0.45 }),
    );
    underglow.rotation.x = Math.PI / 2;
    underglow.position.y = -0.72;
    scene.add(underglow);

    const hull = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 4.6, 1.35, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x0b0b14, roughness: 0.92, metalness: 0.18 }),
    );
    hull.scale.set(1.12, 1, 0.86);
    hull.position.y = -0.62;
    scene.add(hull);

    const cap = new THREE.Mesh(
      new THREE.CircleGeometry(4.55, 12),
      new THREE.MeshStandardMaterial({ color: 0x08080f, roughness: 1, metalness: 0.05 }),
    );
    cap.rotation.x = Math.PI / 2;
    cap.position.y = -1.28;
    cap.scale.set(1.12, 0.86, 1);
    scene.add(cap);

    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.78,
        metalness: 0.08,
        emissive: 0x1a1430,
        emissiveIntensity: 0.22,
      }),
    );
    board.rotation.x = -Math.PI / 2;
    board.position.y = 0.08;
    scene.add(board);
    const grid = new THREE.GridHelper(12, 12, 0x3d3a5c, 0x1c1c2c);
    grid.position.y = 0.09;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    scene.add(grid);

    const units = new Map();
    const faces = {};
    const unitRoot = new THREE.Group();
    scene.add(unitRoot);
    const linkRoot = new THREE.Group();
    scene.add(linkRoot);

    const dustGeo = new THREE.BufferGeometry();
    const dustN = 220;
    const dustPos = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 1] = Math.random() * 2.4;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.03,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(dust);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let dragging = false;
    let camGoal = null;

    function size() {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composer?.setSize(w, h);
    }

    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();

    function syncUnits() {
      const { agents: list, seats: sm } = latest.current;
      const seen = new Set();
      list.forEach((a) => {
        seen.add(a.id);
        let unit = units.get(a.id);
        if (!unit) {
          unit = makeUnit(a, faces[a.id] || null);
          unit.position.copy(seatToWorld(sm[a.id] || a.seat));
          units.set(a.id, unit);
          unitRoot.add(unit);
          // created; camera stays wide until the user picks
        }
        const p = seatToWorld(sm[a.id] || a.seat);
        unit.position.lerp(p, 0.35);
        unit.userData.live = a.status === "live" || a.status === "active";
        const on = latest.current.picked === a.id;
        if (unit.userData.ring) {
          unit.userData.ring.material.color.set(on ? 0x22d3ee : 0xa78bfa);
          if (!unit.userData.live) unit.userData.ring.scale.setScalar(on ? 1.18 : 1);
        }
      });
      units.forEach((u, id) => {
        if (!seen.has(id)) {
          unitRoot.remove(u);
          units.delete(id);
        }
      });
    }

    function rebuildLinks() {
      while (linkRoot.children.length) {
        const c = linkRoot.children[0];
        linkRoot.remove(c);
        c.geometry?.dispose();
        c.material?.dispose();
      }
      const { links: ls, seats: sm } = latest.current;
      (ls || []).forEach((l) => {
        const a = units.get(l.from);
        const b = units.get(l.to);
        if (!a || !b) {
          const pa = seatToWorld(sm[l.from]);
          const pb = seatToWorld(sm[l.to]);
          if (!sm[l.from] || !sm[l.to]) return;
          drawArc(pa, pb);
          return;
        }
        drawArc(a.position, b.position);
      });
    }

    function drawArc(from, to) {
      const start = from.clone().add(new THREE.Vector3(0, 0.7, 0));
      const end = to.clone().add(new THREE.Vector3(0, 0.7, 0));
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 1.4;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      const line = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.55 }),
      );
      linkRoot.add(line);
    }

    function lookAt(id) {
      const u = units.get(id);
      if (!u) return;
      const target = u.position.clone().add(new THREE.Vector3(0, 0.2, 0));
      const pos = u.position.clone().add(new THREE.Vector3(3.6, 4.8, 6.4));
      camGoal = { pos, target };
      controls.autoRotate = false;
    }

    api.current = { lookAt, syncUnits, rebuildLinks };

    const onDown = () => {
      dragging = false;
    };
    const onMove = () => {
      dragging = true;
    };
    const onUp = (ev) => {
      if (dragging) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = [];
      units.forEach((u) => {
        if (u.userData.hit) hits.push(u.userData.hit);
      });
      const hit = raycaster.intersectObjects(hits, false)[0];
      const id = hit?.object?.userData?.agentId;
      if (id) latest.current.onPick?.(id);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);

    const clock = new THREE.Clock();
    let raf = 0;
    function tick() {
      if (dead) return;
      const t = clock.getElapsedTime();
      stars.rotation.y = t * 0.008;
      dust.rotation.y = t * 0.03;
      underglow.rotation.z = t * 0.12;
      units.forEach((u) => {
        if (u.userData.face) u.userData.face.lookAt(camera.position);
        if (u.userData.live && u.userData.ring) {
          const s = 1 + Math.sin(t * 2.4) * 0.08;
          u.userData.ring.scale.setScalar(s);
        }
      });
      if (camGoal) {
        camera.position.lerp(camGoal.pos, 0.06);
        controls.target.lerp(camGoal.target, 0.08);
        if (camera.position.distanceTo(camGoal.pos) < 0.08) camGoal = null;
      }
      controls.update();
      if (composer) composer.render();
      else renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }

    (async () => {
      const terrain = await loadTex(TERRAIN);
      if (dead) return;
      if (terrain) {
        board.material.map = terrain;
        board.material.needsUpdate = true;
      }
      await Promise.all(
        Object.entries(FACE).map(async ([id, url]) => {
          faces[id] = await loadTex(url);
        }),
      );
      if (dead) return;
      units.forEach((u, id) => {
        if (faces[id] && u.userData.face) {
          u.userData.face.material.map = faces[id];
          u.userData.face.material.needsUpdate = true;
        }
      });
      syncUnits();
      rebuildLinks();
      raf = requestAnimationFrame(tick);
    })();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      composer?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      api.current = null;
    };
  }, []);

  useEffect(() => {
    const a = api.current;
    if (!a) return;
    a.syncUnits();
    a.rebuildLinks();
  }, [agents, seats, links, picked]);

  useEffect(() => {
    if (focus && picked) api.current?.lookAt(picked);
  }, [focus, picked]);

  return <div ref={host} className="swarm-world" />;
}
