import Link from 'next/link';
import { CURATED_BRANDS } from './BrandsStrip';

function normalize(brand) {
  return {
    key: brand.id || brand.name,
    name: brand.name,
    latin: brand.latin || brand.name,
    logo: brand.logo || brand.image || '',
    photo: brand.image || '',
    count: Number(brand.count) || 0,
  };
}

export default function BrandCircles({ brands = [] }) {
  const fromApi = (brands || []).filter((brand) => brand && brand.name).map(normalize);
  const base = fromApi.length
    ? fromApi
    : CURATED_BRANDS.map((brand) => ({
        key: brand.name,
        name: brand.name,
        latin: brand.latin,
        logo: brand.image,
        photo: brand.image,
        count: 0,
      }));

  const featured = (brands || []).filter((brand) => brand && brand.is_featured);
  const featuredKeys = new Set(featured.map((brand) => String(brand.name).trim()));
  const picked = featuredKeys.size ? base.filter((brand) => featuredKeys.has(brand.name)) : base;
  const list = picked.slice(0, 6);

  if (!list.length) return null;

  return (
    <section className="mt-3 sm:mt-4">
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        <div className="no-scrollbar flex snap-x items-start gap-2 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 lg:justify-center lg:gap-6 lg:px-8">
          {list.map((brand) => {
            const media = brand.photo || brand.logo;
            return (
              <Link
                key={brand.key}
                href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
                className="group flex w-[72px] shrink-0 snap-start flex-col items-center gap-1 sm:w-[86px] lg:w-[92px]"
              >
                <span className="relative block h-[72px] w-[72px] overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_3px_14px_rgba(90,55,50,.14)] ring-1 ring-cream-200 transition duration-300 group-hover:shadow-soft group-hover:ring-brand-300 sm:h-[86px] sm:w-[86px] lg:h-[92px] lg:w-[92px]">
                  <img
                    src={media}
                    alt={brand.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-1 mix-blend-multiply transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span
                  dir="ltr"
                  className="mt-0.5 max-w-full truncate text-center text-[9px] font-black tracking-[0.06em] text-brand-900 sm:text-[10.5px]"
                >
                  {brand.latin}
                </span>
                <span className="max-w-full truncate text-center text-[8.5px] font-semibold text-ink/45 sm:text-[9.5px]">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
