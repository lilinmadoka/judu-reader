"use strict";

const sectionInfo = {
  a: { label: "选词填空", title: "Section A", first: 26, last: 35 },
  b: { label: "长篇匹配", title: "Section B", first: 36, last: 45 },
  c1: { label: "仔细阅读 · 第一篇", title: "Passage One", first: 46, last: 50 },
  c2: { label: "仔细阅读 · 第二篇", title: "Passage Two", first: 51, last: 55 },
};
const sampleId = "cet4_2099_01_1:c1";
const paperIdPattern = /^cet4_(20\d{2})_(0[1-9]|1[0-2])_([1-3])$/;
const builtinPapers = new Map(BUILTIN_PAPERS.map((paper) => [paper.id, paper]));
const importStorage = "judu-reader.imported-papers.v1";
const readingStorage = "judu-reader.reading.v1";
const maximumFileSize = 1024 * 1024;

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function decodePaperPack(raw) {
  const fail = (path, message) => { throw new Error(path + " " + message); };
  const object = (value, path) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(path, "应为对象。");
    return value;
  };
  const string = (value, path, optional = false) => {
    if (optional && value == null) return "";
    if (typeof value !== "string" || (!optional && !value.trim()) || value.length > 10000) {
      fail(path, "应为有效文本。");
    }
    return value.trim();
  };
  const list = (value, path, count, optional = false) => {
    if (optional && value == null) return [];
    if (!Array.isArray(value) || value.length > count) fail(path, "应为列表，最多 " + count + " 项。");
    return value;
  };
  object(raw,"文件");
  if (raw.format !== "judu-cet4" || raw.version !== 1) fail("文件", "需要 judu-cet4 格式第 1 版。");
  const paper = object(raw.paper,"paper");
  const id = string(paper.id,"paper.id");
  const identity = id.match(paperIdPattern);
  if (!identity) fail("paper.id", "用 cet4_年份_月份_套别，例如 cet4_2026_12_1。");
  const [,year,month,set] = identity;
  const title = year + "年" + Number(month) + "月 · 第" + "一二三"[Number(set) - 1] + "套";
  const sourceNote = string(paper.sourceNote,"paper.sourceNote",true);
  const sections = {};
  for (const row of list(raw.sections,"sections",4)) {
    object(row,"篇章");
    const key = row.type;
    if (typeof key !== "string" || !Object.hasOwn(sectionInfo,key) || Object.hasOwn(sections,key)) {
      fail("sections", "type 应为 a、b、c1、c2，且不能重复。");
    }
    const path = sectionInfo[key].label;
    let paragraph = 0;
    const paragraphLabels = new Map();
    const sentences = list(row.sentences,path + " sentences",160).map((value,index) => {
      const tag = path + " 第 " + (index + 1) + " 句";
      const s = object(value,tag);
      if (s.id !== "s" + (index + 1)) fail(tag,"id 必须从 s1 连续编号。");
      if (!Number.isInteger(s.paragraph) || s.paragraph < 1 ||
          s.paragraph < paragraph || s.paragraph > paragraph + 1) fail(tag,"段号需从 1 开始连续递增。");
      paragraph = s.paragraph;
      const en = string(s.en,tag + " en");
      const displayEn = string(s.displayEn,tag + " displayEn",true);
      if (key === "a" && !displayEn) fail(tag,"选词填空需要带原卷空格的 displayEn。");
      const paragraphLabel = string(s.paragraphLabel,tag + " paragraphLabel",true);
      if (key === "b") {
        const expected = String.fromCharCode(64 + paragraph);
        if (paragraph > 26 || paragraphLabel !== expected) fail(tag,"匹配题的段落字母须与原题段序对应。");
        paragraphLabels.set(paragraph,paragraphLabel);
      }
      const chunks = list(s.chunks,tag + " chunks",30,true).map((c) => {
        object(c,tag + " 意群");
        return {en:string(c.en,tag + " 意群 en"),zh:string(c.zh,tag + " 意群 zh")};
      });
      const phrases = list(s.phrases,tag + " phrases",30,true).map((p) => {
        object(p,tag + " 词语");
        const sense = string(p.sense,tag + " sense",true);
        return {text:string(p.text,tag + " text"),meaning:string(p.meaning,tag + " meaning"),
          sense, explanation:string(p.explanation,tag + " explanation",true)};
      });
      return {id:s.id,paragraph,paragraphLabel,en,displayEn,chunks,phrases,
        literal:string(s.literal,tag + " literal",true),zh:string(s.zh,tag + " zh",true),
        grammar:string(s.grammar,tag + " grammar",true),trap:string(s.trap,tag + " trap",true),
        steps:list(s.steps,tag + " steps",20,true).map((step) => string(step,tag + " step"))};
    });
    if (!sentences.length) fail(path,"原文不能为空。");
    const {first,last} = sectionInfo[key];
    const wordBank = key === "a" ? list(row.wordBank,path + " wordBank",15).map((word,index) => {
      object(word,"词库");
      if (word.letter !== "ABCDEFGHIJKLMNO"[index]) fail("wordBank","须按 A 到 O 顺序填写。");
      return {letter:word.letter,word:string(word.word,"wordBank.word")};
    }) : [];
    if (key === "a") {
      const blanks = sentences.flatMap((s) => [...s.displayEn.matchAll(/___(\d+)___/g)].map((m) => Number(m[1])));
      if (wordBank.length !== 15 || blanks.length !== 10 || blanks.some((n,i) => n !== first + i)) {
        fail(path,"须保留 ___26___ 到 ___35___ 及 A–O 共 15 个选项。");
      }
    }
    const questions = list(row.questions,path + " questions",10).map((q,index) => {
      const number = first + index;
      const tag = path + " 第 " + number + " 题";
      object(q,tag);
      if (q.id !== String(number)) fail(tag,"id 应为对应题号的字符串。");
      let options;
      if (key === "a") options = wordBank.map(({letter,word}) => [letter,word]);
      else if (key === "b") options = [...paragraphLabels.values()].map((letter) => [letter,"Paragraph " + letter]);
      else {
        options = list(q.options,tag + " options",4).map((option,i) => {
          if (!Array.isArray(option) || option[0] !== "ABCD"[i]) fail(tag,"选项须按 A 到 D 顺序。");
          return [option[0],string(option[1],tag + " 选项")];
        });
        if (options.length !== 4) fail(tag,"需要四个选项。");
      }
      let answer = q.answer ?? null;
      if (answer !== null && !options.some(([letter]) => letter === answer)) fail(tag,"答案须为已有选项字母或 null。");
      const evidence = list(q.evidence,tag + " evidence",25,true);
      if (evidence.some((id) => !sentences.some((s) => s.id === id))) fail(tag,"证据句编号在该篇中找不到。");
      return {id:q.id,prompt:key === "a" ? "Blank " + number : string(q.prompt,tag + " prompt"),
        options,answer,evidence,explanation:string(q.explanation,tag + " explanation",true)};
    });
    if (questions.length !== last - first + 1) fail(path,"题号必须完整覆盖 " + first + "–" + last + "。");
    const glossary = list(row.dictionary,path + " dictionary",200,true).map((value,index) => {
      const tag = path + " 第 " + (index + 1) + " 个词条";
      const term = object(value,tag);
      const head = string(term.head,tag + " head");
      const senses = list(term.senses,tag + " senses",8).map((sense) => {
        if (!Array.isArray(sense) || sense.length !== 4) fail(tag,"每个义项须包含词性、中文常用义、英文定义和独立例句。");
        return sense.map((value,i) => string(value,tag + " 义项",i >= 2));
      });
      if (!senses.length) fail(tag,"至少需要一个常用义项。");
      return {head,senses,ipa:string(term.ipa,tag + " ipa",true),
        morph:string(term.morph,tag + " morph",true),
        forms:list(term.forms,tag + " forms",20,true).map((form) => string(form,tag + " 词形"))};
    });
    sections[key] = {
      englishTitle:string(row.englishTitle,path + " englishTitle",true),
      sentences,questions,wordBank,glossary,
      sourceOnly:!sentences.some((s) => s.literal || s.zh || s.grammar || s.steps.length || s.chunks.length || s.phrases.length),
    };
  }
  if (!Object.keys(sections).length) fail("sections","至少需有一个篇章。");
  const verificationNotes = list(raw.verificationNotes,"verificationNotes",30,true)
    .map((note) => string(note,"verificationNotes"));
  return {id,title,sourceNote,verificationNotes,sections};
}

