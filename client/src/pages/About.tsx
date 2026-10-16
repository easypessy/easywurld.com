import { Link } from "wouter";
import { projects } from "@/data";
import { Seo, Reveal, WA } from "@/components/site/Layout";

export default function About() {
  return (
    <>
      <Seo
        title="About Easywurld — A small digital studio in Lagos"
        description="One team for the website, the words, the social media and the follow-up."
        path="/about"
      />
      <section style={{ paddingBottom: 20 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">About</p>
            <h1 style={{ maxWidth: "15ch" }}>A small studio that cares about the details.</h1>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap grid-2">
          <Reveal>
            <div>
              <p className="lead">
                Easywurld is a small digital studio in Lagos. We work with small businesses
                that want careful work, without the drama that usually comes with it.
              </p>
              <p>
                We started the studio because we kept seeing the same thing. A business hires
                a designer, a writer, someone for social media, and a developer. Each one does
                good work. But they don't talk to each other. So the business ends up saying
                four different things in four different voices.
              </p>
              <p>
                So we keep the plan, the design, the words and the systems in one place. Not
                because we are better at all four than a specialist would be. But because the
                gaps between them are where small businesses lose the most money.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div>
              <h3>What we are honest about</h3>
              <p>
                We are a young studio. All the work on this site is concept or sample work,
                and every project says so on its card. We have no client logos to show you. We
                have not made up testimonials, and we don't quote sales numbers we can't prove.
              </p>
              <p>
                We would rather you judge the thinking. There are{" "}
                <Link href="/projects" className="textlink">{projects.length} projects</Link> here.
                Each one has a case study that explains the problem, the choice we made, and
                what we would change. That tells you more than a wall of logos.
              </p>
              <h3 style={{ marginTop: 34 }}>What we turn down</h3>
              <p>
                Work that needs a claim we can't back up. Systems that pretend to be a person
                where that matters — health, money, anything with a legal result. And if the
                honest answer is that you don't need us yet, we will say so.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ background: "var(--beige)" }}>
        <div className="wrap">
          <p className="eyebrow">How we work</p>
          <h2 style={{ maxWidth: "20ch" }}>Four steps, in order. Each one ends with something real.</h2>
          <div className="grid-2" style={{ marginTop: 44 }}>
            <div>
              <h3>You talk to the person doing the work</h3>
              <p>
                Nobody passes messages along for us, and no one new takes over after the first
                meeting. The person you talk to first is the person who does the work.
              </p>
              <h3 style={{ marginTop: 28 }}>Everything is handed to you</h3>
              <p>
                Templates, content plans, guides. If you can't run it after we leave, we have
                given you a problem, not a solution.
              </p>
            </div>
            <div>
              <h3>We write things down</h3>
              <p>
                We put the decisions, the scope, the price and what is not included in writing,
                before any work starts. Most arguments in this business are really missing
                paperwork.
              </p>
              <h3 style={{ marginTop: 28 }}>We will tell you to spend less</h3>
              <p>
                If a smaller job fixes the problem, that is what we will suggest. It is a
                smaller bill for us and a better result for you. The second one matters more.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ maxWidth: "20ch", marginInline: "auto" }}>Tell us what you're trying to solve.</h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              Message us on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-ghost">Send a brief</Link>
          </div>
        </div>
      </section>
    </>
  );
}
