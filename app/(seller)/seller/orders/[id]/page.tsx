import Link from "next/link";
import { Image as ImageIcon, FileText, Download, ArrowLeft } from "lucide-react";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { orderTimeline, formatNGN } from "@/lib/mock-data";
import { OrderActions } from "@/components/shop/OrderActions";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch real order and items
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    console.error("Order fetch error:", error);
    notFound();
  }

  const itemsTotal = order.subtotal_amount || 0;
  const shipping = parseFloat(order.shipping_fee) || 0;
  
  // Fetch product images for order items
  const productIds = order.order_items.map((item: any) => item.product_id).filter(Boolean);
  let productImages: Record<string, string> = {};
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, images, image")
      .in("id", productIds);
    if (products) {
      products.forEach((p: any) => {
        if (p.images?.[0]) {
          productImages[p.id] = p.images[0];
        } else if (p.image) {
          productImages[p.id] = p.image;
        }
      });
    }
  }
  
  // Format date
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
  });

  // Generate dynamic timeline based on order status
  const timelineSteps: any[] = [];
  
  timelineSteps.push({
    label: "Order placed",
    timestamp: new Date(order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    state: "complete",
  });

  if (order.status !== 'pending' && order.status !== 'cancelled') {
    timelineSteps.push({
      label: "Order processing",
      timestamp: new Date(order.updated_at || order.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === 'shipped' || order.status === 'delivered') {
    timelineSteps.push({
      label: "Order shipped",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === 'delivered') {
    timelineSteps.push({
      label: "Order delivered",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  if (order.status === 'cancelled') {
    timelineSteps.push({
      label: "Order cancelled",
      timestamp: new Date(order.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      state: "complete",
    });
  }

  return (
    <SellerLayout>
      <SellerTopBar
        count={order.order_number}
        title="Order detail"
        subtitle={orderDate}
        action={<StatusBadge status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} />}
      />

      <div className="p-7">
        <Link href="/seller/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors print:hidden">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 space-y-5">
            <Panel title="Customer information">
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-xs text-muted-foreground">Name</dt><dd className="font-medium mt-0.5">{order.customer_name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="font-medium mt-0.5">{order.customer_email}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="font-medium mt-0.5">{order.customer_phone || "—"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Address</dt><dd className="font-medium mt-0.5">{order.shipping_address ? `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}` : "—"}</dd></div>
              </dl>
            </Panel>

            <Panel title="Order items">
              <div className="space-y-3">
                {order.order_items.map((it: any) => (
                  <div key={it.id} className="flex items-center gap-3 py-3 border-b border-border/60 last:border-0">
                    <div className="h-12 w-12 rounded-xl bg-tile-mint flex items-center justify-center overflow-hidden shrink-0">
                      {productImages[it.product_id] ? (
                        <img src={productImages[it.product_id]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{it.product_name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{it.variant_label || "Default"} · Qty {it.quantity}</div>
                    </div>
                    <div className="font-medium text-sm">{formatNGN(it.total_price)}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Order timeline">
              <OrderTimeline steps={timelineSteps} />
              <div className="print:hidden">
                <Separator className="my-6" />
                <Textarea placeholder="Add a note..." rows={3} className="rounded-2xl resize-none" />
                <Button className="mt-3" size="sm">Add to timeline</Button>
              </div>
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
                <span className="text-xl font-semibold tracking-tight">{formatNGN(order.total_amount)}</span>
              </div>
            </Panel>
            
            <div className="print:hidden">
              <Panel title="Payment receipt">
                {order.payment_receipt_url ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/30">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-sm font-medium truncate">Payment Receipt</div>
                      <div className="text-xs text-muted-foreground mt-0.5">View attached file</div>
                    </div>
                    <Link href={order.payment_receipt_url} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full shrink-0">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">No receipt uploaded</div>
                )}
              </Panel>
            </div>

            <div className="print:hidden">
              <Panel title="Order actions">
                <OrderActions orderId={id} currentStatus={order.status.toLowerCase()} />
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
