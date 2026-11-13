import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Suspense fallback={<p className="text-muted">Checking your account…</p>}>
        <Gate>{children}</Gate>
      </Suspense>
    </div>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/" className="font-serif text-2xl">Site admin</Link>
          <Link href="/admin/posts/new/" className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold">New post</Link>
        </div>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span>{user.email}</span>
          <button className="underline">Sign out</button>
        </form>
      </div>
      {children}
    </>
  );
}
