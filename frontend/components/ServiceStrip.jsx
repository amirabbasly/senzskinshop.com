import { Headset, RefreshCw, ShieldCheck, Truck } from './Icons';

const ICONS = [Truck, ShieldCheck, Headset, RefreshCw];

export default function ServiceStrip({ services = [] }) {
  const list = services.length
    ? services.slice(0, 4)
    : [
        { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران' },
        { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن محصولات' },
        { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول' },
        { title: '۷ روز بازگشت', desc: 'بازگشت کالا تا ۷ روز' },
      ];

  return (
    <div className="grid grid-cols-2 gap-3 rounded-3xl border border-cream-300/80 bg-white p-4 shadow-soft sm:p-5 lg:grid-cols-4">
      {list.map((service, index) => {
        const Icon = ICONS[index % ICONS.length];
        return (
          <div key={service.title} className="flex items-center gap-3 rounded-2xl px-1 py-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Icon />
            </span>
            <div>
              <p className="text-[13px] font-bold text-brand-950">{service.title}</p>
              <p className="mt-0.5 text-[10.5px] leading-5 text-ink/50">{service.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
