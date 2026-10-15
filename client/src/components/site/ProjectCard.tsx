import { Suspense, lazy } from "react";
import { Link } from "wouter";
import type { Project } from "@/data";

/* All 49 projects currently have photo shots, so the SVG artwork code (~60KB
   source) never renders on first paint. Lazy-load it; the fallback keeps the
   same beige box and aspect ratio (800x500) so layout is unchanged. */
const Artwork = lazy(() => import("./Artwork"));

export default function ProjectCard({ p }: { p: Project }) {
  const w = p.weight ?? 1;
  return (
    <article className={`card ${w === 3 ? "card--w3" : w === 2 ? "card--w2" : ""}`}>
      <Link href={`/projects/${p.slug}`} aria-label={`${p.title} — ${p.category} case study`}>
        <div className="card-media">
          {p.shot ? (
            <img
              src={p.shot}
              alt={`${p.title} — screenshot of the live ${p.industry.toLowerCase()} site`}
              loading="lazy"
              width={1000}
              height={625}
            />
          ) : (
            <Suspense
              fallback={
                <div className="artwork" style={{ aspectRatio: "8 / 5" }} aria-hidden="true" />
              }
            >
              <Artwork project={p} />
            </Suspense>
          )}
          {p.liveUrl && (
            <span className="live-tag">{p.liveUrl.endsWith(".pdf") ? "PDF document" : "Live build"}</span>
          )}
        </div>
        <div className="card-meta">
          <span className="card-cat">{p.category} · {p.industry}</span>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <span className="badge" data-s={p.status} style={{ marginTop: 8 }}>{p.status}</span>
        </div>
      </Link>
    </article>
  );
}
