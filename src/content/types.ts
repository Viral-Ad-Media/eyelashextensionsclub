export type SeedPost = {
  slug: string;
  type: "post" | "page";
  title: string;
  excerpt?: string;
  seoDescription?: string;
  coverImage?: string;
  publishedAt: string;
  categories?: string[];
  content: string;
};

export const U = "/wp-content/uploads";

/** A figure with a caption. Paths are site-relative images copied from the old site's uploads. */
export function fig(src: string, alt: string, caption?: string) {
  return `<figure><img src="${U}/${src}" alt="${alt}">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}
