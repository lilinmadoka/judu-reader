"use strict";

const scope = self.registration.scope;
const cachePrefix = "judu-reader:" + scope + ":";
const cacheName = cachePrefix + "0.1.0";
const appPage = new URL("./index.html",scope).href;
const shellFiles = new Set([
  "./index.html","./prototype-library-data.js","./prototype-library.js",
  "./prototype-dictionary-data.js","./prototype-word-family.js","./prototype-dictionary.js",
  "./prototype-tape.js","./prototype-study-clock.js","./install-web.js",
  "./manifest.webmanifest","./icon-192.png","./icon-512.png","./示例导入.json","./导入说明.md",
].map((file) => new URL(file,scope).href));

self.addEventListener("install",(event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll([...shellFiles])));
});

self.addEventListener("activate",(event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(cachePrefix) && key !== cacheName)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",(event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  url.search = "";
  const navigation = request.mode === "navigate" && (url.href === scope || url.href === appPage);
  if (!navigation && !shellFiles.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(navigation ? appPage : url.href)) || fetch(request);
  })());
});
