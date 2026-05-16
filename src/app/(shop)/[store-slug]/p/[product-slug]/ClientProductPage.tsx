"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Image as ImageIcon,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  ShoppingBag,
} from "lucide-react";
import { StoreNavbar } from "@/components/storefront/StoreNavbar";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const formatNGN = (amount: number) => {
  return `₦${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

export function ClientProductPage({
  store,
  product,
  similarProducts,
}: {
  store: any;
  product: any;
  similarProducts: any[];
}) {
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const variants = product.variants || [];
  const [selected, setSelected] = useState<Record<string, string>>(
    variants.reduce((acc: any, v: any) => {
      const firstVal = v.values?.[0];
      const valStr =
        typeof firstVal === "object" && firstVal !== null
          ? firstVal.value
          : firstVal;
      return { ...acc, [v.type]: valStr };
    }, {}),
  );

  const { addItem, updateQuantity, items: cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  // Compute effective price = base price + sum of selected variant modifiers
  const effectivePrice = variants.reduce((total: number, v: any) => {
    const selectedVal = selected[v.type];
    const matchedValue = v.values?.find((item: any) => {
      const val = typeof item === "object" && item !== null ? item.value : item;
      return val === selectedVal;
    });
    const modifier =
      typeof matchedValue === "object" && matchedValue !== null
        ? (matchedValue.modifier || 0)
        : 0;
    return total + modifier;
  }, product.price as number);

  const maxQty = product.stock_quantity ?? Infinity;
  const images = product.images || [];

  const handleAddToCart = () => {
    if (qty > maxQty) {
      toast.error(`Only ${maxQty} unit(s) available.`);
      return;
    }
    setAdding(true);
    const variantLabel = Object.entries(selected)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const cartItemId = `${product.id}-${variantLabel}`;

    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      variantLabel,
      price: effectivePrice, // ← variant-adjusted price
      qty,
      image: images[0] || "",
      storeId: store.id,
    });

    toast.success("Added to cart");
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />
      <div className="container py-6">
        <Link
          href={`/${store.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="mt-5 grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
          <div className="space-y-3">
            <div className="relative aspect-square rounded-[28px] bg-tile-mint flex items-center justify-center overflow-hidden">
              {images[activeImageIndex] ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
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
                      "relative aspect-square rounded-2xl flex items-center justify-center cursor-pointer border transition-colors overflow-hidden",
                      activeImageIndex === i
                        ? "border-ink border-2"
                        : "border-transparent hover:border-foreground/20 bg-tile-mist",
                    )}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 25vw, 15vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:pt-3">
            {product.brand && (
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {product.brand}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-foreground text-foreground"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9 Reviews</span>
            </div>
            <div className="mt-5 inline-flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                {formatNGN(effectivePrice)}
              </span>
              {/* Show base price struck-through when a variant modifier is active */}
              {effectivePrice !== product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatNGN(product.price)}
                </span>
              )}
              {/* Show compare_at_price struck-through only when no modifier changes the price */}
              {effectivePrice === product.price && product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatNGN(product.compare_at_price)}
                </span>
              )}
            </div>
            <div className="space-y-5 mt-7">
              {variants.map((v: any) => (
                <div key={v.type}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {v.type}
                    </div>
                    <div className="text-xs text-foreground">
                      {selected[v.type]}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {v.values.map((item: any, i: number) => {
                      const val =
                        typeof item === "object" && item !== null
                          ? item.value
                          : item;
                      const modifier =
                        typeof item === "object" && item !== null
                          ? (item.modifier || 0)
                          : 0;
                      const isSel = selected[v.type] === val;
                      return (
                        <button
                          key={val || i}
                          onClick={() =>
                            setSelected({ ...selected, [v.type]: val })
                          }
                          className={cn(
                            "h-10 px-4 rounded-full border text-sm font-medium transition-all flex items-center gap-1.5",
                            isSel
                              ? "bg-ink text-ink-foreground border-ink"
                              : "bg-background text-foreground border-border hover:border-foreground/30",
                          )}
                        >
                          {val}
                          {modifier !== 0 && (
                            <span className={cn(
                              "text-[10px] font-semibold",
                              isSel ? "text-ink-foreground/70" : "text-muted-foreground"
                            )}>
                              {modifier > 0 ? `+${formatNGN(modifier)}` : formatNGN(modifier)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-7 w-full">
              <div className="inline-flex items-center bg-muted rounded-full p-1 h-12 sm:h-12 w-auto justify-between shrink-0 border border-border/50">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:bg-muted/80 transition-colors"
                >
                  <Minus className="h-4 w-4 text-foreground/70" />
                </button>
                <span className="px-1 text-sm font-medium w-8 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(maxQty, qty + 1))}
                  disabled={qty >= maxQty}
                  className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 text-foreground/70" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 w-full h-12 rounded-full text-base font-semibold"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to cart"}
              </Button>
            </div>
            {typeof maxQty === "number" && maxQty <= 5 && maxQty > 0 && (
              <p className="text-xs text-amber-600 font-medium mt-2">
                ⚡ Only {maxQty} left in stock!
              </p>
            )}
            <Accordion
              type="single"
              collapsible
              className="mt-6"
              defaultValue="desc"
            >
              <AccordionItem
                value="desc"
                className="border-b-0 border-t border-border/60"
              >
                <AccordionTrigger className="text-sm hover:no-underline">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {product.description || "No description provided."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="ship"
                className="border-b-0 border-t border-border/60"
              >
                <AccordionTrigger className="text-sm hover:no-underline">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Delivery depends on store's fulfillment policy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-border/60 pt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                More from this store
              </h2>
              <Link
                href={`/${store.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              {similarProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  compact
                  index={i}
                  storeSlug={store.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
