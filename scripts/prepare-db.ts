/**
 * Runs before `next build` (see the "build" script in package.json):
 *   1. Applies any pending migrations in ./drizzle, creating the tables on a fresh database.
 *   2. Loads the starter content from src/content, but only if the database has no posts yet,
 *      so edits made in /admin are never overwritten by a deploy.
 *
 * Without DATABASE_URL it does nothing, and the build still succeeds with an empty site.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { seed } from "./seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[prepare-db] DATABASE_URL is not set: skipping migrations and seeding.");
    return;
  }
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("[prepare-db] Migrations are up to date.");
    const { rows } = await pool.query<{ n: number }>("select count(*)::int as n from post");
    if (rows[0].n === 0) {
      console.log("[prepare-db] No posts found: loading starter content.");
      await seed(url);
    } else {
      console.log(`[prepare-db] ${rows[0].n} posts/pages already in the database: not seeding.`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error("[prepare-db] Failed:", e);
  process.exit(1);
});
