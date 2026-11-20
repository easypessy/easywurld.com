/**
 * Optional enquiry capture for the contact form.
 *
 * The contact form's primary action is still "open WhatsApp with the answers
 * filled in" — that works for everyone and needs no backend. This endpoint is a
 * best-effort extra: the form also POSTs here so the brief is recorded even if
 * the visitor never sends the WhatsApp message.
 *
 * It stores nothing itself. Set ENQUIRY_WEBHOOK_URL to a webhook you control
 * (a spreadsheet endpoint, n8n, Slack, a CRM) and the enquiry is forwarded
 * there. Without it the endpoint answers 200 with { stored: false } and the
 * site behaves exactly as before.
 *
 * Never put a secret in this file — the URL is read from the environment.
 */

type Req = {
  method?: string;
  body?: Record<string, unknown>;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
};

const EMAILISH = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const b = req.body ?? {};
  const str = (k: string) => String(b[k] ?? "").trim();

  // Honeypot: the field is hidden from people, so anything in it is a bot.
  if (str("company")) return res.status(200).json({ ok: true, stored: false });

  const name = str("name");
  const reply = str("contact");

  if (!name)
    return res.status(422).json({ ok: false, error: "Name is required." });
  if (!reply)
    return res
      .status(422)
      .json({ ok: false, error: "A way to reach you is required." });

  // A reply method that looks like an email must be shaped like one.
  if (
    EMAILISH.test(reply) === false &&
    /@/.test(reply) &&
    !/^[+\d][\d\s()-]{6,}$/.test(reply)
  ) {
    return res
      .status(422)
      .json({ ok: false, error: "That contact detail does not look right." });
  }

  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return res.status(200).json({ ok: true, stored: false });

  const payload = {
    name,
    business: str("business"),
    service: str("service"),
    problem: str("problem"),
    link: str("link"),
    reply,
    page: str("page"),
    sentAt: new Date().toISOString(),
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`webhook responded ${r.status}`);
    return res.status(200).json({ ok: true, stored: true });
  } catch {
    // The WhatsApp path still works; never block the visitor on this.
    return res
      .status(502)
      .json({ ok: false, error: "Could not store the enquiry." });
  }
}
