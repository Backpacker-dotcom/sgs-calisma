// Uygulama kabuğunu çevrimdışı tutar; şifreli paketler uygulama tarafından ayrıca önbelleğe alınır.
const C='sgs-shell-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','app.webmanifest','icon.svg'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('sgs-shell')&&k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(u.origin!==location.origin||e.request.method!=='GET')return;
  if(u.pathname.includes('/p/'))return; // paketler: uygulama yönetir
  // ağ öncelikli, yoksa önbellek
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
