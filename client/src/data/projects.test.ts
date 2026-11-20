import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allProjects, CATEGORIES, projects } from "./index";
import { OFFERS } from "./offers";
import { SERVICES_PAGE } from "./content";

const root = path.resolve(import.meta.dirname, "..", "..", "..");

describe("project data", () => {
  it("has no duplicate slugs", () => {
    const slugs = allProjects.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("labels every project as client, concept or sample", () => {
    for (const p of allProjects) {
      expect(["Client Project", "Concept Project", "Sample Project"]).toContain(
        p.status
      );
    }
  });

  it("has no client project yet", () => {
    // The site's footer and About page both promise no client results are
    // claimed. This fails loudly if that changes without the copy changing too.
    expect(projects.every(p => p.status !== "Client Project")).toBe(true);
  });

  it("gives every project the fields a case study renders", () => {
    for (const p of allProjects) {
      for (const key of [
        "title",
        "summary",
        "challenge",
        "approach",
        "result",
        "takeaway",
      ]) {
        expect(
          (p as unknown as Record<string, string>)[key]?.trim().length,
          `${p.slug}.${key}`
        ).toBeGreaterThan(0);
      }
      expect(p.built.length, p.slug).toBeGreaterThan(0);
      expect(p.tags.length, p.slug).toBeGreaterThan(0);
    }
  });
});

describe("services content", () => {
  it("has a detail block for every category", () => {
    for (const c of CATEGORIES) {
      const d = SERVICES_PAGE.detail[c];
      expect(d, c).toBeTruthy();
      expect(d.blurb.trim(), c).not.toBe("");
      expect(d.items.length, c).toBeGreaterThan(0);
      expect(d.deliver.trim(), c).not.toBe("");
    }
  });

  it("has exactly the categories the portfolio uses", () => {
    expect(Object.keys(SERVICES_PAGE.detail).sort()).toEqual(
      [...CATEGORIES].sort()
    );
  });
});

describe("sitemap", () => {
  const xml = readFileSync(
    path.join(root, "client", "public", "sitemap.xml"),
    "utf8"
  );

  it("lists every project and offer", () => {
    for (const p of allProjects)
      expect(xml).toContain(`/projects/${p.slug}</loc>`);
    for (const o of OFFERS) expect(xml).toContain(`/offers/${o.slug}</loc>`);
  });

  it("includes the free-review route", () => {
    expect(xml).toContain("/free-review</loc>");
  });

  it("has no stale lastmod dates", () => {
    const year = new Date().getFullYear();
    for (const m of xml.matchAll(/<lastmod>(\d{4})-\d{2}-\d{2}<\/lastmod>/g)) {
      expect(Number(m[1])).toBe(year);
    }
  });
});

describe("offers", () => {
  it("has no duplicate slugs", () => {
    const slugs = OFFERS.map(o => o.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
