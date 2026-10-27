/* Easywurld social kit — main generator.
 *
 * Reads content/days-*.json (the source of truth) and writes:
 *   EASYWURLD_POST_COMMANDER.html  the phone app
 *   MONTH_POSTS.md                 every post, long form, for reading/printing
 *   content_calendar.csv           one dated row per scheduled post
 *
 * Run:  node launch-content/social-command/build/build-kit.mjs
 */

import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dateFor, shortFor, START_DATE } from "./kit-dates.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..");
const contentDir = join(outDir, "content");

/* ------------------------------------------------------------------ */
/* 1. read the source days                                            */
/* ------------------------------------------------------------------ */

/* the meme bank lives beside the day files, one joke per day; it is not a
   scheduled post, it is an alternative shape for the Instagram slot. */
const memeFile = join(contentDir, "memes.json");
const memeByPost = new Map();
if (existsSync(memeFile)) {
  const bank = JSON.parse(readFileSync(memeFile, "utf8"));
  for (const m of bank.memes || []) memeByPost.set(m.swap, m);
}

const files = readdirSync(contentDir)
  .filter((f) => /^days-\d+(-\d+)?\.json$/.test(f))
  .sort();

if (!files.length) {
  console.error("No content/days-*.json found. Nothing to build.");
  process.exit(1);
}

const days = [];
for (const f of files) {
  const raw = JSON.parse(readFileSync(join(contentDir, f), "utf8"));
  const list = Array.isArray(raw) ? raw : raw.days || Object.values(raw);
  for (const d of list) days.push(d);
}
days.sort((a, b) => a.day - b.day);

/* ------------------------------------------------------------------ */
/* 2. posting times (WAT)                                             */
/* ------------------------------------------------------------------ */

const TIMES = {
  tiktok: ["07:00", "09:15", "11:30", "13:45", "15:00", "16:30",
    "18:00", "19:00", "20:00", "20:45", "21:30"],
  instagram: ["07:30", "10:00", "12:30", "14:15", "15:45", "17:15",
    "18:30", "19:30", "20:15", "20:45", "21:15"],
  facebook: ["08:00", "10:30", "12:00", "13:30", "15:00", "16:30",
    "18:00", "19:30", "20:15", "21:00", "21:45"],
  linkedin: ["08:15", "12:15", "16:15", "17:15"],
};
const LI_BONUS = "20:15";

/* the time a platform slot writes into the post object */
const TIME_KEY = {
  tiktok: "ttTime",
  instagram: "igTime",
  facebook: "fbTime",
};

const META = {
  brand: "Easywurld",
  slogan: "Simplify. Optimize. Grow.",
  whatsapp: "0905 069 0837",
  waLink: "https://wa.me/2349050690837",
  site: "https://website-builder-portfolio.vercel.app",
  timezone: "Africa/Lagos (WAT, UTC+1)",
  startDate: START_DATE,
};

/* ------------------------------------------------------------------ */
/* 3. slot the posts                                                  */
/* ------------------------------------------------------------------ */

/* Each platform takes the posts that have a version for it, in order.
   LinkedIn gets 4 fixed slots plus one optional 20:15 slot. */
