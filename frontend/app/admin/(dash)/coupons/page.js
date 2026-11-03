'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { shortDate, toFa } from '@/lib/format';
import {
  Alert,
  Card,
  Empty,
  Field,
  Input,
  Modal,
  PageHeader,
  Spinner,
  Toggle,
} from '@/components/admin/ui';
import { Pencil, Plus, Trash } from '@/components/Icons';

const EMPTY = {
  code: '',
  percent: '0',
  amount: '0',
  min_total: '0',
  max_uses: '0',
  expires_at: '',
  is_active: true,
};

export default function AdminCouponsPage() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');

  const load = useCallback(() => {
    adminApi('/admin/coupons')
      .then(setRows)
      .catch((err) => setPageError(err.message));
  }, []);

  useEffect(load, [load]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm({
      code: row.code,
      percent: String(row.percent),
      amount: String(row.amount),
      min_total: String(row.min_total),
      max_uses: String(row.max_uses),
      expires_at: row.expires_at ? String(row.expires_at).slice(0, 10) : '',
      is_active: row.is_active,
    });
    setError('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, expires_at: form.expires_at || null };
      if (editing) await adminApi(`/admin/coupons/${editing.id}`, { method: 'PUT', body: payload });
      else await adminApi('/admin/coupons', { method: 'POST', body: payload });
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`کد «${row.code}» حذف شود؟`)) return;
    try {
      await adminApi(`/admin/coupons/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setPageError(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="کدهای تخفیف"
        desc="کد تخفیف درصدی یا مبلغی برای مشتریان بسازید"
        action={
          <button type="button" onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            کد جدید
          </button>
        }
      />

      <Alert>{pageError}</Alert>

      {!rows ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Empty title="کد تخفیفی ثبت نشده است" />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>کد</th>
                  <th>تخفیف</th>
                  <th>حداقل خرید</th>
                  <th>استفاده</th>
                  <th>انقضا</th>
                  <th>وضعیت</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono text-[11.5px] font-bold text-brand-800" dir="ltr">
                      {row.code}
                    </td>
                    <td className="text-[11px] font-bold">
                      {row.percent > 0 ? `${toFa(row.percent)}٪` : `${toFa(row.amount.toLocaleString('en-US'))} تومان`}
                    </td>
                    <td className="text-[11px] text-ink/55">{toFa(row.min_total.toLocaleString('en-US'))}</td>
                    <td className="text-[11px] text-ink/55">
                      {toFa(row.used)}
                      {row.max_uses > 0 ? ` / ${toFa(row.max_uses)}` : ''}
                    </td>
                    <td className="whitespace-nowrap text-[10.5px] text-ink/50">
                      {row.expires_at ? shortDate(row.expires_at) : 'بدون انقضا'}
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          row.is_active ? 'bg-emerald-100 text-brand-700' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {row.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => openEdit(row)} className="admin-btn bg-cream-100 text-brand-800">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => remove(row)} className="admin-btn bg-rose-50 text-rose-600">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'ویرایش کد تخفیف' : 'کد تخفیف جدید'}>
        <form onSubmit={save} className="space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="کد تخفیف *">
              <Input
                required
                dir="ltr"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SENZ15"
              />
            </Field>
            <Field label="درصد تخفیف" hint="اگر درصد را وارد کنید، مبلغ تخفیف نادیده گرفته می‌شود.">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.percent}
                onChange={(e) => setForm({ ...form, percent: e.target.value })}
              />
            </Field>
            <Field label="مبلغ تخفیف (تومان)">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Field>
            <Field label="حداقل مبلغ سبد (تومان)">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.min_total}
                onChange={(e) => setForm({ ...form, min_total: e.target.value })}
              />
            </Field>
            <Field label="حداکثر تعداد استفاده" hint="صفر = بدون محدودیت">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              />
            </Field>
            <Field label="تاریخ انقضا" hint="خالی = بدون انقضا">
              <Input
                type="date"
                dir="ltr"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </Field>
          </div>

          <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="کد فعال است" />

          <Alert>{error}</Alert>

          <div className="flex justify-end gap-2 border-t border-cream-200 pt-3">
            <button type="button" onClick={() => setOpen(false)} className="admin-btn bg-cream-100 text-ink/60">
              انصراف
            </button>
            <button type="submit" disabled={saving} className="admin-btn bg-brand-800 px-5 text-cream-50">
              {saving ? 'در حال ذخیره…' : 'ذخیره'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
