'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { discountPercent, formatPrice, toFa } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Check, Plus, Star } from './Icons';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const image = product.images?.[0] || PLACEHOLDER_IMAGE;
  const off = discountPercent(product.price, product.compare_price);
  const outOfStock = Number(product.stock) <= 0;

  function handleAdd(e) {
    e.preventDefault();
    if (outOfStock) return;
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-cream-300/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-cream-100">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-brand-700 px-2.5 py-1 text-[10px] font-black text-white shadow">
              {toFa(off)}٪ تخفیف
            </span>
          )}
          {product.is_bestseller && (
            <span className="rounded-full bg-brand-900/90 px-2.5 py-1 text-[10px] font-bold text-cream-50 backdrop-blur">
              پرفروش
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-brand-950 px-4 py-1.5 text-xs font-bold text-cream-50">ناموجود</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">
          {product.brand || 'سنز اسکین'}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1.5 line-clamp-2 min-h-[2.85rem] text-[13px] font-bold leading-6 text-brand-950 transition hover:text-brand-600"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-ink/50">
          <span className="flex items-center gap-0.5 text-gold-500">
            <Star className="h-3.5 w-3.5" />
            <span className="font-bold text-brand-900">{toFa(Number(product.rating || 5).toFixed(1))}</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-ink/20" />
          <span>{product.volume || product.skin_type || 'مراقبت روزانه'}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            {product.compare_price > product.price && (
              <div className="text-[11px] text-ink/35 line-through">{formatPrice(product.compare_price)}</div>
            )}
            <div className="text-sm font-extrabold text-brand-900">{formatPrice(product.price)}</div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`افزودن ${product.name} به سبد خرید`}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-800 text-cream-50 hover:bg-brand-900 disabled:bg-cream-300 disabled:text-ink/40'
            }`}
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
