#!/usr/bin/env python3
"""Easywurld - shared content model for the 30-day batch.

Every piece has: the offer, the asset type, finished copy for IG and FB,
a TikTok script, a first comment, and the voice line if it is a video.
"""
from collections import defaultdict

W = "0905 069 0837"
SITE = "wa.me/2349050690837"

# ---------------------------------------------------------------- carousels
CAROUSELS = [
dict(slug="C1_PLAYBOOK_dead_end", pack="The Chat-to-Customer Playbook", kw="PLAYBOOK",
 title="The price is not the problem",
 slides=[
  dict(kind="hook", kicker="THE CHAT-TO-CUSTOMER PLAYBOOK",
       headline="You sent the price. They disappeared.",
       support="It is almost never the number. It is what happened after it."),
  dict(kind="statement", kicker="THE REAL PROBLEM",
       text="A price on its own is a dead end."),
  dict(kind="number", kicker="THE THREE-PART REPLY", num="01",
       headline="Say the number.",
       support="No apology, no \"just\", no discount before anyone asks."),
  dict(kind="number", kicker="THE THREE-PART REPLY", num="02",
       headline="Say what it includes.",
       support="One line. Scope turns a number into an offer."),
  dict(kind="number", kicker="THE THREE-PART REPLY", num="03",
       headline="Ask one question.",
       support="One question moves the chat from silence to a next step."),
  dict(kind="statement", kicker="WHAT CHANGES",
       text="Same price. Completely different ending."),
  dict(kind="cta", kicker="The Chat-to-Customer Playbook",
       headline="36 scripts for the moments that cost you sales.",
       action="Instant download \u00b7 \u20a65,000", keyword="PLAYBOOK"),
 ],
 ig="""The price was never the problem.

Someone asks how much. You send the number. The chat goes quiet \u2014 and you assume you were too expensive.

Almost never. What happened is that nothing followed the number. No scope, no timeline, no question. So there was nothing left to reply to.

Three parts fix it:
1\u00b7 The price
2\u00b7 One line on what it includes
3\u00b7 One question that moves it forward

"The Ankara set is \u20a618,000, tailored to your size, ready in 5 days. Would you like me to take your measurements now?"

Same price. Completely different ending.

The Chat-to-Customer Playbook has 36 scripts for these moments \u2014 price, quotes, silence, payment, follow-up. \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837.

Save this for your next enquiry.

#SmallBusinessNigeria #LagosBusiness #WhatsAppBusiness #Easywurld #SalesTips #LagosSME""",
 fb="""A price on its own is a dead end.

Someone asks how much, you send the number, and the chat goes quiet. Not because the price was wrong \u2014 because nothing happened after the number.

Try three parts: the price, what it includes in one line, then one question that moves things forward.

"The Ankara set is \u20a618,000, tailored to your size, ready in 5 days. Would you like me to take your measurements now?"

Same price. Completely different ending.

I put 36 of these scripts into the Chat-to-Customer Playbook \u2014 \u20a65,000, with a tracker so no follow-up gets forgotten. Message PLAYBOOK on WhatsApp: 0905 069 0837.

Which part do you usually skip \u2014 the scope line, or the question?""",
 tt="""HOOK (0\u20133s): "You sent the price. They disappeared."
BEAT 1 (3\u20138s): The problem is not the number.
BEAT 2 (8\u201314s): It is what came after it \u2014 nothing.
BEAT 3 (14\u201322s): Say the price. Say what it includes. Ask one question.
BEAT 4 (22\u201327s): That question is the whole trick.
CTA (27\u201330s): 36 scripts. \u20a65,000. Message PLAYBOOK.""",
 comment="Save this \u2014 it is the exact three-part reply for the next \"how much?\" in your DMs.",
 voice=None),

dict(slug="C2_CLEAR_five_second_test", pack="The Clear Homepage Blueprint", kw="CLEAR",
 title="The five-second test",
 slides=[
  dict(kind="hook", kicker="THE CLEAR HOMEPAGE BLUEPRINT",
       headline="Hand a stranger your phone. Give them five seconds.",
       support="Then ask what you sell, who for, and what to do next."),
  dict(kind="statement", kicker="THE TEST",
       text="If they hesitate, it is a wording problem \u2014 not a design problem."),
  dict(kind="list", kicker="WHAT THEY ARE ACTUALLY ASKING", title="Four silent questions",
       items=["What is this", "Who is it for", "Does it solve my problem", "What do I do next"]),
  dict(kind="compare", kicker="TWO FIRST SCREENS",
       left_label="What most sites say", right_label="What answers the four",
       left_text="\"Welcome to our website.\"\n\nLearn more.",
       right_text="Websites for Lagos food businesses. Live in 14 days. \u20a6300,000."),
  dict(kind="number", kicker="THE NUMBER THAT MATTERS", num="5",
       headline="Five seconds decides it.",
       support="A visitor is not reading. They are deciding whether to keep reading."),
  dict(kind="statement", kicker="THE REWRITE",
       text="Say what you sell, who for, what it costs, and the one action."),
  dict(kind="cta", kicker="The Clear Homepage Blueprint",
       headline="Seven blocks. Eight rewrites. One clear first screen.",
       action="Instant download \u00b7 \u20a65,000", keyword="CLEAR"),
 ],
 ig="""Open your site on your phone. Hand it to someone who does not know your business. Give them five seconds. Take it back.

Then ask: what do we sell, who is it for, and what were you meant to do next?

If they cannot answer all three, the problem is the first screen \u2014 not the design, the traffic, or the price.

In five seconds a visitor is answering four silent questions: what is this, who is it for, does it solve my problem, what do I do next.

"Welcome to our website" answers none of them.

"Websites for Lagos food businesses, live in 14 days, \u20a6300,000" answers all four.

The Clear Homepage Blueprint walks through the seven blocks and the exact rewrites \u2014 \u20a65,000. Message CLEAR on WhatsApp: 0905 069 0837.

Run the test tonight and tell me what happened.

#WebDesignNigeria #LagosBusiness #Easywurld #SmallBusinessTips #Copywriting #LagosSME""",
 fb="""Here is a test that takes thirty seconds.

Open your website on your phone. Hand it to someone who does not know what you do. Give them five seconds. Take it back and ask what you sell.

If they hesitate, that is your homepage problem \u2014 and it is a wording problem, not a design problem.

A visitor is answering four questions in those five seconds: what is this, who is it for, does it solve my problem, what do I do next.

Most homepages open with a slogan, a stock photo and "Learn more". None of those answer anything.

Try this instead: what you sell, who it is for, what it costs, one action.

The Clear Homepage Blueprint has the seven blocks and eight before/after rewrites \u2014 \u20a65,000. Message CLEAR on WhatsApp: 0905 069 0837.

What would a stranger say your business does, in one sentence?""",
 tt="""HOOK (0\u20133s): "Hand a stranger your phone for five seconds."
BEAT 1 (3\u20138s): Then ask them what you sell.
BEAT 2 (8\u201314s): Four questions they are answering: what, who, why, next.
BEAT 3 (14\u201322s): Most homepages answer none of them.
BEAT 4 (22\u201328s): Sell, who for, price, action. That is the first screen.
CTA (28\u201332s): The Clear Homepage Blueprint. \u20a65,000. Message CLEAR.""",
 comment="Do the test before you read the caption. It lands harder when you have already seen the hesitation.",
 voice=None),

dict(slug="C3_PAGE_one_offer", pack="The One-Offer Landing Page Kit", kw="PAGE",
 title="One page, one offer, one action",
 slides=[
  dict(kind="hook", kicker="THE ONE-OFFER LANDING PAGE KIT",
       headline="If your page can do two things, it will do neither.",
       support="A website is a library. A landing page is a signpost with an arrow."),
  dict(kind="statement", kicker="WHY PAGES FAIL",
       text="Too many offers, and no actual ask."),
  dict(kind="list", kicker="THE TEN BLOCKS", title="The page, in order",
       items=["Headline", "Who it is for", "Who it is not for", "Proof", "Scope", "Price", "The ask"]),
  dict(kind="statement", kicker="THE STRONGEST BLOCK",
       text="Who this is not for."),
  dict(kind="compare", kicker="SAME OFFER, TWO PAGES",
       left_label="Trying to catch everyone", right_label="Written for one person",
       left_text="We offer digital solutions for all businesses.",
       right_text="Websites for Lagos food businesses. Not for chains with 20 branches."),
  dict(kind="number", kicker="THE RULE", num="1",
       headline="One offer. One price. One action.",
       support="Repeat the action three times on the page. That is not aggressive. That is clear."),
  dict(kind="cta", kicker="The One-Offer Landing Page Kit",
       headline="A page that asks for the sale.",
       action="Instant download \u00b7 \u20a65,000", keyword="PAGE"),
 ],
 ig="""If your page can do two things, it will do neither.

A website is a library. A landing page is a signpost with an arrow. The moment you add a menu, a second offer or an "other services" section, you have given the visitor somewhere else to go.

The strongest block on any landing page is the one nobody writes: "who this is not for."

"Websites for Lagos food businesses. Not for restaurants with 20 locations. Send LANDING."

That line does more work than three testimonials, because it proves you know who you are talking to.

The One-Offer Landing Page Kit has the ten blocks, the headline formulas, and the proof-without-testimonials section \u2014 \u20a65,000. Message PAGE on WhatsApp: 0905 069 0837.

#LandingPage #LagosBusiness #Easywurld #Copywriting #SmallBusinessNigeria #WebDesignNigeria""",
 fb="""If your page can do two things, it will do neither.

A landing page is not a small website. A website answers many questions; a landing page answers one, then asks for the sale.

The two reasons pages fail are always the same: they offer more than one thing, and they never actually ask.

Try this. Write down the single action you want. If you cannot say it in four words, the page is not ready.

Then add the block almost nobody writes: who this is not for. It is the fastest trust builder there is, because it proves you know exactly who you are talking to.

The One-Offer Landing Page Kit has ten blocks, headline formulas and the honest urgency language \u2014 \u20a65,000. Message PAGE on WhatsApp: 0905 069 0837.

What is the one action your page asks for?""",
 tt="""HOOK (0\u20133s): "If your page can do two things, it will do neither."
BEAT 1 (3\u20139s): A website answers many questions. A page answers one.
BEAT 2 (9\u201316s): Most pages fail for two reasons: too many offers, and no ask.
BEAT 3 (16\u201323s): The strongest block? "Who this is not for."
BEAT 4 (23\u201328s): One offer. One price. One action. Repeated three times.
CTA (28\u201332s): The One-Offer Landing Page Kit. \u20a65,000. Message PAGE.""",
 comment="The most B2B idea in the batch. Expect lower reach and a higher DM rate \u2014 that is a win.",
 voice=None),
]

