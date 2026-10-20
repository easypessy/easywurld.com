#!/usr/bin/env node
/**
 * Easywurld — Zero-API Facebook Scheduler Kit builder.
 *
 * Reads the media-ready post pack (Easywurld_Posts_By_Day, extracted from
 * launch-content/Easywurld_Posts_By_Day.zip) and builds, with ZERO dependencies:
 *
 *   launch-content/fb-scheduler/Easywurld_FB_Scheduler_Console.html
 *   launch-content/fb-scheduler/Easywurld_FB_Reminders.ics
 *   launch-content/fb-scheduler/Easywurld_FB_Google_Calendar_Import.csv
 *   launch-content/fb-scheduler/fb-posts.json
 *
 * No Facebook API, no app review, no business verification anywhere in this kit.
 * Run:  node tools/fb-scheduler/build-fb-kit.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

// Day 1 of the pack. The active Easywurld campaign starts Mon 19 Oct 2026
// (matches the Post Commander / 30-day plan in Google Drive). To shift the
// whole run, change this one date and rebuild.
const START_DATE = new Date(2026, 9, 19); // month is 0-based: 9 = October
const SRC_DIR = path.join(REPO_ROOT, 'tmp', 'kit', 'Easywurld_Posts_By_Day');
const OUT_DIR = path.join(REPO_ROOT, 'launch-content', 'fb-scheduler');

const SLOT_META = {
  '0800': {
    kind: 'carousel',
    time: '08:00',
    title: 'Morning carousel · Facebook feed',
    format: '6-slide carousel (Slide_1.png → Slide_6.png)',
    core: true,
  },
  '1230': {
    kind: 'video',
    time: '12:30',
    title: 'Short video · Facebook reel/video',
    format: 'Video.mp4 (+ caption with voiceover notes)',
    core: true,
  },
  '1500': {
    kind: 'feed',
    time: '15:00',
    title: 'Honest-answer post · Facebook feed',
    format: 'Image.png + text',
    core: true,
  },
  '2000': {
    kind: 'feed',
    time: '20:00',
    title: 'Second feed post · Facebook feed',
    format: 'Image.png + text',
    core: false,
  },
};

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n) => String(n).padStart(2, '0');

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function ymd(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function collectPosts() {
  const posts = [];
  for (let day = 1; day <= 30; day++) {
    const dayDir = path.join(SRC_DIR, `Day_${pad(day)}`);
    if (!fs.existsSync(dayDir)) throw new Error(`Missing ${dayDir}`);
    const date = addDays(START_DATE, day - 1);
    const folders = fs
      .readdirSync(dayDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /facebook/i.test(e.name))
      .map((e) => e.name)
      .sort();

    for (const folder of folders) {
      const m = folder.match(/^Post_(\d+)_(\d{4})_(.+)$/);
      if (!m) throw new Error(`Unexpected folder name: ${folder}`);
      const [, slotNo, hhmm, slug] = m;
      const meta = SLOT_META[hhmm];
      if (!meta) throw new Error(`No slot meta for ${hhmm} (${folder})`);
      const dir = path.join(dayDir, folder);
      const caption = fs.readFileSync(path.join(dir, 'Caption.txt'), 'utf8').trim();
      const media = fs
        .readdirSync(dir)
        .filter((f) => f !== 'Caption.txt')
        .sort();
      posts.push({
        id: `D${pad(day)}-${slotNo}`,
        day,
        slot: Number(slotNo),
        date: isoDate(date),
        weekday: WEEKDAYS[date.getDay()],
        hhmm,
        ...meta,
        slug,
        folder: `Easywurld_Posts_By_Day/Day_${pad(day)}/${folder}`,
        media,
        caption,
      });
    }
  }
  return posts.sort((a, b) =>
    a.day === b.day ? a.hhmm.localeCompare(b.hhmm) : a.day - b.day,
  );
}

/* ------------------------------- ICS output ------------------------------ */

