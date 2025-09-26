// src/app/page.tsx

import Link from "next/link";
import Image from "next/image";
import s from "./page.module.css";

import FeatureAuthenticity from "@/components/features/FeatureAuthenticity";
import FeatureFastShipping from "@/components/features/FeatureFastShipping";
import FeatureCareGuides from "@/components/features/FeatureCareGuides";
import FeatureSupport from "@/components/features/FeatureSupport";
import FeatureEasyReturns from "@/components/features/FeatureEasyReturns";

import { endpoints } from "@/lib/api";
import { serverFetch } from "@/lib/server-fetch";

// گرفتن دسته‌ها از بک‌اند (SSR)
async function fetchCategories() {
  const res = await serverFetch(endpoints.categories, { method: "GET", revalidate: 600 });
  if (!res.ok) return [];
  const data = await res.json();
  const items = Array.isArray(data?.items) ? data.items : [];
  // هر آیتم: { key, label, image, description }
  return items.map((c: any) => ({
    key: c.key,
    title: c.label,
    img: c.image || "/publicimages/hero22.png",
    href: `/shop?cat=${encodeURIComponent(c.key)}`,
    description: c.description || "",
  }));
}

export default async function HomePage() {
  const categories = await fetchCategories();

  // --- JSON-LD ها (تزریق در انتهای JSX) ---
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.map((c: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `https://wircino.ir${c.href}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ارسال سفارش چقدر زمان می‌برد؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ارسال در سنندج سریع انجام می‌شود و به سراسر ایران ۲ تا ۴ روز کاری زمان می‌برد.",
        },
      },
      {
        "@type": "Question",
        name: "شرایط مرجوعی کالا چیست؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "امکان مرجوعی تا ۷ روز برای کالاهای پلمب و بدون آسیب طبق قوانین فروشگاه فراهم است.",
        },
      },
    ],
  };

  return (
    <div dir="rtl" className={s.homeRoot}>
      {/* HERO */}
      <section className={`${s.hero} ${s.heroModernSplit}`} aria-labelledby="hero-title">
        <div className={`${s.heroContent} container`}>
          <div className={s.heroHeader}>
            <span className={s.badgeHero} aria-label="اعلان راه‌اندازی">🐾 به‌زودی</span>
            <span className={s.heroTagline} aria-hidden="true">پت‌شاپ آنلاین با تمرکز روی کیفیت</span>
          </div>

          {/* H1 واحد (خوبه برای سئو) */}
          <h1 id="hero-title" className={s.heroTitle}>
            ورچینو — فروشگاه تخصصی پت‌شاپ
          </h1>

          <p className={s.heroSubtitle}>
            از غذای خشک و تر تا لوازم بهداشتی و سرگرمی؛ انتخاب‌های کیفی برای پت شما.
          </p>

          {/* نوار ارسال */}
          <div className={s.shipStrip} role="note" aria-label="اطلاعات ارسال">
            <span className={s.shipItem}>🚚 ارسال سریع در سنندج</span>
            <span className={s.shipItem}>📦 ارسال به سراسر ایران ۲–۴ روز کاری</span>
          </div>

          {/* مزیت‌ها */}
          <ul className={s.heroKpis} aria-label="مزیت‌های فروشگاه">
            <li><span aria-hidden>✅</span> تضمین اصالت کالا</li>
            <li><span aria-hidden>↩️</span> مرجوعی تا ۷ روز</li>
            <li><span aria-hidden>💬</span> پشتیبانی واتس‌اپ</li>
          </ul>

          {/* CTA اصلی */}
          <div className={s.heroActions}>
            <a href="#cats" className={`btn ${s.btnGlow}`}>
              <span className={s.btnGlowDot} aria-hidden>●</span>
              مشاهده دسته‌بندی‌ها
            </a>
          </div>

          {/* کوپن شروع */}
          <aside className={s.heroCouponRow} aria-label="پیشنهاد آغاز">
            <div className={s.heroCoupon}>
              <span>هدیه شروع: ۱۰٪ اولین خرید</span>
              <code className={s.couponCode} aria-label="کد تخفیف">wircino</code>
            </div>
          </aside>
        </div>

        <div className={s.heroImageWrap} aria-hidden="true">
          <Image
            src="/publicimages/hero38.png"
            alt="ورچینو؛ پت‌شاپ آنلاین با ارسال سریع"
            fill
            priority
            sizes="(min-width:1024px) 50vw, 100vw"
            className={s.heroImage}
          />
        </div>
      </section>

      {/* دسته‌بندی‌ها (از بک‌اند) */}
      <section id="cats" className={`container ${s.section}`} aria-labelledby="cats-title">
        <div className={s.sectionHeader}>
          <h2 id="cats-title" className={s.sectionTitle}>دسته‌بندی‌های فروشگاه</h2>
          <span className={s.badgeSoft}>لانچ اولیه</span>
        </div>

        <div className={s.catGridFancy}>
          {categories.map((c: any) => (
            <Link key={c.key} href={c.href} className={s.catFancy} aria-label={c.title}>
              <span aria-hidden className={s.catFrameOuter} />
              <span aria-hidden className={s.catFrameInner} />

              <div className={s.catFancyMedia}>
                <Image
                  src={c.img}
                  alt={c.title}           // ← alt توصیفی
                  fill
                  className={s.catFancyImg}
                  sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
                />
              </div>

              <div className={s.catFancyBar} aria-hidden="true" />
              <div className={s.catFancyBody}>
                <h3 className={s.catFancyTitle}>{c.title}</h3>
                {/* نمایش توضیح (اختیاری) */}
                {c.description ? <p>{c.description}</p> : null}
                <span className={s.catFancyCta}>مشاهده <span aria-hidden>↗</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* اطلاع‌رسانی موجودی */}
      <section className={`container ${s.section}`} aria-labelledby="empty-title">
        <div className={`card ${s.empty}`}>
          <div className={s.emptyIcon} aria-hidden="true">🧺</div>
          <div className={s.emptyBody}>
            <h3 id="empty-title" className={s.emptyTitle}>در حال آماده‌سازی قفسه‌ها</h3>
            <p className={s.emptyText}>
              محصولات به‌زودی اضافه می‌شن. اگر دنبال کالای خاصی هستی پیام بده تا در اولویت بذاریم.
            </p>
            <div className={s.emptyActions}>
              <Link href="/contact" className="btn">درخواست محصول</Link>
              <a
                className="btn btn--ghost"
                href="https://wa.me/989186559894"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                چت واتس‌اپ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* بنر CTA */}
      <section className={s.cta} aria-labelledby="cta-title">
        <Image
          src="/publicimages/banner/banner1.png"
          alt="تخفیف اولین خرید در ورچینو"
          fill
          className={s.ctaImg}
          sizes="100vw"
        />
        <div className={s.ctaOverlay} />
        <div className={`container ${s.ctaContent}`}>
          <h2 id="cta-title" className={s.ctaTitle}>اولین خرید با ۱۰٪ تخفیف</h2>
          <p className={s.ctaText}>
            کد: <strong>wircino</strong> — به‌محض فعال‌شدن فروشگاه
          </p>
        </div>
      </section>

      {/* ویژگی‌ها */}
      <section className={`container ${s.section}`} aria-labelledby="features-title">
        <h2 id="features-title" className={s.sectionTitle}>چرا ورچینو؟</h2>
        <div className={s.featuresGrid}>
          <FeatureAuthenticity />
          <FeatureFastShipping />
          <FeatureCareGuides />
          <FeatureSupport />
          <FeatureEasyReturns />
        </div>
      </section>

      {/* JSON-LD های صفحه اصلی */}
      <script
        type="application/ld+json"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        // @ts-ignore
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
