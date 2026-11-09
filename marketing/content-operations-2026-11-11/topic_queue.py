"""Unverified editorial topic proposals for Nov 12–30, NOT authored publication copy."""
# date: niche, buyer's concrete question, strategic tension, second instalment series index
DAY_BRIEFS={
 '2026-11-12':('Laundry pickup','Which areas and pickup days are covered?','coverage clarity',7),
 '2026-11-13':('Independent tailor','What does an alteration appointment include?','scope before booking',2),
 '2026-11-14':('Neighbourhood grocer','Are the listed items in stock today?','availability before promotion',9),
 '2026-11-15':('Small event planner','What is included in the starting package?','package boundaries',8),
 '2026-11-16':('After-school tutor','Which ages and levels can apply?','fit before enquiry',5),
 '2026-11-17':('Local furniture maker','How long is a custom order likely to take?','lead-time truth',7),
 '2026-11-18':('Home appliance installer','Does the quote include parts and travel?','quote exclusions',6),
 '2026-11-19':('Independent bookstore','Can a reader reserve a title before visiting?','stock and reservation',4),
 '2026-11-20':('Hair salon','How do appointment changes work?','cancellation clarity',2),
 '2026-11-21':('B2B equipment supplier','What information is needed for a quote?','qualified requests',1),
 '2026-11-22':('Local photography studio','What usage rights come with the images?','rights and handoff',7),
 '2026-11-23':('Coworking space','Can a visitor see the current day-pass rules?','current terms',3),
 '2026-11-24':('Independent print shop','Which file format and proof are needed?','production handoff',6),
 '2026-11-25':('Fabric retailer','How do buyers confirm batch and colour?','product expectation',8),
 '2026-11-26':('Bike repair workshop','Is diagnosis priced separately?','inspection expectations',5),
 '2026-11-27':('Neighbourhood meal prep','What is the ordering cutoff this week?','time-sensitive fulfilment',9),
 '2026-11-28':('Small music school','What happens in a first lesson?','first-step anxiety',4),
 '2026-11-29':('Storage-locker operator','Which items cannot be stored?','use restrictions',3),
 '2026-11-30':('Handmade stationery shop','Can a bulk order be personalized?','custom request scope',7),
}
def topic(day,series):
 niche,question,tension,second=DAY_BRIEFS[day]
 # Headlines are planning prompts, not copy, source claims or audience research.
 prompts={
 1:f'{niche}: diagnose where “{question}” goes unanswered',
 2:f'Teach a decision checklist for {tension}',
 3:f'Qualify the claim that more posts fix {tension}',
 4:f'The shared frustration behind repeated questions about {tension}',
 5:f'Hypothetical first brief for {niche}: resolve {tension}',
 6:f'Explain the G0–G4 handoff using a fictional {niche} enquiry',
 7:f'Illustrative before/after for an answer about {tension}',
 8:f'Break down a useful sentence about {tension}',
 9:f'Bounded human-reviewed FAQ assistance for {niche}',
 10:f'Confirm which actual Easywurld offer, if any, fits {tension}',
 11:f'How Easywurld approaches clarity before promotion for {niche}',
 }
 return prompts[series],second
