import Link from "next/link";
import Image from "next/image";
import s from "./blog.module.css";
import { BlogPostList } from "@/types/blog";

export default function FeaturedHero({ post, compact = true }: { post: BlogPostList; compact?: boolean }) {
  if (!post) return null;
  return (
    <section className={`${s.hero} ${compact ? s.heroCompact : ""} card shadow-lg`} aria-label="پیشنهاد سردبیر">
      <div className={s.heroMedia}>
        {post.cover ? (
          <Image src={post.cover} alt="" width={1280} height={720} className={s.heroImg}/>
        ) : <div className="skeleton" style={{width:"100%", height:"100%"}}/>}
      </div>
      <div className={s.heroBody}>
        <div className="cluster t-mute" style={{gap:8}}>
          {post.category?.name && <span className="tag">{post.category.name}</span>}
          {post.reading_time_min ? <span className="badge badge--info">{post.reading_time_min} دقیقه</span> : null}
        </div>
        <h2 className={s.heroTitle}>{post.title}</h2>
        {post.excerpt && <p className={`${s.heroExcerpt} clamp-2`}>{post.excerpt}</p>}
        <Link href={`/blog/${post.slug}`} className="btn" aria-label={`خواندن: ${post.title}`}>مطالعه</Link>
      </div>
    </section>
  );
}
