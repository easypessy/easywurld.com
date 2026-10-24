import { Link } from "wouter";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { Seo, Reveal } from "@/components/site/Layout";
import { OFFERS, OFFER_PRICE, TOTAL_VALUE, naira } from "@/data/offers";
import { BUNDLE_PRICE, BUNDLE_SLUG, singleTotal, saving, fileCount } from "@/data/bundle";
import { payLinkFor } from "@/data/payment";
import { waMessage } from "@/lib/wa";
import { HowItWorks, FaqList } from "@/pages/Offers";

const WA_BUNDLE = waMessage(
  `Hello Easywurld, I would like the Complete Bundle — all ${OFFERS.length} packs (${naira(BUNDLE_PRICE)}). Keyword: BUNDLE.`,
);

const WHY = [
  ["One payment instead of nine", `Buying them one at a time costs ${naira(singleTotal)}. The bundle is ${naira(BUNDLE_PRICE)}.`],
  ["Every format included", `PDF, Word and Excel — ${fileCount} editable files across the nine packs.`],
  ["The same thinking as the services", "These are the working documents we use, not recycled articles."],
  ["Editable for your own business", "Rewrite the scripts, add your logo, change the prices. It is yours to use."],
];

const FOR_YOU = [
  "You run a small business and answer your own enquiries.",
  "You want the scripts, templates and spreadsheets, not advice about them.",
  "You would rather buy once than decide nine times.",
  "You are comfortable editing Word and Excel files.",
];

const NOT_FOR_YOU = [
  "You want someone to do the work for you — that is a project, not a download.",
  "You are looking for guaranteed sales, followers or rankings. Nothing here can promise that.",
  "You need software or automation. These are documents, not an app.",
];

const FAQS = [
  {
    q: "Is this the same as buying the nine offers separately?",
    a: `Yes — the same files, in one download, for ${naira(BUNDLE_PRICE)} instead of ${naira(singleTotal)}. Nothing is left out.`,
  },
  {
    q: "How do I get it?",
    a: "Message BUNDLE on WhatsApp (0905 069 0837). We reply with payment details. Once payment is confirmed, the download is sent to you on WhatsApp.",
  },
  {
    q: "What exactly do I receive?",
    a: `${fileCount} files: guides as PDF and editable Word, spreadsheets as Excel, plus the HTML templates where a pack includes them. Every pack keeps its own README so you know where to start.`,
  },
  {
    q: "Can I share it with my team?",
    a: "Use it inside your own business, with as many staff as you like. Please do not resell it or share it publicly.",
  },
  {
    q: "Is there a refund?",
    a: "These are digital files delivered immediately, so they are not refundable once sent. If a file is corrupted or missing, we replace it straight away — message us and we will fix it the same day.",
  },
  {
    q: "What if I only want one pack?",
    a: `Every pack is also sold on its own for ${naira(OFFER_PRICE)}. Start with the one that matches your problem today — the bundle is there for people who want all of it.`,
  },
];

function JsonLd() {
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "ld-bundle";
    el.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Easywurld Complete Bundle",
      description: `All ${OFFERS.length} Easywurld packs — ${fileCount} editable files for small businesses in Nigeria.`,
      brand: { "@type": "Brand", name: "Easywurld" },
      offers: {
        "@type": "Offer",
        price: BUNDLE_PRICE,
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
      },
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
  return null;
}

