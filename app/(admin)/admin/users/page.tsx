import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminUsersPage } from "./ClientAdminUsersPage";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_WHITELISTED_EMAIL) {
    redirect("/admin/login");
  }

  // Fetch all seller profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  // Fetch all stores to match sellers with stores
  const { data: stores } = await supabase
    .from("stores")
    .select("seller_id, name, contact_phone, whatsapp_number, is_active");

  const formattedUsers = (profiles || []).map(p => {
    // Find store for this user
    const store = (stores || []).find(s => s.seller_id === p.id);
    
    return {
      id: p.id,
      name: p.full_name || "Unknown Seller",
      email: p.email,
      phone: store?.whatsapp_number || store?.contact_phone || "No phone",
      store: store?.name || "No store",
      joined: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      active: store ? store.is_active : true
    };
  });

  return <ClientAdminUsersPage initialUsers={formattedUsers} />;
}
