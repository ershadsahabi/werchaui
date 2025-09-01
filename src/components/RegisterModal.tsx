'use client';
import { useEffect, useRef } from 'react';
import modal from './Modal.module.css';
import RegisterForm from './RegisterForm';

export default function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstFocus = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      window.addEventListener('keydown', onKey);
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
      aria-labelledby="registerTitle"
      aria-describedby="registerDesc"
    >
      <button
        className={modal.backdrop}
        onClick={onClose}
        aria-label="بستن پنجره"
      />
      <div className={modal.sheet}>
        <div className={`${modal.card} ${modal.elevated} card`}>
          <div className={modal.header}>
            <h3 id="registerTitle">
              ساخت حساب <span className={modal.badge}>WERCHA</span>
            </h3>
            <button
              className={modal.closeBtn}
              onClick={onClose}
              ref={firstFocus}
              aria-label="بستن"
            >
              ✕
            </button>
          </div>
          <p id="registerDesc" className={modal.subhead}>
            تنها چند ثانیه تا شروع خرید از پت‌شاپ اینترنتی!
          </p>
          <div className={modal.body}>
            <RegisterForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
