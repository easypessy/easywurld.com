"""Authored 12–13 November 2026 drafts. Entire run remains G1–G4 pending.
11 November is imported from the original 11 November pilot, not fabricated anew.
Every item is an editorial hypothesis or instructional example, not client evidence.
"""
from dataclasses import dataclass

# Format: family, hook, exact six slide lines, authored caption, objective, caveat.
# Visual map is handled by build.py; these are text masters, not exported art.
DAYS = {
'2026-11-12': {
 'niche':'Fictional laundry pickup business',
 'buyer_question':'Which areas and pickup days are covered?',
 'editorial_note':'All laundry operations, availability and policy details below are illustrative; use the real business terms only after checking them.',
 'extra':'S12 is a second EDUCATION carousel about garment-care exclusions and intake consent, a distinct buyer concern from service-area coverage. Chosen on risk/expectation grounds, not a series rotation.',
 'posts': [
 (1,'More laundry enquiries will not fix an unclear pickup area.',[
 'More laundry enquiries will not fix an unclear pickup area.',
 'Illustrative buyer question: “Do you pick up near me?”',
 'The page says “doorstep pickup” but names no current coverage.',
 'The buyer must start a chat just to learn if the service applies.',
 'Audit the page: current areas, pickup days, confirmation route.',
 'Fix the missing answer before asking for more traffic.'
 ],'A fictional laundry page promises doorstep pickup without specifying where or when. The useful diagnosis is not “post more”; it is “let the buyer check eligibility first.” Ask the operator for the current area and day list before publishing any version of it.','Diagnosis','No real laundry business or confirmed area/day is represented.'),
 (2,'A service-area page needs more than a city name.',[
 'A service-area page needs more than a city name.',
 'Start with places you actually serve today—not where you hope to expand.',
 'Add pickup days only when the operation can honour them.',
 'Explain how a buyer confirms an address at the boundary.',
 'If availability changes, give the page an owner and update rule.',
 'Make “Can you collect here?” answerable without a guess.'
 ],'Use this as a writing checklist, not a model service-area policy. A precise address check can be more helpful than a broad city name. Dates, neighbourhoods and boundaries must come from whoever runs the service.','Education','Current zones and pickup timetable unknown.'),
 (3,'Myth: “We deliver everywhere” is the safest headline.',[
 'Myth: “We deliver everywhere” is the safest headline.',
 'The phrase may sound welcoming. It also creates a hard promise.',
 'If the service has boundaries, the promise needs boundaries too.',
 'A vague location claim can send an ineligible buyer into the inbox.',
 'Better: state verified zones and how edge cases are checked.',
 'Verdict: broad language is not a substitute for a real route map.'
 ],'This is a wording principle, not a claim about any courier or laundry service. If your footprint changes, publish a checked list or a reliable address-confirmation step. Never turn an unverified estimate into “everywhere.”','Claim qualification','Do not imply specific delivery coverage.'),
 (4,'“Do you come here?” is a fair question.',[
 '“Do you come here?” is a fair question.',
 'A buyer should not have to decode a vague “citywide” promise.',
 'The owner may be tired of repeating the same answer in DMs.',
 'Both problems come from one missing piece of public context.',
 'Write the coverage answer once. Keep exceptions with a person.',
 'What location question keeps returning to your inbox?'
 ],'The buyer is not a nuisance for asking whether pickup is available. If there is a clear coverage list, publish it; if the location is borderline, route it to a human. Avoid asking for a full address in public replies.','Shared friction','Rhetorical scenario; not a real customer conversation.'),
 (5,'If I took a laundry-pickup brief, I would check the route first.',[
 'If I took a laundry-pickup brief, I would check the route first.',
 'HYPOTHETICAL: enquiries arrive from addresses outside the route.',
 'First ask: who owns today’s area and pickup-day list?',
 'Then compare the published promise with that approved list.',
 'Only after that, design an address-check step and exception path.',
 'First deliverable: an answer buyers can verify before booking.'
 ],'This is a proposed first move for a fictional business, not a report from a client engagement. I would not invent zones, day slots or route capacity to make the creative feel complete. Operations must supply and sign off those facts.','Hypothetical strategy','Illustrative scenario; do not present as a client case.'),
 (6,'A pickup promise should have an owner.',[
 'A pickup promise should have an owner.',
 'LISTEN: record the buyer’s real coverage question.',
 'DIAGNOSE: compare public wording with the operating route.',
 'DECIDE: an owner confirms the exact areas and current days.',
 'CREATE + CHECK: revise copy; test the address edge cases.',
 'DISTRIBUTE only after the owner approves the final promise.'
 ],'This is a proposed editorial handoff, not a claim about an Easywurld client workflow already deployed. A live service promise needs an owner who can verify it. G3/G4 review still checks the exact claim in the exported asset.','Accountable process','No named approver or live route supplied.'),
 (7,'A service-area rewrite should remove the guesswork.',[
 'A service-area rewrite should remove the guesswork.',
 'SAMPLE BEFORE: “We pick up across the city.”',
 'The sample leaves the boundary and pickup day unclear.',
 'SAMPLE AFTER: “Check your area and next available day before booking.”',
 'Replace the sample with a verified list or owned address-check route.',
 'Proof here is a clearer question path—not a claimed sales lift.'
 ],'Before/after is a fictional copy demonstration. The “after” line is not a real booking feature: it requires a staffed confirmation route before use. No customer, deployment or performance number is being represented.','Illustrative demonstration','Do not imply there is a working address-check tool.'),
 (8,'Edit “pickup available” into an answer someone can use.',[
 'Edit “pickup available” into an answer someone can use.',
 'VAGUE: “Convenient laundry pickup near you.”',
 'Missing: where, when, and who confirms exceptions.',
 'USEFUL STRUCTURE: “We collect in [verified areas] on [verified days].”',
 'Add: “For addresses near the boundary, ask [owned contact route].”',
 'Do not publish brackets until the operator has filled and checked them.'
 ],'A copywriting framework should make verification easier, not make invented details sound polished. This example deliberately leaves operational terms in brackets. Ask for the live service-area record before writing the final sentence.','Line-level rewrite','Bracketed terms cannot be posted as a live offer.'),
 (9,'Let automation hold an uncertain address.',[
 'Let automation hold an uncertain address.',
 'INPUT: a buyer asks whether pickup covers an address.',
 'RULE: compare the area against an owner-maintained list.',
 'UNKNOWN: do not guess, promise a day or expose the address.',
 'HUMAN: review boundary cases through an approved private channel.',
 'Test refusals before any assistant speaks for the service.'
 ],'This is a possible workflow sketch, not a deployed bot. Avoid sending private addresses to an unapproved system. Even if the route list is checked, someone must own updates and the exception queue.','Human-reviewed automation','No deployed system, data handling approval or route list.'),
 (10,'What would a coverage-clarity project actually include?',[
 'What would a coverage-clarity project actually include?',
 'Start with the buyer’s question and an owner-approved route list.',
 'Possible scope: page wording, enquiry prompts and an update owner.',
 'Not included by default: a new booking system or route expansion.',
 'Easywurld service availability and terms are NOT VERIFIED.',
 'Do not send this offer draft until scope and destination are approved.'
 ],'Commercial hold: this is a possible scope discussion, not an advertised Easywurld package. Confirm an actual service, deliverables, price if any, fulfilment owner and contact route before turning it into a public offer.','Commercial fit — HOLD','G1 HOLD: current Easywurld offer and fulfilment unverified.'),
 (11,'Clear boundaries are a form of useful marketing.',[
 'Clear boundaries are a form of useful marketing.',
 '“Simplify” can mean one place to check coverage.',
 '“Optimize” can mean naming who updates a changing route.',
 '“Grow” does not require promising a pickup you cannot make.',
 'For this fictional laundry example, clarity comes before promotion.',
 'Simplify. Optimize. Grow.'
 ],'A service promise is useful only if the business can keep it. The laundry scenario is fictional; the brand principles are Easywurld’s stated direction, not evidence of a completed client result.','Brand principle','No client or delivery result asserted.'),
 (2,'Before a garment is collected, what needs agreement?',[
 'Before a garment is collected, what needs agreement?',
 'Different question: care instructions—not service-area coverage.',
 'At intake, identify the item and any visible care label.',
 'State what the service can and cannot accept; let staff decide edge cases.',
 'Record an agreed route for concerns without posting private photos.',
 'Publish only the intake rules your operator can honour.'
 ],'This second education concept is about care expectations, not pickup geography. It is a general decision checklist for a fictional laundry business; no fabric handling method or liability policy is prescribed. Have the real operator and legal/terms owner approve any final rule.','Distinct second education problem','No real intake policy, fabric advice or liability terms verified.'),
 ],
 'stories':[
 ('Engagement','What stops you from trying pickup?\nArea unclear / Day unclear / Care rules unclear / Something else','Question sticker or native poll where available; no fake sticker','Collect themes only. Do not request addresses or customer details.'),
 ('Education','Service-area copy: say where, when and how to check a borderline address. All three need current owner-approved terms.','No interactive element required','Save the three-part checklist.'),
 ('Conversion HOLD','Could a clearer service-area answer save a buyer a chat? We can discuss the question—but no Easywurld package is confirmed here.','No link sticker until actual service/destination verified','Do not publish this commercial frame before G1.'),
 ],
 'company':[
 ('The address test','A buyer should be able to find out if a service applies before handing over their details.','Imagine a laundry pickup page that says “citywide” while the route has boundaries. The line may be short, but the buyer still cannot check eligibility. A useful page names verified coverage, states current pickup days and explains how an edge address is confirmed. The operator—not the writer—must supply those facts. This is a fictional diagnostic, not a claim about a client.','What eligibility question does your page leave open?'),
 ('Who owns changing promises?','A service-area page needs an update owner.','Coverage and pickup days are operational terms. A polished FAQ can become misleading if the route changes and nobody updates it. Before publication, record the person who confirms the list, the source of truth and the review trigger. This is a proposed governance practice, not a claim that a specific company has a particular route.','Who would sign off your public service-area wording?'),
 ('A redline exercise','Here is a copy edit with its assumptions exposed.','SAMPLE BEFORE: “We pick up across the city.” SAMPLE AFTER: “Check your area and next pickup day before booking.” The edit helps only if an actual team can answer and maintain that check. It does not prove a conversion result or create a feature that does not exist. Verify the route and ownership before making a real service promise.','Which assumption would you need to check first?'),
 ('Human-in-the-loop boundary','An address outside the list should not trigger a guess.','In a possible FAQ-assisted workflow, the system reads only an owner-maintained coverage list. A definite match can propose a response for human review; an unclear boundary gets held. Private address details stay out of public comment threads. This is a design sketch, not a deployed Easywurld system.','What question should your workflow refuse to answer automatically?'),
 ('Measure the right question','Count what the buyer had to ask twice.','If a coverage page changes, one useful observation is whether buyers still need to ask “Do you collect here?” That requires actual before/after enquiry records, privacy-safe handling and context. We have none of those for this hypothetical laundry scenario. A tracking plan is not evidence of improved outcomes.','Which recurring question would you review first?'),
 ],
 'personal':[
 ('Where I would begin','I would ask who owns the route before touching the headline.','A public pickup promise is not just a line of copy. If I were drafting for a laundry service, I would ask for a current coverage list, pickup days and an exception owner. Without those, I could suggest a structure but not claim a service area. This is a proposed editorial approach, not a project I have done.','Which operational fact would you verify first?'),
 ('What a short phrase hides','“We serve the city” can hide a lot of decisions.','I prefer a narrow promise someone can keep to a broad promise that makes the buyer guess. For a fictional pickup business, that may mean naming approved areas and offering a staffed boundary check. The exact route is the operator’s decision, not mine.','Where would precision help your page?'),
 ('A useful stop rule','I would rather leave a boundary case unanswered than have a bot promise pickup.','The work is to design a safe handoff: checked list, private enquiry, human review, updated terms. I am describing a proposed guardrail, not an existing system or a personal result. Unknowns should remain visible until somebody can verify them.','What would your assistant be allowed to say “I’m not sure” about?'),
 ],
 },
'2026-11-13': {
 'niche':'Fictional independent alteration studio',
 'buyer_question':'What does an alteration appointment include?',
 'editorial_note':'All tailor service, fitting, timing and booking descriptions below are illustrative and require actual owner verification.',
 'extra':'S12 is a second RELATABLE carousel about collection-date pressure and honest deadline language, separate from the appointment-scope question. Selected for expectation management, not a rotation.',
 'posts':[
 (1,'“Book an alteration” is not enough information.',[
 '“Book an alteration” is not enough information.',
 'ILLUSTRATIVE buyer question: “Will you alter the garment at that visit?”',
 'The page offers “appointments” but does not describe the first step.',
 'An enquiry must now clarify fitting, quote and work separately.',
 'Audit the actual process: what happens first, what may need a return?',
 'Explain the first visit before asking someone to reserve it.'
 ],'This fictional tailor example diagnoses a scope question, not a real business. An appointment, a quote and a finished alteration are different things. The actual studio must confirm what happens at each stage before the page makes any promise.','Appointment-scope diagnosis','No real studio workflow verified.'),
 (2,'Write an appointment description that answers three questions.',[
 'Write an appointment description that answers three questions.',
 'ONE: what should the customer bring, if anything?',
 'TWO: what will be checked or discussed at the first visit?',
 'THREE: when is a quote or next step actually confirmed?',
 'Include what the appointment does NOT guarantee.',
 'Ask the operator to approve every line before it goes live.'
 ],'A first-visit description is a promise about process, not a decorative booking label. Use these questions to interview the actual studio. Do not assume a fitting, on-the-spot quote or completion time without a verified policy.','Practical education','Booking requirements and quote timing unknown.'),
 (3,'Myth: “Same-day” is always the best way to sell an alteration.',[
 'Myth: “Same-day” is always the best way to sell an alteration.',
 'Speed may matter to the buyer, but it is a specific operating claim.',
 'The work, materials and queue can change what is possible.',
 'If timing is not confirmed, a generic speed promise misleads.',
 'Better: explain how an actual completion date is agreed.',
 'Verdict: only advertise a turnaround the studio has verified.'
 ],'This is not a claim that tailoring turnaround is always slow or fast. “Same-day” is a commercial promise, and the studio would need to validate its scope and capacity before using it. A clear decision path is stronger than an unsupported deadline.','Claim qualification','No actual turnaround or materials availability verified.'),
 (4,'You brought the garment. Now what happens?',[
 'You brought the garment. Now what happens?',
 'The customer may expect the work to begin immediately.',
 'The studio may need to inspect fit and discuss options first.',
 'Neither person is unreasonable; the booking label is incomplete.',
 'Name the first step and explain what follows if work is agreed.',
 'What appointment detail do you wish you knew in advance?'
 ],'Expectation gaps can start before the first fitting. In this imagined studio, the fix is not to blame the customer or the maker; it is to say what the appointment is for. Have the operator confirm the real steps.','Shared frustration','Illustrative dialogue, not a customer complaint.'),
 (5,'If I took a tailor brief, I would follow the first visit.',[
 'If I took a tailor brief, I would follow the first visit.',
 'HYPOTHETICAL: a visitor books without knowing what is included.',
 'First ask the maker to describe the actual visit from arrival to exit.',
 'Mark where options, price and timing are confirmed—not assumed.',
 'Rewrite the booking page around those decision points.',
 'Test it with someone who has never used the studio.'
 ],'This is a hypothetical strategy exercise, not a claim of having worked with a tailoring client. I would interview the operator and review the real appointment path before making a booking promise. The page should describe reality rather than invent a more convenient journey.','Hypothetical strategy','No real studio involvement or process verified.'),
 (6,'A booking page cannot approve its own claims.',[
 'A booking page cannot approve its own claims.',
 'LISTEN: capture the question behind “What happens at the visit?”',
 'DIAGNOSE: compare booking copy against the real service sequence.',
 'DECIDE: owner confirms scope, exclusions and quote process.',
 'CREATE + CHECK: write, then test the first-time-reader interpretation.',
 'DISTRIBUTE after rights, accuracy and final visual checks.'
 ],'This is an accountable editorial process: the writer proposes, the studio owner verifies, the approver releases. The example is fictional, and the sequence does not imply that Easywurld has completed this work for a client.','Accountable process','Named studio owner and confirmed terms absent.'),
 (7,'What does “alterations appointment” leave unsaid?',[
 'What does “alterations appointment” leave unsaid?',
 'SAMPLE BEFORE: “Book your alterations appointment.”',
 'A buyer still cannot tell whether it is a fitting or a handoff.',
 'SAMPLE AFTER: “At the visit, we discuss the garment and next step.”',
 'The operator must approve the exact activities and quote timing.',
 'A more explicit sentence is a demonstration, not a measured result.'
 ],'The before/after lines are fictional copy specimens, not screenshots of an actual studio. The proposed after line describes a possible first visit and needs verification before use. No lift, appointment count or client win is claimed.','Sample copy proof','The sample process may not match a real studio.'),
 (8,'Write the booking CTA for the right next step.',[
 'Write the booking CTA for the right next step.',
 'VAGUE: “Book now for your alteration.”',
 'Question: does booking mean consultation, fitting or confirmed work?',
 'STRUCTURE: “Request a [verified visit type] to discuss [scope].”',
 'Add the real decision point for price and completion date.',
 'Remove every bracket before any approved public version.'
 ],'A CTA should not promise finished work when the booking is only an initial discussion. This is a skeleton, not ready-to-publish service copy. Confirm the type of visit, price path, destination and operating availability first.','Line-level CTA edit','Booking flow, service type and terms not confirmed.'),
 (9,'An assistant cannot inspect a garment through a vague DM.',[
 'An assistant cannot inspect a garment through a vague DM.',
 'INPUT: the customer asks for an alteration quote.',
 'RULE: share only owner-approved first-visit information.',
 'STOP: do not guarantee price, fit or completion from a message.',
 'HUMAN: refer garment-specific questions to the maker privately.',
 'Test the stop rule before any proposed reply is deployed.'
 ],'A hypothetical FAQ assistant can explain the process if that process is verified. It should not claim to assess a garment it has not seen or collect unnecessary photos. Nothing here describes a live Easywurld system.','Bounded automation','No deployment, privacy approval or service terms.'),
 (10,'What is the right project when appointments confuse buyers?',[
 'What is the right project when appointments confuse buyers?',
 'First confirm whether the actual issue is copy, process or both.',
 'Possible scope: booking explainer and enquiry-field review.',
 'A new booking platform, fitting or production capacity is NOT assumed.',
 'Easywurld offer terms and fulfilment remain unverified.',
 'HOLD this commercial concept until a real service is confirmed.'
 ],'This is an internal commercial-fit draft, not a currently available Easywurld service offer. A live claim needs verified inclusions, exclusions, responsible team, price if applicable and a working contact destination. Do not publish this frame as-is.','Commercial fit — HOLD','G1 HOLD: Easywurld current offer unverified.'),
 (11,'An honest first step is part of good service.',[
 'An honest first step is part of good service.',
 'Simplify: describe the first visit in plain language.',
 'Optimize: decide who confirms scope, quote and timeframe.',
 'Grow: let the right buyer choose the next step with context.',
 'In this fictional tailor example, process clarity comes first.',
 'Simplify. Optimize. Grow.'
 ],'The brand direction is “Simplify. Optimize. Grow.” The tailoring scenario is hypothetical; it is here to show how the principles could guide a page, not to assert any engagement or result.','Brand principle','No Easywurld service delivery proof implied.'),
 (4,'A deadline question is not pressure to make a promise.',[
 'A deadline question is not pressure to make a promise.',
 'Different problem: collection timing, not the appointment’s scope.',
 '“Can it be ready by Friday?” deserves an honest process answer.',
 'The maker may need to see the garment and current work queue.',
 'Say when a collection date can be confirmed—never invent one.',
 'How do you explain timing without overpromising?'
 ],'A customer with an event date needs clarity; a studio needs time to assess the actual work. This second common-ground post addresses deadline pressure, not what the first appointment includes. There is no verified turnaround in this hypothetical example.','Distinct timing expectation','No actual delivery date or tailoring promise verified.'),
 ],
 'stories':[
 ('Engagement','Before booking a fitting, what would you want to know?\nWhat to bring / Quote timing / Completion timing / Something else','Native poll or question sticker if available; never a drawn button','Reply without garment photos or personal details.'),
 ('Education','An appointment, a quote and completed work are separate steps. Ask the studio to name when each is confirmed.','No interaction required','Save this three-step check.'),
 ('Conversion HOLD','Could a clearer first-visit explanation help a buyer decide? Possible project discussion only; Easywurld offer terms unverified.','No link/contact sticker until destination verified','Hold commercial story before G1 approval.'),
 ],
 'company':[
 ('Name the first visit','A booking button is not an explanation of an appointment.','Consider a fictional alteration studio. “Book an appointment” does not say whether the first visit is a fitting, consultation or work handoff. A better service page explains what the customer needs to bring, what the maker will assess and when a quote or date can be confirmed. The real studio must approve those terms. This is not an account of a client project.','What would a first-time visitor need to know?'),
 ('The truth of turnaround','“Same-day” should be a verified service condition, not a flourish.','If a garment-specific quote or finish date depends on inspection and capacity, public copy should say how that decision is made. That does not mean a studio cannot ever offer quick work. It means the condition, exclusions and availability must be checked before any speed claim is published.','Which timing promise has an owner?'),
 ('A sample edit with a hold','A clearer CTA can still be wrong if the workflow is imaginary.','SAMPLE BEFORE: “Book your alteration now.” SAMPLE AFTER: “Request a [confirmed visit type] to discuss [confirmed scope].” Brackets are deliberate. The maker needs to confirm the real visit type, booking route, quote step and availability before this becomes public copy. There is no claimed conversion result here.','What would you verify before removing the brackets?'),
 ('Scope versus tool','Not every booking problem needs a new booking platform.','If the calendar works but the offer is ambiguous, the first test could be a clearer description of the actual visit. If the workflow itself is broken, copy cannot repair operational gaps. Diagnose which step fails before proposing technology. This is an editorial hypothesis about a fictional studio.','Is the gap in the words or the service path?'),
 ('Useful evidence for the next review','Review what buyers ask after reading the page.','A better first-visit explainer is a hypothesis until buyers use it. Collect real, consented questions; check whether the new wording answers them; note where garment-specific judgement still needs a person. We have no data or measured result from this fictional example.','What question would you look for after the change?'),
 ],
 'personal':[
 ('A booking promise I would test','I would not write “fitting included” before asking the maker.','For a hypothetical studio I would walk through the actual first visit and ask when price and completion are decided. Then I would write the appointment description from that sequence. It is a method I would propose, not an account of an alteration client or result.','Which step would you put on the booking page?'),
 ('The distinction that matters','A request for an appointment is not agreement to every alteration.','I would want a page to leave room for the maker to assess feasibility and for the customer to choose whether to proceed. That is my proposed editorial view, not an assertion about any specific studio’s policies. Clarity protects both sides of the conversation.','Where does your process invite a decision?'),
 ('Why I would hold the promise','I would rather leave a deadline blank than invent Friday.','A finished-by date depends on the actual garment, work queue and maker. I can draft a respectful timing explanation, but only the operator can confirm a service promise. This is not a personal tale of a deadline I delivered; it is a proposed guardrail for copy.','How do you phrase an honest timing answer?'),
 ],
 },
}
