import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { orderTimeline, orders, formatNGN, store } from "@/lib/mock-data";

export default function OrderTracking() {
  const order = orders[0];
  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar />
      <div className="container py-8 max-w-3xl">
        <div className="rounded-[24px] bg-tile-mint p-7">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
            <Check className="h-5 w-5 text-foreground" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Order confirmed</h1>
          <p className="text-sm text-foreground/70 mt-1">Thanks! We'll keep you posted as your order ships.</p>
          <div className="flex items-center gap-3 mt-5">
            <div className="text-sm">
              <span className="text-foreground/60">Order</span> <span className="font-semibold">#{order.orderNumber}</span>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="rounded-[24px] bg-background border border-border/60 p-6 sm:p-7 mt-5">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{it.qty}× {it.name} <span className="text-muted-foreground/60">· {it.variant}</span></span>
                <span className="font-medium">{formatNGN(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-5" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total paid</span>
            <span className="text-2xl font-semibold tracking-tight">{formatNGN(order.total)}</span>
          </div>
        </div>

        <div className="rounded-[24px] bg-background border border-border/60 p-6 sm:p-7 mt-5">
          <h2 className="font-semibold mb-6">Order status</h2>
          <OrderTimeline steps={orderTimeline} />
        </div>

        <Button asChild variant="outline" className="mt-6">
          <Link to={`/${store.slug}`}>Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
