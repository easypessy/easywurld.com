#!/usr/bin/env node
/** Dependency-free checks for the 10/day series campaign and generated surfaces. */
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
const occupied = new Map();

check(() => {
  assert.equal(plan.startDate, '2026-11-02');
  assert.equal(plan.endDate, '2026-12-01');
  assert.equal(plan.timezone, 'Africa/Lagos');
  assert.deepEqual(plan.platforms, ['TikTok','Instagram','Facebook']);
  assert.equal(plan.days.length, 30);
  assert.equal(plan.posts.length, 300);
  assert.equal(plan.placements.length, 900);
  assert.equal(plan.counts.corePosts, 300);
  assert.equal(plan.counts.placements, 900);
  assert.equal(plan.series.length, 10);
  assert.equal(new Set(plan.series.map(s=>s.slot)).size, 10);
  assert.deepEqual(plan.series.map(s=>s.slot), [1,2,3,4,5,6,7,8,9,10]);
}, 'Campaign shape');

for (const d of plan.days) {
  check(() => {
    const dt = new Date(Date.UTC(2026,10,1+d.day));
    assert.equal(d.iso, dt.toISOString().slice(0,10));
    const dayPosts = plan.posts.filter(p=>p.day===d.day);
    assert.equal(dayPosts.length, 10, 'not 10 core posts');
    assert.deepEqual(dayPosts.map(p=>p.slot), [1,2,3,4,5,6,7,8,9,10], 'slot coverage');
    for (const platform of plan.platforms) {
      const rows = plan.placements.filter(x=>x.day===d.day&&x.platform===platform);
      assert.equal(rows.length, 10, platform+' does not have 10 placements');
      assert.equal(new Set(rows.map(r=>r.slot)).size, 10);
    }
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
    assert.equal(p.status, 'Draft');
    for (const k of ['topic','hook','cta','visual','edit','prompt','asset','duration','fallback','series','seriesKey','pillar','objective','caption']) {
      assert(p[k] && String(p[k]).trim().length > (k==='seriesKey'?1:3), 'missing '+k);
    }
    assert(!/\b(TODO|TBD|Lorem ipsum|\[insert|click here to add)\b/i.test(JSON.stringify(p)), 'unfinished copy');
    if (p.script) assert(words(p.script) >= 25 && words(p.script) <= 190, 'script length '+words(p.script));
    if (p.slides) { assert.equal(p.slides.length, 5, 'carousel not 5 slides'); for (const s of p.slides) assert(words(s) >= 2, 'empty slide'); }
    if (p.staticCopy) { assert(words(p.staticCopy) >= 3 && words(p.staticCopy) <= 45, 'static copy length '+words(p.staticCopy)); }
    assert(p.script || p.slides || p.staticCopy, 'no core copy');
    assert(p.caption.includes('#Easywurld'), 'missing brand hashtag');
    if (p.aiDisclosure) assert(/AI-generated|AI voice/i.test(p.caption), 'missing caption AI disclosure');
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
      if (p.aiDisclosure) assert(/AI-generated|AI voice/i.test(pl.caption), platform+' caption missing AI disclosure');
      if (p.seriesKey === 'trend') assert(/Dated|Source:|verify/i.test(pl.caption), platform+' trend caption missing verification');
    }
    assert(existsSync(resolve(here,'briefs',p.id+'.md')), 'brief missing');
  }, p.id);
}

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
  assert.equal(csv.length, 901);
  assert.equal(csv[0].length, 30);
  for (const r of csv) assert.equal(r.length, 30, 'ragged CSV');
  const rows=csv.slice(1);
  assert.equal(rows.filter(r=>r[7]==='TikTok').length,300);
  assert.equal(rows.filter(r=>r[7]==='Instagram').length,300);
  assert.equal(rows.filter(r=>r[7]==='Facebook').length,300);
  for (const r of rows) {
    assert.equal(r[9], 'Africa/Lagos');
    assert.equal(r[27], 'Draft');
    assert.equal(r[28], '');
    assert(r[0] >= '2026-11-02' && r[0] <= '2026-12-01');
    assert(r[16].includes('#Easywurld'));
  }
  assert.equal(read('marketing/calendar/content-calendar.csv'), read('launch-content/social-command/content_calendar.csv'));
}, 'Placement CSV');

check(() => {
  const rows=parseCSV(read('marketing/MEASUREMENT.csv'));
  assert.equal(rows.length, 901);
  assert.equal(rows[0].length, 21);
  for (const r of rows.slice(1)) {
    assert.equal(r.length, 21, 'ragged metrics');
    assert(r.slice(7).every(x=>x===''), 'prefilled metric');
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
  assert(calendar.indexOf('Strategy before production') < calendar.indexOf('EW-D01-S01'));
  assert.equal(calendar, read('launch-content/social-command/MONTH_POSTS.md'));
  for (const p of plan.posts) assert(calendar.includes(p.id), 'calendar missing '+p.id);
  assert(!calendar.includes('2026-10-19'));
}, 'Documents');

check(() => {
  const html=read('launch-content/social-command/EASYWURLD_POST_COMMANDER.html');
  assert(html.includes('Series Studio'));
  assert(html.includes('300 core posts'));
  assert(html.includes('900</strong> total placements'));
  assert(html.includes('No social accounts connected'));
  const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
  new Script(script);
  assert(!script.includes('/*__DATA__*/ null'), 'unreplaced data placeholder');
  assert(!/<script[^>]+src=|<link[^>]+href=/i.test(html), 'offline app has external dependency');
  for (const p of plan.posts) assert(html.includes(p.id), 'app missing '+p.id);
  assert(script.includes("'easywurld-series-v4'"));
}, 'Offline app');

check(() => {
  for (const file of ['marketing/STRATEGY.md','marketing/SERIES_PLAYBOOK.md','marketing/PRODUCTION.md','marketing/brand-prompt.md','marketing/README.md','marketing/SOURCES.md']) assert(existsSync(resolve(root,file)), file);
  const series=read('marketing/SERIES_PLAYBOOK.md');
  for (const s of plan.series) assert(series.includes(s.name), 'playbook missing '+s.name);
  const prod=read('marketing/PRODUCTION.md');
  assert(prod.includes('10 core posts') && prod.includes('900'));
  assert(read('marketing/brand-prompt.md').includes('300 core posts'));
}, 'Strategy documents');

check(() => {
  const required=['marketing/assets/series/01-if-i-ran-this-account.png','marketing/assets/memes/EW-D01-S05.png','marketing/assets/memes/EW-D01-S08.png','marketing/assets/launch-day/EW-D01-S01_slide-1.png','marketing/assets/launch-day/EW-D01-S01_carousel.zip','marketing/assets/launch-day/EW-D01-S06_slide-5.png','marketing/assets/launch-day/EW-D01-S10_slide-5.png','marketing/assets/video/video-overlay-template.png','marketing/assets/video/video-safe-area-guide.png'];
  for (const f of required) assert(existsSync(resolve(root,f)), 'starter asset missing '+f);
  assert(existsSync(resolve(here,'CONTENT_PLAN.pdf')), 'PDF missing');
  assert(read('marketing/build-plan.mjs').includes("'series-plan.json'"));
}, 'Starter assets and PDF');

check(() => new Script(read('launch-content/social-command/build/app-script.js')), 'App source syntax');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS: 30 days, 300 core posts, 900 platform placements, 10 series, 10/day/platform.');
console.log('PASS: scripts/slides/memes, captions, offer price and DIY gates, trend holds, CSV, metrics, app, docs and starter assets.');
