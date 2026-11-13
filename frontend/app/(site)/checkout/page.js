import Breadcrumbs from '@/components/Breadcrumbs';
import CheckoutView from '@/components/CheckoutView';

export const metadata = { title: 'تسویه حساب' };

export default function CheckoutPage() {
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'سبد خرید', href: '/cart' }, { label: 'تسویه حساب' }]} />
      </div>
      <CheckoutView />
    </div>
  );
}
