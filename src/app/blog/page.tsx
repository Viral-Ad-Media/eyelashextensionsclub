import type { Metadata } from "next";
import { Suspense } from "react";
import { PostGrid } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Every guide on Eyelash Extensions Club: lash types, curls, lifts, tinting, brows and aftercare.",
  alternates: { canonical: "/blog/" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-serif text-4xl">The lash blog</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Guides to lash extensions, curls, lifts, tinting, brows and aftercare.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted">Loading articles…</p>}>
          <AllPosts />
        </Suspense>
      </div>
    </div>
  );
}

async function AllPosts() {
  return <PostGrid posts={await getPublishedPosts()} />;
}
