import "server-only";

/** Bump when the consent wording changes; stored with every consent as evidence (GDPR Art. 7(1)). */
export const CONSENT_VERSION = "2026-10-19";

export const CONFIRM_TTL_HOURS = 48;
export const CONFIRMATION_COOLDOWN_MINUTES = 10;
/** Unconfirmed sign-ups are deleted after this long (data minimisation). */
export const PENDING_RETENTION_DAYS = 7;

// Per-address mail volume is bounded by CONFIRMATION_COOLDOWN_MINUTES rather than a counter, so
// nobody can lock a victim out of subscribing by submitting their address repeatedly.
export const RATE_LIMITS = {
  ipPerHour: 5,
} as const;

export const env = (name: string): string | undefined => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

export function requireEnv(name: string): string {
  const value = env(name);
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const isProduction = () => process.env.NODE_ENV === "production";
