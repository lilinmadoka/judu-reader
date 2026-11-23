"use strict";

// Small corrections and productive forms missing from the source dictionary.
const neutralOverrides = new Map([
  ["am",["助动词","be 的第一人称单数现在式；是，在"]],
  ["as an aside",["短语","顺便一提"]],
  ["caregiving",["名词","照护；照料"]],
  ["cliché",["名词","陈词滥调；老套的说法"]],
  ["covid",["名词","新冠病毒感染；新冠病"]],
  ["end up",["短语动词","最终处于某种状态；结果做了某事"]],
  ["figure out",["短语动词","想明白；弄清楚；算出"]],
  ["go on",["短语动词","继续；接着做；发生"]],
  ["high-paying",["形容词","薪酬高的"]],
  ["in-game",["形容词","游戏内的"]],
  ["low-income",["形容词","低收入的"]],
  ["midcareer",["形容词","职业生涯中期的"]],
  ["one-in-five",["形容词","五分之一的；每五个有一个的"]],
  ["pedestrian-friendly",["形容词","便于步行的；对行人友好的"]],
  ["plant-based",["形容词","以植物为基础的；以植物成分为主的"]],
  ["pro-social",["形容词","亲社会的；有益于他人的"]],
  ["raise awareness",["动词短语","提高意识；增进了解"]],
  ["résumé",["名词","简历；履历"]],
  ["single-family",["形容词","供一个家庭居住的"]],
  ["team-building",["名词","团队建设"]],
  ["tuition-free",["形容词","免学费的"]],
  ["unethically",["副词","不道德地；不合职业伦理地"]],
  ["videogames",["名词复数","电子游戏"]],
  ["well-stocked",["形容词","备货充足的；藏品或物资丰富的"]],
  ["work-life",["形容词","工作与生活的"]],
  ["year-old",["形容词","……岁的；已有……年历史的"]],
]);
const negativeContractions = new Map(Object.entries({
  "aren't":"are", "can't":"can", "couldn't":"could", "didn't":"did",
  "doesn't":"does", "don't":"do", "hadn't":"had", "hasn't":"has",
  "haven't":"have", "isn't":"is", "mightn't":"might", "mustn't":"must",
  "needn't":"need", "shan't":"shall", "shouldn't":"should", "wasn't":"was",
  "weren't":"were", "won't":"will", "wouldn't":"would",
}));
const suffixContractions = {"m":"am","re":"are","ve":"have","ll":"will 或 shall","d":"would 或 had"};

function sourceRecord(head,row,type = "") {
  const [phonetic,senses,definitions] = row;
  return {head,ipa:phonetic ? "/" + phonetic + "/" : "",senses,definitions,type,offline:true};
}

function formSenses(entry) {
  const allowed = [];
  if (/过去|现在分词|第三人称/.test(entry.type)) allowed.push(/动词/);
  if (/复数/.test(entry.type)) allowed.push(/名词|复数|代词/);
  if (/比较级|最高级/.test(entry.type)) allowed.push(/形容词|副词/);
  const selected = entry.senses.filter(([pos]) => allowed.some((pattern) => pattern.test(pos)));
  return selected.length ? selected : entry.senses;
}

