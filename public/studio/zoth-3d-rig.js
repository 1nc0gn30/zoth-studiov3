/**
 * Shared cinematic lighting, floor, and environment for Zoth 3D stages.
 * Call after the WebGLRenderer exists. Safe if THREE extras are missing.
 */
(function (root) {
  "use strict";
  if (root.ZothStudio3D) return;

  var GOLD = 0xc9a227;
  var CYAN = 0x00e5ff;
  var VOID = 0x07080d;

  function dressRenderer(renderer) {
    if (!renderer || !root.THREE) return renderer;
    var THREE = root.THREE;
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = renderer.toneMappingExposure || 1.12;
    renderer.shadowMap.enabled = true;
    if (THREE.PCFSoftShadowMap) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ("physicallyCorrectLights" in renderer) renderer.physicallyCorrectLights = true;
    return renderer;
  }

  function addStudioRig(scene, renderer, opts) {
    opts = opts || {};
    var THREE = root.THREE;
    if (!scene || !THREE) return null;
    var radius = opts.radius || 16;

    var hemi = new THREE.HemisphereLight(0xb7d4ff, 0x12080c, opts.hemi || 0.48);
    scene.add(hemi);

    var key = new THREE.SpotLight(opts.keyColor || CYAN, opts.keyIntensity || 2.2, 90, Math.PI / 4.6, 0.42, 1.05);
    key.position.set(9, 18, 11);
    key.castShadow = true;
    if (key.shadow) {
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.00015;
    }
    scene.add(key);
    scene.add(key.target);

    var rim = new THREE.DirectionalLight(GOLD, opts.rimIntensity || 1.55);
    rim.position.set(-14, 11, -18);
    scene.add(rim);

    var kick = new THREE.PointLight(0x7c5cff, 0.55, 28, 2);
    kick.position.set(0, 4.2, 0);
    scene.add(kick);

    var floor = null;
    var ring = null;
    var inner = null;
    if (!opts.noFloor) {
      floor = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 72),
        new (THREE.MeshPhysicalMaterial || THREE.MeshStandardMaterial)({
          color: VOID,
          metalness: 0.94,
          roughness: 0.11,
          clearcoat: 0.72,
          clearcoatRoughness: 0.18,
          envMapIntensity: 1.35,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = opts.floorY != null ? opts.floorY : -0.03;
      floor.receiveShadow = true;
      scene.add(floor);

      ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.58, 0.028, 10, 128),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.62 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = floor.position.y + 0.04;
      scene.add(ring);

      inner = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.22, 0.012, 8, 96),
        new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.35 })
      );
      inner.rotation.x = Math.PI / 2;
      inner.position.y = floor.position.y + 0.05;
      scene.add(inner);
    }

    try {
      if (renderer && THREE.PMREMGenerator) {
        var pmrem = new THREE.PMREMGenerator(renderer);
        var envScene = new THREE.Scene();
        envScene.add(new THREE.HemisphereLight(0x6ea8ff, 0x1a0c04, 1.1));
        var shell = new THREE.Mesh(
          new THREE.SphereGeometry(12, 24, 16),
          new THREE.MeshBasicMaterial({ color: 0x10182a, side: THREE.BackSide })
        );
        envScene.add(shell);
        var goldBlob = new THREE.Mesh(
          new THREE.SphereGeometry(2.2, 12, 10),
          new THREE.MeshBasicMaterial({ color: GOLD })
        );
        goldBlob.position.set(-6, 5, -8);
        envScene.add(goldBlob);
        scene.environment = pmrem.fromScene(envScene, 0.06).texture;
        pmrem.dispose();
      }
    } catch (err) {}

    if (!scene.fog) scene.fog = new THREE.FogExp2(0x05060a, 0.028);

    return { hemi: hemi, key: key, rim: rim, floor: floor, ring: ring };
  }

  function introDolly(camera, controls, opts) {
    opts = opts || {};
    if (!camera) return;
    var THREE = root.THREE;
    var from = opts.from || new THREE.Vector3(0, 14, 22);
    var to = opts.to || camera.position.clone();
    camera.position.copy(from);
    var t0 = performance.now();
    var dur = opts.duration || 2200;
    function tick(now) {
      var u = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - u, 3);
      camera.position.lerpVectors(from, to, e);
      if (controls) controls.update();
      if (u < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  root.ZothStudio3D = {
    dressRenderer: dressRenderer,
    addStudioRig: addStudioRig,
    introDolly: introDolly,
  };
})(typeof window !== "undefined" ? window : this);
