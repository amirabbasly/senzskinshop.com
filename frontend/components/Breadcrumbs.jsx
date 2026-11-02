import Link from 'next/link';
import { ChevronLeft } from './Icons';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="مسیر" className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink/50">
      <Link href="/" className="hover:text-brand-700">
        خانه
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          <ChevronLeft className="h-3 w-3" />
          {item.href && i !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-brand-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
