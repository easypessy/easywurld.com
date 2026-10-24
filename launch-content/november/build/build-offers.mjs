/* Easywurld social kit — offers generator.
 *
 * Reads EASYWURLD_OFFERS_MASTER.md (the source copy) and writes
 * EASYWURLD_OFFERS_MASTER.html — the branded A4 document that becomes the
 * offers PDF.
 *
 * The markdown is the source of truth for the words. This file supplies the
 * brand: the stylesheet, the cover, the services page, the how-to-start page
 * and the order slip. The nine pack pages are built from the markdown.
 *
 * Run:  node launch-content/social-command/build/build-offers.mjs
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");

const BRAND = {
  wordmark: "EASYWURLD",
  slogan: "SIMPLIFY. OPTIMIZE. GROW.",
  whatsapp: "0905 069 0837",
  site: "website-builder-portfolio.vercel.app",
  price: "₦5,000",
};

/* ------------------------------------------------------------------ */
/* the stylesheet                                                      */
/* ------------------------------------------------------------------ */

const CSS = `@page { size: A4; margin: 16mm 15mm; }
* { box-sizing: border-box; }
body { margin:0; background:#EFEADF; color:#14170F; font-family: "Inter", "Helvetica Neue", Arial, sans-serif; font-size: 10.5pt; line-height:1.5; }
.page { background:#FBF9F4; width:210mm; min-height:297mm; padding:18mm 16mm 14mm; margin:0 auto 8mm; box-sizing:border-box; page-break-after:always; }
.page:last-child { page-break-after:auto; }
.cover-top { border-bottom:1px solid #DCD6C6; padding-bottom:10px; margin-bottom:26px; }
.wordmark { font-family: Georgia, "Times New Roman", serif; font-size:22pt; letter-spacing:.14em; color:#0A4937; font-weight:bold; }
.slogan { font-family: Georgia, serif; font-size:8.5pt; letter-spacing:.2em; color:#27473A; margin-top:2px; }
.cover-title { font-family: Georgia, "Times New Roman", serif; font-size:31pt; line-height:1.16; color:#0A4937; margin:0 0 16px; }
.cover-sub { font-size:12pt; color:#3B4137; margin:0 0 26px; }
.price-line { font-size:11pt; color:#14170F; border-left:3px solid #9E4E2C; padding-left:12px; }
.cover-foot { margin-top:70px; font-size:10.5pt; color:#3B4137; }
.cover-foot p { margin:3px 0; }
h1,h2,h3 { font-family: Georgia, "Times New Roman", serif; }
.h { font-size:19pt; color:#0A4937; margin:0 0 6px; }
.h3 { font-size:10.5pt; letter-spacing:.08em; text-transform:uppercase; color:#9E4E2C; margin:14px 0 4px; font-family:"Inter",Arial,sans-serif; }
.lede { font-size:12pt; color:#27473A; margin:0 0 14px; }
p { margin:0 0 8px; }
.tagline { font-family:Georgia,serif; font-size:12.5pt; color:#27473A; border-left:3px solid #9E4E2C; padding-left:12px; margin:0 0 14px; }
ol.steps, ol.how { margin:0 0 10px; padding-left:18px; }
ol.steps li, ol.how li { margin-bottom:7px; }
ul.tick, ul.cross { margin:0; padding-left:17px; }
ul.tick li { margin-bottom:3px; }
ul.cross li { margin-bottom:3px; color:#3B4137; }
.offerlist { margin-top:16px; font-size:10.5pt; }
.offerlist .n { display:inline-block; width:20px; color:#9E4E2C; font-family:"Courier New",monospace; }
.kw { font-family:"Courier New",monospace; font-size:9pt; color:#9E4E2C; border:1px solid #E0C9BE; border-radius:4px; padding:1px 5px; margin-left:6px; }
.onum { font-family:"Courier New",monospace; font-size:9pt; letter-spacing:.18em; color:#9E4E2C; }
.oname { font-size:21pt; color:#0A4937; margin:2px 0 6px; }
.otag { font-size:11.5pt; color:#3B4137; margin:0 0 12px; max-width:150mm; }
.obar { display:flex; justify-content:space-between; align-items:center; border-top:1px solid #DCD6C6; border-bottom:1px solid #DCD6C6; padding:8px 0; font-size:10.5pt; gap:10px; }
.oprice { font-family: Georgia, serif; font-size:15pt; color:#0A4937; }
.grid2 { display:flex; gap:9mm; }
.grid2 > div { flex:1; }
table.files { width:100%; border-collapse:collapse; margin:4px 0 4px; font-size:9pt; }
table.files th { text-align:left; font-size:8pt; letter-spacing:.08em; text-transform:uppercase; color:#27473A; border-bottom:1.5px solid #27473A; padding:4px 5px; }
table.files td { padding:5px; border-bottom:1px solid #E6E1D5; vertical-align:top; }
table.files .r { text-align:right; }
table.files .fn { font-weight:bold; color:#0A4937; }
table.files .dsc { color:#3B4137; }
table.files .sub, .sub { font-size:8.5pt; color:#5A6055; }
table.svc .sub { display:block; margin-top:3px; }
.mono { font-family:"Courier New",monospace; }
table.files tr.tot td { border-top:1.5px solid #27473A; border-bottom:none; color:#0A4937; }
.note { font-size:8.5pt; color:#5A6055; font-style:italic; margin:2px 0 6px; }
.faqs .faq { margin-bottom:7px; }
.faqs .q { font-weight:bold; color:#0A4937; margin:0 0 1px; }
.faqs .a { margin:0; color:#3B4137; }
.kwcell { font-family:"Courier New",monospace; color:#9E4E2C; font-weight:bold; }
.callout { background:#F4EFE3; border:1px solid #E0DACA; border-radius:8px; padding:10px 12px; font-size:9.5pt; }
.callout p { margin:0 0 7px; }
.closing { margin-top:22px; border-top:1px solid #DCD6C6; padding-top:14px; }
.closing p { font-size:10pt; color:#3B4137; }
.closing .small { font-size:8.5pt; color:#6A7065; }
hr { display:none; }
`;

