/**
 * Multi-Mode Camera Controller & Navigation Engine
 * Supports: First-Person Walk, Orbit/Architect, Cosmic Elevation, and Cinematic Guided Tour
 */

export class StoicControls {
  constructor(camera, domElement, onLocationChange) {
    this.camera = camera;
    this.domElement = domElement;
    this.onLocationChange = onLocationChange;

    // Control Modes: "orbit", "walk", "tour", "cosmic", "transitioning"
    this.mode = "orbit";

    // First Person / Walk State
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      sprint: false
    };

    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.isPointerLocked = false;
    this.isMouseDown = false;
    this.prevMousePos = { x: 0, y: 0 };

    // Orbit parameters
    this.orbitTarget = new THREE.Vector3(0, 2, 0);
    this.orbitRadius = 32;
    this.orbitTheta = 0;
    this.orbitPhi = Math.PI / 4;
    this.minOrbitRadius = 4;
    this.maxOrbitRadius = 120;

    // Movement speeds
    this.moveSpeed = 14;
    this.sprintMultiplier = 2.0;

    // Transitioning animation state
    this.transition = {
      active: false,
      startPos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      startLook: new THREE.Vector3(),
      targetLook: new THREE.Vector3(),
      currentLook: new THREE.Vector3(),
      progress: 0,
      duration: 2.2,
      onComplete: null
    };

    // Guided Tour Waypoints
    this.tourWaypoints = [
      {
        id: "rotunda",
        pos: new THREE.Vector3(0, 2.5, 14),
        look: new THREE.Vector3(0, 3, 0),
        duration: 8,
        title: "The Inner Citadel (Arx Mentis)",
        text: "You stand at the center of the rational soul. External events cannot penetrate these marble arches unless your judgment permits it."
      },
      {
        id: "wisdom",
        pos: new THREE.Vector3(0, 2.5, -24),
        look: new THREE.Vector3(0, 4, -38),
        duration: 8,
        title: "The Stoa of Wisdom (Sophia)",
        text: "Here we practice the Dichotomy of Control. Discern what lies within your moral choice from what belongs to external fortune."
      },
      {
        id: "courage",
        pos: new THREE.Vector3(-24, 2.5, 0),
        look: new THREE.Vector3(-38, 4, 0),
        duration: 8,
        title: "The Bastion of Courage (Andreia)",
        text: "Endurance and fortitude. The obstacle is the way. What stands in the way of action advances action."
      },
      {
        id: "justice",
        pos: new THREE.Vector3(24, 2.5, 0),
        look: new THREE.Vector3(38, 4, 0),
        duration: 8,
        title: "The Forum of Justice (Dikaiosyne)",
        text: "Sympatheia: We are born for mutual cooperation. That which is not good for the beehive cannot be good for the bee."
      },
      {
        id: "temperance",
        pos: new THREE.Vector3(0, 2.5, 24),
        look: new THREE.Vector3(0, 3, 38),
        duration: 8,
        title: "The Pavilion of Temperance (Sophrosyne)",
        text: "Equanimity and self-mastery. Freedom is not gained by satisfying desires, but by dissolving them."
      }
    ];
    this.currentTourIndex = 0;
    this.tourTimer = 0;

    // Cosmic perspective state
    this.cosmicElevation = {
      active: false,
      altitude: 2.5,
      targetAltitude: 240,
      rotation: 0
    };

