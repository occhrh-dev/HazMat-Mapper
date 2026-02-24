// ⚠️ แก้เลขเวอร์ชันตรงนี้ทุกครั้งที่จะปล่อยของใหม่ (v4, v5, v6...)
const CACHE_NAME = 'hazmat-mapper-v5'; 

const urlsToCache = [
  './',
  './index.html',
  './db.js',
  './app-logo.png',
  './manifest.json'
  // ใส่ไฟล์อื่นๆ ที่อยากให้แคช
];

// 1. ติดตั้งและบังคับให้ข้ามการรอ (Skip Waiting) ทันที
self.addEventListener('install', event => {
  self.skipWaiting(); // 🌟 คำสั่งสำคัญ! บอกว่าไม่ต้องรอคิว ให้แทรกคิวมาเลย
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ลบแคชเก่าทิ้งทันที
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // ลบของเก่าทิ้ง
          }
        })
      );
    })
  );
  self.clients.claim(); // 🌟 สั่งให้ควบคุมหน้าเว็บทันที
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
