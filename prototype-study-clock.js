"use strict";

const STUDY_IDLE_MS = 5 * 60_000;

function createStudyClock() {
  let phase = "idle", elapsed = 0, runningSince = null, lastInput = 0;

  function stopCounting(now) {
    if (runningSince === null) return;
    elapsed += Math.max(0,now-runningSince);
    runningSince = null;
  }

  function update(now,visible) {
    if (phase === "running" && now-lastInput >= STUDY_IDLE_MS) {
      stopCounting(lastInput+STUDY_IDLE_MS);
      phase = "confirm";
    }
    if (phase === "running" && visible) runningSince ??= now;
    else stopCounting(now);
    return {phase,visible,elapsed:elapsed+(runningSince === null ? 0 : Math.max(0,now-runningSince))};
  }

  function activity(now,visible,start = false) {
    update(now,visible);
    if (visible && (phase === "running" || (phase === "idle" && start))) {
      phase = "running";
      lastInput = now;
    }
    return update(now,visible);
  }

  function setRunning(running,now,visible) {
    update(now,visible);
    phase = running ? "running" : "paused";
    if (running) lastInput = now;
    return update(now,visible);
  }

  return {update,activity,setRunning};
}
