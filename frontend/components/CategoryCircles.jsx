import Link from 'next/link';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { toFa } from '@/lib/format';

export default function CategoryCircles({ categories = [] }) {
  const parents = categories.filter((c) => !c.parent_id);
  if (!parents.length) return null;

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3.5 lg:grid-cols-6">
      {parents.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group overflow-hidden rounded-2xl border border-cream-300/80 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
        >
          <span className="block aspect-square overflow-hidden bg-brand-50 p-1.5 sm:p-2">
            <img
              src={cat.image || PLACEHOLDER_IMAGE}
              alt={cat.name}
              loading="lazy"
              className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-[1.06]"
            />
          </span>
          <span className="block px-1 pb-2.5 pt-2 text-center">
            <span className="block truncate text-[11px] font-bold text-brand-950 group-hover:text-brand-700 sm:text-[12.5px]">
              {cat.name}
            </span>
            {Number(cat.product_count) > 0 && (
              <span className="mt-0.5 block text-[9px] text-ink/40">{toFa(cat.product_count)} محصول</span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}
