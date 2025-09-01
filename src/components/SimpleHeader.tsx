'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SimpleHeader.module.css';

import ThemeToggle from './ThemeToggle';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LogoutButton from './LogoutButton';
import CartModal from './cart/CartModal';

import { useCartCount } from '@/store/cart';
import { useCartUI } from '@/store/cart-ui';

type Props = {
  initialUser: any | null;     // مثل Header قبلی
  cartCount?: number;          // fallback برای SSR
};

export default function SimpleHeader({ initialUser, cartCount = 0 }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const user = initialUser;

  // شمارش زنده سبد (state client) + fallback
  const liveCount = useCartCount();
  const effectiveCount = liveCount ?? cartCount;

  // باز کردن سبد با Store قبلی
  const openCart = useCartUI((s) => s.openCart);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header} role="banner">
      <div className={`${styles.inner} container`}>

        {/* برند */}
        <Link href="/" className={styles.logo} aria-label="خانه">
          <Image src="/publicimages/logo21.png" alt="" width={32} height={32} priority />
          <span className={styles.brand}>ورچه</span>
        </Link>

        {/* سرچ دسکتاپ */}
        <form className={styles.search} role="search" aria-label="جستجو در سایت" onSubmit={(e)=>e.preventDefault()}>
          <input
            className={styles.searchInput}
            placeholder="جستجو…"
            dir="rtl"
            aria-label="جستجو"
          />
          <button className={styles.searchBtn} aria-label="جستجو">
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
          {/* علاقه‌مندی‌ها */}
          <Link href="/wishlist" className={styles.iconBtn} aria-label="علاقه‌مندی‌ها">
            {iconHeart}
          </Link>

          {/* سبد خرید (باز شدن با Store) */}
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            aria-label="سبد خرید"
            onClick={openCart}
          >
            {iconCart}
            {effectiveCount > 0 && <span className={styles.cartBadge}>{effectiveCount}</span>}
          </button>

          {/* 🌓 تم */}
          <ThemeToggle />

          {/* Auth / User */}
          {user ? (
            <div className={styles.user}>
              <span className={styles.email} title={user.email}>{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className={styles.authInline}>
              <button className={styles.authBtn} onClick={() => setLoginOpen(true)}>ورود</button>
              <button className={`${styles.authBtn} ${styles.authPrimary}`} onClick={() => setRegisterOpen(true)}>ثبت‌نام</button>
            </div>
          )}

          {/* برگر: فقط در موبایل/تبلت نمایش داده می‌شود */}
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="باز/بستن منو"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* سرچ ساده‌ی موبایل (زیر هدر) */}
      <form className={styles.searchMobile} role="search" aria-label="جستجو" onSubmit={(e)=>e.preventDefault()}>
        <input className={styles.searchInput} placeholder="جستجو…" dir="rtl" aria-label="جستجو"/>
        <button className={styles.searchBtn} aria-label="جستجو">
          {iconSearch}
        </button>
      </form>

      {/* منوی موبایل ساده (بدون اُورلی) */}
      <nav
        id="mobile-menu"
        className={`${styles.navMobile} ${menuOpen ? styles.navMobileOpen : ''}`}
        aria-label="منوی موبایل"
      >
        <Link href="/shop" onClick={closeMenu}>فروشگاه</Link>
        <Link href="/blog" onClick={closeMenu}>بلاگ</Link>
        <Link href="/contact" onClick={closeMenu}>تماس</Link>

        {user ? (
          <div className={styles.userMobile}>
            <span className={styles.email}>{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className={styles.authRow}>
            <button className={styles.authBtn} onClick={()=>{ setLoginOpen(true); closeMenu(); }}>ورود</button>
            <button className={`${styles.authBtn} ${styles.authPrimary}`} onClick={()=>{ setRegisterOpen(true); closeMenu(); }}>ثبت‌نام</button>
          </div>
        )}
      </nav>

      {/* مودال‌ها و کارت */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <CartModal />
    </header>
  );
}

/* آیکن‌ها */
const iconSearch = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const iconHeart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s-6.5-4.35-9-7.87C1 10.5 2.5 7 6 7c2 0 3 .8 4 2 1-1.2 2-2 4-2 3.5 0 5 3.5 3 6.13C18.5 16.65 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const iconCart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="21" r="1.8" fill="currentColor"/>
    <circle cx="18" cy="21" r="1.8" fill="currentColor"/>
    <path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
