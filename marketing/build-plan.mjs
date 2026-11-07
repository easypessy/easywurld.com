#!/usr/bin/env node
/**
 * Expand the editorial source (marketing/series-plan.json) into the active plan:
 *   330 core posts (11/day) + 60 stories (2/day) + weekly LinkedIn pulls
 *   = 990 + 180 + ~26 placements on TikTok, Instagram, Facebook and LinkedIn.
 * No dependencies.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeLinkedIn } from './linkedin.mjs';
import { voFor } from './voice.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const kit = join(root, 'launch-content/social-command');
const source = JSON.parse(readFileSync(join(here, 'series-plan.json'), 'utf8'));
const offersRaw = readFileSync(join(root, 'client/src/data/offers.ts'), 'utf8');
const offerStart = offersRaw.indexOf('OFFERS: Offer[] = ') + 'OFFERS: Offer[] = '.length;
const offerEnd = offersRaw.indexOf('\n];', offerStart);
const offers = JSON.parse(offersRaw.slice(offerStart, offerEnd + 2));
const offerByKeyword = new Map(offers.map(o => [o.keyword, o]));
const PRICE = 5000;
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const platformCode = { TikTok: 'TT', Instagram: 'IG', Facebook: 'FB', LinkedIn: 'LI' };
const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const mdText = s => String(s ?? '').replaceAll('|','\\|').replaceAll('\n','<br>');
const quote = s => String(s ?? '').split('\n').map(l => l ? '> ' + l : '>').join('\n');
const firstLine = s => String(s ?? '').split('\n')[0];
const csvCell = v => '"' + String(v ?? '').replaceAll('"','""') + '"';
const money = n => '₦' + Number(n).toLocaleString('en-NG');
const longDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const trimPeriod = s => String(s).replace(/\.+$/,'');
const waFor = keyword => keyword ? source.waLink + '?text=' + encodeURIComponent(keyword) : source.waLink;
const urlFor = route => source.site + route;
const addMinutes = (time, mins) => { const [h,m] = time.split(':').map(Number); const t = h*60+m+mins; return String(Math.floor(t/60)).padStart(2,'0') + ':' + String(t%60).padStart(2,'0'); };
const hashtags = (...tags) => [...new Set(['#Easywurld', ...tags])].join(' ');
const isoFor = day => new Date(Date.UTC(2026, 10, 1 + day)).toISOString().slice(0,10);
const disclosureLine = p => p.format === 'Screen demo' ? 'AI voiceover; script reviewed by Easywurld.' : p.format === 'AI talking head' ? 'AI presenter · Easywurld; script reviewed by the studio.' : '';
const sampleLine = p => p.demoPath ? 'Concept project · sample build. No live client result is claimed.' : '';
const body = p => p.script || (p.slides || []).map((s,i) => `Slide ${i+1}: ${s}`).join('\n\n') || p.staticCopy || '';

/* ---------------- psychology layer ---------------- */
const psychByKey = new Map(source.psychology.principles.map(p => [p.key, p]));
function psychFor(seriesKey, day) {
  const keys = source.psychology.seriesMap[seriesKey] || ['specificity'];
  const key = keys[(day - 1) % keys.length];
  return { key, name: psychByKey.get(key).name, use: psychByKey.get(key).principle, guard: psychByKey.get(key).guard };
}

