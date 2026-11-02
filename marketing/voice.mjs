/**
 * Spoken-voice layer — turns each video slot's written script into a narration
 * script in plain Nigerian English, plus the caption chunks that get burned in.
 *
 * The written `script` on a post stays as the record. `voScript` is what the
 * voice actually says, and `voLines` is what appears on screen.
 *
 * Rules come straight from marketing/series-plan.json → voice (owner's brief):
 *   - short words, short sentences, one idea each;
 *   - talk about the daily pain, use Nigerian reference points;
 *   - one light Naija touch at a warm moment, never per line;
 *   - [pause] marks where the voice should let the idea land;
 *   - no jargon, no invented numbers, no hype-man energy.
 */

const P = s => String(s ?? '').trim();
const trimPeriod = s => P(s).replace(/\.+$/, '');
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : s);
const pick = (arr, ...seeds) => arr[seeds.reduce((a, b) => a + b, 0) % arr.length];

/* One warm touch, used sparingly and only where the script has earned it. */
const WARMTH = ['', '', 'No wahala.', 'Oya.', 'Take it one step at a time.'];
const warmth = (day, slot) => pick(WARMTH, day, slot);

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
  [/\bcustomers? who\b/gi, 'people who'],
];
const plain = s => PLAIN.reduce((acc, [re, to]) => acc.replace(re, to), P(s));

/** Break narration into on-screen caption chunks of three to eight words. */
const MAX_CHUNK_WORDS = 8;
const ABBREV = [[/\bVol\.\s*/g, 'Volume '], [/\be\.g\.\s*/gi, 'for example, '], [/\bi\.e\.\s*/gi, 'that is, '], [/\bNo\.\s*(?=\d)/g, 'number ']];
const deAbbrev = s => ABBREV.reduce((a, [re, to]) => a.replace(re, to), s);

