'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useCartTotal } from '@/store/cart';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import styles from './CheckoutForm.module.css';

type ItemErr = { product_id: number; detail: string };

type FieldErrors = Partial<{
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
}>;

const phoneOk = (v: string) => /^09\d{9}$/.test(v) || /^\+989\d{9}$/.test(v);
const postalOk = (v: string) => /^\d{10}$/.test(v.replace(/[-\s]/g, ''));

export default function CheckoutForm() {
  const r = useRouter();
  const items = useCartStore(s => s.items);
  const clear = useCartStore(s => s.clear);
  const total = useCartTotal();

  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal_code, setPostalCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemErrors, setItemErrors] = useState<ItemErr[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ← Prefill: آخرین آدرس کاربر
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(endpoints.lastAddress, { credentials: 'include', cache: 'no-store' });
        if (res.status === 204) return;
        if (!res.ok) return;
        const d = await res.json();
        setFullName(d.full_name || '');
        setPhone(d.phone || '');
        setAddress(d.address || '');
        setCity(d.city || '');
        setPostalCode(d.postal_code || '');
      } catch {}
    })();
  }, []);

  // ولیدیشن سمت کلاینت (برای UX بهتر؛ سرور هم ولیدیت می‌کند)
  function validateAll(): boolean {
    const fe: FieldErrors = {};
    if (!full_name.trim() || full_name.trim().length < 3) fe.full_name = 'نام و نام‌خانوادگی را کامل وارد کنید.';
    if (!phoneOk(phone.trim())) fe.phone = 'شماره تماس معتبر نیست (نمونه: 09123456789).';
    if (!city.trim() || city.trim().length < 2) fe.city = 'نام شهر معتبر نیست.';
    if (!address.trim() || address.trim().length < 10) fe.address = 'آدرس حداقل ۱۰ کاراکتر باشد.';
    if (!postalOk(postal_code)) fe.postal_code = 'کد پستی ۱۰ رقم است.';
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  }

  const disabled = useMemo(() => items.length === 0 || loading, [items.length, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setItemErrors([]);
    if (!validateAll()) return;

    setLoading(true);
    try {
      const payload = {
        items: items.map(it => ({ product_id: it.id, qty: it.qty })),
        full_name: full_name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postal_code: postal_code.trim(),
      };
      const data = await postWithCsrf(endpoints.orderCreate, payload);
      clear();
      r.push(`/checkout/success?id=${data.id}&amount=${data.total_amount}`);
    } catch (err: any) {
      // تلاش برای استخراج خطاهای فیلدی/آیتمی از سرور (DRF)
      try {
        const obj = JSON.parse(err?.message || '{}');
        if (obj?.items) setItemErrors(obj.items as ItemErr[]);
        // خطاهای فیلدی:
        const fe: FieldErrors = {};
        for (const k of ['full_name','phone','address','city','postal_code'] as const) {
          if (obj?.[k]) fe[k] = Array.isArray(obj[k]) ? obj[k][0] : String(obj[k]);
        }
        setFieldErrors(fe);
        if (!obj?.items && Object.keys(fe).length === 0) setError(err?.message || 'ثبت سفارش ناموفق بود.');
      } catch {
        setError(err?.message || 'ثبت سفارش ناموفق بود.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} dir="rtl" noValidate>
      <div className={styles.total}>
        جمع فعلی سبد (نمایشی): <strong>{total.toLocaleString('fa-IR')}</strong> تومان
        <div className={styles.hint}>مبلغ نهایی پس از تأیید سرور محاسبه می‌شود.</div>
      </div>

      <div className={styles.row}>
        <div>
          <input
            className={`${styles.input} ${fieldErrors.full_name ? styles.invalid : ''}`}
            placeholder="نام و نام‌خانوادگی"
            value={full_name}
            onChange={e=>setFullName(e.target.value)}
            autoComplete="name"
            aria-invalid={!!fieldErrors.full_name}
          />
          {fieldErrors.full_name && <div className={styles.error}>{fieldErrors.full_name}</div>}
        </div>

        <div>
          <input
            className={`${styles.input} ${fieldErrors.phone ? styles.invalid : ''}`}
            placeholder="شماره تماس (نمونه: 09123456789)"
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <div className={styles.error}>{fieldErrors.phone}</div>}
        </div>

        <div>
          <input
            className={`${styles.input} ${fieldErrors.city ? styles.invalid : ''}`}
            placeholder="شهر"
            value={city}
            onChange={e=>setCity(e.target.value)}
            autoComplete="address-level2"
            aria-invalid={!!fieldErrors.city}
          />
          {fieldErrors.city && <div className={styles.error}>{fieldErrors.city}</div>}
        </div>

        <div>
          <input
            className={`${styles.input} ${fieldErrors.postal_code ? styles.invalid : ''}`}
            placeholder="کد پستی (۱۰ رقم)"
            value={postal_code}
            onChange={e=>setPostalCode(e.target.value.replace(/[^\d]/g, ''))}
            autoComplete="postal-code"
            inputMode="numeric"
            aria-invalid={!!fieldErrors.postal_code}
          />
          {fieldErrors.postal_code && <div className={styles.error}>{fieldErrors.postal_code}</div>}
        </div>

        <div>
          <textarea
            className={`${styles.input} ${fieldErrors.address ? styles.invalid : ''}`}
            placeholder="آدرس دقیق"
            value={address}
            onChange={e=>setAddress(e.target.value)}
            rows={4}
            autoComplete="street-address"
            aria-invalid={!!fieldErrors.address}
          />
          {fieldErrors.address && <div className={styles.error}>{fieldErrors.address}</div>}
        </div>
      </div>

      {itemErrors.length > 0 && (
        <div className={styles.alert} role="alert">
          <div style={{fontWeight: 600, marginBottom: 6}}>مشکلات آیتم‌ها:</div>
          <ul style={{margin: 0, paddingInlineStart: 18}}>
            {itemErrors.map((er, idx) => (
              <li key={idx}>محصول {er.product_id}: {er.detail}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className={styles.alert} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button className="btn btnPrimary" disabled={disabled}>
          {loading ? 'در حال ثبت…' : 'ثبت نهایی سفارش'}
        </button>
      </div>
    </form>
  );
}
