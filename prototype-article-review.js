"use strict";

const reviewWordGroups = [
  [["adapt","动词","适应；改编","change to suit a new situation"],
   ["adopt","动词","采纳；收养","start using something or take a child into your family"],
   ["adept","形容词","熟练的","skilled at doing something"],
   ["adjust","动词","调整","change something slightly"]],
  [["affect","动词","影响","have an effect on something"],
   ["effect","名词","结果；效果","a result produced by an action"],
   ["infect","动词","感染","spread a disease to someone or something"],
   ["defect","名词","缺陷","a fault that makes something imperfect"]],
  [["accept","动词","接受","agree to take or receive something"],
   ["except","介词","除……之外","leaving someone or something out"],
   ["expect","动词","预料；期待","think that something is likely to happen"],
   ["aspect","名词","方面","one part or feature of a situation"]],
  [["access","名词","进入或使用的机会","the right or chance to use or enter something"],
   ["assess","动词","评估","judge the quality, value or amount of something"],
   ["excess","名词","过量","an amount beyond what is needed"],
   ["success","名词","成功","the achievement of a goal"]],
  [["career","名词","职业生涯","the course of someone's working life"],
   ["carrier","名词","运送者；载体","someone or something that carries people or things"],
   ["care","名词","照料；关心","attention given to keep someone or something well"],
   ["carer","名词","照护者","someone who looks after a person needing help"]],
  [["pension","名词","养老金","money paid regularly after retirement"],
   ["passion","名词","强烈的热爱","a very strong feeling or interest"],
   ["tension","名词","紧张；张力","a state of strain or unease"],
   ["portion","名词","一部分；一份","a part or share of something"]],
  [["occupation","名词","职业","the work that someone does"],
   ["occasion","名词","场合；时机","a particular time or event"],
   ["operation","名词","运作；手术","the way something works, or a surgical procedure"],
   ["obligation","名词","义务","something that someone is required to do"]],
  [["economic","形容词","经济的","relating to the economy"],
   ["economical","形容词","节约的","using money or resources without waste"],
   ["economist","名词","经济学家","a specialist in economics"],
   ["economics","名词","经济学","the study of how goods and resources are used"]],
  [["personal","形容词","个人的","belonging to or concerning one individual"],
   ["personnel","名词","全体员工","the people employed by an organization"],
   ["physical","形容词","身体的；物理的","relating to the body or to material things"],
   ["physician","名词","医生","a doctor trained to treat illness"]],
  [["retirement","名词","退休","the period or act of leaving working life"],
   ["requirement","名词","要求；必备条件","something that is needed or demanded"],
   ["recruitment","名词","招聘；招募","the process of finding people to join an organization"],
   ["refinement","名词","改进；提纯","an improvement or the removal of impurities"]],
  [["isolation","名词","隔离；孤立","the state of being separated from others"],
   ["insulation","名词","隔热；绝缘","protection against heat loss, sound or electricity"],
   ["installation","名词","安装","the process of putting equipment in place"],
   ["illustration","名词","插图；例证","a picture or example that explains something"]],
  [["principal","形容词","主要的","most important"],
   ["principle","名词","原则","a basic rule or belief"],
   ["practical","形容词","实用的","useful in real situations"],
   ["potential","形容词","潜在的","possible but not yet actual"]],
  [["compliment","名词","赞美","a remark expressing admiration or praise"],
   ["complement","动词","补充；衬托","combine well with something to make it better"],
   ["complaint","名词","抱怨；投诉","a statement that something is wrong or unsatisfactory"],
   ["component","名词","组成部分","one part of a larger whole"]],
  [["conscious","形容词","有意识的；清醒的","awake or aware of what is happening"],
   ["conscience","名词","良知","the sense of right and wrong"],
   ["cautious","形容词","谨慎的","careful to avoid risks"],
   ["curious","形容词","好奇的","eager to know or learn something"]],
  [["tend","动词","往往；倾向于","be likely to do something"],
   ["trend","名词","趋势","a general direction of change"],
   ["tender","形容词","柔嫩的；温柔的","soft or gentle"],
   ["attend","动词","出席","go to an event or place"]],
  [["vary","动词","变化；有差异","change or be different in different situations"],
   ["very","副词","非常","to a high degree"],
   ["verify","动词","核实","check that something is true or accurate"],
   ["vast","形容词","广阔的","extremely large in size or amount"]],
  [["quit","动词","辞职；停止","leave a job or stop doing something"],
   ["quite","副词","相当；完全","fairly or completely, depending on context"],
   ["quiet","形容词","安静的","making little or no noise"],
   ["quote","动词","引用","repeat someone else's words"]],
  [["desert","名词","沙漠","a very dry area of land"],
   ["dessert","名词","甜点","sweet food eaten after a meal"],
   ["deserve","动词","值得；应得","be worthy of a particular result or treatment"],
   ["desire","名词","渴望","a strong wish for something"]],
  [["later","副词","随后","at a time after the present or one already mentioned"],
   ["latter","形容词","后者的；后半的","relating to the second of two things or the later part"],
   ["latest","形容词","最新的","most recent"],
   ["least","副词","最少地","to the smallest degree"]],
  [["stationary","形容词","静止的","staying in one place without moving"],
   ["stationery","名词","文具","paper and other materials for writing"],
   ["stability","名词","稳定性","the quality of remaining steady"],
   ["strategy","名词","策略","a plan for achieving a goal"]],
  [["organism","名词","生物体","an individual living thing"],
   ["organ","名词","器官","a part of the body that has a particular function"],
   ["organic","形容词","有机的","relating to living things or compounds containing carbon"],
   ["organization","名词","组织；机构","a group of people working toward a shared purpose"]],
  [["effective","形容词","有效的","producing the result that was intended"],
   ["efficient","形容词","高效的","working well without wasting time or resources"],
   ["affective","形容词","情感的","relating to feelings or emotions"],
   ["defective","形容词","有缺陷的","having a fault that prevents proper function"]],
  [["sedative","名词","镇静剂","a drug that calms someone or makes them sleepy"],
   ["sedentary","形容词","久坐的","involving much sitting and little physical activity"],
   ["sensitive","形容词","敏感的","easily affected or quick to notice changes"],
   ["sensible","形容词","明智的","showing good judgment"]],
  [["prescribe","动词","开处方","officially direct someone to use a medicine or treatment"],
   ["proscribe","动词","禁止","officially forbid something"],
   ["describe","动词","描述","say what someone or something is like"],
   ["subscribe","动词","订阅","arrange to receive something regularly"]],
  [["interfere","动词","干涉；干扰","get involved or get in the way of something"],
   ["infer","动词","推断","reach a conclusion based on evidence"],
   ["intervene","动词","介入","become involved in a situation to change what happens"],
   ["prefer","动词","更喜欢","like one thing more than another"]],
];

