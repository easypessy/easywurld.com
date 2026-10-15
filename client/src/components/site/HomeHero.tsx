import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { WA } from "@/components/site/Layout";

/**
 * Homepage hero — one message, one action, one quiet link.
 * The brand mark already lives in the header, so nothing here repeats it:
 * no wordmark lockup, no floating cards, no decorative scene.
 */
export default function HomeHero() {
  return (
    <section className="home-hero">
      <div className="wrap">
        <p className="eyebrow">Lagos · Web design &amp; SEO</p>
        <h1 className="home-hero-title">
          Websites that bring Lagos customers to you.
        </h1>
        <p className="lead home-hero-lead">
          Clear sites that rank, load fast and turn visitors into enquiries.
        </p>
        <div className="home-hero-actions">
          <a href={WA} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
            Start a project <ArrowUpRight size={17} />
          </a>
          <Link href="/projects" className="textlink">
            Explore our work
          </Link>
        </div>
      </div>
    </section>
  );
}
