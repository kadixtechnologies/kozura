"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowLeft, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreNavbar } from "@/components/shop/StoreNavbar";

export function ClientOrderConfirmationPage({ store, order }: { store: any; order?: any }) {
  const storeSlug = store.slug;
  const orderNumber = order?.order_number ?? "";

  const generateWhatsAppMessage = () => {
    let message = `*New Order: ${orderNumber}*\n`;
    message += `*Store:* ${store.name}\n\n`;
    if (order) {
      message += `*Customer Details:*\n`;
      message += `Name: ${order.customer_name}\n`;
      message += `Phone: ${order.customer_phone || "N/A"}\n`;
      if (order.shipping_method === "delivery") {
        message += `Address: ${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}\n`;
      }
      message += `\n*Order Items:*\n`;
      order.order_items?.forEach((item: any) => {
        message += `- ${item.quantity}x ${item.product_name} (${item.variant_label || "Default"}) : NGN ${item.total_price}\n`;
      });
      message += `\n*Summary:*\n`;
      message += `Subtotal: NGN ${order.subtotal_amount}\n`;
      message += `Delivery Fee: ${order.shipping_fee === 0 ? "Free" : `NGN ${order.shipping_fee}`}\n`;
      message += `*Total Amount: NGN ${order.total_amount}*\n\n`;
      message += `*Payment Method:* ${order.payment_method === "cash_on_delivery" ? "Cash on Delivery" : "Bank Transfer"}\n`;
    }
    message += `\nPlease confirm my order. Thank you!`;
    return `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />
      <main className="container max-w-3xl py-12 px-4">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-soft text-success mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-2">
            Your order <span className="font-semibold text-foreground">#{orderNumber}</span> has been placed successfully.
          </p>
          <p className="text-sm text-muted-foreground mb-8">Save your order number to track your delivery.</p>
        </div>

        <div className="grid gap-5">
          {/* Tracking card */}
          <div className="rounded-[20px] border border-border/60 bg-background p-6 flex items-center justify-between gap-4 flex-wrap animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <div>
              <div className="text-xs text-muted-foreground">Your order number</div>
              <div className="font-mono font-bold text-2xl mt-0.5">{orderNumber}</div>
              <div className="text-xs text-muted-foreground mt-1">Use this to track your package</div>
            </div>
            <Link href={`/${storeSlug}/track?order=${orderNumber}`}>
              <Button variant="outline" className="gap-2 rounded-xl">
                <MapPin className="w-4 h-4" /> Track Order
              </Button>
            </Link>
          </div>

          {/* WhatsApp CTA */}
          <div className="shell p-8 text-center bg-ink text-ink-foreground shadow-xl shadow-ink/10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            <h3 className="text-xl font-semibold mb-2">Finalize on WhatsApp</h3>
            <p className="text-ink-foreground/70 text-sm mb-6 max-w-sm mx-auto">
              To complete your purchase and arrange delivery, please message us on WhatsApp.
            </p>
            <Button size="lg" className="w-full sm:w-auto bg-success hover:bg-success/90 text-white gap-2 h-14 px-8 text-lg rounded-2xl transition-all hover:scale-105 active:scale-95" asChild>
              <a href={generateWhatsAppMessage()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6" /> Message Store
              </a>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
            <div className="shell p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
              <div><h4 className="text-sm font-semibold">Fast Delivery</h4><p className="text-xs text-muted-foreground mt-1">Expect your items within 2-5 business days after confirmation.</p></div>
            </div>
            <div className="shell p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></div>
              <div><h4 className="text-sm font-semibold">Secure</h4><p className="text-xs text-muted-foreground mt-1">Your details are protected with bank-grade security.</p></div>
            </div>
          </div>

          <div className="text-center pt-4 animate-in fade-in duration-1000 delay-700 fill-mode-both">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href={`/${storeSlug}`} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Store</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
