'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { formatDate } from '@/lib/format';
import {
  Alert,
  Card,
  Empty,
  Field,
  ImageUploader,
  Input,
  Modal,
  PageHeader,
  Spinner,
  Textarea,
  Toggle,
} from '@/components/admin/ui';
import { Pencil, Plus, Trash } from '@/components/Icons';

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover: '',
  author: 'تیم سنز',
  is_published: true,
};

export default function AdminPostsPage() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');

  const load = useCallback(() => {
    adminApi('/admin/posts')
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
    setForm({ ...EMPTY, ...row });
    setError('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await adminApi(`/admin/posts/${editing.id}`, { method: 'PUT', body: form });
      else await adminApi('/admin/posts', { method: 'POST', body: form });
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`مقاله «${row.title}» حذف شود؟`)) return;
    try {
      await adminApi(`/admin/posts/${row.id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setPageError(err.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="مقالات مجله"
        desc="مقاله‌های آموزشی و محتوای مجله پوست را مدیریت کنید"
        action={
          <button type="button" onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">
            <Plus className="h-3.5 w-3.5" />
            مقاله جدید
          </button>
        }
      />

      <Alert>{pageError}</Alert>

      {!rows ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Empty title="مقاله‌ای ثبت نشده است" action={<button onClick={openNew} className="admin-btn bg-brand-800 text-cream-50">نوشتن مقاله</button>} />
      ) : (
        <div className="space-y-2.5">
          {rows.map((row) => (
            <Card key={row.id} className="flex flex-wrap items-center gap-3 p-3">
              <img src={row.cover} alt={row.title} className="h-14 w-20 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[12px] font-extrabold text-brand-950">{row.title}</p>
                <p className="mt-1 line-clamp-1 text-[10px] text-ink/45">{row.excerpt}</p>
                <p className="mt-1 text-[9.5px] text-ink/35">
                  {formatDate(row.created_at)} · {row.author}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  row.is_published ? 'bg-emerald-100 text-brand-700' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {row.is_published ? 'منتشر شده' : 'پیش‌نویس'}
              </span>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => openEdit(row)} className="admin-btn bg-cream-100 text-brand-800">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(row)} className="admin-btn bg-rose-50 text-rose-600">
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'ویرایش مقاله' : 'مقاله جدید'} width="max-w-3xl">
        <form onSubmit={save} className="space-y-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="عنوان *" className="sm:col-span-2">
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="نامک (slug)">
              <Input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-article" />
            </Field>
            <Field label="نویسنده">
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
            <Field label="خلاصه" className="sm:col-span-2">
              <Textarea className="min-h-16" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </Field>
            <Field
              label="متن مقاله"
              className="sm:col-span-2"
              hint="برای تیتر از ## و برای لیست از - در ابتدای خط استفاده کنید. پاراگراف‌ها را با خط خالی جدا کنید."
            >
              <Textarea className="min-h-52" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </Field>
          </div>

          <Field label="تصویر کاور">
            <ImageUploader
              images={form.cover ? [form.cover] : []}
              onChange={(images) => setForm({ ...form, cover: images[0] || '' })}
              multiple={false}
            />
          </Field>

          <Toggle
            checked={form.is_published}
            onChange={(v) => setForm({ ...form, is_published: v })}
            label="انتشار در سایت"
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
