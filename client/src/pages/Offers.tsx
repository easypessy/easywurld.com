import { Link } from "wouter";
import { useEffect } from "react";
import { Seo, Reveal } from "@/components/site/Layout";
import { waMessage } from "@/lib/wa";
import { OFFERS, OFFER_PRICE, RATE, TOTAL_VALUE, naira, type Offer } from "@/data/offers";
import { BUNDLE_PRICE, singleTotal, saving, fileCount } from "@/data/bundle";

export const waLink = (o?: Offer) =>
  o
    ? waMessage(`Hello Easywurld, I would like the ${o.name} (${naira(OFFER_PRICE)}). Keyword: ${o.keyword}.`)
    : waMessage("Hello Easywurld, I have a question about your \u20a65,000 offers.");

const formatsOf = (o: Offer) => {
  const all = o.deliverables.map((d) => d.fmt.toUpperCase()).join(" ");
  return ["PDF", "DOCX", "XLSX", "HTML"].filter((f) => all.includes(f)).join(" · ");
};

const GENERAL_FAQ = [
  {
    q: "What exactly am I buying?",
    a: "A finished set of digital files: guides, templates, scripts and spreadsheets you can edit and use in your own business. Each offer page lists every file and its format.",
  },
  {
    q: "How do I pay and get the files?",
    a: "Message the offer's keyword on WhatsApp. Easywurld replies with payment details. Once the payment is confirmed, the files are sent to you on WhatsApp. There is no online checkout, and nothing is downloadable from this website.",
  },
  {
    q: "Is anything guaranteed?",
    a: "No. These resources give you a clear process and working files. Results depend on your business and on how consistently you use them. We do not promise sales, followers, rankings or traffic.",
  },
  {
    q: "What is the \u201cestimated replacement cost\u201d?",
    a: `It is our own estimate of what it might cost to commission each file separately: the hours a professional might need, at ${naira(RATE)} an hour. It is not a price Easywurld ever charged, and it is not a discount claim. You pay ${naira(OFFER_PRICE)}.`,
  },
  {
    q: "Do the offers include consulting, custom work or support?",
    a: "No. They are self-serve downloads. If you want Easywurld to build or write something for you, that is a separate service. Message us and we will tell you honestly whether we can help.",
  },
  {
    q: "Can I edit and reuse the files?",
    a: "Yes, for your own business. Word, Excel and HTML files are editable. Please do not resell or redistribute the files.",
  },
];

function JsonLd() {
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "ld-offers";
    el.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Easywurld \u20a65,000 offers",
      itemListElement: OFFERS.map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: o.name,
          description: o.tagline,
          brand: { "@type": "Brand", name: "Easywurld" },
          offers: { "@type": "Offer", price: OFFER_PRICE, priceCurrency: "NGN" },
        },
      })),
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
  return null;
}

