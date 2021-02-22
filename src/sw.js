
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
workbox.core.skipWaiting();
workbox.core.clientsClaim();

const dataCacheConfig = {
    cacheName: 'page-data'
}

const pageCss = {
    cacheName: 'css-cache'
}

workbox.routing.registerRoute(/.*categories/, new workbox.strategies.CacheFirst(dataCacheConfig), 'GET')
workbox.routing.registerRoute(/.*templates/, new workbox.strategies.CacheFirst(dataCacheConfig), 'GET')
workbox.routing.registerRoute(/.*\.css$/, new workbox.strategies.CacheFirst(pageCss), 'GET')
workbox.routing.registerRoute('https://fonts.gstatic.com/s/poppins/v13/pxiByp8kv8JHgFVrLDz8Z1xlFd2JQEk.woff2', new workbox.strategies.CacheFirst(pageCss), 'GET')
workbox.routing.registerRoute('https://fonts.googleapis.com/css?family=Poppins:300,400,500,600|Roboto+Mono', new workbox.strategies.StaleWhileRevalidate(pageCss), 'GET')


const precacheManifest = self.__WB_MANIFEST;

workbox.precaching.precacheAndRoute(precacheManifest)

self.addEventListener("fetch", (evt) => {
    evt.respondWith(caches.match(evt.request).then(cacheRes => {
        console.log('Fetch request')
        return cacheRes || fetch(evt.request);
    }))
});