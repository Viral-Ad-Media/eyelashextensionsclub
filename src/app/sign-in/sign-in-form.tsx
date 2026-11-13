"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(
    params.get("error") === "not-allowed" ? "That account isn't an approved editor." : null,
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") || email) });
    setBusy(false);
    if (res.error) {
      setError(res.error.message ?? "Something went wrong.");
      return;
    }
    router.push("/admin/");
    router.refresh();
  }

  const input = "mt-1 w-full rounded-lg border border-sand bg-white px-3 py-2 focus:border-gold focus:outline-none";
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {mode === "sign-up" && (
        <label className="block text-sm font-medium">
          Name
          <input name="name" autoComplete="name" className={input} />
        </label>
      )}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          className={input}
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-ink py-2.5 font-semibold text-cream disabled:opacity-60">
        {busy ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create editor account"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        className="w-full text-sm text-muted underline"
      >
        {mode === "sign-in" ? "First time? Create your editor account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
