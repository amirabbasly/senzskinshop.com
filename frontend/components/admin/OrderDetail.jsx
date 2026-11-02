'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { ORDER_STATUS, PAYMENT_LABELS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import { Alert, Card, Field, PageHeader, Select, Spinner, Textarea } from './ui';
import { ArrowLeft, Check, MapPin, Phone } from '../Icons';

export default function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi(`/admin/orders/${orderId}`)
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setNote(data.note || '');
      })
      .catch((err) => setError(err.message));
  }, [orderId]);

  async function save() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await adminApi(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: { status, note },
      });
      setOrder((prev) => ({ ...prev, ...updated }));
      setMessage('وضعیت سفارش به‌روزرسانی شد.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!order) {
    return error ? <Alert>{error}</Alert> : <Spinner />;
  }

  const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;

  return (
    <div>
      <PageHeader
        title={`سفارش ${order.code}`}
        desc={`ثبت شده در ${formatDate(order.created_at, { withTime: true })}`}
        action={
          <Link href="/admin/orders" className="admin-btn bg-cream-100 text-brand-800">
            <ArrowLeft className="h-3.5 w-3.5" />
            بازگشت به سفارش‌ها
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-brand-950">اقلام سفارش</h3>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${st.color}`}>{st.label}</span>
            </div>
            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-cream-200 p-2.5">
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[11.5px] font-bold text-brand-950">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink/45">
                      {toFa(item.qty)} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <dl className="mt-4 space-y-2 border-t border-cream-200 pt-3 text-[11.5px]">
              <div className="flex justify-between">
                <dt className="text-ink/50">جمع کالاها</dt>
                <dd className="font-bold">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/50">ارسال</dt>
                <dd className="font-bold">{order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <dt>تخفیف {order.coupon_code ? `(${order.coupon_code})` : ''}</dt>
                  <dd className="font-bold">−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-200 pt-2 text-sm">
                <dt className="font-bold text-ink/70">مبلغ کل</dt>
                <dd className="font-black text-brand-900">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">اطلاعات مشتری و ارسال</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-cream-50 p-3">
                <p className="text-[10px] text-ink/40">نام گیرنده</p>
                <p className="mt-1 text-[11.5px] font-bold text-brand-950">{order.customer_name}</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <p className="text-[10px] text-ink/40">شماره تماس</p>
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-bold text-brand-950" dir="ltr">
                  <Phone className="h-3 w-3" />
                  {order.phone}
                </p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3 sm:col-span-2">
                <p className="text-[10px] text-ink/40">آدرس</p>
                <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-6 text-brand-950">
                  <MapPin className="mt-1 h-3.5 w-3.5 shrink-0" />
                  {order.province}، {order.city}، {order.address}
                  {order.postal_code ? ` — کد پستی: ${toFa(order.postal_code)}` : ''}
                </p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <p className="text-[10px] text-ink/40">روش پرداخت</p>
                <p className="mt-1 text-[11px] font-bold text-brand-950">
                  {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                </p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3">
                <p className="text-[10px] text-ink/40">ایمیل</p>
                <p className="mt-1 text-[11px] font-bold text-brand-950" dir="ltr">
                  {order.email || '—'}
                </p>
              </div>
              {order.note && (
                <div className="rounded-xl bg-amber-50 p-3 sm:col-span-2">
                  <p className="text-[10px] text-amber-700/70">یادداشت مشتری</p>
                  <p className="mt-1 text-[11px] leading-6 text-amber-900">{order.note}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">به‌روزرسانی وضعیت</h3>
            <Field label="وضعیت سفارش">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.entries(ORDER_STATUS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="یادداشت داخلی / توضیح برای مشتری" className="mt-3">
              <Textarea className="min-h-20" value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <button type="button" onClick={save} disabled={saving} className="admin-btn mt-3 w-full bg-brand-800 py-2.5 text-cream-50">
              <Check className="h-4 w-4" />
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>
            <div className="mt-3">
              <Alert type="success">{message}</Alert>
              <Alert>{error}</Alert>
            </div>
          </Card>

          <Card>
            <h3 className="mb-2 text-xs font-extrabold text-brand-950">کد پیگیری مشتری</h3>
            <p className="rounded-xl bg-cream-100 px-3 py-2 text-center font-mono text-xs font-bold text-brand-900" dir="ltr">
              {order.code}
            </p>
            <p className="mt-2 text-[10px] leading-5 text-ink/45">
              مشتری می‌تواند با این کد از صفحه «پیگیری سفارش» وضعیت را ببیند.
            </p>
            <Link href={`/order/${order.code}`} target="_blank" className="admin-btn mt-3 w-full bg-cream-100 text-brand-800">
              مشاهده صفحه سفارش
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
