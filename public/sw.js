/* TicketPulse Zambia — Service Worker
 *
 * Goals:
 *  - Precache the essential app shell so the PWA boots instantly.
 *  - Keep purchased tickets & QR code assets available OFFLINE, so they load
 *    at the event gate in Lusaka even with low bandwidth or no network.
 *
 * Strategy overview:
 *  - App shell (HTML/CSS/JS/icons): cache-first with background refresh.
 *  - Ticket & QR assets (URLs matching /tickets/ or /qr/): cache-first and
 *    persisted in a dedicated, long-lived cache that survives shell updates.
 *  - Navigation requests: network-first with an offline fallback to the shell.
 */

const VERSION = 'v1';
const SHELL_CACHE = `tp-shell-${VERSION}`;
const TICKET_CACHE = 'tp-tickets'; // intentionally unversioned so tickets persist across app updates

// Core app shell resources to precache on install.
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Requests whose responses represent a purchased ticket or its QR code.
// These must remain available offline for scanning at the gate.
function isTicketAsset(url) {
  return (
    url.pathname.startsWith('/tickets/') ||
    url.pathname.startsWith('/qr/') ||
    url.pathname.endsWith('.qr.png')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            // Drop old shell caches, but never evict the persistent ticket cache.
            .filter((key) => key.startsWith('tp-shell-') && key !== SHELL_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests; let the network deal with the rest.
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Only cache same-origin requests.
  if (url.origin !== self.location.origin) {
    return;
  }

  // 1. Tickets & QR codes: cache-first, and keep a fresh copy for next time.
  if (isTicketAsset(url)) {
    event.respondWith(
      caches.open(TICKET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // Refresh in the background when possible, but serve cached instantly.
          fetchAndCache(request, cache);
          return cached;
        }
        return fetchAndCache(request, cache);
      })
    );
    return;
  }

  // 2. Navigations: network-first with offline fallback to the cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((r) => r || caches.match('/'))
      )
    );
    return;
  }

  // 3. Everything else (shell assets): cache-first with background refresh.
  event.respondWith(
    caches.open(SHELL_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) {
        fetchAndCache(request, cache);
        return cached;
      }
      return fetchAndCache(request, cache);
    })
  );
});

// Fetch a request and store a copy in the given cache. Falls back to any
// cached copy if the network is unavailable.
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw err;
  }
}

// Allow the app to trigger caching of a specific ticket/QR payload after
// purchase, so it is guaranteed to be available offline at the gate.
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'CACHE_TICKET' && Array.isArray(data.urls)) {
    event.waitUntil(
      caches.open(TICKET_CACHE).then((cache) => cache.addAll(data.urls))
    );
  }
});
