/**
 * Day 02 — Saturday 7 November 2026 · Lagos day.
 *
 * Eleven carousels, one per slot from plan.mjs. Same structure as Day 1, new
 * angles, and every example comes from a different kind of Lagos business so a
 * follower never hears the same sentence twice in a week.
 *
 * Personal posts keep deliberately vague details: put your real memory in.
 */

export const dayPosts = [
  /* 01 — Diagnose ------------------------------------------------------- */
  {
    folder: "days/day-02/01-linkedin-diagnose",
    date: "Saturday 7 November · 07:45 LinkedIn, 08:00 Instagram",
    platform: "LinkedIn → Instagram",
    format: "feed",
    title: "The price they never saw",
    notes: "Diagnose slot. School/education example — swap in a real school you have spoken to.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The quiet loss",
        headline: "A parent asked your school for fees. Your website didn't answer.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "What happened next",
        headline: "So they asked another school.",
        body: "Not because yours is worse. Because the other one had a fee summary and a phone number they could see at 11pm, without calling anybody.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "Why schools hide it",
        headline: "“Fees change, so we don't publish them.”",
        body: "Then publish the range and what it covers: per term, what is included, what is extra. Parents are not scared of a number. They are scared of a conversation they cannot prepare for.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "The second question",
        headline: "“What do I get for it?”",
        body: "Uniform, books, transport, meals, exam fees — one line each. A parent will forgive ₦150,000 if they can see what it buys. They will not forgive guessing.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "And the third",
        headline: "“What happens after I call?”",
        body: "A tour, an assessment, a form? Say it in one sentence. Silence is where the enquiry dies.",
        art: { type: "steps" },
      },
      {
        kind: "cta",
        eyebrow: "Tonight",
        headline: "Put the range, the inclusions and the next step on one page.",
        body: "Not the whole fee structure. One page. That is the difference between a parent who calls and a parent who forgets you.",
        foot: "Message CLEAR on WhatsApp if you want a second pair of eyes.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `A parent asked a Lagos school for fees last week. The website did not answer.

No fee range. No "what's included". No next step. So they asked another school — not a better one, just a clearer one.

This is the most common leak I find in education, healthcare and professional services: the price is treated as a secret to be protected, when it is actually the first trust signal.

Three things fix it, and none requires publishing sensitive numbers:

1. A range, plus what it covers. "From ₦150,000 per term, includes books and lunch."
2. A list of what is extra. Transport, exam fees, uniforms. One line each.
3. The next step, in one sentence. "Book a tour on WhatsApp; we reply within a day."

A parent will forgive a price they can see. They do not forgive a price they have to dig for, in a conversation they were not ready to have.

If you run a school, clinic or consultancy in Lagos: open your site on your phone tonight and ask whether a stranger could answer "how much, and what do I get?" without calling you.

#LagosBusiness #Schools #SmallBusinessNigeria #Pricing #MarketingClarity`,
      instagram: `A parent asked your school for fees. Your website didn't answer. 🧡

So they asked another school — not a better one, just a clearer one.

Publish a range and what it covers. List what's extra. Say what happens after they call.

They'll forgive the price. They won't forgive the guessing.

Save this for the next time someone says "DM for fees".

#LagosBusiness #SmallBusinessNigeria #Schools #Pricing #MarketingTips #NaijaBusiness #Easywurld`,
      tiktok: `Hook on screen: "A parent asked your school for fees. Your site didn't answer."

Beats:
0–3s — No range. No inclusions. No next step.
3–9s — So they asked another school. Not a better one — a clearer one.
9–15s — Range + what it covers + one next step.
15–20s — They forgive the price, never the guessing.

Text on screen: "Clear beats cheap."`,
      whatsapp: `A parent asked your school for fees and your website didn't answer.

They asked someone else — not a better school, a clearer one.

Put a range, what it includes, and one next step on a page. Parents forgive a price they can see. They don't forgive guessing.

Message CLEAR if you want a second pair of eyes.`,
    },
    hashtags: ["#LagosBusiness", "#Schools", "#SmallBusinessNigeria", "#Pricing", "#MarketingClarity", "#NaijaBusiness", "#Easywurld", "#WebDesignLagos"],
  },

  /* 02 — Teach ---------------------------------------------------------- */
  {
    folder: "days/day-02/02-tiktok-teach-price-range",
    date: "Saturday 7 November · 09:00 TikTok, 12:00 Instagram",
    platform: "TikTok → Instagram",
    format: "feed",
    title: "Never write a price on its own",
    notes: "Teach slot — the copywriting door. Real-estate example; swap the figures for a live listing.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Copywriting, one rule",
        headline: "Never write a price on its own.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Why",
        headline: "A number with no reason reads as a warning.",
        body: "₦2.5m. That is all. The buyer's mind fills the gap with the worst story it knows.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Add the unit",
        headline: "“₦2.5m per annum, 3-bedroom, serviced.”",
        body: "Now it is not a price. It is a category. The reader either belongs here or does not — both outcomes are useful.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Add the inclusions",
        headline: "“Includes water, security, and parking for two.”",
        body: "Every inclusion removes one reason to ask a question you do not have time to answer.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "Add the anchor",
        headline: "“Comparable units on this street run ₦2.8m–3m.”",
        body: "An anchor is not a discount. It is context. It tells the buyer you know the market, which is the whole job of a listing.",
        art: { type: "split" },
      },
      {
        kind: "cta",
        eyebrow: "Do it tonight",
        headline: "Rewrite one line: price, unit, inclusions, anchor.",
        body: "Four pieces, one sentence. It takes three minutes and it changes who calls you.",
        foot: "Send it to CLEAR on WhatsApp and I'll tighten it.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `A price on its own is not information — it is a warning.

"₦2.5m." reads as expensive, because the reader's mind fills the silence with the worst story it knows: hidden costs, a bad street, a landlord who disappears.

Four pieces turn a number into a decision:

1. The unit — "per annum", "per plot", "per 20 guests".
2. The inclusions — water, security, parking. Each one removes a question.
3. The anchor — what comparable things cost. Context, not a discount.
4. The next step — one line, one button.

₦2.5m per annum, 3-bedroom serviced, includes water and security, similar units on this street run ₦2.8–3m. Message for a viewing.

Same price. Now it reads as fair, and the wrong buyers filter themselves out before they waste your Saturday.

If you sell anything with a number attached — property, cakes, courses, retainers — rewrite one line tonight with those four pieces.

#Copywriting #LagosBusiness #RealEstateNigeria #Pricing #SmallBusinessNigeria`,
      instagram: `Never write a price on its own. 🧡

"₦2.5m" reads as a warning. "₦2.5m per annum, serviced 3-bed, includes water and security" reads as a decision.

Four pieces: unit, inclusions, anchor, next step.

Save this and rewrite one line tonight.

#CopywritingTips #LagosBusiness #RealEstate #Pricing #SmallBusinessNigeria #NaijaBusiness #Easywurld`,
      tiktok: `Hook on screen: "Never write a price on its own."

Beats:
0–3s — A bare number is a warning, not information.
3–9s — Add the unit. Add what's included. Add the anchor.
9–15s — ₦2.5m → ₦2.5m per annum, serviced, water + security, similar units ₦2.8m.
15–20s — Same price. Different buyer.

Text on screen: "Unit · inclusions · anchor · next step."`,
      whatsapp: `Never write a price on its own.

"₦2.5m" reads as a warning. "₦2.5m per annum, serviced 3-bed, includes water and security, similar units ₦2.8m" reads as fair.

Unit, inclusions, anchor, next step. Four pieces, one line.

Send me your line and I'll tighten it. Message CLEAR.`,
    },
    hashtags: ["#CopywritingTips", "#LagosBusiness", "#RealEstate", "#Pricing", "#SmallBusinessNigeria", "#NaijaBusiness", "#Easywurld", "#MarketingTips"],
  },

  /* 03 — Personal story -------------------------------------------------- */
  {
    folder: "days/day-02/03-personal-the-project-i-should-have-refused",
    date: "Saturday 7 November · 15:00 Facebook, 19:00 Instagram",
    platform: "Facebook → Instagram",
    format: "feed",
    personal: true,
    title: "The project I should have refused",
    notes:
      "Use your real project type and your real reason for saying yes. The lesson is the point; the details are yours.",
    slides: [
      {
        kind: "hook",
        eyebrow: "A confession",
        headline: "I should have said no to that project.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Why I didn't",
        headline: "The money was good, and I was new.",
        body: "Fourteen services on one page. No photos. No prices. A phone number that belonged to a nephew who had stopped answering.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "What I did",
        headline: "I designed around the mess instead of naming it.",
        body: "I made a beautiful page for a business whose actual problem was that nobody could tell what they sold. I decorated the leak.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "What it cost",
        headline: "Three revisions, then silence.",
        body: "The work was never wrong. The brief was. And I had accepted a brief I knew was broken because I wanted the job.",
        art: { type: "clock", label: "3 REVISIONS" },
      },
      {
        kind: "point",
        eyebrow: "The rule I kept",
        headline: "If I can't name the problem, I don't take the work.",
        body: "That sentence has cost me jobs. It has also meant every client since then got a result we could both point at.",
        art: { type: "quote" },
      },
      {
        kind: "cta",
        eyebrow: "For the freelancers here",
        headline: "Say the hard thing before you send the invoice.",
        body: "Not after. Before. The client can take it on day one; they cannot take it in month three.",
        foot: "Message CLEAR if you want a second opinion on a brief.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `I should have refused a project. I took it because the money was good and I was new.

Fourteen services on one page. No photographs. No prices. A contact number belonging to a nephew who had already stopped answering.

The real problem was simple to name: nobody could tell what this business sold, so nobody bought. Instead of saying that, I designed around it. I made a beautiful page for a broken brief, and then spent three rounds of revisions defending work that was never the issue.

The client went quiet. I learned the most useful rule I have:

If I cannot name the problem in one sentence, I do not take the work.

That rule has cost me jobs. It has also meant that every client since got a result we could both point to — because we agreed on the problem before anyone opened a design file.

If you take work for a living: say the hard thing before you send the invoice. Clients can handle being told their brief is wrong on day one. They cannot handle discovering it in month three.

#FreelanceLife #LagosBusiness #WebDesign #ClientWork #SmallBusinessNigeria`,
      instagram: `I should have refused that project.

Fourteen services, no photos, no prices, and a number that never answered. I designed around the mess instead of naming it — then spent three revisions defending work that was never the problem.

Now the rule is simple: if I can't name the problem in one sentence, I don't take the work.

It has cost me jobs. It has saved me clients.

#FreelanceNigeria #LagosBusiness #WebDesignLagos #ClientWork #SmallBusinessNigeria #NaijaDesigner #Easywurld`,
      tiktok: `Hook on screen: "I should have refused that project."

Beats:
0–3s — The money was good. I was new.
3–9s — Fourteen services, no photos, no prices. I designed around the mess.
9–15s — Three revisions, then silence. The brief was broken, not the design.
15–20s — If I can't name the problem, I don't take the work.

Text on screen: "Decorate the leak and you'll drown."`,
      whatsapp: `I should have refused a project. I took it because the money was good and I was new.

Fourteen services, no photos, no prices. I designed around the mess instead of naming it. Three revisions later, silence.

The rule now: if I can't name the problem in one sentence, I don't take the work.

Say the hard thing before you send the invoice.`,
    },
    hashtags: ["#FreelanceNigeria", "#LagosBusiness", "#WebDesignLagos", "#ClientWork", "#SmallBusinessNigeria", "#NaijaDesigner", "#FounderStory", "#Easywurld"],
  },

  /* 04 — Proof ------------------------------------------------------------ */
  {
    folder: "days/day-02/04-proof-report-that-replaced-a-meeting",
    date: "Saturday 7 November · 10:00 Facebook, 17:00 TikTok",
    platform: "Facebook → TikTok",
    format: "feed",
    title: "They had a 32-page report. Nobody read page four.",
    notes:
      "Proof slot. Uses a real screenshot from client/public/shots. Swap the file for a project you want to lead with; keep the concept-build label.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The work",
        headline: "They had a 32-page report. Nobody read page four.",
        body: "Not a redesign. Not an app. Three pages the owner could read in four minutes on a Saturday morning.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "What was wrong",
        headline: "The report was a reading, not a decision.",
        body: "Thirty-two slides of charts, no summary, and the actual question — what should we do next week — answered on page 29.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "What we built",
        headline: "Three pages: what happened, why, what next.",
        body: "Page one is four numbers. Page two is the reason each moved. Page three is three decisions for the week, with a name against each.",
        art: {
          type: "shot",
          img: "client/public/shots/field-notes-report.jpg",
          tag: "Concept build",
          label: "Report rebuild — concept build",
          zoom: 1.45,
          focusX: 0.5,
        },
      },
      {
        kind: "point",
        eyebrow: "What changed",
        headline: "The meeting became a decision.",
        body: "Same numbers, same business. The reading now happens before the meeting, alone, in four minutes.",
        art: { type: "none" },
      },
      {
        kind: "cta",
        eyebrow: "Try it",
        headline: "How long is your last report?",
        body: "If nobody can quote page one from memory, it is a reading — not a report.",
        foot: "Message CLEAR if you want a template.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `A salon owner had a 32-page monthly report. Nobody had read past page four.

Bookings in one notebook. Walk-ins in another. Stock in a WhatsApp message. Staff hours in someone's head. Nothing was wrong with the business — the reporting was just scattered.

We rebuilt it as three pages: what happened (four numbers), why each moved, and what to do next week.

Bookings up 12% — and the note said it came from the Saturday promo, not the ads. That one sentence stopped them spending more on ads.
Stock gap: three items flagged before the weekend rush.
Staff hours: two over budget, with the reason.

Nothing on that page is clever. It is just in one place, in the same order, every week. The meeting still happens — it is now about decisions instead of reading.

If you run a business with more than three moving parts, try this before you buy any software: pick the one number you check weekly, write one sentence about why it moved, and put both on a page. Send it to yourself every Monday for a month. Then decide what else belongs on it.

#SmallBusinessNigeria #LagosBusiness #Reporting #Operations #MarketingClarity`,
      instagram: `A 32-page report. Nobody read past page four. 📄

Five numbers, one line each: bookings up 12% (the Saturday promo, not the ads), three items low on stock, two staff hours over budget.

Same numbers they always had. In one place. In the same order. Before the meeting.

Save this if your reports live in four different apps.

#LagosBusiness #SmallBusinessNigeria #Reporting #Operations #NaijaBusiness #Easywurld`,
      tiktok: `Hook on screen: "This one page replaced their monthly meeting."

Beats:
0–4s — Four people, two hours, reading numbers aloud.
4–10s — One page: five numbers, one line of meaning each.
10–16s — "Bookings up 12% — the Saturday promo, not the ads." That line saved ad spend.
16–20s — Same numbers. One place.

Text on screen: "Decisions, not readings."`,
      whatsapp: `One page replaced their monthly meeting.

Five numbers, one line each — bookings up 12% (the Saturday promo, not the ads), stock gap, staff hours.

Same numbers. One place. Before the meeting.

What's the one number you check every week? Message CLEAR and I'll send the template.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#Reporting", "#Operations", "#NaijaBusiness", "#Easywurld", "#MarketingClarity"],
  },

  /* 05 — Status lesson ---------------------------------------------------- */
  {
    folder: "days/day-02/05-status-ten-seconds",
    date: "Saturday 7 November · 07:30 stories + WhatsApp",
    platform: "Stories + WhatsApp status",
    format: "story",
    title: "Ten seconds, three questions",
    notes: "Status slot — 9:16. Post as a WhatsApp status sequence, then an IG story with a poll on the last frame.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Ten seconds",
        headline: "A stranger gives your page ten seconds.",
        art: { type: "clock" },
      },
      {
        kind: "point",
        eyebrow: "Question one",
        headline: "What do you sell?",
        body: "In their words, not yours. If it takes a scroll to find out, they are already gone.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "Question two",
        headline: "How much, and what do I get?",
        body: "A range is enough. Silence is not.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Question three",
        headline: "What happens if I message?",
        body: "One button. One answer. Not a form with eleven fields.",
        art: { type: "browser" },
      },
      {
        kind: "cta",
        eyebrow: "Now try it",
        headline: "Count to ten on your own page.",
        body: "Message CLEAR with the one you failed and I'll tell you how to fix it.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Three questions decide whether a stranger stays on your page, and they all happen in about ten seconds.

What do you sell? How much, and what do I get? What happens if I message?

Most business pages answer none of them above the fold, then wonder why the traffic does not convert. The owner reads their own page with all their knowledge and thinks it is obvious. A stranger reads it with none and thinks it is vague.

Test it tonight: hand your phone to someone who does not know the business, say nothing, and count to ten.

#MarketingClarity #LagosBusiness #WebDesign #SmallBusinessNigeria`,
      instagram: `Ten seconds. Three questions. ⏱️

What do you sell? How much, and what do I get? What happens if I message?

Count to ten on your own page. Reply with the one you failed and I'll tell you how to fix it.

#LagosBusiness #SmallBusinessNigeria #WebsiteTips #MarketingClarity #NaijaBusiness #Easywurld`,
      tiktok: `Record the five story frames as a video, keep the countdown ticking in the corner.

Caption: Three questions in ten seconds. Most pages fail the first one. #LagosBusiness #WebDesign`,
      whatsapp: `Three questions. Ten seconds.

What do you sell? How much, and what do I get? What happens if I message?

Open your page now and count to ten. Message CLEAR with the one you failed.`,
    },
    hashtags: ["#LagosBusiness", "#WebsiteTips", "#SmallBusinessNigeria", "#MarketingClarity", "#NaijaBusiness", "#Easywurld"],
  },

  /* 06 — Opinion ---------------------------------------------------------- */
  {
    folder: "days/day-02/06-opinion-posting-daily-wont-fix",
    date: "Saturday 7 November · 13:00 TikTok, 22:00 Instagram",
    platform: "TikTok → Instagram",
    format: "feed",
    title: "Posting daily won't fix a weak offer",
    notes: "Opinion slot. Logistics example; keep the argument about clarity, not about posting less.",
    slides: [
      {
        kind: "hook",
        eyebrow: "An unpopular take",
        headline: "Posting every day won't fix a weak offer.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "What people do instead",
        headline: "They add volume to a message nobody understands.",
        body: "Thirty posts a month about a service with no price, no proof and no clear next step. The reach goes up; the enquiries do not.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "The logistics example",
        headline: "“We move goods nationwide.”",
        body: "From where? In how many days? What does it cost for 5kg to Abuja? What happens if it breaks? That is the post they needed to write.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "What works instead",
        headline: "One post that answers the question they actually have.",
        body: "“Lagos to Abuja, 24 hours, ₦4,500 for the first 5kg, insured up to ₦200,000.” One post. Screenshot it. Let it sell for a year.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "The maths",
        headline: "Volume multiplies whatever your message already is.",
        body: "If the message is clear, volume compounds. If it is vague, volume just makes the vagueness louder.",
        art: { type: "steps" },
      },
      {
        kind: "cta",
        eyebrow: "Try it",
        headline: "Write the one post you would show a stranger.",
        body: "If you cannot answer “how much and how fast” in it, you have found the work — and it is not more posting.",
        foot: "Message CLEAR if you want help writing that one.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Unpopular take: posting every day will not fix a weak offer.

I watch businesses increase volume on a message nobody understands — thirty posts a month about a service with no price, no proof and no next step. Reach climbs. Enquiries do not.

A logistics company told me "we move goods nationwide". From where? In how many days? How much for 5kg to Abuja? What happens if it breaks? Those are the questions that decide the sale, and none of them were on the page.

One post could have answered all of it: "Lagos to Abuja, 24 hours, ₦4,500 for the first 5kg, insured up to ₦200,000, message us the pickup address."

That single post is worth more than a month of motivational captions, because it does the job a salesperson would do: it removes the questions that stop people.

Volume is a multiplier. If your message is clear, volume compounds. If it is vague, volume just makes the vagueness louder.

Write the one post you would show a stranger. If it cannot answer "how much, how fast", that is the work.

#Marketing #SmallBusinessNigeria #LagosBusiness #ContentStrategy #Copywriting`,
      instagram: `Posting every day won't fix a weak offer. 🧡

Volume multiplies whatever your message already is.

"Lagos to Abuja, 24 hours, ₦4,500 first 5kg, insured" beats thirty posts of "we move goods nationwide".

Write the one post you'd show a stranger. Then post that, daily.

#ContentStrategy #LagosBusiness #SmallBusinessNigeria #Copywriting #NaijaBusiness #Easywurld`,
      tiktok: `Hook on screen: "Posting every day won't fix a weak offer."

Beats:
0–3s — Thirty posts a month. Same vague message.
3–9s — "We move goods nationwide." From where? How much? How fast?
9–15s — One post: Lagos to Abuja, 24hrs, ₦4,500, insured.
15–20s — Volume multiplies clarity. Or noise.

Text on screen: "Clear first. Then loud."`,
      whatsapp: `Posting every day won't fix a weak offer.

Volume multiplies whatever your message already is.

"We move goods nationwide" answers nothing. "Lagos–Abuja, 24hrs, ₦4,500 first 5kg, insured" answers everything.

Write that one post first. Message CLEAR if you want help.`,
    },
    hashtags: ["#ContentStrategy", "#LagosBusiness", "#SmallBusinessNigeria", "#Copywriting", "#NaijaBusiness", "#Marketing", "#Easywurld"],
  },

  /* 07 — Personal belief --------------------------------------------------- */
  {
    folder: "days/day-02/07-belief-we-put-the-price-on-the-page",
    date: "Saturday 7 November · 22:00 Instagram",
    platform: "Instagram",
    format: "feed",
    personal: true,
    title: "We put the price on the page",
    notes: "Belief slot. Adjust the actual starting prices to the ones you want to publish.",
    slides: [
      {
        kind: "hook",
        eyebrow: "What we believe",
        headline: "We put the price on the page.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Most studios don't",
        headline: "“DM for pricing” keeps the power in the wrong hands.",
        body: "It means you will be sized up before you are quoted. Most small businesses lose that conversation.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "So we publish",
        headline: "A range, and what moves it up or down.",
        body: "Pages, photography, how fast you need it. You can decide whether to talk to us before you speak to us.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "What it costs us",
        headline: "Some enquiries disappear.",
        body: "Good. They were never going to buy, and both of us would have spent a week finding that out politely.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "What it earns",
        headline: "Clients arrive already knowing the shape of the deal.",
        body: "The first call is about the work, not the number. That is a better use of an hour for everyone.",
        art: { type: "split" },
      },
      {
        kind: "cta",
        eyebrow: "Your business",
        headline: "If you can't publish a price, publish the range.",
        body: "If you can't publish the range, publish what changes it. Silence is the only wrong answer.",
        foot: "Message CLEAR and I'll show you how to phrase it.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `We put the price on the page. Most studios don't, and their reason is always the same: "it depends".

It does depend. It depends on pages, photography, copy, and how fast you need it — so we publish the range and say what moves it. You can decide whether to talk to us before you talk to us.

The cost is real: some enquiries disappear the moment they see a number. That is fine. They were never going to buy, and we would both have spent a week discovering it politely.

The benefit is bigger: the first call starts at the work instead of the number. Nobody is performing a dance to find out if they can afford to be in the room.

For a small business, "DM for price" quietly does something else — it asks the customer to be judged before they are quoted. Most people would rather leave than be sized up.

If you cannot publish a price, publish the range. If you cannot publish the range, publish what changes it. Silence is the only wrong answer.

#Pricing #SmallBusinessNigeria #LagosBusiness #WebDesign #MarketingClarity`,
      instagram: `We put the price on the page. 🧡

"DM for pricing" asks the customer to be judged before they're quoted. Most people would rather leave.

Publish a range. Say what moves it. Silence is the only wrong answer.

#Pricing #LagosBusiness #SmallBusinessNigeria #NaijaBusiness #WebDesignLagos #Easywurld`,
      tiktok: `Hook on screen: "We put the price on the page."

Beats:
0–3s — Most studios say "DM for pricing". That asks the customer to be judged first.
3–9s — We publish a range and what moves it.
9–15s — Some enquiries leave. Good — they were never buying.
15–20s — Silence is the only wrong answer.

Text on screen: "Publish the range."`,
      whatsapp: `We put the price on the page.

"DM for pricing" asks the customer to be judged before they're quoted. Most people would rather leave than be sized up.

Publish a range, and say what moves it. Silence is the only wrong answer.

Message CLEAR and I'll help you phrase it.`,
    },
    hashtags: ["#Pricing", "#LagosBusiness", "#SmallBusinessNigeria", "#NaijaBusiness", "#WebDesignLagos", "#Easywurld", "#MarketingClarity"],
  },

  /* 08 — Status proof ------------------------------------------------------ */
  {
    folder: "days/day-02/08-status-proof-report-page",
    date: "Saturday 7 November · 12:30 stories + WhatsApp",
    platform: "Stories + WhatsApp status",
    format: "story",
    title: "32 pages, then 3",
    notes: "Status proof — one real screenshot, three frames of context, one ask.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Before",
        headline: "32 pages. Nobody read page four.",
        body: "Charts, no summary, and the real question answered on page 29.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "After",
        headline: "Three pages. Read in four minutes.",
        art: {
          type: "shot",
          img: "client/public/shots/field-notes-report.jpg",
          tag: "Concept build",
          label: "Report rebuild — concept build",
          zoom: 1.4,
        },
      },
      {
        kind: "cta",
        eyebrow: "Your turn",
        headline: "How long is your last report?",
        body: "Message CLEAR and I'll send the three-page structure we use.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `32 pages, then 3. The numbers did not change — their order did.

Page one: four numbers. Page two: why each moved. Page three: three decisions, each with a name against it.

#SmallBusinessNigeria #Reporting #LagosBusiness`,
      instagram: `Before: 32 pages, nobody read page four.
After: 3 pages, read in four minutes. 📄

How long is your last report? Message CLEAR and I'll send the structure.

#LagosBusiness #SmallBusinessNigeria #Reporting #NaijaBusiness #Easywurld`,
      tiktok: `Screen-record the story with the report page on screen.

Caption: same numbers, one page. #SmallBusinessNigeria #Reporting`,
      whatsapp: `Before: 32 pages, nobody read page four.
After: 3 pages, read in four minutes.

Page one: four numbers. Page two: why. Page three: decisions.

How long is yours? Message CLEAR.`,
    },
    hashtags: ["#LagosBusiness", "#Reporting", "#SmallBusinessNigeria", "#NaijaBusiness", "#Easywurld"],
  },

  /* 09 — Invitation -------------------------------------------------------- */
  {
    folder: "days/day-02/09-invitation-one-sentence",
    date: "Saturday 7 November · 20:00 Facebook, weekly LinkedIn",
    platform: "Facebook → LinkedIn",
    format: "feed",
    title: "Tell me what you sell in one sentence",
    notes: "Invitation slot. Budget 20 minutes to reply — the replies are the content.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Your turn",
        headline: "Tell me what you sell, in one sentence.",
        body: "I'll tell you whether a stranger would understand it. No pitch, no proposal.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "Why one sentence",
        headline: "If it needs a paragraph, it isn't clear yet.",
        body: "The sentence is not for your customers. It is for you — it is the thing you should be able to say at a party, in traffic, on the phone.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "What I check",
        headline: "Who it's for, what it does, what changes.",
        body: "“Cakes for Lagos offices that need 50 slices by 10am” passes. “Quality baking services” fails.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "What you get",
        headline: "One line back, in the comments.",
        body: "If it's good, I'll say so. If it isn't, I'll rewrite it — publicly, so everyone else learns too.",
        art: { type: "browser" },
      },
      {
        kind: "cta",
        eyebrow: "Go",
        headline: "Comment your sentence, or send it privately.",
        body: "I'll reply to every one this week. If you'd rather not post it, WhatsApp is fine.",
        foot: "Message CLEAR · 0905 069 0837",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Tell me what you sell in one sentence. I'll tell you whether a stranger would understand it — no pitch, no proposal.

The one-sentence test is the cheapest diagnostic there is. If it needs a paragraph, it is not clear yet.

What I look for:
Who it is for. What it does. What changes afterwards.

Passes: "Cakes for Lagos offices that need 50 slices by 10am."
Fails: "Quality baking services for all occasions."

Send yours in the comments and I will reply with a rewrite if it needs one. Publicly, so everyone else learns from it too. If you would rather not post it, message CLEAR on WhatsApp.

One request: if I rewrite your line, come back and tell me whether you used it. That conversation is worth more than the compliment.

#Copywriting #LagosBusiness #SmallBusinessNigeria #MarketingClarity`,
      instagram: `Tell me what you sell — in one sentence. 👇

I'll tell you if a stranger would get it. Rewrite included if it needs one.

Passes: "Cakes for Lagos offices that need 50 slices by 10am."
Fails: "Quality baking services."

Comment yours. No pitch.

#LagosBusiness #SmallBusinessNigeria #Copywriting #NaijaBusiness #MarketingTips #Easywurld`,
      tiktok: `Hook on screen: "Tell me what you sell in one sentence."

Beats:
0–3s — No pitch. I'll just tell you if a stranger gets it.
3–9s — One sentence: who it's for, what it does, what changes.
9–15s — "Cakes for Lagos offices, 50 slices by 10am" passes.
15–20s — Comment yours.

Text on screen: "One sentence. Or it's not clear yet."`,
      whatsapp: `Tell me what you sell in one sentence.

I'll tell you if a stranger would understand it — no pitch.

One sentence: who it's for, what it does, what changes.

Send it. Message CLEAR.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#Copywriting", "#NaijaBusiness", "#MarketingTips", "#Easywurld", "#MarketingClarity"],
  },

  /* 10 — Behind the scenes -------------------------------------------------- */
  {
    folder: "days/day-02/10-behind-the-folder-structure",
    date: "Saturday 7 November · 21:00 TikTok, 18:00 stories",
    platform: "TikTok → Stories",
    format: "feed",
    title: "The folder structure that keeps projects sane",
    notes: "Behind the scenes. Screenshot your actual Drive folder and swap the art if you prefer the real thing.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Behind the scenes",
        headline: "Six folders keep every project sane.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Before this",
        headline: "Files lived in WhatsApp, downloads and someone's head.",
        body: "Two versions of the logo. A final PDF named “final-final-2”. A client asking for a photo we already had.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "The structure",
        headline: "01 onboarding · 02 materials · 03 working · 04 review · 05 final · 06 archive.",
        body: "Numbered, so they sort themselves. Every client, every project, the same six words.",
        art: { type: "steps" },
      },
      {
        kind: "point",
        eyebrow: "The rule that matters",
        headline: "If it isn't in 03, it isn't finished.",
        body: "Working files stay in working. Nothing moves to 05 until the client has said yes in writing.",
        art: { type: "quote" },
      },
      {
        kind: "cta",
        eyebrow: "Copy it",
        headline: "Make the six folders today.",
        body: "It takes four minutes and it saves the “which version is final” conversation forever.",
        foot: "Message CLEAR and I'll send the folder names.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Behind the scenes: the least interesting thing I do is the thing that saves the most time.

Six folders per client, numbered so they sort themselves:

01 Onboarding · 02 Client materials · 03 Working files · 04 Review and approvals · 05 Final deliverables · 06 Archive

Before this, files lived in WhatsApp, in Downloads, and in someone's head. Two versions of a logo, a PDF called "final-final-2", and a client asking for a photo we already had.

The rule that keeps it honest: if it is not in 03, it is not finished. Nothing moves to 05 until the client has approved in writing — which is the same rule that protects us both when someone says "I thought that was approved".

Four minutes to set up. It ends the version conversation permanently.

#Operations #LagosBusiness #SmallBusinessNigeria #FreelanceLife #WebDesign`,
      instagram: `Six folders keep every project sane. 🗂️

01 Onboarding · 02 Materials · 03 Working · 04 Review · 05 Final · 06 Archive

If it isn't in 03, it isn't finished. Nothing moves to 05 until the client says yes in writing.

Four minutes to set up. Saves the "which version is final" conversation forever.

#LagosBusiness #SmallBusinessNigeria #FreelanceNigeria #NaijaBusiness #Easywurld`,
      tiktok: `Screen-record your real folder tree.

Beats:
0–3s — Before: logo everywhere, "final-final-2.pdf".
3–9s — Six numbered folders, every project, same words.
9–15s — If it isn't in 03, it isn't finished.
15–20s — Four minutes. Forever.

Text on screen: "01 → 06. Every project."`,
      whatsapp: `Six folders keep every project sane.

01 Onboarding · 02 Materials · 03 Working · 04 Review · 05 Final · 06 Archive

Rule: if it isn't in 03, it isn't finished. Nothing moves to 05 until the client says yes in writing.

Message CLEAR and I'll send you the names.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#FreelanceNigeria", "#Operations", "#NaijaBusiness", "#Easywurld"],
  },

  /* 11 — Easywurld ----------------------------------------------------------- */
  {
    folder: "days/day-02/11-easywurld-the-handover",
    date: "Saturday 7 November · 20:00 Facebook, LinkedIn pin rotation",
    platform: "Facebook → LinkedIn",
    format: "feed",
    title: "What you own at the end",
    notes:
      "Easywurld slot. This is the question every serious buyer asks and almost no agency answers on the page.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The studio",
        headline: "At the end of a project, you own everything.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Why we say it out loud",
        headline: "A lot of businesses find out too late that they don't.",
        body: "Hosting in someone's name. A domain nobody remembers buying. A design file locked in a tool they can't open.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "What we hand over",
        headline: "The domain, the hosting, the files, the logins.",
        body: "In your name, on the last day. We keep a copy for the archive folder and nothing else.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "And the words",
        headline: "A one-page handover: what was built, what to update, what to leave alone.",
        body: "So the next person — a staff member, a cousin, another studio — is not guessing.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "What we keep",
        headline: "The right to say we built it. Nothing more.",
        body: "No lock-in, no monthly fee to keep the site alive, no hostage situation with your own business.",
        art: { type: "none" },
      },
      {
        kind: "cta",
        eyebrow: "Ask this",
        headline: "Before you pay any studio, ask who owns the domain.",
        body: "If the answer is “we do, but don't worry”, walk. It costs nothing to ask, and it saves everything later.",
        foot: "Message CLEAR if you want the handover checklist.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `The question serious buyers ask, and almost no studio answers on its page: what do I own at the end?

Our answer: everything. The domain, the hosting, the source files, the logins — in your name, on the last day. Plus a one-page handover telling you what was built, what to update and what to leave alone, so the next person is not guessing.

What we keep is the right to say we built it. Nothing else. No lock-in, no monthly fee to keep your own site alive, no hostage situation.

I say this out loud because it is a common way small businesses get hurt: hosting in someone else's account, a domain nobody remembers buying, a design file in a tool the owner cannot open. Six months later the relationship sours and the business is offline.

Before you pay any studio — including us — ask one question: who owns the domain, and in whose name is the hosting?

If the answer is "we do, but don't worry", walk away politely.

Message CLEAR if you want the one-page handover checklist we use.

#WebDesign #LagosBusiness #SmallBusinessNigeria #AgencyLife #MarketingClarity`,
      instagram: `At the end of a project, you own everything. 🧡

Domain, hosting, files, logins — in your name, on the last day.

Ask any studio this before you pay: who owns the domain, and whose name is the hosting on? If the answer is "we do, don't worry" — walk.

#LagosBusiness #SmallBusinessNigeria #WebDesignLagos #NaijaBusiness #Easywurld`,
      tiktok: `Hook on screen: "Ask who owns the domain before you pay."

Beats:
0–3s — Some businesses find out too late that they own nothing.
3–9s — Hosting in someone's account. A domain nobody remembers buying.
9–15s — Ours: domain, hosting, files, logins — your name, last day.
15–20s — We keep the right to say we built it. Nothing else.

Text on screen: "Everything. In your name."`,
      whatsapp: `At the end of a project, you own everything — domain, hosting, files, logins.

Ask any studio: whose name is the domain and hosting in? If they say "ours, don't worry" — walk.

Message CLEAR and I'll send the handover checklist.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#WebDesignLagos", "#NaijaBusiness", "#Easywurld", "#MarketingClarity"],
  },
];
