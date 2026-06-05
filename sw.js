const CACHE_NAME = 'studyhub-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './hub.css',
    './course_data.js',
    './hub.js',
    './core/storage.js',
    './icon-512.png',
    './manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches
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
        })
    );
});

// Fetch event - cache-first strategy for local and trusted CDN assets
self.addEventListener('fetch', event => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request).then(
                    response => {
                        const url = event.request.url;
                        const isTrustedCdn = url.includes('cdn.jsdelivr.net') || 
                                            url.includes('cdnjs.cloudflare.com') ||
                                            url.includes('fonts.googleapis.com') ||
                                            url.includes('fonts.gstatic.com');
                        
                        // Check if we received a valid response (basic for local, cors for CDNs)
                        if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
                            return response;
                        }
                        
                        // Clone the response because it's a stream
                        var responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Cache local assets or trusted CDNs
                                if (url.startsWith(self.location.origin) || isTrustedCdn) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                            
                        return response;
                    }
                ).catch(() => {
                    // Fallback for when network fails and asset is not in cache
                    console.log('Fetch failed and no cache available for: ', event.request.url);
                });
            })
    );
});