export function HowItWorks({ keyword }: { keyword?: string }) {
  const steps = [
    ["1", "Message us", keyword ? `Send the word ${keyword} on WhatsApp (0905 069 0837).` : "Send the offer's keyword on WhatsApp (0905 069 0837). The keyword is on every offer."],
    ["2", "Pay", "We reply with payment details. There is no checkout on this website."],
    ["3", "Receive the files", "Once the payment is confirmed, the files are sent to you on WhatsApp, ready to edit and use."],
  ];
  return (
    <ol className="of-steps">
      {steps.map(([n, h, p]) => (
        <li key={n}>
          <span className="of-step-n" aria-hidden="true">{n}</span>
          <h3>{h}</h3>
          <p>{p}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="of-faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function Offers() {
  return (
    <>
      <Seo
        title={`\u20a65,000 Offers \u2014 Templates & Toolkits for Small Businesses | Easywurld`}
        description="Nine practical digital resources for small businesses in Nigeria: WhatsApp sales scripts, homepage blueprint, content plan, landing page kit, local visibility, messaging, AI prompts, proposal templates and a website launch handbook. \u20a65,000 each."
        path="/offers"
        image="/offers/og/offers.png"
      />
      <JsonLd />
      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Offers</p>
            <h1 style={{ maxWidth: "18ch" }}>Nine practical resources. {naira(OFFER_PRICE)} each.</h1>
            <p className="lead" style={{ maxWidth: "56ch", marginTop: 18 }}>
              The same thinking we use in our services, packaged as downloads you can use
              today: scripts, templates, checklists and spreadsheets for small businesses.
              Pay once, edit freely, use them in your own business.
            </p>
            <div className="of-chips" aria-label="Key facts">
              <span>Digital downloads</span>
              <span>Word, Excel, PDF and HTML</span>
              <span>Paid and delivered on WhatsApp</span>
              <span>No guaranteed results</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The bundle is the best-value sale on the site, so it sits above the grid
          rather than at the bottom where nobody scrolls. */}
      <section style={{ paddingTop: 6, paddingBottom: 12 }} aria-labelledby="of-bundle-h">
        <div className="wrap">
          <Reveal>
            <div className="of-bundle">
              <div>
                <p className="of-cat">The bundle · save {naira(saving)}</p>
                <h2 id="of-bundle-h" style={{ margin: "0 0 8px", maxWidth: "22ch" }}>
                  All {OFFERS.length} packs for {naira(BUNDLE_PRICE)}.
                </h2>
                <p style={{ margin: 0, maxWidth: "58ch", fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>
                  {fileCount} editable files. One payment. Buying them one at a time costs{" "}
                  {naira(singleTotal)}, so you keep {naira(saving)}.
                </p>
              </div>
              <div className="of-bundle-cta">
                <span className="of-price">{naira(BUNDLE_PRICE)}</span>
                <Link href="/bundle" className="btn btn-solid">See the bundle</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }} aria-labelledby="of-grid-h">
        <div className="wrap">
          <h2 id="of-grid-h" className="sr-only">All nine offers</h2>
          <ul className="of-grid">
            {OFFERS.map((o, i) => (
              <li key={o.slug} className="of-card">
                <Reveal delay={(i % 3) * 60}>
                  <p className="of-cat">{String(o.n).padStart(2, "0")} · {o.category}</p>
                  <h3><Link href={`/offers/${o.slug}`}>{o.name}</Link></h3>
                  <p className="of-tag">{o.tagline}</p>
                  <p className="of-meta">
                    {o.deliverables.length} {o.deliverables.length === 1 ? "item" : "items"} · {formatsOf(o)}
                  </p>
                  <div className="of-foot">
                    <span className="of-price">{naira(OFFER_PRICE)}</span>
                    <Link href={`/offers/${o.slug}`} className="textlink">View details →</Link>
                  </div>
                  <a href={waLink(o)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost of-wa" aria-label={`Message ${o.keyword} on WhatsApp to get the ${o.name}`}>
                    Message {o.keyword} on WhatsApp
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="of-how-h">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How buying works</p>
            <h2 id="of-how-h" style={{ maxWidth: "20ch" }}>Three steps, all on WhatsApp.</h2>
            <HowItWorks />
            <p className="of-small">We do not publish a delivery time. If payment is confirmed during working hours (Monday to Saturday, 09:00 to 18:00), we will send the files as soon as we can.</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="of-val-h">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Where the value figure comes from</p>
            <h2 id="of-val-h" style={{ maxWidth: "22ch" }}>An estimate, shown in full.</h2>
            <p className="lead" style={{ maxWidth: "62ch", marginTop: 14 }}>
              For every file we estimated the hours an independent professional might need to
              research, write, design and format it, then priced those hours at a conservative{" "}
              {naira(RATE)} an hour. The total across all nine offers is{" "}
              <strong>{naira(TOTAL_VALUE)}</strong>. It is an <em>estimated replacement cost</em>: what it
              might cost to commission everything separately. It is not a price we charged
              before, and it is not a discount. Every offer is {naira(OFFER_PRICE)}. Each offer page
              shows the file-by-file breakdown.
            </p>
            <div className="of-tablewrap" role="region" aria-label="Estimated replacement cost by offer" tabIndex={0}>
              <table className="of-table">
                <caption className="sr-only">Estimated replacement cost compared with the price, by offer</caption>
                <thead>
                  <tr><th scope="col">Offer</th><th scope="col" className="r">Estimated hours</th><th scope="col" className="r">Estimated replacement cost</th><th scope="col" className="r">Your price</th></tr>
                </thead>
                <tbody>
                  {OFFERS.map((o) => (
                    <tr key={o.slug}>
                      <th scope="row"><Link href={`/offers/${o.slug}`}>{o.name}</Link></th>
                      <td className="r">{o.hours} h</td>
                      <td className="r">{naira(o.value)}</td>
                      <td className="r">{naira(OFFER_PRICE)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="of-vs-h">
        <div className="wrap grid-2">
          <Reveal>
            <p className="eyebrow">Offers and services</p>
            <h2 id="of-vs-h" style={{ maxWidth: "16ch" }}>Do it yourself, or work with us.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p>
              The offers are self-serve downloads. They are built from the same areas as our
              <Link href="/services" className="textlink"> services</Link>: strategy, web design, landing pages,
              business systems, social media, copywriting and reports. They do not include
              consulting, custom development or ongoing support.
            </p>
            <p>
              If you would rather have us do the work, message us and we will tell you
              honestly whether it is something we should take on.
            </p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ask a question on WhatsApp</a>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="of-faq-h">
        <div className="wrap-narrow">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 id="of-faq-h">Before you buy</h2>
            <FaqList items={GENERAL_FAQ} />
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap grid-2">
          <div>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>Ready?</p>
            <h2 style={{ color: "var(--paper)", maxWidth: "14ch" }}>Pick one and message us.</h2>
          </div>
          <div>
            <p style={{ color: "#C3D2C8" }}>
              Not sure which one fits? Tell us what you sell and what is slowing you down.
              We will point you to the offer that matches, or tell you honestly if none does.
            </p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ marginTop: 10 }}>
              WhatsApp · 0905 069 0837
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