/* ------------------------------------------------------------------ */
/* small helpers                                                       */
/* ------------------------------------------------------------------ */

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* inline markdown: code, bold, italic */
function inline(text) {
  let out = esc(text);
  out = out.replace(/`([^`]+)`/g, '<span class="kw">$1</span>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  return out;
}

function cells(line) {
  return line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

/**
 * The markdown subset used by the offers source, rendered with the classes
 * the stylesheet expects.
 */
function renderMarkdown(md, opts = {}) {
  const svcTable = !!opts.svc;
  const lines = String(md).split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (/^(-{3,})$/.test(line.trim())) { i++; continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      if (level === 1) out.push(`<h1 class="h">${inline(h[2])}</h1>`);
      else if (level === 2) out.push(`<h2 class="h">${inline(h[2])}</h2>`);
      else out.push(`<h3 class="h3">${inline(h[2])}</h3>`);
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoted = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoted.push(lines[i].slice(2));
        i++;
      }
      out.push(`<p class="tagline">${inline(quoted.join(" "))}</p>`);
      continue;
    }

    if (/^\|/.test(line) && /^\|[\s:|-]+\|?$/.test(lines[i + 1] || "")) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      out.push('<table class="files"><thead><tr>'
        + head.map((c, k) => (k === 0 ? `<th class="r">${inline(c)}</th>` : `<th>${inline(c)}</th>`)).join("")
        + "</tr></thead><tbody>");
      for (const r of rows) {
        const isTot = /\*\*Total\*\*/.test(r.join("|"));
        out.push(`<tr class="${isTot ? "tot" : ""}">`
          + r.map((c, k) => {
            if (/^₦/.test(c)) {
              return `<td class="kwcell">${inline(c)}</td>`;
            }
            if (/^\*\*₦/.test(c)) {
              return `<td class="kwcell">${inline(c)}</td>`;
            }
            if (k === 0) return `<td class="r mono">${inline(c)}</td>`;
            if (svcTable) {
              if (k === 1) return `<td class="fn">${inline(c)}</td>`;
              return `<td class="dsc">${inline(c)}</td>`;
            }
            return `<td class="">${inline(c)}</td>`;
          }).join("")
          + "</tr>");
      }
      out.push("</tbody></table>");
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push('<ul class="tick">' + items.map((it) => `<li>${inline(it)}</li>`).join("") + "</ul>");
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push('<ol class="steps">' + items.map((it) => `<li>${inline(it)}</li>`).join("") + "</ol>");
      continue;
    }

    /* a paragraph */
    const para = [];
    while (i < lines.length && lines[i].trim()
      && !/^(#{1,6}\s|[-*]\s|\d+\.\s|>|\|)/.test(lines[i])
      && !/^(-{3,})$/.test(lines[i].trim())) {
      para.push(lines[i]);
      i++;
    }
    const text = para.join(" ").trim();
    if (!text) { i++; continue; }

    /* a question and its answer sit together */
    const qa = text.match(/^\*\*(.+?)\*\*\s+(.+)$/);
    if (qa) {
      out.push(`<p><b>${inline(qa[1])}</b> ${inline(qa[2])}</p>`);
      continue;
    }

    /* an italic line is a note */
    if (/^\*[^*].*\*$/.test(text)) {
      out.push(`<p>${inline(text)}</p>`);
      continue;
    }

    out.push(`<p>${inline(text)}</p>`);
  }

  return out.join("");
}

/* ------------------------------------------------------------------ */
/* read the source markdown                                            */
/* ------------------------------------------------------------------ */

const md = readFileSync(join(outDir, "EASYWURLD_OFFERS_MASTER.md"), "utf8");

const blocks = [];
let current = null;
let para = [];

function flushPara() {
  if (!para.length) return;
  const text = para.join(" ").trim();
  para = [];
  if (text && current) current.lines.push(text);
}

for (const line of md.split("\n")) {
  const h = line.match(/^(#{1,2})\s+(.*)$/);
  if (h) {
    flushPara();
    if (current) blocks.push(current);
    current = { level: h[1].length, title: h[2], lines: [] };
    continue;
  }
  if (!current) continue;
  if (!line.trim()) { flushPara(); current.lines.push(""); continue; }
  current.lines.push(line);
}
flushPara();
if (current) blocks.push(current);

const buyBlock = blocks.find((b) => /how to buy/i.test(b.title));
const packBlocks = blocks.filter((b) => b.level === 1 && /^\d+\.\s/.test(b.title));

/* the keyword and the estimated value for each pack */
const PACK_META = [
  ["PLAYBOOK", "₦35,000"], ["CLEAR", "₦32,500"], ["ENGINE", "₦32,500"],
  ["PAGE", "₦32,500"], ["LOCAL", "₦32,500"], ["MESSAGE", "₦32,500"],
  ["PROMPTS", "₦35,000"], ["TEMPLATES", "₦32,500"], ["LAUNCH", "₦32,500"],
];

/* ------------------------------------------------------------------ */
/* the pages                                                           */
/* ------------------------------------------------------------------ */

const pages = [];

/* 1. the cover */
pages.push(`<section class="page">
  <div class="cover-top">
    <div class="wordmark">${BRAND.wordmark}</div>
    <div class="slogan">${BRAND.slogan}</div>
  </div>
  <h1 class="cover-title">Nine practical offers<br>for small businesses</h1>
  <p class="cover-sub">Nine do-it-yourself resource packs for Nigerian small businesses.<br>
  Web design, landing pages, content, systems, local visibility, copy and launch.<br>
  <span class="sub">Plus: what we do, and how to start with us.</span></p>
  <p class="price-line"><b>${BRAND.price} each</b> &nbsp;·&nbsp; Digital download &nbsp;·&nbsp; Do it yourself<br>
  <span class="sub">Or start free with a 24-hour review of your page.</span></p>
  <div class="cover-foot">
    <p><b>WhatsApp: ${BRAND.whatsapp}</b> — message the keyword for the pack you want.</p>
    <p>Site: ${BRAND.site}</p>
    <p class="sub">Independent digital studio, Lagos, Nigeria.<br>
    All portfolio work shown by Easywurld is concept projects and sample builds, not client engagements.</p>
  </div>
