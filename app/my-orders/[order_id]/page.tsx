import OrderDetails from "@/components/custom/OrderDetails";

async function Page({ params }: { params: { order_id: string } }) {
  const { order_id } = await params;
  return <OrderDetails order_id={order_id} />;
}

export default Page;
