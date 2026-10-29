#!/usr/bin/env node
/** Expand the 10-slot series source into the active 300-post / 900-placement plan. No dependencies. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
const platformCode = { TikTok: 'TT', Instagram: 'IG', Facebook: 'FB' };
const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const mdText = s => String(s ?? '').replaceAll('|','\\|').replaceAll('\n','<br>');
const quote = s => String(s ?? '').split('\n').map(l => l ? '> ' + l : '>').join('\n');
const csvCell = v => '"' + String(v ?? '').replaceAll('"','""') + '"';
const words = s => String(s).trim().split(/\s+/).length;
const money = n => '₦' + Number(n).toLocaleString('en-NG');
const longDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const trimPeriod = s => String(s).replace(/\.+$/,'');
const waFor = keyword => keyword ? source.waLink + '?text=' + encodeURIComponent(keyword) : source.waLink;
const urlFor = route => source.site + route;
const addMinutes = (time, mins) => { const [h,m] = time.split(':').map(Number); const t = h*60+m+mins; return String(Math.floor(t/60)).padStart(2,'0') + ':' + String(t%60).padStart(2,'0'); };
const hashtags = (...tags) => [...new Set(['#Easywurld', ...tags])].join(' ');
const disclosureLine = p => p.format === 'Screen demo' ? 'AI voiceover; script reviewed by Easywurld.' : p.format === 'AI talking head' ? 'AI-generated presenter; script reviewed by Easywurld.' : '';
const sampleLine = p => p.demoPath ? 'Concept project · sample build. No live client result is claimed.' : '';
const body = p => p.script || (p.slides || []).map((s,i) => `Slide ${i+1}: ${s}`).join('\n\n') || p.staticCopy || '';

function makePost(day, series, editorial) {
  const date = new Date(Date.UTC(2026, 10, 1 + day.day));
  const iso = date.toISOString().slice(0,10);
  const id = `EW-D${String(day.day).padStart(2,'0')}-S${String(series.slot).padStart(2,'0')}`;
  const offer = offerByKeyword.get(day.offerKeyword);
  if (!offer) throw new Error('Unknown offer keyword ' + day.offerKeyword);
  const base = {
    id, day: day.day, slot: series.slot, seriesKey: series.key, series: series.name,
    date: iso, weekday: weekdays[date.getUTCDay()], time: series.time,
    pillar: series.pillar, objective: series.objective, status: 'Draft',
    route: '/about', keyword: '', ctaType: 'Conversation', aiDisclosure: false,
    demoPath: null, sourcePath: null, sourceUrl: null, sourceDate: null,
    verification: '', offerKeyword: '', offerName: '',
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
        cta: 'Comment the idea you would test first.', visual: 'Five 1080×1350 cream slides. Deep-green serif headline, one terracotta accent. Use owned or labelled example visuals only.',
        edit: 'Set exact slide copy in the editor. Keep one idea per slide. For TikTok, export as a photo carousel or a simple text video.',
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
        beats: ['0–3s: face + myth on screen.', `3–12s: verdict: ${m.verdict}.`, '12–28s: explain the nuance with one labelled example.', `28–38s: show the test: ${m.test}`, '38–42s: one CTA.'],
        cta: 'Save the test and run it on your own account.', ctaType: 'Save', aiDisclosure: true,
        visual: 'Chest-up approved owner avatar or licensed presenter. Plain warm background. Insert a verdict card and one test checklist.',
        edit: 'Target 30–42 seconds. Keep the first frame on the face. Use one meaningful cutaway. Correct captions and keep the AI label visible.',
        duration: '30–42s', fallback: 'Publish the verdict and test as a five-slide carousel or text post.',
        prompt: 'Create a vertical 9:16 talking-head video using only the separately approved owner likeness and voice, or a licensed provider avatar. Deliver the exact script conversationally. Chest-up, eye-level, soft natural light. No fake office, microphone or client claims. Leave space for editor-added captions and AI disclosure.' };
      break;
    }
    case 'trend': {
      const t = editorial.trend;
      p = { ...base, format: 'Screen demo', topic: `Trend Desk: ${t.candidate}`,
        problem: 'Businesses copy trends without checking relevance, rights or whether the format is still current.',
        hook: `Trend Desk: ${t.candidate} — use the structure, not the hype.`,
        script: `Trend Desk: ${t.candidate}. ${t.source} reported it on ${longDate(t.sourceDate)}: ${t.description}. The business adaptation: ${t.adaptation} Before posting, verify a current example and the audio rights. This is a dated teardown, not a live trend claim. Save the filter, not the hype.`,
        beats: ['0–3s: Trend Desk title + candidate name.', `3–12s: show the dated source: ${t.source}, ${longDate(t.sourceDate)}.`, '12–25s: show an original labelled adaptation storyboard.', '25–35s: show the verification checklist: current example, relevance, rights, capacity.', '35–40s: one CTA.'],
        cta: 'Save the trend filter before your next post.', ctaType: 'Save', aiDisclosure: true,
        sourceUrl: t.sourceUrl, sourceDate: t.sourceDate,
        verification: 'HOLD: within 7 days before publishing, record a current example URL, date checked, platform, rights check and reviewer. If no current example is verified, publish only as a dated teardown with the live-trend wording removed.',
        visual: 'Screen recording of the dated source plus an original Easywurld adaptation storyboard. Keep “Dated teardown · verify before use” visible. Do not show unlicensed audio or private accounts.',
        edit: 'Record at a readable crop. Use licensed synthetic voice or owner voice. Do not claim the format is trending now unless the verification log is complete.',
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
        edit: hasDemo ? 'Record the real sample. Use approved voiceover, accurate captions and the AI-voice label. Do not imply the sample sent real messages.' : 'Set exact slide copy. Keep the human check visually distinct. Do not invent metrics or live automation.',
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
      p = { ...base, format: 'Relatable static', topic: m.headline,
        problem: 'Small-business life needs recognition without mocking customers.',
        hook: m.headline, staticCopy: `${m.headline}\n\n${m.resolution}`,
        cta: 'Share it with the owner who needs the reminder.', ctaType: 'Share',
        visual: 'Original 1080×1350 cream text meme. Large deep-green serif headline, smaller practical resolution, one terracotta accent. No borrowed meme image or fake notification.',
        edit: 'Keep the joke readable at thumbnail size. The caption carries the useful lesson. Do not add a hard sell to the image.',
        duration: '1 static', fallback: 'Animate the same text as an 8-second silent text video.',
        prompt: `Create one original Easywurld text-led static post, 4:5. Exact headline: '${m.headline}' Resolution: '${m.resolution}' Cream background, deep-green serif, one terracotta accent. Dry humour, no stock image, no copied meme, no fake notification UI.` };
      break;
    }
    case 'offerA': {
      const angle = editorial.offerA.angle;
      const deliverables = offer.deliverables.map(d => d.name).join('; ');
      p = { ...base, format: 'Carousel', topic: `${offer.keyword} Spotlight A: ${angle}`,
        problem: offer.problem, hook: angle, offerKeyword: offer.keyword, offerName: offer.name,
        route: '/offers/' + offer.slug, keyword: offer.keyword, ctaType: 'Offer',
        slides: [angle, `The problem: ${offer.problem}`, `Inside ${offer.name}: ${deliverables}.`, `${money(PRICE)} DIY pack. Not custom work. ${offer.limits[0]}`, `Message ${offer.keyword} on WhatsApp to confirm current price, payment and delivery. Custom projects are separate.`],
        cta: `Message ${offer.keyword} to confirm order details.`,
        visual: 'Five 1080×1350 cream slides. Show the actual pack name, contents and price. Use real file thumbnails only if supplied; otherwise use clean text cards.',
        edit: 'Set exact copy. Keep price and DIY boundary readable. Do not imply done-for-you service or guaranteed results.',
        duration: '5 slides', fallback: 'Record a 30-second offer explanation or publish a text post with the same contents and boundary.',
        prompt: `Create a five-slide Easywurld offer carousel for ${offer.name}. Use the exact supplied copy, ${money(PRICE)}, keyword ${offer.keyword}, cream background and deep-green type. State DIY clearly. No fake testimonials, countdowns or guaranteed results.` };
      break;
    }
    case 'copy': {
      const c = editorial.copy;
      p = { ...base, format: 'Carousel', topic: `Steal This Copy Move: ${c.expert} — ${c.principle}`,
        problem: 'Businesses copy slogans instead of learning the structure behind useful copy.',
        hook: `Steal this copy move from ${c.expert}: ${c.principle}.`,
        slides: [`Steal this copy move from ${c.expert}: ${c.principle}.`, `The principle: ${c.steal}`, `Original Easywurld example: ${c.example}`, `Don't steal the words. Steal the structure. Attribute the principle and write your own example.`, `Try it on one headline today. Source: ${c.source}.`],
        cta: 'Rewrite one headline using the structure.', ctaType: 'Save',
        sourcePath: 'marketing/SERIES_PLAYBOOK.md',
        visual: 'Five cream slides. Expert name, principle, original example and source. No long copyrighted ad copy or fake endorsement.',
        edit: 'Keep the example original and labelled. Do not imply the expert endorses Easywurld.',
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
        beats: ['0–3s: objection on screen.', '3–15s: direct answer.', '15–28s: show the actual contents and DIY boundary.', '28–38s: one keyword CTA.'],
        cta: `Message ${offer.keyword} to confirm order details.`,
        visual: 'Chest-up approved avatar or licensed presenter. Insert a clean contents card and the DIY boundary. No fake testimonials.',
        edit: 'Target 30–40 seconds. Keep the answer direct. Correct captions and keep the AI label visible.',
        duration: '30–40s', fallback: 'Publish the objection and answer as a static FAQ card.',
        prompt: 'Create a vertical 9:16 talking-head offer FAQ using only the approved owner likeness/voice or a licensed provider avatar. Deliver the exact script. Show the actual pack contents and DIY boundary. No guaranteed results, fake scarcity or invented testimonials.' };
      break;
    }
    case 'intro': {
      const it = editorial.intro;
      p = { ...base, format: it.format, topic: `Meet Easywurld: ${it.angle}`,
        problem: 'New viewers need a clear, repeated but varied introduction to the studio.',
        hook: it.body[0], route: '/about',
        cta: 'Send the business link and the problem you want to fix.', ctaType: 'Conversation',
        visual: 'Use the day’s intro format: ' + it.format + '. Keep the real Easywurld mark, cream/green palette and plain language. No fictional founder image.',
        edit: 'Keep the introduction specific. Do not invent client results, team size or office footage.',
        duration: it.format === 'Carousel' ? '5 slides' : it.format === 'Relatable static' ? '1 static' : '25–40s',
        fallback: 'Publish the same introduction as a text post with the real logo.',
        prompt: `Create an Easywurld introduction in the format ${it.format}. Use the exact supplied copy. Plain, specific, honest. Real logo only. No fictional founder, invented client results or unapproved likeness.` };
      if (it.format === 'Carousel') p.slides = it.body;
      else if (it.format === 'Relatable static') p.staticCopy = it.body.join('\n\n');
      else { p.script = it.body.join(' '); p.aiDisclosure = it.format === 'AI talking head' || it.format === 'Screen demo'; p.beats = ['0–3s: first line as hook.', '3–25s: show the supplied points in order.', '25–35s: one CTA.']; }
      if (it.format === 'Screen demo') { p.demoPath = '/demo/clear-homepage-rewrite/index.html'; p.visual = 'Screen recording of the labelled sample or actual calendar. Keep concept/sample labels visible.'; }
      break;
    }
    default: throw new Error('Unknown series ' + series.key);
  }
  // Caption master. Platform-specific captions are generated below.
  const tags = p.offerKeyword ? ['#LagosBusiness','#DIYResources'] : p.seriesKey === 'copy' ? ['#Copywriting','#SmallBusinessTips'] : p.seriesKey === 'trend' ? ['#TrendDesk','#SocialMediaTips'] : p.seriesKey === 'ai' ? ['#AIForBusiness','#SmallBusinessTips'] : ['#LagosBusiness','#SmallBusinessTips'];
  const coreCaption = [p.hook, p.seriesKey === 'trend' ? `Dated source: ${editorial.trend.source}, ${longDate(editorial.trend.sourceDate)}. Verify a current example before using the format.` : '', p.offerKeyword ? `${p.offerName} · ${money(PRICE)} DIY. Message ${p.offerKeyword} to confirm current order details.` : '', sampleLine(p), disclosureLine(p), p.cta, hashtags(...tags)].filter(Boolean).join('\n\n');
  p.caption = coreCaption;
  p.asset = `${p.id}_${p.format.toLowerCase().replaceAll(' ','-')}.${p.format === 'Carousel' ? 'zip' : p.format === 'Relatable static' ? 'png' : 'mp4'}`;
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
  if (format === 'AI talking head') return 'Vertical video';
  if (format === 'Screen demo') return 'Vertical video';
  return 'Vertical video';
}

const posts = [];
const days = source.days.map(d => {
  const date = new Date(Date.UTC(2026,10,1+d.day));
  const dayPosts = source.series.map(s => makePost(d, s, d));
  posts.push(...dayPosts);
  return { day: d.day, iso: date.toISOString().slice(0,10), weekday: weekdays[date.getUTCDay()], offerKeyword: d.offerKeyword, posts: dayPosts.map(p=>p.id) };
});
const placements = posts.flatMap(p => source.platforms.map(platform => ({ ...p.platforms[platform], postId: p.id, platform, date: p.date, day: p.day, slot: p.slot, series: p.series, seriesKey: p.seriesKey, topic: p.topic, format: p.format, pillar: p.pillar, hook: p.hook, body: body(p), cta: p.cta, route: p.route, keyword: p.keyword, offerKeyword: p.offerKeyword, sourceUrl: p.sourceUrl, sourceDate: p.sourceDate, verification: p.verification, aiDisclosure: p.aiDisclosure, asset: p.asset, fallback: p.fallback })));
const fmtCount = Object.fromEntries([...new Set(posts.map(p=>p.format))].map(f=>[f,posts.filter(p=>p.format===f).length]));
const seriesCount = Object.fromEntries(source.series.map(s=>[s.name,posts.filter(p=>p.seriesKey===s.key).length]));
const plan = { ...source, posts, placements, days, counts: { corePosts: posts.length, placements: placements.length, days: days.length, perDay: 10, perPlatformPerDay: 10, formats: fmtCount, series: seriesCount } };
writeFileSync(join(here,'content-plan.json'), JSON.stringify(plan,null,2)+'\n');

// Briefs
const briefDir = join(here,'briefs'); mkdirSync(briefDir,{recursive:true});
for (const f of readdirSync(briefDir)) if (/^EW-D\d{2}-S\d{2}\.md$/.test(f)) rmSync(join(briefDir,f));
function brief(p, heading=2) {
  const h='#'.repeat(heading);
  const out=[`${h} ${p.id} · ${p.topic}`,'',`**${p.date} · ${p.weekday} · ${p.time} WAT · ${p.series} · ${p.format}**`,'',`- **Pillar:** ${p.pillar}`,`- **Objective:** ${p.objective}`,`- **Single CTA:** ${p.cta}`,`- **Target length:** ${p.duration}`,`- **Status:** Draft — not scheduled`,`- **Expected asset:** \`assets/${p.id}/${p.asset}\` (production target, not a finished file unless explicitly supplied)`,`- **Destination to verify:** ${urlFor(p.route)}`,`- **Contact:** ${source.whatsapp}${p.keyword?' · keyword '+p.keyword:''}`,''];
  if (p.offerKeyword) out.push(`- **Daily offer:** ${p.offerName} · ${money(PRICE)} DIY. Confirm price, contents, payment and delivery before publishing.`,'');
  if (p.verification) out.push(`- **Trend gate:** ${p.verification}`,`- **Dated source:** ${p.sourceUrl} (${longDate(p.sourceDate)})`,'');
  out.push(`${h}# Hook / first frame`,'',quote(p.hook),'',`${h}# ${p.script?'Exact spoken script':p.slides?'Exact slide copy':'Exact image copy'}`,'',quote(body(p)),'');
  if (p.beats) out.push(`${h}# Edit / shot order`,'',...p.beats.map(b=>'- '+b),'');
  out.push(`${h}# Platform captions`,'');
  for (const platform of source.platforms) { const pl=p.platforms[platform]; out.push(`**${platform} · ${pl.time} WAT · ${pl.format}**`,'',quote(pl.caption),''); }
  out.push(`${h}# Visual and edit`,'',p.visual,'',p.edit,'',`${h}# Filled production prompt`,'','```text',p.prompt,'```','');
  if (p.demoPath) out.push(`**Real source to record:** \`${p.demoPath.startsWith('/')?'client/public'+p.demoPath:p.demoPath}\``,'');
  if (p.sourcePath) out.push(`**Reference:** \`${p.sourcePath}\``,'');
  out.push(`**Disclosure:** ${p.aiDisclosure ? (p.format==='Screen demo'?'AI voice · Easywurld':'AI presenter · Easywurld') + '. Enable the platform AI setting. Reassess if the final asset uses no synthetic voice/person.' : 'No realistic synthetic person/voice planned. Reassess if the production method changes.'}`,'',`**Fallback:** ${p.fallback}`,'');
  return out.join('\n');
}
for (const p of posts) writeFileSync(join(briefDir,p.id+'.md'), '# '+p.id+' — production brief\n\n'+brief(p));

// Calendar markdown
const tidy = s => s.split('\n').map(l=>l.replace(/[ \t]+$/,'')).join('\n');
const strategy = tidy(readFileSync(join(here,'STRATEGY.md'),'utf8'));
const playbook = tidy(readFileSync(join(here,'SERIES_PLAYBOOK.md'),'utf8'));
const md=['# Easywurld — 30-day, 10-post-per-day content calendar','','**Monday 2 November–Tuesday 1 December 2026 · Africa/Lagos (WAT, UTC+1)**','','**300 core posts · 900 platform placements · 10 core posts/day on TikTok, Instagram and Facebook.**','','## Strategy before production','',strategy.split('\n').slice(1).join('\n'),'','## Series playbook','',playbook.split('\n').slice(1).join('\n'),'','## The dated run','','Each day has the same 10 series slots. TikTok is at the slot time, Instagram +10 minutes, Facebook +20 minutes. Every row starts Draft. Trend slots are held until the verification log is complete.','','| Day | Date | Offer | S1 Niche | S2 Myth | S3 Trend | S4 AI | S5 Meme | S6 Offer A | S7 Copy | S8 Meme | S9 Offer B | S10 Intro |','|---:|---|---|---|---|---|---|---|---|---|---|---|---|'];
for (const d of days) { const ps=d.posts.map(id=>posts.find(p=>p.id===id)); md.push(`| ${d.day} | ${d.iso} · ${d.weekday} | ${d.offerKeyword} | ${ps.map(p=>mdText(p.topic)).join(' | ')} |`); }
md.push('','## Production briefs','','All copy is draft until reviewed. The prompts are filled; the likeness/voice source is a separate approval gate. No finished avatar videos or live scheduling are implied.','','---','');
for (const d of days) { md.push(`# Day ${d.day} · ${d.iso} · ${d.weekday} · Offer: ${d.offerKeyword}`,''); for (const id of d.posts) md.push(brief(posts.find(p=>p.id===id)), '---',''); }
const calendar=md.join('\n');
mkdirSync(join(here,'calendar'),{recursive:true});
writeFileSync(join(here,'calendar/30-day-calendar.md'),calendar);
writeFileSync(join(kit,'MONTH_POSTS.md'),calendar);

// CSV: 900 placements
const headers=['Date','Weekday','Day','Slot','Series','Post ID','Placement ID','Platform','Time (WAT)','Timezone','Platform format','Core format','Pillar','Topic','Hook / first frame','Script / slide / image copy','Caption','Single CTA','Destination (verify)','Keyword','Daily offer','Dated source URL','Dated source date','Trend verification gate','AI disclosure','Expected asset','Fallback','Status','Actual post URL','Notes'];
const rows=[headers];
for (const pl of placements) rows.push([pl.date,weekdays[new Date(pl.date+'T00:00:00Z').getUTCDay()],pl.day,pl.slot,pl.series,pl.postId,pl.placementId,pl.platform,pl.time,source.timezone,pl.format,posts.find(p=>p.id===pl.postId).format,pl.pillar,pl.topic,pl.hook,pl.body,pl.caption,pl.cta,urlFor(pl.route),pl.keyword,pl.offerKeyword,pl.sourceUrl||'',pl.sourceDate||'',pl.verification||'',pl.aiDisclosure?(posts.find(p=>p.id===pl.postId).format==='Screen demo'?'AI voice · Easywurld + platform setting':'AI presenter · Easywurld + platform setting'):'Not planned; reassess if method changes','assets/'+pl.postId+'/'+pl.asset,pl.fallback,'Draft','','Not scheduled. Human approval required.']);
const csv=rows.map(r=>r.map(csvCell).join(',')).join('\n')+'\n';
writeFileSync(join(kit,'content_calendar.csv'),csv);
writeFileSync(join(here,'calendar/content-calendar.csv'),csv);

// Trend verification log
const trendHeaders=['Post ID','Date','Candidate trend','Dated source','Dated source date','Current example URL','Platform','Date checked','Rights checked by','Relevance note','Reviewer','Decision','Notes'];
const trendRows=[trendHeaders];
for (const p of posts.filter(p=>p.seriesKey==='trend')) trendRows.push([p.id,p.date,p.topic.replace('Trend Desk: ',''),p.sourceUrl,p.sourceDate,'','','','','','','HOLD','Do not claim live trend until verified.']);
writeFileSync(join(here,'TREND_VERIFICATION.csv'),trendRows.map(r=>r.map(csvCell).join(',')).join('\n')+'\n');

// Measurement: 900 placements, blank metrics
const metricHeaders=['Placement ID','Post ID','Scheduled date','Platform','Series','Format','Topic','24h views/plays','24h avg watch seconds','24h completion %','7d views/plays','7d saves','7d shares','7d profile visits','Relevant comments','WhatsApp keyword enquiries','Qualified project briefs','Confirmed sales','Actual post URL','Observed lesson','Next single change'];
writeFileSync(join(here,'MEASUREMENT.csv'),[metricHeaders,...placements.map(pl=>[pl.placementId,pl.postId,pl.date,pl.platform,pl.series,pl.format,pl.topic,...Array(metricHeaders.length-7).fill('')])].map(r=>r.map(csvCell).join(',')).join('\n')+'\n');

// Offline app
const shell=readFileSync(join(kit,'build/shell.html'),'utf8');
const app=readFileSync(join(kit,'build/app-script.js'),'utf8');
const data={...plan};
writeFileSync(join(kit,'EASYWURLD_POST_COMMANDER.html'),shell.replace('<!--APP_SCRIPT-->','<script>'+app.replace('/*__DATA__*/ null',JSON.stringify(data).replaceAll('<','\\u003c'))+'</script>'));
writeFileSync(join(kit,'build/kit-dates.mjs'),`/* Compatibility only. Active source: marketing/series-plan.json. */\nexport const START_DATE = ${JSON.stringify(source.startDate)};\nexport function dateFor(i) {\n  const dt = new Date(Date.UTC(2026,10,2+i));\n  return { iso:dt.toISOString().slice(0,10),day:dt.getUTCDate(),month:dt.toLocaleString('en',{month:'short',timeZone:'UTC'}),year:dt.getUTCFullYear(),weekday:dt.toLocaleString('en',{weekday:'long',timeZone:'UTC'}),label:dt.toLocaleString('en',{weekday:'long',day:'numeric',month:'short',timeZone:'UTC'}) };\n}\nexport function shortFor(i) { const d=dateFor(i); return d.day+' '+d.month; }\nexport function weekdayFor(i) { return dateFor(i).weekday; }\n`);
console.log(`Built ${days.length} days, ${posts.length} core posts, ${placements.length} platform placements.`);
console.log('Formats:',fmtCount);
console.log('Series:',seriesCount);
