// Applies db/schema.sql. Usage: npm run db:migrate  (needs POSTGRES_URL_NON_POOLING or POSTGRES_URL)
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
if (!url) {
  console.error("Set POSTGRES_URL_NON_POOLING (or POSTGRES_URL), e.g. via `vercel env pull`.");
  process.exit(1);
}

const sql = postgres(url, {
  ssl: process.env.POSTGRES_SSL === "disable" ? false : "require",
  max: 1,
  prepare: false,
});
try {
  await sql.unsafe(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const rows = await sql`
    select c.relname as table, c.relrowsecurity as rls
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname in ('subscribers', 'post_notifications', 'rate_limits')
    order by 1`;
  console.table(rows);
  if (rows.some((r) => !r.rls)) throw new Error("Row Level Security is not enabled on every table");
  console.log("Schema applied; RLS enabled on all newsletter tables.");
} finally {
  await sql.end();
}
