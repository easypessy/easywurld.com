/* =============================================================================
   Easywurld chat widget
   Vanilla JS + CSS in one file. No dependencies, no backend, no keys.
   -----------------------------------------------------------------------------
   EDIT EVERYTHING IN `CONFIG` AND `KB` BELOW. THE LOGIC NEVER NEEDS TOUCHING.

   >>> YOUR WHATSAPP NUMBER GOES IN CONFIG.whatsapp (line ~24). <<<
       Format: country code + number, digits only, no +, no spaces.
       Nigeria example: 234 then the number without its leading 0.
   ============================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------------
     1. CONFIG — the only place with settings
     --------------------------------------------------------------------------- */
  var CONFIG = {
    brand: "Easywurld",
    tagline: "Simplify. Optimize. Grow.",

    /* ▼▼▼ CHANGE YOUR WHATSAPP NUMBER HERE — digits only, country code first ▼▼▼ */
    whatsapp: "2349050690837",
    /* ▲▲▲ e.g. "2349050690837". Nothing else in this file needs editing for it. ▲▲▲ */

    accent: "#27473A",
    ink: "#14170F",
    paper: "#FAE7C7",
    line: "#DBD3C4",
    launcherLabel: "Chat with Easywurld",
    greeting:
      "Hello — you've reached Easywurld. Ask me anything below, or tell us about your business and we'll pick it up on WhatsApp.",

    /* Optional, for later. Leave null and the widget stays fully rule-based.
       Set to a URL that accepts { messages: [...] } and returns { reply: "..." }
       and free-form questions will be sent there instead of falling back.
       See /chat/README-chat.md for free providers and the training brief. */
    endpoint: null,
  };

  /* ---------------------------------------------------------------------------
     2. KB — every word the widget can say. Rewrite freely.
        `q`  = the quick-reply button label
        `a`  = the answer (array = separate bubbles)
        `next` = which buttons to show afterwards (ids from this list, or "form")
     --------------------------------------------------------------------------- */
  var KB = {
    offer: {
      q: "What do you offer?",
      a: [
        "Seven things, and they connect: marketing strategy, web design, landing pages, search optimisation, social media management, copywriting, and business reports and presentations.",
        "Most clients start with one — usually a website or a landing page — and add the rest once it's earning its keep.",
      ],
      next: ["how", "cost", "time", "wa"],
    },
    how: {
      q: "How does it work?",
      a: [
        "Four steps: Understand, Simplify, Build, Optimize.",
        "We start with a conversation about what you're actually trying to fix. Then we cut the message back to what matters, build the thing, and adjust it once real people have used it.",
        "You deal with the same people the whole way through.",
      ],
      next: ["offer", "cost", "time", "wa"],
    },
    cost: {
      q: "How much does it cost?",
      a: [
        "It depends on the project — a one-page site and a seven-page site with content and search work aren't the same job, and we'd rather quote properly than throw a number at you.",
        "Tell us your business type and what you need, and we'll come back with a range and what sits inside it.",
      ],
      next: ["form", "time", "wa"],
    },
    time: {
      q: "How long does it take?",
      a: [
        "A landing page is usually about a week. A small business site is two to four weeks. Larger builds with content and search work run longer.",
        "The honest bottleneck is normally content — photos, text, prices. When those arrive, things move quickly.",
      ],
      next: ["offer", "cost", "form", "wa"],
    },
    work: {
      q: "Can I see your work?",
      a: [
        "Yes — the Projects page has the full portfolio, and most of them open the real working site or document, not a picture of one.",
        "Everything is labelled concept or sample where it isn't a paying client. We don't dress up speculative work as commissioned work.",
      ],
      next: ["offer", "cost", "wa"],
    },
    where: {
      q: "Where are you based?",
      a: [
        "Lagos, Nigeria. We work with businesses across the country and remotely beyond it.",
        "WhatsApp is the fastest way to reach us, usually same day.",
      ],
      next: ["offer", "form", "wa"],
    },
    form: { q: "Get a quote", a: [], next: [] },   // handled by the form step
    wa: { q: "Talk to us on WhatsApp", a: [], next: [] }, // handled as a link
  };

  /* Which buttons show first */
  var START = ["offer", "how", "cost", "time", "wa"];

  /* Fallback when someone types something the rules don't cover */
  var FALLBACK = [
    "I only know a handful of answers here, so I don't want to guess at that one.",
    "Send it to a human on WhatsApp and you'll get a proper reply — usually the same day.",
  ];

  /* ---------------------------------------------------------------------------
     3. Everything below is machinery. You shouldn't need to edit it.
     --------------------------------------------------------------------------- */

  var css =
    '.ew-launch{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:inline-flex;align-items:center;gap:9px;' +
    'min-height:52px;min-width:52px;padding:0 18px;border:0;border-radius:999px;cursor:pointer;' +
    'background:' + CONFIG.accent + ';color:#fff;font:600 15px/1 ui-sans-serif,-apple-system,"Segoe UI",sans-serif;' +
    'box-shadow:0 6px 22px rgba(0,0,0,.22)}' +
    '.ew-launch:hover{transform:translateY(-1px)}' +
    '.ew-launch:focus-visible{outline:3px solid #9E4E2C;outline-offset:3px}' +
    '.ew-launch svg{flex:none}' +
    '@media(max-width:480px){.ew-launch span{display:none}.ew-launch{padding:0;width:56px;height:56px;justify-content:center}}' +

    '.ew-panel{position:fixed;right:18px;bottom:82px;z-index:2147483000;width:min(370px,calc(100vw - 32px));' +
    'max-height:min(560px,calc(100vh - 110px));display:flex;flex-direction:column;background:' + CONFIG.paper + ';' +
    'color:' + CONFIG.ink + ';border:1px solid ' + CONFIG.line + ';border-radius:14px;overflow:hidden;' +
    'box-shadow:0 18px 50px rgba(0,0,0,.24);font:15px/1.55 ui-sans-serif,-apple-system,"Segoe UI",sans-serif;' +
    'opacity:0;transform:translateY(8px);transition:opacity .18s ease,transform .18s ease}' +
    '.ew-panel[data-open="true"]{opacity:1;transform:none}' +
    '.ew-head{display:flex;align-items:center;gap:10px;padding:13px 14px;background:' + CONFIG.accent + ';color:#fff}' +
    '.ew-head b{font-size:15px;display:block}' +
    '.ew-head small{display:block;font-size:11px;letter-spacing:.1em;opacity:.8}' +
    '.ew-x{margin-left:auto;background:rgba(255,255,255,.14);border:0;color:#fff;width:34px;height:34px;' +
    'border-radius:8px;cursor:pointer;font-size:19px;line-height:1}' +
    '.ew-x:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '.ew-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px}' +
    '.ew-b{max-width:86%;padding:10px 13px;border-radius:13px;white-space:pre-wrap}' +
    '.ew-b.bot{background:#fff;border:1px solid ' + CONFIG.line + ';border-bottom-left-radius:4px}' +
    '.ew-b.me{background:' + CONFIG.accent + ';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '.ew-qr{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 12px}' +
    '.ew-qr button{min-height:44px;padding:9px 15px;border:1px solid ' + CONFIG.accent + ';background:#fff;' +
    'color:' + CONFIG.accent + ';border-radius:999px;font:inherit;font-size:14px;cursor:pointer}' +
    '.ew-qr button:hover{background:' + CONFIG.accent + ';color:#fff}' +
    '.ew-qr button:focus-visible{outline:3px solid #9E4E2C;outline-offset:2px}' +
    '.ew-form{padding:0 14px 14px;display:grid;grid-template-columns:1fr;gap:9px}' +
    '.ew-form label{font-size:13px;font-weight:600}' +
    '.ew-form input,.ew-form textarea{width:100%;padding:11px;border:1px solid ' + CONFIG.line + ';border-radius:8px;' +
    'font:inherit;background:#fff;color:' + CONFIG.ink + '}' +
    '.ew-form input:focus-visible,.ew-form textarea:focus-visible{outline:3px solid #9E4E2C;outline-offset:1px}' +
    '.ew-form .err{color:#8C2F17;font-size:13px}' +
    '.ew-form button{min-height:46px;background:' + CONFIG.accent + ';color:#fff;border:0;border-radius:8px;' +
    'font:inherit;font-weight:600;cursor:pointer}' +
    '.ew-foot{padding:9px 14px;border-top:1px solid ' + CONFIG.line + ';font-size:11.5px;color:#5F6659}' +
    '@media(prefers-reduced-motion:reduce){.ew-panel{transition:none}.ew-launch:hover{transform:none}}' +
    '@media(prefers-contrast:more){.ew-b.bot{border-color:' + CONFIG.ink + '}}';

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }

  function waLink(payload) {
    var msg =
      "Hello Easywurld, I'd like to talk about a project.\n\n" +
      "Name: " + payload.name + "\n" +
      "Business: " + payload.business + "\n" +
      "What I need: " + payload.need;
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
  }

  function build() {
    var style = el("style"); style.textContent = css; document.head.appendChild(style);

    var launcher = el("button", {
      class: "ew-launch", type: "button",
      "aria-label": CONFIG.launcherLabel, "aria-expanded": "false", "aria-haspopup": "dialog",
    });
    launcher.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></svg>' +
      '<span>Chat</span>';
    document.body.appendChild(launcher);

    var panel = el("div", {
      class: "ew-panel", role: "dialog", "aria-modal": "false",
      "aria-label": CONFIG.brand + " chat", hidden: "", "data-open": "false",
    });
    var head = el("div", { class: "ew-head" });
    var title = el("div");
    title.appendChild(el("b", null, CONFIG.brand));
    title.appendChild(el("small", null, CONFIG.tagline.toUpperCase()));
    head.appendChild(title);
    var close = el("button", { class: "ew-x", type: "button", "aria-label": "Close chat" }, "\u00d7");
    head.appendChild(close);

    var log = el("div", { class: "ew-log", role: "log", "aria-live": "polite", "aria-atomic": "false" });
    var quick = el("div", { class: "ew-qr" });
    var foot = el("div", { class: "ew-foot" }, "Replies here are pre-written. A person answers on WhatsApp.");

    panel.appendChild(head); panel.appendChild(log); panel.appendChild(quick); panel.appendChild(foot);
    document.body.appendChild(panel);

    return { launcher: launcher, panel: panel, log: log, quick: quick, close: close, foot: foot };
  }

  var ui = null, open = false, started = false;

  function say(text, who) {
    var b = el("div", { class: "ew-b " + (who || "bot") }, text);
    ui.log.appendChild(b);
    ui.log.scrollTop = ui.log.scrollHeight;
  }

  function buttons(ids) {
    ui.quick.innerHTML = "";
    (ids || []).forEach(function (id) {
      var item = KB[id]; if (!item) return;
      var b = el("button", { type: "button" }, item.q);
      b.addEventListener("click", function () { pick(id); });
      ui.quick.appendChild(b);
    });
  }

  function pick(id) {
    var item = KB[id]; if (!item) return;
    say(item.q, "me");

    if (id === "wa") { window.open(waLink({ name: "—", business: "—", need: "General enquiry" }), "_blank", "noopener"); return; }
    if (id === "form") { showForm(); return; }

    item.a.forEach(function (line, i) { setTimeout(function () { say(line); }, 180 * (i + 1)); });
    setTimeout(function () { buttons(item.next); }, 180 * (item.a.length + 1));
  }

  function showForm() {
    ui.quick.innerHTML = "";
    say("Three quick things and I'll hand you over with it all written out.");

    var f = el("form", { class: "ew-form", novalidate: "" });
    var fields = [
      { id: "ew-name", label: "Your name", type: "input", ph: "Ada Obi" },
      { id: "ew-biz", label: "Business type", type: "input", ph: "Bakery, clinic, law firm…" },
      { id: "ew-need", label: "What do you need help with?", type: "textarea", ph: "A new site, more enquiries from search…" },
    ];
    var inputs = {};
    fields.forEach(function (fl) {
      var lab = el("label", { for: fl.id }, fl.label);
      var inp = el(fl.type === "textarea" ? "textarea" : "input", {
        id: fl.id, name: fl.id, placeholder: fl.ph, required: "",
        "aria-describedby": fl.id + "-err", rows: "3",
      });
      var err = el("p", { class: "err", id: fl.id + "-err", role: "alert" });
      f.appendChild(lab); f.appendChild(inp); f.appendChild(err);
      inputs[fl.id] = { input: inp, err: err, label: fl.label };
    });
    var submit = el("button", { type: "submit" }, "Send on WhatsApp");
    f.appendChild(submit);
    ui.quick.appendChild(f);

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      Object.keys(inputs).forEach(function (k) {
        var o = inputs[k], v = o.input.value.trim();
        if (!v) {
          o.err.textContent = o.label + " is needed before we can send this.";
          o.input.setAttribute("aria-invalid", "true");
          if (!bad) bad = o.input;
        } else { o.err.textContent = ""; o.input.removeAttribute("aria-invalid"); }
      });
      if (bad) { bad.focus(); return; }
      var payload = {
        name: inputs["ew-name"].input.value.trim(),
        business: inputs["ew-biz"].input.value.trim(),
        need: inputs["ew-need"].input.value.trim(),
      };
      ui.quick.innerHTML = "";
      say("Thanks " + payload.name + " — opening WhatsApp with your details filled in.");
      window.open(waLink(payload), "_blank", "noopener");
      setTimeout(function () { buttons(START); }, 600);
    });

    inputs["ew-name"].input.focus();
  }

  /* Optional free-form route. Only used if CONFIG.endpoint is set. */
  function ask(text) {
    say(text, "me");
    if (!CONFIG.endpoint) {
      FALLBACK.forEach(function (l, i) { setTimeout(function () { say(l); }, 200 * (i + 1)); });
      setTimeout(function () { buttons(START); }, 600);
      return;
    }
    say("…");
    fetch(CONFIG.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) { ui.log.lastChild.remove(); say(d.reply || FALLBACK[0]); buttons(START); })
      .catch(function () { ui.log.lastChild.remove(); say(FALLBACK[1]); buttons(START); });
  }
  window.easywurldChatAsk = ask; // lets a future free-form input reuse the same pipe

  /* --- focus trap + open/close ------------------------------------------- */
  function focusables() {
    return Array.prototype.slice.call(
      ui.panel.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')
    ).filter(function (n) { return n.offsetParent !== null; });
  }

  function onKey(e) {
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); toggle(false); return; }
    if (e.key !== "Tab") return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function toggle(next) {
    open = next;
    ui.panel.hidden = !open;
    ui.panel.setAttribute("data-open", String(open));
    ui.launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      if (!started) {
        started = true;
        say(CONFIG.greeting);
        buttons(START);
      }
      setTimeout(function () { ui.close.focus(); }, 30);
    } else {
      ui.launcher.focus();
    }
  }

  function init() {
    ui = build();
    ui.launcher.addEventListener("click", function () { toggle(!open); });
    ui.close.addEventListener("click", function () { toggle(false); });
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
