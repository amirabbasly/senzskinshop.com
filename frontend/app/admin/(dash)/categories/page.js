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
  Select,
  Spinner,
  Textarea,
  Thumb,
  Toggle,
} from '@/components/admin/ui';
import { Pencil, Plus, Trash } from '@/components/Icons';

const EMPTY = {
  name: '',
  slug: '',
  parent_id: '',
  description: '',
  image: '',
  sort_order: '0',
  is_active: true,
};

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tableError, setTableError] = useState('');

  const load = useCallback(() => {
    adminApi('/admin/categories')
      .then(setRows)
      .catch((err) => setTableError(err.message));
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
      name: row.name,
      slug: row.slug,
      parent_id: row.parent_id ? String(row.parent_id) : '',
      description: row.description || '',
      image: row.image || '',
      sort_order: String(row.sort_order || 0),
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
      const payload = { ...form, parent_id: form.parent_id || null };
      if (editing) {
        await adminApi(`/admin/categories/${editing.id}`, { method: 'PUT', body: payload });
      } else {
        await adminApi('/admin/categories', { method: 'POST', body: payload });
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`دسته‌بندی «${row.name}» حذف شود؟ محصولات این دسته بدون دسته‌بندی می‌شوند.`)) return;
    try {
      await adminApi(`/admin/categories/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setTableError(err.message);
    }
  }

  const parents = (rows || []).filter((row) => !row.parent_id);
  const childrenOf = (id) => (rows || []).filter((row) => row.parent_id === id);

  return (
    <div>
      <PageHeader
        title="دسته‌بندی‌ها"
        desc="ساختار دسته‌بندی محصولات را مدیریت کنید (دسته اصلی و زیردسته)"
        action={
          <button type="button" onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            دسته‌بندی جدید
          </button>
        }
      />

      {tableError && <Alert>{tableError}</Alert>}

      {!rows ? (
        <Spinner />
      ) : (
        <div className="space-y-3">
          {parents.map((parent) => (
            <Card key={parent.id} className="p-4">
              <div className="flex items-center gap-3">
                <Thumb src={parent.image} size="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-brand-950">{parent.name}</p>
                  <p className="mt-0.5 text-[10px] text-ink/40" dir="ltr">
                    /{parent.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-bold text-brand-800 sm:block">
                    {toFa(parent.product_count || 0)} محصول
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      parent.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {parent.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                  <button type="button" onClick={() => openEdit(parent)} className="admin-btn bg-cream-100 text-brand-800">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => remove(parent)} className="admin-btn bg-rose-50 text-rose-600">
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {childrenOf(parent.id).length > 0 && (
                <div className="mt-3 space-y-1.5 border-r-2 border-cream-200 pr-3">
                  {childrenOf(parent.id).map((child) => (
                    <div key={child.id} className="flex items-center gap-2 rounded-xl bg-cream-50 px-3 py-2">
                      <span className="flex-1 text-[11px] font-bold text-brand-900">{child.name}</span>
                      <span className="text-[9.5px] text-ink/40">{toFa(child.product_count || 0)} محصول</span>
                      <button type="button" onClick={() => openEdit(child)} className="text-ink/40 hover:text-brand-700">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => remove(child)} className="text-ink/40 hover:text-rose-600">
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ ...EMPTY, parent_id: String(parent.id) });
                  setOpen(true);
                }}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand-700 hover:text-brand-900"
              >
                <Plus className="h-3 w-3" />
                افزودن زیردسته
              </button>
            </Card>
          ))}

          {parents.length === 0 && <Card className="text-center text-xs text-ink/45">هنوز دسته‌بندی‌ای ثبت نشده است.</Card>}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}>
        <form onSubmit={save} className="space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="نام دسته‌بندی *">
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="نامک (slug)" hint="خالی بگذارید تا خودکار ساخته شود.">
              <Input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
            <Field label="دسته والد">
              <Select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                <option value="">بدون والد (دسته اصلی)</option>
                {parents
                  .filter((p) => !editing || p.id !== editing.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="ترتیب نمایش">
              <Input
                inputMode="numeric"
                dir="ltr"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </Field>
          </div>

          <Field label="توضیحات">
            <Textarea className="min-h-20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>

          <Field label="تصویر دسته‌بندی">
            <ImageUploader
              images={form.image ? [form.image] : []}
              onChange={(images) => setForm({ ...form, image: images[0] || '' })}
              multiple={false}
            />
          </Field>

          <Toggle
            checked={form.is_active}
            onChange={(v) => setForm({ ...form, is_active: v })}
            label="نمایش در سایت"
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
