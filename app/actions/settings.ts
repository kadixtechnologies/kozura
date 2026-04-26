"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  const tab = formData.get("tab") as string;
  const updates: any = {};

  if (tab === "general") {
    updates.name = formData.get("name") as string;
    updates.whatsapp_number = formData.get("whatsapp_number") as string;
    updates.tagline = formData.get("tagline") as string;
    updates.description = formData.get("description") as string;
    updates.currency = "NGN"; // fixed
  } else if (tab === "appearance") {
    const logoUrl = formData.get("logo_url") as string;
    const bannerUrl = formData.get("banner_url") as string;
    if (logoUrl) updates.logo_url = logoUrl;
    if (bannerUrl) updates.banner_url = bannerUrl;
    updates.primary_color = formData.get("primary_color") as string;
  } else if (tab === "shipping") {
    updates.shipping_config = JSON.parse(formData.get("shipping_config") as string || "{}");
  } else if (tab === "payments") {
    updates.accepts_cod = formData.get("accepts_cod") === "true";
    updates.accepts_bank_transfer = formData.get("accepts_bank_transfer") === "true";
    updates.bank_name = formData.get("bank_name") as string;
    updates.account_name = formData.get("account_name") as string;
    updates.account_number = formData.get("account_number") as string;
  } else if (tab === "seo") {
    updates.seo_meta_title = formData.get("seo_meta_title") as string;
    updates.seo_meta_description = formData.get("seo_meta_description") as string;
  } else if (tab === "status") {
    updates.is_active = formData.get("is_active") === "true";
  }

  const { error } = await supabase.from("stores").update(updates).eq("id", store.id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/settings");
  return { success: true };
}

export async function checkSlugAvailability(slug: string, currentStoreId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", slug)
    .neq("id", currentStoreId)
    .maybeSingle();
  return { available: !data };
}

export async function saveSlug(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Slug can only contain lowercase letters, numbers, and hyphens." };
  }

  // Check conflict
  const { data: conflict } = await supabase
    .from("stores").select("id").eq("slug", slug).neq("id", store.id).maybeSingle();
  if (conflict) return { success: false, error: "This URL is already taken by another store." };

  const { error } = await supabase.from("stores").update({ slug }).eq("id", store.id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/settings");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  try {
    const supabaseAdmin = await createAdminClient();
    
    // First delete store related data (cascade should handle most, but we target the store explicitly)
    await supabaseAdmin.from("stores").delete().eq("seller_id", user.id);
    
    // Delete profile
    await supabaseAdmin.from("profiles").delete().eq("id", user.id);
    
    // Finally delete the user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return { success: true };
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return { success: false, error: err.message || "Failed to delete account" };
  }
}
