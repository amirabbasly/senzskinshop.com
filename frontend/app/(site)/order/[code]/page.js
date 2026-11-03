import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getOrder } from '@/lib/api';
import { ORDER_STATUS, PAYMENT_LABELS, PAYMENT_STATUS, PLACEHOLDER_IMAGE } from '@/lib/constants';
import { formatDate, formatPrice, toFa } from '@/lib/format';
import { ArrowLeft, Check, Clock, CreditCard, MapPin, Package, Phone, Truck } from '@/components/Icons';

const STEPS = [
  { key: 'pending', label: 'ثبت سفارش' },
  { key: 'confirmed', label: 'تأیید سفارش' },
  { key: 'preparing', label: 'آماده‌سازی' },
  { key: 'shipped', label: 'ارسال' },
  { key: 'delivered', label: 'تحویل' },
];

export async function generateMetadata({ params }) {
  const { code } = await params;
  return { title: `سفارش ${code}` };
}

export default async function OrderPage({ params, searchParams }) {
  const { code } = await params;
  const { payment: paymentResult } = (await searchParams) || {};
  const order = await getOrder(code);

  if (!order) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-cream-400 bg-white p-10 text-center">
          <Package className="mx-auto h-9 w-9 text-brand-700" />
          <h1 className="mt-4 text-lg font-black text-brand-950">سفارش پیدا نشد</h1>
          <p className="mt-2 text-xs text-ink/55">کد سفارش را بررسی کنید یا از صفحه پیگیری سفارش استفاده کنید.</p>
          <Link href="/track" className="btn-primary btn-sm mt-6">
            پیگیری سفارش
          </Link>
        </div>
      </div>
    );
  }

  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const payStatus = PAYMENT_STATUS[order.payment_status] || PAYMENT_STATUS.unpaid;
  const needsPayment = order.payment_method === 'online' && order.payment_status !== 'paid';
  const activeIndex = Math.max(0, STEPS.findIndex((s) => s.key === order.status));
  const isCancelled = ['cancelled', 'returned'].includes(order.status);

  return (
    <div className="pb-10">
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'پیگیری سفارش', href: '/track' }, { label: `سفارش ${order.code}` }]} />
      </div>

      <div className="container-page">
        <div className="rounded-[2rem] border border-cream-300/80 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold ${status.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <h1 className="mt-3 text-xl font-black text-brand-950">سفارش {order.code}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink/50">
                <Clock className="h-3.5 w-3.5" />
                ثبت شده در {formatDate(order.created_at, { withTime: true })}
              </p>
            </div>
            <div className="rounded-2xl bg-cream-100/80 px-5 py-3 text-left">
              <p className="text-[10px] text-ink/50">مبلغ کل</p>
              <p className="text-lg font-black text-brand-900">{formatPrice(order.total)}</p>
              <p className="mt-1 text-[10px] text-ink/45">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</p>
              <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${payStatus.color}`}>
                {payStatus.label}
              </span>
            </div>
          </div>

          {paymentResult === 'success' && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-[11px] text-emerald-800">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <span>پرداخت شما با موفقیت ثبت شد. سفارش در حال آماده‌سازی است و وضعیت آن را از همین صفحه پیگیری کنید.</span>
            </div>
          )}
          {paymentResult === 'failed' && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-[11px] text-rose-700">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                پرداخت انجام نشد. مبلغی از حساب شما کسر نشده است؛ می‌توانید دوباره تلاش کنید
                {needsPayment ? ' یا با پشتیبانی تماس بگیرید.' : '.'}
              </span>
            </div>
          )}

          {!isCancelled ? (
            <div className="mt-8 grid grid-cols-5 gap-1">
              {STEPS.map((step, index) => {
                const done = index <= activeIndex;
                return (
                  <div key={step.key} className="relative flex flex-col items-center text-center">
                    {index > 0 && (
                      <span
                        className={`absolute right-1/2 top-4 -z-0 h-0.5 w-full ${index <= activeIndex ? 'bg-brand-600' : 'bg-cream-300'}`}
                        style={{ transform: 'translateX(50%)' }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                        done ? 'bg-brand-400 text-brand-950' : 'bg-cream-200 text-ink/40'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : toFa(index + 1)}
                    </span>
                    <span className={`mt-2 text-[10px] ${done ? 'font-bold text-brand-900' : 'text-ink/40'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-xs text-rose-700">
              این سفارش {status.label} است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-cream-300/80 bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-brand-950">
              <Package className="h-4 w-4 text-brand-700" />
              محصولات سفارش
            </h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl border border-cream-200 p-3">
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-bold text-brand-950">{item.name}</p>
                    <p className="mt-1 text-[10px] text-ink/45">
                      {toFa(item.qty)} عدد × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-brand-900">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-cream-200 pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink/55">جمع کالاها</dt>
                <dd className="font-bold">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">هزینه ارسال</dt>
                <dd className="font-bold">{order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand-700">
                  <dt>تخفیف</dt>
                  <dd className="font-bold">−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-200 pt-3 text-sm">
                <dt className="font-bold text-ink/70">مبلغ کل</dt>
                <dd className="font-black text-brand-900">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <aside className="space-y-4">
            {needsPayment && (
              <div className="rounded-3xl border border-gold-300/60 bg-cream-50 p-5">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-brand-950">
                  <CreditCard className="h-4 w-4 text-brand-700" />
                  پرداخت این سفارش
                </h2>
                <p className="mt-2 text-[10.5px] leading-6 text-ink/55">
                  این سفارش با روش پرداخت آنلاین ثبت شده و هنوز تسویه نشده است. برای تکمیل خرید، پرداخت را انجام دهید.
                </p>
                <Link href={`/payment/${order.code}`} className="btn-primary btn-sm mt-4 w-full">
                  پرداخت آنلاین {formatPrice(order.total)}
                </Link>
              </div>
            )}

            <div className="rounded-3xl border border-cream-300/80 bg-white p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-950">
                <Truck className="h-4 w-4 text-brand-700" />
                اطلاعات ارسال
              </h2>
              <p className="text-xs font-bold text-brand-950">{order.customer_name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink/55" dir="ltr">
                <Phone className="h-3.5 w-3.5" />
                {toFa(order.phone)}
              </p>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-6 text-ink/55">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {order.province}، {order.city}، {order.address}
                {order.postal_code ? ` — کد پستی: ${toFa(order.postal_code)}` : ''}
              </p>
              {order.note && (
                <p className="mt-3 rounded-xl bg-cream-100/80 p-3 text-[10.5px] leading-5 text-ink/55">
                  یادداشت: {order.note}
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-brand-100 p-5 text-brand-950">
              <p className="text-xs font-extrabold">سوالی دارید؟</p>
              <p className="mt-2 text-[11px] leading-6 text-ink/60">
                کد سفارش خود را هنگام تماس با پشتیبانی اعلام کنید تا سریع‌تر راهنمایی شوید.
              </p>
              <Link href="/contact" className="btn-gold btn-sm mt-4 w-full">
                تماس با پشتیبانی
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
