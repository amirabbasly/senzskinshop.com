'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartProvider';
import { useCustomer } from './CustomerProvider';
import { CLIENT_API } from '@/lib/api';
import { getCustomerToken } from '@/lib/customerApi';
import { DEFAULT_SETTINGS, PAYMENT_LABELS, PLACEHOLDER_IMAGE, PROVINCES } from '@/lib/constants';
import { formatPrice, toFa } from '@/lib/format';
import { Check, CreditCard, ShoppingBag, Ticket, Truck } from './Icons';

const EMPTY_FORM = {
  customer_name: '',
  phone: '',
  email: '',
  province: 'تهران',
  city: '',
  address: '',
  postal_code: '',
  note: '',
};

export default function CheckoutView() {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [payment, setPayment] = useState('cod');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { customer, ready: customerReady } = useCustomer();

  useEffect(() => {
    fetch(`${CLIENT_API}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!customer) return;
    setForm((prev) => ({
      ...prev,
      customer_name: prev.customer_name || customer.name || '',
      phone: prev.phone || customer.phone || '',
      email: prev.email || customer.email || '',
    }));
  }, [customer]);

  const shipping = useMemo(() => {
    const freeOver = Number(settings.free_shipping_min || 0);
    if (freeOver > 0 && subtotal >= freeOver) return 0;
    return Number(settings.shipping_cost || 0);
  }, [settings, subtotal]);

  const discount = coupon?.discount || 0;
  const total = Math.max(subtotal + shipping - discount, 0);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponMessage('');
    try {
      const res = await fetch(`${CLIENT_API}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'کد تخفیف نامعتبر است.');
      setCoupon(data);
      setCouponError(false);
      setCouponMessage(`${data.message} (${formatPrice(data.discount)} تخفیف)`);
    } catch (err) {
      setCoupon(null);
      setCouponError(true);
      setCouponMessage(err.message);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!items.length) {
      setError('سبد خرید شما خالی است.');
      return;
    }
    setLoading(true);
    try {
      const token = getCustomerToken();
      const res = await fetch(`${CLIENT_API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          payment_method: payment,
          coupon_code: coupon?.code || '',
          items: items.map((item) => ({ product_id: item.id, qty: item.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ثبت سفارش انجام نشد.');
      clear();
      if (data.payment?.payment_url) {
        router.push(data.payment.payment_url);
      } else {
        router.push(`/order/${data.code}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!ready) {
    return <div className="container-page py-16 text-center text-sm text-ink/40">در حال بارگذاری…</div>;
  }

  if (!items.length) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-cream-400 bg-white p-10 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-brand-700" />
          <h1 className="mt-4 text-lg font-black text-brand-950">برای تسویه حساب سبد خرید خالی است</h1>
          <Link href="/products" className="btn-primary btn-sm mt-6">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="container-page py-8">
      <h1 className="mb-6 text-xl font-black text-brand-950">تسویه حساب و اطلاعات ارسال</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-cream-300/80 bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-brand-950">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-800 text-[11px] text-cream-50">
                ۱
              </span>
              اطلاعات گیرنده
            </h2>

            {customerReady && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream-100/80 px-4 py-2.5 text-[10.5px] text-ink/60">
                {customer ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    خرید با حساب <span className="font-bold text-brand-900">{customer.name}</span> — سفارش در پنل شما ذخیره می‌شود.
                  </span>
                ) : (
                  <>
                    <span>حساب کاربری دارید؟ وارد شوید تا سفارش‌ها ذخیره شوند.</span>
                    <Link href="/login?next=/checkout" className="font-bold text-brand-700 hover:text-brand-900">
                      ورود / ثبت‌نام
                    </Link>
                  </>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">نام و نام خانوادگی *</label>
                <input
                  className="input"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="مثلاً سارا محمدی"
                />
              </div>
              <div>
                <label className="label">شماره موبایل *</label>
                <input
                  className="input"
                  required
                  dir="ltr"
                  inputMode="tel"
                  pattern="09[0-9]{9}"
                  title="شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="09121234567"
                />
              </div>
              <div>
                <label className="label">استان *</label>
                <select
                  className="input"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                >
                  {PROVINCES.map((province) => (
                    <option key={province}>{province}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">شهر *</label>
                <input
                  className="input"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="مثلاً تهران"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">آدرس کامل پستی *</label>
                <textarea
                  className="input min-h-20"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="خیابان، کوچه، پلاک، واحد…"
                />
              </div>
              <div>
                <label className="label">کد پستی</label>
                <input
                  className="input"
                  dir="ltr"
                  inputMode="numeric"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="label">ایمیل (اختیاری)</label>
                <input
                  className="input"
                  dir="ltr"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">توضیحات سفارش (اختیاری)</label>
                <textarea
                  className="input min-h-16"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="زمان تحویل، توضیح بسته‌بندی و…"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cream-300/80 bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-brand-950">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-800 text-[11px] text-cream-50">
                ۲
              </span>
              روش پرداخت
            </h2>

            <div className="space-y-2.5">
              {[
                { id: 'cod', enabled: true },
                { id: 'card', enabled: true },
                { id: 'online', enabled: Boolean(settings.payment_online_enabled) },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                    payment === option.id
                      ? 'border-brand-500 bg-brand-50/60'
                      : 'border-cream-300 hover:border-brand-200'
                  } ${!option.enabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={payment === option.id}
                      disabled={!option.enabled}
                      onChange={() => setPayment(option.id)}
                      className="h-4 w-4 accent-brand-700"
                    />
                    <span className="text-xs font-bold text-brand-950">{PAYMENT_LABELS[option.id]}</span>
                  </span>
                  {option.id === 'online' && !option.enabled && (
                    <span className="text-[10px] text-ink/45">به‌زودی</span>
                  )}
                  {option.id === 'cod' && <Truck className="h-4 w-4 text-brand-600" />}
                  {option.id === 'card' && <CreditCard className="h-4 w-4 text-brand-600" />}
                </label>
              ))}
            </div>

            {payment === 'card' && settings.bank_card && (
              <div className="mt-4 rounded-2xl bg-cream-100/80 p-4 text-[11px] leading-6 text-ink/65">
                لطفاً مبلغ سفارش را به شماره کارت زیر واریز و تصویر رسید را در واتس‌اپ برای پشتیبانی ارسال کنید.
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-brand-950" dir="ltr">
                    {settings.bank_card}
                  </span>
                  <span>{settings.bank_name}</span>
                </div>
              </div>
            )}

            {payment === 'online' && (
              <p className="mt-4 rounded-2xl bg-brand-50/70 p-4 text-[11px] leading-6 text-brand-900/70">
                پس از ثبت سفارش به صفحه پرداخت منتقل می‌شوید. سفارش شما تا تکمیل پرداخت در وضعیت «در انتظار پرداخت» می‌ماند.
              </p>
            )}

            {payment === 'cod' && (
              <p className="mt-4 rounded-2xl bg-cream-100/80 p-4 text-[11px] leading-6 text-ink/60">
                مبلغ سفارش را هنگام تحویل، نقدی یا با کارت‌خوان پیک پرداخت می‌کنید.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-32">
          <div className="rounded-3xl border border-cream-300/80 bg-white p-5">
            <h2 className="text-sm font-extrabold text-brand-950">سفارش شما</h2>
            <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pl-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[11px] font-bold text-brand-950">{item.name}</p>
                    <p className="text-[10px] text-ink/45">
                      {toFa(item.qty)} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-900">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-cream-200 pt-4">
              <label className="label">کد تخفیف</label>
              <div className="flex gap-2">
                <input
                  className="input"
                  dir="ltr"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="SENZ15"
                />
                <button type="button" onClick={applyCoupon} className="btn-outline btn-sm shrink-0">
                  <Ticket className="h-4 w-4" />
                  اعمال
                </button>
              </div>
              {couponMessage && (
                <p className={`mt-2 text-[10.5px] ${couponError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <dl className="mt-4 space-y-2.5 border-t border-cream-200 pt-4 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-ink/55">جمع کالاها</dt>
                <dd className="font-bold text-brand-950">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink/55">هزینه ارسال</dt>
                <dd className="font-bold text-brand-950">{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <dt>تخفیف ({coupon?.code})</dt>
                  <dd className="font-bold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-cream-200 pt-3 text-sm">
                <dt className="font-bold text-ink/70">مبلغ قابل پرداخت</dt>
                <dd className="font-black text-brand-900">{formatPrice(total)}</dd>
              </div>
            </dl>

            {error && (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
              {loading ? 'در حال ثبت سفارش…' : payment === 'online' ? 'ثبت سفارش و پرداخت' : 'ثبت نهایی سفارش'}
              {!loading && <Check className="h-4 w-4" />}
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-ink/40">
              با ثبت سفارش، قوانین فروشگاه سنز اسکین شاپ را می‌پذیرید.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
