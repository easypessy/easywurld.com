/**
 * LinkedIn layer — four posts a day on the Easywurld company page, three a day on
 * Abu Israel's personal profile. 210 posts across the 30-day run.
 *
 * Everything here is written for READING, not repurposed from a TikTok caption.
 * The two accounts never post the same text on the same day: the company page
 * teaches and shows in brand voice, the personal profile thinks out loud in the
 * first person. Both siphon from the same eleven daily posts, but from different
 * source slots and at different angles, so a reader who follows both still gets
 * seven distinct things.
 *
 * Honesty rules are enforced in code, not left to the writer:
 *   - no invented clients, revenue figures or results (personal posts are
 *     observation and build log, never case study);
 *   - the ₦5,000 DIY pack keeps its boundary line in every offer mention;
 *   - trend material keeps its "dated teardown" wording;
 *   - the destination link never appears in the body, only in `firstComment`.
 */

const PRICE_LINE = '₦5,000 DIY pack. Not custom work, no results guaranteed.';

/* ---------- small helpers (kept local so this module has no imports) ---------- */
const P = s => String(s ?? '').trim();
const trimPeriod = s => String(s ?? '').replace(/\.+$/, '');
const first = s => P(s).split('\n')[0];
const sentences = s => P(s).split(/(?<=[.!?])\s+/).filter(Boolean);
const lowerFirst = s => (s ? s[0].toLowerCase() + s.slice(1) : s);
const bullets = arr => arr.map(a => '→ ' + trimPeriod(a)).join('\n');
const numbered = arr => arr.map((a, i) => `${i + 1}. ${trimPeriod(a)}`).join('\n');
/** Deterministic pick so the same day always renders the same post. */
const pick = (arr, ...seeds) => arr[seeds.reduce((a, b) => a + b, 0) % arr.length];
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : s);

/* Split a long LinkedIn body into the "see more" shape: a short visible head,
   then the rest. LinkedIn truncates around 210 characters on mobile. */
function splitForLinkedIn(body) {
  const lines = body.split('\n');
  let head = [];
  let n = 0;
  while (lines.length && n < 200) { head.push(lines.shift()); n += head[head.length - 1].length + 2; }
  return { head: head.join('\n').trim(), rest: lines.join('\n').trim() };
}

/* ---------------- rotating openers, so day 9 does not read like day 2 ---------------- */
const CO_OPEN = {
  doc: [
    d => `A ${d.niche} account in Lagos does not need more ideas. It needs three it can actually shoot this week.`,
    d => `${d.expert} said it first: ${lowerFirst(d.principle)}. Here is what that looks like on a Nigerian small-business page.`,
    d => `Five pages. One week of posting for a ${d.niche} business. Steal the structure, not the words.`,
    d => `Most ${d.niche} pages post the finished work and nothing else. That is the whole problem.`,
    d => `The principle is old. The example is ours. ${d.expert}: ${lowerFirst(d.principle)}.`,
    d => `If your page has gone quiet, it is rarely a lack of talent. It is a lack of a repeatable post.`,
  ],
  myth: [
    d => `Marketing myth: ${d.claim}`,
    d => `Someone will tell you this week: "${d.claim}" Here is the verdict.`,
    d => `${d.claim} We put it on trial.`,
    d => `Absolute advice is expensive. Take this one: "${d.claim}"`,
  ],
  image: [
    d => `This is the part nobody posts about.`,
    d => `One picture, one lesson. Read the second line twice.`,
    d => `You have felt this week. That is why it is here.`,
    d => `Small-business life, photographed honestly.`,
  ],
  video: [
    d => `Forty seconds. One workflow you can copy today.`,
    d => `Watch this before you answer your next "how much?"`,
    d => `Short version of a long lesson.`,
  ],
};

const AB_OPEN = {
  build: [
    d => `I am building Easywurld in public, and today's decision was ${lowerFirst(d.topic)}.`,
    d => `Three hours on ${lowerFirst(d.topic)} today. Here is what I got wrong first.`,
    d => `I keep a rule for this studio: nothing goes out that a person has not checked.`,
    d => `Building a small studio in Lagos means the boring decisions matter most.`,
    d => `Today I chose the slower option. Let me explain why.`,
  ],
  note: [
    d => `Something I keep seeing in Nigerian small businesses: ${lowerFirst(d.line)}.`,
    d => `I have read enough "how much?" chats to know one thing.`,
    d => `Not a hot take. Just a pattern I cannot unsee.`,
    d => `The businesses that survive this year are not the loudest.`,
  ],
  take: [
    d => `Evening thought. ${d.opinion}`,
    d => `Somebody will disagree with this, and that is fine.`,
    d => `I changed my mind about this last month.`,
    d => `A question I asked five business owners this week.`,
  ],
};

