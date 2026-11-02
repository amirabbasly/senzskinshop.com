'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { SKIN_TYPES } from '@/lib/constants';
import {
  Alert,
  Card,
  Field,
  ImageUploader,
  Input,
  PageHeader,
  SaveBar,
  Select,
  SpecsEditor,
  Spinner,
  Textarea,
  Toggle,
} from './ui';
import { Trash } from '../Icons';

const EMPTY = {
  name: '',
  slug: '',
  brand: 'سنز اسکین',
  category_id: '',
  short_desc: '',
  description: '',
  ingredients: '',
  how_to_use: '',
  price: '',
  compare_price: '',
  stock: '0',
  sku: '',
  volume: '',
  skin_type: '',
  images: [],
  specs: [],
  is_active: true,
  is_featured: false,
  is_bestseller: false,
};

export default function ProductForm({ productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi('/admin/categories')
      .then((rows) => setCategories(rows))
      .catch(() => {});
    if (!isEdit) return;
    adminApi(`/admin/products/${productId}`)
      .then((product) => {
        setForm({
          ...EMPTY,
          ...product,
          category_id: product.category_id ? String(product.category_id) : '',
          price: String(product.price ?? ''),
          compare_price: String(product.compare_price ?? ''),
          stock: String(product.stock ?? 0),
          images: Array.isArray(product.images) ? product.images : [],
          specs: Array.isArray(product.specs) ? product.specs : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId, isEdit]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        price: form.price,
        compare_price: form.compare_price,
        stock: form.stock,
      };
      if (isEdit) {
        await adminApi(`/admin/products/${productId}`, { method: 'PUT', body: payload });
      } else {
        await adminApi('/admin/products', { method: 'POST', body: payload });
      }
      setMessage('محصول با موفقیت ذخیره شد.');
      setTimeout(() => router.push('/admin/products'), 700);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm('این محصول حذف شود؟ این عمل قابل بازگشت نیست.')) return;
    try {
      await adminApi(`/admin/products/${productId}`, { method: 'DELETE' });
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Spinner />;

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={isEdit ? `ویرایش محصول${form.name ? `: ${form.name}` : ''}` : 'افزودن محصول جدید'}
        desc="اطلاعات کامل محصول، تصاویر، قیمت و مشخصات را وارد کنید"
        action={
          isEdit ? (
            <button type="button" onClick={remove} className="admin-btn bg-rose-50 text-rose-600">
              <Trash className="h-3.5 w-3.5" />
              حذف محصول
            </button>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Card>
            <h3 className="mb-4 text-xs font-extrabold text-brand-950">اطلاعات اصلی</h3>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="نام محصول *" className="sm:col-span-2">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="مثلاً سرم ویتامین C ۱۵٪"
                />
              </Field>
              <Field label="نامک (slug)" hint="در آدرس محصول استفاده می‌شود؛ خالی بگذارید تا خودکار ساخته شود.">
                <Input dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="vitamin-c-serum" />
              </Field>
              <Field label="برند">
                <Input value={form.brand} onChange={(e) => set('brand', e.target.value)} />
              </Field>
              <Field label="توضیح کوتاه" className="sm:col-span-2">
                <Textarea
                  className="min-h-16"
                  value={form.short_desc}
                  onChange={(e) => set('short_desc', e.target.value)}
                  placeholder="توضیح کوتاه محصول در صفحه لیست محصولات نمایش داده می‌شود."
                />
              </Field>
              <Field label="توضیحات کامل" className="sm:col-span-2">
                <Textarea
                  className="min-h-40"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="برای ایجاد پاراگراف جدید، یک خط خالی بگذارید."
                />
              </Field>
              <Field label="ترکیبات">
                <Textarea className="min-h-24" value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} />
              </Field>
              <Field label="روش استفاده">
                <Textarea className="min-h-24" value={form.how_to_use} onChange={(e) => set('how_to_use', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">مشخصات محصول</h3>
            <p className="mb-3 text-[10px] text-ink/40">مشخصاتی مثل حجم، نوع پوست، کشور تولید و… را اضافه کنید.</p>
            <SpecsEditor specs={form.specs} onChange={(specs) => set('specs', specs)} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-4 text-xs font-extrabold text-brand-950">قیمت و موجودی</h3>
            <div className="space-y-3.5">
              <Field label="قیمت (تومان) *">
                <Input
                  required
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="489000"
                  dir="ltr"
                />
              </Field>
              <Field label="قیمت قبل از تخفیف" hint="اگر خالی یا صفر باشد، تخفیف نمایش داده نمی‌شود.">
                <Input
                  inputMode="numeric"
                  value={form.compare_price}
                  onChange={(e) => set('compare_price', e.target.value)}
                  placeholder="620000"
                  dir="ltr"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="موجودی انبار">
                  <Input inputMode="numeric" value={form.stock} onChange={(e) => set('stock', e.target.value)} dir="ltr" />
                </Field>
                <Field label="کد کالا (SKU)">
                  <Input value={form.sku} onChange={(e) => set('sku', e.target.value)} dir="ltr" />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-xs font-extrabold text-brand-950">دسته‌بندی و ویژگی‌ها</h3>
            <div className="space-y-3.5">
              <Field label="دسته‌بندی">
                <Select value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
                  <option value="">بدون دسته‌بندی</option>
                  {categories
                    .filter((cat) => !cat.parent_id)
                    .map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id}>{cat.name}</option>
                        {(categories || [])
                          .filter((child) => child.parent_id === cat.id)
                          .map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  {categories
                    .filter((cat) => cat.parent_id && !categories.some((p) => p.id === cat.parent_id))
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field label="حجم / وزن">
                <Input value={form.volume} onChange={(e) => set('volume', e.target.value)} placeholder="۳۰ میلی‌لیتر" />
              </Field>
              <Field label="نوع پوست">
                <Input
                  value={form.skin_type}
                  onChange={(e) => set('skin_type', e.target.value)}
                  list="skin-types"
                  placeholder="همه انواع پوست"
                />
                <datalist id="skin-types">
                  {SKIN_TYPES.map((type) => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </Field>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">تصاویر محصول</h3>
            <ImageUploader images={form.images} onChange={(images) => set('images', images)} />
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">وضعیت نمایش</h3>
            <div className="space-y-2">
              <Toggle checked={form.is_active} onChange={(v) => set('is_active', v)} label="فعال در فروشگاه" />
              <Toggle
                checked={form.is_featured}
                onChange={(v) => set('is_featured', v)}
                label="نمایش در پیشنهاد سنز"
                description="در بخش «پیشنهاد سنز اسکین» صفحه اصلی نمایش داده می‌شود."
              />
              <Toggle
                checked={form.is_bestseller}
                onChange={(v) => set('is_bestseller', v)}
                label="برچسب پرفروش"
                description="نشان «پرفروش» روی کارت محصول نمایش داده می‌شود."
              />
            </div>
          </Card>

          <Alert>{error}</Alert>
        </div>
      </div>

      <SaveBar
        loading={saving}
        message={message}
        error={error}
        onCancel={() => router.push('/admin/products')}
        submitLabel={isEdit ? 'ذخیره تغییرات' : 'افزودن محصول'}
      />
    </form>
  );
}
