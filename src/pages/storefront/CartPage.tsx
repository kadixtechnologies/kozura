import { Link } from "react-router-dom";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { CartItem } from "@/components/shop/CartItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cartItems, formatNGN, store } from "@/lib/mock-data";

export default function CartPage() {
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">Your Cart ({cartItems.length} items)</h1>
        <Card className="mt-6 p-6 rounded-xl shadow-sm">
          {cartItems.map((it) => <CartItem key={it.id} {...it} />)}
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span className="text-primary">{formatNGN(subtotal)}</span>
          </div>
          <Button asChild size="lg" className="w-full mt-6">
            <Link to={`/${store.slug}/checkout`}>Proceed to Checkout</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
