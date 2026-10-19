import "server-only";
import { db } from "./db";
import { hmac } from "./tokens";

/**
 * Fixed-window limiter backed by Postgres. Keys are HMAC-hashed so no raw IP or email is stored.
 * A transaction-scoped advisory lock makes check-then-insert atomic per key.
 * Returns false when the caller is over the limit (and records nothing in that case).
 */
export async function allow(key: string, limit: number, windowSeconds = 3600): Promise<boolean> {
  const hashed = hmac(`ratelimit:${key}`);
  return db().begin(async (sql) => {
    await sql`select pg_advisory_xact_lock(hashtext(${hashed}))`;
    const [row] = await sql<{ count: number }[]>`
      select count(*)::int as count from rate_limits
      where key = ${hashed} and created_at > now() - make_interval(secs => ${windowSeconds})`;
    if (row.count >= limit) return false;
    await sql`insert into rate_limits (key) values (${hashed})`;
    return true;
  });
}
