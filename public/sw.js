/* arun.sh service worker - PWA offline caching & runtime cache strategies.
   Version: arun-portfolio-v2.2.0 */

const CACHE_VERSION = "arun-portfolio-v2.2.0";
const OFFLINE_URL = "/offline";

const PRECACHE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/icon.svg",
  "/manifest.webmanifest",
  "/my-images/about.jpg",
  "/my-images/arun-casual.jpg",
  "/my-images/arun-profile.png",
  "/screenshots/sajilo-sahayata-cover.png",
  "/screenshots/roomeo-cover.png",
  "/screenshots/sajilo-digital-cover.png",
  "/screenshots/easy-sorting-cover.png",
];

// Install: precache essential shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up legacy cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for documents, stale-while-revalidate for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Navigation (HTML pages): Network-first -> Cache -> Offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resCopy = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, resCopy));
          }
          return networkRes;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // 2. Static Assets, JS, CSS, Fonts, Images: Stale-While-Revalidate
  if (
    /\/_next\/static\/|\/images\/|\/my-images\/|\/screenshots\/|\/music\/|\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$/.test(
      url.pathname
    )
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resCopy = networkRes.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, resCopy));
            }
            return networkRes;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
