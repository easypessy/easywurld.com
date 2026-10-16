import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { bySlug, related } from "@/data";
import Artwork from "@/components/site/Artwork";
import ProjectCard from "@/components/site/ProjectCard";
import NotFound from "@/pages/NotFound";
import { Seo, Reveal, WA } from "@/components/site/Layout";

export default function CaseStudy() {
  const [, params] = useRoute("/projects/:slug");
  const p = params?.slug ? bySlug(params.slug) : undefined;
  if (!p) return <NotFound />;
  const rel = related(p, 3);

  return (
    <>
      <Seo
        title={`${p.title} — ${p.category} | Easywurld`}
        description={p.summary}
        path={`/projects/${p.slug}`}
        type="article"
      />

      <section className="cs-hero">
        <div className="wrap">
          <Link href="/projects" className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={14} /> All projects
          </Link>

          <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span className="badge" data-s={p.status}>{p.status}</span>
            <span className="kicker">{p.category}</span>
          </div>

          <h1 style={{ marginTop: 18, maxWidth: "16ch" }}>{p.title}</h1>
          <p className="lead" style={{ maxWidth: "54ch" }}>{p.summary}</p>

          {p.liveUrl && (
            <p style={{ marginTop: 24 }}>
              <a
                className="btn btn-solid"
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.liveUrl.endsWith(".pdf") ? "Open the full document" : "Open the live build"} <ArrowUpRight size={16} />
              </a>
              <span className="kicker" style={{ display: "block", marginTop: 10 }}>
                {p.liveUrl.endsWith(".pdf")
                  ? "Opens the full PDF in a new tab. The real document, every page."
                  : "Opens the working site in a new tab."}
              </span>
            </p>
          )}

          <dl className="cs-facts">
            <div><dt>Industry</dt><dd>{p.industry}</dd></div>
            <div><dt>Service</dt><dd>{p.service}</dd></div>
            <div><dt>Project type</dt><dd>{p.projectType}</dd></div>
            <div><dt>Year</dt><dd>{p.year}</dd></div>
          </dl>
        </div>
      </section>

      <div className="wrap">
        <Reveal>
          <div style={{ border: "1px solid var(--line)" }}>
            {p.shot ? (
              <img
                src={p.shot}
                alt={`${p.title} — screenshot of the live site`}
                decoding="async"
                style={{ display: "block", width: "100%", height: "auto" }}
                width={1000}
                height={625}
              />
            ) : (
              <Artwork project={p} />
            )}
          </div>
          <p className="kicker" style={{ marginTop: 12 }}>
            {p.shot
              ? (p.liveUrl?.endsWith(".pdf")
                  ? "Page one of the document linked above."
                  : "Screenshot of the live build linked above.")
              : "Mockup made for this case study. It is not a photo of a live site."}
          </p>
          {p.liveUrl && (
            <p style={{ marginTop: 20 }}>
              <a className="textlink" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit the live build <ArrowUpRight size={14} />
              </a>
            </p>
          )}
        </Reveal>
      </div>

      <section>
        <div className="wrap cs-body">
          <h2>The problem</h2>
          <div className="cs-block"><p>{p.challenge}</p></div>

          <h2>What we did</h2>
          <div className="cs-block"><p>{p.approach}</p></div>

          <h2>What we built</h2>
          <div className="cs-block">
            <ul className="cs-list">
              {p.built.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>

          <h2>Design direction</h2>
          <div className="cs-block">
            <p>{p.direction}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              {[["Surface", p.visual.bg], ["Ink", p.visual.ink], ["Accent", p.visual.accent], ["Muted", p.visual.muted]]
                .map(([label, hex]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 62, height: 44, background: hex as string,
                      border: "1px solid var(--line)", borderRadius: 2,
                    }} />
                    <div className="kicker" style={{ fontSize: ".6rem", marginTop: 6 }}>{label}</div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: ".6rem", color: "var(--muted)" }}>
                      {(hex as string).toUpperCase()}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <h2>The result</h2>
          <div className="cs-block">
            <p>{p.result}</p>
            <div className="note" style={{ marginTop: 10 }}>
              <p>
                <strong>We are not claiming any results.</strong> This is a {p.status.toLowerCase()},
                so there is no live traffic or sales data to report. Everything above
                describes what we set out to design, not what happened.
              </p>
            </div>
          </div>

          <h2>The main point</h2>
          <div className="cs-block">
            <p className="pull">{p.takeaway}</p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <p className="eyebrow">Related work</p>
          <h2 style={{ maxWidth: "18ch" }}>More in {p.category}</h2>
          <div className="work-grid" style={{ marginTop: 40 }}>
            {rel.map((r) => <ProjectCard key={r.slug} p={{ ...r, weight: 1 }} />)}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ maxWidth: "20ch", marginInline: "auto" }}>
            Working on something similar?
          </h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              Discuss it on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-ghost">Send a brief</Link>
          </div>
        </div>
      </section>
    </>
  );
}