function offlineEntry(text,form) {
  const override = neutralOverrides.get(form);
  const shortNegative = negativeContractions.get(form);
  if (shortNegative) return {head:form,senses:[["缩写",shortNegative + " not 的缩写，表示否定"]]};
  const contraction = form.match(/^([a-z]+)'(m|re|ve|ll|d|s)$/);
  if (contraction) {
    const [,subject,suffix] = contraction;
    if (suffix !== "s") return {head:form,senses:[["缩写",subject + " + " + suffixContractions[suffix]]]};
    if (/^(he|she|it|there|what|where|when|who|how|why|here|that|this)$/.test(subject)) {
      return {head:form,senses:[["缩写",subject + " is 或 " + subject + " has"]]};
    }
    return {head:form,senses:[["所有格",subject + " 的"],["缩写","’s 还可缩写 is 或 has"]]};
  }
  const ordinal = form.match(/^(\d+)(st|nd|rd|th)$/);
  if (ordinal) return {head:form,senses:[["序数词","第 " + ordinal[1]]]};
  if (/^\d+s$/.test(form)) {
    return {head:form,senses:[["数字表达","可表示年代、年龄或一组数值，需结合上下文"]]};
  }
  const source = typeof OFFLINE_DICTIONARY === "undefined" ? null : OFFLINE_DICTIONARY;
  if (!source) return override ? {head:form,senses:[override]} : null;
  const {entries,variants,capitals} = source;
  let direct;
  if (override) direct = {head:form,senses:[override]};
  else if (Object.hasOwn(capitals,text)) direct = sourceRecord(text,capitals[text]);
  else if (Object.hasOwn(entries,form)) direct = sourceRecord(form,entries[form]);
  const alternatives = Object.hasOwn(variants,form) ? variants[form].map(([root,type]) =>
    sourceRecord(root,entries[root],type)) : [];
  if (direct) return {...direct,variants:alternatives};
  if (alternatives.length) {
    const [primary,...others] = alternatives;
    return {...primary,senses:formSenses(primary),variants:others};
  }
  const spacing = form.replaceAll("-"," ");
  if (spacing !== form && Object.hasOwn(entries,spacing)) return sourceRecord(spacing,entries[spacing]);
  return null;
}

function shortGloss(text) {
  if (text.length <= 34) return text;
  const parts = text.split(/[,，;；]/);
  if (parts.length > 3) return parts.slice(0,3).join("；");
  return text.slice(0,31).trimEnd() + "…";
}

function peekDefinitions(item) {
  const senses = item?.senses.slice(0,item.variants?.length ? 2 : 3) || [];
  if (item?.variants?.length) {
    const variant = item.variants[0];
    const [,meaning] = formSenses(variant)[0];
    senses.push([variant.head,meaning]);
  }
  return senses.map(([pos,meaning]) => [pos,shortGloss(meaning)]);
}

const morphologyPrefixes = new Map([
  ["un","表示否定或相反"],["dis","表示否定、分离或相反"],
  ["non","表示不属于或没有"],["im","否定前缀 in- 的一种拼写"],
  ["in","可表示否定"],["il","否定前缀 in- 的一种拼写"],["ir","否定前缀 in- 的一种拼写"],
  ["mis","表示做错或理解错误"],["re","表示再次或恢复"],
]);
const morphologySuffixes = new Map([
  ["ness","构成名词，表示性质或状态"],["ment","常把动词变成名词，表示行为、结果或状态"],
  ["ation","构成名词，常表示过程或结果"],["ity","构成名词，表示性质或状态"],
  ["ion","构成名词，常表示动作、过程或结果"],["ship","构成名词，常指关系、身份或技能"],
  ["ance","构成名词，常表示行为或状态"],["ence","构成名词，常表示状态或性质"],
  ["hood","构成名词，常指某个阶段、身份或群体"],
  ["ist","构成名词，常指从事某活动或持某观点的人"],
  ["er","可构成名词，表示做某事的人或物"],["or","可构成名词，表示做某事的人或物"],
  ["less","构成形容词，表示缺少或没有"],["ful","构成形容词，常表示具有某种性质或充满"],
  ["able","构成形容词，常表示能够或可以被……"],["ible","常表示可以或能够被……"],
  ["ous","构成形容词，常表示具有某性质"],["ive","构成形容词，常表示具有某性质或倾向"],
  ["ly","常把形容词变成副词，说明方式或程度"],
  ["al","可构成形容词，表示与某事有关，也可构成名词"],
  ["ize","构成动词，常表示使成为或使具有某种性质"],
  ["ise","构成动词，常表示使成为或使具有某种性质"],
  ["ify","构成动词，常表示使成为或使具有某种性质"],
]);
const supplementalFamilyLinks = new Map([
  ["helpful",[["help","derived"]]],
  ["unethically",[["unethical","base"]]],
]);

function familyLinks(word) {
  const families = typeof WORD_FAMILIES === "undefined" ? {} : WORD_FAMILIES;
  return [...(supplementalFamilyLinks.get(word) || []),
    ...(Object.hasOwn(families,word) ? families[word] : [])];
}

function endingChanges(base,suffix) {
  const spellings = [[base+suffix,""]];
  if (base.endsWith("y") && /^[^aeiou]y$/.test(base.slice(-2))) {
    spellings.push([base.slice(0,-1)+"i"+suffix,"词尾 y 变为 i。"]);
  }
  if (base.endsWith("e") && /^[aeiou]/.test(suffix)) {
    spellings.push([base.slice(0,-1)+suffix,"去掉词尾 e 再接后缀。"]);
  }
  if (suffix === "ity" && base.endsWith("le")) {
    spellings.push([base.slice(0,-2)+"il"+suffix,"词尾 -le 变为 -il- 再接 -ity。"]);
  }
  if (suffix === "ly" && base.endsWith("le")) {
    spellings.push([base.slice(0,-2)+suffix,"接 -ly 时，词尾 -le 简化为 -ly。"]);
  }
  return spellings;
}

function derivationStep(word,base,relation) {
  for (const [prefix,meaning] of morphologyPrefixes) {
    if (word === prefix+base && (relation !== "opposite" || !["mis","re"].includes(prefix))) {
      return {word,base,affix:prefix+"-",meaning,prefix:true};
    }
  }
  if (relation === "opposite") return null;
  for (const [suffix,meaning] of morphologySuffixes) {
    const match = endingChanges(base,suffix).find(([written]) => written === word);
    if (match) return {word,base,affix:"-"+suffix,meaning,spelling:match[1]};
  }
  return null;
}

function wordFormation(form,item) {
  if (!/^[a-z]+$/.test(form)) return {steps:[],related:[]};
  const heads = [...new Set([form,item?.head,...(item?.variants || []).map((entry) => entry.head)])].filter(Boolean);
  let related = [];
  for (const head of heads) {
    const first = familyLinks(head);
    if (!related.length) related = first.filter(([,relation]) => relation === "derived").map(([word]) => word);
    const steps = [];
    let word = head;
    while (steps.length < 2) {
      const step = familyLinks(word).map(([base,relation]) => derivationStep(word,base,relation)).find(Boolean);
      if (!step) break;
      steps.push(step);
      word = step.base;
    }
    if (steps.length) return {steps,related:related.filter((word) => !steps.some((step) => step.base === word)).slice(0,3)};
  }
  return {steps:[],related:related.slice(0,3)};
}
