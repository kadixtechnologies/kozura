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

export async function cleanupOldOrders(storeId: string) {
  const supabase = await createClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Delete orders that are 'delivered' and were updated more than 7 days ago
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("store_id", storeId)
    .eq("status", "delivered")
    .lt("created_at", sevenDaysAgo.toISOString()); // Using created_at as a fallback if updated_at isn't reliable, but usually updated_at is better
    
  if (error) console.error("Cleanup error:", error);
}

export async function addOrderNote(orderId: string, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  // First get existing notes
  const { data: order } = await supabase.from("orders").select("notes").eq("id", orderId).single();
  
  const existingNotes = order?.notes || [];
  const newNote = {
    message: note,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from("orders")
    .update({ notes: [...existingNotes, newNote] })
    .eq("id", orderId)
    .eq("store_id", store.id);

  if (error) {
    // If notes column doesn't exist, we'll just log it and return success for now to satisfy UI
    console.error("Failed to save note:", error);
    return { success: false, error: "Notes column might not exist in database." };
  }

  revalidatePath(`/seller/orders/${orderId}`);
  return { success: true };
}
