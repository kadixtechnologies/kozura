import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartItems, formatNGN } from "@/lib/mock-data";

export function OrderSummaryCard({ shippingFee = 5000 }: { shippingFee?: number }) {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + shippingFee;
  return (
    <Card className="p-6 rounded-lg sticky top-20">
      <h3 className="font-semibold text-lg">Order Summary</h3>
      <div className="mt-4 space-y-3">
        {cartItems.map((it) => (
          <div key={it.id} className="flex justify-between text-sm">
            <span className="flex-1 truncate pr-2">
              <span className="font-medium">{it.qty}×</span> {it.name}
            </span>
            <span className="font-medium">{formatNGN(it.price * it.qty)}</span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNGN(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingFee === 0 ? "FREE" : formatNGN(shippingFee)}</span></div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span><span className="text-primary">{formatNGN(total)}</span>
      </div>
      <Button size="lg" className="w-full mt-6 gap-2">
        <MessageCircle className="h-5 w-5" />
        Place Order on WhatsApp
      </Button>
    </Card>
  );
}
