// components/Header.tsx
'use client';

import { useState } from 'react';
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
};

export default function Header({ initialUser, cartCount = 0 }: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const user = initialUser;
  const liveCount = useCartCount();
  const effectiveCount = liveCount ?? cartCount;
  const openCart = useCartUI((s) => s.openCart);

  return (
    <header className={`${styles.header} ${open ? styles.headerOpen : ''}`} role="banner">
      <div className={`${styles.inner} container`}>
        {/* برند */}
        <Link href="/" className={styles.logo} aria-label="خانه ورچه">
          <Image src="/publicimages/logo21.png" alt="" width={36} height={36} />
        </Link>

        {/* سرچ دسکتاپ */}
        <div className={`${styles.search} ${showSearch ? styles.searchOpen : ''}`}>
          <input
            className={styles.searchInput}
            placeholder="جستجوی محصول، برند، دسته…"
            dir="rtl"
            aria-label="جستجو در فروشگاه"
          />
          <button className={styles.searchBtn} aria-label="جستجو">
            {iconSearch}
          </button>
        </div>

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
              <span className={styles.cartBadge} aria-live="polite">{effectiveCount}</span>
            )}
          </button>

          {/* 🌓 تم */}
          <ThemeToggle />

          {user ? (
            <div className={styles.user}>
              <span className={styles.email} title={user.email}>{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <>
              <button className={styles.authBtn} onClick={() => setLoginOpen(true)}>ورود</button>
              <button
                className={`${styles.authBtn} ${styles.authPrimary}`}
                onClick={() => setRegisterOpen(true)}
              >
                ثبت‌نام
              </button>
            </>
          )}

          <button
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label="باز/بستن منو"
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* دراور موبایل */}
      <div
        id="mobile-drawer"
        className={`${styles.navMobile} ${open ? styles.navMobileOpen : ''}`}
      >
        <div className="container">
          {/* دکمه بستن همیشه قابل مشاهده (sticky) */}
          <div className={styles.drawerClose}>
            <button
              className={styles.burger}
              aria-label="بستن منو"
              aria-expanded={true}
              onClick={() => setOpen(false)}
            >
              <span /><span /><span />
            </button>
          </div>

          <div className={styles.mobileTop}>
            <div className={styles.searchMobile}>
              <input
                className={styles.searchInput}
                placeholder="جستجو…"
                dir="rtl"
                aria-label="جستجو"
              />
              <button className={styles.searchBtn} aria-label="جستجو">{iconSearch}</button>
            </div>

            <div className={styles.quickActions}>
              <Link href="/wishlist" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconHeart}<span>علاقه‌مندی</span>
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconCart}<span>سبد خرید</span>
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
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
                  onClick={() => { setLoginOpen(true); setOpen(false); }}
                >
                  ورود
                </button>
                <button
                  className={`${styles.authBtn} ${styles.authPrimary}`}
                  onClick={() => { setRegisterOpen(true); setOpen(false); }}
                >
                  ثبت‌نام
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      <CartModal />
    </header>
  );
}

const iconSearch = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const iconHeart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s-6.5-4.35-9-7.87C1 10.5 2.5 7 6 7c2 0 3 .8 4 2 1-1.2 2-2 4-2 3.5 0 5 3.5 3 6.13C18.5 16.65 12 21 12 21Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const iconCart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="21" r="1.8" fill="currentColor" />
    <circle cx="18" cy="21" r="1.8" fill="currentColor" />
    <path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6.2"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
