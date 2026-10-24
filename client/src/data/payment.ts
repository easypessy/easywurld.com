/* Payment links.
 *
 * The site currently sends every buyer to WhatsApp and you send payment details by
 * hand. That is the single biggest leak in the funnel: someone who wants to pay at
 * 11pm waits until morning, and some of them never come back.
 *
 * HOW TO TURN PAY BUTTONS ON
 * 1. Create a payment page in your Paystack dashboard (Payment Pages -> New).
 *    It gives you a link shaped like: https://paystack.com/pay/easywurld-bundle
 * 2. Paste each link below. Save and deploy.
 * 3. Any offer with a link shows a "Pay" button. Any offer without one keeps the
 *    WhatsApp button, so nothing looks broken while you set them up.
 *
 * A Paystack payment page costs nothing to create and charges a percentage per
 * successful payment, so it is safe to switch on before you have volume.
 *
 * IMPORTANT: only put links here that you have actually created and tested.
 * Never put a placeholder URL here — a broken pay button loses a customer forever.
 */

export const PAY_LINKS: Record<string, string> = {
  /* All nine offers in one download, ₦35,000. Set this one first — same effort
     for you, seven times the money per sale. */
  bundle: "",

  /* ₦5,000 each. Keys are the offer slugs from client/src/data/offers.ts */
  "chat-to-customer-playbook": "",
  "clear-homepage-blueprint": "",
  "30-day-content-engine": "",
  "one-offer-landing-page-kit": "",
  "lagos-local-visibility-starter": "",
  "clear-message-workbook": "",
  "everyday-ai-prompt-desk": "",
  "proposal-and-report-template-pack": "",
  "website-launch-and-care-handbook": "",
};

/** The link for a slug, or undefined when it has not been set up yet. */
export const payLinkFor = (slug: string): string | undefined => {
  const link = PAY_LINKS[slug];
  return link && link.startsWith("http") ? link : undefined;
};

/** True when at least one real payment link is configured. */
export const paymentsLive = () => Object.values(PAY_LINKS).some((l) => l.startsWith("http"));
