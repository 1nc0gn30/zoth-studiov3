// DELIVERED. - Interactive Leaflet Radar Map Engine
// Town Center Virginia Beach 1-Mile Geofence & Real-Time Micro-Mobility Simulator

import { TOWN_CENTER_GEO, RESIDENCES, MERCHANTS, COURIERS } from './data.js';

export class TownCenterMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.map = null;
    this.geofenceCircle = null;
    this.markers = {
      residences: [],
      merchants: [],
      couriers: []
    };
    this.routeLine = null;
    this.courierInterval = null;
    this.onGeofenceCheck = options.onGeofenceCheck || null;
    this.onSelectEntity = options.onSelectEntity || null;
  }

  init() {
    if (!window.L) {
      console.warn("Leaflet not loaded yet.");
      return;
    }

    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Center on Town Center Fountain
    this.map = L.map(this.containerId, {
      center: [TOWN_CENTER_GEO.lat, TOWN_CENTER_GEO.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // Custom sleek zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // CartoDB Dark Matter tile layer for high-contrast dark aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Render 1.0-Mile Radius Geofence Circle (1609.34 meters)
    this.geofenceCircle = L.circle([TOWN_CENTER_GEO.lat, TOWN_CENTER_GEO.lng], {
      radius: TOWN_CENTER_GEO.radiusMeters,
      color: '#ffffff',
      weight: 1.5,
      opacity: 0.8,
      dashArray: '6, 8',
      fillColor: '#3b82f6',
      fillOpacity: 0.04
    }).addTo(this.map);

    // Town Center Plaza Center Marker
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-white/20 animate-ping"></div>
          <div class="relative w-4 h-4 rounded-full bg-white border-2 border-black shadow-[0_0_12px_rgba(255,255,255,0.9)] flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([TOWN_CENTER_GEO.lat, TOWN_CENTER_GEO.lng], { icon: centerIcon })
      .bindTooltip('<div class="font-mono text-xs font-bold text-white uppercase tracking-wider">Town Center Plaza (Zone 0)</div>', {
        permanent: false,
        direction: 'top',
        className: 'tc-map-tooltip'
      })
      .addTo(this.map);

    this.renderResidences();
    this.renderMerchants();
    this.renderCouriers();
    this.initMapEvents();
    this.startCourierSimulation();
  }

  renderResidences() {
    RESIDENCES.forEach(res => {
      const resIcon = L.divIcon({
        className: 'residence-marker-wrap',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-110">
            <div class="px-2 py-0.5 rounded-full bg-zinc-900/90 border border-white/20 text-[10px] font-mono font-medium text-white shadow-lg flex items-center gap-1 mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>${res.name.split(' ')[1] || res.name.split(' ')[0]}</span>
            </div>
            <div class="w-6 h-6 rounded-lg bg-zinc-950 border border-white/40 flex items-center justify-center text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>
            </div>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 45]
      });

      const marker = L.marker([res.lat, res.lng], { icon: resIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2.5 bg-zinc-950 text-white rounded-lg border border-white/10 font-sans min-w-[200px]">
          <div class="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Verified Residence</span>
            <span class="text-[10px] text-zinc-400 font-mono">${res.floors} Floors</span>
          </div>
          <h4 class="font-bold text-sm text-white mb-0.5">${res.name}</h4>
          <p class="text-xs text-zinc-400 mb-2">${res.address}</p>
          <div class="flex items-center justify-between text-[11px] font-mono bg-zinc-900 p-1.5 rounded border border-white/5">
            <span class="text-zinc-400">Resident Couriers</span>
            <span class="text-white font-bold">${res.activeCouriers} Active Now</span>
          </div>
        </div>
      `, { className: 'tc-dark-popup' });

      marker.on('click', () => {
        if (this.onSelectEntity) this.onSelectEntity('residence', res);
      });

      this.markers.residences.push(marker);
    });
  }

  renderMerchants() {
    MERCHANTS.forEach(m => {
      const isDining = m.category === 'Dining';
      const mIcon = L.divIcon({
        className: 'merchant-marker-wrap',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-110">
            <div class="w-6 h-6 rounded-full bg-zinc-900 border ${isDining ? 'border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'} flex items-center justify-center text-white">
              <span class="text-[10px]">${isDining ? '🍽️' : '🛒'}</span>
            </div>
            <div class="px-1.5 py-0.5 mt-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-zinc-200 whitespace-nowrap">
              ${m.name}
            </div>
          </div>
        `,
        iconSize: [60, 45],
        iconAnchor: [30, 20]
      });

      const marker = L.marker([m.lat, m.lng], { icon: mIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2.5 bg-zinc-950 text-white rounded-lg border border-white/10 font-sans min-w-[210px]">
          <div class="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">${m.cuisine}</span>
            <span class="text-[10px] text-amber-400 font-bold">★ ${m.rating}</span>
          </div>
          <h4 class="font-bold text-sm text-white mb-0.5">${m.name}</h4>
          <p class="text-xs text-zinc-400 mb-2">${m.address}</p>
          <div class="grid grid-cols-2 gap-1.5 text-[10px] font-mono mb-2">
            <div class="bg-zinc-900 p-1.5 rounded border border-white/5">
              <div class="text-zinc-500">PREP</div>
              <div class="text-white font-bold">${m.prepTime}</div>
            </div>
            <div class="bg-zinc-900 p-1.5 rounded border border-white/5">
              <div class="text-zinc-500">ROLL TIME</div>
              <div class="text-emerald-400 font-bold">${m.courierRollTime}</div>
            </div>
          </div>
          <button class="w-full py-1 bg-white text-black font-bold text-xs rounded hover:bg-zinc-200 transition-colors uppercase tracking-wider" onclick="window.DELIVERED_APP.openMerchant('${m.id}')">
            View Menu & Order
          </button>
        </div>
      `, { className: 'tc-dark-popup' });

      marker.on('click', () => {
        if (this.onSelectEntity) this.onSelectEntity('merchant', m);
      });

      this.markers.merchants.push(marker);
    });
  }

  renderCouriers() {
    this.markers.couriers.forEach(m => this.map.removeLayer(m));
    this.markers.couriers = [];

    COURIERS.forEach(courier => {
      const getIconEmoji = (type) => {
        switch (type) {
          case 'onewheel': return '⚡';
          case 'skateboard': return '🛹';
          case 'ebike': return '🔋';
          case 'bike': return '🚲';
          default: return '⚡';
        }
      };

      const courierDivIcon = L.divIcon({
        className: `courier-marker-${courier.id}`,
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="absolute w-7 h-7 rounded-full bg-blue-500/20 animate-ping"></div>
            <div class="relative w-6 h-6 rounded-full bg-zinc-950 border-2 border-white flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.7)] text-[11px]">
              ${getIconEmoji(courier.vehicleType)}
            </div>
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-black/90 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap">
              ${courier.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([courier.currentLat, courier.currentLng], { icon: courierDivIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="p-2.5 bg-zinc-950 text-white rounded-lg border border-white/10 font-sans min-w-[220px]">
          <div class="flex items-center gap-2 mb-2">
            <img src="${courier.avatar}" class="w-8 h-8 rounded-full border border-white/20 object-cover" />
            <div>
              <h4 class="font-bold text-xs text-white">${courier.name}</h4>
              <p class="text-[10px] font-mono text-zinc-400">${courier.homeResidence}</p>
            </div>
          </div>
          <div class="space-y-1 text-[11px] font-mono bg-zinc-900 p-2 rounded border border-white/5 mb-2">
            <div class="flex justify-between"><span class="text-zinc-400">Vehicle:</span> <span class="text-white font-bold">${courier.vehicle}</span></div>
            <div class="flex justify-between"><span class="text-zinc-400">Speed:</span> <span class="text-emerald-400 font-bold">${courier.topSpeed}</span></div>
            <div class="flex justify-between"><span class="text-zinc-400">Completed Runs:</span> <span class="text-white font-bold">${courier.totalRuns}</span></div>
            <div class="flex justify-between"><span class="text-zinc-400">Rating:</span> <span class="text-amber-400 font-bold">★ ${courier.rating}</span></div>
          </div>
          <p class="text-[10px] text-zinc-400 italic">"${courier.bio}"</p>
        </div>
      `, { className: 'tc-dark-popup' });

      marker.courierData = courier;
      this.markers.couriers.push(marker);
    });
  }

  startCourierSimulation() {
    // Realistic micro-patrol coordinates around Town Center pedestrian paths
    const waypoints = [
      { lat: 36.8427, lng: -76.1344 }, // Plaza Fountain
      { lat: 36.8435, lng: -76.1336 }, // Main St & Central Park
      { lat: 36.8422, lng: -76.1356 }, // Cosmopolitan side
      { lat: 36.8415, lng: -76.1348 }, // Westin concourse
      { lat: 36.8441, lng: -76.1362 }, // Market St
      { lat: 36.8436, lng: -76.1332 }, // Studio 78 corridor
      { lat: 36.8450, lng: -76.1315 }, // Columbus St North
      { lat: 36.8405, lng: -76.1335 }  // Town Center Blvd South
    ];

    let step = 0;
    this.courierInterval = setInterval(() => {
      step++;
      this.markers.couriers.forEach((marker, index) => {
        const c = marker.courierData;
        const baseTarget = waypoints[(step + index * 2) % waypoints.length];
        
        // Small organic drift
        const deltaLat = (Math.sin(step * 0.2 + index) * 0.0003);
        const deltaLng = (Math.cos(step * 0.2 + index) * 0.0003);
        
        c.currentLat = baseTarget.lat + deltaLat;
        c.currentLng = baseTarget.lng + deltaLng;
        
        marker.setLatLng([c.currentLat, c.currentLng]);
      });
    }, 2800);
  }

  initMapEvents() {
    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const distanceMeters = this.calculateDistance(TOWN_CENTER_GEO.lat, TOWN_CENTER_GEO.lng, lat, lng);
      const distanceMiles = distanceMeters / 1609.34;
      const isWithinZone = distanceMiles <= TOWN_CENTER_GEO.radiusMiles;

      if (this.onGeofenceCheck) {
        this.onGeofenceCheck({
          lat,
          lng,
          distanceMiles: parseFloat(distanceMiles.toFixed(2)),
          isWithinZone
        });
      }
    });
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  showDeliveryRoute(merchantCoords, residenceCoords) {
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    // Midpoint path curve simulation
    const midLat = (merchantCoords.lat + residenceCoords.lat) / 2 + 0.0002;
    const midLng = (merchantCoords.lng + residenceCoords.lng) / 2;

    const latlngs = [
      [merchantCoords.lat, merchantCoords.lng],
      [midLat, midLng],
      [residenceCoords.lat, residenceCoords.lng]
    ];

    this.routeLine = L.polyline(latlngs, {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.9,
      dashArray: '8, 8',
      className: 'animated-route-line'
    }).addTo(this.map);

    this.map.fitBounds(this.routeLine.getBounds(), { padding: [40, 40] });
  }

  clearRoute() {
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }
  }

  focusCoordinates(lat, lng, zoom = 17) {
    if (this.map) {
      this.map.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  }

  destroy() {
    if (this.courierInterval) clearInterval(this.courierInterval);
    if (this.map) this.map.remove();
  }
}
