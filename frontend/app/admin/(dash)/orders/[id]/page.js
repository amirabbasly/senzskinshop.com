import OrderDetail from '@/components/admin/OrderDetail';

export default async function AdminOrderPage({ params }) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
