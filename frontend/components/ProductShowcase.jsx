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
    <article className="group w-[164px] shrink-0 snap-start rounded-2xl bg-white p-2.5 shadow-[0_10px_24px_-18px_rgba(70,5,31,.45)] transition hover:-translate-y-0.5 hover:shadow-card sm:w-[188px]">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-xl bg-cream-100">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        {off > 0 && (
          <span className="absolute right-2 top-2 rounded-lg bg-brand-600 px-2 py-0.5 text-[10.5px] font-black text-white shadow-sm">
            {toFa(off)}٪
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-lg bg-brand-950/85 py-1 text-center text-[9.5px] font-bold text-cream-50 backdrop-blur">
            ناموجود
          </span>
        )}
      </Link>

      <Link
        href={`/products/${product.slug}`}
        className="mt-2 line-clamp-2 min-h-[2.6rem] text-[11.5px] font-bold leading-5 text-brand-950 transition hover:text-brand-600"
      >
        {product.name}
      </Link>

      <div className="mt-1.5 flex items-end justify-between gap-1">
        <div className="min-w-0">
          {off > 0 && (
            <p className="text-[9.5px] leading-4 text-ink/35 line-through">{formatPrice(product.compare_price)}</p>
          )}
          <p className="truncate text-[12.5px] font-black text-brand-800">
            {formatPrice(product.price)}
            <span className="mr-1 text-[8.5px] font-medium text-ink/45">تومان</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label="افزودن به سبد خرید"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-cream-300 disabled:text-ink/40"
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
}

export default function ProductShowcase({
  products = [],
  title = 'پیشنهادهای امروز',
  subtitle = 'منتخب کارشناسان سنز با بهترین قیمت',
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
    <section className="container-page mt-14">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-brand-600 via-brand-500 to-brand-700 p-3 shadow-card sm:p-5">
        <span className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/[0.07]" />

        {/* هدر موبایل */}
        <div className="relative mb-2.5 flex items-center justify-between gap-2 px-1 sm:hidden">
          <div>
            <p className="text-[13px] font-black text-white">{title}</p>
            <p className="mt-0.5 text-[9.5px] text-white/70">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-brand-700 shadow-sm"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="relative flex gap-2.5 sm:gap-3">
          {/* کارت پیشنهاد روزانه */}
          <div className="hidden w-[186px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] p-4 text-center backdrop-blur-sm sm:flex lg:w-[210px]">
            <img
              src="/images/home/percent-tag.png"
              alt=""
              aria-hidden="true"
              width={120}
              height={120}
              className="h-24 w-24 object-contain drop-shadow-lg lg:h-28 lg:w-28"
            />
            <p className="text-sm font-black text-white lg:text-[15px]">{title}</p>
            <p className="text-[9.5px] leading-4 text-white/70">{subtitle}</p>
            <Link
              href={href}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-[10.5px] font-bold text-brand-700 shadow-sm transition hover:bg-cream-50"
            >
              مشاهده همه
              <ArrowLeft className="h-3 w-3" />
            </Link>
          </div>

          {/* ریل محصولات */}
          <div
            ref={railRef}
            onScroll={onScroll}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 sm:gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product) => (
              <ShowcaseCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* کنترل‌ها */}
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${Math.max(progress, 12)}%` }} />
          </div>
          <div className="hidden gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scrollRail(1)}
              aria-label="محصولات بعدی"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              aria-label="محصولات قبلی"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
