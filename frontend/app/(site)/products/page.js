import Breadcrumbs from '@/components/Breadcrumbs';
import ProductListing from '@/components/ProductListing';

export const metadata = {
  title: 'فروشگاه محصولات مراقبت پوست',
  description: 'خرید سرم، کرم، ضدآفتاب، شوینده و ماسک صورت اصل با ضمانت اصالت و ارسال سریع.',
};

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const query = sp?.q ? ` نتایج جست‌وجو برای «${sp.q}»` : '';

  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'فروشگاه' }]} />
      </div>
      <ProductListing
        searchParams={sp || {}}
        title={sp?.on_sale ? 'محصولات تخفیف‌دار' : sp?.featured ? 'پیشنهاد senzskinshop' : `همه محصولات${query}`}
        subtitle={
          sp?.on_sale
            ? 'بهترین فرصت‌های خرید محصولات مراقبت پوست با تخفیف‌های ویژه senzskinshop.'
            : 'محصولات تخصصی مراقبت از پوست، مو و بدن؛ انتخاب‌شده توسط کارشناسان پوست.'
        }
      />
    </div>
  );
}
