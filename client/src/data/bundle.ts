/* The bundle: every pack, one price. Kept apart from the pages that use it so the
   offers page, the bundle page and any future page agree on the same numbers. */
import { OFFERS, OFFER_PRICE } from "@/data/offers";

export const BUNDLE_SLUG = "bundle";
export const BUNDLE_PRICE = 35000;

/** What the nine packs cost one at a time. */
export const singleTotal = OFFERS.length * OFFER_PRICE;

/** What the bundle saves. */
export const saving = singleTotal - BUNDLE_PRICE;

/** How many files the buyer receives. */
export const fileCount = OFFERS.reduce((n, o) => n + o.deliverables.length, 0);
