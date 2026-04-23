import { useParams } from "react-router-dom";
import { Image as ImageIcon, Printer, Truck, XCircle, MessageCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { orders, orderTimeline, formatNGN } from "@/lib/mock-data";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const itemsTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0) || order.total;
  const shipping = order.shipping === "Delivery" ? 5000 : 0;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">#{order.orderNumber}</h1>
          <StatusBadge status={order.status} />
          <span className="text-sm text-muted-foreground">· {order.date}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Customer Information</h2>
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{order.customerName}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{order.email}</dd></div>
                <div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{order.phone}</dd></div>
                <div><dt className="text-muted-foreground">Address</dt><dd className="font-medium">{order.address ?? "—"}</dd></div>
              </dl>
            </Card>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {(order.items.length ? order.items : [{ productId: "—", name: "Sample item", variant: "Default", qty: 1, price: order.total }]).map((it, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-muted-foreground">{it.variant} · Qty {it.qty}</div>
                    </div>
                    <div className="font-medium">{formatNGN(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-6">Order Timeline</h2>
              <OrderTimeline steps={orderTimeline} />
              <Separator className="my-6" />
              <div>
                <Textarea placeholder="Add a note..." rows={3} />
                <Button className="mt-3">Add to Timeline</Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNGN(itemsTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : formatNGN(shipping)}</span></div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Total</span><span className="text-primary">{formatNGN(order.total)}</span>
              </div>
            </Card>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Order Actions</h2>
              <div className="space-y-2">
                <Button className="w-full gap-2"><Truck className="h-4 w-4" /> Mark as Shipped</Button>
                <Button variant="outline" className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="h-4 w-4" /> Cancel Order
                </Button>
                <Button variant="outline" className="w-full gap-2"><Printer className="h-4 w-4" /> Print Order</Button>
                <Button variant="outline" className="w-full gap-2"><MessageCircle className="h-4 w-4" /> Send WhatsApp Message</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
