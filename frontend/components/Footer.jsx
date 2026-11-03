import Link from 'next/link';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import { toFa } from '@/lib/format';
import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Telegram,
  Truck,
  Whatsapp,
  Headset,
  RefreshCw,
} from './Icons';

export default function Footer({ settings = {}, categories = [] }) {
  const year = toFa(new Date().getFullYear() - 621);
  const services = Array.isArray(settings.services) && settings.services.length
    ? settings.services
    : [
        { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران' },
        { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن محصولات' },
        { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول' },
        { title: '۷ روز بازگشت', desc: 'بازگشت کالا تا ۷ روز' },
      ];
  const icons = [Truck, ShieldCheck, Headset, RefreshCw];

  return (
    <footer className="mt-20 bg-brand-950 text-cream-100">
      <div className="container-page">
        <div className="grid gap-8 border-b border-cream-50/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={service.title} className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cream-50/10 text-gold-300">
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-bold text-cream-50">{service.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-cream-100/60">{service.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo settings={settings} light />
            <p className="mt-5 text-xs leading-6 text-cream-100/65">
              {settings.footer_text || settings.about_short || 'senzskinshop، مقصد خرید محصولات اصل و تخصصی مراقبت از پوست.'}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="اینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-50/10 transition hover:bg-gold-400 hover:text-brand-950"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="تلگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-50/10 transition hover:bg-gold-400 hover:text-brand-950"
                >
                  <Telegram className="h-4 w-4" />
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="واتس‌اپ"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-50/10 transition hover:bg-gold-400 hover:text-brand-950"
                >
                  <Whatsapp className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-cream-50">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-xs text-cream-100/65">
              {[
                ['/products', 'همه محصولات'],
                ['/products?on_sale=1', 'محصولات تخفیف‌دار'],
                ['/products?featured=1', 'پیشنهاد SENZ'],
                ['/blog', 'مجله پوست'],
                ['/about', 'درباره ما'],
                ['/contact', 'تماس با ما'],
                ['/track', 'پیگیری سفارش'],
                ['/account', 'حساب کاربری من'],
                ['/faq', 'سوالات متداول'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-gold-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-cream-50">دسته‌بندی‌ها</h3>
            <ul className="space-y-2.5 text-xs text-cream-100/65">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="transition hover:text-gold-300">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-cream-50">تماس با ما</h3>
            <ul className="space-y-3 text-xs text-cream-100/65">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span className="leading-6">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-300" />
                <a href={`tel:${settings.phone}`} dir="ltr" className="hover:text-gold-300">
                  {toFa(settings.phone || '')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-300" />
                <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-gold-300">
                  {settings.email}
                </a>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-sm font-extrabold text-cream-50">خبرنامه SENZ</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream-50/10 py-6 text-[11px] text-cream-100/45 sm:flex-row">
          <p>
            © {year} {settings.site_name || 'senzskinshop'} — تمامی حقوق محفوظ است.
          </p>
          <p className="flex items-center gap-3">
            <span>پرداخت امن</span>
            <span className="h-1 w-1 rounded-full bg-cream-100/30" />
            <span>ضمانت اصالت کالا</span>
            <span className="h-1 w-1 rounded-full bg-cream-100/30" />
            <span dir="ltr">senzskinshop.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
