# Easywurld

Marketing site for Easywurld, a small digital studio in Lagos, Nigeria.
Vite + React 19 + TypeScript + Tailwind CSS 4, client-side routing with
`wouter`, deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script                 | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Vite dev server                                      |
| `npm run build`        | Production build to `dist/public`                    |
| `npm run preview`      | Serve the production build locally                   |
| `npm run check`        | `tsc --noEmit`                                       |
| `npm test`             | Vitest (data + sitemap integrity)                    |
| `npm run sitemap`      | Regenerate `client/public/sitemap.xml` from the data |
| `npm run format`       | Prettier                                             |
| `npm run format:check` | Prettier, no writes (CI)                             |

## Where things live

```
client/
  index.html            shell: meta, JSON-LD, #prerender mount, font preloads
  public/
    fonts/              self-hosted Lora / Inter / JetBrains Mono (woff2)
    brand/  shots/  demo/  offers/  chat/
    robots.txt  sitemap.xml
  src/
    data/
      content.ts        ← every word on the site, and the crawler pre-render
      types.ts          Project / Category / Status
      index.ts          project collections + selectors
      clients.ts        real client work (empty until there is evidence)
      offers.ts         the nine ₦5,000 offers
      *.ts              one file per project category (49 projects)
    pages/              one component per route
    components/site/    Layout (header/footer/SEO), HomeHero, ProjectCard, Artwork
    components/ErrorBoundary.tsx
    contexts/ThemeContext.tsx
api/enquiry.ts          optional enquiry capture (see the file)
scripts/build-sitemap.mjs
```

### Editing copy

**Change words in `client/src/data/content.ts`.** The pages read from it, and so
does the static crawler copy in `index.html` — a Vite plugin
(`easywurld-prerender` in `vite.config.ts`) injects `renderPrerender()` output
into `#prerender` at build and dev time. There is no second copy to keep in sync.

Projects and offers are data too: edit the arrays in `client/src/data/`.

## Adding a real client project

See **[docs/client-projects.md](docs/client-projects.md)**. Short version: add an
entry to `client/src/data/clients.ts` with `status: "Client Project"` and real
evidence (a screenshot or a live URL). Nothing there yet — every project on the
site is labelled concept or sample, and the footer says so.

## Honesty rules (do not break these)

The site's trust model is that **no client, result, testimonial or statistic is
claimed without evidence**. Concretely:

- Every project card carries a `Status` badge: `Client Project`, `Concept
Project` or `Sample Project`. Only 49 concept/sample builds exist.
- Case studies for concept/sample work carry a "we are not claiming any results"
  note, and the demo brands say on the page that they are not real.
- The footer and About page both state that no client results are claimed.
- Do not add a `Client Project` entry without a real screenshot or live URL and
  the client's agreement. `client/src/data/projects.test.ts` fails if a project
  is marked as client work while the site still claims otherwise.

## Deployment

Production is Vercel, building from `main`:

- build command `npm run build`, output `dist/public`
- framework `vite`

Merging to `main` deploys to production. There is no preview gate, so review
before you merge.

### Custom domain

No custom domain is attached yet; canonical, Open Graph, `robots.txt` and
`sitemap.xml` all use `https://website-builder-portfolio.vercel.app`. When a
domain is chosen:

1. Add it in the Vercel dashboard.
2. Set `VITE_SITE_URL=https://your-domain` in the project environment.
3. Run `npm run sitemap` and commit the regenerated `sitemap.xml`.
4. Update the canonical URL and JSON-LD `url`/`logo`/`image` in
   `client/index.html`.

`SITE_URL` in `content.ts` is the single runtime source for the origin.

## Fonts

Self-hosted variable woff2 (latin + latin-ext) in `client/public/fonts`, declared
in `client/src/index.css`. `latin-ext` is included because it carries the naira
sign (U+20A6) used by the offers and prices. No third-party font request.

## Accessibility

Contrast pairs are checked against WCAG 2.2 AA; the WhatsApp button green was
darkened to `#177E43` so its white label reaches 4.5:1. Focus is always visible,
`prefers-reduced-motion` is honoured, and images carry explicit dimensions.
