import Link from 'next/link';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { toFa } from '@/lib/format';

function flatten(categories) {
  const list = [];
  (categories || []).forEach((category) => {
    const children = category.children || [];
    if (children.length) {
      children.forEach((child) => list.push({ ...child, parentName: category.name }));
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
      className={`grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3.5 ${
        list.length > 8 ? 'lg:grid-cols-6' : 'lg:grid-cols-4'
      }`}
    >
      {list.map((cat) => (
        <Link key={cat.id} href={`/category/${cat.slug}`} className="group flex flex-col items-center">
          <span className="relative block w-full overflow-hidden rounded-full border border-cream-200 bg-white p-1 shadow-[0_1px_3px_rgba(90,55,50,.04)] sm:rounded-2xl sm:p-2">
            <span className="block aspect-square overflow-hidden rounded-full bg-cream-100 sm:rounded-xl">
              <img
                src={cat.image || PLACEHOLDER_IMAGE}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </span>
          </span>
          <span className="mt-2 block truncate text-center text-[10.5px] font-bold text-brand-950 transition group-hover:text-brand-700 sm:text-[12px]">
            {cat.name}
          </span>
          {Number(cat.product_count) > 0 && (
            <span className="mt-0.5 block text-center text-[9px] text-ink/35">{toFa(cat.product_count)} محصول</span>
          )}
        </Link>
      ))}
    </div>
  );
}
