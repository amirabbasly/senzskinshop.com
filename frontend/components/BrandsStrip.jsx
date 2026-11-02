import Link from 'next/link';
import { ShieldCheck } from './Icons';

const CURATED = [
  { name: 'سنز اسکین', latin: 'SENZ', image: '/images/logo-senz.png' },
  { name: 'سبکتا', latin: 'SEBECTA', image: '/images/brands/sebecta.png' },
  { name: 'لافارر', latin: 'LA FARE', image: '/images/brands/lafare.png' },
  { name: 'سینره', latin: 'CINERE', image: '/images/brands/cinere.png' },
  { name: 'پاکس', latin: 'PAKS', image: '/images/brands/paks.png' },
  { name: 'اوردینری', latin: 'THE ORDINARY', image: '/images/brands/ordinary.png' },
  { name: 'بیودرما', latin: 'BIODERMA', image: '/images/brands/bioderma.png' },
  { name: 'نئودرم', latin: 'NEODERM', image: '/images/brands/neoderm.png' },
];

export default function BrandsStrip({ brands = [] }) {
  const counts = new Map((brands || []).map((brand) => [String(brand.name).trim(), Number(brand.count) || 0]));

  const merged = CURATED.map((brand) => ({ ...brand, count: counts.get(brand.name) || 0 }));
  (brands || []).forEach((brand) => {
    const name = String(brand.name || '').trim();
    if (name && !merged.some((item) => item.name === name)) {
      merged.unshift({
        name,
        latin: '',
        image: '/images/brands/ordinary.png',
        count: Number(brand.count) || 0,
      });
    }
  });

  const list = merged.slice(0, 10);

  return (
    <section className="container-page mt-12 sm:mt-14">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-100 bg-gradient-to-l from-brand-50 via-white to-brand-50 px-4 py-5 sm:rounded-[2rem] sm:px-7 sm:py-7">
        <span className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-brand-100/70 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-gold-100/50 blur-2xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-brand-700 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              برندهای معتبر
            </span>
            <h2 className="mt-2.5 text-[17px] font-black text-brand-950 sm:text-xl">برندهایی که با آن‌ها کار می‌کنیم</h2>
            <p className="mt-1 text-[10.5px] text-ink/50 sm:text-[11px]">
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

        <div className="relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:mt-5">
          <div className="flex w-max animate-marquee gap-2 hover:[animation-play-state:paused] sm:gap-3">
            {[...list, ...list].map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
                className="group flex w-[146px] shrink-0 items-center gap-2 rounded-xl border border-brand-100 bg-white px-2.5 py-2 shadow-[0_8px_20px_-18px_rgba(70,5,31,.35)] transition hover:-translate-y-0.5 hover:border-brand-300 sm:w-[172px] sm:rounded-2xl sm:px-3 sm:py-2.5"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  width={80}
                  height={80}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-brand-100 sm:h-10 sm:w-10"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-bold text-brand-950 sm:text-[12px]">{brand.name}</span>
                  <span
                    className="mt-0.5 block truncate text-[7px] font-semibold tracking-[0.16em] text-ink/35 sm:text-[8px]"
                    dir="ltr"
                  >
                    {brand.latin || 'SENZ'}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
