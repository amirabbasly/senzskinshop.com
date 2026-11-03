import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ServiceStrip from '@/components/ServiceStrip';
import { getSettings } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { toFa } from '@/lib/format';
import { ArrowLeft, Droplet, Leaf, ShieldCheck, Sparkles } from '@/components/Icons';

export const metadata = {
  title: 'درباره senzskinshop',
  description: 'داستان senzskinshop، رویکرد علمی به مراقبت پوست و تعهد ما به اصالت محصولات.',
};

export default async function AboutPage() {
  const settings = { ...DEFAULT_SETTINGS, ...((await getSettings()) || {}) };

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'درباره ما' }]} />

      <section className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white p-6 sm:p-9 lg:grid-cols-2">
        <div>
          <span className="chip border-gold-200 bg-gold-50 text-gold-700">
            <Sparkles className="h-3.5 w-3.5" />
            از سال ۱۳۹۶ در کنار پوست شما
          </span>
          <h1 className="mt-4 text-2xl font-black leading-10 text-brand-950 sm:text-3xl">
            مراقبت از پوست، با نگاه علمی و انتخاب دقیق
          </h1>
          <p className="mt-4 text-[13px] leading-7 text-ink/65">
            {settings.about_text || settings.about_short}
          </p>
          <p className="mt-3 text-[13px] leading-7 text-ink/65">
            ما محصولات را بر اساس ترکیبات مؤثره، فرمولاسیون و بازخورد واقعی مشتریان انتخاب می‌کنیم؛ نه بر اساس
            تبلیغات. هر محصول قبل از ورود به انبار SENZ از نظر اصالت و شرایط نگهداری بررسی می‌شود.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              مشاهده محصولات
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-outline">
              تماس با ما
            </Link>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden rounded-[1.5rem] bg-cream-100 lg:h-[380px]">
          <img src="/images/about/team.jpg" alt="تیم senzskinshop" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="mt-6">
        <ServiceStrip services={settings.services || []} />
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Leaf,
            title: 'انتخاب علمی',
            text: 'همه محصولات توسط کارشناسان پوست بررسی و بر اساس شواهد و ترکیبات مؤثره انتخاب می‌شوند.',
          },
          {
            icon: ShieldCheck,
            title: 'ضمانت اصالت',
            text: 'محصولات از توزیع‌کننده رسمی یا نمایندگی معتبر تأمین می‌شود؛ در صورت مغایرت، بازگشت وجه.',
          },
          {
            icon: Droplet,
            title: 'مشاوره تخصصی',
            text: 'قبل از خرید می‌توانید روتین پوستی خود را با کارشناسان ما رایگان بررسی کنید.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-cream-300/80 bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <item.icon />
            </span>
            <h2 className="mt-4 text-sm font-extrabold text-brand-950">{item.title}</h2>
            <p className="mt-2 text-[11.5px] leading-6 text-ink/55">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-4 rounded-[2rem] bg-brand-100 p-7 text-brand-950 sm:grid-cols-3 sm:p-9">
        {[
          { value: toFa('+۱۲٬۰۰۰'), label: 'سفارش موفق' },
          { value: toFa('+۱۵۰'), label: 'محصول تخصصی' },
          { value: toFa('۹۶٪'), label: 'رضایت مشتریان' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-black text-brand-700">{stat.value}</p>
            <p className="mt-1 text-[11px] text-ink/55">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
