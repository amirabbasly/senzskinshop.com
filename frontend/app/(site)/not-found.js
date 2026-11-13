import Link from 'next/link';
import { ArrowLeft, Leaf } from '@/components/Icons';

export default function SiteNotFound() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md rounded-[2rem] border border-cream-300 bg-white p-10 text-center shadow-soft">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Leaf className="h-7 w-7" />
        </span>
        <p className="mt-6 text-3xl font-black text-brand-900">۴۰۴</p>
        <h1 className="mt-2 text-lg font-extrabold text-brand-950">صفحه یا محصول مورد نظر پیدا نشد</h1>
        <p className="mt-2 text-xs leading-6 text-ink/55">
          ممکن است آدرس تغییر کرده باشد یا این محصول از فروشگاه حذف شده باشد.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn-primary btn-sm">
            صفحه اصلی
          </Link>
          <Link href="/products" className="btn-outline btn-sm">
            همه محصولات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
