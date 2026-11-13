import Link from 'next/link';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import { toFa } from '@/lib/format';
import { Mail, MapPin, Phone } from './Icons';
import { serviceImage } from '@/lib/service-media';

const SOCIAL_IMAGES = {
  instagram: '/images/icons/social-instagram.png',
  telegram: '/images/icons/social-telegram.png',
  whatsapp: '/images/icons/social-whatsapp.png',
};

export default function Footer({ settings = {}, categories = [] }) {
  const year = toFa(new Date().getFullYear() - 621);
  const services = Array.isArray(settings.services) && settings.services.length
    ? settings.services
    : [
        { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
        { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
        { title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق درگاه بانکی معتبر' },
        { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
      ];

  return (
    <footer className="mt-20 border-t border-brand-200 bg-brand-100 text-ink">
      <div className="container-page">
        <div className="grid gap-8 border-b border-brand-200/70 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service, index) => {
            return (
              <div key={service.title} className="flex items-start gap-3">
                <img
                  src={serviceImage(index)}
                  alt={service.title}
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-xl object-contain"
                />
                <div>
                  <p className="text-sm font-bold text-brand-950">{service.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-ink/55">{service.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo settings={settings} />
            <p className="mt-5 text-xs leading-6 text-ink/60">
              {settings.footer_text || settings.about_short || 'senzskinshop، مقصد خرید محصولات اصل و تخصصی مراقبت از پوست.'}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="اینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(214,120,160,.18)] transition hover:bg-brand-100"
                >
                  <img src={SOCIAL_IMAGES.instagram} alt="اینستاگرام" className="h-5 w-5 rounded-[6px] object-contain" />
                </a>
              )}
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="تلگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(214,120,160,.18)] transition hover:bg-brand-100"
                >
                  <img src={SOCIAL_IMAGES.telegram} alt="تلگرام" className="h-5 w-5 rounded-[6px] object-contain" />
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="واتس‌اپ"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(214,120,160,.18)] transition hover:bg-brand-100"
                >
                  <img src={SOCIAL_IMAGES.whatsapp} alt="واتس‌اپ" className="h-5 w-5 rounded-[6px] object-contain" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-brand-950">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-xs text-ink/60">
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
                  <Link href={href} className="transition hover:text-brand-700">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-brand-950">دسته‌بندی‌ها</h3>
            <ul className="space-y-2.5 text-xs text-ink/60">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="transition hover:text-brand-700">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-extrabold text-brand-950">تماس با ما</h3>
            <ul className="space-y-3 text-xs text-ink/60">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <span className="leading-6">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-700" />
                <a href={`tel:${settings.phone}`} dir="ltr" className="hover:text-brand-700">
                  {toFa(settings.phone || '')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-700" />
                <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-brand-700">
                  {settings.email}
                </a>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-sm font-extrabold text-brand-950">خبرنامه SENZ</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-brand-200/70 py-6 text-[11px] text-ink/45 sm:flex-row">
          <p>
            © {year} {settings.site_name || 'senzskinshop'} — تمامی حقوق محفوظ است.
          </p>
          <p className="flex items-center gap-3">
            <span>پرداخت امن</span>
            <span className="h-1 w-1 rounded-full bg-brand-300" />
            <span>ضمانت اصالت کالا</span>
            <span className="h-1 w-1 rounded-full bg-brand-300" />
            <span dir="ltr">senzskinshop.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
