"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreNavbar } from "@/components/storefront/StoreNavbar";
import { OrderTimeline } from "@/components/storefront/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type Status } from "@/components/storefront/StatusBadge";
import { Search, Package, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatNGN = (amount: number) =>
  `₦${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

function buildTimeline(order: any) {
  const steps: any[] = [];

  steps.push({
    label: "Order placed",
    timestamp: new Date(order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    state: "complete",
  });

  if (order.status !== "pending" && order.status !== "cancelled") {
    steps.push({
      label: "Order processing",
      timestamp: new Date(order.updated_at || order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === "shipped" || order.status === "delivered") {
    steps.push({
      label: "Order shipped",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: order.status === "shipped" ? "active" : "complete",
    });
  }

  if (order.status === "delivered") {
    steps.push({
      label: "Order delivered",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === "cancelled") {
    steps.push({
      label: "Order cancelled",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === "returned") {
    steps.push({
      label: "Order returned",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  return steps;
}

export function ClientTrackingPage({
  store,
  order,
  searchedOrderNumber,
}: {
  store: any;
  order: any | null;
  searchedOrderNumber?: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState(searchedOrderNumber || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/${store.slug}/track?order=${input.trim().toUpperCase()}`);
  };

  const timelineSteps = order ? buildTimeline(order) : [];
  const shipping = parseFloat(order?.shipping_fee) || 0;

  const statusLabel = (s: string): Status =>
    (({ pending: "Pending", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", returned: "Returned" } as Record<string, Status>)[s] ?? "Pending");

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />

      <main className="container max-w-2xl py-10 px-4">
        <Link
          href={`/${store.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>

        <div className="mb-8">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Order Status</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Track Your Order</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enter your order number (e.g. SL-100001) to track your delivery.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SL-100001"
              className="pl-10 rounded-2xl h-12 text-sm font-mono uppercase"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-2xl">
            Track
          </Button>
        </form>

        {/* Not found message */}
        {searchedOrderNumber && !order && (
          <div className="rounded-[20px] border border-border/60 bg-background p-10 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold">Order not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              We couldn't find order <span className="font-mono font-semibold">{searchedOrderNumber}</span>. Please double-check the number and try again.
            </p>
          </div>
        )}

        {/* Order found */}
        {order && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header card */}
            <div className="rounded-[20px] border border-border/60 bg-background p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-muted-foreground">Order number</div>
                  <div className="font-mono font-bold text-xl mt-0.5">{order.order_number}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Placed {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <StatusBadge status={statusLabel(order.status)} />
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-[20px] border border-border/60 bg-background p-6">
              <h2 className="font-semibold text-sm mb-5">Delivery Progress</h2>
              <OrderTimeline steps={timelineSteps} />
            </div>

            {/* Items */}
            <div className="rounded-[20px] border border-border/60 bg-background p-6">
              <h2 className="font-semibold text-sm mb-4">Items Ordered</h2>
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.product_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.variant_label || "Default"} · Qty {item.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold shrink-0">{formatNGN(item.total_price)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{formatNGN(order.subtotal_amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span><span>{shipping === 0 ? "Free" : formatNGN(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span><span>{formatNGN(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            {order.shipping_method === "delivery" && order.shipping_address && (
              <div className="rounded-[20px] border border-border/60 bg-background p-6">
                <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</h2>
                <p className="text-sm text-muted-foreground">{order.shipping_address}, {order.shipping_city}, {order.shipping_state}</p>
              </div>
            )}

            {/* Payment */}
            <div className="rounded-[20px] border border-border/60 bg-background p-6">
              <h2 className="font-semibold text-sm mb-2 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : "Bank Transfer"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
