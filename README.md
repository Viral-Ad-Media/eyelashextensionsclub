# Eyelash Extensions Club

A rebuild of eyelashextensionsclub.com, replacing the old WordPress site.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Neon Postgres via Drizzle ORM · Better Auth (email + password).

## What's here

- Public site at the same URLs as the old WordPress site (`/slug/`, `/category/slug/`, `/blog/`, `/faq/`, `/privacy-policy/`). Old dated permalinks (`/2020/08/28/slug/`) redirect to `/slug/`.
- 18 articles and 2 pages, written fresh for the rebuild, in `src/content/`. Images are the originals from the Oct 19, 2026 backup, in `public/wp-content/uploads/` (same paths as before, so old image links keep working).
- `/admin/`: editor for posts and pages (create, edit, publish, delete). HTML is sanitized on save.
- `sitemap.xml`, `robots.txt`, Open Graph and Article structured data.

## Security notes

The old site was compromised (login backdoor, hidden "system" admin, spam pages proxying an outside server, planted Google verification files). None of that code or those files were carried over. In this rebuild:

- Only emails listed in `ADMIN_EMAILS` can create an account or open `/admin`. Every admin page and server action checks the session itself.
- Post HTML is sanitized (no scripts, iframes, event handlers or inline styles).
- Unknown URLs, including the old spam URLs, return a real 404.

## Setup

1. Create a Neon project and copy its connection string.
2. `cp .env.example .env` and fill in the values (`openssl rand -base64 32` for `BETTER_AUTH_SECRET`).
3. Install and create the tables:
   ```bash
   npm install
   npm run db:migrate   # applies drizzle/ migrations
   npm run db:seed      # loads categories, posts and pages (safe to re-run; overwrites seeded posts)
   ```
4. `npm run dev`, then go to `/sign-in/`, choose "Create your editor account" with an email from `ADMIN_EMAILS`.

The build reads published slugs from the database, so `DATABASE_URL` must be set at build time too (e.g. in Vercel project env vars).

## Deploying (Vercel)

Import the repo, add the env vars from `.env.example` (with `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` set to the real domain), run `npm run db:migrate && npm run db:seed` once against the Neon database, then deploy.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Create a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Load `src/content/` into the database |
