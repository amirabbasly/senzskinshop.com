import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import MockGateway from '@/components/MockGateway';
import { getOrder } from '@/lib/api';
import { Check, Package } from '@/components/Icons';
import { formatPrice } from '@/lib/format';

export const metadata = {
  title: 'پرداخت سفارش',
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ params, searchParams }) {
  const { code } = await params;
  const { authority } = (await searchParams) || {};
  const order = await getOrder(code);

  if (!order) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-cream-400 bg-white p-10 text-center">
          <Package className="mx-auto h-9 w-9 text-brand-700" />
          <h1 className="mt-4 text-lg font-black text-brand-950">سفارش پیدا نشد</h1>
          <p className="mt-2 text-xs text-ink/55">کد سفارش معتبر نیست یا سفارش حذف شده است.</p>
          <Link href="/track" className="btn-primary btn-sm mt-6">
            پیگیری سفارش
          </Link>
        </div>
      </div>
    );
  }

  const paid = order.payment_status === 'paid';

  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: `سفارش ${code}`, href: `/order/${code}` }, { label: 'پرداخت' }]} />
      </div>

      {paid ? (
        <div className="container-page py-14">
          <div className="mx-auto max-w-md rounded-[2rem] border border-emerald-100 bg-white p-10 text-center shadow-soft">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-lg font-black text-brand-950">این سفارش قبلاً پرداخت شده است</h1>
            <p className="mt-2 text-xs text-ink/55">
              مبلغ {formatPrice(order.total)} برای سفارش {code} با موفقیت پرداخت شده و نیازی به پرداخت مجدد نیست.
            </p>
            <Link href={`/order/${code}`} className="btn-primary btn-sm mt-6">
              مشاهده جزئیات سفارش
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="container-page pt-2 text-center">
            <h1 className="text-lg font-black text-brand-950">پرداخت سفارش</h1>
            <p className="mt-1.5 text-[11px] text-ink/50">
              سفارش <span dir="ltr">{code}</span> ثبت شد و در انتظار پرداخت است.
            </p>
          </div>
          <MockGateway order={order} initialAuthority={authority} />
        </>
      )}
    </div>
  );
}
