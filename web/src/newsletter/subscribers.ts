import "server-only";
import type { Locale } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/lib/site";
import {
  CONFIRM_TTL_HOURS,
  CONFIRMATION_COOLDOWN_MINUTES,
  CONSENT_VERSION,
  RATE_LIMITS,
} from "./config";
import { db } from "./db";
import { sendConfirmationEmail } from "./email";
import { allow } from "./rate-limit";
import { randomToken, sha256 } from "./tokens";

export type SubscribeOutcome = "ok" | "rate_limited" | "error";

/**
 * Starts (or restarts) a subscription. The caller always shows the same message for "ok", whether
 * or not the address already existed, so the form cannot be used to discover who is subscribed.
 * Nobody receives newsletters until they click the link in the confirmation email (double opt-in).
 */
export async function requestSubscription(input: {
  email: string;
  lang: Locale;
  clientKey: string;
}): Promise<SubscribeOutcome> {
  const { email, lang, clientKey } = input;

  if (!(await allow(`ip:${clientKey}`, RATE_LIMITS.ipPerHour))) return "rate_limited";

  const sql = db();
  const token = randomToken();
  const tokenHash = sha256(token);

  // Insert, or refresh an existing pending/unsubscribed row. Confirmed rows are left untouched.
  // The cooldown stops anyone using the form to spam a third party's inbox with confirmations.
  const rows = await sql<{ id: string }[]>`
    insert into subscribers
      (email, lang, status, confirm_token_hash, confirm_expires_at, last_confirmation_at,
       consent_version, consented_at)
    values
      (${email}, ${lang}, 'pending', ${tokenHash},
       now() + make_interval(hours => ${CONFIRM_TTL_HOURS}), now(), ${CONSENT_VERSION}, now())
    on conflict (email) do update set
      lang = excluded.lang,
      status = 'pending',
      confirm_token_hash = excluded.confirm_token_hash,
      confirm_expires_at = excluded.confirm_expires_at,
      last_confirmation_at = excluded.last_confirmation_at,
      consent_version = excluded.consent_version,
      consented_at = excluded.consented_at,
      confirmed_at = null,
      unsubscribed_at = null,
      updated_at = now()
    where subscribers.status = 'unsubscribed'
       or (subscribers.status = 'pending'
           and (subscribers.last_confirmation_at is null
                or subscribers.last_confirmation_at
                   < now() - make_interval(mins => ${CONFIRMATION_COOLDOWN_MINUTES})))
    returning id`;

  if (rows.length === 0) return "ok"; // already confirmed, or confirmation recently sent

  const confirmUrl = absoluteUrl(`${localePath(lang)}/newsletter/confirm?token=${token}`);
  try {
    await sendConfirmationEmail(email, lang, confirmUrl);
  } catch (error) {
    console.error("[newsletter] confirmation email failed", error instanceof Error ? error.message : error);
    // The user never got a link, so don't make them wait out the resend cooldown.
    await sql`update subscribers set last_confirmation_at = null where email = ${email}`;
    return "error";
  }
  return "ok";
}

/** Atomic: succeeds only for a live, unused token. Returns the subscriber's language. */
export async function confirmSubscription(token: string): Promise<Locale | null> {
  const [row] = await db()<{ lang: Locale }[]>`
    update subscribers set
      status = 'confirmed',
      confirmed_at = now(),
      confirm_token_hash = null,
      confirm_expires_at = null,
      updated_at = now()
    where confirm_token_hash = ${sha256(token)}
      and status = 'pending'
      and confirm_expires_at > now()
    returning lang`;
  return row?.lang ?? null;
}

/** Withdraws consent. Keeps only the email and timestamps, so the opt-out can be honoured. */
export async function unsubscribe(subscriberId: string): Promise<Locale | null> {
  const [row] = await db()<{ lang: Locale }[]>`
    update subscribers set
      status = 'unsubscribed',
      unsubscribed_at = coalesce(unsubscribed_at, now()),
      confirm_token_hash = null,
      confirm_expires_at = null,
      updated_at = now()
    where id = ${subscriberId}
    returning lang`;
  return row?.lang ?? null;
}

/** Right to erasure (GDPR Art. 17): removes the record entirely. */
export async function eraseSubscriber(subscriberId: string): Promise<Locale | null> {
  const [row] = await db()<{ lang: Locale }[]>`
    delete from subscribers where id = ${subscriberId} returning lang`;
  return row?.lang ?? null;
}

/** Daily housekeeping: drop never-confirmed sign-ups and stale rate-limit counters. */
export async function purgeStaleData(pendingRetentionDays: number) {
  const sql = db();
  const pending = await sql`
    delete from subscribers
    where status = 'pending'
      and coalesce(last_confirmation_at, created_at) < now() - make_interval(days => ${pendingRetentionDays})`;
  const limits = await sql`delete from rate_limits where created_at < now() - interval '1 day'`;
  return { pendingDeleted: pending.count, rateLimitsDeleted: limits.count };
}
