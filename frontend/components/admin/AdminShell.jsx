'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminApi, clearSession, getAdmin, getToken } from '@/lib/adminApi';
import { LogoMark } from '../Logo';
import {
  ArrowUpLeft,
  Grid,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  Settings,
  ShoppingBag,
  Star,
  Ticket,
  X,
} from '../Icons';

const LINKS = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Grid },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { href: '/admin/banners', label: 'بنر و اسلایدر', icon: ImageIcon },
  { href: '/admin/posts', label: 'مقالات', icon: Pencil },
  { href: '/admin/coupons', label: 'کدهای تخفیف', icon: Ticket },
  { href: '/admin/reviews', label: 'نظرات', icon: Star },
  { href: '/admin/settings', label: 'تنظیمات سایت', icon: Settings },
];

const TITLES = {
  '/admin': 'داشبورد مدیریت',
  '/admin/products': 'مدیریت محصولات',
  '/admin/categories': 'مدیریت دسته‌بندی‌ها',
  '/admin/orders': 'مدیریت سفارش‌ها',
  '/admin/banners': 'مدیریت بنر و اسلایدر',
  '/admin/posts': 'مدیریت مقالات',
  '/admin/coupons': 'مدیریت کدهای تخفیف',
  '/admin/reviews': 'مدیریت نظرات',
  '/admin/settings': 'تنظیمات سایت',
};

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setAdmin(getAdmin());
    adminApi('/auth/me')
      .then((data) => {
        setAdmin(data);
        setReady(true);
      })
      .catch(() => {
        router.replace('/admin/login');
      });
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function logout() {
    clearSession();
    router.replace('/admin/login');
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 text-sm text-ink/50">
        در حال بارگذاری پنل مدیریت…
      </div>
    );
  }

  const title =
    TITLES[pathname] ||
    (pathname.startsWith('/admin/products') ? 'مدیریت محصولات' : '') ||
    (pathname.startsWith('/admin/orders') ? 'جزئیات سفارش' : '') ||
    (pathname.startsWith('/admin/posts') ? 'مدیریت مقالات' : '') ||
    'پنل مدیریت';

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-950 text-cream-100">
      <div className="flex items-center gap-3 border-b border-cream-50/10 px-5 py-5">
        <LogoMark className="h-10 w-10" />
        <div>
          <p className="text-sm font-black text-cream-50">سنز اسکین</p>
          <p className="text-[10px] tracking-widest text-gold-300">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {LINKS.map((link) => {
          const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] font-semibold transition ${
                active ? 'bg-cream-50/10 text-gold-300' : 'text-cream-100/65 hover:bg-cream-50/5 hover:text-cream-50'
              }`}
            >
              <link.icon className="h-[18px] w-[18px]" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-cream-50/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold text-cream-100/60 hover:bg-cream-50/5 hover:text-cream-50"
        >
          <ArrowUpLeft className="h-4 w-4" />
          مشاهده سایت
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold text-rose-200/80 hover:bg-rose-500/10 hover:text-rose-200"
        >
          <LogOut className="h-4 w-4" />
          خروج از حساب
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100/60">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-950/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="lg:mr-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-cream-300 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl p-2 text-brand-900 hover:bg-cream-100 lg:hidden"
              aria-label="منو"
            >
              <Menu />
            </button>
            <h1 className="text-sm font-extrabold text-brand-950 sm:text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-bold text-brand-950">{admin?.name || 'مدیر'}</p>
              <p className="text-[10px] text-ink/45" dir="ltr">
                {admin?.email}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-[11px] font-black text-cream-50">
              {(admin?.name || 'م').charAt(0)}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
