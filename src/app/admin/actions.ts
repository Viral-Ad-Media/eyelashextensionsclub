"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db, schema } from "@/db";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";
import { CONTENT_TAG } from "@/lib/posts";
import { sanitizeContent, slugify } from "@/lib/sanitize";

const { post, postCategory } = schema;

function readForm(f: FormData) {
  const title = String(f.get("title") ?? "").trim();
  const slug = slugify(String(f.get("slug") ?? "") || title);
  if (!title || !slug) throw new Error("Title is required.");
  const type = f.get("type") === "page" ? "page" : "post";
  const status = f.get("status") === "published" ? "published" : "draft";
  const cover = String(f.get("coverImage") ?? "").trim();
  if (cover && !/^(\/|https:\/\/)/.test(cover)) throw new Error("Cover image must be a site path or https URL.");
  const date = String(f.get("publishedAt") ?? "");
  return {
    values: {
      title,
      slug,
      type,
      status,
      excerpt: String(f.get("excerpt") ?? "").trim() || null,
      content: sanitizeContent(String(f.get("content") ?? "")),
      coverImage: cover || null,
      seoTitle: String(f.get("seoTitle") ?? "").trim() || null,
      seoDescription: String(f.get("seoDescription") ?? "").trim() || null,
      publishedAt: date ? new Date(date) : new Date(),
      updatedAt: new Date(),
    } as const,
    categories: f.getAll("categories").map(String),
  };
}

async function setCategories(postId: number, slugs: string[]) {
  await db.delete(postCategory).where(eq(postCategory.postId, postId));
  if (slugs.length) {
    await db.insert(postCategory).values(slugs.map((categorySlug) => ({ postId, categorySlug })));
  }
}

export async function savePost(id: number | null, formData: FormData) {
  await requireAdmin();
  const { values, categories } = readForm(formData);
  let postId = id;
  if (postId) {
    await db.update(post).set(values).where(eq(post.id, postId));
  } else {
    const [row] = await db.insert(post).values(values).returning({ id: post.id });
    postId = row.id;
  }
  await setCategories(postId, values.type === "post" ? categories : []);
  updateTag(CONTENT_TAG);
  redirect(`/admin/posts/${postId}/?saved=1`);
}

export async function deletePost(id: number) {
  await requireAdmin();
  await db.delete(post).where(eq(post.id, id));
  updateTag(CONTENT_TAG);
  redirect("/admin/");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/sign-in/");
}
