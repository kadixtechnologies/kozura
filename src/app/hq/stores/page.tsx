import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminStoresPage } from "./ClientAdminStoresPage";
import { checkAdminAuth } from "@/lib/auth/admin";

export default async function AdminStoresPage() {
  if (!(await checkAdminAuth())) {
    redirect("/hq/login");
  }
  const supabase = await createClient();

  // Fetch all stores with their owner profiles
  const { data: stores } = await supabase
    .from("stores")
    .select("*, seller:profiles!seller_id(full_name, email)")
    .order("created_at", { ascending: false });

  // Fetch all completed orders to calculate revenue per store
  const { data: orders } = await supabase
    .from("orders")
    .select("store_id, total_amount")
    .neq("status", "cancelled");

  // Fetch plans from DB so the Change Plan dialog shows real data
  const { data: plans } = await supabase
    .from("plans")
    .select("id, name, price_monthly, order_limit")
    .order("price_monthly", { ascending: true });

  const revenueByStore = (orders || []).reduce((acc: any, order) => {
    acc[order.store_id] = (acc[order.store_id] || 0) + Number(order.total_amount);
    return acc;
  }, {});

  const storesWithRevenue = (stores || []).map(store => ({
    ...store,
    totalRevenue: revenueByStore[store.id] || 0
  }));

  return <ClientAdminStoresPage initialStores={storesWithRevenue} plans={plans || []} />;
}
