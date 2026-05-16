import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientProducts } from "./ClientProducts";

export default async function SellerProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/seller/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("seller_id", user.id)
    .single();

  if (!store) {
    redirect("/seller/onboarding");
  }

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", store.id);

  return (
    <ClientProducts 
      initialProducts={products || []} 
      categories={categories || []} 
    />
  );
}
