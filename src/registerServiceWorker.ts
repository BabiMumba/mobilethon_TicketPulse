// Registers the service worker defined in `public/sw.js`.
//
// The service worker is only registered in production-like contexts where it
// is served over HTTP(S). During `vite dev` the module runs but registration
// is skipped for unsupported environments so hot-module reloading is not
// interfered with. The worker itself lives in `public/` so it is served from
// the site root ("/sw.js"), giving it the widest possible scope ("/").

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.info(
          '[TicketPulse] Service worker registered:',
          registration.scope,
        )
      })
      .catch((error) => {
        console.error('[TicketPulse] Service worker registration failed:', error)
      })
  })
}

// Ask the active service worker to persist a purchased ticket and its QR code
// so they remain available offline at the gate. Call this right after a
// successful purchase with the ticket/QR asset URLs.
export function cacheTicketOffline(urls: string[]): void {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return
  }
  navigator.serviceWorker.controller.postMessage({ type: 'CACHE_TICKET', urls })
}