function makePost(day, series, editorial) {
  const date = isoFor(day.day);
  const id = `EW-D${String(day.day).padStart(2,'0')}-S${String(series.slot).padStart(2,'0')}`;
  const offer = offerByKeyword.get(day.offerKeyword);
  if (!offer) throw new Error('Unknown offer keyword ' + day.offerKeyword);
  const base = {
    id, day: day.day, slot: series.slot, seriesKey: series.key, series: series.name,
    type: 'Content',
    date, weekday: weekdays[new Date(date + 'T00:00:00Z').getUTCDay()], time: series.time,
    pillar: series.pillar, objective: series.objective, status: 'Draft',
    route: '/about', keyword: '', ctaType: 'Conversation', aiDisclosure: false,
    demoPath: null, sourcePath: null, sourceUrl: null, sourceDate: null,
    verification: '', offerKeyword: '', offerName: '',
    psych: psychFor(series.key, day.day),
  };
  let p;
  switch (series.key) {
    case 'niche': {
      const n = editorial.niche;
      p = { ...base, format: 'Carousel', topic: `If I ran a ${n.niche} account in Lagos`,
        problem: `A ${n.niche} business needs post ideas that match how customers actually decide.`,
        hook: `If I ran a ${n.niche} account in Lagos, this is what I would post this week.`,
        slides: [
          `If I ran a ${n.niche} account in Lagos, this is what I would post this week.`,
          `Three posts I would test:\n1. ${n.ideas[0]}\n2. ${n.ideas[1]}\n3. ${n.ideas[2]}`,
          `One mistake to avoid: ${n.mistake}.`,
          `First action: ${n.first}`,
          `This is a planning example, not a claim that Easywurld manages this account. Which idea would you test first?`
        ],
        cta: 'Comment the idea you would test first.', visual: 'Five 1080×1350 cream slides. Deep-green serif headline, one terracotta accent. Owned or labelled example visuals only.',
        edit: 'Set exact slide copy. One idea per slide. On TikTok export as a photo carousel or a simple text video.',
        duration: '5 slides', fallback: 'Record the same plan as a 30-second talking head or publish it as a text post.',
        prompt: `Create a five-slide Easywurld carousel for a ${n.niche} business in Lagos. Use the exact supplied slide copy. Cream #FAE7C7, deep green #0A4937, one terracotta accent. No stock people, no fake client results, no borrowed brand interface.` };
      break;
    }
    case 'myth': {
      const m = editorial.myth;
      p = { ...base, format: 'AI talking head', topic: `Myth Court: ${m.claim}`,
        problem: 'Absolute marketing advice creates confusion and wasted effort.',
        hook: `Marketing myth: ${m.claim}`,
        script: `Marketing myth: ${trimPeriod(m.claim)} Verdict: ${trimPeriod(m.verdict)}. ${m.why} Test it: ${m.test} That is Myth Court: keep the useful part, drop the absolute.`,
        beats: ['0–3s: Operator, chest-up, myth on screen.', `3–12s: verdict: ${m.verdict}.`, '12–24s: the nuance, one labelled example.', `24–34s: the test: ${m.test}`, '34–40s: one CTA.'],
        cta: 'Save the test and run it on your own account.', ctaType: 'Save', aiDisclosure: true,
        visual: 'Operator persona: `assets/avatar/operator-hero.jpg` as the scene reference. Chest-up from behind or in silhouette, plain warm night-desk background. Verdict card + test checklist inserted.',
        edit: 'Target 30–40 seconds. Open on the verdict card, not a logo. One meaningful cutaway. Correct captions, AI label visible.',
        duration: '35–50s', fallback: 'Publish the verdict and test as a five-slide carousel or text post.',
        prompt: 'Create a vertical 9:16 talking-head video for Easywurld using the supplied anonymous Operator scene plate and the locked voice. Deliver the exact script conversationally: low, slow, unhurried. No face, no eyes, no stock person. Leave space for editor captions and the AI disclosure.' };
      break;
    }
    case 'trend': {
      const t = editorial.trend;
      p = { ...base, format: 'Screen demo', topic: `Trend Desk: ${t.candidate}`,
        problem: 'Businesses copy trends without checking relevance, rights or whether the format is still current.',
        hook: `Trend Desk: ${t.candidate} — use the structure, not the hype.`,
        script: `Trend Desk: ${t.candidate}. ${t.source} reported it on ${longDate(t.sourceDate)}: ${t.description}. The business adaptation: ${t.adaptation} Before posting, verify a current example and the audio rights. This is a dated teardown, not a live trend claim. Save the filter, not the hype.`,
        beats: ['0–3s: Trend Desk title + candidate name.', `3–12s: the dated source: ${t.source}, ${longDate(t.sourceDate)}.`, '12–25s: original labelled adaptation storyboard.', '25–35s: verification checklist: current example, relevance, rights, capacity.', '35–40s: one CTA.'],
        cta: 'Save the trend filter before your next post.', ctaType: 'Save', aiDisclosure: true,
        sourceUrl: t.sourceUrl, sourceDate: t.sourceDate,
        verification: 'HOLD: within 7 days before publishing, record a current example URL, date checked, platform, rights check and reviewer. If no current example is verified, publish only as a dated teardown with the live-trend wording removed.',
        visual: 'Screen recording of the dated source plus an original Easywurld adaptation storyboard. Keep “Dated teardown · verify before use” visible. No unlicensed audio or private accounts.',
        edit: 'Readable crop. Approved voice only. Never claim the format is trending now unless the verification log is complete.',
        duration: '35–45s', fallback: 'Publish a static trend-filter checklist with the dated source and no live-trend claim.',
        prompt: 'Edit a 9:16 Trend Desk teardown from the supplied dated source and original storyboard. Keep the source name and date visible. Add the exact script as approved voiceover, accurate captions and the label “Dated teardown · verify before use”. No invented current trend, no unlicensed sound, no private account data.' };
      break;
    }
    case 'ai': {
      const a = editorial.ai;
      const hasDemo = !!a.demoPath;
      p = { ...base, format: hasDemo ? 'Screen demo' : 'Carousel', topic: `AI Build: ${a.workflow}`,
        problem: 'Owners want AI help but need a bounded workflow with human review.',
        hook: `One AI workflow to test: ${a.workflow.toLowerCase()}.`,
        cta: 'Save the workflow and test it with anonymised input.', ctaType: 'Save',
        demoPath: a.demoPath, aiDisclosure: hasDemo,
        visual: hasDemo ? 'Screen recording of the actual repo sample at a readable crop. Keep “Concept project · sample build” visible.' : 'Five workflow cards: input, AI draft, human check, output, boundary. No fake dashboard or private customer data.',
        edit: hasDemo ? 'Record the real sample. Approved voiceover, accurate captions, AI-voice label. Do not imply the sample sent real messages.' : 'Set exact slide copy. Make the human check visually distinct. Do not invent metrics or live automation.',
        duration: hasDemo ? '35–45s' : '5 slides',
        fallback: 'Use the workflow as a text post or annotated static checklist.',
        prompt: hasDemo ? 'Produce a 9:16 screen-led walkthrough from the supplied real Easywurld demo. Keep “Concept project · sample build” visible. Add the exact approved script, accurate captions and AI-voice disclosure. No fabricated metrics, client identity or live-send claim.' : 'Create a five-slide Easywurld workflow carousel using the exact supplied copy. Cream background, deep-green headlines, one terracotta accent for the human check. No fake dashboard, private data or invented results.' };
      if (hasDemo) {
        p.script = `This is a labelled concept workflow: ${a.workflow.toLowerCase()}. Input: ${a.input}. AI drafts ${a.draft}. A person checks ${a.check}. Output: ${a.output}. Nothing is sent automatically. The sample shows the thinking, not a live client result. Save the workflow and test it with anonymised input.`;
        p.beats = ['0–3s: workflow title + CONCEPT / SAMPLE.', `3–12s: input: ${a.input}.`, `12–24s: AI draft: ${a.draft}.`, `24–34s: human check: ${a.check}.`, `34–42s: output: ${a.output}. One CTA.`];
      } else {
        p.slides = [`One AI workflow to test: ${a.workflow}.`, `Input: ${a.input}.`, `AI draft: ${a.draft}.`, `Human check: ${a.check}.`, `Output: ${a.output}. Nothing is sent automatically. Save the workflow and test it with anonymised input.`];
      }
      break;
    }
    case 'meme1':
    case 'meme2': {
      const m = editorial[series.key];
      const scene = MEME_SCENES[(day.day + (series.key === 'meme2' ? 3 : 0)) % MEME_SCENES.length];
      p = { ...base, format: 'Relatable static', topic: m.headline,
        problem: 'Small-business life needs recognition without mocking customers.',
        hook: m.headline, staticCopy: `${m.headline}\n\n${m.resolution}`,
        meme: { scene: scene.id, image: scene.image, line: m.headline, sub: m.resolution },
        cta: 'Share it with the owner who needs the reminder.', ctaType: 'Share',
        visual: `Scene-led meme. Photo: ${scene.desc} Small caption in the lower third, Easywurld mark bottom-left. The joke lives in the photograph, not in a wall of text.`,
        edit: 'Keep the caption under 12 words. No emoji spam, no borrowed meme face, no fake notification. Caption under the post carries the useful lesson.',
        duration: '1 static (1080×1350)', fallback: 'Post the same line over the desk plate in `assets/avatar/operator-desk.jpg`.',
        prompt: `Compose one 4:5 scene-led social meme for Easywurld. Base image: ${scene.desc} Overlay a small two-line caption in Inter: “${m.headline}” / “${m.resolution}”. Keep type small and human, cream on the image bottom third, real logo bottom-left. Not a giant text card. No copied meme, no stock face, no fake UI.` };
      break;
    }
    case 'offerA': {
      const angle = editorial.offerA.angle;
      p = { ...base, format: 'Carousel', topic: `${offer.keyword} Spotlight A: ${angle}`,
        problem: offer.problem, hook: angle, offerKeyword: offer.keyword, offerName: offer.name,
        route: '/offers/' + offer.slug, keyword: offer.keyword, ctaType: 'Offer',
        slides: [angle, `The problem: ${offer.problem}`, `Inside ${offer.name}:\n${offer.deliverables.map(d => '· ' + d.name).join('\n')}`, `${money(PRICE)} DIY pack. Not custom work. ${offer.limits[0]}`, `Message ${offer.keyword} on WhatsApp to confirm current price, payment and delivery. Custom projects are separate.`],
        cta: `Message ${offer.keyword} to confirm order details.`,
        visual: 'Five 1080×1350 cream slides. Show the pack name, contents and price. Real file thumbnails only if supplied; otherwise clean text cards.',
        edit: 'Set exact copy. Price and DIY boundary readable at thumbnail size. No done-for-you implication, no guaranteed results.',
        duration: '5 slides', fallback: 'Record a 30-second offer explanation or publish a text post with the same contents and boundary.',
        prompt: `Create a five-slide Easywurld offer carousel for ${offer.name}. Use the exact supplied copy, ${money(PRICE)}, keyword ${offer.keyword}, cream background and deep-green type. State DIY clearly. No fake testimonials, countdowns or guaranteed results.` };
      break;
    }
    case 'copy': {
      const c = editorial.copy;
      p = { ...base, format: 'Carousel', topic: `Steal This Copy Move: ${c.expert} — ${c.principle}`,
        problem: 'Businesses copy slogans instead of learning the structure behind useful copy.',
        hook: `Steal this copy move from ${c.expert}: ${c.principle}.`,
        slides: [`Steal this copy move from ${c.expert}: ${c.principle}.`, `The principle: ${c.steal}`, `Original Easywurld example: ${c.example}`, `Do not steal the words. Steal the structure. Attribute the principle and write your own example.`, `Try it on one headline today. Source: ${c.source}.`],
        cta: 'Rewrite one headline using the structure.', ctaType: 'Save',
        sourcePath: 'marketing/SERIES_PLAYBOOK.md',
        visual: 'Five cream slides. Expert name, principle, original example and source. No long copyrighted ad copy, no fake endorsement.',
        edit: 'Keep the example original and labelled. Never imply the expert endorses Easywurld.',
        duration: '5 slides', fallback: 'Record a 30-second breakdown with the same attribution and original example.',
        prompt: `Create a five-slide copywriting breakdown for Easywurld. Attribute the principle to ${c.expert} (${c.source}). Use the exact supplied original example. No long copyrighted excerpts, no fake endorsement, no invented results.` };
      break;
    }
    case 'offerB': {
      const o = editorial.offerB;
      p = { ...base, format: 'AI talking head', topic: `${offer.keyword} Spotlight B: ${o.objection}`,
        problem: 'Buyers need the boundary before they purchase.', hook: o.objection,
        offerKeyword: offer.keyword, offerName: offer.name, route: '/offers/' + offer.slug, keyword: offer.keyword, ctaType: 'Offer', aiDisclosure: true,
        script: `${o.objection} ${o.answer} ${offer.name} is a ${money(PRICE)} DIY pack. It includes ${offer.deliverables.map(d=>d.name).join(', ')}. It is not custom work and it does not guarantee results. Message ${offer.keyword} on WhatsApp to confirm current order details.`,
        beats: ['0–3s: the objection on screen.', '3–14s: direct answer.', '14–28s: the actual contents and the DIY boundary.', '28–38s: one keyword CTA.'],
        cta: `Message ${offer.keyword} to confirm order details.`,
        visual: 'Operator persona: `assets/avatar/operator-hero.jpg`. Insert a clean contents card and the DIY boundary. No fake testimonials.',
        edit: 'Target 30–40 seconds. Keep the answer direct. Correct captions, AI label visible.',
        duration: '35–50s', fallback: 'Publish the objection and answer as a static FAQ card.',
        prompt: 'Create a vertical 9:16 offer FAQ with the supplied anonymous Operator scene plate and the locked voice. Deliver the exact script. Show the pack contents and the DIY boundary. No guaranteed results, fake scarcity or invented testimonials.' };
      break;
    }
    case 'intro': {
      const it = editorial.intro;
      p = { ...base, format: it.format, topic: `Meet Easywurld: ${it.angle}`,
        problem: 'New viewers need a clear, repeated but varied introduction to the studio.',
        hook: it.body[0], route: '/about',
        cta: 'Send the business link and the problem you want to fix.', ctaType: 'Conversation',
        visual: 'Use the day’s intro format: ' + it.format + '. Real Easywurld mark, cream/green palette, plain language. No fictional founder image.',
        edit: 'Keep it specific. No invented client results, team size or office footage.',
        duration: it.format === 'Carousel' ? '5 slides' : it.format === 'Relatable static' ? '1 static' : '25–40s',
        fallback: 'Publish the same introduction as a text post with the real logo.',
        prompt: `Create an Easywurld introduction in the format ${it.format}. Use the exact supplied copy. Plain, specific, honest. Real logo only. No fictional founder, invented client results or unapproved likeness.` };
      if (it.format === 'Carousel') p.slides = it.body;
      else if (it.format === 'Relatable static') p.staticCopy = it.body.join('\n\n');
      else { p.script = it.body.join(' '); p.aiDisclosure = it.format === 'AI talking head' || it.format === 'Screen demo'; p.beats = ['0–3s: first line as hook.', '3–25s: the supplied points in order.', '25–35s: one CTA.']; }
      if (it.format === 'Screen demo') { p.demoPath = '/demo/clear-homepage-rewrite/index.html'; p.visual = 'Screen recording of the labelled sample or the actual calendar. Concept/sample labels visible.'; }
      break;
    }
    case 'meme1':
    case 'meme2': {
      const lesson = post.caption.split('\n\n').filter(l => l.length > 20 && !l.startsWith('#') && !/Concept project/i.test(l) && l !== post.cta && l !== post.hook);
      return [P(post.hook), '', P(post.meme ? post.meme.sub : ''), '', lesson.length ? lesson[0] : 'The joke is the recognition. The caption is the fix.', '',
        'Two things I would change in a small business this week:', '',
        '1. Write the next step into the offer, not the caption.',
        '2. Put the price, the contents and the boundary in the same message.', '',
        'That is the whole post. No thread, no funnel.'].join('\n');
    }
    case 'operator': {
      const o = editorial.operator;
      p = { ...base, format: 'AI talking head', topic: `One Last Thought: ${o.topic}`,
        problem: 'The last thing an audience sees each day should be the calmest, most certain thing they saw.',
        hook: o.line,
        script: `${o.line} ${o.turn} ${o.close} ${o.cta}`,
        beats: ['0–2s: cold line, no greeting, no logo.', '2–8s: the turn.', '8–16s: the close, delivered slower.', '16–22s: one CTA. Hold the last frame in silence.'],
        cta: o.cta, ctaType: 'Save', aiDisclosure: true, pillar: 'Trust',
        visual: 'Operator persona: `assets/avatar/operator-presence.jpg` or `operator-hero.jpg`. Night desk, warm lamp, city bokeh. Face never visible. Small recurring vertical mark in the corner as the show signature.',
        edit: 'Target 18–24 seconds. One slow push-in, no cuts after the close. Room tone under the voice. End card 1.5s: real logo + “Easywurld. Simplify. Optimize. Grow.”',
        duration: '18–24s', fallback: 'Post the same line over the desk plate as a static with the script in the caption.',
        prompt: `Create a vertical 9:16 late-night talking-head clip for Easywurld using the supplied anonymous Operator scene plate and locked voice. Delivery: low, slow, unhurried, certain. No face, no eyes, no filler words, no shouting. Exact script only. Leave space for captions and the AI disclosure.` };
      break;
    }
    default: throw new Error('Unknown series ' + series.key);
  }

  const tags = p.offerKeyword ? ['#LagosBusiness','#DIYResources']
    : p.seriesKey === 'copy' ? ['#Copywriting','#SmallBusinessTips']
    : p.seriesKey === 'trend' ? ['#TrendDesk','#SocialMediaTips']
    : p.seriesKey === 'ai' ? ['#AIForBusiness','#SmallBusinessTips']
    : p.seriesKey === 'operator' ? ['#LagosBusiness','#MarketingTruths']
    : p.seriesKey.startsWith('meme') ? ['#SmallBusinessNigeria','#LagosBusiness']
    : ['#LagosBusiness','#SmallBusinessTips'];
  const trendLine = p.seriesKey === 'trend' ? `Dated source: ${editorial.trend.source}, ${longDate(editorial.trend.sourceDate)}. Verify a current example before using the format.` : '';
  p.caption = [p.hook, trendLine, p.offerKeyword ? `${p.offerName} · ${money(PRICE)} DIY. Message ${p.offerKeyword} to confirm current order details.` : '', sampleLine(p), disclosureLine(p), p.cta, hashtags(...tags)].filter(Boolean).join('\n\n');
  p.asset = p.format === 'Carousel' ? `assets/carousels/${p.id}_slide-1.jpg … _slide-5.jpg`
    : p.format === 'Relatable static' ? (p.seriesKey.startsWith('meme') ? `assets/memes/${p.id}.jpg` : `assets/static/${p.id}.jpg`)
    : `assets/video-ready/${p.id}.mp4 (record) or assets/fallbacks/${p.id}.jpg (poster)`;
  p.platforms = {};
  for (const platform of source.platforms) {
    const offset = source.platformOffsets[platform];
    const time = addMinutes(series.time, offset);
    let caption;
    if (platform === 'TikTok') caption = [p.hook, p.seriesKey === 'trend' ? `Dated teardown: ${editorial.trend.source}, ${longDate(editorial.trend.sourceDate)}. Verify before use.` : '', p.offerKeyword ? `${money(PRICE)} DIY · keyword ${p.offerKeyword}.` : '', sampleLine(p), disclosureLine(p), p.cta, hashtags(...tags.slice(0,2))].filter(Boolean).join('\n\n');
    else if (platform === 'Instagram') caption = [p.hook, p.seriesKey === 'trend' ? `Dated teardown: ${editorial.trend.source}, ${longDate(editorial.trend.sourceDate)}. Verify before use.` : '', p.offerKeyword ? `${p.offerName} · ${money(PRICE)} DIY. Not custom work.` : '', sampleLine(p), disclosureLine(p), p.cta, hashtags(...tags)].filter(Boolean).join('\n\n');
    else caption = [p.hook, p.seriesKey === 'trend' ? `Source: ${editorial.trend.source}, ${longDate(editorial.trend.sourceDate)}. This is a dated teardown; verify current examples before use.` : '', p.offerKeyword ? `${p.offerName} is a ${money(PRICE)} DIY pack. Not custom work.` : '', sampleLine(p), disclosureLine(p), p.cta, '#Easywurld #LagosBusiness'].filter(Boolean).join('\n\n');
    p.platforms[platform] = { placementId: `${id}-${platformCode[platform]}`, time, caption, format: platformFormat(platform, p.format), status: 'Draft', actualUrl: '' };
  }
  return p;
}

