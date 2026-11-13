import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";

const { post, category, postCategory } = schema;

export const CONTENT_TAG = "content";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date;
  categories: { slug: string; name: string }[];
};

async function attachCategories(
  rows: { id: number; slug: string; title: string; excerpt: string | null; coverImage: string | null; publishedAt: Date }[],
): Promise<PostSummary[]> {
  if (rows.length === 0) return [];
  const links = await db
    .select({ postId: postCategory.postId, slug: category.slug, name: category.name })
    .from(postCategory)
    .innerJoin(category, eq(postCategory.categorySlug, category.slug))
    .where(inArray(postCategory.postId, rows.map((r) => r.id)));
  return rows.map(({ id, ...r }) => ({
    ...r,
    categories: links.filter((l) => l.postId === id).map(({ slug, name }) => ({ slug, name })),
  }));
}

const summaryFields = {
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  coverImage: post.coverImage,
  publishedAt: post.publishedAt,
};

export async function getPublishedPosts(limit?: number): Promise<PostSummary[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const q = db
    .select(summaryFields)
    .from(post)
    .where(and(eq(post.type, "post"), eq(post.status, "published")))
    .orderBy(desc(post.publishedAt));
  return attachCategories(await (limit ? q.limit(limit) : q));
}

export async function getPostsInCategory(slug: string) {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const [cat] = await db.select().from(category).where(eq(category.slug, slug));
  if (!cat) return null;
  const rows = await db
    .select(summaryFields)
    .from(post)
    .innerJoin(postCategory, eq(postCategory.postId, post.id))
    .where(
      and(eq(postCategory.categorySlug, slug), eq(post.type, "post"), eq(post.status, "published")),
    )
    .orderBy(desc(post.publishedAt));
  return { category: cat, posts: await attachCategories(rows) };
}

export async function getCategories() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return db.select().from(category).orderBy(category.name);
}

/** A published post or page by slug, with its categories. */
export async function getPublishedBySlug(slug: string) {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const [row] = await db
    .select()
    .from(post)
    .where(and(eq(post.slug, slug), eq(post.status, "published")));
  if (!row) return null;
  const cats = await db
    .select({ slug: category.slug, name: category.name })
    .from(postCategory)
    .innerJoin(category, eq(postCategory.categorySlug, category.slug))
    .where(eq(postCategory.postId, row.id));
  return { ...row, categories: cats };
}

export async function getAllPublishedSlugs() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return db
    .select({ slug: post.slug, type: post.type, updatedAt: post.updatedAt })
    .from(post)
    .where(eq(post.status, "published"));
}