function paperCatalogue() {
  const papers = new Map(builtinPapers);
  for (const paper of readLocal(importStorage,[])) {
    const base = builtinPapers.get(paper.id);
    papers.set(paper.id,{...base,...paper,sections:{...base?.sections,...paper.sections}});
  }
  return papers;
}

function getMaterial(id) {
  const [paperId,key] = id.split(":");
  const paper = catalogue.get(paperId);
  const section = paper?.sections[key];
  if (!section) return null;
  return { ...(section.embeddedSample ? sampleMaterial : section),
    exam:paper.title,info:sectionInfo[key],key,id,paper,verificationNotes:section.verificationNotes || [] };
}

function importedDictionary(material) {
  const entries = new Map();
  for (const term of material?.glossary || []) {
    for (const form of [term.head,...term.forms]) entries.set(norm(form),term);
  }
  return entries;
}

function saveReading() {
  try {
    localStorage.setItem(readingStorage,JSON.stringify({
      last:material.id, marks:[...marks], ratings:[...ratings], dueDates:[...dueDates],
      finished:[...finished], choices:[...choices],
      startedPassages:[...startedPassages], closeReadPassages:[...closeReadPassages],
    }));
  } catch {
    flash("浏览器暂时无法保存学习记录，这次的改动只在当前窗口有效。");
  }
}