/* ---------------- source extraction ---------------- */
function factsFrom(src, day) {
  const slides = src.slides || [];
  return {
    id: src.id, slot: src.slot, seriesKey: src.seriesKey, topic: src.topic,
    hook: src.hook, cta: src.cta, pillar: src.pillar, script: src.script || '',
    slides, staticCopy: src.staticCopy || '', meme: src.meme || null,
    asset: src.asset || '', route: src.route || '/about',
    offerName: src.offerName || '', offerKeyword: src.offerKeyword || '',
    format: src.format, psych: src.psych || null,
    // niche
    niche: (day.niche && day.niche.niche) || 'small business',
    nicheIdeas: (day.niche && day.niche.ideas) || [],
    nicheMistake: (day.niche && day.niche.mistake) || '',
    nicheFirst: (day.niche && day.niche.first) || '',
    // copy move
    expert: (day.copy && day.copy.expert) || 'the old masters',
    principle: (day.copy && day.copy.principle) || 'research before writing',
    steal: (day.copy && day.copy.steal) || '',
    example: (day.copy && day.copy.example) || '',
    copySource: (day.copy && day.copy.source) || '',
    // myth
    claim: (day.myth && day.myth.claim) || '',
    verdict: (day.myth && day.myth.verdict) || '',
    why: (day.myth && day.myth.why) || '',
    test: (day.myth && day.myth.test) || '',
    // ai workflow
    workflow: (day.ai && day.ai.workflow) || '',
    aiInput: (day.ai && day.ai.input) || '',
    aiDraft: (day.ai && day.ai.draft) || '',
    aiCheck: (day.ai && day.ai.check) || '',
    aiOutput: (day.ai && day.ai.output) || '',
    demoPath: (day.ai && day.ai.demoPath) || '',
    // offer
    offerAngle: (day.offerA && day.offerA.angle) || '',
    objection: (day.offerB && day.offerB.objection) || '',
    objectionAnswer: (day.offerB && day.offerB.answer) || '',
    // operator
    opTopic: (day.operator && day.operator.topic) || '',
    opLine: (day.operator && day.operator.line) || '',
    opTurn: (day.operator && day.operator.turn) || '',
    opClose: (day.operator && day.operator.close) || '',
    opCta: (day.operator && day.operator.cta) || '',
    // intro
    introAngle: (day.intro && day.intro.angle) || '',
    introBody: (day.intro && day.intro.body) || [],
    // poll
    opinion: ((day.offerA && day.offerA.angle) || (day.offerB && day.offerB.objection) || (day.copy && day.copy.principle) || (day.operator && day.operator.line)) || '',
    pollQuestion: (day.storyA && day.storyA.question) || '',
    pollOptions: (day.storyA && day.storyA.options) || [],
    pollAnswer: (day.storyA && day.storyA.answer) || '',
  };
}

/* ---------------- company page copy ---------------- */
function companyDocBody(f, opener) {
  if (f.seriesKey === 'copy') {
    return [
      opener,
      '',
      `The move: ${f.principle}.`,
      '',
      P(f.steal),
      '',
      'What that looks like on a Nigerian page:',
      '',
      P(f.example).replace(/^Original Easywurld example:\s*/i, '').replace(/Before:\s*/i, 'Before: ').replace(/\s*After:\s*/i, '\nAfter:  '),
      '',
      'The part most people skip: do not steal the words. Steal the structure, then write your own example from your own customer.',
      '',
      `Source: ${f.copySource}. Attributed, not quoted at length.`,
      '',
      'The five pages are attached as a document. Page one is the cover LinkedIn shows on mobile.',
    ].join('\n');
  }
  return [
    opener,
    '',
    `Three posts I would test this week for a ${f.niche} business:`,
    '',
    numbered(f.nicheIdeas),
    '',
    `The mistake to avoid: ${trimPeriod(f.nicheMistake)}.`,
    '',
    `First action: ${f.nicheFirst}`,
    '',
    'Why this works: a page that only shows finished work gives a new customer nothing to save and nothing to ask about. Process is what earns the message.',
    '',
    'This is a planning example, not a claim that Easywurld manages this account.',
    '',
    'The five pages are attached as a document. Page one is the cover LinkedIn shows on mobile.',
  ].join('\n');
}

