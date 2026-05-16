import { createAnonClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StorefrontClient } from "./ClientPage";

export const revalidate = 3600;

export default async function StorefrontPage({ params }: { params: Promise<{ "store-slug": string }> }) {
  const { "store-slug": slug } = await params;
  const supabase = createAnonClient();

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!store) {
    notFound();
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", store.id);

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_published", true)
    .gt("stock_quantity", 0);

  return (
    <StorefrontClient 
      store={store} 
      categories={categories || []} 
      products={products || []} 
    />
  );
}
