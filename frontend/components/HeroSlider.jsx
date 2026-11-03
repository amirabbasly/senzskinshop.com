'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from './Icons';

const FALLBACK = [
  {
    id: 'fallback',
    title: 'پوست شما، شایسته بهترین مراقبت',
    subtitle: 'کالکشن تخصصی سرم و آبرسان سنز اسکین با فرمولاسیون علمی',
    badge: 'کالکشن جدید',
    image: '/images/banners/hero-1.jpg',
    link: '/products',
    btn_text: 'مشاهده کالکشن',
  },
];

export default function HeroSlider({ banners = [] }) {
  const slides = banners.length ? banners : FALLBACK;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const go = (dir) => setIndex((i) => (i + dir + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      {/* تصویر تمام‌صفحه در موبایل و دسکتاپ */}
      <img
        key={slide.id || index}
        src={slide.image || '/images/banners/hero-1.jpg'}
        alt={slide.title || 'سنز اسکین شاپ'}
        className="absolute inset-0 h-full w-full object-cover object-center animate-floatUp"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-950/15 lg:bg-gradient-to-l lg:from-brand-950/95 lg:via-brand-950/65 lg:to-brand-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-[76svh] items-end pb-16 pt-24 sm:min-h-[78svh] sm:pb-20 md:min-h-[560px] md:items-center md:pb-0 lg:min-h-[calc(100vh-9.5rem)] lg:py-20">
        <div className="w-full px-5 sm:px-8 lg:max-w-2xl lg:px-14 xl:px-20">
          {slide.badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-300/10 px-3 py-1 text-[10.5px] font-bold text-gold-200 backdrop-blur sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              {slide.badge}
            </span>
          )}
          <h1 className="mt-3.5 text-balance text-[1.65rem] font-black leading-[1.5] text-cream-50 sm:mt-4 sm:text-3xl lg:text-[3.15rem] lg:leading-[1.4]">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-md text-[11.5px] leading-7 text-cream-100/80 sm:mt-4 sm:text-sm lg:max-w-lg lg:text-base lg:leading-8">
            {slide.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
            <Link
              href={slide.link || '/products'}
              className="inline-flex items-center gap-2 rounded-full bg-brand-200 px-5 py-2.5 text-[12.5px] font-black text-brand-900 shadow-soft transition hover:bg-brand-100 sm:px-6 sm:py-3 sm:text-sm"
            >
              {slide.btn_text || 'مشاهده محصولات'}
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-cream-50/30 px-5 py-2.5 text-[12.5px] font-bold text-cream-50 transition hover:bg-cream-50/10 sm:px-6 sm:py-3 sm:text-sm"
            >
              درباره سنز اسکین
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-cream-100/70 sm:mt-8 sm:gap-x-5 sm:text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              ارسال سریع به سراسر ایران
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              ضمانت اصالت کالا
            </span>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="اسلاید بعدی"
            className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur transition hover:bg-cream-50/25 md:flex lg:right-6"
          >
            <ChevronRight />
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="اسلاید قبلی"
            className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur transition hover:bg-cream-50/25 md:flex lg:left-6"
          >
            <ChevronLeft />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5">
            {slides.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`اسلاید ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-7 bg-cream-50' : 'w-3 bg-cream-50/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
