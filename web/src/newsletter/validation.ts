import "server-only";

// Pragmatic address check. Real validation is the double opt-in email itself.
const EMAIL = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (/[\r\n]/.test(email)) return null; // header injection
  return EMAIL.test(email) ? email : null;
}
