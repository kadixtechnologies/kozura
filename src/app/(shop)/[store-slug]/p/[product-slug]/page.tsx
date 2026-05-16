import { createAnonClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ClientProductPage } from "./ClientProductPage";

export async function generateMetadata({ params }: { params: Promise<{ "product-slug": string }> }): Promise<Metadata> {
  const { "product-slug": productSlug } = await params;
  const supabase = createAnonClient();
  const { data: product } = await supabase.from("products").select("name, description").eq("slug", productSlug).single();
  
  if (!product) return {};
  
  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Buy ${product.name} on Kozura`,
  };
}

export const revalidate = 3600;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ "store-slug": string; "product-slug": string }>;
}) {
  const { "store-slug": storeSlug, "product-slug": productSlug } = await params;
  const supabase = createAnonClient();

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
    .eq("is_published", true)
    .gt("stock_quantity", 0)
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
    .eq("is_published", true)
    .gt("stock_quantity", 0)
    .limit(4);

  return (
    <ClientProductPage 
      store={store} 
      product={product} 
      similarProducts={similarProducts || []} 
    />
  );
}
