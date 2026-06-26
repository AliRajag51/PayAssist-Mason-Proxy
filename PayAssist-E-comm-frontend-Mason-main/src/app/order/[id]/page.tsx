import type { Metadata } from "next";
import OrderDetail from "@components/homebase/order-detail";
import { fetchOrderById } from "@components/homebase/catalog-source";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await fetchOrderById(id);
  return { title: order ? `Order #MS-${order.invoice ?? id.slice(-4).toUpperCase()}` : "Order" };
}

export default async function Order({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetchOrderById(id);
  return <OrderDetail order={order} />;
}
