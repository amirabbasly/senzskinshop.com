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
    'سنز اسکین شاپ از سال ۱۳۹۶ با تمرکز بر محصولات تخصصی مراقبت پوست فعالیت می‌کند. همه محصولات دارای اصالت، تست‌شده و مناسب آب‌وهوای ایران انتخاب می‌شوند.';

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
      <div className="relative isolate overflow-hidden lg:border-l lg:border-cream-50/10">
        <img
          src="/images/banners/promo-offer.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-950/92 via-brand-950/72 to-brand-950/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-transparent to-brand-950/20" />

        <div className="relative z-10 flex h-full flex-col justify-center px-5 py-14 sm:px-9 lg:min-h-[38rem] lg:px-12 lg:py-16 xl:px-16">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[11px] font-bold text-gold-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            پیشنهاد ویژه ماه
          </span>

          <h2 className="mt-4 max-w-md text-2xl font-black leading-[1.55] text-cream-50 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.5]">
            ۱۵٪ تخفیف روی اولین سفارش شما
          </h2>

          <p className="mt-4 max-w-md text-[11.5px] leading-7 text-cream-100/75 sm:text-sm sm:leading-8">
            با کد تخفیف <span className="font-bold text-cream-50">SENZ15</span> اولین خریدت را با تخفیف انجام بده.
            تمام محصولات با ضمانت اصالت و امکان بازگشت ۷ روزه ارسال می‌شوند.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/products?on_sale=1"
              className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-black text-brand-950 transition hover:bg-gold-300"
            >
              خرید با تخفیف
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-cream-50/35 bg-cream-50/10 px-4 py-2.5 text-xs font-black tracking-widest text-cream-50 backdrop-blur transition hover:bg-cream-50/15"
              aria-label="کپی کد تخفیف SENZ15"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Ticket className="h-3.5 w-3.5 text-gold-300" />}
              <span dir="ltr">SENZ15</span>
              <span className="text-[9.5px] font-medium text-cream-100/60">
                {copied ? 'کپی شد' : 'کپی کد'}
              </span>
            </button>
          </div>

          <p className="mt-5 text-[10px] text-cream-100/45">
            کد را در صفحه پرداخت، بخش «کد تخفیف» وارد کنید.
          </p>
        </div>
      </div>

      {/* ---------- پنل ۲: چرا سنز اسکین ---------- */}
      <div id="why-senz" className="relative isolate overflow-hidden">
        <img
          src="/images/banners/why-senz.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-brand-950/90 via-brand-950/78 to-brand-950/45" />

        <div className="relative z-10 flex h-full flex-col justify-center px-5 py-14 sm:px-9 lg:min-h-[38rem] lg:px-12 lg:py-16 xl:px-16">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cream-50/20 bg-cream-50/10 px-3 py-1 text-[11px] font-bold text-cream-100 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            چرا سنز اسکین؟
          </span>

          <h2 className="mt-4 max-w-sm text-2xl font-black leading-[1.55] text-cream-50 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.5]">
            انتخاب علمی، نه تبلیغاتی
          </h2>

          <p className="mt-4 max-w-md text-[11.5px] leading-7 text-cream-100/75 sm:text-sm sm:leading-8">{about}</p>

          <Link
            href="/about"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-gold-300 hover:text-gold-200"
          >
            بیشتر بدانید
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-cream-50/12 bg-brand-950/40 px-2 py-3.5 text-center backdrop-blur-sm sm:px-3 sm:py-4"
              >
                <img
                  src={stat.img}
                  alt={stat.label}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="mx-auto h-12 w-12 rounded-full object-cover ring-1 ring-gold-300/30 sm:h-14 sm:w-14"
                />
                <p className="mt-2.5 text-sm font-black text-cream-50 sm:text-base">{toFa(stat.value)}</p>
                <p className="mt-1 text-[9.5px] leading-4 text-cream-100/60 sm:text-[10px]">{stat.label}</p>
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
              <p className="text-[10.5px] leading-6 text-cream-100/75 sm:text-[11px]">
                کارشناسان پوست ما آماده راهنمایی رایگان هستند — از انتخاب روتین تا ترکیب محصولات.
              </p>
              <a
                href={`tel:${String(phone).replace(/[^\d+]/g, '')}`}
                className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-black text-gold-300 hover:text-gold-200 sm:text-xs"
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
