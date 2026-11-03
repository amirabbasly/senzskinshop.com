'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/Logo';
import { ArrowLeft, Check, Loader } from '@/components/Icons';
import { getToken, setSession } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace('/admin');
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ورود انجام نشد.');
      setSession(data.token, data.admin);
      router.replace('/admin');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-950 lg:block">
        <img
          src="/images/banners/hero-1.jpg"
          alt="senzskinshop"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-950/30" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <LogoMark className="h-14 w-14" />
          <div>
            <h1 className="text-2xl font-black leading-10 text-cream-50">
              پنل مدیریت senzskinshop
            </h1>
            <p className="mt-3 max-w-sm text-xs leading-7 text-cream-100/70">
              محصولات، دسته‌بندی‌ها، سفارش‌ها، بنرها و تنظیمات سایت را از یک داشبورد ساده مدیریت کنید.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-cream-100/60">
              {['مدیریت کامل محصولات', 'پیگیری سفارش‌ها', 'تنظیمات سایت'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-gold-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] tracking-widest text-cream-100/40" dir="ltr">
            SENZ SKIN SHOP — ADMIN
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cream-50 px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="text-sm font-black text-brand-950">senzskinshop</p>
              <p className="text-[10px] tracking-widest text-gold-600">ADMIN PANEL</p>
            </div>
          </div>

          <h1 className="text-xl font-black text-brand-950">ورود به پنل مدیریت</h1>
          <p className="mt-2 text-[11px] text-ink/50">برای ادامه، ایمیل و رمز عبور مدیر را وارد کنید.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="label">ایمیل مدیر</label>
              <input
                className="input"
                dir="ltr"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@senzskinshop.com"
              />
            </div>
            <div>
              <label className="label">رمز عبور</label>
              <input
                className="input"
                dir="ltr"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {loading ? 'در حال ورود…' : 'ورود به پنل'}
            </button>
          </form>

          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-ink/45 hover:text-brand-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
