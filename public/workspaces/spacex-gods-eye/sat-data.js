/**
 * sat-data.js - SpaceX God's Eye
 * Starlink Constellation Definitions, Ground Teleports, and Global Recon Waypoints
 */

const SPACEX_CONFIG = {
  EARTH_RADIUS_KM: 6371.0,
  THREE_EARTH_RADIUS: 100.0,
  ORBIT_SCALE: 100.0 / 6371.0,
  
  // Starlink Constellation Shells (Real SpaceX Parameters)
  SHELLS: [
    {
      id: 'shell-1',
      name: 'Shell 1 (V1.5 Standard)',
      altitudeKm: 550,
      inclinationDeg: 53.0,
      planes: 24,
      satsPerPlane: 30,
      totalSats: 720,
      color: '#00f0ff',
      colorHex: 0x00f0ff,
      laserCapable: true,
      description: 'Primary broadband constellation providing high-speed low-latency coverage worldwide.'
    },
    {
      id: 'shell-2',
      name: 'Shell 2 (V2 Mini Gen2)',
      altitudeKm: 540,
      inclinationDeg: 53.2,
      planes: 18,
      satsPerPlane: 28,
      totalSats: 504,
      color: '#3b82f6',
      colorHex: 0x3b82f6,
      laserCapable: true,
      description: 'Second-generation V2 Mini satellites with massive phased array antennas and 4x throughput.'
    },
    {
      id: 'shell-3',
      name: 'Shell 3 (High-Latitude)',
      altitudeKm: 570,
      inclinationDeg: 70.0,
      planes: 12,
      satsPerPlane: 24,
      totalSats: 288,
      color: '#a855f7',
      colorHex: 0xa855f7,
      laserCapable: true,
      description: 'High inclination shell serving Alaska, Northern Europe, Canada, and polar maritime routes.'
    },
    {
      id: 'shell-4',
      name: 'Shell 4 (Sun-Synchronous Polar)',
      altitudeKm: 560,
      inclinationDeg: 97.6,
      planes: 8,
      satsPerPlane: 20,
      totalSats: 160,
      color: '#ec4899',
      colorHex: 0xec4899,
      laserCapable: true,
      description: 'Polar orbit Starlink birds equipped with optical space lasers for Arctic and Antarctic mesh.'
    },
    {
      id: 'shell-direct2cell',
      name: 'Direct-to-Cell Shell',
      altitudeKm: 360,
      inclinationDeg: 43.0,
      planes: 8,
      satsPerPlane: 18,
      totalSats: 144,
      color: '#10b981',
      colorHex: 0x10b981,
      laserCapable: true,
      description: 'Equipped with eNodeB cellular payload to connect standard LTE smartphones anywhere on Earth.'
    }
  ],

  // Special SpaceX Spacecraft and Mission Trackers
  SPECIAL_CRAFT: [
    {
      id: 'starship-ift',
      name: 'STARSHIP S33 / IFT-ORBITAL',
      type: 'STARSHIP',
      altitudeKm: 235,
      inclinationDeg: 26.5,
      periodMin: 89.2,
      velocityKms: 7.78,
      color: '#ffffff',
      colorHex: 0xffffff,
      size: 3.5,
      description: 'SpaceX Starship Super Heavy Orbital Test Vehicle on high-velocity suborbital insertion trajectory.'
    },
    {
      id: 'dragon-endeavour',
      name: 'CREW DRAGON (ENDEAVOUR C206)',
      type: 'DRAGON',
      altitudeKm: 418,
      inclinationDeg: 51.6,
      periodMin: 92.8,
      velocityKms: 7.66,
      color: '#38bdf8',
      colorHex: 0x38bdf8,
      size: 2.2,
      description: 'Autonomous commercial crew capsule rendezvous with the International Space Station.'
    },
    {
      id: 'falcon9-s2',
      name: 'FALCON 9 STAGE 2 (STARLINK G10-5)',
      type: 'BOOSTER',
      altitudeKm: 295,
      inclinationDeg: 53.0,
      periodMin: 90.4,
      velocityKms: 7.73,
      color: '#f59e0b',
      colorHex: 0xf59e0b,
      size: 1.8,
      description: 'Vacuum Merlin MVac powered upper stage completing constellation orbit circularization.'
    }
  ],

  // Global SpaceX Ground Stations (Gateways / Teleports)
  GROUND_STATIONS: [
    { name: 'Starbase Boca Chica Gateway', lat: 25.997, lon: -97.156, country: 'USA (Texas)', type: 'Gateway + Launch Site' },
    { name: 'Cape Canaveral LC-39A / SLC-40', lat: 28.608, lon: -80.604, country: 'USA (Florida)', type: 'Gateway + Launch Site' },
    { name: 'Vandenberg Space Force Base SLC-4E', lat: 34.632, lon: -120.610, country: 'USA (California)', type: 'Gateway + Launch Site' },
    { name: 'Hawthorne HQ Mission Control', lat: 33.921, lon: -118.327, country: 'USA (California)', type: 'HQ Command Center' },
    { name: 'McGregor Engine Test Facility', lat: 31.398, lon: -97.464, country: 'USA (Texas)', type: 'Development Facility' },
    { name: 'Brewster Gateway Teleport', lat: 48.147, lon: -119.780, country: 'USA (Washington)', type: 'High-Capacity Gateway' },
    { name: 'Punta Gorda Gateway', lat: 26.929, lon: -82.045, country: 'USA (Florida)', type: 'High-Capacity Gateway' },
    { name: 'Kalaeloa Gateway (Oahu)', lat: 21.315, lon: -158.050, country: 'USA (Hawaii)', type: 'Pacific Gateway' },
    { name: 'Madrid Space Communications Gateway', lat: 40.416, lon: -3.703, country: 'Spain', type: 'European Gateway' },
    { name: 'Frankfurt Central Gateway', lat: 50.110, lon: 8.682, country: 'Germany', type: 'European Gateway' },
    { name: 'Tokyo Kanto Gateway', lat: 35.676, lon: 139.650, country: 'Japan', type: 'Asia-Pacific Gateway' },
    { name: 'Sydney Oceania Gateway', lat: -33.868, lon: 151.209, country: 'Australia', type: 'Asia-Pacific Gateway' },
    { name: 'Auckland Gateway', lat: -36.848, lon: 174.763, country: 'New Zealand', type: 'Pacific Gateway' },
    { name: 'Santiago Gateway', lat: -33.448, lon: -70.669, country: 'Chile', type: 'South America Gateway' },
    { name: 'Johannesburg Gateway', lat: -26.204, lon: 28.047, country: 'South Africa', type: 'Africa Gateway' },
    { name: 'Svalbard Polar Earth Station', lat: 78.223, lon: 15.646, country: 'Norway (Arctic)', type: 'Polar Telemetry Station' }
  ],

  // Global Reconnaissance Waypoints (Famous targets for POV camera lock)
  RECON_WAYPOINTS: [
    {
      id: 'starbase',
      name: 'Starbase & Orbital Launch Mount (Boca Chica, TX)',
      category: 'SpaceX Infrastructure',
      lat: 25.9973,
      lon: -97.1568,
      zoom: 16,
      description: 'Birthplace of Starship. Megabay 1 & 2, Orbital Launch Mount A/B, and Suborbital test pads.'
    },
    {
      id: 'ksc39a',
      name: 'Kennedy Space Center LC-39A (Cape Canaveral, FL)',
      category: 'SpaceX Infrastructure',
      lat: 28.6083,
      lon: -80.6041,
      zoom: 16,
      description: 'Historic Apollo/Space Shuttle pad converted for Falcon Heavy, Crew Dragon, and Starship Tower.'
    },
    {
      id: 'vandenberg',
      name: 'Vandenberg SLC-4E (Santa Barbara, CA)',
      category: 'SpaceX Infrastructure',
      lat: 34.6320,
      lon: -120.6108,
      zoom: 15,
      description: 'West Coast spaceport for Starlink polar launches and sun-synchronous military payloads.'
    },
    {
      id: 'hawthorne',
      name: 'SpaceX Rocket Factory HQ (Hawthorne, CA)',
      category: 'SpaceX Infrastructure',
      lat: 33.9207,
      lon: -118.3278,
      zoom: 17,
      description: 'Dragon manufacturing, Merlin/Raptor R&D, and global Starlink network operations control.'
    },
    {
      id: 'pyramids',
      name: 'Great Pyramids of Giza & Sphinx (Egypt)',
      category: 'Ancient Wonders',
      lat: 29.9792,
      lon: 31.1342,
      zoom: 16,
      description: 'Ancient mega-structures aligned with cardinal celestial directions in the Sahara desert.'
    },
    {
      id: 'tokyo',
      name: 'Tokyo Neon Megalopolis & Shibuya Sky (Japan)',
      category: 'Global Metropolises',
      lat: 35.6586,
      lon: 139.7454,
      zoom: 15,
      description: 'Densely illuminated world metropolis with high Starlink direct-to-cell terminal density.'
    },
    {
      id: 'manhattan',
      name: 'Manhattan Island & Central Park (New York)',
      category: 'Global Metropolises',
      lat: 40.7829,
      lon: -73.9654,
      zoom: 15,
      description: 'Iconic urban grid flanked by Hudson and East Rivers with extreme skyscraper density.'
    },
    {
      id: 'dubai',
      name: 'Palm Jumeirah & Burj Khalifa (Dubai, UAE)',
      category: 'Megastructures',
      lat: 25.1124,
      lon: 55.1390,
      zoom: 15,
      description: 'Artificial archipelago protruding into the Persian Gulf alongside the tallest tower on Earth.'
    },
    {
      id: 'everest',
      name: 'Mount Everest Peak (8,848m / Himalayas)',
      category: 'Geological Wonders',
      lat: 27.9881,
      lon: 86.9250,
      zoom: 14,
      description: 'Top of the world where Starlink provides life-saving high-altitude mountaineering broadband.'
    },
    {
      id: 'grandcanyon',
      name: 'Grand Canyon Colorado River Chasm (USA)',
      category: 'Geological Wonders',
      lat: 36.1069,
      lon: -112.1129,
      zoom: 14,
      description: 'Vast layered red rock canyon carved by the Colorado River across millions of years.'
    },
    {
      id: 'aurora',
      name: 'Tromsø & Polar Aurora Corridor (Norway)',
      category: 'Atmospheric Phenomena',
      lat: 69.6492,
      lon: 18.9553,
      zoom: 13,
      description: 'Arctic geomagnetic gateway where solar wind particles ignite shimmering green auroral arcs.'
    },
    {
      id: 'eye_of_sahara',
      name: 'Richat Structure (Eye of the Sahara, Mauritania)',
      category: 'Geological Wonders',
      lat: 21.1269,
      lon: -11.4016,
      zoom: 13,
      description: 'Deeply eroded 40-kilometer circular geological dome visible directly from low Earth orbit.'
    }
  ]
};

