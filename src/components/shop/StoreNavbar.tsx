import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { cartItems, store } from "@/lib/mock-data";

export function StoreNavbar() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 w-full bg-background/90 backdrop-blur border-b">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link to={`/${store.slug}`} className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-semibold">
            {store.name.charAt(0)}
          </div>
          <span className="font-semibold text-[15px] tracking-tight">{store.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9"><Search className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="h-4 w-4" />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
