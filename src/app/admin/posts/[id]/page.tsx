import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../post-form";

export default function EditPostPage(props: PageProps<"/admin/posts/[id]">) {
  return (
    <Suspense fallback={null}>
      <Editor {...props} />
    </Suspense>
  );
}

async function Editor({ params, searchParams }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();
  const [row] = await db.select().from(schema.post).where(eq(schema.post.id, postId));
  if (!row) notFound();
  const cats = await db
    .select({ slug: schema.postCategory.categorySlug })
    .from(schema.postCategory)
    .where(eq(schema.postCategory.postId, postId));
  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-serif text-3xl">Edit {row.type}</h1>
        {row.status === "published" && (
          <Link href={`/${row.slug}/`} className="text-sm text-gold-deep underline">View on site</Link>
        )}
      </div>
      {saved && <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">Saved.</p>}
      <PostForm post={row} categorySlugs={cats.map((c) => c.slug)} />
    </>
  );
}
