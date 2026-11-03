'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { Alert, Card, Field, Input, PageHeader, Spinner, Textarea, Toggle } from '@/components/admin/ui';
import { Check, Plus, Trash } from '@/components/Icons';

const GROUPS = [
  {
    title: 'اطلاعات فروشگاه',
    fields: [
      { key: 'site_name', label: 'نام فروشگاه' },
      { key: 'site_name_en', label: 'نام لاتین', dir: 'ltr' },
      { key: 'tagline', label: 'شعار فروشگاه' },
      { key: 'announcement', label: 'متن نوار اطلاعیه بالای سایت', full: true },
    ],
  },
  {
    title: 'اطلاعات تماس',
    fields: [
      { key: 'phone', label: 'تلفن ثابت', dir: 'ltr' },
      { key: 'mobile', label: 'موبایل', dir: 'ltr' },
      { key: 'email', label: 'ایمیل', dir: 'ltr' },
      { key: 'working_hours', label: 'ساعات کاری' },
      { key: 'address', label: 'آدرس', full: true, textarea: true },
      { key: 'postal_code', label: 'کد پستی', dir: 'ltr' },
      { key: 'map_link', label: 'لینک نقشه', dir: 'ltr' },
    ],
  },
  {
    title: 'شبکه‌های اجتماعی',
    fields: [
      { key: 'instagram', label: 'اینستاگرام', dir: 'ltr' },
      { key: 'telegram', label: 'تلگرام', dir: 'ltr' },
      { key: 'whatsapp', label: 'واتس‌اپ (با کد کشور، بدون +)', dir: 'ltr' },
    ],
  },
  {
    title: 'ارسال و پرداخت',
    money: true,
    fields: [
      { key: 'shipping_cost', label: 'هزینه ارسال (تومان)' },
      { key: 'free_shipping_min', label: 'حداقل مبلغ ارسال رایگان (تومان)' },
      { key: 'bank_card', label: 'شماره کارت', dir: 'ltr' },
      { key: 'bank_name', label: 'نام صاحب کارت / بانک' },
    ],
  },
  {
    title: 'متن‌های معرفی',
    fields: [
      { key: 'about_short', label: 'درباره ما (کوتاه)', full: true, textarea: true },
      { key: 'about_text', label: 'درباره ما (کامل)', full: true, textarea: true },
      { key: 'footer_text', label: 'متن فوتر', full: true, textarea: true },
    ],
  },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [passwordState, setPasswordState] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    adminApi('/admin/settings')
      .then((data) => {
        setForm({ ...DEFAULT_SETTINGS, ...data });
        setServices(Array.isArray(data.services) ? data.services : DEFAULT_SETTINGS.services);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const payload = { ...form, services };
      Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        if (payload[key] === undefined) payload[key] = DEFAULT_SETTINGS[key];
      });
      ['shipping_cost', 'free_shipping_min'].forEach((key) => {
        payload[key] = Number(String(payload[key]).replace(/[^\d]/g, '')) || 0;
      });
      await adminApi('/admin/settings', { method: 'PUT', body: payload });
      setMessage('تنظیمات با موفقیت ذخیره شد.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPasswordState({ loading: true, message: '', error: '' });
    try {
      const data = await adminApi('/auth/password', { method: 'POST', body: passwordForm });
      setPasswordState({ loading: false, message: data.message || 'رمز عبور تغییر کرد.', error: '' });
      setPasswordForm({ current_password: '', new_password: '' });
    } catch (err) {
      setPasswordState({ loading: false, message: '', error: err.message });
    }
  }

  if (loading) return <Spinner />;

  return (
    <form onSubmit={save}>
      <PageHeader title="تنظیمات سایت" desc="اطلاعات تماس، شعار، شبکه‌های اجتماعی، هزینه ارسال و متن‌های سایت" />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {GROUPS.map((group) => (
            <Card key={group.title}>
              <h3 className="mb-4 text-xs font-extrabold text-brand-950">{group.title}</h3>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {group.fields.map((field) => (
                  <Field
                    key={field.key}
                    label={field.label}
                    className={field.full ? 'sm:col-span-2' : ''}
                  >
                    {field.textarea ? (
                      <Textarea
                        className="min-h-20"
                        value={form[field.key] ?? ''}
                        onChange={(e) => set(field.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        dir={field.dir || 'rtl'}
                        value={form[field.key] ?? ''}
                        inputMode={group.money ? 'numeric' : undefined}
                        onChange={(e) => set(field.key, e.target.value)}
                      />
                    )}
                  </Field>
                ))}
              </div>
              {group.money && (
                <div className="mt-3">
                  <Toggle
                    checked={Boolean(form.payment_online_enabled)}
                    onChange={(v) => set('payment_online_enabled', v)}
                    label="فعال بودن پرداخت آنلاین"
                    description="در صورت فعال‌سازی، گزینه پرداخت آنلاین در صفحه تسویه حساب نمایش داده می‌شود (نیازمند اتصال درگاه پرداخت)."
                  />
                </div>
              )}
            </Card>
          ))}

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">خدمات فروشگاه (نوار مزیت‌ها)</h3>
            <div className="space-y-2.5">
              {services.map((service, index) => (
                <div key={index} className="flex flex-wrap gap-2 rounded-xl border border-cream-200 p-2.5 sm:flex-nowrap">
                  <Input
                    className="flex-1"
                    placeholder="عنوان (مثلاً ارسال سریع)"
                    value={service.title || ''}
                    onChange={(e) =>
                      setServices(services.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))
                    }
                  />
                  <Input
                    className="flex-1"
                    placeholder="توضیح کوتاه"
                    value={service.desc || ''}
                    onChange={(e) =>
                      setServices(services.map((item, i) => (i === index ? { ...item, desc: e.target.value } : item)))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((_, i) => i !== index))}
                    className="admin-btn bg-rose-50 text-rose-600"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setServices([...services, { title: '', desc: '' }])}
                className="admin-btn bg-cream-100 text-brand-800"
              >
                <Plus className="h-3.5 w-3.5" />
                افزودن مورد
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">ذخیره تغییرات</h3>
            <p className="text-[10.5px] leading-5 text-ink/45">
              تغییرات بلافاصله در سایت اعمال می‌شود. اطلاعات تماس در هدر، فوتر و صفحه تماس با ما نمایش داده می‌شود.
            </p>
            <div className="mt-3 space-y-2">
              <Alert type="success">{message}</Alert>
              <Alert>{error}</Alert>
            </div>
            <button type="submit" disabled={saving} className="admin-btn mt-3 w-full bg-brand-800 py-2.5 text-cream-50">
              <Check className="h-4 w-4" />
              {saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
            </button>
          </Card>

          <Card>
            <h3 className="mb-3 text-xs font-extrabold text-brand-950">تغییر رمز عبور مدیر</h3>
            <div className="space-y-3">
              <Field label="رمز فعلی">
                <Input
                  type="password"
                  dir="ltr"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
              </Field>
              <Field label="رمز جدید" hint="حداقل ۸ کاراکتر">
                <Input
                  type="password"
                  dir="ltr"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </Field>
              <button
                type="button"
                onClick={changePassword}
                disabled={passwordState.loading}
                className="admin-btn w-full bg-cream-100 py-2.5 text-brand-800"
              >
                {passwordState.loading ? 'در حال ذخیره…' : 'تغییر رمز عبور'}
              </button>
              <Alert type="success">{passwordState.message}</Alert>
              <Alert>{passwordState.error}</Alert>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
