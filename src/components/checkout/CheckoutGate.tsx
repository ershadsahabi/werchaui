'use client';
import { useEffect, useState } from 'react';
import LoginModal from '@/components/LoginModal';
import styles from './CheckoutGate.module.css';
import CheckoutForm from './CheckoutForm';
import { endpoints } from '@/lib/api';

export default function CheckoutGate({ initialUser }: { initialUser: any | null }) {
  const [user, setUser] = useState<any | null>(initialUser);
  const [loginOpen, setLoginOpen] = useState(false);

  // اگر در همین صفحه لاگین/لاگ‌اوت شد، به‌روز شو
  useEffect(() => {
    const onAuth = async () => {
      try {
        const r = await fetch(endpoints.me, { credentials: 'include', cache: 'no-store' });
        setUser(r.ok ? await r.json() : null);
      } catch {}
    };
    window.addEventListener('auth:changed', onAuth);
    return () => window.removeEventListener('auth:changed', onAuth);
  }, []);

  if (!user) {
    return (
      <div className={styles.card} dir="rtl" role="alert">
        <h2 className={styles.title}>برای ثبت سفارش وارد شوید</h2>
        <p className={styles.text}>برای ادامه‌ی فرآیند، لازم است وارد حساب کاربری شوید.</p>
        <button className="btn btnPrimary" onClick={() => setLoginOpen(true)}>ورود</button>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    );
  }

  return <CheckoutForm />;
}
