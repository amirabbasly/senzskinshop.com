'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { useCustomer } from './CustomerProvider';
import Logo from './Logo';
import { toFa } from '@/lib/format';
import { ChevronDown, Menu, Phone, Search, ShoppingBag, User, X } from './Icons';

export default function Header({ settings = {}, categories = [] }) {
  const { count } = useCart();
  const { customer, isLoggedIn } = useCustomer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  const announcement = /ارسال رایگان/.test(settings.announcement || '')
    ? 'ضمانت اصالت کالا — ارسال سریع به سراسر ایران'
    : settings.announcement;

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
        {announcement && !announcementClosed && (
          <div className="relative overflow-hidden bg-gradient-to-l from-brand-700 via-brand-600 to-brand-700 text-cream-50">
            <div className="flex w-max animate-marquee items-center py-2 text-[10.5px] font-bold sm:text-[11.5px]">
              {[0, 1].map((group) => (
                <div key={group} className="flex shrink-0 items-center">
                  {[announcement, 'مشاوره تخصصی پوست و مو', 'پرداخت امن و ضمانت اصالت'].map((text, index) => (
                    <span key={`${group}-${index}`} className="flex items-center gap-2 px-4">
                      <span aria-hidden="true" className="text-[9px] opacity-80">
                        ✿
                      </span>
                      <span className="whitespace-nowrap">{text}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementClosed(true)}
              aria-label="بستن اطلاعیه"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-900/45 p-1 text-cream-50 backdrop-blur transition hover:bg-brand-900/70"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-cream-300/70 bg-cream-50/95 backdrop-blur">
        <div className="container-page flex h-16 items-center gap-2 sm:h-[74px] lg:gap-5">
          <button
            type="button"
            aria-label="منو"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-brand-900 hover:bg-brand-50 lg:hidden"
          >
            <Menu />
          </button>

          <Link href="/" className="mx-auto shrink-0 lg:mx-0">
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
              <button type="submit" className="rounded-full bg-brand-700 px-3 py-1 text-[11px] font-bold text-cream-50 transition hover:bg-brand-800">
                جست‌وجو
              </button>
            </label>
          </form>

          <div className="flex items-center gap-1 sm:gap-2 lg:mr-auto">
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-cream-50 transition hover:bg-brand-800 lg:h-auto lg:w-auto lg:gap-2 lg:px-4 lg:py-2.5"
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

        <div className="container-page pb-2.5 md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[
                { href: settings.telegram || 'https://t.me/senzskinshop', image: '/images/icons/social-telegram.png', label: 'تلگرام' },
                { href: settings.instagram || 'https://instagram.com/senzskinshop', image: '/images/icons/social-instagram.png', label: 'اینستاگرام' },
                { href: `https://wa.me/${settings.whatsapp || ''}`, image: '/images/icons/social-whatsapp.png', label: 'واتس‌اپ' },
              ].map((social) => {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-100"
                  >
                    <img src={social.image} alt={social.label} className="h-[18px] w-[18px] rounded-[5px] object-contain" />
                  </a>
                );
              })}
            </div>
            <Link
              href="/products"
              aria-label="مشاهده محصولات"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100"
            >
              <Search className="h-4 w-4" />
            </Link>
          </div>

          <form action="/products" className="flex items-stretch gap-1.5">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-cream-300 bg-white px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-ink/35" />
              <input
                name="q"
                placeholder="نام برند، دسته‌بندی یا محصول…"
                className="w-full bg-transparent text-[11.5px] outline-none placeholder:text-ink/35"
                aria-label="جست‌وجو"
              />
            </label>
            <button type="submit" className="shrink-0 rounded-lg bg-brand-800 px-3 text-[11px] font-bold text-white">
              جست‌وجو
            </button>
            <Link
              href="/products?on_sale=1"
              className="flex shrink-0 items-center rounded-lg bg-brand-600 px-3 text-[11px] font-bold text-white"
            >
              تخفیفات
            </Link>
          </form>
        </div>
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
                link.accent ? 'text-brand-700' : 'text-brand-900'
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
              className="mb-4 flex items-center justify-between rounded-2xl bg-brand-800 px-4 py-3 text-xs font-bold text-cream-50"
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
