// Permite abrir a tesouraria sem internet depois da primeira visita.
// Páginas do site: tenta a rede primeiro (para receber as actualizações) e usa a cópia guardada se não houver rede.
// Bibliotecas e letras (CDN): usa a cópia guardada, porque têm versão fixa.
const CACHE = "tesouraria-v1";
const BASE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
const CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all([...BASE, ...CDN].map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
        return r;
      }).catch(() => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
    );
    return;
  }
  if (/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
        return r;
      }))
    );
  }
});
