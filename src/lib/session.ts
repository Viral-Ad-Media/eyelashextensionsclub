import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, adminEmails } from "./auth";

/** Returns the signed-in admin, or redirects to /sign-in. Call inside a Suspense boundary. */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (!adminEmails().includes(session.user.email.toLowerCase())) {
    redirect("/sign-in?error=not-allowed");
  }
  return { id: session.user.id, name: session.user.name, email: session.user.email };
}
