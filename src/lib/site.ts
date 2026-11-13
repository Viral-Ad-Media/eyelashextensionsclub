export const site = {
  name: "Eyelash Extensions Club",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eyelashextensionsclub.com",
  description:
    "Honest, practical guides to eyelash extensions, lash curls, lash lifts, tinting and aftercare.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/blog/", label: "Blog" },
    { href: "/category/tips-and-tricks/", label: "Tips & Tricks" },
    { href: "/category/reviews/", label: "Reviews" },
    { href: "/faq/", label: "FAQ" },
  ],
};

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
