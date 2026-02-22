const CACHE_NAME = 'hazmat-mapper-v1';
const urlsToCache = [
  './',
  './index.html',
  './db.js' // โหลดฐานข้อมูลสารเคมีเก็บไว้ด้วย
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
