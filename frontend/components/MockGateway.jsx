'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, CreditCard, ShieldCheck, Loader, ArrowLeft } from './Icons';
import { LogoMark } from './Logo';
import { formatPrice, toFa } from '@/lib/format';

export default function MockGateway({ order }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authority, setAuthority] = useState(searchParams.get('authority') || '');
  const [gateway, setGateway] = useState('mock');
  const [status, setStatus] = useState('idle'); // idle | paying | failed
  const [error, setError] = useState('');
  const started = useRef(false);

  const start = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: order.code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'شروع پرداخت ناموفق بود.');
      setAuthority(data.authority);
      setGateway(data.gateway || 'mock');
      window.history.replaceState(null, '', `/payment/${order.code}?authority=${data.authority}`);
    } catch (err) {
      setError(err.message);
    }
  }, [order.code]);

  useEffect(() => {
    if (!authority && !started.current) {
      started.current = true;
      start();
    }
  }, [authority, start]);

  async function complete(success) {
    setStatus('paying');
    setError('');
    try {
      const res = await fetch('/api/payments/mock/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: order.code, authority, success }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'پردازش پرداخت ناموفق بود.');
      router.replace(`/order/${order.code}?payment=${success ? 'success' : 'failed'}`);
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  }

  const busy = status === 'paying';

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-cream-200 bg-cream-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <div>
              <p className="text-[12px] font-black text-brand-950">درگاه پرداخت اینترنتی</p>
              <p className="text-[10px] text-ink/45">محیط آزمایشی (شبیه‌ساز) — بدون تراکنش واقعی</p>
            </div>
          </div>
          <span className="rounded-full bg-brand-950 px-3 py-1 text-[10px] font-bold text-cream-50">
            {gateway === 'mock' ? 'SENZ PAY' : gateway.toUpperCase()}
          </span>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream-100/70 p-4">
            <p className="text-[10px] text-ink/45">مبلغ قابل پرداخت</p>
            <p className="mt-1 text-lg font-black text-brand-950">{formatPrice(order.total)}</p>
            <p className="mt-2 text-[10px] text-ink/45">
              شماره سفارش: <span dir="ltr">{order.code}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-cream-200 p-4">
            <p className="text-[10px] text-ink/45">پذیرنده</p>
            <p className="mt-1 text-[12px] font-bold text-brand-950">سنز اسکین شاپ</p>
            <p className="mt-2 line-clamp-1 text-[10px] text-ink/45">
              {order.customer_name} — <span dir="ltr">{toFa(order.phone || '')}</span>
            </p>
            <p className="mt-1 text-[10px] text-ink/45">
              شناسه تراکنش: <span dir="ltr" className="font-mono">{authority || '—'}</span>
            </p>
          </div>
        </div>

        <div className="mx-6 mb-5 rounded-2xl border border-dashed border-gold-300 bg-gold-50/40 px-4 py-3 text-[10.5px] leading-6 text-brand-900/70">
          <p className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-700" />
            این صفحه یک درگاه آزمایشی است
          </p>
          <p className="mt-1">
            برای اتصال درگاه واقعی (زرین‌پال، آیدی‌پی یا زیبال) فقط کلید مرچنت را در فایل
            <span className="mx-1 font-mono text-[10px]">backend/src/payments.js</span>
            قرار دهید.
          </p>
        </div>

        {error && <p className="mx-6 mb-4 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}

        <div className="flex flex-col gap-2.5 border-t border-cream-200 bg-cream-50 px-6 py-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => complete(true)}
            disabled={busy || !authority}
            className="btn-primary flex-1"
          >
            {busy ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                در حال پردازش…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                پرداخت موفق (شبیه‌سازی)
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => complete(false)}
            disabled={busy || !authority}
            className="btn-outline flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
            انصراف از پرداخت
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-cream-200 px-6 py-3 text-[10px] text-ink/40">
          <CreditCard className="h-3.5 w-3.5" />
          اطلاعات کارت شما در این محیط ذخیره نمی‌شود.
        </div>
      </div>

      <p className="mt-4 text-center text-[10.5px] text-ink/40">
        <Link href={`/order/${order.code}`} className="hover:text-brand-700">
          بازگشت به صفحه سفارش بدون پرداخت
        </Link>
      </p>
    </div>
  );
}
