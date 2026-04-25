import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminPlansPage } from "@/app/(admin)/admin/plans/ClientAdminPlansPage";

export default async function AdminPlansPage() {
  const supabase = await createClient();
  
  // Verify super admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_WHITELISTED_EMAIL) {
    redirect("/admin/login");
  }

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly", { ascending: true });

  return <ClientAdminPlansPage initialPlans={plans || []} />;
}
