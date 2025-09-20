// F:\Shahrivar1404\Werch_app\werchaui\src\lib\server-blog.ts

import { endpoints } from "./api";
import { serverFetch } from "./server-fetch";

export async function fetchBlogIndex(params: {
  q?: string;
  category?: string;
  page?: number;
  ordering?: "new"|"old"|"title"|"-title";
}) {
  const qp = new URLSearchParams();
  if (params.q) qp.set("q", params.q);
  if (params.category) qp.set("category", params.category);
  if (params.ordering) qp.set("ordering", params.ordering);
  if (params.page && params.page > 1) qp.set("page", String(params.page));
  const url = `${endpoints.blogIndex}?${qp.toString()}`;

  const res = await serverFetch(url, { method: "GET", revalidate: 600 });
  if (!res.ok) throw new Error(`Failed to load blog index (${res.status})`);
  return res.json();
}

export async function fetchBlogPost(slug: string, opts?: RequestInit) {
  try {
    const res = await serverFetch(endpoints.blogPost(slug), {
      method: "GET",
      revalidate: 600,
      ...(opts || {}),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load post (${res.status})`);
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBlogCategories() {
  const res = await serverFetch(endpoints.blogCategories, { method: "GET", revalidate: 1800 });
  if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
  return res.json();
}
