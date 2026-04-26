import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminPlansPage } from "@/app/(admin)/admin/plans/ClientAdminPlansPage";
import { checkAdminAuth } from "@/lib/admin";

export default async function AdminPlansPage() {
  if (!(await checkAdminAuth())) {
    redirect("/admin/login");
  }
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly", { ascending: true });

  return <ClientAdminPlansPage initialPlans={plans || []} />;
}
