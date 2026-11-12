/* VQA Control: guarda a página para abrir sem rede. Sempre tenta a versão nova primeiro. */
const CACHE = "tcs-control-v17";
const ARQ = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./resultados.html", "./resultados.webmanifest", "./res-icon-192.png", "./res-icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQ)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // servidor do Google e bibliotecas: direto, sem cache
  e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match(u.pathname.includes("resultados") ? "./resultados.html" : "./index.html"))));
});