const curatedReviewWords = new Map(reviewWordGroups.flat().map(([head,pos,zh,en]) =>
  [head,{head,pos,zh,en}]));

function reviewParts(text) {
  return text.split(/[，,；;、／/]/).map((part) => part.replace(/[（(][^）)]*[）)]/g,"")
    .replace(/[^\p{L}\p{N}]/gu,"")).filter(Boolean);
}

function relatedReviewMeaning(a,b) {
  return reviewParts(a).some((left) => reviewParts(b).some((right) => left === right ||
    (Math.min(left.length,right.length) >= 2 && (left.includes(right) || right.includes(left)))));
}

function reviewPartOfSpeech(pos) {
  return (/副词|形容词|代词|数词|名词|动词|介词|连词/.exec(pos || "") || [pos || ""])[0];
}

function reviewFirstSense(item) {
  const [pos,zh,en] = item?.senses.find((sense) => /\p{Script=Han}/u.test(sense[1])) || [];
  return zh ? {head:item.head,pos,zh,en} : null;
}

function reviewDictionaryPool() {
  const pool = new Map(curatedReviewWords);
  for (const item of [...Object.values(dictionary.words),...customDictionary.values()]) {
    const sense = reviewFirstSense(item);
    if (sense?.en && /^[a-z]+$/i.test(sense.head) && !pool.has(norm(sense.head))) {
      pool.set(norm(sense.head),sense);
    }
  }
  // The source keeps its Chinese senses and English definitions in separate lists.
  // Use a source gloss as a bilingual option only when the pairing is unambiguous.
  for (const head of CET4_WORDS) {
    if (pool.has(head) || !Object.hasOwn(OFFLINE_DICTIONARY.entries,head)) continue;
    const [,senses,definitions] = OFFLINE_DICTIONARY.entries[head];
    if (senses.length !== 1 || definitions.length !== 1) continue;
    const [pos,zh] = senses[0], [englishPos,en] = definitions[0];
    if (reviewParts(zh).length === 1 && /\p{Script=Han}/u.test(zh) &&
        reviewPartOfSpeech(pos) === reviewPartOfSpeech(englishPos) && en.length <= 95) {
      pool.set(head,{head,pos,zh,en});
    }
  }
  return pool;
}