function slotDay(posts) {
  const out = { tiktok: [], instagram: [], facebook: [], linkedin: [] };

  for (const plat of ["tiktok", "instagram", "facebook"]) {
    posts.filter((p) => p[plat]).forEach((p, i) => {
      out[plat].push({ post: p, time: TIMES[plat][i] });
    });
  }

  posts.filter((p) => p.linkedin).forEach((p, i) => {
    out.linkedin.push({ post: p, time: TIMES.linkedin[i] });
  });

  /* the optional fifth LinkedIn slot */
  const liPosts = posts.filter((p) => p.linkedin);
  if (liPosts.length > TIMES.linkedin.length) {
    out.linkedin.push({ post: liPosts[TIMES.linkedin.length], time: LI_BONUS, opt: true });
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* 3b. derived fields                                                 */
/* ------------------------------------------------------------------ */

/* Every post needs hashtags and a visual direction. Writing them 330 times by
   hand invites drift, so they are derived from the show unless the post
   overrides them. The show is carried in p.show. */
const SHOW_TAGS = {
  fixthis: ["#LagosBusiness", "#WebsiteDesign", "#SmallBusinessNigeria", "#Easywurld"],
  steal: ["#SmallBusinessTips", "#LagosSME", "#Easywurld", "#MarketingTips"],
  saidno: ["#LagosBusiness", "#Easywurld", "#SmallBusinessNigeria", "#HonestBusiness"],
  honestad: ["#SmallBusinessNigeria", "#LagosBusiness", "#Easywurld", "#WhatsAppBusiness"],
  onething: ["#Lagos", "#Relatable", "#Easywurld", "#LagosBusiness"],
  hottake: ["#LagosBusiness", "#Easywurld", "#SmallBusinessNigeria", "#HotTake"],
  street: ["#Lagos", "#StreetInterview", "#SmallBusinessNigeria", "#Easywurld"],
  truestory: ["#Lagos", "#StoryTime", "#Easywurld", "#SmallBusinessNigeria"],
};

const SHOW_ASSET = {
  fixthis: "Screen recording of the page, cream frame, one terracotta arrow on the problem.",
  steal: "Kinetic type on cream, one line at a time, mark bottom-right.",
  saidno: "Talking head, plain cream wall, no cuts except on the turn.",
  honestad: "Nine printed packs fanned on a table, shot from above.",
  onething: "Flat print-style card, one large serif line, one terracotta accent.",
  hottake: "Talking head to camera, one jump cut on the disagreement.",
  street: "Handheld, market or street background, real sound, captions burned in.",
  truestory: "Talking head, slow zoom out, no music under the first 10 seconds.",
};

function fill(list) {
  return list.map((p) => {
    const tags = SHOW_TAGS[p.show] || ["#Easywurld", "#LagosBusiness"];
    const asset = SHOW_ASSET[p.show] || "Cream background, one idea per frame.";
    for (const plat of ["tiktok", "instagram", "facebook"]) {
      const v = p[plat];
      if (!v) continue;
      if (!v.tags) v.tags = plat === "facebook" ? tags.slice(0, 3) : tags;
      if (!v.asset && plat !== "facebook") v.asset = asset;
    }
    return p;
  });
}

/* ------------------------------------------------------------------ */
/* 4. the data block for the app                                      */
/* ------------------------------------------------------------------ */

const dataDays = days.map((day, i) => {
  const dt = dateFor(i);
  const posts = fill(day.posts.map((p) => ({ ...p })));

  const slot = slotDay(posts);
  for (const plat of ["tiktok", "instagram", "facebook"]) {
    for (const s of slot[plat]) {
      s.post[TIME_KEY[plat]] = s.time;
    }
  }
  for (const s of slot.linkedin) {
    if (s.opt) { s.post.liBonus = s.time; s.post.liOpt = true; }
    else s.post.liTime = s.time;
  }

  /* key order in the built post object */
  const ordered = posts.map((p) => {
    const q = {};
    q.id = p.id; q.type = p.type; q.topic = p.topic; q.why = p.why;
    if (p.allow_banned) q.allow_banned = p.allow_banned;
    q.tiktok = p.tiktok; q.instagram = p.instagram;
    q.facebook = p.facebook; q.linkedin = p.linkedin;
    if (p.liBonus) { q.liBonus = p.liBonus; q.liOpt = p.liOpt; }
    else if (p.liTime) q.liTime = p.liTime;
    q.ttTime = p.ttTime; q.igTime = p.igTime; q.fbTime = p.fbTime;
    return q;
  });

  return {
    day: day.day,
    label: `Day ${day.day} · ${dt.weekday}`,
    theme: day.theme,
    offer: day.offer,
    posts: ordered,
    date: dt,
    short: shortFor(i),
  };
});

const DATA = { meta: META, times: TIMES, days: dataDays };

/* ------------------------------------------------------------------ */
/* 5. the phone app                                                   */
/* ------------------------------------------------------------------ */

const shell = readFileSync(join(here, "shell.html"), "utf8");
const appScript = readFileSync(join(here, "app-script.js"), "utf8");

const appHtml = shell.replace(
  "<!--APP_SCRIPT-->",
  "<script>" + appScript.replace("/*__DATA__*/", JSON.stringify(DATA)) + "</script>"
);

writeFileSync(join(outDir, "EASYWURLD_POST_COMMANDER.html"), appHtml);

/* ------------------------------------------------------------------ */
/* 6. MONTH_POSTS.md                                                  */
/* ------------------------------------------------------------------ */

const md = [];
const push = (...lines) => md.push(...lines);

/** a body as a markdown blockquote, blank lines become "> " */
function quote(text) {
  return String(text).split("\n").map((l) => "> " + l).join("\n");
}

const first = dataDays[0];
const last = dataDays[dataDays.length - 1];
const longMonth = (m) => ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"][
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(m)];

push("# Easywurld — 30 Day Social Plan");
push("### 11 core posts a day, restructured for TikTok, Instagram and Facebook");
push("");
push("**Every post is ready to publish.** Hook, beats, voiceover, slide copy, caption, hashtags and");
push("visual direction are all written. No placeholders, nothing to decide on the day.");
push("");
push("| | |");
push("|---|---|");
push(`| Plan starts | **${first.date.weekday} ${first.date.day} ${longMonth(first.date.month)} ${first.date.year}** (change it in the app if you want a different month) |`);
push(`| Ends | **${last.date.weekday} ${last.date.day} ${longMonth(last.date.month)} ${last.date.year}** |`);
push("| Daily volume | 11 core posts → 11 TikTok + 11 Instagram + 11 Facebook = **33 posts a day** |");
push(`| Month total | **${(dataDays.length * 33).toLocaleString()} posts** (${(dataDays.length * 11).toLocaleString()} core ideas x 3 platforms) |`);
push("| Times | Africa/Lagos (WAT, UTC+1). Every post block carries its own time. |");
push("| Phone tool | `EASYWURLD_POST_COMMANDER.html` — one file, works offline, copy button on every block, tick marks that save on the phone. |");
push("| Spreadsheet | `content_calendar.csv` — one row per post, dated, editable on your phone in Google Sheets. |");
push("| Brand rules | `marketing/brand-prompt.md`. Never invent results, ratings or testimonials. |");
push("");
push("**How to read a post block.** Each post has one core idea and up to four platform versions.");
push("The platform versions are different writing, not the same caption pasted four times.");
push("");
push("**The daily mix.** 7 entertain, 3 teach, 1 sell — one job per post, never two.");
push("Memes sit near 20% of output.");
push("");
push("**Scheduling a month ahead.** Everything below is dated. Open the sheet, sort by date, and");
push("schedule the whole month in one sitting. The app is for the days when something needs");
push("writing on the spot.");
push("");
push("---");
push("");
push("");

for (const d of dataDays) {
  push(`# Day ${d.day} · ${d.date.weekday} · ${d.date.label} ${d.date.year} — ${d.theme}`);
  push("");
  push(`**Offer in focus:** ${d.offer}`);
  push("");
  push("---");
  push("");
  push("");

  d.posts.forEach((p, idx) => {
    push(`## Post ${String(idx + 1).padStart(2, "0")} · ${p.topic}`);
    push("");
    push(`**Type:** ${p.type} · **Why it works:** ${p.why}`);
    push("");

    if (p.tiktok) {
      push(`### TikTok · ${p.ttTime} · ${p.tiktok.fmt}`);
      push("");
      push("**Hook (0-3s)**");
      push(quote(p.tiktok.hook));
      push("");
      if (p.tiktok.beats && p.tiktok.beats.length) {
        push("**On-screen beats**");
        for (const b of p.tiktok.beats) push("- " + b);
        push("");
      }
      if (p.tiktok.vo) {
        push("**Voiceover script**");
        push(quote(p.tiktok.vo));
        push("");
      }
      if (p.tiktok.cap) {
        push("**Caption**");
        push(quote(p.tiktok.cap));
        push("");
      }
      if (p.tiktok.tags && p.tiktok.tags.length) {
        push(`**Hashtags:** ${p.tiktok.tags.join(" ")}`);
        push("");
      }
      if (p.tiktok.asset) {
        push(`**Visual:** ${p.tiktok.asset}`);
        push("");
      }
    }

    if (p.instagram) {
      const mm = memeByPost.get(p.id);
      push(`### Instagram · ${p.igTime} · ${p.instagram.fmt}`);
      push("");
      if (mm) {
        const shape = mm.format === "chat" ? "chat screenshot"
          : mm.format === "replies" ? "X post + replies"
          : "Reddit thread";
        push(`> **Alternative shape:** ${shape} — "${mm.title}". See MEME_BANK.md, day ${mm.day}. `
          + `Swap this carousel for the meme and keep the caption below.`);
        push("");
      }
      if (p.instagram.slides && p.instagram.slides.length) {
        push(/reel/i.test(p.instagram.fmt) ? "**Script slides**" : "**Slide copy**");
        p.instagram.slides.forEach((s, i) => push(`${i + 1}. ${s.replace(/\n/g, " ")}`));
        push("");
      }
      if (p.instagram.cap) {
        push("**Caption**");
        push(quote(p.instagram.cap));
        push("");
      }
      if (p.instagram.tags && p.instagram.tags.length) {
        push(`**Hashtags:** ${p.instagram.tags.join(" ")}`);
        push("");
      }
      if (p.instagram.asset) {
        push(`**Visual:** ${p.instagram.asset}`);
        push("");
      }
    }

    if (p.facebook) {
      push(`### Facebook · ${p.fbTime} · ${p.facebook.fmt}`);
      push("");
      push(quote(p.facebook.body));
      push("");
    }

    if (p.linkedin) {
      const lt = p.liBonus ? `${p.liBonus} (optional)` : p.liTime;
      push(`### LinkedIn · ${lt} · ${p.linkedin.fmt}`);
      push("");
      push(quote(p.linkedin.body));
    }

    push("");
    push("---");
    push("");
    push("");
  });
}

push("---");
push("");
push("# How to publish this from your phone");
push("");
push("**One file.** `EASYWURLD_POST_COMMANDER.html` is a single file, works with no internet, and");
push("saves your tick marks on the phone. Add it to your home screen and it behaves like an app.");
push("");
push("**Free scheduling, no new apps.**");
push("");
push("| Platform | How to schedule | Cost |");
push("|---|---|---|");
push("| Instagram + Facebook | Meta Business Suite, timezone Africa/Lagos | Free |");
push("| TikTok | Schedule option inside the app for business accounts | Free |");
push("| LinkedIn | The schedule button in the post composer | Free |");
push("");
push("**Set the whole month in one sitting.** Every post above is dated, so the first Sunday of the");
push("month you can schedule all thirty days at once. After that it is 20 minutes a week. Leave the");
push("two slots a week that need a real human reply open, and do not schedule a post you have not");
push("read out loud once.");
push("");
push("**Where to schedule from.** `content_calendar.csv` is the same plan as a Google Sheet. Sort by");
push("date, and every row carries its time, its format and the full copy, so you never have to");
push("remember which post goes where.");
push("");
push("**Storage.** Keep images and videos in Google Drive, not on the phone. Open them from Drive");
push("when you need them. Text is cheap, video is not.");
push("");
push("**Reply first, post second.** A reply to a real customer beats one more post. If a slot");
push("arrives and a customer is waiting, answer the customer and let the post wait.");
push("");

writeFileSync(join(outDir, "MONTH_POSTS.md"), md.join("\n"));

/* ------------------------------------------------------------------ */
/* 7. the dated calendar CSV                                          */
/* ------------------------------------------------------------------ */

const csvCell = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;

const rows = [[
  "Date", "Weekday", "Day", "Post ID", "Type", "Topic", "Platform", "Time (WAT)",
  "Format", "Hook or slide 1", "Main body / script", "Caption", "Hashtags",
  "Visual direction", "Status", "Note",
].map(csvCell).join(",")];

for (const d of dataDays) {
  for (const p of d.posts) {
    if (p.tiktok) {
      rows.push([
        d.date.iso, d.date.weekday, "D" + d.day, p.id, p.type, p.topic,
        "TikTok", p.ttTime, p.tiktok.fmt, p.tiktok.hook,
        p.tiktok.vo || "", p.tiktok.cap || "",
        (p.tiktok.tags || []).join(" "), p.tiktok.asset || "", "", "",
      ].map(csvCell).join(","));
    }
    if (p.instagram) {
      rows.push([
        d.date.iso, d.date.weekday, "D" + d.day, p.id, p.type, p.topic,
        "Instagram", p.igTime, p.instagram.fmt,
        (p.instagram.slides && p.instagram.slides[0]) || "",
        (p.instagram.slides || []).slice(1).join(" | "), p.instagram.cap || "",
        (p.instagram.tags || []).join(" "), p.instagram.asset || "", "", "",
      ].map(csvCell).join(","));
    }
    if (p.facebook) {
      rows.push([
        d.date.iso, d.date.weekday, "D" + d.day, p.id, p.type, p.topic,
        "Facebook", p.fbTime, p.facebook.fmt, "",
        p.facebook.body, "", "", "", "", "",
      ].map(csvCell).join(","));
    }
    if (p.linkedin) {
      rows.push([
        d.date.iso, d.date.weekday, "D" + d.day, p.id, p.type, p.topic,
        "LinkedIn", p.liBonus || p.liTime, p.linkedin.fmt, "",
        p.linkedin.body, "", "", "", p.liBonus ? "Optional" : "", "",
      ].map(csvCell).join(","));
    }
  }
}

writeFileSync(join(outDir, "content_calendar.csv"), rows.join("\n"));

/* ------------------------------------------------------------------ */
/* 8. report                                                          */
/* ------------------------------------------------------------------ */

const corePosts = dataDays.reduce((n, d) => n + d.posts.length, 0);
const scheduled = rows.length - 1;
const appBytes = statSync(join(outDir, "EASYWURLD_POST_COMMANDER.html")).size;
const monthBytes = statSync(join(outDir, "MONTH_POSTS.md")).size;

console.log(
  `days: ${dataDays.length} (${first.date.iso} to ${last.date.iso})`
  + ` | core posts: ${corePosts} | scheduled posts: ${scheduled}`
  + ` | app: ${appBytes.toLocaleString()} B | month doc: ${monthBytes.toLocaleString()} B`
  + ` | csv rows: ${scheduled}`
);
