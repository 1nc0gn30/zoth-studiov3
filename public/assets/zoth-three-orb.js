/**
 * Zoth Kinetic 3D Synthesis Orb (Three.js WebGL Particle Core)
 * Renders an animated alchemical particle sphere with pulsing cyan/gold energy rings.
 */

(function (window) {
  'use strict';

  function initThreeLoadingOrb(containerId) {
    var container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || !window.THREE) return null;

    var width = container.clientWidth || 220;
    var height = container.clientHeight || 220;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    var colorCyan = new THREE.Color(0x00f0ff);
    var colorGold = new THREE.Color(0xfbbf24);

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

      var mixColor = Math.random() > 0.4 ? colorCyan : colorGold;
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
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

    // 2. Wireframe Energy Torus Ring
    var torusGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    var torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    var torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    group.add(torus);

    // 3. Second Gold Celestial Ring
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

    // Animation Loop
    var reqId = null;
    var clock = new THREE.Clock();

    function animate() {
      reqId = requestAnimationFrame(animate);
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

    return {
      stop: function () {
        if (reqId) cancelAnimationFrame(reqId);
        renderer.dispose();
      }
    };
  }

  window.initThreeLoadingOrb = initThreeLoadingOrb;
})(window);
