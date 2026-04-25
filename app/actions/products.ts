"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string) || 0;
  const categoryId = formData.get("categoryId") as string;
  const isPublished = formData.get("isPublished") === "true";
  const variants = JSON.parse(formData.get("variants") as string || "[]");
  const images = JSON.parse(formData.get("images") as string || "[]");
  const brand = formData.get("brand") as string | null;

  if (!name || price <= 0) return { success: false, error: "Name and a valid price are required" };

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

  const productData = {
    store_id: store.id,
    name,
    description,
    price,
    compare_at_price: compareAtPrice,
    stock_quantity: stockQuantity,
    category_id: categoryId && categoryId !== "all" ? categoryId : null,
    is_published: isPublished,
    variants,
    images,
    brand
  };

  let res;
  if (id) {
    res = await supabase.from("products").update(productData).eq("id", id).eq("store_id", store.id);
  } else {
    // Check plan limits before inserting a new product
    const { data: storeDetails } = await supabase.from("stores").select("subscription_plan").eq("id", store.id).single();
    if (storeDetails?.subscription_plan) {
      const { data: plan } = await supabase.from("plans").select("product_limit").eq("id", storeDetails.subscription_plan).single();
      if (plan && plan.product_limit !== -1) {
        const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id);
        if (count !== null && count >= plan.product_limit) {
          return { success: false, error: "You have reached the product limit for your current plan. Please upgrade to add more products." };
        }
      }
    }

    res = await supabase.from("products").insert({ ...productData, slug });
  }

  if (res.error) return { success: false, error: res.error.message };

  revalidatePath("/seller/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: store } = await supabase.from("stores").select("id").eq("seller_id", user.id).single();
  if (!store) return { success: false, error: "Store not found" };

  const { error } = await supabase.from("products").delete().eq("id", id).eq("store_id", store.id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/products");
  return { success: true };
}
