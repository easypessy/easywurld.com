/* Generate the active 60-meme bank from the canonical plan. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../..');
const plan=JSON.parse(readFileSync(resolve(root,'marketing/content-plan.json'),'utf8'));
const posts=plan.posts.filter(p=>p.seriesKey==='meme1'||p.seriesKey==='meme2');
const md=['# Easywurld — original meme bank','',`**${posts.length} scheduled meme slots in the active 1,196-placement campaign.**`,'','Two scene-led memes a day, 2 November–1 December 2026. Each one is a real photograph of the moment — the empty plastic chairs, the face-down phone, the blank screen — with a small two-line caption in the lower third. Not a wall of text, not a borrowed template, not a customer screenshot. The caption under the post carries the useful resolution.','','| Date | Slot | Post | Scene plate | On-image line | Asset |','|---|---:|---|---|---|---|'];
for(const p of posts) md.push(`| ${p.date} | S${p.slot} | ${p.id} | ${p.meme.scene} | ${p.hook.replaceAll('|','\\|')} | \`marketing/assets/memes/${p.id}.jpg\` |`);
for(const p of posts){
  md.push('',`## ${p.id} · ${p.topic}`,'',`**${p.date} · ${p.time} WAT · ${p.series} · scene ${p.meme.scene}**`,'','**On-image copy (small, lower third)**','','```text',p.staticCopy,'```','',`**Scene plate:** \`marketing/assets/meme-scenes/${p.meme.image}\``,'','**Caption**','',p.caption,'','**Visual:** '+p.visual,'','**Edit:** '+p.edit,'','**Prompt:** '+p.prompt,'');
  const pl=p.platforms;
  md.push('**Platform times and captions**','',`- TikTok ${pl.TikTok.time} WAT`,'',pl.TikTok.caption,'',`- Instagram ${pl.Instagram.time} WAT`,'',pl.Instagram.caption,'',`- Facebook ${pl.Facebook.time} WAT`,'',pl.Facebook.caption,'');
}
writeFileSync(resolve(here,'../MEME_BANK.md'),md.join('\n'));
console.log(`Built ${posts.length} active original meme entries.`);
