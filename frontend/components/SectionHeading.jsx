import Link from 'next/link';
import { ArrowLeft } from './Icons';

export default function SectionHeading({ title, subtitle, href, linkLabel = 'مشاهده همه' }) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-3 border-b border-cream-200 pb-2.5 sm:mb-5">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[15px] font-extrabold leading-6 text-brand-950 sm:text-[19px]">
          <span aria-hidden="true" className="flex items-center gap-[3px]">
            <span className="h-2 w-[3px] rounded-full bg-brand-300" />
            <span className="h-3.5 w-[3px] rounded-full bg-brand-400" />
            <span className="h-5 w-[3px] rounded-full bg-brand-500" />
          </span>
          <span className="truncate">{title}</span>
        </h2>
        {subtitle && <p className="mt-1 text-[10.5px] leading-5 text-ink/45 sm:text-[11.5px]">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 pb-0.5 text-[11px] font-bold text-brand-700 hover:text-brand-900 sm:text-xs"
        >
          {linkLabel}
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}