function icsEscape(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function foldLine(line) {
  // RFC 5545: fold at 75 octets, continuation lines start with a space.
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const out = [];
  let current = '';
  let currentLen = 0;
  for (const ch of line) {
    const len = Buffer.byteLength(ch, 'utf8');
    if (currentLen + len > 75) {
      out.push(current);
      current = ' ' + ch;
      currentLen = 1 + len;
    } else {
      current += ch;
      currentLen += len;
    }
  }
  if (current) out.push(current);
  return out.join('\r\n');
}

function icsLine(key, value) {
  return foldLine(`${key}:${value}`);
}

function buildIcs(posts) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Easywurld//FB Scheduler Kit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Easywurld Facebook Reminders',
    'X-WR-TIMEZONE:Africa/Lagos',
    'BEGIN:VTIMEZONE',
    'TZID:Africa/Lagos',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0100',
    'TZNAME:WAT',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  for (const p of posts) {
    const [h, min] = [p.hhmm.slice(0, 2), p.hhmm.slice(2)];
    const start = `${ymd(new Date(p.date + 'T00:00:00'))}T${h}${min}00`;
    const endDate = addDays(new Date(p.date + 'T00:00:00'), 0);
    const endMin = Number(h) * 60 + Number(min) + 15;
    const eh = pad(Math.floor(endMin / 60));
    const em = pad(endMin % 60);
    const end = `${ymd(endDate)}T${eh}${em}00`;
    const summary = `FB ${p.time} · ${p.title.replace(/·.*$/, '').trim()} · Day ${p.day}${p.core ? ' (CORE)' : ' (optional)'}`;
    const description = [
      p.caption,
      '',
      `[MEDIA] ${p.folder} → ${p.media.join(', ')}`,
      '[HOW] Open Meta Business Suite → Create post → paste this text, upload the media above, schedule for this date/time (Africa/Lagos). Or post live now.',
    ].join('\n');

    lines.push(
      'BEGIN:VEVENT',
      icsLine('UID', `${p.id}@easywurld-fb-kit`),
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=Africa/Lagos:${start}`,
      `DTEND;TZID=Africa/Lagos:${end}`,
      icsLine('SUMMARY', icsEscape(summary)),
      icsLine('DESCRIPTION', icsEscape(description)),
      icsLine('LOCATION', icsEscape('Facebook Page — Meta Business Suite')),
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      icsLine('DESCRIPTION', icsEscape(`${summary} — open the FB Scheduler Console`)),
      'TRIGGER:-PT10M',
      'END:VALARM',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      icsLine('DESCRIPTION', icsEscape(`${summary} — due now`)),
      'TRIGGER:PT0S',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

/* ------------------------ Google Calendar CSV output --------------------- */

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv(posts) {
  const rows = [
    [
      'Subject',
      'Start Date',
      'Start Time',
      'End Date',
      'End Time',
      'All Day Event',
      'Description',
      'Location',
      'Private',
    ].join(','),
  ];
  for (const p of posts) {
    const d = new Date(p.date + 'T00:00:00');
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const [h, min] = [Number(p.hhmm.slice(0, 2)), Number(p.hhmm.slice(2))];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const endMin = h * 60 + min + 15;
    const eh = endMin >= 1440 ? 0 : Math.floor(endMin / 60);
    const em = endMin % 60;
    const eampm = eh >= 12 ? 'PM' : 'AM';
    const eh12 = eh % 12 === 0 ? 12 : eh % 12;
    const description = [
      p.caption,
      '',
      `[MEDIA] ${p.folder} -> ${p.media.join(', ')}`,
      '[HOW] Meta Business Suite: paste text, upload media, schedule (Africa/Lagos).',
    ].join('\n');
    rows.push(
      [
        `FB ${p.time} - ${p.title} - Day ${p.day}${p.core ? ' (CORE)' : ' (optional)'}`,
        `${mm}/${dd}/${d.getFullYear()}`,
        `${pad(h12)}:${pad(min)} ${ampm}`,
        `${mm}/${dd}/${d.getFullYear()}`,
        `${pad(eh12)}:${pad(em)} ${eampm}`,
        'False',
        csvCell(description),
        'Facebook Page',
        'False',
      ].join(','),
    );
  }
  return rows.join('\n') + '\n';
}

/* ------------------------------ HTML console ----------------------------- */

function buildHtml(posts) {
  const meta = {
    brand: 'Easywurld',
    generated: new Date().toISOString().slice(0, 10),
    startDate: isoDate(START_DATE),
    endDate: isoDate(addDays(START_DATE, 29)),
    total: posts.length,
    whatsapp: '0905 069 0837',
  };
  const json = JSON.stringify({ meta, posts }).replace(/</g, '\\u003c');
  return TEMPLATE.replace('/*__DATA__*/', `window.KIT = ${json};`);
}

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#27473A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FB Scheduler">
<title>Easywurld — FB Scheduler Console</title>
<style>
:root{
  --cream:#FAE7C7; --leaf:#27473A; --deep:#0A4937; --terra:#9E4E2C;
  --ink:#14170F; --paper:#FBF9F4; --line:rgba(39,71,58,.18);
  --ok:#2F6B4F; --fb:#1D4E89;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{background:var(--cream);color:var(--ink);
  font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  padding-bottom:96px;overscroll-behavior-y:none}
h1,h2,h3{margin:0;font-weight:700;color:var(--deep)}
button{font:inherit;color:inherit;cursor:pointer}
a{color:var(--deep)}
.wrap{max-width:760px;margin:0 auto;padding:0 14px}
header{background:var(--leaf);color:var(--cream);padding:14px 0 12px;
  position:sticky;top:0;z-index:30;box-shadow:0 2px 0 rgba(0,0,0,.08)}
header .row{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.brand{font-family:Georgia,serif;font-size:19px;letter-spacing:.12em;font-weight:700}
.slogan{font-size:10px;letter-spacing:.16em;opacity:.75;margin-top:2px}
.hd-right{text-align:right;font-size:11px;opacity:.85}
.progress{height:6px;background:rgba(250,231,199,.22);border-radius:99px;margin-top:10px;overflow:hidden}
.progress i{display:block;height:100%;background:var(--terra);width:0;transition:width .3s}
.pmeta{display:flex;justify-content:space-between;font-size:11px;margin-top:6px;opacity:.9}
nav.tabs{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--paper);
  border-top:1px solid var(--line);display:flex;padding-bottom:env(safe-area-inset-bottom)}
nav.tabs button{flex:1;background:none;border:0;padding:12px 4px 10px;font-size:12px;color:var(--ink)}
nav.tabs button .ic{display:block;font-size:19px;line-height:1}
nav.tabs button.on{color:var(--deep);font-weight:700}
nav.tabs button.on .ic{color:var(--terra)}
.dayscroll{display:flex;gap:7px;overflow-x:auto;padding:12px 0 4px;scrollbar-width:none}
.dayscroll::-webkit-scrollbar{display:none}
.daybtn{flex:0 0 auto;border:1px solid var(--line);background:var(--paper);border-radius:12px;
  padding:7px 11px;font-size:12px;min-width:62px;text-align:center;line-height:1.25}
.daybtn b{display:block;font-size:13px;color:var(--deep)}
.daybtn.today{border-color:var(--terra);background:#fff}
.daybtn.done b::after{content:" ✓";color:var(--ok)}
.chips{display:flex;gap:7px;overflow-x:auto;padding:8px 0 4px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;border:1px solid var(--line);background:transparent;border-radius:99px;
  padding:6px 12px;font-size:12px;color:var(--deep)}
.chip.on{background:var(--deep);color:var(--cream);border-color:var(--deep)}
h2.sechead{font-size:15px;margin:16px 0 8px;display:flex;align-items:center;gap:8px}
h2.sechead small{font:400 12px/1.3 -apple-system,system-ui,sans-serif;color:#5b6155}
.card{background:var(--paper);border:1px solid var(--line);border-radius:14px;margin:10px 0;overflow:hidden}
.card.done{opacity:.62}
.chead{display:flex;gap:10px;align-items:flex-start;padding:12px 13px}
.badge{font-size:10px;letter-spacing:.09em;padding:3px 7px;border-radius:6px;
  background:var(--fb);color:var(--cream);white-space:nowrap;margin-top:2px}
.badge.core{background:var(--leaf)}
.badge.opt{background:#8a6d3b}
.time{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#5b6155}
.ctitle{font-size:15px;font-weight:600;line-height:1.35;margin-top:3px}
.ctype{font-size:11px;color:#5b6155;margin-top:2px}
.tick{margin-left:auto;flex:0 0 auto;border:1.5px solid var(--line);background:var(--paper);
  width:34px;height:34px;border-radius:9px;font-size:16px;line-height:1;color:#8a9084}
.tick.on{background:var(--ok);border-color:var(--ok);color:#fff}
.cbody{padding:0 13px 13px;border-top:1px dashed var(--line);margin-top:2px}
.blk{margin:12px 0 0}
.blk h4{margin:0 0 5px;font-size:11px;letter-spacing:.12em;color:var(--terra);text-transform:uppercase}
.blk pre{margin:0 0 6px;font:14.5px/1.55 -apple-system,system-ui,sans-serif;white-space:pre-wrap;word-break:break-word}
.media{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--deep);
  background:rgba(39,71,58,.07);border-radius:8px;padding:8px 10px;overflow-x:auto}
.note{width:100%;border:1px solid var(--line);border-radius:10px;padding:9px;font:14px/1.45 inherit;
  background:#fff;resize:vertical;min-height:52px;margin-top:4px}
.copyrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.btn{border:1px solid var(--deep);background:var(--deep);color:var(--cream);
  border-radius:9px;padding:9px 13px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;text-align:center}
.btn.ghost{background:transparent;color:var(--deep)}
.btn.terra{background:var(--terra);border-color:var(--terra);color:#fff}
.btn.fb{background:var(--fb);border-color:var(--fb)}
.btn.wide{width:100%}
.mini{font-size:12px;color:#5b6155;margin-top:8px;line-height:1.45}
.hide{display:none!important}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tile{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:12px}
.tile b{display:block;font-size:22px;color:var(--deep);font-family:Georgia,serif}
.tile span{font-size:12px;color:#5b6155}
.helplist{margin:0;padding-left:18px;font-size:14.5px;line-height:1.6}
.helplist li{margin-bottom:9px}
.helplist ol{padding-left:20px}
.stepbox{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin:10px 0}
.stepbox h3{font-size:15px;margin-bottom:8px}
.stepbox ol{margin:0;padding-left:20px;font-size:14px;line-height:1.65}
.warn{background:#fdf3e7;border:1px solid #d9a06b;border-radius:12px;padding:12px 14px;font-size:13.5px;line-height:1.55;margin:10px 0}
dialog{border:0;border-radius:14px;padding:0;max-width:520px;width:92%;background:var(--paper)}
dialog::backdrop{background:rgba(10,73,55,.55)}
.dlg{padding:16px}
.dlg h3{font-size:16px;margin-bottom:8px}
.dlg textarea{width:100%;height:190px;border:1px solid var(--line);border-radius:10px;padding:10px;
  font:14px/1.5 ui-monospace,monospace;background:#fff}
#toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:var(--deep);
  color:var(--cream);padding:10px 18px;border-radius:99px;font-size:13px;z-index:60;opacity:0;
  pointer-events:none;transition:opacity .2s;max-width:88vw;text-align:center}
#toast.show{opacity:1}
footer{color:#5b6155;font-size:12px;text-align:center;padding:18px 0 4px;line-height:1.6}
.monthgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media(min-width:560px){.monthgrid{grid-template-columns:repeat(3,1fr)}}
.mcell{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:9px 10px;
  text-align:left;display:grid;gap:3px;line-height:1.2;width:100%}
.mcell.on{border-color:var(--terra);background:#fff;box-shadow:inset 0 0 0 1px var(--terra)}
.mcell .md{font-weight:700;color:var(--deep);font-size:14px}
.mcell .mw{font-size:11px;color:#5b6155;text-transform:uppercase;letter-spacing:.08em}
.mcell .mn{font-size:11px;color:#5b6155;font-family:ui-monospace,Menlo,monospace}
.mbar{display:block;height:5px;border-radius:99px;background:rgba(39,71,58,.14);overflow:hidden}
.mbar i{display:block;height:100%;background:var(--ok)}
code{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;background:rgba(39,71,58,.08);
  padding:1px 5px;border-radius:5px}
#nextBtn{position:fixed;right:14px;bottom:78px;z-index:50;background:var(--terra);color:#fff;
  border:0;border-radius:99px;padding:11px 16px;font-size:13px;font-weight:700;
  box-shadow:0 4px 14px rgba(0,0,0,.22)}
#nextBtn.hide{display:none}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="row">
      <div>
        <div class="brand">EASYWURLD</div>
        <div class="slogan">FB SCHEDULER · ZERO API · ZERO COST</div>
      </div>
      <div class="hd-right" id="hdRight"></div>
    </div>
    <div class="progress"><i id="bar"></i></div>
    <div class="pmeta"><span id="progTxt">0 of 0 scheduled</span><span id="dayTxt"></span></div>
  </div>
</header>

<div class="wrap">
  <div id="viewQueue"></div>
  <div id="viewMonth" class="hide"></div>
  <div id="viewHelp" class="hide"></div>
  <footer>
    Easywurld · Lagos, Nigeria · WhatsApp 0905 069 0837<br>
    Works offline. Tick marks and notes stay on this phone. No Facebook API involved.
  </footer>
</div>

<nav class="tabs">
  <button data-v="queue" class="on"><span class="ic">▦</span>Queue</button>
  <button data-v="month"><span class="ic">▤</span>Month</button>
  <button data-v="help"><span class="ic">?</span>Help</button>
</nav>

<button id="nextBtn" class="hide">↓ Next to schedule</button>
<div id="toast"></div>
<dialog id="dlg">
  <div class="dlg">
    <h3 id="dlgTitle">Copy</h3>
    <textarea id="dlgText" readonly></textarea>
    <p class="mini">Your phone blocked the automatic copy. Long-press the text above and choose Copy, then paste into Meta Business Suite or Facebook.</p>
    <button class="btn wide" onclick="document.getElementById('dlg').close()">Close</button>
  </div>
</dialog>

<script>
/*__DATA__*/
</script>
<script>
(function(){
  'use strict';
  var STORE_KEY = 'easywurld_fb_kit_v1';
  var state = load() || { scheduled: {}, notes: {} };
  var filter = 'all';
  var activeDay = null;

  function load(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch(e){ return null; }
  }
  function localDate(){
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth()+1) + '-' + pad2(d.getDate());
  }
  function pad2(n){ return String(n).padStart(2,'0'); }
  function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function toast(msg){
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function(){ t.classList.remove('show'); }, 2200);
  }
  function copyText(text, label){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        toast((label || 'Text') + ' copied');
      }).catch(function(){ fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text){
    var d = document.getElementById('dlg');
    document.getElementById('dlgText').value = text;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open','');
  }
  window.copyText = copyText;

  function days(){
    var map = {};
    KIT.posts.forEach(function(p){
      if (!map[p.day]) map[p.day] = [];
      map[p.day].push(p);
    });
    return Object.keys(map).map(Number).sort(function(a,b){return a-b;});
  }
  function dayDone(day){
    return KIT.posts.filter(function(p){return p.day===day;}).every(function(p){return state.scheduled[p.id];});
  }
  function scheduledCount(){
    return KIT.posts.filter(function(p){return state.scheduled[p.id];}).length;
  }

  function renderHeader(){
    var n = scheduledCount(), total = KIT.meta.total;
    document.getElementById('bar').style.width = (total ? (n/total*100) : 0) + '%';
    document.getElementById('progTxt').textContent = n + ' of ' + total + ' scheduled';
    document.getElementById('hdRight').textContent = KIT.meta.startDate + ' → ' + KIT.meta.endDate;
    var today = KIT.posts.filter(function(p){ return p.date === localDate(); })[0];
    document.getElementById('dayTxt').textContent = today ? ('Today is Day ' + today.day) : ('Day 1 = ' + KIT.meta.startDate);
  }

  function renderQueue(){
    var allDays = days();
    var html = '';
    html += '<div class="dayscroll">' + allDays.map(function(d){
      var p0 = KIT.posts.filter(function(p){return p.day===d;})[0];
      var cls = 'daybtn' + (p0.date === localDate() ? ' today' : '') + (dayDone(d) ? ' done' : '');
      return '<button class="' + cls + '" data-jumpday="' + d + '"><b>Day ' + d + '</b>' +
        p0.date.slice(5).split('-').reverse().join('/') + '</button>';
    }).join('') + '</div>';
    html += '<div class="chips">' +
      [{k:'all',l:'All posts'},{k:'todo',l:'To schedule'},{k:'done',l:'Scheduled'}].map(function(c){
        return '<button class="chip ' + (filter===c.k?'on':'') + '" data-filter="' + c.k + '">' + c.l + '</button>';
      }).join('') +
      '<button class="chip" id="exportBackup">Export backup</button>' +
      '<button class="chip" id="importBackup">Import backup</button></div>';
    html += '<input type="file" id="backupFile" accept="application/json" class="hide">';

    allDays.forEach(function(d){
      var posts = KIT.posts.filter(function(p){return p.day===d;});
      if (filter === 'todo') posts = posts.filter(function(p){return !state.scheduled[p.id];});
      if (filter === 'done') posts = posts.filter(function(p){return state.scheduled[p.id];});
      if (!posts.length) return;
      var p0 = posts[0];
      html += '<h2 class="sechead" id="day-' + d + '">Day ' + d + ' · ' + esc(p0.weekday) + ' ' + esc(p0.date) +
        ' <small>' + posts.filter(function(p){return state.scheduled[p.id];}).length + '/' + KIT.posts.filter(function(p){return p.day===d;}).length + ' scheduled</small></h2>';
      html += posts.map(cardHtml).join('');
    });
    if (!html.match(/card/)) html += '<h2 class="sechead">Nothing in this view. Switch filters.</h2>';
    document.getElementById('viewQueue').innerHTML = html;
    bindQueue();
  }

  function cardHtml(p){
    var done = !!state.scheduled[p.id];
    return '<div class="card ' + (done?'done':'') + '" data-id="' + p.id + '">' +
      '<div class="chead">' +
        '<div>' +
          '<span class="badge ' + (p.core?'core':'opt') + '">' + (p.core?'CORE':'OPTIONAL') + '</span> ' +
          '<span class="time">' + esc(p.weekday.slice(0,3)) + ' ' + esc(p.date) + ' · ' + esc(p.time) + ' WAT</span>' +
          '<div class="ctitle">' + esc(p.title) + '</div>' +
          '<div class="ctype">' + esc(p.format) + ' · ' + esc(p.id) + '</div>' +
        '</div>' +
        '<button class="tick ' + (done?'on':'') + '" data-toggle="' + p.id + '" aria-label="Mark scheduled">' + (done?'✓':'') + '</button>' +
      '</div>' +
      '<div class="cbody">' +
        '<div class="blk"><h4>Media (inside the posts ZIP)</h4><div class="media">' + esc(p.folder) + '/<br>→ ' + esc(p.media.join(', ')) + '</div></div>' +
        '<div class="blk"><h4>Caption to paste</h4><pre>' + esc(p.caption) + '</pre></div>' +
        '<div class="copyrow">' +
          '<button class="btn" data-copy="' + p.id + '">Copy caption</button>' +
          '<a class="btn fb" href="https://business.facebook.com/" target="_blank" rel="noopener">Open Meta Business Suite</a>' +
        '</div>' +
        (p.kind==='video' ? '<p class="mini">Video note: the caption file also holds the voiceover script and on-screen text used to make the video. For the Facebook text box, paste just the short part under “Caption:”.</p>' : '') +
        '<div class="blk"><h4>My notes (saved on this phone)</h4>' +
        '<textarea class="note" data-note="' + p.id + '" placeholder="e.g. scheduled in Business Suite, link checked…">' + esc(state.notes[p.id]||'') + '</textarea></div>' +
      '</div>' +
    '</div>';
  }

  function bindQueue(){
    document.querySelectorAll('[data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-toggle');
        state.scheduled[id] = !state.scheduled[id];
        if (!state.scheduled[id]) delete state.scheduled[id];
        save(); rerenderKeepScroll();
      });
    });
    document.querySelectorAll('[data-copy]').forEach(function(b){
      b.addEventListener('click', function(){
        var p = KIT.posts.filter(function(x){return x.id===b.getAttribute('data-copy');})[0];
        copyText(p.caption, 'Caption');
      });
    });
    document.querySelectorAll('[data-note]').forEach(function(t){
      t.addEventListener('input', function(){
        state.notes[t.getAttribute('data-note')] = t.value; save();
      });
    });
    document.querySelectorAll('[data-filter]').forEach(function(b){
      b.addEventListener('click', function(){ filter = b.getAttribute('data-filter'); renderQueue(); });
    });
    document.querySelectorAll('[data-jumpday]').forEach(function(b){
      b.addEventListener('click', function(){
        var el = document.getElementById('day-' + b.getAttribute('data-jumpday'));
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    document.getElementById('exportBackup').addEventListener('click', function(){
      var blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'easywurld-fb-progress-backup.json';
      a.click(); URL.revokeObjectURL(a.href);
      toast('Backup downloaded — upload it to Drive');
    });
    var file = document.getElementById('backupFile');
    document.getElementById('importBackup').addEventListener('click', function(){ file.click(); });
    file.addEventListener('change', function(){
      var f = file.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function(){
        try {
          var incoming = JSON.parse(r.result);
          state = { scheduled: incoming.scheduled||{}, notes: incoming.notes||{} };
          save(); renderAll(); toast('Backup imported');
          updateNextBtn();
        } catch(e){ toast('That file is not a valid backup'); }
      };
      r.readAsText(f);
    });
  }

  function renderMonth(){
    var html = '<h2 class="sechead">The whole month <small>tap a day to jump to its posts</small></h2><div class="monthgrid">';
    days().forEach(function(d){
      var posts = KIT.posts.filter(function(p){return p.day===d;});
      var done = posts.filter(function(p){return state.scheduled[p.id];}).length;
      var p0 = posts[0];
      html += '<button class="mcell" data-jumpday="' + d + '">' +
        '<span class="md">Day ' + d + '</span>' +
        '<span class="mw">' + esc(p0.weekday) + '</span>' +
        '<span class="mn">' + esc(p0.date) + '</span>' +
        '<span class="mbar"><i style="width:' + (done/posts.length*100) + '%"></i></span>' +
        '<span class="mn">' + done + '/' + posts.length + '</span></button>';
    });
    html += '</div>';
    document.getElementById('viewMonth').innerHTML = html;
    document.querySelectorAll('#viewMonth [data-jumpday]').forEach(function(b){
      b.addEventListener('click', function(){
        switchTab('queue');
        setTimeout(function(){
          var el = document.getElementById('day-' + b.getAttribute('data-jumpday'));
          if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }, 50);
      });
    });
  }

  function renderHelp(){
    document.getElementById('viewHelp').innerHTML =
      '<div class="stepbox"><h3>Why you do not need the Facebook API</h3>' +
      '<p class="mini" style="margin:0">The screen that asked you to register/verify a business is the <b>developer</b> path (building an app that posts for people). You are not building an app. <b>Meta Business Suite</b> is Facebook’s own free scheduler for Page admins. It needs no API, no app review, no business verification and no money. It is already allowed on your Page.</p></div>' +

      '<div class="stepbox"><h3>Option 1 — Schedule a batch ahead (recommended)</h3>' +
      '<ol>' +
      '<li>Install <b>Meta Business Suite</b> from the Play Store / App Store, or open <code>business.facebook.com</code> in a browser, and log in with the account that admins your Page.</li>' +
      '<li>First time only: open Settings and set the timezone to <b>Africa/Lagos (WAT, UTC+1)</b>.</li>' +
      '<li>In this console, open the first card. Tap <b>Copy caption</b>.</li>' +
      '<li>In Business Suite tap <b>Create post</b>, pick your Facebook Page, paste the text, then upload the media shown on the card (the slides in order for a carousel, Video.mp4 for video, Image.png for feed posts).</li>' +
      '<li>Tap <b>Schedule</b>, set the exact date and time printed on the card, and confirm.</li>' +
      '<li>Come back here, tap the big tick so the card greys out. Repeat down the list.</li>' +
      '</ol><p class="mini">Do one week in one sitting (about 20–30 minutes for 28 posts), or as many as the app lets you queue. Three CORE posts a day (08:00, 12:30, 15:00) carry the plan; the 20:00 one is optional on busy days.</p></div>' +

      '<div class="stepbox"><h3>Option 2 — Phone reminds you, you post live</h3>' +
      '<ol>' +
      '<li>In Google Drive open <b>Easywurld_FB_Reminders.ics</b> and choose “Add all events” (or: on a laptop go to Google Calendar → Settings → Import → upload the file).</li>' +
      '<li>Your phone now buzzes <b>10 minutes before</b> every one of the 120 slots, and again at post time. The event already contains the full caption and which media to attach.</li>' +
      '<li>At the reminder, open this console (add it to your home screen so it behaves like an app), copy the caption, open Facebook and post.</li>' +
      '<li>The CSV version (<b>Easywurld_FB_Google_Calendar_Import.csv</b>) is the backup if the .ics will not import on your phone.</li>' +
      '</ol></div>' +

      '<div class="stepbox"><h3>Keeping your progress safe</h3><ol>' +
      '<li>Tick marks and notes live on this phone only.</li>' +
      '<li>Use <b>Export backup</b> on the Queue tab once a week and save the JSON file into your Easywurld Drive folder.</li>' +
      '<li>On a new or wiped phone, open this file and tap <b>Import backup</b>.</li>' +
      '</ol></div>' +

      '<div class="warn"><b>Do not</b> give your Facebook password to any “auto-poster”, bot or browser-automation tool. Those break Facebook’s rules and are the fastest way to lose the Page. The two safe no-API routes are the ones above: Business Suite’s own scheduler, and calendar reminders with manual posting. Free tiers of Publer or Buffer also work because their apps are already reviewed by Meta — but Business Suite costs nothing and has the highest queue limits.</div>' +

      '<p class="mini">This kit covers the 120 media-ready Facebook posts (4 a day × 30 days, ' + esc(KIT.meta.startDate) + ' to ' + esc(KIT.meta.endDate) + '). The extra text-only ideas in the Post Commander and Content Calendar can be scheduled the same way whenever you want more than four a day.</p>';
  }

  function switchTab(v){
    document.querySelectorAll('nav.tabs button').forEach(function(b){
      b.classList.toggle('on', b.getAttribute('data-v')===v);
    });
    document.getElementById('viewQueue').classList.toggle('hide', v!=='queue');
    document.getElementById('viewMonth').classList.toggle('hide', v!=='month');
    document.getElementById('viewHelp').classList.toggle('hide', v!=='help');
    if (v==='queue') renderQueue();
    if (v==='month') renderMonth();
    if (v==='help') renderHelp();
  }
  document.querySelectorAll('nav.tabs button').forEach(function(b){
    b.addEventListener('click', function(){ switchTab(b.getAttribute('data-v')); });
  });

  function rerenderKeepScroll(){
    var y = window.scrollY;
    renderAll();
    requestAnimationFrame(function(){ window.scrollTo(0, y); });
  }
  function updateNextBtn(){
    var b = document.getElementById('nextBtn');
    var remaining = KIT.posts.some(function(p){return !state.scheduled[p.id];});
    b.classList.toggle('hide', !remaining);
  }
  document.getElementById('nextBtn').addEventListener('click', function(){
    if (filter === 'done') { filter = 'all'; renderQueue(); }
    var next = document.querySelector('.card:not(.done)');
    if (next) next.scrollIntoView({behavior:'smooth', block:'center'});
  });

  function renderAll(){ renderHeader(); renderQueue(); updateNextBtn(); }
  renderAll();
})();
</script>
</body>
</html>
`;

/* --------------------------------- run ----------------------------------- */

fs.mkdirSync(OUT_DIR, { recursive: true });
const posts = collectPosts();
if (posts.length !== 120) throw new Error(`Expected 120 FB posts, got ${posts.length}`);

fs.writeFileSync(path.join(OUT_DIR, 'fb-posts.json'), JSON.stringify(posts, null, 2) + '\n');
fs.writeFileSync(path.join(OUT_DIR, 'Easywurld_FB_Reminders.ics'), buildIcs(posts));
fs.writeFileSync(path.join(OUT_DIR, 'Easywurld_FB_Google_Calendar_Import.csv'), buildCsv(posts));
fs.writeFileSync(path.join(OUT_DIR, 'Easywurld_FB_Scheduler_Console.html'), buildHtml(posts));

const core = posts.filter((p) => p.core).length;
console.log(`✓ Built ${posts.length} Facebook posts (${core} CORE, ${posts.length - core} optional)`);
console.log(`  Date range: ${posts[0].date} → ${posts[posts.length - 1].date}`);
posts.forEach((p) => {
  if (!p.caption.length) throw new Error(`Empty caption: ${p.folder}`);
  if (!p.media.length) throw new Error(`No media: ${p.folder}`);
});
console.log('  All captions and media present. Outputs in launch-content/fb-scheduler/');
