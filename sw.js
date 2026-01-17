const cacheName = 'site-cache-v1';
const assetsToCache = [
  './index.html',
  './assets/script/script.js',
  './assets/style/style.css',
  './assets/imgs/(1).png',
  './assets/imgs/bg-list.jpg',
  './assets/imgs/bg.jpg',
  './assets/imgs/winner.jpg',

];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});


