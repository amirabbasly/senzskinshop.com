import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';
import { SKIN_TYPES } from '@/lib/constants';
import { toFa } from '@/lib/format';
import { cleanParams, toQueryString } from '@/lib/query';
import ProductCard from './ProductCard';
import SortSelect from './SortSelect';
import { ChevronLeft, ChevronRight, Sliders, Tag } from './Icons';

const PRICE_RANGES = [
  { label: 'تا ۳۰۰ هزار تومان', max_price: 300000 },
  { label: '۳۰۰ تا ۵۰۰ هزار تومان', min_price: 300000, max_price: 500000 },
  { label: '۵۰۰ تا ۸۰۰ هزار تومان', min_price: 500000, max_price: 800000 },
  { label: 'بالای ۸۰۰ هزار تومان', min_price: 800000 },
];

function FilterLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
        active ? 'bg-brand-800 font-bold text-cream-50' : 'text-ink/65 hover:bg-cream-100 hover:text-brand-900'
      }`}
    >
      {children}
    </Link>
  );
}

export default async function ProductListing({ searchParams = {}, categorySlug = '', basePath = '/products', title, subtitle }) {
  const sp = cleanParams(searchParams);
  const page = Number(sp.page || 1) || 1;
  const sort = sp.sort || 'newest';

  const query = toQueryString({
    ...(categorySlug ? { category: categorySlug } : {}),
    q: sp.q,
    sort,
    min_price: sp.min_price,
    max_price: sp.max_price,
    featured: sp.featured,
    on_sale: sp.on_sale,
    bestseller: sp.bestseller,
    skin_type: sp.skin_type,
    limit: '12',
    page: String(page),
  });

  const [data, categories] = await Promise.all([getProducts(query), getCategories()]);
  const items = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;
  const categoryList = categories || [];

  const baseParams = { ...sp };
  if (categorySlug) baseParams.category = categorySlug;
  const hrefFor = (overrides) => `${basePath}${toQueryString(baseParams, overrides)}`;

  const activeCategory = categorySlug;

  const sidebar = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cream-300/80 bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-extrabold text-brand-950">
          <Tag className="h-4 w-4 text-gold-500" />
          دسته‌بندی‌ها
        </h3>
        <div className="space-y-1">
          <FilterLink href={hrefFor({ category: '', page: '' })} active={!activeCategory}>
            همه محصولات
            <span className="text-[10px] opacity-70">{toFa(total || '')}</span>
          </FilterLink>
          {categoryList.map((cat) => (
            <div key={cat.id}>
              <FilterLink href={`/category/${cat.slug}`} active={activeCategory === cat.slug}>
                {cat.name}
                <span className="text-[10px] opacity-70">{toFa(cat.product_count || 0)}</span>
              </FilterLink>
              {(cat.children || []).length > 0 && (
                <div className="mr-3 mt-1 space-y-0.5 border-r border-cream-300 pr-2">
                  {cat.children.map((child) => (
                    <FilterLink key={child.id} href={`/category/${child.slug}`} active={activeCategory === child.slug}>
                      <span className="text-[11px]">{child.name}</span>
                      <span className="text-[10px] opacity-60">{toFa(child.product_count || 0)}</span>
                    </FilterLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-cream-300/80 bg-white p-4">
        <h3 className="mb-3 text-xs font-extrabold text-brand-950">محدوده قیمت</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = String(sp.min_price || '') === String(range.min_price || '') &&
              String(sp.max_price || '') === String(range.max_price || '');
            return (
              <FilterLink
                key={range.label}
                href={hrefFor({ min_price: range.min_price || '', max_price: range.max_price || '', page: '' })}
                active={active}
              >
                {range.label}
              </FilterLink>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-cream-300/80 bg-white p-4">
        <h3 className="mb-3 text-xs font-extrabold text-brand-950">نوع پوست</h3>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TYPES.map((type) => (
            <Link
              key={type}
              href={hrefFor({ skin_type: sp.skin_type === type ? '' : type, page: '' })}
              className={`rounded-full px-3 py-1.5 text-[11px] transition ${
                sp.skin_type === type
                  ? 'bg-brand-800 text-cream-50'
                  : 'border border-cream-300 text-ink/60 hover:border-brand-300 hover:text-brand-800'
              }`}
            >
              {type}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-brand-900 p-5 text-cream-50">
        <p className="text-xs font-extrabold">مشاوره رایگان پوست</p>
        <p className="mt-2 text-[11px] leading-6 text-cream-100/70">
          نمی‌دانی کدام محصول برای پوستت مناسب است؟ کارشناسان ما راهنمایی‌ات می‌کنند.
        </p>
        <Link href="/contact" className="btn-gold btn-sm mt-4 w-full">
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container-page py-8">
      <div className="mb-6 rounded-[1.75rem] border border-cream-300/70 bg-gradient-to-l from-cream-100 to-white p-6 sm:p-8">
        <h1 className="text-xl font-black text-brand-950 sm:text-2xl">{title || 'همه محصولات'}</h1>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-ink/55 sm:text-sm">
          {subtitle || 'محصولات تخصصی مراقبت از پوست، مو و بدن با ضمانت اصالت و ارسال سریع به سراسر ایران.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{sidebar}</aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream-300/80 bg-white px-4 py-3">
            <p className="text-xs text-ink/60">
              <span className="font-extrabold text-brand-900">{toFa(total)}</span> محصول یافت شد
              {sp.q ? ` برای «${sp.q}»` : ''}
            </p>
            <div className="flex items-center gap-2">
              <details className="relative lg:hidden">
                <summary className="flex cursor-pointer items-center gap-1.5 rounded-full border border-cream-300 px-3.5 py-2 text-xs font-bold text-brand-900">
                  <Sliders className="h-4 w-4" />
                  فیلترها
                </summary>
                <div className="absolute left-0 top-11 z-30 max-h-[70vh] w-[280px] overflow-y-auto rounded-2xl border border-cream-300 bg-cream-50 p-3 shadow-card">
                  {sidebar}
                </div>
              </details>
              <SortSelect value={sort} />
            </div>
          </div>

          {(sp.on_sale || sp.featured || sp.q || sp.skin_type) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {sp.q && <span className="chip">جست‌وجو: {sp.q}</span>}
              {sp.on_sale && <span className="chip">فقط تخفیف‌دار</span>}
              {sp.featured && <span className="chip">پیشنهاد سنز</span>}
              {sp.skin_type && <span className="chip">نوع پوست: {sp.skin_type}</span>}
              <Link href="/products" className="chip border-rose-200 text-rose-600">
                حذف فیلترها
              </Link>
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream-400 bg-white p-14 text-center">
              <p className="text-sm font-bold text-brand-950">محصولی با این مشخصات پیدا نشد.</p>
              <p className="mt-2 text-xs text-ink/50">فیلترها را تغییر دهید یا همه محصولات را ببینید.</p>
              <Link href="/products" className="btn-primary btn-sm mt-5">
                مشاهده همه محصولات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              {page > 1 && (
                <Link
                  href={`${basePath}${toQueryString(baseParams, { page: String(page - 1) })}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 bg-white text-brand-900 hover:border-brand-700"
                  aria-label="صفحه قبل"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
              {Array.from({ length: pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1.5">
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-xs text-ink/40">…</span>}
                    <Link
                      href={`${basePath}${toQueryString(baseParams, { page: String(p) })}`}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                        p === page
                          ? 'bg-brand-800 text-cream-50'
                          : 'border border-cream-300 bg-white text-brand-900 hover:border-brand-700'
                      }`}
                    >
                      {toFa(p)}
                    </Link>
                  </span>
                ))}
              {page < pages && (
                <Link
                  href={`${basePath}${toQueryString(baseParams, { page: String(page + 1) })}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 bg-white text-brand-900 hover:border-brand-700"
                  aria-label="صفحه بعد"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
