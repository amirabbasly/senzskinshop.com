'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { toFa } from '@/lib/format';
import { Grid, Home, ShoppingBag, User } from './Icons';

const ITEMS = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/products', label: 'فروشگاه', icon: Grid },
  { href: '/cart', label: 'سبد خرید', icon: ShoppingBag, badge: true },
  { href: '/account', label: 'حساب من', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname() || '/';
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white shadow-[0_-6px_18px_-14px_rgba(90,55,50,.4)] lg:hidden">
      <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 py-2 transition ${
                active ? 'text-brand-800' : 'text-ink/45'
              }`}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[8.5px] font-black text-white">
                    {toFa(count)}
                  </span>
                )}
              </span>
              <span className={`text-[9.5px] ${active ? 'font-extrabold' : 'font-semibold'}`}>{item.label}</span>
              {active && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-brand-600" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
