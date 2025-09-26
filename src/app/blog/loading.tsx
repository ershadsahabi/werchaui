// src\app\blog\loading.tsx

export default function LoadingBlog() {
  return (
    <section className="stack gap-4" dir="rtl">
      <div className="skeleton" style={{height: 200, borderRadius: "var(--r-xl)"}} />
      <div className="grid grid--3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{aspectRatio:"16/10", borderRadius:"var(--r-lg)"}}/>
            <div className="skeleton" style={{height:16, marginTop:12, width:"70%"}}/>
            <div className="skeleton" style={{height:12, marginTop:8, width:"90%"}}/>
          </div>
        ))}
      </div>
    </section>
  );
}