function companyDocPages(f) {
  if (f.seriesKey === 'copy') {
    return [
      { kicker: 'Steal this copy move', title: `${f.expert}: ${f.principle}`, body: 'Attributed, then rebuilt with an original Easywurld example.' },
      { kicker: 'The principle', title: trimPeriod(f.steal), body: `Source: ${f.copySource}.` },
      { kicker: 'Before', title: P(f.example).split('After:')[0].replace(/^Original Easywurld example:\s*/i, '').replace(/^Before:\s*/i, ''), body: 'Vague, category-level, forgettable.' },
      { kicker: 'After', title: P(f.example).split('After:')[1] || '', body: 'Named customer, named situation, named next step.' },
      { kicker: 'Your turn', title: 'Rewrite one headline today', body: 'Steal the structure, not the words. Then write your own example from your own customer.' },
    ];
  }
  return [
    { kicker: `If I ran a ${f.niche} account in Lagos`, title: 'Three posts I would test this week', body: 'Planning example, not a claim that we manage this account.' },
    ...f.nicheIdeas.slice(0, 3).map((idea, i) => ({ kicker: `Post ${i + 1}`, title: cap(trimPeriod(idea)), body: ['Shows the decision, not just the result.', 'Gives a customer something worth saving.', 'Answers the question they were going to ask anyway.'][i] })),
    { kicker: 'Avoid', title: trimPeriod(`One mistake: ${f.nicheMistake}`), body: `First action: ${f.nicheFirst}` },
  ];
}

function companyMythBody(f, opener) {
  return [
    opener,
    '',
    `Verdict: ${f.verdict}`,
    '',
    P(f.why),
    '',
    'How we would test it:',
    trimPeriod(f.test),
    '',
    'Keep the useful part. Drop the absolute.',
    '',
    'That is the whole method: one claim, one verdict, one test small enough to run this week.',
  ].join('\n');
}

function companyImageBody(f, opener) {
  if (f.meme) {
    return [
      opener,
      '',
      `${f.meme.line}`,
      `${f.meme.sub}`,
      '',
      'Two things worth changing this week:',
      '1. Write the next step into the offer, not only the caption.',
      '2. Put the price, the contents and the boundary in the same message.',
      '',
      'No thread. No funnel. Just the next step made obvious.',
    ].join('\n');
  }
  return [
    opener,
    '',
    ...f.introBody.map(b => P(b)),
    '',
    'If your message, your website and your follow-up disagree, the customer feels it before they can name it.',
    '',
    'Which of the four is weakest in your business right now?',
  ].join('\n');
}

function companyVideoBody(f, opener) {
  if (f.seriesKey === 'myth') return [opener, '', `Myth: ${f.claim}`, `Verdict: ${f.verdict}`, '', trimPeriod(f.why), '', `The test: ${trimPeriod(f.test)}`, '', 'Keep the useful part. Drop the absolute.'].join('\n');
  if (f.seriesKey === 'ai') return [opener, '', `Workflow: ${f.workflow}.`, '', bullets([`Input: ${f.aiInput}`, `AI drafts: ${f.aiDraft}`, `A person checks: ${f.aiCheck}`, `Output: ${f.aiOutput}`]), '', 'Nothing is sent automatically. The human check is the feature.', '', 'Labelled concept project · sample build. No live client result is claimed.'].join('\n');
  if (f.seriesKey === 'trend') return [opener, '', P(f.script.split('The business adaptation:')[1] ? f.script.split('The business adaptation:')[1].split('Before posting')[0] : f.hook), '', 'Dated teardown, not a live trend claim. Verify a current example and the audio rights before you post it.', '', 'Save the filter, not the hype.'].join('\n');
  if (f.seriesKey === 'offerB') return [opener, '', `${f.objection}`, `${f.objectionAnswer}`, '', `${f.offerName} — ${PRICE_LINE}`, '', 'Message the keyword on WhatsApp to confirm current order details.'].join('\n');
  return [opener, '', ...sentences(f.script).slice(0, 6), '', P(f.cta)].join('\n');
}

