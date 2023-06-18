self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('bike-tool-cache').then(function(cache) {
        return cache.addAll([
          '/',
          'script.js',
          'style.css',
          'icon.png'
          // Add any other files or assets that should be cached
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  