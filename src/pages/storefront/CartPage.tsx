import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { CartItem } from "@/components/shop/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartItems, formatNGN, store } from "@/lib/mock-data";

export default function CartPage() {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar />
      <div className="container py-8 max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">Cart</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Your bag</h1>
        <p className="text-sm text-muted-foreground mt-1">{cartItems.length} items ready to check out</p>

        <div className="rounded-[24px] bg-background border border-border/60 mt-6 p-6">
          {cartItems.map((it) => <CartItem key={it.id} {...it} />)}
          <Separator className="my-5" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-2xl font-semibold tracking-tight">{formatNGN(subtotal)}</span>
          </div>
          <Button asChild size="lg" className="w-full mt-5 gap-2">
            <Link to={`/${store.slug}/checkout`}>Proceed to checkout <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
