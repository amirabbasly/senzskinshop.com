'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeft, RefreshCw } from '@/components/Icons';

export default function SiteError({ error, reset }) {
  useEffect(() => {
    console.error('[site error]', error);
  }, [error]);

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-md rounded-[2rem] border border-cream-300 bg-white p-10 text-center shadow-soft">
        <h1 className="text-lg font-extrabold text-brand-950">مشکلی در نمایش این صفحه پیش آمد</h1>
        <p className="mt-2 text-xs leading-6 text-ink/55">
          اتصال به سرور یا بارگذاری اطلاعات با خطا مواجه شد. لطفاً دوباره تلاش کنید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reset} className="btn-primary btn-sm">
            <RefreshCw className="h-4 w-4" />
            تلاش دوباره
          </button>
          <Link href="/" className="btn-outline btn-sm">
            صفحه اصلی
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
