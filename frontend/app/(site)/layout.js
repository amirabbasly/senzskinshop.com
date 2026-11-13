import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import SupportFab from '@/components/SupportFab';
import { CustomerProvider } from '@/components/CustomerProvider';
import { getCategories, getSettings } from '@/lib/api';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export default async function SiteLayout({ children }) {
  const [settingsData, categoriesData] = await Promise.all([getSettings(), getCategories()]);
  const settings = { ...DEFAULT_SETTINGS, ...(settingsData || {}) };
  const categories = categoriesData || [];

  return (
    <CustomerProvider>
      <div className="flex min-h-screen flex-col">
        <Header settings={settings} categories={categories} />
        <main className="flex-1 pb-[62px] lg:pb-0">{children}</main>
        <Footer settings={settings} categories={categories} />
        <BottomNav />
        <SupportFab />
      </div>
    </CustomerProvider>
  );
}
