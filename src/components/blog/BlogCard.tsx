// src/components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import s from "./blog.module.css";
import type { BlogPostList } from "@/types/blog";

const TINY_BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect width='100%25' height='100%25' fill='%23101723'/%3E%3C/svg%3E";

export default function BlogCard({ post }: { post: BlogPostList }) {
  const href = `/blog/${post.slug}`;
  const pubDate = post.published_at ? new Date(post.published_at) : null;

  return (
    <article className={`${s.card} card card--hover`}>
      <Link href={href} className={s.cardInner} aria-label={post.title} scroll={false}>
        {/* Media */}
        <div className={s.media}>
          {post.cover ? (
            <Image
              className={s.img}
              src={post.cover}
              alt=""
              width={640}
              height={400}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={TINY_BLUR}
              priority={false}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="skeleton" style={{ width: "100%", height: "100%" }} />
          )}
        </div>

        {/* Meta as plain text */}
        <div className={s.metaRow}>
          {post.category?.name && <span className={s.metaItem}>{post.category.name}</span>}
          {post.reading_time_min ? (
            <>
              <span className={s.metaSep} aria-hidden>
                ·
              </span>
              <span className={s.metaItem} title="مدت زمان مطالعهٔ تقریبی">
                حدود {post.reading_time_min} دقیقه مطالعه
              </span>
            </>
          ) : null}
          {pubDate ? (
            <>
              <span className={s.metaSep} aria-hidden>
                ·
              </span>
              <time className={s.metaItem} dateTime={pubDate.toISOString()}>
                {pubDate.toLocaleDateString("fa-IR")}
              </time>
            </>
          ) : null}
        </div>

        {/* Body */}
        <div className={s.body}>
          <h2 className={`${s.title} clamp-2`}>{post.title}</h2>
          {post.excerpt && <p className={`${s.excerpt} clamp-2`}>{post.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}
