export default function SuccessPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const id = searchParams.id;
  const amount = Number(searchParams.amount || 0);
  return (
    <div dir="rtl" className="container" style={{maxWidth: 720, margin: '24px auto', textAlign: 'center'}}>
      <h1>سفارش با موفقیت ثبت شد 🎉</h1>
      {id && <p style={{marginTop: 8}}>کد سفارش: <code>{id}</code></p>}
      <p style={{marginTop: 8}}>مبلغ نهایی تایید‌شده: <strong>{amount.toLocaleString('fa-IR')}</strong> تومان</p>
      <a className="btn" href="/shop" style={{marginTop: 16}}>بازگشت به فروشگاه</a>
    </div>
  );
}
