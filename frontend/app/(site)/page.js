import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ServiceStrip from '@/components/ServiceStrip';
import CategoryCircles from '@/components/CategoryCircles';
import FeaturedTabs from '@/components/FeaturedTabs';
import HighlightSplit from '@/components/HighlightSplit';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getHome } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { ArrowLeft } from '@/components/Icons';

export default async function HomePage() {
  const data = await getHome();
  const settings = { ...DEFAULT_SETTINGS, ...(data?.settings || {}) };
  const categories = data?.categories || [];
  const featured = data?.featured || [];
  const bestsellers = data?.bestsellers || [];
  const newest = data?.newest || [];
  const posts = data?.posts || [];
  const banners = data?.banners || [];

  const tabs = [
    { key: 'bestsellers', label: 'پرفروش‌ترین‌ها', items: bestsellers, href: '/products?sort=popular' },
    { key: 'featured', label: 'پیشنهاد سنز', items: featured, href: '/products?featured=1' },
    { key: 'newest', label: 'جدیدترین‌ها', items: newest, href: '/products?sort=newest' },
  ];

  return (
    <div className="pb-4">
      <div className="pt-3 sm:pt-4 lg:pt-0">
        <HeroSlider banners={banners} />
      </div>

      <div className="container-page mt-5">
        <ServiceStrip services={settings.services || []} />
      </div>

      <section className="container-page mt-14">
        <SectionHeading
          title="خرید بر اساس نیاز پوست"
          subtitle="از سرم‌های تخصصی تا مراقبت روزانه، دسته مورد نظرت را انتخاب کن"
          href="/products"
        />
        <CategoryCircles categories={categories} />
      </section>

      <section className="container-page mt-16">
        <FeaturedTabs tabs={tabs} />
      </section>

      <HighlightSplit settings={settings} />

      <section className="container-page mt-16">
        <SectionHeading
          title="جدیدترین محصولات"
          subtitle="تازه‌ترین محصولاتی که به قفسه‌های سنز اسکین اضافه شده‌اند"
          href="/products?sort=newest"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {newest.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container-page mt-16">
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
