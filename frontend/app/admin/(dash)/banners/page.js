'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { formatDate, toFa } from '@/lib/format';
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
  Toggle,
} from '@/components/admin/ui';
import { Pencil, Plus, Trash } from '@/components/Icons';

const EMPTY = {
  title: '',
  subtitle: '',
  badge: '',
  image: '',
  link: '/products',
  btn_text: 'مشاهده محصولات',
  placement: 'hero',
  sort_order: '0',
  is_active: true,
};

export default function AdminBannersPage() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');

  const load = useCallback(() => {
    adminApi('/admin/banners')
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
    setForm({ ...EMPTY, ...row, sort_order: String(row.sort_order || 0) });
    setError('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await adminApi(`/admin/banners/${editing.id}`, { method: 'PUT', body: form });
      else await adminApi('/admin/banners', { method: 'POST', body: form });
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm('این بنر حذف شود؟')) return;
    try {
      await adminApi(`/admin/banners/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setPageError(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="بنر و اسلایدر"
        desc="اسلایدهای صفحه اصلی و بنرهای تبلیغاتی را مدیریت کنید"
        action={
          <button type="button" onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            بنر جدید
          </button>
        }
      />

      <Alert>{pageError}</Alert>

      {!rows ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <Card key={row.id} className="overflow-hidden p-0">
              <div className="relative h-36 bg-cream-100">
                {row.image ? (
                  <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-ink/35">بدون تصویر</div>
                )}
                <span className="absolute right-2 top-2 rounded-full bg-brand-950/70 px-2 py-0.5 text-[9px] font-bold text-cream-50">
                  {row.placement === 'hero' ? 'اسلایدر اصلی' : 'بنر نواری'}
                </span>
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    row.is_active ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'
                  }`}
                >
                  {row.is_active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-extrabold text-brand-950">{row.title || 'بدون عنوان'}</p>
                <p className="mt-1 line-clamp-1 text-[10.5px] text-ink/50">{row.subtitle}</p>
                <div className="mt-2 flex items-center gap-2 text-[9.5px] text-ink/40">
                  <span>ترتیب: {toFa(row.sort_order)}</span>
                  <span>•</span>
                  <span>{formatDate(row.created_at)}</span>
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
              </div>
            </Card>
          ))}
          {rows.length === 0 && <Card className="text-center text-xs text-ink/45 md:col-span-2">بنری ثبت نشده است.</Card>}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'ویرایش بنر' : 'بنر جدید'}>
        <form onSubmit={save} className="space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="عنوان *" className="sm:col-span-2">
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="زیرعنوان" className="sm:col-span-2">
              <Textarea className="min-h-16" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </Field>
            <Field label="برچسب">
              <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="مثلاً کالکشن جدید" />
            </Field>
            <Field label="متن دکمه">
              <Input value={form.btn_text} onChange={(e) => setForm({ ...form, btn_text: e.target.value })} />
            </Field>
            <Field label="لینک دکمه">
              <Input dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </Field>
            <Field label="محل نمایش">
              <Select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
                <option value="hero">اسلایدر صفحه اصلی</option>
                <option value="strip">بنر نواری</option>
              </Select>
            </Field>
            <Field label="ترتیب">
              <Input
                dir="ltr"
                inputMode="numeric"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </Field>
          </div>

          <Field label="تصویر بنر">
            <ImageUploader
              images={form.image ? [form.image] : []}
              onChange={(images) => setForm({ ...form, image: images[0] || '' })}
              multiple={false}
            />
          </Field>

          <Toggle checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} label="نمایش در سایت" />

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
