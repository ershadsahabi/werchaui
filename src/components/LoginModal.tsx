'use client';
import { useEffect, useRef } from 'react';
import s from './AuthModal.module.css';
import LoginForm from './LoginForm';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflowHtml = document.documentElement.style.overflow;
    const prevOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const root = cardRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) { (last as HTMLElement).focus(); e.preventDefault(); }
        } else {
          if (active === last || !root.contains(active)) { (first as HTMLElement).focus(); e.preventDefault(); }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    setTimeout(() => (closeRef.current?.focus() ?? cardRef.current?.focus()), 0);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflowHtml;
      document.body.style.overflow = prevOverflowBody;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={s.wrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginTitle"
      aria-describedby="loginDesc"
      dir="rtl"
    >
      <button className={s.backdrop} onClick={onClose} aria-label="بستن پنجره" />
      <div className={s.sheet}>
        <div ref={cardRef} tabIndex={-1} className={`${s.card} ${s.elevated}`} role="document">
          <div className={s.header}>
            <h3 id="loginTitle" className={s.title}>ورود به حساب <span className={s.badge}>WIRCINO</span></h3>
            <button
              className={s.closeBtn}
              onClick={onClose}
              ref={closeRef}
              aria-label="بستن"
              title="بستن پنجره"
              type="button"
            >
              ✕
            </button>
          </div>

          <p id="loginDesc" className={s.subhead}>با ایمیل یا شماره موبایل وارد شوید.</p>

          <div className={s.body}>
            <LoginForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
