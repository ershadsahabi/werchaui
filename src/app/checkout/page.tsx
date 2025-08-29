import { getMe } from '@/lib/server-api';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  const me = await getMe();
  // اگر کاربر لاگین نیست، بهتره این صفحه اصلاً رندر نشه؛ GuardedCheckoutLink این را هندل می‌کند.
  return (
    <div dir="rtl" className="container" style={{maxWidth: 720, margin: '24px auto'}}>
      <h1 style={{marginBottom: 16}}>ثبت سفارش</h1>
      <CheckoutForm />
    </div>
  );
}
