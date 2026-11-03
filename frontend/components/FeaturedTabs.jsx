'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { ArrowLeft } from './Icons';

export default function FeaturedTabs({ tabs = [] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];
  if (!current || !current.items?.length) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">منتخب‌های senzskinshop</h2>
          <p className="section-sub">محصولاتی که مشتریان بیشترین رضایت را از آن‌ها داشته‌اند</p>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-full border border-cream-300 bg-white p-1.5">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                i === active ? 'bg-brand-800 text-cream-50 shadow' : 'text-brand-900 hover:bg-brand-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {current.items.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href={current.href || '/products'}
          className="group inline-flex items-center gap-2 rounded-full border border-brand-800/20 px-6 py-2.5 text-xs font-bold text-brand-900 transition hover:border-brand-800 hover:bg-brand-50"
        >
          مشاهده همه محصولات
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
