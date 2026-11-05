import crypto from "node:crypto";
import type { Request } from "express";
import { config } from "../config.ts";
import { getSetting } from "../db/db.ts";

/**
 * Payment verification. A payment is only treated as real when a signature
 * verifies over the raw body (or the provider's static hash matches) AND the
 * transaction is successful. Nothing is activated on an unverified notification.
 */

export interface NormalisedPayment {
  provider: string;
  reference: string;
  amountMinor: number;
  currency: string;
  status: "paid" | "failed" | "ignored";
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  serviceKey?: string;
  offerSlug?: string;
  serviceName?: string;
  verifiedVia: string;
  raw: unknown;
  reason?: string;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function verifyPaystack(raw: Buffer, signature: string | undefined): boolean {
  if (!config.payments.paystackSecret || !signature) return false;
  const expected = crypto.createHmac("sha512", config.payments.paystackSecret).update(raw).digest("hex");
  return safeEqual(expected, signature);
}

export function verifyFlutterwave(header: string | undefined): boolean {
  if (!config.payments.flutterwaveHash || !header) return false;
  return safeEqual(config.payments.flutterwaveHash, header);
}

export function verifyStripe(raw: Buffer, header: string | undefined): boolean {
  if (!config.payments.stripeSecret || !header) return false;
  // Stripe format: t=<timestamp>,v1=<signature>
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  if (!parts.t || !parts.v1) return false;
  const expected = crypto
    .createHmac("sha256", config.payments.stripeSecret)
    .update(`${parts.t}.${raw.toString("utf8")}`)
    .digest("hex");
  return safeEqual(expected, parts.v1);
}

export function verifyGeneric(raw: Buffer, header: string | undefined): boolean {
  const secret = config.payments.genericSecret;
  if (!secret || !header) return false;
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const provided = header.replace(/^sha256=/, "");
  return safeEqual(expected, provided);
}

/** Optional live check that the provider really has this transaction. */
async function paystackLive(reference: string): Promise<{ ok: boolean; reason?: string; amountMinor?: number; currency?: string }> {
  if (!config.payments.paystackSecret || !config.payments.paystackVerify) return { ok: true };
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${config.payments.paystackSecret}` },
    });
    if (!res.ok) return { ok: false, reason: `Paystack verify HTTP ${res.status}` };
    const json = (await res.json()) as { status?: boolean; data?: { status?: string; amount?: number; currency?: string } };
    if (!json.status || json.data?.status !== "success") return { ok: false, reason: "Paystack reports transaction not successful" };
    return { ok: true, amountMinor: json.data?.amount, currency: json.data?.currency };
  } catch (err) {
    return { ok: false, reason: `Paystack verify unreachable: ${err instanceof Error ? err.message : String(err)}` };
  }
}

const minor = (value: unknown): number => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Math.round(n) : 0;
};

export async function interpret(
  provider: string,
  body: any,
): Promise<NormalisedPayment> {
  const base = {
    provider,
    reference: "",
    amountMinor: 0,
    currency: "NGN",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    raw: body,
  };

  if (provider === "paystack") {
    const data = body?.data ?? {};
    const meta = data?.metadata ?? {};
    const isSuccess = body?.event === "charge.success" && data?.status === "success";
    const reference = String(data?.reference ?? "");
    const live = isSuccess && reference ? await paystackLive(reference) : { ok: false as const };
    return {
      ...base,
      reference,
      amountMinor: minor(data?.amount),
      currency: String(data?.currency ?? "NGN"),
      status: isSuccess && live.ok ? "paid" : isSuccess ? "failed" : "ignored",
      buyerName: [data?.customer?.first_name, data?.customer?.last_name].filter(Boolean).join(" ") || String(meta?.name ?? ""),
      buyerEmail: String(data?.customer?.email ?? meta?.email ?? "").toLowerCase(),
      buyerPhone: String(data?.customer?.phone ?? meta?.phone ?? ""),
      serviceKey: meta?.service_key ? String(meta.service_key) : undefined,
      offerSlug: meta?.offer_slug ? String(meta.offer_slug) : undefined,
      serviceName: meta?.service_name ? String(meta.service_name) : undefined,
      verifiedVia: live.ok ? "paystack-signature+api" : "paystack-signature",
      reason: isSuccess && !live.ok ? (live as { reason?: string }).reason : body?.event !== "charge.success" ? `event ${body?.event}` : undefined,
    };
  }

  if (provider === "flutterwave") {
    const data = body?.data ?? body ?? {};
    const status = String(data?.status ?? "").toLowerCase();
    const isSuccess = ["successful", "success", "completed"].includes(status);
    return {
      ...base,
      reference: String(data?.tx_ref ?? data?.reference ?? data?.id ?? ""),
      amountMinor: Math.round(Number(data?.amount ?? 0) * 100),
      currency: String(data?.currency ?? "NGN"),
      status: isSuccess ? "paid" : "ignored",
      buyerName: String(data?.customer?.name ?? ""),
      buyerEmail: String(data?.customer?.email ?? "").toLowerCase(),
      buyerPhone: String(data?.customer?.phone_number ?? ""),
      serviceKey: data?.meta?.service_key,
      offerSlug: data?.meta?.offer_slug,
      verifiedVia: "flutterwave-verif-hash",
      reason: isSuccess ? undefined : `status ${status || "unknown"}`,
    };
  }

  if (provider === "stripe") {
    const object = body?.data?.object ?? {};
    const isSuccess = body?.type === "checkout.session.completed" && (object?.payment_status === "paid" || object?.status === "complete");
    const email = object?.customer_details?.email ?? object?.customer_email ?? "";
    return {
      ...base,
      reference: String(object?.id ?? body?.id ?? ""),
      amountMinor: minor(object?.amount_total ?? object?.amount),
      currency: String(object?.currency ?? "ngn").toUpperCase(),
      status: isSuccess ? "paid" : "ignored",
      buyerName: String(object?.customer_details?.name ?? ""),
      buyerEmail: String(email).toLowerCase(),
      buyerPhone: String(object?.customer_details?.phone ?? ""),
      serviceKey: object?.metadata?.service_key,
      offerSlug: object?.metadata?.offer_slug,
      verifiedVia: "stripe-signature",
      reason: isSuccess ? undefined : `type ${body?.type}`,
    };
  }

  // Generic provider: Easywurld / manual gateway format used by integrations.
  const rawStatus = String(body?.status ?? "").toLowerCase();
  const isSuccess = rawStatus === "paid" || rawStatus === "success" || rawStatus === "completed";
  const isFailure = ["failed", "cancelled", "canceled", "abandoned", "declined"].includes(rawStatus);
  const amount = body?.amount_minor ?? Math.round(Number(body?.amount ?? 0) * 100);
  return {
    ...base,
    reference: String(body?.reference ?? ""),
    amountMinor: minor(amount),
    currency: String(body?.currency ?? "NGN").toUpperCase(),
    status: isSuccess ? "paid" : isFailure ? "failed" : "ignored",
    buyerName: String(body?.customer?.name ?? body?.name ?? ""),
    buyerEmail: String(body?.customer?.email ?? body?.email ?? "").toLowerCase(),
    buyerPhone: String(body?.customer?.phone ?? body?.phone ?? ""),
    serviceKey: body?.service_key,
    offerSlug: body?.offer_slug,
    serviceName: body?.service_name,
    verifiedVia: "hmac-sha256",
    reason: isSuccess ? undefined : `status ${body?.status ?? "unknown"}`,
  };
}

/** Currency + amount gate. Prevents a ₦1 "success" from opening a full project. */
export function paymentAmountProblem(p: NormalisedPayment): string | null {
  if (!p.reference) return "Missing payment reference";
  if (!["NGN", "USD", "GBP", "EUR"].includes(p.currency)) return `Unsupported currency ${p.currency}`;
  const offerPrice = Number(getSetting("offer_price_minor", "500000"));
  const minService = Number(getSetting("min_service_price_minor", "100000"));
  const floor = p.offerSlug ? offerPrice : minService;
  if (p.amountMinor < floor) {
    return `Amount ${(p.amountMinor / 100).toFixed(2)} ${p.currency} is below the ${(floor / 100).toFixed(2)} minimum for this product`;
  }
  return null;
}

export function signatureCheck(provider: string, req: Request): { ok: boolean; why?: string } {
  const raw = req.rawBody ?? Buffer.from("");
  switch (provider) {
    case "paystack":
      if (!config.payments.paystackSecret) return { ok: false, why: "PAYSTACK_SECRET_KEY not configured" };
      return verifyPaystack(raw, req.get("x-paystack-signature"))
        ? { ok: true }
        : { ok: false, why: "Invalid Paystack signature" };
    case "flutterwave":
      if (!config.payments.flutterwaveHash) return { ok: false, why: "FLUTTERWAVE_VERIF_HASH not configured" };
      return verifyFlutterwave(req.get("verif-hash")) ? { ok: true } : { ok: false, why: "Invalid Flutterwave verif-hash" };
    case "stripe":
      if (!config.payments.stripeSecret) return { ok: false, why: "STRIPE_WEBHOOK_SECRET not configured" };
      return verifyStripe(raw, req.get("stripe-signature")) ? { ok: true } : { ok: false, why: "Invalid Stripe signature" };
    case "generic":
      if (!config.payments.genericSecret) return { ok: false, why: "WEBHOOK_SECRET not configured" };
      return verifyGeneric(raw, req.get("x-easywurld-signature")) ? { ok: true } : { ok: false, why: "Invalid signature" };
    default:
      return { ok: false, why: `Unknown provider ${provider}` };
  }
}
