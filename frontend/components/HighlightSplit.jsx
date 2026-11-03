'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Ticket } from './Icons';
import { toFa } from '@/lib/format';

const STATS = [
  { value: '+۱۲٬۰۰۰', label: 'مشتری راضی', img: '/images/home/icon-customers.png' },
  { value: '+۱۵۰', label: 'محصول تخصصی', img: '/images/home/icon-products.png' },
  { value: '۷ روز', label: 'ضمانت بازگشت', img: '/images/home/icon-return.png' },
];

export default function HighlightSplit({ settings = {} }) {
  const [copied, setCopied] = useState(false);
  const phone = settings.phone || '021-91006655';
  const about =
    settings.about_short ||
    'senzskinshop از سال ۱۳۹۶ با تمرکز بر محصولات تخصصی مراقبت پوست فعالیت می‌کند. همه محصولات دارای اصالت، تست‌شده و مناسب آب‌وهوای ایران انتخاب می‌شوند.';

  async function copyCode() {
    try {
      await navigator.clipboard.writeText('SENZ15');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mt-16 grid lg:grid-cols-2">
      {/* ---------- پنل ۱: پیشنهاد ویژه ماه ---------- */}
      <div className="relative isolate overflow-hidden lg:border-l lg:border-white/50">
        <img
          src="/images/banners/promo-offer.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/20" />

        <div className="relative z-10 flex h-full flex-col justify-center px-5 py-14 sm:px-9 lg:min-h-[38rem] lg:px-12 lg:py-16 xl:px-16">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-300 bg-white/70 px-3 py-1 text-[11px] font-bold text-brand-800 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            پیشنهاد ویژه ماه
          </span>

          <h2 className="mt-4 max-w-md text-2xl font-black leading-[1.55] text-brand-950 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.5]">
            ۱۵٪ تخفیف روی اولین سفارش شما
          </h2>

          <p className="mt-4 max-w-md text-[11.5px] leading-7 text-ink/60 sm:text-sm sm:leading-8">
            با کد تخفیف <span className="font-bold text-brand-700">SENZ15</span> اولین خریدت را با تخفیف انجام بده.
            تمام محصولات با ضمانت اصالت و امکان بازگشت ۷ روزه ارسال می‌شوند.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/products?on_sale=1"
              className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-6 py-3 text-sm font-black text-brand-800 transition hover:bg-white"
            >
              خرید با تخفیف
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-400 bg-white/80 px-4 py-2.5 text-xs font-black tracking-widest text-brand-800 backdrop-blur transition hover:bg-white"
              aria-label="کپی کد تخفیف SENZ15"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-brand-700" /> : <Ticket className="h-3.5 w-3.5 text-brand-700" />}
              <span dir="ltr">SENZ15</span>
              <span className="text-[9.5px] font-medium text-ink/55">
                {copied ? 'کپی شد' : 'کپی کد'}
              </span>
            </button>
          </div>

          <p className="mt-5 text-[10px] text-ink/45">
            کد را در صفحه پرداخت، بخش «کد تخفیف» وارد کنید.
          </p>
        </div>
      </div>

      {/* ---------- پنل ۲: چرا senzskinshop ---------- */}
      <div id="why-senz" className="relative isolate overflow-hidden">
        <img
          src="/images/banners/why-senz.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/85 to-white/45" />

        <div className="relative z-10 flex h-full flex-col justify-center px-5 py-14 sm:px-9 lg:min-h-[38rem] lg:px-12 lg:py-16 xl:px-16">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-300 bg-white/70 px-3 py-1 text-[11px] font-bold text-brand-800 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            چرا senzskinshop؟
          </span>

          <h2 className="mt-4 max-w-sm text-2xl font-black leading-[1.55] text-brand-950 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.5]">
            انتخاب علمی، نه تبلیغاتی
          </h2>

          <p className="mt-4 max-w-md text-[11.5px] leading-7 text-ink/60 sm:text-sm sm:leading-8">{about}</p>

          <Link
            href="/about"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-600"
          >
            بیشتر بدانید
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/40 bg-white/55 px-2 py-3.5 text-center backdrop-blur-sm sm:px-3 sm:py-4"
              >
                <img
                  src={stat.img}
                  alt={stat.label}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="mx-auto h-12 w-12 rounded-full object-cover ring-1 ring-gold-300/30 sm:h-14 sm:w-14"
                />
                <p className="mt-2.5 text-sm font-black text-brand-950 sm:text-base">{toFa(stat.value)}</p>
                <p className="mt-1 text-[9.5px] leading-4 text-ink/55 sm:text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cream-50/15 bg-cream-50/[0.07] p-3.5 backdrop-blur-sm">
            <img
              src="/images/home/icon-consult.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={48}
              height={48}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-gold-300/25"
            />
            <div className="min-w-0">
              <p className="text-[10.5px] leading-6 text-ink/60 sm:text-[11px]">
                کارشناسان پوست ما آماده راهنمایی رایگان هستند — از انتخاب روتین تا ترکیب محصولات.
              </p>
              <a
                href={`tel:${String(phone).replace(/[^\d+]/g, '')}`}
                className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-black text-brand-700 hover:text-brand-600 sm:text-xs"
              >
                تماس با مشاور:
                <span dir="ltr">{toFa(phone)}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
