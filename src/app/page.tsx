/* صفحه اصلی wircino – با اسلات عکس از /public و استایل حرفه‌ای، RTL و موبایل‌فرست */

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div dir="rtl" className="homeRoot">
      {/* HERO */}
<section className="hero hero--modernSplit" dir="rtl">
  {/* متن سمت چپ */}
  <div className="heroContentModern container">
    <span className="badge badgeHero">🚚 ارسال امروز سنندج</span>

    <h1>هرچی پتت لازم داره، همین‌جاست!</h1>

    <p>غذا، اسباب‌بازی، لوازم بهداشتی و خدمات گرومینگ با بهترین قیمت و پشتیبانی.</p>

    <ul className="heroKpis">
      <li>🩺 مشاوره دامپزشکی</li>
      <li>✅ تضمین اصالت کالا</li>
    </ul>

    <div className="heroActions">
      <Link href="/shop" className="btn btn-primary">مشاهده فروشگاه</Link>
      <Link href="/grooming" className="btn btn-ghost">نوبت گرومینگ</Link>
    </div>

    <aside className="heroCoupon heroCoupon--glass">
      <span>۱۰٪ تخفیف اولین خرید</span>
      <code>wircino</code>
    </aside>
  </div>

  {/* عکس بزرگ سمت راست */}
  <div className="heroImageModern">
    <Image
      src="/publicimages/hero29.png"
      alt="دوست پشمالو"
      fill
      className="heroImageObject"
    />
  </div>
</section>




      {/* دسته‌بندی‌ها */}
      <section className="section container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">دسته‌بندی‌های محبوب</h2>
          <Link href="/categories" className="link">همه دسته‌ها</Link>
        </div>
        <div className="catGrid">
          {[
            { href: '/shop?cat=dog', title: 'سگ', img: '/publicimages/cat-dog.jpg' },
            { href: '/shop?cat=cat', title: 'گربه', img: '/publicimages/cat-cat.jpg' },
            { href: '/shop?cat=bird', title: 'پرنده', img: '/publicimages/cat-bird.jpg' },
            { href: '/shop?cat=small', title: 'حیوانات کوچک', img: '/publicimages/cat-small.jpg' },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="catCard">
              <div className="catMedia">
                <Image src={c.img} alt={c.title} fill className="catImg" />
              </div>
              <div className="catBody">
                <h3>{c.title}</h3>
                <span className="catCta">خرید <span aria-hidden>↗</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* محصولات منتخب (استاتیک تستی) */}
      <section className="section container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">منتخب امروز</h2>
          <Link href="/shop" className="link">مشاهده همه</Link>
        </div>
        <div className="prodGrid">
          {[
            { title: 'کنسرو گربه سالمون', price: '185,000', img: '/publicimages/p1.jpg' },
            { title: 'غذای خشک سگ نژاد کوچک', price: '1,150,000', img: '/publicimages/p2.jpg' },
            { title: 'اسباب‌بازی دندانی', price: '89,000', img: '/publicimages/p3.jpg' },
            { title: 'شامپو ضدگره', price: '139,000', img: '/publicimages/p4.jpg' },
            { title: 'جای خواب ارتجاعی', price: '985,000', img: '/publicimages/p5.jpg' },
            { title: 'تشویقی مرغ کم‌چرب', price: '125,000', img: '/publicimages/p6.jpg' },
          ].map((p, i) => (
            <article key={i} className="card">
              <div className="cardMedia">
                <Image src={p.img} alt={p.title} fill className="cardImg" />
              </div>
              <div className="cardBody">
                <h3 className="cardTitle">{p.title}</h3>
                <div className="cardFooter">
                  <span className="price">{p.price} تومان</span>
                  <button className="btn btn-sm">افزودن به سبد</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* چرا ورچا؟ */}
      <section className="section container">
        <h2 className="sectionTitle">چرا ورچا؟</h2>
        <ul className="features">
          <li>
            <div className="featIcon" aria-hidden>🚚</div>
            <div>
              <h3>ارسال سریع</h3>
              <p>در تهران در همان روز، سایر شهرها ۲–۳ روز کاری.</p>
            </div>
          </li>
          <li>
            <div className="featIcon" aria-hidden>🩺</div>
            <div>
              <h3>تأیید دامپزشک</h3>
              <p>محصولات منتخب با مشاوره‌ی تیم دامپزشکی.</p>
            </div>
          </li>
          <li>
            <div className="featIcon" aria-hidden>💬</div>
            <div>
              <h3>پشتیبانی واتس‌اپ</h3>
              <p>سریع‌ترین پاسخ برای انتخاب هوشمندانه.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* نوار CTA */}
      <section className="cta">
        <Image src="/publicimages/cta-banner.jpg" alt="" fill className="ctaImg" />
        <div className="ctaOverlay" />
        <div className="ctaContent container">
          <h2>اولین خریدت با ۱۰٪ تخفیف</h2>
          <p>کد: <strong>wircino</strong></p>
          <Link href="/shop" className="btn btn-light">شروع خرید</Link>
        </div>
      </section>

      {/* نظرات (ساختار ساده تستی) */}
      <section className="section container">
        <h2 className="sectionTitle">نظر مشتریان</h2>
        <div className="testiStrip">
          {[
            { name: 'بهار', text: 'سفارش من همون روز رسید، کیفیت هم عالی بود!', img: '/publicimages/u1.jpg' },
            { name: 'مانی', text: 'تشویقی‌ها رو عاشق شد! حتما دوباره می‌خرم.', img: '/publicimages/u2.jpg' },
            { name: 'درسا', text: 'قیمت‌ها منصفانه و بسته‌بندی تمیز بود.', img: '/publicimages/u3.jpg' },
          ].map((t, i) => (
            <figure key={i} className="testi">
              <div className="avatar">
                <Image src={t.img} alt={t.name} fill className="avatarImg" />
              </div>
              <blockquote>{t.text}</blockquote>
              <figcaption>— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
