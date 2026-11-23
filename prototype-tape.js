"use strict";

const tapeColors = ["#e9ca8a","#b8cba9","#c5a9d1","#b8c6d7","#e3adb3","#c2c594","#f2bb8e","#e6c3a0"];
let tapeGrain;

function tapeSeed(key) {
  let hash = 2166136261;
  for (const letter of key) hash = Math.imul(hash ^ letter.charCodeAt(0),16777619);
  return hash >>> 0;
}

function tapeColor(key) {
  return tapeColors[tapeSeed(key) % tapeColors.length];
}

function tapeRandom(key) {
  let seed = tapeSeed(key);
  return () => {
    seed = (Math.imul(seed,1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function tapeShape(key,line) {
  const next = tapeRandom(key + "/" + line);
  const px = (value) => value.toFixed(2) + "px";
  const percent = (value) => value.toFixed(2) + "%";
  const left = 4.3 + next()*1.35, right = 4.1 + next()*1.65;
  const angle = (next()-.5)*(line ? 2.4 : 4.8);
  const tear = (fromRight) => {
    const points = [[0,.85+next()*1.20],[100,.80+next()*1.45]];
    // A broad, stepped tear breaks the silhouette. The surrounding fibers are much shallower.
    const notch = 25+next()*45;
    const depth = 2.65+next()*1.25;
    points.push([notch-10,.4],[notch-4,depth*.62],[notch+1,depth],
      [notch+7,depth*.81],[notch+13,.38+next()*.48]);
    const chip = notch < 48 ? 78+next()*12 : 11+next()*9;
    points.push([chip-4,.45],[chip,1.5+next()*.75],[chip+5,.35]);
    for (let i = 0; i < 6; i++) points.push([6+next()*88,.15+next()*.50]);
    const fiberPoints = points.filter(([at,inset]) => inset >= .85 ||
      at <= notch-10 || at >= notch+13);
    return fiberPoints.sort(([a],[b]) => a-b).map(([at,inset]) => {
      const x = fromRight ? "calc(100% - " + px(inset) + ")" : px(inset);
      return x + " " + percent(at);
    });
  };
  const longEdge = (bottom) => [10,25,41,60,78,91].map((x) => {
    const depth = px(.1+next()*1.25);
    return percent(x+(next()-.5)*6) + " " + (bottom ? "calc(100% - " + depth + ")" : depth);
  });
  const shape = [...longEdge(false),...tear(true),...longEdge(true).reverse(),...tear(false).reverse()];
  const grainPosition = px(-next()*79) + " " + px(-next()*23);
  return {
    left,right,angle,shape:"polygon(" + shape.join(",") + ")",color:tapeColor(key),grainPosition,
    bloom:percent(23+next()*56) + " " + percent(25+next()*42),
    opacity:(.88+next()*.08).toFixed(2),slant:next() < .5 ? -1 : 1,
  };
}

function paperTapeGrain() {
  if (tapeGrain !== undefined) return tapeGrain;
  const next = tapeRandom("judu paper fibers");
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 48;
  const context = canvas.getContext("2d");
  if (!context) return (tapeGrain = "none");
  const pixels = context.createImageData(canvas.width,canvas.height);
  // Blend a low-resolution tone field underneath the finer paper fibers.
  const columns = 12, rows = 5;
  const density = Array.from({length:columns*rows},() => next()-.48);
  const cell = (x,y) => density[(y%rows)*columns+(x%columns)];
  const mix = (a,b,t) => a+(b-a)*t;
  for (let y = 0; y < canvas.height; y++) {
    const band = y*rows/canvas.height;
    const row = Math.floor(band);
    for (let x = 0; x < canvas.width; x++) {
      const step = x*columns/canvas.width;
      const column = Math.floor(step);
      const a = mix(cell(column,row),cell(column+1,row),step-column);
      const b = mix(cell(column,row+1),cell(column+1,row+1),step-column);
      const tone = mix(a,b,band-row)+.42*(next()-.5);
      const i = (y*canvas.width+x)*4;
      pixels.data[i] = tone >= 0 ? 255 : 123;
      pixels.data[i+1] = tone >= 0 ? 247 : 87;
      pixels.data[i+2] = tone >= 0 ? 228 : 58;
      pixels.data[i+3] = Math.min(58,Math.abs(tone)*92);
    }
  }
  context.putImageData(pixels,0,0);
  for (let i = 0; i < 34; i++) {
    const x = next()*canvas.width, y = next()*canvas.height;
    context.strokeStyle = next() < .62 ? "#fffcf077" : "#6f513c3b";
    context.lineWidth = .35+next()*.5;
    context.beginPath();
    context.moveTo(x,y);
    context.quadraticCurveTo(x+1+next()*4,y-2+next()*4,x+2+next()*12,y-2+next()*4);
    context.stroke();
  }
  tapeGrain = 'url("' + canvas.toDataURL() + '")';
  return tapeGrain;
}

function tapeLineRects(first,last) {
  if (!first?.firstChild || !last?.lastChild) return [];
  const range = document.createRange();
  range.setStart(first.firstChild,0);
  range.setEnd(last.lastChild,last.lastChild.length);
  const lines = [];
  for (const rect of range.getClientRects()) {
    if (rect.width < .5) continue;
    const line = lines.find((row) => Math.abs(row.top-rect.top) < 3);
    if (line) {
      line.left = Math.min(line.left,rect.left);
      line.right = Math.max(line.right,rect.right);
      line.bottom = Math.max(line.bottom,rect.bottom);
    } else {
      lines.push({top:rect.top,bottom:rect.bottom,left:rect.left,right:rect.right});
    }
  }
  return lines.sort((a,b) => a.top-b.top);
}

function tapeSweep(placement,peeling,finish) {
  const {print,lift,cast,width,height,style} = placement;
  const active = placement.effects?.[0];
  const progress = active?.effect?.getComputedTiming().progress;
  const sample = (node) => {
    const computed = getComputedStyle(node);
    return {opacity:computed.opacity,transform:computed.transform};
  };
  const previous = active ? {
    lift:sample(lift),
    cast:sample(cast),
    clipPath:getComputedStyle(print).clipPath,
  } : null;
  placement.effects?.forEach((effect) => effect.cancel());
  if (reduceMotion.matches || !print.animate) {
    placement.effects = null;
    finish?.();
    return;
  }
  const slant = Math.min(17,440/width)*style.slant;
  const clipAt = (x,slip) => {
    const clamp = (p) => Math.min(100,Math.max(0,p));
    return "polygon(0 0," + clamp(x+slant) + "% 0," + clamp(x+slip) +
      "% 52%," + clamp(x-slant) + "% 115%,0 115%)";
  };
  const end = Math.abs(slant) + 5;
  const from = previous ? placement.sweepFrom + (placement.sweepTo-placement.sweepFrom)*(progress ?? 0) :
    peeling ? 100+end : Math.max(0,Math.abs(slant)*.16);
  const to = peeling ? -end : 100+end;
  const stages = [0,.19,.51,.79,.94,1];
  const stops = stages.map((t) => from + (to-from)*t);
  const fraction = Math.abs(to-from)/(100+2*end);
  const base = (peeling ? 306 : 324) + Math.min(57,Math.sqrt(width)*4);
  const timing = {duration:Math.max(95,base*fraction),delay:previous ? 0 : placement.line * 44,
    easing:peeling ? "cubic-bezier(.39,.13,.48,1)" : "cubic-bezier(.29,.11,.24,1)",fill:"backwards"};
  const printing = stops.map((x,i) => ({offset:stages[i],clipPath:clipAt(x,slant*.18)}));
  const moving = stops.map((percent,i) => {
    const x = Math.max(0,Math.min(width,width*percent/100));
    const length = Math.min(width*.65,26) * [0.9,1,.93,.65,.33,0][i];
    const reach = Math.max(1,Math.min(width-x+(peeling ? 5 : 3),length));
    const angle = (peeling ? [48,55,61,66,76,85] : [53,57,44,31,21,0])[i];
    const skew = Math.atan(2*slant*width/(100*height));
    const offset = stages[i];
    return {
      flap:{offset,opacity:(peeling ? [0,.84,.98,.9,.55,0] : [.91,.98,.94,.81,.42,0])[i],
        transform:`translateX(${x.toFixed(2)}px) skewX(${skew}rad) perspective(85px) rotateY(-${angle}deg) scaleX(${reach/26})`},
      shadow:{offset,opacity:(peeling ? [0,.58,.77,.73,.43,0] : [.66,.72,.57,.44,.18,0])[i],
        transform:`translate(${(x - 2).toFixed(2)}px,${(angle*.08).toFixed(2)}px) scale(${Math.max(.13,reach/24)},.83)`},
    };
  });
  const folding = moving.map(({flap}) => flap);
  const shading = moving.map(({shadow}) => shadow);
  if (previous) {
    printing[0].clipPath = previous.clipPath;
    folding[0] = {offset:0,...previous.lift};
    shading[0] = {offset:0,...previous.cast};
  }
  const attach = print.animate(printing,timing);
  const flap = lift.animate(folding,timing);
  const shadow = cast.animate(shading,timing);
  placement.sweepFrom = from;
  placement.sweepTo = to;
  placement.effects = [attach,flap,shadow];
  attach.onfinish = () => {
    if (placement.effects?.[0] !== attach) return;
    placement.effects = null;
    finish?.();
  };
}

function createTapeLayer(layer) {
  const placements = new Map();
  layer.style.setProperty("--tape-grain",paperTapeGrain());
  return (targets,changedKey,peeling = false) => {
    const origin = layer.getBoundingClientRect();
    if (!origin.width) return;
    const seen = new Set();
    for (const {key,first,last} of targets) {
      tapeLineRects(first,last).forEach((rect,index) => {
        const id = key + "/" + index;
        seen.add(id);
        let placement = placements.get(id);
        if (!placement) {
          const node = document.createElement("span");
          const print = document.createElement("span");
          const shadow = document.createElement("span");
          const face = document.createElement("span");
          const lift = document.createElement("span");
          const cast = document.createElement("span");
          node.className = "tape-placement";
          print.className = "tape-print";
          shadow.className = "tape-shadow";
          face.className = "tape-face";
          lift.className = "tape-lift";
          cast.className = "tape-cast";
          print.append(shadow,face);
          node.append(cast,print,lift);
          layer.append(node);
          const style = tapeShape(key,index);
          node.style.setProperty("--tape-outline",style.shape);
          node.style.setProperty("--tape-tint",style.color);
          node.style.setProperty("--tape-opacity",style.opacity);
          node.style.setProperty("--tape-grain-position",style.grainPosition);
          node.style.setProperty("--tape-bloom",style.bloom);
          placement = {node,print,lift,cast,key,style,line:index,leaving:false};
          placements.set(id,placement);
        }
        const {node,style} = placement;
        const textHeight = rect.bottom - rect.top;
        const height = textHeight*1.12;
        const width = rect.right-rect.left+style.left+style.right;
        placement.width = width;
        placement.height = height;
        const angleLimit = Math.atan(4/width)*180/Math.PI;
        const angle = Math.max(-angleLimit,Math.min(angleLimit,style.angle));
        const layout = {
          left:(rect.left-origin.left-style.left) + "px",top:(rect.top-origin.top-textHeight*.055) + "px",
          width:width + "px",height:height + "px",
          transform:"rotate(" + angle.toFixed(2) + "deg)",
        };
        Object.assign(node.style,layout);
        if ((!peeling && changedKey === key) || placement.leaving) tapeSweep(placement,false);
        placement.leaving = false;
      });
    }
    for (const [id,placement] of placements) {
      if (seen.has(id) || placement.leaving) continue;
      const remove = () => {
        placement.node.remove();
        placements.delete(id);
      };
      if (peeling && changedKey === placement.key) {
        placement.leaving = true;
        tapeSweep(placement,true,remove);
      } else {
        placement.effects?.forEach((effect) => effect.cancel());
        remove();
      }
    }
  };
}
