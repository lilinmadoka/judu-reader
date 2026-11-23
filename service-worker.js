"use strict";

/* begin asset revision */
const webBuild = {"revision":"2f0361c119ff3631","assets":{"./index.html":"sha256-ttyW/4Kk7fvjTtNsKp2XGTyjkD4Zv+Y9AYyb98hOerE=","./prototype-library-data.js":"sha256-zFcF3m2ZkaPWwXClMdHGzZQH8tjILTRFv4UaYdj3I/0=","./prototype-library.js":"sha256-zBaVDSYCd5CkGCRaUFfW6mazv/fG4D+gYYt2TRcgsX4=","./prototype-transfer.js":"sha256-SA6+1TBU98XCakk+jbbvnufAQb9M+LuQ9POPeaGTih8=","./prototype-dictionary-data.js":"sha256-w5K93SnlMQ59OZ5IS8WkFj1JjcpNUM5DOIgbrL8tmv4=","./prototype-word-family.js":"sha256-lPbWoWxsNW0G7GT6hgNmwdXED1DPg6W96Y/GKaTgxX0=","./prototype-dictionary.js":"sha256-r10f2Q3GU1eR2D9fuBpfiijCtheku5DM7VAnxy2gaQ4=","./prototype-tape.js":"sha256-6kNloGi2rQO6NRmK9M1ufM8huNhPE+6OxMoYjmo93Vc=","./prototype-study-clock.js":"sha256-qs5bo5wu+I8kJqmPqSZplr7plO8X95ExrxDDEP9cmWU=","./install-web.js":"sha256-bCBCqdTwUOV9yvDSufjTHy6dBKQO1JxFdZ3dZ/Dtvts=","./manifest.webmanifest":"sha256-NAAtA6RPUMGl495swXA+M7BUvwuqa6F7SxJ9oCRHzSM=","./icon-192.png":"sha256-9ItPcONybx1VkD3sgh9RrFZPsofBenWoV07RFpYQSGo=","./icon-512.png":"sha256-nsWCcdQxZSEMTZBb7qw4fLhvtw6Fz3eeiuggMJLJUjc=","./示例导入.json":"sha256-uWgm3j4K4LxnuLTtz70nJFZ8gw0qd/tH3fREsKKkwZs=","./导入说明.md":"sha256-a5ggu7chSKAImPy9UpWdXziTFrbCbF6v7e2A1VhtXDQ="}};
/* end asset revision */

const scope = self.registration.scope;
const cachePrefix = "judu-reader:" + scope + ":";
const cacheName = cachePrefix + webBuild.revision;
const appPage = new URL("./index.html",scope).href;
const assets = new Map(Object.entries(webBuild.assets).map(([file,integrity]) => {
  const url = new URL(file,scope);
  const cacheKey = new URL(url);
  cacheKey.searchParams.set("judu-revision",integrity);
  return [url.href,{cacheKey:cacheKey.href,integrity}];
}));

self.addEventListener("install",(event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    const previous = (await caches.keys()).filter((key) => key.startsWith(cachePrefix) && key !== cacheName);
    await Promise.all([...assets].map(async ([url,{cacheKey,integrity}]) => {
      if (await cache.match(cacheKey)) return;
      for (const name of previous) {
        const existing = await (await caches.open(name)).match(cacheKey);
        if (existing) return cache.put(cacheKey,existing);
      }
      const response = await fetch(url,{cache:"reload",integrity});
      if (!response.ok) throw new Error("句读资源无法更新：" + url);
      await cache.put(cacheKey,response);
    }));
  })());
});

self.addEventListener("message",(event) => {
  if (event.data === "judu:activate-update") event.waitUntil(self.skipWaiting());
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
  const asset = assets.get(navigation ? appPage : url.href);
  if (!asset) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(asset.cacheKey)) || fetch(request);
  })());
});
