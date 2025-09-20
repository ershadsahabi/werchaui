'use client';
import { useState, useRef, useEffect, useId } from 'react';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import s from './AuthModal.module.css';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const r = useRouter();

  // state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agree, setAgree] = useState(false);

  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // فقط برای خطاهای عمومی
  const [done, setDone] = useState(false);

  // focus
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => { emailRef.current?.focus(); }, []);

  // ids
  const formId = useId();
  const ids = {
    email: `${formId}-email`,
    username: `${formId}-username`,
    password: `${formId}-password`,
    password2: `${formId}-password2`,
    first: `${formId}-first`,
    last: `${formId}-last`,
    err: `${formId}-error`,
    success: `${formId}-success`,
    pwMismatch: `${formId}-pw-mismatch`,
  };

  const passwordsMismatch = password && password2 && password !== password2;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError('ایمیل و رمز عبور الزامی است.');
      return;
    }
    if (!agree) {
      setError('برای ساخت حساب، قوانین را بپذیرید.');
      return;
    }
    if (passwordsMismatch) {
      return; // پیام mismatch به‌صورت لوکال زیر فیلد دوم نمایش داده می‌شود
    }

    setError(null);
    setLoading(true);
    try {
      await postWithCsrf(endpoints.register, {
        email,
        password,
        username: username || undefined,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      setDone(true);
      onSuccess?.();
      r.refresh();
    } catch (err: any) {
      setError(err?.message || 'ثبت‌نام ناموفق بود.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${s.form} quiet-focus`} dir="rtl" aria-label="فرم ثبت‌نام" noValidate>
      {/* ایمیل */}
      <div className={s.field}>
        <span className={s.icon} aria-hidden>📧</span>
        <input
          ref={emailRef}
          id={ids.email}
          name="email"
          className={`${s.input} ${email ? s.hasValue : ''}`}
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="" /* فقط لیبل دیده می‌شود */
          required
          aria-describedby={error ? ids.err : undefined}
          aria-invalid={error ? true : undefined}
        />
        <label className={s.label} htmlFor={ids.email}>ایمیل</label>
      </div>

      {/* نام‌کاربری اختیاری */}
      <div className={s.field}>
        <span className={s.icon} aria-hidden>👤</span>
        <input
          id={ids.username}
          name="username"
          className={`${s.input} ${username ? s.hasValue : ''}`}
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          autoComplete="username"
          placeholder=""
        />
        <label className={s.label} htmlFor={ids.username}>نام‌کاربری (اختیاری)</label>
      </div>

      {/* رمز + تکرار رمز — کنار هم در یک ردیف */}
      <div className={s.grid}>
        <div className={s.field}>
          <span className={s.icon} aria-hidden>🔒</span>
          <input
            id={ids.password}
            name="new-password"
            className={`${s.input} ${password ? s.hasValue : ''}`}
            type={showPw1 ? 'text' : 'password'}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder=""
            required
            aria-invalid={passwordsMismatch ? true : undefined}
            aria-describedby={passwordsMismatch ? ids.pwMismatch : undefined}
          />
          <label className={s.label} htmlFor={ids.password}>رمز عبور</label>
          <button
            type="button"
            className={s.pwToggle}
            onClick={() => setShowPw1(v => !v)}
            aria-label={showPw1 ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
            aria-pressed={showPw1}
            title={showPw1 ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
          >
            {showPw1 ? '🙈' : '👁️'}
          </button>
        </div>

        <div className={s.field}>
          <span className={s.icon} aria-hidden>🔒</span>
          <input
            id={ids.password2}
            name="confirm-password"
            className={`${s.input} ${password2 ? s.hasValue : ''}`}
            type={showPw2 ? 'text' : 'password'}
            value={password2}
            onChange={(e)=>setPassword2(e.target.value)}
            autoComplete="new-password"
            placeholder=""
            required
            aria-invalid={passwordsMismatch ? true : undefined}
            aria-describedby={passwordsMismatch ? ids.pwMismatch : undefined}
          />
          <label className={s.label} htmlFor={ids.password2}>تکرار رمز عبور</label>
          <button
            type="button"
            className={s.pwToggle}
            onClick={() => setShowPw2(v => !v)}
            aria-label={showPw2 ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
            aria-pressed={showPw2}
            title={showPw2 ? 'مخفی‌کردن رمز' : 'نمایش رمز'}
          >
            {showPw2 ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      {/* پیام عدم تطابق */}
      {passwordsMismatch && (
        <div id={ids.pwMismatch} className={s.fieldHint} role="alert" aria-live="polite">
          رمز عبور و تکرار آن یکسان نیست.
        </div>
      )}

      {/* نام/نام‌خانوادگی اختیاری */}
      <div className={s.grid}>
        <div className={s.field}>
          <span className={s.icon} aria-hidden>📝</span>
          <input
            id={ids.first}
            name="first_name"
            className={`${s.input} ${firstName ? s.hasValue : ''}`}
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
            autoComplete="given-name"
            placeholder=""
          />
          <label className={s.label} htmlFor={ids.first}>نام (اختیاری)</label>
        </div>
        <div className={s.field}>
          <span className={s.icon} aria-hidden>📝</span>
          <input
            id={ids.last}
            name="last_name"
            className={`${s.input} ${lastName ? s.hasValue : ''}`}
            value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
            autoComplete="family-name"
            placeholder=""
          />
          <label className={s.label} htmlFor={ids.last}>نام‌خانوادگی (اختیاری)</label>
        </div>
      </div>

      {done && <p id={ids.success} className={s.success} role="status">حساب با موفقیت ساخته شد!</p>}
      {error && <p id={ids.err} className={s.error} role="alert">{error}</p>}

      <div className={s.helper}>
        <label className={s.checkLabel}>
          <input
            type="checkbox"
            className={s.check}
            checked={agree}
            onChange={(e)=>setAgree(e.target.checked)}
          />{' '}
          قوانین و حریم خصوصی را می‌پذیرم
        </label>
        <a className={s.link} href="/terms">مشاهده قوانین</a>
      </div>

      <button
        type="submit"
        className={`${s.btnFull} ${s.submitBtn}`}
        disabled={loading}
      >
        {loading ? 'در حال ساخت حساب…' : 'ساخت حساب'}
      </button>

      {/* فقط برای این فرم: فوکوس براق ورودی‌ها خاموش شود */}
      <style jsx>{`
        .quiet-focus :global(.${s.input}:focus) {
          box-shadow: none !important;                  /* بدون درخشش */
          border-color: color-mix(in oklab, var(--primary) 34%, var(--border) 66%) !important;
          background: color-mix(in oklab, var(--surface) 90%, transparent) !important;
        }
        /* اگر خواستی هنگام hover هم مات باشه: */
        .quiet-focus :global(.${s.input}:hover) {
          box-shadow: none;
        }
        /* placeholder همچنان نامرئی بماند */
        .quiet-focus :global(.${s.input}::placeholder) { opacity: 0; }
      `}</style>
    </form>
  );
}
