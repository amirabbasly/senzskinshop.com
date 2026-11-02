'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'senz_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.id));
      }
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / private mode */
    }
  }, [items, ready]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const image = Array.isArray(product.images) ? product.images[0] : product.image || '';
      const existing = prev.find((i) => i.id === product.id);
      const maxQty = product.stock > 0 ? product.stock : 20;
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, maxQty), price: product.price }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
          image,
          stock: Number(product.stock || 0),
          qty: Math.min(qty, maxQty),
        },
      ];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, qty: Math.max(1, Math.min(Number(qty) || 1, i.stock > 0 ? i.stock : 20)) }
          : i
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + Number(i.qty || 0), 0);
    const subtotal = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 0), 0);
    return { items, add, remove, setQty, clear, count, subtotal, ready };
  }, [items, add, remove, setQty, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
