import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Off on purpose: with it on, the first visit to an unknown URL is served the app shell
  // with a 200. Off, unknown URLs (like the old spam pages) get a real 404 every time.
  partialPrefetching: false,
  // Keep the same URLs as the old WordPress site (/slug/ with a trailing slash).
  // Links are generated with the slash; src/proxy.ts redirects pages without it,
  // while leaving /api/auth alone.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old WordPress endpoints and the hacked site's spam URLs: send them home, never serve them.
      { source: "/wp-admin/:path*", destination: "/admin/", permanent: false },
      { source: "/wp-login.php", destination: "/sign-in/", permanent: false },
      { source: "/xmlrpc.php", destination: "/", permanent: true },
      { source: "/feed/:path*", destination: "/blog/", permanent: true },
      // Old dated permalinks that existed alongside the plain /slug/ ones.
      { source: "/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/:slug/", destination: "/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;
