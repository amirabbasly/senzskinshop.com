import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/product/ProductGallery';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import Stars from '@/components/product/Stars';
import { getProduct } from '@/lib/api';
import { discountPercent, formatPrice, toFa } from '@/lib/format';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: 'محصول یافت نشد' };
  const { product } = data;
  return {
    title: product.name,
    description: product.short_desc?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_desc,
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data?.product) notFound();
  const { product, related = [], reviews = [] } = data;
  const off = discountPercent(product.price, product.compare_price);
  const ratingAvg = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : Number(product.rating || 5).toFixed(1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.short_desc,
    brand: { '@type': 'Brand', name: product.brand || 'SENZ SKIN' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingAvg,
      reviewCount: Math.max(reviews.length, 1),
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: Number(product.price) * 10,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="pb-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { label: 'فروشگاه', href: '/products' },
            product.category_slug
              ? { label: product.category_name, href: `/category/${product.category_slug}` }
              : { label: 'محصولات' },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,460px)_1fr]">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-gold-200 bg-gold-50 text-gold-700">{product.brand || 'senzskinshop'}</span>
              {product.category_name && (
                <Link href={`/category/${product.category_slug}`} className="chip hover:border-brand-400">
                  {product.category_name}
                </Link>
              )}
              {product.sku && <span className="chip text-ink/40">کد: {product.sku}</span>}
            </div>

            <h1 className="mt-4 text-xl font-black leading-9 text-brand-950 sm:text-2xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink/50">
              <span className="flex items-center gap-1.5">
                <Stars value={ratingAvg} showValue />
              </span>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span>{toFa(reviews.length || 0)} نظر</span>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span>{toFa(product.sold || 0)} فروش موفق</span>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span className={product.stock > 0 ? 'text-brand-700' : 'text-rose-600'}>
                {product.stock > 0 ? 'موجود در انبار' : 'ناموجود'}
              </span>
            </div>

            <p className="mt-4 text-[13px] leading-7 text-ink/65">{product.short_desc}</p>

            <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-cream-300 bg-white p-4">
              <div>
                <span className="block text-[10px] text-ink/45">قیمت</span>
                <span className="text-xl font-black text-brand-900">{formatPrice(product.price)}</span>
              </div>
              {product.compare_price > product.price && (
                <>
                  <span className="text-xs text-ink/35 line-through">{formatPrice(product.compare_price)}</span>
                  <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white">
                    {toFa(off)}٪ تخفیف
                  </span>
                </>
              )}
            </div>

            <div className="mt-5">
              <ProductActions product={product} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { image: '/images/icons/service-authentic.png', label: 'ضمانت اصالت' },
                { image: '/images/icons/service-shipping.png', label: 'ارسال سریع' },
                { image: '/images/icons/service-return.png', label: '۷ روز بازگشت' },
                { image: '/images/icons/service-payment.png', label: 'پرداخت امن' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-cream-100/70 px-2 py-3 text-center"
                >
                  <img src={item.image} alt={item.label} loading="lazy" className="h-8 w-8 rounded-full object-contain" />
                  <span className="text-[10px] font-bold text-brand-900">{item.label}</span>
                </div>
              ))}
            </div>

            {product.skin_type && (
              <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-[11px] leading-6 text-brand-900">
                <strong className="font-extrabold">مناسب برای:</strong> {product.skin_type}
                {product.volume ? ` — حجم ${product.volume}` : ''}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <ProductTabs product={product} reviews={reviews} />
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="section-head">
              <h2 className="section-title">محصولات مرتبط</h2>
              <Link href="/products" className="text-xs font-bold text-brand-700">
                مشاهده همه
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
