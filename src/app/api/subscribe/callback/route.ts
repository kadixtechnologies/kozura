import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=No reference provided`);
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Paystack Verification Error:", data);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Verification failed`);
    }

    const txData = data.data;

    // Check if the transaction was successful
    if (txData.status !== "success") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Transaction was not successful`);
    }

    // Extract metadata from the Paystack-verified transaction
    const { storeId, planId, userId } = txData.metadata || {};

    if (!storeId || !planId || !userId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Missing metadata in transaction`);
    }

    // Whitelist valid plan values to prevent arbitrary plan injection
    const validPlans = ["starter", "hustle", "boss"];
    if (!validPlans.includes(planId.toLowerCase())) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Invalid plan`);
    }

    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // CRITICAL: verify the storeId from metadata actually belongs to the userId from metadata.
    // This prevents an attacker from forging metadata to upgrade a different store.
    const { data: ownerCheck } = await supabaseAdmin
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("seller_id", userId)
      .single();

    if (!ownerCheck) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Store ownership verification failed`);
    }

    const { error: updateError } = await supabaseAdmin
      .from("stores")
      .update({ subscription_plan: planId.toLowerCase(), plan_status: "active" })
      .eq("id", storeId);

    if (updateError) {
      console.error("Failed to update store plan:", updateError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Failed to update plan`);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?success=Plan upgraded successfully`);
  } catch (error: any) {
    console.error("Subscription callback error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/seller/settings?error=Internal server error`);
  }
}
