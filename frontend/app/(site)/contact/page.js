import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSettings } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { toFa } from '@/lib/format';
import { Clock, Instagram, Mail, MapPin, Phone, Telegram, Whatsapp } from '@/components/Icons';

export const metadata = {
  title: 'تماس با ما',
  description: 'راه‌های ارتباط با پشتیبانی senzskinshop؛ تلفن، واتس‌اپ، ایمیل و آدرس دفتر.',
};

export default async function ContactPage() {
  const settings = { ...DEFAULT_SETTINGS, ...((await getSettings()) || {}) };

  const items = [
    { icon: Phone, title: 'تلفن فروشگاه', value: toFa(settings.phone || ''), href: `tel:${settings.phone}` },
    { icon: Phone, title: 'موبایل و واتس‌اپ', value: toFa(settings.mobile || ''), href: `tel:${settings.mobile}` },
    { icon: Mail, title: 'ایمیل', value: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, title: 'ساعات پاسخ‌گویی', value: settings.working_hours },
  ];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: 'تماس با ما' }]} />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[2rem] border border-cream-300/80 bg-white p-7 sm:p-9">
          <h1 className="text-xl font-black text-brand-950 sm:text-2xl">تماس با senzskinshop</h1>
          <p className="mt-3 text-xs leading-7 text-ink/60">
            برای مشاوره انتخاب محصول، پیگیری سفارش یا هر سوالی درباره مراقبت از پوست، از راه‌های زیر با ما در
            ارتباط باشید. تیم پشتیبانی در ساعات کاری پاسخگوی شماست.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-cream-200 bg-cream-50/60 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-700">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[10px] text-ink/45">{item.title}</p>
                {item.href ? (
                  <a href={item.href} className="mt-1 block text-xs font-bold text-brand-950 hover:text-brand-600" dir="ltr">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-xs font-bold text-brand-950">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-primary btn-sm">
                <Whatsapp className="h-4 w-4" />
                گفت‌وگو در واتس‌اپ
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
                <Instagram className="h-4 w-4" />
                اینستاگرام
              </a>
            )}
            {settings.telegram && (
              <a href={settings.telegram} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
                <Telegram className="h-4 w-4" />
                تلگرام
              </a>
            )}
          </div>

          <div className="mt-7 rounded-2xl bg-brand-950 p-5 text-cream-50">
            <h2 className="flex items-center gap-2 text-sm font-extrabold">
              <MapPin className="h-4 w-4 text-gold-300" />
              آدرس دفتر مرکزی
            </h2>
            <p className="mt-2 text-[11.5px] leading-7 text-cream-100/70">{settings.address}</p>
            {settings.postal_code && (
              <p className="mt-1 text-[11px] text-cream-100/50">کد پستی: {toFa(settings.postal_code)}</p>
            )}
            {settings.map_link && (
              <a
                href={settings.map_link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-gold-300"
              >
                مشاهده روی نقشه
              </a>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white">
            <img src="/images/about/team.jpg" alt="senzskinshop" className="h-44 w-full object-cover" />
            <div className="p-5">
              <h2 className="text-sm font-extrabold text-brand-950">مشاوره رایگان روتین پوستی</h2>
              <p className="mt-2 text-[11px] leading-6 text-ink/55">
                عکس پوست یا شرح مشکل خود را در واتس‌اپ ارسال کنید؛ کارشناس ما روتین پیشنهادی را برایتان می‌نویسد.
              </p>
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-gold btn-sm mt-4 w-full">
                  دریافت مشاوره
                </a>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-cream-200 p-5">
            <h2 className="text-sm font-extrabold text-brand-950">پاسخ سریع‌تر می‌خواهید؟</h2>
            <p className="mt-2 text-[11px] leading-6 text-ink/60">
              صفحه سوالات متداول پاسخ بسیاری از پرسش‌های شما درباره ارسال، پرداخت و بازگشت کالا را دارد.
            </p>
            <Link href="/faq" className="btn-outline btn-sm mt-4 w-full">
              سوالات متداول
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
