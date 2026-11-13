import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/site";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand transition hover:shadow-md">
      <Link href={`/${post.slug}/`} className="relative block aspect-[3/2] overflow-hidden bg-sand">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.categories[0] && (
          <Link
            href={`/category/${post.categories[0].slug}/`}
            className="text-xs font-semibold uppercase tracking-wider text-gold-deep"
          >
            {post.categories[0].name}
          </Link>
        )}
        <h3 className="mt-2 font-serif text-xl leading-snug">
          <Link href={`/${post.slug}/`} className="hover:text-gold-deep">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>}
        <p className="mt-auto pt-4 text-xs text-muted">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return <p className="text-muted">No articles yet.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
