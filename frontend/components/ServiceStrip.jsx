import { CreditCard, Headset, RefreshCw, ShieldCheck, Truck } from './Icons';

const ICONS = [Truck, ShieldCheck, CreditCard, Headset, RefreshCw];

const FALLBACK = [
  { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
  { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
  { title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق درگاه بانکی معتبر' },
  { title: 'مشاوره رایگان', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
  { title: '۷ روز بازگشت', desc: 'امکان بازگشت کالا تا ۷ روز بدون دلیل' },
];

export default function ServiceStrip({ services = [] }) {
  const list = services.length ? services.slice(0, 5) : FALLBACK;

  return (
    <div className="flex divide-x divide-x-reverse divide-cream-200 overflow-hidden rounded-2xl border border-cream-300/80 bg-white px-1 py-2.5 shadow-soft sm:divide-x-0 sm:p-4 lg:rounded-3xl">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div
            key={`${service.title}-${index}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:px-3 sm:py-1 sm:text-right sm:[&:not(:last-child)]:border-l sm:[&:not(:last-child)]:border-cream-200"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 sm:h-11 sm:w-11">
              <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-balance text-[8.5px] font-bold leading-[13px] text-brand-950 sm:text-[12.5px] sm:leading-5">
                {service.title}
              </p>
              <p className="mt-0.5 hidden text-[10.5px] leading-5 text-ink/50 sm:block">{service.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
