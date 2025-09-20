// components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Props = {
  /** مقدار SSR؛ از layout via Header پاس داده می‌شود */
  initialTheme?: "light" | "dark";
};

export default function ThemeToggle({ initialTheme = "dark" }: Props) {
  // SSR و کلاینت از یک مقدار مشترک شروع می‌کنند → بدون mismatch
  const [isLight, setIsLight] = useState(initialTheme === "light");

  // در mount، DOM و localStorage را با state همگام کن (یک‌بار)
  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
    try {
      localStorage.setItem("theme", isLight ? "light" : "dark");
    } catch {}
    // sync بین تب‌ها
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const wantLight = e.newValue === "light";
        document.documentElement.classList.toggle("light", wantLight);
        setIsLight(wantLight);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // کوکی تم را بنویس (۱ سال)
  const setThemeCookie = (val: "light" | "dark") => {
    // توجه: اگر ساب‌دامین‌ها دارید، می‌توانید `; Domain=.example.com` اضافه کنید
    document.cookie = `theme=${val}; Max-Age=31536000; Path=/; SameSite=Lax`;
  };

  const toggleTheme = () => {
    const next = !isLight;
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
    setThemeCookie(next ? "light" : "dark");
    setIsLight(next);
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="تغییر حالت روز و شب"
      type="button"
    >
      <span className={`${styles.slider} ${isLight ? styles.slideRight : ""}`} />
      {/* suppressHydrationWarning برای اطمینان، ولی چون SSR=CSR است معمولاً لازم نمی‌شود */}
      <span className={styles.icon} suppressHydrationWarning>
        {isLight ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
