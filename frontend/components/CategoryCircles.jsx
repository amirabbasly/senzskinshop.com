import Link from 'next/link';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { toFa } from '@/lib/format';

const CATEGORY_BRANDS = {
  serum: 'THE ORDINARY',
  cream: 'CeraVe',
  sunscreen: 'ISDIN',
  cleanser: 'Centella',
  mask: 'ANUA',
  body: 'Vaseline',
  hair: 'Fino',
  supplement: 'Collagen',
  face: 'Numbuzin',
};

function brandOf(category) {
  const key = String(category.slug || '').toLowerCase();
  if (category.brand) return category.brand;
  if (CATEGORY_BRANDS[key]) return CATEGORY_BRANDS[key];
  const parentKey = String(category.parentSlug || category.parentName || '').toLowerCase();
  if (CATEGORY_BRANDS[parentKey]) return CATEGORY_BRANDS[parentKey];
  return null;
}

function flatten(categories) {
  const list = [];
  (categories || []).forEach((category) => {
    const children = category.children || [];
    if (children.length) {
      children.forEach((child) => list.push({ ...child, parentName: category.name, parentSlug: category.slug }));
    } else {
      list.push(category);
    }
  });
  return list.slice(0, 12);
}

export default function CategoryCircles({ categories = [] }) {
  const list = flatten(categories);
  if (!list.length) return null;

  return (
    <div
      className={`grid grid-cols-4 gap-x-1.5 gap-y-3 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-5 ${
        list.length > 8 ? 'lg:grid-cols-6' : 'lg:grid-cols-4'
      }`}
    >
      {list.map((cat) => {
        const brand = brandOf(cat);
        return (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="group flex flex-col items-center">
            <span className="relative mx-auto block w-full max-w-[150px] sm:max-w-[180px]">
              <span className="block aspect-square overflow-hidden rounded-full">
                <img
                  src={cat.image || PLACEHOLDER_IMAGE}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
                />
              </span>
              {brand && (
                <span
                  dir="ltr"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/92 px-1.5 py-[1px] text-[6.5px] font-black tracking-[0.1em] text-brand-800 shadow-[0_2px_6px_rgba(214,120,160,.22)] ring-1 ring-brand-200 transition group-hover:bg-white sm:px-2 sm:py-[2px] sm:text-[8px]"
                >
                  {brand}
                </span>
              )}
            </span>
            <span className="mt-2 block truncate text-center text-[10.5px] font-bold text-brand-950 transition group-hover:text-brand-700 sm:mt-2.5 sm:text-[12px]">
              {cat.name}
            </span>
            {Number(cat.product_count) > 0 && (
              <span className="mt-0.5 block text-center text-[9px] text-ink/35">
                {toFa(cat.product_count)} محصول
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
