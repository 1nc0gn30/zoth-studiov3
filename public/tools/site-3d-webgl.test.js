// Node test harness for Zoth 3D WebGL Canvas Hero Visualizer Engine
// Run: node core-app/public/tools/site-3d-webgl.test.js

const Site3D = require("./site-3d-webgl.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) {
    pass++;
    console.log("PASS  " + name);
  } else {
    fail++;
    console.log("FAIL  " + name);
  }
}

(function () {
  console.log("=== ZOTH 3D WEBGL HERO VISUALIZER TEST SUITE ===");

  // 1. API Surface & Constants
  check("Site3D exports VERSION", typeof Site3D.VERSION === "string");
  check("Site3D has MODES catalog", Boolean(Site3D.MODES.STARFIELD && Site3D.MODES.MASCOT_3D && Site3D.MODES.MATRIX_GRID && Site3D.MODES.HYPEROBJECT && Site3D.MODES.CYBER_TUNNEL && Site3D.MODES.HYBRID));
  check("Site3D has GRAVITY_MODES", Boolean(Site3D.GRAVITY_MODES.ATTRACT && Site3D.GRAVITY_MODES.REPEL && Site3D.GRAVITY_MODES.VORTEX && Site3D.GRAVITY_MODES.WARP && Site3D.GRAVITY_MODES.OFF));
  check("Site3D has THEMES catalog", Boolean(Site3D.THEMES["obsidian-cyan"] && Site3D.THEMES["cyber-gold"] && Site3D.THEMES["acid-matrix"] && Site3D.THEMES["ultraviolet"] && Site3D.THEMES["crimson-core"]));
  check("Site3D has MASCOTS catalog with Kai, Lycan, Draco, Athena", Boolean(Site3D.MASCOTS.kai && Site3D.MASCOTS.lycan && Site3D.MASCOTS.draco && Site3D.MASCOTS.athena));

  // 2. 3D Math Engine
  const p0 = [10, 20, 30];
  const rotX = Site3D.Math3D.rotateX(p0, Math.PI / 2);
  check("Math3D.rotateX calculates correct Y/Z rotation", Math.abs(rotX[0] - 10) < 0.001 && Math.abs(rotX[1] - (-30)) < 0.001);

  const rotY = Site3D.Math3D.rotateY(p0, Math.PI / 2);
  check("Math3D.rotateY calculates correct X/Z rotation", Math.abs(rotY[1] - 20) < 0.001 && Math.abs(rotY[0] - 30) < 0.001);

  const rotZ = Site3D.Math3D.rotateZ(p0, Math.PI / 2);
  check("Math3D.rotateZ calculates correct X/Y rotation", Math.abs(rotZ[2] - 30) < 0.001 && Math.abs(rotZ[0] - (-20)) < 0.001);

  const proj = Site3D.Math3D.project([0, 0, 100], 800, 600, 400, 300);
  check("Math3D.project projects 3D coordinates onto 2D viewport", proj.x === 400 && proj.y === 300 && proj.scale === 1);

  const rgb = Site3D.Math3D.hexToRgb("#00f0ff");
  check("Math3D.hexToRgb parses hex colors correctly", rgb.r === 0 && rgb.g === 240 && rgb.b === 255);

  const lerp = Site3D.Math3D.lerpColor("#000000", "#ffffff", 0.5);
  check("Math3D.lerpColor interpolates midpoint correctly", lerp.r === 128 && lerp.g === 128 && lerp.b === 128);

  // 3. Geometry Builders
  const poly = Site3D.GeometryBuilders.createPolyhedron(80);
  check("createPolyhedron builds vertices and edges", poly.vertices.length >= 14 && poly.edges.length >= 24);

  const tess = Site3D.GeometryBuilders.createTesseract(70);
  check("createTesseract builds 16 4D projection vertices and 32 edges", tess.vertices.length === 16 && tess.edges.length === 32);

  const catGeo = Site3D.GeometryBuilders.createMascotGeometry("cat", 60);
  check("createMascotGeometry for Kai (Cat) includes head, ears, whiskers, halo", catGeo.vertices.length >= 27 && catGeo.edges.length >= 25);

  const wolfGeo = Site3D.GeometryBuilders.createMascotGeometry("wolf", 60);
  check("createMascotGeometry for Lycan (Wolf) includes snout, ears, halo", wolfGeo.vertices.length >= 18 && wolfGeo.edges.length >= 17);

  const dragonGeo = Site3D.GeometryBuilders.createMascotGeometry("dragon", 60);
  check("createMascotGeometry for Draco (Dragon) includes horns, wings, halo", dragonGeo.vertices.length >= 18 && dragonGeo.edges.length >= 17);

  const owlGeo = Site3D.GeometryBuilders.createMascotGeometry("owl", 60);
  check("createMascotGeometry for Athena (Owl) includes optical lens rings, halo", owlGeo.vertices.length >= 15 && owlGeo.edges.length >= 15);

  const grid = Site3D.GeometryBuilders.createMatrixGrid(10, 8, 40);
  check("createMatrixGrid generates correct vertex and edge topology", grid.vertices.length === 80 && grid.edges.length > 100);

  const tunnel = Site3D.GeometryBuilders.createTunnelRings(8, 10, 100, 500);
  check("createTunnelRings generates cylindrical tunnel wireframe", tunnel.vertices.length === 80 && tunnel.edges.length > 100);

  // 4. Safe Capabilities Detection (Zero-Crash Fallback)
  const caps = Site3D.detectCapabilities();
  check("detectCapabilities runs safely without window/DOM", typeof caps === "object" && typeof caps.isLowPower === "boolean" && caps.recommendedParticleCount > 0);

  // 5. HTML Generators
  const heroHtml = Site3D.generateHeroHtml(Site3D.MODES.STARFIELD, { title: "Test 3D Hero" });
  check("generateHeroHtml generates complete canvas element and telemetry overlay", heroHtml.includes("<canvas") && heroHtml.includes("zothHudFps") && heroHtml.includes("Test 3D Hero"));

  const fullPage = Site3D.generateStandalonePage(Site3D.MODES.HYBRID, { title: "Standalone Visualizer Page" });
  check("generateStandalonePage generates complete HTML5 document with controls", fullPage.includes("<!DOCTYPE html>") && fullPage.includes("controls-panel") && fullPage.includes("Standalone Visualizer Page"));

  // 6. Tool Engine Contract Dispatcher (validate & run)
  const valOk = Site3D.validate({ action: "visualizer.list" });
  check("validate returns ok for valid action", valOk.ok === true);

  const valBad = Site3D.validate({ action: "invalid.action" });
  check("validate returns error for invalid action", valBad.ok === false && Boolean(valBad.error));

  const listRes = Site3D.run({ action: "visualizer.list" });
  check("run visualizer.list returns modes, gravity_modes, themes, mascots", listRes.ok === true && listRes.data.modes.length >= 6 && listRes.data.mascots.length >= 6);

  const capsRes = Site3D.run({ action: "visualizer.capabilities" });
  check("run visualizer.capabilities returns capability object", capsRes.ok === true && typeof capsRes.data.recommendedParticleCount === "number");

  const renderRes = Site3D.run({ action: "visualizer.render", params: { mode: "mascot-3d", options: { mascot: "kai" } } });
  check("run visualizer.render generates visualizer HTML snippet", renderRes.ok === true && renderRes.data.html.includes("<canvas"));

  const bundleRes = Site3D.run({ action: "visualizer.export_bundle", params: { mode: "cyber-tunnel" } });
  check("run visualizer.export_bundle generates full page bundle", bundleRes.ok === true && bundleRes.data.html.includes("<!DOCTYPE html>"));

  // 7. Visualizer Mock Instance & Kinetics Simulation
  const mockCanvas = {
    clientWidth: 800,
    clientHeight: 500,
    width: 800,
    height: 500,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 500 }),
    addEventListener: () => {},
    removeEventListener: () => {},
    getContext: (type) => {
      if (type === "2d") {
        return {
          fillRect: () => {},
          beginPath: () => {},
          arc: () => {},
          fill: () => {},
          moveTo: () => {},
          lineTo: () => {},
          stroke: () => {},
          scale: () => {},
          resetTransform: () => {},
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillStyle: "",
          strokeStyle: "",
          lineWidth: 1,
          globalAlpha: 1
        };
      }
      return null;
    }
  };

  const inst = new Site3D.VisualizerInstance(mockCanvas, {
    mode: "hybrid",
    theme: "obsidian-cyan",
    mascot: "kai",
    particleCount: 150
  });

  check("VisualizerInstance creates particles and geometries", inst.particles.length === 150 && inst.mascotGeo.vertices.length > 0);

  // Simulate update & physics
  inst.pointer.active = true;
  inst.pointer.targetX = 400;
  inst.pointer.targetY = 250;
  inst.update(0.016);
  check("VisualizerInstance updates physics smoothly", typeof inst.particles[0].x === "number" && !isNaN(inst.particles[0].x));

  // Simulate render pass
  inst.render();
  check("VisualizerInstance renders without errors", true);

  // Switch modes
  inst.setMode("matrix-grid");
  inst.setGravityMode("vortex");
  inst.setTheme("acid-matrix");
  inst.setMascot("lycan");
  const stats = inst.getStats();
  check("getStats returns live telemetry metrics", stats.mode === "matrix-grid" && stats.gravityMode === "vortex" && stats.theme === "acid-matrix" && stats.mascot === "lycan");

  inst.destroy();
  check("VisualizerInstance destroys cleanly", inst.running === false);

  console.log("\n================================================");
  console.log(`TEST SUMMARY: ${pass} PASSED, ${fail} FAILED`);
  console.log("================================================");

  if (fail > 0) {
    process.exit(1);
  }
})();
