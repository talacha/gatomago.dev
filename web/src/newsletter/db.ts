import "server-only";
import postgres from "postgres";
import { env, requireEnv } from "./config";

let client: ReturnType<typeof postgres> | undefined;

/** Lazily created connection to the Supabase pooler. Parameterised queries only (tagged templates). */
export function db() {
  client ??= postgres(requireEnv("POSTGRES_URL"), {
    // TLS is always on for real databases; POSTGRES_SSL=disable exists only for a throwaway local test DB.
    ssl: env("POSTGRES_SSL") === "disable" ? false : "require",
    max: 3,
    idle_timeout: 20,
    prepare: false, // required behind PgBouncer in transaction mode
  });
  return client;
}
