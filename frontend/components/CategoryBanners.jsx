import Link from 'next/link';
import { ArrowLeft } from './Icons';

const BANNERS = [
  {
    title: 'مراقبت از پوست',
    subtitle: 'سرم، کرم، ضدآفتاب و ماسک صورت',
    image: '/images/banners/cat-skin.jpg',
    href: '/category/face',
  },
  {
    title: 'مراقبت از مو',
    subtitle: 'شامپو، روغن و ماسک تخصصی مو',
    image: '/images/banners/cat-hair.jpg',
    href: '/category/hair',
  },
];

export default function CategoryBanners() {
  return (
    <section className="container-page mt-4 sm:mt-5">
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3.5">
        {BANNERS.map((banner) => (
          <Link
            key={banner.href}
            href={banner.href}
            className="group relative isolate block overflow-hidden rounded-xl bg-brand-100 sm:rounded-2xl"
          >
            <span className="block aspect-[16/9] sm:aspect-[16/7]">
              <img
                src={banner.image}
                alt={banner.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </span>
            <span className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/35 to-transparent" />
            <span className="absolute inset-y-0 right-0 flex w-[58%] flex-col justify-center gap-1.5 px-4 text-right sm:gap-2 sm:px-7">
              <span className="text-[13px] font-black leading-6 text-brand-950 drop-shadow-sm sm:text-[19px] sm:leading-8">
                {banner.title}
              </span>
              <span className="text-[9.5px] leading-4 text-brand-900/70 sm:text-[11.5px]">{banner.subtitle}</span>
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-brand-500 px-2.5 py-1 text-[9.5px] font-bold text-white transition group-hover:bg-brand-600 sm:px-3 sm:py-1.5 sm:text-[11px]">
                مشاهده محصولات
                <ArrowLeft className="h-3 w-3" />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
