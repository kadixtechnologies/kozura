import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientDashboard } from "./ClientDashboard";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/seller/login");
  }

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("seller_id", user.id)
    .single();

  if (!store) {
    redirect("/seller/onboarding");
  }

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Calculate stats (simplified)
  // In a production app, you might want a specialized RPC function for dashboard stats
  const { data: allOrders } = await supabase
    .from("orders")
    .select("total_amount, status")
    .eq("store_id", store.id);

  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .eq("store_id", store.id);

  let totalSales = 0;
  let totalOrders = 0;
  let pendingOrders = 0;

  if (allOrders) {
    totalOrders = allOrders.length;
    allOrders.forEach(o => {
      totalSales += parseFloat(o.total_amount) || 0;
      if (o.status === 'pending') pendingOrders++;
    });
  }

  const stats = {
    totalSales,
    totalOrders,
    pendingOrders,
    productsCount: productsCount || 0
  };

  return (
    <ClientDashboard 
      store={store} 
      stats={stats} 
      recentOrders={recentOrders || []} 
    />
  );
}
