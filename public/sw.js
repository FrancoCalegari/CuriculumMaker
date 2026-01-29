const CACHE_NAME = "cv-maker-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/tool.html",
	"/css/styles.css",
	"/css/tool.css",
	"/js/app.js",
	"/manifest.json",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
	"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("Opened cache");
			return cache.addAll(urlsToCache);
		}),
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log("Deleting old cache:", cacheName);
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
	self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	// Skip API calls for caching
	if (event.request.url.includes("/api/")) {
		event.respondWith(fetch(event.request));
		return;
	}

	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				// Cache hit - return response
				if (response) {
					return response;
				}

				// Clone the request
				const fetchRequest = event.request.clone();

				return fetch(fetchRequest).then((response) => {
					// Check if valid response
					if (
						!response ||
						response.status !== 200 ||
						response.type !== "basic"
					) {
						return response;
					}

					// Clone the response
					const responseToCache = response.clone();

					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return response;
				});
			})
			.catch(() => {
				// Return offline page if available
				return caches.match("/index.html");
			}),
	);
});
