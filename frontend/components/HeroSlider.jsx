'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from './Icons';

const BIG_FALLBACK = [
  {
    id: 'big-1',
    brand: 'THE ORDINARY',
    title: 'پوست شفاف با سرم‌های اوردینری',
    subtitle: 'هیالورونیک اسید، نیاسینامید و رتینول — اورجینال با ضمانت اصالت senzskinshop',
    image: '/images/banners/hero-ordinary.jpg',
    link: '/products',
    btn_text: 'مشاهده محصولات',
  },
  {
    id: 'big-2',
    brand: 'CeraVe',
    title: 'پاکسازی و آبرسانی با سراوی',
    subtitle: 'کلینزر و مرطوب‌کننده سراوی برای پوست خشک و حساس',
    image: '/images/banners/hero-cerave.jpg',
    link: '/products',
    btn_text: 'خرید محصولات سراوی',
  },
];

const SIDE_FALLBACK = [
  {
    id: 'side-1',
    brand: 'ISDIN',
    title: 'ضدآفتاب ایزدین',
    subtitle: 'محافظت روزانه با SPF50',
    image: '/images/banners/cat-skin.jpg',
    link: '/category/sunscreen',
    btn_text: 'خرید ضدآفتاب',
  },
  {
    id: 'side-2',
    brand: 'Fino',
    title: 'مراقبت از مو با فینو',
    subtitle: 'ماسک و روغن موی ژاپنی',
    image: '/images/banners/cat-hair.jpg',
    link: '/category/hair',
    btn_text: 'خرید محصولات مو',
  },
];

function useAutoSlide(length, delay = 6500) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % length), delay);
    return () => clearInterval(timer);
  }, [length, delay]);
  return [index, setIndex];
}

export default function HeroSlider({ banners = [], sideBanners = [] }) {
  const big = banners.length ? banners : BIG_FALLBACK;
  const side = sideBanners.length ? sideBanners : SIDE_FALLBACK;
  const [bigIndex, setBigIndex] = useAutoSlide(big.length);
  const [sideIndex, setSideIndex] = useAutoSlide(side.length, 5200);

  const bigSlide = big[bigIndex % big.length];
  const sideSlide = side[sideIndex % side.length];
  const goBig = (dir) => setBigIndex((i) => (i + dir + big.length) % big.length);

  return (
    <section className="container-page mt-2 sm:mt-3">
      <div className="grid gap-2.5 lg:grid-cols-[1.9fr_1fr] lg:gap-3">
        {/* ---------- اسلایدر بزرگ ---------- */}
        <div className="relative isolate min-h-[52svh] overflow-hidden rounded-2xl bg-brand-950 shadow-soft sm:min-h-[58svh] sm:rounded-[1.75rem] lg:min-h-[520px]">
          <img
            key={bigSlide.id || bigIndex}
            src={bigSlide.image || '/images/banners/hero-ordinary.jpg'}
            alt={bigSlide.title || 'senzskinshop'}
            className="absolute inset-0 h-full w-full animate-floatUp object-cover object-[32%_58%] lg:object-[38%_52%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/55 to-brand-950/10 lg:bg-gradient-to-l lg:from-brand-950/90 lg:via-brand-950/45 lg:to-transparent" />

          <span
            className="absolute right-4 top-4 hidden text-[15px] font-black tracking-[0.22em] text-cream-50/90 drop-shadow-sm sm:right-6 sm:top-5 sm:block sm:text-[20px] lg:text-[24px]"
            dir="ltr"
          >
            {bigSlide.badge || bigSlide.brand}
          </span>

          <div className="relative z-10 flex min-h-[52svh] items-end pb-12 pt-16 sm:min-h-[58svh] sm:pb-14 lg:min-h-[520px] lg:items-center lg:pb-0">
            <div className="w-full px-5 sm:px-8 lg:max-w-xl lg:px-11">
              <span
                className="inline-flex items-center rounded-full bg-cream-50/95 px-3 py-1 text-[10px] font-black tracking-[0.14em] text-brand-900 shadow-sm sm:hidden"
                dir="ltr"
              >
                {bigSlide.badge || bigSlide.brand}
              </span>
              <h1 className="mt-3 text-balance text-[1.35rem] font-black leading-[1.6] text-cream-50 sm:mt-4 sm:text-[1.75rem] lg:text-[2.35rem] lg:leading-[1.55]">
                {bigSlide.title}
              </h1>
              <p className="mt-2.5 max-w-md text-[11px] leading-6 text-cream-100/80 sm:text-[12.5px] lg:text-sm lg:leading-7">
                {bigSlide.subtitle}
              </p>
              <Link
                href={bigSlide.link || '/products'}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-200 px-5 py-2.5 text-[12px] font-black text-brand-900 shadow-soft transition hover:bg-cream-50 sm:text-[13px]"
              >
                {bigSlide.btn_text || 'مشاهده محصولات'}
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {big.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goBig(1)}
                aria-label="اسلاید بعدی"
                className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/20 text-cream-50 backdrop-blur transition hover:bg-cream-50/30 md:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goBig(-1)}
                aria-label="اسلاید قبلی"
                className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/20 text-cream-50 backdrop-blur transition hover:bg-cream-50/30 md:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
                {big.map((slide, index) => (
                  <button
                    key={slide.id || index}
                    type="button"
                    onClick={() => setBigIndex(index)}
                    aria-label={`اسلاید ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === bigIndex % big.length ? 'w-6 bg-cream-50' : 'w-2.5 bg-cream-50/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ---------- اسلایدر کوچک ---------- */}
        <div className="relative isolate min-h-[190px] overflow-hidden rounded-2xl bg-brand-900 shadow-soft sm:min-h-[220px] sm:rounded-[1.75rem] lg:min-h-0">
          <img
            key={sideSlide.id || sideIndex}
            src={sideSlide.image || '/images/banners/cat-skin.jpg'}
            alt={sideSlide.title || 'senzskinshop'}
            className="absolute inset-0 h-full w-full animate-floatUp object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/55 to-brand-950/5" />

          <span
            className="absolute right-4 top-3.5 text-[12px] font-black tracking-[0.2em] text-cream-50/90 drop-shadow-sm sm:text-[14px]"
            dir="ltr"
          >
            {sideSlide.badge || sideSlide.brand}
          </span>

          <div className="relative z-10 flex h-full min-h-[190px] flex-col justify-end gap-1.5 p-4 sm:min-h-[220px] sm:p-5 lg:min-h-0">
            <h2 className="text-[15px] font-black leading-6 text-cream-50 sm:text-[17px]">{sideSlide.title}</h2>
            <p className="line-clamp-2 text-[10px] leading-5 text-cream-100/75 sm:text-[11px]">{sideSlide.subtitle}</p>
            <Link
              href={sideSlide.link || '/products'}
              className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-cream-50/95 px-3 py-1.5 text-[10px] font-black text-brand-900 transition hover:bg-cream-50 sm:text-[11px]"
            >
              {sideSlide.btn_text || 'مشاهده محصولات'}
              <ArrowLeft className="h-3 w-3" />
            </Link>

            {side.length > 1 && (
              <div className="mt-2 flex items-center gap-1.5">
                {side.map((slide, index) => (
                  <button
                    key={slide.id || index}
                    type="button"
                    onClick={() => setSideIndex(index)}
                    aria-label={`اسلاید ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      index === sideIndex % side.length ? 'w-5 bg-cream-50' : 'w-2 bg-cream-50/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
