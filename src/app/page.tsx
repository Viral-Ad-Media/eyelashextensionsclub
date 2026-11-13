import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PostGrid } from "@/components/post-card";
import { getCategories, getPublishedPosts } from "@/lib/posts";

const curls = [
  { letter: "J", slug: "j-curls", text: "The most natural lift, close to a real lash." },
  { letter: "B", slug: "b-curls", text: "A soft, gentle curl for subtle definition." },
  { letter: "C", slug: "c-curls", text: "The crowd favourite: noticeable but natural." },
  { letter: "D", slug: "d-curls", text: "A dramatic, doll-eye curl that opens the eye." },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-cream">
        <Image
          src="/wp-content/uploads/2026/08/EYELASH.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Eyelash Extensions Club</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">
            Everything you need to know about beautiful lashes
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/80">
            Clear guides to lash types, curls, lifts, tints and aftercare, so you can walk into your
            next appointment knowing exactly what to ask for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/a-beginners-guide-to-lash-extensions-understanding-different-types-of-lash-curls/"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:bg-gold-deep hover:text-cream"
            >
              Start with the beginner&apos;s guide
            </Link>
            <Link href="/blog/" className="rounded-full border border-cream/40 px-6 py-3 font-semibold hover:border-gold hover:text-gold">
              Browse all articles
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl">Find your curl</h2>
        <p className="mt-2 text-muted">Lash curls are named by letter. Here&apos;s the quick version.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {curls.map((c) => (
            <Link
              key={c.letter}
              href={`/category/${c.slug}/`}
              className="rounded-2xl bg-white p-6 ring-1 ring-sand transition hover:ring-gold"
            >
              <span className="font-serif text-5xl text-gold-deep">{c.letter}</span>
              <p className="mt-1 font-semibold">{c.letter}-curl</p>
              <p className="mt-2 text-sm text-muted">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">Latest articles</h2>
          <Link href="/blog/" className="text-sm font-semibold text-gold-deep hover:underline">View all</Link>
        </div>
        <div className="mt-8">
          <Suspense fallback={<p className="text-muted">Loading articles…</p>}>
            <LatestPosts />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="font-serif text-3xl">Browse by topic</h2>
        <Suspense fallback={null}>
          <CategoryChips />
        </Suspense>
      </section>
    </>
  );
}

async function LatestPosts() {
  const posts = await getPublishedPosts(6);
  return <PostGrid posts={posts} />;
}

async function CategoryChips() {
  const cats = await getCategories();
  return (
    <ul className="mt-6 flex flex-wrap gap-3">
      {cats
        .filter((c) => c.slug !== "uncategorized")
        .map((c) => (
          <li key={c.slug}>
            <Link
              href={`/category/${c.slug}/`}
              className="inline-block rounded-full bg-sand px-4 py-2 text-sm font-medium hover:bg-gold"
            >
              {c.name}
            </Link>
          </li>
        ))}
    </ul>
  );
}
