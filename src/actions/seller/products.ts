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
  let variants = [];
  let images: string[] = [];
  try {
    variants = JSON.parse(formData.get("variants") as string || "[]");
    images = JSON.parse(formData.get("images") as string || "[]");
  } catch {
    return { success: false, error: "Invalid product data format." };
  }
  const brand = formData.get("brand") as string | null;

  if (!name || price <= 0) return { success: false, error: "Name and a valid price are required" };

  // Verify categoryId belongs to this seller's store (prevents cross-store category injection)
  let validatedCategoryId: string | null = null;
  if (categoryId && categoryId !== "all") {
    const { data: cat } = await supabase.from("categories").select("id").eq("id", categoryId).eq("store_id", store.id).single();
    if (!cat) return { success: false, error: "Invalid category." };
    validatedCategoryId = categoryId;
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

  const productData = {
    store_id: store.id,
    name,
    description,
    price,
    compare_at_price: compareAtPrice,
    stock_quantity: stockQuantity,
    category_id: validatedCategoryId,
    is_published: isPublished,
    variants,
    images,
    brand
  };

  // Check plan limits (image limit for both insert/update, product limit only for insert)
  const { data: storeDetails } = await supabase.from("stores").select("subscription_plan").eq("id", store.id).single();
  if (storeDetails?.subscription_plan) {
    const { data: plan } = await supabase.from("plans").select("product_limit, image_limit").ilike("name", storeDetails.subscription_plan).single();
    if (plan) {
      if (plan.image_limit !== -1 && images.length > plan.image_limit) {
        return { success: false, error: `You can only upload up to ${plan.image_limit} images per product on your current plan.` };
      }
      
      if (!id && plan.product_limit !== -1) {
        const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id);
        if (count !== null && count >= plan.product_limit) {
          return { success: false, error: "You have reached the product limit for your current plan. Please upgrade to add more products." };
        }
      }
    }
  }

  let res;
  if (id) {
    res = await supabase.from("products").update(productData).eq("id", id).eq("store_id", store.id);
  } else {
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