function platformFormat(platform, format) {
  if (format === 'Carousel') return platform === 'TikTok' ? 'Photo carousel / text video' : platform === 'Instagram' ? 'Carousel' : 'Photo album / video';
  if (format === 'Relatable static') return platform === 'TikTok' ? 'Photo post / text video' : 'Static image';
  return 'Vertical video';
}

/* ---------------- scenes for the meme bank ---------------- */
const MEME_SCENES = [
  { id: 'desk-phone', image: 'scene-desk-phone.jpg', desc: 'a dark wooden desk at night with a phone face-down beside a cold cup of tea and an open laptop.' },
  { id: 'empty-shop', image: 'scene-empty-shop.jpg', desc: 'a small shop at 3pm with two plastic chairs outside, one empty, and a hand-painted sign in soft afternoon light.' },
  { id: 'blank-screen', image: 'scene-blank-screen.jpg', desc: 'a laptop with an empty “new post” composer, cursor blinking, someone’s hand resting beside it.' },
  { id: 'notebook', image: 'scene-notebook.jpg', desc: 'an open notebook with three crossed-out lines and one circled, a pen resting on the page, warm lamp light.' },
  { id: 'inbox', image: 'scene-inbox.jpg', desc: 'a phone held in one hand at night showing a long list of chats, thumb hovering, no faces visible.' },
  { id: 'market', image: 'scene-market.jpg', desc: 'a busy Lagos market aisle from waist height, fabric and produce, motion blur, no clear faces.' },
  { id: 'ledger', image: 'scene-ledger.jpg', desc: 'a receipt book, a calculator and a fan blade blurring in the heat on a shop counter.' },
  { id: 'rain-window', image: 'scene-rain-window.jpg', desc: 'a rain-streaked window at night with city bokeh and a single notebook page in the foreground.' },
];

