/* WhatsApp links with a source tag.
 *
 * WHY THIS EXISTS
 * You post across four platforms at high volume. To know which channel and which
 * kind of post actually produces money, every link that leaves the site carries a
 * short code. When the message arrives on WhatsApp, the code arrives with it.
 *
 * The code is read from `?src=` on the landing page, kept for the browser session,
 * and appended to the prefilled WhatsApp message as `[ref: CODE]`.
 *
 *   https://site.com/offers?src=ig-teaching
 *      -> "Hello Easywurld... (₦5,000). Keyword: CLEAR. [ref: ig-teaching]"
 *
 * Use the same vocabulary in marketing/measurement/weekly-tracker.csv.
 */

export const WA = "https://wa.me/2349050690837";

const STORAGE_KEY = "ew_src";

/** Codes are short and printable: lowercase letters, numbers, dash, underscore. */
const clean = (raw: string) => raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);

/** Call once per page load. Stores the first code seen in the session. */
export function captureSource() {
  if (typeof window === "undefined") return;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("src");
    if (fromUrl) {
      const code = clean(fromUrl);
      if (code) window.sessionStorage.setItem(STORAGE_KEY, code);
    }
  } catch {
    /* private mode, disabled storage — attribution is optional, never fatal */
  }
}

/** The source code for this visitor, or null. */
export function currentSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Adds `[ref: CODE]` to the message of a wa.me link, if we have a code. */
export function withSource(href: string): string {
  const code = currentSource();
  if (!code) return href;
  try {
    const url = new URL(href);
    const text = url.searchParams.get("text");
    // Never tag twice, and never tag a bare link with no message.
    if (!text || text.includes("[ref:")) return href;
    url.searchParams.set("text", `${text} [ref: ${code}]`);
    return url.toString();
  } catch {
    return href;
  }
}

/** A wa.me link with a prefilled message, source-tagged. */
export const waMessage = (text: string) =>
  withSource(`${WA}?text=${encodeURIComponent(text)}`);

/**
 * WhatsApp click-to-chat. A bare wa.me link cannot carry text, so when we know the
 * source we add a short default message — otherwise the header and footer buttons
 * would lose the code and every "Start a project" tap would look like direct traffic.
 * With no code, the link stays exactly as it was: an empty thread.
 */
export const waOpen = () => {
  const code = currentSource();
  if (!code) return WA;
  return waMessage("Hello Easywurld, I would like to talk about a project.");
};
