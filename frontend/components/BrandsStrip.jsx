import Link from 'next/link';
import { toFa } from '@/lib/format';
import { ShieldCheck } from './Icons';

const CURATED = [
  { name: 'سنز اسکین', latin: 'SENZ' },
  { name: 'سبکتا', latin: 'SEBECTA' },
  { name: 'لافارر', latin: 'LA FARE' },
  { name: 'سینره', latin: 'CINERE' },
  { name: 'پاکس', latin: 'PAKS' },
  { name: 'اوردینری', latin: 'THE ORDINARY' },
  { name: 'بیودرما', latin: 'BIODERMA' },
  { name: 'نئودرم', latin: 'NEODERM' },
];

export default function BrandsStrip({ brands = [] }) {
  const counts = new Map((brands || []).map((brand) => [String(brand.name).trim(), Number(brand.count) || 0]));

  const merged = CURATED.map((brand) => ({ ...brand, count: counts.get(brand.name) || 0 }));
  (brands || []).forEach((brand) => {
    const name = String(brand.name || '').trim();
    if (name && !merged.some((item) => item.name === name)) {
      merged.unshift({ name, latin: '', count: Number(brand.count) || 0 });
    }
  });

  const list = merged.slice(0, 10);

  return (
    <section className="container-page mt-14">
      <div className="relative overflow-hidden rounded-[2rem] border border-cream-200 bg-cream-100/70 px-4 py-6 sm:px-7 sm:py-7">
        <span className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-brand-100/60 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-gold-100/60 blur-2xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-brand-700 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              برندهای معتبر
            </span>
            <h2 className="mt-2.5 text-lg font-black text-brand-950 sm:text-xl">برندهایی که با آن‌ها کار می‌کنیم</h2>
            <p className="mt-1 text-[11px] text-ink/50">
              فقط برندهای اورجینال و قابل استعلام — با ضمانت اصالت سنز اسکین
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-[11px] font-bold text-brand-700 transition hover:text-brand-900 sm:inline-flex"
          >
            همه محصولات
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max animate-marquee gap-2.5 hover:[animation-play-state:paused] sm:gap-3">
            {[...list, ...list].map((brand, index) => {
              const hasProducts = brand.count > 0;
              return (
                <Link
                  key={`${brand.name}-${index}`}
                  href={hasProducts ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
                  className="group flex w-[168px] shrink-0 items-center gap-2.5 rounded-2xl border border-cream-200 bg-white px-3 py-2.5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 sm:w-[188px]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-[15px] font-black text-white shadow-sm">
                    {(brand.latin || brand.name).charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-bold text-brand-950">{brand.name}</span>
                    <span className="mt-0.5 block truncate text-[8px] font-semibold tracking-[0.16em] text-ink/35" dir="ltr">
                      {brand.latin || 'SENZ'}
                    </span>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[8.5px] font-bold ${
                        hasProducts ? 'bg-brand-50 text-brand-700' : 'bg-cream-200 text-ink/45'
                      }`}
                    >
                      {hasProducts ? `${toFa(brand.count)} محصول` : 'به‌زودی'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
