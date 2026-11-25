/**
 * Loads the categories, posts and pages in src/content into the database.
 * Safe to re-run: existing rows with the same slug are updated, not duplicated.
 * Note that re-running overwrites edits made in /admin to those seeded posts.
 *
 *   npm run db:seed
 *
 * scripts/prepare-db.ts calls seed() during deploys, but only when the database has no posts.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { categories, seedContent } from "../src/content";
import { sanitizeContent } from "../src/lib/sanitize";

export async function seed(url: string) {
  const pool = /\.neon\.tech|neon\.build/.test(url) ? null : new Pool({ connectionString: url });
  const db: NeonHttpDatabase<typeof schema> = pool
    ? (drizzle(pool, { schema }) as unknown as NeonHttpDatabase<typeof schema>)
    : drizzleNeon(neon(url), { schema });

  for (const c of categories) {
    await db
      .insert(schema.category)
      .values(c)
      .onConflictDoUpdate({ target: schema.category.slug, set: { name: c.name, description: c.description } });
  }

  for (const p of seedContent) {
    const values = {
      slug: p.slug,
      type: p.type,
      status: "published" as const,
      title: p.title,
      excerpt: p.excerpt ?? null,
      seoDescription: p.seoDescription ?? p.excerpt ?? null,
      content: sanitizeContent(p.content.trim()),
      coverImage: p.coverImage ?? null,
      publishedAt: new Date(p.publishedAt),
      updatedAt: new Date(),
    };
    const [row] = await db
      .insert(schema.post)
      .values(values)
      .onConflictDoUpdate({ target: schema.post.slug, set: values })
      .returning({ id: schema.post.id });
    await db.delete(schema.postCategory).where(eq(schema.postCategory.postId, row.id));
    if (p.categories?.length) {
      await db.insert(schema.postCategory).values(p.categories.map((categorySlug) => ({ postId: row.id, categorySlug })));
    }
  }
  console.log(`Seeded ${categories.length} categories and ${seedContent.length} posts/pages.`);
  await pool?.end();
}

// Run directly: `npm run db:seed`
if (process.argv[1]?.endsWith("seed.ts")) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  seed(url).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
