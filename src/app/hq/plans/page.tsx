import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientAdminPlansPage } from "./ClientAdminPlansPage";
import { checkAdminAuth } from "@/lib/auth/admin";

export default async function AdminPlansPage() {
  if (!(await checkAdminAuth())) {
    redirect("/hq/login");
  }
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_monthly", { ascending: true });

  return <ClientAdminPlansPage initialPlans={plans || []} />;
}
