import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/post-card";
import { getCategories, getPostsInCategory } from "@/lib/posts";

export async function generateStaticParams() {
  const cats = await getCategories();
  // Cache Components requires at least one param. On an empty database, use a placeholder
  // that simply renders the 404 page, so the build still succeeds.
  return cats.length ? cats.map((c) => ({ slug: c.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostsInCategory(slug);
  if (!data) return {};
  return {
    title: data.category.name,
    description: data.category.description ?? undefined,
    alternates: { canonical: `/category/${slug}/` },
  };
}

// Resolved outside Suspense so unknown categories return a real 404 status.
export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const data = await getPostsInCategory(slug);
  if (!data) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-gold-deep">Topic</p>
      <h1 className="mt-2 font-serif text-4xl">{data.category.name}</h1>
      {data.category.description && <p className="mt-3 max-w-2xl text-muted">{data.category.description}</p>}
      <div className="mt-10">
        <PostGrid posts={data.posts} />
      </div>
    </div>
  );
}
