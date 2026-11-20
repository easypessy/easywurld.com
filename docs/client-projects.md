# Adding a real client project

The portfolio today is 100% concept and sample work, and the site says so in four
places (every card badge, the case-study disclaimer, the footer, the About page).
That honesty is the point. A real client project is added only when it can be
evidenced — never to make the portfolio look busier.

## Before you add one, all of these must be true

1. **It was real paid work.** Not a pitch, a pro-bono favour, a friend's business
   done for exposure, or something you only designed but never shipped.
2. **The client agreed to be shown.** Name, screenshot, link — whatever you use,
   they know it is public.
3. **You can point at the real thing.** A screenshot of the live site, or the
   live URL itself. A mockup of a client's brand is not evidence.

## How to add it

1. Open `client/src/data/clients.ts`.
2. Add an entry shaped like a `Project` (see `client/src/data/types.ts`), with:
   - `status: "Client Project"`
   - `shot` or `liveUrl` pointing at the real work
   - `result` written only with outcomes you can prove — if nothing was measured,
     say exactly that
   - `year` as a string, e.g. `"2026"`
3. Run `npm test`. It will fail if the slugs collide, if a required field is
   empty, or if the site's "no client results" copy no longer matches reality.
4. Run `npm run sitemap` so the new case study is included.
5. Update the copy that assumes an empty client list:
   - `client/src/pages/Work.tsx` already switches its lead paragraph and adds a
     "Client work" section when `clientProjects` is non-empty.
   - `client/src/pages/CaseStudy.tsx` swaps the concept disclaimer for a
     client-work note automatically.
   - **About** and the **footer** (`client/src/data/content.ts`,
     `client/src/components/site/Layout.tsx`) still say "we have no client logos"
     and "no client results are claimed". Revise those sentences by hand.

## What not to do

- Do not relabel an existing concept or sample as `Client Project`.
- Do not invent a client name, logo, testimonial, traffic figure or sales number.
- Do not add a "results" claim you cannot show a screenshot, a report or a
  client's own words for.
- Do not add a project the client has not approved for public display.

## If you are not sure

Leave it out. A shorter portfolio that is entirely true beats a longer one with
a claim you would have to explain.
