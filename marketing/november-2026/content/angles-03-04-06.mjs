/**
 * Slots 3 (Personal story), 4 (Proof) and 6 (Opinion).
 *
 * Story posts are first person and deliberately vague on names and numbers —
 * they are the frame; the real memory is yours to drop in. Proof posts carry a
 * real screenshot and are labelled concept build wherever the work is a concept.
 */

export const slot3 = [
  {
    k: "first-website", e: "Where it started", h: "The first website I built was free.",
    p: [
      ["Why free", "A small business owner had no budget and I had no portfolio.", "So I built it for nothing, on a laptop that overheated, and I learned more in three weeks than in a year of tutorials."],
      ["What it taught me", "The design was not the hard part.", "Getting somebody to say what they actually sell was. That has been the job ever since."],
    ],
    c: ["Charge less at the start if you must.", "But always finish the thing. An unfinished free project is worse than no project."],
    art: "none",
  },
  {
    k: "too-simple", e: "A hard lesson", h: "They said my work was 'too simple'.",
    p: [
      ["What happened", "One page. One button. No animations.", "The client wanted something that looked like the money they were spending, so they went elsewhere."],
      ["What I did with it", "I stopped selling simplicity as an aesthetic.", "Now I sell it as a result: fewer choices, fewer questions, more enquiries. Same work, different sentence."],
    ],
    c: ["If people do not value your work, check what you are calling it.", "Simple is a strategy. Say so."],
    art: "quote",
  },
  {
    k: "almost-quit", e: "The honest month", h: "There was a month I nearly stopped doing this.",
    p: [
      ["What happened", "Two clients went quiet, one invoice went unpaid, and every project felt like an argument.", "I told myself the market was bad. Some of it was. Most of it was that I was selling pages instead of outcomes."],
      ["What changed", "I started asking one question before quoting.", "“What happens in your business if this works?” The answer became the proposal, and the arguments stopped."],
    ],
    c: ["Ask that question on your next call.", "It changes what you write, and what you charge."],
    art: "clock",
  },
  {
    k: "refused-project", e: "A decision", h: "I turned down a job last month. It still stings.",
    p: [
      ["The job", "Good money, clear brief, nice people.", "But the thing they wanted would not have fixed the thing that was wrong, and I could see the argument coming in month two."],
      ["What I said", "“This will not do what you want. Here is what will.”", "They went elsewhere. Some of them do. The ones who stay are the ones who were listening."],
    ],
    c: ["Say the hard thing before the invoice.", "Clients can hear it on day one. They cannot hear it in month three."],
    art: "none",
  },
  {
    k: "stopped-calling-myself", e: "Identity", h: "I stopped calling myself a web designer.",
    p: [
      ["Why", "“Web designer” invites a conversation about colours.", "The work I actually do is deciding what the page says, in what order, and what happens after the click."],
      ["What I call it now", "A studio that fixes clarity, then builds the thing.", "Same skills. Different door. Better clients."],
    ],
    c: ["Check the words you use about your own work.", "They set the price before the first meeting does."],
    art: "quote",
  },
  {
    k: "pricing-message", e: "A message that changed things", h: "One message changed how I price everything.",
    p: [
      ["The message", "A client asked: “What does it cost, and what do I get?”", "I sent a paragraph of maybes. They replied: “That is three answers. Pick one.”"],
      ["What I do now", "One range, one list of what is included, one next step.", "Nothing else. It reads as confidence, and it takes ten minutes to write."],
    ],
    c: ["Write your answer to those two questions.", "If it takes more than four lines, cut it."],
    art: "browser",
  },
  {
    k: "cost-a-client", e: "My mistake", h: "A mistake of mine cost a client money.",
    p: [
      ["What I did", "I launched a page without testing the form on mobile.", "It looked perfect on my laptop. On a phone, the button sat under the keyboard and nobody could press it."],
      ["What I changed", "Every launch now ends with a phone, on data, in daylight.", "Ten minutes. It is the cheapest insurance I have."],
    ],
    c: ["Test on a real phone before you tell anyone it is live.", "Not the emulator. The phone in your hand."],
    art: "phone",
  },
  {
    k: "two-am-rebuild", e: "The night shift", h: "I rebuilt a whole page at 2am. It was my fault.",
    p: [
      ["Why", "I had designed for a client I had never listened to properly.", "The brief was in my head, not in writing, and my memory had improved it."],
      ["The rule since", "No build without a written brief the client has read back.", "One page, five lines, agreed before design. It has saved more than one 2am."],
    ],
    c: ["Write the brief back to the client in your own words.", "If they correct you, you have just saved a week."],
    art: "clock",
  },
  {
    k: "charge-first", e: "Money", h: "A client taught me to charge before I build.",
    p: [
      ["What happened", "I built first and invoiced after, because I wanted to be trusted.", "Twice, the work was delivered and the conversation about money started from zero."],
      ["What I do now", "Half up front, half at handover, written down before the first file opens.", "Nobody has ever refused. Some people have negotiated. Both are fine."],
    ],
    c: ["Put the payment terms in the first email.", "Not the last. It is not rude, it is clarity."],
    art: "quote",
  },
  {
    k: "fired-myself", e: "A hard call", h: "I fired myself from a job I was bad at.",
    p: [
      ["The job", "A retainer doing social media for a business I did not understand.", "I posted on time, hit the numbers, and knew none of it was working."],
      ["What I did", "Told them, refunded the last month, and recommended someone better.", "They are still a client today, on the part I am actually good at."],
    ],
    c: ["Name the part of the work you are worst at.", "Then stop selling it."],
    art: "none",
  },
];

