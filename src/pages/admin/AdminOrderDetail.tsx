import { Link, useParams } from "react-router-dom";
import { Image as ImageIcon, Printer, Truck, XCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { orders, orderTimeline, formatNGN } from "@/lib/mock-data";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const itemsTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0) || order.total;
  const shipping = order.shipping === "Delivery" ? 5000 : 0;

  return (
    <AdminLayout>
      <AdminTopBar
        count={`#${order.orderNumber}`}
        title="Order detail"
        subtitle={order.date}
        action={<StatusBadge status={order.status} />}
      />

      <div className="p-7">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 space-y-5">
            <Panel title="Customer information">
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-xs text-muted-foreground">Name</dt><dd className="font-medium mt-0.5">{order.customerName}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="font-medium mt-0.5">{order.email}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="font-medium mt-0.5">{order.phone}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Address</dt><dd className="font-medium mt-0.5">{order.address ?? "—"}</dd></div>
              </dl>
            </Panel>

            <Panel title="Order items">
              <div className="space-y-3">
                {(order.items.length ? order.items : [{ productId: "—", name: "Sample item", variant: "Default", qty: 1, price: order.total }]).map((it, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-border/60 last:border-0">
                    <div className="h-12 w-12 rounded-xl bg-tile-mint flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-foreground/30" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{it.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{it.variant} · Qty {it.qty}</div>
                    </div>
                    <div className="font-medium text-sm">{formatNGN(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Order timeline">
              <OrderTimeline steps={orderTimeline} />
              <Separator className="my-6" />
              <Textarea placeholder="Add a note..." rows={3} className="rounded-2xl resize-none" />
              <Button className="mt-3" size="sm">Add to timeline</Button>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Order summary">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNGN(itemsTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatNGN(shipping)}</span></div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-semibold tracking-tight">{formatNGN(order.total)}</span>
              </div>
            </Panel>

            <Panel title="Order actions">
              <div className="space-y-2">
                <Button className="w-full gap-2"><Truck className="h-4 w-4" /> Mark as shipped</Button>
                <Button variant="outline" className="w-full gap-2"><Printer className="h-4 w-4" /> Print order</Button>
                <Button variant="outline" className="w-full gap-2"><MessageCircle className="h-4 w-4" /> Send WhatsApp</Button>
                <Button variant="outline" className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="h-4 w-4" /> Cancel order
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
