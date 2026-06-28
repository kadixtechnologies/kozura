"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/hooks/useCart";

export function StoreNavbar({ store }: { store: any }) {
  const [cartOpen, setCartOpen] = useState(false);
  const allItems = useCart(state => state.items);
  const cartItems = allItems.filter(i => i.storeId === store.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href={`/${store.slug}`} className="flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2.5">
          {store.logo_url ? (
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-xl overflow-hidden shrink-0">
              <Image src={store.logo_url} alt={store.name} fill sizes="32px" className="object-cover" />
            </div>
          ) : (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-xs sm:text-sm font-semibold">
              {store.name.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-xs sm:text-sm tracking-tight min-w-0 truncate">{store.name}</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/${store.slug}/track`}
            className="inline-flex items-center justify-center h-8 sm:h-10 px-2.5 sm:px-4 rounded-full bg-success text-success-foreground hover:bg-success/90 transition-colors text-xs sm:text-sm font-medium"
          >
            Track Order
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-1.5 sm:gap-2 h-8 sm:h-10 pl-2.5 pr-3 sm:pl-3 sm:pr-4 rounded-full bg-ink text-ink-foreground hover:bg-ink/90 transition-colors text-xs sm:text-sm font-medium"
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Cart
            {mounted && cartItems.length > 0 && (
              <span className="ml-0.5 inline-flex h-4 sm:h-5 min-w-4 sm:min-w-5 items-center justify-center rounded-full bg-background text-foreground px-1 text-[10px] sm:text-[11px] font-semibold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} store={store} />
    </header>
  );
}
