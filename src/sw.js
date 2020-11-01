importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const dataCache = {
    cacheName: 'page-data'
}

workbox.routing.registerRoute(/.*categories/, new workbox.strategies.CacheFirst(dataCache), 'GET')
workbox.routing.registerRoute(/.*templates/, new workbox.strategies.CacheFirst(dataCache), 'GET')

self.addEventListener("fetch", (evt) => {
    evt.respondWith(dataCache.match(evt.request).then(cacheRes => {
        console.log('Fetch request')
        return cacheRes || fetch(evt.request);
    }))
});