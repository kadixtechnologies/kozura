import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientSettingsPage } from "./ClientSettingsPage";

export default async function SellerSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("seller_id", user.id)
    .single();

  if (!store) redirect("/seller/onboarding");

  // Fetch plans
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly", { ascending: true });

  // Count orders this month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const { count: ordersThisMonth } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("store_id", store.id)
    .gte("created_at", startOfMonth);

  return <ClientSettingsPage store={store} ordersThisMonth={ordersThisMonth || 0} plans={plans || []} />;
}
