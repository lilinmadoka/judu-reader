"use strict";

const importPrompt = `请把我上传的英语文章、手机照片、PDF 或讲义转成「句读」能直接导入的 UTF-8 JSON 文件。请提供可下载的 .json 文件，文件里只放标准 JSON，不要加 Markdown 代码围栏。

先识别英文，按页码和段落把原文排好。保留拼写、标点、段落、题干和选项；照片太模糊、缺页或顺序拿不准时请问我。可核对的小疑点写进 verificationNotes，不要自行补写原文或猜答案。

【普通文章或只有文章照片】
使用 paper.id = "article_" 加一个唯一的小写英文标识，可以用小写字母、数字、连字符和下划线。paper.title 填实际标题，paper.sourceNote 写来源、图片名或页码。sections 只放一个 type 为 "reading" 的篇章。没有题目时填 questions: []，也不要凭空编题。示例结构：
{"format":"judu-cet4","version":1,"paper":{"id":"article_example","title":"文章标题","sourceNote":"图片 1–2"},"verificationNotes":[],"sections":[{"type":"reading","englishTitle":"English Title","sentences":[{"id":"s1","paragraph":1,"en":"The library stayed open.","chunks":[{"en":"The library","zh":"图书馆"},{"en":"stayed open","zh":"保持开放"}],"grammar":"The library 是主语，stayed 是系动词，open 是表语。","literal":"图书馆仍然开放。"}],"questions":[]}]}

【有完整题目的四级真题】
仍使用同一顶层结构。paper.id 写成 cet4_YYYY_MM_N（两位月份，套别 1–3）。年份、套别不清楚，或某篇题目拍不全时，可以把读得到的原文按自选文章输出。sections.type 用 a（26–35 选词填空）、b（36–45 长篇匹配）、c1（46–50）、c2（51–55）。每篇的题号要完整。questions 每项用字符串 id、原题 prompt 和中文题意 zh；仔细阅读的 options 为 [["A","原选项","选项译文"],["B","原选项","选项译文"],["C","原选项","选项译文"],["D","原选项","选项译文"]]。题意和选项译文不要指明答案。选词填空保留 displayEn，用 ___26___ 到 ___35___ 还原空格，并附按 A–O 排列的 wordBank（每项有 letter、word）。en 仅在答案可靠时填全，选词答案不明可继续保留空格。长篇匹配每句写 paragraphLabel，按 A、B、C… 分段。参考答案不明时 answer 填 null，有依据可附 evidence（句子 ID 数组）和 explanation。选词填空与匹配题的 options 由程序生成。

【逐句精读】
句子 id 每篇从 s1 连续编号，paragraph 从 1 开始，同一段沿用同一整数，句子顺序与原文一致。每句 en 是英文原文；chunks 是按顺序排列的 {"en":"意群","zh":"意群释义"} 数组；grammar 讲主干、修饰、指代和逻辑；steps 用字符串数组解释怎样读；trap 写容易误读的地方；literal 给完整直译，保留否定、语气、逻辑和修饰范围；zh 可另给通顺译文。重要表达可以放在 phrases，每项含 text、meaning、explanation，在拆句时解释。可选的篇章 dictionary 用于常用义：每项含 head、forms、senses，义项形如 ["词性","常见中文义","简明英文释义","自写例句"]，不要在这里提前揭示原句含义。

如果附件包含多篇独立文章或多套试卷，把它们各自做成上述对象，再放到一份 {"format":"judu-library","version":1,"papers":[…]} 文件。输出前检查全文顺序、编号、每个证据句 ID 和 JSON 语法，然后给我下载文件。`;

const storedPapers = new Map();
const pdfPreviews = new WeakMap();
const libraryFileLimit = 80 * 1024 * 1024;
let libraryDatabase;

function openLibraryDatabase() {
  return libraryDatabase ??= new Promise((resolve,reject) => {
    const request = indexedDB.open(importStorage,1);
    request.onupgradeneeded = () => request.result.createObjectStore("papers",{keyPath:"id"});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("试卷库正在被其他窗口使用。"));
  }).catch((error) => {
    libraryDatabase = undefined;
    throw error;
  });
}

function paperPdfHref(paper) {
  if (!paper.pdfFile) return get("library").dataset.archive + encodeURIComponent(paper.pdf);
  if (!pdfPreviews.has(paper.pdfFile)) pdfPreviews.set(paper.pdfFile,URL.createObjectURL(paper.pdfFile));
  return pdfPreviews.get(paper.pdfFile);
}

