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
    <section className="relative overflow-hidden rounded-[2rem] bg-brand-950">
      <div className="relative grid min-h-[420px] items-center md:min-h-[480px] md:grid-cols-2">
        <div className="relative z-10 p-7 sm:p-10 lg:p-14">
          {slide.badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[11px] font-bold text-gold-300">
              <Sparkles className="h-3.5 w-3.5" />
              {slide.badge}
            </span>
          )}
          <h1 className="mt-4 text-balance text-2xl font-black leading-[1.5] text-cream-50 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.45]">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-md text-xs leading-7 text-cream-100/70 sm:text-sm">{slide.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={slide.link || '/products'}
              className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-black text-brand-950 transition hover:bg-gold-300"
            >
              {slide.btn_text || 'مشاهده محصولات'}
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-6 py-3 text-sm font-bold text-cream-50 transition hover:bg-cream-50/10"
            >
              درباره سنز اسکین
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-5 text-[11px] text-cream-100/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              ارسال رایگان بالای ۱٫۵ میلیون
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              ضمانت اصالت کالا
            </span>
          </div>
        </div>

        <div className="relative h-64 w-full md:h-full">
          <img
            key={slide.id}
            src={slide.image || '/images/banners/hero-1.jpg'}
            alt={slide.title || 'سنز اسکین شاپ'}
            className="absolute inset-0 h-full w-full object-cover opacity-90 animate-floatUp"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand-950/20 to-brand-950 md:bg-gradient-to-l md:from-transparent md:via-brand-950/10 md:to-brand-950" />
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="اسلاید بعدی"
            className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur transition hover:bg-cream-50/25 md:flex"
          >
            <ChevronRight />
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="اسلاید قبلی"
            className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/15 text-cream-50 backdrop-blur transition hover:bg-cream-50/25 md:flex"
          >
            <ChevronLeft />
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`اسلاید ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-7 bg-gold-400' : 'w-3 bg-cream-50/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
