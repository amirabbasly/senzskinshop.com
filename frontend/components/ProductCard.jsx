'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { discountPercent, formatPrice, toFa } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Check, ShoppingBag } from './Icons';

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-300/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-white">
        <div className="aspect-square overflow-hidden p-2">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          {off > 0 && (
            <span className="rounded-md bg-brand-700 px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm">
              {toFa(off)}٪
            </span>
          )}
          {product.is_bestseller && (
            <span className="rounded-md bg-brand-900/90 px-1.5 py-0.5 text-[9.5px] font-bold text-cream-50 backdrop-blur">
              پرفروش
            </span>
          )}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-brand-950 px-4 py-1.5 text-xs font-bold text-cream-50">ناموجود</span>
          </div>
        )}

        <span className="pointer-events-none absolute inset-x-2 bottom-2 hidden translate-y-2 rounded-lg bg-white/95 py-1.5 text-center text-[10px] font-bold text-brand-800 opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          مشاهده سریع
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
        <span className="text-[9.5px] font-semibold text-brand-500">{product.brand || 'سنز اسکین'}</span>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[2.5rem] text-[12px] font-bold leading-5 text-brand-950 transition hover:text-brand-700"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-2">
          <div>
            {product.compare_price > product.price && (
              <div className="text-[10px] text-ink/35 line-through">{formatPrice(product.compare_price)}</div>
            )}
            <div className="text-[13px] font-extrabold text-brand-900">
              {formatPrice(product.price)}
              <span className="mr-0.5 text-[9px] font-medium text-ink/45">تومان</span>
            </div>
          </div>
          <span className="mb-0.5 text-[9px] text-ink/40">{product.volume || ''}</span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label={`افزودن ${product.name} به سبد خرید`}
          className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition ${
            added
              ? 'bg-brand-800 text-white'
              : 'bg-brand-700 text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-ink/40'
          }`}
        >
          {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
          {added ? 'به سبد اضافه شد' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </article>
  );
}