/* ---------------- personal profile copy (Abu Israel) ---------------- */
function personalBuildBody(f, opener, day) {
  if (f.seriesKey === 'ai') {
    return [
      opener,
      '',
      `What I am testing in the studio this week: ${lowerFirst(trimPeriod(f.workflow))}.`,
      '',
      bullets([`Input: ${f.aiInput}`, `The draft: ${f.aiDraft}`, `I check: ${f.aiCheck}`, `Only then: ${f.aiOutput}`]),
      '',
      'The part I will not automate is the check. A machine can write a reply. It should not be allowed to promise a price, a date or a result on my behalf.',
      '',
      'That boundary is the product. Everything else is convenience.',
      '',
      'Labelled concept work — a sample build, not a client result.',
      '',
      'Where would you keep a human in the loop in your own business?',
    ].join('\n');
  }
  return [
    opener,
    '',
    ...f.introBody.slice(0, 4).map(b => P(b)),
    '',
    'What I have learned building it: the work is rarely the hard part. The hard part is making the message, the website, the content and the follow-up say the same thing.',
    '',
    'When they disagree, the customer does not argue. They just go quiet.',
    '',
    'So I am posting the process here, including the parts that are still unfinished. No wahala — that is the point of building in public.',
    '',
    'What is the one thing in your business that keeps disagreeing with itself?',
  ].join('\n');
}

function personalNoteBody(f, opener) {
  if (f.seriesKey === 'operator') {
    return [
      opener,
      '',
      P(f.opLine),
      '',
      P(f.opTurn),
      '',
      P(f.opClose),
      '',
      'I am not saying this to sound clever. I have watched good businesses lose a sale in one chat because the reply was a bare number with no next step.',
      '',
      'If you sell by WhatsApp or DM, that reply is your shop counter.',
      '',
      'Save it for the next time somebody asks "how much?".',
    ].join('\n');
  }
  return [
    opener,
    '',
    `Myth I keep hearing: "${f.claim}"`,
    '',
    `My verdict after running it: ${lowerFirst(trimPeriod(f.verdict))}.`,
    '',
    P(f.why),
    '',
    'What I would actually do: ' + lowerFirst(trimPeriod(f.test)),
    '',
    'I am not against posting often. I am against posting often with nothing to say.',
    '',
    'Which piece of advice has cost your business the most time?',
  ].join('\n');
}

function personalTakeBody(f, opener) {
  if (f.seriesKey === 'offerA' || f.seriesKey === 'offerB') {
    const isA = f.seriesKey === 'offerA';
    return [
      opener,
      '',
      isA ? P(f.offerAngle) : `${f.objection} ${f.objectionAnswer}`,
      '',
      `This is why ${f.offerName} exists as a ${'₦5,000'} DIY pack: most owners do not need an agency this month. They need the scripts, the tracker and the routine, and they need it before Friday.`,
      '',
      'I am deliberate about the boundary. It is not custom work. It does not guarantee sales. It helps you convert more of the enquiries you already get.',
      '',
      'Saying the limit out loud has cost me nothing and saved a lot of awkward conversations.',
      '',
      isA ? 'What does your price reply say after the number?' : 'What is the question customers ask you that you dread answering?',
    ].join('\n');
  }
  return [
    opener,
    '',
    `The move: ${lowerFirst(trimPeriod(f.principle))}.`,
    '',
    P(f.steal),
    '',
    'My own version, written for a Lagos customer:',
    P(f.example).replace(/^Original Easywurld example:\s*/i, ''),
    '',
    `I am borrowing the structure from ${f.expert}, not the words. Credit where it is due: ${f.copySource}.`,
    '',
    'Oya — pick one headline on your page and rewrite it tonight. That is the whole homework.',
    '',
    'Paste your before and after in the comments if you want a second pair of eyes.',
  ].join('\n');
}

