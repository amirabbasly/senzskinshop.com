import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleContent from '@/components/ArticleContent';
import { getPost } from '@/lib/api';
import { formatDate, readingTime } from '@/lib/format';
import { ArrowLeft, Clock, Share2 } from '@/components/Icons';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return { title: 'مقاله یافت نشد' };
  return {
    title: data.post.title,
    description: data.post.excerpt,
    openGraph: { title: data.post.title, description: data.post.excerpt, images: [data.post.cover] },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();
  const { post, related = [] } = data;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'مجله پوست', href: '/blog' }, { label: post.title }]} />

      <article className="mx-auto max-w-4xl">
        <header className="overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white">
          <div className="aspect-[16/7] overflow-hidden bg-cream-100">
            <img src={post.cover || '/images/blog/routine.jpg'} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink/45">
              <span className="font-bold text-gold-600">مجله پوست SENZ</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime(post.content)} دقیقه مطالعه
              </span>
              <span>{formatDate(post.created_at)}</span>
              <span>نویسنده: {post.author}</span>
            </div>
            <h1 className="mt-3 text-xl font-black leading-9 text-brand-950 sm:text-2xl">{post.title}</h1>
            <p className="mt-3 text-xs leading-7 text-ink/60">{post.excerpt}</p>
          </div>
        </header>

        <div className="mt-6 rounded-[2rem] border border-cream-300/80 bg-white p-6 sm:p-9">
          <ArticleContent content={post.content} />
          <div className="mt-8 flex items-center justify-between border-t border-cream-200 pt-5 text-[11px] text-ink/50">
            <span className="flex items-center gap-1.5">
              <Share2 className="h-4 w-4" />
              این مقاله را با دوستانتان به اشتراک بگذارید
            </span>
            <Link href="/blog" className="font-bold text-brand-700">
              بازگشت به مجله
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-10 max-w-4xl">
          <h2 className="mb-4 text-sm font-extrabold text-brand-950">مقالات مرتبط</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-cream-300/80 bg-white p-3 transition hover:border-brand-300"
              >
                <img src={item.cover} alt={item.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div>
                  <p className="line-clamp-2 text-[11px] font-bold leading-5 text-brand-950">{item.title}</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-brand-700">
                    مطالعه
                    <ArrowLeft className="h-3 w-3" />
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
