/**
 * Spoken-voice layer — turns each video slot's written script into a narration
 * script in plain Nigerian English, plus the caption chunks burned on screen.
 *
 * STORY FRAMEWORK (standing instruction, never dropped):
 *   THE VILLAIN  — invisibility and broken trust: the customer who searches and
 *                  finds your competitor first; "how much?" becoming "I will get
 *                  back to you" becoming silence; a page that looks like
 *                  everybody's page so nobody believes you are better.
 *   THE HERO     — Easywurld, taking the fight to the villain, honest that we
 *                  cannot win it alone.
 *   THE ALLY     — the client. Their business, their trust, their yes is the
 *                  turning point. Every piece makes them feel they are joining
 *                  a fight, not buying a service.
 *
 * LANGUAGE (standing instruction):
 *   simple everyday English, short sentences, one idea each; the audience's own
 *   complaints rewritten in our words (see marketing/AUDIENCE_PHRASES.md);
 *   one light Naija touch at a warm moment, never per line; no jargon;
 *   and no "AI" as selling language — outcomes only. Where a product genuinely
 *   is an automation workflow we say "the drafting tool" once and keep the
 *   human-check line; the platform disclosure chip stays because it is a
 *   compliance requirement, not marketing copy.
 */

const P = s => String(s ?? '').trim();
const trimPeriod = s => P(s).replace(/\.+$/, '');
const pick = (arr, ...seeds) => arr[seeds.reduce((a, b) => a + b, 0) % arr.length];

/* One warm touch, used sparingly and only where the script has earned it. */
const WARMTH = ['', '', 'No wahala.', 'Oya.', 'Take it one step at a time.'];
const warmth = (day, slot) => pick(WARMTH, day, slot);

/* The villain, in the audience's own complaints, rewritten in our voice.
   Sources logged in marketing/AUDIENCE_PHRASES.md. */
const VILLAIN = [
  'A customer searches, sees your competitor first, and calls them. Your phone stays quiet.',
  'Somebody types your own business name into Google and finds nothing. Then they find somebody else.',
  '"How much?" becomes "I will get back to you", and that becomes silence.',
  'Your page looks like everybody else\'s, so nobody believes you are better.',
  'People see "DM for price" and just pass, money in hand.',
  'Referrals dry up, and the only new customer this month is your cousin.',
];
const villain = (day, slot) => pick(VILLAIN, day, slot);

/* The ally: the client's yes is the turning point. Easywurld is honest that the
   win needs them. */
const ALLY = [
  'We can build the fix, but we cannot win it alone. Your yes is the turning point.',
  'Easywurld fights this every day. The win only happens with your business in it.',
  'We bring the map. You bring the business. That is the alliance.',
  'Not a service you buy. A fight you join, and your trust is the weapon.',
  'We do our half honestly. Your half is the yes.',
];
const ally = (day, slot) => pick(ALLY, day + 3, slot);

/* Plain-word swaps. Written English on the left, spoken English on the right. */
const PLAIN = [
  [/\benquir(?:y|ies)\b/gi, m => (m.toLowerCase().endsWith('s') ? 'messages' : 'message')],
  [/\butilise[sd]?\b/gi, 'use'],
  [/\boptimise[sd]?\b/gi, 'improve'],
  [/\bpurchase[sd]?\b/gi, 'buy'],
  [/\bapproximately\b/gi, 'about'],
  [/\bsubsequently\b/gi, 'then'],
  [/\bcommence[sd]?\b/gi, 'start'],
  [/\bdemonstrate[sd]?\b/gi, 'show'],
  [/\bconversion\b/gi, 'turning chats into sales'],
];
const plain = s => PLAIN.reduce((acc, [re, to]) => acc.replace(re, to), P(s));

/* ---------- caption chunks ---------- */
const MAX_CHUNK_WORDS = 8;
const ABBREV = [[/\bVol\.\s*/g, 'Volume '], [/\be\.g\.\s*/gi, 'for example, '], [/\bi\.e\.\s*/gi, 'that is, '], [/\bNo\.\s*(?=\d)/g, 'number ']];
const deAbbrev = s => ABBREV.reduce((a, [re, to]) => a.replace(re, to), s);

