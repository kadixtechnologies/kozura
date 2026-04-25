import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientCategories } from "./ClientCategories";

export default async function SellerCategoriesPage() {
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

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", store.id)
    .order("name");

  // Fetch product counts for each category
  const { data: products } = await supabase
    .from("products")
    .select("category_id")
    .eq("store_id", store.id);

  const productCounts = (products || []).reduce((acc: Record<string, number>, p) => {
    if (p.category_id) {
      acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    }
    return acc;
  }, {});

  const categoriesWithCounts = (categories || []).map(c => ({
    ...c,
    count: productCounts[c.id] || 0
  }));

  return (
    <ClientCategories initialCategories={categoriesWithCounts} />
  );
}
