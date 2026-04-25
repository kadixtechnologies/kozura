"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { CartItem } from "@/components/shop/CartItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function ClientCartPage({ store }: { store: any }) {
  const allItems = useCart(state => state.items);
  const cartItems = allItems.filter(i => i.storeId === store.id);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />
      <div className="container py-8 max-w-3xl">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">Cart</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Your bag</h1>
        
        {cartItems.length === 0 ? (
          <div className="mt-6 rounded-[24px] bg-background border border-border/60 p-12 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link href={`/${store.slug}`}>Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mt-1">{cartItems.length} items ready to check out</p>
            <div className="rounded-[24px] bg-background border border-border/60 mt-6 p-6">
              {cartItems.map((it) => <CartItem key={it.id} {...it} />)}
              <Separator className="my-5" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-2xl font-semibold tracking-tight">{formatNGN(subtotal)}</span>
              </div>
              <Button asChild size="lg" className="w-full mt-5 gap-2">
                <Link href={`/${store.slug}/checkout`}>Proceed to checkout <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
