'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { useCustomer } from './CustomerProvider';
import Logo from './Logo';
import { toFa } from '@/lib/format';
import {
  ChevronDown,
  Clock,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from './Icons';

export default function Header({ settings = {}, categories = [] }) {
  const { count } = useCart();
  const { customer, isLoggedIn } = useCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: '/products', label: 'فروشگاه' },
    { href: '/products?on_sale=1', label: 'پیشنهاد ویژه', accent: true },
    { href: '/blog', label: 'مجله پوست' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-soft' : ''}`}>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
        }`}
      >
        {settings.announcement && (
          <div className="bg-brand-100 text-brand-800">
            <div className="container-page flex h-8 items-center justify-center gap-2 text-[10.5px] font-bold sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{settings.announcement}</span>
            </div>
          </div>
        )}

        <div className="bg-brand-950 text-cream-100">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-[11px]">
          <div className="flex min-w-0 items-center gap-4">
            <a href={`tel:${settings.phone || ''}`} className="flex items-center gap-1.5 hover:text-gold-300">
              <Phone className="h-3.5 w-3.5" />
              <span dir="ltr">{toFa(settings.phone || '')}</span>
            </a>
            <span className="hidden items-center gap-1.5 text-cream-100/70 sm:flex">
              <Clock className="h-3.5 w-3.5" />
              {settings.working_hours}
            </span>
          </div>
          <div className="flex items-center gap-4 text-cream-100/80">
            <span className="hidden items-center gap-1.5 md:flex">
              <Truck className="h-3.5 w-3.5" />
              ارسال به سراسر ایران
            </span>
            <Link href="/track" className="hover:text-gold-300">
              پیگیری سفارش
            </Link>
            <Link href="/faq" className="hidden hover:text-gold-300 sm:block">
              سوالات متداول
            </Link>
          </div>
        </div>
        </div>
      </div>

      <div className="border-b border-cream-300/70 bg-cream-50/95 backdrop-blur">
        <div className="container-page flex h-[74px] items-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="منو"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-brand-900 hover:bg-brand-50 lg:hidden"
          >
            <Menu />
          </button>

          <Link href="/" className="shrink-0">
            <Logo settings={settings} />
          </Link>

          <form action="/products" className="hidden flex-1 md:block">
            <label className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100/60">
              <Search className="h-4 w-4 text-ink/40" />
              <input
                name="q"
                placeholder="جست‌وجو در محصولات، مثلاً سرم ویتامین C…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                aria-label="جست‌وجو"
              />
              <button type="submit" className="rounded-full bg-brand-800 px-3 py-1 text-[11px] font-bold text-cream-50">
                جست‌وجو
              </button>
            </label>
          </form>

          <div className="mr-auto flex items-center gap-1 sm:gap-2">
            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-brand-900 hover:bg-brand-50 sm:flex"
              title={isLoggedIn ? 'حساب کاربری من' : 'ورود یا ثبت‌نام'}
            >
              <User className="h-5 w-5" />
              <span className="hidden max-w-24 truncate lg:block">
                {isLoggedIn ? customer?.name?.split(' ')[0] || 'حساب من' : 'ورود / ثبت‌نام'}
              </span>
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-brand-800 px-4 py-2.5 text-cream-50 transition hover:bg-brand-900"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-xs font-bold sm:block">سبد خرید</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-black text-brand-950">
                  {toFa(count)}
                </span>
              )}
            </Link>
          </div>
        </div>

        <form action="/products" className="container-page pb-3 md:hidden">
          <label className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5">
            <Search className="h-4 w-4 text-ink/40" />
            <input
              name="q"
              placeholder="جست‌وجوی محصول…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
              aria-label="جست‌وجو"
            />
          </label>
        </form>
      </div>

      <nav className="hidden border-b border-cream-300/60 bg-white/85 backdrop-blur lg:block">
        <div className="container-page flex items-center gap-1">
          <div className="group relative">
            <button className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold text-brand-900 hover:text-brand-600">
              دسته‌بندی محصولات
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-[720px] translate-y-2 rounded-3xl border border-cream-300 bg-white p-6 opacity-0 shadow-card transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid grid-cols-3 gap-6">
                {categories.slice(0, 6).map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="mb-2 flex items-center justify-between text-sm font-extrabold text-brand-950 hover:text-brand-600"
                    >
                      {cat.name}
                      <span className="text-[10px] font-normal text-ink/40">
                        {toFa(cat.product_count || 0)}
                      </span>
                    </Link>
                    <ul className="space-y-1.5">
                      {(cat.children || []).slice(0, 5).map((child) => (
                        <li key={child.id}>
                          <Link href={`/category/${child.slug}`} className="text-xs text-ink/60 hover:text-brand-700">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3.5 text-sm font-bold hover:text-brand-600 ${
                link.accent ? 'text-rose-600' : 'text-brand-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-brand-950/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-cream-50 p-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo settings={settings} />
              <button onClick={() => setMobileOpen(false)} aria-label="بستن" className="rounded-xl p-2 hover:bg-brand-50">
                <X />
              </button>
            </div>

            <Link
              href={isLoggedIn ? '/account' : '/login'}
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex items-center justify-between rounded-2xl bg-brand-900 px-4 py-3 text-xs font-bold text-cream-50"
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {isLoggedIn ? `حساب کاربری ${customer?.name || ''}` : 'ورود / ثبت‌نام'}
              </span>
              <span className="text-[10px] text-gold-300">
                {isLoggedIn ? 'مشاهده سفارش‌ها' : 'ساخت حساب'}
              </span>
            </Link>

            <div className="mb-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-brand-900 hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-4">
              <h3 className="mb-3 text-xs font-bold text-ink/50">دسته‌بندی‌ها</h3>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm font-bold text-brand-950"
                    >
                      {cat.name}
                    </Link>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                      {(cat.children || []).map((child) => (
                        <Link
                          key={child.id}
                          href={`/category/${child.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs text-ink/60"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 text-xs text-ink/60">
              <p className="mb-2">پشتیبانی: {toFa(settings.phone || '')}</p>
              <p>{settings.working_hours}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
