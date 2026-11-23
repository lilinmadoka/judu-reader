"use strict";

/* begin asset revision */
const webBuild = {"revision":"6c5eac6f1a7d1e41","assets":{"./index.html":"sha256-eoiR84CJMkBMAfR9TMuK9LTHfU8qJztPnxGdR0FcFu8=","./prototype-library-data.js":"sha256-A1lWe8K12PemAhRGSLJrK+dgRcdkkUIBNPilq2mR66w=","./prototype-library.js":"sha256-uHwFz523/hwTtTRje3SLNb7C5OBCnGkGKIeHnzjtFYE=","./prototype-transfer.js":"sha256-ChJ+fIhcIakn7kJWL1ACXmmV1Nk1fms4CkrdvK/1MXU=","./prototype-dictionary-data.js":"sha256-w5K93SnlMQ59OZ5IS8WkFj1JjcpNUM5DOIgbrL8tmv4=","./prototype-cet4-data.js":"sha256-9esiwWj5DHr0V6WaoJMbjxN62uaOh2qoB6rVnMt6SXE=","./prototype-word-family.js":"sha256-lPbWoWxsNW0G7GT6hgNmwdXED1DPg6W96Y/GKaTgxX0=","./prototype-dictionary.js":"sha256-isWrZyYa0vMaajr3ZRvuUMdOAklF57Z+03DHmse0VLs=","./prototype-motion.js":"sha256-sSEGz4uoG3qP3MQo9E3rnqr8BTliI3eLYo3M8DBHe/8=","./prototype-tape.js":"sha256-zGERM0khQTO8cUt3E7E2N0kMCVB6NXsqNBi+xrC1308=","./prototype-study-clock.js":"sha256-qs5bo5wu+I8kJqmPqSZplr7plO8X95ExrxDDEP9cmWU=","./install-web.js":"sha256-bCBCqdTwUOV9yvDSufjTHy6dBKQO1JxFdZ3dZ/Dtvts=","./manifest.webmanifest":"sha256-NAAtA6RPUMGl495swXA+M7BUvwuqa6F7SxJ9oCRHzSM=","./icon-192.png":"sha256-9ItPcONybx1VkD3sgh9RrFZPsofBenWoV07RFpYQSGo=","./icon-512.png":"sha256-nsWCcdQxZSEMTZBb7qw4fLhvtw6Fz3eeiuggMJLJUjc=","./示例导入.json":"sha256-W4o60IDxq1qiBCdrXDVCd4Nlz8eE+cR3VOfe3XTjGx0=","./导入说明.md":"sha256-LuGV2oM+AJBVWdXwweTcfGK7aAgtDzoS8EHX6H6XIhA="}};
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
