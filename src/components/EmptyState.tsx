export default function EmptyState({ title="موردی پیدا نشد", hint="شرایط فیلتر را تغییر دهید" }:{
  title?: string; hint?: string;
}) {
  return (
    <div className="card center stack gap-2" style={{padding:"32px"}}>
      <div style={{fontSize:"2rem"}}>🐾</div>
      <strong>{title}</strong>
      <p className="t-mute">{hint}</p>
    </div>
  );
}
