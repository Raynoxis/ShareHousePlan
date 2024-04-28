const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    'style.css',
    'main.js',
    'R+1.svg',
    'RDC.svg',
    'offline.html',
    'favicon.ico',
];

const fallbackPage = 'offline.html'; // Page de secours en cas de problème de cache ou de connexion

self.addEventListener('install', event => {
    // Installation du service worker
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        // Tentative de récupération depuis le réseau
        fetch(event.request)
            .then(networkResponse => {
                // Si la requête réseau est réussie, on met à jour le cache
                return caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
            })
            .catch(() => {
                // En cas d'échec de la requête réseau, on recherche dans le cache
                return caches.match(event.request)
                    .then(response => {
                        // Si la ressource est trouvée dans le cache, on la retourne
                        if (response) {
                            return response;
                        }
                        // Sinon, on retourne la page de secours
                        return caches.match(fallbackPage);
                    });
            })
    );
});

self.addEventListener('activate', event => {
    // Nettoyage des anciens caches
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
