"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { newsletterEnabled } from "@/lib/features";
import { localePath } from "@/lib/site";
import {
  confirmSubscription,
  eraseSubscriber,
  requestSubscription,
  unsubscribe,
} from "./subscribers";
import { looksLikeToken, verifyUnsubscribeToken } from "./tokens";
import { normalizeEmail } from "./validation";

export type SubscribeState = {
  code: "idle" | "ok" | "invalid_email" | "consent_required" | "rate_limited" | "error";
  /** Echoed back on failure so React's post-submit form reset doesn't wipe what was typed. */
  email?: string;
  consent?: boolean;
};

const localeFrom = (value: FormDataEntryValue | null): Locale =>
  typeof value === "string" && isLocale(value) ? value : defaultLocale;

async function clientKey() {
  const h = await headers();
  // On Vercel the platform sets these, overwriting anything the client sent.
  const forwarded = h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function subscribeAction(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  if (!newsletterEnabled()) return { code: "error" };

  // Honeypot: real visitors never see or fill this field. Bots get a fake success.
  if (String(formData.get("website") ?? "").length > 0) return { code: "ok" };

  const typed = String(formData.get("email") ?? "").slice(0, 254);
  const consent = formData.get("consent") === "on";
  const email = normalizeEmail(typed);
  if (!email) return { code: "invalid_email", email: typed, consent };
  // Consent must be a deliberate, affirmative act (GDPR Art. 7, Recital 32): an unticked box.
  if (!consent) return { code: "consent_required", email: typed };

  try {
    const outcome = await requestSubscription({
      email,
      lang: localeFrom(formData.get("lang")),
      clientKey: await clientKey(),
    });
    return outcome === "ok" ? { code: "ok" } : { code: outcome, email: typed, consent };
  } catch (error) {
    console.error("[newsletter] subscribe failed", error instanceof Error ? error.message : error);
    return { code: "error", email: typed, consent };
  }
}

const status = (lang: Locale, result: string) =>
  `${localePath(lang)}/newsletter/status?r=${result}`;

export async function confirmAction(formData: FormData) {
  const token = formData.get("token");
  const fallback = localeFrom(formData.get("lang"));
  if (!looksLikeToken(token)) redirect(status(fallback, "invalid"));

  let lang: Locale | null = null;
  try {
    lang = await confirmSubscription(token);
  } catch (error) {
    console.error("[newsletter] confirm failed", error instanceof Error ? error.message : error);
  }
  redirect(status(lang ?? fallback, lang ? "confirmed" : "invalid"));
}

async function withSubscriber(
  formData: FormData,
  run: (id: string) => Promise<Locale | null>,
  success: string,
) {
  const token = formData.get("token");
  const fallback = localeFrom(formData.get("lang"));
  const id = looksLikeToken(token) ? verifyUnsubscribeToken(token) : null;
  if (!id) redirect(status(fallback, "invalid"));

  let lang: Locale | null = null;
  try {
    lang = await run(id);
  } catch (error) {
    console.error("[newsletter] request failed", error instanceof Error ? error.message : error);
  }
  redirect(status(lang ?? fallback, lang ? success : "invalid"));
}

export async function unsubscribeAction(formData: FormData) {
  await withSubscriber(formData, unsubscribe, "unsubscribed");
}

export async function eraseAction(formData: FormData) {
  await withSubscriber(formData, eraseSubscriber, "deleted");
}