function personalDocPages(f) {
  return [
    { kicker: 'Build log · Easywurld', title: trimPeriod(f.topic.replace(/^AI Build:\s*/i, '').replace(/^Meet Easywurld:\s*/i, '')), body: 'What I am making this week, and the decision behind it.' },
    { kicker: 'The decision', title: f.seriesKey === 'ai' ? trimPeriod(f.workflow) : 'Make the pieces agree', body: f.seriesKey === 'ai' ? `Input: ${f.aiInput}. Draft: ${f.aiDraft}.` : 'Message, website, content and follow-up, saying the same thing.' },
    { kicker: 'The boundary', title: 'A person checks it before it goes out', body: f.seriesKey === 'ai' ? `I check ${f.aiCheck}. Nothing is auto-sent.` : 'No invented clients. No numbers I cannot defend.' },
    { kicker: 'Why it matters', title: 'The check is the product', body: 'Convenience is easy to copy. Judgment is not.' },
    { kicker: 'Your turn', title: 'Where do you keep a human in the loop?', body: 'One line is enough. I read them.' },
  ];
}

/* ---------------- the builder ---------------- */
export function makeLinkedIn(ctx) {
  const { source, days, dayPostsByDay, editorialByDay, videoSlotsByDay, PRICE, waFor, urlFor } = ctx;
  const cfg = source.linkedin;
  const accounts = new Map(cfg.accounts.map(a => [a.key, a]));
  const items = [];

  const psychKeys = source.psychology.principles.map(p => p.key);
  const psychByKey = new Map(source.psychology.principles.map(p => [p.key, p]));
  const personalPsych = (day, i) => {
    const key = psychKeys[(day * 3 + i + 5) % psychKeys.length];
    const p = psychByKey.get(key);
    return { key, name: p.name, use: p.principle, guard: p.guard };
  };

  for (const day of days) {
    const posts = dayPostsByDay.get(day.day) || [];
    const editorial = editorialByDay.get(day.day) || {};
    const bySlot = new Map(posts.map(p => [p.slot, p]));
    const videos = videoSlotsByDay.get(day.day) || [];
    const accountSlots = cfg.accounts.flatMap(a => a.slots.map((sl, idx) => ({ ...sl, account: a.key, n: idx + 1 })));

    for (const [i, slot] of accountSlots.entries()) {
      const account = accounts.get(slot.account);
      const personal = account.key === 'personal';
      const code = personal ? 'AB' : 'CO';
      const n = slot.n;
      const id = `EW-LI-D${String(day.day).padStart(2, '0')}-${code}${n}`;

      /* --- choose the source post, rotating so nothing repeats for a week --- */
      let src = null;
      if (slot.sources === 'video') {
        src = videos.length ? videos[(day.day - 1 + n) % videos.length] : bySlot.get(2);
      } else {
        const list = slot.sources;
        const slotNum = list[(day.day - 1) % list.length];
        src = bySlot.get(slotNum);
      }
      if (!src) continue;
      const f = factsFrom(src, editorial);

      /* --- weekly format overrides (personal profile) --- */
      const weekly = (account.weekly || []).find(w => w.weekday === day.weekday && w.slot === slot.key);
      let format = weekly ? weekly.format : slot.format;
      if (format === 'Document post') format = 'Document post (PDF)';

      /* --- body --- */
      let opener, bodyText, docPages = null, poll = null;
      if (!personal) {
        switch (slot.key) {
          case 'co1': opener = pick(CO_OPEN.doc, day.day, 1)(f); bodyText = companyDocBody(f, opener); docPages = companyDocPages(f); break;
          case 'co2': opener = pick(CO_OPEN.myth, day.day, 2)(f); bodyText = companyMythBody(f, opener); break;
          case 'co3': opener = pick(CO_OPEN.image, day.day, 3)(f); bodyText = companyImageBody(f, opener); break;
          default: opener = pick(CO_OPEN.video, day.day, 4)(f); bodyText = companyVideoBody(f, opener);
        }
      } else {
        switch (slot.key) {
          case 'ab1':
            opener = pick(AB_OPEN.build, day.day, 1)(f);
            bodyText = personalBuildBody(f, opener, day);
            if (format.startsWith('Document')) docPages = personalDocPages(f);
            break;
          case 'ab2':
            opener = pick(AB_OPEN.note, day.day, 2)(f);
            bodyText = personalNoteBody(f, opener);
            if (format === 'Poll') poll = { question: f.pollQuestion || 'What does your bio lead with?', options: f.pollOptions.length ? f.pollOptions : ['What I do', 'Who I help'], answer: f.pollAnswer };
            break;
          default:
            opener = pick(AB_OPEN.take, day.day, 3)(f);
            bodyText = personalTakeBody(f, opener);
        }
      }

      /* --- asset --- */
      let asset = '';
      if (format.startsWith('Document')) asset = `assets/linkedin/${id}.pdf`;
      else if (format === 'Native video') asset = `assets/video-ready/${f.id}.mp4 (or the poster assets/fallbacks/${f.id}.jpg)`;
      else if (format === 'Image post') asset = f.asset.startsWith('assets/memes') || f.asset.startsWith('assets/static') ? f.asset : `assets/carousels/${f.id}_slide-1.jpg`;
      else if (format === 'Poll') asset = '';

      /* --- CTA, link, disclosure --- */
      const cta = personal
        ? (format === 'Poll' ? 'Vote, then tell me why in one line.' : lastQuestion(bodyText))
        : (format === 'Native video' ? trimPeriod(f.cta) : 'What would you add? One line is enough.');
      const route = f.route || '/about';
      const firstComment = personal
        ? `${f.offerKeyword ? waFor(f.offerKeyword) : urlFor(route)} — I answer these myself. ${f.offerKeyword ? `Message ${f.offerKeyword} on WhatsApp.` : ''}`.trim()
        : `${urlFor(route)}${f.offerKeyword ? ` · or message ${f.offerKeyword} on WhatsApp: ${waFor(f.offerKeyword)}` : ''}`;
      const aiDisclosure = format === 'Native video';
      const personalSecond = pick(['#BuildingInPublic', '#LagosBusiness', '#SmallBusiness'], day.day, i);
  const tags = personal ? `#Easywurld ${personalSecond}` : '#Easywurld #SmallBusiness';
      const caption = bodyText + '\n\n' + tags;
      const { head } = splitForLinkedIn(bodyText);

      items.push({
        id, type: 'LinkedIn', account: account.key, accountName: account.name,
        accountType: account.type, accountUrl: account.url || '',
        slot: slot.key, slotIndex: n, label: slot.label,
        day: day.day, date: day.iso, weekday: day.weekday, time: slot.time,
        format, series: `${account.name} · ${slot.label}`, seriesKey: personal ? 'li-personal' : 'li-company',
        pillar: f.pillar, status: 'Draft', aiDisclosure,
        sourcePostId: f.id, sourceTopic: f.topic, sourceSlot: f.slot,
        psych: personal ? personalPsych(day.day, i) : f.psych,
        hook: first(head) || first(bodyText),
        body: bodyText, caption, firstComment,
        cta, docPages, poll,
        asset,
        visual: format.startsWith('Document')
          ? `Upload ${asset} as a document post. Page one is the cover LinkedIn shows on mobile. Keep it under 100 pages and under 100 MB.`
          : format === 'Native video'
            ? `Upload the finished MP4 for ${f.id}. Captions and the AI label are already burned in; do not re-edit.`
            : format === 'Image post'
              ? `Attach ${asset}. One image only; let the caption carry the rest.`
              : format === 'Poll'
                ? `Native poll. ${poll.options.length} options. The lesson stays in the post body, not the poll.`
                : 'Native text post. No image, no external link in the body.',
        edit: 'Read it aloud once. If a sentence needs a second breath, split it. Post the first comment immediately after publishing — LinkedIn shows the post before the comment.',
        fallback: format.startsWith('Document')
          ? 'Publish the first three paragraphs as a plain text post and drop the document.'
          : format === 'Native video'
            ? `Publish the poster assets/fallbacks/${f.id}.jpg with the same caption as an image post.`
            : format === 'Poll'
              ? 'Publish as a text post with the two options written as a question.'
              : 'Publish the first two paragraphs only.',
        placements: {
          LinkedIn: {
            placementId: `${id}-LI`, time: slot.time, format,
            caption, firstComment, status: 'Draft', actualUrl: '',
          },
        },
      });
    }
  }
  return items;
}

function lastQuestion(body) {
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].endsWith('?')) return trimPeriod(lines[i]);
  return 'What would you add? One line is enough.';
}
