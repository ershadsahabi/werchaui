'use client';

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo" dir="rtl">
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerCols}>
          {/* ستون‌ها
             - مثال استفاده بعداً:
             <div>
               <h3>خرید</h3>
               <ul>
                 <li><Link href="/shop">فروشگاه</Link></li>
                 <li><Link href="/categories">دسته‌بندی‌ها</Link></li>
               </ul>
             </div>
          */}
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} Wircino — همه حقوق محفوظ است.
          </span>

          <div className={styles.footerBottomLinks}>
            <Link href="/terms">قوانین</Link>
            <span className={styles.dot} aria-hidden="true">•</span>
            <Link href="/privacy">حریم خصوصی</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
