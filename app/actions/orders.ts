"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string, message?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId).eq("store_id", store.id);
  if (error) return { success: false, error: error.message };

  // Also would insert into order_timeline if we had one
  revalidatePath(`/seller/orders/${orderId}`);
  return { success: true };
}
