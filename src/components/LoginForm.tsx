'use client';
import { useState, useRef, useEffect } from 'react';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import form from './Form.module.css';
import { useRouter } from 'next/navigation';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const r = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => { idRef.current?.focus(); }, []);

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!identifier || !password) {
    setError('ایمیل/نام‌کاربری و رمز عبور را وارد کنید.');
    return;
  }
  setError(null); setLoading(true);
  try {
    await postWithCsrf(endpoints.login, { identifier, password });

    await new Promise((r) => setTimeout(r, 80));
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: { loggedIn: true } }));

    onSuccess?.();      // بستن مودال (همونی که قبلاً داشتی)
    r.refresh();        // برای هدر/لی‌اوت SSR
  } catch (err: any) {
    setError(err?.message || 'ورود ناموفق بود.');
  } finally { setLoading(false); }
}


  return (
    <form onSubmit={onSubmit} className={form.form} dir="rtl" aria-label="فرم ورود">
      <div className={form.row}>
        <span className={form.icon} aria-hidden>📧</span>
        <input
          ref={idRef}
          className={`${form.input} input`}
          placeholder="ایمیل یا نام‌کاربری"
          value={identifier}
          onChange={(e)=>setIdentifier(e.target.value)}
          autoComplete="username"
          inputMode="email"
        />
      </div>

      <div className={form.row}>
        <span className={form.icon} aria-hidden>🔒</span>
        <input
          className={`${form.input} input`}
          type={showPw ? 'text' : 'password'}
          placeholder="رمز عبور"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          type="button"
          className={form.pwToggle}
          onClick={() => setShowPw(s => !s)}
          aria-label={showPw ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
        >
          {showPw ? '🙈' : '👁️'}
        </button>
      </div>

      <div className={form.helper}>
        <label>
          <input type="checkbox" /> مرا به خاطر بسپار
        </label>
        <a className={form.link} href="/forgot">فراموشی رمز؟</a>
      </div>

      {error && <p className={form.error}>{error}</p>}

      <div className={form.actions}>
<button
  type="submit"
  data-variant="primary"
  className={form.btnFull}
  disabled={loading}
>
  {loading ? 'در حال ورود…' : 'ورود'}
</button>

      </div>
    </form>
  );
}
