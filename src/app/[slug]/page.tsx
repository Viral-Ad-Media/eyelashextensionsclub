import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostGrid } from "@/components/post-card";
import { getAllPublishedSlugs, getPublishedBySlug, getPublishedPosts } from "@/lib/posts";
import { formatDate, site } from "@/lib/site";

export async function generateStaticParams() {
  const rows = await getAllPublishedSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedBySlug(slug);
  if (!item) return {};
  const description = item.seoDescription ?? item.excerpt ?? undefined;
  return {
    title: item.seoTitle ?? item.title,
    description,
    alternates: { canonical: `/${item.slug}/` },
    openGraph: {
      type: item.type === "post" ? "article" : "website",
      title: item.title,
      description,
      images: item.coverImage ? [item.coverImage] : undefined,
      publishedTime: item.type === "post" ? item.publishedAt.toISOString() : undefined,
    },
  };
}

// Params are resolved outside a Suspense boundary on purpose: unknown URLs (including the
// spam pages the hacked WordPress site used to serve) must return a real 404 status, not a
// streamed "not found" page with a 200.
export default async function ContentPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const item = await getPublishedBySlug(slug);
  if (!item) notFound();

  if (item.type === "page") {
    return (
      <article className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="font-serif text-4xl sm:text-5xl">{item.title}</h1>
        <div className="prose-lash mt-8" dangerouslySetInnerHTML={{ __html: item.content }} />
      </article>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: item.title,
    description: item.excerpt ?? undefined,
    image: item.coverImage ? new URL(item.coverImage, site.url).toString() : undefined,
    datePublished: item.publishedAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    mainEntityOfPage: new URL(`/${item.slug}/`, site.url).toString(),
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/blog/" className="hover:text-gold-deep">Blog</Link>
          {item.categories[0] && (
            <>
              {" / "}
              <Link href={`/category/${item.categories[0].slug}/`} className="hover:text-gold-deep">
                {item.categories[0].name}
              </Link>
            </>
          )}
        </nav>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{item.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {formatDate(item.publishedAt)}
        </p>
        {item.coverImage && (
          <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-2xl bg-sand">
            <Image src={item.coverImage} alt={item.title} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-lash mt-10" dangerouslySetInnerHTML={{ __html: item.content }} />
        {item.categories.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-2">
            {item.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}/`} className="inline-block rounded-full bg-sand px-3 py-1 text-xs font-medium hover:bg-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="font-serif text-2xl">Keep reading</h2>
        <div className="mt-6">
          <Suspense fallback={null}>
            <RelatedPosts currentSlug={item.slug} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const posts = (await getPublishedPosts(4)).filter((p) => p.slug !== currentSlug).slice(0, 3);
  return <PostGrid posts={posts} />;
}