async function loadStoredPapers() {
  if (!globalThis.indexedDB) return;
  const database = await openLibraryDatabase();
  const papers = await new Promise((resolve,reject) => {
    const request = database.transaction("papers").objectStore("papers").getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  for (const paper of papers) storedPapers.set(paper.id,paper);
}

function collectNewPapers(incoming,previous) {
  const result = new Map(previous.map((paper) => [paper.id,paper]));
  const legacy = new Map(readLocal(importStorage,[]).map((paper) => [paper.id,paper]));
  const changed = new Map();
  let added = 0;
  let originals = 0;
  let supplemented = 0;
  for (const paper of incoming) {
    const base = builtinPapers.get(paper.id);
    const before = result.get(paper.id);
    const sections = {...before?.sections};
    let modified = false;
    for (const [key,section] of Object.entries(paper.sections)) {
      const current = sections[key] || legacy.get(paper.id)?.sections[key] || base?.sections[key];
      if (current && !(current.sourceOnly && !section.sourceOnly)) {
        const updated = supplementQuestions(current,section);
        if (updated) {
          sections[key] = updated;
          supplemented++;
          modified = true;
        }
        continue;
      }
      sections[key] = {...section,sourceNote:paper.sourceNote,verificationNotes:paper.verificationNotes};
      added++;
      modified = true;
    }
    if (paper.pdfFile && !(before?.pdfFile || base?.pdf)) {
      originals++;
      modified = true;
    }
    if (!modified) continue;
    const next = {...before,id:paper.id,title:paper.title,sections};
    if (paper.pdfFile && !base?.pdf && !before?.pdfFile) {
      next.pdf = paper.pdf;
      next.pdfFile = paper.pdfFile;
    }
    if (!base?.related && paper.related?.length) next.related = paper.related;
    if (!base?.sharedNote && paper.sharedNote) next.sharedNote = paper.sharedNote;
    result.set(paper.id,next);
    changed.set(paper.id,next);
  }
  return {papers:[...result.values()],changed:[...changed.values()],added,originals,supplemented};
}

function supplementQuestions(current,incoming) {
  if (!current.questions?.length) return null;
  const incomingQuestions = new Map(incoming.questions.map((question) => [question.id,question]));
  let modified = false;
  const questions = current.questions.map((question) => {
    const supplement = incomingQuestions.get(question.id);
    if (!supplement || question.prompt !== supplement.prompt) return question;
    const zh = question.zh || supplement.zh;
    const options = question.options.map(([letter,en,translated]) => {
      const match = supplement.options.find(([key,text]) => key === letter && text === en);
      const translation = translated || match?.[2];
      if (!translated && translation) {
        modified = true;
        return [letter,en,translation];
      }
      return translated === undefined ? [letter,en] : [letter,en,translated];
    });
    if (!question.zh && zh) modified = true;
    return {...question,zh,options};
  });
  return modified ? {...current,questions} : null;
}

async function storeLibrary(incoming,allowSmallFallback) {
  let database;
  try {
    database = await openLibraryDatabase();
  } catch {
    if (!allowSmallFallback) throw new Error("这个浏览器的本地资料库无法打开，请用已安装的句读网页版导入整库。");
    const change = collectNewPapers(incoming,readLocal(importStorage,[]));
    localStorage.setItem(importStorage,JSON.stringify(change.papers));
    return change;
  }
  const change = await new Promise((resolve,reject) => {
    const transaction = database.transaction("papers","readwrite");
    const store = transaction.objectStore("papers");
    const request = store.getAll();
    let result;
    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () => reject(transaction.error || request.error);
    request.onsuccess = () => {
      result = collectNewPapers(incoming,request.result);
      for (const paper of result.changed) store.put(paper);
    };
  });
  for (const paper of change.papers) storedPapers.set(paper.id,paper);
  return change;
}

function decodeLibrary(raw) {
  if (raw.format !== "judu-library") return [decodePaperPack(raw)];
  if (raw.version !== 1 || !Array.isArray(raw.papers) || !raw.papers.length || raw.papers.length > 200) {
    throw new Error("资料包应为 judu-library 第 1 版，含 1–200 份阅读材料。");
  }
  const used = new Set();
  return raw.papers.map((item) => {
    const paper = decodePaperPack(item,true);
    if (used.has(paper.id)) throw new Error("资料包里出现重复编号 " + paper.id + "。");
    used.add(paper.id);
    if (item.original) {
      const {name,base64} = item.original;
      if (!catalogueIdPattern.test(paper.id) ||
          typeof name !== "string" || !/^cet4_20\d{2}_\d{2}_[1-3](?:-[1-3])?\.pdf$/.test(name) ||
          typeof base64 !== "string" || !base64.startsWith("JVBERi0") || base64.length > 16 * 1024 * 1024) {
        throw new Error(paper.title + " 的整卷 PDF 无法识别。");
      }
      const bytes = Uint8Array.from(atob(base64),(character) => character.charCodeAt(0));
      paper.pdf = name;
      paper.pdfFile = new Blob([bytes],{type:"application/pdf"});
    }
    if (!paper.pdfFile && !Object.keys(paper.sections).length) {
      throw new Error(paper.title + " 没有可导入的内容。");
    }
    return paper;
  });
}

async function readTransferFile(file,limit) {
  if (!/\.json$/i.test(file.name) || file.size > limit) {
    throw new Error("请选择 " + Math.round(limit / 1024 / 1024) + " MB 以内的 JSON 文件。");
  }
  try {
    return JSON.parse((await file.text()).replace(/^\uFEFF/,""));
  } catch {
    throw new Error("读取不了 JSON，请选择下载的完整文件。");
  }
}

function importStatus(message,outcome = "success") {
  const status = get("import-status");
  status.textContent = message;
  status.dataset.outcome = outcome;
}

async function importPaper(file) {
  if (!file) return;
  get("import-button").disabled = true;
  importStatus("正在读取资料…","info");
  try {
    const raw = await readTransferFile(file,libraryFileLimit);
    const single = raw?.format === "judu-cet4";
    if (single && file.size > maximumFileSize) throw new Error("单篇或单套文件最多 1 MB。多篇请使用资料包格式。");
    const incoming = decodeLibrary(raw || {});
    const {added,originals,supplemented} = await storeLibrary(incoming,single);
    if (added || originals || supplemented) void navigator.storage?.persist?.().catch(() => {});
    catalogue = paperCatalogue();
    get("paper-filter").value = single ? incoming[0].title : "";
    renderLibrary();
    if (!added && !originals && !supplemented) {
      importStatus(single ? incoming[0].title + " 的这些篇章已在试卷库里。" : "这些资料已在试卷库里。","info");
      return;
    }
    const notes = single ? incoming[0].verificationNotes.length : 0;
    const summary = [added && added + " 篇阅读",originals && originals + " 份整卷 PDF"].filter(Boolean).join("、");
    importStatus((summary ? "已导入 " + summary + "。" : "") + (supplemented ? "已补充 " + supplemented +
      " 篇的题目译文。" : "") + (notes ? " 有 " + notes + " 条待核对项，打开篇章可查看。" : ""));
  } catch (error) {
    const storageError = ["QuotaExceededError","AbortError","UnknownError"].includes(error?.name);
    importStatus(storageError ? "设备无法保存这份资料，请检查可用空间后重试。" : error?.message || "导入失败。","error");
  } finally {
    get("import-button").disabled = false;
  }
}

function backupSnapshot() {
  return {format:"judu-study-backup",version:1,createdAt:new Date().toISOString(),reading:readingSnapshot()};
}

function decodeReadingBackup(raw) {
  const error = () => { throw new Error("这份文件不是可用的句读学习记录备份。"); };
  if (raw?.format !== "judu-study-backup" || raw.version !== 1 || !raw.reading ||
      typeof raw.reading !== "object" || Array.isArray(raw.reading)) error();
  const reading = raw.reading;
  const ids = /^(?:cet4_20\d{2}_\d{2}_[1-3](?:-[1-3])?|article_[a-z0-9]+(?:[-_][a-z0-9]+)*):(?:a|b|c1|c2|reading)$/;
  const validId = (id) => typeof id === "string" && id.length < 100 && ids.test(id);
  const list = (name) => {
    const value = reading[name] ?? [];
    if (!Array.isArray(value) || value.length > 50000) error();
    return value;
  };
  const pairs = (name,validate) => list(name).map((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2 || !validate(...pair)) error();
    return pair;
  });
  const text = (value,max = 10000) => typeof value === "string" && value.length > 0 && value.length <= max;
  function validMark(mark) {
    if (!mark || !validId(mark.materialId) || typeof mark.sentence !== "string" ||
        !/^(?:s\d+|bank-[A-O]|q-\d{1,3}(?:-[A-D])?)$/.test(mark.sentence) ||
        !text(mark.sourceText) || !text(mark.text) || !text(mark.cardKey) ||
        !Number.isInteger(mark.start) || !Number.isInteger(mark.end) ||
        mark.start < 0 || mark.end < mark.start || mark.end >= tokensFor(mark.sourceText).length ||
        (mark.contextOnly && !mark.contextual)) return false;
    return !mark.entry || decodeContextEntry(mark.entry);
  }
  function cleanMark(mark) {
    const {materialId,sentence,sourceText,start,end,text,cardKey,contextOnly,contextual,entry} = mark;
    return {materialId,sentence,sourceText,start,end,text,cardKey,contextOnly:Boolean(contextOnly),
      contextual:Boolean(contextual),entry:entry ? decodeContextEntry(entry) : undefined};
  }
  const checkedMarks = pairs("marks",(key,mark) => validMark(mark) && key === markKey(mark))
    .map(([key,mark]) => {
      const restored = cleanMark(mark);
      const parts = mark.mergeParts;
      if (parts !== undefined) {
        if (!Array.isArray(parts) || parts.length !== 2 || parts.some((part) =>
          !validMark(part) || part.contextual || part.materialId !== mark.materialId ||
          part.sentence !== mark.sentence || part.sourceText !== mark.sourceText) ||
          parts[0].start !== mark.start || parts[1].end !== mark.end || parts[0].end + 1 !== parts[1].start) error();
        restored.mergeParts = parts.map(cleanMark);
      }
      return [key,restored];
    });
  const checkedChoices = pairs("choices",(id,value) => validId(id) && value && typeof value === "object" &&
    !Array.isArray(value) && Object.entries(value).every(([question,letter]) =>
      /^\d{1,3}$/.test(question) && typeof letter === "string" && /^[A-Z]?$/.test(letter)));
  const progress = Object.fromEntries(["finished","startedPassages","closeReadPassages"].map((name) => {
    const values = list(name);
    if (values.some((id) => !validId(id))) error();
    return [name,values];
  }));
  return {last:validId(reading.last) ? reading.last : "",marks:checkedMarks,choices:checkedChoices,
    ratings:pairs("ratings",(key,rating) => text(key) && Object.hasOwn(schedule,rating)),
    dueDates:pairs("dueDates",(key,date) => text(key) && Number.isFinite(date)),...progress};
}

function restoreReadingBackup(raw) {
  const incoming = decodeReadingBackup(raw);
  const current = readingSnapshot();
  const restored = {};
  for (const name of ["marks","ratings","dueDates","choices"]) {
    const values = new Map(incoming[name]);
    for (const [key,value] of current[name]) {
      if (name === "marks") values.delete(key);
      values.set(key,name === "choices" ? {...values.get(key),...value} : value);
    }
    restored[name] = [...values];
  }
  for (const name of ["finished","startedPassages","closeReadPassages"]) {
    restored[name] = [...new Set([...incoming[name],...current[name]])];
  }
  const hasCurrentProgress = current.startedPassages.length || current.marks.length || current.choices.length;
  restored.last = hasCurrentProgress || !getMaterial(incoming.last) ? current.last : incoming.last;
  localStorage.setItem(readingStorage,JSON.stringify(restored));
  for (const [name,collection] of Object.entries({marks,ratings,dueDates,choices})) {
    collection.clear();
    for (const [key,value] of restored[name]) collection.set(key,value);
  }
  for (const [name,collection] of Object.entries({finished,startedPassages,closeReadPassages})) {
    collection.clear();
    for (const key of restored[name]) collection.add(key);
  }
  renderMaterial(restored.last);
  renderLibrary();
  refreshAnchorButton();
}

function downloadBackup() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(backupSnapshot())],{type:"application/json"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "句读学习记录-" + new Date().toISOString().slice(0,10) + ".json";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),60000);
}

async function copyImportPrompt() {
  try {
    await navigator.clipboard.writeText(importPrompt);
    importStatus("已复制提示词。把它和照片、PDF 或讲义一起发给网页端 GPT。");
  } catch {
    get("prompt-text").value = importPrompt;
    get("prompt-dialog").showModal();
    get("prompt-text").focus();
    get("prompt-text").select();
  }
}
