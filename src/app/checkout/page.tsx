'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useCartTotal } from '@/store/cart';
import { postWithCsrf } from '@/lib/client-csrf';
import { endpoints } from '@/lib/api';
import LoginModal from '@/components/LoginModal';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = useCartTotal();
  const router = useRouter();

  const [me, setMe] = useState<any>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', postal_code: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoints.me, { credentials: 'include', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  if (items.length === 0) {
    return <div className="container" dir="rtl" style={{ padding: '2rem 0' }}><p>سبد خالی است.</p></div>;
  }

  const placeOrder = async () => {
    setErr(null);
    setLoading(true);
    try {
      const payload = {
        items: items.map((it) => ({ product_id: it.id, qty: it.qty })),
        ...form,
      };
      await postWithCsrf(endpoints.orderCreate, payload);
      clear();
      router.push('/cart?success=1');
    } catch (e: any) {
      setErr(e.message || 'خطا در ثبت سفارش');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" dir="rtl" style={{ padding: '2rem 0', maxWidth: 720 }}>
      <h1>نهایی‌سازی سفارش</h1>

      {!me && (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, margin: '12px 0' }}>
          <p>برای ثبت سفارش باید وارد حساب شوید.</p>
          <button className="btn" onClick={() => setLoginOpen(true)}>ورود</button>
        </div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        <input placeholder="نام و نام‌خانوادگی" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <input placeholder="تلفن" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="شهر" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="کد پستی" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
        <textarea placeholder="آدرس کامل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>

      <div style={{ marginTop: 16 }}>مبلغ قابل پرداخت: <strong>{total.toLocaleString('fa-IR')}</strong> تومان</div>
      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}

      <button className="btn" disabled={!me || loading} onClick={placeOrder} style={{ marginTop: 12 }}>
        {loading ? 'در حال ارسال…' : 'ثبت سفارش'}
      </button>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
