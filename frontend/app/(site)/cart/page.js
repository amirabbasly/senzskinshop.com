import Breadcrumbs from '@/components/Breadcrumbs';
import CartView from '@/components/CartView';

export const metadata = { title: 'سبد خرید' };

export default function CartPage() {
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'سبد خرید' }]} />
      </div>
      <CartView />
    </div>
  );
}