export default function Bundle() {
  const pay = payLinkFor(BUNDLE_SLUG);

  return (
    <>
      <Seo
        title={`The Complete Bundle — all ${OFFERS.length} packs, ${naira(BUNDLE_PRICE)} | Easywurld`}
        description={`All ${OFFERS.length} Easywurld resource packs in one download: ${fileCount} editable files for small businesses in Nigeria. ${naira(BUNDLE_PRICE)} instead of ${naira(singleTotal)}. Delivered on WhatsApp.`}
        path="/bundle"
        type="product"
        image="/brand/og.png"
      />
      <JsonLd />

      <section style={{ paddingBottom: 30 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">The bundle</p>
            <h1 style={{ maxWidth: "20ch" }}>
              All {OFFERS.length} packs. One download. {naira(BUNDLE_PRICE)}.
            </h1>
            <p className="lead" style={{ maxWidth: "58ch", marginTop: 18 }}>
              Every guide, script, template and spreadsheet we make, in one payment.
              Bought one at a time they cost {naira(singleTotal)}. Together they are{" "}
              {naira(BUNDLE_PRICE)}, so you keep {naira(saving)}.
            </p>
            <div className="of-chips" aria-label="Key facts">
              <span>{fileCount} editable files</span>
              <span>PDF · Word · Excel · HTML</span>
              <span>Save {naira(saving)}</span>
              <span>No guaranteed results</span>
            </div>
            <div className="of-buy">
              <span className="of-price of-price--lg">{naira(BUNDLE_PRICE)}</span>
              {pay && (
                <a href={pay} className="btn btn-solid" target="_blank" rel="noopener noreferrer">
                  Pay {naira(BUNDLE_PRICE)} now
                </a>
              )}
              <a
                href={WA_BUNDLE}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${pay ? "btn-ghost" : "btn-wa"}`}
              >
                Message BUNDLE on WhatsApp
              </a>
              <span className="of-small" style={{ margin: 0 }}>
                Digital download · delivered on WhatsApp
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }} aria-labelledby="b-why">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Why buy it this way</p>
            <h2 id="b-why" style={{ maxWidth: "18ch" }}>The same files, one decision.</h2>
          </Reveal>
          <div className="grid-2" style={{ marginTop: 30 }}>
            {WHY.map(([t, d]) => (
              <Reveal key={t}>
                <div style={{ display: "flex", gap: 12, paddingBlock: 14, borderTop: "1px solid var(--line)" }}>
                  <Check size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 4 }} aria-hidden="true" />
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "var(--t-md)" }}>{t}</h3>
                    <p style={{ margin: 0, fontSize: "var(--t-sm)", color: "var(--ink-2)" }}>{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="b-in">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What is inside</p>
            <h2 id="b-in">All {OFFERS.length} packs, listed.</h2>
            <div className="of-tablewrap" role="region" aria-label="Every pack in the bundle" tabIndex={0}>
              <table className="of-table">
                <caption className="sr-only">Every pack in the bundle, with its WhatsApp keyword</caption>
                <thead>
                  <tr>
                    <th scope="col">Pack</th>
                    <th scope="col">Keyword</th>
                    <th scope="col" className="r">Files</th>
                    <th scope="col" className="r">Est. replacement cost</th>
                  </tr>
                </thead>
                <tbody>
                  {OFFERS.map((o) => (
                    <tr key={o.slug}>
                      <th scope="row"><Link href={`/offers/${o.slug}`}>{o.name}</Link></th>
                      <td><code>{o.keyword}</code></td>
                      <td className="r">{o.deliverables.length}</td>
                      <td className="r">{naira(o.value)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={2}>Estimated replacement cost</th>
                    <td className="r">{fileCount}</td>
                    <td className="r">{naira(TOTAL_VALUE)}</td>
                  </tr>
                  <tr className="of-yours">
                    <th scope="row" colSpan={3}>Bundle price</th>
                    <td className="r">{naira(BUNDLE_PRICE)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="of-small">
              Estimated replacement cost is hours × ₦5,000 an hour: what it might cost to commission
              these files separately. It is not a previous price and not a discount. You pay{" "}
              {naira(BUNDLE_PRICE)} for all {OFFERS.length}.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="b-who">
        <div className="wrap of-cols">
          <Reveal>
            <p className="eyebrow">Buy it if</p>
            <h2 id="b-who" className="of-h2">Who this is for.</h2>
            <ul className="of-list">{FOR_YOU.map((f) => <li key={f}>{f}</li>)}</ul>
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Honest limits</p>
            <h2 className="of-h2">Who it is not for.</h2>
            <ul className="of-list">{NOT_FOR_YOU.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="of-small">
              These are do-it-yourself documents. They do not include consulting, custom work or
              ongoing support. If you want the work done, that is a separate{" "}
              <Link href="/services" className="textlink">project</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }} aria-labelledby="b-how">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How buying works</p>
            <h2 id="b-how" style={{ maxWidth: "20ch" }}>Three steps, all on WhatsApp.</h2>
            <HowItWorks keyword="BUNDLE" />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="b-faq">
        <div className="wrap-narrow">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 id="b-faq">Before you buy</h2>
            <FaqList items={FAQS} />
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--green)", color: "var(--beige)" }}>
        <div className="wrap grid-2">
          <div>
            <p className="eyebrow" style={{ color: "#9FB3A6" }}>{naira(BUNDLE_PRICE)}</p>
            <h2 style={{ color: "var(--paper)", maxWidth: "16ch" }}>
              Every pack we make, in one download.
            </h2>
          </div>
          <div>
            <p style={{ color: "#C3D2C8" }}>
              {fileCount} files. {OFFERS.length} packs. {naira(saving)} less than buying them one at a time.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
              {pay && (
                <a href={pay} className="btn btn-solid" target="_blank" rel="noopener noreferrer">
                  Pay {naira(BUNDLE_PRICE)} now
                </a>
              )}
              <a href={WA_BUNDLE} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                Message BUNDLE on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
