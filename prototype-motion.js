"use strict";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motionEasing = "cubic-bezier(.22,.73,.25,1)";
const runningEffects = new WeakMap();
const disclosureGoals = new WeakMap();

function stopEffect(element) {
  runningEffects.get(element)?.cancel();
  runningEffects.delete(element);
}

function playEffect(element,frames,{duration = 165,easing = motionEasing,after} = {}) {
  stopEffect(element);
  if (reduceMotion.matches || !element.animate) {
    after?.();
    return;
  }
  const effect = element.animate(frames,{duration,easing});
  runningEffects.set(element,effect);
  effect.onfinish = () => {
    if (runningEffects.get(element) !== effect) return;
    runningEffects.delete(element);
    after?.();
  };
}

function smoothIn(element,{distance = 4,opacity = .72,duration = 165} = {}) {
  const current = runningEffects.has(element) ? getComputedStyle(element) : null;
  const from = current ? {opacity:current.opacity,transform:current.transform} :
    {opacity,transform:"translateY(" + distance + "px)"};
  playEffect(element,[from,{opacity:1,transform:"none"}],{duration});
}

function resizeContent(element,from,to,after,{duration = 180} = {}) {
  if (reduceMotion.matches || !element.animate || Math.abs(to-from) < 1) {
    stopEffect(element);
    element.classList.remove("motion-clipping");
    after?.();
    return;
  }
  element.classList.add("motion-clipping");
  const frames = [{height:from+"px"},{height:to+"px"}];
  playEffect(element,frames,{duration,after:() => {
    element.classList.remove("motion-clipping");
    after?.();
  }});
}

function revealBlock(element,open) {
  const frame = () => {
    const style = getComputedStyle(element);
    return {height:element.getBoundingClientRect().height+"px",opacity:style.opacity,
      marginTop:style.marginTop,marginBottom:style.marginBottom,
      paddingTop:style.paddingTop,paddingBottom:style.paddingBottom};
  };
  const closed = {height:"0px",marginTop:"0px",marginBottom:"0px",paddingTop:"0px",paddingBottom:"0px",opacity:0};
  const from = element.hidden ? closed : frame();
  stopEffect(element);
  element.hidden = false;
  const to = open ? frame() : closed;
  element.classList.add("motion-clipping");
  playEffect(element,[from,to],{duration:open ? 185 : 150,after:() => {
    element.hidden = !open;
    element.classList.remove("motion-clipping");
  }});
}

function animateDetails(event) {
  const summary = event.target.closest("summary");
  const details = summary?.parentElement;
  if (details?.tagName !== "DETAILS" || summary !== details.firstElementChild ||
      event.target.closest("a,button") || reduceMotion.matches || !details.animate) return;
  event.preventDefault();
  const open = !(disclosureGoals.get(details) ?? details.open);
  disclosureGoals.set(details,open);
  const from = details.getBoundingClientRect().height;

  stopEffect(details);
  details.open = open;
  const to = details.getBoundingClientRect().height;
  details.open = true;
  resizeContent(details,from,to,() => {
    details.open = open;
    disclosureGoals.delete(details);
  },{duration:open ? 185 : 150});
}
