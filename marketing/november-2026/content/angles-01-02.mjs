/**
 * Slots 1 (Diagnose) and 2 (Teach).
 *
 * Compact authoring format, expanded by content/compose.mjs:
 *   e  eyebrow on the hook
 *   h  hook headline (under 10 words, the whole post lives or dies here)
 *   p  two points: [eyebrow, headline, body]
 *   c  the close: [headline, body]
 *   art / arts  slide art (browser, phone, quote, list, split, clock, steps, seal, none)
 *
 * {biz} {cust} {amt} {friction} are filled from the sector record, so the same
 * angle reads differently for a bakery and a clinic.
 */

export const slot1 = [
  {
    k: "silent-loss", e: "The quiet loss", h: "They looked at your page. Then they left.",
    p: [
      ["What happened", "Somebody opened your site at 10pm and closed it in nine seconds.", "Not because you are bad at the work. Because the page never said what you sell, what it costs, or what happens if they message."],
      ["The fix", "Answer three questions above the fold.", "What it is, what it costs, what happens next. One screen. That is the whole brief."],
    ],
    c: ["Open your page tonight and count to ten.", "If you cannot find your own answer in that time, neither can a stranger."],
    art: "browser",
  },
  {
    k: "price-never-saw", e: "The question that ended it", h: "A {cust} asked the price. Your page didn't answer.",
    p: [
      ["What they did instead", "They asked somebody else.", "Not a better {biz} — a clearer one. Somebody who published a range and said what it includes."],
      ["What to publish", "A range and what moves it.", "Not your whole cost structure. “From {amt}, and here is what changes the number.” That single line removes the fear."],
    ],
    c: ["Put one price line on your page this week.", "A range beats silence every single time."],
    art: "quote",
  },
  {
    k: "describes-not-promises", e: "A copy problem", h: "Your page describes your work. It doesn't promise anything.",
    p: [
      ["The difference", "“We provide quality service” describes. “Your car is fixed the same day or you don't pay” promises.", "One is a sentence. The other is a reason to choose you over the {biz} next door."],
      ["Where it goes", "Put the promise under the headline.", "Then keep it. A small promise kept beats a large one implied."],
    ],
    c: ["Write the promise you can actually keep.", "If you cannot keep any promise, that is the real problem — not the design."],
    art: "split",
  },
  {
    k: "whatsapp-catalogue", e: "The hidden business", h: "Your real shopfront is a WhatsApp catalogue.",
    p: [
      ["Why it hurts", "It cannot be searched, saved or shared, and it dies with your phone.", "A customer scrolling at midnight sees nothing unless they already have your number."],
      ["The cheap fix", "One page, the same items, the same prices, one message button.", "You do not need a shop. You need a door that is not locked."],
    ],
    c: ["Screenshot your catalogue. That is your website's content.", "Half the work is already done."],
    art: "phone",
  },
  {
    k: "logo-wall", e: "False proof", h: "A wall of logos is not proof.",
    p: [
      ["What it signals", "“We have clients” is not the question.", "The {cust} is asking whether you can do it for somebody like them, in their situation, at their budget."],
      ["What replaces it", "One before, one after, one sentence of what changed.", "Real, named, specific. Even a small job beats eight grey rectangles."],
    ],
    c: ["Replace the logo wall with one real story.", "If you have no case study yet, do the work for one client at a lower price and write it up."],
    art: "list",
  },
  {
    k: "mobile-data", e: "The eight-second test", h: "Your page is beautiful on wifi. Your {cust} doesn't have wifi.",
    p: [
      ["What they see", "Half the images, no menu, a button that never becomes tappable.", "In Lagos this is not an edge case. It is most of your traffic."],
      ["What to cut", "Three images, one font, no video above the fold.", "Then test it on data, in traffic, with the screen at half brightness."],
    ],
    c: ["Load your own site on mobile data before you buy ads.", "A fast page is not a technical nicety. It is the shop door."],
    art: "phone",
  },
  {
    k: "five-services", e: "Too many doors", h: "Five services on one page means no services.",
    p: [
      ["What the visitor sees", "A menu with no prices, no order and no recommendation.", "So they choose nothing, which is the safest option available."],
      ["What to do", "Lead with one service. Put the rest below it.", "You can still sell all five. Just let one of them be the front door."],
    ],
    c: ["Pick the service that pays your rent.", "Make it the headline. Everything else becomes a link."],
    art: "steps",
  },
  {
    k: "no-face", e: "Trust, quickly", h: "No address, no face, no reason to trust you.",
    p: [
      ["What a stranger checks", "Where you are, who runs it, whether anyone real answers.", "Three questions, thirty seconds. Most {biz} pages fail all three."],
      ["The minimum", "A name, a place, a photo, a number that rings.", "You do not need a brand film. You need evidence that a person is behind this."],
    ],
    c: ["Add the three, today. Name, place, number.", "It takes ten minutes and it is worth more than a redesign."],
    art: "none",
  },
  {
    k: "form-nobody-finishes", e: "The leak at the end", h: "Your form asks for eleven things. Nobody finishes it.",
    p: [
      ["The maths", "Every field is a small exit.", "Name, email, phone, budget, timeline, how you heard about us — by field six, only the desperate are left."],
      ["The version that works", "One field, one button, one promise of a reply.", "Ask the rest in the conversation you were going to have anyway."],
    ],
    c: ["Cut your form to two fields tonight.", "The best form is a WhatsApp button."],
    art: "list",
  },
  {
    k: "yesterdays-offer", e: "Out of date", h: "Your site still sells what you stopped offering in January.",
    p: [
      ["How it happens", "The business moved on. The website did not.", "New service, new price, new photos — all living on Instagram, none on the page that people check before they pay."],
      ["The rhythm", "One page review every quarter.", "Prices, services, photos, the number. Four things. Fifteen minutes."],
    ],
    c: ["Read your own site as if you were a stranger.", "Then update the sentence you would be embarrassed to say out loud."],
    art: "clock",
  },
];

