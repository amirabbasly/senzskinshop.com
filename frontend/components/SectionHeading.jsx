import Link from 'next/link';
import { ArrowLeft } from './Icons';

export default function SectionHeading({ title, subtitle, href, linkLabel = 'مشاهده همه' }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
        >
          {linkLabel}
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}
