import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId } = body; // 'starter', 'hustle', 'boss'

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the store to pass metadata if needed, but email is required by Paystack
    const { data: store } = await supabase
      .from("stores")
      .select("id, slug")
      .eq("seller_id", user.id)
      .single();

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Determine Paystack Plan Code and Amount based on planId
    let planCode = "";
    let planAmount = 0; // in kobo

    switch (planId.toLowerCase()) {
      case "starter":
        planCode = process.env.PAYSTACK_STARTER_PLAN || "";
        planAmount = 2500 * 100;
        break;
      case "hustle":
        planCode = process.env.PAYSTACK_HUSTLE_PLAN || "";
        planAmount = 6500 * 100;
        break;
      case "boss":
        planCode = process.env.PAYSTACK_BOSS_PLAN || "";
        planAmount = 15000 * 100;
        break;
      default:
        return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    if (!planCode) {
      return NextResponse.json({ error: "Plan configuration missing" }, { status: 500 });
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/subscribe/callback`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: planAmount,
        plan: planCode,
        callback_url: callbackUrl,
        metadata: {
          storeId: store.id,
          planId: planId,
          userId: user.id
        }
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Paystack API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error: any) {
    console.error("Subscription init error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
