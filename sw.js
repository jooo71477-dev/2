const CACHE_NAME = 'icloth-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo/logo2..png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // 1. Skip non-GET requests, Firestore/Firebase/Google APIs, and non-http/https protocols
  const url = event.request.url;
  if (event.request.method !== 'GET' || 
      !url.startsWith('http') ||
      url.includes('firestore.googleapis.com') || 
      url.includes('identitytoolkit.googleapis.com') ||
      url.includes('google.firestore') ||
      url.includes('firebase') ||
      url.includes('www.google.com')) {
    return; // Let the browser handle these normally
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful basic same-origin responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        }).catch(err => console.warn('SW Cache error:', err));
        
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        return new Response('Network error occurred', {
          status: 408,
          statusText: 'Network error occurred'
        });
      })
  );
});
