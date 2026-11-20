import type { Category, Project } from "./types";
import { webDesign } from "./webDesign";
import { landingPages } from "./landingPages";
import { aiAutomation } from "./aiAutomation";
import { socialMedia } from "./socialMedia";
import { digitalMarketing } from "./digitalMarketing";
import { copywriting } from "./copywriting";
import { reports } from "./reports";
import { clientProjects } from "./clients";

export * from "./types";
export * from "./clients";

/** Concept and sample builds. Labelled as such on every card. */
export const projects: Project[] = [
  ...webDesign,
  ...landingPages,
  ...aiAutomation,
  ...socialMedia,
  ...digitalMarketing,
  ...copywriting,
  ...reports,
];

/** Real client work. Empty until there is evidence — see clients.ts. */
export { clientProjects };

/** Everything shown in the portfolio, client work first. */
export const allProjects: Project[] = [...clientProjects, ...projects];

export const bySlug = (slug: string) => allProjects.find(p => p.slug === slug);

export const byCategory = (c: Category | "All") =>
  c === "All" ? allProjects : allProjects.filter(p => p.category === c);

export const countFor = (c: Category | "All") => byCategory(c).length;

/** Related = same category first, then same industry, never itself. */
export function related(p: Project, n = 3): Project[] {
  const same = allProjects.filter(
    x => x.slug !== p.slug && x.category === p.category
  );
  const industry = allProjects.filter(
    x =>
      x.slug !== p.slug &&
      x.category !== p.category &&
      x.industry === p.industry
  );
  return [...same, ...industry].slice(0, n);
}

export const featured = () => projects.filter(p => (p.weight ?? 1) >= 2);
