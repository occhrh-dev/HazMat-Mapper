// 1. เปลี่ยนชื่อเวอร์ชันตรงนี้ทุกครั้งที่มีการแก้โค้ด HTML/JS (เช่น เปลี่ยนเป็น v2, v3, v4)
const CACHE_NAME = 'hazmat-mapper-v2'; 

const urlsToCache = [
  './',
  './index.html',
  './db.js'
];

// ติดตั้งและเก็บ Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // บังคับให้ Service Worker ตัวใหม่ทำงานทันที
});

// 🌟 ส่วนที่เพิ่มเข้ามา: ลบ Cache เก่าทิ้งเมื่อมีการเปลี่ยนชื่อ CACHE_NAME
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('ลบแคชเวอร์ชันเก่า:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ดึงข้อมูลไปแสดงผล (ถ้ามีเน็ตให้ดึงใหม่ ถ้าไม่มีเน็ตให้ใช้ Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
