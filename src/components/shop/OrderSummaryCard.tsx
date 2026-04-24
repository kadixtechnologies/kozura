import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartItems, formatNGN } from "@/lib/mock-data";

export function OrderSummaryCard({ shippingFee = 5000 }: { shippingFee?: number }) {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + shippingFee;
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
      <Button size="lg" className="w-full mt-6 gap-2">
        Place order
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="mt-3 text-[11px] text-muted-foreground text-center">By placing an order, you agree to our terms.</p>
    </div>
  );
}
