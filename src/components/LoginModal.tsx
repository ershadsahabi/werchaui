'use client';
import { useEffect, useRef } from 'react';
import modal from './Modal.module.css';
import LoginForm from './LoginForm';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstFocus = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', onKey);
      // تأخیر کوچک برای فوکوس و جلوگیری از پرش
      setTimeout(() => firstFocus.current?.focus(), 0);
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={modal.wrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginTitle"
      aria-describedby="loginDesc"
      dir="rtl"
    >
      {/* Backdrop (کلیک برای بستن) */}
      <button
        className={modal.backdrop}
        onClick={onClose}
        aria-label="بستن پنجره"
        title="بستن"
      />
      <div className={modal.sheet}>
        {/* کارت اصلی مودال */}
        <div ref={cardRef} className={`${modal.card} ${modal.elevated} card`}>
          <div className={modal.header}>
            <h3 id="loginTitle">
              ورود به حساب <span className={modal.badge}>WERCHA</span>
            </h3>
            <button
              className={modal.closeBtn}
              onClick={onClose}
              ref={firstFocus}
              aria-label="بستن"
              title="بستن پنجره"
            >
              ✕
            </button>
          </div>

          <p id="loginDesc" className={modal.subhead}>
            با ایمیل یا شماره موبایل وارد شوید.
          </p>

          <div className={modal.body}>
            {/* فرم لاگین (بدون تغییر منطقی) */}
            <LoginForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
