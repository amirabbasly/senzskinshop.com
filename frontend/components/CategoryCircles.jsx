import Link from 'next/link';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { toFa } from '@/lib/format';

export default function CategoryCircles({ categories = [] }) {
  const parents = categories.filter((c) => !c.parent_id);
  if (!parents.length) return null;

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {parents.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group flex flex-col items-center gap-3 rounded-3xl border border-transparent p-3 transition hover:border-cream-300 hover:bg-white"
        >
          <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-cream-200 bg-cream-100 p-1 transition group-hover:border-gold-300 sm:h-28 sm:w-28">
            <img
              src={cat.image || PLACEHOLDER_IMAGE}
              alt={cat.name}
              loading="lazy"
              className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-x-0 bottom-0 hidden bg-brand-950/60 py-1 text-center text-[9px] font-bold text-cream-50 backdrop-blur-sm group-hover:block">
              {toFa(cat.product_count || 0)} محصول
            </span>
          </span>
          <span className="text-center text-xs font-bold text-brand-950 group-hover:text-brand-600">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
