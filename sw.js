const CACHE = 'livingsoil-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok && (u.origin === location.origin || /(gstatic|googleapis)\.com$/.test(u.hostname))) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(r, c)); }
    return res;
  })));
});
