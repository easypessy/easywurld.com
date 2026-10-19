# CLAUDE PROMPT — Generate the Easywurld Offers PDF

Copy everything inside the block below into Claude, then paste your file if you want
it to match your brand exactly. Claude will produce a finished, print-ready PDF.

**Two ways to use this prompt**

- **Option A (recommended):** Paste the whole prompt, including the data appendix, into
  Claude and ask for the PDF. It has everything it needs.
- **Option B:** Give Claude the prompt plus the files
  `EASYWURLD_OFFERS_MASTER.md` and `client/src/data/offers.ts` from the repo. It can
  read the data straight from the source and keep the numbers identical.

---

## THE PROMPT — copy from here

```
You are producing the final sales PDF for Easywurld, an independent digital studio in
Lagos, Nigeria that helps small businesses get marketing clarity. Your job is to
generate ONE polished PDF file that I can send to a customer, post to WhatsApp, and
sell from.

OUTPUT
- One A4 PDF, 10 pages, print-ready, no placeholder text, no lorem ipsum, no
  bracketed notes, no "insert here" anything.
- Generate it as a single self-contained HTML file with an embedded print stylesheet,
  then export to PDF. If you cannot export HTML to PDF directly, produce a Word
  document (.docx) with the identical content and structure and tell me the file name.
- Also give me the text of the cover page, one offer page and the final order page
  as plain text in your reply, so I can check the writing without opening the file.

BRAND
- Name: Easywurld. Slogan: "Simplify. Optimize. Grow." The slogan always sits
  directly under the wordmark, in the same serif, on the same background.
- Voice: plain, specific, confident, honest. Lagos, Nigeria. Small-business owners
  are the reader. No hype, no "revolutionary", no "unlock", no "game-changing",
  no "supercharge", no "elevate your brand to the next level".
- Never invent proof. No testimonials, no client names, no rankings, no ratings,
  no speed scores, no "trusted by X businesses". Every number that appears must
  come from the data appendix below.
- The value figures are OUR ESTIMATE: hours x 5,000. Label them that way every
  time. Never describe them as a previous price, a discount or a "worth" that
  customers once paid.
- Say plainly, at least once per offer page, that these are do-it-yourself
  resources that do not create leads and do not guarantee results.
- Portfolio and demo names belong to Easywurld sample builds. On this PDF, refer to
  them only as "concept project / sample build" if they come up at all.

DESIGN (match these exactly)
- Page background: warm cream #FAE7C7 on cover, divider and closing pages.
  Content pages: near-white #FBF9F4 with a cream header band.
- Headlines and the wordmark: deep green #0A4937, in a high-contrast serif
  (Fraunces, or the closest available serif).
- Body copy: ink #14170F, in a clean sans (Inter, or the closest available sans).
- Small labels, numbers and keywords: JetBrains Mono, deep green.
- Brand green #27473A for the logo mark and buttons. Terracotta #9E4E2C used ONCE
  per page as a single accent (a rule under a heading, a tick, a small dot).
- The Easywurld mark is a deep-green leaf whose stem becomes a circuit of small
  square nodes. Use the real file "client/public/brand/mark.png" (and
  "mark-light.png" on dark panels). Do not redraw the logo. If the mark file is not
  available to you, leave a clearly marked image placeholder the size of the mark and
  tell me in your reply, do not draw a substitute.
- Generous margins and whitespace, print-like and flat. No drop shadows, no
  gradients, no neon, no stock photos, no 3D, no stock people.
- Every page: a slim footer with the Easywurld wordmark, the slogan and the page
  number.

PAGE PLAN
1. Cover. Mark, wordmark, slogan, title "Nine Practical Offers for Small
   Businesses", one-line subtitle, "Price: N5,000 each. Digital download. Do it
   yourself.", WhatsApp number, website.
2. "How to buy" — three numbered steps, plus the paragraph explaining that the
   value numbers are an estimate of hours x N5,000 per hour, not a previous price,
   plus a short note on what Easywurld does not claim.
3-11. One page per offer, in the order given in the data appendix. Every offer page
   has exactly this structure, in this order:
   a. Offer number and name as the headline, then the tagline as the standfirst.
   b. A "Message [KEYWORD] on WhatsApp: 0905 069 0837" line with the price.
   c. "Who it is for" — from the buyer field, lightly edited for flow.
   d. "The problem" and "What you give you" (outcome field), as two short blocks.
   e. "What you get" — a four-row table: file name, format, what is inside, hours,
      estimated value. Then the total row and the one-line note that the value is
      hours x N5,000 and is an estimate.
   f. "How to use it" — the six steps as a numbered list, short.
   g. "What it does not do" — the limits as a short bulleted list.
   h. "Questions people actually ask" — three or four of the FAQs, question in bold.
   i. Footer with the wordmark, slogan and page number.
12. Order slip. A nine-row table (number, pack name, keyword, estimated value), the
   total of all nine, the four ordering steps, a "not sure which pack" line, and the
   full brand footer with the WhatsApp number and website.

WRITING RULES (this is what makes it read like a human wrote it)
- Vary sentence length. Short lines and longer ones mixed. Do not let paragraphs
  fall into a uniform rhythm.
- Use concrete Nigerian detail where the data supports it. A tailor in Yaba, a
  business owner checking their phone at 11pm, "the customer who asks how much and
  then goes quiet". Do not invent fake client stories, names or numbers to do it.
- No em dashes. No "it's not X, it's Y". No "delve", "tapestry", "testament",
  "leverage", "unlock", "seamless", "robust", "game-changing", "elevate".
- No emoji. No exclamation marks in the body. No ALL CAPS headings.
- Do not start every page the same way. Vary the opening line of each offer page.
- Keep each offer page readable in about 60 seconds. If a block runs long, cut it
  rather than shrinking the type.

QUALITY CHECK BEFORE YOU HAND IT OVER
- Every one of the nine offers appears once, with the right name, keyword, price
  and four deliverables.
- The four deliverable values add up to the total shown, and the hours add up.
- No invented testimonial, client, rating, ranking or guarantee anywhere.
- Every estimate is labelled as an estimate.
- No placeholder text left in the file.
- Read the final PDF once as a customer would. If any sentence sounds like it was
  written to fill space, rewrite that sentence.

DATA APPENDIX — the nine offers. Use it exactly. Do not change prices, keywords,
hours, values or file names.

```json
{
  "brand": {
    "name": "Easywurld",
    "slogan": "Simplify. Optimize. Grow.",
    "price": 5000,
    "rate": 5000,
    "whatsapp": "0905 069 0837",
    "wa_link": "https://wa.me/2349050690837",
    "site": "https://website-builder-portfolio.vercel.app"
  },
  "offers": [
    {
      "n": 1,
      "slug": "chat-to-customer-playbook",
      "name": "The Chat-to-Customer Playbook",
      "tagline": "Turn WhatsApp and DM enquiries into paid orders, with scripts, a tracker and a follow-up routine you can start today.",
      "category": "Business Systems",
      "keyword": "PLAYBOOK",
      "buyer": "Small-business owners in Nigeria who sell by WhatsApp or Instagram DM: fashion, food, beauty, home services, resellers and service providers who answer enquiries themselves.",
      "problem": "Enquiries arrive all day. Replies are slow or inconsistent, quotes get sent and never followed up, and “how much?” turns into silence.",
      "outcome": "A written reply flow, ready-to-paste scripts and a tracker, so every enquiry gets a clear answer and a planned follow-up. It will not create enquiries or guarantee sales; it helps you convert more of the enquiries you already get.",
      "sales": "You already do the hard part: people message you. The Chat-to-Customer Playbook helps with what happens next. It gives you a simple five-stage flow from greeting to after-sale, 36 scripts for the moments that cost you sales (price questions, “let me think”, delivery, payment, silence), a follow-up tracker in Excel, and a one-page checklist to set up WhatsApp Business properly. It is written for Nigerian small businesses, in plain language, with worked examples. No software to buy, no jargon.",
      "why": "For many small businesses the chat is the shop counter. A customer who asks a price and gets no clear answer, or no follow-up, usually buys from whoever replied better. Each lost chat is money you already paid to attract.",
      "buyNow": "Every enquiry you get this week is a chance to use it. The setup takes one afternoon, and you can use the scripts on your very next chat.",
      "how": [
        "Read the Playbook (about 25 minutes).",
        "Follow the 7-day setup plan to configure WhatsApp Business: profile, labels, greeting and away message.",
        "Copy the scripts you need into Quick Replies and edit them into your voice.",
        "Log every new enquiry in the tracker, with the next follow-up date.",
        "Each morning filter the tracker to “follow up today” and send the follow-ups.",
        "Every Friday, do the 15-minute weekly review and fix the stage where chats stall."
      ],
      "benefits": [
        "Reply faster with less typing: 36 scripts you adapt in seconds.",
        "Never forget a follow-up: the tracker shows who to message today.",
        "Sound consistent and professional, even on a busy day.",
        "Spot where chats stall, so you fix the right step.",
        "Set up WhatsApp Business features (labels, quick replies, away message) in one afternoon."
      ],
      "limits": [
        "The tracker is an Excel file (works in Excel, Google Sheets and LibreOffice). WhatsApp Business is free, but you must install it yourself.",
        "It does not generate leads or guarantee sales. Results depend on your product, price and how consistently you use it.",
        "Scripts are starting points. Edit them so they sound like you.",
        "No consultation is included. Questions about the files can be sent on WhatsApp, but custom work is not part of the ₦5,000."
      ],
      "faqs": [
        {
          "q": "Do I need WhatsApp Business?",
          "a": "It helps (labels, quick replies, away message), but the scripts and tracker work on any WhatsApp or DM app. The setup guide covers the free WhatsApp Business app."
        },
        {
          "q": "Will this work for my type of business?",
          "a": "It is built for businesses that sell by chat: products, services and bookings. If you sell mostly in-person, the follow-up and quote scripts still apply."
        },
        {
          "q": "Can I use the scripts in Pidgin or Yoruba?",
          "a": "Yes, and you should if that is how your customers talk. Each script explains its purpose so you can rewrite it in your own voice."
        },
        {
          "q": "Is this an app or automation?",
          "a": "No. It is a playbook, scripts and a spreadsheet. You stay in control of every message. Nothing is auto-sent."
        },
        {
          "q": "What if I need more help?",
          "a": "Easywurld also builds business systems and websites as paid projects. Message us on WhatsApp for a range. That is separate from this ₦5,000 resource."
        }
      ],
      "deliverables": [
        {
          "name": "Chat-to-Customer Playbook",
          "fmt": "PDF + editable DOCX",
          "desc": "The five-stage enquiry-to-order flow, response-time rules, how to write a price reply, the 1-3-7 follow-up rhythm, WhatsApp Business setup, a worked example and a weekly review routine.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "36-Script Message Library",
          "fmt": "Editable DOCX",
          "desc": "Ready-to-paste scripts for greetings, price questions, quotes, delivery, payment, follow-ups, objections, complaints, reviews and re-engagement, each with a note on when to use it.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "Lead & Follow-Up Tracker",
          "fmt": "XLSX spreadsheet",
          "desc": "A lead log with status dropdowns, automatic follow-up due flags, a quick-replies sheet and a weekly review dashboard that counts your results.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "7-Day Setup Checklist",
          "fmt": "PDF + editable DOCX",
          "desc": "A day-by-day checklist to get the whole system running in a week without overwhelm.",
          "hours": 0.5,
          "value": 2500
        }
      ],
      "hours": 7,
      "value": 35000,
      "related": {
        "service": "Business Systems",
        "label": "Business systems"
      }
    },
    {
      "n": 2,
      "slug": "clear-homepage-blueprint",
      "name": "The Clear Homepage Blueprint",
      "tagline": "Rewrite your homepage so a visitor knows what you sell, who it is for and what to do next, within ten seconds.",
      "category": "Web Design & Copywriting",
      "keyword": "CLEAR",
      "buyer": "Small-business owners and freelancers with a website (or about to build one) who suspect visitors leave without understanding what they offer.",
      "problem": "The homepage talks about the business and not the visitor. Headlines are vague, the next step is hidden, and visitors leave without enquiring.",
      "outcome": "A rewritten homepage structure and first draft of your copy that answers the three questions every visitor arrives with. It will not guarantee more enquiries, but it removes the most common reasons visitors leave confused.",
      "sales": "Most small-business homepages fail in the first ten seconds, and the cause is rarely design. The Clear Homepage Blueprint walks you through the three questions every visitor arrives with, then gives you a section-by-section structure, fill-in copy templates with examples, a scored audit you can run on your own site, and a content planner spreadsheet. It reflects how Easywurld approaches homepage work: the visitor’s question first, credentials second, one clear next step.",
      "why": "Visitors decide quickly whether a site is for them. If the first screen does not say what you do, who it helps and what to do next, a good service can look irrelevant, however well designed the page is.",
      "buyNow": "If your site is live, every visitor this month sees the current homepage. Rewriting the first screen is one of the cheapest improvements you can make.",
      "how": [
        "Run the 10-second audit on your current homepage and note your score.",
        "Read the blueprint and choose your section order.",
        "Fill in the Content Planner spreadsheet section by section.",
        "Use the copy templates to write your hero, proof, FAQ and calls to action.",
        "Check titles, descriptions and mobile view with the final checklist.",
        "Publish. Run the audit again and compare."
      ],
      "benefits": [
        "Write your first screen in one sitting using proven fill-in formulas.",
        "Know what goes on a homepage, in what order, and what to leave out.",
        "Audit your own site in 20 minutes with a scored checklist.",
        "Hand a clear content brief to any designer or developer.",
        "Write page titles and descriptions that make sense in search results."
      ],
      "limits": [
        "This is a do-it-yourself resource. It does not include a website build or a personal review of your page.",
        "It does not guarantee more enquiries, traffic or search rankings.",
        "You need to supply your own facts: what you offer, prices or price ranges, real proof you have.",
        "Writing templates are in English; adapt to your customers’ language."
      ],
      "faqs": [
        {
          "q": "Do I need a website already?",
          "a": "No. If you are planning one, the blueprint works as your content brief. If you have one, you can audit and rewrite it."
        },
        {
          "q": "Is this about design or words?",
          "a": "Mostly words and structure, because that is where most homepages go wrong. You can apply it in any builder: Wix, WordPress, Webflow, Squarespace or custom code."
        },
        {
          "q": "Do you review my homepage for ₦5,000?",
          "a": "No. This is a self-guided resource. If you want Easywurld to rewrite or build your site, message us for a quote."
        },
        {
          "q": "I have no testimonials. Can I still use it?",
          "a": "Yes. The blueprint shows how to build trust honestly without testimonials: process, specifics, guarantees you can keep, sample work."
        },
        {
          "q": "Which files do I get?",
          "a": "A PDF blueprint (plus editable DOCX), a copy templates document, a scored audit checklist and an Excel content planner."
        }
      ],
      "deliverables": [
        {
          "name": "Clear Homepage Blueprint",
          "fmt": "PDF + editable DOCX",
          "desc": "The three visitor questions, the ten-second test, a proven section order, how to write the first screen, calls to action, page titles and a before/after example.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "Homepage Copy Templates",
          "fmt": "Editable DOCX",
          "desc": "Fill-in templates for hero headlines, subheadings, service blurbs, trust section, FAQ, about and contact sections, plus 12 call-to-action options.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "Homepage Content Planner",
          "fmt": "XLSX spreadsheet",
          "desc": "A section-by-section planner with purpose, headline, copy, proof, image notes, status and automatic word counts.",
          "hours": 1,
          "value": 5000
        },
        {
          "name": "20-Point Homepage Audit Scorecard",
          "fmt": "PDF + editable DOCX",
          "desc": "A scored checklist to audit any homepage, yours or a competitor’s, in about 20 minutes.",
          "hours": 1,
          "value": 5000
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Copywriting",
        "label": "Website copy"
      }
    },
    {
      "n": 3,
      "slug": "30-day-content-engine",
      "name": "The 30-Day Content Engine",
      "tagline": "A realistic one-person content system: pillars, 60 post ideas, hook formulas and a 30-day calendar you can fill in one sitting.",
      "category": "Social Media",
      "keyword": "ENGINE",
      "buyer": "Small-business owners and solo founders who post on Instagram, Facebook, TikTok or LinkedIn but run out of ideas, post randomly, or burn out after two weeks.",
      "problem": "Posting is inconsistent. You start strong, run out of ideas, and every post feels like a fresh decision. Nothing connects to sales.",
      "outcome": "A 30-day plan you built yourself, using a content mix that balances teaching, showing, trust and selling, with ideas, hooks and captions ready to adapt. It will not guarantee followers or sales, but it makes consistent posting practical.",
      "sales": "Most content plans assume a team. This one assumes you are busy. The 30-Day Content Engine gives you a four-pillar system (Teach, Show, Trust, Sell), a guide to batching a week’s content in about two hours, a bank of 60 post ideas, 25 hook formulas with caption frameworks, and an Excel calendar that fills the month for you with dates, pillar balance and a monthly review. It is written for small businesses in Nigeria, with examples you can adapt across platforms.",
      "why": "Consistency builds familiarity and trust, and a system removes the daily “what do I post?” decision. Without one, content depends on your mood and time, and usually stops.",
      "buyNow": "A month planned today means you are not scrambling on Monday. Starting the month with a plan is easier than rescuing it halfway.",
      "how": [
        "Read the guide and pick your posting rhythm (3, 4 or 5 posts a week).",
        "Define your four pillars with the worksheet.",
        "Choose 12 to 20 ideas from the bank that fit your business.",
        "Fill the calendar: set the start date and the sheet fills dates and pillar balance.",
        "Batch-create one week of content in a single 2-hour session.",
        "Publish, reply to comments, and run the monthly review."
      ],
      "benefits": [
        "Plan a full month in about two hours.",
        "Never start from a blank page: 60 ideas and 25 hook formulas.",
        "Balance educational and sales posts using four content pillars.",
        "Set a posting rhythm that fits the time you really have.",
        "Track what works with a simple monthly review."
      ],
      "limits": [
        "It is a planning system and a swipe file, not finished posts for your business. You write or design the content using the templates.",
        "It does not include design templates or scheduling software. Canva, CapCut and the native Meta/LinkedIn schedulers are free to use.",
        "Platform features and algorithms change, and no plan can guarantee reach, followers or sales.",
        "You need to supply real photos, facts and prices from your own business."
      ],
      "faqs": [
        {
          "q": "Which platforms does it cover?",
          "a": "Instagram, Facebook, TikTok and LinkedIn. The system is platform-agnostic, with notes on adapting each post."
        },
        {
          "q": "Do I need to show my face?",
          "a": "No. The idea bank includes faceless formats: carousels, text posts, product close-ups, process shots and voice-over."
        },
        {
          "q": "How much time does it take each week?",
          "a": "About two hours to batch, plus a few minutes to publish and reply. You can scale to your own capacity."
        },
        {
          "q": "Does it include ready-made posts?",
          "a": "It includes ideas, hooks and caption frameworks to write your own quickly. It is not a set of finished posts for a specific business."
        },
        {
          "q": "Will it get me followers?",
          "a": "No honest plan can guarantee that. It gives you consistency and a better content mix, which are things you control."
        }
      ],
      "deliverables": [
        {
          "name": "30-Day Content Engine Guide",
          "fmt": "PDF + editable DOCX",
          "desc": "The four-pillar system, weekly batching routine, how to build carousels and short videos with free tools, repurposing, platform notes and the monthly review.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "60-Idea Post Bank",
          "fmt": "Editable DOCX",
          "desc": "Sixty prompts across Teach, Show, Trust and Sell that work for service and product businesses, with a suggested format for each.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "30-Day Content Calendar",
          "fmt": "XLSX spreadsheet",
          "desc": "Auto-dated 30-day planner with pillar, format, platform, hook, caption, CTA and status columns, plus pillar-balance and monthly review sheets.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Hooks and Caption Swipe File",
          "fmt": "Editable DOCX",
          "desc": "Twenty-five hook formulas, eight caption frameworks with examples and 15 calls to action.",
          "hours": 1.5,
          "value": 7500
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Social Media",
        "label": "Social media management"
      }
    },
    {
      "n": 4,
      "slug": "one-offer-landing-page-kit",
      "name": "The One-Offer Landing Page Kit",
      "tagline": "Plan, write and launch a single-purpose page for one offer, with a fill-in copy document and an editable HTML page you can open today.",
      "category": "Landing Pages",
      "keyword": "PAGE",
      "buyer": "Small-business owners, event organisers, coaches, makers and service providers launching one product, workshop, service or campaign who need a page to send people to.",
      "problem": "You are launching something and sending people to an Instagram bio, a long website or a chat thread. There is no page that explains the offer and asks for one action.",
      "outcome": "A completed page plan, full copy written for your offer, and an editable one-file web page ready to adapt and publish on a free or low-cost host. It will not guarantee sales, but it gives you a clear, professional page to send people to.",
      "sales": "A landing page has one job: help the right person say yes to one offer. The One-Offer Landing Page Kit gives you the nine-section structure Easywurld recommends, a copy template with a full worked example, and a single-file HTML page you can open in any browser, edit in a text editor and publish on a free or low-cost host. It is mobile-friendly, accessible and ready for a WhatsApp order button. It is aimed at owners who can follow instructions and are comfortable editing text; no coding skills beyond that are needed.",
      "why": "A single-purpose page keeps attention on one decision. When visitors have to hunt across a full website or scroll through a profile, many do not reach the point of saying yes.",
      "buyNow": "If you have a launch, a class, a seasonal offer or a new service coming, a page makes every post, status and message more effective.",
      "how": [
        "Read the guide and choose your one offer and one action.",
        "Complete the copy template, using the worked example as a model.",
        "Open the HTML file in a text editor. Replace the [brackets] with your copy.",
        "Add your WhatsApp number to the button links.",
        "Test on your phone using the pre-launch checklist.",
        "Publish on a host and share the link in your bio, status and posts."
      ],
      "benefits": [
        "Know exactly what sections a one-offer page needs, and in what order.",
        "Write all the copy with fill-in prompts and a full worked example.",
        "Start from a clean, mobile-friendly HTML page with WhatsApp order buttons built in.",
        "Handle objections on the page before the visitor has to ask.",
        "Launch with a checklist so nothing embarrassing goes live."
      ],
      "limits": [
        "This is a do-it-yourself kit. Publishing requires a host (several offer free plans) and, if you want your own address, a domain name. Those costs are yours.",
        "The HTML template is a simple starter page, not a custom-designed website. It has no payment processing; it uses WhatsApp or a link you provide.",
        "Easywurld does not build or host your page as part of the ₦5,000. A custom landing page is a separate paid project.",
        "It does not guarantee conversions or sales."
      ],
      "faqs": [
        {
          "q": "Do I need to know how to code?",
          "a": "No. You edit the text between tags in a text editor, and the file explains each part. If you can edit a document, you can edit this."
        },
        {
          "q": "Where can I publish the page?",
          "a": "Any static host works, including free plans from providers such as Netlify, Vercel or GitHub Pages. The guide explains the simple steps. Check each provider’s current terms and limits."
        },
        {
          "q": "Can I take payments on it?",
          "a": "The starter uses WhatsApp or a link you add. You can paste a payment link from a provider you already use. Setting up payment itself is not included."
        },
        {
          "q": "Is it just for products?",
          "a": "No. It suits workshops, services, events, courses and consultations. The copy template adapts to each."
        },
        {
          "q": "Will it look like everyone else’s page?",
          "a": "It is a clean starting point. You change the colours, words and images. A custom-designed page from Easywurld is available as a paid project."
        }
      ],
      "deliverables": [
        {
          "name": "One-Offer Landing Page Guide",
          "fmt": "PDF + editable DOCX",
          "desc": "When a landing page makes sense, the nine-section structure, how to write each section, handling objections, mobile and accessibility basics, and how to publish.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "Landing Page Copy Template with Worked Example",
          "fmt": "Editable DOCX",
          "desc": "Fill-in prompts for every section, plus a complete worked example for a fictional workshop.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Editable Landing Page Starter (HTML)",
          "fmt": "HTML file, opens in any browser",
          "desc": "A responsive, accessible single-file page with comments on every section, an FAQ, WhatsApp buttons and brand colours you can change in five lines.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "Pre-Launch Checklist",
          "fmt": "PDF + editable DOCX",
          "desc": "Twenty checks to run before you share the page.",
          "hours": 0.5,
          "value": 2500
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Landing Pages",
        "label": "Landing pages"
      }
    },
    {
      "n": 5,
      "slug": "lagos-local-visibility-starter",
      "name": "The Lagos Local Visibility Starter",
      "tagline": "A 30-day local search starter: set up your Google Business Profile, fix your page titles and ask for reviews the right way.",
      "category": "Digital Marketing & SEO",
      "keyword": "LOCAL",
      "buyer": "Lagos (and other Nigerian city) businesses that serve customers locally: salons, restaurants, clinics, repair services, schools, tutors, shops, event vendors and professionals.",
      "problem": "When people nearby search for what you do, you are hard to find, your listing is incomplete, and your website pages do not say what you do or where.",
      "outcome": "A completed Google Business Profile, clearer page titles and descriptions, a keyword list based on how customers actually search, a review-request routine and a 30-day task tracker. No one can honestly promise rankings, but these are the foundations that local visibility is built on.",
      "sales": "Local visibility is not a mystery. It is a set of basics that most small businesses never finish. The Lagos Local Visibility Starter turns them into a 30-day plan: set up and complete your Google Business Profile, choose the words customers really search with, rewrite your page titles and descriptions, collect reviews politely, and track what you have done. It includes a guide, a keyword and titles worksheet, a Google Business Profile and review-scripts pack, and a tracker spreadsheet. Honest throughout: no ranking promises, no tricks, no fake reviews.",
      "why": "Many local customers start with a phone search and choose from what they see first. An incomplete listing or vague page titles make it harder for the right people to find and trust you.",
      "buyNow": "Search habits do not wait for a launch. The setup tasks are quick, and they keep working in the background once they are done.",
      "how": [
        "Read the guide to understand the basics (about 25 minutes).",
        "Complete the Google Business Profile checklist.",
        "Use the worksheet to build your keyword list and rewrite your titles and descriptions.",
        "Start the review routine using the scripts.",
        "Follow the 30-day tracker, one small task a day or a few per week.",
        "Review your progress at day 30."
      ],
      "benefits": [
        "Complete your Google Business Profile step by step.",
        "Write page titles and descriptions customers understand.",
        "Find the words local customers use, using free tools.",
        "Ask for reviews politely and ethically with ready scripts.",
        "Follow a 30-day plan, one small task at a time."
      ],
      "limits": [
        "No ranking, traffic or customer numbers are guaranteed. Search results change and depend on competition, your location and many other factors.",
        "Platform menus (Google Business Profile, Search Console) change. The guide describes what each setting is for so you can find it.",
        "Verification of a Google Business Profile is done by Google and can take time.",
        "This is a do-it-yourself pack. It does not include Easywurld doing SEO work for you."
      ],
      "faqs": [
        {
          "q": "Do I need a website?",
          "a": "No. A complete Google Business Profile helps even without a site. If you have a website, the worksheet helps with titles and descriptions."
        },
        {
          "q": "Will this put me on page one?",
          "a": "Nobody can honestly promise that. These steps address the basics Google looks at for local results: relevance, distance and prominence. How you rank depends on your area and competitors."
        },
        {
          "q": "Is it only for Lagos?",
          "a": "It is written with Lagos and Nigeria in mind, but the steps apply to any city."
        },
        {
          "q": "Is Google Business Profile free?",
          "a": "Yes, creating and managing a profile is free. Beware of anyone selling “guaranteed first position.”"
        },
        {
          "q": "Can I buy reviews to speed up?",
          "a": "No, and the pack tells you why. Fake reviews break Google’s rules and can harm your profile and reputation. The pack shows you how to ask real customers."
        }
      ],
      "deliverables": [
        {
          "name": "Local Visibility Guide",
          "fmt": "PDF + editable DOCX",
          "desc": "How local search works in plain words, profile setup, titles and descriptions, keywords, reviews, website basics, what not to do, and realistic expectations.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "Keyword and Page Title Worksheet",
          "fmt": "Editable DOCX",
          "desc": "A keyword brainstorm, 20 seed formulas, title and description formulas with Lagos examples and a location-page template.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Google Business Profile Checklist and Review Scripts",
          "fmt": "Editable DOCX",
          "desc": "A complete profile setup checklist and 12 review-request and review-reply scripts.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "30-Day Local Visibility Tracker",
          "fmt": "XLSX spreadsheet",
          "desc": "A day-by-day task list with progress counts, a keyword log, a review tracker and a monthly summary.",
          "hours": 1.5,
          "value": 7500
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Digital Marketing",
        "label": "Local marketing strategy"
      }
    },
    {
      "n": 6,
      "slug": "clear-message-workbook",
      "name": "The Clear Message Workbook",
      "tagline": "Work out who you serve, what makes you different and how to say it in one sentence, then put it into a one-page marketing plan.",
      "category": "Digital Marketing Strategy",
      "keyword": "MESSAGE",
      "buyer": "Founders and small-business owners who struggle to explain what they do, sound like every competitor, or change their message every month.",
      "problem": "You cannot explain your business in one sentence. Your website, Instagram bio and pitch all say different things, and customers cannot tell why to choose you.",
      "outcome": "A written positioning statement, a three-pillar message, a short voice guide, ready-to-use bios and pitches, and a one-page marketing plan. It will not guarantee sales, but you will know what to say and to whom.",
      "sales": "Before design, content or ads, you need to know what you are saying and to whom. The Clear Message Workbook is the process Easywurld starts every project with, before anything is built: understand, simplify, then say it clearly. It takes you through your customer, their problem, your alternatives, your honest differences, a positioning statement, a three-pillar message, a voice guide, and a one-page plan. A fully worked example shows what finished answers look like, and a customer-interview kit helps you replace guesses with real answers.",
      "why": "When your message is unclear, every marketing task is harder: posts, website, ads, referrals. Customers choose the business they understand fastest. Clarity comes before design, content or ads.",
      "buyNow": "Every post, page and conversation you have this month will say something about your business. It helps if it is the same thing each time.",
      "how": [
        "Work through the workbook in order: customer, problem, alternatives, differences.",
        "Write your positioning statement and test it on three people.",
        "Run the customer interviews using the question set (optional but recommended).",
        "Fill in the message bank for your bios and pitch.",
        "Complete the one-page marketing plan.",
        "Update your website, bios and WhatsApp profile to match."
      ],
      "benefits": [
        "Define one specific customer, instead of “everyone.”",
        "Find three honest reasons customers choose you.",
        "Write a positioning statement and an elevator pitch.",
        "Get consistent bios for Instagram, LinkedIn, WhatsApp and your website.",
        "Leave with a one-page marketing plan for the next 90 days."
      ],
      "limits": [
        "This is a self-guided workbook. It does not include a consultation or review of your answers.",
        "It helps you clarify; it does not research your market for you. The interview kit shows how to collect real input.",
        "It does not guarantee leads or sales.",
        "The worked example is fictional, for illustration."
      ],
      "faqs": [
        {
          "q": "How long does it take?",
          "a": "Most people finish the workbook in 2 to 3 hours, plus a week if you do the customer interviews."
        },
        {
          "q": "I am just starting. Is this too early?",
          "a": "It is the best time. Clarity at the start avoids rewriting everything later."
        },
        {
          "q": "I have several services. Will it work?",
          "a": "Yes. The workbook helps you find the common thread and decide what to lead with."
        },
        {
          "q": "Is it printable?",
          "a": "Yes. You get a PDF to print and a DOCX to type in."
        },
        {
          "q": "Is there a consultation included?",
          "a": "No. It is self-guided. Easywurld offers paid strategy work separately; message us if you want a quote."
        }
      ],
      "deliverables": [
        {
          "name": "Clear Message Workbook",
          "fmt": "PDF + editable DOCX",
          "desc": "Guided worksheets for customer, problem, alternatives, differences, positioning statement, three-pillar message, voice guide and elevator pitches, with a worked example.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "Customer Interview Kit",
          "fmt": "Editable DOCX",
          "desc": "Fifteen interview questions, a script for running five short interviews and a notes table to find patterns.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Message Bank",
          "fmt": "Editable DOCX",
          "desc": "Templates for bios on Instagram, LinkedIn, WhatsApp and your website, plus 10-, 30- and 60-second pitches.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "One-Page Marketing Plan",
          "fmt": "PDF + editable DOCX",
          "desc": "A single page that holds your customer, message, channels, offers and 90-day priorities.",
          "hours": 1,
          "value": 5000
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Digital Marketing",
        "label": "Marketing strategy and messaging"
      }
    },
    {
      "n": 7,
      "slug": "everyday-ai-prompt-desk",
      "name": "The Everyday AI Prompt Desk",
      "tagline": "60 copy-paste prompts for everyday business tasks, a prompt-writing guide and a template for a safe AI enquiry assistant.",
      "category": "AI Business Automation",
      "keyword": "PROMPTS",
      "buyer": "Small-business owners, solo founders and small teams who use (or want to use) an AI chat assistant for writing, customer replies, planning and admin, but get generic results.",
      "problem": "You try AI tools and get vague, generic or wrong answers. You are not sure what to ask, what to trust, or what you should never paste in.",
      "outcome": "A set of structured prompts you adapt in minutes, a method for writing your own, a safety and review checklist, and a template for designing a small enquiry assistant with clear boundaries. Output quality varies by tool; you always review before use.",
      "sales": "Most people use AI like a search box and get search-box answers. The Everyday AI Prompt Desk gives you a five-part structure for asking well, 60 ready-to-adapt prompts organised by the work small businesses actually do (content, customer replies, sales, documents, website, planning, team), a review and safety checklist, and a template for designing an AI enquiry assistant. That template follows Easywurld’s business-systems approach: decide what the assistant will refuse and when it hands over to a human before deciding what it will say. It works with any mainstream AI chat tool.",
      "why": "AI can save time on drafts, replies and planning, but only when you give it the right facts and check its work. Bad prompts waste time, and careless use can leak private data or publish mistakes.",
      "buyNow": "If you are already using AI tools, better prompts help immediately. If you are not, a safe starting method is better than experimenting with customer data.",
      "how": [
        "Read the guide and learn the five-part prompt structure.",
        "Open the prompt library and pick three tasks you do every week.",
        "Replace the [brackets] with your real facts and run the prompts.",
        "Check each result with the review checklist before using it.",
        "Save the versions that work in your own prompt notebook.",
        "If you want an enquiry assistant, complete the knowledge-sheet template first."
      ],
      "benefits": [
        "Draft posts, replies, quotes and plans faster, from a starting point instead of a blank page.",
        "Learn the five-part prompt structure that gets specific results.",
        "Know what never to paste into an AI tool.",
        "Review AI output with a checklist before it reaches a customer.",
        "Design the boundaries of an AI enquiry assistant before building one."
      ],
      "limits": [
        "You need access to an AI chat tool. Many have free plans, and some features may need a paid plan. That cost is yours.",
        "AI tools make mistakes. Every output must be checked by a person before it is used, especially facts, prices, legal and medical statements.",
        "Prompts are structured starting points. Results vary by tool, model and the details you provide.",
        "The enquiry-assistant template is a design document. It does not build or install a chatbot. Easywurld builds assistants as separate paid projects."
      ],
      "faqs": [
        {
          "q": "Which AI tool do I need?",
          "a": "Any mainstream chat assistant works. The prompts are written in plain language, not for one specific product."
        },
        {
          "q": "Do I have to pay for an AI tool?",
          "a": "Many tools have free tiers. Limits and features change. A paid plan is optional."
        },
        {
          "q": "Are the prompts guaranteed to work?",
          "a": "They are structured to give specific, usable drafts, but no prompt can guarantee a perfect output. You adapt and check each result."
        },
        {
          "q": "Is it safe to put customer details into AI?",
          "a": "Avoid pasting personal, financial or confidential information. The guide shows you how to anonymise details and what never to paste."
        },
        {
          "q": "Does this build me a chatbot?",
          "a": "No. The knowledge-sheet template helps you plan one carefully. Building and installing is a separate service."
        }
      ],
      "deliverables": [
        {
          "name": "AI Prompting Guide for Small Business",
          "fmt": "PDF + editable DOCX",
          "desc": "The five-part prompt structure, how to give context, how to improve answers, safe-use rules, and what AI should never decide.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "60-Prompt Library",
          "fmt": "Editable DOCX",
          "desc": "Sixty copy-paste prompts in seven categories: content, customer replies, sales, documents, website and SEO, planning, and team.",
          "hours": 3,
          "value": 15000
        },
        {
          "name": "Enquiry Assistant Knowledge Sheet Template",
          "fmt": "Editable DOCX",
          "desc": "A template for FAQs, boundaries, handover rules, tone and a 15-question test script for a small AI enquiry assistant.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "AI Output Review and Safety Checklist",
          "fmt": "PDF + editable DOCX",
          "desc": "Twelve checks before you use any AI-written text, plus a never-paste list.",
          "hours": 0.5,
          "value": 2500
        }
      ],
      "hours": 7,
      "value": 35000,
      "related": {
        "service": "Business Systems",
        "label": "Business systems and AI assistants"
      }
    },
    {
      "n": 8,
      "slug": "proposal-and-report-template-pack",
      "name": "The Proposal & Report Template Pack",
      "tagline": "Editable proposal, quote, report and summary templates with worked examples, so your next document takes an hour, not a weekend.",
      "category": "Reports & Presentations",
      "keyword": "TEMPLATES",
      "buyer": "Freelancers, consultants, agencies, contractors, training providers and small teams who send proposals, quotes and reports to clients, partners or funders.",
      "problem": "Each proposal or report is built from scratch. Documents are long, inconsistent and hard to skim, and quotes take too long to prepare.",
      "outcome": "A set of editable templates and a short guide so you can produce a professional proposal, quote, progress report or executive summary in about an hour. It will not win business on its own; it makes it easier for a good offer to be understood.",
      "sales": "Good proposals and reports are not about fancy design. They are about structure: the reader’s problem first, then your approach, then the price and the next step. The Proposal & Report Template Pack gives you that structure in editable Word documents with prompts and a worked example, plus an Excel workbook for quotes and invoices with automatic totals, and a short guide on writing for busy readers. It reflects how Easywurld approaches reports and presentations: designed to be read and acted on.",
      "why": "A clear proposal helps the client say yes, and a clear report helps them act. Documents that take hours to prepare also cost you billable time and slow your replies.",
      "buyNow": "The next enquiry that asks for a quote or proposal is the moment this matters. Having the template ready means you reply while the interest is still warm.",
      "how": [
        "Read the short guide on structure and writing for busy readers.",
        "Open the proposal template and replace the prompts with your content.",
        "Use the worked example to see the level of detail needed.",
        "Prepare quotes and invoices in the Excel workbook.",
        "Use the report and summary templates after each project or month.",
        "Save your best proposals as your own library."
      ],
      "benefits": [
        "Send a professional proposal quickly using a tried structure.",
        "Prepare quotes and invoices with automatic totals.",
        "Write reports and summaries that busy people finish.",
        "Keep every document consistent, with the same look and sections.",
        "Reuse and adapt for each client without starting over."
      ],
      "limits": [
        "Templates are general business documents, not legal contracts. Have terms and contracts reviewed by a qualified professional.",
        "Tax rules (including VAT) vary by business. The workbook has an editable tax-rate cell; confirm what applies to you.",
        "You need Word (or a compatible editor such as Google Docs or LibreOffice) and Excel or Google Sheets.",
        "It does not guarantee that clients will accept a proposal."
      ],
      "faqs": [
        {
          "q": "Which software do I need?",
          "a": "Microsoft Word and Excel, or free alternatives such as Google Docs/Sheets and LibreOffice. Formats are standard DOCX and XLSX."
        },
        {
          "q": "Are the templates legal contracts?",
          "a": "No. They include a terms section as a prompt, but you should have contracts and terms checked by a qualified professional."
        },
        {
          "q": "Can I use my own logo and colours?",
          "a": "Yes. All templates are editable. Replace the headings, colours and add your logo."
        },
        {
          "q": "Is the invoice workbook compliant with Nigerian tax rules?",
          "a": "It is a calculator and layout, not tax advice. Set the tax rate to what applies to your business after checking with your accountant or the relevant authority."
        },
        {
          "q": "Can I resell the templates?",
          "a": "You can use them for your own business and clients. You may not resell or redistribute the pack itself."
        }
      ],
      "deliverables": [
        {
          "name": "Proposals and Reports Guide",
          "fmt": "PDF + editable DOCX",
          "desc": "How to structure documents for busy readers, the one-page rule, how to present pricing, how to follow up, and a pre-send checklist.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Proposal Template with Worked Example",
          "fmt": "Editable DOCX",
          "desc": "A full proposal structure with prompts for each section and a completed fictional example.",
          "hours": 2,
          "value": 10000
        },
        {
          "name": "Report and Summary Templates",
          "fmt": "Editable DOCX",
          "desc": "A progress report, an executive summary and a one-page briefing, each with prompts and an example.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Quote and Invoice Workbook",
          "fmt": "XLSX spreadsheet",
          "desc": "A quote sheet, an invoice sheet and a client log, with automatic totals, an editable tax rate and print-ready layout.",
          "hours": 1.5,
          "value": 7500
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Reports & Presentations",
        "label": "Proposals, reports and presentations"
      }
    },
    {
      "n": 9,
      "slug": "website-launch-and-care-handbook",
      "name": "The Website Launch & Care Handbook",
      "tagline": "Everything between “I need a website” and “it is live and looked after”: planning, domain and hosting choices, a brief, a launch tracker and a monthly care routine.",
      "category": "Web Design",
      "keyword": "LAUNCH",
      "buyer": "Business owners planning their first website or a rebuild, and owners with a site nobody maintains, who want to make good decisions and not be dependent on whoever built it.",
      "problem": "You do not know what to decide first, who should own the domain, how to compare quotes, or what has to happen after launch. Sites go live half-finished and then are never updated.",
      "outcome": "A clear plan from idea to launch, a written brief you can hand to any designer, an account inventory so you own what you pay for, a launch tracker and a monthly care routine. It does not build the site for you.",
      "sales": "Building a website is less about technology and more about decisions, made in the right order. The Website Launch & Care Handbook is the guide we wish every first-time site owner had. It explains goals, pages and content; domain and hosting basics in plain language; who should own what; how to brief and compare quotes; a launch-day checklist; and a 30-minute monthly care routine so the site does not decay. It also includes a ready-to-fill website brief and an Excel workbook with a launch tracker, a care log and an account inventory with renewal reminders. It is neutral about tools and written for Nigerian small businesses.",
      "why": "Website problems are often ownership and process problems: a domain registered in a developer’s name, no backups, expired renewals, no one updating content. They are avoidable with a few early decisions and a monthly routine.",
      "buyNow": "If you are about to hire someone, talk to a designer or renew a hosting plan, the handbook helps you ask better questions before you spend.",
      "how": [
        "Read the handbook (about 30 minutes).",
        "Complete the website brief.",
        "Set up the account inventory in the workbook. Record who owns each account.",
        "Use the quote questions if you are hiring.",
        "Work through the launch tracker before going live.",
        "Do the monthly care routine on the first of each month."
      ],
      "benefits": [
        "Decide in the right order: goal, pages, content, domain, platform.",
        "Make sure you, not a developer, own your domain and accounts.",
        "Compare quotes using a checklist of questions and red flags.",
        "Launch with a tested pre-launch checklist.",
        "Keep the site healthy with a 30-minute monthly routine."
      ],
      "limits": [
        "It is a guide and set of tools. It does not build, host or maintain a website.",
        "Domain, hosting, builder and email costs are separate and depend on providers. Prices and plans change, so check current terms.",
        "It is not legal, tax or data-protection advice. Check your obligations, including Nigerian data-protection requirements, with a qualified professional.",
        "If you want Easywurld to build or maintain your site, that is a separate paid project with a written quote."
      ],
      "faqs": [
        {
          "q": "Does this include a website?",
          "a": "No. It helps you plan, brief, launch and maintain one. Easywurld builds sites as separate paid projects. Message us for a range."
        },
        {
          "q": "Which website builder do you recommend?",
          "a": "The handbook compares categories (website builders, WordPress, custom or static) by who each suits, without promoting a brand, so you can choose using your needs and budget."
        },
        {
          "q": "Can I use it if I already have a site?",
          "a": "Yes. The care routine, account inventory and ownership checklist are especially useful for existing sites."
        },
        {
          "q": "What does it cost beyond ₦5,000?",
          "a": "A domain and hosting or a builder subscription, usually yearly or monthly. The handbook explains what each is for so you do not overpay or buy duplicates."
        },
        {
          "q": "Will it help me deal with a developer?",
          "a": "Yes. The brief and the quote-comparison checklist are designed for that. They help you ask clear questions and spot red flags."
        }
      ],
      "deliverables": [
        {
          "name": "Website Launch & Care Handbook",
          "fmt": "PDF + editable DOCX",
          "desc": "Planning, content, domain and hosting basics, ownership, platform options, launch, post-launch setup, monthly care and what to do when something breaks.",
          "hours": 2.5,
          "value": 12500
        },
        {
          "name": "Website Planning Brief",
          "fmt": "Editable DOCX",
          "desc": "A fill-in brief covering goals, audience, pages, content, brand, features and budget, ready to give to a designer.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Launch, Care and Accounts Workbook",
          "fmt": "XLSX spreadsheet",
          "desc": "A launch-day tracker, a monthly care log and an account inventory with renewal dates and automatic days-remaining counts.",
          "hours": 1.5,
          "value": 7500
        },
        {
          "name": "Hiring a Web Designer: Questions and Red Flags",
          "fmt": "PDF + editable DOCX",
          "desc": "Twenty-five questions to ask, red flags to watch for, and a table to compare up to three quotes.",
          "hours": 1,
          "value": 5000
        }
      ],
      "hours": 6.5,
      "value": 32500,
      "related": {
        "service": "Web Design",
        "label": "Web design"
      }
    }
  ]
}
```
```

---

## WHY THIS PROMPT EXISTS

- The nine packs live in `client/src/data/offers.ts` in the repo, so the website
  and the PDF can never disagree about a price or a keyword.
- The pack is written so Claude can rebuild the PDF from scratch at any time, for
  any price change, without you having to re-describe the offers.
- Swap the price, the WhatsApp number or the keyword in the data appendix and
  re-run the prompt for an updated PDF.

## IF YOU WANT A DIFFERENT KIND OF PDF

Say it in the prompt, for example:

- "One page per offer, 4 pages, no FAQ, keep the value table."
- "Make it a black and white-friendly version for WhatsApp sharing."
- "Add a page at the end: 'Free sample — send us the word SAMPLE for 5 free
  scripts before you buy'."
- "Turn this into a 6-slide carousel instead of a PDF, same content, one idea
  per slide."
