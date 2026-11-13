import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-serif text-3xl">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">Only approved site editors can sign in.</p>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
