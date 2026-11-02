import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import SectionHeading from '@/components/SectionHeading';
import { getPosts } from '@/lib/api';
import { formatDate, readingTime } from '@/lib/format';
import { ArrowLeft } from '@/components/Icons';

export const metadata = {
  title: 'مجله پوست',
  description: 'مقالات آموزشی درباره روتین پوستی، سرم‌ها، ضدآفتاب و مراقبت تخصصی از پوست.',
};

export default async function BlogPage() {
  const posts = (await getPosts()) || [];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'مجله پوست' }]} />
      <SectionHeading
        title="مجله پوست سنز"
        subtitle="آموزش، راهنما و نکات تخصصی مراقبت از پوست از تیم کارشناسان سنز اسکین"
      />

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cream-400 bg-white p-14 text-center text-xs text-ink/50">
          هنوز مقاله‌ای منتشر نشده است.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                <div className="flex items-center gap-2 text-[10px] text-ink/45">
                  <span className="font-bold text-gold-600">{formatDate(post.created_at)}</span>
                  <span className="h-1 w-1 rounded-full bg-ink/20" />
                  <span>{post.author}</span>
                </div>
                <h2 className="mt-2 line-clamp-2 text-sm font-extrabold leading-6 text-brand-950">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-[11px] leading-6 text-ink/55">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] text-ink/40">
                  {readingTime(post.excerpt)} دقیقه مطالعه
                </span>
                <span className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                  ادامه مطلب
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