export function captionChunks(text) {
  const out = [];
  const push = raw => {
    const t = deAbbrev(P(raw)).replace(/\s+/g, ' ').replace(/[,.]$/, '').trim();
    if (t) out.push(t);
  };
  for (const part of deAbbrev(text).split(/\[pause\]/)) {
    for (const sentence of P(part).split(/(?<=[.!?])\s+/)) {
      const s = trimPeriod(P(sentence).replace(/^["“]/, '').replace(/["”]$/, ''));
      if (!s) continue;
      const words = s.split(/\s+/);
      if (words.length <= MAX_CHUNK_WORDS) { push(words.join(' ')); continue; }
      let buf = [];
      for (let i = 0; i < words.length; i++) {
        buf.push(words[i]);
        const joint = /[,;:]$|—$/.test(words[i]);
        if (buf.length >= MAX_CHUNK_WORDS || (joint && buf.length >= 4)) { push(buf.join(' ')); buf = []; }
      }
      if (buf.length) push(buf.join(' '));
    }
  }
  const merged = [];
  for (const c of out) {
    const words = c.split(/\s+/).length;
    if (words <= 2 && merged.length && (merged[merged.length - 1].split(/\s+/).length + words) <= 10) {
      const prev = merged[merged.length - 1];
      const keepCase = /^[A-Z]{2,}/.test(c) || /[?!:]$/.test(prev);
      merged[merged.length - 1] = prev + ' ' + (keepCase ? c : c.charAt(0).toLowerCase() + c.slice(1));
    } else merged.push(c);
  }
  return merged;
}

/* ---------------- per-series spoken scripts (v2: villain / hero / ally) ---------------- */
function mythVO(f, day) {
  const claim = trimPeriod(f.claim);
  const open = pick([
    `Marketing myth. People will tell you, "${claim}."`,
    `Let us put one piece of advice on trial. "${claim}."`,
    `You have heard this one before. "${claim}."`,
  ], day, 2);
  const whyAll = plain(f.why).replace(/^Frequency can /, 'Posting often can ').replace(/^Frequency /, 'Posting often ');
  const why = whyAll.split(/(?<=[.])\s+/).slice(0, 2).join(' ');
  return [
    open,
    '[pause]',
    `My verdict? ${trimPeriod(f.verdict)}.`,
    why,
    '[pause]',
    villain(day, 2),
    'That is the fight Easywurld picks every day. But we cannot win it alone.',
    `Run this small test this week. ${plain(f.test)}`,
    warmth(day, 2),
    'Your yes is the turning point. Keep the useful part. Drop the absolute.',
  ].filter(Boolean).join(' ');
}

function trendVO(f, day) {
  return [
    `Trend Desk. Today it is ${f.candidate}.`,
    '[pause]',
    `${f.source} reported it on ${f.sourceDateLong}: ${plain(f.description)}.`,
    villain(day, 3),
    `Here is how we adapt it. ${plain(f.adaptation)}`,
    '[pause]',
    'Before you copy it: check it is still happening, and check the audio rights.',
    'This is a dated teardown, not a live trend claim.',
    ally(day, 3),
    warmth(day, 3),
    'Save the filter. Skip the hype.',
  ].filter(Boolean).join(' ');
}

function aiVO(f, day) {
  const open = pick([
    `One workflow we run at Easywurld, and you can copy it. ${plain(f.workflow)}.`,
    `This is the workflow I keep coming back to. ${plain(f.workflow)}.`,
    `Let me show you one bounded job, done properly. ${plain(f.workflow)}.`,
  ], day, 4);
  return [
    open,
    '[pause]',
    `Step one. The input is ${plain(f.aiInput)}.`,
    `Step two. The drafting tool writes ${plain(f.aiDraft)}.`,
    `Step three, and this is the one people skip. A person checks ${plain(f.aiCheck)}.`,
    `Step four. You send ${plain(f.aiOutput)}.`,
    '[pause]',
    'Nothing goes out on its own. The human check is the feature, because trust is the product.',
    villain(day, 4),
    'This is a labelled sample build, not a client result.',
    warmth(day, 4),
    'Save it, then test it on your own message.',
  ].filter(Boolean).join(' ');
}

