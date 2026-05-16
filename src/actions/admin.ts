"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function updateStoreStatus(storeId: string, status: string) {
  if (!(await checkAdminAuth())) return { success: false, error: "Unauthorized" };

  const adminClient = await createAdminClient();
  const { error } = await adminClient.from("stores").update({ is_active: status === 'active' }).eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function deleteStore(storeId: string) {
  if (!(await checkAdminAuth())) return { success: false, error: "Unauthorized" };

  const adminClient = await createAdminClient();
  const { error } = await adminClient.from("stores").delete().eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function updateStorePlan(storeId: string, plan: string) {
  if (!(await checkAdminAuth())) return { success: false, error: "Unauthorized" };

  const adminClient = await createAdminClient();
  const { error } = await adminClient.from("stores").update({ subscription_plan: plan as any }).eq("id", storeId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/stores");
  return { success: true };
}

export async function updatePlanLimits(planId: string, updates: { price_monthly: number; order_limit: number; product_limit: number; category_limit: number; image_limit: number }) {
  if (!(await checkAdminAuth())) return { success: false, error: "Unauthorized" };

  const supabaseAdmin = await createAdminClient();
  const { error } = await supabaseAdmin.from("plans").update(updates).eq("id", planId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/plans");
  revalidatePath("/seller/settings");
  revalidatePath("/"); // Revalidate landing page pricing
  return { success: true };
}

export async function updateUserStatus(userId: string, isSuspended: boolean) {
  const supabase = await createClient();
  if (!(await checkAdminAuth())) return { success: false, error: "Unauthorized" };

  // Since is_suspended wasn't in schema, we will mock or implement if we add it.
  // Using Admin API to ban user:
  // Since we don't have SUPABASE_SERVICE_ROLE_KEY accessible here without createAdminClient, 
  // Let's just update the store's is_active flag for now as requested.
  const { error } = await supabase.from("stores").update({ is_active: !isSuspended }).eq("seller_id", userId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[Admin] ADMIN_PASSWORD env var is not set");
    return { success: false, error: "Server misconfiguration" };
  }

  // Use constant-time comparison to prevent timing attacks
  const inputBuf = Buffer.from(password);
  const storedBuf = Buffer.from(adminPassword);
  const isValid =
    inputBuf.length === storedBuf.length &&
    crypto.timingSafeEqual(inputBuf, storedBuf);

  if (!isValid) {
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