function renderLibrary() {
  const query = get("paper-filter").value.trim().toLowerCase();
  const papers = [...catalogue.values()].sort((a,b) => b.id.slice(0,12).localeCompare(a.id.slice(0,12)) ||
    a.id.localeCompare(b.id));
  const total = papers.reduce((count,paper) => count + Object.keys(paper.sections).length,0);
  const pdfs = papers.filter((paper) => paper.pdf).length;
  get("library-summary").textContent = (pdfs ? pdfs + " 份原卷 PDF · " : "") + total + " 篇阅读";
  const allIds = papers.flatMap((paper) => Object.keys(paper.sections).map((type) => paper.id + ":" + type));
  const completedCount = allIds.filter((id) => passageProgress(id) === "complete").length;
  const readingCount = allIds.filter((id) => passageProgress(id) === "reading").length;
  get("library-progress").innerHTML = '<strong class="progress-count">已精读 ' + completedCount +
    ' / ' + total + ' 篇</strong>' + (readingCount ? ' <span class="muted">· ' + readingCount + ' 篇精读中</span>' : '');
  const visible = papers.filter((paper) => [paper.title,paper.id,...Object.values(paper.sections).map((s) => s.englishTitle || s.title || "")]
    .join(" ").toLowerCase().includes(query));
  get("paper-list").innerHTML = visible.map((paper) => {
    const options = Object.entries(sectionInfo).flatMap(([type,section]) => {
      const item = paper.sections[type];
      const id = paper.id + ":" + type;
      const progress = passageProgress(id);
      return item ? ['<button type="button" class="ghost" data-open="' + id + '">' + esc(section.label) +
        '<small class="progress-tag" data-progress="' + progress + '">' + progressLabels[progress] +
        (item.sourceOnly ? " · 仅原题" : "") + '</small></button>'] : [];
    }).join("");
    const original = paper.pdf ? '<a class="pdf-link" target="_blank" rel="noopener" href="./archive/' +
      encodeURIComponent(paper.pdf) + '">整卷 PDF ↗</a>' : '';
    const related = paper.related?.map((id) => '<button type="button" class="ghost" data-related="' + id + '">' +
      esc(catalogue.get(id).title) + '</button>').join("") || "";
    return '<article class="paper-item"><header><h2>' + esc(paper.title) + '</h2>' + original +
      '</header>' + (paper.sharedNote ? '<p class="muted">' + esc(paper.sharedNote) + '</p>' : '') +
      '<div class="paper-sections">' + options + related + '</div></article>';
  }).join("") || '<p class="muted">没有找到符合条件的试卷。</p>';
}

async function importPaper(file) {
  if (!file) return;
  const status = get("import-status");
  get("import-button").disabled = true;
  try {
    if (!/\.json$/i.test(file.name) || file.size > maximumFileSize) {
      throw new Error("请选择 1 MB 以内的 JSON 文件。");
    }
    let raw;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      throw new Error("读取不了 JSON。请导入网页端生成的文件。");
    }
    const paper = decodePaperPack(raw);
    const current = catalogue.get(paper.id);
    const additions = Object.entries(paper.sections).filter(([key,section]) =>
      !current?.sections[key] || (current.sections[key].sourceOnly && !section.sourceOnly));
    if (!additions.length) {
      status.textContent = paper.title + " 的这些篇章已在试卷库里。";
      status.dataset.outcome = "info";
      return;
    }
    const imports = new Map(readLocal(importStorage,[]).map((item) => [item.id,item]));
    const previous = imports.get(paper.id);
    const sections = {...previous?.sections};
    for (const [key,section] of additions) {
      sections[key] = {...section,sourceNote:paper.sourceNote,verificationNotes:paper.verificationNotes};
    }
    imports.set(paper.id,{id:paper.id,title:paper.title,sections});
    try {
      localStorage.setItem(importStorage,JSON.stringify([...imports.values()]));
    } catch {
      throw new Error("浏览器无法保存这份文件。请确认允许本地存储并有足够空间。");
    }
    catalogue = paperCatalogue();
    get("paper-filter").value = paper.title;
    renderLibrary();
    const skipped = Object.keys(paper.sections).length - additions.length;
    const notes = paper.verificationNotes.length ? " 有 " + paper.verificationNotes.length + " 条待核对项，打开篇章可查看。" : "";
    status.textContent = "已导入 " + paper.title + " 的 " + additions.length + " 篇阅读。" +
      (skipped ? " 已有的 " + skipped + " 篇沿用原版。" : "") + notes;
    status.dataset.outcome = "success";
  } catch (error) {
    status.textContent = error.message;
    status.dataset.outcome = "error";
  } finally {
    get("import-button").disabled = false;
  }
}
