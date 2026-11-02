import Breadcrumbs from '@/components/Breadcrumbs';
import AccountView from '@/components/AccountView';

export const metadata = {
  title: 'حساب کاربری',
  description: 'سفارش‌ها، اطلاعات حساب و تنظیمات امنیتی شما در سنز اسکین شاپ.',
};

export default function AccountPage() {
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'حساب کاربری' }]} />
      </div>
      <AccountView />
    </div>
  );
}
