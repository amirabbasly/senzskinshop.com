'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCustomer } from './CustomerProvider';
import { useCart } from './CartProvider';
import { customerApi } from '@/lib/customerApi';
import { ORDER_STATUS, PAYMENT_LABELS, PAYMENT_STATUS, PROVINCES } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import {
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  LogOut,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash,
  User,
} from './Icons';

const TABS = [
  { key: 'orders', label: 'سفارش‌های من', icon: Package },
  { key: 'addresses', label: 'آدرس‌های من', icon: MapPin },
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-200 text-xl font-black text-brand-900">
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
          {tab === 'addresses' && <AddressesPanel customer={customer} />}
          {tab === 'profile' && <ProfilePanel customer={customer} refresh={refresh} />}
          {tab === 'security' && <SecurityPanel phone={customer?.phone} />}
        </section>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const router = useRouter();
  const { add } = useCart();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyCode, setBusyCode] = useState('');

  async function reorder(code) {
    setBusyCode(code);
    setNotice('');
    try {
      const data = await customerApi(`/customer/orders/${code}`);
      const available = (data.items || []).filter((item) => item.product_id && item.is_active !== false && Number(item.stock) > 0);
      if (!available.length) {
        setNotice('محصولات این سفارش در حال حاضر موجود نیستند.');
        return;
      }
      available.forEach((item) => {
        add(
          {
            id: item.product_id,
            slug: item.slug,
            name: item.name,
            price: item.current_price || item.price,
            image: item.image,
            stock: item.stock,
          },
          item.qty
        );
      });

      const skipped = (data.items || []).length - available.length;
      if (skipped > 0) setNotice('برخی اقلام این سفارش موجود نبودند و به سبد اضافه نشدند.');
      router.push('/cart');
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusyCode('');
    }
  }

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

      {notice && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-[10.5px] text-amber-800">{notice}</p>
      )}

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
                <button
                  type="button"
                  onClick={() => reorder(order.code)}
                  disabled={busyCode === order.code}
                  className="flex items-center gap-1 rounded-full border border-cream-300 px-3 py-1.5 text-[10.5px] font-bold text-brand-800 transition hover:bg-cream-50 disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" />
                  {busyCode === order.code ? 'در حال افزودن…' : 'خرید مجدد'}
                </button>
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
        <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] text-brand-700">
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
        <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] text-brand-700">
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


function AddressesPanel({ customer }) {
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null);
  const [state, setState] = useState({ loading: false, message: '', error: '' });

  const load = useCallback(() => {
    customerApi('/customer/addresses')
      .then((data) => setAddresses(data.addresses || []))
      .catch((err) => {
        setAddresses([]);
        setState({ loading: false, message: '', error: err.message });
      });
  }, []);

  useEffect(load, [load]);

  function startNew() {
    setEditing({
      id: null,
      title: '',
      recipient: customer?.name || '',
      phone: customer?.phone || '',
      province: 'تهران',
      city: '',
      address: '',
      postal_code: '',
      is_default: !addresses || addresses.length === 0,
    });
    setState({ loading: false, message: '', error: '' });
  }

  function startEdit(address) {
    setEditing({ ...address });
    setState({ loading: false, message: '', error: '' });
  }

  async function save(e) {
    e.preventDefault();
    setState({ loading: true, message: '', error: '' });
    const { id } = editing;
    const payload = { ...editing };
    delete payload.id;
    delete payload.created_at;
    delete payload.customer_id;
    try {
      if (id) await customerApi(`/customer/addresses/${id}`, { method: 'PUT', body: payload });
      else await customerApi('/customer/addresses', { method: 'POST', body: payload });
      setEditing(null);
      setState({ loading: false, message: 'آدرس ذخیره شد.', error: '' });
      load();
    } catch (err) {
      setState({ loading: false, message: '', error: err.message });
    }
  }

  async function remove(id) {
    if (!window.confirm('این آدرس حذف شود؟')) return;
    try {
      await customerApi(`/customer/addresses/${id}`, { method: 'DELETE' });
      setState({ loading: false, message: 'آدرس حذف شد.', error: '' });
      load();
    } catch (err) {
      setState({ loading: false, message: '', error: err.message });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.7rem] border border-cream-300/80 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black text-brand-950">آدرس‌های من</h2>
            <p className="mt-1 text-[10.5px] text-ink/45">
              آدرس‌های ذخیره‌شده در صفحه پرداخت به‌صورت یک‌کلیکی پر می‌شوند.
            </p>
          </div>
          {!editing && (
            <button type="button" onClick={startNew} className="btn-primary btn-sm gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              افزودن آدرس جدید
            </button>
          )}
        </div>

        {state.error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{state.error}</p>}
        {state.message && (
          <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] text-brand-700">
            <Check className="h-3.5 w-3.5" />
            {state.message}
          </p>
        )}

        {editing ? (
          <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">عنوان آدرس</label>
              <input
                className="input"
                placeholder="خانه، محل کار…"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">نام گیرنده</label>
              <input
                className="input"
                required
                value={editing.recipient}
                onChange={(e) => setEditing({ ...editing, recipient: e.target.value })}
              />
            </div>
            <div>
              <label className="label">شماره تماس</label>
              <input
                className="input"
                dir="ltr"
                inputMode="tel"
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="label">استان</label>
              <select
                className="input"
                value={editing.province}
                onChange={(e) => setEditing({ ...editing, province: e.target.value })}
              >
                {PROVINCES.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">شهر</label>
              <input
                className="input"
                required
                value={editing.city}
                onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              />
            </div>
            <div>
              <label className="label">کد پستی</label>
              <input
                className="input"
                dir="ltr"
                inputMode="numeric"
                value={editing.postal_code || ''}
                onChange={(e) => setEditing({ ...editing, postal_code: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">آدرس کامل</label>
              <textarea
                className="input min-h-20"
                required
                value={editing.address}
                onChange={(e) => setEditing({ ...editing, address: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-[11px] text-ink/60 sm:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-700"
                checked={Boolean(editing.is_default)}
                onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })}
              />
              این آدرس پیش‌فرض باشد
            </label>

            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" disabled={state.loading} className="btn-primary btn-sm">
                {state.loading ? 'در حال ذخیره…' : 'ذخیره آدرس'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="btn-outline btn-sm">
                انصراف
              </button>
            </div>
          </form>
        ) : addresses === null ? (
          <p className="mt-4 text-[11px] text-ink/40">در حال دریافت آدرس‌ها…</p>
        ) : addresses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-cream-400 p-6 text-center">
            <MapPin className="mx-auto h-7 w-7 text-brand-600" />
            <p className="mt-2 text-[11px] text-ink/50">هنوز آدرسی ذخیره نکرده‌اید.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-cream-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-950">
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    {address.title}
                    {address.is_default && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold text-brand-700">
                        پیش‌فرض
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(address)}
                      className="rounded-lg px-2 py-1 text-[10px] font-bold text-brand-700 hover:bg-cream-100"
                    >
                      ویرایش
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(address.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                      aria-label="حذف آدرس"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-[10.5px] leading-6 text-ink/55">
                  {address.recipient} — <span dir="ltr">{toFa(address.phone)}</span>
                  <br />
                  {address.province}، {address.city}، {address.address}
                  {address.postal_code ? ` — کد پستی: ${toFa(address.postal_code)}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
