'use client';
import { useState, useRef, useEffect } from 'react';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import form from './Form.module.css';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const r = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('ایمیل و رمز عبور الزامی است.'); return; }
    if (!agree) { setError('برای ساخت حساب، قوانین را بپذیرید.'); return; }
    setError(null); setLoading(true);
    try {
      await postWithCsrf(endpoints.register, {
        email,
        password,
        username: username || undefined,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      setDone(true);
      onSuccess?.(); // مودال بسته می‌شود
      r.refresh();
    } catch (err: any) {
      setError(err?.message || 'ثبت‌نام ناموفق بود.');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className={form.form} dir="rtl" aria-label="فرم ثبت‌نام">
      <div className={form.row}>
        <span className={form.icon} aria-hidden>📧</span>
        <input
          ref={emailRef}
          className={`${form.input} input`}
          placeholder="ایمیل"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <div className={form.grid}>
        <div className={form.row}>
          <span className={form.icon} aria-hidden>👤</span>
          <input
            className={`${form.input} input`}
            placeholder="نام‌کاربری (اختیاری)"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className={form.row}>
          <span className={form.icon} aria-hidden>🔒</span>
          <input
            className={`${form.input} input`}
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className={form.grid}>
        <div className={form.row}>
          <span className={form.icon} aria-hidden>📝</span>
          <input
            className={`${form.input} input`}
            placeholder="نام (اختیاری)"
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div className={form.row}>
          <span className={form.icon} aria-hidden>📝</span>
          <input
            className={`${form.input} input`}
            placeholder="نام‌خانوادگی (اختیاری)"
            value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
      </div>

      {done && <p className={form.success}>حساب با موفقیت ساخته شد!</p>}
      {error && <p className={form.error}>{error}</p>}

      <div className={form.helper}>
        <label>
          <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} /> 
          قوانین و حریم خصوصی را می‌پذیرم
        </label>
        <a className={form.link} href="/terms">مشاهده قوانین</a>
      </div>

      <button className={`btn btnPrimary ${form.btnFull}`} disabled={loading}>
        {loading ? 'در حال ساخت حساب…' : 'ساخت حساب'}
      </button>
    </form>
  );
}
