// components/Header.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';
import { useCartCount } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';
import CartModal from './cart/CartModal';

type HeaderProps = {
  initialUser: any | null;
  cartCount?: number;
  initialTheme?: "light" | "dark";
};

export default function Header({ initialUser, cartCount = 0, initialTheme = "dark"}: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch] = useState(false); // در صورت نیاز می‌تونی اینو فعال‌سازی کنی
  const user = initialUser;
  const liveCount = useCartCount();
  const effectiveCount = (liveCount ?? cartCount) || 0;
  const openCart = useCartUI((s) => s.openCart);

  // جلوگیری از اسکرول پشت دراور موبایل
  useEffect(() => {
    if (open) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  // بستن دراور با Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // اینجا می‌تونی ریدایرکت به صفحهٔ جستجو انجام بدی، مثلاً:
    // const q = new FormData(e.currentTarget).get('q')?.toString().trim();
    // if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`${styles.header} ${open ? styles.headerOpen : ''}`} role="banner">
      <div className={`${styles.inner} container`}>

        {/* برند */}
        <Link href="/" className={styles.logo} aria-label="خانه ورچه">
          <Image
            src="/publicimages/logo21.png"
            alt=""           // alt خالی چون لینک دارای aria-label است (پرهیز از تکرار)
            width={44}
            height={44}
            priority
            className={styles.logoImg}
          />
        </Link>

        {/* سرچ دسکتاپ */}
        <form
          className={`${styles.search} ${showSearch ? styles.searchOpen : ''}`}
          role="search"
          aria-label="جستجو در فروشگاه"
          dir="rtl"
          onSubmit={onSearchSubmit}
        >
          <input
            className={styles.searchInput}
            name="q"
            placeholder="جستجوی محصول، برند، دسته…"
            aria-label="جستجو"
            // از رینگ سفارشی استفاده می‌کنیم؛ outline پیش‌فرض در globals خاموش می‌شود (پایین توضیح دادم)
          />
          <button type="submit" className={styles.searchBtn} aria-label="جستجو">
            {iconSearch}
          </button>
        </form>

        {/* ناوبری دسکتاپ */}
        <nav className={styles.navDesktop} aria-label="ناوبری اصلی">
          <Link href="/shop">فروشگاه</Link>
          <Link href="/blog">بلاگ</Link>
          <Link href="/contact">تماس</Link>
        </nav>

        {/* اکشن‌ها */}
        <div className={styles.actions}>
          <Link href="/wishlist" className={styles.iconBtn} aria-label="علاقه‌مندی‌ها">
            {iconHeart}
          </Link>

          {/* دکمهٔ سبد خرید - دسکتاپ */}
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            aria-label="سبد خرید"
            onClick={openCart}
          >
            {iconCart}
            {effectiveCount > 0 && (
              <span className={styles.cartBadge} aria-live="polite" aria-atomic="true">
                {effectiveCount}
              </span>
            )}
          </button>

          {/* 🌓 تم */}
        <ThemeToggle initialTheme={initialTheme} />

          {user ? (
            <div className={styles.user}>
              <span className={styles.email} title={user.email}>{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <>
              <button
                className={styles.authBtn}
                data-auth="login"
                type="button"
                onClick={() => setLoginOpen(true)}
              >
                ورود
              </button>
              <button
                className={`${styles.authBtn} ${styles.authPrimary}`}
                data-auth="register"
                type="button"
                onClick={() => setRegisterOpen(true)}
              >
                ثبت‌نام
              </button>
            </>
          )}

          {/* برگر (موبایل) */}
          <button
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* دراور موبایل */}
      <div
        id="mobile-drawer"
        className={`${styles.navMobile} ${open ? styles.navMobileOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
      >
        <div className="container">
          {/* دکمه بستن همیشه قابل مشاهده (sticky) */}
          <div className={styles.drawerClose}>
            <button
              className={styles.burger}
              aria-label="بستن منو"
              aria-expanded={true}
              type="button"
              onClick={() => setOpen(false)}
            >
              <span /><span /><span />
            </button>
          </div>

          <div className={styles.mobileTop}>
            <form className={styles.searchMobile} role="search" onSubmit={onSearchSubmit}>
              <input
                className={styles.searchInput}
                name="q"
                placeholder="جستجو…"
                aria-label="جستجو"
                dir="rtl"
              />
              <button type="submit" className={styles.searchBtn} aria-label="جستجو">
                {iconSearch}
              </button>
            </form>

            <div className={styles.quickActions}>
              <Link href="/wishlist" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconHeart}<span>علاقه‌مندی</span>
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconCart}<span>سبد خرید</span>
                {effectiveCount > 0 && <span className={styles.cartBadge}>{effectiveCount}</span>}
              </Link>
            </div>
          </div>

          <nav className={styles.navList} aria-label="منوی موبایل">
            <Link href="/shop" onClick={() => setOpen(false)}>فروشگاه</Link>
            <Link href="/blog" onClick={() => setOpen(false)}>بلاگ</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>تماس</Link>

            {user ? (
              <div className={styles.userMobile}>
                <span className={styles.email}>{user.email}</span>
                <LogoutButton />
              </div>
            ) : (
              <div className={styles.authRow}>
                <button
                  className={styles.authBtn}
                  type="button"
                  onClick={() => { setLoginOpen(true); setOpen(false); }}
                >
                  ورود
                </button>
                <button
                  className={`${styles.authBtn} ${styles.authPrimary}`}
                  type="button"
                  onClick={() => { setRegisterOpen(true); setOpen(false); }}
                >
                  ثبت‌نام
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* مودال‌ها */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <CartModal />
    </header>
  );
}

/* ===== Icons (decorative) ===== */
const iconSearch = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const iconHeart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M12 21s-6.5-4.35-9-7.87C1 10.5 2.5 7 6 7c2 0 3 .8 4 2 1-1.2 2-2 4-2 3.5 0 5 3.5 3 6.13C18.5 16.65 12 21 12 21Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const iconCart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <circle cx="9" cy="21" r="1.8" fill="currentColor" />
    <circle cx="18" cy="21" r="1.8" fill="currentColor" />
    <path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6.2"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
