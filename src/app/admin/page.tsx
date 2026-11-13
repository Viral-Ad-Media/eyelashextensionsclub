import Link from "next/link";
import { desc } from "drizzle-orm";
import { Suspense } from "react";
import { db, schema } from "@/db";
import { formatDate } from "@/lib/site";
import { requireAdmin } from "@/lib/session";

export default function AdminHome() {
  return (
    <Suspense fallback={null}>
      <PostTable />
    </Suspense>
  );
}

async function PostTable() {
  // Layouts and pages render independently, so each admin page checks the session itself.
  await requireAdmin();
  const rows = await db
    .select({
      id: schema.post.id,
      title: schema.post.title,
      slug: schema.post.slug,
      type: schema.post.type,
      status: schema.post.status,
      updatedAt: schema.post.updatedAt,
    })
    .from(schema.post)
    .orderBy(desc(schema.post.type), desc(schema.post.publishedAt));

  return (
    <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-sand">
      <table className="w-full text-left text-sm">
        <thead className="bg-sand/60">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-sand">
              <td className="px-4 py-3">
                <Link href={`/admin/posts/${r.id}/`} className="font-medium hover:text-gold-deep">{r.title}</Link>
                <div className="text-xs text-muted">/{r.slug}/</div>
              </td>
              <td className="px-4 py-3 capitalize">{r.type}</td>
              <td className="px-4 py-3">
                <span className={r.status === "published" ? "text-green-700" : "text-muted"}>{r.status}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
