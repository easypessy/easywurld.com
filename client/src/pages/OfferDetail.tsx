import { Link, useParams } from "wouter";
import { useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { Seo, Reveal } from "@/components/site/Layout";
import { OFFERS, OFFER_PRICE, RATE, naira, offerBySlug } from "@/data/offers";
import { FaqList, HowItWorks, waLink } from "@/pages/Offers";

export default function OfferDetail() {
  const { slug } = useParams<{ slug: string }>();
  const o = offerBySlug(slug ?? "");
  useEffect(() => {
    if (!o) return;
    const el = document.createElement("script");
    el.type = "application/ld+json"; el.id = "ld-offer";
    el.text = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: o.name, description: o.tagline,
      brand: { "@type": "Brand", name: "Easywurld" },
      offers: { "@type": "Offer", price: OFFER_PRICE, priceCurrency: "NGN" },
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [o]);
  if (!o) return <NotFound />;
  const i = OFFERS.findIndex((x) => x.slug === o.slug);
  const prev = OFFERS[(i + OFFERS.length - 1) % OFFERS.length];
  const next = OFFERS[(i + 1) % OFFERS.length];
  const nn = String(o.n).padStart(2, "0");

  return (
    <>
      <Seo
        title={`${o.name} \u2014 ${naira(OFFER_PRICE)} | Easywurld`}
        description={`${o.tagline} ${naira(OFFER_PRICE)}, delivered on WhatsApp after payment. No guaranteed results.`}
        path={`/offers/${o.slug}`}
        type="product"
        image={`/offers/og/offer-${nn}.png`}
      />
      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="of-crumb"><Link href="/offers" className="textlink">← All offers</Link></p>
            <p className="eyebrow">Offer {nn} · {o.category}</p>
            <h1 style={{ maxWidth: "20ch" }}>{o.name}</h1>
            <p className="lead" style={{ maxWidth: "58ch", marginTop: 18 }}>{o.tagline}</p>
            <div className="of-buy">
              <span className="of-price of-price--lg">{naira(OFFER_PRICE)}</span>
              <a href={waLink(o)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                Message {o.keyword} on WhatsApp
              </a>
              <span className="of-small" style={{ margin: 0 }}>Digital download · paid and delivered on WhatsApp</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap of-cols">
          <Reveal>
            <h2 className="of-h">Who it is for</h2>
            <p>{o.buyer}</p>
            <h2 className="of-h">The problem</h2>
            <p>{o.problem}</p>
            <h2 className="of-h">What you will be able to do</h2>
            <p>{o.outcome}</p>
          </Reveal>
          <Reveal delay={80}>
            <div className="note">
              <p><strong>In short.</strong> {o.sales}</p>
            </div>
            <h2 className="of-h">Benefits</h2>
            <ul className="of-list">{o.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="of-in">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What is inside</p>
            <h2 id="of-in">{o.deliverables.length} {o.deliverables.length === 1 ? "item" : "items"}</h2>
            <ul className="of-deliv">
              {o.deliverables.map((d, k) => (
                <li key={d.name}>
                  <span className="of-deliv-n" aria-hidden="true">{String(k + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{d.name}</h3>
                    <p className="of-fmt">{d.fmt}</p>
                    <p>{d.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="of-how">
        <div className="wrap of-cols">
          <Reveal>
            <p className="eyebrow">How to use it</p>
            <h2 id="of-how" className="of-h2">Start the same day you get it.</h2>
            <ol className="of-ol">{o.how.map((h) => <li key={h}>{h}</li>)}</ol>
            <p>{o.buyNow}</p>
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Honest limits</p>
            <ul className="of-list">
              {o.limits.map((l) => <li key={l}>{l}</li>)}
              <li>Self-serve download. It does not include consulting, custom development or ongoing support.</li>
              <li>No result is guaranteed. Outcomes depend on your business and how consistently you use it.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="of-val">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Value breakdown</p>
            <h2 id="of-val" style={{ maxWidth: "22ch" }}>What is inside, and what it might cost separately.</h2>
            <div className="of-tablewrap" role="region" aria-label="Estimated replacement cost by file" tabIndex={0}>
              <table className="of-table">
                <caption className="sr-only">Estimated replacement cost by file for {o.name}</caption>
                <thead>
                  <tr><th scope="col">Item</th><th scope="col">Format</th><th scope="col" className="r">Estimated hours</th><th scope="col" className="r">Estimated replacement cost</th></tr>
                </thead>
                <tbody>
                  {o.deliverables.map((d) => (
                    <tr key={d.name}><th scope="row">{d.name}</th><td>{d.fmt}</td><td className="r">{d.hours} h</td><td className="r">{naira(d.value)}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><th scope="row" colSpan={2}>Estimated replacement cost</th><td className="r">{o.hours} h</td><td className="r">{naira(o.value)}</td></tr>
                  <tr className="of-yours"><th scope="row" colSpan={3}>Your price</th><td className="r">{naira(OFFER_PRICE)}</td></tr>
                </tfoot>
              </table>
            </div>
            <p className="of-small">
              Estimate: the hours an independent professional might need to research, write and format
              each item, at {naira(RATE)} an hour. It is what it might cost to commission these files
              separately. It is not a previous selling price and not a discount.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="of-after">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">After you buy</p>
            <h2 id="of-after" style={{ maxWidth: "20ch" }}>How you get it.</h2>
            <HowItWorks keyword={o.keyword} />
            <p>
              Related service: if you would rather we do the work for you,{" "}
              <Link href="/services" className="textlink">see our services ({o.related.label})</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="of-faq">
        <div className="wrap-narrow">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 id="of-faq">About this offer</h2>
            <FaqList items={o.faqs} />
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap grid-2">
          <div>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>{naira(OFFER_PRICE)}</p>
            <h2 style={{ color: "var(--paper)", maxWidth: "16ch" }}>{o.name}</h2>
          </div>
          <div>
            <p style={{ color: "#C3D2C8" }}>{o.tagline}</p>
            <a href={waLink(o)} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ marginTop: 10 }}>
              Message {o.keyword} on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <nav className="wrap of-pn" aria-label="Other offers">
        <Link href={`/offers/${prev.slug}`}><small>← Previous</small>{prev.name}</Link>
        <Link href={`/offers/${next.slug}`} style={{ textAlign: "right" }}><small>Next →</small>{next.name}</Link>
      </nav>
    </>
  );
}
