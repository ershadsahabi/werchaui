// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import { useCartCount } from "@/store/cart";
import { useCartUI } from "@/store/cart-ui";
import CartModal from "./cart/CartModal";
import SearchBox from "./search/SearchBox";

type HeaderProps = {
  initialUser: any | null;
  cartCount?: number;
  initialTheme?: "light" | "dark";
  logoSrc: string; // از سرور می‌آید تا SSR/Client یکسان شوند
};

export default function Header({
  initialUser,
  cartCount = 0,
  initialTheme = "dark",
  logoSrc,
}: HeaderProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const user = initialUser;
  const liveCount = useCartCount();
  const effectiveCount = (liveCount ?? cartCount) || 0;
  const openCart = useCartUI((s) => s.openCart);

  // جلوگیری از اسکرول پشت دراور موبایل
  useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  // بستن دراور با Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${styles.header} ${open ? styles.headerOpen : ""}`} role="banner">
      <div className={`${styles.inner} container`}>
        {/* برند */}
<Link href="/" className={styles.logo} aria-label="خانه ورچه">
<Image
  src={logoSrc}
  alt=""
  width={0}
  height={0}
  sizes="2.5rem"
  className={styles.logoImg}
/>

</Link>


        {/* سرچ دسکتاپ */}
        <div className={styles.search} role="search" aria-label="جستجو در فروشگاه" dir="rtl">
          <SearchBox
            id="hdr-desktop"
            className=""
            inputClassName={styles.searchInput}
            buttonClassName={styles.searchBtn}
            placeholder="جستجوی محصول، برند، دسته…"
          />
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
              <span className={styles.cartBadge} aria-live="polite" aria-atomic="true">
                {effectiveCount}
              </span>
            )}
          </button>

          {/* 🌓 تم */}
          <ThemeToggle initialTheme={initialTheme} />

          {user ? (
            <div className={styles.user}>
              <span className={styles.email} title={user.email}>
                {user.email}
              </span>
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
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* دراور موبایل */}
      <div
        id="mobile-drawer"
        className={`${styles.navMobile} ${open ? styles.navMobileOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
      >
        <div className="container">
          {/* دکمه بستن */}
          <div className={styles.drawerClose}>
            <button
              className={styles.burger}
              aria-label="بستن منو"
              aria-expanded={true}
              type="button"
              onClick={() => setOpen(false)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className={styles.mobileTop}>
            {/* سرچ موبایل */}
            <div className={styles.searchMobile} role="search" dir="rtl">
              <SearchBox
                id="hdr-mobile"
                inputClassName={styles.searchInput}
                buttonClassName={styles.searchBtn}
                placeholder="جستجو…"
                onSubmitted={() => setOpen(false)}
              />
            </div>

            <div className={styles.quickActions}>
              <Link href="/wishlist" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconHeart}
                <span>علاقه‌مندی</span>
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className={styles.quickAction}>
                {iconCart}
                <span>سبد خرید</span>
                {effectiveCount > 0 && <span className={styles.cartBadge}>{effectiveCount}</span>}
              </Link>
            </div>
          </div>

          <nav className={styles.navList} aria-label="منوی موبایل">
            <Link href="/shop" onClick={() => setOpen(false)}>
              فروشگاه
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              بلاگ
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              تماس
            </Link>

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
                  onClick={() => {
                    setLoginOpen(true);
                    setOpen(false);
                  }}
                >
                  ورود
                </button>
                <button
                  className={`${styles.authBtn} ${styles.authPrimary}`}
                  type="button"
                  onClick={() => {
                    setRegisterOpen(true);
                    setOpen(false);
                  }}
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
const iconHeart = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M12 21s-6.5-4.35-9-7.87C1 10.5 2.5 7 6 7c2 0 3 .8 4 2 1-1.2 2-2 4-2 3.5 0 5 3.5 3 6.13C18.5 16.65 12 21 12 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const iconCart = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="8.5" cy="20" r="1.8" fill="currentColor" />
    <circle cx="17.5" cy="20" r="1.8" fill="currentColor" />
    <path
      d="M3 4h3l1.5 9.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 1.9-1.3l2.1-6.7H7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 16h7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
  </svg>
);
