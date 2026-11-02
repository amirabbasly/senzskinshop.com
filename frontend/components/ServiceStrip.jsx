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
    <div className="flex divide-x divide-x-reverse divide-cream-200 overflow-hidden rounded-2xl border border-cream-300/80 bg-white px-1 py-2 shadow-soft sm:divide-x-0 sm:p-5 lg:rounded-3xl">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div
            key={`${service.title}-${index}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-center sm:flex-row sm:items-center sm:gap-3 sm:px-0 sm:py-2 sm:text-right sm:[&:not(:last-child)]:border-l sm:[&:not(:last-child)]:border-cream-200 sm:[&:not(:last-child)]:pl-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 sm:h-11 sm:w-11 sm:rounded-2xl">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="whitespace-nowrap text-[9.5px] font-bold leading-4 text-brand-950 sm:whitespace-normal sm:text-[13px]">
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
