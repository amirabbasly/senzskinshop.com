'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { formatDate } from '@/lib/format';
import { Alert, Card, Empty, PageHeader, Spinner } from '@/components/admin/ui';
import { Check, Star, Trash, X } from '@/components/Icons';

const TABS = [
  { value: 'pending', label: 'در انتظار تأیید' },
  { value: 'approved', label: 'تأیید شده' },
  { value: '', label: 'همه' },
];

export default function AdminReviewsPage() {
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setRows(null);
    adminApi(`/admin/reviews${status ? `?status=${status}` : ''}`)
      .then(setRows)
      .catch((err) => setError(err.message));
  }, [status]);

  useEffect(load, [load]);

  async function approve(row, value) {
    try {
      await adminApi(`/admin/reviews/${row.id}`, { method: 'PATCH', body: { is_approved: value } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(row) {
    if (!window.confirm('این نظر حذف شود؟')) return;
    try {
      await adminApi(`/admin/reviews/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <PageHeader title="نظرات مشتریان" desc="نظرات ثبت‌شده را تأیید، رد یا حذف کنید" />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            className={`rounded-xl px-3.5 py-2 text-[11px] font-bold transition ${
              status === tab.value ? 'bg-brand-800 text-cream-50' : 'bg-white text-brand-800 shadow-soft'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Alert>{error}</Alert>

      {!rows ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Empty title="نظری در این بخش وجود ندارد" desc="نظرات جدید مشتریان پس از ثبت در این لیست نمایش داده می‌شوند." />
      ) : (
        <div className="space-y-2.5">
          {rows.map((row) => (
            <Card key={row.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11.5px] font-bold text-brand-950">
                    {row.name}
                    <span className="mr-2 text-[9.5px] font-normal text-ink/40">{formatDate(row.created_at)}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-gold-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`h-3 w-3 ${i <= row.rating ? '' : 'text-cream-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      row.is_approved ? 'bg-emerald-100 text-brand-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {row.is_approved ? 'تأیید شده' : 'در انتظار'}
                  </span>
                </div>
              </div>

              <p className="mt-2.5 rounded-xl bg-cream-50 p-3 text-[11px] leading-6 text-ink/65">{row.comment}</p>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                <Link href={`/products/${row.product_slug}`} target="_blank" className="text-[10px] font-bold text-brand-700">
                  محصول: {row.product_name}
                </Link>
                <div className="flex gap-1.5">
                  {row.is_approved ? (
                    <button type="button" onClick={() => approve(row, false)} className="admin-btn bg-cream-100 text-ink/60">
                      <X className="h-3.5 w-3.5" />
                      لغو تأیید
                    </button>
                  ) : (
                    <button type="button" onClick={() => approve(row, true)} className="admin-btn bg-brand-50 text-brand-700">
                      <Check className="h-3.5 w-3.5" />
                      تأیید نمایش
                    </button>
                  )}
                  <button type="button" onClick={() => remove(row)} className="admin-btn bg-rose-50 text-rose-600">
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
