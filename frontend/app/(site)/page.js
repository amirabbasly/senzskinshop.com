import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ServiceStrip from '@/components/ServiceStrip';
import CategoryCircles from '@/components/CategoryCircles';
import FeaturedTabs from '@/components/FeaturedTabs';
import PromoPanel from '@/components/PromoPanel';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { getHome } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { formatDate, toFa } from '@/lib/format';
import { ArrowLeft, Leaf, Sparkles, Star } from '@/components/Icons';

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
      <div className="container-page pt-5">
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

      <section className="container-page mt-16">
        <PromoPanel
          badge="پیشنهاد ویژه ماه"
          title="۱۵٪ تخفیف روی اولین سفارش شما"
          text="با کد تخفیف SENZ15 اولین خریدت را با تخفیف انجام بده. تمام محصولات با ضمانت اصالت و امکان بازگشت ۷ روزه ارسال می‌شوند."
          image="/images/banners/hero-2.jpg"
          href="/products"
        />
      </section>

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

      <section className="container-page mt-16">
        <div className="grid gap-6 rounded-[2rem] border border-cream-300/80 bg-white p-6 shadow-soft md:grid-cols-3 md:p-9">
          <div className="md:border-l md:border-cream-200 md:pl-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
              <Leaf className="h-3.5 w-3.5" />
              چرا سنز اسکین؟
            </span>
            <h2 className="mt-4 text-xl font-black leading-8 text-brand-950">
              انتخاب علمی، نه تبلیغاتی
            </h2>
            <p className="mt-3 text-xs leading-6 text-ink/60">
              {settings.about_short || 'همه محصولات سنز اسکین بر اساس ترکیبات مؤثره و تست حساسیت انتخاب می‌شوند.'}
            </p>
            <Link href="/about" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700">
              بیشتر بدانید
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-2 md:grid-cols-3">
            {[
              { value: toFa('+۱۲٬۰۰۰'), label: 'مشتری راضی', icon: Star },
              { value: toFa('+۱۵۰'), label: 'محصول تخصصی', icon: Sparkles },
              { value: toFa('۷ روز'), label: 'ضمانت بازگشت', icon: Leaf },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-cream-100/70 p-4 text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-gold-500" />
                <p className="text-base font-black text-brand-900">{stat.value}</p>
                <p className="mt-1 text-[10px] text-ink/50">{stat.label}</p>
              </div>
            ))}
            <div className="col-span-2 rounded-2xl bg-brand-900 p-4 text-cream-50 md:col-span-3">
              <p className="text-xs leading-6 text-cream-100/80">
                کارشناسان پوست ما آماده راهنمایی رایگان هستند — از انتخاب روتین تا ترکیب محصولات.
              </p>
              <a href={`tel:${settings.phone}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-gold-300">
                تماس با مشاور: <span dir="ltr">{toFa(settings.phone || '')}</span>
              </a>
            </div>
          </div>
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
