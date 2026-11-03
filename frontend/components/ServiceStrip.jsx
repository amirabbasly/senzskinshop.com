import { CreditCard, Headset, RefreshCw, ShieldCheck, Truck } from './Icons';

const ICONS = [Truck, ShieldCheck, CreditCard, Headset, RefreshCw];

const FALLBACK = [
  { title: 'ارسال سریع', desc: 'به سراسر ایران با پست پیشتاز' },
  { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن کالا' },
  { title: 'پرداخت امن', desc: 'درگاه بانکی معتبر' },
  { title: 'مشاوره تخصصی', desc: 'کارشناس پوست و مو' },
  { title: '۷ روز بازگشت', desc: 'بازگشت بدون دلیل' },
];

export default function ServiceStrip({ services = [] }) {
  const list = services.length ? services.slice(0, 5) : FALLBACK;

  return (
    <div className="hidden gap-2.5 lg:grid lg:grid-cols-5">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div
            key={`${service.title}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(90,55,50,.05)] transition hover:border-brand-200 hover:shadow-soft"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100/70">
              <Icon className="h-[19px] w-[19px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-extrabold leading-5 text-brand-950">{service.title}</p>
              <p className="mt-0.5 truncate text-[10.5px] leading-4 text-ink/45">{service.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
