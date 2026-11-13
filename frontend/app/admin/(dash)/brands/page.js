'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { toFa } from '@/lib/format';
import {
  Alert,
  Card,
  Field,
  ImageUploader,
  Input,
  Modal,
  PageHeader,
  Spinner,
  Toggle,
} from '@/components/admin/ui';
import { Pencil, Plus, Trash } from '@/components/Icons';

const EMPTY = {
  name: '',
  latin: '',
  logo: '',
  image: '',
  sort_order: '0',
  is_active: true,
  is_featured: false,
};

export default function AdminBrandsPage() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');

  const load = useCallback(() => {
    adminApi('/admin/brands')
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
      ...EMPTY,
      ...row,
      sort_order: String(row.sort_order || 0),
      is_active: row.is_active !== false,
      is_featured: Boolean(row.is_featured),
    });
    setError('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await adminApi(`/admin/brands/${editing.id}`, { method: 'PUT', body: form });
      else await adminApi('/admin/brands', { method: 'POST', body: form });
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`برند «${row.name}» حذف شود؟`)) return;
    try {
      await adminApi(`/admin/brands/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setPageError(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="برندها"
        desc="لوگو و عکس محصول برندها را مدیریت کنید؛ برندهای ویژه در استوری بالای صفحه اصلی نمایش داده می‌شوند"
        action={
          <button type="button" onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            برند جدید
          </button>
        }
      />

      <Alert>{pageError}</Alert>

      {!rows ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <Card key={row.id} className="p-3.5">
              <div className="flex items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cream-300 bg-white p-1.5">
                  {row.logo ? (
                    <img src={row.logo} alt={row.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[9px] text-ink/30">بدون لوگو</span>
                  )}
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cream-300 bg-cream-50">
                  {row.image ? (
                    <img src={row.image} alt={row.name} className="h-full w-full object-contain mix-blend-multiply" />
                  ) : (
                    <span className="text-[9px] text-ink/30">بدون عکس</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-extrabold text-brand-950">{row.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-ink/45" dir="ltr">
                    {row.latin}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[8.5px] font-bold ${
                        row.is_active ? 'bg-brand-100 text-brand-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {row.is_active ? 'فعال' : 'غیرفعال'}
                    </span>
                    {row.is_featured && (
                      <span className="rounded-full bg-gold-400/25 px-1.5 py-0.5 text-[8.5px] font-bold text-gold-600">
                        ویژه
                      </span>
                    )}
                    <span className="text-[8.5px] text-ink/40">{toFa(row.product_count || 0)} محصول</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-1.5">
                <button type="button" onClick={() => openEdit(row)} className="admin-btn flex-1 bg-cream-100 text-brand-800">
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </button>
                <button type="button" onClick={() => remove(row)} className="admin-btn bg-rose-50 text-rose-600">
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
          {rows.length === 0 && <Card className="text-center text-xs text-ink/45 md:col-span-2 xl:col-span-3">برندی ثبت نشده است.</Card>}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'ویرایش برند' : 'برند جدید'}>
        <form onSubmit={save} className="space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="نام فارسی برند *">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً سراوی" />
            </Field>
            <Field label="نام لاتین (زیر عکس نمایش داده می‌شود)">
              <Input dir="ltr" value={form.latin} onChange={(e) => setForm({ ...form, latin: e.target.value })} placeholder="CeraVe" />
            </Field>
            <Field label="ترتیب نمایش">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </Field>
            <div className="flex items-end">
              <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="نمایش در سایت" />
            </div>
          </div>

          <Field label="لوگوی برند (نوار برندها و لیست برندها)">
            <ImageUploader
              images={form.logo ? [form.logo] : []}
              onChange={(images) => setForm({ ...form, logo: images[0] || '' })}
              multiple={false}
            />
          </Field>

          <Field label="عکس محصول برند (دایره‌ی استوری بالای صفحه اصلی)">
            <ImageUploader
              images={form.image ? [form.image] : []}
              onChange={(images) => setForm({ ...form, image: images[0] || '' })}
              multiple={false}
            />
          </Field>

          <Toggle
            checked={form.is_featured}
            onChange={(v) => setForm({ ...form, is_featured: v })}
            label="برند ویژه (نمایش در استوری بالای صفحه اصلی)"
          />

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