/* ---------------- story slots ---------------- */
const storySlotA = source.stories.slots.find(s => s.slot === 'A');
const storySlotB = source.stories.slots.find(s => s.slot === 'B');

function makeStories(day) {
  const date = isoFor(day.day);
  const next = source.days[day.day] || source.days[0];
  const a = day.storyA;
  const b = day.storyB;
  const out = [];
  // Story A — poll / quiz
  const idA = `EW-D${String(day.day).padStart(2,'0')}-STA`;
  out.push({
    id: idA, type: 'Story', slot: 'A', key: 'storyA', day: day.day, date,
    weekday: weekdays[new Date(date+'T00:00:00Z').getUTCDay()], time: storySlotA.time,
    series: storySlotA.type, pillar: 'Trust', status: 'Draft',
    frames: a.frames, sticker: a.sticker, question: a.question, options: a.options, answer: a.answer,
    cta: 'Tap the poll', duration: storySlotA.duration, objective: storySlotA.objective,
    asset: `${idA}_story-poll.png`,
    visual: 'Three 1080×1920 frames on cream or a dark desk plate. Frame 1 question at 56px, frame 2 two clean options, frame 3 the answer plus the account handle. Poll sticker placed above the caption safe area.',
    edit: 'Burn captions in. Keep each frame to one line. Add the poll sticker on frames 1–2 and the answer on frame 3.',
    fallback: 'Publish as a single-question feed post and pin the answer in a comment.',
    prompt: 'Lay out three vertical 1080×1920 story frames for Easywurld using the exact supplied copy. Cream background, deep-green type, one terracotta accent. Empty space at top and bottom for the platform UI and the poll sticker. No stock people, no fake results.',
    placements: {},
  });
  // Story B — behind the desk teaser
  const teaserPainting = next.myth ? `Tomorrow 08:30 — “${next.myth.claim}”` : 'Tomorrow 08:30 — a new myth on trial.';
  const idB = `EW-D${String(day.day).padStart(2,'0')}-STB`;
  out.push({
    id: idB, type: 'Story', slot: 'B', key: 'storyB', day: day.day, date,
    weekday: weekdays[new Date(date+'T00:00:00Z').getUTCDay()], time: storySlotB.time,
    series: storySlotB.type, pillar: 'Trust', status: 'Draft',
    frames: [b.scene, teaserPainting, 'Tap the link sticker for the full plan.'],
    sticker: 'Link sticker → tomorrow’s lead post', cta: 'Tap the link sticker',
    duration: storySlotB.duration, objective: storySlotB.objective,
    asset: `${idB}_story-desk.png`, linkPostId: `EW-D${String(next.day).padStart(2,'0')}-S01`,
    visual: 'Three 1080×1920 frames from the Operator set: `operator-desk.jpg`, then a dark title card with tomorrow’s hook, then the link sticker frame. Face never visible.',
    edit: 'No cuts faster than 1.2s. Burn the captions. Place the link sticker on frame 3 only.',
    fallback: 'Post the same three frames as a feed carousel with the link in the caption.',
    prompt: 'Compose three vertical 1080×1920 behind-the-desk story frames for Easywurld using the supplied anonymous Operator scene plates. Quiet, warm, night-desk mood. Small caption type. Leave space for the link sticker. No face, no text walls.',
    placements: {},
  });
  for (const s of out) {
    for (const platform of source.stories.platforms) {
      const time = addMinutes(s.time, source.stories.offsets[platform]);
      s.placements[platform] = {
        placementId: `${s.id}-${platformCode[platform]}`, time,
        format: platform === 'TikTok' ? 'TikTok Story' : platform === 'Instagram' ? 'Instagram Story' : 'Facebook Story',
        caption: s.frames.join('\n\n') + '\n\n' + s.cta + '\n\n#Easywurld', status: 'Draft', actualUrl: '',
      };
    }
  }
  return out;
}