const qmark = s => /\?$/.test(P(s)) ? trimPeriod(P(s)) : trimPeriod(P(s)) + '?';

function offerVO(f, day) {
  const open = pick([
    `Somebody will ask you this. "${qmark(f.objection)}"`,
    `The question I get most about this pack. "${qmark(f.objection)}"`,
    `Before you buy, you will ask this. "${qmark(f.objection)}"`,
  ], day, 9);
  return [
    open,
    '[pause]',
    plain(f.objectionAnswer),
    `That villain is what ${f.offerName} fights. It is a five thousand naira DIY pack.`,
    f.contents ? `Inside, you get ${f.contents}.` : '',
    '[pause]',
    'It is not custom work, and it does not promise you sales.',
    'We hand you the map. You walk it.',
    `Message ${f.offerKeyword} on WhatsApp and I will confirm the current details.`,
  ].filter(Boolean).join(' ');
}

function operatorVO(f, day) {
  return [
    plain(f.opLine),
    '[pause]',
    plain(f.opTurn),
    villain(day, 11),
    '[pause]',
    plain(f.opClose),
    'We fight this every day at Easywurld, and we are honest about it: we cannot win it alone.',
    warmth(day, 11),
    plain(f.opCta || 'Save this for later.'),
  ].filter(Boolean).join(' ');
}

function textVideoVO(f) {
  return [plain(f.hook), '[pause]', villain(1, 1), plain(f.cta)].filter(Boolean).join(' ');
}

/**
 * Build the narration for one video post.
 */
export function voFor(post, editorial, longDate) {
  const day = post.day;
  const e = editorial || {};
  const f = { hook: post.hook, cta: post.cta, topic: post.topic, offerName: post.offerName || '', offerKeyword: post.offerKeyword || '' };
  switch (post.seriesKey) {
    case 'myth': Object.assign(f, e.myth || {}); break;
    case 'trend':
      Object.assign(f, e.trend || {});
      f.source = P(f.source).replace(/\bVol\.\s*/, 'Volume ');
      f.sourceDateLong = e.trend ? longDate(e.trend.sourceDate) : '';
      break;
    case 'ai': {
      const a = e.ai || {};
      Object.assign(f, { workflow: a.workflow, aiInput: a.input, aiDraft: a.draft, aiCheck: a.check, aiOutput: a.output, demoPath: a.demoPath });
      break;
    }
    case 'offerB': {
      const b = e.offerB || {};
      Object.assign(f, { objection: b.objection, objectionAnswer: b.answer });
      const m = /It includes ([^.]+)\./.exec(post.script || '');
      f.contents = m ? m[1].trim() : '';
      break;
    }
    case 'operator': {
      const o = e.operator || {};
      Object.assign(f, { opTopic: o.topic, opLine: o.line, opTurn: o.turn, opClose: o.close, opCta: o.cta });
      break;
    }
    default: Object.assign(f, { script: post.script || '' });
  }
  const text = post.format === 'Text video' ? textVideoVO(f)
    : post.seriesKey === 'myth' ? mythVO(f, day)
    : post.seriesKey === 'trend' ? trendVO(f, day)
    : post.seriesKey === 'ai' ? aiVO(f, day)
    : post.seriesKey === 'offerB' ? offerVO(f, day)
    : post.seriesKey === 'operator' ? operatorVO(f, day)
    : [plain(post.script)].join(' ');

  // grammar guard: the enquiry -> message swap leaves "an message" behind
  const guarded = text.replace(/\ban (message|messages)\b/gi, 'a $1');
  const clean = guarded.replace(/\s+/g, ' ').trim();
  const tts = clean
    .replace(/\[pause\]/g, '. ')
    .replace(/(["”])\s*\.\s/g, '$1 ')
    .replace(/\?\s*\./g, '?')
    .replace(/!\s*\./g, '!')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { voScript: clean, voTts: tts, voLines: captionChunks(clean), voWarmth: warmth(day, post.slot) };
}
