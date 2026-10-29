#!/usr/bin/env node
/** Dependency-free checks for the active campaign and its generated surfaces. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { Script } from 'node:vm';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const plan=JSON.parse(read('marketing/content-plan.json'));
const posts=plan.posts;
const errors=[];
function check(fn,label){try{fn();}catch(e){errors.push(label+': '+e.message);}}
function parseCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(cell);cell='';}
    else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}
  return rows;
}
check(()=>{
  assert.equal(plan.startDate,'2026-11-02');assert.equal(plan.endDate,'2026-12-01');
  assert.equal(plan.timezone,'Africa/Lagos');assert.equal(plan.time,'18:30');
  assert.equal(posts.length,22);assert.equal(plan.weekends.length,8);
  assert.equal(new Set(posts.map(p=>p.id)).size,22);
  assert.equal(new Set(posts.map(p=>p.day)).size,22);
  const counts={};for(const p of posts)counts[p.format]=(counts[p.format]||0)+1;
  assert.deepEqual(counts,{'Carousel':5,'AI talking head':10,'Screen demo':5,'Relatable static':2});
  const pillars={};for(const p of posts)pillars[p.pillar]=(pillars[p.pillar]||0)+1;
  assert.deepEqual(pillars,{Trust:6,Teach:9,Show:4,Offer:3});
},'Campaign shape');
const occupied=new Set();
for(const p of posts){
  check(()=>{
    const dt=new Date(Date.UTC(2026,10,1+p.day));
    assert(dt.getUTCDay()>=1&&dt.getUTCDay()<=5,'Main post on weekend');
    assert(!occupied.has(p.day),'Duplicate day');occupied.add(p.day);
    for(const k of ['id','format','pillar','primary','topic','problem','objective','hook','caption','cta','visual','edit','prompt','asset','duration','fallback'])assert(p[k]&&String(p[k]).length>2,k+' missing');
    assert(p.id===`EW-${String(p.day).padStart(3,'0')}`);
    assert(p.script||p.slides?.length===5||p.staticCopy,'Missing format copy');
    assert(!/\b(TODO|TBD|Lorem ipsum)\b/i.test(JSON.stringify(p)),'Unfinished copy');
    assert(p.caption.includes('#Easywurld'),'Missing brand hashtag');
    if(p.aiDisclosure)assert(/AI-generated|AI voice|AI-generated presenter/i.test(p.caption),'Missing caption disclosure');
    if(p.format==='Screen demo')assert(/concept|sample/i.test(p.caption),'Missing sample caption');
    if(p.demoPath)assert(existsSync(resolve(root,'client/public'+p.demoPath)),'Demo source missing: '+p.demoPath);
    if(p.sourcePath)assert(existsSync(resolve(root,p.sourcePath)),'Source missing');
    assert(existsSync(resolve(here,'briefs',p.id+'.md')),'Brief missing');
    if(p.script){const words=p.script.split(/\s+/).length;assert(words>=50&&words<=95,'Script length '+words);}
  },p.id);
}
check(()=>{
  for(const w of plan.weekends){const dt=new Date(Date.UTC(2026,10,1+w.day));assert([0,6].includes(dt.getUTCDay()));assert(!occupied.has(w.day));assert(w.detail.length>50);}
  assert.equal(occupied.size+plan.weekends.length,30);
},'Weekend coverage');
check(()=>{
  const source=read('client/src/data/offers.ts');
  for(const p of posts){
    if(p.route.startsWith('/offers/'))assert(source.includes('"slug": "'+p.route.split('/').pop()+'"'),'Offer route missing '+p.route);
    if(p.keyword&&p.keyword!=='PLAYBOOK / CLEAR / ENGINE')assert(source.includes('"keyword": "'+p.keyword+'"'),'Keyword missing');
  }
  assert(source.includes('export const OFFER_PRICE = 5000'));
},'Offer source');
const csv=parseCSV(read('launch-content/social-command/content_calendar.csv'));
check(()=>{
  assert.equal(csv.length,54);assert.equal(csv[0].length,26);
  for(const r of csv)assert.equal(r.length,26,'Ragged CSV row');
  const rows=csv.slice(1);assert.equal(rows.filter(r=>r[4]==='Primary').length,22);assert.equal(rows.filter(r=>r[4]==='Optional').length,31);
  for(const r of rows){assert.equal(r[23],'Draft');assert.equal(r[24],'');assert.equal(r[7],'Africa/Lagos');assert(r[0]>='2026-11-02'&&r[0]<='2026-12-01');}
  assert.equal(read('marketing/calendar/content-calendar.csv'),read('launch-content/social-command/content_calendar.csv'));
},'CSV');
check(()=>{
  const rows=parseCSV(read('marketing/MEASUREMENT.csv'));assert.equal(rows.length,23);
  for(const r of rows.slice(1)){assert.equal(r.length,18);assert(r.slice(4).every(x=>x===''),'Prefilled metrics');}
},'Measurement sheet');
check(()=>{
  const html=read('launch-content/social-command/EASYWURLD_POST_COMMANDER.html');
  assert(html.includes('Strategy before volume'));assert(html.includes('No social accounts connected'));
  const script=html.match(/<script>([\s\S]*)<\/script>/)[1];new Script(script);
  assert(!script.includes('/*__DATA__*/ null'),'Unreplaced data placeholder');
  assert(!/<script[^>]+src=|<link[^>]+href=/i.test(html),'Offline app has external dependency');
  for(const p of posts)assert(html.includes(p.id),'App missing '+p.id);
},'Offline app');
check(()=>{
  const calendar=read('marketing/calendar/30-day-calendar.md');
  assert(calendar.includes('Strategy before production'));assert(calendar.indexOf('Strategy before production')<calendar.indexOf('EW-001'));
  assert.equal(calendar,read('launch-content/social-command/MONTH_POSTS.md'));
  for(const p of posts)assert(calendar.includes(p.id));
  assert(!calendar.includes('2026-10-19'));
  for(const f of ['STRATEGY.md','PRODUCTION.md','brand-prompt.md','README.md'])assert(existsSync(resolve(here,f)));
},'Documents');
check(()=>{
  for(const f of ['EW-001_carousel.zip','EW-001_slide-1.png','EW-001_slide-2.png','EW-001_slide-3.png','EW-001_slide-4.png','EW-001_slide-5.png','EW-005_tabs-static.png','EW-017_contact-route-static.png','video-overlay-template.png','video-safe-area-guide.png'])assert(existsSync(resolve(here,'assets/launch-week',f)),f);
  assert(existsSync(resolve(here,'CONTENT_PLAN.pdf')),'PDF missing');
  assert(read('marketing/build-plan.mjs').includes("'content-plan.json'"));
},'Starter assets');
// Compile the source template with a null data payload; the generated app is compiled above.
check(()=>new Script(read('launch-content/social-command/build/app-script.js')),'App source syntax');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('PASS: 30 dates, 22 primary posts, 4 formats, 8 weekend tasks, 31 optional reuses.');
console.log('PASS: scripts, disclosures, demo sources, offer routes, CSV, blank metrics, offline app and starter assets.');
