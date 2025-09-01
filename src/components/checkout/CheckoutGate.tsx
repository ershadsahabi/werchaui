// F:\Shahrivar1404\Werch_app\werchaui\src\components\checkout\CheckoutGate.tsx
'use client';
import { useEffect, useState } from 'react';
import LoginModal from '@/components/LoginModal';
import styles from './CheckoutGate.module.css';
import CheckoutForm from './CheckoutForm';
import { endpoints } from '@/lib/api';

export default function CheckoutGate({ initialUser }: { initialUser: any | null }) {
  const [user, setUser] = useState<any | null>(initialUser);
  const [loginOpen, setLoginOpen] = useState(false);

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
      <section className={styles.card} dir="rtl" role="alert">
        <h2 className={styles.title}>برای ثبت سفارش وارد شوید</h2>
        <p className={styles.text}>برای ادامه‌ی فرآیند، لازم است وارد حساب کاربری شوید.</p>
        <div className={styles.actions}>
          <button className={`${styles.primaryBtn} btn btnPrimary`} onClick={() => setLoginOpen(true)}>
            ورود
          </button>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </section>
    );
  }

  return <CheckoutForm />;
}
