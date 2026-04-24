import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Heart } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { cartItems, store } from "@/lib/mock-data";

export function StoreNavbar() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link to={`/${store.slug}`} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold">
            {store.name.charAt(0)}
          </div>
          <span className="font-semibold text-[15px] tracking-tight">{store.name}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-muted/70 rounded-full p-1">
          {["Shop", "New", "Brands", "About"].map((l, i) => (
            <Link
              key={l}
              to={`/${store.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Heart className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 h-10 pl-3 pr-4 rounded-full bg-ink text-ink-foreground hover:bg-ink/90 transition-colors text-sm font-medium"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {cartItems.length > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background text-foreground px-1.5 text-[11px] font-semibold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
