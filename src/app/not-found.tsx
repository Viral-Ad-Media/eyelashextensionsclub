import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-6xl text-gold-deep">404</p>
      <h1 className="mt-4 font-serif text-3xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved. Try the blog, or head back home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-gold px-5 py-2.5 font-semibold">Home</Link>
        <Link href="/blog/" className="rounded-full border border-ink/20 px-5 py-2.5 font-semibold">Blog</Link>
      </div>
    </div>
  );
}
