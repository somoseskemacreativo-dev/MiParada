const CACHE_NAME = 'ud4-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('basemaps.cartocdn.com')) {
    e.respondWith(
      caches.open('ud4-osm-tiles').then((cache) =>
        cache.match(e.request).then((res) =>
          res || fetch(e.request).then((net) => {
            cache.put(e.request, net.clone());
            return net;
          })
        )
      )
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
