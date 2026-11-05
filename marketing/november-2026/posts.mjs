/**
 * Easywurld — November 2026 carousel pack.
 *
 * Ten posts: 5 LinkedIn business carousels, 3 personal story carousels,
 * 2 WhatsApp/Instagram status carousels. Everything is a carousel — no video.
 *
 * Rules this file follows (see ../BLUEPRINT.md):
 *  · slide 1 carries one feeling and fewer than twelve words
 *  · one idea per slide, each with a real, boring, specific example
 *  · no invented results, no fake client names, no numbers we did not measure
 *  · plain Lagos business language — the way a customer actually talks
 *  · slide 7 asks for a send, then a small next step
 *
 * Personal posts (`personal: true`) are written from the founder's voice with
 * deliberately vague details (no invented names, places or dates). Read them,
 * put your own memory in the blank spaces, and the post will land harder.
 */

export const posts = [
  /* ------------------------------------------------------------------ 1 */
  {
    folder: "day-01-fri-06-nov-linkedin-callout",
    date: "Friday 6 November",
    platform: "LinkedIn",
    format: "feed",
    title: "Your website is why they picked your competitor",
    notes:
      "Callout post. The strongest opener of the month — post it when you can reply to comments for the first hour.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The quiet loss",
        headline: "Your website is why they picked your competitor.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "What actually happened",
        headline: "They found you. They looked. They left.",
        body: "And because they never called, you assumed they weren't interested. They were. They just didn't trust what they saw.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "One",
        headline: "Trust is decided before they read a word.",
        body: "One bakery shows twelve phone-shot photos and no prices. Another shows three clear ones, a delivery note and a real address. Same cake. Same price.",
        art: { type: "split" },
      },
      {
        kind: "point",
        eyebrow: "Two",
        headline: "A price with no reason is just a number.",
        body: "₦45,000 on its own reads expensive. ₦45,000, feeds twenty, delivered across Lekki by 9am — that reads fair.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Three",
        headline: "Your best work is buried in WhatsApp.",
        body: "The photos customers ask for every week should be the first thing a stranger sees. Not something you send privately at 11pm.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "Four",
        headline: "Then there is no next step.",
        body: "If the only way to reach you is a number at the very bottom, most people won't look for it. One clear button fixes more than a full redesign.",
        art: { type: "browser" },
      },
      {
        kind: "cta",
        eyebrow: "Your move",
        headline: "Send this to the owner who needs to hear it.",
        body: "Then fix one thing tonight: put the price and what it includes where people can see it.",
        foot: "Message CLEAR on WhatsApp for a five-minute homepage review.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `A business owner told me last week that her website "doesn't bring customers."

I asked what happened when people visited. She didn't know. Nobody ever told her.

Here is the quiet thing about a website: people rarely complain. They just leave. No message, no call, no explanation. You only see the silence, so you assume there was no interest.

Usually there was interest. It died in the gap between "this looks nice" and "I trust these people enough to send money."

Four things close that gap, and none of them is a redesign:

1. Show the thing you sell clearly, in a photo taken with intention.
2. Put the price next to what the price includes. A number alone always feels expensive.
3. Move your best work out of WhatsApp and onto the page.
4. Give people one obvious next step. One button. Not five.

If you own a business in Lagos, try this tonight: open your site on your phone, outside, on mobile data, and read the first screen as a stranger. If you can't tell what you sell and what it costs in ten seconds, that's your leak.

Message CLEAR on WhatsApp and I'll look at the first screen with you. No charge, no pitch deck.

#WebDesign #LagosBusiness #SmallBusinessNigeria #MarketingClarity`,
      instagram: `Your website is why they picked your competitor. 🧡

They found you. Looked. Left. And because they never called, you assumed they weren't interested.

They were. They just didn't trust what they saw.

Save this and fix one thing tonight: put the price and what it includes on the page.

Message CLEAR on WhatsApp for a five-minute homepage review.

#LagosBusiness #SmallBusinessNigeria #WebDesignLagos #WebsiteDesign #MarketingTips #EntrepreneurNigeria #BrandClarity #NaijaBusiness`,
      tiktok: `Hook on screen: "Your website is why they picked your competitor."

Voiceover beats:
0–3s — Someone opened your site and closed it. No message. No call.
3–8s — It wasn't price. It was trust. Photo quality, missing prices, no next step.
8–15s — Fix one thing tonight: price + what it includes, on the page.
15–20s — Message CLEAR if you want a second pair of eyes.

Text on screen: "It wasn't price. It was trust."`,
      whatsapp: `Your website is why customers pick your competitor — and they will never tell you.

They look, they get unsure, they leave. No message. Nothing to fix later.

Tonight: open your site on your phone, on data. Can a stranger tell what you sell and what it costs in 10 seconds?

If not, message CLEAR. I'll look at it with you.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#WebDesign", "#MarketingClarity", "#NaijaBusiness", "#EntrepreneurNigeria", "#WebsiteTips", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    folder: "day-02-mon-09-nov-personal-origin-story",
    date: "Monday 9 November",
    platform: "Personal (Instagram + LinkedIn)",
    format: "feed",
    personal: true,
    title: "The first website I built, nobody paid me for",
    notes:
      "Origin story. Details are deliberately generic so you can swap in the real memory — change the kitchen, the year, the number of messages. The emotion is what carries it.",
    slides: [
      {
        kind: "hook",
        eyebrow: "From the studio",
        headline: "The first website I built, nobody paid me for.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Where it started",
        headline: "A woman sold cakes from her kitchen. She had Facebook and a prayer.",
        body: "She wasn't short of skill. Her cakes were the kind people photograph before they cut them. She just had nowhere to show them properly.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "So I built it",
        headline: "Three weekends. I deleted it twice.",
        body: "I was still learning, so I did it for free — I needed something real to show, and she needed something real to point at.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Then this happened",
        headline: "Three people messaged her the first week.",
        body: "Not because the site was clever. Because for the first time a stranger could see the cakes, the prices, and where to pick them up — without asking.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "What I understood",
        headline: "It was never about websites.",
        body: "It was about removing the small embarrassments that make a customer hesitate. The unclear price. The missing photo. The question they didn't want to ask.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "What I still believe",
        headline: "Owners don't need a lecture. They need to be understood.",
        body: "Give someone ten honest minutes and one thing to fix, and they will remember you longer than they remember a discount.",
        art: { type: "quote" },
      },
      {
        kind: "cta",
        eyebrow: "Your turn",
        headline: "Send this to someone building in the quiet.",
        body: "The friend who is doing it properly and nobody has noticed yet.",
        foot: "Message CLEAR on WhatsApp if you want a second pair of eyes.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `The first website I ever built, nobody paid me for.

A woman sold cakes from her kitchen. Her cakes were the kind people photograph before they cut them. But online, she was invisible — a Facebook page, some photos, no prices, no address, no way to order except "DM me."

She didn't need marketing lessons. She needed somewhere a stranger could look and feel safe.

I built her a one-page site over three weekends. I deleted it twice. I was still learning, and I did it free because I needed something real to point at.

The first week it was live, three people messaged her. Not because the design was clever. Because a stranger could finally see the cake, the price, and where to pick it up — without asking a single question.

That week taught me what my work actually is. It is not websites. It is removing the small embarrassments that make a customer hesitate: the missing price, the blurry photo, the question they are too shy to ask.

Most businesses in Lagos are not failing because they are bad. They are failing because they are hard to understand in ten seconds, and nobody has ever told them.

If you are building quietly and nobody has noticed yet — keep going, then fix the first screen. That is usually where the customers are hiding.

#SmallBusinessNigeria #LagosBusiness #FounderStory #WebDesign #Entrepreneurship`,
      instagram: `The first website I built, nobody paid me for.

A woman sold cakes from her kitchen. Beautiful cakes. No prices, no photos worth sharing, no way to order except "DM me".

Three weekends later she had a one-page site. Three messages came in the first week — not because it was clever, but because a stranger could finally see everything without asking.

That's when I stopped thinking of myself as someone who builds websites.

Send this to someone building in the quiet. 🧡

#FounderStory #LagosBusiness #SmallBusinessNigeria #WebDesignLagos #NaijaEntrepreneur #BrandStory #CakeBusiness #Easywurld`,
      tiktok: `Hook on screen: "The first website I built, nobody paid me for."

Beats:
0–3s — She sold cakes from her kitchen. No prices. No photos. Just "DM me".
3–9s — I built her a page in three weekends. Deleted it twice.
9–14s — First week: three messages. Not because it was clever — because everything was finally visible.
14–20s — That's when I stopped calling myself a website designer.

Text on screen: "It was never about websites."`,
      whatsapp: `The first website I built, nobody paid me for.

A woman sold cakes from her kitchen. Beautiful cakes. No prices, no clear photos, no way to order except DM.

Three weekends. Three messages the first week. Not because the site was clever — because a stranger could finally see everything without asking.

That's the whole job, honestly. Message CLEAR if you want a second pair of eyes on yours.`,
    },
    hashtags: ["#FounderStory", "#LagosBusiness", "#SmallBusinessNigeria", "#WebDesignLagos", "#NaijaEntrepreneur", "#BrandStory", "#Easywurld", "#MarketingClarity"],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    folder: "day-03-wed-11-nov-status-homepage-10-seconds",
    date: "Wednesday 11 November",
    platform: "Status (WhatsApp + Instagram Stories)",
    format: "story",
    title: "Your homepage has ten seconds",
    notes:
      "Five slides, 9:16. Post as a WhatsApp status sequence and an Instagram story with a link sticker on the last slide.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Ten seconds",
        headline: "Your homepage has ten seconds. Maybe less.",
        art: { type: "clock" },
      },
      {
        kind: "point",
        eyebrow: "In that time",
        headline: "They are asking one question.",
        body: "Not “is this nice?” — they already decided that. They are asking whether you are for them.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "First",
        headline: "“What exactly do you sell?”",
        body: "If the answer is a slogan, they leave. Say the thing plainly, in the words a customer uses.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Second",
        headline: "“How much, and what do I get?”",
        body: "You don't have to publish every price. You do have to stop making people guess.",
        art: { type: "none" },
      },
      {
        kind: "cta",
        eyebrow: "Third",
        headline: "“What do I do next?”",
        body: "One button. Message CLEAR on WhatsApp and I'll tell you which of the three your page fails.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Three questions run through a stranger's head in the first ten seconds on your homepage. They never say them out loud:

1. What exactly do you sell?
2. How much is it, and what do I get?
3. What do I do next?

Most small-business sites answer none of them above the fold. The owner thinks the site is "fine" because it looks clean. Clean is not the same as clear.

Open yours on a phone, on data, and read only the first screen. If a stranger would have to scroll or guess to answer those three, that is the work.

#WebDesign #SmallBusinessNigeria #LagosBusiness #MarketingClarity`,
      instagram: `Three questions. Ten seconds. No second chance. ⏱️

1. What do you sell?
2. How much, and what do I get?
3. What do I do next?

Swipe through and check your own page. Message CLEAR if you want me to look with you.

#LagosBusiness #SmallBusinessNigeria #WebsiteTips #WebDesignLagos #NaijaBusiness #MarketingTips #StoryDesign #Easywurld`,
      tiktok: `Use the five slides as the video: screen-record the story, add the three questions as captions, end on "message CLEAR".

Caption: Three questions every stranger asks your homepage in 10 seconds. Most sites answer none of them. #LagosBusiness #WebDesign`,
      whatsapp: `Your homepage has about ten seconds.

They are asking three things:
1. What do you sell?
2. How much, and what do I get?
3. What do I do next?

Open yours on your phone now. If you have to scroll for the answers, that is the leak.

Message CLEAR and I'll tell you which one your page fails.`,
    },
    hashtags: ["#LagosBusiness", "#WebsiteTips", "#SmallBusinessNigeria", "#WebDesignLagos", "#NaijaBusiness", "#MarketingTips", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    folder: "day-04-fri-13-nov-linkedin-audit",
    date: "Friday 13 November",
    platform: "LinkedIn",
    format: "feed",
    title: "I opened 20 Lagos business sites. 17 had the same problem",
    notes:
      "Audit post — the strongest format for saves. IMPORTANT: change '20' and '17' to the numbers you actually observed. Never post a study you did not do; people ask for the list.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Field notes",
        headline: "I opened 20 Lagos business sites last month. 17 had the same problem.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "First, the good news",
        headline: "None of them was ugly.",
        body: "That is the trap. Owners look at their site, decide it looks fine, and stop asking the only question that matters.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "The problem",
        headline: "There was no clear next step.",
        body: "No “order here”. No “send your brief”. Just a phone number in the footer and an Instagram icon. People do not hunt for the door.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Second",
        headline: "Prices were missing — or meaningless.",
        body: "“DM for price” feels safe to the owner and suspicious to the buyer. If you can't publish it, publish what it includes.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Third",
        headline: "The proof was a logo wall.",
        body: "Ten logos nobody recognises, no photos of the actual work. Show one real job, described honestly. That beats twenty logos.",
        art: { type: "list", art2: true },
      },
      {
        kind: "point",
        eyebrow: "Fourth",
        headline: "Half of them were slow on mobile data.",
        body: "Not on office wifi. On data, in traffic, on a phone that is three years old. That is how your customer is actually meeting you.",
        art: { type: "phone" },
      },
      {
        kind: "cta",
        eyebrow: "The fix",
        headline: "Most of it is an afternoon, not a rebuild.",
        body: "A clearer headline. One honest photo. A price range. One button.",
        foot: "Message CLEAR on WhatsApp for a five-minute review of yours.",
        art: { type: "steps" },
      },
    ],
    captions: {
      linkedin: `I opened 20 Lagos business websites last month. 17 had the same problem — and it wasn't the design.

None of them was ugly. Most looked tidy. Some were genuinely beautiful. That is exactly why the owners never fixed them.

What was missing, in order of how often I saw it:

1. No clear next step. No order button, no brief form, no "book a call". Just a number in the footer.
2. Prices missing, or hidden behind "DM for price". The owner thinks that protects them; the buyer reads it as "expensive, or negotiable in a way that will waste my time".
3. Proof replaced by logos. A wall of company logos nobody recognises, and no photos of real work.
4. Slow on mobile data. Fine on office wifi, painful on a three-year-old phone in traffic — which is how almost everyone will meet the site.

The fix for all four is usually an afternoon's work: a headline that says what you sell, one honest photo, a price range or a clear "from ₦__", and a single button.

If you want the specific first fix for your own site, message CLEAR on WhatsApp. I'll answer with one sentence, not a proposal.

(If you're curious: yes, I can send the list of the sites I looked at — anonymously, and only if you ask.)

#WebDesign #LagosBusiness #SmallBusinessNigeria #MarketingClarity #UX`,
      instagram: `I opened 20 Lagos business sites last month.

None of them was ugly. 17 had the same problem anyway. 👇

No clear next step. No prices. Logo walls instead of real work. Slow on data.

Swipe for the four fixes — most take one afternoon.

Message CLEAR for a five-minute review.

#LagosBusiness #SmallBusinessNigeria #WebDesignLagos #WebsiteAudit #NaijaBusiness #MarketingTips #Easywurld #WebDesign`,
      tiktok: `Hook on screen: "I opened 20 Lagos business sites. 17 had the same problem."

Beats:
0–3s — None of them was ugly. That's the trap.
3–8s — No next step. No price. Logos instead of proof. Slow on data.
8–15s — The same four fixes work every time.
15–20s — One afternoon, not a rebuild.

Text on screen: "Tidy is not the same as clear."`,
      whatsapp: `I opened 20 Lagos business sites last month. 17 had the same problem — and it wasn't the design.

No clear next step. Prices hidden or missing. Logos instead of real work. Slow on data.

Most of it is an afternoon's work, not a rebuild.

Message CLEAR and I'll tell you the first thing I'd fix on yours.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#WebDesign", "#WebsiteAudit", "#MarketingClarity", "#NaijaBusiness", "#UXTips", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    folder: "day-05-mon-16-nov-personal-too-simple",
    date: "Monday 16 November",
    platform: "Personal (LinkedIn + Instagram)",
    format: "feed",
    personal: true,
    title: "“This is too simple.” She didn't pay me",
    notes:
      "A story about being wrong. Do not soften the ending — the lesson only works if you admit the mistake first.",
    slides: [
      {
        kind: "hook",
        eyebrow: "What she said",
        headline: "“This is too simple.” She didn't pay me.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "Month three",
        headline: "I had built her five sections and a moving header.",
        body: "I was proud of it. I had spent two weeks on details nobody would ever notice, and I was ready to be told so.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Her problem",
        headline: "Customers kept asking where the prices were.",
        body: "Not one person had mentioned the animation. They wanted to know if they could afford her — and how fast she could deliver.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "So I argued",
        headline: "Then I opened it on my own phone, outside, on data.",
        body: "Half the page never loaded. The menu disappeared. The only thing that worked properly was the thing I was proudest of.",
        art: { type: "clock" },
      },
      {
        kind: "point",
        eyebrow: "The lesson",
        headline: "Simple is not lazy. Simple is what survives.",
        body: "It survives a slow network, a cracked screen, a distracted customer and a busy Monday. Decoration survives none of those.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "What I do now",
        headline: "I build the page on the worst phone I can find.",
        body: "If it still reads clearly there, the design is finished. If it only works on my laptop, it is decoration.",
        art: { type: "split" },
      },
      {
        kind: "cta",
        eyebrow: "Your turn",
        headline: "Send this to someone who confuses decoration with design.",
        body: "Or open your own page on data, outside, right now. You'll see it in ten seconds.",
        foot: "Message CLEAR on WhatsApp if you want a second opinion.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `A client once told me my work was "too simple". She didn't pay.

Month three of my business. I had built her five sections, a moving header, a scroll animation I was genuinely proud of. Two weeks of work.

Her customers kept asking where the prices were.

I argued. Then I opened it on my own phone, outside, on mobile data. Half the page never loaded. The menu disappeared. The only thing that worked was the animation.

She was right. I was designing for the compliment, not for the customer.

The lesson took a while to accept: simple is not lazy. Simple is what survives — a slow network, a cracked screen, a distracted person scrolling in traffic. Decoration survives none of those.

Now I build every page on the worst phone I can find before I call it finished. If it reads clearly there, it works everywhere.

If you're a designer reading this: the client who rejects your cleverest work is often doing you a favour.

If you're a business owner: the page that feels "too simple" is usually the one that sells.

#DesignLessons #WebDesign #LagosBusiness #FounderStory #UX`,
      instagram: `"This is too simple." She didn't pay me.

Month three. Five sections, a moving header, two weeks of animation I was proud of.

Her customers just wanted to know the prices.

I argued. Then I opened it on my phone, on data, outside. Half the page didn't load. The menu vanished. Only the animation worked.

She was right.

Simple is what survives. Send this to someone who needs to hear it. 🧡

#DesignLessons #WebDesignLagos #LagosBusiness #SmallBusinessNigeria #FounderStory #NaijaDesigner #Easywurld #UXDesign`,
      tiktok: `Hook on screen: "She said my work was too simple. She didn't pay."

Beats:
0–3s — Five sections, a moving header, two weeks of animation.
3–8s — Her customers kept asking where the prices were.
8–14s — I opened it on data. Half the page never loaded.
14–20s — Simple is what survives.

Text on screen: "I was designing for the compliment."`,
      whatsapp: `A client said my work was "too simple" and didn't pay.

Then I opened the site on my phone, on data, outside. Half of it never loaded. The menu disappeared. Only the animation worked.

She was right.

Simple is what survives. Message CLEAR if your page needs less, not more.`,
    },
    hashtags: ["#DesignLessons", "#WebDesignLagos", "#LagosBusiness", "#SmallBusinessNigeria", "#FounderStory", "#NaijaDesigner", "#UXDesign", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    folder: "day-06-wed-18-nov-linkedin-ten-second-test",
    date: "Wednesday 18 November",
    platform: "LinkedIn",
    format: "feed",
    title: "The ten-second test anyone can run tonight",
    notes:
      "Practical, saveable format. Pairs with Day 3 status — reuse the idea, different angle, so the two reinforce each other.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The test",
        headline: "Open your homepage. Can a stranger tell what you sell in ten seconds?",
        art: { type: "clock" },
      },
      {
        kind: "pain",
        eyebrow: "Most owners fail",
        headline: "And then they blame the design.",
        body: "It is rarely the colours. It is that the first screen is about you, not about the person deciding whether to trust you.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "How to run it",
        headline: "Hand your phone to someone who doesn't know your business.",
        body: "Say nothing. Don't explain. Count to ten in your head and watch their eyes, not their mouth.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "What you'll hear",
        headline: "“So… what do you do exactly?”",
        body: "That sentence is the whole diagnosis. Your headline is the problem, not your layout. The layout is doing what it was told.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "The rewrite",
        headline: "Say it the way a customer would say it.",
        body: "Not “We craft digital experiences.” Try “We build websites for Lagos businesses that need customers, not compliments.” Same company. Clearer promise.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Then make it easy",
        headline: "One button, one destination.",
        body: "“Message us on WhatsApp” beats a form nobody finishes. If they have to choose between five options, they choose none.",
        art: { type: "steps" },
      },
      {
        kind: "cta",
        eyebrow: "Try tonight",
        headline: "Run the test. Ten seconds. Be honest.",
        body: "If it fails, rewrite the headline before you touch the design. It costs nothing and it is where the customers were hiding.",
        foot: "Message CLEAR on WhatsApp and I'll run the test with you.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Here is a test you can run tonight, with no tools and no budget.

Open your homepage. Hand the phone to someone who doesn't know your business. Say nothing. Count to ten.

If they ask "so what exactly do you do?", the headline is the problem — not the colours, not the layout, not the fonts.

Most owners fail this test for one reason: the first screen talks about the company instead of the customer. "We are a creative studio passionate about excellence" tells me nothing about whether you can help me this month.

Rewrite it the way a customer would describe you to a friend:

"We build websites for Lagos businesses that need customers, not compliments."

Same company. Clearer promise. Ten seconds. No guessing.

Then make the decision easy: one button, one destination. A WhatsApp link beats a form nobody finishes. Five options is the same as no options.

Run the test before you spend money on a redesign. Half of the redesigns I'm asked for are headline problems.

Message CLEAR and I'll run the test on your site with you. One sentence back, no proposal.

#WebDesign #Copywriting #SmallBusinessNigeria #LagosBusiness #MarketingClarity`,
      instagram: `The ten-second test. No tools, no budget. ⏱️

Hand your phone to a stranger. Say nothing. Count to ten.

If they ask "what exactly do you do?" — your headline is the problem, not your design.

Save this and try it tonight.

Message CLEAR if you want me to run it with you.

#LagosBusiness #SmallBusinessNigeria #WebsiteTips #CopywritingTips #WebDesignLagos #NaijaBusiness #MarketingClarity #Easywurld`,
      tiktok: `Film yourself handing your phone to a friend.

Beats:
0–3s — Hand them your homepage. Say nothing. Count to ten.
3–8s — If they ask "what do you do?", it's the headline.
8–15s — Rewrite it as a sentence a customer would say.
15–20s — Then one button, one destination.

Text on screen: "Ten seconds. No explanation allowed."`,
      whatsapp: `The ten-second test — try it tonight.

Open your homepage. Give your phone to someone who doesn't know your business. Say nothing. Count to ten.

If they ask "what exactly do you do?", that is your headline's fault, not the design.

Rewrite it the way a customer would say it. Then one button, one destination.

Message CLEAR if you want a second pair of eyes.`,
    },
    hashtags: ["#LagosBusiness", "#WebsiteTips", "#CopywritingTips", "#SmallBusinessNigeria", "#WebDesignLagos", "#NaijaBusiness", "#MarketingClarity", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    folder: "day-07-fri-20-nov-status-myth-break",
    date: "Friday 20 November",
    platform: "Status (WhatsApp + Instagram Stories)",
    format: "story",
    title: "You don't need a bigger website",
    notes:
      "Myth-break. Five slides, 9:16. Strong Friday-evening status — send it to your broadcast list, not just the status.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Straight talk",
        headline: "You don't need a bigger website. You need a clearer one.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "Why bigger fails",
        headline: "Every extra page is another place to get lost.",
        body: "Ten pages with no clear answer is worse than one page that answers everything in order.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "One page can do it",
        headline: "If it answers three questions, it works.",
        body: "What you sell. What it costs. What happens after I message you.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "The uncomfortable part",
        headline: "Clarity means removing things you like.",
        body: "The tagline you're proud of. The animation. The five services you added because you didn't want to say no.",
        art: { type: "split" },
      },
      {
        kind: "cta",
        eyebrow: "Try it",
        headline: "Remove one thing today. Then message CLEAR.",
        body: "I'll tell you the second thing to remove — and the one thing to add.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `You don't need a bigger website. You need a clearer one.

I keep meeting business owners who want more pages: a blog, a team page, a gallery, a resources section. Usually the homepage cannot answer three basic questions yet.

What do you sell?
What does it cost, and what do I get?
What happens after I message you?

A single page that answers those in order will outsell ten pages that circle them.

The hard part is not the build. It is removing the things you like — the tagline you're proud of, the animation, the five services you said yes to because you didn't want to turn work away.

Clarity is subtraction. Most businesses do not have a "more" problem.

#WebDesign #MarketingClarity #SmallBusinessNigeria #LagosBusiness #Branding`,
      instagram: `You don't need a bigger website. You need a clearer one. 🧡

One page that answers three questions beats ten pages that circle them:
• What do you sell?
• What does it cost?
• What happens after I message?

Clarity is subtraction. Save this.

#LagosBusiness #SmallBusinessNigeria #WebsiteTips #WebDesignLagos #NaijaBusiness #MarketingClarity #Easywurld`,
      tiktok: `Hook on screen: "You don't need a bigger website."

Beats:
0–3s — Bigger means more places to get lost.
3–10s — One page, three answers: what, how much, what next.
10–16s — The hard part is deleting the things you like.
16–20s — Clarity is subtraction.

Text on screen: "Clarity is subtraction."`,
      whatsapp: `You don't need a bigger website. You need a clearer one.

One page that answers three things beats ten pages that circle them:
— what you sell
— what it costs
— what happens after I message

The hard part is removing the things you like.

Message CLEAR. I'll tell you what to remove first.`,
    },
    hashtags: ["#LagosBusiness", "#WebsiteTips", "#SmallBusinessNigeria", "#WebDesignLagos", "#MarketingClarity", "#NaijaBusiness", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    folder: "day-08-mon-23-nov-linkedin-before-after",
    date: "Monday 23 November",
    platform: "LinkedIn",
    format: "feed",
    title: "Same business. Same products. Two homepages.",
    notes:
      "Before/after is the highest-saving format on LinkedIn. Use a real before/after from your own work, or describe it honestly as 'a rebuild I did' — never imply a client result you did not get.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Side by side",
        headline: "Same business. Same products. Two homepages.",
        body: "One gets messages. One gets silence. The difference is four decisions, not a budget.",
        art: { type: "split" },
      },
      {
        kind: "point",
        eyebrow: "Decision one",
        headline: "The first line stopped describing and started promising.",
        body: "Before: “Quality you can trust.” After: “Cakes for 20–200 people, delivered across Lagos by 9am.” One is a mood. The other is an offer.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Decision two",
        headline: "The first photo became the best photo.",
        body: "Instead of a stock kitchen, the cake people actually order — shot on a phone, in daylight, cut open so you can see the layers.",
        art: { type: "phone" },
      },
      {
        kind: "point",
        eyebrow: "Decision three",
        headline: "The price stopped hiding.",
        body: "“From ₦45,000 for 20 guests” filters out the people who would waste your day, and reassures the ones who can afford you.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "Decision four",
        headline: "One button replaced four menus.",
        body: "“Order on WhatsApp” — and it opens with the message already half written, so the customer only has to send it.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "What didn't change",
        headline: "The brand stayed the same.",
        body: "Same colours, same tone, same business. We removed hesitation, not personality. That is the whole trick.",
        art: { type: "none" },
      },
      {
        kind: "cta",
        eyebrow: "Your turn",
        headline: "Pick one of the four and do it today.",
        body: "Start with the first line. It is the cheapest change with the loudest effect.",
        foot: "Message CLEAR on WhatsApp if you want a before/after review.",
        art: { type: "steps" },
      },
    ],
    captions: {
      linkedin: `Same business. Same products. Two homepages. Only one of them gets messages.

I rebuilt a small food business's homepage this year without touching their brand. Same colours, same tone, same products. Four decisions did the work:

1. The first line stopped describing and started promising. "Quality you can trust" became "Cakes for 20–200 people, delivered across Lagos by 9am."
2. The first photo became the best photo — the cake people actually order, shot in daylight, cut open.
3. The price stopped hiding. "From ₦45,000 for 20 guests" filters out the wrong customers and reassures the right ones.
4. Four menus became one button: "Order on WhatsApp", pre-filled so the customer only has to press send.

Nothing here required a bigger budget. It required deciding what the page is for.

If your page feels "fine" but quiet, start with the first line. It is the cheapest change with the loudest effect.

Message CLEAR if you want me to look at yours side by side with what it could be.

#WebDesign #ConversionTips #LagosBusiness #SmallBusinessNigeria #Copywriting`,
      instagram: `Same business. Same products. Two homepages. 🔁

One gets messages. One gets silence. The difference is four decisions — not a budget.

1. The first line made a promise
2. The best photo went first
3. The price stopped hiding
4. One button replaced four menus

Save this. Start with the first line.

#LagosBusiness #SmallBusinessNigeria #WebDesignLagos #ConversionTips #NaijaBusiness #MarketingTips #Easywurld #WebsiteDesign`,
      tiktok: `Hook on screen: "Same business. Two homepages. Only one gets messages."

Beats:
0–3s — Same colours. Same products. Different result.
3–9s — Before: "Quality you can trust." After: "Cakes for 20–200, delivered by 9am."
9–15s — Best photo first. Price visible. One button.
15–20s — The cheapest fix is the first line.

Text on screen: "Four decisions. No bigger budget."`,
      whatsapp: `Same business. Same products. Two homepages — one gets messages, one gets silence.

Four decisions did it:
1. The first line made a promise, not a mood.
2. The best photo went first.
3. The price stopped hiding.
4. One button replaced four menus.

Start with the first line. Cheapest fix, loudest effect.

Message CLEAR for a before/after look at yours.`,
    },
    hashtags: ["#LagosBusiness", "#ConversionTips", "#SmallBusinessNigeria", "#WebDesignLagos", "#Copywriting", "#NaijaBusiness", "#MarketingTips", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    folder: "day-09-wed-25-nov-personal-pricing",
    date: "Wednesday 25 November",
    platform: "Personal (LinkedIn + Instagram)",
    format: "feed",
    personal: true,
    title: "I almost quit in month three",
    notes:
      "The money post. Vulnerability + a concrete lesson. Adjust the numbers to your real ones before posting — never invent revenue figures.",
    slides: [
      {
        kind: "hook",
        eyebrow: "The money post",
        headline: "I almost quit in month three.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "It wasn't the work",
        headline: "The work was fine. I was charging for the wrong thing.",
        body: "I priced what I could build — pages, revisions, hours — and then wondered why every good project still felt like a loss.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "The conversation",
        headline: "A business owner asked me one question.",
        body: "“If this works, how much does it make me back?” I didn't have an answer. I had a price list.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "What changed",
        headline: "I started asking what a lost customer costs them.",
        body: "One bakery told me a single wedding order is ₦150,000. Two extra orders a month changes her whole year — and the site is what stands between her and them.",
        art: { type: "clock" },
      },
      {
        kind: "point",
        eyebrow: "The uncomfortable part",
        headline: "I raised my prices and lost two clients.",
        body: "I also stopped dreading Mondays, stopped rushing the work, and started getting referrals from people who valued it.",
        art: { type: "split" },
      },
      {
        kind: "point",
        eyebrow: "What I know now",
        headline: "Price is a story about consequence.",
        body: "If you cannot explain what happens when the work is missing, the price will always feel like too much — to you first, and then to them.",
        art: { type: "none" },
      },
      {
        kind: "cta",
        eyebrow: "Your turn",
        headline: "Send this to someone who is undercharging.",
        body: "They are not being modest. They are being unclear about what they are worth.",
        foot: "Message CLEAR if you want to talk about the numbers.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `I almost quit in month three. Not because the work was bad — because I was charging for the wrong thing.

I priced pages. Revisions. Hours. And then every good project still felt like a loss.

The question that changed it came from a client: "If this works, how much does it make me back?"

I didn't have an answer. I had a price list.

So I started asking a different question in every first call: what does a lost customer cost you?

One bakery told me a single wedding order is ₦150,000. Two extra orders a month changes her year. Suddenly the website was not a cost — it was the cheapest salesperson she would ever hire.

I raised my prices. I lost two clients. I also stopped dreading Mondays, stopped rushing the work, and started getting referrals from people who valued it.

Price is a story about consequence. If you can't explain what happens when the work is missing, the price will always feel like too much — to you first, then to them.

If you're underpricing, it is usually not modesty. It is unclear value.

#Pricing #SmallBusinessNigeria #FreelanceLife #LagosBusiness #FounderStory`,
      instagram: `I almost quit in month three. Not because the work was bad.

I was charging for pages and hours instead of what the work makes people back.

Then a client asked: "If this works, how much do I get back?"
I had no answer. Only a price list.

Raised my prices. Lost two clients. Stopped dreading Mondays.

Price is a story about consequence. 🧡

#FounderStory #Pricing #LagosBusiness #SmallBusinessNigeria #FreelanceNigeria #NaijaEntrepreneur #Easywurld #BusinessGrowth`,
      tiktok: `Hook on screen: "I almost quit in month three."

Beats:
0–3s — The work was fine. The pricing wasn't.
3–9s — A client asked: "how much does this make me back?"
9–15s — I had no answer. Only a price list.
15–20s — Price is a story about consequence.

Text on screen: "Undercharging is unclear value."`,
      whatsapp: `I almost quit in month three.

Not the work — I was charging for pages and hours instead of what the work makes back.

A client asked: "If this works, how much do I get back?" I had no answer. Only a price list.

Price is a story about consequence. If you can't explain what happens without the work, it will always feel expensive.

Message CLEAR if you want to talk numbers.`,
    },
    hashtags: ["#FounderStory", "#Pricing", "#LagosBusiness", "#SmallBusinessNigeria", "#FreelanceNigeria", "#NaijaEntrepreneur", "#BusinessGrowth", "#Easywurld"],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    folder: "day-10-fri-27-nov-linkedin-reply-bait",
    date: "Friday 27 November",
    platform: "LinkedIn",
    format: "feed",
    title: "Drop your link. I'll tell you the first thing I'd fix.",
    notes:
      "Reply-bait close to the month. Budget 20 minutes to reply properly — the comments are the content. Keep every reply to one specific sentence.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Your turn",
        headline: "Drop your link. I'll tell you the first thing I'd fix.",
        body: "No pitch, no proposal. One sentence per site, in the comments.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "How I look",
        headline: "I check five things, in this order.",
        art: { type: "steps" },
      },
      {
        kind: "point",
        eyebrow: "One",
        headline: "The first screen.",
        body: "What do you sell? If I have to scroll or guess, that is the first fix — before anything else.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "Two",
        headline: "The price, or the range.",
        body: "A number with a reason reads fair. A missing number reads expensive.",
        art: { type: "quote" },
      },
      {
        kind: "point",
        eyebrow: "Three and four",
        headline: "The proof. Then the next step.",
        body: "One real job, honestly described. One button, one destination. Not five.",
        art: { type: "list" },
      },
      {
        kind: "point",
        eyebrow: "Five",
        headline: "How it feels on data.",
        body: "Slow pages lose people before the design is even seen. That is where most Lagos sites quietly fail.",
        art: { type: "clock" },
      },
      {
        kind: "cta",
        eyebrow: "Comment below",
        headline: "Comment your link, or message CLEAR.",
        body: "I'll reply to every one this week — first come, first served.",
        foot: "If you'd rather not post it publicly, WhatsApp is fine.",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `Drop your website link below. I'll tell you the first thing I would fix. One sentence, no proposal, no pitch.

I'll check five things in this order:

1. The first screen — can I tell what you sell without scrolling?
2. The price, or at least the range — a number with a reason reads fair; a missing number reads expensive.
3. The proof — one real job described honestly beats a wall of logos.
4. The next step — one button, one destination.
5. Speed on mobile data, because that is how most people will meet you.

I'll reply to everyone who comments this week. If you'd rather not post it publicly, message CLEAR on WhatsApp and I'll do the same thing privately.

One request: if I give you a fix, come back and tell me whether you did it. That conversation is more useful than the compliment.

#WebDesign #LagosBusiness #SmallBusinessNigeria #MarketingClarity #WebsiteReview`,
      instagram: `Drop your link. I'll tell you the first thing I'd fix. 👇

I check five things:
1. The first screen
2. The price (or range)
3. Real proof
4. One clear next step
5. How it feels on data

Comment your link — I'll reply to everyone this week. No pitch.

#LagosBusiness #SmallBusinessNigeria #WebDesignLagos #WebsiteReview #NaijaBusiness #MarketingTips #Easywurld`,
      tiktok: `Hook on screen: "Drop your link. I'll tell you the first thing I'd fix."

Beats:
0–3s — No pitch. One sentence per site.
3–10s — I check: first screen, price, proof, next step, speed on data.
10–16s — Most sites fail at number one.
16–20s — Comment your link.

Text on screen: "Comment your link 👇"`,
      whatsapp: `Drop your website link here and I'll tell you the first thing I'd fix. One sentence, no pitch.

I check: the first screen, the price, the proof, the next step, and how it feels on data.

Send it before Friday and I'll reply the same day.

Message CLEAR.`,
    },
    hashtags: ["#LagosBusiness", "#SmallBusinessNigeria", "#WebsiteReview", "#WebDesignLagos", "#MarketingClarity", "#NaijaBusiness", "#Easywurld"],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    folder: "day-11-easywurld-introduction",
    date: "Anytime — pin this one",
    platform: "LinkedIn + Instagram + pinned profile post",
    format: "feed",
    title: "We are Easywurld. Here is exactly what that means",
    notes:
      "The introduction. Pin it to the profile and re-post monthly with a fresh first slide. One screenshot of real work is included; swap the file for a project you want to lead with.",
    slides: [
      {
        kind: "hook",
        eyebrow: "Who we are",
        headline: "We are Easywurld. Here is exactly what that means.",
        art: { type: "none" },
      },
      {
        kind: "pain",
        eyebrow: "What we actually fix",
        headline: "Most businesses don't have a marketing problem.",
        body: "They have a clarity problem. Nobody can tell what they sell, what it costs, or what happens after they message.",
        art: { type: "none" },
      },
      {
        kind: "point",
        eyebrow: "So we start here",
        headline: "The website, and the words on it.",
        body: "Everything else — social media, automation, reports — works better once those two are clear. That is why we open with them, not with a retainer.",
        art: { type: "browser" },
      },
      {
        kind: "point",
        eyebrow: "The process",
        headline: "Understand. Simplify. Build. Optimize.",
        body: "Four steps, in that order. We do not design before we understand, and we do not call it finished until a stranger can act on it.",
        art: { type: "steps" },
      },
      {
        kind: "point",
        eyebrow: "The work",
        headline: "A homepage, before and after.",
        body: "Same business, same products. The headline says what is sold, the price is visible, and there is one button to press.",
        art: {
          type: "shot",
          img: "client/public/shots/clear-homepage-rewrite.jpg",
          tag: "Concept build",
          label: "Homepage rewrite — concept build",
        },
      },
      {
        kind: "point",
        eyebrow: "How we work",
        headline: "We only take work where we can point at the fix.",
        body: "If we cannot name the problem in one sentence, we are not the right studio for it yet. That honesty has cost us jobs, and earned us better ones.",
        art: { type: "quote" },
      },
      {
        kind: "cta",
        eyebrow: "Say hello",
        headline: "Message CLEAR and tell us what you sell.",
        body: "We will reply with the first thing we would fix — free, in one sentence, whether you hire us or not.",
        foot: "WhatsApp 0905 069 0837 · easywurld.com",
        art: { type: "seal" },
      },
    ],
    captions: {
      linkedin: `We are Easywurld — a small digital studio in Lagos. Simplify. Optimize. Grow.

Here is what that means in practice, because "digital studio" explains nothing.

Most businesses we meet don't have a marketing problem. They have a clarity problem. A stranger lands on their page and cannot tell what they sell, what it costs, or what happens after they message. Everything downstream — social content, automation, reports — inherits that confusion.

So we start with the two things everyone actually sees: the website, and the words on it. Get those clear, and the rest of the work gets easier and cheaper.

Our process is four steps, in order: Understand. Simplify. Build. Optimize. We don't design before we understand, and we don't call a project finished until a stranger can act on it.

We only take work where we can point at the fix. If we can't name the problem in one sentence, we say so — and that has cost us jobs, and earned us better ones.

If you run a business in Lagos and you want a second pair of eyes: message CLEAR on WhatsApp and tell me what you sell. I'll reply with the first thing I'd fix. One sentence, free, whether you hire us or not.

#Easywurld #LagosBusiness #WebDesign #SmallBusinessNigeria #MarketingClarity`,
      instagram: `We are Easywurld. 🧡

Simplify. Optimize. Grow.

Most businesses don't have a marketing problem — they have a clarity problem. Nobody can tell what they sell, what it costs, or what happens next.

So we start with the website and the words on it. Then social, automation, reports — in that order.

Message CLEAR and tell us what you sell. We'll reply with the first thing we'd fix. Free.

#Easywurld #LagosBusiness #WebDesignLagos #SmallBusinessNigeria #NaijaBusiness #MarketingClarity #Copywriting #Branding`,
      tiktok: `Hook on screen: "We are Easywurld. Here's exactly what that means."

Beats:
0–3s — Not a marketing problem. A clarity problem.
3–9s — Start with the website and the words. Everything else inherits it.
9–15s — Understand, simplify, build, optimize.
15–20s — Message CLEAR. One sentence back, free.

Text on screen: "Simplify. Optimize. Grow."`,
      whatsapp: `We are Easywurld — a digital studio in Lagos.

Simplify. Optimize. Grow.

Most businesses don't have a marketing problem, they have a clarity problem: nobody can tell what you sell, what it costs, or what happens after they message.

So we start with the website and the words. Then social, automation, reports.

Tell me what you sell and I'll reply with the first thing I'd fix. Free. Message CLEAR.`,
    },
    hashtags: ["#Easywurld", "#LagosBusiness", "#WebDesign", "#SmallBusinessNigeria", "#MarketingClarity", "#NaijaBusiness", "#Copywriting", "#Branding"],
  },
];
