"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function isSuperAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_WHITELISTED_EMAIL) return false;
  return true;
}

export async function updateStoreStatus(storeId: string, status: string) {
  const supabase = await createClient();
  if (!(await isSuperAdmin(supabase))) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("stores").update({ is_active: status === 'active' }).eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function deleteStore(storeId: string) {
  const supabase = await createClient();
  if (!(await isSuperAdmin(supabase))) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("stores").delete().eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function updateStorePlan(storeId: string, plan: string) {
  const supabase = await createClient();
  if (!(await isSuperAdmin(supabase))) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("stores").update({ subscription_plan: plan as any }).eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function updateUserStatus(userId: string, isSuspended: boolean) {
  const supabase = await createClient();
  if (!(await isSuperAdmin(supabase))) return { success: false, error: "Unauthorized" };

  // Since is_suspended wasn't in schema, we will mock or implement if we add it.
  // Using Admin API to ban user:
  // Since we don't have SUPABASE_SERVICE_ROLE_KEY accessible here without createAdminClient, 
  // Let's just update the store's is_active flag for now as requested.
  const { error } = await supabase.from("stores").update({ is_active: !isSuspended }).eq("seller_id", userId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

import { cookies } from "next/headers";

export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || password !== adminPassword) {
    return { success: false, error: "Incorrect password" };
  }

  const now = Date.now();
  const sessionData = JSON.stringify({
    expiresAt: now + 5 * 60 * 60 * 1000, // 5 hours absolute
    lastActive: now // Initial activity
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionData, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 60 // 5 hours
  });

  return { success: true };
}
