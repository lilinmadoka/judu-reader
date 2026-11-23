"use strict";

if (location.protocol !== "file:" && "serviceWorker" in navigator) {
  window.addEventListener("load",async () => {
    const workers = navigator.serviceWorker;
    const panel = document.getElementById("web-update");
    const apply = document.getElementById("apply-web-update");
    let registration, dismissed = false, reloading = false, requested = false, lastCheck = 0;
    const showUpdate = () => {
      panel.hidden = !(registration?.waiting && workers.controller && !dismissed);
    };

    workers.addEventListener("controllerchange",() => {
      panel.hidden = true;
      if (requested && !reloading) {
        reloading = true;
        location.reload();
      }
    });
    apply.onclick = () => {
      const ready = registration?.waiting;
      if (!ready) return showUpdate();
      requested = true;
      panel.hidden = true;
      ready.postMessage("judu:activate-update");
    };
    document.getElementById("dismiss-web-update").onclick = () => {
      dismissed = true;
      panel.hidden = true;
    };

    try {
      registration = await workers.register("./service-worker.js",{updateViaCache:"none"});
    } catch (error) {
      console.warn("句读离线缓存未启用",error);
      return;
    }
    function watch(worker) {
      worker?.addEventListener("statechange",() => {
        if (worker.state === "installed") showUpdate();
      });
    }
    registration.addEventListener("updatefound",() => watch(registration.installing));
    watch(registration.installing);
    showUpdate();

    function checkForUpdate() {
      if (!navigator.onLine || Date.now() - lastCheck < 30000) return;
      lastCheck = Date.now();
      registration.update().then(showUpdate).catch(() => {});
    }
    checkForUpdate();
    window.addEventListener("online",checkForUpdate);
    document.addEventListener("visibilitychange",() => {
      if (!document.hidden) checkForUpdate();
    });
  },{once:true});
}
