import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { 
  sendSubscriptionUpgrade, 
  sendPaymentFailedWarning, 
  sendSubscriptionCancelled 
} from "@/lib/email/send";

// We need a helper to get the store ID from the email
async function getStoreIdByEmail(supabaseAdmin: any, email: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) return null;

  const { data: store } = await supabaseAdmin
    .from("stores")
    .select("id")
    .eq("seller_id", profile.id)
    .single();

  return store?.id || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== req.headers.get("x-paystack-signature")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(body);

    // Initialize Supabase Admin Client to bypass RLS for webhooks
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to get storeId from metadata first, fallback to email lookup
    let storeId = event.data.metadata?.storeId;
    if (!storeId && event.data.customer?.email) {
      storeId = await getStoreIdByEmail(supabaseAdmin, event.data.customer.email);
    }

    if (!storeId) {
      console.error("Store not found for webhook event:", event.event);
      // We still return 200 to acknowledge receipt to Paystack
      return new NextResponse("OK", { status: 200 });
    }

    switch (event.event) {
      case "subscription.create": {
        // Seller subscribed — upgrade their plan in Supabase
        // Paystack returns the plan name as configured on their dashboard (e.g., "Starter Plan")
        // Map it to our internal lowercase IDs ('starter', 'hustle', 'boss')
        let planId = event.data.metadata?.planId;
        
        if (!planId) {
          const planName = (event.data.plan?.name || "").toLowerCase();
          if (planName.includes("starter")) planId = "starter";
          else if (planName.includes("hustle")) planId = "hustle";
          else if (planName.includes("boss")) planId = "boss";
          else planId = "starter"; // fallback
        }

        const { data: storeData } = await supabaseAdmin
          .from("stores")
          .update({
            subscription_plan: planId,
            plan_status: "active",
            subscription_code: event.data.subscription_code,
            next_billing_date: event.data.next_payment_date,
            grace_period_ends: null,
          })
          .eq("id", storeId)
          .select("name, seller_id")
          .single();

        if (storeData) {
          const { data: profile } = await supabaseAdmin.from("profiles").select("email").eq("id", storeData.seller_id).single();
          if (profile?.email) {
            await sendSubscriptionUpgrade({
              sellerEmail: profile.email,
              storeName: storeData.name,
              planName: planId.charAt(0).toUpperCase() + planId.slice(1),
              amount: `₦${(event.data.amount / 100).toLocaleString()}`,
              nextBillingDate: new Date(event.data.next_payment_date).toLocaleDateString()
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        // Payment failed — start grace period
        const graceEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const { data: storeData } = await supabaseAdmin
          .from("stores")
          .update({
            plan_status: "grace_period",
            grace_period_ends: graceEnd,
          })
          .eq("id", storeId)
          .select("name, seller_id")
          .single();
          
        if (storeData) {
          const { data: profile } = await supabaseAdmin.from("profiles").select("email").eq("id", storeData.seller_id).single();
          if (profile?.email) {
            await sendPaymentFailedWarning({
              sellerEmail: profile.email,
              storeName: storeData.name,
              daysRemaining: 7,
              gracePeriodEnds: new Date(graceEnd).toLocaleDateString()
            });
          }
        }
        break;
      }

      case "subscription.disable": {
        // Subscription cancelled — downgrade to free
        const { data: storeData } = await supabaseAdmin
          .from("stores")
          .update({
            subscription_plan: "free",
            plan_status: "inactive",
            subscription_code: null,
            grace_period_ends: null,
          })
          .eq("id", storeId)
          .select("name, seller_id")
          .single();

        if (storeData) {
          const { data: profile } = await supabaseAdmin.from("profiles").select("email").eq("id", storeData.seller_id).single();
          if (profile?.email) {
            await sendSubscriptionCancelled({
              sellerEmail: profile.email,
              storeName: storeData.name
            });
          }
        }
        break;
      }

      case "charge.success": {
        // Successful renewal — reset billing date
        await supabaseAdmin
          .from("stores")
          .update({
            plan_status: "active",
            next_billing_date: event.data.next_payment_date || null,
            grace_period_ends: null,
          })
          .eq("id", storeId);
        break;
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