export function captionChunks(text) {
  const out = [];
  const push = raw => {
    let t = deAbbrev(P(raw)).replace(/\s+/g, ' ').replace(/[,.]$/, '').trim();
    if (t) out.push(t);
  };
  for (const part of deAbbrev(text).split(/\[pause\]/)) {
    for (const sentence of P(part).split(/(?<=[.!?])\s+/)) {
      const s = trimPeriod(P(sentence).replace(/^["“]/, '').replace(/["”]$/, ''));
      if (!s) continue;
      const words = s.split(/\s+/);
      if (words.length <= MAX_CHUNK_WORDS) { push(words.join(' ')); continue; }
      // Greedy groups, but prefer to break just after a comma or a dash.
      let buf = [];
      for (let i = 0; i < words.length; i++) {
        buf.push(words[i]);
        const joint = /[,;:]$|—$/.test(words[i]);
        if (buf.length >= MAX_CHUNK_WORDS || (joint && buf.length >= 4)) {
          push(buf.join(' '));
          buf = [];
        }
      }
      if (buf.length) push(buf.join(' '));
    }
  }
  // A one- or two-word tail reads like a mistake. Fold it into the chunk before.
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

/* ---------------- per-series spoken scripts ---------------- */
function mythVO(f, day) {
  const claim = trimPeriod(f.claim);
  const open = pick([
    `Marketing myth. People will tell you, "${claim}."`,
    `Let us put one piece of advice on trial. "${claim}."`,
    `You have heard this one before. "${claim}."`,
  ], day, 2);
  const why = plain(f.why).replace(/^Frequency can /, 'Posting often can ').replace(/^Frequency /, 'Posting often ');
  return [
    open,
    '[pause]',
    `My verdict? ${trimPeriod(f.verdict)}.`,
    why,
    '[pause]',
    `Here is a small test you can run this week. ${plain(f.test)}`,
    warmth(day, 2),
    'Keep the useful part. Drop the absolute. That is Myth Court.',
  ].filter(Boolean).join(' ');
}

function trendVO(f, day) {
  return [
    `Trend Desk. Today it is ${f.candidate}.`,
    '[pause]',
    `${f.source} reported it on ${f.sourceDateLong}: ${plain(f.description)}.`,
    `Here is how a normal Nigerian business uses it. ${plain(f.adaptation)}`,
    '[pause]',
    'One thing before you copy it. Check that it is still happening, and check the audio rights.',
    'This is a dated teardown, not a live trend claim.',
    warmth(day, 3),
    'Save the filter. Skip the hype.',
  ].filter(Boolean).join(' ');
}

function aiVO(f, day) {
  const open = pick([
    `One AI workflow you can copy this week. ${plain(f.workflow)}.`,
    `This is the workflow I keep coming back to. ${plain(f.workflow)}.`,
    `Let me show you one bounded AI job. ${plain(f.workflow)}.`,
  ], day, 4);
  return [
    open,
    '[pause]',
    `Step one. The input is ${plain(f.aiInput)}.`,
    `Step two. The AI writes ${plain(f.aiDraft)}.`,
    `Step three, and this is the one people skip. A human checks ${plain(f.aiCheck)}.`,
    `Step four. You send ${plain(f.aiOutput)}.`,
    '[pause]',
    'Nothing goes out on its own. The human check is the feature.',
    'This is a labelled sample build, not a client result.',
    warmth(day, 4),
    'Save it, then test it on your own message.',
  ].filter(Boolean).join(' ');
}

function offerVO(f, day) {
  const open = pick([
    `Somebody will ask you this. "${f.objection}"`,
    `The question I get most about this pack. "${f.objection}"`,
    `Before you buy, you will ask this. "${f.objection}"`,
  ], day, 9);
  return [
    open,
    '[pause]',
    plain(f.objectionAnswer),
    `Let me be clear about what this is. ${f.offerName} is a five thousand naira DIY pack.`,
    f.contents ? `Inside, you get ${f.contents}.` : '',
    '[pause]',
    'It is not custom work, and it does not promise you sales.',
    `Message ${f.offerKeyword} on WhatsApp and I will confirm the current details.`,
  ].filter(Boolean).join(' ');
}

function operatorVO(f, day) {
  return [
    plain(f.opLine),
    '[pause]',
    plain(f.opTurn),
    '[pause]',
    plain(f.opClose),
    warmth(day, 11),
    plain(f.opCta || 'Save this for later.'),
  ].filter(Boolean).join(' ');
}

function textVideoVO(f, day) {
  return [plain(f.hook), '[pause]', plain(f.cta)].filter(Boolean).join(' ');
}

/**
 * Build the narration for one video post.
 * @param post   the generated post object (from content-plan.json)
 * @param editorial  the raw day block from series-plan.json
 * @param longDate   iso -> "26 October 2026"
 */
export function voFor(post, editorial, longDate) {
  const day = post.day;
  const e = editorial || {};
  const f = {
    hook: post.hook, cta: post.cta, topic: post.topic,
    offerName: post.offerName || '', offerKeyword: post.offerKeyword || '',
  };
  switch (post.seriesKey) {
    case 'myth':
      Object.assign(f, e.myth || {});
      break;
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
      // The pack contents are already listed in the written script; lift them out.
      const m = /It includes ([^.]+)\./.exec(post.script || '');
      f.contents = m ? m[1].trim() : '';
      break;
    }
    case 'operator': {
      const o = e.operator || {};
      Object.assign(f, { opTopic: o.topic, opLine: o.line, opTurn: o.turn, opClose: o.close, opCta: o.cta });
      break;
    }
    default:
      Object.assign(f, { script: post.script || '' });
  }
  const text = post.format === 'Text video' ? textVideoVO(f, day)
    : post.seriesKey === 'myth' ? mythVO(f, day)
    : post.seriesKey === 'trend' ? trendVO(f, day)
    : post.seriesKey === 'ai' ? aiVO(f, day)
    : post.seriesKey === 'offerB' ? offerVO(f, day)
    : post.seriesKey === 'operator' ? operatorVO(f, day)
    : [plain(post.script)].join(' ');

  const clean = text.replace(/\s+/g, ' ').trim();
  // What the TTS engine speaks: [pause] becomes a full stop plus a short clause.
  const tts = clean
    .replace(/\[pause\]/g, '. ')
    .replace(/\?\s*\./g, '?')
    .replace(/!\s*\./g, '!')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*\./g, '.')
    .replace(/\.\s*\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { voScript: clean, voTts: tts, voLines: captionChunks(clean), voWarmth: warmth(day, post.slot) };
}
