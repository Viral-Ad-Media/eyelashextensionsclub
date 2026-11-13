import { NextResponse, type NextRequest } from "next/server";

/**
 * The old WordPress URLs all end in "/". We keep that for pages, but the Better Auth
 * API must not be redirected (its client calls paths without a trailing slash),
 * so trailing-slash handling lives here instead of in next.config.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(pathname)) {
    // Build from the raw URL: nextUrl normalizes the trailing slash away.
    const url = new URL(request.url);
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|wp-content/|brand/).*)"],
};
