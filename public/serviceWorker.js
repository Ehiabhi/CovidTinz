const CACHE_NAME = "SITE_CONTENT_V1";

const urlList = [
    "./index.html",
    "./404.html",
    "./offline.html",
    "./css/style.css",
    "./js/script.js",
    "./icons/android-chrome-192x192.png",
    "./icons/android-chrome-512x512.png",
    "./icons/apple-touch-icon.png",
    "./icons/browserconfig.xml",
    "./icons/favicon.ico",
    "./icons/favicon-32x32.png",
    "./icons/safari-pinned-tab.svg",
    "./icons/favicon-16x16.png"
];

self.addEventListener("install", function (installer) {
    console.log("Installing service worker...");
    installer.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlList);
            })
    );
    self.skipWaiting();
    console.log("Service worker installed successfully");
});

self.addEventListener("fetch", fetchEvent => {

    fetchEvent.respondWith(caches.match(fetchEvent.request)
        .then(res => {
            if (res)
                return res;

            if (!navigator.onLine)
                return caches.match(new Request("./offline.html"));

            try {
                return fetch(fetchEvent.request);
            } catch (e) {
                console.log(e);
            }
        }));
});

self.addEventListener("activate", function (activator) {
    console.log("Activating...");
    const currentCaches = [CACHE_NAME];
    const done = async function () {
        const names = await caches.keys();
        return Promise.all(names.map(function (name) {
            if (!currentCaches.includes(name)) {
                return caches.delete(name);
            };
        }));
    };
    activator.waitUntil(done());
    console.log("Service worker activated successfully");
});