/* ---------------- LinkedIn: 4/day company + 3/day personal ---------------- */
/* The copy itself lives in ./linkedin.mjs so the two accounts stay auditable
   in one place. This file only supplies the inputs: the day's eleven posts,
   the raw editorial facts, and the day's finished-video slots. */

/* ---------------- build ---------------- */
const days = source.days.map(d => ({ day: d.day, iso: isoFor(d.day), weekday: weekdays[new Date(isoFor(d.day)+'T00:00:00Z').getUTCDay()], offerKeyword: d.offerKeyword }));
const posts = [];
const dayPostsByDay = new Map();
for (const d of source.days) {
  const dayMeta = days.find(x => x.day === d.day);
  const dayPosts = source.series.map(s => makePost({ ...d, ...dayMeta, day: d.day }, s, d));
  posts.push(...dayPosts);
  dayPostsByDay.set(d.day, dayPosts);
}
const stories = source.days.flatMap(makeStories);
const editorialByDay = new Map(source.days.map(d => [d.day, d]));
const VIDEO_FORMATS = new Set(['AI talking head', 'Screen demo', 'Text video']);
const videoSlotsByDay = new Map(days.map(d => [d.day, posts.filter(p => p.day === d.day && VIDEO_FORMATS.has(p.format))]));
const linkedin = makeLinkedIn({ source, days, dayPostsByDay, editorialByDay, videoSlotsByDay, PRICE, waFor, urlFor });

/* ---------------- spoken-voice layer ----------------
   Every video slot gets a narration script in plain Nigerian English and the
   caption chunks that get burned into the finished MP4. The written `script`
   stays untouched as the record; `voScript` is what the voice says. */
for (const p of posts) {
  if (!VIDEO_FORMATS.has(p.format)) continue;
  Object.assign(p, voFor(p, editorialByDay.get(p.day), longDate));
}

const placements = [
  ...posts.flatMap(p => source.platforms.map(platform => ({ ...p.platforms[platform], type: 'Content', postId: p.id, platform, date: p.date, day: p.day, slot: p.slot, series: p.series, seriesKey: p.seriesKey, topic: p.topic, format: p.format, pillar: p.pillar, hook: p.hook, body: body(p), cta: p.cta, route: p.route, keyword: p.keyword, offerKeyword: p.offerKeyword, sourceUrl: p.sourceUrl, sourceDate: p.sourceDate, verification: p.verification, aiDisclosure: p.aiDisclosure, asset: p.asset, fallback: p.fallback, psych: p.psych, voScript: p.voScript, voLines: p.voLines, voTts: p.voTts }))),
  ...stories.flatMap(s => source.stories.platforms.map(platform => ({ ...s.placements[platform], type: 'Story', postId: s.id, platform, date: s.date, day: s.day, slot: s.slot, series: s.series, seriesKey: s.key, topic: s.sticker, format: s.placements[platform].format, pillar: s.pillar, hook: s.frames[0], body: s.frames.join('\n\n'), cta: s.cta, route: '/about', keyword: '', offerKeyword: '', sourceUrl: null, sourceDate: null, verification: '', aiDisclosure: false, asset: s.asset, fallback: s.fallback }))),
  ...linkedin.map(l => ({ ...l.placements.LinkedIn, type: 'LinkedIn', postId: l.id, platform: 'LinkedIn', date: l.date, day: l.day, slot: l.slot, series: l.series, seriesKey: l.seriesKey, account: l.account, accountName: l.accountName, accountUrl: l.accountUrl, firstComment: l.firstComment, poll: l.poll, docPages: l.docPages, psych: l.psych, topic: l.sourceTopic, format: l.format, pillar: l.pillar, hook: l.hook, body: l.body, cta: l.cta, route: '/about', keyword: '', offerKeyword: '', sourceUrl: null, sourceDate: null, verification: '', aiDisclosure: l.aiDisclosure, asset: l.asset, fallback: l.fallback })),
];

