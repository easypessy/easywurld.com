#!/usr/bin/env node
/* Easywurld — meme cards.
 *
 *   node launch-content/november/build/build-meme-cards.mjs
 *
 * Renders every meme in content/memes.json as a screenshot-ready card in the
 * shape it is supposed to travel in: a WhatsApp chat, an X post with replies,
 * or a Reddit thread. Output is one self-contained HTML file — no fonts to
 * load, no images, no internet. Open it, screenshot a card, post it.
 *
 * Cards are 540x675 CSS pixels at 2x device pixel ratio, which is the 4:5
 * shape that fits both the Instagram feed and a phone screenshot.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");
const bank = JSON.parse(readFileSync(join(outDir, "content", "memes.json"), "utf8"));
const memes = (bank.memes || []).slice().sort((a, b) => a.day - b.day);

const esc = (s) => String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

/* ---------------------------------------------------------------- */
/* the three card shapes                                             */
/* ---------------------------------------------------------------- */

function chatCard(m) {
  const rows = (m.lines || []).map(([who, line]) => {
    const side = /^(customer|stranger|me|ad)$/i.test(who) ? "left" : "right";
    return `<div class="row ${side}">
      <div class="bubble ${side}">${esc(line)}</div>
    </div>`;
  }).join("\n");
  return `<div class="phone">
    <div class="phoneTop">
      <div class="avatar">${esc((m.title || "?").slice(0, 2).toUpperCase())}</div>
      <div class="phoneName">Business</div>
      <div class="phoneMeta">online</div>
    </div>
    <div class="chat">${rows}</div>
    <div class="phoneBottom"><span>Message</span><span class="send">➤</span></div>
  </div>`;
}

function repliesCard(m) {
  const posts = (m.replies || []).map((r, i) => {
    const name = ["@adedayo", "@tolu_", "@nnamdi", "@bisi", "@kemi", "@emeka"][i % 6];
    return `<div class="post">
      <div class="pHead"><span class="pAvatar">${name[1].toUpperCase()}</span>
        <span class="pName">${name}</span><span class="pTime">${2 + i * 7}m</span></div>
      <div class="pBody">${esc(r)}</div>
      <div class="pFoot"><span>♡ ${3 + i * 11}</span><span>↺ ${1 + i * 4}</span><span>⋯</span></div>
    </div>`;
  }).join("\n");
  return `<div class="xk">
    <div class="xkHead"><span class="xLogo">𝕏</span><span class="xkLabel">Post</span></div>
    <div class="xkBody">${esc(m.post)}</div>
    <div class="xkRule"></div>
    <div class="xkReplies">${posts}</div>
  </div>`;
}

function threadCard(m) {
  const comments = (m.comments || []).map(([who, line]) => `<div class="rc">
      <div class="rcBar"></div>
      <div class="rcBody">
        <div class="rcWho">${esc(who)} <span class="rcKarma">${120 + who.length * 37} points</span></div>
        <div class="rcText">${esc(line)}</div>
        <div class="rcFoot">Reply · Share · Report</div>
      </div>
    </div>`).join("\n");
  return `<div class="rd">
    <div class="rdSub">${esc(m.sub || "r/smallbusiness")} · Posted by u/throwaway_owner · 6h</div>
    <div class="rdTitle">${esc(m.headline)}</div>
    <div class="rdRule"></div>
    <div class="rdComments">${comments}</div>
  </div>`;
}

