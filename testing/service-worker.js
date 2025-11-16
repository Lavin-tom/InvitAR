const CACHE = "wedding-ar-v1";

const assets = [
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
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(async cache => {

      for (const asset of assets) {
        try {
          await cache.add(asset);
          console.log("Cached:", asset);
        } catch (err) {
          console.warn("Failed to cache:", asset, err);
          // Not throwing error → service worker continues
        }
      }

    })
  );

  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
