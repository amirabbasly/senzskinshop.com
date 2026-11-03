import Breadcrumbs from '@/components/Breadcrumbs';
import TrackForm from '@/components/TrackForm';

export const metadata = { title: 'پیگیری سفارش' };

export default function TrackPage() {
  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'پیگیری سفارش' }]} />
      </div>
      <div className="container-page py-10">
        <TrackForm />
      </div>
    </div>
  );
}