const card = (m) => {
  const inner = m.format === "chat" ? chatCard(m)
    : m.format === "replies" ? repliesCard(m)
    : threadCard(m);
  const tag = m.format === "chat" ? "CHAT" : m.format === "replies" ? "REPLIES" : "THREAD";
  return `<section class="card" id="d${m.day}">
    <div class="cardTag">${tag} · day ${m.day}</div>
    ${inner}
  </section>`;
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Easywurld — 30 meme cards</title>
<style>
  :root {
    --cream: #FAE7C7;
    --green: #0A4937;
    --leaf: #27473A;
    --terra: #9E4E2C;
    --ink: #12211C;
    --paper: #FFFCF4;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 28px 18px 80px;
    background: #12100D;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    color: var(--ink);
  }
  header { max-width: 560px; margin: 0 auto 26px; color: #EDE3D2; }
  header h1 { font-size: 22px; margin: 0 0 8px; letter-spacing: -0.01em; }
  header p { margin: 0 0 6px; font-size: 14px; line-height: 1.5; color: #C9BFAE; }
  header code { background: #241F19; padding: 1px 5px; border-radius: 4px; font-size: 12px; }

  .grid { display: grid; gap: 26px; justify-content: center; }

  .card {
    width: 540px; min-height: 675px; padding: 22px;
    background: var(--cream);
    border-radius: 6px;
    display: flex; flex-direction: column; gap: 14px;
    box-shadow: 0 18px 50px rgba(0,0,0,.45);
  }
  .cardTag {
    font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .14em; text-transform: uppercase; color: var(--terra);
  }

  /* ---------------- chat ---------------- */
  .phone {
    flex: 1; display: flex; flex-direction: column;
    background: #EFE0C6; border-radius: 14px; overflow: hidden;
    border: 1px solid rgba(10,73,55,.16);
  }
  .phoneTop {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 12px; background: var(--green); color: #F6EEDD;
  }
  .avatar {
    width: 26px; height: 26px; border-radius: 50%; background: var(--terra);
    display: grid; place-items: center; font-size: 11px; font-weight: 700; color: #fff;
  }
  .phoneName { font-size: 13px; font-weight: 700; }
  .phoneMeta { margin-left: auto; font-size: 10px; opacity: .8; }
  .chat {
    flex: 1; padding: 12px 12px 6px; display: flex; flex-direction: column; gap: 7px;
    justify-content: flex-end;
  }
  .row { display: flex; }
  .row.left { justify-content: flex-start; }
  .row.right { justify-content: flex-end; }
  .bubble {
    max-width: 78%; padding: 8px 11px; font-size: 13.5px; line-height: 1.35;
    border-radius: 12px; box-shadow: 0 1px 1px rgba(0,0,0,.07);
  }
  .bubble.left { background: var(--paper); border-bottom-left-radius: 4px; }
  .bubble.right { background: #CDE6CE; border-bottom-right-radius: 4px; }
  .phoneBottom {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px; background: #E4D2B4; font-size: 12px; color: #6B6558;
  }
  .send { color: var(--green); font-size: 14px; }

  /* ---------------- replies ---------------- */
  .xk {
    flex: 1; background: var(--paper); border-radius: 12px; padding: 16px;
    border: 1px solid rgba(10,73,55,.14); display: flex; flex-direction: column;
  }
  .xkHead { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .xLogo { font-size: 15px; font-weight: 700; color: var(--green); }
  .xkLabel { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #8A8271; }
  .xkBody { font-size: 17px; line-height: 1.36; font-weight: 500; }
  .xkRule { height: 1px; background: rgba(10,73,55,.12); margin: 14px 0 10px; }
  .xkReplies { display: flex; flex-direction: column; gap: 11px; }
  .post { padding-bottom: 10px; border-bottom: 1px solid rgba(10,73,55,.07); }
  .post:last-child { border-bottom: 0; }
  .pHead { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .pAvatar {
    width: 20px; height: 20px; border-radius: 50%; background: var(--leaf); color: #F6EEDD;
    display: grid; place-items: center; font-size: 10px; font-weight: 700;
  }
  .pName { font-size: 12.5px; font-weight: 700; }
  .pTime { font-size: 11px; color: #9A9384; }
  .pBody { font-size: 13.5px; line-height: 1.34; }
  .pFoot { margin-top: 4px; display: flex; gap: 16px; font-size: 11px; color: #9A9384; }

  /* ---------------- thread ---------------- */
  .rd {
    flex: 1; background: var(--paper); border-radius: 12px; padding: 16px;
    border: 1px solid rgba(10,73,55,.14);
  }
  .rdSub { font-size: 11px; color: var(--terra); font-weight: 600; margin-bottom: 7px; }
  .rdTitle { font-size: 17px; line-height: 1.32; font-weight: 650; }
  .rdRule { height: 3px; background: rgba(10,73,55,.1); margin: 12px 0; }
  .rdComments { display: flex; flex-direction: column; gap: 10px; }
  .rc { display: flex; gap: 9px; }
  .rcBar { width: 2px; background: rgba(10,73,55,.15); border-radius: 2px; flex: none; }
  .rcWho { font-size: 12px; font-weight: 700; margin-bottom: 2px; }
  .rcKarma { font-weight: 400; color: #9A9384; font-size: 10.5px; margin-left: 5px; }
  .rcText { font-size: 13.5px; line-height: 1.34; }
  .rcFoot { font-size: 10.5px; color: #A9A292; margin-top: 3px; }

  @media print {
    body { background: #fff; padding: 0; }
    header { display: none; }
    .grid { gap: 12px; }
    .card { box-shadow: none; page-break-inside: avoid; border: 1px solid #ddd; }
  }
</style>
</head>
<body>
<header>
  <h1>30 meme cards — screenshot one, post it</h1>
  <p>Each card is the shape it should travel in: a chat, an X post with replies, or a Reddit
     thread. They are 540 × 675 CSS pixels (4:5), so a screenshot drops straight into the feed.</p>
  <p>These are jokes, not evidence. Do not post one as if it happened, never use one as proof,
     and never make the customer the punchline. Rebuild with
     <code>node launch-content/november/build/build-meme-cards.mjs</code>.</p>
</header>
<div class="grid">
${memes.map(card).join("\n")}
</div>
</body>
</html>
`;

writeFileSync(join(outDir, "MEME_CARDS.html"), html);
console.log(`MEME_CARDS.html: ${html.length.toLocaleString()} chars | ${memes.length} cards`);
