// Service Worker para Sistema de Flota v.3
// Versión 3.0.0

const CACHE_NAME = 'flota-v3.0.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/config.js',
    '/api.js',
    '/app.js',
    '/styles.css',
    '/manifest.json',
    // CDN Assets
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

// URLs que requieren conexión (API endpoints)
const NETWORK_FIRST_URLS = [
    'https://yeavqyshoamtfgyyqlyb.supabase.co'
];

// URLs que pueden funcionar offline
const CACHE_FIRST_URLS = [
    'https://cdn.jsdelivr.net',
    'https://cdnjs.cloudflare.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
];

// Evento de instalación
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Instalando...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Cacheando archivos principales...');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Service Worker: Instalación completada');
                // Forzar la activación inmediata
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Error durante la instalación:', error);
            })
    );
});

// Evento de activación
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activando...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar caches antiguos
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activación completada');
                // Reclamar control de todas las páginas
                return self.clients.claim();
            })
    );
});

// Estrategia de cache
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Solo manejar peticiones GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorar extensiones del navegador
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
        return;
    }

    // Estrategia basada en la URL
    if (isNetworkFirst(url)) {
        event.respondWith(networkFirst(request));
    } else if (isCacheFirst(url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Determinar si una URL requiere estrategia Network First
function isNetworkFirst(url) {
    return NETWORK_FIRST_URLS.some(pattern => url.href.includes(pattern));
}

// Determinar si una URL puede usar estrategia Cache First
function isCacheFirst(url) {
    return CACHE_FIRST_URLS.some(pattern => url.href.includes(pattern));
}

// Estrategia Network First (para APIs)
async function networkFirst(request) {
    try {
        // Intentar primero la red
        const networkResponse = await fetch(request);

        // Si es exitoso, cachear la respuesta si es adecuada
        if (networkResponse.ok && isAppropriateToCache(request)) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('🌐 Service Worker: Red no disponible, buscando en cache...');

        // Si falla la red, buscar en cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Si no hay cache, retornar página offline personalizada
        if (request.destination === 'document') {
            return createOfflinePage();
        }

        throw error;
    }
}

// Estrategia Cache First (para assets estáticos)
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        // Actualizar cache en background si es necesario
        if (shouldUpdateCache(request)) {
            updateCacheInBackground(request);
        }
        return cachedResponse;
    }

    // Si no está en cache, buscar en red
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('❌ Service Worker: Error en Cache First:', error);
        throw error;
    }
}

// Estrategia Stale While Revalidate (para contenido general)
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);

    // Siempre intentar actualizar desde la red en background
    const networkResponsePromise = fetch(request)
        .then(async (networkResponse) => {
            if (networkResponse.ok && isAppropriateToCache(request)) {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, networkResponse.clone());
                } catch (cloneError) {
                    console.log('🔄 Service Worker: Error clonando respuesta para cache:', cloneError);
                }
            }
            return networkResponse;
        })
        .catch((error) => {
            console.log('🌐 Service Worker: Error de red en background:', error);
        });

    // Retornar inmediatamente el cache si existe, o esperar la red
    return cachedResponse || networkResponsePromise;
}

// Verificar si una petición es apropiada para cachear
function isAppropriateToCache(request) {
    const url = new URL(request.url);

    // No cachear APIs de Supabase que cambian frecuentemente
    if (url.hostname.includes('supabase.co') &&
        (url.pathname.includes('/rest/v1/') && request.method === 'GET')) {
        return false;
    }

    // No cachear URLs con parámetros de query dinámicos
    if (url.search.includes('timestamp') || url.search.includes('random')) {
        return false;
    }

    return true;
}

// Verificar si el cache debe actualizarse
function shouldUpdateCache(request) {
    // Actualizar assets estáticos cada 24 horas
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 horas

    return caches.match(request)
        .then(response => {
            if (!response) return true;

            const cachedDate = response.headers.get('date');
            if (!cachedDate) return true;

            const age = Date.now() - new Date(cachedDate).getTime();
            return age > MAX_AGE;
        });
}

// Actualizar cache en background
function updateCacheInBackground(request) {
    fetch(request)
        .then(response => {
            if (response.ok) {
                return caches.open(CACHE_NAME)
                    .then(cache => cache.put(request, response));
            }
        })
        .catch(error => {
            console.log('🔄 Service Worker: Error actualizando cache en background:', error);
        });
}

// Crear página offline personalizada
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sin Conexión - Flota v.3</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #0d6efd, #0056b3);
                    color: white;
                    margin: 0;
                    padding: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .container {
                    max-width: 400px;
                    padding: 2rem;
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.8;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                }
                p {
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                    line-height: 1.5;
                }
                .retry-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                .retry-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                .features {
                    margin-top: 2rem;
                    text-align: left;
                    opacity: 0.8;
                }
                .features h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                }
                .features ul {
                    list-style: none;
                    padding: 0;
                }
                .features li {
                    padding: 0.25rem 0;
                    font-size: 0.9rem;
                }
                .features li:before {
                    content: "✓ ";
                    margin-right: 0.5rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">🚗</div>
                <h1>Sin Conexión</h1>
                <p>La aplicación no puede conectarse a internet en este momento. Algunas funciones pueden estar limitadas.</p>
                
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Reintentar
                </button>
                
                <div class="features">
                    <h3>Funciones disponibles offline:</h3>
                    <ul>
                        <li>Ver datos previamente cargados</li>
                        <li>Navegar por la interfaz</li>
                        <li>Usar formularios (se sincronizarán al reconectar)</li>
                    </ul>
                </div>
            </div>

            <script>
                // Auto-retry cuando se restaure la conexión
                window.addEventListener('online', () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                });
                
                // Mostrar estado de conexión
                if (!navigator.onLine) {
                    document.querySelector('p').innerHTML += '<br><br><small>📡 Esperando conexión...</small>';
                }
            </script>
        </body>
        </html>
    `;

    return new Response(offlineHTML, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        }
    });
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('📱 Service Worker: Cliente solicitó skip waiting');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('🗑️ Service Worker: Cache limpiado por solicitud del cliente');
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Notificaciones Push (para funcionalidad futura)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230d6efd" rx="20"/><text y=".7em" font-size="60" text-anchor="middle" x="50" fill="white">🚗</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230d6efd" rx="20"/><text y=".7em" font-size="60" text-anchor="middle" x="50" fill="white">🚗</text></svg>',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 'default'
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver Detalles',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d6efd"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // Abrir la aplicación en la sección relevante
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sincronización en background (para funcionalidad futura)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Service Worker: Ejecutando sincronización en background');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Aquí se podría implementar lógica para sincronizar datos pendientes
        console.log('✅ Service Worker: Sincronización completada');
    } catch (error) {
        console.error('❌ Service Worker: Error en sincronización:', error);
    }
}

// Log de inicio
console.log('🚀 Service Worker: Iniciado - Versión', CACHE_NAME);