function generateConstellationData() {
  const satellites = [];
  let globalId = 1000;

  SPACEX_CONFIG.SHELLS.forEach((shell) => {
    const planes = shell.planes;
    const satsPerPlane = shell.satsPerPlane;
    const incRad = (shell.inclinationDeg * Math.PI) / 180;
    const alt = shell.altitudeKm;
    const orbitRadiusKm = SPACEX_CONFIG.EARTH_RADIUS_KM + alt;
    const GM = 398600.4418;
    const periodSec = 2 * Math.PI * Math.sqrt(Math.pow(orbitRadiusKm, 3) / GM);
    const periodMin = periodSec / 60;
    const speedKms = Math.sqrt(GM / orbitRadiusKm);

    for (let p = 0; p < planes; p++) {
      const raan = (p / planes) * 2 * Math.PI;
      for (let s = 0; s < satsPerPlane; s++) {
        const meanAnomaly = ((s / satsPerPlane) * 2 * Math.PI) + ((p * 1.5) % (2 * Math.PI));
        globalId++;
        
        const satId = "STARLINK-" + globalId;
        const noradId = 50000 + (globalId % 9000);
        
        satellites.push({
          id: satId,
          norad: noradId,
          name: "Starlink v2 #" + globalId,
          shellId: shell.id,
          shellName: shell.name,
          altitudeKm: alt,
          inclinationDeg: shell.inclinationDeg,
          inclinationRad: incRad,
          raanRad: raan,
          meanAnomalyRad: meanAnomaly,
          periodMin: periodMin,
          speedKms: speedKms,
          color: shell.color,
          colorHex: shell.colorHex,
          laserActive: shell.laserCapable,
          laserLinks: Math.floor(3 + Math.random() * 2),
          telemetry: {
            solarPowerW: Math.floor(4200 + Math.random() * 800),
            tempC: Math.floor(-15 + Math.random() * 35),
            thrusterStatus: 'NOMINAL',
            downlinkThroughputGbps: (75 + Math.random() * 30).toFixed(1),
            pingMs: (18 + Math.random() * 6).toFixed(1),
            signalQuality: '99.4%'
          }
        });
      }
    }
  });

  SPACEX_CONFIG.SPECIAL_CRAFT.forEach((craft, idx) => {
    satellites.unshift({
      id: craft.id,
      norad: 90000 + idx,
      name: craft.name,
      shellId: 'special',
      shellName: craft.type,
      altitudeKm: craft.altitudeKm,
      inclinationDeg: craft.inclinationDeg,
      inclinationRad: (craft.inclinationDeg * Math.PI) / 180,
      raanRad: (idx * 1.8) % (2 * Math.PI),
      meanAnomalyRad: (idx * 2.1) % (2 * Math.PI),
      periodMin: craft.periodMin,
      speedKms: craft.velocityKms,
      color: craft.color,
      colorHex: craft.colorHex,
      isSpecial: true,
      specialType: craft.type,
      laserActive: true,
      laserLinks: 4,
      telemetry: {
        solarPowerW: 8500,
        tempC: 18,
        thrusterStatus: 'ACTIVE BURN',
        downlinkThroughputGbps: '120.0',
        pingMs: '12.4',
        signalQuality: '100%'
      }
    });
  });

  return satellites;
}

window.SPACEX_CONFIG = SPACEX_CONFIG;
window.generateConstellationData = generateConstellationData;