    this._bindEvents();
    this._updateOrbitCamera();
  }

  _bindEvents() {
    // Keyboard inputs
    window.addEventListener("keydown", (e) => this._onKeyDown(e));
    window.addEventListener("keyup", (e) => this._onKeyUp(e));

    // Mouse / Touch Drag inputs
    this.domElement.addEventListener("mousedown", (e) => this._onMouseDown(e));
    window.addEventListener("mousemove", (e) => this._onMouseMove(e));
    window.addEventListener("mouseup", () => this._onMouseUp());
    this.domElement.addEventListener("wheel", (e) => this._onWheel(e), { passive: false });

    // Touch Support
    this.domElement.addEventListener("touchstart", (e) => this._onTouchStart(e), { passive: false });
    this.domElement.addEventListener("touchmove", (e) => this._onTouchMove(e), { passive: false });
    this.domElement.addEventListener("touchend", () => this._onTouchEnd());
  }

  _onKeyDown(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = true;
        break;
      case "Space":
        this.keys.up = true;
        e.preventDefault();
        break;
      case "KeyC":
      case "KeyC":
        this.keys.down = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.sprint = true;
        break;
      case "Digit1":
        this.fastTravelTo("rotunda");
        break;
      case "Digit2":
        this.fastTravelTo("wisdom");
        break;
      case "Digit3":
        this.fastTravelTo("courage");
        break;
      case "Digit4":
        this.fastTravelTo("justice");
        break;
      case "Digit5":
        this.fastTravelTo("temperance");
        break;
      case "KeyV":
        this.toggleCosmicView();
        break;
    }
  }

  _onKeyUp(e) {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.keys.right = false;
        break;
      case "Space":
        this.keys.up = false;
        break;
      case "KeyC":
        this.keys.down = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.keys.sprint = false;
        break;
    }
  }

  _onMouseDown(e) {
    if (e.button === 0) { // Left click
      this.isMouseDown = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    }
  }

  _onMouseMove(e) {
    if (!this.isMouseDown) return;

    const deltaX = e.clientX - this.prevMousePos.x;
    const deltaY = e.clientY - this.prevMousePos.y;
    this.prevMousePos = { x: e.clientX, y: e.clientY };

    if (this.mode === "orbit") {
      this.orbitTheta -= deltaX * 0.006;
      this.orbitPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, this.orbitPhi + deltaY * 0.006));
      this._updateOrbitCamera();
    } else if (this.mode === "walk") {
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= deltaX * 0.003;
      this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x - deltaY * 0.003));
      this.camera.quaternion.setFromEuler(this.euler);
    }
  }

  _onMouseUp() {
    this.isMouseDown = false;
  }

  _onWheel(e) {
    e.preventDefault();
    if (this.mode === "orbit") {
      this.orbitRadius = Math.max(this.minOrbitRadius, Math.min(this.maxOrbitRadius, this.orbitRadius + e.deltaY * 0.04));
      this._updateOrbitCamera();
    }
  }

  // Touch Handlers
  _onTouchStart(e) {
    if (e.touches.length === 1) {
      this.isMouseDown = true;
      this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  _onTouchMove(e) {
    if (e.touches.length === 1 && this.isMouseDown) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - this.prevMousePos.x;
      const deltaY = e.touches[0].clientY - this.prevMousePos.y;
      this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (this.mode === "orbit") {
        this.orbitTheta -= deltaX * 0.008;
        this.orbitPhi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, this.orbitPhi + deltaY * 0.008));
        this._updateOrbitCamera();
      } else if (this.mode === "walk") {
        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= deltaX * 0.005;
        this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x - deltaY * 0.005));
        this.camera.quaternion.setFromEuler(this.euler);
      }
    }
  }

  _onTouchEnd() {
    this.isMouseDown = false;
  }

  _updateOrbitCamera() {
    const x = this.orbitTarget.x + this.orbitRadius * Math.sin(this.orbitPhi) * Math.sin(this.orbitTheta);
    const y = this.orbitTarget.y + this.orbitRadius * Math.cos(this.orbitPhi);
    const z = this.orbitTarget.z + this.orbitRadius * Math.sin(this.orbitPhi) * Math.cos(this.orbitTheta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.orbitTarget);
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;

    if (newMode === "orbit") {
      this.orbitTarget.set(this.camera.position.x, 1.8, this.camera.position.z);
      this.orbitRadius = 25;
      this.orbitPhi = Math.PI / 3.5;
      this._updateOrbitCamera();
    } else if (newMode === "tour") {
      this.currentTourIndex = 0;
      this.tourTimer = 0;
      this._startTourStep(0);
    }
  }

  // Smooth Fast Travel Easing Function
  fastTravelTo(locationId) {
    const locMap = {
      rotunda: { pos: [0, 2.2, 16], look: [0, 2.5, 0], title: "Central Rotunda" },
      wisdom: { pos: [0, 2.2, -22], look: [0, 3.8, -35], title: "Stoa of Wisdom" },
      courage: { pos: [-22, 2.2, 0], look: [-35, 3.8, 0], title: "Bastion of Courage" },
      justice: { pos: [22, 2.2, 0], look: [35, 3.8, 0], title: "Forum of Justice" },
      temperance: { pos: [0, 2.2, 22], look: [0, 3.0, 35], title: "Garden of Temperance" }
    };

    const target = locMap[locationId];
    if (!target) return;

    this.mode = "transitioning";
    this.transition.active = true;
    this.transition.progress = 0;
    this.transition.duration = 2.0;

    this.transition.startPos.copy(this.camera.position);
    this.transition.targetPos.set(...target.pos);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.transition.startLook.copy(this.camera.position).add(dir.multiplyScalar(10));
    this.transition.targetLook.set(...target.look);

    this.transition.onComplete = () => {
      this.mode = "walk";
      this.camera.lookAt(this.transition.targetLook);
      if (this.onLocationChange) this.onLocationChange(locationId, target.title);
    };
  }

  // Toggle "View from Above" (Cosmic Elevation)
  toggleCosmicView() {
    if (this.mode === "cosmic") {
      this.fastTravelTo("rotunda");
      return;
    }

    this.mode = "cosmic";
    this.transition.active = true;
    this.transition.progress = 0;
    this.transition.duration = 3.5;

    this.transition.startPos.copy(this.camera.position);
    this.transition.targetPos.set(0, 160, 90);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.transition.startLook.copy(this.camera.position).add(dir.multiplyScalar(10));
    this.transition.targetLook.set(0, 0, 0);

    this.transition.onComplete = () => {
      if (this.onLocationChange) {
        this.onLocationChange(
          "cosmic",
          "The View from Above (Cosmic Perspective)",
          "Look at the countless human swarms, rituals, and wars. From the celestial heights, all petty human pride and frantic anxiety dissolve into quiet wonder."
        );
      }
    };
  }

  _startTourStep(index) {
    const wp = this.tourWaypoints[index];
    if (!wp) return;

    this.transition.active = true;
    this.transition.progress = 0;
    this.transition.duration = 2.5;

    this.transition.startPos.copy(this.camera.position);
    this.transition.targetPos.copy(wp.pos);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.transition.startLook.copy(this.camera.position).add(dir.multiplyScalar(10));
    this.transition.targetLook.copy(wp.look);

    if (this.onLocationChange) {
      this.onLocationChange(wp.id, wp.title, wp.text);
    }
  }

  update(delta) {
    // 1. Handle Smooth Transitions
    if (this.transition.active) {
      this.transition.progress += delta / this.transition.duration;
      const t = Math.min(1, this.transition.progress);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(this.transition.startPos, this.transition.targetPos, ease);
      this.transition.currentLook.lerpVectors(this.transition.startLook, this.transition.targetLook, ease);
      this.camera.lookAt(this.transition.currentLook);

      if (t >= 1) {
        this.transition.active = false;
        if (this.transition.onComplete) {
          this.transition.onComplete();
          this.transition.onComplete = null;
        }
      }
      return;
    }

    // 2. Guided Tour Auto-Progress
    if (this.mode === "tour") {
      this.tourTimer += delta;
      const wp = this.tourWaypoints[this.currentTourIndex];
      if (this.tourTimer >= wp.duration) {
        this.tourTimer = 0;
        this.currentTourIndex = (this.currentTourIndex + 1) % this.tourWaypoints.length;
        this._startTourStep(this.currentTourIndex);
      }
      return;
    }

    // 3. Cosmic Elevation Slow Orbit
    if (this.mode === "cosmic") {
      this.cosmicElevation.rotation += delta * 0.08;
      const r = 160;
      const cx = Math.sin(this.cosmicElevation.rotation) * r;
      const cz = Math.cos(this.cosmicElevation.rotation) * r;
      this.camera.position.set(cx, 160 + Math.sin(this.cosmicElevation.rotation * 0.5) * 20, cz);
      this.camera.lookAt(0, 0, 0);
      return;
    }

    // 4. First-Person Walk Movement
    if (this.mode === "walk") {
      const speed = this.moveSpeed * (this.keys.sprint ? this.sprintMultiplier : 1.0) * delta;
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      if (this.keys.forward) this.camera.position.addScaledVector(forward, speed);
      if (this.keys.backward) this.camera.position.addScaledVector(forward, -speed);
      if (this.keys.right) this.camera.position.addScaledVector(right, speed);
      if (this.keys.left) this.camera.position.addScaledVector(right, -speed);
      if (this.keys.up) this.camera.position.y += speed * 0.8;
      if (this.keys.down) this.camera.position.y = Math.max(1.8, this.camera.position.y - speed * 0.8);

      // Sanctuary boundary clamping & ground collision
      this.camera.position.x = Math.max(-65, Math.min(65, this.camera.position.x));
      this.camera.position.z = Math.max(-65, Math.min(65, this.camera.position.z));
      if (!this.keys.up) {
        this.camera.position.y = 2.0; // Walk eye-level
      }
    }
  }
}
