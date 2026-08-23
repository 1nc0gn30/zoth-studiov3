// Zoth Studio — 3D & WebGL Canvas Hero Visualizer Engine
// Hermes Lane: web-foundry/canvas-3d
//
// 100% Sovereign, GPU-accelerated interactive 3D canvas hero visualizers.
// Supports interactive 3D particle starfields with mouse gravity, orbiting 3D companion mascot figurines,
// procedural matrix geometry wireframes, low-overhead 60 FPS rendering, zero-crash WebGL context guards,
// and automatic graceful Canvas2D fallbacks for low-power devices.
// Compatible with Browser (window.Site3DWebGL / window.Zoth3DWebGL) and Node.js (CommonJS / ESM).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    var instance = factory();
    root.Site3DWebGL = instance;
    root.Zoth3DWebGL = instance;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var VERSION = "2026-08-22";

  // ===========================================================================
  // 1. CONSTANTS, PRESETS & CATALOGS
  // ===========================================================================

  var MODES = {
    STARFIELD: "starfield",
    MASCOT_3D: "mascot-3d",
    MATRIX_GRID: "matrix-grid",
    HYPEROBJECT: "hyperobject",
    CYBER_TUNNEL: "cyber-tunnel",
    HYBRID: "hybrid"
  };

  var GRAVITY_MODES = {
    ATTRACT: "attract",
    REPEL: "repel",
    VORTEX: "vortex",
    WARP: "warp",
    OFF: "off"
  };

  var THEMES = {
    "obsidian-cyan": {
      name: "Obsidian Cyan",
      bg: "#030611",
      primary: "#00f0ff",
      primaryGlow: "rgba(0, 240, 255, 0.4)",
      secondary: "#7000ff",
      accent: "#38bdf8",
      wireframe: "#00e5ff",
      particle: "#a5f3fc",
      starNear: "#ffffff",
      starFar: "#0284c7",
      grid: "#00f0ff",
      horizon: "rgba(0, 240, 255, 0.15)"
    },
    "cyber-gold": {
      name: "Obsidian Gold",
      bg: "#07080b",
      primary: "#e8c872",
      primaryGlow: "rgba(232, 200, 114, 0.4)",
      secondary: "#f59e0b",
      accent: "#fde68a",
      wireframe: "#e8c872",
      particle: "#fef3c7",
      starNear: "#ffffff",
      starFar: "#d97706",
      grid: "#e8c872",
      horizon: "rgba(232, 200, 114, 0.15)"
    },
    "acid-matrix": {
      name: "Acid Matrix",
      bg: "#040905",
      primary: "#34d399",
      primaryGlow: "rgba(52, 211, 153, 0.4)",
      secondary: "#10b981",
      accent: "#a7f3d0",
      wireframe: "#34d399",
      particle: "#6ee7b7",
      starNear: "#ecfdf5",
      starFar: "#047857",
      grid: "#34d399",
      horizon: "rgba(52, 211, 153, 0.15)"
    },
    "ultraviolet": {
      name: "Ultraviolet Void",
      bg: "#080414",
      primary: "#c084fc",
      primaryGlow: "rgba(192, 132, 252, 0.4)",
      secondary: "#ec4899",
      accent: "#e879f9",
      wireframe: "#c084fc",
      particle: "#f5d0fe",
      starNear: "#faf5ff",
      starFar: "#7e22ce",
      grid: "#c084fc",
      horizon: "rgba(192, 132, 252, 0.15)"
    },
    "crimson-core": {
      name: "Crimson Core",
      bg: "#0c0406",
      primary: "#ff3366",
      primaryGlow: "rgba(255, 51, 102, 0.4)",
      secondary: "#ff6b4a",
      accent: "#fda4af",
      wireframe: "#ff3366",
      particle: "#ffe4e6",
      starNear: "#ffffff",
      starFar: "#be123c",
      grid: "#ff3366",
      horizon: "rgba(255, 51, 102, 0.15)"
    }
  };

  var MASCOTS = {
    kai: {
      id: "kai",
      name: "Kai",
      species: "Holographic Cyber Cat",
      domain: "build",
      role: "Site Inspector & A11y Auditor",
      themeColor: "#00f0ff",
      geometry: "cat",
      description: "Agile holographic feline equipped with scanning optic whiskers and radar halo."
    },
    lycan: {
      id: "lycan",
      name: "Lycan",
      species: "Cybernetic AST Wolf",
      domain: "security",
      role: "Lead Security Architect & AST Enforcer",
      themeColor: "#34d399",
      geometry: "wolf",
      description: "Autonomous guardian sentinel enforcing zero-trust boundaries and AST isolation."
    },
    draco: {
      id: "draco",
      name: "Draco",
      species: "Cyber Dragon",
      domain: "contracts",
      role: "JSON Schemas & Visual DAGs",
      themeColor: "#ffaa00",
      geometry: "dragon",
      description: "Faceted celestial dragon orchestrating multi-agent tool calling and graph playbooks."
    },
    athena: {
      id: "athena",
      name: "Athena",
      species: "Mecha Owl",
      domain: "knowledge",
      role: "Knowledge Graph & Semantic Vector Architect",
      themeColor: "#c084fc",
      geometry: "owl",
      description: "Wise holographic owl indexing semantic graphs and answer engine pipelines."
    },
    ignis: {
      id: "ignis",
      name: "Ignis",
      species: "Neon Phoenix",
      domain: "refactoring",
      role: "High-Performance WASM Specialist",
      themeColor: "#ff3366",
      geometry: "phoenix",
      description: "Kinetic firebird driving ultra-fast code refactors and WebAssembly speed."
    },
    kitsune: {
      id: "kitsune",
      name: "Kitsune",
      species: "Solar Cyber Fox",
      domain: "creative",
      role: "Generative UI & Visual Foundry",
      themeColor: "#f59e0b",
      geometry: "fox",
      description: "Nine-tailed visual emissary sculpting dynamic shaders and canvas aesthetics."
    },
    zoth_core: {
      id: "zoth_core",
      name: "Zoth Monolith",
      species: "Hyper-dimensional Polyhedron",
      domain: "orchestration",
      role: "Master Sovereign Core",
      themeColor: "#00f0ff",
      geometry: "polyhedron",
      description: "Rotating obsidian-cyan hypercube and gyroscopic containment sphere."
    }
  };

  var ACTIONS = {
    "visualizer.list": true,
    "visualizer.capabilities": true,
    "visualizer.render": true,
    "visualizer.init": true,
    "visualizer.export_bundle": true
  };

  // ===========================================================================
  // 2. ZERO-CRASH CAPABILITIES DETECTION & GUARDS
  // ===========================================================================

  function detectCapabilities() {
    var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
    var result = {
      isBrowser: isBrowser,
      webgl: false,
      webgl2: false,
      renderer: "Software / Unknown",
      vendor: "Unknown",
      maxTextureSize: 2048,
      isLowPower: false,
      recommendedParticleCount: 1200,
      dpr: 1,
      prefersReducedMotion: false,
      hardwareConcurrency: 4,
      supportsPointerEvents: false
    };

    if (!isBrowser) {
      return result;
    }

    try {
      result.dpr = Math.min(window.devicePixelRatio || 1, 2);
      result.hardwareConcurrency = navigator.hardwareConcurrency || 4;
      result.supportsPointerEvents = typeof window.PointerEvent !== "undefined";

      if (window.matchMedia) {
        var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        result.prefersReducedMotion = Boolean(motionQuery && motionQuery.matches);
      }

      // Check mobile / low-power clues
      var ua = navigator.userAgent || "";
      var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      if (isMobile || result.hardwareConcurrency <= 2) {
        result.isLowPower = true;
        result.recommendedParticleCount = 450;
      } else if (result.hardwareConcurrency <= 4) {
        result.recommendedParticleCount = 900;
      } else {
        result.recommendedParticleCount = 2000;
      }

      // Test WebGL / WebGL2 context
      var testCanvas = document.createElement("canvas");
      testCanvas.width = 16;
      testCanvas.height = 16;

      var gl = null;
      try {
        gl = testCanvas.getContext("webgl2");
        if (gl) {
          result.webgl2 = true;
          result.webgl = true;
        }
      } catch (e2) {
        // webgl2 unsupported
      }

      if (!gl) {
        try {
          gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
          if (gl) {
            result.webgl = true;
          }
        } catch (e1) {
          // webgl unsupported
        }
      }

      if (gl) {
        try {
          result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
          var debugExt = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugExt) {
            result.vendor = gl.getParameter(debugExt.UNMASKED_VENDOR_WEBGL) || "WebGL Vendor";
            result.renderer = gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || "WebGL Renderer";
          } else {
            result.vendor = gl.getParameter(gl.VENDOR) || "WebGL Vendor";
            result.renderer = gl.getParameter(gl.RENDERER) || "WebGL Renderer";
          }
        } catch (eParam) {
          // Keep defaults
        }

        // Clean up WebGL context extension if possible
        var loseContext = gl.getExtension("WEBGL_lose_context");
        if (loseContext) {
          loseContext.loseContext();
        }
      } else {
        result.isLowPower = true;
        result.recommendedParticleCount = 300;
      }
    } catch (eGlobal) {
      result.webgl = false;
      result.webgl2 = false;
      result.isLowPower = true;
    }

    return result;
  }

  // ===========================================================================
  // 3. 3D MATH & GEOMETRY GENERATORS (100% Native, Zero-Dependency)
  // ===========================================================================

  var Math3D = {
    rotateX: function (p, rad) {
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      return [p[0], p[1] * cos - p[2] * sin, p[1] * sin + p[2] * cos];
    },
    rotateY: function (p, rad) {
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      return [p[0] * cos + p[2] * sin, p[1], -p[0] * sin + p[2] * cos];
    },
    rotateZ: function (p, rad) {
      var cos = Math.cos(rad);
      var sin = Math.sin(rad);
      return [p[0] * cos - p[1] * sin, p[0] * sin + p[1] * cos, p[2]];
    },
    project: function (p, width, height, fov, cameraDist) {
      fov = fov || 380;
      cameraDist = cameraDist || 300;
      var z = p[2] + cameraDist;
      if (z <= 1) z = 1;
      var scale = fov / z;
      return {
        x: width / 2 + p[0] * scale,
        y: height / 2 + p[1] * scale,
        z: p[2],
        scale: scale
      };
    },
    hexToRgb: function (hex) {
      var clean = hex.replace("#", "");
      if (clean.length === 3) {
        clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
      }
      var num = parseInt(clean, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    },
    lerpColor: function (c1, c2, t) {
      var rgb1 = typeof c1 === "string" ? Math3D.hexToRgb(c1) : c1;
      var rgb2 = typeof c2 === "string" ? Math3D.hexToRgb(c2) : c2;
      return {
        r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * t),
        g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * t),
        b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)
      };
    }
  };

  var GeometryBuilders = {
    // 3D Polyhedron / Hypercube Geometry (Vertices + Edges)
    createPolyhedron: function (size) {
      size = size || 80;
      var vertices = [
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size],
        // Inner core octahedron
        [0, -size * 1.4, 0],
        [0, size * 1.4, 0],
        [-size * 1.4, 0, 0],
        [size * 1.4, 0, 0],
        [0, 0, -size * 1.4],
        [0, 0, size * 1.4]
      ];
      var edges = [
        // Cube outer edges
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Octahedron edges
        [8, 10], [8, 11], [8, 12], [8, 13],
        [9, 10], [9, 11], [9, 12], [9, 13],
        [10, 12], [12, 11], [11, 13], [13, 10]
      ];
      return { vertices: vertices, edges: edges };
    },

    // 4D Tesseract Shadow Projection
    createTesseract: function (size) {
      size = size || 70;
      var inner = size * 0.52;
      var vertices = [];
      // Outer cube (0..7)
      for (var x = -1; x <= 1; x += 2) {
        for (var y = -1; y <= 1; y += 2) {
          for (var z = -1; z <= 1; z += 2) {
            vertices.push([x * size, y * size, z * size]);
          }
        }
      }
      // Inner cube (8..15)
      for (var ix = -1; ix <= 1; ix += 2) {
        for (var iy = -1; iy <= 1; iy += 2) {
          for (var iz = -1; iz <= 1; iz += 2) {
            vertices.push([ix * inner, iy * inner, iz * inner]);
          }
        }
      }
      var edges = [];
      // Edges for outer cube (12)
      var cubeEdges = [
        [0, 1], [1, 3], [3, 2], [2, 0],
        [4, 5], [5, 7], [7, 6], [6, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      for (var i = 0; i < cubeEdges.length; i++) {
        edges.push([cubeEdges[i][0], cubeEdges[i][1]]);
        // Same for inner cube (12)
        edges.push([cubeEdges[i][0] + 8, cubeEdges[i][1] + 8]);
      }
      // Connecting lines between 8 outer and 8 inner vertices (8) -> total 32 edges
      for (var j = 0; j < 8; j++) {
        edges.push([j, j + 8]);
      }
      return { vertices: vertices, edges: edges };
    },

    // 3D Mascot Figurine Geometries
    createMascotGeometry: function (type, size) {
      size = size || 65;
      var vertices = [];
      var edges = [];

      if (type === "cat" || type === "kai") {
        // Holographic Cyber Cat Head + Ears + Collar + Whiskers + Aura Rings
        vertices = [
          // Head polygon (0..7)
          [-size * 0.7, -size * 0.4, 0], [size * 0.7, -size * 0.4, 0],
          [size * 0.9, size * 0.3, 0], [-size * 0.9, size * 0.3, 0],
          [-size * 0.5, size * 0.8, 0], [size * 0.5, size * 0.8, 0],
          [0, -size * 0.6, size * 0.3], [0, size * 0.5, size * 0.4],
          // Left Ear (8..10)
          [-size * 0.8, -size * 0.4, 0], [-size * 0.5, -size * 1.2, 0], [-size * 0.2, -size * 0.6, 0],
          // Right Ear (11..13)
          [size * 0.8, -size * 0.4, 0], [size * 0.5, -size * 1.2, 0], [size * 0.2, -size * 0.6, 0],
          // Eyes (14..17)
          [-size * 0.45, -size * 0.1, size * 0.2], [-size * 0.2, -size * 0.1, size * 0.2],
          [size * 0.2, -size * 0.1, size * 0.2], [size * 0.45, -size * 0.1, size * 0.2],
          // Nose / Core (18)
          [0, size * 0.15, size * 0.35],
          // Whiskers Left (19..22)
          [-size * 0.3, size * 0.2, 0], [-size * 1.1, size * 0.1, 0],
          [-size * 0.3, size * 0.3, 0], [-size * 1.1, size * 0.4, 0],
          // Whiskers Right (23..26)
          [size * 0.3, size * 0.2, 0], [size * 1.1, size * 0.1, 0],
          [size * 0.3, size * 0.3, 0], [size * 1.1, size * 0.4, 0]
        ];
        edges = [
          [0, 1], [1, 2], [2, 5], [5, 4], [4, 3], [3, 0],
          [0, 6], [1, 6], [2, 7], [3, 7], [4, 7], [5, 7],
          [8, 9], [9, 10], [10, 8],
          [11, 12], [12, 13], [13, 11],
          [14, 15], [16, 17], [18, 14], [18, 17],
          [19, 20], [21, 22], [23, 24], [25, 26]
        ];
      } else if (type === "wolf" || type === "lycan") {
        // Cyber Wolf Head + Angular Muzzle + Shield Plating
        vertices = [
          // Forehead & Crown (0..3)
          [-size * 0.6, -size * 0.5, 0], [size * 0.6, -size * 0.5, 0],
          [0, -size * 0.8, size * 0.2], [0, -size * 0.2, size * 0.3],
          // Muzzle & Jaw (4..7)
          [-size * 0.35, size * 0.6, size * 0.6], [size * 0.35, size * 0.6, size * 0.6],
          [0, size * 0.9, size * 0.8], [0, size * 0.4, size * 0.1],
          // Ears (8..13)
          [-size * 0.7, -size * 0.5, 0], [-size * 0.9, -size * 1.3, -size * 0.1], [-size * 0.3, -size * 0.7, 0],
          [size * 0.7, -size * 0.5, 0], [size * 0.9, -size * 1.3, -size * 0.1], [size * 0.3, -size * 0.7, 0],
          // Eyes (14..17)
          [-size * 0.4, -size * 0.2, size * 0.3], [-size * 0.15, -size * 0.1, size * 0.35],
          [size * 0.4, -size * 0.2, size * 0.3], [size * 0.15, -size * 0.1, size * 0.35]
        ];
        edges = [
          [0, 1], [1, 3], [3, 0], [0, 2], [1, 2],
          [3, 4], [3, 5], [4, 6], [5, 6], [4, 5],
          [8, 9], [9, 10], [10, 8],
          [11, 12], [12, 13], [13, 11],
          [14, 15], [16, 17], [2, 6]
        ];
      } else if (type === "dragon" || type === "draco") {
        // Cyber Dragon Head + Horns + Faceted Wings
        vertices = [
          // Head / Snout (0..5)
          [-size * 0.4, -size * 0.3, 0], [size * 0.4, -size * 0.3, 0],
          [-size * 0.25, size * 0.7, size * 0.5], [size * 0.25, size * 0.7, size * 0.5],
          [0, size * 1.0, size * 0.7], [0, -size * 0.5, size * 0.3],
          // Horns Left & Right (6..11)
          [-size * 0.4, -size * 0.4, 0], [-size * 0.8, -size * 1.2, -size * 0.3], [-size * 1.2, -size * 1.6, -size * 0.5],
          [size * 0.4, -size * 0.4, 0], [size * 0.8, -size * 1.2, -size * 0.3], [size * 1.2, -size * 1.6, -size * 0.5],
          // Wing Spans (12..17)
          [-size * 0.5, 0, -size * 0.3], [-size * 1.5, -size * 0.6, -size * 0.2], [-size * 2.0, 0, 0],
          [size * 0.5, 0, -size * 0.3], [size * 1.5, -size * 0.6, -size * 0.2], [size * 2.0, 0, 0]
        ];
        edges = [
          [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [2, 3],
          [0, 5], [1, 5], [4, 5],
          [6, 7], [7, 8], [9, 10], [10, 11],
          [12, 13], [13, 14], [14, 12],
          [15, 16], [16, 17], [17, 15]
        ];
      } else if (type === "owl" || type === "athena") {
        // Mecha Owl Head + Large Optical Rings + Crown Tuft
        vertices = [
          [-size * 0.6, -size * 0.6, 0], [size * 0.6, -size * 0.6, 0],
          [size * 0.7, size * 0.5, 0], [-size * 0.7, size * 0.5, 0],
          [0, -size * 0.9, 0],
          // Big Lens Eyes Left (5..8)
          [-size * 0.45, -size * 0.2, size * 0.2], [-size * 0.15, -size * 0.2, size * 0.2],
          [-size * 0.15, size * 0.1, size * 0.2], [-size * 0.45, size * 0.1, size * 0.2],
          // Big Lens Eyes Right (9..12)
          [size * 0.15, -size * 0.2, size * 0.2], [size * 0.45, -size * 0.2, size * 0.2],
          [size * 0.45, size * 0.1, size * 0.2], [size * 0.15, size * 0.1, size * 0.2],
          // Beak (13..14)
          [0, size * 0.2, size * 0.4], [0, size * 0.5, size * 0.2]
        ];
        edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4],
          [5, 6], [6, 7], [7, 8], [8, 5],
          [9, 10], [10, 11], [11, 12], [12, 9],
          [13, 14], [13, 7], [13, 12]
        ];
      } else {
        // Default Polyhedron
        return GeometryBuilders.createPolyhedron(size);
      }

      // Add Orbiting Halo Ring
      var haloRadius = size * 1.5;
      var haloSteps = 16;
      var startIndex = vertices.length;
      for (var h = 0; h < haloSteps; h++) {
        var angle = (h / haloSteps) * Math.PI * 2;
        vertices.push([
          Math.cos(angle) * haloRadius,
          size * 0.2 + Math.sin(angle * 2) * 8,
          Math.sin(angle) * haloRadius
        ]);
      }
      for (var he = 0; he < haloSteps; he++) {
        edges.push([startIndex + he, startIndex + ((he + 1) % haloSteps)]);
      }

      return { vertices: vertices, edges: edges };
    },

    // Procedural Cyberspace Wireframe Matrix Terrain Grid
    createMatrixGrid: function (cols, rows, spacing) {
      cols = cols || 22;
      rows = rows || 18;
      spacing = spacing || 45;
      var vertices = [];
      var edges = [];

      var startX = -((cols - 1) * spacing) / 2;
      var startZ = 20;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = startX + c * spacing;
          var z = startZ + r * spacing;
          // Undulating sine wave terrain height
          var distFromCenter = Math.abs(c - cols / 2) / (cols / 2);
          var hillFactor = Math.pow(distFromCenter, 2) * 60;
          var y = 80 + hillFactor;
          vertices.push([x, y, z]);
        }
      }

      // Generate horizontal and vertical grid edges
      for (var gr = 0; gr < rows; gr++) {
        for (var gc = 0; gc < cols; gc++) {
          var idx = gr * cols + gc;
          if (gc < cols - 1) {
            edges.push([idx, idx + 1]);
          }
          if (gr < rows - 1) {
            edges.push([idx, idx + cols]);
          }
        }
      }

      return { vertices: vertices, edges: edges, cols: cols, rows: rows, spacing: spacing };
    },

    // 3D Hyperspace Warp Tunnel Rings
    createTunnelRings: function (ringCount, segments, radius, length) {
      ringCount = ringCount || 12;
      segments = segments || 14;
      radius = radius || 140;
      length = length || 700;
      var vertices = [];
      var edges = [];

      var stepZ = length / ringCount;
      for (var r = 0; r < ringCount; r++) {
        var z = -100 + r * stepZ;
        var rBase = r * segments;
        for (var s = 0; s < segments; s++) {
          var angle = (s / segments) * Math.PI * 2;
          vertices.push([
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            z
          ]);
          edges.push([rBase + s, rBase + ((s + 1) % segments)]);
          if (r > 0) {
            edges.push([rBase + s, (r - 1) * segments + s]);
          }
        }
      }
      return { vertices: vertices, edges: edges, ringCount: ringCount, segments: segments };
    }
  };

  // ===========================================================================
  // 4. HIGH-PERFORMANCE 60 FPS CONTROLLER ENGINE (Canvas2D & WebGL)
  // ===========================================================================

  function VisualizerInstance(canvas, config) {
    this.canvas = canvas;
    this.config = config || {};
    this.caps = detectCapabilities();

    this.mode = this.config.mode || MODES.STARFIELD;
    this.gravityMode = this.config.gravityMode || GRAVITY_MODES.ATTRACT;
    this.themeKey = this.config.theme || "obsidian-cyan";
    this.theme = THEMES[this.themeKey] || THEMES["obsidian-cyan"];
    this.mascotKey = this.config.mascot || "kai";
    this.mascot = MASCOTS[this.mascotKey] || MASCOTS.kai;

    this.particleCount = typeof this.config.particleCount === "number"
      ? this.config.particleCount
      : this.caps.recommendedParticleCount;

    this.width = canvas.clientWidth || canvas.width || 800;
    this.height = canvas.clientHeight || canvas.height || 500;
    this.dpr = this.caps.isLowPower ? 1 : Math.min((typeof window !== "undefined" && window.devicePixelRatio) || 1, 2);

    this.running = false;
    this.rafId = null;
    this.lastTime = 0;
    this.fps = 60;
    this.frameCounter = 0;
    this.fpsTimer = 0;

    // Mouse / Pointer State
    this.pointer = {
      x: this.width / 2,
      y: this.height / 2,
      targetX: this.width / 2,
      targetY: this.height / 2,
      normalizedX: 0, // -1 to 1
      normalizedY: 0,
      active: false,
      isDown: false,
      warpIntensity: 1.0
    };

    // Rotation & Kinetics
    this.rot = { x: 0, y: 0, z: 0, vx: 0.005, vy: 0.008 };
    this.cameraDist = 280;
    this.fov = 380;
    this.time = 0;

    // Initialize Particles & Geometry
    this.particles = [];
    this.initParticles();
    this.initGeometries();

    // Context & Renderer
    this.ctx = null;
    this.gl = null;
    this.useWebGL = false;
    this.setupRenderer();
    this.bindEvents();
  }

  VisualizerInstance.prototype.setupRenderer = function () {
    var self = this;
    if (!this.canvas) return;

    // Adjust canvas resolution
    this.resize();

    // Check if WebGL requested and supported
    if (this.config.renderer === "webgl" && this.caps.webgl && !this.caps.prefersReducedMotion) {
      try {
        var opts = { alpha: true, antialias: true, preserveDrawingBuffer: false };
        this.gl = this.canvas.getContext("webgl2", opts) || this.canvas.getContext("webgl", opts);
        if (this.gl) {
          this.useWebGL = true;
          this.initGLShaders();
        }
      } catch (e) {
        this.useWebGL = false;
      }
    }

    if (!this.useWebGL) {
      this.ctx = this.canvas.getContext("2d", { alpha: true });
    }

    // WebGL Context Lost Guards
    this.onContextLost = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      self.useWebGL = false;
      self.gl = null;
      self.ctx = self.canvas.getContext("2d", { alpha: true });
      if (self.config.onContextLost) self.config.onContextLost();
    };

    this.onContextRestored = function () {
      if (self.config.renderer === "webgl") {
        self.setupRenderer();
      }
    };

    this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored, false);
  };

  VisualizerInstance.prototype.initParticles = function () {
    this.particles = [];
    var count = this.particleCount;
    var spreadX = this.width * 1.5;
    var spreadY = this.height * 1.5;
    var spreadZ = 600;

    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * spreadX,
        y: (Math.random() - 0.5) * spreadY,
        z: (Math.random() - 0.5) * spreadZ,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: 0.8 + Math.random() * 1.8,
        baseSize: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.8,
        colorIndex: Math.random()
      });
    }
  };

  VisualizerInstance.prototype.initGeometries = function () {
    this.polyhedron = GeometryBuilders.createPolyhedron(75);
    this.tesseract = GeometryBuilders.createTesseract(70);
    this.mascotGeo = GeometryBuilders.createMascotGeometry(this.mascot.geometry || "cat", 65);
    this.matrixGrid = GeometryBuilders.createMatrixGrid(20, 16, 42);
    this.tunnelRings = GeometryBuilders.createTunnelRings(10, 12, 130, 600);
  };

  VisualizerInstance.prototype.initGLShaders = function () {
    if (!this.gl) return;
    var gl = this.gl;

    var vsSource = `
      attribute vec3 aPosition;
      attribute vec4 aColor;
      attribute float aSize;
      uniform mat4 uMatrix;
      varying vec4 vColor;
      void main() {
        gl_Position = uMatrix * vec4(aPosition, 1.0);
        gl_PointSize = aSize * (200.0 / gl_Position.w);
        vColor = aColor;
      }
    `;

    var fsSource = `
      precision mediump float;
      varying vec4 vColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vColor.a;
        gl_FragColor = vec4(vColor.rgb, alpha);
      }
    `;

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, vsSource);
    var fs = compile(gl.FRAGMENT_SHADER, fsSource);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    this.glProg = prog;
    this.glPosAttr = gl.getAttribLocation(prog, "aPosition");
    this.glColorAttr = gl.getAttribLocation(prog, "aColor");
    this.glSizeAttr = gl.getAttribLocation(prog, "aSize");
    this.glMatrixUni = gl.getUniformLocation(prog, "uMatrix");
    this.glBuffer = gl.createBuffer();
  };

  VisualizerInstance.prototype.bindEvents = function () {
    var self = this;
    if (typeof window === "undefined" || !this.canvas) return;

    this.handlePointerMove = function (e) {
      var rect = self.canvas.getBoundingClientRect();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      self.pointer.targetX = clientX - rect.left;
      self.pointer.targetY = clientY - rect.top;
      self.pointer.normalizedX = (self.pointer.targetX / self.width) * 2 - 1;
      self.pointer.normalizedY = (self.pointer.targetY / self.height) * 2 - 1;
      self.pointer.active = true;
    };

    this.handlePointerDown = function () {
      self.pointer.isDown = true;
      if (self.gravityMode === GRAVITY_MODES.WARP) {
        self.pointer.warpIntensity = 3.5;
      }
    };

    this.handlePointerUp = function () {
      self.pointer.isDown = false;
      self.pointer.warpIntensity = 1.0;
    };

    this.handlePointerLeave = function () {
      self.pointer.active = false;
      self.pointer.isDown = false;
      self.pointer.targetX = self.width / 2;
      self.pointer.targetY = self.height / 2;
      self.pointer.normalizedX = 0;
      self.pointer.normalizedY = 0;
    };

    this.handleResize = function () {
      self.resize();
    };

    this.handleVisibility = function () {
      if (document.hidden) {
        self.stop();
      } else {
        self.start();
      }
    };

    // Attach listeners
    this.canvas.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.canvas.addEventListener("pointerdown", this.handlePointerDown, { passive: true });
    window.addEventListener("pointerup", this.handlePointerUp, { passive: true });
    this.canvas.addEventListener("pointerleave", this.handlePointerLeave, { passive: true });

    // Touch support fallback
    this.canvas.addEventListener("touchmove", this.handlePointerMove, { passive: true });
    this.canvas.addEventListener("touchstart", this.handlePointerDown, { passive: true });
    this.canvas.addEventListener("touchend", this.handlePointerUp, { passive: true });

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleResize, { passive: true });
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibility, false);
    }
  };

  VisualizerInstance.prototype.resize = function () {
    if (!this.canvas) return;
    var rect = (typeof this.canvas.getBoundingClientRect === "function") ? this.canvas.getBoundingClientRect() : { width: 0, height: 0 };
    var parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
    var parentH = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : 0;
    this.width = rect.width || parentW || this.canvas.width || 800;
    this.height = rect.height || parentH || this.canvas.height || 500;
    if (this.width <= 0) this.width = 800;
    if (this.height <= 0) this.height = 500;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    if (this.ctx) {
      this.ctx.resetTransform && this.ctx.resetTransform();
      this.ctx.scale(this.dpr, this.dpr);
    }
    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  VisualizerInstance.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    var self = this;

    function loop(now) {
      if (!self.running) return;
      var delta = Math.min((now - self.lastTime) / 1000, 0.1);
      self.lastTime = now;
      self.time += delta;

      // FPS tracking
      self.frameCounter++;
      if (now - self.fpsTimer >= 1000) {
        self.fps = self.frameCounter;
        self.frameCounter = 0;
        self.fpsTimer = now;
      }

      self.update(delta);
      self.render();

      self.rafId = requestAnimationFrame(loop);
    }

    this.rafId = requestAnimationFrame(loop);
  };

  VisualizerInstance.prototype.stop = function () {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  VisualizerInstance.prototype.setMode = function (mode) {
    if (MODES[mode.toUpperCase()] || Object.values(MODES).indexOf(mode) !== -1) {
      this.mode = mode;
      this.initParticles();
    }
  };

  VisualizerInstance.prototype.setGravityMode = function (gMode) {
    if (GRAVITY_MODES[gMode.toUpperCase()] || Object.values(GRAVITY_MODES).indexOf(gMode) !== -1) {
      this.gravityMode = gMode;
    }
  };

  VisualizerInstance.prototype.setTheme = function (themeKey) {
    if (THEMES[themeKey]) {
      this.themeKey = themeKey;
      this.theme = THEMES[themeKey];
    }
  };

  VisualizerInstance.prototype.setMascot = function (mascotKey) {
    if (MASCOTS[mascotKey]) {
      this.mascotKey = mascotKey;
      this.mascot = MASCOTS[mascotKey];
      this.mascotGeo = GeometryBuilders.createMascotGeometry(this.mascot.geometry || "cat", 65);
    }
  };

  VisualizerInstance.prototype.update = function (delta) {
    // Smooth pointer lerp
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.1;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.1;

    // Rotations based on mouse and idle drift
    var targetRotY = this.pointer.normalizedX * 0.8;
    var targetRotX = -this.pointer.normalizedY * 0.6;
    this.rot.y += (targetRotY - this.rot.y) * 0.05 + this.rot.vy * (this.pointer.active ? 0.3 : 1.0);
    this.rot.x += (targetRotX - this.rot.x) * 0.05 + this.rot.vx * (this.pointer.active ? 0.3 : 1.0);
    this.rot.z += 0.003;

    // Update Particles
    var speedMultiplier = this.pointer.warpIntensity;
    var pCenterX = this.pointer.x - this.width / 2;
    var pCenterY = this.pointer.y - this.height / 2;
    var halfW = this.width * 0.75;
    var halfH = this.height * 0.75;

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];

      // Gravity Physics
      if (this.gravityMode !== GRAVITY_MODES.OFF && this.pointer.active) {
        var dx = pCenterX - p.x;
        var dy = pCenterY - p.y;
        var distSq = dx * dx + dy * dy;
        var dist = Math.sqrt(distSq);

        if (dist > 10 && dist < 320) {
          var force = 120 / (distSq + 200);
          if (this.gravityMode === GRAVITY_MODES.ATTRACT) {
            p.vx += (dx / dist) * force * 15;
            p.vy += (dy / dist) * force * 15;
          } else if (this.gravityMode === GRAVITY_MODES.REPEL) {
            p.vx -= (dx / dist) * force * 25;
            p.vy -= (dy / dist) * force * 25;
          } else if (this.gravityMode === GRAVITY_MODES.VORTEX) {
            p.vx += (-dy / dist) * force * 20 + (dx / dist) * force * 5;
            p.vy += (dx / dist) * force * 20 + (dy / dist) * force * 5;
          }
        }
      }

      // Drag friction
      p.vx *= 0.96;
      p.vy *= 0.96;

      p.x += p.vx;
      p.y += p.vy;
      p.z -= p.vz * speedMultiplier * (60 * delta);

      // Wrap around Z bounds
      if (p.z < -200) {
        p.z = 400;
        p.x = (Math.random() - 0.5) * this.width * 1.4;
        p.y = (Math.random() - 0.5) * this.height * 1.4;
      } else if (p.z > 450) {
        p.z = -180;
      }

      // Wrap around X / Y bounds
      if (p.x < -halfW) p.x = halfW;
      if (p.x > halfW) p.x = -halfW;
      if (p.y < -halfH) p.y = halfH;
      if (p.y > halfH) p.y = -halfH;
    }
  };

  VisualizerInstance.prototype.render = function () {
    if (this.useWebGL && this.gl) {
      this.renderWebGL();
    } else if (this.ctx) {
      this.renderCanvas2D();
    }
  };

  VisualizerInstance.prototype.renderCanvas2D = function () {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    var theme = this.theme;

    // Clear background with soft gradient
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // Render Ambient Horizon Glow
    var grad = ctx.createRadialGradient(
      width / 2 + this.pointer.normalizedX * 60,
      height / 2 + this.pointer.normalizedY * 40,
      20,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.65
    );
    grad.addColorStop(0, theme.primaryGlow);
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 1. Starfield Particles (Depth-sorted or direct)
    if (this.mode === MODES.STARFIELD || this.mode === MODES.HYBRID) {
      this.renderStarfield2D(ctx);
    }

    // 2. Matrix Grid Terrain Wireframe
    if (this.mode === MODES.MATRIX_GRID || this.mode === MODES.HYBRID) {
      this.renderMatrixGrid2D(ctx);
    }

    // 3. Cyber Tunnel
    if (this.mode === MODES.CYBER_TUNNEL) {
      this.renderTunnel2D(ctx);
    }

    // 4. Companion Mascot 3D Figurine
    if (this.mode === MODES.MASCOT_3D || (this.mode === MODES.HYBRID && this.mascotKey)) {
      this.renderMascot2D(ctx);
    }

    // 5. Hyperobject Wireframe
    if (this.mode === MODES.HYPEROBJECT) {
      this.renderHyperobject2D(ctx);
    }
  };

  VisualizerInstance.prototype.renderStarfield2D = function (ctx) {
    var width = this.width;
    var height = this.height;
    var theme = this.theme;
    var fov = this.fov;
    var cameraDist = this.cameraDist;

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var proj = Math3D.project([p.x, p.y, p.z], width, height, fov, cameraDist);

      if (proj.x >= -10 && proj.x <= width + 10 && proj.y >= -10 && proj.y <= height + 10) {
        var size = Math.max(0.6, p.baseSize * proj.scale);
        var alpha = Math.min(1, Math.max(0.1, (1 - p.z / 400) * p.alpha));

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.colorIndex > 0.6 ? theme.starNear : theme.particle;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Constellation link to pointer if close
        if (this.pointer.active && i % 4 === 0) {
          var dpx = this.pointer.x - proj.x;
          var dpy = this.pointer.y - proj.y;
          var dist = Math.sqrt(dpx * dpx + dpy * dpy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
            ctx.lineTo(this.pointer.x, this.pointer.y);
            ctx.strokeStyle = theme.primary;
            ctx.globalAlpha = (1 - dist / 110) * 0.35;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    ctx.globalAlpha = 1.0;
  };

  VisualizerInstance.prototype.renderMatrixGrid2D = function (ctx) {
    var width = this.width;
    var height = this.height;
    var theme = this.theme;
    var fov = this.fov;
    var cameraDist = this.cameraDist;
    var grid = this.matrixGrid;
    var time = this.time;

    var rotX = 0.35 + this.rot.x * 0.2;
    var rotY = this.rot.y * 0.3;

    var projVerts = [];
    for (var i = 0; i < grid.vertices.length; i++) {
      var v = grid.vertices[i];
      // Wave motion
      var waveY = v[1] + Math.sin(time * 2 + v[0] * 0.02 + v[2] * 0.03) * 8;
      var pRot = Math3D.rotateX([v[0], waveY, v[2]], rotX);
      pRot = Math3D.rotateY(pRot, rotY);
      projVerts.push(Math3D.project(pRot, width, height, fov, cameraDist));
    }

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1.1;

    for (var e = 0; e < grid.edges.length; e++) {
      var p1 = projVerts[grid.edges[e][0]];
      var p2 = projVerts[grid.edges[e][1]];
      if (p1 && p2 && p1.scale > 0 && p2.scale > 0) {
        var alpha = Math.min(0.8, Math.max(0.05, (p1.scale + p2.scale) * 0.4));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1.0;
  };

  VisualizerInstance.prototype.renderTunnel2D = function (ctx) {
    var width = this.width;
    var height = this.height;
    var theme = this.theme;
    var fov = this.fov;
    var cameraDist = this.cameraDist;
    var tunnel = this.tunnelRings;
    var time = this.time;

    var rotX = this.rot.x * 0.5;
    var rotY = this.rot.y * 0.5;
    var rotZ = time * 0.3;

    var projVerts = [];
    for (var i = 0; i < tunnel.vertices.length; i++) {
      var v = tunnel.vertices[i];
      var offsetZ = (v[2] - (time * 120) % 600);
      if (offsetZ < -150) offsetZ += 600;

      var pRot = Math3D.rotateZ([v[0], v[1], offsetZ], rotZ);
      pRot = Math3D.rotateX(pRot, rotX);
      pRot = Math3D.rotateY(pRot, rotY);
      projVerts.push(Math3D.project(pRot, width, height, fov, cameraDist));
    }

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 1.2;

    for (var e = 0; e < tunnel.edges.length; e++) {
      var p1 = projVerts[tunnel.edges[e][0]];
      var p2 = projVerts[tunnel.edges[e][1]];
      if (p1 && p2 && p1.scale > 0 && p2.scale > 0) {
        var alpha = Math.min(0.85, Math.max(0.1, (p1.scale + p2.scale) * 0.5));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1.0;
  };

  VisualizerInstance.prototype.renderMascot2D = function (ctx) {
    var width = this.width;
    var height = this.height;
    var mascot = this.mascot;
    var theme = this.theme;
    var geo = this.mascotGeo;
    var fov = this.fov;
    var cameraDist = this.cameraDist;
    var time = this.time;

    // Bobbing float physics
    var bobY = Math.sin(time * 2.2) * 12;
    var rotX = this.rot.x + Math.sin(time * 1.5) * 0.05;
    var rotY = this.rot.y + time * 0.4;
    var rotZ = Math.sin(time * 1.8) * 0.08;

    var projVerts = [];
    for (var i = 0; i < geo.vertices.length; i++) {
      var v = geo.vertices[i];
      var pRot = Math3D.rotateZ([v[0], v[1] + bobY, v[2]], rotZ);
      pRot = Math3D.rotateX(pRot, rotX);
      pRot = Math3D.rotateY(pRot, rotY);
      projVerts.push(Math3D.project(pRot, width, height, fov, cameraDist));
    }

    // Draw Wireframe Edges with Glow
    ctx.strokeStyle = mascot.themeColor || theme.primary;
    ctx.lineWidth = 1.6;

    for (var e = 0; e < geo.edges.length; e++) {
      var p1 = projVerts[geo.edges[e][0]];
      var p2 = projVerts[geo.edges[e][1]];
      if (p1 && p2 && p1.scale > 0 && p2.scale > 0) {
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // Draw glowing vertex points
    ctx.fillStyle = "#ffffff";
    for (var vp = 0; vp < projVerts.length; vp++) {
      var pt = projVerts[vp];
      if (pt && pt.scale > 0) {
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1.2, 2.5 * pt.scale), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  };

  VisualizerInstance.prototype.renderHyperobject2D = function (ctx) {
    var width = this.width;
    var height = this.height;
    var theme = this.theme;
    var geo = this.tesseract;
    var fov = this.fov;
    var cameraDist = this.cameraDist;
    var time = this.time;

    var rotX = this.rot.x + time * 0.5;
    var rotY = this.rot.y + time * 0.7;
    var rotZ = time * 0.3;

    var projVerts = [];
    for (var i = 0; i < geo.vertices.length; i++) {
      var v = geo.vertices[i];
      var pRot = Math3D.rotateZ(v, rotZ);
      pRot = Math3D.rotateX(pRot, rotX);
      pRot = Math3D.rotateY(pRot, rotY);
      projVerts.push(Math3D.project(pRot, width, height, fov, cameraDist));
    }

    ctx.strokeStyle = theme.wireframe;
    ctx.lineWidth = 1.5;

    for (var e = 0; e < geo.edges.length; e++) {
      var p1 = projVerts[geo.edges[e][0]];
      var p2 = projVerts[geo.edges[e][1]];
      if (p1 && p2 && p1.scale > 0 && p2.scale > 0) {
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    // Core pulsing star
    var corePulse = 4 + Math.sin(time * 4) * 2;
    ctx.fillStyle = theme.primary;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, corePulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  };

  VisualizerInstance.prototype.renderWebGL = function () {
    var gl = this.gl;
    if (!gl) return;

    var width = this.canvas.width;
    var height = this.canvas.height;
    var rgb = Math3D.hexToRgb(this.theme.bg);

    gl.viewport(0, 0, width, height);
    gl.clearColor(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.glProg);

    // Simple orthographic / perspective projection matrix
    var aspect = width / height;
    var matrix = [
      1 / aspect, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 0.002, 0,
      0, 0, 0, 1
    ];
    gl.uniformMatrix4fv(this.glMatrixUni, false, new Float32Array(matrix));

    // Pack particle data: x, y, z, r, g, b, a, size
    var particleData = new Float32Array(this.particles.length * 8);
    var pRgb = Math3D.hexToRgb(this.theme.primary);
    var sRgb = Math3D.hexToRgb(this.theme.starNear);

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var idx = i * 8;
      var c = p.colorIndex > 0.5 ? sRgb : pRgb;
      var nx = (p.x / (this.width / 2));
      var ny = -(p.y / (this.height / 2));
      var nz = p.z;

      particleData[idx + 0] = nx;
      particleData[idx + 1] = ny;
      particleData[idx + 2] = nz;
      particleData[idx + 3] = c.r / 255;
      particleData[idx + 4] = c.g / 255;
      particleData[idx + 5] = c.b / 255;
      particleData[idx + 6] = p.alpha;
      particleData[idx + 7] = p.baseSize * 1.5;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);

    var stride = 8 * 4; // 8 floats * 4 bytes
    gl.enableVertexAttribArray(this.glPosAttr);
    gl.vertexAttribPointer(this.glPosAttr, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(this.glColorAttr);
    gl.vertexAttribPointer(this.glColorAttr, 4, gl.FLOAT, false, stride, 3 * 4);

    gl.enableVertexAttribArray(this.glSizeAttr);
    gl.vertexAttribPointer(this.glSizeAttr, 1, gl.FLOAT, false, stride, 7 * 4);

    gl.drawArrays(gl.POINTS, 0, this.particles.length);
  };

  VisualizerInstance.prototype.getStats = function () {
    return {
      fps: this.fps,
      particleCount: this.particles.length,
      mode: this.mode,
      gravityMode: this.gravityMode,
      theme: this.themeKey,
      mascot: this.mascotKey,
      renderer: this.useWebGL ? "WebGL (" + this.caps.renderer + ")" : "Canvas2D Vector Fallback",
      lowPowerMode: this.caps.isLowPower,
      dpr: this.dpr,
      width: this.width,
      height: this.height
    };
  };

  VisualizerInstance.prototype.destroy = function () {
    this.stop();
    if (typeof window !== "undefined" && this.canvas) {
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
      window.removeEventListener("pointerup", this.handlePointerUp);
      this.canvas.removeEventListener("pointerleave", this.handlePointerLeave);
      this.canvas.removeEventListener("touchmove", this.handlePointerMove);
      this.canvas.removeEventListener("touchstart", this.handlePointerDown);
      this.canvas.removeEventListener("touchend", this.handlePointerUp);
      window.removeEventListener("resize", this.handleResize);
      document.removeEventListener("visibilitychange", this.handleVisibility);
      this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
      this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    }
  };

  // Factory function
  function createVisualizer(canvasOrContainer, config) {
    var canvas = null;
    if (typeof canvasOrContainer === "string") {
      if (typeof document !== "undefined") {
        var el = document.querySelector(canvasOrContainer);
        if (el && el.tagName === "CANVAS") {
          canvas = el;
        } else if (el) {
          canvas = document.createElement("canvas");
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.display = "block";
          el.appendChild(canvas);
        }
      }
    } else if (canvasOrContainer && canvasOrContainer.tagName === "CANVAS") {
      canvas = canvasOrContainer;
    } else if (canvasOrContainer) {
      if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvasOrContainer.appendChild(canvas);
      }
    }

    if (!canvas) {
      return null;
    }

    var inst = new VisualizerInstance(canvas, config);
    if (config && config.autoStart !== false) {
      inst.start();
    }
    return inst;
  }

  // ===========================================================================
  // 5. EMBEDDABLE HERO SECTION & FULL PAGE CODE GENERATORS
  // ===========================================================================

  function generateHeroHtml(mode, options) {
    mode = mode || MODES.STARFIELD;
    var opt = options || {};
    var title = opt.title || "Next-Gen 3D Autonomous Web Foundry";
    var highlight = opt.highlight || "GPU-Accelerated Sovereign AI";
    var desc = opt.desc || "Experience 60 FPS interactive 3D starfields with mouse gravity, orbiting holographic mascots, and procedural cyber wireframes.";
    var badge = opt.badge || "⚡ Sovereign 3D WebGL · Zero Leakage";
    var primaryCta = opt.primaryCta || "🚀 Launch Visualizer";
    var secondaryCta = opt.secondaryCta || "⚙️ Configure HUD";
    var canvasId = opt.canvasId || "zoth3DHeroCanvas";
    var themeKey = opt.theme || "obsidian-cyan";
    var mascotKey = opt.mascot || "kai";
    var gravityMode = opt.gravityMode || "attract";

    return `
<!-- Zoth 3D WebGL Canvas Hero Visualizer -->
<div class="zoth-3d-hero-wrapper" style="position: relative; width: 100%; min-height: 520px; overflow: hidden; background: #030611; border-radius: 16px; border: 1px solid rgba(0, 240, 255, 0.22);">
  <canvas id="${canvasId}" class="zoth-3d-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 1; pointer-events: auto;"></canvas>
  
  <div class="zoth-3d-hero-overlay" style="position: relative; z-index: 2; pointer-events: none; padding: 4rem 2rem; max-width: 900px; margin: 0 auto; text-align: center; color: #ffffff;">
    <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 9999px; font-size: 0.82rem; font-family: monospace; color: #00f0ff; margin-bottom: 1.5rem; pointer-events: auto;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: #00f0ff; box-shadow: 0 0 10px #00f0ff; animation: pulse 2s infinite;"></span>
      ${badge}
    </div>
    <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.15; margin: 0 0 1.25rem 0; letter-spacing: -0.02em;">
      ${title} <br />
      <span style="background: linear-gradient(135deg, #00f0ff 0%, #7000ff 50%, #ff007a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${highlight}</span>
    </h1>
    <p style="font-size: 1.1rem; color: #94a3b8; max-width: 680px; margin: 0 auto 2rem auto; line-height: 1.6;">
      ${desc}
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap; pointer-events: auto;">
      <button onclick="window.__zothVisualizer && window.__zothVisualizer.setGravityMode('warp')" style="padding: 12px 26px; border-radius: 10px; background: linear-gradient(135deg, #00f0ff, #0070f3); color: #030611; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4); font-size: 0.95rem; transition: transform 0.2s, box-shadow 0.2s;">${primaryCta}</button>
      <button onclick="window.__zothVisualizer && window.__zothVisualizer.setMode('${mode === MODES.STARFIELD ? MODES.MASCOT_3D : MODES.STARFIELD}')" style="padding: 12px 24px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); color: #f1f5f9; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer; backdrop-filter: blur(8px); font-size: 0.95rem;">${secondaryCta}</button>
    </div>
    
    <!-- 3D HUD Telemetry Bar -->
    <div style="margin-top: 2.5rem; display: inline-flex; gap: 1.5rem; background: rgba(3, 6, 17, 0.75); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 12px; padding: 10px 18px; backdrop-filter: blur(10px); font-family: monospace; font-size: 0.78rem; color: #94a3b8; pointer-events: auto;">
      <div>MODE: <span style="color: #00f0ff;" id="zothHudMode">${mode}</span></div>
      <div>FPS: <span style="color: #34d399;" id="zothHudFps">60</span></div>
      <div>GRAVITY: <span style="color: #e8c872;" id="zothHudGravity">${gravityMode}</span></div>
      <div>GPU: <span style="color: #c084fc;" id="zothHudGpu">ACTIVE</span></div>
    </div>
  </div>
</div>

<script>
(function() {
  function initHeroVisualizer() {
    var canvas = document.getElementById("${canvasId}");
    if (!canvas || !window.Site3DWebGL) return;
    
    var vis = window.Site3DWebGL.createVisualizer(canvas, {
      mode: "${mode}",
      theme: "${themeKey}",
      mascot: "${mascotKey}",
      gravityMode: "${gravityMode}"
    });
    window.__zothVisualizer = vis;

    // HUD Stats loop
    setInterval(function() {
      if (!vis) return;
      var stats = vis.getStats();
      var fpsEl = document.getElementById("zothHudFps");
      var modeEl = document.getElementById("zothHudMode");
      var gravEl = document.getElementById("zothHudGravity");
      var gpuEl = document.getElementById("zothHudGpu");
      if (fpsEl) fpsEl.textContent = stats.fps;
      if (modeEl) modeEl.textContent = stats.mode;
      if (gravEl) gravEl.textContent = stats.gravityMode;
      if (gpuEl) gpuEl.textContent = stats.lowPowerMode ? "2D FALLBACK" : "WEBGL/60";
    }, 500);
  }
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroVisualizer);
  } else {
    initHeroVisualizer();
  }
})();
</script>
    `.trim();
  }

  function generateStandalonePage(mode, options) {
    mode = mode || MODES.STARFIELD;
    var opt = options || {};
    var title = opt.title || "Zoth 3D WebGL Canvas Hero Visualizer";
    var heroSnippet = generateHeroHtml(mode, opt);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #02040a;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .page-container {
      width: 100%;
      max-width: 1100px;
    }
    .controls-panel {
      margin-top: 1.5rem;
      background: rgba(10, 15, 29, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.25);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(12px);
    }
    .btn-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .btn-ctrl {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ctrl:hover, .btn-ctrl.active {
      background: rgba(0, 240, 255, 0.2);
      border-color: #00f0ff;
      color: #00f0ff;
    }
  </style>
  <script src="/tools/site-3d-webgl.js"></script>
</head>
<body>
  <div class="page-container">
    ${heroSnippet}
    
    <div class="controls-panel">
      <div class="btn-group">
        <span style="font-size: 0.85rem; color: #94a3b8; align-self: center; margin-right: 4px;">Modes:</span>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('starfield')">Starfield</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('mascot-3d')">3D Mascot</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('matrix-grid')">Matrix Grid</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('hyperobject')">Tesseract</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('cyber-tunnel')">Cyber Tunnel</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMode('hybrid')">Hybrid Hero</button>
      </div>
      
      <div class="btn-group">
        <span style="font-size: 0.85rem; color: #94a3b8; align-self: center; margin-right: 4px;">Gravity:</span>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setGravityMode('attract')">Attract</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setGravityMode('repel')">Repel</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setGravityMode('vortex')">Vortex</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setGravityMode('warp')">Warp</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setGravityMode('off')">Off</button>
      </div>

      <div class="btn-group">
        <span style="font-size: 0.85rem; color: #94a3b8; align-self: center; margin-right: 4px;">Mascot:</span>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMascot('kai')">Kai (Cat)</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMascot('lycan')">Lycan (Wolf)</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMascot('draco')">Draco (Dragon)</button>
        <button class="btn-ctrl" onclick="window.__zothVisualizer.setMascot('athena')">Athena (Owl)</button>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // ===========================================================================
  // 6. TOOL ENGINE ACTION DISPATCHER (Zoth Contract)
  // ===========================================================================

  function validate(request) {
    if (!request || typeof request !== "object") {
      return { ok: false, error: { code: "validation_error", message: "request must be an object" } };
    }
    if (!request.action || !ACTIONS[request.action]) {
      return { ok: false, error: { code: "validation_error", message: "invalid action: " + request.action } };
    }
    return { ok: true };
  }

  function run(request) {
    var check = validate(request);
    if (!check.ok) return check;

    var action = request.action;
    var params = request.params || {};
    var meta = request.meta || {};
    var now = new Date().toISOString();

    if (action === "visualizer.list") {
      return {
        ok: true,
        data: {
          version: VERSION,
          modes: Object.values(MODES),
          gravity_modes: Object.values(GRAVITY_MODES),
          themes: Object.keys(THEMES),
          mascots: Object.keys(MASCOTS).map(function (k) {
            return {
              id: k,
              name: MASCOTS[k].name,
              species: MASCOTS[k].species,
              role: MASCOTS[k].role,
              color: MASCOTS[k].themeColor
            };
          })
        },
        meta: { request_id: meta.request_id || "req_vis_list_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "visualizer.capabilities") {
      var caps = detectCapabilities();
      return {
        ok: true,
        data: caps,
        meta: { request_id: meta.request_id || "req_vis_caps_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "visualizer.render") {
      var mode = params.mode || MODES.STARFIELD;
      var html = generateHeroHtml(mode, params.options || {});
      return {
        ok: true,
        data: { mode: mode, html: html },
        meta: { request_id: meta.request_id || "req_vis_render_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "visualizer.export_bundle") {
      var expMode = params.mode || MODES.STARFIELD;
      var fullHtml = generateStandalonePage(expMode, params.options || {});
      return {
        ok: true,
        data: { mode: expMode, html: fullHtml },
        meta: { request_id: meta.request_id || "req_vis_bundle_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "visualizer.init") {
      return {
        ok: true,
        data: {
          instructions: "Call window.Site3DWebGL.createVisualizer(canvasElement, options) in browser context.",
          modes: Object.values(MODES),
          gravity_modes: Object.values(GRAVITY_MODES)
        },
        meta: { request_id: meta.request_id || "req_vis_init_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    return { ok: false, error: { code: "unhandled_action", message: "unhandled action: " + action } };
  }

  // ===========================================================================
  // PUBLIC EXPORTS
  // ===========================================================================
  return {
    VERSION: VERSION,
    MODES: MODES,
    GRAVITY_MODES: GRAVITY_MODES,
    THEMES: THEMES,
    MASCOTS: MASCOTS,
    Math3D: Math3D,
    GeometryBuilders: GeometryBuilders,
    detectCapabilities: detectCapabilities,
    createVisualizer: createVisualizer,
    VisualizerInstance: VisualizerInstance,
    generateHeroHtml: generateHeroHtml,
    generateStandalonePage: generateStandalonePage,
    validate: validate,
    run: run
  };
});
