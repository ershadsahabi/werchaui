export default function LoadingPost() {
  return (
    <section className="stack gap-3" dir="rtl">
      <div className="skeleton" style={{height: 28, width:"60%", borderRadius: 8}} />
      <div className="skeleton" style={{height: 16, width:"40%"}} />
      <div className="skeleton" style={{aspectRatio:"16/9", borderRadius:"var(--r-xl)"}} />
      <div className="skeleton" style={{height: 12, width:"90%"}} />
      <div className="skeleton" style={{height: 12, width:"95%"}} />
      <div className="skeleton" style={{height: 12, width:"85%"}} />
    </section>
  );
}
