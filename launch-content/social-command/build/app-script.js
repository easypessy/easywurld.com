/* Easywurld Series Studio v5 — offline planning only; no publishing API. */
var DATA = /*__DATA__*/ null;
(function () {
  'use strict';
  var KEY = 'easywurld-series-v5';
  var VERSION = 5;
  var STATUSES = ['Draft', 'Script approved', 'Asset produced', 'QA approved', 'Scheduled', 'Published', 'Reviewed'];
  var content = document.getElementById('content');

  var state = load();
  var view = 'strategy';
  var selected = DATA.posts[0].id;
  var selectedPlatform = 'TikTok';
  var selectedDay = 1;
  var seriesFilter = 'all';
  var query = '';

  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var nl = function (s) { return esc(s).replace(/\n/g, '<br>'); };

  function load() {
    try {
      var j = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (j && j.version === VERSION && j.campaign === DATA.startDate) {
        return { placements: j.placements || {}, notes: j.notes || {} };
      }
    } catch (e) {}
    return { placements: {}, notes: {} };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ version: VERSION, campaign: DATA.startDate, placements: state.placements, notes: state.notes })); }
    catch (e) { toast('Browser storage unavailable. Export a backup.'); }
  }
  function toast(text) {
    var t = document.getElementById('toast');
    t.textContent = text; t.style.display = 'block';
    clearTimeout(t.timer); t.timer = setTimeout(function () { t.style.display = 'none'; }, 2800);
  }
  async function copy(text) {
    try {
      if (!navigator.clipboard) throw Error();
      await navigator.clipboard.writeText(text); toast('Copied');
    } catch (e) {
      document.getElementById('copyText').value = text;
      document.getElementById('copyDialog').showModal();
      document.getElementById('copyText').select();
    }
  }

  /* ---------------- data helpers ---------------- */
  var post = function (id) { return DATA.posts.find(function (p) { return p.id === id; }); };
  var story = function (id) { return DATA.stories.find(function (s) { return s.id === id; }); };
  var linkedin = function (id) { return DATA.linkedin.find(function (l) { return l.id === id; }); };
  var placementsOf = function (postId) { return DATA.placements.filter(function (x) { return x.postId === postId; }); };
  var pstate = function (placementId) {
    if (!state.placements[placementId]) state.placements[placementId] = { status: 'Draft', checks: {}, note: '', actualUrl: '' };
    return state.placements[placementId];
  };
  var platformsFor = function (postId) {
    var seen = [];
    placementsOf(postId).forEach(function (x) { if (seen.indexOf(x.platform) < 0) seen.push(x.platform); });
    return seen;
  };
  var placementOf = function (postId, platform) {
    return DATA.placements.find(function (x) { return x.postId === postId && x.platform === platform; });
  };
  var dateLabel = function (iso) { return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); };
  var dayObj = function (n) { return DATA.days[n - 1]; };
  var bodyOf = function (p) { return p.script || (p.slides || []).map(function (s, i) { return 'Slide ' + (i + 1) + ': ' + s; }).join('\n\n') || p.staticCopy || p.body || ''; };

  function checksFor(kind, item) {
    var base = [
      'Facts, price, offer and sample labels checked',
      item.verification ? 'Trend verification logged, or live-trend wording removed' : 'No trend/source claim left unverified',
      'Disclosure or fallback confirmed for this asset',
      'Captions, pronunciation and crop checked',
      'One CTA and destination tested on a phone',
      'Human approval recorded before scheduling'
    ];
    if (kind === 'story') base[3] = 'Frames, safe areas and sticker placement checked';
    if (kind === 'linkedin') base[3] = 'Read aloud, paragraphs split, link in first comment';
    if (item.offerKeyword) base.push('Current price, payment and fulfilment confirmed');
    return base;
  }
  function checkState(placementId, item) {
    pstate(placementId);
    return checksFor(item.type === 'Story' ? 'story' : item.type === 'LinkedIn' ? 'linkedin' : 'content', item).map(function (_, i) {
      return !!state.placements[placementId].checks[i];
    });
  }
  function ready(placementId, item) {
    return checkState(placementId, item).filter(Boolean).length === checksFor(item.type === 'Story' ? 'story' : item.type === 'LinkedIn' ? 'linkedin' : 'content', item).length;
  }

  function counts() {
    var totals = { placements: 0, qa: 0, scheduled: 0, published: 0, draft: 0, posted: 0, total: DATA.placements.length };
    DATA.placements.forEach(function (pl) {
      var st = pstate(pl.placementId).status;
      totals.placements++;
      if (ready(pl.placementId, pl)) totals.qa++;
      if (st === 'Scheduled') totals.scheduled++;
      if (st === 'Published' || st === 'Reviewed') totals.published++;
      if (st === 'Draft') totals.draft++;
    });
    totals.posted = totals.scheduled + totals.published;
    return totals;
  }

  /* ---------------- views ---------------- */
  function render() {
    document.querySelectorAll('nav button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.view === view);
      b.setAttribute('aria-current', b.dataset.view === view ? 'page' : 'false');
    });
    if (view === 'strategy') renderStrategy();
    if (view === 'plan') renderPlan();
    if (view === 'stories') renderStories();
    if (view === 'linkedin') renderLinkedIn();
    if (view === 'briefs') renderBriefs();
    if (view === 'batches') renderBatches();
    if (view === 'tools') renderTools();
  }

  function renderStrategy() {
    var c = counts();
    var seriesRows = DATA.series.map(function (s) {
      var n = DATA.posts.filter(function (p) { return p.seriesKey === s.key; }).length;
      return '<li><strong>' + esc(s.name) + '</strong> · ' + esc(s.time) + ' · ' + esc(s.defaultFormat) + ' · ' + n + ' posts<br><span class="muted small">' + esc(s.objective) + '</span></li>';
    }).join('');
    content.innerHTML =
      '<p class="eyebrow" style="margin-top:28px">11 posts + 2 stories a day · 3 platforms · LinkedIn pulls</p>' +
      '<h1>Thirty days, eleven slots, two stories, one voice.</h1>' +
      '<p class="muted">' + DATA.counts.corePosts + ' core posts across 30 days on TikTok, Instagram and Facebook. ' + DATA.counts.stories +
      ' stories. ' + DATA.counts.linkedin + ' LinkedIn pulls siphoned from the same work. ' + DATA.counts.placements +
      ' platform placements in total. Every placement starts Draft.</p>' +
      '<div class="stats"><div class="stat"><strong>' + DATA.counts.corePosts + '</strong>core posts</div>' +
      '<div class="stat"><strong>' + DATA.counts.stories + '</strong>stories</div>' +
      '<div class="stat"><strong>' + DATA.counts.linkedin + '</strong>LinkedIn</div>' +
      '<div class="stat"><strong>' + DATA.counts.placements + '</strong> total placements</div>' +
      '<div class="stat"><strong>' + c.qa + '</strong>fully checked</div>' +
      '<div class="stat"><strong>' + c.posted + '</strong>scheduled or published</div></div>' +
      '<div class="notice">Draft copy. Nothing here is scheduled or published. Trend slots stay HOLD until the verification log is complete. ' +
      'The AI presenter is the anonymous Operator persona: never described as a real face, always disclosed.</div>' +
      '<div class="card"><h2>The daily spine</h2><ul>' + seriesRows + '</ul>' +
      '<p class="small muted">Platform offsets: TikTok at the slot time, Instagram +10 minutes, Facebook +20 minutes. Stories: Instagram 12:30 and 21:00, Facebook +5, TikTok +10.</p></div>' +
      '<div class="card"><h2>Two story slots</h2>' + DATA.storiesMeta.slots.map(function (s) {
        return '<p><strong>' + esc(s.time) + ' · ' + esc(s.type) + '</strong><br><span class="muted small">' + esc(s.objective) + '</span></p>';
      }).join('') + '</div>' +
      '<div class="card"><h2>LinkedIn</h2><p class="small">' + esc(DATA.linkedinMeta.cadence) + '</p><p class="small muted">' + DATA.linkedinMeta.rules.map(esc).join(' · ') + '</p></div>';
  }

  function statusPills(item, platform) {
    var pl = placementOf(item.id, platform);
    var st = pstate(pl.placementId).status;
    return '<button class="platbtn" data-post="' + esc(item.id) + '" data-platform="' + esc(platform) + '">' +
      '<strong>' + esc(platform) + '</strong><span class="small">' + esc(pl.time) + ' · ' + esc(pl.format || '') + '</span>' +
      '<span class="statuspill status-' + st.toLowerCase().replace(/ /g, '-') + '">' + esc(st) + '</span></button>';
  }

  function slotRow(p) {
    var plats = ['TikTok', 'Instagram', 'Facebook'];
    return '<div class="slotrow"><div class="slottime"><span class="eyebrow">S' + p.slot + '</span><strong>' + esc(p.time) + '</strong>' +
      '<div class="small muted">' + esc(p.series) + '</div></div><div class="slotmain">' +
      '<button class="slotlink" data-post="' + esc(p.id) + '">' + esc(p.topic) + '</button>' +
      '<p class="small muted">' + esc(p.format) + ' · ' + esc(p.cta) + (p.verification ? ' · <span class="badge hold">HOLD · trend gate</span>' : '') + '</p></div>' +
      '<div class="slotplatforms">' + plats.map(function (x) { return statusPills(p, x); }).join('') + '</div></div>';
  }

  function storyRow(s) {
    return '<div class="slotrow"><div class="slottime"><span class="eyebrow">' + esc(s.slot) + '</span><strong>' + esc(s.time) + '</strong>' +
      '<div class="small muted">' + esc(s.series) + '</div></div><div class="slotmain">' +
      '<button class="slotlink" data-post="' + esc(s.id) + '">' + esc(s.frames[0]) + '</button>' +
      '<p class="small muted">' + esc(s.sticker) + ' · ' + esc(s.duration) + '</p></div>' +
      '<div class="slotplatforms">' + ['Instagram', 'Facebook', 'TikTok'].map(function (x) { return statusPills(s, x); }).join('') + '</div></div>';
  }

  function renderPlan() {
    var d = dayObj(selectedDay);
    var dayPosts = DATA.posts.filter(function (p) { return p.day === selectedDay; });
    var dayStories = DATA.stories.filter(function (s) { return s.day === selectedDay; });
    var done = DATA.placements.filter(function (pl) { return pl.day === selectedDay && pstate(pl.placementId).status !== 'Draft'; }).length;
    var total = DATA.placements.filter(function (pl) { return pl.day === selectedDay; }).length;
    content.innerHTML =
      '<div class="dayhead"><div><p class="eyebrow">Day ' + d.day + ' · ' + dateLabel(d.iso) + '</p>' +
      '<h2>11 posts · 2 stories · ' + total + ' placements</h2></div>' +
      '<div class="actions"><button class="btn secondary" id="prevDay">← Previous</button>' +
      '<button class="btn secondary" id="nextDay">Next →</button>' +
      '<button class="btn" id="copyDay">Copy this day</button></div></div>' +
      '<p class="small muted">' + done + ' of ' + total + ' placements moved past Draft. Offer today: ' + esc(d.offerKeyword) + '.</p>' +
      dayPosts.map(slotRow).join('') +
      '<h3 style="margin-top:26px">Stories</h3>' + dayStories.map(storyRow).join('') +
      '<div class="actions"><button class="btn secondary" data-view="stories">All stories →</button>' +
      '<button class="btn secondary" data-view="briefs">Search briefs →</button></div>';
    document.getElementById('prevDay').onclick = function () { selectedDay = Math.max(1, selectedDay - 1); render(); };
    document.getElementById('nextDay').onclick = function () { selectedDay = Math.min(DATA.days.length, selectedDay + 1); render(); };
    document.getElementById('copyDay').onclick = function () {
      var lines = dayPosts.map(function (p) {
        return p.time + ' S' + p.slot + ' — ' + p.topic + '\n' + p.cta;
      }).concat(dayStories.map(function (s) { return s.time + ' STORY — ' + s.frames[0]; }));
      copy('Day ' + d.day + ' · ' + d.iso + '\n\n' + lines.join('\n\n'));
    };
    bindRows();
  }

  function renderStories() {
    var rows = DATA.days.map(function (d) {
      var ss = DATA.stories.filter(function (s) { return s.day === d.day; });
      return '<div class="card"><div class="card-head"><div><p class="eyebrow">Day ' + d.day + ' · ' + dateLabel(d.iso) + '</p>' +
        '<h3>' + esc(ss[0].frames[0]) + '</h3></div><span class="badge">' + ss.length + ' stories</span></div>' +
        ss.map(function (s) {
          return '<div class="block"><h4>' + esc(s.time) + ' · ' + esc(s.series) + '</h4>' +
            s.frames.map(function (f, i) { return '<p><strong>Frame ' + (i + 1) + '.</strong> ' + nl(f) + '</p>'; }).join('') +
            '<p class="small muted">Sticker: ' + esc(s.sticker) + ' · CTA: ' + esc(s.cta) + '</p>' +
            '<div class="slotplatforms">' + ['Instagram', 'Facebook', 'TikTok'].map(function (x) { return statusPills(s, x); }).join('') + '</div>' +
            '<div class="actions"><button class="btn secondary" data-copy="' + esc(s.frames.join('\n\n')) + '">Copy frames</button></div></div>';
        }).join('') + '</div>';
    }).join('');
    content.innerHTML = '<p class="eyebrow" style="margin-top:28px">Two stories a day · three platforms</p>' +
      '<h1>' + DATA.counts.stories + ' stories, one habit.</h1>' +
      '<p class="muted">12:30 is a one-tap poll. 21:00 is the Operator teasing tomorrow. Same asset on Instagram, Facebook and TikTok within the hour.</p>' +
      DATA.storiesMeta.rules.map(function (r) { return '<div class="notice">' + esc(r) + '</div>'; }).join('') + rows;
    bindRows();
  }

  function renderLinkedIn() {
    var rows = DATA.linkedin.map(function (l) {
      return '<div class="card"><div class="card-head"><div><p class="eyebrow">' + dateLabel(l.date) + ' · ' + esc(l.time) + ' · ' + esc(l.format) + '</p>' +
        '<h3>' + esc(l.label) + '</h3></div><span class="badge">' + esc(l.sourcePostId) + '</span></div>' +
        '<div class="block"><h4>Post copy</h4><p>' + nl(l.body) + '</p></div>' +
        '<p class="small muted">' + esc(l.edit) + '</p>' +
        '<div class="slotplatforms">' + statusPills(l, 'LinkedIn') + '</div>' +
        '<div class="actions"><button class="btn secondary" data-copy="' + esc(l.body) + '">Copy post</button></div></div>';
    }).join('');
    content.innerHTML = '<p class="eyebrow" style="margin-top:28px">Siphoned, not duplicated</p>' +
      '<h1>' + DATA.counts.linkedin + ' LinkedIn posts from work already made.</h1>' +
      '<p class="muted">' + esc(DATA.linkedinMeta.cadence) + '</p>' +
      DATA.linkedinMeta.rules.map(function (r) { return '<div class="notice">' + esc(r) + '</div>'; }).join('') + rows;
    bindRows();
  }

  function detail(item) {
    var plats = platformsFor(item.id);
    var isStory = item.type === 'Story';
    var isLI = item.type === 'LinkedIn';
    var h = '<p class="eyebrow">' + esc(item.date) + ' · ' + esc(item.time) + ' WAT · ' + esc(item.id) + '</p>' +
      '<h1>' + esc(item.topic || item.label || item.series) + '</h1>' +
      '<p class="small muted">' + esc(item.series || '') + ' · ' + esc(item.format || '') + (item.psych ? ' · Psychology: ' + esc(item.psych.name) : '') + '</p>' +
      '<div class="card"><div class="block"><h4>' + (isStory ? 'Frames' : isLI ? 'Post copy' : 'Exact copy') + '</h4><p>' + nl(isStory ? item.frames.join('\n\n') : isLI ? item.body : bodyOf(item)) + '</p></div>' +
      '<div class="block"><h4>Single CTA</h4><p>' + esc(item.cta) + '</p></div>' +
      (item.psych ? '<div class="block"><h4>Psychology move</h4><p>' + esc(item.psych.use) + '<br><span class="small muted">Guard: ' + esc(item.psych.guard) + '</span></p></div>' : '') +
      (item.visual ? '<div class="block"><h4>Visual and edit</h4><p>' + nl(item.visual) + '</p><p>' + nl(item.edit || '') + '</p></div>' : '') +
      (item.prompt ? '<details><summary>Filled production prompt</summary><div class="prompt">' + esc(item.prompt) + '</div></details>' : '') +
      (item.fallback ? '<details><summary>Fallback</summary><p>' + esc(item.fallback) + '</p></details>' : '') +
      '</div>' +
      '<h3>Platforms</h3>' + plats.map(function (platform) {
        var pl = placementOf(item.id, platform);
        var ps = pstate(pl.placementId);
        var checks = checkState(pl.placementId, item);
        var labels = checksFor(isStory ? 'story' : isLI ? 'linkedin' : 'content', item);
        return '<div class="card"><div class="card-head"><div><h3>' + esc(platform) + '</h3><p class="small muted">' + esc(pl.time) + ' WAT · ' + esc(pl.format || '') + '</p></div>' +
          '<select data-status="' + esc(pl.placementId) + '">' + STATUSES.map(function (s) { return '<option' + (ps.status === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select></div>' +
          '<div class="block"><h4>Caption</h4><p>' + nl(pl.caption) + '</p></div>' +
          '<div class="actions"><button class="btn secondary" data-copy="' + esc(pl.caption) + '">Copy caption</button>' +
          '<button class="btn secondary" data-copy="' + esc(pl.caption + '\n\n' + (item.hook || '')) + '">Copy with hook</button></div>' +
          '<div class="block"><h4>QA</h4>' + labels.map(function (lab, i) {
            return '<label class="check"><input type="checkbox" data-check="' + esc(pl.placementId) + '" data-index="' + i + '"' + (checks[i] ? ' checked' : '') + '><span>' + esc(lab) + '</span></label>';
          }).join('') + '</div>' +
          '<div class="block"><h4>Notes</h4><textarea data-note="' + esc(pl.placementId) + '">' + esc(ps.note) + '</textarea></div>' +
          '<div class="block"><h4>Actual post URL</h4><input data-url="' + esc(pl.placementId) + '" value="' + esc(ps.actualUrl) + '" placeholder="Paste after publishing" style="width:100%"></div>' +
          '</div>';
      }).join('') +
      '<div class="actions"><button class="btn secondary" id="closeDetail">← Back</button></div>';
    content.innerHTML = h;
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.onchange = function () { pstate(el.dataset.status).status = el.value; save(); toast('Status saved'); };
    });
    document.querySelectorAll('[data-check]').forEach(function (el) {
      el.onchange = function () { pstate(el.dataset.check).checks[el.dataset.index] = el.checked; save(); };
    });
    document.querySelectorAll('[data-note]').forEach(function (el) {
      el.onchange = function () { pstate(el.dataset.note).note = el.value; save(); };
    });
    document.querySelectorAll('[data-url]').forEach(function (el) {
      el.onchange = function () { pstate(el.dataset.url).actualUrl = el.value; save(); };
    });
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.onclick = function () { copy(el.dataset.copy); };
    });
    document.getElementById('closeDetail').onclick = function () { render(); };
  }

  function openItem(id) {
    var item = post(id) || story(id) || linkedin(id);
    if (item) detail(item);
  }

  function bindRows() {
    document.querySelectorAll('[data-post]').forEach(function (el) {
      el.onclick = function () { openItem(el.dataset.post); };
    });
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.onclick = function (e) { e.stopPropagation(); copy(el.dataset.copy); };
    });
    document.querySelectorAll('[data-view]').forEach(function (el) {
      el.onclick = function () { view = el.dataset.view; render(); };
    });
  }

  function renderBriefs() {
    var all = DATA.posts.concat(DATA.stories, DATA.linkedin);
    var list = all.filter(function (p) {
      if (seriesFilter !== 'all' && p.seriesKey !== seriesFilter) return false;
      if (!query) return true;
      return (JSON.stringify(p).toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }).slice(0, 60);
    content.innerHTML = '<p class="eyebrow" style="margin-top:28px">Search every brief</p>' +
      '<h1>' + all.length + ' items, one index.</h1>' +
      '<div class="filters"><input id="q" placeholder="Search topic, offer, myth, scene…" value="' + esc(query) + '" style="min-width:240px">' +
      '<select id="seriesFilter"><option value="all">All series</option>' + DATA.series.map(function (s) {
        return '<option value="' + esc(s.key) + '"' + (seriesFilter === s.key ? ' selected' : '') + '>' + esc(s.name) + '</option>';
      }).join('') + '</select></div>' +
      '<div class="searchlist">' + list.map(function (p) {
        return '<button class="btn secondary" data-post="' + esc(p.id) + '">' + esc(p.id) + ' · ' + esc((p.topic || p.label || p.series).slice(0, 44)) + '</button>';
      }).join('') + '</div>' +
      '<p class="small muted" style="margin-top:14px">Showing ' + list.length + ' of ' + all.length + '.</p>';
    var q = document.getElementById('q');
    q.oninput = function () { query = q.value; renderBriefs(); };
    var sf = document.getElementById('seriesFilter');
    sf.onchange = function () { seriesFilter = sf.value; renderBriefs(); };
    bindRows();
  }

  function renderBatches() {
    var weeks = [];
    for (var i = 0; i < DATA.days.length; i += 7) weeks.push(DATA.days.slice(i, i + 7));
    var rows = weeks.map(function (week, wi) {
      var ids = week.reduce(function (acc, d) {
        return acc.concat(DATA.placements.filter(function (pl) { return pl.day === d.day; }).map(function (pl) { return pl.placementId; }));
      }, []);
      var moved = ids.filter(function (id) { return state.placements[id] && state.placements[id].status !== 'Draft'; }).length;
      return '<div class="card"><div class="card-head"><div><p class="eyebrow">Week ' + (wi + 1) + '</p><h3>' +
        dateLabel(week[0].iso) + ' – ' + dateLabel(week[week.length - 1].iso) + '</h3></div><span class="badge">' + moved + '/' + ids.length + '</span></div>' +
        '<div class="progressrow"><span>Content posts</span><span>' + (week.length * 11) + '</span></div>' +
        '<div class="progressrow"><span>Stories</span><span>' + (week.length * 2) + '</span></div>' +
        '<div class="progressrow"><span>LinkedIn pulls</span><span>' + DATA.linkedin.filter(function (l) { return l.day >= week[0].day && l.day <= week[week.length - 1].day; }).length + '</span></div>' +
        '<div class="progressrow"><span>Placements moved past Draft</span><span>' + moved + ' of ' + ids.length + '</span></div>' +
        '<div class="actions"><button class="btn secondary" data-week="' + wi + '">Open week</button>' +
        '<button class="btn secondary" data-export-week="' + wi + '">Export week CSV</button></div></div>';
    }).join('');
    content.innerHTML = '<p class="eyebrow" style="margin-top:28px">Batch by week, not by panic</p><h1>Five weeks, planned backwards.</h1>' +
      '<p class="muted">Produce one week at a time. Hold failed slots instead of stacking catch-up posts.</p>' + rows;
    document.querySelectorAll('[data-week]').forEach(function (el) {
      el.onclick = function () { selectedDay = weeks[Number(el.dataset.week)][0].day; view = 'plan'; render(); };
    });
    document.querySelectorAll('[data-export-week]').forEach(function (el) {
      el.onclick = function () { exportCSV(weeks[Number(el.dataset.exportWeek)]); };
    });
  }

  function renderTools() {
    content.innerHTML = '<p class="eyebrow" style="margin-top:28px">Exports and backups</p><h1>Take the work with you.</h1>' +
      '<p class="muted">Statuses, QA checks, notes and URLs live in this browser only. Export a backup before changing devices.</p>' +
      '<div class="card"><h3>Exports</h3><div class="actions">' +
      '<button class="btn" id="expAll">Export all placements CSV</button>' +
      '<button class="btn secondary" id="expW1">Export week 1</button>' +
      '<button class="btn secondary" id="expContent">Export 330 post copy</button>' +
      '<button class="btn secondary" id="expStories">Export 60 stories</button>' +
      '<button class="btn secondary" id="expLinkedIn">Export LinkedIn set</button></div></div>' +
      '<div class="card"><h3>Backup</h3><div class="actions">' +
      '<button class="btn" id="expJson">Export JSON backup</button>' +
      '<label class="btn secondary" style="cursor:pointer">Import JSON<input type="file" id="impJson" accept="application/json" class="hide"></label>' +
      '<button class="btn danger" id="reset">Reset all progress</button></div></div>' +
      '<div class="card"><h3>Rules</h3><p class="small">Trend Desk stays HOLD until verified. Offers need price, contents and DIY boundary confirmed. The AI presenter is anonymised and disclosed. One CTA per placement.</p></div>';
    document.getElementById('expAll').onclick = function () { exportCSV(DATA.days); };
    document.getElementById('expW1').onclick = function () { exportCSV(DATA.days.slice(0, 7)); };
    document.getElementById('expContent').onclick = function () { exportItems(DATA.posts, 'easywurld-330-posts.csv'); };
    document.getElementById('expStories').onclick = function () { exportItems(DATA.stories, 'easywurld-60-stories.csv'); };
    document.getElementById('expLinkedIn').onclick = function () { exportItems(DATA.linkedin, 'easywurld-linkedin.csv'); };
    document.getElementById('expJson').onclick = function () {
      download(JSON.stringify({ version: VERSION, campaign: DATA.startDate, placements: state.placements, notes: state.notes }, null, 2), 'easywurld-progress.json', 'application/json');
    };
    document.getElementById('impJson').onchange = function (e) {
      var file = e.target.files[0]; if (!file) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var j = JSON.parse(r.result);
          state.placements = j.placements || {}; state.notes = j.notes || {};
          save(); toast('Backup imported'); render();
        } catch (err) { toast('That file is not a valid backup'); }
      };
      r.readAsText(file);
    };
    document.getElementById('reset').onclick = function () {
      if (!confirm('Clear every status, check, note and URL?')) return;
      state = { placements: {}, notes: {} }; save(); toast('Progress cleared'); render();
    };
  }

  /* ---------------- exports ---------------- */
  function download(text, name, type) {
    var blob = new Blob([text], { type: type || 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Downloaded ' + name);
  }
  function csvCell(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
  function exportCSV(days) {
    var rows = [['Type', 'Date', 'Platform', 'Time', 'Post ID', 'Placement ID', 'Series', 'Topic', 'Caption', 'CTA', 'Status', 'Checks complete', 'Notes', 'Actual URL']];
    var ids = days.map(function (d) { return d.day; });
    DATA.placements.filter(function (pl) { return ids.indexOf(pl.day) >= 0; }).forEach(function (pl) {
      var ps = pstate(pl.placementId);
      var item = post(pl.postId) || story(pl.postId) || linkedin(pl.postId);
      var checks = checksFor(pl.type === 'Story' ? 'story' : pl.type === 'LinkedIn' ? 'linkedin' : 'content', item);
      var done = Object.keys(ps.checks || {}).filter(function (k) { return ps.checks[k]; }).length;
      rows.push([pl.type, pl.date, pl.platform, pl.time, pl.postId, pl.placementId, pl.series, pl.topic, pl.caption, pl.cta, ps.status, done + '/' + checks.length, ps.note, ps.actualUrl]);
    });
    download(rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n'), 'easywurld-placements.csv');
  }
  function exportItems(items, name) {
    var rows = [['ID', 'Type', 'Date', 'Time', 'Series', 'Format', 'Topic', 'Copy', 'CTA', 'Platforms', 'Status']];
    items.forEach(function (it) {
      var plats = platformsFor(it.id);
      var status = plats.map(function (p) { return p + ':' + pstate(placementOf(it.id, p).placementId).status; }).join(' | ');
      rows.push([it.id, it.type || 'Content', it.date, it.time, it.series, it.format || '', it.topic || it.label || '', bodyOf(it), it.cta, plats.join(' + '), status]);
    });
    download(rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n'), name);
  }

  /* ---------------- boot ---------------- */
  document.querySelectorAll('nav button').forEach(function (b) {
    b.onclick = function () { view = b.dataset.view; render(); };
  });
  render();
})();
