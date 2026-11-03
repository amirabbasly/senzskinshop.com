'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { discountPercent, formatPrice, toFa } from '@/lib/format';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Plus } from './Icons';

function ShowcaseCard({ product }) {
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
    <article className="group w-[134px] shrink-0 snap-start rounded-xl border border-brand-100 bg-white p-2 shadow-[0_8px_20px_-16px_rgba(70,5,31,.4)] transition hover:-translate-y-0.5 hover:shadow-card sm:w-[188px] sm:rounded-2xl sm:p-2.5">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-lg bg-cream-100 sm:rounded-xl">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {off > 0 && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-brand-700 px-1.5 py-0.5 text-[9.5px] font-black text-white shadow-sm sm:right-2 sm:top-2 sm:rounded-lg sm:px-2 sm:text-[10.5px]">
            {toFa(off)}٪
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-brand-950/85 py-0.5 text-center text-[8.5px] font-bold text-cream-50 backdrop-blur sm:inset-x-2 sm:bottom-2 sm:rounded-lg sm:py-1 sm:text-[9.5px]">
            ناموجود
          </span>
        )}
      </Link>

      <Link
        href={`/products/${product.slug}`}
        className="mt-1.5 line-clamp-2 min-h-[2.15rem] text-[10.5px] font-bold leading-4 text-brand-950 transition hover:text-brand-700 sm:mt-2 sm:min-h-[2.6rem] sm:text-[11.5px] sm:leading-5"
      >
        {product.name}
      </Link>

      <div className="mt-1 flex items-end justify-between gap-1 sm:mt-1.5">
        <div className="min-w-0">
          {off > 0 && (
            <p className="text-[8.5px] text-ink/35 line-through sm:text-[9.5px] sm:leading-4">
              {formatPrice(product.compare_price)}
            </p>
          )}
          <p className="truncate text-[11px] font-black text-brand-800 sm:text-[12.5px]">
            {formatPrice(product.price)}
            <span className="mr-0.5 text-[8px] font-medium text-ink/45 sm:mr-1 sm:text-[8.5px]">تومان</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label="افزودن به سبد خرید"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-cream-300 disabled:text-ink/40 sm:h-8 sm:w-8"
        >
          {added ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        </button>
      </div>
    </article>
  );
}

export default function ProductShowcase({
  products = [],
  title = 'پیشنهادهای امروز',
  subtitle = 'منتخب کارشناسان SENZ با بهترین قیمت',
  href = '/products',
}) {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);

  if (!products.length) return null;

  const scrollRail = (dir) => {
    railRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? (Math.abs(el.scrollLeft) / max) * 100 : 0);
  };

  return (
    <section className="container-page mt-10 sm:mt-14">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-200 bg-gradient-to-l from-brand-100 via-brand-50 to-brand-200 p-2.5 shadow-soft sm:rounded-[2rem] sm:p-4 lg:p-5">
        <span className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/50" />
        <span className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-brand-200/40" />

        {/* هدر موبایل */}
        <div className="relative mb-2 flex items-center justify-between gap-2 px-1 sm:hidden">
          <div>
            <p className="text-[12px] font-black text-brand-950">{title}</p>
            <p className="mt-0.5 text-[9px] text-ink/50">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="shrink-0 rounded-lg bg-brand-700 px-2 py-1 text-[9.5px] font-bold text-white shadow-sm"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="relative flex gap-2 sm:gap-3">
          {/* کارت پیشنهاد روزانه */}
          <div className="hidden w-[176px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-white/80 p-4 text-center backdrop-blur-sm sm:flex lg:w-[200px]">
            <img
              src="/images/home/percent-tag.png"
              alt=""
              aria-hidden="true"
              width={110}
              height={110}
              className="h-20 w-20 object-contain drop-shadow-lg lg:h-24 lg:w-24"
            />
            <p className="text-[13px] font-black text-brand-950 lg:text-sm">{title}</p>
            <p className="text-[9px] leading-4 text-ink/50">{subtitle}</p>
            <Link
              href={href}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-brand-800"
            >
              مشاهده همه
              <ArrowLeft className="h-3 w-3" />
            </Link>
          </div>

          {/* ریل محصولات */}
          <div
            ref={railRef}
            onScroll={onScroll}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <ShowcaseCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* کنترل‌ها */}
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-brand-200">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${Math.max(progress, 12)}%` }}
            />
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scrollRail(1)}
              aria-label="محصولات بعدی"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 bg-white/80 text-brand-800 backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              aria-label="محصولات قبلی"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 bg-white/80 text-brand-800 backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
