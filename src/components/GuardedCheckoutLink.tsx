'use client';
import { useCallback, useState } from 'react';
import LoginModal from '@/components/LoginModal';
import { endpoints } from '@/lib/api';

type Props = Omit<React.ComponentProps<'a'>, 'href'> & {
  href?: string;              // پیش‌فرض /checkout
  className?: string;
  children: React.ReactNode;
};

export default function GuardedCheckoutLink({
  href = '/checkout',
  className,
  children,
  ...rest
}: Props) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkMe = useCallback(async () => {
    try {
      const r = await fetch(endpoints.me, { credentials: 'include', cache: 'no-store' });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }, []);

  // ناوبری قطعی به چک‌اوت + اعلان برای هماهنگی هدر
  const goCheckout = useCallback(() => {
    try { window.dispatchEvent(new CustomEvent('auth:changed', { detail: { loggedIn: true } })); } catch {}
    if (typeof window !== 'undefined') window.location.assign(href);
  }, [href]);

  const handleClick = useCallback(async (e?: React.MouseEvent) => {
    // همیشه پیش‌فرض رو می‌گیریم تا خودمون تصمیم بگیریم کجا بریم
    if (e) e.preventDefault();
    if (checking) return;
    setChecking(true);
    const me = await checkMe();
    setChecking(false);
    if (me) {
      goCheckout();         // ← هارد ناوبری ⇒ SSR هدر را آپدیت می‌کند
    } else {
      setLoginOpen(true);   // ← مودال ورود
    }
  }, [checkMe, checking, goCheckout]);

  const handleModalClose = useCallback(async () => {
    setLoginOpen(false);
    // بعد از بستن مودال دوباره چک؛ اگر لاگین شدی برو چک‌اوت
    const me = await checkMe();
    if (me) goCheckout();
  }, [checkMe, goCheckout]);

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={handleClick}
        aria-disabled={checking || undefined}
        {...rest}
      >
        {children}
      </a>

      <LoginModal open={loginOpen} onClose={handleModalClose} />
    </>
  );
}
