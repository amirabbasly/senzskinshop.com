import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ServiceStrip from '@/components/ServiceStrip';
import BrandsStrip from '@/components/BrandsStrip';
import CategoryCircles from '@/components/CategoryCircles';
import ProductShowcase from '@/components/ProductShowcase';
import HighlightSplit from '@/components/HighlightSplit';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getBrands, getHome } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { ArrowLeft } from '@/components/Icons';

export default async function HomePage() {
  const [data, brandsData] = await Promise.all([getHome(), getBrands()]);
  const settings = { ...DEFAULT_SETTINGS, ...(data?.settings || {}) };
  const categories = data?.categories || [];
  const featured = data?.featured || [];
  const bestsellers = data?.bestsellers || [];
  const newest = data?.newest || [];
  const posts = data?.posts || [];
  const banners = data?.banners || [];
  const brands = brandsData?.brands || [];

  const showcase = [];
  [...featured, ...bestsellers, ...newest].forEach((product) => {
    if (product && !showcase.some((item) => item.id === product.id)) showcase.push(product);
  });
  showcase.sort((a, b) => (b.compare_price > b.price ? 1 : 0) - (a.compare_price > a.price ? 1 : 0));

  return (
    <div className="pb-4">
      <div className="pt-3 sm:pt-4 lg:pt-0">
        <HeroSlider banners={banners} />
      </div>

      <div className="container-page mt-4 sm:mt-5">
        <ServiceStrip services={settings.services || []} />
      </div>

      <BrandsStrip brands={brands} />

      <section className="container-page mt-10 sm:mt-14">
        <SectionHeading
          title="خرید بر اساس نیاز پوست"
          subtitle="از سرم‌های تخصصی تا مراقبت روزانه، دسته مورد نظرت را انتخاب کن"
          href="/products"
        />
        <CategoryCircles categories={categories} />
      </section>

      <ProductShowcase
        products={showcase.slice(0, 10)}
        title="پیشنهاد روزانه"
        subtitle="منتخب کارشناسان سنز با بهترین قیمت"
        href="/products?on_sale=1"
      />

      {bestsellers.length > 0 && (
        <section className="container-page mt-12 sm:mt-16">
          <SectionHeading
            title="پرفروش‌ترین محصولات"
            subtitle="انتخاب بیشترین تعداد از مشتریان سنز اسکین در این ماه"
            href="/products?sort=popular"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {bestsellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <HighlightSplit settings={settings} />

      <section className="container-page mt-12 sm:mt-16">
        <SectionHeading
          title="جدیدترین محصولات"
          subtitle="تازه‌ترین محصولاتی که به قفسه‌های سنز اسکین اضافه شده‌اند"
          href="/products?sort=newest"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {newest.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page mt-12 sm:mt-16">
          <SectionHeading
            title="مجله پوست سنز"
            subtitle="آموزش‌های کاربردی برای انتخاب و استفاده درست از محصولات"
            href="/blog"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-cream-300/80 bg-white transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="aspect-[16/10] overflow-hidden bg-cream-100">
                  <img
                    src={post.cover || '/images/blog/routine.jpg'}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-gold-600">{formatDate(post.created_at)}</span>
                  <h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-6 text-brand-950">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-6 text-ink/55">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                    ادامه مطلب
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
