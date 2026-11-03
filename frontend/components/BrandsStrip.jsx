import Link from 'next/link';
import SectionHeading from './SectionHeading';

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
  { name: 'senzskinshop', latin: 'SENZ', image: '/images/brands/senz.png' },
];

export default function BrandsStrip({ brands = [] }) {
  const fromApi = (brands || [])
    .filter((brand) => brand && brand.name)
    .map((brand) => ({
      name: brand.name,
      latin: brand.latin || brand.name,
      image: brand.logo || brand.image,
      count: Number(brand.count) || 0,
    }));
  const list = fromApi.length ? fromApi : CURATED_BRANDS.map((brand) => ({ ...brand, count: 0 }));

  return (
    <section className="container-page mt-7 sm:mt-10">
      <SectionHeading
        title="محبوب‌ترین برندها"
        subtitle="فقط برندهای اورجینال و قابل استعلام — با ضمانت اصالت senzskinshop"
        href="/products"
        linkLabel="همه محصولات"
      />

      <div className="relative overflow-hidden rounded-xl border border-cream-300 bg-white py-3 shadow-[0_1px_3px_rgba(90,55,50,.05)] [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] sm:rounded-2xl sm:py-3.5">
        <div className="flex w-max animate-marquee items-stretch hover:[animation-play-state:paused]">
          {[...list, ...list].map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
              aria-hidden={index >= list.length ? 'true' : undefined}
              tabIndex={index >= list.length ? -1 : undefined}
              className="group flex w-[112px] shrink-0 flex-col items-center justify-center gap-1.5 border-l border-cream-200 px-2 last:border-l-0 sm:w-[136px] lg:w-[150px]"
            >
              <span className="flex h-7 w-full items-center justify-center sm:h-8">
                <img
                  src={brand.image}
                  alt={`لوگو ${brand.name}`}
                  loading="lazy"
                  className="max-h-7 w-auto max-w-[92%] object-contain opacity-75 grayscale-[.65] transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-8"
                />
              </span>
              <span className="w-full truncate text-center text-[9.5px] font-bold text-ink/55 transition group-hover:text-brand-800 sm:text-[10.5px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