const fmtCount = Object.fromEntries([...new Set(posts.map(p => p.format))].map(f => [f, posts.filter(p => p.format === f).length]));
const seriesCount = Object.fromEntries(source.series.map(s => [s.name, posts.filter(p => p.seriesKey === s.key).length]));
const plan = {
  ...source, posts, stories, linkedin, placements, days,
  storiesMeta: source.stories, linkedinMeta: source.linkedin,
  memeScenes: MEME_SCENES,
  counts: {
    corePosts: posts.length, stories: stories.length, linkedin: linkedin.length,
    linkedinCompany: linkedin.filter(l => l.account === 'company').length,
    linkedinPersonal: linkedin.filter(l => l.account === 'personal').length,
    linkedinPerDay: source.linkedin.accounts.reduce((a, b) => a + b.postsPerDay, 0),
    linkedinDocs: linkedin.filter(l => l.format.startsWith('Document')).length,
    linkedinVideos: linkedin.filter(l => l.format === 'Native video').length,
    linkedinImages: linkedin.filter(l => l.format === 'Image post').length,
    linkedinPolls: linkedin.filter(l => l.format === 'Poll').length,
    contentItems: posts.length + stories.length + linkedin.length,
    placements: placements.length,
    contentPlacements: posts.length * 3, storyPlacements: stories.length * 3, linkedinPlacements: linkedin.length,
    days: days.length, perDay: 11, storiesPerDay: 2, perPlatformPerDay: 11,
    formats: fmtCount, series: seriesCount,
  }
};
for (const s of stories) s.dayMeta = days.find(d => d.day === s.day);
writeFileSync(join(here, 'content-plan.json'), JSON.stringify(plan, null, 2) + '\n');

/* ---------------- briefs ---------------- */
const briefDir = join(here, 'briefs');
mkdirSync(briefDir, { recursive: true });
for (const f of readdirSync(briefDir)) if (/^EW-(D\d{2}-S\d{2}|D\d{2}-ST[AB]|LI-(W\d-[A-Z]+|D\d{2}-(CO|AB)\d))\.md$/.test(f)) rmSync(join(briefDir, f));
function psychWhere(p) {
  switch (p.seriesKey) {
    case 'niche': return 'the three named post ideas and the one first action — concrete enough to copy this week.';
    case 'myth': return `the verdict named early, then a test the reader can run: “${p.psych.key === 'loss-aversion' ? 'what the absolute advice is costing you' : 'here is the small test'}”.`;
    case 'trend': return 'the dated source and its date on screen — the receipt before the recommendation.';
    case 'ai': return 'input → draft → human check → output, drawn as a boundary the reader can repeat.';
    case 'meme1': return 'the caption describes the reader so precisely that sharing it says “this is my week”.';
    case 'meme2': return 'the punchline lands on the work, not the customer, so it can be shared without offence.';
    case 'offerA': return 'contents first, then the price, then the boundary — the number arrives inside a frame.';
    case 'copy': return `the principle is named, attributed, and rebuilt with an original example rather than quoted.`;
    case 'offerB': return 'the objection is spoken before the buyer has to ask it, and answered including the “no”.';
    case 'intro': return 'a recognisable introduction angle and a fixed sign-off, so the eighth sighting feels familiar.';
    case 'operator': return 'a flat first line, a slow turn and a last line the reader can repeat tomorrow.';
    default: return 'the opening line and the single ask carry the principle; the middle carries the receipt.';
  }
}

