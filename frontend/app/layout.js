import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';

export const dynamic = 'force-dynamic';

export const metadata = {
  metadataBase: new URL('https://senzskinshop.com'),
  title: {
    default: 'سنز اسکین شاپ | مراقبت تخصصی پوست',
    template: '%s | سنز اسکین شاپ',
  },
  description:
    'فروشگاه آنلاین سنز اسکین شاپ؛ سرم، کرم، ضدآفتاب، شوینده و ماسک صورت اصل با ضمانت اصالت، ارسال سریع به سراسر ایران و مشاوره تخصصی پوست.',
  keywords: [
    'سرم ویتامین سی',
    'ضدآفتاب',
    'کرم آبرسان',
    'مراقبت پوست',
    'سنز اسکین شاپ',
    'senz skin shop',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/logo-senz.png', type: 'image/png' },
    ],
    apple: '/images/logo-senz.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'سنز اسکین شاپ',
    title: 'سنز اسکین شاپ | مراقبت تخصصی پوست',
    description: 'محصولات اصل مراقبت از پوست با ضمانت اصالت و ارسال سریع.',
    images: ['/images/banners/hero-1.jpg'],
  },
};

export const viewport = {
  themeColor: '#fdf9f8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-cream-50 font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
