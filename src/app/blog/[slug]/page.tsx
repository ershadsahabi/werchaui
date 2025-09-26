// src/app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/blog/ShareBar";
import ReferencesPanel from "@/components/blog/ReferencesPanel";
import TrackRead from "@/components/blog/TrackRead";
import ClientDate from "@/components/ClientDate";

import { fetchBlogPost } from "@/lib/server-blog";
import type { BlogPostDetail } from "@/types/blog";

import "@/app/blog/prose.css";

export const revalidate = 600;

type Params = { slug: string };

function clean<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  for (const k of Object.keys(obj)) {
    const v = (obj as any)[k];
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out as T;
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post: BlogPostDetail | null = await fetchBlogPost(params.slug);
  if (!post) notFound();

  const html = (post as any).content_html ?? post.content ?? "";
  const isoDate: string | null =
    (post as any).published || (post as any).created || post.updated || null;

  const jsonLd = clean({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.cover || undefined,
    datePublished: isoDate || undefined,
    dateModified: post.updated || undefined,
    inLanguage: "fa-IR",
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${post.slug}` },
    articleSection: post.category?.name || undefined,
    wordCount: (post as any).word_count || undefined,
    author: (post as any).author_name ? { "@type": "Person", name: (post as any).author_name } : undefined,
  });

  return (
    <article className="stack gap-4" dir="rtl" aria-labelledby="post-title">
      <TrackRead
        slug={post.slug}
        meta={{
          slug: post.slug,
          title: post.title,
          cover: post.cover ?? null,
          category_name: post.category?.name ?? null,
          reading_time_min: post.reading_time_min ?? null,
        }}
      />

      <Breadcrumbs items={[{ href: "/blog", label: "بلاگ" }, { label: post.title }]} />

      <header className="stack gap-2">
        <h1 id="post-title" style={{ fontSize: "1.9rem", fontWeight: 900, lineHeight: 1.25 }}>
          {post.title}
        </h1>
        <div className="cluster t-mute" style={{ gap: 10, flexWrap: "wrap" }}>
          {post.category?.name && <span className="tag">{post.category.name}</span>}
          {post.reading_time_min ? <span className="badge badge--info">{post.reading_time_min} دقیقه</span> : null}
          {isoDate && (
            <span className="badge" style={{ background: "var(--chip-bg)", color: "var(--chip-text)" }}>
              <ClientDate iso={isoDate} timeZone="UTC" />
            </span>
          )}
        </div>
      </header>

      {post.cover ? (
        <figure className="stack gap-2">
          <div className="product-media" style={{ aspectRatio: "16/9" }}>
            <Image src={post.cover} alt="" width={1280} height={720} priority />
          </div>
          {(post as any).cover_caption ? (
            <figcaption className="t-mute" style={{ fontSize: ".85rem", textAlign: "center" }}>
              {(post as any).cover_caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* بدنهٔ مقاله — برای ثبات SSR/CSR */}
      {html ? (
        <div
          id="post-content"                // ⬅️ برای اسکرول/Anchor و scroll-margin
          className="prose"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: html }}
          aria-label="متن مقاله"
        />
      ) : null}

      <ShareBar title={post.title} />

      {Array.isArray((post as any).references) && (post as any).references.length > 0 ? (
        <ReferencesPanel
          refs={(post as any).references.map((r: any) => ({
            id: r.id,
            title: r.title,
            source: r.source,
            year: r.year,
            url: r.url,
            authors_text: r.authors_text,
          }))}
        />
      ) : null}

      <footer className="cluster" style={{ justifyContent: "space-between", marginTop: "var(--sp-6)" }}>
        <Link href="/blog" className="btn btn--ghost">← بازگشت به بلاگ</Link>
        {post.category?.slug ? (
          <Link href={`/blog?category=${encodeURIComponent(post.category.slug)}`} className="btn">
            بیشتر در «{post.category.name}»
          </Link>
        ) : null}
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
    </article>
  );
}
