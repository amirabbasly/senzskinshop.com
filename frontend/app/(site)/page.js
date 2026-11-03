import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ServiceStrip from '@/components/ServiceStrip';
import BrandsStrip from '@/components/BrandsStrip';
import BrandCircles from '@/components/BrandCircles';
import CategoryCircles from '@/components/CategoryCircles';
import CategoryBanners from '@/components/CategoryBanners';
import ProductShowcase from '@/components/ProductShowcase';
import HighlightSplit from '@/components/HighlightSplit';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getBanners, getBrands, getHome } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { ArrowLeft } from '@/components/Icons';

function dateParts(iso) {
  const date = iso ? new Date(iso) : new Date();
  return {
    day: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat('fa-IR', { month: 'short' }).format(date),
  };
}

export default async function HomePage() {
  const [data, brandsData, sideBannerData] = await Promise.all([
    getHome(),
    getBrands(),
    getBanners('hero_side'),
  ]);
  const settings = { ...DEFAULT_SETTINGS, ...(data?.settings || {}) };
  const categories = data?.categories || [];
  const featured = data?.featured || [];
  const bestsellers = data?.bestsellers || [];
  const newest = data?.newest || [];
  const posts = data?.posts || [];
  const banners = data?.banners || [];
  const sideBanners = Array.isArray(sideBannerData) ? sideBannerData : sideBannerData?.banners || [];
  const brands = brandsData?.brands || [];

  const showcase = [];
  [...featured, ...bestsellers, ...newest].forEach((product) => {
    if (product && !showcase.some((item) => item.id === product.id)) showcase.push(product);
  });
  showcase.sort((a, b) => (b.compare_price > b.price ? 1 : 0) - (a.compare_price > a.price ? 1 : 0));

  return (
    <div className="pb-5">
      <BrandCircles brands={brands} />

      <HeroSlider banners={banners} sideBanners={sideBanners} />

      <div className="container-page mt-3 hidden sm:mt-4 lg:block">
        <ServiceStrip services={settings.services || []} />
      </div>

      <BrandsStrip brands={brands} />

      <section className="container-page mt-7 sm:mt-9">
        <SectionHeading
          title="محبوب‌ترین دسته‌ها"
          subtitle="از سرم‌های تخصصی تا مراقبت روزانه، دسته مورد نظرت را انتخاب کن"
          href="/products"
        />
        <CategoryCircles categories={categories} />
      </section>

      <ProductShowcase
        products={showcase.slice(0, 10)}
        title="پیشنهاد روزانه"
        subtitle="منتخب کارشناسان senzskinshop با بهترین قیمت"
        href="/products?on_sale=1"
      />

      <CategoryBanners />

      {bestsellers.length > 0 && (
        <section className="container-page mt-8 sm:mt-12">
          <SectionHeading
            title="پرفروش‌ترین محصولات"
            subtitle="انتخاب بیشترین تعداد از مشتریان senzskinshop در این ماه"
            href="/products?sort=popular"
          />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <HighlightSplit settings={settings} />

      <section className="container-page mt-10 sm:mt-14">
        <SectionHeading
          title="جدیدترین محصولات"
          subtitle="تازه‌ترین محصولاتی که به قفسه‌های senzskinshop اضافه شده‌اند"
          href="/products?sort=newest"
        />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
          {newest.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page mt-10 sm:mt-14">
          <SectionHeading title="مجله پوست" subtitle="آموزش‌های کاربردی برای انتخاب و استفاده درست از محصولات" href="/blog" />

          <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3.5">
            {posts.slice(0, 3).map((post) => {
              const { day, month } = dateParts(post.created_at);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-cream-300 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-cream-100">
                    <img
                      src={post.cover || '/images/blog/routine.jpg'}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute right-2 top-2 flex flex-col items-center rounded-md bg-white/95 px-2 py-1 text-center shadow-sm">
                      <span className="text-[13px] font-black leading-4 text-brand-800">{day}</span>
                      <span className="text-[8px] text-ink/45">{month}</span>
                    </span>
                  </span>

                  <span className="flex flex-1 flex-col p-3">
                    <span className="text-[9px] font-bold text-brand-600">مجله پوست</span>
                    <h3 className="mt-1 line-clamp-2 text-[12px] font-extrabold leading-5 text-brand-950 transition group-hover:text-brand-700 sm:text-[13px]">
                      {post.title}
                    </h3>
                    <span className="mt-auto flex items-center justify-between pt-2.5 text-[9px] text-ink/40">
                      <span>{formatDate(post.created_at)}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-brand-700">
                        ادامه مطلب
                        <ArrowLeft className="h-3 w-3 transition group-hover:-translate-x-1" />
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
