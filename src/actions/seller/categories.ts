"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string | null;
  const imageUrl = formData.get("imageUrl") as string | null;
  
  if (!name) return { success: false, error: "Name is required" };

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const categoryData = {
    store_id: store.id,
    name,
    slug,
    icon,
    image_url: imageUrl
  };

  let res;
  if (id) {
    res = await supabase.from("categories").update(categoryData).eq("id", id).eq("store_id", store.id).select().single();
  } else {
    // Check plan limits before inserting a new category
    const { data: storeDetails } = await supabase.from("stores").select("subscription_plan").eq("id", store.id).single();
    if (storeDetails?.subscription_plan) {
      const { data: plan } = await supabase.from("plans").select("category_limit").ilike("name", storeDetails.subscription_plan).single();
      if (plan && plan.category_limit !== -1) {
        const { count } = await supabase.from("categories").select("id", { count: "exact", head: true }).eq("store_id", store.id);
        if (count !== null && count >= plan.category_limit) {
          return { success: false, error: "You have reached the category limit for your current plan. Please upgrade to add more categories." };
        }
      }
    }

    res = await supabase.from("categories").insert(categoryData).select().single();
  }

  if (res.error) return { success: false, error: res.error.message };

  revalidatePath("/seller/categories");
  return { success: true, id: res.data.id };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  // Note: category_id will be set to NULL on products due to ON DELETE SET NULL in schema
  const { error } = await supabase.from("categories").delete().eq("id", id).eq("store_id", store.id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/categories");
  return { success: true };
}
