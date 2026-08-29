/**
 * Poop - There It Is! (Virginia Beach Dog Walker's Companion)
 * Core Application Engine
 */

(function () {
  'use strict';

  // --- STATE ---
  let map = null;
  let markersLayer = null;
  let userMarker = null;
  let userCoords = null;
  let activeFilter = 'all';
  let searchQuery = '';
  let customStations = [];
  let walkTimer = null;
  let walkSeconds = 0;
  let walkIsActive = false;
  let loggedPoops = [];

  // --- INITIALIZATION ---
  window.addEventListener('DOMContentLoaded', () => {
    loadCustomStations();
    initMap();
    renderStationList();
    initTabNavigation();
    initSearchAndFilters();
    initOrdinanceCalculator();
    initStoolChart();
    initColorMatrix();
    initHeatGauge();
    initWalkTracker();
    initAddStationModal();
    initEmergencyVets();
  });

  // --- LOCAL STORAGE HELPERS ---
  function loadCustomStations() {
    try {
      const stored = localStorage.getItem('vb_custom_stations');
      if (stored) {
        customStations = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load custom stations:', e);
    }
  }

  function saveCustomStations() {
    try {
      localStorage.setItem('vb_custom_stations', JSON.stringify(customStations));
    } catch (e) {
      console.warn('Failed to save custom stations:', e);
    }
  }

  function getAllStations() {
    return [...VB_STATIONS_DATA, ...customStations];
  }

  // --- LEAFLET MAP INITIALIZATION ---
  function initMap() {
    // Default center on Virginia Beach Oceanfront / Central area
    const defaultCenter = [36.8529, -75.9780];
    const defaultZoom = 13;

    map = L.map('map', {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      attributionControl: false
    });

    // High quality CartoDB Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    // Render initial station markers
    renderMarkers();

    // Map click handler for adding station
    map.on('click', (e) => {
      if (window.isAddingPin) {
        openAddStationModal(e.latlng.lat, e.latlng.lng);
        window.isAddingPin = false;
        document.body.style.cursor = 'default';
      }
    });

    // Auto-trigger GPS location on user click
    const gpsBtn = document.getElementById('btn-find-nearest');
    if (gpsBtn) {
      gpsBtn.addEventListener('click', locateUserAndFindNearest);
    }
  }

  // --- RENDER MAP MARKERS ---
  function getMarkerIcon(station) {
    let iconClass = 'pin-dual';
    let emoji = '🎒';

    if (station.isDogPark) {
      iconClass = 'pin-dogpark';
      emoji = '🐾';
    } else if (station.type === 'bag_only') {
      iconClass = 'pin-bag';
      emoji = '🛍️';
    } else if (station.type === 'trash_only') {
      iconClass = 'pin-trash';
      emoji = '🗑️';
    } else if (station.beachAccess) {
      iconClass = 'pin-dual';
      emoji = '🏖️';
    }

    return L.divIcon({
      className: 'custom-pin-wrapper',
      html: `<div class="custom-station-pin ${iconClass}" style="width:34px;height:34px;font-size:16px;">${emoji}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18]
    });
  }

  function renderMarkers() {
    if (!markersLayer) return;
    markersLayer.clearLayers();

    const stations = getFilteredStations();

    stations.forEach(station => {
      const marker = L.marker([station.lat, station.lng], {
        icon: getMarkerIcon(station),
        title: station.name
      });

      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=walking`;

      const popupContent = `
        <div class="map-popup-card">
          <h4>${escapeHTML(station.name)}</h4>
          <p><strong>${escapeHTML(station.area)}</strong></p>
          <p>${escapeHTML(station.description)}</p>
          <div style="display:flex;gap:6px;margin-bottom:8px;font-size:0.75rem;">
            ${station.hasBags ? '<span style="color:#34d399;">✓ Bags</span>' : '<span style="color:#94a3b8;">✕ No Bags</span>'}
            ${station.hasTrash ? '<span style="color:#fbbf24;">✓ Bin</span>' : '<span style="color:#94a3b8;">✕ No Bin</span>'}
            ${station.hasWater ? '<span style="color:#38bdf8;">✓ Water</span>' : ''}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <a href="${navUrl}" target="_blank" rel="noopener" class="popup-btn-nav">🚶 Walk Here</a>
            <button onclick="window.voteStation('${station.id}')" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:0.75rem;">👍 ${station.upvotes || 0}</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        highlightStationInSidebar(station.id);
      });

      markersLayer.addLayer(marker);
    });
  }

  // --- FILTER & SEARCH LOGIC ---
  function getFilteredStations() {
    let stations = getAllStations();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      stations = stations.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'dual') {
      stations = stations.filter(s => s.hasBags && s.hasTrash);
    } else if (activeFilter === 'bags') {
      stations = stations.filter(s => s.hasBags);
    } else if (activeFilter === 'trash') {
      stations = stations.filter(s => s.hasTrash);
    } else if (activeFilter === 'dogpark') {
      stations = stations.filter(s => s.isDogPark);
    } else if (activeFilter === 'beach') {
      stations = stations.filter(s => s.beachAccess);
    } else if (activeFilter === 'water') {
      stations = stations.filter(s => s.hasWater);
    }

    return stations;
  }

  function initSearchAndFilters() {
    const searchInput = document.getElementById('station-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderMarkers();
        renderStationList();
      });
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.dataset.filter || 'all';
        renderMarkers();
        renderStationList();
      });
    });

    // Area quick jumps
    const areaChips = document.querySelectorAll('.area-chip');
    areaChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const area = chip.dataset.area;
        jumpToArea(area);
      });
    });
  }

  function jumpToArea(area) {
    const coords = {
      oceanfront: [36.8529, -75.9780, 14],
      northend: [36.8920, -75.9930, 14],
      firstlanding: [36.9168, -76.0465, 14],
      mttrashmore: [36.8367, -76.1289, 15],
      bayville: [36.9056, -76.1368, 15],
      redwing: [36.7865, -75.9862, 15],
      marshview: [36.8285, -75.9882, 15],
      chicsbeach: [36.9182, -76.1180, 15],
      sandbridge: [36.7200, -75.9350, 13]
    };

    if (coords[area]) {
      const [lat, lng, zoom] = coords[area];
      map.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  }

  // --- RENDER SIDEBAR LIST ---
  function renderStationList() {
    const listEl = document.getElementById('station-list-container');
    const countEl = document.getElementById('station-count-display');
    if (!listEl) return;

    const stations = getFilteredStations();
    if (countEl) countEl.textContent = `(${stations.length})`;

    if (stations.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:32px 16px;color:#94a3b8;">
          <p style="font-size:2rem;margin-bottom:8px;">🐕🔍</p>
          <p>No stations match your filter in Virginia Beach.</p>
          <button class="btn-secondary" onclick="window.resetFilters()" style="margin-top:12px;">Reset Filters</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = stations.map(station => {
      let tagClass = 'tag-dual';
      let tagText = 'Dual Station';

      if (station.isDogPark) {
        tagClass = 'tag-park';
        tagText = 'Dog Park';
      } else if (station.type === 'bag_only') {
        tagClass = 'tag-bag';
        tagText = 'Bags Only';
      } else if (station.type === 'trash_only') {
        tagClass = 'tag-trash';
        tagText = 'Bin Only';
      }

      let distanceStr = '';
      if (userCoords) {
        const distFeet = calculateDistanceFeet(userCoords.lat, userCoords.lng, station.lat, station.lng);
        distanceStr = distFeet > 5280
          ? `<span class="distance-badge">${(distFeet / 5280).toFixed(1)} mi</span>`
          : `<span class="distance-badge">${Math.round(distFeet)} ft</span>`;
      }

      return `
        <div class="station-card" id="card-${station.id}" onclick="window.selectStation('${station.id}')">
          <div class="station-card-head">
            <div class="station-name">${escapeHTML(station.name)}</div>
            <span class="station-type-tag ${tagClass}">${tagText}</span>
          </div>
          <div class="station-address">📍 ${escapeHTML(station.address)}</div>
          <div class="station-amenities">
            ${station.hasBags ? '<span class="amenity-chip">🎒 Rolls Included</span>' : ''}
            ${station.hasTrash ? '<span class="amenity-chip">🗑️ Waste Bin</span>' : ''}
            ${station.hasWater ? '<span class="amenity-chip">💧 Fresh Water</span>' : ''}
            ${station.beachAccess ? '<span class="amenity-chip">🏖️ Beach Access</span>' : ''}
          </div>
          <div class="station-card-footer">
            <div>${distanceStr || `<span style="color:#64748b;">${escapeHTML(station.area)}</span>`}</div>
            <div class="station-actions">
              <button class="btn-icon-xs" title="Upvote" onclick="event.stopPropagation(); window.voteStation('${station.id}')">👍 ${station.upvotes || 0}</button>
              <a class="btn-icon-xs" title="Walk Directions" href="https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=walking" target="_blank" rel="noopener" onclick="event.stopPropagation();">🚶</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function highlightStationInSidebar(stationId) {
    document.querySelectorAll('.station-card').forEach(c => c.classList.remove('selected'));
    const target = document.getElementById(`card-${stationId}`);
    if (target) {
      target.classList.add('selected');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  window.selectStation = function (stationId) {
    const stations = getAllStations();
    const station = stations.find(s => s.id === stationId);
    if (station && map) {
      map.flyTo([station.lat, station.lng], 16, { duration: 0.8 });
      highlightStationInSidebar(stationId);
    }
  };

  window.voteStation = function (stationId) {
    const stations = getAllStations();
    const station = stations.find(s => s.id === stationId);
    if (station) {
      station.upvotes = (station.upvotes || 0) + 1;
      renderStationList();
      renderMarkers();
    }
  };

  window.resetFilters = function () {
    activeFilter = 'all';
    searchQuery = '';
    const searchInput = document.getElementById('station-search');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
    renderMarkers();
    renderStationList();
  };

  // --- USER GPS GEOLOCATION & NEAREST STATION CALCULATOR ---
  function locateUserAndFindNearest() {
    const gpsBtn = document.getElementById('btn-find-nearest');
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    if (gpsBtn) {
      gpsBtn.innerHTML = '<span>📡 Locating...</span>';
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        userCoords = { lat, lng };

        if (gpsBtn) {
          gpsBtn.innerHTML = '<span>📍 Location Locked</span>';
        }

        // Draw user pin
        if (userMarker) {
          userMarker.setLatLng([lat, lng]);
        } else {
          userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'custom-pin-wrapper',
              html: `<div class="custom-station-pin pin-user" style="width:34px;height:34px;font-size:16px;">📍</div>`,
              iconSize: [34, 34],
              iconAnchor: [17, 17]
            })
          }).addTo(map);
          userMarker.bindPopup('<strong>You & Your Pup Are Here!</strong>');
        }

        // Find nearest station
        const stations = getAllStations();
        let nearest = null;
        let minDistance = Infinity;

        stations.forEach(st => {
          const dist = calculateDistanceFeet(lat, lng, st.lat, st.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = st;
          }
        });

        if (nearest) {
          showNearestBanner(nearest, minDistance);
          map.flyTo([nearest.lat, nearest.lng], 15, { duration: 1 });
        }

        renderStationList();
      },
      (err) => {
        console.warn('GPS error:', err);
        if (gpsBtn) gpsBtn.innerHTML = '<span>📍 Find Nearest</span>';
        alert('Could not retrieve your GPS location. Please ensure location permissions are enabled.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function showNearestBanner(station, distFeet) {
    const container = document.getElementById('nearest-banner-container');
    if (!container) return;

    const distStr = distFeet > 5280
      ? `${(distFeet / 5280).toFixed(1)} miles`
      : `${Math.round(distFeet)} feet`;

    const walkMins = Math.max(1, Math.round(distFeet / 250)); // ~250 ft per min walking speed

    container.innerHTML = `
      <div class="nearest-card-popup">
        <div class="nearest-details">
          <h4>⚡ Nearest Station: ${escapeHTML(station.name)} <span class="distance-badge">${distStr} (${walkMins} min walk)</span></h4>
          <p>${escapeHTML(station.area)} • ${station.hasBags ? '🎒 Bags Ready' : ''} ${station.hasTrash ? '🗑️ Trash Can' : ''} ${station.hasWater ? '💧 Water' : ''}</p>
        </div>
        <div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=walking" target="_blank" rel="noopener" class="popup-btn-nav" style="padding:8px 16px;font-size:0.85rem;">🚶 Navigate</a>
        </div>
      </div>
    `;
  }

  // Haversine distance in feet
  function calculateDistanceFeet(lat1, lon1, lat2, lon2) {
    const R = 20902231; // Radius of the Earth in feet
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --- VIRGINIA BEACH DOG ORDINANCE LIVE CALCULATOR ---
  function initOrdinanceCalculator() {
    const tickerContainer = document.getElementById('ordinance-ticker-content');
    if (!tickerContainer) return;

    const now = new Date();
    const month = now.getMonth(); // 0-indexed: 4 = May, 8 = Sept
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Summer season in VB: Memorial Day weekend (approx late May) through Labor Day (approx early Sept)
    // Approximate summer period: May 25 to Sept 7
    const isSummer = (month >= 5 && month <= 7) || (month === 4 && now.getDate() >= 25) || (month === 8 && now.getDate() <= 7);

    let statusHtml = '';

    if (!isSummer) {
      // Off-season: Dogs permitted on beach & boardwalk anytime on leash
      statusHtml = `
        <div class="ordinance-status-pill pill-allowed">
          <span class="pulse-dot"></span>
          <span>OFF-SEASON: All Public Beaches & Boardwalk Open to Leashed Dogs 24/7</span>
        </div>
        <div class="ordinance-quick-info">
          <span>🐕 Must remain on max 6ft leash</span>
          <span>💩 $250 Fine for uncollected waste (VB Code Sec. 5-54)</span>
        </div>
      `;
    } else {
      // Summer Season: North End / Sandbridge allowed before 10 AM & after 6 PM
      const isMorningWindow = hours < 10;
      const isEveningWindow = hours >= 18;
      const isNorthEndAllowed = isMorningWindow || isEveningWindow;

      // Boardwalk allowed only 6 AM to 9 AM
      const isBoardwalkAllowed = hours >= 6 && hours < 9;

      if (isNorthEndAllowed) {
        statusHtml = `
          <div class="ordinance-status-pill pill-allowed">
            <span class="pulse-dot"></span>
            <span>SUMMER DOG HOURS: North End & Sandbridge Beaches ALLOWED Right Now</span>
          </div>
          <div class="ordinance-quick-info">
            <span>🏖️ Allowed before 10 AM & after 6 PM on leash</span>
            <span>🚫 Prohibited 10 AM - 6 PM</span>
          </div>
        `;
      } else {
        const nextHour = 18 - hours;
        statusHtml = `
          <div class="ordinance-status-pill pill-restricted">
            <span class="pulse-dot"></span>
            <span>SUMMER DAYTIME RESTRICTION: Beach Prohibited 10 AM - 6 PM (Reopens in ~${nextHour} hrs)</span>
          </div>
          <div class="ordinance-quick-info">
            <span>🐾 Head to Bayville Farms, Red Wing, or Marshview Dog Parks instead!</span>
          </div>
        `;
      }
    }

    tickerContainer.innerHTML = statusHtml;
  }

  // --- CANINE STOOL CHART ---
  function initStoolChart() {
    const container = document.getElementById('stool-scale-list');
    if (!container || !window.CANINE_STOOL_CHART) return;

    container.innerHTML = CANINE_STOOL_CHART.map(item => `
      <div class="stool-card">
        <div class="stool-header">
          <div>
            <div class="stool-grade-title">${item.icon} ${escapeHTML(item.grade)}</div>
            <div style="font-size:0.8rem;color:#94a3b8;">${escapeHTML(item.subtitle)}</div>
          </div>
          <span class="stool-badge ${item.colorBadge}">${escapeHTML(item.status)}</span>
        </div>
        <p style="font-size:0.85rem;color:#cbd5e1;">${escapeHTML(item.description)}</p>
        <div class="stool-meta-box">
          <strong>Possible Causes:</strong>
          <span style="color:#94a3b8;">${escapeHTML(item.causes)}</span>
        </div>
        <div class="stool-meta-box" style="border-left:3px solid #10b981;">
          <strong style="color:#34d399;">💡 Humane Care Protocol:</strong>
          <span style="color:#cbd5e1;">${escapeHTML(item.humaneAdvice)}</span>
        </div>
      </div>
    `).join('');
  }

  // --- STOOL COLOR MATRIX ---
  function initColorMatrix() {
    const container = document.getElementById('color-matrix-list');
    if (!container || !window.STOOL_COLORS) return;

    container.innerHTML = STOOL_COLORS.map(item => `
      <div class="color-swatch-card">
        <div class="color-blob" style="background-color: ${item.hex};"></div>
        <div class="color-info">
          <h4>${escapeHTML(item.color)}: ${escapeHTML(item.meaning)}</h4>
          <p>${escapeHTML(item.details)}</p>
          <div class="action-tag">${escapeHTML(item.action)}</div>
        </div>
      </div>
    `).join('');
  }

  // --- HEAT & PAVEMENT GAUGE ---
  function initHeatGauge() {
    const slider = document.getElementById('heat-air-slider');
    const airVal = document.getElementById('heat-air-val');
    const asphaltVal = document.getElementById('heat-asphalt-val');
    const statusText = document.getElementById('heat-status-text');

    if (!slider || !airVal || !asphaltVal) return;

    function updateHeat() {
      const airTemp = parseInt(slider.value, 10);
      airVal.textContent = `${airTemp}°F`;

      // Asphalt temperature calculation formula in direct sunlight:
      // At 77°F air temp -> ~125°F asphalt
      // At 86°F air temp -> ~135°F asphalt
      // At 87°F air temp -> ~143°F asphalt
      const asphaltTemp = Math.round(airTemp * 1.6 - 1);
      asphaltVal.textContent = `${asphaltTemp}°F`;

      if (asphaltTemp < 105) {
        asphaltVal.style.color = '#34d399';
        statusText.innerHTML = '<span style="color:#34d399;">🟢 Safe for Paws:</span> Regular walking surface. Enjoy your stroll!';
      } else if (asphaltTemp < 125) {
        asphaltVal.style.color = '#fbbf24';
        statusText.innerHTML = '<span style="color:#fbbf24;">🟡 Caution:</span> Surface is warm. Test with the 7-second back-of-hand rule. Stick to grass or shaded trails.';
      } else if (asphaltTemp < 140) {
        asphaltVal.style.color = '#f97316';
        statusText.innerHTML = '<span style="color:#f97316;">🟠 High Risk:</span> Skin destruction can occur in under 60 seconds. Walk on turf or beach waterline only!';
      } else {
        asphaltVal.style.color = '#f43f5e';
        statusText.innerHTML = '<span style="color:#f43f5e;">🔴 SEVERE PAW BURN DANGER:</span> Surface hot enough to fry an egg. Irreversible pad blistering. Walk only in early morning or late night!';
      }
    }

    slider.addEventListener('input', updateHeat);
    updateHeat();
  }

  // --- WALK COMPANION & TIMER ---
  function initWalkTracker() {
    const startBtn = document.getElementById('btn-toggle-walk');
    const timeDisplay = document.getElementById('walk-time-display');
    const poopBtn = document.getElementById('btn-log-poop');
    const poopLogCount = document.getElementById('poop-log-count');
    const bagCountDisplay = document.getElementById('bag-count-display');
    const btnAddBag = document.getElementById('btn-add-bag');
    const btnSubBag = document.getElementById('btn-sub-bag');

    let bagCount = 3;

    if (btnAddBag) {
      btnAddBag.addEventListener('click', () => {
        bagCount++;
        bagCountDisplay.textContent = bagCount;
      });
    }

    if (btnSubBag) {
      btnSubBag.addEventListener('click', () => {
        if (bagCount > 0) bagCount--;
        bagCountDisplay.textContent = bagCount;
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!walkIsActive) {
          walkIsActive = true;
          startBtn.textContent = '⏸️ Pause Walk';
          startBtn.style.background = '#f59e0b';
          walkTimer = setInterval(() => {
            walkSeconds++;
            const mins = Math.floor(walkSeconds / 60).toString().padStart(2, '0');
            const secs = (walkSeconds % 60).toString().padStart(2, '0');
            timeDisplay.textContent = `${mins}:${secs}`;
          }, 1000);
        } else {
          walkIsActive = false;
          startBtn.textContent = '▶️ Resume Walk';
          startBtn.style.background = '#10b981';
          clearInterval(walkTimer);
        }
      });
    }

    if (poopBtn) {
      poopBtn.addEventListener('click', () => {
        if (bagCount > 0) {
          bagCount--;
          if (bagCountDisplay) bagCountDisplay.textContent = bagCount;
        }

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        loggedPoops.push(time);
        if (poopLogCount) poopLogCount.textContent = loggedPoops.length;

        alert(`💩 Nice job scooping! Logged poop at ${time}. Remaining bags: ${bagCount}`);
      });
    }
  }

  // --- EMERGENCY VETS ---
  function initEmergencyVets() {
    const container = document.getElementById('emergency-vets-list');
    if (!container || !window.VB_EMERGENCY_VETS) return;

    container.innerHTML = VB_EMERGENCY_VETS.map(vet => `
      <div class="vet-clinic-card">
        <div class="vet-info">
          <h4>🏥 ${escapeHTML(vet.name)}</h4>
          <p>📍 ${escapeHTML(vet.address)}</p>
          <p style="color:#fb7185;font-weight:700;margin-top:2px;">⏰ ${escapeHTML(vet.hours)} • ${escapeHTML(vet.type)}</p>
        </div>
        <a href="tel:${vet.phone.replace(/[^0-9]/g, '')}" class="btn-call">📞 Call ${escapeHTML(vet.phone)}</a>
      </div>
    `).join('');
  }

  // --- ADD STATION MODAL ---
  function initAddStationModal() {
    const modal = document.getElementById('add-station-modal');
    const openBtn = document.getElementById('btn-open-add-station');
    const closeBtn = document.getElementById('btn-close-station-modal');
    const form = document.getElementById('add-station-form');
    const dropPinBtn = document.getElementById('btn-drop-pin-mode');

    if (openBtn) {
      openBtn.addEventListener('click', () => openAddStationModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('open');
      });
    }

    if (dropPinBtn) {
      dropPinBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('open');
        window.isAddingPin = true;
        document.body.style.cursor = 'crosshair';
        alert('Click anywhere on the map to place the new bag dispenser or trash station!');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-station-name').value.trim();
        const area = document.getElementById('new-station-area').value.trim();
        const address = document.getElementById('new-station-address').value.trim();
        const lat = parseFloat(document.getElementById('new-station-lat').value);
        const lng = parseFloat(document.getElementById('new-station-lng').value);
        const hasBags = document.getElementById('new-station-has-bags').checked;
        const hasTrash = document.getElementById('new-station-has-trash').checked;
        const hasWater = document.getElementById('new-station-has-water').checked;
        const description = document.getElementById('new-station-desc').value.trim();

        if (!name || isNaN(lat) || isNaN(lng)) {
          alert('Please enter a valid station name and coordinates.');
          return;
        }

        const newStation = {
          id: 'custom-' + Date.now(),
          name,
          area: area || 'Virginia Beach',
          address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat,
          lng,
          type: (hasBags && hasTrash) ? 'dual' : hasBags ? 'bag_only' : 'trash_only',
          hasBags,
          hasTrash,
          hasWater,
          isDogPark: false,
          beachAccess: area.toLowerCase().includes('beach'),
          description: description || 'Community added station.',
          status: 'stocked',
          upvotes: 1,
          lastChecked: new Date().toISOString().split('T')[0]
        };

        customStations.push(newStation);
        saveCustomStations();
        renderMarkers();
        renderStationList();

        modal.classList.remove('open');
        form.reset();
        alert('🎉 Station successfully added and saved to your map!');
      });
    }
  }

  function openAddStationModal(lat, lng) {
    const modal = document.getElementById('add-station-modal');
    if (!modal) return;

    if (lat && lng) {
      document.getElementById('new-station-lat').value = lat.toFixed(6);
      document.getElementById('new-station-lng').value = lng.toFixed(6);
    } else if (userCoords) {
      document.getElementById('new-station-lat').value = userCoords.lat.toFixed(6);
      document.getElementById('new-station-lng').value = userCoords.lng.toFixed(6);
    } else {
      document.getElementById('new-station-lat').value = '36.8529';
      document.getElementById('new-station-lng').value = '-75.9780';
    }

    modal.classList.add('open');
  }

  // --- TAB NAVIGATION ---
  function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn, .bottom-nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        if (!targetTab) return;

        tabButtons.forEach(b => {
          if (b.dataset.tab === targetTab) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        tabPanes.forEach(pane => {
          if (pane.id === `tab-${targetTab}`) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        // Trigger Leaflet map invalidateSize when switching back to map tab
        if (targetTab === 'map' && map) {
          setTimeout(() => {
            map.invalidateSize();
          }, 200);
        }
      });
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

})();
