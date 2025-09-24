"use client";

import Link from "next/link";
import Image from "next/image";
import s from "./page.module.css";

import FeatureAuthenticity from "@/components/features/FeatureAuthenticity";
import FeatureFastShipping from "@/components/features/FeatureFastShipping";
import FeatureCareGuides from "@/components/features/FeatureCareGuides";
import FeatureSupport from "@/components/features/FeatureSupport";
import FeatureEasyReturns from "@/components/features/FeatureEasyReturns";
import PawParade from "@/components/brand/PawParade";



export default function HomePage() {
  const categories = [
    { href: "/shop?cat=toys",        title: "وسایل بازی سگ و گربه", img: "/publicimages/cat/cat5.png"  },
    { href: "/shop?cat=litter",      title: "خاک گربه",              img: "/publicimages/cat/cat2.png"  },
    { href: "/shop?cat=dry-food",    title: "غذای خشک",             img: "/publicimages/cat/cat7.png"  },
    { href: "/shop?cat=wet-food",    title: "غذای تر و کنسروی",     img: "/publicimages/cat/cat18.png" },
    { href: "/shop?cat=treats",      title: "تشویقی و مکمل",        img: "/publicimages/cat/cat1.png"  },
    { href: "/shop?cat=grooming",    title: "بهداشت و نظافت",        img: "/publicimages/cat/cat14.png" },
    { href: "/shop?cat=beds",        title: "جای خواب و باکس",       img: "/publicimages/cat/cat16.png" },
    { href: "/shop?cat=accessories", title: "قلاده و اکسسوری",       img: "/publicimages/cat/cat17.png" },
  ];

  return (
    <div dir="rtl" className={s.homeRoot}>
{/* HERO */}
<section className={`${s.hero} ${s.heroModernSplit}`} aria-labelledby="hero-title">
  <div className={`${s.heroContent} container`}>

    {/* Header row: badge + mini tagline */}
    <div className={s.heroHeader}>
      <span className={s.badgeHero} aria-label="اعلان راه‌اندازی">🐾 به‌زودی</span>
      <span className={s.heroTagline} aria-hidden="true">پت‌شاپ آنلاین با تمرکز روی کیفیت</span>
    </div>

    {/* Title */}
    <h1 id="hero-title" className={s.heroTitle}>
      ورچینو — فروشگاه تخصصی پت‌شاپ
       <br />
      ✨
    </h1>

    {/* Sub + Shipping notice (clarified) */}
    <p className={s.heroSubtitle}>
      از غذای خشک و تر تا لوازم بهداشتی و سرگرمی؛ انتخاب‌های کیفی برای پت شما.
      
    </p>

    {/* Shipping strip — واضح: سنندج سریع + سراسر ایران */}
    <div className={s.shipStrip} role="note" aria-label="اطلاعات ارسال">
      <span className={s.shipItem}>🚚 ارسال سریع در سنندج</span>
      <span className={s.shipItem}>📦 ارسال به سراسر ایران ۲–۴ روز کاری</span>
    </div>

    {/* KPIs */}
    <ul className={s.heroKpis} aria-label="مزیت‌های فروشگاه">
      <li><span aria-hidden>✅</span> تضمین اصالت کالا</li>
      <li><span aria-hidden>↩️</span> مرجوعی تا ۷ روز</li>
      <li><span aria-hidden>💬</span> پشتیبانی واتس‌اپ</li>
    </ul>

    {/* Actions */}
    <div className={s.heroActions}>
      <a href="#cats" className={`btn ${s.btnGlow}`}>
        <span className={s.btnGlowDot} aria-hidden>●</span>
        مشاهده دسته‌بندی‌ها
      </a>

    </div>

    {/* Coupon row */}
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
      alt=""
      fill
      priority
      sizes="(min-width:1024px) 50vw, 100vw"
      className={s.heroImage}
    />
  </div>
</section>






      {/* دسته‌بندی‌ها */}
<section id="cats" className={`container ${s.section}`} aria-labelledby="cats-title">
  <div className={s.sectionHeader}>
    <h2 id="cats-title" className={s.sectionTitle}>چه چیزهایی راه می‌افتد؟</h2>
    <span className={s.badgeSoft}>لانچ اولیه</span>
  </div>

  {/* کارت با قاب دوتایی و هاور نرم */}
  <div className={s.catGridFancy}>
    {categories.map((c) => (
      <Link key={c.title} href={c.href} className={s.catFancy} aria-label={c.title}>
        {/* قاب بیرونی لطیف */}
        <span aria-hidden className={s.catFrameOuter} />
        {/* قاب درونی ظریف */}
        <span aria-hidden className={s.catFrameInner} />

        <div className={s.catFancyMedia}>
          <Image
            src={c.img}
            alt=""
            fill
            className={s.catFancyImg}
            sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
          />
        </div>

        {/* نوار بالا خیلی کم‌رنگ، حفظ هویت ولی بی‌زرق‌وبرق */}
        <div className={s.catFancyBar} aria-hidden="true" />

        <div className={s.catFancyBody}>
          <h3 className={s.catFancyTitle}>{c.title}</h3>
          <span className={s.catFancyCta}>به‌زودی <span aria-hidden>↗</span></span>
        </div>
      </Link>
    ))}
  </div>
</section>

      {/* اطلاع‌رسانی موجودی (بدون تغییر رفتاری) */}
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
              <a className="btn btn--ghost" href="https://wa.me/989186559894" target="_blank" rel="noreferrer">
                چت واتس‌اپ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* بنر CTA (بدون تغییر رفتاری) */}
      <section className={s.cta} aria-labelledby="cta-title">
        <Image src="/publicimages/banner/banner1.png" alt="" fill className={s.ctaImg} sizes="100vw" />
        <div className={s.ctaOverlay} />
        <div className={`container ${s.ctaContent}`}>
          <h2 id="cta-title" className={s.ctaTitle}>اولین خرید با ۱۰٪ تخفیف</h2>
          <p className={s.ctaText}>
            کد: <strong>wircino</strong> — به‌محض فعال‌شدن فروشگاه
          </p>
        </div>
      </section>



      {/* ویژگی‌های فروشگاه: ۵ کامپوننت مستقل */}
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
    </div>
  );
}
