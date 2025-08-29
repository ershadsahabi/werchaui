// F:\Shahrivar1404\Werch_app\werchaui\src\app\checkout\page.tsx
import { getMe } from '@/lib/server-api';
import CheckoutGate from '@/components/checkout/CheckoutGate';
import styles from './CheckoutPage.module.css';

export default async function CheckoutPage() {
  const me = await getMe();
  return (
    <div dir="rtl" className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>ثبت سفارش</h1>
      <CheckoutGate initialUser={me} />
    </div>
  );
}
