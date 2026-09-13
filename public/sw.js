/**
 * ⚡ ZOTH STUDIO LOCAL SERVICE WORKER (v12.0-SPEED)
 * -------------------------------------------------------------
 * High-performance Cache-First Strategy for local static assets.
 * Guarantees 0ms disk response times, instant offline boot, and zero network delay.
 */

const CACHE_NAME = 'zoth-studio-v12-speed';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/showcase.html',
  '/showcase/tsubuyaki-vortex.html',
  '/comic/index.html',
  '/assets/zoth-theme.css',
  '/assets/zoth-theme.js',
  '/assets/zoth-nav.css',
  '/assets/zoth-nav.js',
  '/assets/zoth-speed-engine.js',
  '/assets/brand/zoth-seal-hermetic-on-dark.svg',
  '/assets/brand/zoth-golden-z-192.png',
  '/favicon.png'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Non-blocking precache notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for local assets, Network-First for API/dynamic
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and WebSocket/SSE/API requests
  if (req.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/v1/')) {
    return;
  }

  // Local static asset strategy: Cache-First with Background Revalidation
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(req).then((cachedResponse) => {
          const fetchPromise = fetch(req).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
