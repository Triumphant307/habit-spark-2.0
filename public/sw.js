/**
 * HabitSpark Service Worker
 * Enables PWA install capability and basic caching
 * Merged with TVP caching strategy:
 * - documents: network-first
 * - other cacheable assets: stale-while-revalidate (cache-first with refresh)
 */

const CACHE_NAME = "habitspark-v2";
const OFFLINE_URL = "/";
const ORIGIN_WHITELIST = [
  location.origin,
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com",
];
const PRECACHE_ASSETS = [
  "/",
  "/tracker",
  "/suggestion",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]; // Assets to cache immediately on install

async function preCache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    PRECACHE_ASSETS.map((url) =>
      cache.add(url).catch((e) => {
        console.error("[SW] Failed to precache:", url, e);
      }),
    ),
  );
}

function isCacheable(request) {
  if (request.method !== "GET") return false;
  if (!request.url.startsWith("http")) return false;
  const url = new URL(request.url);
  if (!ORIGIN_WHITELIST.includes(url.origin)) return false;
  if (url.pathname.startsWith("/api/")) return false;
  return true;
}

async function cacheFirstWithRefresh(request) {
  try {
    const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok || networkResponse.status === 0) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });
    return (await caches.match(request)) || (await fetchResponsePromise);
  } catch (e) {
    console.error("[SW] cacheFirstWithRefresh failed:", e);
    return (await caches.match(request)) || Response.error();
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok || networkResponse.status === 0) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (e) {
    console.error("[SW] networkFirst failed:", e);
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const offline = await caches.match(OFFLINE_URL);
      if (offline) return offline;
    }
    return Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      console.log("[SW] Precaching app shell");
      await preCache();
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          }),
      );
      await self.clients.claim();
    })(),
  );
});

// Fetch event - network first for documents, stale-while-revalidate for other cacheable assets
self.addEventListener("fetch", (event) => {
  if (!isCacheable(event.request)) return;
  // event.respondWith(
  //   (event.request.destination === "document"
  //     ? networkFirst
  //     : cacheFirstWithRefresh)(event.request),
  // );
  event.respondWith((event.request.destination !== "image" ? networkFirst : cacheFirstWithRefresh)(event.request)); // during dev
});

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "Time to check your habits!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/tracker",
      },
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "HabitSpark", options),
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || "/tracker"),
  );
});

console.log("[SW] Service Worker loaded");