function brief(p, heading = 2) {
  const h = '#'.repeat(heading);
  const out = [`${h} ${p.id} · ${p.topic}`, '', `**${p.date} · ${p.weekday} · ${p.time} WAT · ${p.series} · ${p.format}**`, '', `- **Pillar:** ${p.pillar}`, `- **Objective:** ${p.objective}`, `- **Single CTA:** ${p.cta}`, `- **Target length:** ${p.duration}`, `- **Status:** Draft — not scheduled`, `- **Expected asset:** \`${p.asset}\``, `- **Destination to verify:** ${urlFor(p.route)}`, `- **Contact:** ${source.whatsapp}${p.keyword ? ' · keyword ' + p.keyword : ''}`, ''];
  if (p.psych) out.push(`- **Psychology move:** ${p.psych.name} — ${p.psych.use}`, `- **Where it shows up here:** ${psychWhere(p)}`, `- **Guard:** ${p.psych.guard}`, '');
  if (p.offerKeyword) out.push(`- **Daily offer:** ${p.offerName} · ${money(PRICE)} DIY. Confirm price, contents, payment and delivery before publishing.`, '');
  if (p.verification) out.push(`- **Trend gate:** ${p.verification}`, `- **Dated source:** ${p.sourceUrl} (${longDate(p.sourceDate)})`, '');
  out.push(`${h}# Hook / first frame`, '', quote(p.hook), '', `${h}# ${p.script ? 'Exact spoken script' : p.slides ? 'Exact slide copy' : 'Exact image copy'}`, '', quote(body(p)), '');
  if (p.voScript) out.push(`${h}# Voiceover script — plain Nigerian English`, '', 'This is what the voice says. `[pause]` means let the idea land for about a second. Read the words exactly as written; do not formalise them.', '', quote(p.voScript), '', `${h}# Burned-in caption chunks`, '', 'Already timed and rendered into the finished MP4. Fix a word here and re-run `python marketing/build-video.py --only ${p.id}`.', '', ...p.voLines.map((l, i) => `${i + 1}. ${l}`), '');
  if (p.meme) out.push(`${h}# Meme scene`, '', `- **Scene plate:** \`assets/meme-scenes/${p.meme.image}\``, `- **On-image line:** ${p.meme.line}`, `- **Second line:** ${p.meme.sub}`, '');
  if (p.beats) out.push(`${h}# Edit / shot order`, '', ...p.beats.map(b => '- ' + b), '');
  out.push(`${h}# Platform captions`, '');
  for (const platform of source.platforms) { const pl = p.platforms[platform]; out.push(`**${platform} · ${pl.time} WAT · ${pl.format}**`, '', quote(pl.caption), ''); }
  out.push(`${h}# Visual and edit`, '', p.visual, '', p.edit, '', `${h}# Filled production prompt`, '', '```text', p.prompt, '```', '');
  if (p.demoPath) out.push(`**Real source to record:** \`${p.demoPath.startsWith('/') ? 'client/public' + p.demoPath : p.demoPath}\``, '');
  if (p.sourcePath) out.push(`**Reference:** \`${p.sourcePath}\``, '');
  out.push(`**Disclosure:** ${p.aiDisclosure ? (p.format === 'Screen demo' ? 'AI voice · Easywurld' : 'AI presenter · Easywurld') + '. Enable the platform AI setting. Reassess if the final asset uses no synthetic voice/person.' : 'No realistic synthetic person/voice planned. Reassess if the production method changes.'}`, '', `**Fallback:** ${p.fallback}`, '');
  return out.join('\n');
}
function storyBrief(s) {
  const out = [`## ${s.id} · ${s.series}`, '', `**${s.date} · ${s.weekday} · ${s.time} WAT · Story ${s.slot} · ${s.duration}**`, '', `- **Objective:** ${s.objective}`, `- **Sticker:** ${s.sticker}`, `- **Single CTA:** ${s.cta}`, `- **Status:** Draft — not scheduled`, `- **Asset:** \`assets/stories/${s.id}_frame-1.jpg … _frame-3.jpg\``, ''];
  if (s.linkPostId) out.push(`- **Links to:** ${s.linkPostId}`, '');
  out.push('## Frames', '', ...s.frames.flatMap((f, i) => [`**Frame ${i + 1}**`, '', quote(f), '']));
  out.push('## Placements', '');
  for (const platform of source.stories.platforms) { const pl = s.placements[platform]; out.push(`**${platform} · ${pl.time} WAT · ${pl.format}**`, ''); }
  out.push('## Visual and edit', '', s.visual, '', s.edit, '', '## Filled production prompt', '', '```text', s.prompt, '```', '', `**Fallback:** ${s.fallback}`, '');
  return out.join('\n');
}
function linkedinBrief(l) {
  const out = [`## ${l.id} · ${l.label}`, '',
    `**${l.date} · ${l.weekday} · ${l.time} WAT · ${l.format}**`, '',
    `- **Account:** ${l.accountName} (${l.accountType})${l.accountUrl ? ' · ' + l.accountUrl : ''}`,
    `- **Siphoned from:** ${l.sourcePostId} (slot ${l.sourceSlot}) — ${l.sourceTopic}`,
    `- **Status:** Draft — not scheduled`,
    `- **Single CTA:** ${l.cta}`,
    `- **AI label:** ${l.aiDisclosure ? 'Yes — enable the platform AI setting' : 'Not required'}`];
  if (l.asset) out.push(`- **Asset:** \`${l.asset}\``);
  if (l.psych) out.push(`- **Psychology move:** ${l.psych.name} — ${l.psych.use}`, `- **Guard:** ${l.psych.guard}`);
  out.push('', '### Post body (paste this)', '', quote(l.body), '', '### First comment (post immediately after publishing)', '', quote(l.firstComment), '');
  if (l.poll) out.push('### Poll', '', `- **Question:** ${l.poll.question}`, ...l.poll.options.map(o => `- Option: ${o}`), `- **Answer to give in the comments:** ${l.poll.answer}`, '');
  if (l.docPages) out.push('### Document pages (rendered to PDF)', '', ...l.docPages.flatMap((pg, i) => [`**Page ${i + 1}** — ${pg.kicker}`, '', quote(pg.title + (pg.body ? '\n\n' + pg.body : '')), '']), '');
  out.push('### Notes', '', l.visual, '', l.edit, '', `**Fallback:** ${l.fallback}`, '');
  return out.join('\n');
}
for (const p of posts) writeFileSync(join(briefDir, p.id + '.md'), '# ' + p.id + ' — production brief\n\n' + brief(p));
for (const s of stories) writeFileSync(join(briefDir, s.id + '.md'), '# ' + s.id + ' — story brief\n\n' + storyBrief(s));
for (const l of linkedin) writeFileSync(join(briefDir, l.id + '.md'), '# ' + l.id + ' — LinkedIn brief\n\n' + linkedinBrief(l));

