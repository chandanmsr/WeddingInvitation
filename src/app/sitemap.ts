import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true" || !process.env.NEXT_PUBLIC_SITE_URL) return [];
  return [{ url: process.env.NEXT_PUBLIC_SITE_URL, changeFrequency: "yearly", priority: 1 }];
}
