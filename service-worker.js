// Minimal Service Worker for PWA Installability

// install event - placeholder for potential future caching
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // We don't need to wait for anything in this minimal version.
  // Caching logic would go inside event.waitUntil() here.
});

// activate event - placeholder for future cache cleanup
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Cache cleanup logic would go inside event.waitUntil() here.
});

// fetch event - required for installability, but does nothing here
self.addEventListener('fetch', (event) => {
  // This listener makes the PWA installable but doesn't affect network requests.
  // We simply don't call event.respondWith() which means the browser
  // will handle the request as it normally would (go to network).
  // console.log('Service Worker: Fetch event for', event.request.url); // Uncomment for debugging if needed
});

console.log('Minimal Service Worker Script Loaded');
