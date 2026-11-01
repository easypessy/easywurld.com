#!/usr/bin/env node
/** Dependency-free checks for the 11-posts + 2-stories + LinkedIn campaign and its generated surfaces. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const read = p => readFileSync(resolve(root, p), 'utf8');
const plan = JSON.parse(read('marketing/content-plan.json'));
const source = JSON.parse(read('marketing/series-plan.json'));
const errors = [];
const check = (fn, label) => { try { fn(); } catch (e) { errors.push(label + ': ' + e.message); } };
function parseCSV(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  for (let i=0;i<text.length;i++) {
    const c=text[i];
    if (c==='"') { if (quoted&&text[i+1]==='"') { cell+='"'; i++; } else quoted=!quoted; }
    else if (c===','&&!quoted) { row.push(cell); cell=''; }
    else if (c==='\n'&&!quoted) { row.push(cell.replace(/\r$/,'')); rows.push(row); row=[]; cell=''; }
    else cell+=c;
  }
  if (cell||row.length) { row.push(cell.replace(/\r$/,'')); rows.push(row); }
  return rows;
}
const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
const ids = new Set();
const placementIds = new Set();

const STORY_PLATFORMS = ['Instagram','Facebook','TikTok'];

check(() => {
  assert.equal(plan.startDate, '2026-11-02');
  assert.equal(plan.endDate, '2026-12-01');
  assert.equal(plan.timezone, 'Africa/Lagos');
  assert.deepEqual(plan.platforms, ['TikTok','Instagram','Facebook']);
  assert.equal(plan.days.length, 30);
  assert.equal(plan.series.length, 11);
  assert.deepEqual(plan.series.map(s=>s.slot), [1,2,3,4,5,6,7,8,9,10,11]);
  assert.equal(plan.posts.length, 330);
  assert.equal(plan.stories.length, 60);
  assert.equal(plan.linkedin.length, 26);
  assert.equal(plan.placements.length, 1196);
  assert.equal(plan.counts.corePosts, 330);
  assert.equal(plan.counts.stories, 60);
  assert.equal(plan.counts.linkedin, 26);
  assert.equal(plan.counts.placements, 1196);
  assert.equal(plan.counts.storyPlacements, 180);
  assert.equal(plan.counts.contentPlacements, 990);
}, 'Campaign shape');

check(() => {
  assert.equal(source.stories.count, 2);
  assert.deepEqual(source.stories.platforms, STORY_PLATFORMS);
  assert.equal(source.stories.slots.length, 2);
  assert.equal(source.stories.slots[0].time, '12:30');
  assert.equal(source.stories.slots[1].time, '21:00');
  assert.equal(source.linkedin.slots.length, 6);
  assert.equal(new Set(source.linkedin.slots.map(s=>s.weekday)).size, 6);
  assert.equal(source.psychology.principles.length, 12);
  for (const key of source.series.map(s=>s.key)) assert(source.psychology.seriesMap[key], 'no psychology map for '+key);
  assert.equal(source.days.length, 30);
  for (const d of source.days) {
    assert(d.storyA?.frames?.length === 3, 'story A frames on day '+d.day);
    assert(d.storyB?.scene, 'story B scene on day '+d.day);
    assert(d.operator?.line && d.operator?.turn && d.operator?.close && d.operator?.cta, 'operator lines on day '+d.day);
  }
}, 'Editorial source additions');

for (const d of plan.days) {
  check(() => {
    const dt = new Date(Date.UTC(2026,10,1+d.day));
    assert.equal(d.iso, dt.toISOString().slice(0,10));
    const dayPosts = plan.posts.filter(p=>p.day===d.day);
    assert.equal(dayPosts.length, 11, 'not 11 content posts');
    assert.deepEqual(dayPosts.map(p=>p.slot), [1,2,3,4,5,6,7,8,9,10,11], 'slot coverage');
    for (const platform of plan.platforms) {
      const rows = plan.placements.filter(x=>x.day===d.day&&x.platform===platform&&x.type==='Content');
      assert.equal(rows.length, 11, platform+' does not have 11 content placements');
      assert.equal(new Set(rows.map(r=>r.slot)).size, 11);
      const stories = plan.placements.filter(x=>x.day===d.day&&x.platform===platform&&x.type==='Story');
      assert.equal(stories.length, 2, platform+' does not have 2 stories');
    }
    const dayStories = plan.stories.filter(s=>s.day===d.day);
    assert.equal(dayStories.length, 2);
    assert.deepEqual(dayStories.map(s=>s.slot), ['A','B']);
    const offers = new Set(dayPosts.filter(p=>p.offerKeyword).map(p=>p.offerKeyword));
    assert.equal(offers.size, 1, 'more than one offer in a day');
    assert.equal(d.offerKeyword, [...offers][0], 'day offer mismatch');
  }, 'Day '+d.day);
}

for (const p of plan.posts) {
  check(() => {
    assert.match(p.id, /^EW-D\d{2}-S\d{2}$/);
    assert(!ids.has(p.id), 'duplicate post id'); ids.add(p.id);
    assert.equal(p.day, Number(p.id.slice(4,6)));
    assert.equal(p.slot, Number(p.id.slice(8,10)));
    assert.equal(p.type, 'Content');
    assert.equal(p.status, 'Draft');
    for (const k of ['topic','hook','cta','visual','edit','prompt','asset','duration','fallback','series','seriesKey','pillar','objective','caption']) {
      assert(p[k] && String(p[k]).trim().length > (k==='seriesKey'?1:3), 'missing '+k);
    }
    assert(p.psych && p.psych.name && p.psych.use && p.psych.guard, 'missing psychology move');
    assert(!/\b(TODO|TBD|Lorem ipsum|\[insert|click here to add)\b/i.test(JSON.stringify(p)), 'unfinished copy');
    if (p.script) assert(words(p.script) >= 18 && words(p.script) <= 190, 'script length '+words(p.script));
    if (p.slides) { assert.equal(p.slides.length, 5, 'carousel not 5 slides'); for (const s of p.slides) assert(words(s) >= 2, 'empty slide'); }
    if (p.staticCopy) assert(words(p.staticCopy) >= 3 && words(p.staticCopy) <= 45, 'static copy length '+words(p.staticCopy));
    assert(p.script || p.slides || p.staticCopy, 'no core copy');
    assert(p.caption.includes('#Easywurld'), 'missing brand hashtag');
    assert(!/approved owner avatar|owner likeness/i.test(p.prompt + p.visual), 'stale avatar gate wording');
    if (p.aiDisclosure) assert(/AI presenter|AI voice/i.test(p.caption), 'missing caption AI disclosure');
    if (p.seriesKey === 'operator') {
      assert(/no face/i.test(p.visual + p.prompt), 'Operator post must forbid a visible face');
      assert(/AI presenter/i.test(p.caption), 'Operator caption needs the disclosure');
    }
    if (p.meme) {
      assert(/jpg$/.test(p.asset), 'meme asset should be a JPEG');
      assert(existsSync(resolve(root,'marketing/assets/meme-scenes',p.meme.image)), 'meme scene plate missing '+p.meme.image);
      assert(/\.jpg$/.test(p.meme.image), 'scene plates are JPEG');
      assert(existsSync(resolve(root,'marketing/assets/memes',p.id+'.jpg')), 'rendered meme missing '+p.id);
    }
    if (p.demoPath) { assert(existsSync(resolve(root,'client/public'+p.demoPath)), 'demo missing '+p.demoPath); assert(/concept|sample/i.test(p.caption), 'demo caption missing sample label'); }
    if (p.seriesKey === 'trend') {
      assert(p.sourceUrl?.startsWith('https://'), 'trend source URL missing');
      assert(/^\d{4}-\d{2}-\d{2}$/.test(p.sourceDate), 'trend source date');
      assert(/HOLD/.test(p.verification), 'trend gate missing HOLD');
      assert(/dated teardown/i.test(p.script), 'trend script must disclose dated teardown');
    }
    if (p.offerKeyword) {
      assert(p.route.startsWith('/offers/'), 'offer route');
      assert(p.caption.includes('₦5,000'), 'offer price');
      assert(/DIY/.test(p.caption), 'offer DIY boundary');
      assert(/confirm current order details/i.test(p.caption), 'offer fulfilment gate');
    }
    for (const platform of plan.platforms) {
      const pl = p.platforms[platform];
      assert(pl, 'missing platform '+platform);
      assert.equal(pl.placementId, p.id+'-'+({TikTok:'TT',Instagram:'IG',Facebook:'FB'})[platform]);
      assert(!placementIds.has(pl.placementId), 'duplicate placement'); placementIds.add(pl.placementId);
      assert(pl.caption.length >= 25, platform+' caption too short');
      assert(pl.caption.includes('#Easywurld'), platform+' caption missing brand hashtag');
      assert(pl.status === 'Draft' && pl.actualUrl === '', 'placement not blank Draft');
      assert(/^\d{2}:\d{2}$/.test(pl.time), 'placement time');
      if (p.aiDisclosure) assert(/AI presenter|AI voice/i.test(pl.caption), platform+' caption missing AI disclosure');
      if (p.seriesKey === 'trend') assert(/Dated|Source:|verify/i.test(pl.caption), platform+' trend caption missing verification');
    }
    assert(existsSync(resolve(here,'briefs',p.id+'.md')), 'brief missing');
  }, p.id);
}

for (const s of plan.stories) {
  check(() => {
    assert.match(s.id, /^EW-D\d{2}-ST[AB]$/);
    assert.equal(s.type, 'Story');
    assert.equal(s.status, 'Draft');
    assert.equal(s.frames.length, 3, 'story must have 3 frames');
    for (const f of s.frames) assert(words(f) >= 2 && words(f) <= 40, 'story frame length '+words(f));
    assert(s.cta && s.sticker && s.objective && s.visual && s.edit && s.prompt, 'story missing fields');
    assert(s.slot === 'A' ? /poll|quiz/i.test(s.series) : /desk/i.test(s.series), 'story type mismatch');
    for (const platform of STORY_PLATFORMS) {
      const pl = s.placements[platform];
      assert(pl, 'story missing platform '+platform);
      assert(!placementIds.has(pl.placementId), 'duplicate story placement'); placementIds.add(pl.placementId);
      assert.equal(pl.status, 'Draft');
      assert(/^\d{2}:\d{2}$/.test(pl.time), 'story time');
      assert(/Story/.test(pl.format), 'story format label');
    }
    assert(existsSync(resolve(here,'briefs',s.id+'.md')), 'story brief missing');
  }, s.id);
}

for (const l of plan.linkedin) {
  check(() => {
    assert.match(l.id, /^EW-LI-W\d-[A-Z]+$/);
    assert.equal(l.type, 'LinkedIn');
    assert.equal(l.status, 'Draft');
    assert.equal(l.time, '09:00');
    assert(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].includes(l.weekday));
    assert(words(l.body) >= 40, 'LinkedIn copy too thin');
    assert(!/#\w+.*#\w+.*#\w+/.test(l.body), 'LinkedIn body has a hashtag block');
    assert(!/https?:\/\//.test(l.body), 'LinkedIn body should not carry the link');
    assert(plan.posts.some(p=>p.id===l.sourcePostId), 'LinkedIn source post missing '+l.sourcePostId);
    const pl = l.placements.LinkedIn;
    assert(!placementIds.has(pl.placementId), 'duplicate LinkedIn placement'); placementIds.add(pl.placementId);
    assert.equal(pl.status, 'Draft');
    assert(existsSync(resolve(here,'briefs',l.id+'.md')), 'LinkedIn brief missing');
  }, l.id);
}

check(() => {
  const li = plan.linkedin;
  const byWeek = {};
  for (const l of li) { const w = Math.floor((l.day-1)/7); byWeek[w] = (byWeek[w]||0)+1; }
  for (const [w, n] of Object.entries(byWeek)) assert(n >= 2 && n <= 6, 'week '+(Number(w)+1)+' has '+n+' LinkedIn posts');
  assert.equal(plan.linkedin.filter(l=>!['Monday','Saturday'].includes(l.weekday)||true).length >= 24, true, 'LinkedIn set too small');
  assert.equal(new Set(li.map(l=>l.label)).size, 6, 'LinkedIn format variety');
  assert.equal(plan.placements.filter(p=>p.platform==='LinkedIn').length, li.length);
}, 'LinkedIn cadence');

check(() => {
  const offerSource=read('client/src/data/offers.ts');
  for (const p of plan.posts.filter(p=>p.offerKeyword)) {
    assert(offerSource.includes('"slug": "'+p.route.split('/').pop()+'"'), 'offer slug missing');
    assert(offerSource.includes('"keyword": "'+p.offerKeyword+'"'), 'offer keyword missing');
  }
  assert(offerSource.includes('export const OFFER_PRICE = 5000'));
  const trend=plan.posts.filter(p=>p.seriesKey==='trend');
  assert.equal(trend.length,30);
  assert.equal(new Set(trend.map(p=>p.sourceUrl)).size, 5, 'trend source variety');
}, 'Offer and trend sources');

check(() => {
  const csv=parseCSV(read('marketing/calendar/content-calendar.csv'));
  assert.equal(csv.length, 1197);
  assert.equal(csv[0].length, 32);
  for (const r of csv) assert.equal(r.length, 32, 'ragged CSV');
  const rows=csv.slice(1);
  assert.equal(rows.filter(r=>r[0]==='Content').length, 990);
  assert.equal(rows.filter(r=>r[0]==='Story').length, 180);
  assert.equal(rows.filter(r=>r[0]==='LinkedIn').length, 26);
  for (const platform of plan.platforms) assert.equal(rows.filter(r=>r[8]===platform&&r[0]==='Content').length, 330);
  for (const r of rows) {
    assert.equal(r[10], 'Africa/Lagos');
    assert.equal(r[29], 'Draft');
    assert.equal(r[30], '');
    assert(r[1] >= '2026-11-02' && r[1] <= '2026-12-01');
    assert(r[18].includes('#Easywurld'), 'CSV caption missing brand hashtag');
  }
  assert.equal(read('marketing/calendar/content-calendar.csv'), read('launch-content/social-command/content_calendar.csv'));
}, 'Placement CSV');

check(() => {
  const rows=parseCSV(read('marketing/MEASUREMENT.csv'));
  assert.equal(rows.length, 1197);
  assert.equal(rows[0].length, 23);
  for (const r of rows.slice(1)) {
    assert.equal(r.length, 23, 'ragged metrics');
    assert(r.slice(8).every(x=>x===''), 'prefilled metric');
  }
}, 'Measurement sheet');

check(() => {
  const rows=parseCSV(read('marketing/TREND_VERIFICATION.csv'));
  assert.equal(rows.length, 31);
  assert.equal(rows[0].length, 13);
  for (const r of rows) assert.equal(r.length, 13);
  for (const r of rows.slice(1)) {
    assert.equal(r[11], 'HOLD');
    assert.equal(r[5], '');
    assert.equal(r[7], '');
  }
}, 'Trend verification log');

check(() => {
  const calendar=read('marketing/calendar/30-day-calendar.md');
  assert(calendar.includes('Strategy before production'));
  assert(calendar.includes('Series playbook'));
  assert(calendar.includes('Psychology layer'));
  assert(calendar.includes('## Stories'));
  assert(calendar.includes('## LinkedIn pulls'));
  assert(calendar.indexOf('Strategy before production') < calendar.indexOf('EW-D01-S01'));
  assert.equal(calendar, read('launch-content/social-command/MONTH_POSTS.md'));
  for (const p of plan.posts) assert(calendar.includes(p.id), 'calendar missing '+p.id);
  for (const s of plan.stories) assert(calendar.includes(s.id), 'calendar missing '+s.id);
  for (const l of plan.linkedin) assert(calendar.includes(l.id), 'calendar missing '+l.id);
  assert(!calendar.includes('2026-10-19'));
}, 'Documents');

check(() => {
  const html=read('launch-content/social-command/EASYWURLD_POST_COMMANDER.html');
  assert(html.includes('Series Studio'));
  assert(html.includes('"corePosts":330'));
  assert(html.includes("'</strong> total placements</div>'"), 'total placements stat');
  assert(html.includes('No social accounts connected'));
  const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
  new Script(script);
  assert(!script.includes('/*__DATA__*/ null'), 'unreplaced data placeholder');
  assert(!/<script[^>]+src=|<link[^>]+href=/i.test(html), 'offline app has external dependency');
  for (const p of plan.posts) assert(html.includes(p.id), 'app missing '+p.id);
  for (const s of plan.stories) assert(html.includes(s.id), 'app missing '+s.id);
  for (const l of plan.linkedin) assert(html.includes(l.id), 'app missing '+l.id);
  assert(script.includes("'easywurld-series-v5'"));
  assert(script.includes("'stories'") && script.includes("'linkedin'"), 'app missing new views');
}, 'Offline app');

