import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientNewProductPage } from "./ClientNewProductPage";

export default async function SellerProductNewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("seller_id", user.id)
    .single();

  if (!store) {
    redirect("/seller/onboarding");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("store_id", store.id)
    .order("name");

  return <ClientNewProductPage categories={categories || []} />;
}
