import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminStoresPage } from "./ClientAdminStoresPage";
import { checkAdminAuth } from "@/lib/admin";

export default async function AdminStoresPage() {
  if (!(await checkAdminAuth())) {
    redirect("/admin/login");
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

  const revenueByStore = (orders || []).reduce((acc: any, order) => {
    acc[order.store_id] = (acc[order.store_id] || 0) + Number(order.total_amount);
    return acc;
  }, {});

  const storesWithRevenue = (stores || []).map(store => ({
    ...store,
    totalRevenue: revenueByStore[store.id] || 0
  }));

  return <ClientAdminStoresPage initialStores={storesWithRevenue} />;
}
