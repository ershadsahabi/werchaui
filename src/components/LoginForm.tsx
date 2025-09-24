'use client';
import { useState, useRef, useEffect, useId } from 'react';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import s from './AuthModal.module.css';
import { useRouter } from 'next/navigation';

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const r = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const formId = useId();
  const idInputId = `${formId}-identifier`;
  const pwInputId = `${formId}-password`;
  const errId = `${formId}-error`;

  useEffect(() => { idRef.current?.focus(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier || !password) { setError('ایمیل/نام‌کاربری و رمز عبور را وارد کنید.'); return; }
    setError(null); setLoading(true);
    try {
      await postWithCsrf(endpoints.login, { identifier, password });
      await new Promise((r) => setTimeout(r, 80));
      window.dispatchEvent(new CustomEvent('auth:changed', { detail: { loggedIn: true } }));
      onSuccess?.();
      r.refresh();
    } catch (err: any) {
      setError(err?.message || 'ورود ناموفق بود.');
    } finally { setLoading(false); }
  }

  const hasError = Boolean(error);

  return (
    <form onSubmit={onSubmit} className={s.form} dir="rtl" aria-label="فرم ورود" noValidate>
      <div className={s.field}>
        <span className={s.icon} aria-hidden>📧</span>
        <input
          ref={idRef}
          id={idInputId}
          name="identifier"
          className={`${s.input} ${identifier ? s.hasValue : ''}`}
          value={identifier}
          onChange={(e)=>setIdentifier(e.target.value)}
          autoComplete="username"
          inputMode="email"
          placeholder=""
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? errId : undefined}
          required
        />
        <label className={s.label} htmlFor={idInputId}>ایمیل یا نام‌کاربری</label>
      </div>

      <div className={s.field}>
        <span className={s.icon} aria-hidden>🔒</span>
        <input
          id={pwInputId}
          name="password"
          className={`${s.input} ${password ? s.hasValue : ''}`}
          type={showPw ? 'text' : 'password'}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder=""
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? errId : undefined}
          required
        />
        <label className={s.label} htmlFor={pwInputId}>رمز عبور</label>

        <button
          type="button"
          className={s.pwToggle}
          onClick={() => setShowPw(v => !v)}
          aria-label={showPw ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
          aria-pressed={showPw}
          title={showPw ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
        >
          {showPw ? '🙈' : '👁️'}
        </button>
      </div>

      <div className={s.helper}>
        <label className={s.checkLabel}>
          <input type="checkbox" className={s.check} /> مرا به خاطر بسپار
        </label>
        <a className={s.link} href="/forgot">فراموشی رمز؟</a>
      </div>

      {hasError && <p id={errId} className={s.error} role="alert" aria-live="polite">{error}</p>}

      <div className={s.actions}>
        <button
          type="submit"
          className={`${s.btnFull} ${s.submitBtn}`}
          disabled={loading}
        >
          {loading ? 'در حال ورود…' : 'ورود'}
        </button>
      </div>
    </form>
  );
}
