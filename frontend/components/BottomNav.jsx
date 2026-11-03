'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { toFa } from '@/lib/format';
const ITEMS = [
  { href: '/', label: 'خانه', image: '/images/icons/nav-home.png' },
  { href: '/products', label: 'فروشگاه', image: '/images/icons/nav-shop.png' },
  { href: '/cart', label: 'سبد خرید', image: '/images/icons/nav-cart.png', badge: true },
  { href: '/account', label: 'حساب من', image: '/images/icons/nav-account.png' },
];

export default function BottomNav() {
  const pathname = usePathname() || '/';
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white shadow-[0_-6px_18px_-14px_rgba(90,55,50,.4)] lg:hidden">
      <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 pb-1.5 pt-1.5 transition ${
                active ? 'text-brand-800' : 'text-ink/45'
              }`}
            >
              <span className="relative">
                <img
                  src={item.image}
                  alt={item.label}
                  className={`h-7 w-7 object-contain transition duration-300 ${
                    active ? 'scale-110 opacity-100' : 'opacity-85'
                  }`}
                />
                {item.badge && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[8.5px] font-black text-white">
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
