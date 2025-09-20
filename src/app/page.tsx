import Link from "next/link";
import Image from "next/image";
import s from "./page.module.css";

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
          <span className={s.badgeHero}>🐾 به‌زودی</span>

          <h1 id="hero-title" className={s.heroTitle}>
            ورچینو — به‌زودی با قفسه‌های پر ✨
          </h1>

          <p className={s.heroSubtitle}>
            در حال آماده‌سازی موجودی هستیم. دسته‌بندی‌های اصلی‌مون آماده‌ست و خیلی زود
            انتخاب‌های باکیفیت می‌چینیم.
          </p>

          <ul className={s.heroKpis} aria-label="مزیت‌های فروشگاه">
            <li>✅ تضمین اصالت کالا</li>
            <li>🚚 ارسال سریع در سنندج</li>
            <li>↩️ مرجوعی تا ۷ روز</li>
          </ul>

          <div className={s.heroActions}>
            <a href="#cats" className="btn">مشاهده دسته‌بندی‌ها</a>
            <Link href="/contact" className="btn btn--ghost">تماس با ما</Link>
          </div>

          <aside className={s.heroCoupon} aria-label="کد تخفیف اولین خرید">
            <span>هدیه شروع: ۱۰٪ اولین خرید</span>
            <code className={s.couponCode}>wircino</code>
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

        <div className={`${s.catGrid}`}>
          {categories.map((c) => (
            <Link key={c.title} href={c.href} className={`card card--hover ${s.catCard}`} aria-label={c.title}>
              <div className={s.catMedia}>
                <Image
                  src={c.img}
                  alt=""
                  fill
                  className={s.catImg}
                  sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
                  priority={false}
                />
              </div>
              <div className={s.catBody}>
                <h3 className={s.catTitle}>{c.title}</h3>
                <span className={s.catCta}>به‌زودی <span aria-hidden>↗</span></span>
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
              <a className="btn btn--ghost" href="https://wa.me/989186559894" target="_blank" rel="noreferrer">
                چت واتس‌اپ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* بنر CTA */}
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
    </div>
  );
}
