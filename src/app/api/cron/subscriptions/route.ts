import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPaymentFailedWarning, sendSubscriptionCancelled } from "@/lib/email/send";

// This should be called daily by Vercel Cron or another scheduler
export async function GET(req: Request) {
  // Simple auth to ensure only the cron job can call this
  // Vercel Cron sends a Bearer token we can check if CRON_SECRET is set
  // Always require CRON_SECRET — fail safely if the env var is not set
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all stores currently in grace period
    const { data: stores, error } = await supabaseAdmin
      .from("stores")
      .select("id, name, seller_id, grace_period_ends")
      .eq("plan_status", "grace_period")
      .not("grace_period_ends", "is", null);

    if (error || !stores) {
      throw new Error(error?.message || "Failed to fetch stores in grace period");
    }

    const now = new Date();
    
    // We need to fetch profiles for emails
    const sellerIds = stores.map(s => s.seller_id);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .in("id", sellerIds);

    const emailMap = new Map((profiles || []).map(p => [p.id, p.email]));

    for (const store of stores) {
      const graceEnd = new Date(store.grace_period_ends);
      const sellerEmail = emailMap.get(store.seller_id);
      
      if (!sellerEmail) continue;

      const diffTime = graceEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        // Grace period ended. Downgrade to free.
        await supabaseAdmin
          .from("stores")
          .update({
            subscription_plan: "free",
            plan_status: "inactive",
            subscription_code: null,
            grace_period_ends: null,
          })
          .eq("id", store.id);

        await sendSubscriptionCancelled({
          sellerEmail,
          storeName: store.name,
        });

      } else if (diffDays === 3 || diffDays === 1) {
        // Send reminders at 3 days and 1 day remaining
        await sendPaymentFailedWarning({
          sellerEmail,
          storeName: store.name,
          daysRemaining: diffDays,
          gracePeriodEnds: graceEnd.toLocaleDateString(),
        });
      }
    }

    return NextResponse.json({ success: true, processed: stores.length });
  } catch (error) {
    console.error("Subscription cron error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
