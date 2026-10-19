import "server-only";
import { Resend } from "resend";
import type { Locale } from "@/i18n/config";
import { absoluteUrl, localePath } from "@/lib/site";
import { env, isProduction, requireEnv } from "./config";
import { emailCopy } from "./email-copy";
import { sha256, signUnsubscribeToken } from "./tokens";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

let resend: Resend | undefined;
const client = () => (resend ??= new Resend(requireEnv("RESEND_API_KEY")));

const from = () => {
  const value = env("NEWSLETTER_FROM");
  if (value) return value;
  if (isProduction()) throw new Error("NEWSLETTER_FROM is not set");
  return "Gato Mago <onboarding@resend.dev>";
};
const replyTo = () => env("NEWSLETTER_REPLY_TO");

/** Outside production, with no API key, emails are printed instead of sent so the flow can be tested. */
const canSend = () => Boolean(env("RESEND_API_KEY"));
function devOnlyLog(label: string, details: Record<string, string>) {
  if (isProduction()) throw new Error("RESEND_API_KEY is not set");
  console.info(`[newsletter:dev] ${label}`, details);
}

const shell = (lang: Locale, preheader: string, inner: string, footer: string) => `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<meta name="color-scheme" content="light"><title>Gato Mago</title></head>
<body style="margin:0;background:#f4efe3;font-family:Georgia,'Times New Roman',serif;color:#14161d">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe3"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d9cfb8;border-radius:14px">
<tr><td style="padding:28px 32px 8px;font-size:22px;letter-spacing:.04em;color:#14161d"><strong>Gato Mago</strong></td></tr>
<tr><td style="padding:8px 32px 28px;font-size:17px;line-height:1.6">${inner}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e8dfc8;font-size:13px;line-height:1.5;color:#5b564a">${footer}</td></tr>
</table></td></tr></table></body></html>`;

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${esc(href)}" style="display:inline-block;background:#14161d;color:#f3d58f;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold">${esc(label)}</a></p>`;

const postalAddress = () => env("NEWSLETTER_POSTAL_ADDRESS");

export async function sendConfirmationEmail(to: string, lang: Locale, confirmUrl: string) {
  const c = emailCopy[lang].confirm;
  const html = shell(
    lang,
    c.preheader,
    `<h1 style="font-size:24px;margin:0 0 12px">${esc(c.heading)}</h1><p>${esc(c.body)}</p>${button(confirmUrl, c.button)}<p style="font-size:14px;color:#5b564a">${esc(c.expires)}</p>`,
    `${esc(c.ignore)}`,
  );
  const text = `${c.heading}\n\n${c.body}\n\n${confirmUrl}\n\n${c.expires}\n${c.ignore}\n`;

  if (!canSend()) return devOnlyLog("confirmation email", { to, confirmUrl });
  const { error } = await client().emails.send({
    from: from(),
    to,
    replyTo: replyTo(),
    subject: c.subject,
    html,
    text,
  });
  if (error) throw new Error(`Resend: ${error.name}`);
}

export type BroadcastRecipient = { id: string; email: string };
export type BroadcastPost = { title: string; excerpt: string | null; url: string };

export function buildBroadcast(lang: Locale, post: BroadcastPost, recipient: BroadcastRecipient) {
  const c = emailCopy[lang].broadcast;
  const token = signUnsubscribeToken(recipient.id);
  const unsubscribePage = absoluteUrl(`${localePath(lang)}/newsletter/unsubscribe?token=${token}`);
  const oneClick = absoluteUrl(`/api/newsletter/unsubscribe?token=${token}&lang=${lang}`);
  const privacy = absoluteUrl(`${localePath(lang)}/privacy`);
  const address = postalAddress();

  const html = shell(
    lang,
    post.excerpt ?? post.title,
    `<h1 style="font-size:26px;line-height:1.2;margin:0 0 12px">${esc(post.title)}</h1>${post.excerpt ? `<p>${esc(post.excerpt)}</p>` : ""}${button(post.url, c.button)}`,
    `${esc(c.why)}<br><a href="${esc(unsubscribePage)}" style="color:#5b564a">${esc(c.unsubscribe)}</a> · <a href="${esc(privacy)}" style="color:#5b564a">${esc(c.privacy)}</a>${address ? `<br>${esc(address)}` : ""}`,
  );
  const text = `${post.title}\n\n${post.excerpt ? `${post.excerpt}\n\n` : ""}${post.url}\n\n--\n${c.why}\n${c.unsubscribe}: ${unsubscribePage}\n${c.privacy}: ${privacy}${address ? `\n${address}` : ""}\n`;

  return {
    from: from(),
    to: recipient.email,
    replyTo: replyTo(),
    subject: `${c.subjectPrefix} ${post.title}`,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${oneClick}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends up to 100 individually addressed emails. Resend rejects a whole batch if one address is
 * invalid, so on failure each message is retried on its own and only the bad ones are dropped.
 * The idempotency key includes the recipient set, so a retry with the same people never doubles up.
 */
export async function sendBroadcastBatch(
  lang: Locale,
  post: BroadcastPost,
  recipients: BroadcastRecipient[],
  idempotencyKey: string,
): Promise<{ sent: number; failed: number }> {
  const emails = recipients.map((r) => buildBroadcast(lang, post, r));
  if (!canSend()) {
    devOnlyLog("broadcast batch", { count: String(emails.length), subject: emails[0]?.subject ?? "" });
    return { sent: emails.length, failed: 0 };
  }

  const key = `${idempotencyKey}-${sha256(recipients.map((r) => r.id).join(",")).slice(0, 12)}`;
  const { error } = await client().batch.send(emails, { idempotencyKey: key });
  if (!error) return { sent: emails.length, failed: 0 };

  let sent = 0;
  let failed = 0;
  for (const email of emails) {
    const result = await client().emails.send(email, {
      idempotencyKey: `${key}-${sha256(String(email.to)).slice(0, 10)}`,
    });
    if (result.error) failed++;
    else sent++;
    await pause(550); // stay under Resend's default 2 requests per second
  }
  console.warn(`[newsletter] batch ${key} fell back to single sends: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}
