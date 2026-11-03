import { serviceImage } from '@/lib/service-media';

const FALLBACK = [
  { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
  { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
  { title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق درگاه بانکی معتبر' },
  { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
  { title: '۷ روز بازگشت', desc: 'بازگشت بی‌قید و شرط تا ۷ روز' },
];

export default function ServiceStrip({ services = [] }) {
  const list = services.length ? services.slice(0, 5) : FALLBACK;

  return (
    <div className="hidden gap-2.5 lg:grid lg:grid-cols-5">
      {list.map((service, index) => (
        <div
          key={`${service.title}-${index}`}
          className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(90,55,50,.05)] transition hover:border-brand-200 hover:shadow-soft"
        >
          <img
            src={serviceImage(index)}
            alt={service.title}
            loading="lazy"
            className="h-12 w-12 shrink-0 rounded-lg object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-extrabold leading-5 text-brand-950">{service.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-4 text-ink/45">{service.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
