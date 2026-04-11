const CACHE_NAME = "vale-entrega-v7";
const FILES_TO_CACHE = [
"./",
"./index.html",
"./manifest.json",
"./icono.png",
];
// Instalación
self.addEventListener("install", function(evt) {
evt.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(FILES_TO_CACHE);
}).then(function() {
return self.skipWaiting();
})
);
});
// Activación
self.addEventListener("activate", function(evt) {
evt.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(
keys
.filter(function(key) {
return key !== CACHE_NAME;
})
.map(function(key) {
return caches.delete(key);
})
);
})
);
self.clients.claim();
});
// Fetch (offline-first)
self.addEventListener("fetch", function(evt) {
evt.respondWith(
caches.match(evt.request).then(function(response) {
return (
response ||
fetch(evt.request).catch(function() {
if (evt.request.mode === 'navigate') return caches.match("./index.html");
})
);
})
);
});
