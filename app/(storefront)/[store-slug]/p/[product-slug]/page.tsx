import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ClientProductPage } from "./ClientProductPage";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ "store-slug": string; "product-slug": string }>;
}) {
  const { "store-slug": storeSlug, "product-slug": productSlug } = await params;
  const supabase = await createClient();

  // Fetch store
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", storeSlug)
    .single();

  if (!store) {
    notFound();
  }

  // Fetch product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("slug", productSlug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch similar products
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .neq("id", product.id)
    .limit(4);

  return (
    <ClientProductPage 
      store={store} 
      product={product} 
      similarProducts={similarProducts || []} 
    />
  );
}
