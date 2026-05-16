import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ClientCheckoutPage } from "./ClientCheckoutPage";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ "store-slug": string }>;
}) {
  const { "store-slug": storeSlug } = await params;
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

  return <ClientCheckoutPage store={store} />;
}
