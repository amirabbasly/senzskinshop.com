import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductListing from '@/components/ProductListing';
import { getCategories } from '@/lib/api';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = (await getCategories()) || [];
  const flat = categories.flatMap((c) => [c, ...(c.children || [])]);
  const category = flat.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} | خرید آنلاین` : 'دسته‌بندی محصولات',
    description: category?.description || 'محصولات تخصصی مراقبت از پوست در senzskinshop',
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const categories = (await getCategories()) || [];
  const parents = categories.filter((c) => !c.parent_id);
  const flat = categories.flatMap((c) => [c, ...(c.children || [])]);
  const category = flat.find((c) => c.slug === slug);
  if (!category) notFound();

  const parent = parents.find((p) => p.id === category.parent_id);
  const breadcrumbs = parent
    ? [{ label: parent.name, href: `/category/${parent.slug}` }, { label: category.name }]
    : [{ label: category.name }];

  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <ProductListing
        searchParams={sp || {}}
        categorySlug={slug}
        basePath={`/category/${slug}`}
        title={category.name}
        subtitle={category.description || 'محصولات تخصصی مراقبت از پوست با ضمانت اصالت.'}
      />
    </div>
  );
}
