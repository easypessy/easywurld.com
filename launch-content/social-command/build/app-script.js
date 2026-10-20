
/* Easywurld Post Commander — app logic.
   The data block below is injected by build/build-kit.mjs from content/days-*.json. */
var DATA = /*__DATA__*/;

/* ---------------- state ---------------- */
var KEY_DONE = "eww_done_v2", KEY_NOTE = "eww_note_v2", KEY_DAY = "eww_day_v2",
    KEY_OPEN = "eww_open_v2", KEY_START = "eww_start_v2";
var done = {}, notes = {}, open = {}, dayIdx = 0, filter = "all", startDate = "";

var PLAT = {
  tiktok: { label: "TikTok", cls: "tt" },
  instagram: { label: "Instagram", cls: "ig" },
  facebook: { label: "Facebook", cls: "fb" },
  linkedin: { label: "LinkedIn", cls: "li" }
};
var WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var WD_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function load() {
  try { done = JSON.parse(localStorage.getItem(KEY_DONE) || "{}"); } catch (e) { done = {}; }
  try { notes = JSON.parse(localStorage.getItem(KEY_NOTE) || "{}"); } catch (e) { notes = {}; }
  try { open = JSON.parse(localStorage.getItem(KEY_OPEN) || "{}"); } catch (e) { open = {}; }
  try { var d = parseInt(localStorage.getItem(KEY_DAY), 10); if (!isNaN(d)) dayIdx = d; } catch (e) {}
  startDate = localStorage.getItem(KEY_START) || (DATA.meta && DATA.meta.startDate) || "2026-10-19";
  if (dayIdx < 0 || dayIdx >= DATA.days.length) dayIdx = 0;
}
function save() {
  localStorage.setItem(KEY_DONE, JSON.stringify(done));
  localStorage.setItem(KEY_NOTE, JSON.stringify(notes));
  localStorage.setItem(KEY_OPEN, JSON.stringify(open));
  localStorage.setItem(KEY_DAY, String(dayIdx));
  localStorage.setItem(KEY_START, startDate);
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function toast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 1700);
}

