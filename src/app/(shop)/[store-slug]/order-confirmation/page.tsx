import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ClientOrderConfirmationPage } from "./ClientOrderConfirmationPage";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ "store-slug": string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { "store-slug": storeSlug } = await params;
  const { orderId } = await searchParams;
  const supabase = await createClient();

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();

  if (!store) {
    notFound();
  }

  // Fetch order if orderId is present
  let order = null;
  if (orderId) {
    const { data } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("id", orderId)
      .eq("store_id", store.id)
      .single();
    order = data;
  }

  return <ClientOrderConfirmationPage store={store} order={order} />;
}
