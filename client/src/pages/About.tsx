import { Link } from "wouter";
import { projects } from "@/data";
import { ABOUT_PAGE, BRAND } from "@/data/content";
import { Seo, Reveal } from "@/components/site/Layout";

const { seo, eyebrow, title, intro, honest, turnDown, how, cta } = ABOUT_PAGE;

export default function About() {
  return (
    <>
      <Seo title={seo.title} description={seo.description} path="/about" />
      <section style={{ paddingBottom: 20 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 style={{ maxWidth: "15ch" }}>{title}</h1>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap grid-2">
          <Reveal>
            <div>
              <p className="lead">{intro[0]}</p>
              {intro.slice(1).map(t => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <h3>{honest.title}</h3>
              {honest.paragraphs.map(t => (
                <p key={t.slice(0, 24)}>{t}</p>
              ))}
              <p>
                We would rather you judge the thinking. There are{" "}
                <Link href="/projects" className="textlink">
                  {projects.length} {honest.projectsLink}
                </Link>{" "}
                here.
                {honest.after}
              </p>
              <h3 style={{ marginTop: 34 }}>{turnDown.title}</h3>
              <p>{turnDown.body}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <p className="eyebrow">{how.eyebrow}</p>
          <h2 style={{ maxWidth: "20ch" }}>{how.title}</h2>
          <div className="grid-2" style={{ marginTop: 44 }}>
            {how.columns.map((col, i) => (
              <div key={i}>
                {col.map(({ title: h, body }) => (
                  <div key={h}>
                    <h3
                      style={h === col[0].title ? undefined : { marginTop: 28 }}
                    >
                      {h}
                    </h3>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ maxWidth: "20ch", marginInline: "auto" }}>
            {cta.title}
          </h2>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 26,
            }}
          >
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              {cta.whatsapp}
            </a>
            <Link href="/contact" className="btn btn-ghost">
              {cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
