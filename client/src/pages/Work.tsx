import { useEffect, useMemo, useState } from "react";
import { useSearch } from "wouter";
import {
  allProjects,
  clientProjects,
  CATEGORIES,
  countFor,
  type Category,
} from "@/data";
import ProjectCard from "@/components/site/ProjectCard";
import { Seo, Reveal } from "@/components/site/Layout";

type Filter = Category | "All";

export default function Work() {
  const search = useSearch();
  const initial = useMemo<Filter>(() => {
    const c = new URLSearchParams(search).get("c");
    return (CATEGORIES as string[]).includes(c ?? "") ? (c as Category) : "All";
  }, [search]);

  const [filter, setFilter] = useState<Filter>(initial);
  useEffect(() => setFilter(initial), [initial]);

  const shown =
    filter === "All"
      ? allProjects
      : allProjects.filter(p => p.category === filter);
  const shownClients =
    filter === "All"
      ? clientProjects
      : shown.filter(p => p.status === "Client Project");
  const shownSamples = shown.filter(p => p.status !== "Client Project");
  const hasClients = clientProjects.length > 0;

  return (
    <>
      <Seo
        title={`${filter === "All" ? "Portfolio" : filter} — Easywurld`}
        description={`${allProjects.length} projects: web design, landing pages, business systems, social media, marketing plans, copywriting and business documents.`}
        path="/projects"
      />
      <section style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Portfolio · {allProjects.length} projects</p>
            <h1 style={{ maxWidth: "15ch" }}>Projects we made, and why.</h1>
            <p className="lead" style={{ maxWidth: "52ch", marginTop: 20 }}>
              {hasClients
                ? "Client work first, then the concept and sample builds we use to show how we think. Every card says which is which."
                : "Every project here is marked concept or sample. They show how we think, design and build. They are not client work, and we don't pretend they are."}
            </p>
            <p className="kicker" style={{ marginTop: 16 }}>
              {allProjects.filter(p => p.liveUrl).length} of them are live. Open
              a project and click through to the working site.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="wrap">
        <div
          className="filters"
          role="group"
          aria-label="Filter projects by category"
        >
          <button
            type="button"
            aria-pressed={filter === "All"}
            onClick={() => setFilter("All")}
          >
            All<span className="n">{allProjects.length}</span>
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
              <span className="n">{countFor(c)}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="kicker" style={{ marginTop: 18 }}>
          Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
          {filter !== "All" && ` in ${filter}`}
        </p>
      </div>

      {hasClients && (
        <section style={{ paddingTop: 34 }}>
          <div className="wrap">
            <p className="eyebrow">Client work</p>
            <div className="work-grid">
              {shownClients.map(p => (
                <ProjectCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ paddingTop: hasClients ? 20 : 34 }}>
        <div className="wrap">
          {hasClients && <p className="eyebrow">Concept & sample work</p>}
          <div className="work-grid">
            {shownSamples.map(p => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
