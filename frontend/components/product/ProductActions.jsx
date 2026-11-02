'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '../CartProvider';
import { Check, Minus, Plus, ShoppingBag, Truck } from '../Icons';
import { formatPrice, toFa } from '@/lib/format';

export default function ProductActions({ product }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = Number(product.stock) <= 0;
  const max = Math.max(1, Math.min(Number(product.stock) || 20, 20));

  function handleAdd(goToCart = false) {
    if (outOfStock) return;
    add(product, qty);
    if (goToCart) {
      router.push('/cart');
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-cream-300 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(q + 1, max))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-900 hover:bg-cream-100"
            aria-label="افزایش تعداد"
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-extrabold text-brand-950">{toFa(qty)}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-900 hover:bg-cream-100"
            aria-label="کاهش تعداد"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleAdd(false)}
          disabled={outOfStock}
          className={`btn flex-1 ${added ? 'bg-emerald-600 text-white' : 'btn-primary'}`}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              به سبد خرید اضافه شد
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              {outOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleAdd(true)}
          disabled={outOfStock}
          className="btn-gold"
        >
          خرید سریع
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-cream-100/70 px-4 py-3 text-[11px] text-ink/60">
        <span className="flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-brand-700" />
          ارسال از ۱ روز کاری بعد
        </span>
        <span>ارزش سفارش: {formatPrice(Number(product.price) * qty)}</span>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="font-bold text-rose-600">تنها {toFa(product.stock)} عدد در انبار</span>
        )}
      </div>
    </div>
  );
}
