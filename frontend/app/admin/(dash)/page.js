'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { ORDER_STATUS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import { Card, PageHeader, Spinner, Thumb } from '@/components/admin/ui';
import { Package, Plus, ShoppingBag, Star, Ticket, Users } from '@/components/Icons';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi('/admin/dashboard')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Card className="text-xs text-rose-600">{error}</Card>;
  if (!data) return <Spinner />;

  const { stats, recent_orders: orders = [], low_stock: lowStock = [], top_products: top = [], sales_by_day: days = [] } = data;
  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1);

  const cards = [
    { label: 'کل فروش', value: formatPrice(stats.revenue), icon: Ticket, tone: 'bg-brand-50 text-brand-700' },
    { label: 'سفارش‌ها', value: toFa(stats.orders), icon: ShoppingBag, tone: 'bg-sky-50 text-sky-700' },
    { label: 'در انتظار بررسی', value: toFa(stats.pending), icon: Package, tone: 'bg-amber-50 text-amber-700' },
    { label: 'محصولات فعال', value: toFa(stats.products), icon: Users, tone: 'bg-brand-50 text-brand-700' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="نمای کلی فروشگاه"
        desc="خلاصه وضعیت فروش، سفارش‌ها و موجودی محصولات"
        action={
          <div className="flex gap-2">
            <Link href="/admin/products/new" className="admin-btn bg-brand-800 text-cream-50">
              <Plus className="h-3.5 w-3.5" />
              محصول جدید
            </Link>
            <Link href="/admin/orders" className="admin-btn bg-cream-100 text-brand-800">
              سفارش‌ها
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10.5px] text-ink/45">{card.label}</p>
              <p className="mt-0.5 text-sm font-black text-brand-950">{card.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-brand-950">فروش ۱۴ روز اخیر</h3>
            <span className="text-[10px] text-ink/40">تومان</span>
          </div>
          {days.length === 0 ? (
            <p className="py-10 text-center text-[11px] text-ink/40">هنوز فروشی ثبت نشده است.</p>
          ) : (
            <div className="flex h-44 items-end gap-1.5">
              {days.map((day) => (
                <div key={day.day} className="group flex flex-1 flex-col items-center gap-1">
                  <span className="text-[8px] text-ink/0 transition group-hover:text-ink/60">
                    {formatPrice(day.revenue).replace(' تومان', '')}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-brand-700/85 transition group-hover:bg-brand-600"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 120, 3)}px` }}
                    title={`${day.day}: ${day.revenue}`}
                  />
                  <span className="text-[8px] text-ink/35">{toFa(day.day.slice(5))}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-xs font-extrabold text-brand-950">هشدار موجودی</h3>
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-ink/40">موجودی همه محصولات مناسب است.</p>
          ) : (
            <div className="space-y-2.5">
              {lowStock.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-2.5 rounded-xl border border-cream-200 p-2 hover:border-brand-300"
                >
                  <Thumb src={product.images?.[0] || PLACEHOLDER_IMAGE} size="h-9 w-9" />
                  <span className="line-clamp-1 flex-1 text-[11px] font-bold text-brand-950">{product.name}</span>
                  <span className={`text-[10px] font-black ${product.stock <= 2 ? 'text-rose-600' : 'text-amber-600'}`}>
                    {toFa(product.stock)} عدد
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-brand-950">آخرین سفارش‌ها</h3>
            <Link href="/admin/orders" className="text-[10px] font-bold text-brand-700">
              مشاهده همه
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-ink/40">سفارشی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>کد</th>
                    <th>مشتری</th>
                    <th>مبلغ</th>
                    <th>وضعیت</th>
                    <th>تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                    return (
                      <tr key={order.id}>
                        <td>
                          <Link href={`/admin/orders/${order.id}`} className="font-bold text-brand-700" dir="ltr">
                            {order.code}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap text-[11px]">{order.customer_name}</td>
                        <td className="whitespace-nowrap text-[11px] font-bold">{formatPrice(order.total)}</td>
                        <td>
                          <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${status.color}`}>{status.label}</span>
                        </td>
                        <td className="whitespace-nowrap text-[10px] text-ink/40">{formatDate(order.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 text-xs font-extrabold text-brand-950">پرفروش‌ترین محصولات</h3>
          {top.length === 0 ? (
            <p className="py-8 text-center text-[11px] text-ink/40">داده‌ای موجود نیست.</p>
          ) : (
            <div className="space-y-2.5">
              {top.map((product, index) => (
                <div key={product.id} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-100 text-[10px] font-black text-brand-800">
                    {toFa(index + 1)}
                  </span>
                  <Thumb src={product.images?.[0]} size="h-9 w-9" />
                  <span className="line-clamp-1 flex-1 text-[11px] font-bold text-brand-950">{product.name}</span>
                  <span className="flex items-center gap-1 text-[10px] text-ink/50">
                    <Star className="h-3 w-3 text-gold-500" />
                    {toFa(product.sold)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/products" className="admin-btn mt-4 w-full bg-cream-100 text-brand-800">
            مدیریت محصولات
          </Link>
        </Card>
      </div>
    </div>
  );
}
