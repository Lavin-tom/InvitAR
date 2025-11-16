const CACHE = "wedding-ar-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "index.html",
        "manifest.json",
        "service-worker.js",
        "targets.mind",
        "assets/BaseTemplate.mp4",
        "assets/emotional-piano-music-256262.mp3",
        "assets/FrontPage.jpg",
        "assets/google-maps.png",
        "assets/whatsapp.png",
        "assets/calendar.png",
        "assets/favicon.png"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
