import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ClientCartPage } from "./ClientCartPage";

export default async function CartPage({
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

  return <ClientCartPage store={store} />;
}
