import type { MetadataRoute } from "next";
import { getAllPublishedSlugs, getCategories } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [items, cats] = await Promise.all([getAllPublishedSlugs(), getCategories()]);
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    ...items.map((i) => ({ url: `${site.url}/${i.slug}/`, lastModified: i.updatedAt })),
    ...cats.map((c) => ({ url: `${site.url}/category/${c.slug}/` })),
  ];
}
