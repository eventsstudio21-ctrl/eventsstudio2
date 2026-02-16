/**
 * Service Worker for Events Studio Gallery
 * Provides offline caching and performance optimization for gallery images
 */

const CACHE_NAME = 'events-studio-gallery-v1';
const STATIC_CACHE = 'events-studio-static-v1';
const IMAGE_CACHE = 'events-studio-images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/galleries.html',
    '/css/styles.css',
    '/css/bootstrap-custom.css',
    '/css/portfolio.css',
    '/css/footer.css',
    '/css/responsive.css',
    '/css/image-optimizer.css',
    '/js/script.js',
    '/js/translations.js',
    '/js/image-optimizer.js',
    '/js/image-thumbnails.js',
    '/js/progressive-loader.js',
    '/js/background-music.js',
    '/assets/favicon/favicon-96x96.png',
    '/assets/favicon/favicon.svg',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/site.webmanifest'
];

// Gallery images to cache
const GALLERY_IMAGES = [
    '/assets/images/Photo.1.webp',
    '/assets/images/Photo.2.webp',
    '/assets/images/Photo.3.webp',
    '/assets/images/Photo.5.webp',
    '/assets/images/ST1.webp',
    '/assets/images/ST2.webp',
    '/assets/images/ST3.webp',
    '/assets/images/rsmval1.PNG',
    '/assets/images/rsmval2.PNG',
    '/assets/images/rsmval3.PNG',
    '/assets/images/1.jpg',
    '/assets/images/2.jpg',
    '/assets/images/3.jpg',
    '/assets/images/4.jpg',
    '/assets/images/5.jpg',
    '/assets/images/6.jpg',
    '/assets/images/7.jpg',
    '/assets/images/8.jpg',
    '/assets/images/9.jpg',
    '/assets/images/10.jpg',
    '/assets/images/11.jpg',
    '/assets/images/12.jpg',
    '/assets/images/13.jpg',
    '/assets/images/14.jpg',
    '/assets/images/15.jpg',
    '/assets/images/20.jpg',
    '/assets/images/rsm1.PNG',
    '/assets/images/rsm2.PNG',
    '/assets/images/rsm3u.jpg',
    '/assets/images/rsm4.PNG',
    '/assets/images/rsm5.PNG',
    '/assets/images/rsm6u.jpg',
    '/assets/images/rsm7.PNG',
    '/assets/images/rsm8.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return caches.open(IMAGE_CACHE);
            })
            .then((cache) => {
                console.log('Service Worker: Caching gallery images');
                return cache.addAll(GALLERY_IMAGES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== IMAGE_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(url)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(url)) {
        event.respondWith(handleStaticRequest(request));
    } else {
        event.respondWith(handleNavigationRequest(request));
    }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request, { cacheName: IMAGE_CACHE });
        
        if (cachedResponse) {
            // Update cache in background
            updateImageCache(request);
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Image request failed:', error);
        
        // Try to serve a placeholder
        const placeholderResponse = await createImagePlaceholder(request.url);
        if (placeholderResponse) {
            return placeholderResponse;
        }
        
        // Return offline page or error
        return new Response('Image not available offline', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle static asset requests with cache-first strategy
async function handleStaticRequest(request) {
    try {
        const cachedResponse = await caches.match(request, { cacheName: STATIC_CACHE });
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Static request failed:', error);
        return new Response('Resource not available offline', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Navigation request failed:', error);
        
        // Try to serve from cache
        const cachedResponse = await caches.match(request, { cacheName: CACHE_NAME });
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Serve offline page
        return caches.match('/index.html');
    }
}

// Update image cache in background
async function updateImageCache(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse);
        }
    } catch (error) {
        console.log('Background cache update failed:', error);
    }
}

// Create image placeholder for offline scenarios
async function createImagePlaceholder(imageUrl) {
    const url = new URL(imageUrl);
    const filename = url.pathname.split('/').pop();
    
    // Create SVG placeholder
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                ${filename}
            </text>
            <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="#ccc" text-anchor="middle" dy=".3em">
                Offline
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

// Check if request is for an image
function isImageRequest(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
    const pathname = url.pathname.toLowerCase();
    
    return imageExtensions.some(ext => pathname.endsWith(ext)) ||
           pathname.includes('/images/') ||
           pathname.includes('/assets/images/');
}

// Check if request is for a static asset
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.ico', '.png'];
    const pathname = url.pathname.toLowerCase();
    
    return staticExtensions.some(ext => pathname.endsWith(ext)) ||
           pathname.includes('/css/') ||
           pathname.includes('/js/') ||
           pathname.includes('/assets/') ||
           pathname.includes('/favicon/');
}

// Background sync for gallery updates
self.addEventListener('sync', (event) => {
    if (event.tag === 'gallery-sync') {
        event.waitUntil(syncGalleryImages());
    }
});

// Sync gallery images
async function syncGalleryImages() {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedImages = await cache.keys();
        
        // Check each cached image for updates
        for (const request of cachedImages) {
            try {
                const networkResponse = await fetch(request);
                
                if (networkResponse.ok) {
                    const cachedResponse = await cache.match(request);
                    
                    // Compare headers or size to detect changes
                    if (shouldUpdateCache(cachedResponse, networkResponse)) {
                        await cache.put(request, networkResponse);
                        console.log('Updated cached image:', request.url);
                    }
                }
            } catch (error) {
                console.log('Failed to sync image:', request.url, error);
            }
        }
        
    } catch (error) {
        console.error('Gallery sync failed:', error);
    }
}

// Check if cache should be updated
function shouldUpdateCache(cachedResponse, networkResponse) {
    if (!cachedResponse || !networkResponse) {
        return true;
    }
    
    const cachedLength = cachedResponse.headers.get('content-length');
    const networkLength = networkResponse.headers.get('content-length');
    
    return cachedLength !== networkLength;
}

// Push notification for new gallery updates
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        if (data.type === 'gallery-update') {
            event.waitUntil(
                self.registration.showNotification('Events Studio', {
                    body: 'New photos added to the gallery!',
                    icon: '/assets/favicon/favicon-96x96.png',
                    badge: '/assets/favicon/favicon-96x96.png',
                    tag: 'gallery-update',
                    actions: [
                        {
                            action: 'view',
                            title: 'View Gallery'
                        }
                    ]
                })
            );
        }
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view' || !event.action) {
        event.waitUntil(
            clients.openWindow('/galleries.html')
        );
    }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_IMAGES':
            cacheSpecificImages(data.urls);
            break;
            
        case 'CLEAR_CACHE':
            clearCache(data.cacheName);
            break;
            
        case 'GET_CACHE_STATS':
            getCacheStats().then(stats => {
                event.ports[0].postMessage({ type: 'CACHE_STATS', data: stats });
            });
            break;
    }
});

// Cache specific images
async function cacheSpecificImages(urls) {
    const cache = await caches.open(IMAGE_CACHE);
    
    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        } catch (error) {
            console.error('Failed to cache image:', url, error);
        }
    }
}

// Clear specific cache
async function clearCache(cacheName) {
    if (cacheName) {
        await caches.delete(cacheName);
    } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
}

// Get cache statistics
async function getCacheStats() {
    const stats = {};
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }
    
    return stats;
}
