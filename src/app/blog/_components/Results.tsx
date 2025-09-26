// src/app/blog/_components/Results.tsx

import Link from "next/link";
import { fetchBlogIndex } from "@/lib/server-blog";
import type { BlogPostList } from "@/types/blog";
import s from "@/components/blog/blog.module.css";
import BlogCard from "@/components/blog/BlogCard";

type SearchParams = {
  q?: string;
  category?: string;
  page?: string;
  ordering?: "new" | "old" | "title" | "-title";
};

const PAGE_SIZE = 12;

export default async function Results({
  searchParams,
  page,
}: {
  searchParams: SearchParams;
  page: number;
}) {
  // این fetch اینجا انجام می‌شود تا با Suspense استریم شود
  const { results, count } = await fetchBlogIndex({
    q: searchParams.q,
    category: searchParams.category,
    page,
    ordering: searchParams.ordering || "new",
  });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // اگر صفحه ۱ است، اولی را برای هیرو نگه می‌داریم؛ اما هیرو را پایین نشان می‌دهیم (همان منطق قبلی)
  const [featured, ...rest] = page === 1 ? (results || []) : [null, ...(results || [])];
  const list = page === 1 ? rest : results;

  return (
    <>
      <div className={`${s.cardsGrid} grid`}>
        {list?.map((p: BlogPostList) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      {/* جداکننده بصری اگر featured وجود دارد */}
      {featured ? <div className={s.divider} aria-hidden="true" /> : null}

      <Pagination current={page} total={totalPages} searchParams={searchParams} />
    </>
  );
}

function Pagination({
  current,
  total,
  searchParams,
}: {
  current: number;
  total: number;
  searchParams: Record<string, any>;
}) {
  if (total <= 1) return null;
  const base = "/blog";
  const sanitize = (obj: Record<string, any>) => {
    const allowed = ["q", "category", "ordering"];
    const out: Record<string, string> = {};
    for (const k of allowed) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim() !== "") out[k] = v;
    }
    return out;
  };
  const mkLink = (p: number) => {
    const cleaned = sanitize(searchParams);
    cleaned.page = String(p);
    const qp = new URLSearchParams(cleaned);
    return `${base}?${qp.toString()}`;
  };
  const pages = [current - 1, current, current + 1].filter((p) => p >= 1 && p <= total);

  return (
    <nav className="pagination" aria-label="صفحه‌بندی">
      {current > 1 && (
        <Link className="page" href={mkLink(current - 1)} scroll={false} prefetch>
          ‹
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          className="page"
          href={mkLink(p)}
          aria-current={p === current ? "page" : undefined}
          scroll={false}
          prefetch
        >
          {p}
        </Link>
      ))}
      {current < total && (
        <Link className="page" href={mkLink(current + 1)} scroll={false} prefetch>
          ›
        </Link>
      )}
    </nav>
  );
}
