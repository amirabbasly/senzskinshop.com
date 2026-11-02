import Link from 'next/link';
import { ArrowLeft, Sparkles } from './Icons';

export default function PromoPanel({
  badge = 'پیشنهاد ویژه',
  title = '۱۵٪ تخفیف اولین خرید',
  text = 'با کد تخفیف SENZ15 روی تمام محصولات سنز اسکین، پوستت را از همین امروز جدی بگیر.',
  image = '/images/banners/hero-2.jpg',
  href = '/products',
  code = 'SENZ15',
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-cream-200">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="relative z-10 p-7 sm:p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-900 px-3 py-1 text-[11px] font-bold text-cream-50">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" />
            {badge}
          </span>
          <h2 className="mt-4 text-balance text-xl font-black leading-9 text-brand-950 sm:text-2xl">{title}</h2>
          <p className="mt-3 max-w-md text-xs leading-7 text-ink/65 sm:text-sm">{text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={href} className="btn-primary">
              خرید با تخفیف
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="rounded-xl border border-dashed border-brand-800/40 bg-white/70 px-4 py-2 text-xs font-black tracking-widest text-brand-900" dir="ltr">
              {code}
            </span>
          </div>
        </div>
        <div className="relative h-56 md:h-[340px]">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-cream-200 md:block" />
        </div>
      </div>
    </section>
  );
}
