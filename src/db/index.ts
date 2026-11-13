import "server-only";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

/**
 * Neon in production (HTTP driver, works on serverless/edge).
 * Any non-Neon URL (e.g. a local Postgres for development) uses node-postgres.
 */
const isNeon = /\.neon\.tech|neon\.build/.test(url);

// Both drivers expose the same query API; type them as one so callers don't branch.
export const db: NeonHttpDatabase<typeof schema> = isNeon
  ? drizzleNeon(neon(url), { schema })
  : (drizzlePg(new Pool({ connectionString: url }), {
      schema,
    }) as unknown as NeonHttpDatabase<typeof schema>);

export { schema };
