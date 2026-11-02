import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ChevronDown } from '@/components/Icons';

export const metadata = { title: 'سوالات متداول' };

const FAQS = [
  {
    q: 'محصولات سنز اسکین شاپ اصل هستند؟',
    a: 'بله. تمام محصولات از توزیع‌کننده رسمی یا نمایندگی معتبر تأمین می‌شوند و قبل از ارسال از نظر اصالت، تاریخ انقضا و شرایط نگهداری بررسی می‌شوند. در صورت مشاهده هرگونه مغایرت، کالا تعویض یا مبلغ بازگردانده می‌شود.',
  },
  {
    q: 'هزینه و زمان ارسال چقدر است؟',
    a: 'هزینه ارسال در صفحه تسویه حساب بر اساس آدرس شما محاسبه می‌شود و برای سفارش‌های بالای سقف تعیین‌شده رایگان است. سفارش‌های تهران معمولاً ۱ روز کاری و شهرستان‌ها ۲ تا ۴ روز کاری به دست شما می‌رسد.',
  },
  {
    q: 'روش‌های پرداخت چیست؟',
    a: 'در حال حاضر پرداخت در محل (هنگام تحویل) و کارت به کارت فعال است. برای پرداخت کارت به کارت، پس از ثبت سفارش شماره کارت نمایش داده می‌شود و باید تصویر رسید را برای پشتیبانی ارسال کنید.',
  },
  {
    q: 'امکان بازگشت کالا وجود دارد؟',
    a: 'تا ۷ روز پس از دریافت سفارش، در صورتی که بسته‌بندی محصول باز نشده باشد، می‌توانید کالا را بازگردانید. محصولات آرایشی و بهداشتی بازشده به دلیل مسائل بهداشتی قابل بازگشت نیستند.',
  },
  {
    q: 'چطور محصول مناسب پوست خودم را انتخاب کنم؟',
    a: 'در صفحه هر محصول، نوع پوست و ترکیبات اصلی ذکر شده است. همچنین می‌توانید از طریق واتس‌اپ یا تلفن با کارشناسان ما مشاوره رایگان بگیرید.',
  },
  {
    q: 'سفارش خود را چطور پیگیری کنم؟',
    a: 'با کد سفارشی که پس از ثبت سفارش دریافت می‌کنید، از صفحه پیگیری سفارش وضعیت سفارش را ببینید.',
  },
  {
    q: 'محصولات برای پوست حساس مناسب هستند؟',
    a: 'بیشتر محصولات ما بدون الکل، اسانس قوی و پارابن فرموله شده‌اند و برای پوست حساس مناسب‌اند. در صفحه هر محصول بخش «نوع پوست» را مطالعه کنید.',
  },
];

export default function FaqPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'سوالات متداول' }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-black text-brand-950 sm:text-2xl">سوالات متداول</h1>
        <p className="mt-2 text-xs leading-6 text-ink/55">
          پاسخ پرتکرارترین سوالات مشتریان سنز اسکین شاپ. اگر پاسخ خود را پیدا نکردید با ما تماس بگیرید.
        </p>

        <div className="mt-6 space-y-3">
          {FAQS.map((item, index) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-cream-300/80 bg-white p-4 open:border-brand-200 open:bg-brand-50/30"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-bold text-brand-950">
                {item.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-600 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[11.5px] leading-7 text-ink/60">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-brand-900 p-6 text-center text-cream-50">
          <p className="text-sm font-extrabold">پاسخ سوال خود را پیدا نکردید؟</p>
          <p className="mt-2 text-[11px] text-cream-100/70">کارشناسان ما در ساعات کاری پاسخگوی شما هستند.</p>
          <Link href="/contact" className="btn-gold btn-sm mt-4">
            تماس با پشتیبانی
          </Link>
        </div>
      </div>
    </div>
  );
}
