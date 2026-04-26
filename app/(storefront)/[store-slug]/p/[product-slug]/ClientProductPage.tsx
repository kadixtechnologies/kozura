"use client";

import { useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Minus, Plus, ArrowLeft, Star, ShoppingBag } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const formatNGN = (amount: number) => {
  return `₦${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

export function ClientProductPage({ store, product, similarProducts }: { store: any; product: any; similarProducts: any[] }) {
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const variants = product.variants || [];
  const [selected, setSelected] = useState<Record<string, string>>(
    variants.reduce((acc: any, v: any) => {
      const firstVal = v.values?.[0];
      const valStr = typeof firstVal === "object" && firstVal !== null ? firstVal.value : firstVal;
      return { ...acc, [v.type]: valStr };
    }, {}),
  );
  
  const { addItem, updateQuantity, items: cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  const images = product.images || [];

  const handleAddToCart = () => {
    setAdding(true);
    const variantLabel = Object.entries(selected).map(([k, v]) => `${k}: ${v}`).join(", ");
    const cartItemId = `${product.id}-${variantLabel}`;

    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      variantLabel,
      price: product.price,
      qty,
      image: images[0] || "",
      storeId: store.id
    });

    toast.success("Added to cart");
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />
      <div className="container py-6">
        <Link href={`/${store.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="mt-5 grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
          <div className="space-y-3">
            <div className="relative aspect-square rounded-[28px] bg-tile-mint flex items-center justify-center overflow-hidden">
              {images[activeImageIndex] ? (
                <img src={images[activeImageIndex]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-24 w-24 text-foreground/15" />
              )}
              {product.brand && (
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-medium">
                  {product.brand}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      "aspect-square rounded-2xl flex items-center justify-center cursor-pointer border transition-colors overflow-hidden",
                      activeImageIndex === i ? "border-ink border-2" : "border-transparent hover:border-foreground/20 bg-tile-mist"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:pt-3">
            {product.brand && <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{product.brand}</div>}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">{[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />)}</div>
              <span className="text-sm text-muted-foreground">4.9 Reviews</span>
            </div>
            <div className="mt-5 inline-flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">{formatNGN(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">{formatNGN(product.compare_at_price)}</span>
              )}
            </div>
            <div className="space-y-5 mt-7">
              {variants.map((v: any) => (
                <div key={v.type}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{v.type}</div>
                    <div className="text-xs text-foreground">{selected[v.type]}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {v.values.map((item: any, i: number) => {
                      const val = typeof item === "object" && item !== null ? item.value : item;
                      const isSel = selected[v.type] === val;
                      return (<button key={val || i} onClick={() => setSelected({ ...selected, [v.type]: val })} className={cn("h-10 px-4 rounded-full border text-sm font-medium transition-all", isSel ? "bg-ink text-ink-foreground border-ink" : "bg-background text-foreground border-border hover:border-foreground/30")}>{val}</button>);
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-7">
              <div className="inline-flex items-center bg-muted rounded-full p-1.5 sm:p-1 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 sm:h-9 sm:w-9 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors"><Minus className="h-4 w-4 sm:h-3.5 sm:w-3.5" /></button>
                <span className="px-4 text-base sm:text-sm font-medium w-14 sm:w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-11 w-11 sm:h-9 sm:w-9 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors"><Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" /></button>
              </div>
              <Button size="lg" className="flex-1 w-full h-14 sm:h-12 text-base sm:text-sm" onClick={handleAddToCart} disabled={adding}>
                {adding ? "Adding..." : "Add to cart"}
              </Button>
            </div>
            <Accordion type="single" collapsible className="mt-6" defaultValue="desc">
              <AccordionItem value="desc" className="border-b-0 border-t border-border/60">
                <AccordionTrigger className="text-sm hover:no-underline">Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{product.description || "No description provided."}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship" className="border-b-0 border-t border-border/60">
                <AccordionTrigger className="text-sm hover:no-underline">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">Delivery depends on store's fulfillment policy.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-border/60 pt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">More from this store</h2>
              <Link href={`/${store.slug}`} className="text-sm text-muted-foreground hover:text-foreground">See all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              {similarProducts.map((p, i) => <ProductCard key={p.id} product={p} compact index={i} storeSlug={store.slug} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