export const slot2 = [
  {
    k: "ten-second-test", e: "Method", h: "The ten-second test, in three questions.",
    p: [
      ["The questions", "What do you sell? What does it cost? What happens if I message?", "Hand your phone to someone who does not know the business. Say nothing. Count to ten."],
      ["What you learn", "Which one they cannot answer.", "That is your next edit, and it is usually the price."],
    ],
    c: ["Run it tonight with one person.", "Ten seconds of honesty is worth a month of redesign ideas."],
    art: "clock",
  },
  {
    k: "headline-three-passes", e: "Copywriting", h: "Rewrite your headline in three passes.",
    p: [
      ["Pass one", "Write what you do, plainly.", "“We bake cakes in Lekki.” Ugly, but true and specific."],
      ["Pass two", "Add who it is for and what changes.", "“Celebration cakes for Lagos offices that need 50 slices by 10am.” Then pass three: cut every word that does not change the meaning."],
    ],
    c: ["Do it once. Not five times.", "Good copy is a decision, not a mood."],
    art: "browser",
  },
  {
    k: "price-inclusions", e: "Pricing copy", h: "A price with no reason reads as expensive.",
    p: [
      ["Add the unit", "Per month, per term, per 5kg, per plot.", "A bare number is a warning. A unit is a category."],
      ["Add the inclusions", "Water, security, books, delivery, revisions.", "Each one removes a question you do not have time to answer. Two inclusions make {amt} read as fair."],
    ],
    c: ["Rewrite one price line today.", "Number, unit, inclusions, next step. Four pieces, one sentence."],
    art: "list",
  },
  {
    k: "one-button", e: "The page's job", h: "Every page needs one button, not five.",
    p: [
      ["Why", "Five options is a decision the visitor did not come to make.", "They came to buy, book, or ask. Pick which one this page is for."],
      ["Where it goes", "Top and bottom, same words.", "“Message CLEAR on WhatsApp” beats “Submit”, “Learn more” and “Contact us” combined."],
    ],
    c: ["Count the buttons on your homepage.", "If there are more than two calls to action, delete until there are two."],
    art: "phone",
  },
  {
    k: "so-what-ladder", e: "Copywriting", h: "The 'so what' ladder: five rungs to a real headline.",
    p: [
      ["Climb it", "“We are a design studio.” So what? “We design websites.” So what? “Your site will be clear enough to sell without you explaining it.”", "Stop when the next answer is a reason to pay."],
      ["The rule", "Write the sentence a customer would repeat to a friend.", "If it is too long to repeat, it is not a headline yet."],
    ],
    c: ["Climb five rungs on your own sentence.", "The fifth one is usually your homepage."],
    art: "steps",
  },
  {
    k: "broadcast", e: "WhatsApp, done properly", h: "A broadcast people actually read has one idea and one link.",
    p: [
      ["The shape", "One line of news, one line of value, one link.", "“New: Saturday delivery to Ajah. ₦2,000 flat. Reply DELIVER.” That is the whole message."],
      ["What kills it", "Three paragraphs, four emojis, no reason to act.", "People do not mind a message. They mind a message that costs them time and gives nothing back."],
    ],
    c: ["Send one broadcast this week with one ask.", "Then check how many replies you get. Replies are the only metric."],
    art: "phone",
  },
  {
    k: "phone-photo", e: "Method", h: "Photograph your product on a phone, in daylight.",
    p: [
      ["The setup", "One window, one white wall, no flash, no filter.", "Put the product at an angle to the light so the shadow falls away from the camera."],
      ["The edit", "Crop close, straighten, raise shadows slightly.", "Then stop. Grainy and honest beats glossy and fake."],
    ],
    c: ["Reshoot three photos tomorrow morning.", "Then replace the worst three on your page. Same day."],
    art: "none",
  },
  {
    k: "three-questions-page", e: "Structure", h: "Three questions every page must answer, in order.",
    p: [
      ["The order matters", "Is this for me? What do I get? What does it cost?", "Answer them in that sequence, one screen each, and the page stops leaking."],
      ["What to delete", "Anything that answers a question nobody asked.", "Mission statements, stock photos of handshakes, five paragraphs about the founder's childhood."],
    ],
    c: ["Print your page and mark which screen answers which question.", "The gaps are your next edit."],
    art: "list",
  },
  {
    k: "service-page-objections", e: "Copywriting", h: "A service page should answer objections before they are spoken.",
    p: [
      ["The list", "How long? What if I don't like it? What if it breaks? Can I pay in two parts?", "Write the answer to each in one line, under the offer."],
      ["Why it works", "An answered objection is a closed tab you never see.", "And it saves you from repeating the same three messages every week."],
    ],
    c: ["Write the four questions you are asked most.", "Put them on the page, in that order."],
    art: "browser",
  },
  {
    k: "price-range", e: "Pricing copy", h: "How to publish a price range without scaring people.",
    p: [
      ["Start high, explain low", "“{amt}. Most projects land in the middle because of X.”", "The range tells people where they are. The reason tells them whether it is fair."],
      ["Add the boundary", "“Below this, we would be guessing — and we would rather say no.”", "A limit reads as confidence, not arrogance, when it comes with a reason."],
    ],
    c: ["Publish the range with one sentence of reasoning.", "Silence is the only wrong answer."],
    art: "quote",
  },
];
