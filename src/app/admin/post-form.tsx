import { db, schema } from "@/db";
import type { Post } from "@/db/schema";
import { deletePost, savePost } from "./actions";

export async function PostForm({ post, categorySlugs = [] }: { post?: Post; categorySlugs?: string[] }) {
  const cats = await db.select().from(schema.category).orderBy(schema.category.name);
  const save = savePost.bind(null, post?.id ?? null);
  const input = "mt-1 w-full rounded-lg border border-sand bg-white px-3 py-2 focus:border-gold focus:outline-none";
  const label = "block text-sm font-medium";
  return (
    <form action={save} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <label className={label}>
          Title
          <input name="title" required defaultValue={post?.title} className={`${input} text-lg`} />
        </label>
        <label className={label}>
          URL slug <span className="font-normal text-muted">(leave blank to build it from the title)</span>
          <input name="slug" defaultValue={post?.slug} className={input} />
        </label>
        <label className={label}>
          Excerpt
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={input} />
        </label>
        <label className={label}>
          Content (HTML). Scripts, iframes and inline styles are stripped on save.
          <textarea name="content" rows={24} defaultValue={post?.content} className={`${input} font-mono text-sm`} />
        </label>
      </div>
      <aside className="space-y-5">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-sand space-y-4">
          <label className={label}>
            Status
            <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className={label}>
            Type
            <select name="type" defaultValue={post?.type ?? "post"} className={input}>
              <option value="post">Blog post</option>
              <option value="page">Page</option>
            </select>
          </label>
          <label className={label}>
            Publish date
            <input
              name="publishedAt"
              type="date"
              defaultValue={(post?.publishedAt ?? new Date()).toISOString().slice(0, 10)}
              className={input}
            />
          </label>
          <button className="w-full rounded-full bg-ink py-2.5 font-semibold text-cream">Save</button>
        </div>
        <fieldset className="rounded-2xl bg-white p-4 ring-1 ring-sand">
          <legend className="px-1 text-sm font-medium">Categories (posts only)</legend>
          {cats.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 py-1 text-sm">
              <input type="checkbox" name="categories" value={c.slug} defaultChecked={categorySlugs.includes(c.slug)} />
              {c.name}
            </label>
          ))}
        </fieldset>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-sand space-y-4">
          <label className={label}>
            Cover image path
            <input name="coverImage" defaultValue={post?.coverImage ?? ""} placeholder="/wp-content/uploads/…" className={input} />
          </label>
          <label className={label}>
            SEO title
            <input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={input} />
          </label>
          <label className={label}>
            SEO description
            <textarea name="seoDescription" rows={3} defaultValue={post?.seoDescription ?? ""} className={input} />
          </label>
        </div>
        {post && (
          <button
            formAction={deletePost.bind(null, post.id)}
            formNoValidate
            className="w-full rounded-full border border-red-300 py-2 text-sm text-red-700"
          >
            Delete permanently
          </button>
        )}
      </aside>
    </form>
  );
}
