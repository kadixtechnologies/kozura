import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientOrders } from "./ClientOrders";
import { cleanupOldOrders } from "@/actions/seller/orders";

export default async function SellerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/seller/login");
  }

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("seller_id", user.id)
    .single();

  if (!store) {
    redirect("/seller/onboarding");
  }
  
  // Clean up old delivered orders (7 days+)
  await cleanupOldOrders(store.id);

  // Fetch all orders for this store
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (id)
    `)
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <ClientOrders orders={orders || []} />
  );
}