/* ---------------- calendar markdown ---------------- */
const tidy = s => s.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n');
const strategy = tidy(readFileSync(join(here, 'STRATEGY.md'), 'utf8'));
const playbook = tidy(readFileSync(join(here, 'SERIES_PLAYBOOK.md'), 'utf8'));
const psychology = tidy(readFileSync(join(here, 'PSYCHOLOGY_PLAYBOOK.md'), 'utf8'));
const md = ['# Easywurld — 30-day calendar: 11 posts and 2 stories a day', '', '**Monday 2 November–Tuesday 1 December 2026 · Africa/Lagos (WAT, UTC+1)**', '', `**${plan.counts.corePosts} core posts · ${plan.counts.stories} stories · ${plan.counts.linkedin} LinkedIn posts · ${plan.counts.placements} platform placements.**`, '', '## Strategy before production', '', strategy.split('\n').slice(1).join('\n'), '', '## Series playbook', '', playbook.split('\n').slice(1).join('\n'), '', '## Psychology layer', '', psychology.split('\n').slice(1).join('\n'), '', '## The dated run', '', 'Eleven content slots a day on TikTok, Instagram and Facebook, plus two stories, plus the LinkedIn pulls. TikTok is at the slot time, Instagram +10 minutes, Facebook +20 minutes. Stories: Instagram at the slot time, Facebook +5, TikTok +10. Every row starts Draft.', '', '| Day | Date | Offer | S1 Niche | S2 Myth | S3 Trend | S4 AI | S5 Meme | S6 Offer A | S7 Copy | S8 Meme | S9 Offer B | S10 Intro | S11 Last Thought |', '|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
for (const d of days) { const ps = posts.filter(p => p.day === d.day); md.push(`| ${d.day} | ${d.iso} · ${d.weekday} | ${d.offerKeyword} | ${ps.map(p => mdText(p.topic)).join(' | ')} |`); }
md.push('', '## Stories', '', '| Day | Date | 12:30 Poll / quiz | 21:00 Behind the desk |', '|---:|---|---|---|');
for (const d of days) { const ss = stories.filter(s => s.day === d.day); md.push(`| ${d.day} | ${d.iso} | ${mdText(ss[0].frames[0])} | ${mdText(ss[1].frames[0])} |`); }
md.push('', '## LinkedIn — Easywurld company page (4 a day)', '', '| Date | Time | Format | Source | First line |', '|---|---|---|---|---|');
for (const l of linkedin.filter(x => x.account === 'company')) md.push(`| ${l.date} · ${l.weekday} (day ${l.day}) | ${l.time} | ${l.format} | ${l.sourcePostId} | ${mdText(firstLine(l.hook))} |`);
md.push('', '## LinkedIn — Abu Israel personal profile (3 a day)', '', 'Profile: https://www.linkedin.com/in/abu-israel-495b09226', '', '| Date | Time | Format | Source | First line |', '|---|---|---|---|---|');
for (const l of linkedin.filter(x => x.account === 'personal')) md.push(`| ${l.date} · ${l.weekday} (day ${l.day}) | ${l.time} | ${l.format} | ${l.sourcePostId} | ${mdText(firstLine(l.hook))} |`);
md.push('', 'Seven LinkedIn posts a day, every day: 120 on the company page and 90 on the personal profile. The two accounts never post the same text. Links go in the first comment, never the body.', '');
md.push('', '## Production briefs', '', 'All copy is draft until reviewed. The prompts are filled; the Operator persona is the approved presenter, and trend slots still need a human verification step. No finished videos or live scheduling are implied.', '', '---', '');
for (const d of days) {
  md.push(`# Day ${d.day} · ${d.iso} · ${d.weekday} · Offer: ${d.offerKeyword}`, '');
  for (const p of posts.filter(x => x.day === d.day)) md.push(brief(p), '---', '');
  for (const s of stories.filter(x => x.day === d.day)) md.push(storyBrief(s), '---', '');
  for (const l of linkedin.filter(x => x.day === d.day)) md.push(linkedinBrief(l), '---', '');
}
const calendar = md.join('\n');
mkdirSync(join(here, 'calendar'), { recursive: true });
writeFileSync(join(here, 'calendar/30-day-calendar.md'), calendar);
writeFileSync(join(kit, 'MONTH_POSTS.md'), calendar);

/* ---------------- CSV ---------------- */
const headers = ['Type', 'Date', 'Weekday', 'Day', 'Slot', 'Series', 'Post ID', 'Placement ID', 'Platform', 'LinkedIn account', 'First comment', 'Time (WAT)', 'Timezone', 'Platform format', 'Core format', 'Pillar', 'Psychology move', 'Topic', 'Hook / first frame', 'Script / slide / image copy', 'Voiceover script (plain Nigerian English)', 'Burned caption chunks', 'Caption', 'Single CTA', 'Destination (verify)', 'Keyword', 'Daily offer', 'Dated source URL', 'Dated source date', 'Trend verification gate', 'AI disclosure', 'Expected asset', 'Fallback', 'Status', 'Actual post URL', 'Notes'];
const rows = [headers];
for (const pl of placements) {
  const core = pl.type === 'Content' ? posts.find(p => p.id === pl.postId) : null;
  const disc = pl.type === 'Story' ? 'Not planned; reassess if a synthetic voice is used'
    : pl.aiDisclosure ? (core && core.format === 'Screen demo' ? 'AI voice · Easywurld + platform setting' : 'AI presenter · Easywurld + platform setting')
    : 'Not planned; reassess if method changes';
  rows.push([pl.type, pl.date, weekdays[new Date(pl.date + 'T00:00:00Z').getUTCDay()], pl.day, pl.slot, pl.series, pl.postId, pl.placementId, pl.platform, pl.accountName || '', pl.firstComment || '', pl.time, source.timezone, pl.format, core ? core.format : pl.format, pl.pillar, pl.psych ? pl.psych.name : '', pl.topic, pl.hook, pl.body, pl.voScript || '', (pl.voLines || []).join(' | '), pl.caption, pl.cta, urlFor(pl.route), pl.keyword, pl.offerKeyword, pl.sourceUrl || '', pl.sourceDate || '', pl.verification || '', disc, 'assets/' + pl.postId + '/' + pl.asset, pl.fallback, 'Draft', '', 'Not scheduled. Human approval required.']);
}
const csv = rows.map(r => r.map(csvCell).join(',')).join('\n') + '\n';
writeFileSync(join(kit, 'content_calendar.csv'), csv);
writeFileSync(join(here, 'calendar/content-calendar.csv'), csv);

/* ---------------- trend log ---------------- */
const trendHeaders = ['Post ID', 'Date', 'Candidate trend', 'Dated source', 'Dated source date', 'Current example URL', 'Platform', 'Date checked', 'Rights checked by', 'Relevance note', 'Reviewer', 'Decision', 'Notes'];
const trendRows = [trendHeaders];
for (const p of posts.filter(p => p.seriesKey === 'trend')) trendRows.push([p.id, p.date, p.topic.replace('Trend Desk: ', ''), p.sourceUrl, p.sourceDate, '', '', '', '', '', '', 'HOLD', 'Do not claim live trend until verified.']);
writeFileSync(join(here, 'TREND_VERIFICATION.csv'), trendRows.map(r => r.map(csvCell).join(',')).join('\n') + '\n');

/* ---------------- measurement ---------------- */
const metricHeaders = ['Type', 'Placement ID', 'Post ID', 'Scheduled date', 'Platform', 'Series', 'Format', 'Topic', '24h views/plays', '24h avg watch seconds', '24h completion %', '7d views/plays', '7d saves', '7d shares', '7d profile visits', 'Sticker taps / replies', 'Relevant comments', 'WhatsApp keyword enquiries', 'Qualified project briefs', 'Confirmed sales', 'Actual post URL', 'Observed lesson', 'Next single change'];
const blank = (pl) => [pl.type, pl.placementId, pl.postId, pl.date, pl.platform, pl.series, pl.format, pl.topic, ...Array(metricHeaders.length - 8).fill('')];
writeFileSync(join(here, 'MEASUREMENT.csv'), [metricHeaders, ...placements.map(blank)].map(r => r.map(csvCell).join(',')).join('\n') + '\n');

/* ---------------- offline app ---------------- */
const shell = readFileSync(join(kit, 'build/shell.html'), 'utf8');
const app = readFileSync(join(kit, 'build/app-script.js'), 'utf8');
writeFileSync(join(kit, 'EASYWURLD_POST_COMMANDER.html'), shell.replace('<!--APP_SCRIPT-->', '<script>' + app.replace('/*__DATA__*/ null', JSON.stringify(plan).replaceAll('<', '\\u003c')) + '</script>'));
writeFileSync(join(kit, 'build/kit-dates.mjs'), `/* Compatibility only. Active source: marketing/series-plan.json. */\nexport const START_DATE = ${JSON.stringify(source.startDate)};\nexport function dateFor(i) {\n  const dt = new Date(Date.UTC(2026,10,2+i));\n  return { iso:dt.toISOString().slice(0,10),day:dt.getUTCDate(),month:dt.toLocaleString('en',{month:'short',timeZone:'UTC'}),year:dt.getUTCFullYear(),weekday:dt.toLocaleString('en',{weekday:'long',timeZone:'UTC'}),label:dt.toLocaleString('en',{weekday:'long',day:'numeric',month:'short',timeZone:'UTC'}) };\n}\nexport function shortFor(i) { const d=dateFor(i); return d.day+' '+d.month; }\nexport function weekdayFor(i) { return dateFor(i).weekday; }\n`);

console.log(`Built ${days.length} days · ${posts.length} core posts · ${stories.length} stories · ${linkedin.length} LinkedIn posts · ${placements.length} placements.`);
console.log('Formats:', fmtCount);
console.log('Series:', seriesCount);
