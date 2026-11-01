/** Offline Series Studio smoke test. Run: NODE_PATH=/tmp/jt/node_modules node marketing/tests/series-studio.test.mjs (jsdom is not a repo dependency). */
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const file = '/home/user/easywurld.com/launch-content/social-command/EASYWURLD_POST_COMMANDER.html';
const html = readFileSync(file, 'utf8');
const errors = [];
function ok(cond, label) { if (!cond) errors.push(label); }

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.test/', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;
const text = () => doc.getElementById('content').textContent;

// strategy view
ok(/330/.test(text()), 'strategy shows 330 posts');
ok(/1,?196/.test(text()), 'strategy shows 1196 placements');
ok(/One Last Thought/.test(text()), 'strategy lists slot 11');
ok(/Two story slots|Poll \/ quiz/.test(text()), 'strategy mentions stories');

function clickNav(label) {
  const btn = [...doc.querySelectorAll('nav button')].find(b => b.textContent.trim() === label);
  if (!btn) throw new Error('nav missing ' + label);
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

// stories view
clickNav('Stories');
ok(/60 stories/.test(text()), 'stories view count');
ok(/Frame 1/.test(text()), 'stories renders frames');
ok(/Tap the poll|Link sticker|sticker/i.test(text()), 'stories renders sticker notes');

// linkedin view
clickNav('LinkedIn');
ok(/26 LinkedIn posts/.test(text()), 'linkedin view count');
ok(/Document post/.test(text()), 'linkedin shows document post');
ok(/first comment/.test(text()), 'linkedin rules shown');

// daily calendar
clickNav('Daily calendar');
ok(/11 posts · 2 stories · 4\d placements/.test(text()), 'day view header');
ok(/One Last Thought/.test(text()), 'day view includes slot 11');
ok(/What does your bio lead with/.test(text()), 'day view includes the midday poll story');
ok(/Behind the desk/.test(text()), 'day view includes the evening desk story');
ok(doc.querySelectorAll('.slotrow').length === 13, '13 rows (11 posts + 2 stories), got ' + doc.querySelectorAll('.slotrow').length);

// open a post detail and change status + check QA
const firstSlot = doc.querySelector('.slotlink');
firstSlot.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(/Exact copy/.test(text()), 'detail opens');
const select = doc.querySelector('[data-status]');
ok(select, 'status select present');
select.value = 'Scheduled';
select.dispatchEvent(new window.Event('change', { bubbles: true }));
const stored = JSON.parse(window.localStorage.getItem('easywurld-series-v5'));
ok(stored && Object.values(stored.placements).some(p => p.status === 'Scheduled'), 'status persisted');

const box = doc.querySelector('[data-check]');
box.checked = true;
box.dispatchEvent(new window.Event('change', { bubbles: true }));
const stored2 = JSON.parse(window.localStorage.getItem('easywurld-series-v5'));
ok(Object.values(stored2.placements).some(p => p.checks && Object.values(p.checks).includes(true)), 'QA check persisted');

// meme post detail shows the scene
clickNav('Post briefs');
const q = doc.getElementById('q');
q.value = "I'll get back to you";
q.dispatchEvent(new window.Event('input', { bubbles: true }));
const results = [...doc.querySelectorAll('[data-post]')].map(b => b.dataset.post);
ok(results.includes('EW-D01-S05'), 'search finds the meme by its text');

// batches
clickNav('Weekly batch');
ok(/Week 1/.test(text()), 'batch view');

// tools
clickNav('Exports');
ok(/Export all placements CSV/.test(text()), 'exports view');

// story detail
clickNav('Stories');
const storyBtn = doc.querySelector('[data-post]');
storyBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
ok(/STORY|Frames/.test(text()), 'story detail opens');

if (errors.length) { console.error('FAIL:\n' + errors.join('\n')); process.exit(1); }
console.log('PASS: Series Studio v5 — strategy, stories, LinkedIn, 13-row day, detail, persistence, search, batches, exports.');
