'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { formatPrice, toFa } from '@/lib/format';
import { Card, Empty, Input, PageHeader, Spinner, Thumb } from '@/components/admin/ui';
import { Pencil, Plus, Search, Trash } from '@/components/Icons';

export default function AdminProductsPage() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    adminApi(`/admin/products?${params.toString()}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [page, query, status]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  async function remove(id, name) {
    if (!window.confirm(`محصول «${name}» حذف شود؟`)) return;
    try {
      await adminApi(`/admin/products/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="محصولات"
        desc="افزودن، ویرایش و مدیریت محصولات فروشگاه"
        action={
          <Link href="/admin/products/new" className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            محصول جدید
          </Link>
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <Input
              className="pr-9"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="جست‌وجو بر اساس نام، برند یا کد کالا…"
            />
          </div>
          <div className="flex gap-1.5">
            {[
              { value: '', label: 'همه' },
              { value: 'active', label: 'فعال' },
              { value: 'inactive', label: 'غیرفعال' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setStatus(option.value);
                  setPage(1);
                }}
                className={`rounded-xl px-3.5 py-2 text-[11px] font-bold transition ${
                  status === option.value ? 'bg-brand-800 text-cream-50' : 'bg-cream-100 text-brand-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {error && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}

      {!data ? (
        <Spinner />
      ) : data.items.length === 0 ? (
        <Empty
          title="محصولی یافت نشد"
          desc="اولین محصول خود را اضافه کنید."
          action={
            <Link href="/admin/products/new" className="admin-btn bg-brand-800 text-cream-50">
              <Plus className="h-3.5 w-3.5" />
              افزودن محصول
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>دسته‌بندی</th>
                  <th>قیمت</th>
                  <th>موجودی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Thumb src={product.images?.[0] || PLACEHOLDER_IMAGE} />
                        <div className="min-w-0">
                          <p className="line-clamp-1 max-w-[220px] text-[11.5px] font-bold text-brand-950">{product.name}</p>
                          <p className="mt-0.5 text-[9.5px] text-ink/40" dir="ltr">
                            {product.sku || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-[11px] text-ink/60">{product.category_name || '—'}</td>
                    <td className="whitespace-nowrap text-[11px] font-bold text-brand-900">{formatPrice(product.price)}</td>
                    <td>
                      <span
                        className={`text-[11px] font-bold ${
                          product.stock <= 0 ? 'text-rose-600' : product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {toFa(product.stock)}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {product.is_active ? 'فعال' : 'غیرفعال'}
                        </span>
                        {product.is_featured && (
                          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-bold text-gold-700">ویژه</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/products/${product.id}`} className="admin-btn bg-cream-100 text-brand-800">
                          <Pencil className="h-3.5 w-3.5" />
                          ویرایش
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(product.id, product.name)}
                          className="admin-btn bg-rose-50 text-rose-600"
                          aria-label="حذف"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-cream-200 px-4 py-3 text-[11px] text-ink/50">
            <span>
              {toFa(data.total)} محصول — صفحه {toFa(data.page)} از {toFa(data.pages)}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="admin-btn bg-cream-100 text-brand-800 disabled:opacity-40"
              >
                قبلی
              </button>
              <button
                type="button"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="admin-btn bg-cream-100 text-brand-800 disabled:opacity-40"
              >
                بعدی
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
