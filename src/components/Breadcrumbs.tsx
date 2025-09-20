import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="نشانگر مسیر">
      {items.map((it, i) => (
        <span key={i}>
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <span className="breadcrumb__sep" aria-hidden />}
        </span>
      ))}
    </nav>
  );
}
