import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ClientTrackingPage } from "./ClientTrackingPage";

export default async function TrackOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ "store-slug": string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { "store-slug": storeSlug } = await params;
  const { order: orderNumber } = await searchParams;

  const supabase = await createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();

  if (!store) notFound();

  let order = null;
  if (orderNumber) {
    const { data } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("order_number", orderNumber.toUpperCase())
      .eq("store_id", store.id)
      .single();
    order = data;
  }

  return <ClientTrackingPage store={store} order={order} searchedOrderNumber={orderNumber} />;
}