export const slot4 = [
  {
    k: "homepage-rewrite", e: "The work", h: "Same business. Same offer. One rewritten homepage.",
    shot: { img: "client/public/shots/clear-homepage-rewrite.jpg", label: "Homepage rewrite — concept build", zoom: 1.25 },
    p: [
      ["What was wrong", "The old page opened with the company name and a stock photo.", "It took nine lines to find out what they sell."],
      ["What we did", "One promise, one price range, one button.", "Then we deleted everything that did not support those three."],
    ],
    c: ["Read your first three lines out loud.", "If they do not name the customer and the result, rewrite them tonight."],
    art: "none",
  },
  {
    k: "landing-two-versions", e: "The work", h: "One brief. Two landing pages. One clear winner.",
    shot: { img: "client/public/shots/good-form-funnel.jpg", label: "Landing page — concept build", zoom: 1.25 },
    p: [
      ["Version A", "Everything we knew, in order of importance to us.", "Nine sections, four calls to action, a form with seven fields."],
      ["Version B", "Everything the buyer needs, in order of their questions.", "Three sections, one button, WhatsApp instead of a form. Version B is the one that converts."],
    ],
    c: ["Build the small version first.", "You can always add a section. You can rarely remove one from a page a client has already approved."],
    art: "split",
  },
  {
    k: "social-grid", e: "The work", h: "A grid that finally looks like one business.",
    shot: { img: "client/public/shots/morrow-house-social.jpg", label: "Social grid — concept build", zoom: 1.25 },
    p: [
      ["What was wrong", "Six fonts, four colours, no repeating structure.", "Every post looked like it came from a different company."],
      ["What we did", "One layout, three content types, a fixed palette.", "Now the grid can be read as a menu, and the captions carry the words."],
    ],
    c: ["Pick one layout and repeat it for a month.", "Recognition beats novelty when you are small."],
    art: "none",
  },
  {
    k: "automation-step", e: "The work", h: "One manual step, removed for good.",
    shot: { img: "client/public/shots/vendorreply-order-capture.jpg", label: "Order capture — concept build", zoom: 1.25 },
    p: [
      ["The manual step", "Every order arrived in WhatsApp and was copied into a notebook by hand.", "Two people, twenty minutes a day, and a guaranteed mistake on busy days."],
      ["What we built", "A message template that captures the four things needed to fulfil an order.", "Then it lands in one sheet, in order, with a timestamp."],
    ],
    c: ["Find the step you repeat five times a day.", "That is the one worth automating — not the fancy one."],
    art: "steps",
  },
  {
    k: "report-meeting", e: "The work", h: "They had a 32-page report. Nobody read page four.",
    shot: { img: "client/public/shots/field-notes-report.jpg", label: "Report rebuild — concept build", zoom: 1.4 },
    p: [
      ["What was wrong", "Charts, no summary, and the real question answered on page 29.", "The meeting was a reading, not a decision."],
      ["What we built", "Three pages: what happened, why, what next.", "Four numbers, one reason each, three decisions with a name against each."],
    ],
    c: ["How long is your last report?", "If nobody can quote page one from memory, it is not a report."],
    art: "none",
  },
  {
    k: "same-line", e: "The work", h: "The same sentence, before and after.",
    shot: { img: "client/public/shots/morrow-menu-voice.jpg", label: "Copy rewrite — concept build", zoom: 1.25 },
    p: [
      ["Before", "“We offer a wide range of delicious meals prepared with love.”", "True, forgettable, and impossible to act on."],
      ["After", "“Lunch for 20–200 people in Victoria Island, delivered by 12:30 or it's free.”", "Same kitchen. Now it answers who, where, how many, and what happens if it fails."],
    ],
    c: ["Take one sentence from your page.", "Add who it is for and what happens if it fails."],
    art: "quote",
  },
  {
    k: "three-directions", e: "The work", h: "One brief, three directions, one decision.",
    shot: { img: "client/public/shots/aster-campaign-map.jpg", label: "Campaign map — concept build", zoom: 1.25 },
    p: [
      ["Why three", "One option is a guess. Ten is a delay.", "Three directions, each with a sentence explaining what it is betting on."],
      ["How we choose", "The client picks the bet, not the colour.", "Then the design work is about making that bet visible, which is faster and calmer for everyone."],
    ],
    c: ["Ask for three directions, with reasons.", "Any studio that shows you one option and calls it strategy is guessing."],
    art: "steps",
  },
  {
    k: "menu-phone", e: "The work", h: "A menu rebuilt for a phone, not a laminator.",
    shot: { img: "client/public/shots/sunday-table-preorder.jpg", label: "Menu page — concept build", zoom: 1.25 },
    p: [
      ["What was wrong", "A PDF of a print menu, sideways, in 8pt.", "People pinched, squinted, and asked for the price in the DMs anyway."],
      ["What we did", "One column, price in line with the item, three items marked as the ones to order.", "Pre-orders went up because the page stopped being homework."],
    ],
    c: ["Open your menu on your own phone.", "If you have to zoom, so does everybody else."],
    art: "phone",
  },
  {
    k: "pricing-page", e: "The work", h: "A pricing page that stopped apologising.",
    shot: { img: "client/public/shots/brightline-course.jpg", label: "Pricing page — concept build", zoom: 1.25 },
    p: [
      ["Before", "“Contact us for a bespoke quote.”", "Which means: we will size you up before we tell you anything."],
      ["After", "Three tiers, real numbers, one line on who each is for.", "Enquiries dropped by a third and the ones that arrived were ready to buy."],
    ],
    c: ["Publish a range, even a wide one.", "Fewer, better enquiries is not a loss."],
    art: "list",
  },
  {
    k: "booking-flow", e: "The work", h: "A booking flow with one step fewer.",
    shot: { img: "client/public/shots/bookflow-appointments.jpg", label: "Booking flow — concept build", zoom: 1.25 },
    p: [
      ["The step we removed", "Create an account before you can see the times.", "Nobody wants an account. They want to know if Thursday at 4 is free."],
      ["The result", "See times, pick one, confirm on WhatsApp.", "Three taps, no password, and the front desk stopped taking bookings by phone."],
    ],
    c: ["Count the steps between wanting and booking.", "Delete one. Then delete another."],
    art: "steps",
  },
];

