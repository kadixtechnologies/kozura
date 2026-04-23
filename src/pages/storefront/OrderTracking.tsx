import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderTimeline, orders, formatNGN } from "@/lib/mock-data";

export default function OrderTracking() {
  const order = orders[0];
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">#{order.orderNumber}</h1>
          <StatusBadge status={order.status} />
        </div>

        <Card className="p-6 rounded-lg mt-6">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{it.qty}× {it.name} <span className="text-muted-foreground">({it.variant})</span></span>
                <span className="font-medium">{formatNGN(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-primary">{formatNGN(order.total)}</span>
          </div>
        </Card>

        <Card className="p-6 rounded-lg mt-6">
          <h2 className="font-semibold mb-6">Order Status</h2>
          <OrderTimeline steps={orderTimeline} />
        </Card>
      </div>
    </div>
  );
}
