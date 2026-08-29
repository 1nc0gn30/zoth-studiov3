/**
 * Zoth Kinetic 3D Synthesis Orb (Three.js WebGL Particle Core)
 * Renders an animated alchemical particle sphere with dynamic 4-theme reactivity (Dark, Light, Matrix, Gold)
 * and full lifecycle memory / WebGL context disposal.
 */

(function (window) {
  'use strict';

  var ORB_THEMES = {
    dark: {
      colorA: 0x00f0ff, // Electric Cyan
      colorB: 0xfbbf24, // Alchemical Gold
      torusA: 0x00f0ff,
      torusB: 0xfbbf24,
      torusAOpacity: 0.55,
      torusBOpacity: 0.45
    },
    light: {
      colorA: 0x0284c7, // Solar Sapphire
      colorB: 0xd97706, // Warm Amber
      torusA: 0x0284c7,
      torusB: 0x1d4ed8,
      torusAOpacity: 0.65,
      torusBOpacity: 0.50
    },
    matrix: {
      colorA: 0x00ff66, // Matrix Phosphor Green
      colorB: 0x00d4aa, // Cyber Mint
      torusA: 0x00ff66,
      torusB: 0x10b981,
      torusAOpacity: 0.70,
      torusBOpacity: 0.55
    },
    gold: {
      colorA: 0xfbbf24, // 24K Alchemical Gold
      colorB: 0xf59e0b, // Amber Bronze
      torusA: 0xfbbf24,
      torusB: 0xe8c872,
      torusAOpacity: 0.75,
      torusBOpacity: 0.60
    }
  };

  function initThreeLoadingOrb(containerId) {
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || !window.THREE) return null;

    var width = container.clientWidth || 220;
    var height = container.clientHeight || 220;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (e) {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for complex rotation
    var group = new THREE.Group();
    scene.add(group);

    // 1. Particle Sphere
    var particleCount = 700;
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
      var u = Math.random();
      var v = Math.random();
      var theta = u * 2.0 * Math.PI;
      var phi = Math.acos(2.0 * v - 1.0);
      var r = 1.3 + (Math.random() - 0.5) * 0.2;

      var x = r * Math.sin(phi) * Math.cos(theta);
      var y = r * Math.sin(phi) * Math.sin(theta);
      var z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    var particles = new THREE.Points(geometry, material);
    group.add(particles);

    // 2. Wireframe Energy Torus Ring A
    var torusGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    var torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    var torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    group.add(torus);

    // 3. Second Wireframe Celestial Ring B
    var goldRingGeo = new THREE.TorusGeometry(1.8, 0.015, 12, 48);
    var goldRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    var goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.y = Math.PI / 4;
    group.add(goldRing);

    // Dynamic Theme Recalibration
    function applyTheme(themeId) {
      var t = themeId || (window.getZothTheme ? window.getZothTheme() : (document.documentElement.getAttribute('data-theme') || 'dark'));
      var pal = ORB_THEMES[t] || ORB_THEMES.dark;

      var cA = new THREE.Color(pal.colorA);
      var cB = new THREE.Color(pal.colorB);

      var colArr = geometry.attributes.color.array;
      for (var j = 0; j < particleCount; j++) {
        var mixColor = (j % 3 === 0) ? cB : cA;
        colArr[j * 3] = mixColor.r;
        colArr[j * 3 + 1] = mixColor.g;
        colArr[j * 3 + 2] = mixColor.b;
      }
      geometry.attributes.color.needsUpdate = true;

      torusMat.color.setHex(pal.torusA);
      torusMat.opacity = pal.torusAOpacity;

      goldRingMat.color.setHex(pal.torusB);
      goldRingMat.opacity = pal.torusBOpacity;
    }

    var onThemeChange = function (e) {
      var theme = (e && e.detail && e.detail.theme) ? e.detail.theme : (window.getZothTheme ? window.getZothTheme() : 'dark');
      applyTheme(theme);
    };
    window.addEventListener('zoth-theme-change', onThemeChange);

    // Apply initial theme immediately
    var initialTheme = window.getZothTheme ? window.getZothTheme() : (document.documentElement.getAttribute('data-theme') || 'dark');
    applyTheme(initialTheme);

    // Animation Loop
    var reqId = null;
    var clock = new THREE.Clock();
    var isRunning = true;

    function onVisibilityChange() {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        if (clock) clock.getDelta();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function animate() {
      reqId = requestAnimationFrame(animate);
      if (!isRunning) return;

      var elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.45;
      group.rotation.x = Math.sin(elapsed * 0.3) * 0.25;

      torus.rotation.z = elapsed * 0.6;
      goldRing.rotation.x = elapsed * -0.5;

      // Subtle breath pulse
      var scale = 1.0 + Math.sin(elapsed * 2.5) * 0.04;
      particles.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    }

    animate();

    function dispose() {
      if (reqId) {
        cancelAnimationFrame(reqId);
        reqId = null;
      }
      isRunning = false;

      window.removeEventListener('zoth-theme-change', onThemeChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (geometry) {
        geometry.dispose();
        geometry = null;
      }
      if (material) {
        material.dispose();
        material = null;
      }
      if (torusGeo) {
        torusGeo.dispose();
        torusGeo = null;
      }
      if (torusMat) {
        torusMat.dispose();
        torusMat = null;
      }
      if (goldRingGeo) {
        goldRingGeo.dispose();
        goldRingGeo = null;
      }
      if (goldRingMat) {
        goldRingMat.dispose();
        goldRingMat = null;
      }

      if (group) {
        scene.remove(group);
        while (group.children.length > 0) {
          group.remove(group.children[0]);
        }
        group = null;
      }

      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
        if (renderer.forceContextLoss) {
          renderer.forceContextLoss();
        }
        renderer.domElement = null;
        renderer = null;
      }

      if (container) {
        container.innerHTML = '';
      }
    }

    return {
      applyTheme: applyTheme,
      stop: dispose,
      dispose: dispose
    };
  }

  window.initThreeLoadingOrb = initThreeLoadingOrb;
})(window);
