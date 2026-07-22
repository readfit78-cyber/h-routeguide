const CACHE="heritage-v2";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const sameOrigin=new URL(e.request.url).origin===location.origin;
 if(sameOrigin){
  e.respondWith(fetch(e.request).then(r=>{const rc=r.clone();caches.open(CACHE).then(c=>c.put(e.request,rc));return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));
 } else {
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque")){const rc=r.clone();caches.open(CACHE).then(cc=>cc.put(e.request,rc));}return r;}).catch(()=>c)));
 }
});