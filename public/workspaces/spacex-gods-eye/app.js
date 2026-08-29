/**
 * app.js - SpaceX God's Eye Controller & Leaflet Integration
 * Tactical Map Sync, Cockpit Telemetry, Audio Synthesizer & Sensor Controls
 */

class SpaceXApp {
  constructor() {
    this.orbitEngine = null;
    this.leafletMap = null;
    this.mapLayers = {};
    this.currentTileLayer = null;
    this.nadirMarker = null;
    this.footprintCircle = null;
    this.orbitPolylinePast = null;
    this.orbitPolylineFuture = null;
    this.targetMarker = null;
    this.groundStationMarkers = [];
    this.isMapLockedToNadir = true;
    this.soundEnabled = false;
    this.audioCtx = null;

    // Fast Geocoding Database for Sub-Satellite Point (offline-first, zero API limits)
    this.geoRegions = [
      { name: 'Gulf of Mexico / Texas Coast', minLat: 20, maxLat: 30, minLon: -98, maxLon: -85 },
      { name: 'Florida Peninsula & Caribbean Sea', minLat: 22, maxLat: 31, minLon: -85, maxLon: -75 },
      { name: 'North American Eastern Seaboard', minLat: 32, maxLat: 46, minLon: -80, maxLon: -65 },
      { name: 'US Midwest & Great Plains', minLat: 35, maxLat: 49, minLon: -105, maxLon: -85 },
      { name: 'US West Coast & California', minLat: 32, maxLat: 49, minLon: -125, maxLon: -115 },
      { name: 'Canadian Boreal & Arctic', minLat: 50, maxLat: 75, minLon: -130, maxLon: -60 },
      { name: 'Amazon Rainforest Basin', minLat: -15, maxLat: 5, minLon: -75, maxLon: -50 },
      { name: 'Andes Mountain Range', minLat: -45, maxLat: -5, minLon: -75, maxLon: -65 },
      { name: 'Western Europe & Atlantic Corridor', minLat: 40, maxLat: 58, minLon: -10, maxLon: 15 },
      { name: 'Mediterranean Sea & Southern Europe', minLat: 34, maxLat: 45, minLon: -5, maxLon: 35 },
      { name: 'Sahara Desert & North Africa', minLat: 18, maxLat: 33, minLon: -15, maxLon: 35 },
      { name: 'Central Africa & Congo Basin', minLat: -10, maxLat: 15, minLon: 10, maxLon: 35 },
      { name: 'Middle East & Arabian Peninsula', minLat: 15, maxLat: 35, minLon: 35, maxLon: 60 },
      { name: 'Indian Subcontinent & Bay of Bengal', minLat: 8, maxLat: 32, minLon: 68, maxLon: 92 },
      { name: 'East Asia & China Mainland', minLat: 22, maxLat: 45, minLon: 95, maxLon: 122 },
      { name: 'Japanese Archipelago & Pacific Coast', minLat: 30, maxLat: 45, minLon: 128, maxLon: 146 },
      { name: 'Southeast Asia & Coral Triangle', minLat: -10, maxLat: 20, minLon: 95, maxLon: 130 },
      { name: 'Australian Outback & Great Barrier Reef', minLat: -40, maxLat: -12, minLon: 112, maxLon: 154 },
      { name: 'North Atlantic Ocean (Transatlantic Route)', minLat: 25, maxLat: 60, minLon: -60, maxLon: -15 },
      { name: 'South Atlantic Ocean', minLat: -55, maxLat: -10, minLon: -45, maxLon: 10 },
      { name: 'North Pacific Ocean (Great Circle)', minLat: 20, maxLat: 58, minLon: 145, maxLon: -130 },
      { name: 'South Pacific Polynesian Basin', minLat: -50, maxLat: -10, minLon: -170, maxLon: -90 },
      { name: 'Indian Ocean Open Waters', minLat: -50, maxLat: 10, minLon: 50, maxLon: 100 },
      { name: 'Arctic Circle & Svalbard', minLat: 66, maxLat: 85, minLon: -180, maxLon: 180 },
      { name: 'Antarctic Ice Shelf & Southern Ocean', minLat: -85, maxLat: -60, minLon: -180, maxLon: 180 }
    ];

    this.init();
  }

