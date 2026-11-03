import Link from 'next/link';
import { ShieldCheck } from './Icons';

export const CURATED_BRANDS = [
  { name: 'آنوا', latin: 'ANUA', image: '/images/brands/anua.png' },
  { name: 'نامبوزین', latin: 'NUMBUZIN', image: '/images/brands/numbuzin.png' },
  { name: 'سراوی', latin: 'CERAVE', image: '/images/brands/cerave.png' },
  { name: 'وازلین', latin: 'VASELINE', image: '/images/brands/vaseline.png' },
  { name: 'ایزدین', latin: 'ISDIN', image: '/images/brands/isdin.png' },
  { name: 'سنتلا', latin: 'CENTELLA', image: '/images/brands/centella.png' },
  { name: 'اوردینری', latin: 'THE ORDINARY', image: '/images/brands/ordinary.png' },
  { name: 'اکسیس وای', latin: 'AXIS-Y', image: '/images/brands/axis-y.png' },
  { name: 'آرنسیا', latin: 'ARENCIA', image: '/images/brands/arencia.png' },
  { name: 'اس تی ایوز', latin: 'ST.EVE', image: '/images/brands/steve.png' },
  { name: 'فینو', latin: 'FINO', image: '/images/brands/fino.png' },
  { name: 'کلاژن', latin: 'COLLAGEN', image: '/images/brands/collagen.png' },
  { name: 'مدیکیوپ', latin: 'MEDICUBE', image: '/images/brands/medicube.png' },
  { name: 'سیمپل', latin: 'SIMPLE', image: '/images/brands/simple.png' },
  { name: 'senzskinshop', latin: 'SENZ', image: '/images/logo-senz.png', own: true },
];

export default function BrandsStrip({ brands = [] }) {
  const counts = new Map((brands || []).map((brand) => [String(brand.name).trim(), Number(brand.count) || 0]));
  const list = CURATED_BRANDS.map((brand) => ({ ...brand, count: counts.get(brand.name) || 0 }));

  return (
    <section className="container-page mt-8 sm:mt-12">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-200/70 bg-white px-4 py-6 sm:rounded-[2rem] sm:px-7 sm:py-8">
        <span className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-brand-100/70 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-20 -right-12 h-48 w-48 rounded-full bg-gold-100/60 blur-2xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold text-brand-700 ring-1 ring-brand-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              برندهای معتبر
            </span>
            <h2 className="mt-2.5 text-[17px] font-black text-brand-950 sm:text-xl">محبوب‌ترین برندها</h2>
            <p className="mt-1 text-[10.5px] text-ink/50 sm:text-[11px]">
              فقط برندهای اورجینال و قابل استعلام — با ضمانت اصالت senzskinshop
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

        <div className="relative mt-5 flex snap-x gap-2 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5">
          {list.map((brand) => (
            <Link
              key={brand.name}
              href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
              className="group flex w-[104px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-cream-300/80 bg-white px-1.5 py-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft sm:w-auto sm:gap-2 sm:rounded-2xl sm:py-4"
            >
              <span className="flex h-7 w-full items-center justify-center sm:h-8">
                <img
                  src={brand.image}
                  alt={`لوگو ${brand.name}`}
                  loading="lazy"
                  className={`max-h-7 w-auto max-w-[86%] object-contain transition duration-300 group-hover:scale-105 sm:max-h-8 ${
                    brand.own ? 'rounded-full' : ''
                  }`}
                />
              </span>
              <span className="w-full truncate text-center text-[10px] font-bold text-brand-950 group-hover:text-brand-700 sm:text-[11px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
