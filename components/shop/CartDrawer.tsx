"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { useCart } from "@/hooks/useCart";

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function CartDrawer({ open, onOpenChange, store }: { open: boolean; onOpenChange: (o: boolean) => void, store: any }) {
  const allItems = useCart(state => state.items);
  const cartItems = allItems.filter(i => i.storeId === store.id);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-canvas">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-4 w-4" />
            Your cart
            <span className="ml-1 text-xs font-medium text-muted-foreground">({cartItems.length})</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <ShoppingBag className="h-12 w-12 opacity-20" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Continue shopping</Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id} {...item} />
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t border-border/60 p-6 space-y-4 bg-background">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatNGN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
            </div>
            <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
              <Link href={`/${store.slug}/checkout`}>Checkout · {formatNGN(subtotal)}</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