</section>`);

/* 2. how to buy */
{
  const body = renderMarkdown(buyBlock.lines.join("\n"));
  const lead = body.replace(/^<p>/, "<p>How to buy");
  pages.push(`<section class="page">
  <div class="cover-top"><div class="wordmark">${BRAND.wordmark}</div><div class="slogan">${BRAND.slogan}</div></div>
  ${lead}
</section>`);
}

/* 3. what Easywurld does */
{
  const SERVICES = [
    ["Digital Marketing Strategy",
      "The thinking that comes before any design: who you are for, what you say, where you say it, and what happens next.",
      "Marketing strategy · Audience research · Positioning · Content strategy · Campaign planning · Customer journey mapping · Brand messaging · Marketing systems",
      "A written plan you can use without us. Not a slide deck we present and take away.",
      "LOCAL / ENGINE"],
    ["Web Design",
      "Websites for businesses, services and local shops. We build around the three questions your visitors arrive with.",
      "Business websites · Corporate sites · Service websites · Local business sites · E-commerce-style sites · Portfolio websites · Responsive build · Content editing setup",
      "A working site you own, on phones and computers, with the content set up so you can change it.",
      "CLEAR / LAUNCH"],
    ["Landing Page Design",
      "One offer, one action. Pages for launches, campaigns and enquiries. Every section has to earn its place.",
      "Lead-generation pages · Product launches · Service pages · Campaign pages · Event registration · Sales pages · Consultation booking · Offer pages",
      "One page, built to get a reply, with the doubts answered before we ask for anything.",
      "PAGE"],
    ["Business Systems & Workflows",
      "Simple assistants and workflows with clear limits. We decide what they should say no to before we decide what they do.",
      "Out-of-hours enquiry desks · Customer support assistants · Sales assistants · Lead qualification · Appointment workflows · Order capture · Internal knowledge desks · Follow-up sequences",
      "A written workflow, the conversation design, and the rules that keep it honest.",
      "PLAYBOOK / PROMPTS"],
    ["Social Media Management",
      "A content plan that fits the time you really have, not the time a plan assumes you have.",
      "Social strategy · Content pillars · Content calendars · Campaign concepts · Caption frameworks · Grid direction · Templates for non-designers · Handover training",
      "A calendar, templates and rules your team can run after we leave.",
      "ENGINE"],
    ["Copywriting & Business Content",
      "Plain, exact words for websites, offers, emails and products. Written to be read, not to sound clever.",
      "Website copy · Landing-page copy · Sales copy · Product descriptions · Service descriptions · Email sequences · Brand messaging · FAQ and objection copy",
      "Final words in a document you can paste, plus a short guide so you can write more later.",
      "MESSAGE / TEMPLATES"],
    ["Business Reports & Presentations",
      "Business documents people read to the end, designed for where they will really be read.",
      "Business reports · Seminar and project reports · Proposals · Pitch decks · Training presentations · Executive summaries · Briefing documents · Document templates",
      "A designed document and a reusable template, so the next one takes an hour.",
      "TEMPLATES"],
  ];

  const rows = SERVICES.map(([name, blurb, subs, gives, kw], i) => `    <tr>
      <td class="r mono">${String(i + 1).padStart(2, "0")}</td>
      <td class="fn">${name}</td>
      <td class="dsc">${esc(blurb)}<br><span class="sub">${esc(subs)}</span></td>
      <td class="dsc">${esc(gives)}</td>
      <td class="kwcell">${esc(kw)}</td>
    </tr>`).join("\n");

  pages.push(`<section class="page">
  <div class="cover-top">
    <div class="wordmark">${BRAND.wordmark}</div>
    <div class="slogan">${BRAND.slogan}</div>
  </div>
  <h2 class="h">What Easywurld does</h2>
  <p class="lede">Seven services that work as one. Most small businesses do not need seven suppliers. They need a plan, a design, words and systems that agree with each other.</p>
  <p style="font-size:10pt;color:#3B4137">Easywurld is an independent digital studio in Lagos, Nigeria. We work with small businesses and the people who run them. Everything in our portfolio is a <b>concept project or sample build</b>, not client work.</p>
  <table class="files svc">
    <thead><tr><th class="r" style="width:24px">#</th><th>Service</th><th>What it covers</th><th>What you get</th><th>Do it yourself</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <p class="note">The keyword column points to the pack that lets you handle that part yourself, at ${BRAND.price}. If you would rather we do it, message us and we will scope it as a project.</p>
  <div class="grid2" style="margin-top:10px">
    <div class="callout">
      <h3 class="h3" style="margin-top:0">How we work</h3>
      <p><b>Understand.</b> We learn about your business, your customers and the real problem. It is often not the one you first described.</p>
      <p><b>Simplify.</b> We find the message that matters and cut everything getting in its way.</p>
      <p><b>Build.</b> We make the thing. Clear, working, and easy to keep running.</p>
      <p style="margin-bottom:0"><b>Optimize.</b> We check what works, fix what does not, and hand you something you can run.</p>
    </div>
    <div class="callout">
      <h3 class="h3" style="margin-top:0">Two ways to work with us</h3>
      <p><b>Do it yourself.</b> One of the nine packs, ${BRAND.price} each, digital download, no consultation included. You do the work; we have already done the thinking.</p>
      <p><b>We do it for you.</b> A project, scoped after a short call, with a written proposal covering scope, timeline and price before any work starts.</p>
      <p style="margin-bottom:0"><b>Or start free.</b> Send us your link and we reply within 24 hours with a voice note and three points: what is costing you enquiries, what to fix first, and what to leave alone. No charge, no sales call.</p>
    </div>
  </div>
