import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { requireEnv } from "./config";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 256 bits from the OS CSPRNG. Sent by email once, stored only as a hash. */
export const randomToken = () => randomBytes(32).toString("base64url");

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

function secret() {
  const value = requireEnv("NEWSLETTER_SECRET");
  if (value.length < 32) throw new Error("NEWSLETTER_SECRET must be at least 32 characters");
  return value;
}

export const hmac = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Stateless unsubscribe token: `<subscriber id>.<HMAC>`. Nothing extra to store, cannot be guessed. */
export const signUnsubscribeToken = (subscriberId: string) =>
  `${subscriberId}.${hmac(`unsubscribe:${subscriberId}`)}`;

export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [id, signature] = parts;
  if (!UUID.test(id)) return null;
  return safeEqual(signature, hmac(`unsubscribe:${id}`)) ? id : null;
}

/** Shape check only (cheap rejection before touching the database). */
export const looksLikeToken = (value: unknown): value is string =>
  typeof value === "string" && value.length >= 20 && value.length <= 200 && /^[\w.-]+$/.test(value);
