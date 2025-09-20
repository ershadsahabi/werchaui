import Image from "next/image";
import styles from "./contact.module.css";
import { CONTACT } from "@/lib/contact";
import Link from "next/link";

export const metadata = {
  title: "تماس با ما | Wircino",
  description: "راه‌های ارتباط با Wircino",
};

const CONTACT_MEDIA_SRC = "/publicimages/contact/contact1.png";

export default function ContactPage() {
  const c = CONTACT;

  return (
    <main className={`container ${styles.page}`} dir="rtl">
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.bc}>
            <Link href="/" className={styles.bcLink}>خانه</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcHere}>تماس</span>
          </div>

          <h1 className={styles.title}>تماس با ما</h1>
          <p className={styles.lead}>
            سریع‌ترین راه ارتباط با {c.brand}. {c.slogan}
          </p>
        </div>
      </section>

      {/* Grid: تصویر چپ، کارت‌ها راست */}
      <section className={`${styles.grid} ${styles.gridAfterHero}`}>
        <div className={styles.rightCol}>
          {/* ارتباط مستقیم */}
          <div className={`${styles.card} ${styles.cardMain}`}>
            <h2 className={styles.h2}>ارتباط مستقیم</h2>

            <a className={styles.rowBtn} href={`tel:${c.phone.raw}`}>
              {iconPhone()}<div><strong></strong><span>{c.phone.label}</span></div>
            </a>

            <a className={styles.rowBtn} href={`https://wa.me/${c.whatsapp.raw.replace(/^\+/, "")}`} target="_blank">
              {iconWhatsApp()}<div><strong></strong><span>{c.whatsapp.label}</span></div>
            </a>

            <a className={styles.rowBtn} href={`mailto:${c.email}`}>
              {iconMail()}
              <div>
                <strong></strong>
                <span className={styles.ltr} dir="ltr">{c.email}</span>
              </div>
            </a>

            <div className={styles.metaRow}>
              <span className={styles.label}>ساعت کاری</span>
              <span className={styles.value}>{c.workHours}</span>
            </div>
            <address className={styles.address}>
              <span className={styles.label}>آدرس</span>
              <div className={styles.addrLines}>
                {c.addressLines.map((ln, i) => (<span key={i}>{ln}</span>))}
              
              </div>
            </address>
            <div className={styles.linksRow}>
              <Link href={c.legal.terms}>قوانین</Link>
              <span>•</span>
              <Link href={c.legal.privacy}>حریم خصوصی</Link>
              <span>•</span>
              <Link href={c.nav.faq}>سؤالات متداول</Link>
            </div>
          </div>
        </div>

        {/* تصویر */}
        <figure className={`${styles.card} ${styles.mediaCard}`}>
          <Image
            className={styles.mediaImg}
            src={CONTACT_MEDIA_SRC}
            alt="پت‌شاپ Wircino با حیوانات شاد جلوی قفسه‌ها"
            width={1200}
            height={1600}
            priority
          />
        </figure>
      </section>
    </main>
  );
}

/* === Icons === */
function iconBase(path: string, size=18) {
  return <svg width={size} height={size} viewBox="0 0 24 24"><path d={path} fill="currentColor" /></svg>;
}
const iconPhone=(s=18)=>iconBase("M6.6 10.8c1.4 2.6 3.9 5.1 6.5 6.5l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .7 3 .8.6.1 1 .6 1 1.2V20c0 1.1-.9 2-2 2C8.7 22 2 15.3 2 6c0-1.1.9-2 2-2h3.1c.6 0 1.1.4 1.2 1 .2 1 .5 2 1 3 .1.4 0 .9-.2 1.2l-2.5 2.6z",s);
const iconWhatsApp=(s=18)=>iconBase("M20 3.9A9.9 9.9 0 0 0 3.6 17.3L3 21l3.8-1A9.9 9.9 0 1 0 20 3.9zm-7.3 3.6c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.6s1.6 4.2 1.8 4.5c.2.3 3 4.7 7.4 2.9 4.4-1.8 2.7-5.4 2.5-5.7-.2-.3-.6-.5-1.2-.8s-1.2-.4-1.4 0-.4 1.2-.8 1.4c-.4.2-.7.1-1.2-.2-.5-.3-2-1-3.2-2.5-1.1-1.4-1.4-2.4-1.6-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.2-1.1z",s);
const iconMail=(s=18)=>iconBase("M2 6c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 .4l8 5.3 8-5.3V6H4v.4z",s);
const iconInstagram=(s=18)=>iconBase("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",s);
const iconTelegram=(s=18)=>iconBase("M21.94 4.66c.25-1.02-.82-1.87-1.77-1.42L2.9 11.1c-1.03.49-.9 2 .2 2.28l4.93 1.32 1.83 5.83c.35 1.13 1.86 1.2 2.33.1l2.7-6.33 5.1-9.64c.1-.2.15-.41.15-.6z",s);
const iconX=(s=18)=>iconBase("M16.98 2H20l-7.5 8.56L20.7 22h-7.32l-5.13-6.7-5.8 6.7H2.4L10.2 12 2 2h7.5l4.67 6.18L16.98 2z",s);
const iconShield=(s=18)=>iconBase("M12 2l8 4v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4z",s);
const iconTruck=(s=18)=>iconBase("M3 5h11v9H3V5zm13 3h3ل3 3v3h-2a2 2 0 1 1-4 0h-2V8zm-9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 .001-4.001A2 2 0 0 0 17 17z",s);
const iconHeart=(s=18)=>iconBase("M12 21s-7-4.35-9.33-8.27C.53 9.26 2.24 5.5 6 5.5c1.8 0 3.1 1 4 2 0 0 2-2 4-2 3.76 0 5.47 3.76 3.33 7.23C19 16.65 12 21 12 21z",s);