/* ---------------- dates ---------------- */
function parseISO(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
function dateFor(i) { return addDays(parseISO(startDate), i); }
function dateLabel(d) { return WD_LONG[(d.getDay() + 6) % 7] + " " + d.getDate() + " " + MO[d.getMonth()] + " " + d.getFullYear(); }
function dateShort(d) { return d.getDate() + " " + MO[d.getMonth()]; }
function isoOf(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function todayIndex() {
  var t = new Date(); t.setHours(0, 0, 0, 0);
  for (var i = 0; i < DATA.days.length; i++) {
    if (dateFor(i).getTime() === t.getTime()) return i;
  }
  return -1;
}

/* ---------------- schedule ---------------- */
function slotsForDay(d) {
  var out = [], p, i, times = DATA.times;
  for (p in PLAT) {
    if (!PLAT.hasOwnProperty(p)) continue;
    var list = [];
    for (i = 0; i < d.posts.length; i++) if (d.posts[i][p]) list.push(d.posts[i]);
    list.forEach(function (post, idx) {
      var t = (times[p] && times[p][idx]) ? times[p][idx] : "";
      if (p === "linkedin" && post.liBonus) t = post.liBonus;
      out.push({ time: t, platform: p, post: post, key: post.id + ":" + p });
    });
  }
  out.sort(function (a, b) {
    return a.time < b.time ? -1 : a.time > b.time ? 1 : (a.platform < b.platform ? -1 : 1);
  });
  return out;
}
function minutes(t) { var a = t.split(":"); return (+a[0]) * 60 + (+a[1]); }
function nextUp(slots) {
  var now = new Date(), n = now.getHours() * 60 + now.getMinutes();
  for (var i = 0; i < slots.length; i++) if (!done[slots[i].key] && minutes(slots[i].time) >= n) return slots[i];
  for (var j = 0; j < slots.length; j++) if (!done[slots[j].key]) return slots[j];
  return null;
}

/* ---------------- copy ---------------- */
function copyText(text, label) {
  if (!text) { toast("Nothing to copy"); return; }
  var t = String(text);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(
      function () { toast("Copied: " + label); },
      function () { fallbackCopy(t, label); }
    );
  } else fallbackCopy(t, label);
}
function fallbackCopy(t, label) {
  var ta = document.createElement("textarea");
  ta.value = t; ta.setAttribute("readonly", "");
  ta.style.position = "fixed"; ta.style.top = "0"; ta.style.left = "0"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
  var ok = false;
  try { ok = document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  if (ok) { toast("Copied: " + label); }
  else {
    document.getElementById("dlgTitle").textContent = label;
    document.getElementById("dlgText").value = t;
    var d = document.getElementById("dlg");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
}
function fullText(s) {
  var p = s.post, out = [];
  if (s.platform === "tiktok") {
    out.push(p.tiktok.hook, "---", p.tiktok.beats.join("\n"), "", "VOICEOVER:", p.tiktok.vo, "", "CAPTION:", p.tiktok.cap, p.tiktok.tags.join(" "));
  } else if (s.platform === "instagram") {
    out.push(p.instagram.slides.join("\n"), "", "CAPTION:", p.instagram.cap, p.instagram.tags.join(" "));
  } else if (s.platform === "facebook") {
    out.push(p.facebook.body);
  } else {
    out.push(p.linkedin.body);
  }
  return out.join("\n");
}
function copyPost(key) { var s = findSlot(key); if (s) copyText(fullText(s), PLAT[s.platform].label); }
function copyField(key, field) {
  var s = findSlot(key); if (!s) return;
  var p = s.post, v = "";
  if (field === "vo") v = p.tiktok.vo;
  else if (field === "cap") v = s.platform === "tiktok" ? p.tiktok.cap : p.instagram.cap;
  else if (field === "body") v = s.platform === "facebook" ? p.facebook.body : p.linkedin.body;
  else if (field === "slides") v = p.instagram.slides.join("\n\n");
  copyText(v, field);
}
function findSlot(key) {
  var slots = slotsForDay(DATA.days[dayIdx]);
  for (var i = 0; i < slots.length; i++) if (slots[i].key === key) return slots[i];
  return null;
}

/* ---------------- render: day ---------------- */
function renderToday() {
  var d = DATA.days[dayIdx], slots = slotsForDay(d), dt = dateFor(dayIdx);
  var doneCount = slots.filter(function (s) { return done[s.key]; }).length;
  document.getElementById("bar").style.width = (slots.length ? doneCount / slots.length * 100 : 0) + "%";
  document.getElementById("progTxt").textContent = doneCount + " of " + slots.length + " done";
  document.getElementById("dayTxt").textContent = dateLabel(dt);

  var h = "";
  h += '<div class="dayscroll">';
  var ti = todayIndex();
  DATA.days.forEach(function (dd, i) {
    var s = slotsForDay(dd), c = s.filter(function (x) { return done[x.key]; }).length;
    var cls = "daybtn" + (i === dayIdx ? " today" : "") + (c === s.length && s.length ? " done" : "");
    h += '<button class="' + cls + '" onclick="setDay(' + i + ')"><b>' + dateShort(dateFor(i)) + '</b>' +
      WD[(dateFor(i).getDay() + 6) % 7] + (i === ti ? ' <span class="dot"></span>' : "") +
      (c === s.length && s.length ? "<br>" + c + "/" + s.length : "") + "</button>";
  });
  h += "</div>";

  h += '<div class="chips">';
  ["all", "tiktok", "instagram", "facebook", "linkedin", "left"].forEach(function (f) {
    var nm = f === "all" ? "All " + slots.length : f === "left" ? "Not done" : PLAT[f].label;
    h += '<button class="chip' + (filter === f ? " on" : "") + '" onclick="setFilter(\'' + f + '\')">' + nm + "</button>";
  });
  h += "</div>";

  var nu = nextUp(slots);
  if (nu) {
    h += '<h2 class="sechead">Next up <small>' + nu.time + " · " + PLAT[nu.platform].label + "</small></h2>";
    h += cardHTML(nu);
  }
  h += '<h2 class="sechead">' + esc(d.theme) + " <small>" + esc(d.offer) + "</small></h2>";
  var shown = 0;
  slots.forEach(function (s) {
    if (filter !== "all" && filter !== "left" && s.platform !== filter) return;
    if (filter === "left" && done[s.key]) return;
    shown++; h += cardHTML(s);
  });
  if (!shown) h += '<p class="mini">Nothing here. Tap All to see everything for this day.</p>';
  document.getElementById("viewToday").innerHTML = h;
  bindNotes();
}

function cardHTML(s) {
  var p = s.post, isOpen = !!open[s.key], isDone = !!done[s.key];
  var h = '<div class="card' + (isOpen ? " open" : "") + (isDone ? " done" : "") + '" id="c_' + s.key.replace(/[^a-z0-9]/gi, "") + '">';
  h += '<div class="chead" onclick="toggleCard(\'' + s.key + '\')">';
  h += '<div style="min-width:0;flex:1">';
  h += '<div><span class="badge ' + PLAT[s.platform].cls + '">' + PLAT[s.platform].label + "</span> <span class=\"time\">" + s.time + (p.liOpt ? " · optional" : "") + "</span></div>";
  h += '<div class="ctitle">' + esc(p.topic) + "</div>";
  h += '<div class="ctype">' + esc(p.type) + " · post " + p.id.split("-")[1] + "</div>";
  h += "</div>";
  h += '<button class="tick' + (isDone ? " on" : "") + '" onclick="event.stopPropagation();toggleDone(\'' + s.key + '\')">' + (isDone ? "✓" : "") + "</button>";
  h += "</div>";
  if (isOpen) {
    h += '<div class="cbody">';
    h += '<div class="blk"><h4>Why this works</h4><p>' + esc(p.why) + "</p></div>";
    if (s.platform === "tiktok") {
      var t = p.tiktok;
      h += '<div class="blk"><h4>Format</h4><p>' + esc(t.fmt) + "</p></div>";
      h += '<div class="blk"><h4>Hook (0-3s)</h4><p>' + esc(t.hook) + "</p></div>";
      h += '<div class="blk"><h4>On-screen beats</h4><ul class="beats">' + t.beats.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>";
      h += '<div class="blk"><h4>Voiceover script</h4><p>' + esc(t.vo) + "</p></div>";
      h += '<div class="blk"><h4>Caption</h4><p>' + esc(t.cap) + "</p></div>";
      h += '<div class="blk"><h4>Hashtags</h4><p class="tags">' + esc(t.tags.join(" ")) + "</p></div>";
      h += '<div class="blk"><h4>Visual</h4><p>' + esc(t.asset) + "</p></div>";
    } else if (s.platform === "instagram") {
      var g = p.instagram;
      h += '<div class="blk"><h4>Format</h4><p>' + esc(g.fmt) + "</p></div>";
      h += '<div class="blk"><h4>' + (/reel/i.test(g.fmt) ? "Script slides" : "Slide copy") + '</h4><ul class="beats">' + g.slides.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>";
      h += '<div class="blk"><h4>Caption</h4><p>' + esc(g.cap) + "</p></div>";
      h += '<div class="blk"><h4>Hashtags</h4><p class="tags">' + esc(g.tags.join(" ")) + "</p></div>";
      h += '<div class="blk"><h4>Visual</h4><p>' + esc(g.asset) + "</p></div>";
    } else if (s.platform === "facebook") {
      var f = p.facebook;
      h += '<div class="blk"><h4>Format</h4><p>' + esc(f.fmt) + "</p></div>";
      h += '<div class="blk"><h4>Post</h4><p>' + esc(f.body) + "</p></div>";
    } else {
      var l = p.linkedin;
      h += '<div class="blk"><h4>Format</h4><p>' + esc(l.fmt) + "</p></div>";
      h += '<div class="blk"><h4>Post</h4><p>' + esc(l.body) + "</p></div>";
    }
    h += '<div class="copyrow">';
    h += '<button class="btn" onclick="copyPost(\'' + s.key + '\')">Copy all for ' + PLAT[s.platform].label + "</button>";
    if (s.platform === "tiktok") h += '<button class="btn ghost" onclick="copyField(\'' + s.key + '\',\'vo\')">Copy voiceover</button>';
    if (s.platform === "tiktok" || s.platform === "instagram") h += '<button class="btn ghost" onclick="copyField(\'' + s.key + '\',\'cap\')">Copy caption</button>';
    if (s.platform === "facebook" || s.platform === "linkedin") h += '<button class="btn ghost" onclick="copyField(\'' + s.key + '\',\'body\')">Copy post</button>';
    if (s.platform === "instagram") h += '<button class="btn ghost" onclick="copyField(\'' + s.key + '\',\'slides\')">Copy slides</button>';
    h += "</div>";
    h += '<div class="blk"><h4>Your note</h4><textarea class="note" data-note="' + s.key + '" placeholder="e.g. record this at 3pm, use the shop photo">' + esc(notes[s.key] || "") + "</textarea></div>";
    h += "</div>";
  }
  h += "</div>";
  return h;
}
function bindNotes() {
  var tas = document.querySelectorAll("textarea[data-note]");
  for (var i = 0; i < tas.length; i++) {
    tas[i].addEventListener("change", function (e) {
      notes[e.target.getAttribute("data-note")] = e.target.value;
      save(); toast("Note saved");
    });
  }
}
function toggleCard(key) {
  open[key] = !open[key]; save(); renderToday();
  setTimeout(function () {
    var el = document.getElementById("c_" + key.replace(/[^a-z0-9]/gi, ""));
    if (el) el.scrollIntoView({ block: "start" });
  }, 20);
}
function toggleDone(key) { if (done[key]) delete done[key]; else done[key] = 1; save(); renderToday(); }
function setDay(i) { dayIdx = i; save(); renderToday(); window.scrollTo(0, 0); }
function setFilter(f) { filter = f; renderToday(); }

/* ---------------- render: month ---------------- */
function renderMonth() {
  var tot = 0, td = 0, h = "";
  var daySlots = slotsForDay(DATA.days[0]).length;
  h += '<h2 class="sechead">The month <small>' + DATA.days.length + " days · " + DATA.days.length * daySlots + " posts</small></h2>";
  h += '<div class="monthgrid">';
  DATA.days.forEach(function (dd, i) {
    var s = slotsForDay(dd), c = s.filter(function (x) { return done[x.key]; }).length;
    tot += s.length; td += c;
    var dt = dateFor(i);
    var pct = s.length ? Math.round(c / s.length * 100) : 0;
    h += '<button class="mcell' + (i === dayIdx ? " on" : "") + '" onclick="setDay(' + i + ')">';
    h += '<span class="md">' + dateShort(dt) + "</span>";
    h += '<span class="mw">' + WD[(dt.getDay() + 6) % 7] + "</span>";
    h += '<span class="mbar"><i style="width:' + pct + '%"></i></span>';
    h += '<span class="mn">' + c + "/" + s.length + "</span>";
    h += "</button>";
  });
  h += "</div>";
  h += '<h2 class="sechead">Totals</h2><div class="grid2">';
  h += '<div class="tile"><b>' + td + "</b><span>posted</span></div>";
  h += '<div class="tile"><b>' + (tot - td) + "</b><span>left</span></div>";
  h += "</div>";

  h += '<h2 class="sechead">Plan start date <small>move the whole plan</small></h2>';
  h += '<div class="copyrow"><input type="date" class="datein" value="' + startDate + '" onchange="setStart(this.value)"></div>';
  h += '<p class="mini">Every day in the app and in the sheet shifts with this date. Set it to the Monday you want to start posting.</p>';

  h += '<h2 class="sechead">Backup <small>save or move your progress</small></h2>';
  h += '<div class="copyrow"><button class="btn" onclick="exportData()">Export progress (file)</button>';
  h += '<button class="btn ghost" onclick="document.getElementById(\'importFile\').click()">Import progress</button></div>';
  h += '<input type="file" id="importFile" class="hide" accept=".json" onchange="importData(this)">';
  h += '<p class="mini">Export writes a small JSON file. Save it to Google Drive so a new phone can pick up where this one stopped.</p>';
  h += '<h2 class="sechead">Reset</h2>';
  h += '<div class="copyrow"><button class="btn ghost" onclick="resetAll()">Clear all tick marks and notes</button></div>';
  document.getElementById("viewMonth").innerHTML = h;
}
function setStart(v) {
  if (!v) return;
  startDate = v; save(); renderMonth(); renderToday();
  toast("Plan now starts " + dateLabel(parseISO(v)));
}
function exportData() {
  var payload = { app: "easywurld-post-commander", v: 2, saved: new Date().toISOString(), done: done, notes: notes, day: dayIdx, start: startDate };
  var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "easywurld-progress-" + isoOf(new Date()) + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  toast("Exported. Save it to Drive.");
}
function importData(inp) {
  var f = inp.files && inp.files[0]; if (!f) return;
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var j = JSON.parse(rd.result);
      if (j.done) done = j.done;
      if (j.notes) notes = j.notes;
      if (j.start) startDate = j.start;
      save(); renderToday(); renderMonth(); toast("Progress imported");
    } catch (e) { toast("That file did not work"); }
  };
  rd.readAsText(f); inp.value = "";
}
function resetAll() {
  if (!confirm("Clear every tick mark and note on this phone?")) return;
  done = {}; notes = {}; save(); renderToday(); renderMonth(); toast("Cleared");
}

/* ---------------- render: help ---------------- */
function renderHelp() {
  var h = "";
  h += '<h2 class="sechead">How to use this</h2>';
  h += '<ol class="helplist">';
  h += "<li>Open this file on your phone. Add it to your home screen and it opens like an app.</li>";
  h += "<li>It opens on today's day of the week, with the next post due at the top.</li>";
  h += "<li>The <b>Month</b> tab shows the whole 30-day run on a grid, so you can see a fortnight ahead instead of reacting to today.</li>";
  h += "<li>Tap a post to open it. Everything is inside: hook, beats, voiceover, caption, hashtags, visual direction.</li>";
  h += "<li>Hit Copy, paste into the app, and tick it off. The tick marks save on the phone.</li>";
  h += "<li>Use the notes box for the small things: which photo, which price, who to tag.</li>";
  h += "</ol>";

  h += '<h2 class="sechead">Scheduling a month ahead</h2>';
  h += "<p class=\"mini\">Everything in this plan is dated, so you can schedule the whole month in one sitting and stop thinking about it.</p>";
  h += '<ul class="helplist">';
  h += "<li><b>Open the sheet.</b> <code>content_calendar.csv</code> is in Google Drive as a Google Sheet. Sort by date. Every row has the time, the format and the full copy.</li>";
  h += "<li><b>Instagram and Facebook:</b> Meta Business Suite (free). Set the timezone to Africa/Lagos. Paste each row's caption and upload the matching asset.</li>";
  h += "<li><b>TikTok:</b> the app itself has a schedule option for business accounts. Upload the video, set the date and time, done.</li>";
  h += "<li><b>LinkedIn:</b> the native schedule button in the post composer. The morning ones can be set the night before.</li>";
  h += "<li><b>First Sunday of the month, 30 minutes.</b> The whole month is already dated, so set it all in one sitting. After that it is 20 minutes a week. Leave two slots a week open for anything that needs a real reply.</li>";
  h += "<li><b>Keep the assets in Drive.</b> Name each file with the post ID and date, for example <code>D12-03_tiktok_04112026</code>. Then finding the right video takes ten seconds.</li>";
  h += "</ul>";

  h += '<h2 class="sechead">About phone storage</h2>';
  h += '<p class="mini">This file is text only, about a megabyte. It will not fill your phone. The images and videos are what fill a phone, so keep those in Google Drive and open them from there when you need them. Delete them from the phone once they are posted.</p>';

  h += '<h2 class="sechead">Times</h2>';
  h += '<p class="mini">All times are Lagos time (WAT, UTC+1). They are based on when Nigerian audiences are actually on their phones: mornings 6-10am, lunch 12-2pm, and the evening peak 7-10pm. LinkedIn sits in the morning and early afternoon, because that is when Nigerian professionals are online.</p>';

  h += '<h2 class="sechead">Rules that keep it honest</h2>';
  h += '<ul class="helplist">';
  h += "<li>Never post a client result, ranking, rating or testimonial you cannot evidence.</li>";
  h += "<li>Demo project names are labelled concept project / sample build.</li>";
  h += "<li>Value numbers are hours x &#8358;5,000, described as an estimate, never as a former price.</li>";
  h += "<li>Say plainly what a pack does not do. Trust comes from the honest post.</li>";
  h += "<li>Memes are 2 of the 11 a day. Keep the other nine useful.</li>";
  h += "<li>Reply to people faster than you post to them.</li>";
  h += "</ul>";

  h += '<h2 class="sechead">Contact</h2>';
  h += '<p class="mini">WhatsApp 0905 069 0837 · <a href="https://wa.me/2349050690837">wa.me/2349050690837</a><br>Site: <a href="https://website-builder-portfolio.vercel.app">website-builder-portfolio.vercel.app</a></p>';
  h += '<div class="copyrow"><a class="btn" href="https://wa.me/2349050690837">Message on WhatsApp</a></div>';
  document.getElementById("viewHelp").innerHTML = h;
}

/* ---------------- nav ---------------- */
function setView(v) {
  ["Today", "Month", "Help"].forEach(function (x) {
    document.getElementById("view" + x).classList.toggle("hide", x.toLowerCase() !== v);
  });
  var bs = document.querySelectorAll("nav.tabs button");
  for (var i = 0; i < bs.length; i++) bs[i].classList.toggle("on", bs[i].getAttribute("data-v") === v);
  document.getElementById("hdRight").textContent =
    v === "today" ? "POST COMMANDER" : v === "month" ? "THE MONTH" : "HOW TO USE";
  if (v === "month") renderMonth();
  if (v === "help") renderHelp();
  window.scrollTo(0, 0);
}
document.addEventListener("DOMContentLoaded", function () {
  load();
  var ti = todayIndex();
  if (ti >= 0) dayIdx = ti;
  var bs = document.querySelectorAll("nav.tabs button");
  for (var i = 0; i < bs.length; i++) {
    (function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-v")); }); })(bs[i]);
  }
  renderToday(); renderMonth(); renderHelp();
  setView("today");
});

