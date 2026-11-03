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
  const counts = new Map((brands || []).map((brand) => [String(brand.name).trim(), Number(brand.count) || 0]));
  const list = CURATED_BRANDS.map((brand) => ({ ...brand, count: counts.get(brand.name) || 0 }));

  return (
    <section className="container-page mt-7 sm:mt-10">
      <SectionHeading
        title="محبوب‌ترین برندها"
        subtitle="فقط برندهای اورجینال و قابل استعلام — با ضمانت اصالت senzskinshop"
        href="/products"
        linkLabel="همه محصولات"
      />

      <div className="rounded-xl border border-cream-300 bg-white p-2 shadow-[0_1px_3px_rgba(90,55,50,.05)] sm:rounded-2xl sm:p-3">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2 lg:grid-cols-8">
          {list.map((brand) => (
            <Link
              key={brand.name}
              href={brand.count > 0 ? `/products?q=${encodeURIComponent(brand.name)}` : '/products'}
              className="group flex flex-col items-center justify-center gap-1.5 rounded-lg border border-transparent px-1 py-2.5 transition hover:border-brand-200 hover:bg-brand-50/60 sm:rounded-xl sm:py-3"
            >
              <span className="flex h-6 w-full items-center justify-center sm:h-7">
                <img
                  src={brand.image}
                  alt={`لوگو ${brand.name}`}
                  loading="lazy"
                  className="max-h-6 w-auto max-w-[88%] object-contain opacity-75 grayscale-[.65] transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-7"
                />
              </span>
              <span className="w-full truncate text-center text-[9.5px] font-bold text-ink/60 transition group-hover:text-brand-800 sm:text-[10.5px]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