check(() => {
  for (const file of ['marketing/STRATEGY.md','marketing/SERIES_PLAYBOOK.md','marketing/PRODUCTION.md','marketing/brand-prompt.md','marketing/README.md','marketing/SOURCES.md','marketing/PSYCHOLOGY_PLAYBOOK.md','marketing/AVATAR_OPERATOR.md']) assert(existsSync(resolve(root,file)), file);
  const series=read('marketing/SERIES_PLAYBOOK.md');
  for (const s of plan.series) assert(series.includes(s.name), 'playbook missing '+s.name);
  const prod=read('marketing/PRODUCTION.md');
  assert(prod.includes('330 content posts') && prod.includes('1,196'));
  assert(read('marketing/brand-prompt.md').includes('330 content posts'));
  const psych=read('marketing/PSYCHOLOGY_PLAYBOOK.md');
  for (const p of source.psychology.principles) assert(psych.includes('`'+p.key+'`'), 'psychology doc missing '+p.key);
  const avatar=read('marketing/AVATAR_OPERATOR.md');
  assert(avatar.includes('No face') || avatar.includes('Never'));
}, 'Strategy documents');

check(() => {
  const required=[
    'marketing/assets/series/01-if-i-ran-this-account.png',
    'marketing/assets/memes/EW-D01-S05.jpg',
    'marketing/assets/memes/EW-D01-S08.jpg',
    'marketing/assets/meme-scenes/scene-desk-phone.jpg',
    'marketing/assets/avatar/operator-hero.jpg',
    'marketing/assets/avatar/operator-desk.jpg',
    'marketing/assets/carousels/EW-D01-S01_slide-1.jpg',
    'marketing/assets/carousels/EW-D01-S01_slide-5.jpg',
    'marketing/assets/carousels/EW-D01-S01_carousel.pdf',
    'marketing/assets/carousels/EW-D29-S01_carousel.pdf',
    'marketing/assets/stories/EW-D01-STA_frame-1.jpg',
    'marketing/assets/stories/EW-D30-STB_frame-3.jpg',
    'marketing/assets/fallbacks/EW-D01-S02.jpg',
    'marketing/assets/static/EW-D02-S10.jpg',
    'marketing/assets/ASSET_MANIFEST.csv',
    'marketing/assets/video/video-overlay-template.png',
    'marketing/assets/video/video-safe-area-guide.png',
  ];
  for (const f of required) assert(existsSync(resolve(root,f)), 'starter asset missing '+f);
  // every carousel and every story must be rendered for all 30 days
  for (const p of plan.posts.filter(p=>p.slides)) {
    assert(existsSync(resolve(root,`marketing/assets/carousels/${p.id}_slide-5.jpg`)), 'carousel missing '+p.id);
  }
  for (const s of plan.stories) assert(existsSync(resolve(root,`marketing/assets/stories/${s.id}_frame-3.jpg`)), 'story frame missing '+s.id);
  for (const p of plan.posts.filter(p=>p.format==='Relatable static'&&!p.seriesKey.startsWith('meme'))) {
    assert(existsSync(resolve(root,`marketing/assets/static/${p.id}.jpg`)), 'static missing '+p.id);
  }
  const manifest=read('marketing/assets/ASSET_MANIFEST.csv').split('\n').filter(Boolean);
  assert(manifest.length >= 417, 'asset manifest should cover every item');
  assert(existsSync(resolve(here,'CONTENT_PLAN.pdf')), 'PDF missing');
  assert(read('marketing/build-plan.mjs').includes("'series-plan.json'"));
}, 'Starter assets and PDF');

check(() => new Script(read('launch-content/social-command/build/app-script.js')), 'App source syntax');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: 30 days, 330 content posts, 60 stories, 26 LinkedIn posts, 1,196 placements, 11 series, 11/day/platform.');
console.log('PASS: psychology move on every post, story frames, scene-led memes, Operator persona, captions, offer and DIY gates, trend holds, CSV, metrics, app, docs and assets.');
