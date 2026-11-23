"use strict";

if (location.protocol !== "file:" && "serviceWorker" in navigator) {
  window.addEventListener("load",() => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("句读离线缓存未启用",error);
    });
  },{once:true});
}
