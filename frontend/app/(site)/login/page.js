import Breadcrumbs from '@/components/Breadcrumbs';
import AuthView from '@/components/AuthView';

export const metadata = {
  title: 'ورود و ثبت‌نام',
  description: 'ورود به حساب کاربری یا ساخت حساب جدید در فروشگاه سنز اسکین شاپ.',
};

export default function LoginPage() {
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'ورود / ثبت‌نام' }]} />
      </div>
      <AuthView />
    </div>
  );
}
