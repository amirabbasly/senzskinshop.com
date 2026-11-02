'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import { Card, Empty, Input, PageHeader, Spinner } from '@/components/admin/ui';
import { Search } from '@/components/Icons';

const TABS = [
  { value: 'all', label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'confirmed', label: 'تأیید شده' },
  { value: 'preparing', label: 'آماده‌سازی' },
  { value: 'shipped', label: 'ارسال شده' },
  { value: 'delivered', label: 'تحویل شده' },
  { value: 'cancelled', label: 'لغو شده' },
];

export default function AdminOrdersPage() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: '20', status });
    if (query) params.set('q', query);
    adminApi(`/admin/orders?${params.toString()}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [page, query, status]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <div>
      <PageHeader title="سفارش‌ها" desc="مشاهده، پیگیری و تغییر وضعیت سفارش‌های مشتریان" />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <Input
              className="pr-9"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="جست‌وجو بر اساس کد سفارش، نام یا شماره تماس…"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-2 text-[10.5px] font-bold transition ${
                  status === tab.value ? 'bg-brand-800 text-cream-50' : 'bg-cream-100 text-brand-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {error && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}

      {!data ? (
        <Spinner />
      ) : data.items.length === 0 ? (
        <Empty title="سفارشی یافت نشد" desc="با این فیلتر سفارشی وجود ندارد." />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>کد سفارش</th>
                  <th>مشتری</th>
                  <th>تلفن</th>
                  <th>اقلام</th>
                  <th>مبلغ</th>
                  <th>وضعیت</th>
                  <th>پرداخت</th>
                  <th>تاریخ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => {
                  const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                  const pay = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.unpaid;
                  return (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap font-bold text-brand-800" dir="ltr">
                        {order.code}
                      </td>
                      <td className="whitespace-nowrap text-[11px] font-bold text-brand-950">{order.customer_name}</td>
                      <td className="whitespace-nowrap text-[11px] text-ink/55" dir="ltr">
                        {order.phone}
                      </td>
                      <td className="text-[11px] text-ink/55">{toFa(order.items_count || 0)}</td>
                      <td className="whitespace-nowrap text-[11px] font-bold">{formatPrice(order.total)}</td>
                      <td>
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9.5px] font-bold ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td>
                        <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[9.5px] font-bold ${pay.color}`}>
                          {pay.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap text-[10px] text-ink/40">{formatDate(order.created_at)}</td>
                      <td>
                        <Link href={`/admin/orders/${order.id}`} className="admin-btn bg-cream-100 text-brand-800">
                          جزئیات
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-cream-200 px-4 py-3 text-[11px] text-ink/50">
            <span>
              {toFa(data.total)} سفارش — صفحه {toFa(data.page)} از {toFa(data.pages)}
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