  init() {
    // 1. Initialize 3D Engine
    this.orbitEngine = new OrbitEngine('threejs-container');
    this.orbitEngine.onSatelliteSelected = (sat) => this.onSatelliteSelected(sat);
    this.orbitEngine.onTelemetryUpdate = (data) => this.onTelemetryUpdate(data);

    // 2. Initialize Leaflet Tactical Map
    this.initLeafletMap();

    // 3. Setup UI Listeners & Controls
    this.setupUIControls();
    this.populateFleetList();
    this.populateWaypointsList();
    this.startClock();
    this.initAudioSynth();
  }

  initLeafletMap() {
    this.leafletMap = L.map('leaflet-map', {
      center: [28.5, -80.6],
      zoom: 3,
      zoomControl: false,
      attributionControl: false
    });

    // Custom tactical zoom control on top right
    L.control.zoom({ position: 'topright' }).addTo(this.leafletMap);

    // High-Resolution Satellite & Tactical Tile Providers
    this.mapLayers = {
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri Satellite'
      }),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: 'CartoDB Dark'
      }),
      night: L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{x}/{y}.jpg', {
        maxZoom: 8,
        attribution: 'NASA Night Lights'
      }),
      topo: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Esri Topo'
      }),
      streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'OSM'
      })
    };

    // Default to high-res Google Maps-style Satellite View
    this.currentTileLayer = this.mapLayers.satellite;
    this.currentTileLayer.addTo(this.leafletMap);

    // 1. Sub-Satellite Point (SSP) Pulsing Custom Icon Marker
    const satIcon = L.divIcon({
      className: 'custom-sat-leaflet-icon',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-400 opacity-40 animate-ping"></div>
          <div class="absolute w-5 h-5 rounded-full border-2 border-cyan-300 bg-cyan-950/80 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <div class="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-300"></div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    this.nadirMarker = L.marker([0, 0], { icon: satIcon }).addTo(this.leafletMap);

    // 2. Optical & Phased-Array Ground Coverage Footprint Circle (~650km radius)
    this.footprintCircle = L.circle([0, 0], {
      radius: 650000, // 650 km
      color: '#00f0ff',
      weight: 1.5,
      opacity: 0.8,
      fillColor: '#00f0ff',
      fillOpacity: 0.12,
      dashArray: '4, 4'
    }).addTo(this.leafletMap);

    // 3. Orbit Track Lines (Past & Projected Future)
    this.orbitPolylinePast = L.polyline([], {
      color: '#06b6d4',
      weight: 2,
      opacity: 0.8
    }).addTo(this.leafletMap);

    this.orbitPolylineFuture = L.polyline([], {
      color: '#f59e0b',
      weight: 2,
      opacity: 0.7,
      dashArray: '6, 6'
    }).addTo(this.leafletMap);

    // 4. Add SpaceX Ground Stations (Gateways)
    const gatewayIcon = L.divIcon({
      className: 'custom-gateway-icon',
      html: `
        <div class="w-3.5 h-3.5 rounded-full border border-sky-400 bg-sky-900 flex items-center justify-center shadow-md shadow-sky-500/40">
          <div class="w-1.5 h-1.5 rounded-full bg-sky-300"></div>
        </div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    SPACEX_CONFIG.GROUND_STATIONS.forEach((gs) => {
      const marker = L.marker([gs.lat, gs.lon], { icon: gatewayIcon })
        .bindTooltip(`<b>${gs.name}</b><br><span class="text-xs text-sky-300">${gs.type} (${gs.country})</span>`, {
          className: 'leaflet-tactical-tooltip',
          direction: 'top'
        })
        .addTo(this.leafletMap);
      this.groundStationMarkers.push(marker);
    });

    // 5. Interactive Click-to-Recon on Leaflet Map
    this.leafletMap.on('click', (e) => {
      this.setReconTargetFromMap(e.latlng.lat, e.latlng.lng);
    });
  }

  setReconTargetFromMap(lat, lon, name = 'Tactical Recon Target') {
    if (this.targetMarker) {
      this.leafletMap.removeLayer(this.targetMarker);
    }

    const targetIcon = L.divIcon({
      className: 'custom-target-icon',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 rounded-full border border-red-500 animate-ping"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-lg shadow-red-500"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    this.targetMarker = L.marker([lat, lon], { icon: targetIcon })
      .bindTooltip(`<b>${name}</b><br><span class="text-xs text-red-300">${lat.toFixed(4)}°, ${lon.toFixed(4)}°</span>`, {
        className: 'leaflet-tactical-tooltip',
        permanent: true,
        direction: 'top'
      })
      .addTo(this.leafletMap);

    const waypoint = {
      id: 'custom-target',
      name: `${name} [${lat.toFixed(2)}°, ${lon.toFixed(2)}°]`,
      lat: lat,
      lon: lon,
      zoom: 15,
      description: `Target ground point designated via tactical map click. Optical sensor slewing to coordinates.`
    };

    this.orbitEngine.setTargetWaypoint(waypoint);
    this.updateTargetHUD(waypoint);
    this.playAudio('slew');
    this.orbitEngine.setCameraMode(this.orbitEngine.CAMERA_MODES.TARGET_LOCK);
    this.updateCameraModeUI('TARGET_LOCK');
  }

  setTileLayer(layerName) {
    if (this.mapLayers[layerName]) {
      this.leafletMap.removeLayer(this.currentTileLayer);
      this.currentTileLayer = this.mapLayers[layerName];
      this.currentTileLayer.addTo(this.leafletMap);
      this.playAudio('click');
    }
  }

  setupUIControls() {
    // 1. Camera Mode Buttons
    const camButtons = document.querySelectorAll('[data-cam-mode]');
    camButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-cam-mode');
        this.orbitEngine.setCameraMode(mode);
        this.updateCameraModeUI(mode);
        this.playAudio('click');
      });
    });

    // 2. Optical Magnification Zoom Slider
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomDisplay = document.getElementById('zoom-display');
    const gsdDisplay = document.getElementById('gsd-display');
    if (zoomSlider) {
      zoomSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.orbitEngine.setZoom(val);
        if (zoomDisplay) zoomDisplay.textContent = `${val.toFixed(1)}x`;
        if (gsdDisplay) {
          const gsd = Math.max(0.12, (15.0 / val)).toFixed(2);
          gsdDisplay.textContent = `${gsd} m/px`;
        }
      });
    }

    // 3. Sensor Filter Buttons
    const filterButtons = document.querySelectorAll('[data-filter-mode]');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter-mode');
        this.orbitEngine.setSensorFilter(filter);
        filterButtons.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        this.playAudio('click');

        // Update HUD Reticle Filter Tag
        const filterTag = document.getElementById('hud-filter-tag');
        if (filterTag) filterTag.textContent = filter;
      });
    });

    // 4. Time Warp Controller Buttons
    const timeButtons = document.querySelectorAll('[data-time-scale]');
    timeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const scale = parseFloat(btn.getAttribute('data-time-scale'));
        this.orbitEngine.setTimeScale(scale);
        timeButtons.forEach(b => b.classList.remove('active-time'));
        btn.classList.add('active-time');
        this.playAudio('click');
      });
    });

    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const paused = this.orbitEngine.togglePause();
        pauseBtn.innerHTML = paused
          ? '<i class="fas fa-play"></i> RESUME'
          : '<i class="fas fa-pause"></i> PAUSE';
        pauseBtn.classList.toggle('bg-amber-600', paused);
        this.playAudio('click');
      });
    }

    // 5. Layer Toggle Checkboxes
    const toggleLasers = document.getElementById('toggle-lasers');
    if (toggleLasers) {
      toggleLasers.addEventListener('change', (e) => {
        this.orbitEngine.showLasers = e.target.checked;
        this.playAudio('click');
      });
    }

    const toggleOrbits = document.getElementById('toggle-orbits');
    if (toggleOrbits) {
      toggleOrbits.addEventListener('change', (e) => {
        this.orbitEngine.showOrbits = e.target.checked;
        this.playAudio('click');
      });
    }

    const toggleFootprint = document.getElementById('toggle-footprint');
    if (toggleFootprint) {
      toggleFootprint.addEventListener('change', (e) => {
        this.orbitEngine.showFootprint = e.target.checked;
        if (this.footprintCircle) {
          if (e.target.checked) this.footprintCircle.addTo(this.leafletMap);
          else this.leafletMap.removeLayer(this.footprintCircle);
        }
        this.playAudio('click');
      });
    }

    const toggleLockMap = document.getElementById('toggle-lock-map');
    if (toggleLockMap) {
      toggleLockMap.addEventListener('change', (e) => {
        this.isMapLockedToNadir = e.target.checked;
        this.playAudio('click');
      });
    }

    // 6. Map Layer Selector
    const mapLayerSelect = document.getElementById('map-layer-select');
    if (mapLayerSelect) {
      mapLayerSelect.addEventListener('change', (e) => {
        this.setTileLayer(e.target.value);
      });
    }

    // 7. Search Bar
    const searchInput = document.getElementById('sat-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterFleetList(e.target.value);
      });
    }

    // 8. Shell Filters
    const shellFilters = document.querySelectorAll('[data-shell-filter]');
    shellFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        const shellId = btn.getAttribute('data-shell-filter');
        shellFilters.forEach(b => b.classList.remove('active-shell'));
        btn.classList.add('active-shell');
        this.filterFleetByShell(shellId);
        this.playAudio('click');
      });
    });

    // 9. Sound Toggle Button
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled && this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        soundToggle.innerHTML = this.soundEnabled
          ? '<i class="fas fa-volume-up text-cyan-400"></i> AUDIO ON'
          : '<i class="fas fa-volume-mute text-slate-400"></i> AUDIO MUTED';
        soundToggle.classList.toggle('text-cyan-400', this.soundEnabled);
      });
    }

    // 10. Snapshot Photo Capture Button
    const snapshotBtn = document.getElementById('snapshot-btn');
    if (snapshotBtn) {
      snapshotBtn.addEventListener('click', () => {
        this.takeSnapshot();
      });
    }

    // 11. View Layout Modes (Split, PiP, Full 3D, Full Map)
    const layoutButtons = document.querySelectorAll('[data-layout-mode]');
    layoutButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-layout-mode');
        this.setLayoutMode(mode);
        layoutButtons.forEach(b => b.classList.remove('active-layout'));
        btn.classList.add('active-layout');
        this.playAudio('click');
      });
    });
  }

  setLayoutMode(mode) {
    const mainWrapper = document.getElementById('main-content-layout');
    const threePane = document.getElementById('threejs-pane');
    const mapPane = document.getElementById('map-pane');

    if (!mainWrapper || !threePane || !mapPane) return;

    mainWrapper.className = `flex flex-1 relative overflow-hidden transition-all duration-300 ${mode}`;

    if (mode === 'layout-pip') {
      threePane.className = 'w-full h-full relative z-0';
      mapPane.className = 'absolute bottom-6 right-6 w-96 h-72 rounded-xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 z-20 transition-all';
    } else if (mode === 'layout-split') {
      threePane.className = 'w-1/2 h-full relative z-0 border-r border-cyan-900/50';
      mapPane.className = 'w-1/2 h-full relative z-0';
    } else if (mode === 'layout-3d-full') {
      threePane.className = 'w-full h-full relative z-0';
      mapPane.className = 'hidden';
    } else if (mode === 'layout-map-full') {
      threePane.className = 'hidden';
      mapPane.className = 'w-full h-full relative z-0';
    }

    setTimeout(() => {
      this.orbitEngine.onResize();
      this.leafletMap.invalidateSize();
    }, 320);
  }

  updateCameraModeUI(mode) {
    const camButtons = document.querySelectorAll('[data-cam-mode]');
    camButtons.forEach((btn) => {
      btn.classList.toggle('active-cam', btn.getAttribute('data-cam-mode') === mode);
    });

    const hudReticle = document.getElementById('pov-hud-reticle');
    if (hudReticle) {
      hudReticle.style.display = (mode === 'SATELLITE_POV' || mode === 'TARGET_LOCK') ? 'block' : 'none';
    }
  }

  populateFleetList() {
    const container = document.getElementById('fleet-list-container');
    if (!container) return;
    container.innerHTML = '';

    const sats = this.orbitEngine.satellites;
    const fragment = document.createDocumentFragment();

    sats.forEach((sat) => {
      const item = document.createElement('div');
      item.className = 'fleet-item flex items-center justify-between p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 cursor-pointer transition text-xs group';
      item.setAttribute('data-sat-id', sat.id);
      item.setAttribute('data-shell-id', sat.shellId);

      const isSpecial = sat.isSpecial;
      const badgeColor = isSpecial ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

      item.innerHTML = `
        <div class="flex items-center gap-2.5">
          <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${sat.color}"></div>
          <div>
            <div class="font-mono font-semibold text-slate-200 group-hover:text-cyan-300">${sat.name}</div>
            <div class="text-[10px] text-slate-400">${sat.shellName} • ${sat.altitudeKm} km</div>
          </div>
        </div>
        <div class="text-right">
          <span class="px-1.5 py-0.5 rounded border text-[10px] font-mono ${badgeColor}">
            ${isSpecial ? sat.specialType : 'ACTIVE'}
          </span>
          <div class="text-[10px] font-mono text-slate-500 mt-0.5">${sat.speedKms.toFixed(2)} km/s</div>
        </div>
      `;

      item.addEventListener('click', () => {
        this.orbitEngine.selectSatellite(sat);
        this.playAudio('click');
      });

      fragment.appendChild(item);
    });

    container.appendChild(fragment);
  }

  filterFleetList(query) {
    const items = document.querySelectorAll('.fleet-item');
    const q = query.toLowerCase().trim();
    items.forEach((item) => {
      const satId = item.getAttribute('data-sat-id').toLowerCase();
      const text = item.textContent.toLowerCase();
      item.style.display = (text.includes(q) || satId.includes(q)) ? 'flex' : 'none';
    });
  }

  filterFleetByShell(shellId) {
    const items = document.querySelectorAll('.fleet-item');
    items.forEach((item) => {
      if (shellId === 'all') {
        item.style.display = 'flex';
      } else {
        const itemShell = item.getAttribute('data-shell-id');
        itemShell === shellId ? item.style.display = 'flex' : item.style.display = 'none';
      }
    });
  }

  populateWaypointsList() {
    const container = document.getElementById('waypoints-list-container');
    if (!container) return;
    container.innerHTML = '';

    SPACEX_CONFIG.RECON_WAYPOINTS.forEach((wp) => {
      const card = document.createElement('div');
      card.className = 'waypoint-card p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-cyan-950/40 hover:border-cyan-500/40 cursor-pointer transition';
      card.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold text-slate-200">${wp.name}</span>
          <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">${wp.category}</span>
        </div>
        <div class="text-[11px] text-slate-400 line-clamp-2">${wp.description}</div>
        <div class="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
          <span>LAT: ${wp.lat.toFixed(4)}° • LON: ${wp.lon.toFixed(4)}°</span>
          <span class="text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition"><i class="fas fa-crosshairs"></i> RECON</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.setReconTargetFromMap(wp.lat, wp.lon, wp.name);
        this.leafletMap.setView([wp.lat, wp.lon], 12);
      });

      container.appendChild(card);
    });
  }

  onSatelliteSelected(sat) {
    // Highlight selected item in fleet list
    document.querySelectorAll('.fleet-item').forEach(el => {
      el.classList.toggle('selected-fleet-item', el.getAttribute('data-sat-id') === sat.id);
    });

    // Update Header Badge
    const satNameHeader = document.getElementById('selected-sat-name');
    if (satNameHeader) satNameHeader.textContent = sat.name;

    const satNoradHeader = document.getElementById('selected-sat-norad');
    if (satNoradHeader) satNoradHeader.textContent = `NORAD #${sat.norad} • ${sat.shellName}`;

    this.playAudio('laser');
  }

  getGeographicLocationName(lat, lon) {
    for (const region of this.geoRegions) {
      if (lat >= region.minLat && lat <= region.maxLat && lon >= region.minLon && lon <= region.maxLon) {
        return region.name;
      }
    }
    return lat >= 0 ? 'Northern Hemisphere Waters' : 'Southern Hemisphere Waters';
  }

  onTelemetryUpdate(data) {
    const { satellite, state, simTimeSeconds } = data;
    if (!state) return;

    // 1. Update Telemetry Dashboard DOM Elements
    const lat = state.lat;
    const lon = state.lon;
    const alt = state.altitudeKm;
    const speed = state.speedKms;
    const speedKmh = Math.round(speed * 3600);
    const mach = (speed / 0.306).toFixed(1); // Mach number in stratosphere

    const elLat = document.getElementById('telem-lat');
    if (elLat) elLat.textContent = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;

    const elLon = document.getElementById('telem-lon');
    if (elLon) elLon.textContent = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;

    const elAlt = document.getElementById('telem-alt');
    if (elAlt) elAlt.textContent = `${alt.toFixed(1)} km`;

    const elSpeed = document.getElementById('telem-speed');
    if (elSpeed) elSpeed.textContent = `${speed.toFixed(3)} km/s (${speedKmh.toLocaleString()} km/h • Mach ${mach})`;

    const elRegion = document.getElementById('telem-region');
    if (elRegion) {
      elRegion.textContent = this.getGeographicLocationName(lat, lon);
    }

    const elSolar = document.getElementById('telem-solar');
    if (elSolar) elSolar.textContent = `${satellite.telemetry.solarPowerW} W`;

    const elLaser = document.getElementById('telem-laser');
    if (elLaser) elLaser.textContent = `${satellite.laserLinks}/4 ISL LOCKED (${satellite.telemetry.downlinkThroughputGbps} Gbps)`;

    const elPing = document.getElementById('telem-ping');
    if (elPing) elPing.textContent = `${satellite.telemetry.pingMs} ms`;

    // 2. Synchronize Leaflet Tactical Map
    if (this.nadirMarker) {
      this.nadirMarker.setLatLng([lat, lon]);
    }
    if (this.footprintCircle) {
      this.footprintCircle.setLatLng([lat, lon]);
    }

    if (this.isMapLockedToNadir && this.leafletMap) {
      this.leafletMap.panTo([lat, lon], { animate: false });
    }

    // 3. Update Projected Leaflet Orbit Track (Future next 90 min)
    if (this.orbitPolylineFuture && satellite) {
      const points = [];
      const periodSec = satellite.periodMin * 60;
      for (let i = 0; i <= 36; i++) {
        const offsetSec = (i / 36) * periodSec;
        const futureState = this.orbitEngine.getSatelliteState(satellite, simTimeSeconds + offsetSec);
        points.push([futureState.lat, futureState.lon]);
      }
      this.orbitPolylineFuture.setLatLngs(points);
    }

    // 4. Update HUD Reticle Telemetry Overlay
    const hudCoords = document.getElementById('hud-coords-readout');
    if (hudCoords) {
      hudCoords.textContent = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E | ALT ${alt.toFixed(0)}KM | MACH ${mach}`;
    }
  }

  updateTargetHUD(waypoint) {
    const targetBox = document.getElementById('hud-target-info');
    if (targetBox) {
      targetBox.innerHTML = `
        <div class="text-cyan-400 font-bold flex items-center gap-1.5"><i class="fas fa-crosshairs animate-pulse"></i> SENSOR LOCK: ${waypoint.name}</div>
        <div class="text-[10px] text-slate-300 mt-0.5">${waypoint.description}</div>
      `;
    }
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toUTCString().replace('GMT', 'UTC');
      const elUtc = document.getElementById('clock-utc');
      if (elUtc) elUtc.textContent = utcString;

      // Mission Elapsed Time (MET) from mock launch
      const metHours = String(now.getUTCHours()).padStart(2, '0');
      const metMins = String(now.getUTCMinutes()).padStart(2, '0');
      const metSecs = String(now.getUTCSeconds()).padStart(2, '0');
      const elMet = document.getElementById('clock-met');
      if (elMet) elMet.textContent = `MET +${metHours}:${metMins}:${metSecs}`;
    };
    setInterval(updateTime, 1000);
    updateTime();
  }

  initAudioSynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playAudio(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'slew') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  takeSnapshot() {
    const canvas = this.orbitEngine.renderer.domElement;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const satName = this.orbitEngine.selectedSat ? this.orbitEngine.selectedSat.id : 'SPACEX-GODS-EYE';
    link.download = `${satName}-POV-RECON-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    this.playAudio('laser');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.spacexApp = new SpaceXApp();
});
