"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendNewStoreNotification } from "@/lib/email/send";

export async function completeOnboarding(formData: FormData) {
  const storeName = formData.get("storeName") as string;
  const category = formData.get("category") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const bankName = formData.get("bankName") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const accountName = formData.get("accountName") as string;
  const logoFile = formData.get("logoFile") as File | null;
  const primaryColor = formData.get("primaryColor") as string;
  
  if (!storeName || !category || !whatsappNumber) {
    return { success: false, error: "Missing required fields" };
  }

  const slug = storeName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Ensure profile exists (fix for users who authenticated before the DB trigger was added)
  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
    role: 'seller'
  }, { onConflict: 'id' });

  if (profileError) {
    console.error("Profile creation error:", profileError);
    // Continue anyway, it might just be an RLS or permission issue, let the store insert try
  }

  // Check if phone number is already in use
  const { data: existingPhone } = await supabaseAdmin
    .from("stores")
    .select("id")
    .eq("whatsapp_number", whatsappNumber)
    .maybeSingle();

  if (existingPhone) {
    return { success: false, error: "This phone number is already in use by another store." };
  }

  // Insert store
  const { data: store, error } = await supabase.from("stores").insert({
    seller_id: user.id,
    name: storeName,
    slug: slug,
    category: category as any,
    whatsapp_number: whatsappNumber,
    bank_name: bankName,
    account_number: accountNumber,
    account_name: accountName,
    primary_color: primaryColor || '#16a34a',
    is_active: true,
    subscription_plan: 'free',
  }).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Upload logo if provided
  let logoUrl = null;
  if (logoFile && store) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${store.id}/logo/${fileName}`;

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('store-assets')
      .upload(filePath, logoFile, { cacheControl: '3600', upsert: false });

    if (!uploadError && data) {
      const { data: publicUrlData } = supabaseAdmin.storage.from('store-assets').getPublicUrl(data.path);
      logoUrl = publicUrlData.publicUrl;
      await supabaseAdmin.from("stores").update({ logo_url: logoUrl }).eq("id", store.id);
    }
  }

  // Send admin notification
  await sendNewStoreNotification({
    storeName,
    ownerName: user.user_metadata?.full_name || user.email?.split('@')[0] || "Unknown",
    ownerEmail: user.email || "No email"
  });

  // The DB defaults handle shipping_config and accepts_cod/accepts_bank_transfer
  return { success: true };
}