export const slot6 = [
  {
    k: "bigger-website", e: "Unpopular take", h: "You don't need a bigger website. You need a clearer one.",
    p: [
      ["What people buy", "More pages, more sections, more animation.", "And then a visitor stands in a bigger room with no idea what is for sale."],
      ["What works", "One page that answers three questions, quickly.", "Clarity scales. Size only scales confusion."],
    ],
    c: ["Before you add a page, fix a sentence.", "Cheaper, faster, and the only thing that moves enquiries."],
    art: "browser",
  },
  {
    k: "dm-for-price", e: "Unpopular take", h: "'DM for price' is costing you money.",
    p: [
      ["Why", "It asks the customer to be judged before they are quoted.", "Most people would rather leave than be sized up by a stranger."],
      ["The alternative", "A range and what moves it.", "The people who cannot afford you leave early — which is a kindness to both sides."],
    ],
    c: ["Publish a range this week.", "Watch what changes: not the volume of messages, the quality of them."],
    art: "quote",
  },
  {
    k: "redesign-headline", e: "Unpopular take", h: "Most redesigns are headline problems wearing a new coat.",
    p: [
      ["The pattern", "Business pays for a redesign. Traffic stays the same. Nothing changes.", "Because the problem was never the colour. It was that the page never said what it does."],
      ["The test", "Rewrite the headline only. Leave everything else.", "If enquiries move, you just saved yourself a redesign."],
    ],
    c: ["Change one sentence before you change one pixel.", "It costs an hour and answers the question."],
    art: "none",
  },
  {
    k: "logo-not-brand", e: "Unpopular take", h: "Your logo is not your brand.",
    p: [
      ["What brand is", "What people say about you when you are not in the room.", "That is built by what you promise, what you charge and what you refuse."],
      ["What the logo does", "It is a signature on a document.", "A beautiful signature on an empty page is still an empty page."],
    ],
    c: ["Ask three customers what you do.", "Write down their words. That is your brand, and your next headline."],
    art: "quote",
  },
  {
    k: "social-cant-fix-offer", e: "Unpopular take", h: "Social media cannot fix an unclear offer.",
    p: [
      ["The trap", "More posts, more reels, more hashtags.", "Reach goes up, DMs stay flat, and the conclusion is “social doesn't work for us”."],
      ["Where the leak is", "Between the profile and the page.", "If the page does not explain the offer, the post only delivers people to a locked door."],
    ],
    c: ["Fix the page before you buy reach.", "Otherwise you are paying to send people to a dead end."],
    art: "list",
  },
  {
    k: "agency-guessing", e: "Unpopular take", h: "An agency that can't name your problem is guessing.",
    p: [
      ["The tell", "They ask for your logo and start designing.", "No question about who buys, why they buy, or what stops them."],
      ["What to ask them", "“In one sentence, what is wrong with my current page?”", "If the answer is vague, the work will be too."],
    ],
    c: ["Ask that question before you pay a deposit.", "Anywhere. Including us."],
    art: "none",
  },
  {
    k: "posting-daily", e: "Unpopular take", h: "Posting daily won't fix a weak offer.",
    p: [
      ["Why not", "Volume multiplies whatever your message already is.", "Clear message: compounding. Vague message: louder vagueness."],
      ["What to do", "Write the one post that answers how much and how fast.", "Then post that, in different shapes, until it stops working."],
    ],
    c: ["Write your best sales sentence today.", "Then build the week around it."],
    art: "steps",
  },
  {
    k: "professional-not-promise", e: "Unpopular take", h: "'We are professional' is not a promise.",
    p: [
      ["What it means", "Nothing a competitor would not also say.", "It is the noise floor of every pitch deck in the country."],
      ["What a promise looks like", "“A reply within two hours. A price before you ask. Your money back if we miss the date.”", "Specific, checkable, and slightly scary to write."],
    ],
    c: ["Write the promise that would cost you money if you broke it.", "That one is worth putting on the page."],
    art: "quote",
  },
  {
    k: "awards-dont-pay", e: "Unpopular take", h: "Design awards don't pay your rent.",
    p: [
      ["The split", "Work that wins admiration from designers.", "Work that makes a customer pick up the phone. These are often the same, and often not."],
      ["What we choose", "The second one. Every time.", "A page that looks ordinary and sells is worth more to a small business than a beautiful page nobody understands."],
    ],
    c: ["Judge your page by enquiries, not compliments.", "Compliments are free. Enquiries pay."],
    art: "none",
  },
  {
    k: "cheap-expensive", e: "Unpopular take", h: "A cheap website is the expensive option.",
    p: [
      ["The maths", "₦80,000 now. Two rebuilds, a lost season and a year of not being found.", "The cheap version does not include clarity, so you pay for it later in customers who never arrive."],
      ["What to spend on", "Words, photos, and one clear page.", "Not animation. Not a custom cursor. Not a chatbot."],
    ],
    c: ["Ask what is included before you ask what it costs.", "Then ask what happens after launch."],
    art: "split",
  },
];
