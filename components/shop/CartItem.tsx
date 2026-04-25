"use client";

import { Image as ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function CartItem({
  id, name, variantLabel, price, qty, image
}: { id: string; name: string; variantLabel: string; price: number; qty: number; image?: string }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-border/60 last:border-b-0">
      <div className="h-20 w-20 rounded-2xl bg-tile-mist flex-shrink-0 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-6 w-6 text-foreground/20" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium truncate text-sm">{name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{variantLabel}</div>
          </div>
          <button 
            onClick={() => removeItem(id)}
            className="h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center bg-muted rounded-full p-0.5">
            <button 
              onClick={() => updateQuantity(id, Math.max(1, qty - 1))}
              className="h-7 w-7 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-medium w-6 text-center">{qty}</span>
            <button 
              onClick={() => updateQuantity(id, qty + 1)}
              className="h-7 w-7 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="text-sm font-semibold">{formatNGN(price * qty)}</div>
        </div>
      </div>
    </div>
  );
}
