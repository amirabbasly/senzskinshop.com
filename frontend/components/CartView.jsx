'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { DEFAULT_SETTINGS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { CLIENT_API } from '@/lib/api';
import { formatPrice, toFa } from '@/lib/format';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash, Truck } from './Icons';

export default function CartView() {
  const { items, setQty, remove, subtotal, ready } = useCart();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch(`${CLIENT_API}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {});
  }, []);

  const freeShipping = Number(settings.free_shipping_min || 0);
  const remaining = Math.max(freeShipping - subtotal, 0);
  const shipping = freeShipping > 0 && subtotal >= freeShipping ? 0 : Number(settings.shipping_cost || 0);

  if (!ready) {
    return <div className="container-page py-16 text-center text-sm text-ink/40">در حال بارگذاری سبد خرید…</div>;
  }

  if (!items.length) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-cream-400 bg-white p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-lg font-black text-brand-950">سبد خرید شما خالی است</h1>
          <p className="mt-2 text-xs leading-6 text-ink/55">
            محصولات تخصصی مراقبت پوست را ببینید و روتین مناسب خودتان را انتخاب کنید.
          </p>
          <Link href="/products" className="btn-primary btn-sm mt-6">
            شروع خرید
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-xl font-black text-brand-950">سبد خرید ({toFa(items.length)} محصول)</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {remaining > 0 && (
            <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-[11px] text-brand-900">
              <Truck className="h-4 w-4 shrink-0" />
              <span>
                تنها <strong className="font-black">{formatPrice(remaining)}</strong> تا ارسال رایگان باقی مانده است.
              </span>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-cream-300/80 bg-white p-3.5 sm:p-4"
            >
              <Link href={`/products/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/products/${item.slug}`} className="line-clamp-2 text-xs font-bold leading-6 text-brand-950 sm:text-sm">
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label="حذف از سبد"
                    className="rounded-lg p-1.5 text-ink/35 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-full border border-cream-300">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-100"
                      aria-label="افزایش"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold">{toFa(item.qty)}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream-100"
                      aria-label="کاهش"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-ink/40">{formatPrice(item.price)} × {toFa(item.qty)}</div>
                    <div className="text-sm font-extrabold text-brand-900">{formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-cream-300/80 bg-white p-5 lg:sticky lg:top-32">
          <h2 className="text-sm font-extrabold text-brand-950">خلاصه سفارش</h2>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-ink/55">جمع کالاها</dt>
              <dd className="font-bold text-brand-950">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/55">هزینه ارسال</dt>
              <dd className="font-bold text-brand-950">{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-cream-200 pt-3 text-sm">
              <dt className="font-bold text-ink/70">مبلغ قابل پرداخت</dt>
              <dd className="font-black text-brand-900">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-5 w-full">
            ادامه فرآیند خرید
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href="/products" className="btn-ghost btn-sm mt-2 w-full text-ink/50">
            ادامه خرید
          </Link>

          <p className="mt-4 rounded-xl bg-cream-100/80 p-3 text-[10px] leading-5 text-ink/50">
            کد تخفیف را می‌توانید در مرحله بعدی (تسویه حساب) وارد کنید. پرداخت در محل و کارت به کارت فعال است.
          </p>
        </aside>
      </div>
    </div>
  );
}