</section>`);
}

/* 4. how to start */
{
  pages.push(`<section class="page">
  <div class="cover-top">
    <div class="wordmark">${BRAND.wordmark}</div>
    <div class="slogan">${BRAND.slogan}</div>
  </div>
  <h2 class="h">How to start</h2>
  <p class="lede">Three ways in. Pick whichever matches where you are today.</p>

  <h3 class="h3">Option A · Buy a pack, ${BRAND.price}</h3>
  <ol class="steps">
    <li><b>Message us.</b> Send the keyword for the pack on WhatsApp: <b>${BRAND.whatsapp}</b>. There is no checkout on a website. The message is the order.</li>
    <li><b>Pay.</b> We reply with the amount and the payment details. You pay and send the confirmation.</li>
    <li><b>Receive your files.</b> We send the download link, usually the same day. The files open on your phone, your laptop and your tablet.</li>
    <li><b>Start on day one.</b> Every pack has a setup plan in the first few pages, so you use it on the next enquiry, not next month.</li>
  </ol>
  <p class="note">Do-it-yourself means do-it-yourself. No consultation is included and nobody is on call to do it for you. If you want that, that is Option B.</p>

  <h3 class="h3">Option B · Start a project</h3>
  <ol class="steps">
    <li><b>Message us on WhatsApp</b> (${BRAND.whatsapp}) <b>or send a short brief</b> through the contact page. Tell us what you are trying to solve, not what you want to buy.</li>
    <li><b>We reply with questions.</b> Or we tell you it is not a good fit, and why. That happens, and you will not be chased afterwards.</li>
    <li><b>Twenty-minute call.</b> We look at what you have, what is not working, and what a realistic result looks like.</li>
    <li><b>Written proposal.</b> Scope, timeline and price in writing, before any work starts. You can read it, argue with it, and walk away.</li>
    <li><b>We start.</b> Understand, then Simplify, then Build, then Optimize. You see the work as it goes, not at the end.</li>
  </ol>

  <h3 class="h3">Option C · Free review, no charge</h3>
  <ol class="steps">
    <li><b>Send us three things:</b> your link, your business name, and one line about what you sell.</li>
    <li><b>Within 24 hours</b> you get a voice note and three points: what is costing you enquiries, what to fix first, and what to leave alone.</li>
    <li><b>That is it.</b> No sales call, no obligation, no list, no spam. Most people fix the easy things themselves, and that is a fine outcome.</li>
  </ol>

  <h3 class="h3">What to have ready before you message us</h3>
  <div class="grid2">
    <div><ul class="tick">
      <li>Your business name</li>
      <li>What you sell, in one line</li>
      <li>Who buys it, and where they are</li>
      <li>Your WhatsApp number</li>
      <li>Your website link, or your social page</li>
    </ul></div>
    <div><ul class="tick">
      <li>Real photos of your work, shop or space</li>
      <li>Your logo, if you have one</li>
      <li>What you have already tried</li>
      <li>Where you want to be in three months</li>
      <li>Your budget range, if you have one</li>
    </ul></div>
  </div>
  <p class="note">You do not need all of this to start. A link and one line is enough for the free review. The rest makes a project faster.</p>

  <h3 class="h3">Where to reach us</h3>
  <p><b>WhatsApp: ${BRAND.whatsapp}</b> &nbsp;·&nbsp; <b>wa.me/2349050690837</b><br>
  Website: ${BRAND.site} &nbsp;·&nbsp; Portfolio of concept projects: /work</p>
  <p class="note">We are in Lagos. We reply on WhatsApp faster than email, and faster than we reply to a form.</p>
