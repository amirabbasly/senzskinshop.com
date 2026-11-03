import Link from 'next/link';
import { CURATED_BRANDS } from './BrandsStrip';

export default function BrandCircles({ brands = [] }) {
  const counts = new Map((brands || []).map((brand) => [String(brand.name).trim(), Number(brand.count) || 0]));
  const list = CURATED_BRANDS.map((brand) => ({ ...brand, count: counts.get(brand.name) || 0 }));

  return (
    <section className="mt-3 sm:mt-4">
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div className="no-scrollbar flex snap-x items-start gap-2.5 overflow-x-auto px-4 pb-1.5 sm:gap-4 sm:px-6 lg:justify-center lg:gap-2 lg:px-8">
          {list.map((brand) => (
            <Link
              key={brand.name}
              href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
              className="group flex w-[68px] shrink-0 snap-start flex-col items-center gap-1.5 sm:w-[80px] lg:w-[72px]"
            >
              <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-cream-300 bg-white p-2.5 shadow-[0_2px_8px_rgba(90,55,50,.06)] transition duration-300 group-hover:border-brand-300 group-hover:shadow-soft sm:h-20 sm:w-20 sm:p-3 lg:h-[72px] lg:w-[72px] lg:p-2.5">
                <img
                  src={brand.image}
                  alt={`لوگو ${brand.name}`}
                  loading="lazy"
                  className="max-h-7 w-auto max-w-full object-contain opacity-80 grayscale-[.45] transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-8"
                />
              </span>
              <span className="w-full truncate text-center text-[8.5px] font-bold text-ink/55 sm:text-[9.5px] lg:text-[10px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
