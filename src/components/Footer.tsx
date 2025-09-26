"use client";

import styles from "./Footer.module.css";
import { CONTACT } from "@/lib/contact";

const BENEFITS = [
  { icon: "✅", text: "تضمین اصالت کالا" },
  { icon: "🚚", text: "ارسال سریع و مطمئن" },
  { icon: "📝", text: "بلاگ (مقالات)" },
  { icon: "💬", text: "پشتیبانی واقعی" },
  { icon: "🔄", text: "مرجوعی آسان" },
];

export default function Footer() {
  const y = new Date().getFullYear(); // SSR only → hydration safe
  const c = CONTACT;

  return (
    <footer className={styles.footer} role="contentinfo" dir="rtl">
      <div className={styles.topLine} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        {/* نوار مزایا (marquee نرم و قابل ایست با hover/focus) */}
        <section className={styles.benefits} aria-label="مزایای فروشگاه">
          <div className={styles.benefitsTrack} aria-hidden="true">
            {[...BENEFITS, ...BENEFITS].map((b, i) => (
              <div className={styles.benefit} key={i}>
                <span className={styles.benefitIcon} aria-hidden="true">
                  {b.icon}
                </span>
                <span className={styles.benefitText}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* نسخهٔ فقط برای صفحه‌خوان (بدون تکرار) */}
          <ul className="visually-hidden">
            {BENEFITS.map((b) => (
              <li key={b.text}>{b.text}</li>
            ))}
          </ul>
        </section>

        <p className={styles.bottomBlurb}>
          <span className={styles.blurbIcon} aria-hidden="true">🐶</span>
          شادی پت‌هامون، خوشحالی دل ماست
          <span className={styles.blurbIcon} aria-hidden="true">🐱</span>
          <span className={styles.blurbHeart} aria-hidden="true">💖</span>
        </p>

        {/* پایین فوتر: کپی‌رایت + شبکه‌ها */}
        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {y} {c.brand} — همه حقوق محفوظ است.
          </span>

          <div className={styles.social} aria-label="شبکه‌های اجتماعی">
            <a
              href={c.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اینستاگرام"
              title="Instagram"
            >
              <span data-label="اینستاگرام">{iconInstagram}</span>
            </a>
            <a
              href={c.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              title="X"
            >
              <span data-label="X">{iconX}</span>
            </a>
            <a
              href={c.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تلگرام"
              title="Telegram"
            >
              <span data-label="تلگرام">{iconTelegram}</span>
            </a>
            <a
              href={c.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساپ"
              title="WhatsApp"
            >
              <span data-label="واتساپ">{iconWhatsapp}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* آیکن‌های مینیمال (currentColor) */
function iconBase(path: string, size = 18) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} fill="currentColor" />
    </svg>
  );
}
const iconInstagram = iconBase(
  "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z"
);
const iconTelegram = iconBase(
  "M21.9 5.3L3.8 12.3c-1 .4-1 1.7.1 2l4.5 1.4 1.7 5c.2 .7 1.1 .8 1.5 .2l2.4-3.3 4.7 3.4c.6 .5 1.5 .1 1.7-.7l2.8-13c.3-1-0.7-1.8-1.3-1.4z"
);
const iconX = iconBase(
  "M18 3l-5 6.5L8 3H5l7 9-7 9h3l5-6.5L19 21h3l-7-9 7-9z"
);
const iconWhatsapp = iconBase(
  "M16.7 11.4c-.3-.2-1.7-.9-1.9-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.5-1.6-1-1-1.6-1.9-1.8-2.2s0-.5.1-.7.2-.4.3-.5.1-.3 0-.5c0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.5s1.1 2.9 1.2 3.1 2.2 3.3 5.2 4.6c.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3s.3-1.1.2-1.3c-.1-.2-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z",
  20
);