# -------------------------------------------------------------------- memes
MEMES = [
dict(slug="M1", short="The 'okay, thanks' silence", style="chat", kicker="EVERY SELLER KNOWS",
 lines=[("in", "How much?"), ("out", "\u20a615,000. Ready in 5 days."),
        ("in", "Okay, thanks"), ("out", "seen 2:14am")],
 big="We both know how this ends.",
 pack="The Chat-to-Customer Playbook", kw="PLAYBOOK",
 ig="""The "okay, thanks" that is not an "okay, thanks".

If you sell by chat, you know this exact silence. One extra line fixes it: say what the price includes, then ask one question.

The Chat-to-Customer Playbook has 36 scripts for these moments \u2014 \u20a65,000. Message PLAYBOOK on WhatsApp: 0905 069 0837.

#SellerLife #LagosBusiness #SmallBusinessNigeria #Easywurld #WhatsAppBusiness""",
 fb="""Customer: "how much?" Me: "\u20a615,000, ready in 5 days." Customer: "okay, thanks." Me: seen at 2:14am.

We have all been on both sides of this chat. If you are the business, the fix is one extra line \u2014 say what the price includes, then ask a question that keeps the conversation alive.

Message PLAYBOOK on WhatsApp: 0905 069 0837.

Which side of this chat are you usually on?""",
 comment="The silence after a price is never about the price. It is about the sentence you did not send."),

dict(slug="M2", short="'Cheap' is an apology", style="statement", kicker="PRICING, HONESTLY",
 big="\"Cheap\" is not\na price.\nIt is an apology.",
 pack=None, kw=None,
 ig="""\u201cCheap\u201d is not a price. It is an apology.

If you discount before anyone asks, you have told the customer the first number was not real \u2014 and every number after it is negotiable.

Price the scope. Say what is included. Then hold it.

#LagosBusiness #SmallBusinessNigeria #Easywurld #PricingTips #Solopreneur""",
 fb="""\u201cCheap\u201d is not a price. It is an apology.

If you drop your price before anyone asks you to, you have told the customer the first number was not real \u2014 and every number after it is now negotiable.

Price the scope. Say what is included. Then hold it.

What is the last thing you discounted before you were asked?""",
 comment="This one has no offer on purpose. It should get the most comments of the month \u2014 that is what it is for."),

dict(slug="M3", short="A diary with better lighting", style="statement", kicker="THE CONTENT TRUTH",
 big="Posting when you\nremember is not\nmarketing.\n\nIt is a diary with\nbetter lighting.",
 pack="The 30-Day Content Engine", kw="ENGINE",
 ig="""Posting when you remember is not marketing. It is a diary with better lighting.

The fix is not more discipline \u2014 it is fewer decisions. One afternoon a week, one set of formats, a month of posts.

The 30-Day Content Engine gives you the prompts and the batching routine \u2014 \u20a65,000. Message ENGINE on WhatsApp: 0905 069 0837.

#ContentMarketing #LagosBusiness #Easywurld #SmallBusinessNigeria #ContentCreator""",
 fb="""Posting when you remember is not marketing. It is a diary with better lighting.

The fix is not more discipline. It is fewer decisions: one afternoon a week, five formats, a bank of prompts.

That is the whole system. Everything else is admin.

Be honest \u2014 when did you last post?

The 30-Day Content Engine \u2014 \u20a65,000. Message ENGINE on WhatsApp: 0905 069 0837.""",
 comment="If your last post was more than a week ago, this is the one to read twice."),

dict(slug="M4", short="The premium brief", style="chat", kicker="CLIENT WORK",
 lines=[("in", "I want it to look premium."), ("out", "What does premium mean to your customer?"),
        ("in", "you know... premium"), ("out", "I'll ask again on Monday.")],
 big="Premium is not a design instruction.",
 pack=None, kw=None,
 ig="""\u201cI want it to look premium.\u201d

Premium is not a design instruction. It is a feeling \u2014 and the feeling comes from clarity, not from gradients.

Ask one question: what does your customer compare you to? That answer is the brief.

#LagosBusiness #Easywurld #DesignNigeria #SmallBusinessNigeria #ClientWork""",
 fb="""Client: "I want it to look premium." Me: "What does premium mean to your customer?" Client: "you know... premium."

Premium is not a design instruction. It is a feeling, and the feeling comes from clarity \u2014 not gradients, not animation, not a bigger logo.

Ask the one question that turns a vibe into a brief: what does your customer compare you to?

What is the vaguest brief you have ever been given?""",
 comment="For the designers and freelancers. No offer \u2014 this one is for reach and follows."),

dict(slug="M5", short="Nobody is coming to save it", style="statement", kicker="NOBODY IS COMING",
 big="Nobody is coming\nto save your\nmarketing.\n\nNot an app.\nNot a trend.",
 pack="The Business Playbook", kw="PLAYBOOK",
 ig="""Nobody is coming to save your marketing.

Not an app. Not a trend. Not a hack you saw at 1am.

What works is boring and repeatable: one clear offer, one channel, one month of showing up before you judge it.

That is the whole secret. It is just slow enough that most people quit first.

The Business Playbook is where we plan it. Send PLAYBOOK on WhatsApp: 0905 069 0837.

#LagosBusiness #Easywurld #SmallBusinessNigeria #MarketingTips #Solopreneur""",
 fb="""Nobody is coming to save your marketing.

Not an app. Not a trend. Not the hack you saw at 1am.

What actually works is boring and repeatable: one clear offer, one channel you can keep, and one month of showing up before you decide whether it works.

That is the whole secret. It is just slow enough that most people quit before it pays.

What have you been waiting for?""",
 comment="Good for shares, weaker for DMs. If it gets shared, it did its job."),
]
