// --- CONFIGURATION ---
const staticCacheName = 'lic-connect-static-v7';  // Unique name for this version
const dynamicCacheName = 'lic-connect-dynamic-v7'; // Unique name for this version

// List of essential files for the app shell. This is the crucial part.
const filesToCache = [
  '/', // Caches the root URL, very important!
  'main.html',
  'manifest.json',
  'images/icon-192x192.png',
  'images/icon-512x512.png',
  'licnew.jpg'

  // Note: Caching large files like videos (cube.mp4) in the static cache is not recommended.
  // The dynamic cache will handle them if they are requested.
];

// --- SERVICE WORKER LOGIC ---

// 1. INSTALL: Cache the App Shell
self.addEventListener('install', event => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('[Service Worker] Caching App Shell:', filesToCache);
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting(); // Force the new service worker to activate
});

// 2. ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim(); // Take control of the page immediately
});

// 3. FETCH: Intercept network requests
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      // If found in cache, return it immediately
      if (cacheRes) {
        return cacheRes;
      }

      // Not in cache, fetch from the network
      return fetch(event.request).then(fetchRes => {
        // Check for valid responses to avoid caching errors (e.g., from extensions or third-party scripts)
        if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== 'basic') {
          return fetchRes; // Return the response without caching it
        }

        // It's a valid response, so let's cache it dynamically
        const responseToCache = fetchRes.clone();
        caches.open(dynamicCacheName).then(cache => {
          cache.put(event.request.url, responseToCache);
        });
        
        return fetchRes;
      });
    })
  );
});