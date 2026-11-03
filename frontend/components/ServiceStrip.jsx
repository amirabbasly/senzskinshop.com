import { CreditCard, Headset, RefreshCw, ShieldCheck, Truck } from './Icons';

const ICONS = [Truck, ShieldCheck, CreditCard, Headset, RefreshCw];

const FALLBACK = [
  { title: 'ارسال سریع', desc: 'به سراسر ایران با پست پیشتاز' },
  { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن کالا' },
  { title: 'پرداخت امن', desc: 'درگاه بانکی معتبر' },
  { title: 'مشاوره رایگان', desc: 'کارشناس پوست و مو' },
  { title: '۷ روز بازگشت', desc: 'بازگشت بدون دلیل' },
];

export default function ServiceStrip({ services = [] }) {
  const list = services.length ? services.slice(0, 5) : FALLBACK;

  return (
    <div className="grid grid-cols-5 divide-x divide-x-reverse divide-cream-200 overflow-hidden rounded-xl border border-cream-300 bg-white shadow-[0_1px_3px_rgba(90,55,50,.05)] sm:rounded-2xl">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div
            key={`${service.title}-${index}`}
            className="flex min-w-0 flex-col items-center gap-1.5 px-1 py-3 text-center sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3.5 sm:text-right"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100/70 sm:h-10 sm:w-10">
              <Icon className="h-[18px] w-[18px] sm:h-[19px] sm:w-[19px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[8.5px] font-extrabold leading-[13px] text-brand-950 sm:text-[12px] sm:leading-5">
                {service.title}
              </p>
              <p className="mt-0.5 hidden text-[10px] leading-4 text-ink/45 sm:block">{service.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
