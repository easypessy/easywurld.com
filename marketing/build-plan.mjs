#!/usr/bin/env node
/** Generate every active calendar surface from one source. No dependencies. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const kit = join(root, 'launch-content/social-command');
const plan = JSON.parse(readFileSync(join(here, 'content-plan.json'), 'utf8'));
const posts = new Map(plan.posts.map(p => [p.day, p]));
const weekends = new Map(plan.weekends.map(d => [d.day, d]));
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 10, 2 + i));
  const day = i + 1;
  return { day, date, iso: date.toISOString().slice(0,10), weekday: weekdays[date.getUTCDay()], post: posts.get(day), weekend: weekends.get(day) };
});
const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const mdText = s => String(s ?? '').replaceAll('|','\\|').replaceAll('\n','<br>');
const quote = s => String(s ?? '').split('\n').map(l => l ? '> ' + l : '>').join('\n');
const urlFor = p => plan.site + p.route;
const waFor = p => p.keyword && !p.keyword.includes('/') ? plan.waLink + '?text=' + encodeURIComponent(p.keyword) : plan.waLink;
const disclosure = p => p.format === 'Screen demo' ? 'AI voice · Easywurld' : 'AI presenter · Easywurld';
const body = p => p.script || (p.slides || []).map((s,i) => `Slide ${i+1}: ${s}`).join('\n\n') || p.staticCopy || '';
const fullCaption = p => p.caption;
const fmtCount = Object.fromEntries([...new Set(plan.posts.map(p=>p.format))].map(f=>[f,plan.posts.filter(p=>p.format===f).length]));

function brief(p, d, heading = 2) {
  const h = '#'.repeat(heading);
  const out = [`${h} ${p.id} · ${p.topic}`, '',
    `**${d.iso} · ${d.weekday} · ${plan.time} WAT · ${p.primary} · ${p.format}**`, '',
    `- **Pillar:** ${p.pillar}`, `- **Audience problem:** ${p.problem}`, `- **Objective:** ${p.objective}`,
    `- **Single CTA:** ${p.cta}`, `- **Target length:** ${p.duration}`,
    `- **Status:** Draft — not scheduled`, `- **Expected asset:** \`assets/${p.id}/${p.asset}\` (production target; not a finished file unless explicitly supplied)`,
    ...(['EW-001','EW-005','EW-017'].includes(p.id) ? [`- **Supplied starter:** \`marketing/assets/launch-week/${p.id === 'EW-001' ? 'EW-001_carousel.zip' : p.id === 'EW-005' ? 'EW-005_tabs-static.png' : 'EW-017_contact-route-static.png'}\` — review before publishing.`] : []),
    `- **Destination to verify:** ${urlFor(p)}`,
    `- **Contact:** ${plan.whatsapp}${p.keyword ? ' · keyword ' + p.keyword : ''}`, '',
    `${h}# Hook / first frame`, '', quote(p.hook), '',
    `${h}# ${p.script ? 'Exact spoken script' : p.slides ? 'Exact slide copy' : 'Exact image copy'}`, '', quote(body(p)), ''];
  if (p.beats) out.push(`${h}# Edit / shot order`, '', ...p.beats.map(b=>'- '+b), '');
  out.push(`${h}# Caption`, '', quote(fullCaption(p)), '', `${h}# Visual and edit`, '', p.visual, '', p.edit, '', `${h}# Filled production prompt`, '', '```text', p.prompt, '```', '');
  if (p.demoPath) out.push(`**Real source to record:** \`${p.demoPath.startsWith('/') ? 'client/public' + p.demoPath : p.demoPath}\``, '');
  if (p.sourcePath) out.push(`**Real source to record:** \`${p.sourcePath}\``, '');
  out.push(`**Disclosure:** ${p.aiDisclosure ? 'Required for the planned synthetic voice/presenter. On-screen: “' + disclosure(p) + '”. Enable the platform AI setting; adapt the caption if the final asset uses no synthetic voice/person.' : 'No realistic synthetic person/voice planned. Ordinary designed text/graphics do not need an AI-presenter label. Reassess if the production method changes.'}`, '', `**Fallback:** ${p.fallback}`, '');
  if (p.reuse.instagram) out.push(`**Optional Instagram reuse:** 19:00 WAT, same approved idea adapted to Reel; check crop, rights and disclosure. This is not an additional core post.`, '');
  for (const plat of ['facebook','linkedin']) if (p.reuse[plat]) out.push(`**Optional ${plat === 'facebook' ? 'Facebook' : 'LinkedIn'} copy:**`, '', quote(p.reuse[plat]), '');
  return out.join('\n');
}

// Human-readable calendar: strategy first, then the whole dated run and full briefs.
const md = ['# Easywurld — 30-day content calendar', '',
  '**Monday 2 November–Tuesday 1 December 2026 · Africa/Lagos (WAT, UTC+1)**', '',
  '## Strategy before production', '',
  readFileSync(join(here,'STRATEGY.md'),'utf8').split('\n').slice(1).join('\n'), '',
  '## The dated run', '',
  '**22 main posts, not 22 new ideas per platform.** One main post each weekday at 18:30 WAT. Weekends are for replies, review and batching. Optional reuses are listed separately in the CSV and briefs.', '',
  '| Day | Date | Time | Main post / weekend task | Format | Pillar | Primary |', '|---:|---|---|---|---|---|---|'];
for (const d of days) md.push(`| ${d.day} | ${d.iso} · ${d.weekday} | ${d.post ? plan.time : '—'} | ${mdText(d.post ? d.post.id + ' · ' + d.post.topic : d.weekend.task)} | ${d.post?.format || 'No feed post'} | ${d.post?.pillar || 'Operations'} | ${d.post?.primary || '—'} |`);
md.push('', '### Weekend tasks', '');
for (const w of plan.weekends) { const d=days[w.day-1]; md.push(`- **${d.iso} · ${w.task}:** ${w.detail}`); }
md.push('', '## Production briefs', '', 'All copy below is draft until reviewed. The prompts are filled; the likeness/voice source is a separate approval gate. No finished avatar videos or live scheduling are implied.', '', '---', '');
for (const d of days.filter(d=>d.post)) md.push(brief(d.post,d), '---', '');
md.push('## Publishing and review', '', readFileSync(join(here,'PRODUCTION.md'),'utf8').split('\n').slice(1).join('\n'));
const calendar = md.join('\n');
writeFileSync(join(here,'calendar/30-day-calendar.md'), calendar);
writeFileSync(join(kit,'MONTH_POSTS.md'), calendar);

// Per-post briefs and paste-ready scripts/captions.
const briefDir = join(here,'briefs');
mkdirSync(briefDir,{recursive:true});
for (const f of readdirSync(briefDir)) if (/^EW-\d{3}\.md$/.test(f)) rmSync(join(briefDir,f));
for (const p of plan.posts) {
  const d=days[p.day-1];
  writeFileSync(join(briefDir,p.id+'.md'), '# '+p.id+' — production brief\n\n'+brief(p,d)+'\n');
}

// Distribution CSV: 22 primary + 31 optional reuses. Explicit commitment column.
const csvCell = v => '"' + String(v ?? '').replaceAll('"','""') + '"';
const headers = ['Date','Weekday','Day','Post ID','Commitment','Platform','Time (WAT)','Timezone','Format','Pillar','Topic','Audience problem','Objective','Hook / first frame','Script / slide copy','Shot order / edit','Caption','Single CTA','Destination (verify)','Production prompt','Expected asset','AI disclosure','Fallback','Status','Actual post URL','Notes'];
const rows=[headers];
for (const d of days.filter(d=>d.post)) {
  const p=d.post;
  const base=[d.iso,d.weekday,d.day,p.id];
  const common=[p.pillar,p.topic,p.problem,p.objective,p.hook,body(p),[...(p.beats||[]),p.visual,p.edit].join('\n'),fullCaption(p),p.cta,urlFor(p),p.prompt,'assets/'+p.id+'/'+p.asset,p.aiDisclosure?disclosure(p)+' + platform setting':'Not planned; reassess if method changes',p.fallback,'Draft','','Not scheduled. Human approval required.'];
  rows.push([...base,'Primary',p.primary,plan.time,plan.timezone,p.format,...common]);
  if (p.reuse.instagram) {
    const c=[...common]; c[16]='Optional reuse; check crop, audio rights and disclosure.';
    rows.push([...base,'Optional','Instagram','19:00',plan.timezone,p.format+' (adapted)',...c]);
  }
  for (const [plat,label] of [['facebook','Facebook'],['linkedin','LinkedIn']]) if(p.reuse[plat]) {
    const c=[...common]; c[7]=p.reuse[plat]; c[16]='Selective reuse only; not a separate core idea.';
    rows.push([...base,'Optional',label,'19:15',plan.timezone,'Adapted '+p.format,...c]);
  }
}
const csv=rows.map(r=>r.map(csvCell).join(',')).join('\n')+'\n';
writeFileSync(join(kit,'content_calendar.csv'),csv);
writeFileSync(join(here,'calendar/content-calendar.csv'),csv);

// Metrics workbook starts blank. No invented analytics.
const metricHeaders=['Post ID','Scheduled date','Format','Topic','24h views/plays','24h avg watch seconds','24h completion %','7d views/plays','7d saves','7d shares','7d profile visits','Relevant comments','WhatsApp keyword enquiries','Qualified project briefs','Confirmed sales','Actual post URL','Observed lesson','Next single change'];
writeFileSync(join(here,'MEASUREMENT.csv'),[metricHeaders,...plan.posts.map(p=>[p.id,days[p.day-1].iso,p.format,p.topic,...Array(metricHeaders.length-4).fill('')])].map(r=>r.map(csvCell).join(',')).join('\n')+'\n');

// Offline app data. Fixed campaign dates: changing a start date must not turn weekends into weekdays.
const data={...plan,days:days.map(d=>({day:d.day,iso:d.iso,weekday:d.weekday,post:pCopy(d.post),weekend:d.weekend})),counts:{posts:plan.posts.length,formats:fmtCount,optional:rows.length-1-plan.posts.length}};
function pCopy(p){return p||null;}
const shell=readFileSync(join(kit,'build/shell.html'),'utf8');
const app=readFileSync(join(kit,'build/app-script.js'),'utf8');
writeFileSync(join(kit,'EASYWURLD_POST_COMMANDER.html'),shell.replace('<!--APP_SCRIPT-->','<script>'+app.replace('/*__DATA__*/ null',JSON.stringify(data).replaceAll('<','\\u003c'))+'</script>'));

// Compatibility entry point for the old build command.
writeFileSync(join(kit,'build/kit-dates.mjs'),`/* Compatibility only. Active source: marketing/content-plan.json. */\nexport const START_DATE = ${JSON.stringify(plan.startDate)};\nexport function dateFor(i) {\n  const dt = new Date(Date.UTC(2026,10,2+i));\n  return { iso:dt.toISOString().slice(0,10),day:dt.getUTCDate(),month:dt.toLocaleString('en',{month:'short',timeZone:'UTC'}),year:dt.getUTCFullYear(),weekday:dt.toLocaleString('en',{weekday:'long',timeZone:'UTC'}),label:dt.toLocaleString('en',{weekday:'long',day:'numeric',month:'short',timeZone:'UTC'}) };\n}\nexport function shortFor(i) { const d=dateFor(i); return d.day+' '+d.month; }\nexport function weekdayFor(i) { return dateFor(i).weekday; }\n`);
console.log(`Built ${days.length} days, ${plan.posts.length} primary posts, ${rows.length-1-plan.posts.length} optional reuses, ${plan.weekends.length} weekend tasks.`);
console.log('Formats:',fmtCount);
