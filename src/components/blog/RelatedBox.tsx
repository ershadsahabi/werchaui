"use client";
export default function RelatedBox({ slug }: { slug: string }) {
  // بعداً به محصولات/پست‌های مرتبط وصل می‌کنیم
  return (
    <aside className="card stack gap-2" style={{marginTop: 24}}>
      <h3 className="card__title">مطالب یا محصولات مرتبط</h3>
      <p className="t-weak">به‌زودی این بخش بر اساس دسته/کلیدواژه به کاتالوگ و سایر پست‌ها وصل می‌شود.</p>
    </aside>
  );
}
