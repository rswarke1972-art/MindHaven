// ============================================
// MINDHAVEN - Service Worker for PWA (Self-Healing Cache)
// ============================================

const CACHE_NAME = 'mindhaven-v2.2.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './app.js',
    './dashboard.js',
    './checkin.js',
    './mentalhealth.js',
    './coping.js',
    './calmspace.js',
    './journal.js',
    './gratitude.js',
    './moodcalendar.js',
    './dailycheckin.js',
    './streaks.js',
    './breathing.js',
    './cbt.js',
    './triggers.js',
    './sleep.js',
    './reflection.js',
    './recommendations.js',
    './resources.js',
    './insights.js',
    './crisis.js',
    './achievements.js',
    './search.js',
    './settings.js',
    './mobile.js',
    './lowenergy.js',
    './emergency.js',
    './assessment.js',
    './goals.js',
    './guidedjournal.js',
    './patterns.js',
    './pwa-install.js',
    './shortcuts.js',
    './swipe.js',
    './decisions.js',
    './safetyplan.js',
    './student.js',
    './supportcircle.js',
    './whathelped.js',
    './roadmaps.js',
    './chat/prompts.js',
    './chat/safety.js',
    './chat/ollama.js',
    './chat/context.js',
    './chat/actions.js',
    './chat/session.js',
    './chat/fallback.js',
    './chat/chatbot.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('Opened cache:', CACHE_NAME);
                for (const url of urlsToCache) {
                    try {
                        const response = await fetch(url, { cache: 'reload' });
                        if (response.ok) {
                            await cache.put(url, response);
                        }
                    } catch (err) {
                        console.warn('Could not pre-cache file:', url);
                    }
                }
            })
    );
    self.skipWaiting();
});

// Activate Service Worker & purge all stale caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Purging old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Strategy: Network First for Chat Scripts & Navigation, Cache Fallback for Assets
self.addEventListener('fetch', (event) => {
    // Ignore cross-origin requests (e.g. Ollama localhost:11434)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Always fetch fresh for JS scripts inside chat/
    const isChatScript = event.request.url.includes('/chat/');

    if (isChatScript) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Reject stale 404 responses from cache
                if (cachedResponse && cachedResponse.status === 200) {
                    return cachedResponse;
                }

                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                    }
                    return networkResponse;
                });
            })
    );
});