function spellingDistance(word,other) {
  let row = Array.from({length:other.length+1},(_,i) => i);
  for (const [i,letter] of [...word].entries()) {
    let previous = row[0];
    row[0] = i+1;
    for (let j=1; j<=other.length; j++) {
      const above = row[j];
      row[j] = Math.min(above+1,row[j-1]+1,previous+Number(letter !== other[j-1]));
      previous = above;
    }
  }
  return row[other.length];
}

function makeArticleReviewQuestion(target,pool) {
  const item = dictionaryEntry(target);
  const variants = item?.variants || [];
  const inflection = variants.length === 1 && /复数|过去|现在分词|第三人称|比较级|最高级/.test(variants[0].type) ?
    variants[0] : null;
  const head = norm(inflection?.head || item?.head || target.text);
  const ordinary = curatedReviewWords.get(head) || reviewFirstSense(item);
  const context = target.entry?.meaning;
  const correct = context && /\p{Script=Han}/u.test(context) ?
    {head:target.entry.head || head,zh:context,pos:target.entry.pos || ordinary?.pos,
      en:ordinary && relatedReviewMeaning(context,ordinary.zh) ? ordinary.en : ""} : ordinary;
  if (!correct) return null;
  const knownMeanings = [context,correct.zh,...(item?.senses || []).map(([,zh]) => zh)].filter(Boolean);
  const roots = new Set([norm(target.text),head,norm(correct.head),...variants.map((entry) => norm(entry.head))]);
  const family = new Set(familyLinks(head).map(([related]) => related));
  const linked = new Set(reviewWordGroups.filter((group) => group.some(([word]) => roots.has(word)))
    .flatMap((group) => group.map(([word]) => word)));
  for (const [a,b] of Object.entries(confusableWords)) {
    if (roots.has(a)) linked.add(b);
    if (roots.has(b)) linked.add(a);
  }
  const word = /^[a-z]+$/.test(head) ? head : "";
  const pos = reviewPartOfSpeech(correct.pos);
  const candidates = [];
  for (const [form,entry] of pool) {
    if (roots.has(form) || (!linked.has(form) && family.has(form)) ||
        knownMeanings.some((zh) => relatedReviewMeaning(zh,entry.zh))) continue;
    const samePos = Boolean(pos && reviewPartOfSpeech(entry.pos) === pos);
    const distance = word && Math.abs(word.length-form.length) <= 2 ? spellingDistance(word,form) : Infinity;
    const similar = distance <= (word.length >= 7 ? 3 : 2) && word.length >= 4 &&
      (word.slice(0,2) === form.slice(0,2) || word.slice(-2) === form.slice(-2) || distance <= 1);
    const score = (linked.has(form) ? 100 : 0) + (similar ? 32-distance*5 : 0) +
      (samePos ? 6 : 0) + (CET4_WORDS.has(form) ? 2 : 0) + Math.random();
    candidates.push({entry,score});
  }
  candidates.sort((a,b) => b.score-a.score);
  const options = [{...correct,correct:true}];
  for (const {entry} of candidates) {
    if (options.some((option) => relatedReviewMeaning(option.zh,entry.zh))) continue;
    options.push(entry);
    if (options.length === 4) return {target,options:shuffle(options)};
  }
  return null;
}

