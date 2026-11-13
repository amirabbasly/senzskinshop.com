'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';
import { Sliders } from './Icons';

export default function SortSelect({ value = 'newest' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-3.5 py-2 text-xs text-ink/60">
      <Sliders className="h-4 w-4 text-brand-700" />
      <span className="hidden sm:block">مرتب‌سازی:</span>
      <select
        value={value}
        onChange={onChange}
        className="bg-transparent text-xs font-bold text-brand-900 outline-none"
        aria-label="مرتب‌سازی محصولات"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
