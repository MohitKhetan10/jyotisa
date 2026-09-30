// Offline service worker with a safe update strategy.
//
//  • HTML / navigations → NETWORK-FIRST, so a new deploy is picked up immediately
//    (falls back to cache when offline). This fixes stale app-shell bugs where an
//    old index.html kept pointing at an old JS bundle.
//  • Hashed build assets, WASM, ephemeris data, places.json → CACHE-FIRST, since
//    their URLs change when content changes (or they are large & immutable).
//  Bump CACHE to force old caches out on activate.
const CACHE = 'jyotisha-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isHTML = (req) =>
  req.mode === 'navigate' ||
  (req.headers.get('accept') || '').includes('text/html');

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (isHTML(request)) {
    // Network-first: always try to get the freshest page shell.
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first for everything else (hashed assets, wasm, data).
  e.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
