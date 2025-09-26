// src/app/robots.ts
import { site } from "@/lib/site-config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/search", "/*?view=", "/*?sort=", "/*?utm_"],
    },
    sitemap: `${site.domain}/sitemap.xml`,
    host: site.domain,
  };
}
