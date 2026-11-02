import { Headset, RefreshCw, ShieldCheck, Truck } from './Icons';

const ICONS = [Truck, ShieldCheck, Headset, RefreshCw];

export default function ServiceStrip({ services = [] }) {
  const list = services.length
    ? services.slice(0, 4)
    : [
        { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
        { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
        { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
        { title: '۷ روز بازگشت', desc: 'امکان بازگشت کالا تا ۷ روز بدون دلیل' },
      ];

  return (
    <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-cream-300/80 bg-white p-3 shadow-soft sm:gap-3 sm:p-4 lg:grid-cols-4 lg:rounded-3xl lg:p-5">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div
            key={`${service.title}-${index}`}
            className="flex min-w-0 flex-col items-center gap-2 rounded-xl px-1.5 py-3 text-center transition sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:py-2 sm:text-right lg:px-1"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:h-11 sm:w-11 sm:rounded-2xl">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-bold leading-5 text-brand-950 sm:text-[13px]">{service.title}</p>
              <p className="mt-0.5 text-[10px] leading-[1.7] text-ink/50 sm:text-[10.5px]">{service.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
