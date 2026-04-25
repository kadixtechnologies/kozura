"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function OrderSummaryCard({ 
  shippingFee = 5000, 
  isPlaceOrderDisabled = false,
  onPlaceOrder,
  store
}: { 
  shippingFee?: number,
  isPlaceOrderDisabled?: boolean,
  onPlaceOrder?: () => void,
  store?: any
}) {
  const params = useParams();
  const storeSlug = params?.["store-slug"];
  const router = useRouter();
  
  const allItems = useCart(state => state.items);
  const cartItems = store ? allItems.filter(i => i.storeId === store.id) : [];
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    if (onPlaceOrder) {
      onPlaceOrder();
    } else {
      router.push(`/${storeSlug}/order-confirmation`);
    }
  };

  return (
    <div className="rounded-[24px] bg-background border border-border/60 p-6 sticky top-24">
      <h3 className="font-semibold text-base">Order summary</h3>
      <div className="mt-5 space-y-3">
        {cartItems.map((it) => (
          <div key={it.id} className="flex justify-between text-sm">
            <span className="flex-1 truncate pr-2 text-muted-foreground">
              <span className="font-medium text-foreground">{it.qty}×</span> {it.name}
            </span>
            <span className="font-medium">{formatNGN(it.price * it.qty)}</span>
          </div>
        ))}
      </div>
      <Separator className="my-5" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNGN(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingFee === 0 ? "Free" : formatNGN(shippingFee)}</span></div>
      </div>
      <Separator className="my-5" />
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-2xl font-semibold tracking-tight">{formatNGN(total)}</span>
      </div>
      <Button 
        size="lg" 
        className="w-full mt-6 gap-2"
        onClick={handlePlaceOrder}
        disabled={isPlaceOrderDisabled || cartItems.length === 0}
      >
        Place order
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-[11px] text-muted-foreground text-center">By placing an order, you agree to our terms.</p>
    </div>
  );
}