</section>`);
}

/* 5 to 13. the nine packs */
packBlocks.forEach((b, i) => {
  const num = i + 1;
  const name = b.title.replace(/^\d+\.\s*/, "");
  const keyword = PACK_META[i][0];
  const body = renderMarkdown(b.lines.join("\n"));

  pages.push(`<section class="page">
  <div class="cover-top">
    <div class="wordmark">${BRAND.wordmark}</div>
    <div class="slogan">${BRAND.slogan}</div>
    <div class="onum" style="margin-top:14px">PACK ${String(num).padStart(2, "0")} OF 09</div>
  </div>
  <h2 class="oname">${name}</h2>
  <div class="obar">
    <span class="kw">${esc(keyword)}</span>
    <span>Message <b>${esc(keyword)}</b> on WhatsApp: <b>${BRAND.whatsapp}</b></span>
    <span class="oprice">${BRAND.price}</span>
  </div>
  <h1 class="h">${num}. ${name.replace(/&/g,"&amp;")}</h1>${body}
  <div class="closing">
    <p class="small">Easywurld · Simplify. Optimize. Grow. · WhatsApp ${BRAND.whatsapp}</p>
  </div>
</section>`);
});

/* 14. the order slip */
{
  const rows = packBlocks.map((b, i) => {
    const name = b.title.replace(/^\d+\.\s*/, "");
    const [keyword, value] = PACK_META[i];
    return `<tr class=""><td class="r mono">${i + 1}</td><td class="">${esc(name)}</td><td class=""><span class="kw">${esc(keyword)}</span></td><td class="kwcell">${value}</td></tr>`;
  }).join("");

  pages.push(`<section class="page">
  <div class="cover-top"><div class="wordmark">${BRAND.wordmark}</div><div class="slogan">${BRAND.slogan}</div></div>
  <p>Nine packs, one message away<b>Nine packs. ${BRAND.price} each. One message away.</b></p><table class="files"><thead><tr><th class="r">#</th><th>Pack</th><th>Message this keyword</th><th>Est. value</th></tr></thead><tbody>${rows}<tr class="tot"><td class="r mono"></td><td class=""></td><td class=""><b>Total value of all nine</b></td><td class="kwcell"><b>₦297,500</b></td></tr></tbody></table><p><b>How to order.</b></p><ol class="steps"><li>Send us the keyword for the pack you want on WhatsApp: <b>${BRAND.whatsapp}</b></li><li>We confirm the pack, send the amount and the payment instruction.</li><li>You pay and send the confirmation.</li><li>We send the download link, usually the same day.</li></ol><p><b>Not sure which pack you need?</b> Describe the problem in one sentence. We will point you to the right one, or tell you that you do not need to buy anything.</p>
  <div class="closing">
    <p>
<b>${BRAND.wordmark}</b> · *Simplify. Optimize. Grow.*
Independent digital studio, Lagos, Nigeria.
Web design · SEO · content · business systems · reports.
WhatsApp: **${BRAND.whatsapp}** · https://${BRAND.site}

*All nine packs are do-it-yourself resources priced at ${BRAND.price}. They contain no client work and no guaranteed results. All portfolio names shown by Easywurld are concept projects and sample builds, not client engagements.*
</p>
  </div>
</section>`);
}

/* ------------------------------------------------------------------ */
/* write the document                                                  */
/* ------------------------------------------------------------------ */

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Easywurld — Nine Practical Offers for Small Businesses</title><style>
${CSS.replace(/\n+$/, "")}
</style></head><body>

${pages[0]}\n${pages[1]}\n\n${pages[2]}\n\n${pages.slice(3).join("\n")}
</body></html>`;

writeFileSync(join(outDir, "EASYWURLD_OFFERS_MASTER.html"), html);

console.log(
  `EASYWURLD_OFFERS_MASTER.html: ${statSync(join(outDir, "EASYWURLD_OFFERS_MASTER.html")).size.toLocaleString()} chars`
  + ` | ${pages.length} pages`
);
