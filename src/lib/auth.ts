import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";

/**
 * Comma-separated list of emails allowed to have accounts.
 * Only these people can sign up and reach /admin. Nobody else can register,
 * so there is no way to plant a hidden admin account like the old site had.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (u) => {
          if (!adminEmails().includes(u.email.toLowerCase())) {
            throw new APIError("FORBIDDEN", {
              message: "Sign-ups are closed for this site.",
            });
          }
          return { data: u };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
