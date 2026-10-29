/* Generate the active 60-meme bank from the canonical plan. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../..');
const plan=JSON.parse(readFileSync(resolve(root,'marketing/content-plan.json'),'utf8'));
const posts=plan.posts.filter(p=>p.seriesKey==='meme1'||p.seriesKey==='meme2');
const md=['# Easywurld — original meme bank','',`**${posts.length} scheduled meme slots in the active 900-placement campaign.**`,'','Two original memes a day, 2 November–1 December 2026. These are text-led posts, not borrowed meme templates or customer screenshots. The caption carries the useful resolution.','','| Date | Slot | Post | Exact first frame | Asset |','|---|---:|---|---|---|'];
for(const p of posts) md.push(`| ${p.date} | S${p.slot} | ${p.id} | ${p.hook.replaceAll('|','\\|')} | \`marketing/assets/memes/${p.id}.png\` |`);
for(const p of posts){
  md.push('',`## ${p.id} · ${p.topic}`,'',`**${p.date} · ${p.time} WAT · ${p.series}**`,'','**Exact image copy**','','```text',p.staticCopy,'```','','**Caption**','',p.caption,'','**Visual:** '+p.visual,'','**Edit:** '+p.edit,'','**Prompt:** '+p.prompt,'');
  const pl=p.platforms;
  md.push('**Platform times and captions**','',`- TikTok ${pl.TikTok.time} WAT`,'',pl.TikTok.caption,'',`- Instagram ${pl.Instagram.time} WAT`,'',pl.Instagram.caption,'',`- Facebook ${pl.Facebook.time} WAT`,'',pl.Facebook.caption,'');
}
writeFileSync(resolve(here,'../MEME_BANK.md'),md.join('\n'));
console.log(`Built ${posts.length} active original meme entries.`);
