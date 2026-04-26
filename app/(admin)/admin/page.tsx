import { Activity, Store, Users, DollarSign } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/shop/StatCard";
import { createClient } from "@/lib/supabase/server";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { checkAdminAuth } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  if (!(await checkAdminAuth())) {
    redirect("/admin/login");
  }
  const supabase = await createClient();
  
  // Get GMV (Sum of non-cancelled/returned orders)
  const { data: orders } = await supabase.from('orders').select('created_at, total_amount, status').order('created_at', { ascending: false });
  const gmv = orders?.filter(o => ['pending', 'processing', 'shipped', 'delivered'].includes(o.status)).reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
  const lostSales = orders?.filter(o => ['cancelled', 'returned'].includes(o.status)).reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
  
  // Format GMV nicely
  const formattedGMV = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(gmv);
  const formattedLostSales = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(lostSales);

  // Get Active Stores
  const { count: activeStoresCount } = await supabase.from('stores').select('*', { count: 'exact', head: true }).eq('is_active', true);
  
  // Get Total Users
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  return (
    <AdminLayout>
      <AdminTopBar title="Platform Overview" subtitle="Global metrics for ShopLink" />
      <div className="p-7 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total GMV" value={formattedGMV} icon={DollarSign} accent="primary" />
          <StatCard label="Lost Sales" value={formattedLostSales} icon={DollarSign} accent="destructive" />
          <StatCard label="Active Stores" value={(activeStoresCount || 0).toString()} icon={Store} accent="warning" />
          <StatCard label="Total Users" value={(usersCount || 0).toString()} icon={Users} accent="success" />
          <StatCard label="System Status" value="Healthy" icon={Activity} accent="muted" />
        </div>
        
        <AdminCharts orders={orders || []} />
      </div>
    </AdminLayout>
  );
}
