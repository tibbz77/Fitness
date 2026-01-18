const CACHE = 'pf-tracker-v4';
const ASSETS = [
  '/', '/index.html', '/style.css', '/app.js', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'
];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(e.request.method!=='GET' || url.origin!==location.origin){ return; }
  e.respondWith(caches.match(e.request).then(res=> res || fetch(e.request).then(resp=>{ const clone=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request, clone)); return resp; }).catch(()=>caches.match('/index.html'))));
});
