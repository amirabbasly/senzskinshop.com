'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CLIENT_API } from '@/lib/api';
import { Package, Search } from './Icons';

export default function TrackForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${CLIENT_API}/orders/track/${encodeURIComponent(code.trim())}`);
      if (!res.ok) throw new Error('سفارشی با این کد پیدا نشد. کد را بررسی کنید.');
      router.push(`/order/${code.trim()}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[2rem] border border-cream-300/80 bg-white p-7 shadow-soft">
      <div className="mb-5 flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Package className="h-6 w-6" />
        </span>
      </div>
      <h1 className="text-center text-lg font-black text-brand-950">پیگیری سفارش</h1>
      <p className="mt-2 text-center text-[11px] leading-6 text-ink/55">
        کد سفارش خود را وارد کنید (مثلاً SENZ-1234567) و وضعیت ارسال را ببینید.
      </p>

      <div className="mt-5">
        <label className="label">کد سفارش</label>
        <input
          className="input text-center tracking-widest"
          dir="ltr"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SENZ-1234567"
        />
      </div>

      {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-center text-[11px] text-rose-700">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
        <Search className="h-4 w-4" />
        {loading ? 'در حال جست‌وجو…' : 'مشاهده وضعیت سفارش'}
      </button>
    </form>
  );
}
