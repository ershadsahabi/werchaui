// src/app/sitemap.ts
import { site } from "@/lib/site-config";
// اگر API داری محصولات/پست‌ها را بگیر و lastmod بده
export default async function sitemap() {
  const now = new Date().toISOString();
  const base: Array<{ url: string; lastModified: string; changeFrequency?: string; priority?: number }> = [
    { url: site.domain + "/", lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: site.domain + "/blog", lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: site.domain + "/contact", lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    // دسته‌های استاتیک (اگر فعلاً همین‌هاست)
    { url: site.domain + "/c/dry-food", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // ...
  ];
  return base;
}
