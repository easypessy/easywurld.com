import type { Project } from "./types";

/**
 * REAL CLIENT WORK.
 *
 * This list is deliberately empty. Every project on the site today is a concept
 * or sample build, and every card says so — that honesty is load-bearing, so a
 * client project is added here only when it can be evidenced.
 *
 * Before adding an entry, all three must be true:
 *   1. The work was actually done for a paying client.
 *   2. The client has agreed to be shown (name, screenshot or link).
 *   3. `shot` or `liveUrl` points at the real thing — never a mockup.
 *
 * Rules that keep the site honest:
 *   - Set `status: "Client Project"`. Never relabel a concept as client work.
 *   - Fill in `result` only with outcomes you can prove. If there is no
 *     measured result, say so in as many words — the case-study template
 *     already has a disclaimer for concept work, and a client entry must not
 *     quietly drop it.
 *   - Never invent a client name, a logo, a testimonial or a number.
 *
 * See docs/client-projects.md for the full checklist.
 */
export const clientProjects: Project[] = [];
