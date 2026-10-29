/* Generate the active original static/text-meme bank from the canonical plan. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../..');
const plan=JSON.parse(readFileSync(resolve(root,'marketing/content-plan.json'),'utf8'));
const posts=plan.posts.filter(p=>p.format==='Relatable static');
const md=['# Easywurld — original static bank','', '**Two scheduled posts in the active November campaign.**','','These are original text-led posts, not borrowed memes or customer screenshots. The caption carries the useful resolution.','','| Date | Post | First frame |','|---|---|---|'];
for(const p of posts){const date=new Date(Date.UTC(2026,10,1+p.day)).toISOString().slice(0,10);md.push(`| ${date} | ${p.id} | ${p.hook.replaceAll('\n',' / ')} |`);}
for(const p of posts){md.push('',`## ${p.id} · ${p.topic}`,'','**Exact image copy**','','```text',p.staticCopy,'```','','**Caption**','',''+p.caption,'','**Visual:** '+p.visual,'','**Edit:** '+p.edit,'','**Prompt:** '+p.prompt,'');}
writeFileSync(resolve(here,'../MEME_BANK.md'),md.join('\n'));
console.log(`Built ${posts.length} active original static posts.`);
