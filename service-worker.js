const CACHE_NAME = 'todo-cache-v2';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['index.html', 'styles.css', 'script.js', 'manifest.json']);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close notification
    event.waitUntil(
        clients.openWindow('/') // Replace '/' with the appropriate URL
    );
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'ToDo Reminder';
    const options = {
        body: data.body || 'You have a task due!',
        icon: 'icon.png', // Replace with the path to your icon
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
