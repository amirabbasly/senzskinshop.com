'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCustomer } from './CustomerProvider';
import { customerApi } from '@/lib/customerApi';
import { ORDER_STATUS, PAYMENT_LABELS, PAYMENT_STATUS } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import {
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  LogOut,
  Package,
  ShieldCheck,
  User,
} from './Icons';

const TABS = [
  { key: 'orders', label: 'سفارش‌های من', icon: Package },
  { key: 'profile', label: 'اطلاعات حساب', icon: User },
  { key: 'security', label: 'رمز عبور و امنیت', icon: ShieldCheck },
];

export default function AccountView() {
  const router = useRouter();
  const { customer, ready, isLoggedIn, logout, refresh } = useCustomer();
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (ready && !isLoggedIn) router.replace('/login?next=/account');
  }, [ready, isLoggedIn, router]);

  if (!ready || !isLoggedIn) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-[2rem] border border-cream-300/80 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-brand-700" />
          <p className="mt-4 text-xs text-ink/50">در حال بارگذاری حساب کاربری…</p>
        </div>
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[1.7rem] border border-cream-300/80 bg-white p-5 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-950 text-xl font-black text-cream-50">
              {(customer?.name || '؟').trim().charAt(0)}
            </div>
            <p className="mt-3 text-sm font-black text-brand-950">{customer?.name}</p>
            <p dir="ltr" className="mt-1 text-[11px] text-ink/50">
              {toFa(customer?.phone || '')}
            </p>
            {customer?.email && (
              <p dir="ltr" className="mt-0.5 truncate text-[10.5px] text-ink/40">
                {customer.email}
              </p>
            )}
            <p className="mt-3 inline-flex rounded-full bg-cream-100 px-3 py-1 text-[10px] text-ink/55">
              عضو از {formatDate(customer?.created_at)}
            </p>
          </div>

          <nav className="overflow-hidden rounded-[1.7rem] border border-cream-300/80 bg-white shadow-soft">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex w-full items-center gap-2.5 border-b border-cream-200 px-4 py-3 text-right text-[11.5px] font-bold transition last:border-0 ${
                  tab === item.key ? 'bg-cream-100/80 text-brand-900' : 'text-ink/60 hover:bg-cream-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronLeft className="mr-auto h-3.5 w-3.5 opacity-40" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-right text-[11.5px] font-bold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          {tab === 'orders' && <OrdersPanel />}
          {tab === 'profile' && <ProfilePanel customer={customer} refresh={refresh} />}
          {tab === 'security' && <SecurityPanel phone={customer?.phone} />}
        </section>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    customerApi('/customer/orders')
      .then((data) => setOrders(data.orders || []))
      .catch((err) => {
        setError(err.message);
        setOrders([]);
      });
  }, []);

  useEffect(load, [load]);

  if (orders === null) {
    return (
      <div className="rounded-[1.7rem] border border-cream-300/80 bg-white p-10 text-center text-xs text-ink/45">
        در حال دریافت سفارش‌ها…
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-[1.7rem] border border-dashed border-cream-400 bg-white p-10 text-center">
        <Package className="mx-auto h-9 w-9 text-brand-600" />
        <h2 className="mt-3 text-sm font-black text-brand-950">هنوز سفارشی ثبت نکرده‌اید</h2>
        <p className="mt-2 text-[11px] text-ink/50">
          {error || 'با اولین خرید، سفارش‌های شما همین‌جا نمایش داده می‌شود.'}
        </p>
        <Link href="/products" className="btn-primary btn-sm mt-5">
          شروع خرید
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black text-brand-950">
          سفارش‌های من <span className="text-[11px] font-normal text-ink/45">({toFa(orders.length)} سفارش)</span>
        </h2>
        <Link href="/track" className="text-[10.5px] text-brand-700 hover:text-brand-900">
          پیگیری با کد سفارش
        </Link>
      </div>

      {orders.map((order) => {
        const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
        const pay = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.unpaid;
        const unpaid = order.payment_method === 'online' && order.payment_status !== 'paid';
        return (
          <article key={order.id} className="rounded-[1.5rem] border border-cream-300/80 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-brand-950" dir="ltr">
                  {order.code}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${status.color}`}>
                  {status.label}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${pay.color}`}>
                  {pay.label}
                </span>
              </div>
              <p className="flex items-center gap-1 text-[10px] text-ink/45">
                <Clock className="h-3 w-3" />
                {formatDate(order.created_at, { withTime: true })}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-3">
              <div className="flex items-center gap-3 text-[10.5px] text-ink/55">
                <span className="rounded-lg bg-cream-100 px-2 py-1">
                  {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                </span>
                <span className="font-bold text-brand-900">{formatPrice(order.total)}</span>
              </div>
              <div className="flex items-center gap-2">
                {unpaid && (
                  <Link href={`/payment/${order.code}`} className="btn-primary btn-sm gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    پرداخت
                  </Link>
                )}
                <Link
                  href={`/order/${order.code}`}
                  className="rounded-full border border-cream-300 px-3 py-1.5 text-[10.5px] font-bold text-brand-800 hover:bg-cream-50"
                >
                  جزئیات سفارش
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ProfilePanel({ customer, refresh }) {
  const [form, setForm] = useState({ name: customer?.name || '', email: customer?.email || '' });
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, message: '', error: '' });
    try {
      await customerApi('/customer/profile', { method: 'PUT', body: form });
      await refresh();
      setState({ loading: false, message: 'اطلاعات حساب با موفقیت ذخیره شد.', error: '' });
    } catch (err) {
      setState({ loading: false, message: '', error: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[1.7rem] border border-cream-300/80 bg-white p-5 sm:p-6 shadow-soft">
      <h2 className="text-sm font-black text-brand-950">اطلاعات حساب</h2>
      <p className="mt-1 text-[10.5px] text-ink/45">
        نام و ایمیل خود را به‌روز نگه دارید تا در فاکتور و اطلاع‌رسانی سفارش درست نمایش داده شود.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">نام و نام خانوادگی</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">ایمیل</label>
          <input
            className="input"
            dir="ltr"
            type="email"
            placeholder="اختیاری"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">شماره موبایل</label>
          <input className="input" dir="ltr" value={customer?.phone || ''} disabled />
          <p className="mt-1 text-[10px] text-ink/40">شماره موبایل شناسه ورود شماست و قابل تغییر نیست.</p>
        </div>
      </div>

      {state.error && <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{state.error}</p>}
      {state.message && (
        <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          {state.message}
        </p>
      )}

      <button type="submit" disabled={state.loading} className="btn-primary btn-sm mt-5">
        {state.loading ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
      </button>
    </form>
  );
}

function SecurityPanel({ phone }) {
  const [form, setForm] = useState({ current_password: '', new_password: '' });
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, message: '', error: '' });
    try {
      await customerApi('/customer/password', { method: 'POST', body: form });
      setForm({ current_password: '', new_password: '' });
      setState({ loading: false, message: 'رمز عبور تغییر کرد.', error: '' });
    } catch (err) {
      setState({ loading: false, message: '', error: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-[1.7rem] border border-cream-300/80 bg-white p-5 sm:p-6 shadow-soft">
      <h2 className="text-sm font-black text-brand-950">تغییر رمز عبور</h2>
      <p className="mt-1 text-[10.5px] text-ink/45">
        شماره ورود شما <span dir="ltr">{phone}</span> است. رمز جدید حداقل ۶ کاراکتر باشد.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">رمز عبور فعلی</label>
          <input
            className="input"
            dir="ltr"
            type="password"
            required
            value={form.current_password}
            onChange={(e) => setForm({ ...form, current_password: e.target.value })}
          />
        </div>
        <div>
          <label className="label">رمز عبور جدید</label>
          <input
            className="input"
            dir="ltr"
            type="password"
            minLength={6}
            required
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          />
        </div>
      </div>

      {state.error && <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{state.error}</p>}
      {state.message && (
        <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          {state.message}
        </p>
      )}

      <button type="submit" disabled={state.loading} className="btn-primary btn-sm mt-5">
        {state.loading ? 'در حال ذخیره…' : 'تغییر رمز عبور'}
      </button>
    </form>
  );
}