const articleReviewSettingsKey = "judu-reader.article-review";
function readReviewSeconds(value,fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 120 ? number : fallback;
}

function createArticleReview() {
  const reader = get("reader"), inspector = get("inspector"), workspace = get("workspace");
  const panel = get("article-review"), body = get("article-review-body"), controls = get("article-review-settings");
  const answerInput = get("review-answer-seconds"), feedbackInput = get("review-feedback-seconds");
  const orderInput = get("article-review-order");
  const time = get("article-review-seconds"), meter = get("article-review-meter");
  const saved = readLocal(articleReviewSettingsKey,{}) || {};
  const options = {answer:readReviewSeconds(saved.answer,5),feedback:readReviewSeconds(saved.feedback,3),
    order:saved.order === "shuffle" ? "shuffle" : "source"};
  answerInput.value = options.answer;
  feedbackInput.value = options.feedback;
  orderInput.value = options.order;
  let session = null, highlighted = [], timer = 0, remaining = 0, deadline = null;

  function saveOptions() {
    options.answer = readReviewSeconds(answerInput.value,options.answer);
    options.feedback = readReviewSeconds(feedbackInput.value,options.feedback);
    options.order = orderInput.value === "shuffle" ? "shuffle" : "source";
    try { localStorage.setItem(articleReviewSettingsKey,JSON.stringify(options)); } catch {}
  }

  function timeLabel(value,paused) {
    const phase = session?.phase;
    const caption = phase === "answer" ? "作答" : "反馈";
    const text = caption + (paused ? "已暂停" : " " + Math.ceil(value/1000) + " 秒");
    if (time.textContent !== text) time.textContent = text;
    meter.value = value;
  }

  function suspendTimer() {
    clearTimeout(timer);
    timer = 0;
    if (deadline === null) return;
    remaining = Math.max(0,deadline-performance.now());
    deadline = null;
  }

  function syncTimer() {
    if (!session || !["answer","feedback"].includes(session.phase)) return;
    clearTimeout(timer);
    timer = 0;
    const paused = document.hidden || controls.open || get("idle-dialog").open;
    if (paused) {
      suspendTimer();
      timeLabel(remaining,true);
      return;
    }
    const now = performance.now();
    deadline ??= now+remaining;
    const left = Math.max(0,deadline-now);
    timeLabel(left,false);
    if (left <= 0) {
      deadline = null;
      if (session.phase === "answer") submit("timeout");
      else nextQuestion();
      return;
    }
    const nextSecond = left-(Math.ceil(left/1000)-1)*1000;
    timer = setTimeout(syncTimer,Math.max(8,nextSecond));
  }

  function setBudget(seconds) {
    suspendTimer();
    remaining = seconds*1000;
    meter.max = remaining;
    meter.hidden = time.hidden = false;
    syncTimer();
  }

  function clearHighlight() {
    for (const node of highlighted) node.classList.remove("article-review-highlight");
    highlighted = [];
  }

  function align() {
    const word = highlighted[0];
    if (!word) return;
    const spot = word.getBoundingClientRect().top-reader.getBoundingClientRect().top;
    reader.scrollTop += spot-Math.min(215,reader.clientHeight*.33);
  }

  function highlight(target) {
    clearHighlight();
    for (let index=target.start; index<=target.end; index++) {
      const word = bySentencePosition.get(target.sentence+":"+index);
      if (!word) continue;
      word.classList.add("article-review-highlight");
      highlighted.push(word);
    }
    align();
  }

  function shownQuestion() { return session.queue[session.index]; }

  function nextQuestion() {
    suspendTimer();
    session.index++;
    if (session.index >= session.queue.length) {
      session.phase = "complete";
      panel.dataset.phase = session.phase;
      time.hidden = meter.hidden = true;
      get("article-review-progress").textContent = "";
      clearHighlight();
      body.innerHTML = '<h2 tabindex="-1">本轮复习完成</h2><p>' + session.queue.length +
        ' 个词 · 答对 ' + session.correct + ' · 待巩固 ' + (session.queue.length-session.correct) + '</p>' +
        '<button type="button" class="primary" data-article-review-action="exit">回到刚才的位置</button>';
      body.querySelector("h2").focus({preventScroll:true});
      return;
    }
    session.phase = "answer";
    session.feedbackSeconds = options.feedback;
    panel.dataset.phase = session.phase;
    get("article-review-progress").textContent = (session.index+1) + " / " + session.queue.length;
    const question = shownQuestion();
    const choice = (item,index) => '<button type="button" class="article-review-option" data-answer-choice="' + index +
      '">' + esc(item.zh) + '</button>';
    body.innerHTML = '<h2 lang="en" tabindex="-1">' + esc(question.target.text) + '</h2>' +
      '<div class="article-review-options">' + question.options.map(choice).join("") +
      '<button type="button" class="article-review-option article-review-forgot" data-answer-choice="forgot">记不起来</button></div>';
    inspector.scrollTop = 0;
    highlight(question.target);
    body.querySelector("h2").focus({preventScroll:true});
    setBudget(options.answer);
  }

  function submit(choice) {
    if (session?.phase !== "answer") return;
    if (deadline !== null && performance.now() >= deadline) choice = "timeout";
    suspendTimer();
    const question = shownQuestion();
    const selected = question.options[Number(choice)];
    const correct = selected?.correct === true;
    const key = question.target.cardKey;
    session.correct += Number(correct);
    ratings.set(key,correct ? "remembered" : "again");
    if (correct) dueDates.set(key,nextDue(schedule.remembered.days));
    else dueDates.delete(key);
    postponed.delete(key);
    previouslyRetried.delete(key);
    markState();
    saveReading();
    session.phase = "feedback";
    panel.dataset.phase = session.phase;
    const feedback = question.options.map((item,index) => {
      const picked = index === Number(choice);
      const status = item.correct ? "correct" : picked ? "miss" : "";
      const label = item.correct ? "正确释义" : picked ? "你选了" : "";
      return '<li data-result="' + status + '"><div><span>' + esc(item.zh) + '</span>' +
        (label ? '<strong>' + label + '</strong>' : '') + '</div><b lang="en">' + esc(item.head) + '</b>' +
        (item.en ? '<span class="article-review-gloss" lang="en">' + esc(item.en) + '</span>' : '') + '</li>';
    });
    const correctIndex = question.options.findIndex((item) => item.correct);
    feedback.unshift(...feedback.splice(correctIndex,1));
    const summary = correct ? "答对了" : choice === "timeout" ? "时间到 · 已记为「记不起来」" :
      choice === "forgot" ? "已记为「记不起来」" : "看一下这两个词各自的意思";
    body.innerHTML = '<h2 lang="en" tabindex="-1">' + esc(question.target.text) + '</h2><p class="article-review-result" role="status">' +
      summary + '</p><ul class="article-review-feedback">' + feedback.join("") + '</ul>';
    inspector.scrollTop = 0;
    body.querySelector("h2").focus({preventScroll:true});
    smoothIn(body,{distance:3,duration:145});
    setBudget(session.feedbackSeconds);
  }

  function start() {
    if (session?.phase !== "setup" || !session.questions.length) return;
    saveOptions();
    controls.open = false;
    session.queue = options.order === "shuffle" ? shuffle(session.questions) : session.questions;
    if (options.order === "shuffle" && session.queue.length > 1 &&
        session.queue.every((question,index) => question === session.questions[index])) {
      session.queue.push(session.queue.shift());
    }
    session.index = -1;
    session.correct = 0;
    orderInput.disabled = true;
    nextQuestion();
  }

  function open() {
    if (session) return;
    flushReadingPosition(true);
    suspendReadingTracking();
    closePeek(true,true);
    selectParagraph(null);
    setAppearanceOpen(false);
    const positions = new Map([...bySentencePosition.keys()].map((key,index) => [key,index]));
    const indexFor = (target) => positions.get(target.sentence+":"+target.start);
    const marksInOrder = markedInMaterial().filter((target) => indexFor(target) !== undefined)
      .sort((a,b) => indexFor(a)-indexFor(b));
    const targets = groupCards(marksInOrder).map((card) => card.target);
    const pool = targets.length ? reviewDictionaryPool() : null;
    const questions = targets.map((target) => makeArticleReviewQuestion(target,pool)).filter(Boolean);
    session = {phase:"setup",questions,readerScroll:reader.scrollTop,inspectorScroll:inspector.scrollTop,
      line:visibleReadingLine() || captureLine(reader,bySentencePosition.values())};
    workspace.dataset.articleReview = "";
    inspector.setAttribute("aria-label","篇内复习");
    panel.dataset.phase = session.phase;
    get("inspector-reading").hidden = true;
    panel.hidden = false;
    get("review-tab").setAttribute("aria-expanded","true");
    get("article-review-progress").textContent = "";
    time.hidden = meter.hidden = true;
    controls.open = false;
    orderInput.disabled = false;
    inspector.scrollTop = 0;
    const skipped = targets.length-questions.length;
    body.innerHTML = '<h2 tabindex="-1">' + (questions.length ? "回想刚标记的词" :
      targets.length ? "本篇暂时没有可出题的词" : "先在这篇贴一个词") + '</h2>' +
      (questions.length ? '<p>本篇有 ' + questions.length + ' 个词可复习。</p><button type="button" class="primary" ' +
        'data-article-review-action="start">开始复习</button>' : !targets.length ?
        '<p>双击原文单词，或在查词后点「贴上标记」。</p>' : '') +
      (skipped ? '<p class="muted article-review-skipped">' + skipped + ' 个标记暂时缺少可用释义，可到「全部生词」查看。</p>' : '');
    body.querySelector("h2").focus({preventScroll:true});
    smoothIn(panel,{distance:8,opacity:.64,duration:235});
  }

  function close(restoreFocus = false) {
    if (!session) return false;
    stopEffect(panel);
    stopEffect(body);
    suspendTimer();
    clearHighlight();
    const {readerScroll,inspectorScroll,line} = session;
    session = null;
    suspendReadingTracking();
    delete workspace.dataset.articleReview;
    inspector.setAttribute("aria-label","详细解释");
    panel.hidden = true;
    get("inspector-reading").hidden = false;
    get("review-tab").setAttribute("aria-expanded","false");
    reader.scrollTop = readerScroll;
    if (readerScroll > 0) restoreCapturedLine(line);
    if (activeLookup) renderLookup();
    inspector.scrollTop = inspectorScroll;
    if (restoreFocus) get("review-tab").focus({preventScroll:true});
    return true;
  }

  controls.addEventListener("toggle",syncTimer);
  controls.addEventListener("input",saveOptions);
  controls.addEventListener("change",(event) => {
    saveOptions();
    if (event.target === answerInput) answerInput.value = options.answer;
    if (event.target === feedbackInput) feedbackInput.value = options.feedback;
  });
  controls.querySelector("summary").addEventListener("click",(event) => event.stopPropagation());
  panel.addEventListener("click",(event) => {
    const action = event.target.closest("[data-article-review-action]")?.dataset.articleReviewAction;
    if (action === "start") start();
    if (action === "exit") close(true);
    if (action === "all") showPage("review");
    const selected = event.target.closest("[data-answer-choice]");
    if (selected && session?.phase === "answer" && !controls.open) submit(selected.dataset.answerChoice);
  });
  panel.addEventListener("keydown",(event) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    if (controls.open) {
      controls.open = false;
      controls.querySelector("summary").focus({preventScroll:true});
    } else close(true);
  });
  for (const type of ["click","dblclick","keydown"]) {
    reader.addEventListener(type,(event) => {
      if (!session || (type === "keydown" && !event.target.closest("button, input, select, a, .sentence"))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
  }
  document.addEventListener("visibilitychange",syncTimer);
  return {open,close,syncTimer,align,active:() => Boolean(session)};
}
