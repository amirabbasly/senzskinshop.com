'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCustomer } from './CustomerProvider';
import { LogoMark } from './Logo';
import { ArrowLeft, Check, Leaf, ShieldCheck, Truck, User } from './Icons';
import { toFa } from '@/lib/format';

export default function AuthView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const { login, register, isLoggedIn, ready } = useCustomer();

  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ name: '', phone: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && isLoggedIn) router.replace(next);
  }, [ready, isLoggedIn, next, router]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login({ phone: form.phone, password: form.password });
      } else {
        await register(form);
      }
      router.replace(next);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white shadow-soft lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-950 p-8 lg:flex">
          <img
            src="/images/banners/hero-2.jpg"
            alt="سنز اسکین شاپ"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-950/30" />
          <div className="relative">
            <LogoMark className="h-12 w-12" />
            <h2 className="mt-6 text-xl font-black leading-9 text-cream-50">
              حساب کاربری سنز اسکین
            </h2>
            <p className="mt-3 text-[11.5px] leading-6 text-cream-100/70">
              با ساخت حساب، سفارش‌ها و آدرس‌های خود را در یک‌جا ببینید و سریع‌تر خرید کنید.
            </p>
          </div>
          <div className="relative mt-8 space-y-2.5">
            {[
              { icon: Truck, text: 'پیگیری آسان سفارش‌ها' },
              { icon: ShieldCheck, text: 'پرداخت امن و ضمانت اصالت' },
              { icon: Leaf, text: 'پیشنهادهای اختصاصی برای پوست شما' },
            ].map((item) => (
              <p key={item.text} className="flex items-center gap-2 text-[11px] text-cream-100/70">
                <item.icon className="h-4 w-4 text-gold-300" />
                {item.text}
              </p>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-9">
          <div className="mb-6 flex rounded-full bg-cream-100 p-1">
            {[
              { key: 'login', label: 'ورود' },
              { key: 'register', label: 'ثبت‌نام' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setTab(item.key);
                  setError('');
                }}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
                  tab === item.key ? 'bg-white text-brand-950 shadow-sm' : 'text-ink/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <h1 className="text-lg font-black text-brand-950">
            {tab === 'login' ? 'ورود به حساب کاربری' : 'ساخت حساب کاربری جدید'}
          </h1>
          <p className="mt-1.5 text-[11px] text-ink/50">
            {tab === 'login'
              ? 'با شماره موبایل و رمز عبور خود وارد شوید.'
              : 'فقط با نام، شماره موبایل و رمز عبور ثبت‌نام کنید.'}
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="label">نام و نام خانوادگی</label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثلاً سارا محمدی"
                />
              </div>
            )}

            <div>
              <label className="label">شماره موبایل</label>
              <input
                className="input"
                required
                dir="ltr"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="09121234567"
              />
            </div>

            <div>
              <label className="label">رمز عبور</label>
              <input
                className="input"
                required
                dir="ltr"
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="حداقل ۶ کاراکتر"
              />
            </div>

            {tab === 'register' && (
              <div>
                <label className="label">ایمیل (اختیاری)</label>
                <input
                  className="input"
                  dir="ltr"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            )}

            {tab === 'login' && (
              <p className="text-left text-[10px] text-ink/40">
                رمز عبور را فراموش کرده‌اید؟{' '}
                <Link href="/contact" className="font-bold text-brand-700 hover:text-brand-900">
                  با پشتیبانی تماس بگیرید
                </Link>
              </p>
            )}

            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'لطفاً صبر کنید…' : tab === 'login' ? 'ورود به حساب' : 'ساخت حساب کاربری'}
              {!loading && <Check className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-5 rounded-2xl bg-cream-100/70 p-3.5 text-[10.5px] leading-6 text-ink/55">
            <p className="flex items-center gap-1.5 font-bold text-brand-900">
              <User className="h-3.5 w-3.5" />
              خرید مهمان هم امکان‌پذیر است
            </p>
            <p className="mt-1">
              می‌توانید بدون ساخت حساب خرید کنید؛ ولی با حساب کاربری، سفارش‌ها و آدرس‌ها ذخیره می‌شوند.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px]">
            <Link href="/products" className="flex items-center gap-1.5 text-ink/45 hover:text-brand-700">
              <ArrowLeft className="h-3.5 w-3.5" />
              ادامه خرید
            </Link>
            <Link href="/track" className="text-brand-700 hover:text-brand-900">
              پیگیری سفارش مهمان
            </Link>
          </div>

          <p className="mt-5 border-t border-cream-200 pt-4 text-center text-[10px] text-ink/35">
            ورود شما به معنی پذیرش قوانین فروشگاه {toFa('سنز اسکین')} است.
          </p>
        </div>
      </div>
    </div>
  );
}
